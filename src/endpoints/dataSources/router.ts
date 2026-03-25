import { Hono } from "hono";
import { fromHono } from "chanfana";
import { DataSourceList } from "./dataSourceList";
import { DataSourceCreate } from "./dataSourceCreate";
import { DataSourceRead } from "./dataSourceRead";
import { DataSourceUpdate } from "./dataSourceUpdate";
import { DataSourceDelete } from "./dataSourceDelete";

export const dataSourcesRouter = fromHono(new Hono());

dataSourcesRouter.get("/", DataSourceList);
dataSourcesRouter.post("/", DataSourceCreate);
dataSourcesRouter.get("/:id", DataSourceRead);
dataSourcesRouter.put("/:id", DataSourceUpdate);
dataSourcesRouter.delete("/:id", DataSourceDelete);
