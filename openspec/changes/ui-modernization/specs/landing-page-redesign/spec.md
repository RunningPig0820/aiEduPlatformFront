## ADDED Requirements

### Requirement: Modern Hero Section
The landing page hero SHALL feature a full-width gradient background using the brand gradient, a large headline with animated fade-in, a subtitle line, and two CTA buttons (primary solid + outline). The headline SHALL use a two-line layout with a highlighted keyword in the brand color. The hero section SHALL have a minimum height of 70vh and vertically centered content.

#### Scenario: Hero section displays with brand gradient
- **WHEN** the landing page loads
- **THEN** the hero section shows the brand gradient background with centered headline and CTA buttons

#### Scenario: Hero headline animates on load
- **WHEN** the page first renders
- **THEN** the hero headline fades in with a CSS transition (opacity 0→1, translateY 20px→0)

### Requirement: Feature Cards with Icon Circles
The feature section SHALL display role-based feature cards (Student/Teacher/Parent) in a 3-column grid. Each card SHALL feature a circular icon container (w-14 h-14) with a colored background matching the role color, a card title, a description, and a ghost button. Cards SHALL have `shadow-card-elevated` and `hover:shadow-card-hover` with a `transition-all` on hover.

#### Scenario: Feature card has circular icon container
- **WHEN** a feature card renders
- **THEN** it shows a 56x56px circular icon container with the role's brand color

#### Scenario: Feature card elevates on hover
- **WHEN** a user hovers over a feature card
- **THEN** the card shadow increases from elevated to hover level with a smooth transition

### Requirement: Landing Page Footer with Links
The landing page footer SHALL display the brand name, copyright, and quick links (About, Contact, Privacy) in a daisyUI footer layout with the brand gradient background and white text.

#### Scenario: Footer renders with links
- **WHEN** the landing page is viewed
- **THEN** a footer with brand gradient background, copyright text, and quick links is visible
