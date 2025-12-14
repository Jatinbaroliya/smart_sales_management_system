# Retail Sales Management System - Architecture Documentation

## Overview

This document describes the architecture, design decisions, and implementation details of the Retail Sales Management System. The system is built with TypeScript, React, and Node.js/Express, following production-grade standards with strong type safety and clean separation of concerns.

## Project Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request/response handling
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Utility functions (CSV parsing)
│   │   ├── routes/           # API route definitions
│   │   ├── models/           # TypeScript interfaces and types
│   │   ├── data/
│   │   │   └── dataset.csv   # Static sales dataset
│   │   └── index.ts          # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API client
│   │   ├── types/            # TypeScript type definitions
│   │   ├── styles/           # Global styles
│   │   └── App.tsx           # Root component
│   ├── package.json
│   └── tsconfig.json
│
└── docs/
    └── architecture.md       # This file
```

## Backend Architecture

### Core Principles

1. **Separation of Concerns**: Controllers handle HTTP, services contain business logic, utils provide reusable functions
2. **Type Safety**: Strict TypeScript with no `any` types
3. **In-Memory Data**: CSV loaded once at startup, stored in memory for fast access
4. **Single Responsibility**: Each module has one clear purpose

### Data Flow

```
CSV File (dataset.csv)
    ↓
CSV Parser (utils/csvParser.ts)
    ↓
Sales Service (services/salesService.ts) - In-memory storage
    ↓
Sales Controller (controllers/salesController.ts)
    ↓
Routes (routes/salesRoutes.ts)
    ↓
Express Server (index.ts)
    ↓
HTTP Response
```

### CSV Loading Flow

1. **Server Startup** (`index.ts`):
   - Calls `loadSalesData()` from `csvParser.ts`
   - Parses CSV file using `csv-parser` library
   - Converts string values to appropriate types (numbers, dates)
   - Stores parsed `SaleRecord[]` in `SalesService` instance
   - Server starts only after data is loaded

2. **CSV Parsing** (`utils/csvParser.ts`):
   - Reads CSV file using Node.js `fs.createReadStream`
   - Streams data through `csv-parser` for memory efficiency
   - Maps CSV columns to `SaleRecord` interface
   - Handles type conversions:
     - Numeric fields: `parseInt()` / `parseFloat()`
     - Date fields: kept as ISO strings
   - Filters out invalid rows (missing transaction ID)
   - Returns array of validated `SaleRecord` objects

3. **Data Storage**:
   - All sales data stored in memory in `SalesService`
   - No database required - data is static
   - Fast access for filtering, sorting, pagination

### API Design

#### Endpoint: `GET /api/sales`

**Query Parameters:**
- `page` (number): Current page number (default: 1)
- `pageSize` (number): Items per page (default: 10)
- `search` (string): Search customer name or phone number
- `sort` (enum): Sort field (`date_desc`, `quantity`, `customer_name_asc`)
- `region` (string[]): Filter by customer region
- `gender` (string[]): Filter by gender
- `ageMin` (number): Minimum age
- `ageMax` (number): Maximum age
- `category` (string[]): Filter by product category
- `tags` (string[]): Filter by product tags
- `paymentMethod` (string[]): Filter by payment method
- `dateStart` (string): Start date (ISO format)
- `dateEnd` (string): End date (ISO format)

**Response Format:**
```typescript
{
  data: SaleRecord[];
  totalPages: number;
  currentPage: number;
}
```

#### Endpoint: `GET /api/sales/filter-options`

Returns available filter values:
```typescript
{
  regions: string[];
  genders: string[];
  categories: string[];
  paymentMethods: string[];
  tags: string[];
  ageRange: { min: number; max: number };
  dateRange: { start: string; end: string };
}
```

### Service Layer (`services/salesService.ts`)

**Responsibilities:**
- Store sales data in memory
- Apply filters (region, gender, age, category, tags, payment, date)
- Apply sorting (date desc, quantity, customer name)
- Apply pagination
- Provide helper methods for filter options

**Key Methods:**
- `getSales(query: SalesQuery)`: Main method that applies all filters, sorting, and pagination
- `applyFilters()`: Private method for filter logic
- `applySorting()`: Private method for sort logic
- `getUniqueRegions()`, `getUniqueGenders()`, etc.: Helper methods for filter dropdowns

**Filter Logic:**
- All filters are AND conditions (must match all selected filters)
- Multi-select filters use array inclusion checks
- Age range uses min/max bounds
- Date range uses ISO string comparison
- Tags filter checks if any tag matches (comma-separated values)

**Sort Logic:**
- `date_desc`: Sort by date descending (newest first)
- `quantity`: Sort by quantity descending (highest first)
- `customer_name_asc`: Sort alphabetically by customer name

### Controller Layer (`controllers/salesController.ts`)

**Responsibilities:**
- Parse HTTP request query parameters
- Map query params to `SalesQuery` interface
- Call service methods
- Format responses
- Handle errors

**Error Handling:**
- Try-catch blocks around service calls
- Returns 500 status on errors
- Logs errors to console

### Type Safety

All data structures are strongly typed:

- `SaleRecord`: Complete interface matching CSV structure
- `APIResponse<T>`: Generic response wrapper
- `FilterOptions`: All filter types
- `SortField`: Enum for sort options
- `SalesQuery`: Combined query interface
- `PaginationParams`: Page and pageSize

## Frontend Architecture

### Core Principles

1. **Component-Based**: Reusable, composable components
2. **Type Safety**: Shared types with backend
3. **Custom Hooks**: Encapsulate data fetching and state logic
4. **CSS Modules**: Scoped styling per component
5. **Single Source of Truth**: Centralized state management

### Data Flow

```
User Interaction (Search, Filter, Sort, Pagination)
    ↓
React State (Dashboard component)
    ↓
Custom Hooks (useSalesData, useDebounce)
    ↓
API Service (services/api.ts)
    ↓
Axios HTTP Request
    ↓
Backend API
    ↓
Response
    ↓
State Update
    ↓
UI Re-render
```

### Component Hierarchy

```
App
└── Dashboard
    ├── Header
    ├── Controls (SearchBar + SortDropdown)
    ├── SalesTable
    ├── Pagination
    └── FilterPanel (Sidebar)
```

### Custom Hooks

#### `useSalesData`

**Purpose**: Manage sales data fetching and state

**Returns:**
- `sales`: Array of sale records
- `loading`: Loading state
- `error`: Error message
- `totalPages`: Total pagination pages
- `currentPage`: Current page number
- `filterOptions`: Available filter values
- `fetchSales`: Function to fetch data

**Implementation:**
- Uses `useState` for data, loading, error states
- Calls `salesAPI.getSales()` with query parameters
- Loads filter options on mount
- Handles errors gracefully

#### `useDebounce`

**Purpose**: Debounce search input to reduce API calls

**Implementation:**
- Takes value and delay (300ms)
- Returns debounced value
- Uses `useEffect` with cleanup to manage timeout

### API Service (`services/api.ts`)

**Responsibilities:**
- Configure Axios client with base URL
- Build query parameters from `SalesQuery` object
- Make HTTP requests
- Return typed responses

**Key Methods:**
- `getSales(query)`: Fetch paginated, filtered sales
- `getFilterOptions()`: Fetch available filter values

### Components

#### SearchBar
- Debounced input field
- Search icon
- Handles customer name and phone number search

#### FilterPanel
- Multi-select checkboxes for regions, genders, categories, payment methods
- Age range inputs (min/max)
- Date range picker
- Clear filters button
- Sticky sidebar on desktop

#### SalesTable
- Responsive table with sticky header
- Zebra striping for rows
- Hover effects
- Empty state component
- Loading state
- Formatted currency and dates
- Status badges with color coding

#### Pagination
- Previous/Next buttons
- Page indicator
- Disabled states
- Accessible labels

#### SortDropdown
- Dropdown with sort options
- Typed enum values

### Styling Approach

**CSS Modules**: Each component has its own `.module.css` file
- Scoped styles (no global conflicts)
- Modern design system:
  - Light theme with soft colors
  - 8-12px border radius
  - Soft shadows (0 1px 3px rgba(0,0,0,0.1))
  - Smooth transitions (0.2s-0.3s)
  - Consistent spacing (8px, 12px, 16px, 24px, 32px)

**Color Palette:**
- Primary: #3b82f6 (blue)
- Text: #111827 (dark gray)
- Secondary text: #6b7280 (medium gray)
- Borders: #e5e7eb (light gray)
- Background: #f9fafb (very light gray)
- Success: #059669 (green)
- Error: #ef4444 (red)

**Typography:**
- System font stack for performance
- Clear hierarchy (32px title, 18px headings, 14px body)
- Proper line heights (1.5)

**Responsive Design:**
- Desktop: Two-column layout (main + sidebar)
- Tablet: Single column, stacked
- Mobile: Full width, adjusted padding

## Type Safety Decisions

### Why Strict Typing?

1. **Compile-time Safety**: Catch errors before runtime
2. **Better IDE Support**: Autocomplete, refactoring
3. **Documentation**: Types serve as inline documentation
4. **Refactoring Confidence**: TypeScript ensures consistency

### Shared Types

Frontend and backend share the same data structures:
- `SaleRecord`: Matches CSV structure exactly
- `FilterOptions`: Consistent filter interface
- `SortField`: Enum ensures valid sort values
- `APIResponse<T>`: Generic response wrapper

### No `any` Types

- All functions have explicit return types
- All variables have inferred or explicit types
- Generic types used where appropriate (`APIResponse<T>`)
- Type assertions only when necessary and safe

## Scalability Considerations

### Backend Scalability

**Current Limitations:**
- In-memory storage (limited by RAM)
- Single-threaded Node.js (CPU-bound operations)

**Future Improvements:**
1. **Database Migration**: Move to PostgreSQL/MongoDB for larger datasets
2. **Caching**: Redis for frequently accessed queries
3. **Pagination Optimization**: Cursor-based pagination for very large datasets
4. **Indexing**: Database indexes on filtered fields
5. **Streaming**: Stream large CSV files instead of loading all at once

### Frontend Scalability

**Current Optimizations:**
- Debounced search (reduces API calls)
- Pagination (loads 10 items at a time)
- CSS Modules (prevents style conflicts)
- Component-based architecture (easy to extend)

**Future Improvements:**
1. **Virtual Scrolling**: For very long lists
2. **React Query**: Better caching and state management
3. **Code Splitting**: Lazy load components
4. **Memoization**: Use `useMemo` for expensive computations
5. **Service Worker**: Offline support

### Performance Optimizations

1. **CSV Loading**: Stream-based parsing (handles large files)
2. **Filtering**: In-memory array operations (fast for <1M records)
3. **Debouncing**: Reduces unnecessary API calls
4. **Pagination**: Limits data transfer

## Error Handling

### Backend
- Try-catch in controllers
- Graceful CSV parsing (skips invalid rows)
- Validation of query parameters
- 500 status for unexpected errors

### Frontend
- Error state in `useSalesData` hook
- Error display in UI
- Loading states for better UX
- Empty states when no results

## Security Considerations

1. **CORS**: Enabled for frontend origin
2. **Input Validation**: Query parameters validated and sanitized
3. **Type Safety**: Prevents injection attacks
4. **No File Upload**: Static CSV only (as per requirements)

## Testing Considerations (Future)

1. **Backend Unit Tests**: Service layer logic
2. **Backend Integration Tests**: API endpoints
3. **Frontend Unit Tests**: Component rendering
4. **Frontend Integration Tests**: User interactions
5. **E2E Tests**: Full user flows

## Deployment Considerations

1. **Environment Variables**: API URLs, ports
2. **Build Process**: TypeScript compilation
3. **Static Assets**: Frontend build output
4. **Server Configuration**: CORS, rate limiting
5. **Monitoring**: Error logging, performance metrics

## Conclusion

This architecture provides:
- ✅ Clean separation of concerns
- ✅ Strong type safety
- ✅ Scalable structure
- ✅ Production-ready code quality
- ✅ Modern, beautiful UI
- ✅ Efficient data handling

The system is designed to be maintainable, extensible, and performant while following industry best practices.

