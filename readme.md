# Ride Share Project Documentation

## Project Overview

Ride Share is a modern web application built with React and TypeScript, utilizing Vite as the build tool. The project appears to be a location-based sharing platform for rides, incorporating real-time features and map functionality.

## Tech Stack

- **Frontend Framework:** React 18.3
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Database/Backend:** Supabase
- **Real-time Communication:** Ably
- **Mapping:** Leaflet with React-Leaflet
- **Routing:** React Router DOM
- **UI Components:** Lucide React
- **Notifications:** React Hot Toast

## Project Structure

```text
project/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── lib/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── supabase/
├── node_modules/
└── configuration files
```

## Key Features

- Real-time location tracking and notifications (using `Ably`)
- Interactive maps (using `Leaflet`)
- Database integration (using `Supabase`)
- Type-safe development (using `TypeScript`)
- Modern UI components
- Toast notifications for user feedback

## Development Setup

```bash
# Development server
npm run dev

# Build
npm run build

# Lint
npm run lint

# Preview build
npm run preview
```

## Dependencies

### Main Dependencies

- **@supabase/supabase-js:** Database and authentication
- **leaflet & react-leaflet:** Map functionality
- **ably:** Real-time communication
- **react-router-dom:** Application routing
- **react-hot-toast:** Toast notifications
- **uuid:** Unique identifier generation
- **lodash:** Utility functions

### Development Dependencies

- TypeScript and related type definitions
- ESLint for code quality
- TailwindCSS for styling
- Vite for development and building
- Various React-related development tools

The project follows modern web development practices with a clear separation of concerns, utilizing TypeScript for type safety and incorporating real-time features for a dynamic user experience.
