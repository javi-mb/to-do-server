FROM node:22

WORKDIR /app

COPY package.json package-lock.json ./
COPY . .

RUN npm install

EXPOSE 3001

CMD ["node", "index.js"]

