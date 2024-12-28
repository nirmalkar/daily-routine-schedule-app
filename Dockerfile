# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend files
COPY public ./public
COPY src ./src
COPY tailwind.config.js .

# Build the frontend
RUN npm run build

# Stage 2: Build the Python backend and combine with the frontend
FROM python:3.11-slim-bookworm AS final

WORKDIR /app

# Copy requirements.txt
COPY requirements.txt .

# Install backend dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend files
COPY app.py .
COPY instance ./instance

# Copy the built frontend from the frontend-builder stage
COPY --from=frontend-builder /app/build ./public

# Install Node.js
RUN apt-get update && apt-get install -y nodejs npm

# Copy the frontend source files and package files
COPY --from=frontend-builder /app/src ./src
COPY --from=frontend-builder /app/package*.json ./

# Expose the backend port
EXPOSE 5000

# Set the entrypoint to run both the frontend and backend
CMD ["sh", "-c", "cd src && npm start & cd .. && python app.py"]
