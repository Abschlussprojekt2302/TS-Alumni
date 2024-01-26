#!/bin/bash

chmod 400 "SSH-Abschlussproject.pem"

ssh -i "SSH-Abschlussproject.pem" root@ec2-3-125-155-152.eu-central-1.compute.amazonaws.com <<EOF
    
    docker run --name frontend -d -p 80:80 -i aws2302/aws2302:latest
EOF



