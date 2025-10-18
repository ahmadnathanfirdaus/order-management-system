FROM node:20.19-bullseye

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 4000 5173

CMD ["npm", "run", "dev:full"]
