# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app


# Copy the current directory contents into the container at /app
COPY . /app

# Copy package.json and package-lock.json
COPY package*.json ./app

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend files
COPY public ./app/public
COPY src ./app/src
COPY tailwind.config.js .app
COPY requirements.txt ./app
COPY instance ./app/instance

# Build the frontend
RUN npm run build

# Stage 2: Build the Python backend and combine with the frontend
FROM python:3.11-slim-bookworm AS final



# Install backend dependencies
RUN pip install --no-cache-dir -r ./app/requirements.txt




# Install Node.js
RUN apt-get update && apt-get install -y nodejs npm


# Expose the backend port
EXPOSE 5000

# Set the entrypoint to run both the frontend and backend
CMD ["sh", "-c", "cd app && npm start & python ./app.py"]
