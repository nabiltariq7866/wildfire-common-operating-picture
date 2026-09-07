# Fireline COP — Wildfire Common Operating Picture

A complete interactive portfolio demo for aerial-firefighting incident commanders, air/ground dispatch staff and operations leadership.

## What this project proves

The demo normalizes simulated aircraft positions, a real GeoJSON Polygon fire-perimeter feature, incident weather, ground resources, mapped hazards, alerts and chronological incident activity into one shared operating interface.

It is deliberately a portfolio/client demo rather than a production public-safety system.

## Exact Dummy Project 1 coverage

- Shared common operating picture across air, ground and command roles
- Near-real-time simulated ADS-B-style aircraft movement
- Fire perimeter rendered from an actual GeoJSON `Feature` with `Polygon` geometry
- GeoJSON perimeter coordinates expand through the simulation controls
- Weather panel with wind speed/direction and temperature
- Wind-shift simulation that creates an alert affecting an active drop corridor
- Chronological incident log / timeline
- Dispatcher view
- Incident Command view
- Operations Leadership view
- Mock JSON/state data feeds separated from UI components
- Code-level adapter contracts for future ADS-B, NOAA/BOM and GeoJSON data sources
- Built-in usability metric capture for asset-location time
- Built-in secondary-reference trust survey

## Main connected demo flow

1. Open **Live Operations Map**.
2. Watch aircraft markers move every ~2.2 seconds.
3. Select an aircraft to inspect altitude, speed, fuel, load and ETA.
4. In **Dispatcher** role, assign it to an active drop zone.
5. Open **Data Feeds & Simulation** and trigger **Simulate wind shift**.
6. The weather state updates and a critical drop-zone warning is generated.
7. Open **Operational Alerts** and acknowledge the warning.
8. Open **Incident Timeline** and see the action recorded.
9. Trigger **Expand fire perimeter**. The stored GeoJSON Polygon coordinates and acreage both update.
10. Simulate a delayed ground feed, then restore and synchronize queued updates.

## Success-metric evaluation

Open `/evaluation`.

### Time-to-locate-an-asset

- Pick a target aircraft.
- Enter a baseline time representing the current radio/process method.
- Start the test.
- The app opens the live map.
- Selecting the correct aircraft automatically stops the timer.
- The result stores COP time, baseline time and percentage difference.

### Secondary-reference trust

- Evaluators answer whether they would trust the COP as a secondary incident reference.
- Capture a 1–5 usefulness/confidence rating and optional notes.
- Results persist locally for the demo session.

The project instruments these success metrics; meaningful conclusions still require real human evaluators. No fake user-study result is pre-populated.

## Role views

- **Dispatcher** — aircraft details, availability and mock drop-zone assignment controls.
- **Incident Command** — incident risk, hazards, weather and shared situational picture without dispatcher assignment controls.
- **Operations Leadership** — multi-incident monitoring emphasis.

## Pages

- `/dashboard` — Command Center
- `/map` — Live Operations Map
- `/incidents` — Active Incidents
- `/resources` — Aircraft & Ground Resources
- `/weather` — Weather & Hazards
- `/timeline` — Incident Timeline
- `/alerts` — Operational Alerts
- `/feeds` — Data Feeds & Simulation
- `/evaluation` — Usability & Trust Evaluation
- `/settings` — Scope, reset and operational boundary

## Real-data handoff architecture

`src/data/feedAdapters.ts` contains explicit normalization boundaries:

- ADS-B-like record → internal aircraft contract
- Weather API-like record → internal weather contract
- GeoJSON Feature/Polygon → internal fire-perimeter contract
- Ground-resource feed contract documented in the adapter catalog

The UI consumes normalized application models, so future approved data sources can replace the mock feed layer without rewriting pages/components.

## Theme

This project intentionally uses a different visual identity from AeroLearn:

- deep graphite / blue-black operating surfaces
- electric cyan primary accent
- teal success states
- ember orange for fire/weather caution
- coral red for critical hazards
- restrained purple for secondary command intelligence

Dark mode is default; light mode is included.

## Run

```bash
npm install
npm run dev
```

Production check:

```bash
npm run build
```

## Explicitly out of scope for this demo

Per the brief, these remain phase-2/production items:

- live classified/restricted agency-data ingestion
- full mobile offline mode
- multi-agency production authentication

The demo also does not autonomously launch/dispatch aircraft, authorize drops or make life-safety decisions.

## Suggested GitHub repository

`wildfire-common-operating-picture`

Suggested description:

> Interactive wildfire aviation COP demo combining simulated aircraft tracking, GeoJSON fire perimeter, weather, resources, alerts, incident timelines and role-based command views.
