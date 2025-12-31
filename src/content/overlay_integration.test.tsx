import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "preact";
import { act } from "preact/test-utils";
import { store } from "./store";
import { OverlayApp } from "./components/OverlayApp";

// Mock Config
vi.mock("./config", () => ({
  Config: {
    getIsEnabled: vi.fn().mockResolvedValue(true),
    getIsOverlayEnabled: vi.fn().mockResolvedValue(true),
    getIsGrammarExplainerEnabled: vi.fn().mockResolvedValue(true),
    addChangeListener: vi.fn(),
    addOverlayChangeListener: vi.fn(),
    addGrammarExplainerChangeListener: vi.fn(),
  },
}));

describe("Integration: Overlay Rendering", () => {
  let videoEl: HTMLVideoElement;

  beforeEach(async () => {
    // Reset store
    store.clear();

    // Clear DOM
    document.body.innerHTML = '<div id="overlay-root"></div>';

    // Create mock video element
    videoEl = document.createElement("video");
    document.body.appendChild(videoEl);
  });

  it("should display the correct segment based on video time", async () => {
    // 1. Mount OverlayApp
    await act(async () => {
      render(<OverlayApp />, document.getElementById("overlay-root")!);
    });

    // 2. Add segments to store
    await act(async () => {
      store.addSegments([
        { start: 1000, end: 3000, text: "First Segment" },
        { start: 4000, end: 6000, text: "Second Segment" },
      ]);
    });

    // 3. Move video time to first segment
    await act(async () => {
      // Manually set currentTime using Object.defineProperty to bypass JSDOM limitations
      Object.defineProperty(videoEl, "currentTime", {
        value: 1.5,
        configurable: true,
      });
      videoEl.dispatchEvent(new Event("timeupdate"));
    });

    // 4. Verify Overlay
    const original = document.querySelector(".lle-original");
    expect(original).not.toBeNull();
    expect(original?.textContent).toBe("First Segment");

    // 5. Move video time to second segment
    await act(async () => {
      Object.defineProperty(videoEl, "currentTime", {
        value: 5,
        configurable: true,
      });
      videoEl.dispatchEvent(new Event("timeupdate"));
    });

    expect(document.querySelector(".lle-original")?.textContent).toBe(
      "Second Segment",
    );

    // 6. Move to gap
    await act(async () => {
      Object.defineProperty(videoEl, "currentTime", {
        value: 3.5,
        configurable: true,
      });
      videoEl.dispatchEvent(new Event("timeupdate"));
    });

    expect(document.querySelector("#lle-overlay")).toBeNull();
  });

  it("should display system messages when set", async () => {
    await act(async () => {
      render(<OverlayApp />, document.getElementById("overlay-root")!);
    });

    // Set system message via store
    await act(async () => {
      store.setSystemMessage("Loading AI...");
    });

    const systemMsg = document.querySelector(".lle-system-message");
    expect(systemMsg).not.toBeNull();
    expect(systemMsg?.textContent).toBe("Loading AI...");

    // Check that it hides when cleared
    await act(async () => {
      store.setSystemMessage(null);
    });
    expect(document.querySelector(".lle-system-message")).toBeNull();
  });
});
