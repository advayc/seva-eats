# Seva Eats - Project Context Document

## Executive Summary

**Seva Eats** is a React Native mobile application that connects people experiencing food insecurity with free langar meals through a community-driven volunteer delivery network. The app enables recipients to request culturally-authentic meals for delivery to partner shelters and community drop-off locations with dignity, transparency, and zero barriers—no payment, no paperwork, no questions asked.

This document serves as a comprehensive Product Requirements Document (PRD) and technical reference for understanding the project's architecture, design system, user flows, and implementation details.

---

## Table of Contents

1. [Vision & Mission](#vision--mission)
2. [Product Overview](#product-overview)
3. [Target Users](#target-users)
4. [Technical Architecture](#technical-architecture)
5. [Design System](#design-system)
6. [Feature Specifications](#feature-specifications)
7. [User Flows](#user-flows)
8. [Data Model](#data-model)
9. [Development Guidelines](#development-guidelines)
10. [Future Roadmap](#future-roadmap)

---

## Vision & Mission

### Vision
To eliminate food insecurity in communities by leveraging the Sikh tradition of langar (community kitchen) through modern technology, creating a dignity-centered ecosystem where anyone can access nutritious meals without stigma.

### Mission
Build a mobile platform that:
- Connects recipients with free meals from gurdwara distribution hubs
- Empowers community volunteers to deliver meals with transparency
- Maintains recipient dignity through privacy-first, barrier-free access
- Scales the langar tradition beyond physical gurdwara locations

### Core Values
1. **Dignity First**: No payment, paperwork, or invasive questions
2. **Cultural Authenticity**: Rooted in Sikh langar principles of equality and service
3. **Community-Driven**: Powered by volunteers, not gig workers
4. **Transparency**: Real-time tracking and clear communication
5. **Accessibility**: Simple, warm, and welcoming for all backgrounds

---

## Product Overview

### What is Seva Eats?

Seva Eats is a two-sided marketplace connecting:
- **Recipients**: Individuals or shelters requesting free meals
- **Volunteers (Dashers)**: Community members delivering meals from pickup hubs

**Current Beta Focus**: Partner shelter drop-offs in the Greater Toronto Area (Brampton, Mississauga)

### Key Differentiators

| Feature | Seva Eats | Traditional Food Banks | Food Delivery Apps |
|---------|-----------|------------------------|-------------------|
| Cost | 100% Free | Free | Paid |
| Barriers | None | Paperwork, proof of need | Credit card required |
| Cultural Foods | Authentic langar meals | Generic donations | Restaurant variety |
| Delivery Model | Volunteer-driven | Self-pickup | Gig economy |
| Privacy | Minimal data collection | Extensive documentation | Account required |
| Transparency | Live tracking with map | None | Basic tracking |

### Success Metrics (As of Beta Launch)
- **12,847** meals delivered
- **892** shelters and individuals served
- **234** active volunteers
- **4.8/5** average recipient satisfaction (future metric)

---

## Target Users

### Primary User Persona: Meal Recipient

**Demographics:**
- Age: 18-65+
- Location: Urban areas near gurdwara hubs (GTA initial launch)
- Situation: Experiencing temporary or chronic food insecurity
- Tech proficiency: Low to medium (smartphone access assumed)

**Needs:**
- Immediate access to nutritious meals
- Delivery to safe locations (shelters, community centers)
- No financial barriers or bureaucratic hurdles
- Respectful, dignified service

**Pain Points:**
- Stigma associated with food assistance programs
- Transportation barriers to food banks
- Cultural dietary preferences not met by generic donations
- Unpredictable meal availability at shelters

### Secondary User Persona: Volunteer Dasher (Future Feature)

**Demographics:**
- Age: 16-70
- Motivation: Community service, religious duty (seva)
- Availability: Flexible hours (lunch/dinner windows)
- Transportation: Personal vehicle

**Needs:**
- Clear pickup/delivery instructions
- Route optimization
- Recognition for contributions
- Flexible scheduling

---

## Technical Architecture

### Tech Stack

**Frontend Framework:**
- **React Native**: Cross-platform mobile development (iOS/Android)
- **Expo SDK 55**: Managed workflow with preview features
- **TypeScript 5.9**: Type safety and developer experience

**Navigation:**
- **Expo Router**: File-based routing system (inspired by Next.js)
- Routes automatically generated from `/app` folder structure

**State Management:**
- **React Context API**: Global state (user, location, requests, theme)
- **AsyncStorage**: Local persistence for offline-first architecture
- **JSON Serialization**: Simple data storage without complex ORM

**UI & Animations:**
- **React Native Reanimated 4.2**: 60fps animations on UI thread
- **React Native Gesture Handler**: Touch interactions
- **React Native Maps**: Interactive map with markers and polylines
- **Expo Image**: Optimized image loading with blurhash

**Location Services:**
- **expo-location**: GPS positioning and reverse geocoding
- **Foreground permissions**: Request on-demand (no background tracking)

**Development Tools:**
- **ESLint**: Code linting with Expo config
- **TypeScript**: Strict type checking
- **Git**: Version control (repository structure visible)

### Project Structure

```
sewa-eats/
├── app/                          # Expo Router screens
│   ├── (onboarding)/             # Onboarding flow
│   │   └── index.tsx             # "How it works" intro
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.tsx             # Home screen (primary CTA)
│   │   └── explore.tsx           # Discover locations
│   ├── request/                  # Meal request flow
│   │   ├── location.tsx          # Hub selection
│   │   ├── new.tsx               # Meal picker
│   │   ├── details.tsx           # Delivery form
│   │   └── [id].tsx              # Live tracking
│   ├── requests/                 # Request management
│   │   ├── active.tsx            # In-progress list
│   │   └── history.tsx           # Completed requests
│   ├── profile.tsx               # User profile editor
│   ├── locations.tsx             # Map view of hubs
│   ├── support.tsx               # Help & contact
│   ├── _layout.tsx               # Root layout with providers
│   └── index.tsx                 # Landing screen
├── components/                   # Reusable UI components
│   ├── quick-action-card.tsx     # Animated home cards
│   ├── location-picker.tsx       # Address input + map
│   ├── proof-of-delivery.tsx     # Photo upload (future)
│   ├── themed-text.tsx           # Theme-aware text
│   ├── themed-view.tsx           # Theme-aware containers
│   └── ui/                       # Base design system
├── context/                      # Global state providers
│   ├── UserContext.tsx           # Profile & preferences
│   ├── LocationContext.tsx       # GPS services
│   ├── RequestContext.tsx        # Meal request lifecycle
│   ├── ThemeContext.tsx          # Light/dark mode
│   └── types.ts                  # Shared TypeScript types
├── constants/                    # Static configuration
│   ├── theme.ts                  # Design tokens
│   ├── meals.ts                  # Meal options & icons
│   └── mock-data.ts              # Sample locations/stats
├── hooks/                        # Custom React hooks
│   └── use-theme-colors.ts       # Color resolver
├── assets/                       # Static files
│   ├── images/                   # Logos, illustrations
│   └── fonts/                    # Custom fonts (if any)
├── .expo/                        # Expo build artifacts
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── README.md                     # Setup instructions
```

### State Management Architecture

**Context Providers Hierarchy:**
```tsx
<ThemeProvider>              // Theme mode (light/dark/system)
  <UserProvider>             // User profile & saved addresses
    <LocationProvider>       // GPS location services
      <RequestProvider>      // Meal request state
        <App />
      </RequestProvider>
    </LocationProvider>
  </UserProvider>
</ThemeProvider>
```

**Data Persistence:**
- All contexts use AsyncStorage for offline persistence
- Keys: `@user_profile`, `@requests`, `@theme_preference`, `@location`
- JSON serialization for simple read/write
- Data persists across app restarts

**Request Lifecycle (Automated Simulation):**
```typescript
pending → matched → picked_up → on_the_way → delivered
(0-10s)   (+12s)    (+20s)      (+35s)       (final)
```

---

## Design System

### Color Palette

The app uses a **warm, approachable** color scheme inspired by the welcoming nature of langar service. The primary color is a vibrant orange that evokes community warmth, while backgrounds use creamy tones to create comfort.

#### Light Mode

**Primary Colors:**
```typescript
primary: '#F97316'        // Orange 500 (brand accent)
primaryLight: '#FED7AA'   // Orange 200 (subtle highlights)
primaryDark: '#EA580C'    // Orange 600 (hover/pressed states)
```

**Neutral Colors:**
```typescript
background: '#FFF8F0'     // Creamy white (warm base)
surface: '#FFFFFF'        // Pure white (elevated cards)
border: '#E5E7EB'         // Gray 200 (subtle dividers)
borderLight: '#F3F4F6'    // Gray 100 (very light borders)
```

**Text Colors:**
```typescript
text: '#181A18'           // Soft black (primary text)
textSecondary: '#6B7280'  // Gray 500 (labels, metadata)
textTertiary: '#9CA3AF'   // Gray 400 (disabled text)
```

**Semantic Colors:**
```typescript
success: '#10B981'        // Emerald 500 (delivered state)
successLight: '#D1FAE5'   // Emerald 100 (success backgrounds)
warning: '#F59E0B'        // Amber 500 (warnings)
error: '#EF4444'          // Red 500 (destructive actions)
info: '#3B82F6'           // Blue 500 (informational)
```

**Status Badge Colors:**
```typescript
pending: '#F59E0B'        // Amber (searching)
matched: '#3B82F6'        // Blue (driver assigned)
pickedUp: '#8B5CF6'       // Violet (in transit)
onTheWay: '#F97316'       // Orange (delivering)
delivered: '#10B981'      // Emerald (complete)
cancelled: '#6B7280'      // Gray (cancelled)
```

#### Dark Mode

**Primary Colors:**
```typescript
primary: '#F97316'        // Orange 500 (maintains brand)
primaryLight: '#FB923C'   // Orange 400 (lighter for dark bg)
primaryDark: '#C2410C'    // Orange 700 (darker accents)
```

**Neutral Colors:**
```typescript
background: '#181A18'     // Soft black (base)
surface: '#1F211F'        // Gray 900 (card elevation level 1)
surfaceElevated: '#262826' // Slightly lighter (level 2)
border: '#404040'         // Visible dividers in dark mode
borderLight: '#333333'    // Subtle dividers
```

**Text Colors:**
```typescript
text: '#FAFAFA'           // Soft white (primary text)
textSecondary: '#9CA3AF'  // Gray 400 (labels)
textTertiary: '#6B7280'   // Gray 500 (disabled)
```

**Semantic Colors:**
```typescript
success: '#34D399'        // Emerald 400 (brighter for dark)
successLight: '#064E3B'   // Emerald 900 (dark bg)
warning: '#FBBF24'        // Amber 400
error: '#F87171'          // Red 400
info: '#60A5FA'           // Blue 400
```

### Typography

**Font Family:**
- iOS: SF Pro Display variants (`ui-serif`, `ui-rounded`)
- Android: System default (Roboto)
- Weight: 400 (regular), 600 (semibold), 700 (bold), 800 (extrabold)

**Type Scale:**
```typescript
xxxs: 11px    // Tiny labels, timestamps
xxs: 12px     // Metadata, captions
xs: 13px      // Secondary labels
sm: 14px      // Body text, form labels
base: 16px    // Primary body text
lg: 18px      // Card titles
xl: 20px      // Section headers
xxl: 24px     // Screen titles
xxxl: 28px    // Page headers
huge: 36px    // Hero text
```

**Letter Spacing:**
- Headlines: `-0.025em` (tighter, modern feel)
- Body: `0` (standard)
- All-caps labels: `0.05em` (better readability)

**Line Heights:**
- Tight: `1.2` (headlines)
- Normal: `1.5` (body text)
- Relaxed: `1.75` (long-form content)

### Spacing System

Based on 4px base unit for consistent rhythm:

```typescript
xs: 4px       // Tight element spacing
sm: 8px       // Form element gaps
md: 12px      // Card padding (small)
lg: 16px      // Standard padding
xl: 24px      // Section spacing
xxl: 32px     // Large gaps between sections
xxxl: 48px    // Hero section padding
```

### Border Radius

Creates a friendly, approachable aesthetic:

```typescript
xs: 4px       // Subtle rounding (badges)
sm: 6px       // Small buttons
md: 12px      // Standard cards
lg: 16px      // Large cards
xl: 24px      // Prominent CTAs
xxl: 28px     // Hero elements
full: 9999px  // Circular elements (avatars, icon containers)
```

### Shadows

**Light Mode:**
```typescript
card: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 2,          // Android
}

floating: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 8,
}
```

**Dark Mode:**
```typescript
card: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,    // Stronger for visibility
  shadowRadius: 5,
  elevation: 2,
}

floating: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.5,
  shadowRadius: 12,
  elevation: 10,
}
```

### Animation Principles

**Spring Physics (React Native Reanimated):**
```typescript
withSpring(value, {
  damping: 15,           // Moderate bounce
  stiffness: 150,        // Responsive
  mass: 1,
})
```

**Timing Curves:**
- Quick interactions: 200ms ease-out
- Card transitions: 300ms ease-in-out
- Modal entrances: 400ms spring

**Entrance Animations:**
```typescript
<Animated.View entering={FadeInDown.delay(100).springify()}>
  // Staggered card entrance with spring physics
</Animated.View>
```

**Interactive Feedback:**
- Button press: Scale down to 0.96
- Card press: Scale down to 0.98
- Haptic feedback on iOS (light impact)

### UI Component Patterns

#### Buttons

**Primary CTA:**
- Background: `primary` color
- Text: White, bold
- Padding: `lg` vertical, `xl` horizontal
- Border radius: `xl`
- Shadow: `floating`
- Press animation: Scale 0.96

**Secondary Button:**
- Background: Transparent
- Border: 1px `primary` color
- Text: `primary` color, semibold
- Padding: `lg` vertical, `xl` horizontal
- Border radius: `xl`

**Tertiary (Text Button):**
- Background: Transparent
- Text: `primary` color, semibold
- No border
- Underline on press

#### Cards

**Standard Card:**
```tsx
<View style={{
  backgroundColor: colors.surface,
  borderRadius: theme.borderRadius.md,
  padding: theme.spacing.lg,
  ...theme.shadows.card,
}}>
```

**Elevated Card (important content):**
```tsx
<View style={{
  backgroundColor: colors.surface,
  borderRadius: theme.borderRadius.lg,
  padding: theme.spacing.xl,
  ...theme.shadows.floating,
}}>
```

**Interactive Card (tappable):**
- Add press animation: `scale(0.98)`
- Haptic feedback on press
- Highlight border on focus

#### Status Badges

Rounded pill badges with icon + text:
```tsx
<View style={{
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: theme.spacing.md,
  paddingVertical: theme.spacing.sm,
  borderRadius: theme.borderRadius.full,
  backgroundColor: colors.statusBackground,
}}>
  <Icon name="status-icon" size={14} color={colors.statusText} />
  <Text style={{ color: colors.statusText, marginLeft: 4 }}>
    Status Label
  </Text>
</View>
```

#### Form Inputs

**Text Input:**
```tsx
<TextInput
  style={{
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    fontSize: theme.fontSize.base,
    color: colors.text,
  }}
  placeholderTextColor={colors.textTertiary}
/>
```

**Focus State:**
- Border color: `primary`
- Border width: 2px
- Subtle glow (iOS shadow)

---

## Feature Specifications

### 1. Landing Screen (`/index.tsx`)

**Purpose:** Primary entry point for new and returning users.

**Components:**
- **Hero Section:**
  - Logo (Seva Eats branding)
  - Headline: "Request a free langar meal near you"
  - Subtext: "No payment, no paperwork"
  - CTA button: "Request a Meal" → `/request/location`
  
- **Stats Display:**
  - Meals delivered: 12,847
  - Shelters served: 892
  - Active volunteers: 234
  - Layout: 3-column grid with icons

- **Secondary Actions:**
  - "Learn how it works" → `/onboarding`
  - "View nearby locations" → `/locations`

**Design Notes:**
- Use `huge` font size for headline
- Orange gradient background at top
- Floating CTA button with shadow
- Fade-in animation on mount

---

### 2. Meal Request Flow

#### 2.1 Hub Selection (`/request/location.tsx`)

**Purpose:** Choose pickup location for meal preparation.

**Data Displayed:**
- Hub name (e.g., "Brampton Distribution Hub")
- Address (street, city)
- Distance from user (e.g., "2.3 km away")
- Meals available (e.g., "127 meals available")
- Next delivery window (e.g., "Next pickup: 12:00 PM - 2:00 PM")

**Interactions:**
- List view (default) or map view toggle
- Filter by distance/availability
- Select hub → Proceed to meal selection

**Validation:**
- Must select a hub before continuing
- Show warning if hub has low availability (<10 meals)

---

#### 2.2 Meal Selection (`/request/new.tsx`)

**Purpose:** Choose meal items and quantities.

**Meal Options:**

**Main Courses:**
1. Dal & Rice
   - Icon: `🍛`
   - Description: "Lentils with basmati rice"
   - Serves: 2-3 people

2. Roti & Sabzi
   - Icon: `🫓`
   - Description: "Chapatis with seasonal curry"
   - Serves: 2-3 people

3. Dal & Roti
   - Icon: `🍽️`
   - Description: "Lentils with chapatis"
   - Serves: 2-3 people

4. Sabzi & Rice
   - Icon: `🥘`
   - Description: "Mixed vegetable curry with rice"
   - Serves: 2-3 people

5. Sambar & Rice
   - Icon: `🍲`
   - Description: "South Indian lentil stew"
   - Serves: 2-3 people

**Desserts:**
6. Kheer
   - Icon: `🍮`
   - Description: "Sweet rice pudding"
   - Serves: 3-4 people

**UI Pattern:**
- Grid layout (2 columns on phone, 3 on tablet)
- Each meal card:
  - Icon in colored circle
  - Meal name (bold)
  - Description (secondary text)
  - Serving size (tertiary text)
  - Quantity controls (+/- buttons)
  - Current quantity badge

**Bottom Summary Bar:**
- Total meals selected: `X items`
- CTA: "Continue" → `/request/details`
- Disable if total = 0

**Animations:**
- Spring animation on quantity change
- Scale press on meal cards
- Haptic feedback on +/- buttons

---

#### 2.3 Delivery Details (`/request/details.tsx`)

**Purpose:** Collect delivery information and preferences.

**Form Fields:**

1. **Personal Information:**
   - Recipient Name (text input, required)
   - Phone Number (tel input, required, format: (XXX) XXX-XXXX)

2. **Delivery Location:**
   - Address (autocomplete text input)
   - Quick-fill button: "Use my current location" (GPS)
   - Map preview (optional)
   - Default: Selected hub address (for shelter drop-offs)

3. **Serving Size:**
   - Segmented control: 1 / 2 / 3 servings
   - Default: 2

4. **Delivery Window:**
   - Radio buttons:
     - 12:00 PM - 2:00 PM
     - 2:00 PM - 4:00 PM
     - 6:00 PM - 8:00 PM
   - Default: Next available window

5. **Delivery Preference:**
   - Radio buttons:
     - Leave at door
     - Hand to me
   - Default: Leave at door

6. **Optional: Driver Note:**
   - Multiline text input (200 char limit)
   - Placeholder: "Give a message to your driver ❤️ (optional)"
   - Example: "Thank you for your service!"

7. **Optional: Donation:**
   - Checkbox: "Support packaging & delivery costs"
   - Amounts: $2 / $5 / $10 / Custom
   - Payment method: Link to Stripe (future)
   - Note: "100% optional - never required"

**Validation:**
- Name: 2-50 characters
- Phone: Valid North American format
- Address: Must have street + city
- Window: Must be in future

**Submit Button:**
- Label: "Submit Request"
- Loading state: Spinner + "Submitting..."
- Success: Navigate to `/request/[id]` with new request ID

---

#### 2.4 Request Tracking (`/request/[id].tsx`)

**Purpose:** Real-time visibility into meal delivery status.

**Status Stages:**

1. **Pending** (Amber badge)
   - Description: "Finding a volunteer driver"
   - ETA: Not shown yet
   - Duration: 0-10 seconds (simulated)

2. **Matched** (Blue badge)
   - Description: "Driver assigned"
   - Driver info card appears:
     - Name: "Volunteer Driver" (or actual name if `showVolunteerName: true`)
     - Vehicle: "Silver Honda Civic" (if provided)
     - Rating: ⭐ 4.9 (future)
   - ETA: Calculated (e.g., "Estimated delivery: 1:45 PM")
   - Duration: ~12 seconds

3. **Picked Up** (Violet badge)
   - Description: "Meal picked up from hub"
   - Map updates: Driver location appears at hub
   - ETA: Refined estimate
   - Duration: ~20 seconds

4. **On the Way** (Orange badge)
   - Description: "Delivering your meal"
   - Map updates: Driver location moves along route
   - ETA: Live countdown (e.g., "Arriving in 8 min")
   - Driver location dot animates along polyline
   - Duration: ~35 seconds

5. **Delivered** (Emerald badge)
   - Description: "Your meal has been delivered!"
   - Confetti animation (future)
   - Show: "Thank you for using Seva Eats"
   - Action: "Rate your experience" (future)

**Cancelled State:**
- Gray badge: "Request cancelled"
- Show cancellation timestamp
- No map updates

**Map Visualization:**

**Markers:**
- Pickup hub: Orange storefront icon (📍)
- Delivery location: Green home icon (🏠)
- Driver: Orange car icon (🚗), only when `status >= picked_up`

**Route Polyline:**
- Color: `primary` (orange)
- Width: 4px
- Dash pattern: `[1, 10]` (dashed line)
- Draws from hub → delivery location

**Driver Location:**
- Interpolated position between hub and delivery
- Progress: `(currentTime - pickupTime) / totalDeliveryTime`
- Smooth animation using `withTiming`

**Map Controls:**
- Fullscreen toggle
- Re-center button
- Zoom to fit all markers

**Request Details Card:**
- Meals ordered (list with quantities)
- Serving size
- Delivery window
- Special instructions (if provided)
- Total meals count

**Cancel Button:**
- Only shown if `status !== 'delivered' && status !== 'cancelled'`
- Confirmation dialog: "Are you sure you want to cancel this request?"
- Destructive style (red text)

**Refresh Behavior:**
- Auto-update every 5 seconds (if status !== delivered)
- Pull-to-refresh gesture
- Show last updated timestamp

---

### 3. Profile Management (`/profile.tsx`)

**Purpose:** Edit saved user information for faster future requests.

**Editable Fields:**
- Full Name
- Phone Number
- Default Home Address (with map picker)
- Default Serving Size (1-3)

**Saved Addresses:**
- List of frequently used addresses
- Add new address
- Edit/delete saved addresses
- Set one as default

**Preferences:**
- Default delivery window
- Notification settings (future)
- Language preference (future: English/Punjabi/Hindi)

**Data Management:**
- "Clear All Data" button (destructive)
- Confirmation: "This will erase all saved information and request history"
- Does NOT require account (local storage only)

**Save Behavior:**
- Auto-save on blur (no "Save" button)
- Toast notification: "Profile updated"

---

### 4. Request Management

#### 4.1 Active Requests (`/requests/active.tsx`)

**Purpose:** View all in-progress meal deliveries.

**List View:**
- Card per request:
  - Request ID (e.g., "REQ-1234")
  - Status badge (color-coded)
  - Meals summary (e.g., "3 items: Dal & Rice x2, Kheer x1")
  - Delivery address (truncated)
  - ETA or delivery window
  - "View Details" button → `/request/[id]`

**Empty State:**
- Illustration: Empty plate
- Text: "No active requests"
- CTA: "Request a Meal"

**Sorting:**
- Default: Most recent first
- Filter by status (future)

---

#### 4.2 Request History (`/requests/history.tsx`)

**Purpose:** View past requests (delivered or cancelled).

**List View:**
- Card per request:
  - Date (relative: "Today", "2 days ago", "Mar 15, 2026")
  - Status: "Delivered" or "Cancelled"
  - Meals summary
  - Driver name (if applicable)
  - "View Receipt" button (future)

**Empty State:**
- Text: "No past requests yet"

**Filters (Future):**
- Date range
- Status (delivered/cancelled)
- Search by driver name

---

### 5. Map & Locations (`/locations.tsx`)

**Purpose:** Explore all available pickup hubs.

**Map View:**
- All hubs displayed as orange markers
- Cluster markers if zoomed out (future)
- Tap marker → Info card:
  - Hub name
  - Address
  - Distance from user
  - Available meals
  - "Request from this hub" button

**List Toggle:**
- Switch to list view of hubs
- Sort by distance/availability

---

### 6. Support & Help (`/support.tsx`)

**Purpose:** Contact support or access resources.

**Contact Options:**
- "Call Support Specialist" → `tel:` link
- "Send Email" → `mailto:` link
- "Chat with us" (future: in-app chat)

**FAQ Sections:**
- "How does Seva Eats work?"
- "Who can request meals?"
- "Is there really no cost?"
- "What if my driver doesn't arrive?"
- "How do I become a volunteer driver?"

**Legal Links:**
- Terms of Service
- Privacy Policy
- Community Guidelines

---

## User Flows

### Primary Flow: Request a Meal (Happy Path)

```
1. User opens app
   ↓
2. Landing screen: Tap "Request a Meal"
   ↓
3. Hub Selection: Browse nearby hubs → Select "Brampton Distribution Hub"
   ↓
4. Meal Selection: Add "Dal & Rice" (x2), "Kheer" (x1) → Tap "Continue"
   ↓
5. Delivery Details:
   - Enter name: "Priya Sharma"
   - Enter phone: "(416) 555-1234"
   - Delivery address: Pre-filled with hub address
   - Serving size: 2 people
   - Window: "12:00 PM - 2:00 PM"
   - Preference: "Leave at door"
   - Note: "Thank you for your kindness 🙏"
   → Tap "Submit Request"
   ↓
6. Request Tracking:
   - Status: Pending (10s) → Matched → Picked Up → On the Way → Delivered
   - Map shows driver route in real-time
   - ETA updates as driver approaches
   ↓
7. Delivered:
   - Status badge turns green
   - "Your meal has been delivered!"
   - Optional: Rate experience (future)
   ↓
8. Request moves to History
```

### Secondary Flow: Edit Profile Before Requesting

```
1. User opens app
   ↓
2. Tap profile icon (top right)
   ↓
3. Profile screen:
   - Edit name: "Amit Singh"
   - Edit phone: "(647) 555-9876"
   - Add home address: "123 Main St, Brampton ON"
   - Set serving size: 3
   ↓
4. Auto-saved → Toast: "Profile updated"
   ↓
5. Navigate back → Tap "Request a Meal"
   ↓
6. Details form pre-fills with saved profile data
   ↓
7. Continue with request flow...
```

### Edge Case Flow: Cancel Request

```
1. User submits request
   ↓
2. Tracking screen: Status = "Matched"
   ↓
3. User realizes they need to cancel
   ↓
4. Tap "Cancel Request" button
   ↓
5. Confirmation dialog: "Are you sure?"
   → Tap "Yes, Cancel"
   ↓
6. Request status → "Cancelled"
   ↓
7. Driver notified (future: push notification)
   ↓
8. Request moves to History
```

---

## Data Model

### User Profile

```typescript
interface UserProfile {
  id: string;                    // UUID
  name: string;                  // Full name
  phoneNumber: string;           // E.164 format: +14165551234
  defaultAddress?: Address;      // Home address
  defaultServingSize: number;    // 1-3
  savedAddresses: Address[];     // Frequent locations
  createdAt: Date;
  updatedAt: Date;
}
```

### Address

```typescript
interface Address {
  street: string;                // "123 Main St"
  city: string;                  // "Brampton"
  province: string;              // "ON"
  postalCode: string;            // "L6T 1A2"
  country: string;               // "Canada"
  latitude: number;              // 43.7315
  longitude: number;             // -79.7624
  label?: string;                // "Home", "Shelter", etc.
}
```

### Meal Request

```typescript
interface MealRequest {
  id: string;                    // UUID
  status: RequestStatus;         // Current stage
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: Address;
  servingSize: number;           // 1-3
  meals: MealItem[];             // Selected meals
  pickupLocation: PickupHub;     // Distribution hub
  deliveryWindow: TimeWindow;    // Requested time slot
  deliveryPreference: 'door' | 'hand-to-me';
  driverNote?: string;           // Optional message
  donation?: number;             // Optional amount in cents
  assignedDriver?: Driver;       // Volunteer (if matched)
  estimatedDelivery?: Date;      // ETA
  actualDelivery?: Date;         // Completion time
  createdAt: Date;
  updatedAt: Date;
}

type RequestStatus = 
  | 'pending'      // Searching for driver
  | 'matched'      // Driver assigned
  | 'picked_up'    // Meal collected
  | 'on_the_way'   // En route
  | 'delivered'    // Complete
  | 'cancelled';   // Cancelled by user/driver
```

### Meal Item

```typescript
interface MealItem {
  id: string;                    // Meal type ID
  name: string;                  // "Dal & Rice"
  description: string;           // "Lentils with basmati rice"
  icon: string;                  // Material icon name
  servingSize: string;           // "Serves 2-3"
  quantity: number;              // Number of portions
  category: 'main' | 'dessert';
}
```

### Pickup Hub

```typescript
interface PickupHub {
  id: string;
  name: string;                  // "Brampton Distribution Hub"
  address: Address;
  mealsAvailable: number;        // Current inventory
  operatingHours: TimeWindow[];  // Daily schedules
  contactPhone?: string;
  partnerProgram: string;        // "Gurdwara Nanaksar"
}
```

### Driver (Volunteer)

```typescript
interface Driver {
  id: string;
  name: string;                  // Only shown if showVolunteerName = true
  phoneNumber: string;           // Only for support contact
  vehicle?: {
    make: string;                // "Honda"
    model: string;               // "Civic"
    color: string;               // "Silver"
    licensePlate?: string;       // Masked: "ABC ***"
  };
  currentLocation?: {
    latitude: number;
    longitude: number;
    heading?: number;            // Direction of travel
  };
  rating?: number;               // 0-5 stars (future)
  totalDeliveries: number;       // Lifetime count
  showVolunteerName: boolean;    // Privacy opt-in
}
```

### Time Window

```typescript
interface TimeWindow {
  start: string;                 // ISO 8601 time: "12:00:00"
  end: string;                   // "14:00:00"
  dayOfWeek?: number;            // 0-6 (Sunday-Saturday)
}
```

---

## Development Guidelines

### Code Style

**TypeScript:**
- Strict mode enabled
- Explicit return types for functions
- Avoid `any` (use `unknown` if necessary)
- Interface over type alias for object shapes

**React Patterns:**
- Functional components only
- Custom hooks for shared logic (prefix: `use*`)
- Context for global state, props for local state
- Avoid prop drilling (max 2-3 levels)

**Naming Conventions:**
- Components: PascalCase (`MealCard.tsx`)
- Hooks: camelCase with `use` prefix (`useThemeColors.ts`)
- Constants: UPPER_SNAKE_CASE (`MAX_MEALS_PER_REQUEST`)
- Files: kebab-case (`meal-request-form.tsx`)

**File Organization:**
```typescript
// 1. Imports (React, libraries, local)
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';

// 2. Types/Interfaces
interface MealCardProps {
  meal: MealItem;
  onPress: () => void;
}

// 3. Component
export function MealCard({ meal, onPress }: MealCardProps) {
  // 3a. Hooks
  const colors = useThemeColors();
  const [count, setCount] = useState(0);
  
  // 3b. Handlers
  const handleIncrement = () => setCount(c => c + 1);
  
  // 3c. Render
  return (
    <View>
      <Text>{meal.name}</Text>
    </View>
  );
}

// 4. Styles (if StyleSheet used)
const styles = StyleSheet.create({ ... });
```

### Git Workflow

**Branch Naming:**
- Features: `feature/meal-selection-ui`
- Bugs: `fix/map-marker-crash`
- Refactors: `refactor/context-providers`

**Commit Messages:**
```
type(scope): short description

- Detailed change 1
- Detailed change 2

[Optional: References #123]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructure (no behavior change)
- `style`: Design/UI updates
- `docs`: Documentation
- `test`: Add/update tests
- `chore`: Build/config changes

**Example:**
```
feat(request): add real-time driver location tracking

- Interpolate driver position between hub and delivery
- Animate marker movement with smooth timing
- Update ETA based on distance remaining
- Add route polyline visualization

Closes #45
```

### Testing Strategy (Future)

**Unit Tests:**
- Context providers (state management)
- Custom hooks (data transformation)
- Utility functions (date formatting, distance calculation)

**Integration Tests:**
- Complete user flows (request submission)
- Navigation stack
- AsyncStorage persistence

**E2E Tests (Detox):**
- Critical path: Request meal → Track → Deliver
- Profile editing
- Theme switching

**Accessibility Tests:**
- Screen reader labels
- Color contrast ratios
- Touch target sizes (min 44x44)

---

## Future Roadmap

### Phase 1: Beta Launch (Current)
- ✅ Recipient meal requests
- ✅ Request tracking with simulated updates
- ✅ Profile management
- ✅ Light/dark theme
- ✅ Offline persistence
- 🚧 Partner shelter drop-offs only

### Phase 2: Driver Portal (Q2 2026)
- Driver app/mode toggle
- Accept/reject delivery requests
- Turn-by-turn navigation integration
- Proof of delivery (photo upload)
- Driver ratings

### Phase 3: Backend Integration (Q3 2026)
- Firebase/Supabase backend
- Real-time database for requests
- Push notifications (status updates)
- Authentication (optional phone login)
- Payment processing (donations)

### Phase 4: Community Features (Q4 2026)
- Dasher leaderboards
- Impact stats (personal + community)
- Thank-you notes from recipients
- Volunteer spotlights
- Referral system

### Phase 5: Scale & Expand (2027)
- Multi-city launch (Vancouver, Calgary, Montreal)
- Multi-language support (Punjabi, Hindi, Urdu)
- Dietary preferences (vegan, gluten-free)
- Scheduled recurring deliveries
- Corporate sponsor matching

### Long-Term Vision
- Open API for partner organizations
- White-label solution for other communities
- Integration with existing food banks
- Predictive meal demand forecasting
- Carbon offset tracking for deliveries

---

## Appendix

### Key Decisions Log

**Why Expo over bare React Native?**
- Faster iteration for MVP
- Built-in location/map libraries
- OTA updates for rapid bug fixes
- Easier onboarding for contributors

**Why Context API over Redux?**
- Simpler mental model for small team
- Less boilerplate
- AsyncStorage integration straightforward
- App state is simple (CRUD operations)

**Why simulated backend?**
- Prove UX before infrastructure investment
- Faster prototyping
- Easier user testing without server costs
- Migration path clear (swap Context with API calls)

**Why orange primary color?**
- Evokes warmth, community, nourishment
- High visibility for CTAs
- Differentiates from "corporate blue" food apps
- Aligns with Sikh flag colors (respectful nod)

**Why shelter-first vs. direct-to-home?**
- Build trust with partner organizations
- Easier driver logistics (bulk drop-offs)
- Reduces no-show risk
- Scales volunteer capacity efficiently
- Privacy protection for recipients

---

### Glossary

- **Langar**: Sikh tradition of free community meals served at gurdwaras
- **Seva**: Selfless service (volunteer work)
- **Gurdwara**: Sikh place of worship
- **Dasher**: Volunteer delivery driver (borrowed from DoorDash terminology for familiarity)
- **Hub**: Pickup location where meals are prepared (typically gurdwara kitchen)
- **Drop-off**: Delivery destination (shelter, community center)
- **ETA**: Estimated Time of Arrival
- **Proof of Delivery (POD)**: Photo confirmation of meal drop-off

---

### Contact & Contribution

**Project Maintainer:** [Your Name/Organization]  
**Repository:** [GitHub URL]  
**Slack/Discord:** [Community chat link]  
**Email:** support@sevaeats.org

**Contributing:**
1. Read `CONTRIBUTING.md`
2. Check Issues for "good first issue" label
3. Fork repo → Create feature branch
4. Submit PR with description + screenshots
5. Respond to code review feedback

**Bug Reports:**
- Use GitHub Issues template
- Include: Device, OS version, steps to reproduce
- Attach screenshots/video if applicable

---

## License

[Specify license: MIT, GPL, Apache 2.0, etc.]

---

**Document Version:** 1.0  
**Last Updated:** April 3, 2026  
**Status:** Living document (update as project evolves)
