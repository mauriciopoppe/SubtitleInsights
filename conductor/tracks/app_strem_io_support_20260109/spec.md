# Specification: Support for app.strem.io

## Overview
This track extends the extension's support to include `https://app.strem.io/`, which is a mirror/alias of `https://web.stremio.com/`. Since the DOM structure is identical, this primarily involves configuration updates to allow the extension to run on the new domain.

## Functional Requirements

### 1. Manifest Permissions
- Update `manifest.json` to include `https://app.strem.io/*` in:
  - `content_scripts.matches`
  - `host_permissions`

### 2. Platform Detection
- Update `src/content/index.tsx` to recognize `app.strem.io` as the `stremio` platform.
- Ensure the existing Stremio initialization logic (`initStremio`) is triggered for this domain.

## Non-Functional Requirements
- **Seamless Integration:** The extension should behave exactly the same on `app.strem.io` as it does on `web.stremio.com`.

## Acceptance Criteria
- [ ] Extension loads on `https://app.strem.io/`.
- [ ] Platform detection identifies it as 'stremio'.
- [ ] UI (Sidebar, Overlay, Toggle) injects correctly.
- [ ] Subtitle capture/upload works as expected.

## Out of Scope
- Documentation updates.
