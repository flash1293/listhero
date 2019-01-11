FROM node as build

ADD src /app
ADD package.json /app/
ADD yarn.lock /app/

WORKDIR /app

RUN yarn install --production

FROM gcr.io/distroless/nodejs

COPY --from=build /app /
EXPOSE 3001
CMD ["node", "index.js"]