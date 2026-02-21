# Gemini Context: PocketTrack (Expense Tracker)

This project is a React 19 application built with TypeScript, Vite 8, and Tailwind CSS v4, integrated with Supabase for authentication and data storage.

## Project Status: v1.2.0 (Development)

*   **Current Version:** v1.2.0 (Feature complete for Dynamic Filtering)
*   **Deployment:** v1.1.0 is stable on Vercel. v1.2.0 is in `feature/dynamic-date-filter`.
*   **Database Schema:** Supports `income`, `expense`, `tags`, and `budgets`.

## Features Implemented

*   **Dynamic Date Filtering (v1.2.0):** Filter data by Day, Week, Month, and Year with adaptive navigation.
*   **Adaptive Charts:** Visualization automatically groups data by day, weekday, or month based on the selected range.
*   **Budgeting System:** Monthly limits per category with real-time progress bars and visual alerts.
*   **Search & Utilities:** Real-time search by category/tags/notes and CSV data export.
*   **PWA & Experience:** Installable app support and manual/auto Dark Mode with high-contrast earthy tones.
*   **Core Logic:** Full Income/Expense tracking with multi-tagging and Supabase integration.

## Tech Stack

*   **Frontend:** React 19, TypeScript, Vite 8.
*   **Styling:** Tailwind CSS v4 (Custom Earthy Palette: Soft Walnut, Natural Linen, Sage Green).
*   **Backend:** Supabase (Auth & PostgreSQL).
*   **Charts:** Recharts.
*   **Icons:** Lucide-React.

## Development Workflow

*   **Branching:** Using `feature/name` branched from `develop`.
*   **Tagging:** v1.0.0 (Core), v1.1.0 (Budgeting). Next: v1.2.0.

## Next Steps / TODOs

*   [ ] **Custom Date Range:** Allow users to pick specific start and end dates.
*   [ ] **PWA Refinement:** Enhance offline capabilities and splash screens.
*   [ ] **Advanced Analytics:** Pie charts for category distribution.
*   [ ] **Recurring Transactions:** Support for automated monthly records.
