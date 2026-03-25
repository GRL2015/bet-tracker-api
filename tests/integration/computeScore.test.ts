import { SELF } from "cloudflare:test";
import { beforeEach, describe, expect, it, vi } from "vitest";

async function createDataSource(data: any) {
	const response = await SELF.fetch(`http://local.test/data-sources`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	const body = await response.json<{
		success: boolean;
		result: { id: number };
	}>();
	return body.result.id;
}

describe("Composite Score Computation Tests", () => {
	let oddsSourceId: number;
	let statsSourceId: number;
	let socialSourceId: number;

	beforeEach(async () => {
		vi.clearAllMocks();

		// Create diverse sources with different accuracy ranks and weights
		oddsSourceId = await createDataSource({
			name: "The Odds API",
			type: "odds_api",
			url: "https://the-odds-api.com",
			description: "Real-time odds from bookmakers",
			accuracy_rank: 90,
			weight: 0.9,
			is_active: true,
			is_verified: true,
		});

		statsSourceId = await createDataSource({
			name: "ESPN Stats",
			type: "stats_api",
			url: "https://espn.com/api",
			description: "ESPN sports statistics",
			accuracy_rank: 75,
			weight: 0.8,
			is_active: true,
			is_verified: true,
		});

		socialSourceId = await createDataSource({
			name: "Sharp Bettor Twitter",
			type: "social_media",
			url: "https://twitter.com/sharpbettor",
			description: "Verified sharp bettor",
			accuracy_rank: 65,
			weight: 0.6,
			is_active: true,
			is_verified: true,
		});
	});

	describe("POST /betting-analyses/compute", () => {
		it("should compute a composite score from multiple sources", async () => {
			const response = await SELF.fetch(
				`http://local.test/betting-analyses/compute`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						sport: "nba",
						event_description: "Lakers vs Celtics 2026-03-25",
						event_date: "2026-03-25T20:00:00.000Z",
						contributions: [
							{
								source_id: oddsSourceId,
								signal_value: 70,
								raw_data: '{"line": "-3.5", "odds": -110}',
							},
							{
								source_id: statsSourceId,
								signal_value: 45,
								raw_data: '{"win_pct": 0.65, "ats_record": "32-20"}',
							},
							{
								source_id: socialSourceId,
								signal_value: 80,
								raw_data: '{"tweet": "Lakers -3.5 strong play"}',
							},
						],
						notes: "Strong consensus across sources",
					}),
				},
			);

			const body = await response.json<{ success: boolean; result: any }>();

			expect(response.status).toBe(200);
			expect(body.success).toBe(true);

			const result = body.result;
			expect(result.sport).toBe("nba");
			expect(result.event_description).toBe("Lakers vs Celtics 2026-03-25");
			expect(result.contributing_sources_count).toBe(3);
			expect(result.final_score).toBeGreaterThan(0);
			expect(result.final_score).toBeLessThanOrEqual(100);
			expect(result.confidence).toBeGreaterThan(0);
			expect(result.confidence).toBeLessThanOrEqual(1);
			expect(["strong_bet", "lean_bet", "neutral"]).toContain(
				result.recommendation,
			);
			expect(result.breakdown.contributions).toHaveLength(3);
			expect(result.breakdown.algorithm).toContain("weighted_average");
			expect(result.analysis_id).toBeGreaterThan(0);
		});

		it("should weight higher accuracy sources more heavily", async () => {
			// High accuracy source says bet, low accuracy says don't bet
			const response = await SELF.fetch(
				`http://local.test/betting-analyses/compute`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						sport: "nfl",
						event_description: "Chiefs vs Eagles",
						event_date: "2026-03-26T18:00:00.000Z",
						contributions: [
							{
								source_id: oddsSourceId,
								signal_value: 80,
							},
							{
								source_id: socialSourceId,
								signal_value: -80,
							},
						],
					}),
				},
			);

			const body = await response.json<{ success: boolean; result: any }>();

			expect(response.status).toBe(200);
			// The higher-accuracy source (oddsSourceId: rank 90, weight 0.9) should dominate
			// over the lower-accuracy source (socialSourceId: rank 65, weight 0.6)
			// So final score should be positive
			expect(body.result.final_score).toBeGreaterThan(0);
		});

		it("should return neutral for conflicting equal-weight signals", async () => {
			// Create two identical-rank sources
			const source1 = await createDataSource({
				name: "Source A",
				type: "stats_api",
				url: "https://source-a.com",
				description: "Source A",
				accuracy_rank: 80,
				weight: 0.8,
				is_active: true,
				is_verified: true,
			});

			const source2 = await createDataSource({
				name: "Source B",
				type: "stats_api",
				url: "https://source-b.com",
				description: "Source B",
				accuracy_rank: 80,
				weight: 0.8,
				is_active: true,
				is_verified: true,
			});

			const response = await SELF.fetch(
				`http://local.test/betting-analyses/compute`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						sport: "mlb",
						event_description: "Yankees vs Red Sox",
						event_date: "2026-03-27T19:00:00.000Z",
						contributions: [
							{ source_id: source1, signal_value: 50 },
							{ source_id: source2, signal_value: -50 },
						],
					}),
				},
			);

			const body = await response.json<{ success: boolean; result: any }>();

			expect(response.status).toBe(200);
			// Equal and opposite signals should cancel out to 0
			expect(body.result.final_score).toBe(0);
			expect(body.result.recommendation).toBe("neutral");
		});

		it("should persist the analysis and allow retrieval", async () => {
			const computeResponse = await SELF.fetch(
				`http://local.test/betting-analyses/compute`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						sport: "nba",
						event_description: "Test Persistence",
						event_date: "2026-03-25T20:00:00.000Z",
						contributions: [
							{ source_id: oddsSourceId, signal_value: 60 },
						],
					}),
				},
			);

			const computeBody = await computeResponse.json<{
				success: boolean;
				result: any;
			}>();
			const analysisId = computeBody.result.analysis_id;

			// Retrieve the persisted analysis
			const getResponse = await SELF.fetch(
				`http://local.test/betting-analyses/${analysisId}`,
			);
			const getBody = await getResponse.json<{
				success: boolean;
				result: any;
			}>();

			expect(getResponse.status).toBe(200);
			expect(getBody.result.sport).toBe("nba");
			expect(getBody.result.event_description).toBe("Test Persistence");
		});

		it("should persist source contributions", async () => {
			const computeResponse = await SELF.fetch(
				`http://local.test/betting-analyses/compute`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						sport: "nba",
						event_description: "Test Contributions",
						event_date: "2026-03-25T20:00:00.000Z",
						contributions: [
							{ source_id: oddsSourceId, signal_value: 50 },
							{ source_id: statsSourceId, signal_value: 30 },
						],
					}),
				},
			);

			expect(computeResponse.status).toBe(200);

			// Retrieve the contributions
			const listResponse = await SELF.fetch(
				`http://local.test/analysis-source-contributions`,
			);
			const listBody = await listResponse.json<{
				success: boolean;
				result: any[];
			}>();

			expect(listResponse.status).toBe(200);
			expect(listBody.result.length).toBe(2);
		});
	});

	describe("GET /betting-analyses", () => {
		it("should list all analyses", async () => {
			// Create an analysis first
			await SELF.fetch(`http://local.test/betting-analyses/compute`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					sport: "nba",
					event_description: "Listed Analysis",
					event_date: "2026-03-25T20:00:00.000Z",
					contributions: [
						{ source_id: oddsSourceId, signal_value: 40 },
					],
				}),
			});

			const response = await SELF.fetch(
				`http://local.test/betting-analyses`,
			);
			const body = await response.json<{ success: boolean; result: any[] }>();

			expect(response.status).toBe(200);
			expect(body.result.length).toBeGreaterThanOrEqual(1);
		});
	});

	describe("DELETE /betting-analyses/:id", () => {
		it("should delete an analysis", async () => {
			const computeResponse = await SELF.fetch(
				`http://local.test/betting-analyses/compute`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						sport: "nba",
						event_description: "To Delete",
						event_date: "2026-03-25T20:00:00.000Z",
						contributions: [
							{ source_id: oddsSourceId, signal_value: 20 },
						],
					}),
				},
			);

			const computeBody = await computeResponse.json<{
				success: boolean;
				result: any;
			}>();
			const analysisId = computeBody.result.analysis_id;

			const deleteResponse = await SELF.fetch(
				`http://local.test/betting-analyses/${analysisId}`,
				{ method: "DELETE" },
			);

			expect(deleteResponse.status).toBe(200);

			const getResponse = await SELF.fetch(
				`http://local.test/betting-analyses/${analysisId}`,
			);
			expect(getResponse.status).toBe(404);
		});
	});
});
