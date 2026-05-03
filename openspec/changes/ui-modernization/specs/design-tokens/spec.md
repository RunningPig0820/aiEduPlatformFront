## ADDED Requirements

### Requirement: Custom Brand Color Palette
The daisyUI theme SHALL be configured with a custom brand color palette replacing all default colors. The primary color SHALL be a modern indigo (`#4F46E5`), secondary a teal (`#0D9488`), success a vibrant green (`#10B981`), warning a warm amber (`#F59E0B`), info a sky blue (`#0EA5E9`), and error a rose red (`#EF4444`). All base colors SHALL use a warm neutral scale (`#FAFAF9` for base-100, `#F5F5F4` for base-200, `#E7E5E4` for base-300).

#### Scenario: Primary button uses brand color
- **WHEN** a `btn btn-primary` is rendered
- **THEN** it displays the custom indigo color `#4F46E5`, not the daisyUI default purple

#### Scenario: Role-colored avatars use updated colors
- **WHEN** a student/teacher/parent/admin avatar is rendered in the navbar
- **THEN** the avatar background uses the updated success/primary/warning/secondary brand colors

### Requirement: Custom Typography System
The application SHALL use Inter for Latin characters and Noto Sans SC for Chinese characters. The `font-sans` utility in Tailwind SHALL be overridden to use this font stack: `'Inter', 'Noto Sans SC', system-ui, sans-serif`.

#### Scenario: Page headings use the new font
- **WHEN** a heading element with `font-sans` is rendered
- **THEN** the text is displayed in Inter (Latin) or Noto Sans SC (Chinese)

#### Scenario: Font files are bundled by Vite
- **WHEN** the app is built with `npm run build`
- **THEN** the font woff2 files are included in the dist/assets directory

### Requirement: Extended Shadow and Gradient Utilities
The Tailwind config SHALL extend `boxShadow` with `card-elevated` (`0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`) and `card-hover` (`0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)`). It SHALL extend `backgroundImage` with `gradient-card` (135deg gradient from primary/5 to secondary/5) and `gradient-hero` (135deg from primary to secondary with opacity layers).

#### Scenario: Elevated card renders with subtle shadow
- **WHEN** a div has `className="shadow-card-elevated"`
- **THEN** it displays a subtle elevation shadow

#### Scenario: Gradient background renders correctly
- **WHEN** a div has `className="bg-gradient-hero"`
- **THEN** it displays a 135deg diagonal gradient from primary to secondary

### Requirement: Consistent Border Radius Scale
The border radius scale SHALL be standardized: `rounded-sm` (4px) for badges and tags, `rounded` (8px) for input fields and buttons, `rounded-lg` (12px) for cards, `rounded-xl` (16px) for modals and large containers.

#### Scenario: Cards use consistent border radius
- **WHEN** a card component is rendered
- **THEN** it uses `rounded-lg` (12px) border radius
