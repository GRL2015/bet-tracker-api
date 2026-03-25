import { D1UpdateEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { DataSourceModel } from "./base";

export class DataSourceUpdate extends D1UpdateEndpoint<HandleArgs> {
	_meta = {
		model: DataSourceModel,
		fields: DataSourceModel.schema.pick({
			name: true,
			type: true,
			url: true,
			description: true,
			accuracy_rank: true,
			weight: true,
			is_active: true,
			is_verified: true,
		}),
	};
}
