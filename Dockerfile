FROM mhart/alpine-node

WORKDIR /src
ADD . .

RUN npm install

EXPOSE  5050
COPY config.json /src/config.json
CMD npm run docker
