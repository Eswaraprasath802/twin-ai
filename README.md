# Twin AI \u2014 Mobile (v1)

AI-Powered Digital Twin of India's Climate \u2014 mobile app (React Native / Expo).

## What's actually in this v1 build

- **Live weather + air quality** for all Indian states (Open-Meteo API \u2014 free, no key required, real data)
- **Smart Alerts**: rule-based flood / heatwave / storm / AQI risk detection with recommended actions
- **Twin AI Assistant**: chat screen that answers weather/crop/flood/fertilizer questions using live data (template-based, not a hosted LLM yet)
- **Smart Agriculture**: crop suitability recommendations based on season + live temperature/rainfall trends
- **State selector**: lightweight "map" (grid-based) to switch between all 28 states + UTs

## What's NOT in this v1 (and why)

| Feature from the original spec | Status | Why |
|---|---|---|
| CesiumJS 3D globe, terrain, buildings | Not included | Doesn't run natively in an App Store app \u2014 this is a web technology. Would need a separate Next.js web app. |
| Trained ML models (cyclone, flood, crop yield, NDVI) | Rule-based stand-in | Training real models needs satellite training data, GPU infra, and time beyond this environment. Alerts use live weather thresholds instead. |
| ISRO Bhuvan satellite feeds | Not included | Requires data-sharing agreements/API access I don't have. |
| Government dashboards, RBAC, backend microservices | Not included | This is the citizen-facing mobile app only. A FastAPI backend + auth system is a separate build. |
| Voice assistant, 11-language AI responses | Not included | Text chat only for v1; language switching is a UI stub in Settings. |

This is a real, honest starting point \u2014 not a mockup. Every screen uses live data and working logic.

## Run it locally

```bash
cd twin-ai-mobile
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app (iOS/Android) to test on your phone instantly \u2014 no build needed for development.

## Publishing to the App Store (steps you'll need to do)

This part can't be done from a sandbox \u2014 it requires your Apple account and a build service.

1. **Apple Developer account** \u2014 sign up at developer.apple.com ($99/year)
2. **Install EAS CLI**: `npm install -g eas-cli`
3. **Log in**: `eas login`
4. **Configure the build**: `eas build:configure`
5. **Update `app.json`** \u2014 change `ios.bundleIdentifier` to your own reverse-DNS ID (e.g. `com.yourname.twinai`)
6. **Build for iOS**: `eas build --platform ios` (EAS builds in the cloud \u2014 no Mac required for this step)
7. **Submit to App Store**: `eas submit --platform ios` (follow prompts to link your Apple Developer account)
8. Fill out App Store Connect listing: screenshots, description, privacy policy (required \u2014 this app requests location access), age rating
9. Apple review typically takes 1\u20133 days

For Android/Play Store: `eas build --platform android` then `eas submit --platform android` (needs a Google Play Developer account, $25 one-time).

## Suggested next steps (v2)

1. Add a real backend (FastAPI) + connect a hosted LLM for the chat assistant instead of template matching
2. Add push notifications for alerts (Expo Notifications)
3. Upgrade the state grid to a real MapLibre GL map (`@maplibre/maplibre-react-native`) \u2014 requires EAS custom dev build since it's a native module
4. Add district-level drill-down (Level 2 from the original spec)
5. Build the full CesiumJS 3D globe as a companion **web app** (Next.js) \u2014 that's where the "digital twin" visual really belongs
6. Replace rule-based alerts with real trained models once you have historical IMD/ISRO data to train on

## Project structure

```
twin-ai-mobile/
  App.tsx
  src/
    api/weather.ts          # Open-Meteo live data client
    context/TwinAIContext.tsx  # shared state + data fetching
    data/states.ts           # 28 states + UTs with coordinates
    data/crops.ts            # crop reference dataset
    engine/alertEngine.ts    # rule-based risk detection
    engine/assistantEngine.ts # chat response logic
    screens/                 # Home, Map, Chat, Agriculture, Settings
    navigation/               # bottom tab nav
    theme/colors.ts           # design tokens
```
