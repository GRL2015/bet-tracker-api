import { z } from "zod";

export const dataSource = z.object({
	id: z.number().int(),
	name: z.string(),
	type: z.string(),
	url: z.string(),
	description: z.string(),
	accuracy_rank: z.number().int().min(0).max(100),
	weight: z.number().min(0).max(1),
	is_active: z.boolean(),
	is_verified: z.boolean(),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime(),
});

export const DataSourceModel = {
	tableName: "data_sources",
	primaryKeys: ["id"],
	schema: dataSource,
	serializer: (obj: Record<string, string | number | boolean>) => {
		return {
			...obj,
			is_active: Boolean(obj.is_active),
			is_verified: Boolean(obj.is_verified),
		};
	},
	serializerObject: dataSource,
};
