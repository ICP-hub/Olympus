#!/bin/bash

set -e

# Number of mentors and projects you want to register (ensure this matches the number of existing identities)

NUM_PROJECTS=5
START=1
echo "Using existing User Identities to Register as Mentors and Projects..."
CANISTER=$(dfx canister id IcpAccelerator_backend)
echo "Canister ID: $CANISTER"

# Sample data for mentors



# Register each existing identity as a mentor and project


declare -a projects
for i in $(seq $START $NUM_PROJECTS); do
    identity_name="user$i"
    dfx identity use "$identity_name"
    CURRENT_PRINCIPAL=$(dfx identity get-principal)
    echo "Using identity $identity_name with principal $CURRENT_PRINCIPAL."


    full_name="user $i"
    email="user$i@example.com"
    profile_picture="opt vec {255; 216; 255; 224; 0; 16; 74; 70; 73; 70; 0; 1; 1; 0; 0; 1; 0; 1; 0; 0; 255; 219; 0; 67; 0; 8; 6; 6; 7; 6; 5; 8; 7; 7; 7; 9; 9; 8; 10; 12; 20; 13; 12; 11; 11; 12; 25; 18; 19; 15; 20; 29; 26; 31; 30; 29; 26; 28; 28; 32; 36; 46; 39; 32; 34; 44; 35; 28; 28; 40; 55; 41; 44; 48; 49; 52; 52; 52; 31; 39; 57; 61; 56; 50; 60; 46; 51; 52; 50}"
    country="India"
    bio="bio for user $i"
    area_of_interest="Defi"

    # Sample data for projects
    project_name="Project $i"
    project_logo="vec {255; 216; 255; 224; 0; 16; 74; 70; 73; 70; 0; 1; 1; 0; 0; 1; 0; 1; 0; 0; 255; 219; 0; 67; 0; 8; 6; 6; 7; 6; 5; 8; 7; 7; 7; 9; 9; 8; 10; 12; 20; 13; 12; 11; 11; 12; 25; 18; 19; 15; 20; 29; 26; 31; 30; 29; 26; 28; 28; 32; 36; 46; 39; 32; 34; 44; 35; 28; 28; 40; 55; 41; 44; 48; 49; 52; 52; 52; 31; 39; 57; 61; 56; 50; 60; 46; 51; 52; 50}"
    project_cover="vec {255; 216; 255; 224; 0; 16; 74; 70; 73; 70; 0; 1; 1; 0; 0; 1; 0; 1; 0; 0; 255; 219; 0; 67; 0; 8; 6; 6; 7; 6; 5; 8; 7; 7; 7; 9; 9; 8; 10; 12; 20; 13; 12; 11; 11; 12; 25; 18; 19; 15; 20; 29; 26; 31; 30; 29; 26; 28; 28; 32; 36; 46; 39; 32; 34; 44; 35; 28; 28; 40; 55; 41; 44; 48; 49; 52; 52; 52; 31; 39; 57; 61; 56; 50; 60; 46; 51; 52; 50}"
    project_area_of_focus="Blockchain"
    reason_to_join_incubator="Innovative Project"
    self_rating_of_project=4.5

    # Sample data for money raised
    money_raised="opt record {
        sns = opt \"Some SNS\";
        investors = opt \"Some Investors\";
        raised_from_other_ecosystem = opt \"Yes\";
        target_amount = opt 500000.00;
        icp_grants = opt \"Some Grants\";
    }"

    projects[$i]="record {
    project_name = \"$project_name\";
    project_logo = $project_logo;
    preferred_icp_hub = opt \"Portugal\";
    live_on_icp_mainnet = opt false;
    money_raised_till_now = opt true;
    supports_multichain = opt \"Yes\";
    project_elevator_pitch = opt \"Revolutionizing Blockchain\";
    project_area_of_focus = \"$project_area_of_focus\";
    promotional_video = opt \"https://example.com/video\";
    github_link = opt \"https://github.com/sample\";
    reason_to_join_incubator = \"$reason_to_join_incubator\";
    project_description = opt \"A sample project focused on blockchain technology\";
    project_cover = $project_cover;
    project_team = opt vec {};
    token_economics = opt \"Stable\";
    technical_docs = opt \"https://example.com/docs\";
    long_term_goals = opt \"To become a leading blockchain platform\";
    target_market = opt \"Global\";
    self_rating_of_project = $self_rating_of_project;
    user_data = record { 
        full_name = \"$full_name\"; 
        email = opt \"$email\"; 
        profile_picture = $profile_picture; 
        country = \"$country\"; 
        telegram_id = opt \"\"; 
        bio = opt \"$bio\"; 
        area_of_interest = \"$area_of_interest\"; 
        twitter_id = opt \"\"; 
        openchat_username = opt \"\"; 
        type_of_profile = opt \"Individual\"; 
        reason_to_join = opt vec { \"Funding\" }; 
    }; 
    mentors_assigned = opt vec {};
    vc_assigned = opt vec {};
    project_twitter = opt \"https://twitter.com/sample\";
    project_linkedin = opt \"https://linkedin.com/sample\";
    project_website = opt \"https://sample.com\";
    project_discord = opt \"https://discord.com/sample\";
    money_raised = $money_raised;
    upload_private_documents = opt true;
    private_docs = opt vec {};
    public_docs = opt vec {};
    dapp_link = opt \"https://dapp.sample.com\";
    weekly_active_users = opt 1000;
    revenue = opt 10000;
    is_your_project_registered = opt true;
    type_of_registration = opt \"LLC\";
    country_of_registration = opt \"Portugal\";
}"

    
   
    project_data="${projects[$i]}" 
    echo "Registering Project $i with data: $project_data"
    dfx canister call $CANISTER register_project "($project_data)"

    # Optiona
    # Optionally approve the project
    echo "Approving the project request"
    dfx canister call --identity default $CANISTER approve_project_creation_request "(principal \"$CURRENT_PRINCIPAL\", true)"
done