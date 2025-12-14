# Retail Sales Management System

A complete, production-grade Retail Sales Management System built with TypeScript, React, and Node.js/Express. Features a beautiful, modern dashboard for viewing, filtering, sorting, and paginating retail sales data.

## 🚀 Features

- **Modern UI/UX**: Beautiful, professional dashboard with smooth animations
- **Type Safety**: Strict TypeScript throughout (no `any` types)
- **Advanced Filtering**: Filter by region, gender, age, category, tags, payment method, and date range
- **Search**: Debounced search by customer name or phone number
- **Sorting**: Sort by date, quantity, or customer name
- **Pagination**: Efficient pagination with 10 items per page
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Clean Architecture**: Separation of concerns, modular code structure
- **Production Ready**: Error handling, loading states, empty states

## 📁 Project Structure

```
root/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── routes/
│   │   ├── models/
│   │   └── data/
│   │       └── dataset.csv
│   └── package.json
│
├── frontend/         # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── package.json
│
└── docs/
    └── architecture.md
```

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- TypeScript
- CSV parsing (csv-parser)
- CORS

### Frontend
- React 19
- TypeScript
- Vite
- CSS Modules
- Axios
- React Router (for future expansion)

## 📦 Installation

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## 🚀 Running the Application

### 1. Start Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3001` and automatically load the CSV data.

### 2. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or another available port).

### 3. Open in Browser

Navigate to the frontend URL (usually `http://localhost:5173`)

## 📊 Data

The system uses a static CSV file located at `backend/src/data/dataset.csv`. This file is:
- Loaded once at server startup
- Parsed and stored in memory
- Used for all API queries

**Note**: The CSV file is NOT uploaded from the frontend. It's a static dataset provided at development time.

### Dataset File

The `dataset.csv` file (~224MB) is excluded from Git due to GitHub's 100MB file size limit. To use this project:

1. **Option 1 - Git LFS** (Recommended for large files):
   ```bash
   git lfs install
   git lfs track "*.csv"
   git add .gitattributes
   git add backend/src/data/dataset.csv
   ```

2. **Option 2 - Manual Setup**:
   - Place your CSV file at `backend/src/data/dataset.csv`
   - Ensure it has the required columns (see `SaleRecord` interface in `backend/src/models/SaleRecord.ts`)

3. **Option 3 - Use Sample Data**:
   - Create a smaller sample CSV file with the same structure for testing

## 🎯 Usage

1. **Search**: Type in the search bar to find customers by name or phone number
2. **Filter**: Use the filter panel to narrow down results by various criteria
3. **Sort**: Select a sort option from the dropdown
4. **Navigate**: Use pagination controls to browse through pages
5. **Clear**: Click "Clear All" in the filter panel to reset filters

## 📝 API Documentation

### GET /api/sales

Get paginated sales data with optional filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10)
- `search`: Search term
- `sort`: Sort field (`date_desc`, `quantity`, `customer_name_asc`)
- `region`, `gender`, `category`, `tags`, `paymentMethod`: Array filters
- `ageMin`, `ageMax`: Age range
- `dateStart`, `dateEnd`: Date range

### GET /api/sales/filter-options

Get available filter values for dropdowns.

See `backend/README.md` for detailed API documentation.

## 🏗️ Architecture

See `docs/architecture.md` for comprehensive architecture documentation including:
- Backend architecture and data flow
- Frontend component structure
- Type safety decisions
- Scalability considerations
- Error handling strategies

## 🎨 Design System

- **Colors**: Light theme with professional color palette
- **Typography**: System font stack for performance
- **Spacing**: Consistent 8px grid system
- **Shadows**: Soft shadows (0 1px 3px rgba(0,0,0,0.1))
- **Border Radius**: 8-12px for modern look
- **Transitions**: Smooth 0.2s-0.3s transitions

## 🔒 Type Safety

- Strict TypeScript configuration
- No `any` types
- Shared types between frontend and backend
- Compile-time error checking
- Full IDE autocomplete support

## 📱 Responsive Design

- **Desktop**: Two-column layout (main content + sidebar)
- **Tablet**: Single column, stacked layout
- **Mobile**: Full-width, optimized spacing

## 🚧 Future Enhancements

- Database integration for larger datasets
- Caching layer (Redis)
- Virtual scrolling for very long lists
- Export functionality (CSV, PDF)
- Advanced analytics and charts
- User authentication
- Real-time updates

## 📄 License

This project is built for demonstration purposes.

## 👨‍💻 Development Standards

- Clean, readable code
- Strong TypeScript usage
- Modular architecture
- Production-ready error handling
- Beautiful, accessible UI
- Comprehensive documentation

---

Built with ❤️ using TypeScript, React, and Node.js

