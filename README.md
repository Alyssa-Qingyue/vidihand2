# ViDiHand V2 project page

Project page adapted from https://vidihand.github.io/ (upstream snapshot `ac1b8b1`). The original page and media are preserved; open `original-index.html` to view the copied V1 page. The root homepage presents V2 only and does not reuse V1 videos as V2 results.

## Preview

Run `python -m http.server 8080` from this directory, then visit http://localhost:8080. JSON loading requires an HTTP server.

## Content

V2 figures and results come from the November 15 paper source. `v2/results.json` reproduces the 19 rows (18 baselines plus V2) of `tables/main_comparison.tex`; `v2/cases.json` records selected frame provenance. No author list or V2 arXiv identifier has been invented. Paper and implementation links await release.

`v2/build_assets.py` records how paper figures and case images were exported in the author's workspace. It is not required to serve the site.

GitHub Pages can serve this repository from `main` at `/` using the included deployment workflow.

## Page layout

The homepage follows a compact research-page structure: title and links, narrated demo, reconstruction comparisons, method overview, and quantitative results. Depth/focal-length discussion is expandable. `v2/demo.mp4` is the V35 web preview with matching English captions and a reconstruction-result poster. Video loads on demand.
