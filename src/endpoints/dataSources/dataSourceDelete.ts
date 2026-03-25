import { D1DeleteEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { DataSourceModel } from "./base";

export class DataSourceDelete extends D1DeleteEndpoint<HandleArgs> {
	_meta = {
		model: DataSourceModel,
	};
}
