# ViDiHand V2 project page

Project page adapted from https://vidihand.github.io/ (upstream snapshot `ac1b8b1`). The original page and media are preserved; open `original-index.html` to view the copied V1 page. The root homepage presents V2 only and does not reuse V1 videos as V2 results.

## Preview

Run `python -m http.server 8080` from this directory, then visit http://localhost:8080. JSON loading requires an HTTP server.

## Content

V2 figures and results come from the November 15 paper source. `v2/results.json` reproduces the 19 rows (18 baselines plus V2) of `tables/main_comparison.tex`; `v2/cases.json` records selected frame provenance. No author list or V2 arXiv identifier has been invented. Paper and implementation links await release.

`v2/build_assets.py` records how paper figures and case images were exported in the author's workspace. It is not required to serve the site.

GitHub Pages can serve this repository from `main` at `/` using the included deployment workflow.

## Page layout

The homepage follows a compact research-page structure: title and links, narrated demo, reconstruction comparisons, method overview, and quantitative results. Depth/focal-length discussion is expandable. `v2/demo.mp4` is the V36 web preview with matching English captions. It starts with baseline comparisons after the title, includes an explicit GT column, and uses newly rendered native-frame 3D streams (30 FPS; Xperience source 20 FPS). The poster comes from the delivered video. Video loads on demand.

The task viewer packs raw and reconstruction into one video and reveals them on a canvas; both sides always share the same decoded frame. `v2/tasks/sources.json` records clips, start frames, and native frame rates. Xperience uses the paper multi-person case `xp_0bc35fc7-95ce_ep5_00751`. Selected static baseline frames remain expandable.

Music: [Horizons by Scott Buckley](https://www.scottbuckley.com.au/library/horizons/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

`v2/release.json` records native geometry frame checks and the delivered web video SHA-256. The full 92-second video decoded successfully; all 451 motion frames per baseline/GT stream were unique. Browser checks cover four tasks, slider endpoints, pointer and keyboard input, playback, and 390/768/1440px layouts.
