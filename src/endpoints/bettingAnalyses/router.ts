import { Hono } from "hono";
import { fromHono } from "chanfana";
import { BettingAnalysisList } from "./bettingAnalysisList";
import { BettingAnalysisRead } from "./bettingAnalysisRead";
import { BettingAnalysisDelete } from "./bettingAnalysisDelete";
import { ComputeScore } from "./computeScore";

export const bettingAnalysesRouter = fromHono(new Hono());

bettingAnalysesRouter.get("/", BettingAnalysisList);
bettingAnalysesRouter.post("/compute", ComputeScore);
bettingAnalysesRouter.get("/:id", BettingAnalysisRead);
bettingAnalysesRouter.delete("/:id", BettingAnalysisDelete);
