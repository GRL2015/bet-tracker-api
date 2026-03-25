import { D1ReadEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { SocialMediaPickModel } from "./base";

export class SocialMediaPickRead extends D1ReadEndpoint<HandleArgs> {
	_meta = {
		model: SocialMediaPickModel,
	};
}
