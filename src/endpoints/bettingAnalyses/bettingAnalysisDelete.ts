import { D1DeleteEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { BettingAnalysisModel } from "./base";

export class BettingAnalysisDelete extends D1DeleteEndpoint<HandleArgs> {
	_meta = {
		model: BettingAnalysisModel,
	};
}
