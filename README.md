# Sinclair Film Studios — Cinema Edition

A complete static website. No installation, build step, API key, or paid service is needed.

## Put it on GitHub Pages

1. Extract this ZIP first.
2. Upload `index.html`, `styles.css`, `app.js`, `.nojekyll`, and the entire `assets` folder to the top level of your GitHub repository. Upload the extracted files, not the ZIP. Keep the folder names and capitalization unchanged.
3. In your repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose **main** and **/ (root)**, then **Save**.
6. Wait for GitHub to finish publishing. The Pages settings will show your website address.

If your repository already has a site, replace its old site files with these files. Do not place this package inside an extra folder. If your default branch has another name, choose that branch instead of main.

Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Preview on your computer

Open `index.html` after extracting the package. All artwork, portraits, styles, quiz data, and sounds work locally. The classroom invite itself needs internet access and may require Google sign-in. Clipboard copying can be restricted on local files; if blocked, the full invite appears for manual copying.

## Included

- Original club information, meeting times, six department descriptions, production process, project types, and actor recruitment message.
- Original five crew portraits, biographies, quotations, selectable profiles, moving portrait orbit, and orbit pause.
- Original ten-question role finder, ten role profiles, scoring weights, acting preference, back button, ranked results, and retry.
- New cinematic art direction, generated lens artwork, responsive layout, pointer parallax, page entrances, animated typography, and role reveal sequence.
- Opt-in synthesized sound: layered atmosphere, navigation sweeps, hover cues, selection tones, and result chords. Volume control appears when sound is enabled. Audio pauses in background tabs.
- Motion pause, automatic reduced-motion support, keyboard focus indicators, mobile navigation, and browser back/forward navigation.
- Direct classroom invite, downloadable/local QR artwork, class code, and copy-invite action.

Classroom: https://classroom.google.com/c/ODQ2OTIzODA3MjM0?cjc=sgvedclk

Class code: **sgvedclk**

## Editing

- `index.html`: club information, profiles, links, and page structure.
- `styles.css`: colors, typography, layout, responsive rules, and animations.
- `app.js`: original quiz data and department descriptions, interactive behavior, scoring, and sound synthesis.
- `assets/`: supplied crew photos and logo, original generated lens art, and classroom QR.

The role finder is a local interest quiz, not an AI service. Its original acting recruitment preference is retained and explained alongside results. No answers are sent to a server or saved.

If you change the classroom invitation, replace both links in `index.html`, the copy URL in `app.js`, and the QR image.

## Checks completed

JavaScript syntax; initialization and interaction logic in a simulated DOM; rapid-click protection; quiz back and retry; 1,000 randomized scoring paths; department and crew selection; route switching; original content preservation; local file and anchor references; and ZIP integrity.

The local preview responds successfully. Full visual browser/device testing and end-to-end Google Classroom enrollment were not performed. The QR was generated directly from the exact supplied invitation using ReportLab.

All paths are relative, so the site supports both a GitHub account website and a repository website. No external font, script, image, or audio CDN is required.
