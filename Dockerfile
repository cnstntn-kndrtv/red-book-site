FROM node:latest

# pull app
RUN git clone https://github.com/cnstntn-kndrtv/red-book-site.git
WORKDIR /red-book-site
RUN npm install

EXPOSE 3005

CMD node createTermsList
CMD npm start