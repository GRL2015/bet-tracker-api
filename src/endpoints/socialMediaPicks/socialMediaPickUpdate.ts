import { D1UpdateEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { SocialMediaPickModel } from "./base";

export class SocialMediaPickUpdate extends D1UpdateEndpoint<HandleArgs> {
	_meta = {
		model: SocialMediaPickModel,
		fields: SocialMediaPickModel.schema.pick({
			source_id: true,
			platform: true,
			author_handle: true,
			content: true,
			pick_type: true,
			sport: true,
			event_description: true,
			predicted_outcome: true,
			confidence: true,
			posted_at: true,
			is_verified: true,
			outcome_correct: true,
			resolved_at: true,
		}),
	};
}
