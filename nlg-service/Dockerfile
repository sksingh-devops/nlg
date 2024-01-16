FROM node:16
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --development --silent && mv node_modules ../
COPY . .
EXPOSE 8085
RUN mkdir -p /usr/src/app/uploads
RUN chown -R node /usr/src/app
USER node
CMD ["node", "index.js"]
