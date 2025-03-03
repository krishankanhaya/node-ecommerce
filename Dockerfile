FROM node:23.8-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=5000

EXPOSE 5000

RUN npm run build

# Start the application
CMD ["npm", "start"]
