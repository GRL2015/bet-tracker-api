import { z } from "zod";

export const socialMediaPick = z.object({
	id: z.number().int(),
	source_id: z.number().int(),
	platform: z.string(),
	author_handle: z.string(),
	content: z.string(),
	pick_type: z.string(),
	sport: z.string(),
	event_description: z.string(),
	predicted_outcome: z.string(),
	confidence: z.number().min(0).max(1),
	posted_at: z.string().datetime(),
	is_verified: z.boolean(),
	outcome_correct: z.boolean().nullable(),
	resolved_at: z.string().datetime().nullable(),
	created_at: z.string().datetime(),
});

export const SocialMediaPickModel = {
	tableName: "social_media_picks",
	primaryKeys: ["id"],
	schema: socialMediaPick,
	serializer: (obj: Record<string, string | number | boolean | null>) => {
		return {
			...obj,
			is_verified: Boolean(obj.is_verified),
			outcome_correct:
				obj.outcome_correct === null ? null : Boolean(obj.outcome_correct),
		};
	},
	serializerObject: socialMediaPick,
};
