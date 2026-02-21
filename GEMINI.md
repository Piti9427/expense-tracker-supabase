# Gemini Context: Expense Tracker with Supabase

This project is a React application built with TypeScript and Vite, intended to be an expense tracker integrated with Supabase.

## Project Overview

*   **Name:** `expense-tracker-supabase`
*   **Purpose:** An expense tracking application.
*   **Architecture:** Frontend-heavy SPA using React 19, with plans for Supabase as the backend/database.
*   **Key Technologies:**
    *   **React 19:** UI framework.
    *   **TypeScript:** Type safety.
    *   **Vite 8 (Beta):** Build tool and dev server.
    *   **ESLint 9:** Linting and code quality.
    *   **Supabase:** (Planned) Backend for authentication and data storage.

## Building and Running

The project uses standard npm scripts for development and production:

*   **Start Development Server:**
    ```bash
    npm run dev
    ```
*   **Build for Production:**
    ```bash
    npm run build
    ```
*   **Lint Code:**
    ```bash
    npm run lint
    ```
*   **Preview Production Build:**
    ```bash
    npm run preview
    ```

## Development Conventions

*   **Modern React:** Uses React 19 features and functional components with Hooks.
*   **Strict Typing:** TypeScript is configured in strict mode (`strict: true`).
*   **Code Quality:** ESLint is configured with `typescript-eslint` and React hooks plugins.
*   **HMR:** Vite's Hot Module Replacement is enabled for a fast development loop.
*   **Styling:** Currently using plain CSS (`App.css`, `index.css`).

## Project Structure

*   `src/`: Main source code.
    *   `main.tsx`: Entry point.
    *   `App.tsx`: Root component.
    *   `assets/`: Static assets like images.
*   `public/`: Public assets served as-is.
*   `index.html`: Main HTML template.
*   `vite.config.ts`: Vite configuration.
*   `tsconfig.json`: TypeScript configuration (split into `tsconfig.app.json` and `tsconfig.node.json`).
*   `eslint.config.js`: ESLint flat config.

## TODOs / Next Steps

*   [x] Install and configure Supabase client (`@supabase/supabase-js`).
*   [ ] Set up Supabase project and environment variables (`.env`).
*   [ ] Implement Authentication.
*   [ ] Design and implement the database schema for expenses.
*   [ ] Create UI components for adding and listing expenses.
