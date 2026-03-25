import { D1ListEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { DataSourceModel } from "./base";

export class DataSourceList extends D1ListEndpoint<HandleArgs> {
	_meta = {
		model: DataSourceModel,
	};

	searchFields = ["name", "type", "description"];
	defaultOrderBy = "accuracy_rank DESC";
}
