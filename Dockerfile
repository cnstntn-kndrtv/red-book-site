FROM node:latest

# pull app
RUN git clone https://github.com/cnstntn-kndrtv/red-book-site.git
WORKDIR /red-book-site
RUN npm install pm2 -g

RUN npm install

CMD pm2 start