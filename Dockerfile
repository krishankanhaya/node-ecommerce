FROM node:23.8-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]
