FROM mhart/alpine-node:10 as build-stage
WORKDIR /app
COPY . .
RUN yarn install --pure-lockfile
RUN yarn build
RUN yarn --production

FROM mhart/alpine-node:base-10
WORKDIR /app
ENV NODE_ENV="production"
COPY --from=build-stage /app .
EXPOSE 3000
CMD ["node", "./node_modules/.bin/next", "start"]

