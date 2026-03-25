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

const sampleSource = {
	name: "The Odds API",
	type: "odds_api",
	url: "https://the-odds-api.com",
	description: "Real-time odds from 70+ bookmakers",
	accuracy_rank: 85,
	weight: 0.9,
	is_active: true,
	is_verified: true,
};

describe("Data Sources API Integration Tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("GET /data-sources", () => {
		it("should get an empty list of data sources", async () => {
			const response = await SELF.fetch(`http://local.test/data-sources`);
			const body = await response.json<{ success: boolean; result: any[] }>();

			expect(response.status).toBe(200);
			expect(body.success).toBe(true);
			expect(body.result).toEqual([]);
		});

		it("should get a list with one data source", async () => {
			await createDataSource(sampleSource);

			const response = await SELF.fetch(`http://local.test/data-sources`);
			const body = await response.json<{ success: boolean; result: any[] }>();

			expect(response.status).toBe(200);
			expect(body.success).toBe(true);
			expect(body.result.length).toBe(1);
			expect(body.result[0]).toEqual(
				expect.objectContaining({
					name: "The Odds API",
					type: "odds_api",
					accuracy_rank: 85,
				}),
			);
		});
	});

	describe("POST /data-sources", () => {
		it("should create a new data source successfully", async () => {
			const response = await SELF.fetch(`http://local.test/data-sources`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(sampleSource),
			});

			const body = await response.json<{ success: boolean; result: any }>();

			expect(response.status).toBe(201);
			expect(body.success).toBe(true);
			expect(body.result).toEqual(
				expect.objectContaining({
					id: expect.any(Number),
					name: "The Odds API",
					type: "odds_api",
					accuracy_rank: 85,
					weight: 0.9,
					is_active: true,
					is_verified: true,
				}),
			);
		});

		it("should return 400 for invalid input", async () => {
			const response = await SELF.fetch(`http://local.test/data-sources`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: "Missing fields" }),
			});

			expect(response.status).toBe(400);
		});
	});

	describe("GET /data-sources/:id", () => {
		it("should get a single data source by ID", async () => {
			const id = await createDataSource(sampleSource);

			const response = await SELF.fetch(
				`http://local.test/data-sources/${id}`,
			);
			const body = await response.json<{ success: boolean; result: any }>();

			expect(response.status).toBe(200);
			expect(body.success).toBe(true);
			expect(body.result).toEqual(
				expect.objectContaining({
					id,
					name: "The Odds API",
				}),
			);
		});

		it("should return 404 for non-existent source", async () => {
			const response = await SELF.fetch(
				`http://local.test/data-sources/9999`,
			);

			expect(response.status).toBe(404);
		});
	});

	describe("PUT /data-sources/:id", () => {
		it("should update a data source successfully", async () => {
			const id = await createDataSource(sampleSource);

			const updatedData = {
				...sampleSource,
				name: "Updated Odds API",
				accuracy_rank: 90,
			};

			const response = await SELF.fetch(
				`http://local.test/data-sources/${id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updatedData),
				},
			);
			const body = await response.json<{ success: boolean; result: any }>();

			expect(response.status).toBe(200);
			expect(body.success).toBe(true);
			expect(body.result).toEqual(
				expect.objectContaining({
					id,
					name: "Updated Odds API",
					accuracy_rank: 90,
				}),
			);
		});
	});

	describe("DELETE /data-sources/:id", () => {
		it("should delete a data source successfully", async () => {
			const id = await createDataSource(sampleSource);

			const deleteResponse = await SELF.fetch(
				`http://local.test/data-sources/${id}`,
				{ method: "DELETE" },
			);

			expect(deleteResponse.status).toBe(200);

			const getResponse = await SELF.fetch(
				`http://local.test/data-sources/${id}`,
			);
			expect(getResponse.status).toBe(404);
		});
	});
});
