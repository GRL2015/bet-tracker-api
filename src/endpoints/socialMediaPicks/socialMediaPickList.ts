import { D1ListEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { SocialMediaPickModel } from "./base";

export class SocialMediaPickList extends D1ListEndpoint<HandleArgs> {
	_meta = {
		model: SocialMediaPickModel,
	};

	searchFields = [
		"author_handle",
		"platform",
		"sport",
		"event_description",
		"content",
	];
	defaultOrderBy = "id DESC";
}
