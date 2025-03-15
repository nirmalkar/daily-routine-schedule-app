# Daily Routine Schedule App

This application helps you manage your daily routines, todos, and memos. It consists of a React frontend and a Python backend.

![ToDo App](https://github.com/com2u/daily-routine-schedule-app/blob/main/images/todo.png)

## Usage

The application provides a user-friendly interface to manage your daily schedule. Here's a breakdown of the main sections:

### Daily Routine
This section allows you to view and manage your daily routines. You can add, edit, and delete routines. The application automatically saves your data per day.

### To-Do
This section allows you to manage your to-do list. You can add, edit, and delete tasks. You can also copy unselected todos to the next day using the arrow button.

### Memos
This section allows you to create and manage memos. It also includes a timer that restarts automatically after 20 minutes.

### Date Navigation
Use the date navigation to view your schedule for different days. Double click on the date to switch to the current date.

The application also supports a Dark/Light mode.

The application can be personalized using the `settings.json` file.

## Architecture

The application consists of the following components:

- A Flask application (`app.py`) as the backend for the database, running on port 5000.
- A Node.js application for the frontend, running on port 3000.

The application is deployed via Docker.

The port and database configuration are located in the `.env` file.

The database, `settings.json`, and `.env` files are mounted for the docker container.

## Technologies

### React Frontend
The frontend is built using React, providing a dynamic and responsive user interface. It uses components to manage the different sections of the app.

### Python Backend
The backend is built using Python, providing the necessary API endpoints for the frontend to interact with.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Application Specification

## Overview

This application is a daily routine management tool that allows users to manage their todos, schedule, routines, and memos. It also includes a timer in the memo section. The application uses a backend API to store and retrieve data.

## Features

### Theme Management
- The application supports light and dark themes.
- The initial theme is set based on the user's system preferences.
- Users can toggle between light and dark themes using a button.

### Date Navigation
- Users can navigate between days using previous and next day buttons.
- Users can jump to the current day by double-clicking the date.

### Todo Section
- Users can add todos by typing them into a text area.
- Each todo is displayed with a checkbox that can be used to mark it as done.
- Users can copy unchecked todos to the next day.

### Schedule Section
- Users can create and manage timeboxes in a schedule grid.
- Timeboxes can be dragged and resized.
- Users can edit the text of a timebox.
- Users can delete timeboxes.

### Routines Section
- Users can toggle the completion status of routines.
- Routines are displayed as a list with checkboxes.

### Memo Section
- Users can write memos in a text area.
- A timer is included in the memo section.
- The timer can be started and paused.
- The timer plays a sound when it reaches zero.

### Data Storage
- The application uses a backend API to store and retrieve data.
- The API base URL is determined by the `REACT_APP_BACKEND_URL` environment variable or defaults to `http://localhost:5000`.
- The API provides endpoints for fetching and saving daily data.

### Layout
- The application uses a flexible layout with resizable columns.
- The layout is divided into four sections: Todo, Schedule, Routines, and Memo.
- Users can resize the columns using splitters.

## File Structure

### src/api.js
- Defines functions for fetching and saving daily data from the backend API.

### src/App.js
- The main component of the React application.
- Manages the application's theme and renders the `DailyRoutine` component.

### src/DailyRoutine.js
- The core component of the application.
- Manages the daily routine data and renders the different sections.
- Fetches and saves data using the `api.js` functions.
- Manages the column sizes for the different sections using the `Splitter` component.

### src/TodoSection.js
- Renders the todo list section.
- Allows users to add todos, mark them as done, and copy unchecked todos to the next day.

### src/ScheduleSection.js
- Renders the schedule section.
- Allows users to create and manage timeboxes.

### src/RoutinesSection.js
- Renders the routines section.
- Allows users to toggle the completion status of routines.

### src/MemoSection.js
- Renders the memo section.
- Allows users to write memos and use a timer.

### src/DateNavigation.js
- Renders the date navigation section.
- Allows users to navigate between days.

### src/Splitter.js
- Renders a vertical splitter that allows users to resize the columns in the layout.

### src/index.js
- The entry point of the React application.
- Renders the `App` component into the root element of the HTML page.

### src/App.css
- Contains the CSS styles for the `App` component.

### src/index.css
- Contains the global CSS styles for the application.

### src/settings.json
- Contains the default routines and the timer duration for the memo section.

## Data Models

### Todo
- `text`: string
- `done`: boolean

### Timebox
- `id`: number
- `text`: string
- `startTime`: number
- `duration`: number

### Routine
- `name`: string
- `done`: boolean

## Dependencies
- React
- lucide-react
- tailwindcss

## Backend API

- The backend API should provide the following endpoints:
    - `GET /api/daily-data/:date`: Fetches daily data for a specific date.
    - `POST /api/daily-data/:date`: Saves daily data for a specific date.

## Settings

- The `src/settings.json` file contains the following settings:
    - `routines`: An array of routine objects with `name` and `done` properties.
    - `timer`: The timer duration in minutes.

## Folder Structure

```DailyRoutineScheduleApps/backend
├── app/
│   ├── __init__.py              # Application factory and blueprint registration
│   ├── config.py                # Application configuration classes (Dev, Prod, etc.)
│   ├── extensions.py            # Initialize extensions (e.g., SQLAlchemy, CORS)
│   ├── models/                  # Database models
│   │   ├── __init__.py          # Imports all models
│   │   └── daily_data.py        # DailyData model
│   ├── routes/                  # API endpoints organized by feature
│   │   ├── __init__.py          # Blueprint registration for routes
│   │   └── daily_data.py        # Routes for daily data endpoints
│   ├── services/                # Business logic and background services
│   │   ├── __init__.py
│   │   └── backup_service.py    # Backup logic and scheduled tasks
│   ├── settings/                # Settings and configuration loaders
│   │   ├── __init__.py
│   │   └── settings_loader.py   # Load settings.json and similar files
│   └── utils/                   # Utility modules (helpers, validations, etc.)
│       ├── __init__.py
│       └── date_utils.py        # Date format validation, etc.
├── migrations/                  # Database migration scripts (if using Flask-Migrate)
├── tests/                       # Unit and integration tests
│   ├── __init__.py
│   └── test_daily_data.py       # Tests for your daily data endpoints and logic
├── instance/                    # Instance folder for configuration overrides (not in VCS)
│   └── config.py
├── logs/                        # Log files
│   └── app.log
├── app.py                       # Application entry point to run the server
├── requirements.txt             # Python dependencies list
└── settings.json                # Global settings file (e.g., default routines)
```
