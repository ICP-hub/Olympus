#!/bin/bash

set -e

# remove ids
NUM_MENTORS=1000
START=1

# Get the default identity
DEFAULT_IDENTITY=$(dfx identity whoami --network ic) 

for i in $(seq $START $NUM_MENTORS); do
    CURRENT_IDENTITY="user$i"
    
    if [ "$CURRENT_IDENTITY" == "$DEFAULT_IDENTITY" ]; then
        echo "Skipping removal of default identity: $CURRENT_IDENTITY"
    else
        dfx identity remove "$CURRENT_IDENTITY" --network ic
        echo "Removed $CURRENT_IDENTITY"
    fi
done