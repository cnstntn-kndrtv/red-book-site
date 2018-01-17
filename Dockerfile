FROM node:latest

RUN apt-get update && \
    apt-get install mc -y

ENV TERM=xterm

# pull app
RUN git clone https://github.com/cnstntn-kndrtv/red-book-site.git
WORKDIR /red-book-site
RUN npm install

EXPOSE 3005
EXPOSE 443
VOLUME /data/cert

CMD npm run update
CMD npm run start