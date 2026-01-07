# Profiles

Profiles allow for the customization of how the AI interacts with different languages and learning styles.

## Managing Profiles

The Profile Manager is accessible through the **Detailed Settings** link in the extension's popup menu.

- **Create Multiple Profiles:** Different profiles can be set up for different languages or learning goals (e.g., "Japanese (Default)", "Spanish Beginner").
- **Custom System Prompts:** Tailor the AI's focus and personality. The AI can be instructed to concentrate on specific grammar points, provide varying levels of detail, or use a specific tone.
- **Language Selection:** Define the source and target languages specifically for each profile.

## Customizing AI Behavior

The **System Prompt** field in the Profile Editor is the most powerful tool for customization. By adjusting the prompt, it is possible to:

- Instruct the AI to include Romaji/IPA for pronunciation.
- Request explanations tailored to specific levels (such as JLPT levels for Japanese).
- Control the length and complexity of the AI's explanations.

## Tips for Effective System Prompts

Since Gemini Nano is a smaller in-device model, it requires a carefully crafted system prompt to deliver the best results. Here are some strategies for optimization:

- **Iterate with Larger Models:** Start by developing and refining your prompt using a more powerful model like Gemini Pro. Once the logic and instructions are solid, adapt them for the local model.
- **Provide Exact Examples:** Gemini Nano performs significantly better when shown exactly how the output should look. Include 1-2 examples of a subtitle segment followed by your desired analysis in the prompt itself.
- **Be Specific:** Explicitly state the format, tone, and level of detail required. The more structure you provide, the more consistent the local AI will be.
