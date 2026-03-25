import { D1ReadEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { DataSourceModel } from "./base";

export class DataSourceRead extends D1ReadEndpoint<HandleArgs> {
	_meta = {
		model: DataSourceModel,
	};
}
