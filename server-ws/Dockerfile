FROM node:24-slim

WORKDIR /app

# On ne copie que ce qui est dans server-ws
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "index.js"]
