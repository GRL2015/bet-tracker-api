import { contentJson, OpenAPIRoute } from "chanfana";
import { AppContext } from "../../types";
import { z } from "zod";

const sourceContributionInput = z.object({
	source_id: z.number().int().describe("ID of the data source"),
	signal_value: z
		.number()
		.min(-100)
		.max(100)
		.describe("Signal value from this source (-100 to 100)"),
	raw_data: z
		.string()
		.optional()
		.default("{}")
		.describe("Raw JSON data from the source"),
});

function computeRecommendation(score: number): string {
	if (score <= -60) return "strong_against";
	if (score <= -20) return "lean_against";
	if (score < 20) return "neutral";
	if (score < 60) return "lean_bet";
	return "strong_bet";
}

export class ComputeScore extends OpenAPIRoute {
	public schema = {
		tags: ["Betting Analyses"],
		summary:
			"Compute a composite betting score from multiple source signals using accuracy-weighted ranking",
		operationId: "compute-betting-score",
		request: {
			body: contentJson(
				z.object({
					sport: z.string().describe("Sport type (e.g. nfl, nba, mlb)"),
					event_description: z
						.string()
						.describe("Description of the betting event"),
					event_date: z
						.string()
						.datetime()
						.describe("Date/time of the event"),
					contributions: z
						.array(sourceContributionInput)
						.min(1)
						.describe("Array of source signal contributions"),
					notes: z.string().optional().default(""),
				}),
			),
		},
		responses: {
			"200": {
				description: "Returns the computed composite score and recommendation",
				...contentJson({
					success: Boolean,
					result: z.object({
						analysis_id: z.number().int(),
						sport: z.string(),
						event_description: z.string(),
						event_date: z.string(),
						final_score: z.number(),
						recommendation: z.string(),
						confidence: z.number(),
						contributing_sources_count: z.number().int(),
						breakdown: z.object({
							contributions: z.array(
								z.object({
									source_id: z.number().int(),
									source_name: z.string(),
									accuracy_rank: z.number().int(),
									source_weight: z.number(),
									effective_weight: z.number(),
									signal_value: z.number(),
									weighted_score: z.number(),
								}),
							),
							total_effective_weight: z.number(),
							algorithm: z.string(),
						}),
						notes: z.string(),
					}),
				}),
			},
		},
	};

	public async handle(c: AppContext) {
		const data = await this.getValidatedData<typeof this.schema>();
		const { sport, event_description, event_date, contributions, notes } =
			data.body;
		const db = c.env.DB;

		// Look up all contributing sources and their accuracy data
		const sourceIds = contributions.map((c) => c.source_id);
		const placeholders = sourceIds.map(() => "?").join(",");
		const sources = await db
			.prepare(
				`SELECT id, name, accuracy_rank, weight, is_active, is_verified FROM data_sources WHERE id IN (${placeholders})`,
			)
			.bind(...sourceIds)
			.all<{
				id: number;
				name: string;
				accuracy_rank: number;
				weight: number;
				is_active: number;
				is_verified: number;
			}>();

		const sourceMap = new Map(
			(sources.results || []).map((s) => [s.id, s]),
		);

		// Compute weighted scores
		let totalEffectiveWeight = 0;
		let totalWeightedSignal = 0;
		const breakdownContributions: Array<{
			source_id: number;
			source_name: string;
			accuracy_rank: number;
			source_weight: number;
			effective_weight: number;
			signal_value: number;
			weighted_score: number;
		}> = [];

		for (const contribution of contributions) {
			const source = sourceMap.get(contribution.source_id);
			if (!source) continue;
			if (!source.is_active) continue;

			// Effective weight = (accuracy_rank / 100) * weight
			// This ensures higher accuracy sources contribute more
			const effectiveWeight = (source.accuracy_rank / 100) * source.weight;
			const weightedScore = contribution.signal_value * effectiveWeight;

			totalEffectiveWeight += effectiveWeight;
			totalWeightedSignal += weightedScore;

			breakdownContributions.push({
				source_id: source.id,
				source_name: source.name,
				accuracy_rank: source.accuracy_rank,
				source_weight: source.weight,
				effective_weight: Math.round(effectiveWeight * 1000) / 1000,
				signal_value: contribution.signal_value,
				weighted_score: Math.round(weightedScore * 1000) / 1000,
			});
		}

		// Final score: weighted average of all signals
		const finalScore =
			totalEffectiveWeight > 0
				? Math.round((totalWeightedSignal / totalEffectiveWeight) * 100) / 100
				: 0;

		// Confidence: average effective weight (0 to 1 scale)
		const confidence =
			breakdownContributions.length > 0
				? Math.round(
						(totalEffectiveWeight / breakdownContributions.length) * 1000,
					) / 1000
				: 0;

		const recommendation = computeRecommendation(finalScore);

		const breakdown = JSON.stringify({
			contributions: breakdownContributions,
			total_effective_weight:
				Math.round(totalEffectiveWeight * 1000) / 1000,
			algorithm:
				"weighted_average: final_score = sum(signal * (accuracy_rank/100) * weight) / sum((accuracy_rank/100) * weight)",
		});

		// Persist the analysis
		const insertResult = await db
			.prepare(
				`INSERT INTO betting_analyses (sport, event_description, event_date, final_score, recommendation, confidence, contributing_sources_count, breakdown, notes)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			)
			.bind(
				sport,
				event_description,
				event_date,
				finalScore,
				recommendation,
				confidence,
				breakdownContributions.length,
				breakdown,
				notes || "",
			)
			.run();

		const analysisId = insertResult.meta.last_row_id;

		// Persist individual contributions
		for (const contribution of contributions) {
			const bd = breakdownContributions.find(
				(b) => b.source_id === contribution.source_id,
			);
			if (!bd) continue;

			await db
				.prepare(
					`INSERT INTO analysis_source_contributions (analysis_id, source_id, signal_value, weight_applied, weighted_score, raw_data)
					 VALUES (?, ?, ?, ?, ?, ?)`,
				)
				.bind(
					analysisId,
					contribution.source_id,
					contribution.signal_value,
					bd.effective_weight,
					bd.weighted_score,
					contribution.raw_data || "{}",
				)
				.run();
		}

		return {
			success: true,
			result: {
				analysis_id: analysisId,
				sport,
				event_description,
				event_date,
				final_score: finalScore,
				recommendation,
				confidence,
				contributing_sources_count: breakdownContributions.length,
				breakdown: {
					contributions: breakdownContributions,
					total_effective_weight:
						Math.round(totalEffectiveWeight * 1000) / 1000,
					algorithm:
						"weighted_average: final_score = sum(signal * (accuracy_rank/100) * weight) / sum((accuracy_rank/100) * weight)",
				},
				notes: notes || "",
			},
		};
	}
}
