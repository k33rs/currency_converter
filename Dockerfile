FROM node:10

WORKDIR /usr/src/app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install --production

COPY . .

ENTRYPOINT [ "yarn", "start" ]
