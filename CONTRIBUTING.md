# Contributing to Sales Management System

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/sales-management-system.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit your changes: `git commit -m "Add: your feature description"`
6. Push to your branch: `git push origin feature/your-feature-name`
7. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

## Code Standards

### TypeScript

- Use strict TypeScript configuration
- Avoid `any` types - use proper types or `unknown`
- Use interfaces for object shapes
- Use type aliases for unions and complex types

### Code Style

- Follow existing code patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use async/await for asynchronous operations

### Git Commit Messages

Follow the conventional commits format:

- `Add: description` - for new features
- `Fix: description` - for bug fixes
- `Update: description` - for updates to existing features
- `Refactor: description` - for code refactoring
- `Docs: description` - for documentation changes
- `Style: description` - for formatting changes
- `Test: description` - for adding or updating tests

## Project Structure

- **Backend**: Express.js API server in `backend/`
- **Frontend**: React application in `frontend/`
- **Documentation**: Architecture docs in `docs/`

## Testing

Before submitting a PR, ensure:

- The application runs without errors
- All existing functionality still works
- New features are properly tested
- Code follows TypeScript best practices

## Pull Request Process

1. Update the README.md if needed
2. Ensure your code follows the project's style guidelines
3. Make sure all tests pass (if applicable)
4. Update documentation for any new features
5. Request review from maintainers

## Questions?

If you have questions, please open an issue for discussion.

Thank you for contributing! 🎉


