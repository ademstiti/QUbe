# Qatar University campus map snapshot

`qatar-university.geojson` contains building footprints, roads, and selected land-use features downloaded from OpenStreetMap via Overpass on **16 November 2026**. Geometry is geographically grounded; the map is not an official QU map or a surveyed development plan.

© OpenStreetMap contributors. Data is available under the Open Database License (ODbL): https://www.openstreetmap.org/copyright

Bounding-box query: south 25.363, west 51.477, north 25.387, east 51.504. Source IDs are retained in feature properties. Heights use mapped values where supplied; otherwise they use mapped levels × 3.3 m, or a 6.6 m illustrative default. They are not measured heights.

Refresh with `python3 scripts/fetch-campus.py` from `website`, with network access. The script writes a fresh snapshot; verify campus landmarks after refreshing.

The 13 QUbe hubs in `src/campus.ts` and all container models are original illustrative proposals, separate from the OSM base. Eight proposals use mapped landmark references; five have explicitly approximate college-area references. Shared health-college anchors do not assert a dedicated entrance for each college. The Sport Sciences proposal serves the college near the sports facilities and does not claim to identify its building.

College names and building codes were checked against:

- QU college directory: https://www.qu.edu.qa/en-us/Colleges/
- QU building directory: https://qu.edu.qa/en-us/Offices/FacilitiesGeneralServices/Pages/Building-Codes.aspx
- Metro OSM reference: https://www.openstreetmap.org/node/5079684559

Nearby-landmark links open Google Maps; no Google map imagery is copied or bundled. An optional street basemap requests visible tiles from tile.openstreetmap.org with attribution. The default campus model uses the local snapshot and requires no map API key.
