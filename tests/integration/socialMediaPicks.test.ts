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

async function createSocialMediaPick(data: any) {
	const response = await SELF.fetch(`http://local.test/social-media-picks`, {
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

describe("Social Media Picks API Integration Tests", () => {
	let sourceId: number;

	beforeEach(async () => {
		vi.clearAllMocks();
		sourceId = await createDataSource({
			name: "Sharp Bettor Twitter",
			type: "social_media",
			url: "https://twitter.com/sharpbettor",
			description: "Verified sharp bettor on Twitter/X",
			accuracy_rank: 78,
			weight: 0.7,
			is_active: true,
			is_verified: true,
		});
	});

	const getSamplePick = (sid: number) => ({
		source_id: sid,
		platform: "twitter",
		author_handle: "@sharpbettor",
		content: "Lakers -3.5 tonight, strong play based on injury reports",
		pick_type: "spread",
		sport: "nba",
		event_description: "Lakers vs Celtics 2026-03-25",
		predicted_outcome: "Lakers -3.5",
		confidence: 0.8,
		posted_at: "2026-03-25T12:00:00.000Z",
		is_verified: true,
	});

	describe("GET /social-media-picks", () => {
		it("should get an empty list", async () => {
			const response = await SELF.fetch(
				`http://local.test/social-media-picks`,
			);
			const body = await response.json<{ success: boolean; result: any[] }>();

			expect(response.status).toBe(200);
			expect(body.success).toBe(true);
			expect(body.result).toEqual([]);
		});

		it("should get a list with one pick", async () => {
			await createSocialMediaPick(getSamplePick(sourceId));

			const response = await SELF.fetch(
				`http://local.test/social-media-picks`,
			);
			const body = await response.json<{ success: boolean; result: any[] }>();

			expect(response.status).toBe(200);
			expect(body.result.length).toBe(1);
			expect(body.result[0]).toEqual(
				expect.objectContaining({
					platform: "twitter",
					author_handle: "@sharpbettor",
					sport: "nba",
				}),
			);
		});
	});

	describe("POST /social-media-picks", () => {
		it("should create a new pick successfully", async () => {
			const response = await SELF.fetch(
				`http://local.test/social-media-picks`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(getSamplePick(sourceId)),
				},
			);

			const body = await response.json<{ success: boolean; result: any }>();

			expect(response.status).toBe(201);
			expect(body.success).toBe(true);
			expect(body.result).toEqual(
				expect.objectContaining({
					id: expect.any(Number),
					source_id: sourceId,
					platform: "twitter",
					pick_type: "spread",
					is_verified: true,
				}),
			);
		});
	});

	describe("PUT /social-media-picks/:id", () => {
		it("should update a pick with outcome resolution", async () => {
			const pickId = await createSocialMediaPick(getSamplePick(sourceId));

			const response = await SELF.fetch(
				`http://local.test/social-media-picks/${pickId}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						...getSamplePick(sourceId),
						outcome_correct: true,
						resolved_at: "2026-03-26T03:00:00.000Z",
					}),
				},
			);

			const body = await response.json<{ success: boolean; result: any }>();

			expect(response.status).toBe(200);
			expect(body.result).toEqual(
				expect.objectContaining({
					outcome_correct: true,
					resolved_at: "2026-03-26T03:00:00.000Z",
				}),
			);
		});
	});

	describe("DELETE /social-media-picks/:id", () => {
		it("should delete a pick successfully", async () => {
			const pickId = await createSocialMediaPick(getSamplePick(sourceId));

			const deleteResponse = await SELF.fetch(
				`http://local.test/social-media-picks/${pickId}`,
				{ method: "DELETE" },
			);

			expect(deleteResponse.status).toBe(200);

			const getResponse = await SELF.fetch(
				`http://local.test/social-media-picks/${pickId}`,
			);
			expect(getResponse.status).toBe(404);
		});
	});
});
