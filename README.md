# DIDOLOG (Management App)

A web-based task management application built with **Svelte**, **Vite**, and **TypeScript**. This app allows users to manage their to-do items, tasks, and reminders efficiently with an intuitive and responsive interface.

## Features

- **To-do Management:** Create, edit, complete, and delete to-do items.
- **Task Linking:** Associate to-do items with tasks using a dynamic task selector.
- **Status Indicators:** Visual representation of item statuses (e.g., in progress, completed).
- **Reminders:** Set and manage reminders linked to tasks and to-dos.
- **Priority Management:** Assign fixed default priorities to to-do items.
- **Editable Text Components:** In-place editing with keyboard and button interactions.
- **Universal Components:** Reusable UI elements like buttons, input fields, and status indicators.
- **Versioning Workflow:** Automated version control with a structured Git branching strategy.

## Git Workflow

The project follows a structured Git branching strategy:

- **alpha:** Development branch for new features.
- **beta:** Testing branch after features are confirmed working.
- **main:** Production-ready branch with versioned releases.

Automated versioning starts at `1.0.0`, with patches incrementing to versions like `1.0.1` for bug fixes.

## Project Structure

- Modular components for to-dos, tasks, and reminders.
- Global stores for centralized state management.
- Reusable components for consistency and maintainability.
- Clear separation of concerns between UI and logic.

## Usage

- Add, edit, and delete to-do items.
- Link to-dos to tasks using a searchable dropdown.
- Mark items as complete and track creation and completion times.
- Use universal buttons and editable text components for interactions.

## Accessibility & UX

- Keyboard interactions (Enter, Escape, blur events) for seamless editing.
- Accessible components with appropriate ARIA roles and focus management.
- Visual cues for status indicators and interactive elements.

## Technologies Used

- **Svelte**: Front-end framework for building responsive UI.
- **Vite**: Fast development and build tool.
- **TypeScript**: Type-safe codebase for better maintainability.
- **UUID**: Consistent item referencing across stores.

## Future Improvements

- Enhanced filtering and sorting options.
- User authentication and personalization.
- Mobile-first optimizations.
- Integration with external calendar services.

## Getting Started

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Run the app with `npm run dev`.
4. Build for production with `npm run build`.

---

This project is designed to simplify task management with an emphasis on usability, consistency, and a clean interface.

