import { z } from "zod";

export const analysisSourceContribution = z.object({
	id: z.number().int(),
	analysis_id: z.number().int(),
	source_id: z.number().int(),
	signal_value: z.number().min(-100).max(100),
	weight_applied: z.number().min(0).max(1),
	weighted_score: z.number(),
	raw_data: z.string(),
	created_at: z.string().datetime(),
});

export const AnalysisSourceContributionModel = {
	tableName: "analysis_source_contributions",
	primaryKeys: ["id"],
	schema: analysisSourceContribution,
	serializerObject: analysisSourceContribution,
};
