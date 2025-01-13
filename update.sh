#!/bin/bash

# Navigate to the repository directory
cd /OpenFileConverter

# Pull the latest changes from the repository
echo "Pulling latest changes from the repository..."
git pull

# Rebuild and restart the containers
echo "Rebuilding and restarting the containers..."
sudo docker-compose up --build -d

echo "Update complete."

