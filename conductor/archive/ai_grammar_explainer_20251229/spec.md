# Spec: AI Grammar Explainer (Chrome Prompt API)

## Overview

Enhance the educational value of subtitles by providing automated AI-generated grammar summaries. Using the Chrome Prompt API, the extension will analyze Japanese sentences (N5+) that meet a minimum complexity threshold and populate the `contextual_analysis` field in the Sidebar and Overlay.

## Functional Requirements

- **Automated Summary Generation:**
  - Analyze the Japanese sentence for main grammar points and particles.
  - Populate the existing `contextual_analysis` field in the `SubtitleSegment`.
- **Hybrid Auto-Activation & Filtering Logic:**
  - **Trigger:** Automatically generate summaries for sentences identified as N5+ _AND_ meet a minimum complexity requirement (e.g., >5 characters OR contains at least 1 particle).
  - **Control & Efficiency:** Provide a global "Auto-Explain Grammar" toggle. When disabled, no AI prompts are executed.
- **UI Integration (Sidebar & Overlay):**
  - The `Sidebar` and `Overlay` components will display the `contextual_analysis` content once generated.
  - Dynamic UI updates upon completion of asynchronous analysis.
- **Prompt Configuration:**
  - Low temperature for precision.
  - Optimized system prompt for concise, educational summaries.

## Non-Functional Requirements

- **Performance:** Asynchronous prompt execution; avoid redundant AI calls.
- **Privacy:** Local Chrome Prompt API.

## Acceptance Criteria

- Sentences identified as N5+ AND meeting complexity criteria automatically populate `contextual_analysis`.
- Very simple sentences (e.g., "はい", "ありがとう") are skipped to save resources.
- The explanation appears in both the Sidebar and the Overlay.
- Toggle exists to disable the feature entirely.
