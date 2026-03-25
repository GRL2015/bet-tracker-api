import { D1ReadEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { SourceAccuracyLogModel } from "./base";

export class SourceAccuracyLogRead extends D1ReadEndpoint<HandleArgs> {
	_meta = {
		model: SourceAccuracyLogModel,
	};
}
