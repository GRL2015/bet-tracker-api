import { Hono } from "hono";
import { fromHono } from "chanfana";
import { AnalysisSourceContributionList } from "./analysisSourceContributionList";
import { AnalysisSourceContributionRead } from "./analysisSourceContributionRead";

export const analysisSourceContributionsRouter = fromHono(new Hono());

analysisSourceContributionsRouter.get("/", AnalysisSourceContributionList);
analysisSourceContributionsRouter.get("/:id", AnalysisSourceContributionRead);
