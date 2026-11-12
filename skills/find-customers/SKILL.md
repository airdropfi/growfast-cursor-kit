---
name: find-customers
description: Scan a product's website with GrowFast, list the best-fit companies scored 1-10 and draft first emails to named decision-makers. Drafts only. Use when the user wants to find customers, leads or prospects for a product, or draft cold outreach with GrowFast.
license: MIT
compatibility: Needs the GrowFast MCP server (https://growfast.sh/api/mcp) connected and signed in, with a GrowFast account.
---

# Find customers with GrowFast

You turn a product's domain into a short list of fitting companies and drafted first emails. GrowFast never sends from here: the user sends emails from https://growfast.sh.

If the GrowFast tools are missing or ask for sign-in, tell the user to run `/mcp`, pick `growfast` and choose Authenticate. You cannot sign in for them.

## Tools

- `scan_domain`: reads a product's website and returns its ideal customer profile, a first cold email and the best-fit companies scored 1-10. Takes about 30 seconds and saves the scan to the account.
- `draft_outreach_emails`: for up to 10 companies, finds the named decision-maker on each company's own site and writes a first email. Nothing is sent and nothing is saved. Takes 10-60 seconds.
- `set_reddit_monitor`: sets what to listen for on Reddit for one product (domain, name, one-sentence pitch, up to 6 comma-separated keywords). It replaces that product's existing monitor settings.
- `list_reddit_monitors`: the Reddit monitors on the account, one per product.
- `list_reddit_matches`: Reddit posts found for a product (optional `product` and `status` new, replied or dismissed), best first, with a drafted reply.

With an API key the connection exposes the full server; only use the tools named above for this skill.
## Rules that always apply

1. **Drafts only.** Nothing here sends an email, posts to Reddit or sends a DM. You read and edit every draft with the user. Emails and Reddit replies are sent or posted by the user from https://growfast.sh, where sending limits, unsubscribe handling and bounce protection apply. Never say or imply that something was sent or posted.
2. **Use the tools' output.** Company names, contacts, scores, drafts and Reddit posts come from GrowFast. Do not invent companies, contact names or email addresses. A contact address is only valid if a tool returned it or the user gave it.
3. **Know what each call does.** `scan_domain` saves the scan to the user's account. `set_reddit_monitor` replaces that product's earlier monitor settings: say so and get a clear yes before calling it on a product that may already have one (check `list_reddit_monitors` first).
4. **Respect the limits.** `draft_outreach_emails` takes up to 10 companies per call. A Reddit monitor takes up to 6 keywords. Plan limits apply to every call; if a tool answers with a limit, relay it as written.
5. **No outcome claims.** Do not promise replies, customers, revenue or rankings. Say what GrowFast found, not what will happen.
6. **Be honest about fit.** Show the score and the reason GrowFast gave. Offer to skip poor fits; do not pad a list.
7. **Reddit etiquette.** A drafted reply is a starting point. Tell the user to read the thread, follow the subreddit's rules and disclose that they are the maker of the product before posting.
8. **This connection can do more than draft.** With an API key the full server is available, including `send_reply` (sends a real email reply to a prospect) and `set_autopilot` (turns on a daily job that finds companies and sends real emails), plus the pay-per-call tools `find_companies` and `research_company` when pay-per-call is enabled. Never call `send_reply` or `set_autopilot` unless the user explicitly asked for exactly that action in this conversation and confirmed the recipient or settings. Sent email cannot be undone. Default to drafting only.

## Steps

1. **Scan.** Ask for the product's domain if you do not have it. Say that the scan takes about 30 seconds and saves to the account, then call `scan_domain`. Show the ideal customer profile, the first email and the companies as a table: company, score (1-10), reason. Use the numbers and reasons GrowFast returned.
2. **Choose.** Let the user pick the companies they like (at most 10 for one drafting call). Skip any they reject.
3. **Draft.** `draft_outreach_emails` needs the seller (`productName`, `valueProposition`, optionally `icpTitle`, `icpIndustry`; the scan result has them) and, per company, a company name and a contact address the company publishes. Ask the user for any address the scan did not give you. Call it, and show the named decision-maker (when the site names one) with each draft.
4. **Hand off.** Say clearly that nothing was sent and nothing was saved. The user edits the drafts and sends them from https://growfast.sh.
