FROM node:16

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json ./
COPY package-lock.json ./


# Copy the rest of the application files
COPY ./contracts ./contracts

# Install the dependencies
RUN npm ci --only=production

# Run the application
CMD [ "npm", "start" ]
