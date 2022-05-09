#!/bin/bash

cd /home/ubuntu/backend
sudo cp /home/ubuntu/.env ./
sudo pm2 stop all
sudo pm2 delete all
sudo pm2 start "./dist/src/main.js"
