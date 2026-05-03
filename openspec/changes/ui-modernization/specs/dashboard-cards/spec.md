## ADDED Requirements

### Requirement: Modern StatCard Component
The StatCard component SHALL accept `title`, `value`, `icon` (Lucide React component), and `color` (primary/secondary/success/warning/info) props. The card SHALL display a gradient background strip at the top matching the color prop, the icon in a circular container on the left, the title and value on the right, and a subtle `transition-all hover:shadow-card-hover` effect. The card SHALL use `rounded-lg` border radius and `shadow-card-elevated`.

#### Scenario: StatCard renders with gradient strip
- **WHEN** a StatCard with `color="primary"` is rendered
- **THEN** it displays a top gradient strip in the primary color, the icon in a circle, and the title/value

#### Scenario: StatCard elevates on hover
- **WHEN** a user hovers over a StatCard
- **THEN** the shadow increases smoothly from elevated to hover level

### Requirement: Content Card Enhancement
Content cards (homework lists, class overview, activity feeds) SHALL use `rounded-lg` with `shadow-card-elevated`. List items within cards SHALL use `bg-base-200/50` backgrounds with `rounded-md` and subtle left border accent in the role color. Each list item SHALL have a hover state that increases the background opacity.

#### Scenario: Homework list item has accent border
- **WHEN** a homework list item renders in the student dashboard
- **THEN** it has a subtle left border in the success (green) color

#### Scenario: Activity feed item highlights on hover
- **WHEN** a user hovers over an activity feed item
- **THEN** the background color darkens with a smooth transition

### Requirement: Progress Bar Styling
Progress bars in dashboards SHALL use the daisyUI `progress` component with the role-specific color. The progress track SHALL have a subtle `bg-base-200` background and the bar SHALL have `rounded-full` with a smooth color fill.

#### Scenario: Progress bar uses role color
- **WHEN** a teacher dashboard renders class progress
- **THEN** the progress bars use the primary color with a rounded track
