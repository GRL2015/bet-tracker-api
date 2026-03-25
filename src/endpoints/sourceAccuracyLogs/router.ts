import { Hono } from "hono";
import { fromHono } from "chanfana";
import { SourceAccuracyLogList } from "./sourceAccuracyLogList";
import { SourceAccuracyLogCreate } from "./sourceAccuracyLogCreate";
import { SourceAccuracyLogRead } from "./sourceAccuracyLogRead";

export const sourceAccuracyLogsRouter = fromHono(new Hono());

sourceAccuracyLogsRouter.get("/", SourceAccuracyLogList);
sourceAccuracyLogsRouter.post("/", SourceAccuracyLogCreate);
sourceAccuracyLogsRouter.get("/:id", SourceAccuracyLogRead);
