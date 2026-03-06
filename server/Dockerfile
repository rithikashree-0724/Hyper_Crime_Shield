# Production Dockerfile for Hyper Shield Backend
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Create logs and backups directories
RUN mkdir -p logs backups uploads

# Expose port
EXPOSE 5001

# Run the application
CMD [ "node", "index.js" ]
