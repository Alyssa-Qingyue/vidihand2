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

### V37 page and opening

Reorganized following EgoForce's research-page sequence, using UI UX Pro Max design guidance. The synchronized raw/result task comparison is now the lead demo. Added a paper-based abstract; visual comparisons are directly visible. The narrated video is under Video. Restored a fully readable title and subtitle from its first frame, held for four seconds, and used that frame as the poster. The deleted 2D-versus-3D segment stays removed. Task videos, native-frame geometry, GT comparisons, evaluation values, soundtrack, and captions are retained.

### V38 interactive-only presentation

The page now has one demo format: synchronized raw/result wipe comparisons. All ten named datasets have playable clips: Xperience, EgoDex, Ego4D, Gen-HumanEgo, ARCTIC, H2O, HOT3D, OakInk2, Ego-Pro, Ego-Std. The narrated video and static frame gallery are removed from the page; narrated video remains in the local demo workspace. Task exports use native aspect ratios with no added padding. `v2/tasks/sources.json` records source clips, start frames, native FPS, and export dimensions. Browser verification covers all ten clips, slider extremes/midpoint, and five viewport widths.

### V39

Results support sorting by all seven metric headers, including reverse order and both evaluation settings. Removed the geometry-depth disclosure. The embedded ten-dataset demo uses WebP frame sheets instead of a video player: drag the raw/result divider and scrub frames below it. No video element or MP4 request is used. Frame sheets retain every source frame and the original display aspect ratio.

### V40: restore the complete demo

The complete 92-second narrated demo is embedded immediately after the title, before the interactive dataset comparisons. It opens on the restored title, includes baseline/GT comparisons, and retains 1080p at 30 FPS. Dataset previews remain interactive image-frame comparisons. The no-video rule applies to dataset previews, not the complete narrated demo.
