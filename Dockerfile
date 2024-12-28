# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app

# Copy frontend-related files
COPY package*.json ./
COPY public/ ./public/
COPY src/ ./src/
COPY tailwind.config.js ./

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

# Copy backend files
COPY app.py .
COPY instance/ ./instance/

# Copy all frontend files (needed for react-scripts start)
COPY --from=frontend-builder /app/node_modules/ ./node_modules/
COPY --from=frontend-builder /app/package*.json ./
COPY --from=frontend-builder /app/public/ ./public/
COPY --from=frontend-builder /app/src/ ./src/
COPY --from=frontend-builder /app/tailwind.config.js ./

# Environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PORT=3000
ENV REACT_APP_BACKEND_URL=http://localhost:5000
ENV WDS_SOCKET_PORT=0

# Expose both frontend and backend ports
EXPOSE 3000
EXPOSE 5000

# Create startup script
RUN echo '#!/bin/bash\nnpm start & python app.py' > start.sh && \
    chmod +x start.sh

# Set the entrypoint to run both frontend and backend
CMD ["./start.sh"]
