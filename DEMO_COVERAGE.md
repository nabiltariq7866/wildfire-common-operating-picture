# Demo Coverage — Dummy Project 1: Wildfire Common Operating Picture

| Brief requirement | Implementation | Status |
|---|---|---|
| One shared active-incident view across air and ground roles | Tactical map + aircraft + ground + fire + weather/hazards | Complete |
| Reduce reliance on radio-only situational updates | Shared visual resource/incident state + chronological event feed | Complete |
| Normalize disparate feeds into one interface | Typed internal models + source adapter contracts | Complete |
| Incident commanders | Incident Command persona/view | Complete |
| Air/ground dispatch staff | Dispatcher view + air/ground resource workspace | Complete |
| Ops leadership monitoring multiple incidents | Operations Leadership persona + 3 concurrent incidents | Complete |
| Simulated ADS-B-style aircraft positions | 8 mock aircraft with live telemetry | Complete |
| Near-real-time updates | Aircraft positions update approximately every 2.2 seconds | Complete |
| Fire perimeter overlay | Actual GeoJSON Feature with Polygon geometry | Complete |
| Expandable perimeter over time | Simulation mutates GeoJSON coordinates + acreage | Complete |
| Basic weather panel | Wind, direction, temperature plus gusts/humidity/visibility | Complete |
| Alert when wind shifts toward active drop zone | Wind-shift simulation creates a critical drop-corridor alert | Complete |
| Incident log in chronological order | Dedicated connected Incident Timeline | Complete |
| Dispatcher simple view | Assignment controls enabled | Complete |
| Command simple view | Shared incident picture without assignment controls | Complete |
| React/HTML front end | React + TypeScript + Tailwind | Complete |
| Mapping experience | Custom tactical SVG map renderer with GeoJSON perimeter input | Complete demo implementation |
| Mock JSON feeds | Aircraft, weather, perimeter, resources, alerts and feed health | Complete |
| Replace mock feeds later without UI redesign | `feedAdapters.ts` normalization boundary + adapter catalog | Complete |
| ADS-B future handoff | Explicit ADS-B-like adapter contract | Complete |
| NOAA/BOM future handoff | Explicit weather adapter contract | Complete |
| Satellite/perimeter future handoff | Explicit GeoJSON adapter contract | Complete |
| Time-to-locate-an-asset success metric | Built-in timed evaluation vs entered baseline | Instrumented |
| Secondary-reference trust success metric | Built-in yes/no + 1–5 evaluator survey | Instrumented |
| Clean handoff path to real data sources | Code adapters + README + feed UI | Complete |
| Restricted/classified live ingestion | Not implemented, per brief | Correctly out of scope |
| Mobile offline mode | Not implemented, per brief | Correctly out of scope |
| Multi-agency authentication | Not implemented, per brief | Correctly out of scope |

## Demo extensions beyond the minimum brief

- multiple active incidents
- mapped ground resources and hazards
- operational alert acknowledgment/resolution
- aircraft-to-drop-zone assignment simulation
- intermittent feed queue/sync simulation
- light/dark theme
- custom dropdowns throughout
- localStorage demo persistence and reset

## Completion statement

All software-build requirements in Dummy Project 1 are implemented for the portfolio-demo scope. The two human success metrics are fully instrumented but, by definition, require real evaluators before any usability/trust result can be claimed.
