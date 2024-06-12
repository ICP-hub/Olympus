#!/bin/bash

# Stop on any error.
set -e

# Number of mentors/cohorts you want to register (ensure this matches the number of existing identities)
NUM_MENTORS=1000
START=1
echo "Using existing User Identities to Register as Mentors..."
CANISTER=$"wut7y-2iaaa-aaaag-qj24q-cai"
echo "Canister ID: $CANISTER"

# Define cohort titles, descriptions, and other data
titles=(
    "Blockbash 1"
    "Blockbash 2"
    "Blockbash 3"
    "Blockbash 4"
    "Blockbash 5"
)

descriptions=(
    "Incubator to superboost the ICP ecosystem in India 1"
    "Incubator to superboost the ICP ecosystem in India 2"
    "Incubator to superboost the ICP ecosystem in India 3"
    "Incubator to superboost the ICP ecosystem in India 4"
    "Incubator to superboost the ICP ecosystem in India 5"
)

tags="Tooling, DeFi, AI"
eligibility="Should be well versed with ICP ecosystem"
countries=("India" "USA" "UK" "Germany" "Canada")
funding_types=("Grant" "Investment" "Sponsorship")
start_date="2024-05-01"
deadline="2024-06-04"
cohort_launch_date="2024-06-03"
cohort_end_date="2024-08-30"

for i in $(seq $START $NUM_MENTORS); do
    # identity_name="user$i"
    # dfx identity use "$identity_name" --network ic
     CURRENT_PRINCIPAL=$(dfx identity get-principal --identity "user$i")
    echo "Using identity $identity_name with principal $CURRENT_PRINCIPAL."

    # Generate random values for level_on_rubric, no_of_seats, and funding_amount
    level_on_rubric=$(awk -v min=1 -v max=5 'BEGIN{srand(); print min+rand()*(max-min+1)}')
    no_of_seats=$((RANDOM % 50 + 10))  # Random number between 10 and 59
    funding_amount="$((RANDOM % 500 + 100))K USD"  # Random amount between 100K and 599K USD

    # Pick random values for country and funding_type
    country=${countries[$RANDOM % ${#countries[@]}]}
    funding_type=${funding_types[$RANDOM % ${#funding_types[@]}]}

    # Define cohort data for each mentor
    cohort_data="(record {
        title = \"${titles[$((i-1))]}\";
        description = \"${descriptions[$((i-1))]}\";
        tags = \"$tags\";
        criteria = record { 
          level_on_rubric = $level_on_rubric; 
          eligibility = opt \"$eligibility\"
        };
        no_of_seats = $no_of_seats;
        country = \"$country\";
        funding_amount = \"$funding_amount\";
        funding_type = \"$funding_type\";
        start_date = \"$start_date\";
        deadline = \"$deadline\";
        cohort_launch_date = \"$cohort_launch_date\";
        cohort_end_date = \"$cohort_end_date\";
    })"

    # Posting data for each mentor
    echo "Posting cohort data: $cohort_data"
    output=$(dfx canister call $CANISTER create_cohort "$cohort_data" --network ic --identity "user$i")
    echo "Output from creating cohort: $output"

    # Extract the cohort_id from the output
    response=$(dfx --identity "$identity_name" canister call $CANISTER get_my_pending_cohort_creation_requests '()' | sed 's/[()]//g' | tr -d '[:space:]')
    cohort_id=$(echo "$response" | grep -oP 'cohort_id="\K[^"]+')
    echo "the cohort id is $cohort_id"

    # Perform another action using the extracted cohort_id
    if [ ! -z "$cohort_id" ]; then
        echo "Accepting Creation Request with Cohort ID: $cohort_id"
        acceptance_output=$(dfx canister call $CANISTER accept_cohort_creation_request "(\"$cohort_id\")" --network ic --identity "user$i")
        echo "Output from accepting creation request: $acceptance_output"
    else
        echo "Failed to extract Cohort ID"
    fi

   
done