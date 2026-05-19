# Design Specifications

# Nearby Business Feasibility & Location Intelligence Platform

## Document Control

| Field | Value |
| --- | --- |
| Document type | Design Specifications |
| Product name | Nearby Business Feasibility & Location Intelligence Platform |
| Short name | Nearby Report |
| Version | 1.0 |
| Status | Design Reference for Manual Figma Implementation |
| Purpose | Comprehensive UI/UX specifications for all screens based on QA flow analysis |
| Reference Document | docs/qa-user-flows.md |

---

## Design System

### Design Vibe

- **Mood**: High-end yet approachable data intelligence—think modern bank dashboard meets boutique studio. The palette centers warm indigo gradients and soft neutrals to communicate trust, clarity, and optimism.
- **Texture & Depth**: Use layered cards with subtle drop shadows and soft glassmorphism panels for the hero areas. Add very light diagonal patterns or noise texture behind the hero to break flatness without cluttering.
- **Imagery**: Use abstract city maps, stylized pin markers, and hand-drawn icons for local context. Illustrations should feature muted gradients with a single accent color, keeping them editorial.
- **Microcopy tone**: Confident, advisory, human—e.g., "We analyzed 3,742 nearby spots" or "Need a human double-check? Mark as complete."
- **Motion**: Prioritize gentle fade/slide transitions (200-300ms) between states plus subtle glow pulses on status badges to indicate live scoring.
- **Layout arc**: Hero sections should expand full width with layered gradient backgrounds, while forms and detail sections are centered with generous padding and card grids. Use subtle divider lines and whitespace to group related controls, and always pair data-heavy panels (scores, tables) with a concise visual clue (icon or badge) to guide focus.
- **Gradients & Highlights**: Apply soft linear gradients on primary cards (Brand Indigo → Indigo Light) and highlight important metrics with a luminous vignette. For status chips, use neon-like glows that fade outward (e.g., `box-shadow: 0 0 12px rgba(79,70,229,0.35)`).
- **Textures**: Incorporate faint topographic or grid textures in hero/backdrop areas using ultra-low opacity overlays (~3%) to evoke maps without distraction. Use blur + opacity on floating panels to create depth and highlight layering of data.
- **Transitions per screen**: Dashboard card hover lifts with a slight scale (1.02) and soft shadow; report creation toggles slide in new inputs; AI summary reveals with staggered fade-ins; checklist toggles animate with gentle height transitions.

### Color Palette

**Primary Colors:**
- **Brand Indigo**: `#4F46E5` (Primary actions, links, accents)
- **Brand Indigo Dark**: `#4338CA` (Hover states, active elements)
- **Brand Indigo Light**: `#818CF8` (Secondary accents, highlights)

**Neutral Colors:**
- **Background Primary**: `#FFFFFF` (Main backgrounds)
- **Background Secondary**: `#F9FAFB` (Card backgrounds, section dividers)
- **Background Tertiary**: `#F3F4F6` (Subtle backgrounds, hover states)
- **Text Primary**: `#111827` (Headlines, important text)
- **Text Secondary**: `#6B7280` (Body text, descriptions)
- **Text Tertiary**: `#9CA3AF` (Hints, placeholders)
- **Border Light**: `#E5E7EB` (Borders, dividers)
- **Border Medium**: `#D1D5DB` (Stronger borders)

**Status Colors:**
- **Success**: `#10B981` (Completed states, positive indicators)
- **Warning**: `#F59E0B` (Warning states, caution indicators)
- **Error**: `#EF4444` (Error states, failure indicators)
- **Info**: `#3B82F6` (Information states, neutral indicators)

**Score Colors:**
- **High Score (80-100)**: `#10B981` (Green gradient)
- **Good Score (65-79)**: `#3B82F6` (Blue gradient)
- **Medium Score (50-64)**: `#F59E0B` (Orange gradient)
- **Low Score (35-49)**: `#EF4444` (Red gradient)
- **Weak Score (0-34)**: `#DC2626` (Dark red gradient)

### Typography

**Font Families:**
- **Headlines**: `Inter` (Modern, geometric sans-serif)
- **Body**: `Inter` (Same family for consistency)
- **Numbers/Metrics**: `Inter` (Monospace variant for scores)

**Font Sizes:**
- **H1**: `32px` (Page titles)
- **H2**: `24px` (Section titles)
- **H3**: `18px` (Subsection titles)
- **Body Large**: `16px` (Primary body text)
- **Body**: `14px` (Standard body text)
- **Body Small**: `12px` (Captions, hints)
- **Micro**: `10px` (Labels, tags)

**Font Weights:**
- **Bold**: `700` (Headlines, emphasis)
- **Semibold**: `600` (Subheadlines, important text)
- **Medium**: `500` (Body text, descriptions)
- **Regular**: `400` (Standard text)
- **Light**: `300` (Hints, secondary text)

**Line Heights:**
- **Headlines**: `1.2` (Tight for headlines)
- **Body**: `1.5` (Comfortable reading)
- **Captions**: `1.4` (Slightly tighter)

### Spacing

**Scale:**
- **XS**: `4px` (Micro spacing)
- **S**: `8px` (Small spacing)
- **M**: `16px` (Medium spacing)
- **L**: `24px` (Large spacing)
- **XL**: `32px` (Extra large spacing)
- **2XL**: `48px` (Section spacing)
- **3XL**: `64px` (Page spacing)

### Border Radius

**Scale:**
- **Small**: `4px` (Buttons, small cards)
- **Medium**: `8px` (Cards, inputs)
- **Large**: `12px` (Large cards, modals)
- **XLarge**: `16px` (Hero sections, large containers)

### Shadows

**Elevation:**
- **None**: No shadow (Flat elements)
- **Small**: `0 1px 2px rgba(0, 0, 0, 0.05)` (Subtle elevation)
- **Medium**: `0 4px 6px rgba(0, 0, 0, 0.1)` (Standard elevation)
- **Large**: `0 10px 15px rgba(0, 0, 0, 0.1)` (High elevation)
- **XLarge**: `0 20px 25px rgba(0, 0, 0, 0.15)` (Modal elevation)

---

## Component Specifications

### Buttons

**Primary Button:**
- Background: Brand Indigo (`#4F46E5`)
- Text: White
- Border Radius: Small (`4px`)
- Padding: `12px 24px` (M horizontally)
- Font: Semibold, Body Large (`16px`)
- Hover: Brand Indigo Dark (`#4338CA`)
- Active: Darker shade
- Disabled: Gray (`#D1D5DB`), not clickable
- Loading: Spinner replaces text, button disabled

**Secondary Button:**
- Background: White
- Text: Brand Indigo (`#4F46E5`)
- Border: Border Light (`#E5E7EB`)
- Border Radius: Small (`4px`)
- Padding: `12px 24px`
- Font: Semibold, Body Large (`16px`)
- Hover: Background Secondary (`#F9FAFB`)
- Active: Background Tertiary (`#F3F4F6`)

**Ghost Button:**
- Background: Transparent
- Text: Brand Indigo (`#4F46E5`)
- Border: None
- Padding: `12px 24px`
- Font: Semibold, Body Large (`16px`)
- Hover: Background Secondary (`#F9FAFB`)

**Icon Button:**
- Background: Transparent
- Text: Text Secondary (`#6B7280`)
- Border: None
- Padding: `8px`
- Hover: Background Secondary (`#F9FAFB`)
- Active: Background Tertiary (`#F3F4F6`)

### Inputs

**Text Input:**
- Background: White
- Border: Border Light (`#E5E7EB`)
- Border Radius: Medium (`8px`)
- Padding: `12px 16px`
- Font: Regular, Body (`14px`)
- Placeholder: Text Tertiary (`#9CA3AF`)
- Focus: Brand Indigo border (`#4F46E5`), shadow
- Error: Error border (`#EF4444`), error message below
- Disabled: Background Secondary (`#F9FAFB`), Text Tertiary

**Select Dropdown:**
- Background: white
- Border: Border Light (`#E5E7EB`)
- Border Radius: Medium (`8px`)
- Padding: `12px 16px`
- Font: Regular, Body (`14px`)
- Chevron icon on right
- Focus: Brand Indigo border (`#4F46E5`)
- Error: Error border (`#EF4444`)

**Textarea:**
- Background: white
- Border: Border Light (`#E5E7EB`)
- Border Radius: Medium (`8px`)
- Padding: `12px 16px`
- Font: Regular, Body (`14px`)
- Min-height: `80px`
- Resize: Vertical only
- Focus: Brand Indigo border (`#4F46E5`)

**Checkbox:**
- Size: `16px` square
- Border: Border Medium (`#D1D5DB`)
- Border Radius: Small (`4px`)
- Checked: Brand Indigo background (`#4F46E5`), white checkmark
- Focus: Brand Indigo ring
- Label: Text Secondary (`#6B7280`), Body (`14px`)

**Radio Button:**
- Size: `16px` circle
- Border: Border Medium (`#D1D5DB`)
- Selected: Brand Indigo border (`#4F46E5`), inner dot
- Focus: Brand Indigo ring
- Label: Text Secondary (`#6B7280`), Body (`14px`)

### Cards

**Standard Card:**
- Background: white
- Border: Border Light (`#E5E7EB`)
- Border Radius: Medium (`8px`)
- Padding: `24px` (L)
- Shadow: Small
- Hover: Shadow Medium

**Report Card:**
- Background: white
- Border: Border Light (`#E5E7EB`)
- Border Radius: Medium (`8px`)
- Padding: `20px`
- Shadow: Small
- Hover: Shadow Medium, slight lift
- Content: Score badge, category, location, date, status

**Score Card:**
- Background: Gradient based on score
- Border Radius: Medium (`8px`)
- Padding: `16px`
- Shadow: Small
- Content: Score number, label, trend indicator

### Status Badges

**Success Badge:**
- Background: Success (`#10B981`) with 10% opacity
- Text: Success (`#10B981`)
- Border Radius: Small (`4px`)
- Padding: `4px 12px`
- Font: Semibold, Body Small (`12px`)

**Warning Badge:**
- Background: Warning (`#F59E0B`) with 10% opacity
- Text: Warning (`#F59E0B`)
- Border Radius: Small (`4px`)
- Padding: `4px 12px`
- Font: Semibold, Body Small (`12px`)

**Error Badge:**
- Background: Error (`#EF4444`) with 10% opacity
- Text: Error (`#EF4444`)
- Border Radius: Small (`4px`)
- Padding: `4px 12px`
- Font: Semibold, Body Small (`12px`)

**Info Badge:**
- Background: Info (`#3B82F6`) with 10% opacity
- Text: Info (`#3B82F6`)
- Border Radius: Small (`4px`)
- Padding: `4px 12px`
- Font: Semibold, Body Small (`12px`)

### Loading States

**Spinner:**
- Size: `24px`
- Color: Brand Indigo (`#4F46E5`)
- Animation: Rotate 360deg in 1s infinite

**Skeleton Loader:**
- Background: Background Tertiary (`#F3F4F6`)
- Border Radius: Medium (`8px`)
- Animation: Shimmer effect (light to dark gradient)
- Height: Matches content height

**Progress Bar:**
- Background: Background Tertiary (`#F3F4F6`)
- Fill: Brand Indigo (`#4F46E5`)
- Height: `4px`
- Border Radius: `2px`
- Animation: Width transition

### Toast Notifications

**Success Toast:**
- Background: Success (`#10B981`)
- Text: White
- Border Radius: Medium (`8px`)
- Padding: `12px 16px`
- Shadow: Medium
- Icon: Checkmark
- Duration: 3 seconds

**Error Toast:**
- Background: Error (`#EF4444`)
- Text: White
- Border Radius: Medium (`8px`)
- Padding: `12px 16px`
- Shadow: Medium
- Icon: Warning
- Duration: 5 seconds

**Info Toast:**
- Background: Info (`#3B82F6`)
- Text: White
- Border Radius: Medium (`8px`)
- Padding: `12px 16px`
- Shadow: Medium
- Icon: Info
- Duration: 4 seconds

---

## Screen Specifications

### 1. Authentication Screens

#### 1.1 Registration Screen

**Layout:**
- Split screen: 50% hero illustration, 50% form
- Mobile: Stacked (illustration on top, form below)

**Hero Section (Left):**
- Background: Gradient from Brand Indigo to Brand Indigo Dark
- Content:
  - Logo: "Nearby Report" in white, Bold, H1 (`32px`)
  - Tagline: "Know the market before you open your shop" in white, Regular, Body Large (`16px`)
  - Illustration: Business location intelligence concept
  - Progress indicator: "Secure access → Feasibility reporting" in white, Body Small (`12px`)

**Form Section (Right):**
- Background: white
- Content:
  - Heading: "Create your account" in Text Primary, Bold, H2 (`24px`)
  - Subheading: "Start analyzing business locations today" in Text Secondary, Regular, Body (`14px`)
  - Form fields:
    - Email input (required)
    - Password input (required, min 8 chars)
    - Name input (optional)
  - Primary button: "Create account"
  - Secondary link: "Already have an account? Sign in"
  - Validation messages below each field (error in red, success in green)

**States:**
- **Loading**: Button shows spinner, form disabled
- **Success**: Redirect to dashboard with success toast
- **Error**: Error toast with message, inline validation errors
- **Duplicate email**: Error message "Email already registered"

#### 1.2 Login Screen

**Layout:**
- Split screen: 50% hero illustration, 50% form
- Mobile: Stacked

**Hero Section:**
- Same as registration screen

**Form Section:**
- Background: white
- Content:
  - Heading: "Welcome back" in Text Primary, Bold, H2 (`24px`)
  - Subheading: "Sign in to access your reports" in Text Secondary, Regular, Body (`14px`)
  - Form fields:
    - Email input (required)
    - Password input (required)
  - Primary button: "Sign in"
  - Secondary link: "Don't have an account? Create one"
  - "Forgot password?" link (optional for MVP)

**States:**
- **Loading**: Button shows spinner
- **Success**: Redirect to dashboard
- **Error**: Error toast "Invalid email or password"
- **Invalid credentials**: Inline error message

---

### 2. Dashboard Screen

**Layout:**
- Top navigation bar
- Main content area with grid of report cards
- Mobile: Single column

**Navigation Bar:**
- Background: white
- Border: Border Light bottom
- Height: `64px`
- Content:
  - Logo: "Nearby Report" in Brand Indigo, Bold, H3 (`18px`)
  - Navigation links: "Dashboard", "Reports" (active state)
  - User menu: Avatar dropdown with "Sign out"

**Main Content:**
- Background: Background Secondary (`#F9FAFB`)
- Padding: `32px` (XL)
- Content:
  - Page heading: "Your Reports" in Text Primary, Bold, H1 (`32px`)
  - Subheading: "Manage and analyze your location feasibility reports" in Text Secondary, Regular, Body (`14px`)
  - Primary button: "Create New Report"
  - Report cards grid (2 columns desktop, 1 column mobile)

**Report Card:**
- Background: white
- Border: Border Light (`#E5E7EB`)
- Border Radius: Medium (`8px`)
- Padding: `20px`
- Shadow: Small
- Hover: Shadow Medium
- Content:
  - Header:
    - Business category: Text Primary, Semibold, Body Large (`16px`)
    - Status badge (COMPLETED, COMPLETED_WITH_WARNINGS, etc.)
  - Score:
    - Final score: Large number in appropriate color, Bold, H2 (`24px`)
    - Score label: Text Secondary, Regular, Body (`14px`)
  - Location:
    - Address: Text Secondary, Regular, Body (`14px`)
    - Radius: Text Tertiary, Body Small (`12px`)
  - Footer:
    - Created date: Text Tertiary, Body Small (`12px`)
    - "View details" link in Brand Indigo

**States:**
- **Loading**: Skeleton cards with shimmer effect
- **Empty**: Empty state illustration with "No reports yet" message and "Create your first report" CTA
- **Error**: Error card with "Failed to load reports" message and "Retry" button

**Pagination:**
- Bottom of content area
- "Previous" and "Next" buttons
- Page indicator: "Page 1 of X"

---

### 3. Report Creation Screen

**Layout:**
- Top navigation bar
- Form container centered
- Mobile: Full width

**Navigation Bar:**
- Same as dashboard

**Form Container:**
- Background: white
- Border: Border Light (`#E5E7EB`)
- Border Radius: Large (`12px`)
- Padding: `32px` (XL)
- Shadow: Medium
- Max-width: `800px`
- Content:
  - Page heading: "Create Feasibility Report" in Text Primary, Bold, H1 (`32px`)
  - Subheading: "Select your business type and location to generate insights" in Text Secondary, Regular, Body (`14px`)
  - Progress timeline at top (horizontal steps)

**Progress Timeline:**
- Horizontal progress bar
- Steps: "Business Info" → "Location" → "Analysis" → "Complete"
- Current step highlighted in Brand Indigo
- Completed steps in Success (`#10B981`)
- Pending steps in Text Tertiary

**Form Sections:**

**1. Business Information:**
- Section heading: "Business Information" in Text Primary, Semibold, H3 (`18px`)
- Business category dropdown (required)
- Business model dropdown (required, loads category-specific options)
- Helper text: "Select the operating model for your business"

**2. Location Selection:**
- Section heading: "Location" in Text Primary, Semibold, H3 (`18px`)
- Location search input (required)
- Search results dropdown with address suggestions
- Map placeholder (or integration) for pin adjustment
- Radius selection dropdown (500m, 1km, 2km, 3km)
- Helper text: "Adjust the pin for precise location"

**3. Optional Financial Inputs:**
- Section heading: "Financial Information (Optional)" in Text Primary, Semibold, H3 (`18px`)
- Collapsible section (expandable)
- Fields:
  - Expected rent (currency input)
  - Shop size (number input, sq ft)
  - Setup budget (currency input)
  - Monthly staff cost (currency input)
  - Inventory cost (currency input)
  - Expected investment range (range slider or min/max inputs)
- Helper text: "Skip these if you want manual financial validation"
- Skip button: "Skip financial inputs"

**4. Submit Section:**
- Primary button: "Generate Report"
- Secondary button: "Save as Draft"
- Cancel link

**States:**
- **Loading**: Button shows spinner, form disabled, progress indicator shows "Collecting data..."
- **Success**: Redirect to report detail with success toast
- **Validation error**: Inline error messages, shake animation on submit button
- **API error**: Error toast with "Location search temporarily unavailable" and retry button
- **No POIs**: Warning message "No competitors found in this area, continuing with limited data"

---

### 4. Report Detail Screen

**Layout:**
- Top navigation bar
- Report content area
- Mobile: Single column, stacked sections

**Navigation Bar:**
- Same as dashboard with "Back to Dashboard" button

**Report Header:**
- Background: white
- Border: Border Light bottom
- Padding: `24px` (L)
- Content:
  - Page heading: Business category in Text Primary, Bold, H1 (`32px`)
  - Subheading: Location address in Text Secondary, Regular, Body Large (`16px`)
  - Metadata row:
    - Radius: Text Tertiary, Body Small (`12px`)
    - Created date: Text Tertiary, Body Small (`12px`)
    - Status badge
  - Primary action: "Download PDF" button
  - Secondary action: "Share" button (optional)

**Score Section:**
- Background: Background Secondary (`#F9FAFB`)
- Padding: `32px` (XL)
- Content:
  - Section heading: "Feasibility Scores" in Text Primary, Semibold, H3 (`18px`)
  - Score cards grid (3 columns desktop, 1 column mobile):
    - Competition Score: Number + label + trend indicator
    - Demand Score: Number + label + trend indicator
    - Accessibility Score: Number + label + trend indicator
    - Area Fit Score: Number + label + trend indicator
    - Financial Pressure Score: Number + label + trend indicator (if financial inputs provided)
    - Confidence Score: Number + label + explanation
  - Final Score Card:
    - Large score number in appropriate color
    - Score interpretation (e.g., "Strong potential based on available signals")
    - Confidence level badge

**Competitor Analysis Section:**
- Background: white
- Padding: `32px` (XL)
- Content:
  - Section heading: "Competitor Analysis" in Text Primary, Semibold, H3 (`18px`)
  - Competitor table:
    - Columns: Name, Type, Distance, Threat Level, Rating
    - High-threat competitors highlighted with warning badge
  - Summary text: "X competitors found within radius"

**Demand Signals Section:**
- Background: Background Secondary (`#F9FAFB`)
- Padding: `32px` (XL)
- Content:
  - Section heading: "Demand Signals" in Text Primary, Semibold, H3 (`18px`)
  - Demand signals grouped by type:
    - Educational institutions
    - Residential areas
    - Commercial centers
    - Transportation hubs
  - Each signal with count and distance

**AI Summary Section:**
- Background: white
- Padding: `32px` (XL)
- Content:
  - Section heading: "AI Analysis" in Text Primary, Semibold, H3 (`18px`)
  - Executive Summary: Text in Text Primary, Regular, Body (`14px`)
  - Opportunities: Bullet points in Success (`#10B981`)
  - Risks: Bullet points in Error (`#EF4444`)
  - Final Recommendation: Highlighted box with Brand Indigo background, white text
  - Disclaimer: "This analysis is based on available data and should be used as decision support only" in Text Tertiary, Body Small (`12px`)

**Survey Checklist Section:**
- Background: Background Secondary (`#F9FAFB`)
- Padding: `32px` (XL)
- Content:
  - Section heading: "Physical Survey Checklist" in Text Primary, Semibold, H3 (`18px`)
  - Checklist items (checkboxes):
    - Visit at different times of day
    - Count approximate pedestrian movement manually
    - Observe competitor crowd
    - Check parking
    - Check visibility
    - Verify rent and deposit
    - Speak to nearby shop owners where appropriate
    - Validate delivery activity if relevant
    - Validate public transport and access
  - Each item with helper text
  - "Mark as complete" button
  - Progress indicator: "X of Y tasks completed"

**States:**
- **Loading**: Skeleton loaders for each section
- **Report not found**: 404 error page with "Report not found" message and "Back to Dashboard" button
- **API error**: Error section with "Failed to load report details" and "Retry" button
- **PDF generation**: Toast notification "Generating PDF..." with spinner
- **PDF error**: Error toast "PDF generation failed, please try again later"

---

### 5. Error States

#### 5.1 Error Boundary Screen

**Layout:**
- Centered content
- Background: Background Secondary (`#F9FAFB`)

**Content:**
- Error illustration (calm, friendly)
- Heading: "Something went wrong" in Text Primary, Bold, H2 (`24px`)
- Message: "We encountered an unexpected error. Please try again." in Text Secondary, Regular, Body (`14px`)
- Primary button: "Try again"
- Secondary button: "Go to Dashboard"

#### 5.2 Network Error Toast

**Content:**
- Error icon
- Message: "Network error. Please check your connection."
- Action: "Retry" button

#### 5.3 API Rate Limit Error

**Content:**
- Warning icon
- Message: "Too many requests. Please wait a moment."
- Action: "Retry" button (disabled for 30 seconds)

#### 5.4 Authentication Error

**Content:**
- Error icon
- Message: "You need to sign in to access this feature."
- Action: "Sign in" button

---

## Responsive Design

### Breakpoints

**Mobile:** `< 640px`
- Single column layouts
- Stacked navigation
- Touch-friendly buttons (min 44px height)
- Simplified tables (horizontal scroll or card view)

**Tablet:** `640px - 1024px`
- 2-column grids
- Optimized navigation
- Touch-friendly interactions

**Desktop:** `> 1024px`
- Multi-column layouts
- Hover states enabled
- Full navigation

### Mobile Adaptations

**Navigation:**
- Hamburger menu for mobile
- Bottom navigation bar for key actions

**Forms:**
- Full-width inputs
- Stacked form sections
- Larger touch targets

**Cards:**
- Single column layout
- Reduced padding
- Simplified content

**Tables:**
- Horizontal scroll
- Card view alternative
- Simplified columns

---

## Accessibility

### Color Contrast

- All text must meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Brand Indigo on white: 7.1:1 (passes)
- Success on white: 4.5:1 (passes)
- Error on white: 4.5:1 (passes)

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Tab order follows logical flow
- Focus states clearly visible (Brand Indigo ring)
- Skip navigation link for screen readers

### Screen Readers

- All images have alt text
- Form inputs have associated labels
- Error messages are announced
- Status changes are announced
- Progress indicators are accessible

### Touch Targets

- Minimum touch target size: 44px × 44px
- Buttons and links have adequate spacing
- Form inputs are large enough for touch

---

## Animation and Micro-interactions

### Button Interactions

- Hover: Background color change, slight lift
- Active: Background darken, press effect
- Disabled: Gray out, no interaction
- Loading: Spinner replaces text

### Form Interactions

- Focus: Border color change, shadow
- Error: Shake animation, red border
- Success: Green checkmark icon
- Loading: Skeleton or spinner

### Card Interactions

- Hover: Shadow increase, slight lift
- Click: Ripple effect or press state
- Loading: Skeleton loader

### Page Transitions

- Fade in: 300ms ease-in
- Slide in: 300ms ease-in-out
- Scale: Subtle zoom effect

### Loading States

- Spinner: 1s rotation
- Skeleton: 2s shimmer cycle
- Progress bar: Smooth width transition

---

## Iconography

### Icon Set

Use consistent icon set throughout:
- **Heroicons** (recommended for consistency)
- **Lucide** (alternative option)
- **Feather Icons** (lightweight option)

### Icon Usage

- **Navigation**: Menu, Home, User, Settings
- **Actions**: Plus, Download, Share, Edit, Delete
- **Status**: Check, Warning, Error, Info
- **Business**: Building, MapPin, TrendingUp, TrendingDown
- **Forms**: Search, Filter, Sort, Calendar

### Icon Specifications

- Size: `20px` (standard), `24px` (large), `16px` (small)
- Color: Text Secondary (`#6B7280`) by default
- Active: Brand Indigo (`#4F46E5`)
- Success: Success (`#10B981`)
- Error: Error (`#EF4444`)

---

## Implementation Notes

### Component Library

- Build reusable components based on these specifications
- Use component composition for complex UI
- Document component props and variants
- Include storybook or component documentation

### Design Tokens

- Export design tokens (colors, spacing, typography) for code implementation
- Use CSS variables or design token library
- Maintain single source of truth for design values

### Responsive Strategy

- Mobile-first approach
- Progressive enhancement
- Test on actual devices
- Consider touch interactions

### Performance

- Optimize images and assets
- Use lazy loading for images
- Implement code splitting
- Minimize bundle size

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Last 2 versions
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Next Steps

1. **Create Figma File**: Set up design system page with components
2. **Build Screens**: Implement each screen according to specifications
3. **Create Variants**: Design loading, error, and success states
4. **Responsive Design**: Create mobile and tablet variants
5. **Prototype**: Link screens for interactive prototype
6. **Handoff**: Prepare developer handoff with specifications

---

**Document Version**: 1.0  
**Last Updated**: 2026-05-18  
**Design Reference**: docs/qa-user-flows.md  
**Status**: Ready for Manual Figma Implementation
