# Sinclair Film Studios — Cinematic Universe Edition

This is a static GitHub Pages website. It does not need an install step, server runtime, API key, external font, image CDN, or audio CDN.

## Publish

1. Extract the ZIP.
2. Upload the extracted files to the top level of your repository. Keep `assets/` and every file name unchanged.
3. In GitHub, open **Settings → Pages**.
4. Choose **Deploy from a branch**, select your default branch, select **/ (root)**, and save.

GitHub Pages looks for `index.html` in the selected publishing source. Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## What changed

This edition is a dense, interactive sci-fi experience rather than a minimalist landing page:

- A locally bundled Three.js renderer powers the stellar engine and crew constellation. The hero engine is made from animated 3D geometry: emissive icosahedron core, layered torus rings, orbiting debris, additive glows, lighting, drag rotation, and raycast click detection.
- The crew view uses five individually tilted 3D orbital planes, animated satellites, emissive bodies, halos, and the supplied crew portraits mapped onto the satellites. Drag the galaxy or click a satellite.
- The background starfield is generated locally with several depth layers, drift, twinkle, and occasional diffraction-like starbursts.
- The role finder uses a 60-question bank assembled from ten project contexts. Each mission selects ten questions and four easy-to-answer choices, with balanced role exposure and an auditable evidence trail on the result.
- The original club information, process, department descriptions, five crew profiles, biographies, quotations, meeting times, quiz roles, Google Classroom invite, and QR code are preserved.
- Five hidden signals are discoverable: the stellar core, warp-drive ribbon, three logo clicks, every role department, and the final credit. The archive dock tracks them.
- Sound remains opt-in and synthesized locally. Motion and FX can be paused independently, and reduced-motion preferences are respected.

## Interaction map

- Drag the hero stellar engine to rotate it. Click the core to recover a signal.
- Use **Engage warp drive** to trigger the page transition.
- Use the role lab tabs to tune the department frequency. Visiting every tab reveals a signal.
- Open **Find Your Role**, start a mission, and answer ten prompts. The same question is not repeated within a mission.
- Open **Crew** and drag the constellation. Orbit lines are visible; click a crew satellite to lock onto its profile.
- Click the bottom credit, the SFS logo three times, or the archive dock to reveal the hidden transmission log.
- Use **Sound On** and the volume slider for the layered synthetic score. **FX: Quiet** reduces the visual effect layer.

## Files

- `index.html`: content, routes, accessible structure, invite, and QR.
- `styles.css`: visual system, depth effects, responsive layouts, archive dialog, and motion rules.
- `quiz.js`: 60-question generator and scoring model.
- `app.js`: routes, quiz UI, sound, crew profile selection, discoveries, and controls.
- `universe.js`: Three.js hero and crew scenes plus the animated starfield.
- `assets/three.module.js`: locally bundled Three.js engine.
- `assets/`: supplied portraits/logo, classroom QR, and the Three.js license.

The classroom invite is `https://classroom.google.com/c/ODQ2OTIzODA3MjM0?cjc=sgvedclk` and the code is `sgvedclk`.

## Verification

The three JavaScript files pass syntax checks. The local server responds with `200` for the root page and module route. The package is static and all Three.js and image dependencies are relative local paths, so it works under both an account site and a repository site. Full device/browser visual QA was not performed in this pass.
