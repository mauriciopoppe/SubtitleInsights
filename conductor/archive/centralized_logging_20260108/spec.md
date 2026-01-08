# Specification: Centralized Logging with 'debug' Library

## Overview
This track implements a structured logging system using the `debug` library. It aims to replace all `console.log/warn/error` calls with namespace-specific loggers that can be enabled or disabled via a developer toggle in the application settings.

## Functional Requirements

### 1. Library Integration
- Install and integrate the `debug` package.
- Configure `debug` to work within the Chrome Extension environment (Content Scripts and Background Service Worker).

### 2. Namespace Definition
- Implement specific loggers for the following areas:
  - `si:ai`: AI processing, Translation, and Insights logic.
  - `si:content`: Content script injection and initialization.
  - `si:bg`: Background service worker events and subtitle interception.
  - `si:video`: VideoController events, state changes, and seeking.
  - `si:store`: SubtitleStore data updates, parsing, and clearing.

### 3. Log Content
- Focus logs on capturing:
  - **Payloads:** Raw subtitle data, AI responses, and configuration objects.
  - **State Transitions:** Detailed diffs or summaries when Preact signals or Store states change.

### 4. Developer Controls
- Add a "Debug Mode" toggle in the **Detailed Settings** (Settings App).
- Toggling "Debug Mode" should update the `localStorage.debug` flag (or similar mechanism provided by the library) to enable all `si:*` namespaces.

## Non-Functional Requirements
- **Minimal Performance Impact:** Loggers should be dormant when not enabled.
- **Environment Parity:** Logging behavior should be consistent between YouTube and Stremio.

## Acceptance Criteria
- [ ] `debug` package is installed and configured.
- [ ] `console.log` calls in the core modules (AI, Store, VideoController) are replaced with `debug` instances.
- [ ] A "Debug Mode" toggle exists in the Settings page.
- [ ] Enabling "Debug Mode" shows logs in the console for all `si:*` namespaces.
- [ ] Disabling "Debug Mode" silences all logs.
- [ ] Logs correctly display complex payloads (JSON objects).

## Out of Scope
- Logging to an external server or file.
- Log rotation or persistent log storage.
