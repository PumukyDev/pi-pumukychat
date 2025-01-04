#!/bin/bash

# Read the URL from the 'update_url' file and execute the curl request
curl -f $(cat update_url)  # Use -f to make curl fail on HTTP errors

# Check the exit status of the curl command
if [ $? -ne 0 ]; then
    # If curl failed, print an error message with the timestamp
    printf "$(date '+%d-%m-%y %T'): ERROR: There was an issue updating the IP address\n"
else
    # If curl succeeded, print a success message with the timestamp
    printf "$(date '+%d-%m-%y %T'): SUCCESS: The IP address was updated successfully\n"
fi
