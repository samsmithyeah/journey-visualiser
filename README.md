# Are we nearly there?

A fun, child-friendly real-time journey tracking app that visualizes travel progress! Built with Next.js, TypeScript, and Google Maps API.

## Features

- **Smart Address Lookup**: Google Maps Places autocomplete for easy destination search
- **Real-time Tracking**: Continuous location updates using browser geolocation
- **Visual Progress**: Simple, kid-friendly progress bar with animated blob
- **Route-based Calculation**: Accurate progress based on actual driving routes via Google Directions API

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
4. Create credentials (API Key)
5. Set up API restrictions (recommended):
   - **Application restrictions**: HTTP referrer (add your domain)
   - **API restrictions**: Select only the APIs listed above

### 3. Add API Key

Copy your API key and add it to `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Enter Destination**: Type an address or location in the search box
2. **Allow Location**: Grant browser permission to access your location
3. **Start Journey**: The app calculates the route and begins tracking
4. **Watch Progress**: The blob moves along the line as you travel
5. **Live Updates**: Distance remaining updates continuously

## Architecture

- `app/page.tsx` - Main page with journey state management
- `components/DestinationSearch.tsx` - Google Places autocomplete search
- `components/JourneyVisualizer.tsx` - Visual progress bar with animated blob
- `hooks/useJourneyTracking.ts` - Custom hook for geolocation and progress calculation

## Technical Details

- **Progress Calculation**: Uses Google Directions API for total route distance, then calculates progress based on current position
- **Location Tracking**: Browser Geolocation API with high accuracy mode
- **Distance Formula**: Haversine formula for calculating distances between coordinates

## Browser Requirements

- Modern browser with Geolocation API support
- HTTPS connection (required for geolocation on production)
- Location permissions enabled

## Notes

- The app requires continuous location access while tracking
- For best results, use on mobile devices during actual car journeys
- API usage costs may apply based on Google Maps pricing

## Future Enhancements (v0.2+)

- Map view with route visualization
- Fun animations and sound effects for kids
- Milestone markers along the route
- Multiple stops/waypoints support
- Journey history and statistics
