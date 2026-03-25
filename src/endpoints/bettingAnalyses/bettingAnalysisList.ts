import { D1ListEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { BettingAnalysisModel } from "./base";

export class BettingAnalysisList extends D1ListEndpoint<HandleArgs> {
	_meta = {
		model: BettingAnalysisModel,
	};

	searchFields = ["sport", "event_description", "recommendation"];
	defaultOrderBy = "id DESC";
}
