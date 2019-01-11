FROM node

ADD src /app
ADD package.json /app/
ADD yarn.lock /app/

WORKDIR /app

RUN yarn install --production

EXPOSE 3001
CMD ["node", "index.js"]
