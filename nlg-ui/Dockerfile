# Base image 
FROM node:16-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files to the container
COPY . .

# Build the React app
RUN npm run build


# Base image for serving the built React app
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d

# Copy the built app from the build stage to the nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Expose the desired port
EXPOSE 80

# Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
