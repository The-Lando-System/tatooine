#!/bin/bash

# Pull the latest image
docker pull thelandosystem/sandcrawler > /dev/null

# Run the container
docker run -d sandcrawler:latest