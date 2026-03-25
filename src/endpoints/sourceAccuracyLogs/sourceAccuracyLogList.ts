import { D1ListEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { SourceAccuracyLogModel } from "./base";

export class SourceAccuracyLogList extends D1ListEndpoint<HandleArgs> {
	_meta = {
		model: SourceAccuracyLogModel,
	};

	searchFields = ["prediction", "actual_outcome", "sport", "event_description"];
	defaultOrderBy = "id DESC";
}
