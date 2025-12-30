# Plan: UI Framework Migration (Preact)

## Phase 1: Setup & Infrastructure
- [ ] Task: Install Preact dependencies.
    - [ ] Run `npm install preact`.
    - [ ] Run `npm install -D @preact/preset-vite`.
- [ ] Task: Configure Vite and TypeScript.
    - [ ] Update `vite.config.ts` to use Preact plugin.
    - [ ] Update `tsconfig.json` to handle JSX (`"jsx": "react-jsx"`, `"jsxImportSource": "preact"`).
    - [ ] Rename relevant `.ts` files to `.tsx` (initially just for testing).
- [ ] Task: Proof of Concept.
    - [ ] Create a simple `<HelloWorld />` component.
    - [ ] Attempt to render it inside the existing sidebar container in `src/content/index.ts` to verify the build pipeline works.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Setup & Infrastructure' (Protocol in workflow.md)

## Phase 2: Reactivity & Store Binding
- [ ] Task: Create `useSubtitleStore` hook.
    - [ ] Implement a hook that subscribes to `SubtitleStore` events and returns the current segments/state.
- [ ] Task: Create `useConfig` hook.
    - [ ] Implement a hook that subscribes to `Config` changes.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Reactivity & Store Binding' (Protocol in workflow.md)

## Phase 3: Sidebar Migration
- [ ] Task: Create Sidebar Components.
    - [ ] `SidebarHeader.tsx` (Title, Controls).
    - [ ] `SidebarList.tsx` (Virtual list or standard list of items).
    - [ ] `SidebarItem.tsx` (Individual segment display).
- [ ] Task: Implement `SidebarApp.tsx`.
    - [ ] Assemble components.
    - [ ] Implement "Scroll to Active" logic (using refs).
    - [ ] Implement File Upload logic.
- [ ] Task: Replace Legacy Sidebar.
    - [ ] Update `src/content/index.ts` to mount `<SidebarApp />` instead of instantiating `new Sidebar()`.
    - [ ] Delete `src/content/sidebar.ts`.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Sidebar Migration' (Protocol in workflow.md)

## Phase 4: Overlay Migration & Cleanup
- [ ] Task: Create Overlay Components.
    - [ ] `OverlayApp.tsx`.
    - [ ] Bind to store and config.
- [ ] Task: Replace Legacy Overlay.
    - [ ] Update `src/content/index.ts` to mount `<OverlayApp />` instead of `new Overlay()`.
    - [ ] Delete `src/content/overlay.ts`.
- [ ] Task: Final Polish.
    - [ ] Verify all CSS modules/classes are correct.
    - [ ] Run full integration test suite (may need to update tests to handle React components if they rely on specific DOM structure that changed slightly, though we aim for parity).
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Overlay Migration & Cleanup' (Protocol in workflow.md)
