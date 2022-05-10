#!/bin/bash

sudo pm2 stop all
sudo pm2 delete all
cd /home/ubuntu/backend
sudo cp /home/ubuntu/.env ./
sudo STAGE=dev pm2 start "./dist/src/main.js"
