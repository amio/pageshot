FROM node:7.8
LABEL name="pageshot"

# https://github.com/electron/electron/issues/6945#issuecomment-241968955
RUN apt-get update
RUN apt-get install -y gtk+-2.0 dbus-1 x11 x11-xcb xcb xi xcursor xdamage xrandr xcomposite xext xfixes xrender xtst xscrnsaver gconf-2.0 gmodule-2.0 nss
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/" npm install

EXPOSE 3003

ENV DEBUG=*
CMD node index.js
