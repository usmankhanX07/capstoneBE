FROM node:24-alpine

WORKDIR /app
# RUN mkdir -p /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "app.js"]