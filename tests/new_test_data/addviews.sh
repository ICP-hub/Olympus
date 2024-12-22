#!/bin/bash

set -e

# Constants
NUM_VIEWERS=50  # Number of viewers
NUM_VIEWS_PER_VIEWER=5  # Number of views per viewer
CANISTER_ID=$(dfx canister id IcpAccelerator_backend)  # Replace with your canister name
IS_SELF_VIEW=false  # Always false for views by others
TARGET_PRINCIPAL="sccpy-dk475-whkic-ud6rn-6pju5-p67ta-hxdet-wvvhk-bowc2-cs5bq-uae"  # Target principal for views

# Function to create viewer identities
create_viewer_identities() {
  echo "Creating viewer identities..."
  for i in $(seq 1 "$NUM_VIEWERS"); do
    identity="viewer$i"
    dfx identity new "$identity" --storage-mode plaintext || true
  done
}

# Function to simulate views for the target principal
simulate_views() {
  echo "Simulating views for principal $TARGET_PRINCIPAL..."
  for i in $(seq 1 "$NUM_VIEWERS"); do
    viewer="viewer$i"
    dfx identity use "$viewer"
    viewer_principal=$(dfx identity get-principal)

    echo "Viewer $viewer (Principal: $viewer_principal) is viewing $TARGET_PRINCIPAL..."

    for ((j = 1; j <= NUM_VIEWS_PER_VIEWER; j++)); do
      # Call the canister to add a view
      response=$(dfx canister call "$CANISTER_ID" add_view "(record { is_self_view = $IS_SELF_VIEW })" 2>&1)

      if [[ $response == *"Ok"* ]]; then
        echo "Success: Viewer $viewer added a view to $TARGET_PRINCIPAL."
      else
        echo "Error: Failed to add view by $viewer to $TARGET_PRINCIPAL. Response: $response"
      fi
    done
  done
}

# Main execution
create_viewer_identities
simulate_views

# Reset to the default identity
dfx identity use default
echo "Simulation completed."
