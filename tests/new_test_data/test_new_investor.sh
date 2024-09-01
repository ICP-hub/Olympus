#!/bin/bash

set -e

# Number of mentors you want to register (ensure this matches the number of existing identities)
NUM_MENTORS=50
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


    social_links='opt vec { record { link = opt "https://twitter.com/user'$i'"; }; record { link = opt "https://linkedin.com/in/user'$i'"; }; }'

    mentors[$i]='record { 
        name_of_fund = "Fund Name '"$i"'"; 
        fund_size = opt 10000000.00; 
        assets_under_management = opt "10M"; 
        registered_under_any_hub = opt false; 
        average_check_size = 500000.00; 
        existing_icp_investor = false; 
        money_invested = opt 2000000.00; 
        existing_icp_portfolio = opt "Portfolio details here"; 
        type_of_investment = "Equity"; 
        project_on_multichain = opt "Yes"; 
        category_of_investment = "Defi"; 
        reason_for_joining = opt "Interested in ICP ecosystem"; 
        preferred_icp_hub = "Portugal"; 
        investor_type = opt "Institutional"; 
        number_of_portfolio_companies = 15; 
        portfolio_link = "https://portfolio-link.com"; 
        website_link = opt "https://fund-website.com"; 
        links = '"$social_links"'; 
        registered = true; 
        registered_country = opt "Portugal"; 
        stage = opt "Early Stage"; 
        range_of_check_size = opt "500K-1M"; 
    }'

    vc_data="${mentors[$i]}" 
    echo "Registering VC $i with data: $vc_data"
    dfx canister call $CANISTER register_venture_capitalist "($vc_data)"

    # Optionally approve the mentor
    echo "Approving the request"
done