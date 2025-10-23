# Kolaba Color Usage Guide
## Consistent Application of Brand Palette

### ✅ IMPLEMENTED COLORS FROM YOUR PALETTE

#### **Turquoise Shades** (#17DED4 family)
- `turquoise50: #EDFDFC` - Icon backgrounds, subtle tints
- `turquoise100: #A3F5F1` - Not currently used
- `turquoise200: #59EEE6` - Not currently used  
- `turquoise300: #17DED4` - Original brand color
- `turquoise400: #11A69F` - **PRIMARY BUTTON COLOR** (Main CTAs)
- `turquoise500: #0C6F6A` - Objective badges, shipping badges text
- `turquoise600: #063735` - Not currently used

**Usage:**
- Primary buttons (Login, Apply, etc.)
- Active tab indicators
- "Products Included" badges (bg: turquoise50, text: turquoise500)
- "Brand Awareness" objective badges

#### **Pink Shades** (#F271B4 family)
- `pink50: #FDECF5` - Badge backgrounds
- `pink100: #F8B4D7` - Not currently used
- `pink200: #F271B4` - **ACCENT COLOR** (brand pink)
- `pink300: #EE449C` - Not currently used
- `pink400: #E0157E` - Badge text, objective text
- `pink500: #A8105E` - Objective text (darker)
- `pink600: #700A3F` - Not currently used

**Usage:**
- "Content Only" badges (bg: pink50, text: pink400)
- "Creative Assets" objective badges
- Special emphasis (sparingly)

#### **Yellow Shades** (#FAB422 family)
- `yellow50: #FEF2D7` - Badge backgrounds
- `yellow100: #FDDE9B` - Not currently used
- `yellow200: #FCCA5F` - Not currently used
- `yellow300: #FAB422` - **SECONDARY/WARNING COLOR**
- `yellow400: #DC9804` - Objective badge text
- `yellow500: #A06E03` - Objective badge text (darker)
- `yellow600: #644502` - Not currently used

**Usage:**
- "Paid Media" objective badges (bg: yellow50, text: yellow500)
- "Product Launch" objective badges
- Warning states, pending status

#### **Blue-Gray Shades** (Dark palette)
- `blueGray50: #5F7195` - Not currently used
- `blueGray100: #505F7C` - Not currently used
- `blueGray200: #404C64` - Icons, package dots, objective fallback
- `blueGray300: #30394B` - Secondary button text, package text
- `blueGray400: #202632` - Not currently used
- `blueGray500: #101319` - **BRAND BLACK** (headers, titles, primary text)
- `blueGray600: #08090C` - Extra dark

**Usage:**
- Brand placeholders icons
- Campaign titles, brand names
- Package type indicators
- Secondary action text

#### **Cool Gray Shades** (Light palette - THE BACKGROUND!)
- `gray50: #FFFFFF` - White (cards)
- `gray100: #E7E9EF` - Very light
- `gray200: #CED2DE` - Borders, dividers
- `gray300: #B6BCCE` - Not currently used
- `gray400: #9DA5BE` - Not currently used
- `gray500: #858FAD` - Not currently used
- `gray600: #6C789D` - **PAGE BACKGROUND** (your cool gray!)

**Usage:**
- `background: gray600` - Main app background (that cool gray you wanted!)
- `border: gray200` - All borders and dividers
- Card backgrounds: white (gray50)

---

### 🎨 OBJECTIVE BADGE COLORS (Consistent System)

Each objective uses your brand color shades:

1. **Paid Media Campaigns**
   - Background: `yellow50` (#FEF2D7)
   - Text/Icon: `yellow500` (#A06E03)
   - Icon: `campaign`

2. **Organic Social Channels**
   - Background: `turquoise50` (#EDFDFC)
   - Text/Icon: `turquoise500` (#0C6F6A)
   - Icon: `share`

3. **E-commerce Web Pages**
   - Background: `pink50` (#FDECF5)
   - Text/Icon: `pink500` (#A8105E)
   - Icon: `shopping-cart`

4. **Creative Asset Production**
   - Background: `pink50` (#FDECF5)
   - Text/Icon: `pink400` (#E0157E)
   - Icon: `palette`

5. **Brand Awareness**
   - Background: `turquoise50` (#EDFDFC)
   - Text/Icon: `turquoise400` (#11A69F)
   - Icon: `star`

6. **Product Launch**
   - Background: `yellow50` (#FEF2D7)
   - Text/Icon: `yellow400` (#DC9804)
   - Icon: `rocket-launch`

---

### 📦 SHIPPING BADGE COLORS (Consistent System)

**Products Included:**
- Background: `turquoise50` (#EDFDFC)
- Text/Icon: `turquoise500` (#0C6F6A)
- Icon: `card-giftcard`

**Content Only:**
- Background: `pink50` (#FDECF5)
- Text/Icon: `pink400` (#E0157E)
- Icon: `edit`

---

### 🎯 BUTTON SYSTEM (100% Consistent)

**Primary Buttons** (Login, Apply, etc.)
```
backgroundColor: turquoise400 (#11A69F) - Darker turquoise
textColor: white
```

**Secondary Buttons** (Create Account, Cancel)
```
backgroundColor: white
borderColor: gray200 (#CED2DE)
textColor: blueGray300 (#30394B)
```

**Disabled Buttons**
```
opacity: 0.5
```

---

### 📱 SCREEN COLORS

**Page Background:** `gray600` (#6C789D) - That beautiful cool gray!

**Cards:**
- Background: White
- Border: `gray200` (#CED2DE)
- Shadow: Subtle (opacity 0.05)

**Text Hierarchy:**
- Headers/Titles: `blueGray500` (#101319) - Brand black
- Body text: `blueGray200` (#404C64)
- Secondary text: `blueGray100` (#505F7C)

---

### ✅ FILTER MODAL (Fixed!)

- **No scrolling needed** - Removed ScrollView wrapper
- **Clean white background** - No alternating row colors
- **Consistent spacing** - Clean, professional layout
- Primary button: turquoise400 (#11A69F)

---

### 🎨 THE RESULT

**Your app now has:**
- ✅ Beautiful cool gray background (#6C789D)
- ✅ All objective badges use your brand color shades consistently
- ✅ Shipping badges use turquoise and pink shades properly
- ✅ Primary button is darker turquoise (#11A69F) everywhere
- ✅ Professional, consistent color application
- ✅ No random colors - everything from YOUR palette!

**The vibe:** Modern, hip, professional - brands will take it seriously! 🚀
