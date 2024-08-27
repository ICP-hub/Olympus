#!/bin/bash

set -e

# Number of mentors you want to register (ensure this matches the number of existing identities)
NUM_MENTORS=5
START=1


echo "Using existing User Identities to Register as Mentors..."
CANISTER=$(dfx canister id IcpAccelerator_backend)
echo "Canister ID: $CANISTER"
ASSET_CANISTER=$(dfx canister id asset_canister_backend)
echo "Canister ID: $ASSET_CANISTER"

# Register each existing identity as a mentor

declare -a mentors
for i in $(seq $START $NUM_MENTORS); do
    identity_name="user$i"
    dfx identity use "$identity_name"
    CURRENT_PRINCIPAL=$(dfx identity get-principal)
    echo "Using identity $identity_name with principal $CURRENT_PRINCIPAL."

    # Fetch random user data
    response=$(curl -s "https://randomuser.me/api/")
    full_name=$(echo $response | jq -r '.results[0].name.first + " " + .results[0].name.last')
    email=$(echo $response | jq -r '.results[0].email')

    profile_image_url="$ASSET_CANISTER/uploads/"$CURRENT_PRINCIPAL"_user.jpeg";
    # echo "profile_image url is $profile_image_url";
    profile_image=$(node url_to_vector.js $profile_image_url)
    # echo "profile_image is $profile_image";
    
    country="India"
    bio="This is a bio for User $i, an expert in field $i."
    area_of_interest="Interest $i"


    mentors[$i]='record { 
    name_of_fund = "Angel"; 
    assets_under_management = opt ""; 
    registered = false; 
    average_check_size = 500000.00; 
    existing_icp_investor = false; 
    existing_icp_portfolio = opt ""; 
    type_of_investment = "Defi"; 
    project_on_multichain = opt ""; 
    category_of_investment = "Defi"; 
    preferred_icp_hub = "Portugal"; 
    investor_type = opt "MVP to Initial Traction"; 
    number_of_portfolio_companies = 10; 
    portfolio_link = "lunarstrategy.com"; 
    user_data = record { 
        full_name = "user $i"; 
        email = opt "user$i@example.com"; 
        profile_picture  = opt vec '$profile_image';
        country = "India"; 
        telegram_id = opt ""; 
        bio = opt "bio for user$i"; 
        area_of_interest = "Defi"; 
        twitter_id = opt ""; 
        openchat_username = opt ""; 
        type_of_profile = opt "Individual"; 
        reason_to_join = opt vec { "Funding" }; 
    }; 
    website_link = opt "lunarstrategy.com"; 
    linkedin_link = "https://www.linkedin.com/feed/"; 
}'

    vc_data="${mentors[$i]}" 
    echo "Registering VC $i with data: $vc_data"
    dfx canister call $CANISTER register_venture_capitalist "($vc_data)"

    # Optionally approve the mentor
    echo "Approving the request"
done