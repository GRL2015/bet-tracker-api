import { z } from "zod";

export const sourceAccuracyLog = z.object({
	id: z.number().int(),
	source_id: z.number().int(),
	prediction: z.string(),
	actual_outcome: z.string(),
	was_correct: z.boolean(),
	sport: z.string(),
	event_description: z.string(),
	logged_at: z.string().datetime(),
});

export const SourceAccuracyLogModel = {
	tableName: "source_accuracy_logs",
	primaryKeys: ["id"],
	schema: sourceAccuracyLog,
	serializer: (obj: Record<string, string | number | boolean>) => {
		return {
			...obj,
			was_correct: Boolean(obj.was_correct),
		};
	},
	serializerObject: sourceAccuracyLog,
};
