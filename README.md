# Seva Eats

Main codebase for the Seva Eats mobile application, built with Expo and React Native.

![banner](./assets/images/banner.png)

## Getting Started

The app uses a guided onboarding flow to keep the experience consistent:

1. Splash
2. Welcome
3. Intro
4. Choose Role
5. Recipient or Dasher path

If onboarding is complete, the app loads directly into the selected role.

## Concept Note (realistic + built to succeed)

1) The idea in one line

Seva Eats is a nonprofit “last-mile langar” delivery network that routes surplus, culturally appropriate meals from gurdwaras to food-insecure households, powered by sangat volunteers, with optional tips/donations and lightweight tech to coordinate pickup, packaging, and delivery.

⸻

2) The problem (what you’re actually solving)

Food insecurity isn’t only “lack of food.” It’s also:
	•	Access (mobility, distance, time, disability, childcare, work shifts)
	•	Dignity + fit (culturally familiar food, halal/veg preferences, allergies)
	•	Reliability (knowing food will arrive when promised)
	•	Waste (surplus food that’s hard to distribute efficiently)

Gurdwaras often have: consistent cooking capability + community + donations — but distribution beyond the building is the missing piece.

⸻

3) Why Sikh seva is the perfect engine (motivation map)

Sikh seva works because it’s not “volunteering when convenient.” It’s identity-driven:

Key motivators you can design around
	1.	Seva as spiritual practice: “I’m doing this as devotion, not as charity.”
	2.	Collective duty: the sangat does it together; it feels normal and shared.
	3.	Low friction: langar already exists; you’re redirecting flow, not inventing it.
	4.	Visible impact: people stay committed when they can see outcomes.
	5.	Trust + integrity: people trust gurdwara governance more than random apps.

Design implication: your product should feel like a seva system, not a “gig app.”

⸻

4) The operating model (how it works end-to-end)

A. Supply (Gurdwara kitchens)
	•	Meals already cooked for langar or special days
	•	Surplus is identified before it becomes waste
	•	Packing is standardized: portions, labeling, allergens, timestamps

Non-negotiable: food safety process (simple, documented, consistent)

B. Demand (Recipients)

Two realistic recipient pathways:
	1.	Partner referrals (best for pilot): shelters, newcomer orgs, social workers, schools, community health centers
	•	Lower fraud risk, higher need certainty
	2.	Direct household signups (phase 2): people register in-app or via phone/WhatsApp
	•	Needs stronger verification + privacy protections

C. Delivery (Sangat volunteers)
	•	Volunteers already travel to/from gurdwara
	•	They “bundle” deliveries along their route (like rideshare pooling, but volunteer)

Simple rules that keep it reliable
	•	Delivery windows (e.g., 12–2pm, 6–8pm)
	•	Route radius caps
	•	“Accept 1–2 drops” default so it stays easy

D. Funding

Nonprofit revenue mix:
	•	Optional tips from recipients who can
	•	Community sponsors: “Sponsor 100 meals this week”
	•	Grants for hunger relief, newcomers, and community health
	•	In-kind: packaging supplies, insulated bags, labels, scooters/bikes

⸻

5) What the app actually needs (don’t overbuild)

The MVP is coordination + accountability, not fancy features.

MVP (first gurdwara, 6–8 weeks)

Roles
	•	Kitchen Lead: “Meals ready / count / dietary tags”
	•	Dispatcher: matches volunteers + routes
	•	Volunteer: accepts route, confirms drop
	•	Partner org / Recipient: confirms delivery window + address

Core features
	•	Meal count + readiness time
	•	Route assignment (manual at first, semi-automatic later)
	•	Volunteer check-in/out + proof of delivery (non-intrusive)
	•	Recipient confirmation (SMS/WhatsApp link)
	•	Donation/tip (optional)

Start with WhatsApp + simple web app (fast adoption), then graduate to full app once behavior is proven.

⸻

6) Gamification (do it the Sikh way — dignified, not cringe)

Gamification should reward consistency and humility, not ego.

Better than leaderboards
	•	Seva Streaks (private): “3 weeks in a row”
	•	Impact Milestones: “You helped deliver 50 meals”
	•	Seva Badges tied to values: reliability, kindness, punctuality
	•	Team Goals: “This gurdwara delivered 1,000 meals this month”
	•	Sponsor matching moments: “Every delivery today is doubled by a donor”

Important: make public recognition optional. Many sevadars prefer low visibility.

⸻

7) Trust, safety, and optics (the stuff that can kill it)

This project will fail if people worry about misuse, disrespect, or safety.

Key risks + mitigations
	1.	Food safety liability
	•	Basic SOP: temp control, time stamps, packaging rules
	•	Distribution windows (don’t deliver food that sat too long)
	•	Simple training + waiver + insurance review
	2.	Recipient dignity + privacy
	•	No “poor people list” vibe
	•	Minimal data collection
	•	Neutral packaging and discreet drop options
	3.	Volunteer reliability
	•	“Small routes” by default
	•	Backup pool + dispatcher oversight
	•	Track on-time rate (quietly)
	4.	Gurdwara politics / governance
	•	Start with one aligned committee
	•	Clear boundaries: Seva Eats supports langar mission, doesn’t control it
	•	Transparent reporting monthly
	5.	Demand spikes
	•	Caps per day + waitlist
	•	Partner-referrals first to manage volume responsibly

⸻

8) Pilot blueprint (make this real, fast)

Phase 0 — Pre-pilot (2 weeks)
	•	Pick one gurdwara with strong leadership alignment
	•	Secure one partner org (referral pipeline)
	•	Finalize SOP: packing, labeling, times, handoff
	•	Recruit 20–30 volunteers (small commitments)

Phase 1 — Pilot (4–6 weeks)
	•	2 delivery days/week, fixed windows
	•	Target 30–80 meals per run
	•	One dispatcher manages all matching (simple)

KPIs
	•	Meals delivered / week
	•	On-time delivery %
	•	Waste reduced (surplus redirected)
	•	Volunteer retention %
	•	Recipient satisfaction (1–2 questions)
	•	Cost per meal delivered (packaging + ops only)

Phase 2 — Scale within one city (8–12 weeks)
	•	Add 2–3 gurdwaras
	•	Standardize playbook + training
	•	Light automation: route suggestions, volunteer matching

Phase 3 — Multi-faith expansion (after proof)
	•	Package as a “community meals delivery operating system”
	•	Offer templates + tech + SOP so other institutions can run it

⸻

9) Probability assessment (honest + actionable)

Here’s a practical success read based on real-world execution risk:

If you run it as “app-first”
	•	Probability of success: 25–40%
	•	Why: volunteer delivery + food safety + coordination are operations-heavy; apps don’t solve adoption.

If you run it as “ops-first + WhatsApp-first”
	•	Probability of success: 60–75%
	•	Why: you prove behavior, then add software to scale what already works.

Biggest success driver

A strong dispatcher + kitchen SOP beats any AI feature early on.

⸻

10) Where Google Antigravity / Claude Code actually helps (use AI correctly)

AI should reduce admin, not replace trust.

High-leverage uses:
	•	Volunteer matching suggestions based on route + availability
	•	Demand forecasting (days with high surplus / high requests)
	•	Auto-generated weekly impact reports for sangat + donors
	•	Lightweight multilingual support (Punjabi/English/Hindi)
	•	Safety checklist automation and training micro-modules

⸻

11) The story you pitch (to donors + community)

“Langar already feeds people. Seva Eats is how langar reaches people who can’t come to it.”
It’s not reinventing; it’s extending Guru Nanak’s model into modern city logistics with dignity and discipline.

⸻

12) What you should do next (most important)
	1.	Pick the pilot gurdwara + one referral partner (shelter/newcomer org)
	2.	Write a one-page SOP (packing, timing, safety, roles)
	3.	Recruit a dispatcher + 20 volunteers
	4.	Run two delivery days per week for 6 weeks using WhatsApp + a simple tracker
	5.	Only then: build the app to scale the proven workflow
