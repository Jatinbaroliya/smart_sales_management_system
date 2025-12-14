# Frontend - Retail Sales Management System

## Overview

Modern React + TypeScript frontend with a beautiful, production-ready dashboard for managing and viewing retail sales data.

## Features

- ✅ React 19 with TypeScript
- ✅ Modern, beautiful UI with CSS Modules
- ✅ Debounced search functionality
- ✅ Advanced filtering (region, gender, age, category, tags, payment, date)
- ✅ Sorting options (date, quantity, customer name)
- ✅ Pagination
- ✅ Responsive design
- ✅ Custom hooks for data management
- ✅ Type-safe API integration

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend server running (see backend README)

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

The app will start on `http://localhost:5173` (or another port if 5173 is busy)

Make sure the backend server is running on `http://localhost:3001`

## Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── SearchBar
│   ├── FilterPanel
│   ├── SalesTable
│   ├── Pagination
│   └── SortDropdown
├── pages/          # Page components
│   └── Dashboard
├── hooks/          # Custom React hooks
│   ├── useSalesData
│   └── useDebounce
├── services/       # API client
│   └── api.ts
├── types/          # TypeScript type definitions
│   └── sales.ts
└── App.tsx         # Root component
```

## Components

### Dashboard
Main page that integrates all components:
- Header with title
- Search bar with debouncing
- Sort dropdown
- Sales table with data
- Pagination controls
- Filter panel sidebar

### SearchBar
Debounced input for searching customer names and phone numbers.

### FilterPanel
Comprehensive filtering options:
- Multi-select checkboxes (region, gender, category, payment method)
- Age range inputs
- Date range picker
- Clear filters button

### SalesTable
Data table displaying:
- Formatted dates and currency
- Customer information
- Product details
- Status badges with color coding
- Empty and loading states

### Pagination
Page navigation with previous/next buttons and page indicator.

## Custom Hooks

### useSalesData
Manages sales data fetching, loading states, errors, and filter options.

### useDebounce
Debounces search input to reduce API calls (300ms delay).

## API Integration

The frontend communicates with the backend via Axios:
- Base URL: `http://localhost:3001/api`
- All requests are typed with TypeScript interfaces
- Error handling with user-friendly messages

## Styling

- **CSS Modules**: Scoped styles per component
- **Design System**: Consistent colors, spacing, typography
- **Responsive**: Mobile, tablet, and desktop layouts
- **Modern UI**: Soft shadows, rounded corners, smooth transitions

## Type Safety

- Shared types with backend
- No `any` types
- Full TypeScript coverage
- Type-safe API calls

## Browser Support

Modern browsers with ES6+ support:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
