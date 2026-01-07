# Design Decisions

Subtitle Insights is built with a specific set of principles that prioritize focus, native integration, and intentional learning.

## Key Principles

### 1. Be Great at One Thing

The primary goal is providing deep insights from subtitles. Features like vocabulary mining or spaced repetition (SRS) are left to specialized tools like **Yomitan** and **Anki**. By focusing on real-time analysis, the extension remains lightweight and does one job exceptionally well.

### 2. Embedded & Integrated UI

Instead of using external windows or the Chrome Side Panel—which might simplify supporting more platforms—the extension favors embedding components directly into the existing site UI.

- **Native Alignment:** This approach ensures the overlay and sidebar align with the viewing experience.
- **Simplicity of State:** By keeping the UI within the same page scope, the internal state management remains simple and predictable. Avoiding the Chrome Side Panel or external windows means there is no need for complex cross-page state synchronization.
- **Dynamic Interaction:** On YouTube, for example, the sidebar respects native behavior. Pressing the **"T"** key (Theater Mode) automatically moves the sidebar below the video, and pressing it again moves it back to the right. This level of seamless integration is only possible by building within the page's own layout.

### 3. Minimalist UI

The user interface is designed to stay out of the way.

- **Focus over Color:** The overlay avoids unnecessary coloring or icons that could distract from the content. It focuses on presenting text clearly.
- **Intentional Interaction:** Icons and controls are hidden by default, appearing only through specific user actions (like proximity hover).
- **Manual Control:** This philosophy is why the sidebar doesn't continuously auto-scroll. Scrolling is a deliberate, user-triggered action that prevents distracting movement in the periphery.

## Technical Scope

### Platform Selection

YouTube and Stremio were selected as the primary targets because they are the preferred platforms for the author's own learning journey. The extension is optimized for the author's preferred settings and workflow.

### Avoiding iframes

Integrating with platforms that serve video content within `iframes` is intentionally discouraged.

- **Architectural Complexity:** Supporting iframes would require a much more complex communication protocol (using the `postMessage` API) to bridge the gap between the main page and the iframe content.
- **Maintainability:** To keep the project focused and maintainable, the architecture avoids the overhead associated with cross-frame message passing and lifecycle management.

### State & Migration Policy

The extension's session state (which tracks toggle preferences and configurations) may change as the project evolves.

- **Breaking Changes:** Significant changes to how state is stored may occur without backward compatibility options or automated migration paths.
- **Best Effort:** As the primary user, the author manages these transitions manually. While migrations for the broader user base may be performed on a best-effort basis, users should be prepared for potential resets of their settings during major updates.

## Language Specific Decisions

### Japanese: No Furigana or Spaces

A conscious decision was made to exclude Furigana and artificial spaces between Japanese words.

- **The Rationale:** While Furigana can be a helpful crutch, excluding it encourages the learner to associate the sound directly with the Kanji.
- **Forced Listening:** This choice forces a stronger connection between the audio and the visual text.
- **Synergy:** For learners who still need help with specific readings, specialized tools like Yomitan can be used to provide that information on demand.

## Contributions

While the source code is open, it is important to note that the project's design and features are heavily influenced by the author's personal learning preferences and workflow.

- **Alignment:** Potential contributions that significantly alter the core philosophy or add substantial complexity may not be accepted if they diverge from these established goals.
- **Discuss First:** Before starting work on any major changes or new features, it is strongly encouraged to open a **[discussion thread on GitHub](https://github.com/mauriciopoppe/SubtitleInsights/discussions)**. This ensures that the proposal aligns with the project's direction and saves time for everyone involved.
