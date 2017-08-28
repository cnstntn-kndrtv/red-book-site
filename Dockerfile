FROM node:latest

# pull app
RUN git clone https://github.com/cnstntn-kndrtv/red-book-site.git
WORKDIR /red-book-site
RUN npm install

EXPOSE 3005

#  pm2
# RUN npm install pm2 -g

CMD node createTermsList
CMD npm start
# CMD pm2-docker keystone.js