FROM node:18.15.0 AS build

# Building the platform
WORKDIR /loernwerk
COPY . /loernwerk
RUN npm i
RUN npm run build

# Use built platform to build image
FROM scratch
COPY --from=build /loernwerk/build /loernwerk

WORKDIR /loernwerk

# Setting default environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV HOSTNAME="localhost"
ENV DATABASE_FILE="loernwerk.db"

EXPOSE 5000

RUN npm i --omit=dev
CMD ["npm", "run", "start"]