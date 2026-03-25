import { D1ListEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { AnalysisSourceContributionModel } from "./base";

export class AnalysisSourceContributionList extends D1ListEndpoint<HandleArgs> {
	_meta = {
		model: AnalysisSourceContributionModel,
	};

	searchFields = ["raw_data"];
	defaultOrderBy = "id DESC";
}
