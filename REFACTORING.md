# Refactoring summary

This document outlines the restructuring of the journey visualizer app to follow best software development practices.

## Structure changes

### New directories

**`types/`** - Centralized TypeScript type definitions
- `index.ts` - Core interfaces (Coordinates, JourneyState, Prediction, ProgressResult)

**`utils/`** - Utility functions organized by domain
- `distance.ts` - Haversine distance calculation
- `geolocation.ts` - Browser geolocation helpers
- `googleMaps.ts` - Google Maps API interactions (routes, geocoding)
- `progress.ts` - Journey progress calculation logic

**`constants/`** - Configuration values
- `index.ts` - Geolocation config, error thresholds, simulation config, map config

**`components/debug/`** - Debug panel sub-components
- `CurrentPositionDisplay.tsx` - Shows current GPS coordinates
- `LocationInput.tsx` - Manual location input form
- `QuickSetButtons.tsx` - Quick position presets (origin, halfway, destination)
- `SimulationControls.tsx` - Journey simulation controls

### Extracted components

- `ErrorDisplay.tsx` - Error message display component
- `JourneyInfo.tsx` - Remaining distance and stop button
- `StopJourneyModal.tsx` - Journey stop confirmation modal

## Benefits

### Separation of concerns
- Business logic separated from UI components
- Reusable utility functions
- Type definitions in one place

### Maintainability
- Smaller, focused components
- Clear file organization
- Easy to locate and modify code

### Testability
- Pure utility functions can be tested independently
- Components have clear, focused responsibilities

### Code reusability
- Utilities can be used across different components
- Type definitions ensure consistency
- Constants prevent magic numbers

## Package.json scripts

Added comprehensive development scripts:

### Linting
- `npm run lint` - Check for code issues
- `npm run lint:fix` - Auto-fix linting issues

### Type checking
- `npm run type-check` - Verify TypeScript types

### Formatting
- `npm run format` - Check code formatting
- `npm run format:fix` - Auto-format code with Prettier

### Unused code detection
- `npm run knip` - Find unused dependencies and exports

### Combined scripts
- `npm run check` - Run all checks (lint, type-check, format, knip)
- `npm run fix` - Auto-fix all fixable issues (lint:fix, format:fix)

## Dependency notes

Some dependencies appear unused to knip but are required:
- `@types/google.maps` - Global TypeScript type definitions
- `tailwindcss` - Core library (peer dependency of @tailwindcss/postcss)

See `.knip-ignore` for detailed explanations.
