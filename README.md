# Sinclair Film Studios — Cinematic Film Edition

Extract this ZIP and open **index.html**. No installation, build step, API key, or external graphics library download is needed. Keep the files and assets folder together.

## GitHub Pages

Upload the extracted contents, including **index.html**, the styles/scripts, **.nojekyll**, and **assets/**, to your repository's top level. Replace the previous website files with this edition. In your repository's Pages settings, publish the default branch from its root folder. Upload the extracted contents rather than the ZIP itself.

## What to explore

- **The projector:** a 3D 35 mm film projector with punched metal reels, reflective surfaces, control dials, perforated celluloid, and a projected title card. Drag to turn it, tap for a projection pulse, and pinch to zoom. Released movement settles with inertia.
- **A galaxy on film:** stars respond to your pointer and touch, ripple when you tap, and carry scroll momentum. Across the pages, stars gather along flowing film-like paths.
- **The crew credits:** the five original crew portraits travel along inclined loops of film around an animated clapperboard. Tap a frame to open its profile, or use the crew buttons. Pause film stops this scene separately.
- **Six departments:** acting spotlights, a screenplay, framing and aperture, an editing sequence, poster design, and a lighting rig each have their own animated drawing.
- **The production timeline:** drag the scrubber through concept, script, production, edit, and release. The timecode and selected stage follow your movement.
- **Picture and sound:** a moving contact sheet and animated waveform introduce the kinds of projects the club makes.
- **Find your role:** ten quick randomized questions from a bank of 60, with a contact strip that fills as you answer. All ten roles get equal opportunities; tied matches and the reasoning behind results remain visible. This is an interest quiz, not a formal aptitude test.
- **Opening titles:** look just below the first scene for a short studio opening sequence. Escape or the close button returns immediately.
- **Hidden scenes:** five discoveries are scattered through the site. The cutting room offers clues.

## Controls

Sound starts only when you select **Sound On**. A volume control appears beside it. The mix includes ambient chords, spatial interface cues, film transport clicks, edits, and a projector burst. Sound suspends in background tabs.

**Pause motion** stops the continuous animations across the site. The site respects your device's reduced-motion setting. **FX: Quiet** reduces particles, rendering resolution, and expensive visual effects.

Both 3D scenes support keyboard focus: use Tab to reach them, arrow keys to rotate, plus/minus to zoom, and Enter to activate. Separate crew buttons provide direct keyboard access to every profile. Touch dragging and pinching operate inside the model; normal scrolling works elsewhere.

## Included information

Original club information, six department descriptions, production stages, project types, actor recruitment, meeting times, all five crew portraits, biographies and quotes are preserved.

Google Classroom: https://classroom.google.com/c/ODQ2OTIzODA3MjM0?cjc=sgvedclk

Class code: **sgvedclk**. A scannable QR and copy-invite button are included. Joining requires internet access and may require Google sign-in.

## Files and portability

- **index.html** contains the website's content and routes.
- **styles.css**, **immersive.css**, **cinema.css** contain the layout and visual styles.
- **physics.js** runs an independent starfield and the shared animation clock.
- **universe.js** builds the film projector, crew film loops, interaction, and a film-themed Canvas fallback when WebGL is unavailable.
- **cinema.js** runs the department drawings, opening titles, production scrubber, and contact sheet progress.
- **app.js** handles navigation, sound, profiles, discoveries, and the quiz interface.
- **quiz.js**, **original-data.js** contain questions, scoring, and original role information.
- **assets/** includes the full bundled Three.js runtime and license, logo, portraits, and QR. Embedded portrait textures allow the 3D scenes to work when opening the HTML directly.

Local assets and relative paths support both a repository subfolder and direct local HTML. The starfield is independent of the 3D renderer, and hidden crew scenes resize when opened. No loading screen blocks the content.

The movement is an artistic simulation using softened forces, springs, inertia, and eccentric paths; it is not a scientific model of a film transport mechanism.

## Verification

Browser checks cover the extracted ZIP, hosted repository paths, offline HTML, both 3D scenes and selections, mouse dragging, simulated touch dragging and pinch, motion/audio controls, all crew profiles, quiz completion/back/retry, six department drawings, timeline seeking, opening titles, mobile and tablet widths, reduced motion, and a forced WebGL fallback. Question scoring also passed 1,000 balanced randomized runs.

Touch and tablet checks use browser emulation. A physical iPad and Safari were not tested.
