# Gemini Context: PocketTrack (Expense Tracker)

This project is a React 19 application built with TypeScript, Vite 8, and Tailwind CSS v4, integrated with Supabase for authentication and data storage.

## Project Status: v1.0.0 (Released)

*   **Current Version:** v1.0.0 (Tagged in Git)
*   **Deployment:** Successfully deployed on Vercel.
*   **Database Schema:** Updated to support `income`, `expense`, and `tags`.
*   **Authentication:** Fully functional with Supabase Auth (Email/Password).

## Features Implemented

*   **Authentication:** Login and Sign Up (Email confirmation can be toggled in Supabase).
*   **Transactions:** Create and delete income/expense records with categories and descriptions.
*   **Dashboard:** Real-time summary of Balance, Total Income, and Total Expense.
*   **Visualization:** Daily activity bar chart for the last 7 days using Recharts.
*   **Categorization:** Built-in categories with lovely icons (Lucide-React).
*   **Tagging System:** Support for multiple tags per transaction.
*   **Mobile-First UI:** Responsive design with Bottom Navigation and Floating Action Button.

## Tech Stack

*   **Frontend:** React 19, TypeScript, Vite 8 (Beta).
*   **Styling:** Tailwind CSS v4.
*   **Backend:** Supabase (Auth & PostgreSQL).
*   **Charts:** Recharts.
*   **Icons:** Lucide-React.

## Development Workflow

*   **Main Branch:** Production-ready code (Synced with Vercel).
*   **Develop Branch:** Base for new features.
*   **Branching Strategy:** Use `feature/name` or `bugfix/name` branched from `develop`.
*   **Tagging:** Use semantic versioning (e.g., `v1.0.0`).

## Next Steps / TODOs (v1.1.0)

*   [ ] **Monthly Summary:** Filter transactions and charts by month.
*   [ ] **Budgeting:** Set monthly spending limits per category.
*   [ ] **PWA Support:** Make the app installable on iPhone/Android.
*   [ ] **Dark Mode:** Add support for dark theme.
*   [ ] **Data Export:** Export transactions to CSV/Excel.
