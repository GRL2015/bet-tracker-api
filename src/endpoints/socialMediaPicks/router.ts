import { Hono } from "hono";
import { fromHono } from "chanfana";
import { SocialMediaPickList } from "./socialMediaPickList";
import { SocialMediaPickCreate } from "./socialMediaPickCreate";
import { SocialMediaPickRead } from "./socialMediaPickRead";
import { SocialMediaPickUpdate } from "./socialMediaPickUpdate";
import { SocialMediaPickDelete } from "./socialMediaPickDelete";

export const socialMediaPicksRouter = fromHono(new Hono());

socialMediaPicksRouter.get("/", SocialMediaPickList);
socialMediaPicksRouter.post("/", SocialMediaPickCreate);
socialMediaPicksRouter.get("/:id", SocialMediaPickRead);
socialMediaPicksRouter.put("/:id", SocialMediaPickUpdate);
socialMediaPicksRouter.delete("/:id", SocialMediaPickDelete);
