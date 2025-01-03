# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app

# Copy frontend-related files
COPY package*.json ./
COPY public/ ./public/
COPY src/ ./src/
COPY tailwind.config.js ./
COPY .env ./

# Install dependencies and build frontend
RUN npm install
RUN npm run build

# Stage 2: Setup Python backend and combine with frontend
FROM python:3.11-slim-bookworm AS final
WORKDIR /app

# Install Node.js and npm for serving frontend
RUN apt-get update && \
    apt-get install -y nodejs npm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Create instance directory for SQLite database
RUN mkdir -p instance && chown -R root:root instance && chmod 777 instance

# Copy backend files and environment variables
COPY app.py .
COPY .env .

# Copy all frontend files (needed for react-scripts start)
COPY --from=frontend-builder /app/node_modules/ ./node_modules/
COPY --from=frontend-builder /app/package*.json ./
COPY --from=frontend-builder /app/public/ ./public/
COPY --from=frontend-builder /app/src/ ./src/
COPY --from=frontend-builder /app/tailwind.config.js ./
COPY --from=frontend-builder /app/.env ./

# Create startup script that sources environment variables and starts both services
RUN echo '#!/bin/bash\n\
source .env\n\
cd /app\n\
python app.py & \
PORT=$REACT_PORT npm start' > /app/start.sh && \
chmod +x /app/start.sh

# Set the working directory and run the start script
WORKDIR /app
VOLUME /app/instance
CMD ["/app/start.sh"]
