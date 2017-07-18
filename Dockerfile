FROM amio/node-chrome-cjk

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN ls -al
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
