# Use official Node.js slim image
FROM node:20-slim

# Set environment variable to skip Puppeteer's default Chromium download
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Install dependencies required by Chrome
RUN apt-get update && \
    apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Chrome manually
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    dpkg -i google-chrome-stable_current_amd64.deb || true && \
    apt-get -f install -y && \
    rm google-chrome-stable_current_amd64.deb

# Create app directory
WORKDIR /app

# Copy package.json files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app's code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run the server
CMD ["node", "server.js"]
