import { D1ReadEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { BettingAnalysisModel } from "./base";

export class BettingAnalysisRead extends D1ReadEndpoint<HandleArgs> {
	_meta = {
		model: BettingAnalysisModel,
	};
}
