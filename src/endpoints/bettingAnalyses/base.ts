import { z } from "zod";

export const bettingAnalysis = z.object({
	id: z.number().int(),
	sport: z.string(),
	event_description: z.string(),
	event_date: z.string().datetime(),
	final_score: z.number().min(-100).max(100),
	recommendation: z.string(),
	confidence: z.number().min(0).max(1),
	contributing_sources_count: z.number().int(),
	breakdown: z.string(),
	notes: z.string(),
	created_at: z.string().datetime(),
});

export const BettingAnalysisModel = {
	tableName: "betting_analyses",
	primaryKeys: ["id"],
	schema: bettingAnalysis,
	serializerObject: bettingAnalysis,
};
