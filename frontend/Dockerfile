FROM node:20-alpine3.16

WORKDIR /app

EXPOSE 3000

COPY package-lock.json package.json ./

RUN npm install

COPY . ./

CMD ["npm", "start"]