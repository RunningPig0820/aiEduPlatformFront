## ADDED Requirements

### Requirement: Page Transition Animations
All dashboard pages SHALL apply a fade-in animation when loaded. The animation SHALL transition from `opacity-0 translate-y-2` to `opacity-100 translate-y-0` over 300ms using `ease-out`. This SHALL be applied via a `animate-fadeIn` utility class on the main content area of each page.

#### Scenario: Dashboard page fades in on load
- **WHEN** a user navigates to a dashboard page
- **THEN** the content fades in with a subtle upward motion over 300ms

### Requirement: Loading Skeleton Components
A Skeleton component SHALL be provided that renders a pulsing `bg-base-200` placeholder. It SHALL support `variant` prop (`circular`, `rectangular`, `text`) and `width`/`height` props. Skeleton placeholders SHALL be used in place of StatCards and list items during data loading.

#### Scenario: Skeleton pulses during loading
- **WHEN** a page is in loading state
- **THEN** skeleton placeholders are displayed with a CSS pulse animation

### Requirement: Empty State Illustrations
Empty states (no homework, no activities, no data) SHALL display a Lucide icon (64px, `text-base-content/20`) centered above a descriptive text and an optional action button. The empty state container SHALL have `py-12` vertical padding and `text-center` alignment.

#### Scenario: Empty homework shows icon and text
- **WHEN** a student has no pending homework
- **THEN** a centered empty state with a Lucide icon and "暂无作业" text is displayed

### Requirement: Button Hover Micro-animations
All primary and secondary buttons SHALL apply a `scale-[1.02]` transform on hover with `transition-transform duration-150`. Outline buttons SHALL additionally transition their background color on hover.

#### Scenario: Primary button scales on hover
- **WHEN** a user hovers over a `btn btn-primary`
- **THEN** the button slightly scales up (1.02x) with a 150ms transition

### Requirement: Consistent Spacing System
All page content areas SHALL use `p-6` (24px) padding. Card gaps within pages SHALL use `gap-4` (16px). Section gaps between cards SHALL use `space-y-6` (24px). List items within cards SHALL use `space-y-2` (8px). This spacing SHALL be consistent across all dashboard pages.

#### Scenario: Dashboard page uses consistent spacing
- **WHEN** a dashboard page is rendered
- **THEN** the spacing follows the defined scale: p-6, gap-4, space-y-6, space-y-2
