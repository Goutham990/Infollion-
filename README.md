# Dynamic Form Application

This project is a dynamic form builder built with React and Vite, served by a Node.js/Express backend. 

## Features

- **Dynamic Questions**: Add new parent questions dynamically.
- **Nested Child Questions**: Select "True/False" and answer "True" to add nested child questions recursively.
- **Auto-numbering**: Questions are automatically numbered based on their hierarchy (e.g., Q1, Q1.1, Q1.1.1).
- **Deletion**: Delete any question and its sub-questions.
- **Form Submission**: Displays all questions in a hierarchical format.
- **Reordering (Bonus)**: Reorder parent questions via drag-and-drop.
- **Local Storage (Bonus)**: Current state is saved to Local Storage to prevent data loss.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, `@hello-pangea/dnd` (for drag-and-drop)
- **Backend**: Node.js, Express

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Setup & Run Instructions

1. **Install Dependencies**
   Run the following command in the root directory to install both backend and frontend dependencies, and build the frontend application:
   ```bash
   npm run build
   ```

2. **Start the Server**
   Run the following command to start the Express server:
   ```bash
   npm start
   ```

3. **View the Application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Development Mode

If you wish to run the React application in development mode with Hot Module Replacement (HMR):

```bash
npm run dev
```

This will start the Vite development server (usually on `http://localhost:5173`).
