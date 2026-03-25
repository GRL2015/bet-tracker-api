import { D1CreateEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { SourceAccuracyLogModel } from "./base";

export class SourceAccuracyLogCreate extends D1CreateEndpoint<HandleArgs> {
	_meta = {
		model: SourceAccuracyLogModel,
		fields: SourceAccuracyLogModel.schema.pick({
			source_id: true,
			prediction: true,
			actual_outcome: true,
			was_correct: true,
			sport: true,
			event_description: true,
		}),
	};
}
