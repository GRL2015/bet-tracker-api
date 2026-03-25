import { D1ReadEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { AnalysisSourceContributionModel } from "./base";

export class AnalysisSourceContributionRead extends D1ReadEndpoint<HandleArgs> {
	_meta = {
		model: AnalysisSourceContributionModel,
	};
}
