# Plan: UI Framework Migration (Preact)

## Phase 1: Setup & Infrastructure [checkpoint: a988e30]

- [x] Task: Install Preact dependencies.
  - [x] Run `npm install preact`.
  - [x] Run `npm install -D @preact/preset-vite`.
- [x] Task: Configure Vite and TypeScript.
  - [x] Update `vite.config.ts` to use Preact plugin.
  - [x] Update `tsconfig.json` to handle JSX (`"jsx": "react-jsx"`, `"jsxImportSource": "preact"`).
  - [x] Rename relevant `.ts` files to `.tsx` (initially just for testing).
- [x] Task: Proof of Concept.
  - [x] Create a simple `<HelloWorld />` component.
  - [x] Attempt to render it inside the existing sidebar container in `src/content/index.ts` to verify the build pipeline works.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Setup & Infrastructure' (Protocol in workflow.md)

## Phase 2: Reactivity & Store Binding [checkpoint: a01091e]

- [x] Task: Create `useSubtitleStore` hook.
  - [x] Implement a hook that subscribes to `SubtitleStore` events and returns the current segments/state.
- [x] Task: Create `useConfig` hook.
  - [x] Implement a hook that subscribes to `Config` changes.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Reactivity & Store Binding' (Protocol in workflow.md)

## Phase 3: Sidebar Migration [checkpoint: e608fa4]

- [x] Task: Create Sidebar Components.
  - [x] `SidebarHeader.tsx` (Title, Controls).
  - [x] `SidebarList.tsx` (Virtual list or standard list of items).
  - [x] `SidebarItem.tsx` (Individual segment display).
- [x] Task: Implement `SidebarApp.tsx`.
  - [x] Assemble components.
  - [x] Implement "Scroll to Active" logic (using refs).
  - [x] Implement File Upload logic.
- [x] Task: Replace Legacy Sidebar.
  - [x] Update `src/content/index.ts` to mount `<SidebarApp />` instead of instantiating `new Sidebar()`.
  - [x] Delete `src/content/sidebar.ts`.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Sidebar Migration' (Protocol in workflow.md)

## Phase 4: Overlay Migration & Cleanup

- [x] Task: Create Overlay Components.
  - [x] `OverlayApp.tsx`.
  - [x] Bind to store and config.
- [x] Task: Replace Legacy Overlay.
  - [x] Update `src/content/index.ts` to mount `<OverlayApp />` instead of `new Overlay()`.
  - [x] Delete `src/content/overlay.ts`.
- [x] Task: Final Polish.
  - [x] Verify all CSS modules/classes are correct.
  - [x] Run full integration test suite (may need to update tests to handle React components if they rely on specific DOM structure that changed slightly, though we aim for parity).
- [x] Task: Conductor - User Manual Verification 'Phase 4: Overlay Migration & Cleanup' (Protocol in workflow.md)
