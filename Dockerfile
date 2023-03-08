
# Use an official Node.js runtime as a parent image
FROM node:16-alpine3.14

# Set the working directory to /app
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json ./

# Install dependencies
RUN npm install --production --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Set the NODE_ENV environment variable to production
ENV NODE_ENV=production

# Expose the port that the application will run on
EXPOSE 5050

# Start the application
CMD ["npm", "start"]
