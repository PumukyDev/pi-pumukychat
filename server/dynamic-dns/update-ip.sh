#!/bin/bash

# Read the URL from the 'update_url' file and execute the curl request
curl -f $(cat update_url)
