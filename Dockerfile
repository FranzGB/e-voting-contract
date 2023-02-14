FROM node:16

# Set the working directory
WORKDIR /app

# Copy the rest of the application files
COPY . .

# Install the dependencies
RUN npm i -g truffle

# Run the application
RUN truffle compile

# Copy built contract to frontend public/contracts folder
RUN cp -r /app/build/contracts /app/frontend/public/contracts

# Change the working directory to the frontend
WORKDIR /app/frontend

# Install frontend dependencies
RUN npm ci

# Build the frontend
RUN npm run build

# Expose the port
EXPOSE 3000

# Run the application
CMD ["npm", "run", "start"]
