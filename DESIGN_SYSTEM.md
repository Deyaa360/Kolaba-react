# Kolaba Design System
## Professional & Modern Brand Implementation

### Color Strategy - Consistency & Professionalism

#### **Core Principle**: Use brand colors **strategically, not everywhere**
This is a professional platform, not a rainbow. Colors have specific purposes.

---

### PRIMARY USAGE RULES

#### 🔵 **Turquoise (#17DED4)** - PRIMARY
**Use ONLY for:**
- Primary CTA buttons (Login, Sign Up, Apply, Submit)
- Active states (selected tabs, active filters)
- Progress indicators, loading states
- Primary action icons (when clicked performs main action)
- Links

**DO NOT use for:**
- Backgrounds (except very subtle tint #E5FCFB)
- Text (except links)
- Decorative elements

#### 🔴 **Hot Pink (#F271B4)** - ACCENT
**Use SPARINGLY for:**
- Special badges (Featured, Hot, New)
- Highlights that need attention
- Occasional emphasis (max 1-2 per screen)

**DO NOT overuse** - This is your "wow" color. Less = more impact.

#### 🟡 **Yellow (#FAB422)** - SECONDARY/WARNING
**Use ONLY for:**
- Pending status badges
- Warning indicators
- Cautionary messaging

**DO NOT use for:**
- Regular UI elements
- Decorative purposes

---

### NEUTRAL BACKBONE (80% of UI)

#### **Grays** - Professional Foundation
- **Text**: gray900 (headers), gray700 (body), gray500 (secondary)
- **Backgrounds**: white (cards), gray50 (page), gray100 (subtle areas)
- **Borders**: gray200 (standard), gray300 (emphasis)
- **Icons**: gray600 (inactive), gray500 (secondary)
- **Disabled**: gray300 (borders), gray400 (text)

#### **Rich Black (#101319)** - Brand Black
- Headers, primary text
- Dark overlays
- Premium/serious sections

---

### CONSISTENCY RULES

#### **Buttons** (Must be consistent!)
```
Primary Button: Turquoise background, white text
Secondary Button: White background, gray border, gray text
Danger Button: Red background, white text (delete, cancel)
Disabled Button: Gray300 background, Gray400 text
```

#### **Status Badges**
```
Approved/Success: Green (#10B981)
Pending: Yellow (#FAB422) - brand color
Rejected/Error: Red (#EF4444)
Active: Turquoise (#17DED4) - brand color
```

#### **Cards & Surfaces**
```
Standard Card: White background, gray200 border, subtle shadow
Elevated Card: White background, no border, medium shadow
Page Background: gray50 (#F9FAFB)
```

#### **Text Hierarchy**
```
H1/Headers: gray900/black, bold
H2/Subheaders: gray800, semibold
Body: gray700, regular
Secondary: gray500, regular
Placeholder: gray400, regular
```

---

### EFFECTS (Not animations)

#### **Shadows** - Depth & Elevation
```typescript
// Light shadow for cards
shadowColor: '#000',
shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.05,
shadowRadius: 2,
elevation: 1,

// Medium shadow for elevated cards
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 2,

// Strong shadow for modals
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.15,
shadowRadius: 8,
elevation: 4,
```

#### **Borders** - Clean & Professional
- Standard: 1px solid gray200
- Emphasis: 1px solid gray300
- Active/Selected: 2px solid primary (turquoise)

#### **Opacity** - Subtle States
- Hover: 0.9 opacity
- Disabled: 0.5 opacity
- Loading: 0.6 opacity

---

### EXAMPLES - CORRECT vs WRONG

#### ✅ **CORRECT: Professional Campaign Card**
```
- White background
- Gray200 border
- Gray900 title
- Gray600 brand icon
- Turquoise "View Details" button ONLY
- ONE pink badge if featured
```

#### ❌ **WRONG: Rainbow Card**
```
- Turquoise background
- Pink border
- Yellow icon
- Turquoise AND pink AND yellow on same card
- Multiple bright colors competing
```

---

### SCREEN-SPECIFIC GUIDELINES

#### **LoginScreen**
- Turquoise: Login button ONLY
- Pink: App logo/icon for brand recognition
- Gray: Everything else (inputs, borders, secondary text)

#### **CampaignsScreen**
- Turquoise: Active tab, "Apply" buttons
- Pink: Featured badge (if campaign is featured)
- Gray: Cards, borders, icons, secondary info
- White: Card backgrounds

#### **DashboardScreen**
- Turquoise: Primary stat highlights, active states
- Gray: Stats, cards, info
- Status colors: ONLY for actual statuses (approved=green, pending=yellow, etc.)

---

### THE GOLDEN RULE

**"When in doubt, use gray. Brand colors are earned, not scattered."**

A professional platform uses color **purposefully**:
- 80% neutral (grays, white, black)
- 15% primary (turquoise for main actions)
- 4% semantic (green/red/yellow for statuses)
- 1% accent (pink for special emphasis)

This creates a clean, modern, trustworthy platform that takes content creation seriously.
