## ADDED Requirements

### Requirement: Lucide React as Primary Icon Source
All icons in the application SHALL be sourced from the `lucide-react` library. The icon components SHALL be imported individually (tree-shaken) to minimize bundle size. Icon sizes SHALL be controlled via the `size` prop (default 20) or Tailwind `w-`/`h-` classes.

#### Scenario: Icons are imported from lucide-react
- **WHEN** a component uses a Home, User, BookOpen, or GraduationCap icon
- **THEN** it imports the corresponding component from `lucide-react`

#### Scenario: Tree-shaking removes unused icons
- **WHEN** the production build is created
- **THEN** only the Lucide icons that are actually imported are included in the bundle

### Requirement: Sidebar Menu Icons
The sidebar menu SHALL use Lucide React icons for all menu items. Each icon SHALL be 20x20px (`size={20}`) with `strokeWidth={1.5}`. Active menu items SHALL have the icon colored with the role color; inactive items SHALL have `text-base-content/60`.

#### Scenario: Active sidebar item icon is colored
- **WHEN** a sidebar menu item's route matches the current URL
- **THEN** its icon is rendered in the role's brand color

### Requirement: Navbar and StatCard Icons
The navbar brand mark, user avatar placeholder, and StatCard icons SHALL use Lucide React components instead of inline SVG or emoji.

#### Scenario: StatCard uses Lucide icon
- **WHEN** a StatCard renders with `icon={BookOpen}`
- **THEN** the Lucide BookOpen icon is displayed in the circular icon container

### Requirement: Knowledge Graph Icons
The textbook tree expand/collapse chevrons, detail panel icons, sync manager icons, and system stats icons SHALL use Lucide React components.

#### Scenario: Textbook tree uses Lucide chevrons
- **WHEN** a textbook tree node is expanded or collapsed
- **THEN** it uses Lucide ChevronRight/ChevronDown icons with smooth rotation transition
