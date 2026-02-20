# Specification

## Summary
**Goal:** Build a data table displaying artwork from the Art Institute of Chicago API with server-side pagination and persistent row selection across pages.

**Planned changes:**
- Install and configure PrimeReact DataTable component
- Create TypeScript interface for artwork data (id, title, place_of_origin, artist_display, inscriptions, date_start, date_end)
- Fetch artwork data from https://api.artic.edu/api/v1/artworks?page=N with server-side pagination
- Display artwork in table with six data columns
- Add row selection with checkboxes (individual and select-all for current page)
- Create custom overlay panel with numeric input for selecting N rows
- Implement ID-based persistent selection that maintains state across page navigation without prefetching or storing data from other pages
- Handle custom selection where N exceeds current page rows using calculation strategy (no prefetching)
- Apply clean, professional design style

**User-visible outcome:** Users can browse paginated artwork data, select individual rows or all rows on the current page, use a custom panel to select a specific number of rows, and maintain their selections when navigating between pages.
