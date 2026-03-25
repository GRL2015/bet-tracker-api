# OpenAPI Template

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/chanfana-openapi-template)

![OpenAPI Template Preview](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/91076b39-1f5b-46f6-7f14-536a6f183000/public)

<!-- dash-content-start -->

This is a Cloudflare Worker with OpenAPI 3.1 Auto Generation and Validation using [chanfana](https://github.com/cloudflare/chanfana) and [Hono](https://github.com/honojs/hono).

This is an example project made to be used as a quick start into building OpenAPI compliant Workers that generates the
`openapi.json` schema automatically from code and validates the incoming request to the defined parameters or request body.

This template includes various endpoints, a D1 database, and integration tests using [Vitest](https://vitest.dev/) as examples. In endpoints, you will find [chanfana D1 AutoEndpoints](https://chanfana.com/endpoints/auto/d1) and a [normal endpoint](https://chanfana.com/endpoints/defining-endpoints) to serve as examples for your projects.

Besides being able to see the OpenAPI schema (openapi.json) in the browser, you can also extract the schema locally no hassle by running this command `npm run schema`.

<!-- dash-content-end -->

> [!IMPORTANT]
> When using C3 to create this project, select "no" when it asks if you want to deploy. You need to follow this project's [setup steps](https://github.com/cloudflare/templates/tree/main/openapi-template#setup-steps) before deploying.

## Getting Started

Outside of this repo, you can start a new project with this template using [C3](https://developers.cloudflare.com/pages/get-started/c3/) (the `create-cloudflare` CLI):

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/openapi-template
```

A live public deployment of this template is available at [https://openapi-template.templates.workers.dev](https://openapi-template.templates.workers.dev)

## Setup Steps

1. Install the project dependencies with a package manager of your choice:
   ```bash
   npm install
   ```
2. Create a [D1 database](https://developers.cloudflare.com/d1/get-started/) with the name "openapi-template-db":
   ```bash
   npx wrangler d1 create openapi-template-db
   ```
   ...and update the `database_id` field in `wrangler.json` with the new database ID.
3. Run the following db migration to initialize the database (notice the `migrations` directory in this project):
   ```bash
   npx wrangler d1 migrations apply DB --remote
   ```
4. Deploy the project!
   ```bash
   npx wrangler deploy
   ```
5. Monitor your worker
   ```bash
   npx wrangler tail
   ```

## Testing

This template includes integration tests using [Vitest](https://vitest.dev/). To run the tests locally:

```bash
npm run test
```

Test files are located in the `tests/` directory, with examples demonstrating how to test your endpoints and database interactions.

## Project structure

1. Your main router is defined in `src/index.ts`.
2. Each endpoint has its own file in `src/endpoints/`.
3. Integration tests are located in the `tests/` directory.
4. For more information read the [chanfana documentation](https://chanfana.com/), [Hono documentation](https://hono.dev/docs), and [Vitest documentation](https://vitest.dev/guide/).

## Creating a ChatGPT Custom GPT

This API is ready to be used as an **Action** inside a [ChatGPT custom GPT](https://platform.openai.com/docs/actions). Follow these steps:

### Prerequisites

Deploy the API first (see [Setup Steps](#setup-steps) above) and note your Worker URL (e.g. `https://bet-tracker-api.your-subdomain.workers.dev`).

### Steps

1. **Update the server URL** — Open `src/index.ts` and replace the placeholder in the `servers` array with your actual Worker URL, then regenerate the schema:
   ```bash
   npm run schema
   ```
2. **Open ChatGPT** — Go to [https://chatgpt.com/gpts/editor](https://chatgpt.com/gpts/editor) and create a new GPT.
3. **Set the GPT instructions** — Copy the contents of [`gpt-instructions.md`](./gpt-instructions.md) into the **Instructions** field.
4. **Add the API Action** — In the **Configure** tab, scroll to **Actions** → **Create new action**. Click **Import from URL** and point it at your Worker's live schema endpoint:
   ```
   https://bet-tracker-api.your-subdomain.workers.dev/openapi.json
   ```
   Or paste the contents of the [`openapi.json`](./openapi.json) file directly into the **Schema** editor.
5. **Set Authentication** — If your API is publicly accessible, select **None**. Otherwise, configure the appropriate auth method.
6. **Save and test** — Click **Save** and try asking the GPT to list data sources or compute a betting score.

### Regenerating the OpenAPI Schema

Whenever you change endpoints, regenerate the schema file:

```bash
npm run schema
```

This outputs `openapi.json` in the project root, ready to upload to ChatGPT.
