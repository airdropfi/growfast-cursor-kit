# GrowFast for Cursor and Grok Build

Find B2B customers for your product from Cursor or Grok Build with your own [GrowFast](https://growfast.sh) account: scan a site for ideal customers, draft first emails to named decision-makers and set up Reddit listening. The rule and skills keep the agent to drafts.

## Auth: API key (no OAuth for Cursor)

GrowFast's OAuth sign-in only accepts the redirect addresses of claude.ai, chatgpt.com and local loopback addresses (localhost, 127.0.0.1, [::1]). Cursor's `cursor://` callback is not among them, so in Cursor this kit uses an API key sent as `Authorization: Bearer ...`:

1. In GrowFast open Settings > API keys and create a key (your plan's limits apply to every call).
2. Set it as an environment variable before starting Cursor: `export GROWFAST_API_KEY=your-key-here`.
3. Keep the key out of the repository. Never paste it into a file you commit.

[![Add GrowFast to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/link/mcp/install?name=growfast&config=eyJ1cmwiOiJodHRwczovL2dyb3dmYXN0LnNoL2FwaS9tY3AiLCJoZWFkZXJzIjp7IkF1dGhvcml6YXRpb24iOiJCZWFyZXIgWU9VUl9BUElfS0VZIn19)

The button adds the server with the placeholder `Bearer YOUR_API_KEY`: replace `YOUR_API_KEY` with your key (or with `${env:GROWFAST_API_KEY}`) in Cursor's MCP settings after installing. App link: `cursor://anysphere.cursor-deeplink/mcp/install?name=growfast&config=eyJ1cmwiOiJodHRwczovL2dyb3dmYXN0LnNoL2FwaS9tY3AiLCJoZWFkZXJzIjp7IkF1dGhvcml6YXRpb24iOiJCZWFyZXIgWU9VUl9BUElfS0VZIn19`

## What it contains

| Component | Name | What it does |
|---|---|---|
| MCP server | `growfast` (`https://growfast.sh/api/mcp`) | The GrowFast tools, authenticated with your API key. |
| Rule | `rules/growfast.mdc` | Drafts only, honest limits, confirm before anything that sends mail. |
| Skill | `find-customers` | Scan a product, choose companies, draft first emails. |
| Skill | `listen-on-reddit` | Set up Reddit listening and read matches with drafted replies. |

## Install in Cursor

1. Add this to `~/.cursor/mcp.json` (all projects) or `.cursor/mcp.json` (one project):

   ```json
   {
     "mcpServers": {
       "growfast": {
         "url": "https://growfast.sh/api/mcp",
         "headers": {
           "Authorization": "Bearer ${env:GROWFAST_API_KEY}"
         }
       }
     }
   }
   ```

2. Restart Cursor with `GROWFAST_API_KEY` set. Open Customize, then MCPs: `growfast` should show its tools.
3. Optional, the rule: copy `rules/growfast.mdc` to `.cursor/rules/growfast.mdc`.
4. Optional, the skills: copy the folders in `skills/` to `~/.cursor/skills/`.

Cursor asks you to approve MCP tool calls by default. Leave that on.

## Grok Build

Grok Build loads `.cursor/mcp.json` and `.mcp.json`, so the same server entry (with `GROWFAST_API_KEY` set) applies. We have not tested this kit in Grok Build.

## Important: this connection is the full server

Unlike the Claude and Gemini packages, an API key reaches every GrowFast tool, including `send_reply` (sends a real email reply to a prospect) and `set_autopilot` (turns on a daily job that finds companies and sends real emails). Sent email cannot be undone. The rule tells the agent never to call them unless you explicitly ask, but Cursor cannot hide tools: keep tool-call approval on, and if you only want drafting use the [Claude plugin](https://github.com/airdropfi/growfast-claude-plugin) or the [Gemini extension](https://github.com/airdropfi/growfast-gemini-extension) instead. `find_companies` and `research_company` are pay-per-call tools that appear only when pay-per-call is enabled on the server.

## Limits that exist

- `draft_outreach_emails`: up to 10 companies per call.
- `set_reddit_monitor`: up to 6 keywords; it replaces that product's earlier monitor settings.
- Plan limits apply to every call.

## Data and privacy

The MCP server receives what the tools need: the domains, product details, company lists and keywords you ask your agent to send, and the data on your GrowFast account. This repository stores nothing and runs no code on your machine; it is a server address, Markdown instructions and a logo. See the [privacy policy](https://growfast.sh/legal/privacy) and [terms](https://growfast.sh/legal/terms). Revoke a key any time under Settings > API keys.

## Layout

```text
.cursor-plugin/plugin.json   Cursor Plugin manifest (also read by Grok Build)
mcp.json                     MCP server for Cursor (API key from GROWFAST_API_KEY)
.mcp.json                    the same server for Grok Build and other loaders
rules/growfast.mdc           rule
skills/                      two skills (SKILL.md)
assets/logo.png              1024x1024 logo
examples/prompts.md          example prompts
scripts/validate.mjs         structure checks, no dependencies
```

## Support

support@growfast.sh or https://growfast.sh. Documentation: https://growfast.sh/docs.

## License

MIT for the files in this repository (see `LICENSE`). The GrowFast service is governed by its terms.
