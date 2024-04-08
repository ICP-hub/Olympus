#!/bin/bash

set -e


dfx identity new principal2 --storage-mode=plaintext || true
dfx identity new principal3 --storage-mode=plaintext || true
dfx identity new principal4 --storage-mode=plaintext || true
dfx identity new principal5 --storage-mode=plaintext || true

TESTING1=$(dfx --identity default identity get-principal)
TESTING2=$(dfx --identity principal2 identity get-principal)
TESTING3=$(dfx --identity principal3 identity get-principal)
TESTING4=$(dfx --identity principal4 identity get-principal)
TESTING5=$(dfx --identity principal5 identity get-principal)

echo "TESTING1: $TESTING1"
echo "TESTING2: $TESTING2"
echo "TESTING3: $TESTING3"
echo "TESTING4: $TESTING4"
echo "TESTING5: $TESTING5"


# Define principal IDs
PRINCIPAL_IDS=("default" "principal2" "principal3" "principal4" "principal5")


declare -A mentor_data

mentor_data[default]='(record {
  preferred_icp_hub = opt "Hub Name";
  user_data = record {
    bio = opt "An enthusiastic learner and explorer.";
    country = "Wonderland";
    area_of_interest = "Technology";
    profile_picture = opt vec { 80; 75; 3; 4; };
    telegram_id = opt "default_telegram";
    twitter_id = opt "default_twitter";
    openchat_username = opt "default_openchat";
    email = opt "default@example.com";
    full_name = "John Doe Default";
  };
  existing_icp_mentor = false;
  exisitng_icp_project_porfolio = opt "Portfolio Link";
  icp_hub_or_spoke = false;
  category_of_mentoring_service = "Category Name";
  social_link = "Social Media Link";
  multichain = opt "Multichain Info";
  years_of_mentoring = "Number of Years";
  website = "Website URL";
  area_of_expertise = "Expertise Area";
  reason_for_joining = "Reason for Joining";
})'


mentor_data[principal2]='(record {
  preferred_icp_hub = opt "Hub Name";
  user_data = record {
    bio = opt "An enthusiastic learner and explorer.";
    country = "Wonderland";
    area_of_interest = "Technology";
    profile_picture = opt vec { 80; 75; 3; 4; };
    telegram_id = opt "default_telegram";
    twitter_id = opt "default_twitter";
    openchat_username = opt "default_openchat";
    email = opt "default@example.com";
    full_name = "John Doe two";
  };
  existing_icp_mentor = false;
  exisitng_icp_project_porfolio = opt "Portfolio Link";
  icp_hub_or_spoke = false;
  category_of_mentoring_service = "Category Name";
  social_link = "Social Media Link";
  multichain = opt "Multichain Info";
  years_of_mentoring = "Number of Years";
  website = "Website URL";
  area_of_expertise = "Expertise Area";
  reason_for_joining = "Reason for Joining";
})'


mentor_data[principal3]='(record {
  preferred_icp_hub = opt "Hub Name";
  user_data = record {
    bio = opt "An enthusiastic learner and explorer.";
    country = "Wonderland";
    area_of_interest = "Technology";
    profile_picture = opt vec { 80; 75; 3; 4; };
    telegram_id = opt "default_telegram";
    twitter_id = opt "default_twitter";
    openchat_username = opt "default_openchat";
    email = opt "default@example.com";
    full_name = "John Doe three";
  };
  existing_icp_mentor = false;
  exisitng_icp_project_porfolio = opt "Portfolio Link";
  icp_hub_or_spoke = false;
  category_of_mentoring_service = "Category Name";
  social_link = "Social Media Link";
  multichain = opt "Multichain Info";
  years_of_mentoring = "Number of Years";
  website = "Website URL";
  area_of_expertise = "Expertise Area";
  reason_for_joining = "Reason for Joining";
})'


mentor_data[principal4]='(record {
  preferred_icp_hub = opt "Hub Name";
  user_data = record {
    bio = opt "An enthusiastic learner and explorer.";
    country = "Wonderland";
    area_of_interest = "Technology";
    profile_picture = opt vec { 80; 75; 3; 4; };
    telegram_id = opt "default_telegram";
    twitter_id = opt "default_twitter";
    openchat_username = opt "default_openchat";
    email = opt "default@example.com";
    full_name = "John Doe four";
  };
  existing_icp_mentor = false;
  exisitng_icp_project_porfolio = opt "Portfolio Link";
  icp_hub_or_spoke = false;
  category_of_mentoring_service = "Category Name";
  social_link = "Social Media Link";
  multichain = opt "Multichain Info";
  years_of_mentoring = "Number of Years";
  website = "Website URL";
  area_of_expertise = "Expertise Area";
  reason_for_joining = "Reason for Joining";
})'

mentor_data[principal5]='(record {
  preferred_icp_hub = opt "Hub Name";
  user_data = record {
    bio = opt "An enthusiastic learner and explorer.";
    country = "Wonderland";
    area_of_interest = "Technology";
    profile_picture = opt vec { 80; 75; 3; 4; };
    telegram_id = opt "default_telegram";
    twitter_id = opt "default_twitter";
    openchat_username = opt "default_openchat";
    email = opt "default@example.com";
    full_name = "John Doe five";
  };
  existing_icp_mentor = false;
  exisitng_icp_project_porfolio = opt "Portfolio Link";
  icp_hub_or_spoke = false;
  category_of_mentoring_service = "Category Name";
  social_link = "Social Media Link";
  multichain = opt "Multichain Info";
  years_of_mentoring = "Number of Years";
  website = "Website URL";
  area_of_expertise = "Expertise Area";
  reason_for_joining = "Reason for Joining";
})'

# Loop through each principal ID
for PRINCIPAL_ID in "${!mentor_data[@]}"
do

dfx identity use "$PRINCIPAL_ID"
  CURRENT_PRINCIPAL=$(dfx identity get-principal)
  echo "Using identity $PRINCIPAL_ID with principal $CURRENT_PRINCIPAL"
  # Use dfx to call a canister function that retrieves user data by principal ID
  # Assuming CANISTER_NAME is your canister and get_user_data_by_principal is the function that returns user data
#   USER_DATA=$(dfx canister call IcpAccelerator_backend get_user_info_struct)

#   # Now dynamically construct the mentor_data record using the fetched USER_DATA
#   # This example just echoes the USER_DATA for demonstration purposes
#   # In a real scenario, you would parse USER_DATA and construct your mentor_data record accordingly
#   echo "Fetched user data for ${PRINCIPAL_ID}: ${USER_DATA}"

  # Example of constructing a mentor_data record (simplified for clarity)
  # You'll need to adjust the parsing of USER_DATA to match your actual data structure and requirements
  MENTOR_DATA=${mentor_data[$PRINCIPAL_ID]}
  echo "Registering with data: $MENTOR_DATA"

  # Use MENTOR_DATA in your intended operation, such as registering a mentor profile
  # For demonstration, this example just echoes the constructed MENTOR_DATA
  dfx canister call IcpAccelerator_backend  register_mentor_candid "($MENTOR_DATA)"
  echo "Constructed mentor data for ${PRINCIPAL_ID}: ${MENTOR_DATA}"
done

dfx identity use default

echo "Listing all mentors users:"
dfx canister call IcpAccelerator_backend get_all_mentors_candid