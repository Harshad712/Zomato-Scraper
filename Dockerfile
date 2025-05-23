# Use official Node.js image
FROM node:20-slim

# Install necessary dependencies for Puppeteer
RUN apt-get update && \
    apt-get install -y wget gnupg ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 libgdk-pixbuf2.0-0 libnspr4 libnss3 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 xdg-utils --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    dpkg -i google-chrome-stable_current_amd64.deb || true && \
    apt-get -f install -y && \
    rm google-chrome-stable_current_amd64.deb

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy your app code
COPY . .

# Expose port
EXPOSE 3000

# Run the app
CMD ["node", "server.js"]
