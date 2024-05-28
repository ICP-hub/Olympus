# #!/bin/bash

# # Stop on any error.
# set -e

# dfx identity new user17 --storage-mode=plaintext || true

# TESTING18=$(dfx --identity user18 identity get-principal)

# # Retrieve your canister ID.
# CANISTER=$(dfx canister id IcpAccelerator_backend)
# echo "Canister ID: $CANISTER"

# # Define cohort data in a format expected by the Rust canister.
# declare -a cohort_data

# # Fill cohort_data with actual data formatted properly.
# cohort_data[0]='(record {
#     title = "Blockbash";
#     description = "Incubator to superboost the ICP ecosystem in India";
#     tags = "Tooling, DeFi, AI";
#     criteria = record { 
#       level_on_rubric = 1.0; 
#       eligibility = opt "Should be well versed with ICP ecosystem"
#     };
#     no_of_seats = 25;  
#     deadline = "2024-06-04";
#     cohort_launch_date = "2024-06-03";
#     cohort_end_date = "2024-08-30";
# })'

# # Loop through cohort_data and call the canister method.
# # for DATA in "${cohort_data[@]}"
# # do
# #     echo "Posting data: $DATA"
# #     dfx canister call $CANISTER create_cohort "$DATA"
# # done


# for IDENTITY in "${cohort_data[@]}"
# do
#     # userText="user"
#     # userNumber=$((IDENTITY + 1))
#     # userText+=$userNumber

#     # dfx identity use "${userText}"
#     CURRENT_PRINCIPAL=$(dfx identity get-principal)
#     echo "Using identity $userText with principal $CURRENT_PRINCIPAL"

#     # Extract and use the user data for the current identity
#     COHORT_DATA=${anouncement_data[$IDENTITY]}
#     # echo "Registering with data: $PROJECT_DATA"

#     # Call the register_user function with the current identity and its unique data
#     dfx canister call $CANISTER create_cohort "($COHORT_DATA)"

#     # # approve_project_creation_request
#     # echo "approving the request"
#     # dfx canister call --identity default $CANISTER approve_project_creation_request "(principal \"$CURRENT_PRINCIPAL\")"

# done


#!/bin/bash

# Stop on any error.
set -e

# Set the identity to use
dfx identity use user17

# Retrieve principal for logging purposes
TESTING18=$(dfx --identity user18 identity get-principal)

# Retrieve your canister ID.
CANISTER=$(dfx canister id IcpAccelerator_backend)
echo "Canister ID: $CANISTER"

# Define cohort data in a format expected by the Rust canister.
cohort_data='(record {
    title = "Blockbash";
    description = "Incubator to superboost the ICP ecosystem in India";
    tags = "Tooling, DeFi, AI";
    criteria = record { 
      level_on_rubric = 1.0; 
      eligibility = opt "Should be well versed with ICP ecosystem"
    };
    no_of_seats = 25;  
    deadline = "2024-06-04";
    cohort_launch_date = "2024-06-03";
    cohort_end_date = "2024-08-30";
})'

# Posting data directly without loop
echo "Posting cohort data: $cohort_data"
output=$(dfx canister call $CANISTER create_cohort "$cohort_data")
echo "Output from creating cohort: $output"

# Extract the cohort_id from the output using awk
cohort_id=$(echo "$output" | awk -F'ID ' '{print $2}' | awk '{print $1}')
echo "Extracted Cohort ID: $cohort_id"

# Perform another action using the extracted cohort_id
if [ ! -z "$cohort_id" ]; then
    echo "Accepting Creation Request with Cohort ID: $cohort_id"
    acceptance_output=$(dfx canister call $CANISTER accept_cohort_creation_request "(\"$cohort_id\")")
    echo "Output from accepting creation request: $acceptance_output"
else
    echo "Failed to extract Cohort ID"
fi

# Optionally, check the current principal
CURRENT_PRINCIPAL=$(dfx identity get-principal)
echo "Using identity with principal $CURRENT_PRINCIPAL"
