FROM node:20.11.0
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm i @nestjs/cli
RUN npm i
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start"]