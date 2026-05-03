## ADDED Requirements

### Requirement: Enhanced Chat Bubble Design
AI chat messages SHALL use distinct bubble styles: user messages SHALL have a `bg-primary text-primary-content` bubble aligned right, AI messages SHALL have a `bg-base-200` bubble aligned right with a subtle left border accent. Each message SHALL display a timestamp below the bubble in `text-xs text-base-content/40`.

#### Scenario: User message has primary color bubble
- **WHEN** a user sends a message
- **THEN** it appears in a primary-colored rounded bubble aligned to the right

#### Scenario: AI message has subtle accent border
- **WHEN** an AI response is rendered
- **THEN** it appears in a base-200 bubble with a left border accent and timestamp

### Requirement: Code Block Styling
Code blocks within AI responses SHALL use a dark background (`bg-neutral text-neutral-content`) with `rounded-md` border radius, a subtle border, and a monospace font (`font-mono`). Multi-line code blocks SHALL have a max-height with overflow-auto.

#### Scenario: Code block has dark background
- **WHEN** an AI response contains a code block
- **THEN** it renders with a dark neutral background, monospace font, and rounded corners

### Requirement: Refined Input Area
The message input area SHALL feature a rounded container with `bg-base-200` background, a Lucide Send icon button on the right with `btn-primary` styling, and a placeholder text in `text-base-content/40`. The input SHALL have `focus:ring-2 focus:ring-primary/20` on focus.

#### Scenario: Input area has refined container
- **WHEN** the AI chat panel is viewed
- **THEN** the message input has a rounded base-200 container with a primary send button

### Requirement: Model Selector Enhancement
The model selector dropdown SHALL use Lucide icons alongside model names, display the selected model in a badge-style trigger button, and use `rounded-lg` dropdown items with hover highlighting.

#### Scenario: Model selector shows icons
- **WHEN** the model dropdown is opened
- **THEN** each option displays a Lucide icon next to the model name
