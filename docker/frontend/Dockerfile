FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npx", "ng", "build", "--watch", "--poll", "200"]
