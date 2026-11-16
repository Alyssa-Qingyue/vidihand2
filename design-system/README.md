# ViDiHand V2 project page

Reference architecture: https://dfki-av.github.io/EgoForce/
Design guidance: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

Applied UI UX Pro Max guidance: content-first hierarchy, restrained Swiss typography, semantic color tokens, 44px controls, clear keyboard focus, reduced motion, responsive media, and progressive video loading. Its design-system query matched an academic palette and typography but returned a newsletter landing structure; that structure was rejected in favor of the user's explicit EgoForce reference. No generated newsletter form, subscriber counts, or unrelated marketing sections were added.

Order: full paper title and resource links → interactive reconstruction demo → narrated video → abstract → architecture → visual comparisons → quantitative results.

Keep publication metadata limited to verified details. Main demo uses one packed decoded frame for both comparison views. Default Xperience clip is the paper's multi-person case. Video frame zero and poster show the full title, held for four seconds before baselines. Geometry assets preserve source 20/30 FPS.

V38 overrides the earlier page order: interactive demo → abstract → architecture → quantitative results. Only one demo format is shown. Every named dataset has an interactive clip; each viewer follows its source aspect ratio without letterboxing.

### V39: sortable results and inline frame demo

Every numeric metric header is a keyboard-operable sort button with `aria-sort`. First click ranks best first (FAcc/F1 descending, errors ascending); repeated clicks reverse. Sorting persists across evaluation settings. The geometry-depth disclosure is removed. All ten dataset comparisons now use synchronized WebP frame sheets, with a raw/result divider and frame scrubber embedded in the page. No video element, playback controls, video codec dependency or MP4 request remains. Frames preserve source sampling and aspect ratio without letterboxing.

### V40: restore the complete demo

The complete 92-second narrated demo is embedded immediately after the title, before the interactive dataset comparisons. It opens on the restored title, includes baseline/GT comparisons, and retains 1080p at 30 FPS. Dataset previews remain interactive image-frame comparisons. The no-video rule applies to dataset previews, not the complete narrated demo.

### V41

Restored the original six-method paper-frame baseline gallery immediately after the complete demo, before the ten dataset interactions. The opening demo overlay insets now fill their bounds using cover with clipped overflow. Original title, synchronized 30 FPS geometry, GT, timing and audio are retained.
