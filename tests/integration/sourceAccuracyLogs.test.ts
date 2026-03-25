import { SELF } from "cloudflare:test";
import { beforeEach, describe, expect, it, vi } from "vitest";

async function createDataSource(data: any) {
	const response = await SELF.fetch(`http://local.test/data-sources`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	const body = await response.json<{
		success: boolean;
		result: { id: number };
	}>();
	return body.result.id;
}

describe("Source Accuracy Logs API Integration Tests", () => {
	let sourceId: number;

	beforeEach(async () => {
		vi.clearAllMocks();
		sourceId = await createDataSource({
			name: "ESPN Stats API",
			type: "stats_api",
			url: "https://espn.com/api",
			description: "ESPN sports statistics",
			accuracy_rank: 80,
			weight: 0.8,
			is_active: true,
			is_verified: true,
		});
	});

	describe("POST /source-accuracy-logs", () => {
		it("should create an accuracy log entry", async () => {
			const response = await SELF.fetch(
				`http://local.test/source-accuracy-logs`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						source_id: sourceId,
						prediction: "Lakers win by 5+",
						actual_outcome: "Lakers won by 7",
						was_correct: true,
						sport: "nba",
						event_description: "Lakers vs Celtics 2026-03-25",
					}),
				},
			);

			const body = await response.json<{ success: boolean; result: any }>();

			expect(response.status).toBe(201);
			expect(body.success).toBe(true);
			expect(body.result).toEqual(
				expect.objectContaining({
					id: expect.any(Number),
					source_id: sourceId,
					was_correct: true,
					sport: "nba",
				}),
			);
		});
	});

	describe("GET /source-accuracy-logs", () => {
		it("should list accuracy logs", async () => {
			await SELF.fetch(`http://local.test/source-accuracy-logs`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					source_id: sourceId,
					prediction: "Over 220.5",
					actual_outcome: "Total was 215",
					was_correct: false,
					sport: "nba",
					event_description: "Lakers vs Celtics total",
				}),
			});

			const response = await SELF.fetch(
				`http://local.test/source-accuracy-logs`,
			);
			const body = await response.json<{ success: boolean; result: any[] }>();

			expect(response.status).toBe(200);
			expect(body.result.length).toBe(1);
			expect(body.result[0]).toEqual(
				expect.objectContaining({
					was_correct: false,
					sport: "nba",
				}),
			);
		});
	});
});
