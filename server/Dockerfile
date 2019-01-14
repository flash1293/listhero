FROM node:8 as build

ADD src /app
ADD package.json /app/
ADD yarn.lock /app/

WORKDIR /app

RUN yarn install --production

FROM node:8-alpine

COPY --from=build /app /
EXPOSE 3001
CMD ["node", "index.js"]
