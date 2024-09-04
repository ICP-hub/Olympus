#!/bin/bash

set -e

# remove ids
NUM_MENTORS=4
START=3

# Get the default identity
DEFAULT_IDENTITY=$(dfx identity whoami)

for i in $(seq $START $NUM_MENTORS); do
    CURRENT_IDENTITY="user$i"
    
    if [ "$CURRENT_IDENTITY" == "$DEFAULT_IDENTITY" ]; then
        echo "Skipping removal of default identity: $CURRENT_IDENTITY"
    else
        dfx identity remove "$CURRENT_IDENTITY"
        echo "Removed $CURRENT_IDENTITY"
    fi
done