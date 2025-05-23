# Base image with Node.js and Chrome
FROM ghcr.io/puppeteer/puppeteer:latest

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy your app code
COPY . .

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
