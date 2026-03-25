import { ApiException, fromHono } from "chanfana";
import { Hono } from "hono";
import { tasksRouter } from "./endpoints/tasks/router";
import { dataSourcesRouter } from "./endpoints/dataSources/router";
import { socialMediaPicksRouter } from "./endpoints/socialMediaPicks/router";
import { sourceAccuracyLogsRouter } from "./endpoints/sourceAccuracyLogs/router";
import { bettingAnalysesRouter } from "./endpoints/bettingAnalyses/router";
import { analysisSourceContributionsRouter } from "./endpoints/analysisSourceContributions/router";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { DummyEndpoint } from "./endpoints/dummyEndpoint";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

app.onError((err, c) => {
	if (err instanceof ApiException) {
		// If it's a Chanfana ApiException, let Chanfana handle the response
		return c.json(
			{ success: false, errors: err.buildResponse() },
			err.status as ContentfulStatusCode,
		);
	}

	console.error("Global error handler caught:", err); // Log the error if it's not known

	// For other errors, return a generic 500 response
	return c.json(
		{
			success: false,
			errors: [{ code: 7000, message: "Internal Server Error" }],
		},
		500,
	);
});

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
	schema: {
		info: {
			title: "Bet Tracker API",
			version: "2.0.0",
			description:
				"Sports betting intelligence API that aggregates data from multiple ranked sources (odds APIs, stats APIs, social media verified creators) and computes accuracy-weighted composite scores for betting decisions.",
		},
	},
});

// Register Tasks Sub router
openapi.route("/tasks", tasksRouter);

// Register Data Sources router
openapi.route("/data-sources", dataSourcesRouter);

// Register Social Media Picks router
openapi.route("/social-media-picks", socialMediaPicksRouter);

// Register Source Accuracy Logs router
openapi.route("/source-accuracy-logs", sourceAccuracyLogsRouter);

// Register Betting Analyses router (includes /compute endpoint)
openapi.route("/betting-analyses", bettingAnalysesRouter);

// Register Analysis Source Contributions router
openapi.route("/analysis-source-contributions", analysisSourceContributionsRouter);

// Register other endpoints
openapi.post("/dummy/:slug", DummyEndpoint);

// Export the Hono app
export default app;
