---
name: entity-fan-out-internal-linking
description: Builds an Entity Fan-Out internal linking plan (Query Fan-Out, Entity Fan-Out, semantic contextual links, upward/lateral/reverse links) for any client's blog post or page to raise rankings and AI Overview citations. Use ONLY when the user explicitly asks to run entity fan-out linking, internal linking fan-out, or this skill by name. Do not apply automatically during other work.
---

# Entity Fan-Out Internal Linking Engine

Works for any client and any industry. Nothing here is tied to one site. The client's pages always come from a site map the user supplies (see `references/site-map-template.md`). `references/example-legal-site.md` is a filled-in sample only.

## Why it ranks
- **Query Fan-Out:** Google AI Mode, AI Overviews, ChatGPT, and Perplexity split one search into many sub-queries and retrieve a passage for each. A site that answers every sub-query, and links those answers together, gets retrieved and cited more.
- **Entity Fan-Out:** Search engines rank entities (services, products, places, tools, use cases) and the relationships between them. Linking the page's main entity to each related entity inside a sentence teaches the engine how the site's topics connect and which page owns each one.
- **Semantic links:** The words around a link are read as much as the link text. A sentence that names the entity, a related entity, and the benefit passes far more meaning and authority than a bare keyword link.
- **Authority flow:** Contextual links move PageRank from strong pages to pages stuck on page 2 and keep closely related pages from competing for the same search.

## Step 0: Get inputs
Before writing, confirm you have:
1. The draft or page (full text or URL).
2. The client site map: homepage and brand topic, main service/product pages with what each covers, location pages, existing blog posts. If missing, ask for it or build it from the live site and have the user confirm. Never invent URLs; mark guessed ones as `[CONFIRM]`.
3. Optional: pages currently ranking on page 2 (to prioritize).

## Workflow
1. **Main entity:** Name the page's single core entity and the one search intent it owns.
2. **Related entities:** List 6-12 related entities: sibling services, sub-services, tools or integrations, use cases, audiences, locations, problems solved.
3. **Query Fan-Out:** Write the 5-10 sub-questions a search engine would fan the main query into (what, how, cost, vs, best for, near me, mistakes, tools, timeline). Map each to the one site page that best answers it. If none does, flag it as a **content gap**.
4. **Entity Fan-Out:** Pick which entity relationships get a link, prioritizing: parent service hub, page-2 pages, location relevance, then sibling posts.
5. **Write semantic links:** For each link, write the full sentence as it should appear in the body.
6. **Reverse links:** Find 2 sentences on existing hub or location pages that should link back to this page, quoting the existing sentence and showing the edited version.
7. **Self-check** (below), fix anything failing, then output.

## Rules
### Link count
- 3-5 outbound internal links per 1,000-1,500 words. Scale proportionally for longer pages (about 1 per 300 words, max 10).
- Upward: 2-3 (blog → service hub or location page). The first upward link must sit within the first 200 words.
- Lateral: 1-2 (blog → closely related blog post).
- Reverse: 2 (existing hub or location page → this page).

### Anchor mix (3-tier formula)
- **Entity-exact, about 30%:** the core service or product name. Example: `residential epoxy garage flooring`.
- **Semantic long-tail, about 50%:** action and benefit phrases. Example: `bilingual intake specialists who sign retainers on the call`.
- **Entity co-occurrence, about 20%:** tools, integrations, niche use cases. Example: `Clio and Filevine CRM intake workflows`.

### Anchor quality
- 4-8 words, descriptive, matches the target page's main entity.
- Never: "click here", "learn more", "read more", "this page", "here", raw URLs, or single-word anchors.
- Never reuse the exact same anchor twice across the plan or point two different anchors with the same wording at different pages.

### Placement
- Inside full body sentences in real paragraphs. Never in bullet lists, footers, or tacked-on "related posts" lines.
- The surrounding sentence must name the main entity plus at least one related entity and a concrete benefit or fact.
- Hub → hub links go in mid-body transition sentences ("Need more than X? Y covers ...").

### Ranking guardrails
- One page owns one topic. Never link two different pages with anchors targeting the same search; flag cannibalization if the site already has it.
- Favor targets stuck on page 2.
- Link to location pages only when the content is genuinely relevant to that place.
- Do not invent facts, stats, or claims in link sentences. Use only what is in the draft or the client's material; mark anything uncertain `[VERIFY]`.
- No em dashes in any written copy.

## Cannibalization audit (run before and after every linking pass)
One anchor = one destination, site wide. Run `scripts/anchor_audit.py` from the project root (adapt the glob paths to the project's content files). It lists every internal anchor that points to more than one URL and every empty `href`. Exit code 0 means clean.

Resolve each conflict this way:
1. **Pick the owner.** Generic service terms ("legal intake", "24/7 availability", "CRM integration") belong to the hub page that owns that entity, never a blog post. If unclear, the hub with the most existing links wins.
2. **Repoint** multi-word links that point elsewhere to the owner.
3. **Unwrap** (keep the text, drop the link) single-word anchors, empty or `#` links, and blog-to-blog links reusing a hub's term. Rewrite a lateral link only with an anchor naming that post's specific question.
4. **Never** let a page link to itself, and never point a state-named anchor at a page for a different state.
5. Re-run the audit; do not report done until it shows 0 conflicts.

Locations: upward anchors from location pages use the exact national phrase for the hub; lateral location anchors always contain the target location name; location titles and H1s stay regional.

## Output format
```
## Entity Fan-Out Linking Plan: <page title>

**Main entity:** ...   **Search intent owned:** ...
**Related entities:** ...

### Fan-Out Map
| # | Sub-question | Target page | Anchor | Tier |
|---|---|---|---|---|
(rows; content gaps marked GAP)

### 1. Upward Links (page → hubs)
**Placement:** paragraph N (first 200 words for link 1)
> Full sentence with **[anchor text](/url/)** in place.
(2-3 blocks)

### 2. Lateral Links (page → related posts)
> ...(1-2 blocks)

### 3. Reverse Links (existing pages → this page)
**Page:** /url/
Current: "..."
Updated: "... **[anchor](/new-post/)** ..."
(2 blocks)

### Content Gaps
- Sub-question with no page, suggested new post title.

### Self-Check
- [ ] totals and anchor mix line
```

## Self-check
- Total links in range for word count; first upward link within 200 words.
- Anchor mix close to 30/50/20; every anchor 4-8 words; no generic or duplicate anchors.
- Every link in a full body sentence naming entity + related entity + benefit.
- Every fan-out sub-question mapped or flagged as a gap.
- No two pages competing for one topic; no invented URLs or facts; no em dashes.
- `scripts/anchor_audit.py` reports 0 conflicting anchors and 0 empty links.

## References
- `scripts/anchor_audit.py`: site-wide anchor conflict and empty-link check.
- `references/site-map-template.md`: blank client site map to fill in.
- `references/examples.md`: 30 contextual link examples across 5 industries.
- `references/example-legal-site.md`: a filled-in sample site map and fan-out.
