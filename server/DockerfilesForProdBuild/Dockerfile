FROM profiling-base:latest as build

WORKDIR /usr/src/app
COPY . .

RUN npm run build

FROM profiling-prod:latest as prod

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist

RUN chown node:node -R /usr/src/app/dist

USER node

CMD ["node","dist/main"]