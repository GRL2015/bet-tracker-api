import { D1DeleteEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { SocialMediaPickModel } from "./base";

export class SocialMediaPickDelete extends D1DeleteEndpoint<HandleArgs> {
	_meta = {
		model: SocialMediaPickModel,
	};
}
