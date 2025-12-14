# Backend - Retail Sales Management System

## Overview

Express.js backend server with TypeScript that loads sales data from CSV and provides a RESTful API for querying, filtering, sorting, and paginating sales records.

## Features

- ✅ TypeScript with strict type checking
- ✅ CSV data loaded once at startup (in-memory storage)
- ✅ RESTful API with filtering, sorting, and pagination
- ✅ CORS enabled for frontend communication
- ✅ Clean architecture (controllers, services, utils, models)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

```bash
cd backend
npm install
```

## Development

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Production Build

```bash
npm run build
npm start
```

## API Endpoints

### GET /api/sales

Get paginated sales data with optional filters, search, and sorting.

**Query Parameters:**
- `page` (number, default: 1): Page number
- `pageSize` (number, default: 10): Items per page
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

**Response:**
```json
{
  "data": [...],
  "totalPages": 100,
  "currentPage": 1
}
```

### GET /api/sales/filter-options

Get available filter values for dropdowns.

**Response:**
```json
{
  "regions": ["East", "West", ...],
  "genders": ["Male", "Female"],
  "categories": ["Electronics", "Beauty", ...],
  "paymentMethods": ["UPI", "Credit Card", ...],
  "tags": ["organic", "wireless", ...],
  "ageRange": { "min": 18, "max": 65 },
  "dateRange": { "start": "2021-01-01", "end": "2023-12-31" }
}
```

### GET /health

Health check endpoint.

## Project Structure

```
src/
├── controllers/    # Request/response handling
├── services/       # Business logic
├── utils/          # CSV parser utility
├── routes/         # API route definitions
├── models/         # TypeScript interfaces
├── data/           # CSV dataset
└── index.ts        # Server entry point
```

## Data Loading

The CSV file (`src/data/dataset.csv`) is loaded once at server startup:
1. Server reads CSV file using streaming parser
2. Data is parsed and converted to typed `SaleRecord` objects
3. All data stored in memory in `SalesService`
4. Server starts only after data is successfully loaded

## Type Safety

All code uses strict TypeScript with:
- No `any` types
- Explicit interfaces for all data structures
- Type-safe API responses
- Compile-time error checking

## Environment Variables

- `PORT` (optional): Server port (default: 3001)

