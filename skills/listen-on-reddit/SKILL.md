---
name: listen-on-reddit
description: Set up and read GrowFast's Reddit listening: keywords per product, posts from people who need it and drafted replies. The user posts, nothing is posted for them. Use when the user wants to monitor Reddit or find Reddit threads where their product fits.
license: MIT
compatibility: Needs the GrowFast MCP server (https://growfast.sh/api/mcp) connected and signed in, with a GrowFast account.
---

# Listen on Reddit with GrowFast

GrowFast finds Reddit posts where the author needs what a product does and drafts a reply for each. The user posts; GrowFast never posts or sends DMs from here.

If the GrowFast tools are missing or ask for sign-in, tell the user to check that `GROWFAST_API_KEY` is set and the server is enabled in Customize, then MCPs.

## Steps

1. Call `list_reddit_monitors` to see which products are already monitored.
2. To read results, call `list_reddit_matches` with the `product` domain (and `status`: new, replied or dismissed). Show the post title, subreddit and drafted reply, best first.
3. To set up or change listening, collect `productDomain`, `productName`, `productPitch` (one sentence) and `keywords` (up to 6, comma-separated). `set_reddit_monitor` replaces that product's existing monitor settings: if one exists, say so and wait for a clear yes first. Then call it and confirm what it will listen for.
4. Before the user posts a drafted reply: read the thread, follow the subreddit's rules, and say you made the product. Posting is done by the user from https://growfast.sh. Do not promise that a reply will bring customers.
