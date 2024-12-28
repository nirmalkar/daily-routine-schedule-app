# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app


# Copy the current directory contents into the container at /app
COPY . /app

COPY package*.json ./app


# Copy the rest of the frontend files
COPY public /app/public
COPY src /app/src
COPY tailwind.config.js /app
COPY requirements.txt /app
COPY instance /app/instance


# Stage 2: Build the Python backend and combine with the frontend
FROM python:3.11-slim-bookworm AS final


# Upgrade pip
RUN pip install --no-cache-dir --upgrade pip
# Install backend dependencies
RUN pip install --no-cache-dir -r requirements.txt



# Install Node.js
RUN apt-get update && apt-get install -y nodejs npm

# Build the frontend
RUN npm run build

# Define environment variable
ENV NAME Daily-Routine-Schedule-App



# Expose the backend port
EXPOSE 5000

# Set the entrypoint to run both the frontend and backend
CMD ["sh", "-c", "cd app && npm start & python ./app.py"]
