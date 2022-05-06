#!/bin/bash

# Install node.js
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install nodemon
# sudo npm install nodemon -g

# Install forever module 
# https://www.npmjs.com/package/forever
sudo npm install forever -g
sudo npm install pm2 -g
# Clean working folder
# sudo find /home/ubuntu/test -type f -delete