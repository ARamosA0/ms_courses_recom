FROM node:18-alpine

WORKDIR /frontend

EXPOSE 3000

# RUN npm install vite

COPY package*.json ./

RUN npm install -g npm@10.2.4

RUN npm ci && \
 npm cache clean --force && \
 mv /fronten/node_modules /node_modules

COPY . .

CMD ["npm", "run", "dev"]
