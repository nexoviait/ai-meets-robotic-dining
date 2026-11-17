<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Visitor cart, orders, bookings, quotes, language and sound persist in browser localStorage; inquiry submissions use Cloud through a validated insert-only server function so they are available to the owner, not just the visitor.
- All inquiry forms share the same validation and private intake table; no public read grants or policies are allowed because submissions contain personal contact details.
- Menu, packages, roadmap and hub contact details live in `src/lib/data.ts`; pricing/ROI/prep logic in `src/lib/orders.ts` and `src/lib/roi.ts` with tests in `src/test/`.
- The office map uses Maps Embed with the public connector key and the shared address; render only on authorized Lovable app origins to avoid leaking credential-bearing preview hostnames through referrers.
- Floor zone presentation lives in a dedicated explorer using shared zone data and crops of the labeled sample concept, keeping selection accessible and images consistent with the overall floor visualization.
- Station selection uses a shared inline single-select listbox with roving focus and localized selection announcements; read-only food lists retain scroll-region semantics to avoid implying item selection.
- The AI assistant (named by `ASSISTANT` in `src/lib/data.ts`) is a full-page chat at `/chat` (new chat) and `/chat/$threadId`: route-derived thread IDs and browser-local UIMessage history rendered with AI Elements, with new chats saved only once they have a message; a same-origin validated streaming server route adapts Gateway native events and shared hub data to UI messages so private model calls never enter browser code.
- The national district map reads 64 public cached locations through the route loader; a cron-verified nightly route refreshes eight coordinates through the Maps gateway on rotation, avoiding per-visitor geocoding and keeping cached coordinates within provider limits.
- Map pins and district details share the browser-safe districtHubStatus helper so location confirmation remains consistent and separate from proposed rollout phases.
- Concierge guided workflows are data-driven in a shared workflow module, and other pages open the chat page through a window-event helper (`openConcierge`) so chat state stays in one place.
