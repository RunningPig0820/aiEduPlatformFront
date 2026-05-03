## ADDED Requirements

### Requirement: Split-Screen Auth Layout
The login/register page SHALL use a split-screen layout: left side (50% width on lg+ screens) features the brand gradient with a large illustrative icon, product tagline, and feature bullets; right side (50%) contains the auth form (login/register/reset tabs) centered vertically. On mobile (< lg), the left brand panel SHALL be hidden and the form takes full width.

#### Scenario: Desktop shows brand panel
- **WHEN** the login page is viewed on a large screen
- **THEN** the left 50% shows a gradient panel with brand icon and tagline, right 50% shows the form

#### Scenario: Mobile hides brand panel
- **WHEN** the login page is viewed on a small screen
- **THEN** only the form is visible, centered with the gradient background behind it

### Requirement: Refined Form Inputs
Form inputs SHALL use `rounded` border radius with `border-base-300` borders. On focus, the border SHALL transition to the primary color with a subtle ring (`focus:ring-2 focus:ring-primary/20`). Input prefix icons SHALL use Lucide React components in a 40x40 container. Error states SHALL display a red border with an error message below the input.

#### Scenario: Input focus shows primary ring
- **WHEN** a user clicks into a text input
- **THEN** the border turns primary with a subtle ring glow

#### Scenario: Input error shows red border and message
- **WHEN** validation fails for a field
- **THEN** the input border turns error color and a message appears below

### Requirement: Role Selector as Button Group
The registration role selector SHALL render as a button group (not a dropdown) with four role options (Student/Teacher/Parent/Admin) displayed as rounded buttons with Lucide icons. The selected role SHALL have the primary color border and background tint.

#### Scenario: Role selector shows icon buttons
- **WHEN** the registration form is viewed
- **THEN** the role selector displays four icon buttons with Lucide icons for each role

### Requirement: Demo Login Cards
The demo quick-login section SHALL display three role cards (Student/Teacher/Parent) as clickable cards with Lucide icons, role labels, and hover elevation. Each card SHALL use `cursor-pointer` and `hover:shadow-card-hover` with a subtle border.

#### Scenario: Demo login card elevates on hover
- **WHEN** a user hovers over a demo login card
- **THEN** the card shadow increases and the border color transitions to primary
