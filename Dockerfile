FROM node:7.8
LABEL name="pageshot"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/" npm install

EXPOSE 3003

ENV DEBUG=electron*
CMD node index.js
