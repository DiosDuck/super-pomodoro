FROM node:20-alpine

RUN npm install -g @angular/cli

WORKDIR /app

CMD ["npx", "ng", "build", "--watch", "--poll", "200"]
