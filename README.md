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
