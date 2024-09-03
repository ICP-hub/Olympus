#!/bin/bash

set -e

# Number of mentors you want to register (ensure this matches the number of existing identities)
NUM_MENTORS=20
START=11
echo "Using existing User Identities to Register as Mentors..."
CANISTER=$(dfx canister id IcpAccelerator_backend)
echo "Canister ID: $CANISTER"
ASSET_CANISTER=$(dfx canister id asset_canister_backend)
echo "Canister ID: $ASSET_CANISTER"

declare -a expertise=("DeFi" "Tooling" "DAO" "Social" "NFTs")
declare -a reasons=("Mentoring" "Networking" "Collaboration" "Learning" "Investing")
declare -a services=("Blockchain" "Startup Mentorship" "Project Management" "Technical Guidance" "Strategic Planning")

# Randomly select items from arrays
get_random_element() {
    declare -a arr=("${!1}")
    echo "${arr[$RANDOM % ${#arr[@]}]}"
}

# Register each existing identity as a mentor
for i in $(seq $START $NUM_MENTORS); do
    identity_name="user$i"
    dfx identity use "$identity_name"
    CURRENT_PRINCIPAL=$(dfx identity get-principal)
    echo "Using identity $identity_name with principal $CURRENT_PRINCIPAL."

    # Fetch random user data
    response=$(curl -s "https://randomuser.me/api/")
    full_name=$(echo $response | jq -r '.results[0].name.first + " " + .results[0].name.last')
    email=$(echo $response | jq -r '.results[0].email')
    country=$(echo $response | jq -r '.results[0].location.country')

    # Randomly generate other mentor-specific data
    linkedin_link="https://www.linkedin.com/in/example/$i"
    website="https://example.com/$i"
    area_of_expertise=$(get_random_element expertise[@])
    category_of_service=$(get_random_element services[@])
    reason_for_joining=$(get_random_element reasons[@])

    # Construct the mentor data
    mentor_data="record {
        preferred_icp_hub = opt \"$country\";
        existing_icp_mentor = false;
        existing_icp_project_portfolio = opt \"\";  
        icp_hub_or_spoke = false;
        category_of_mentoring_service = \"$category_of_service\";
        links = opt vec {};  
        multichain = opt vec {}; 
        years_of_mentoring = \"$((RANDOM % 20 + 1))\";
        website = opt \"$website\";
        area_of_expertise = vec { \"$area_of_expertise\" };  
        reason_for_joining = opt \"$reason_for_joining\";
        hub_owner = opt \"\"; 
    }"

    echo "Registering Mentor $i with data: $mentor_data"
    dfx canister call $CANISTER register_mentor "($mentor_data)"

done