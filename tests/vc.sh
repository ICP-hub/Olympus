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


declare -A venture_capitalist_data

venture_capitalist_data[default]='(record {
  name_of_fund = "Example Fund 1 ";
  fund_size = 1000000.0;
  assets_under_management = "5000000";
  logo = vec { 80; 75; 3; 4; }; 
  registered_under_any_hub = opt "ICP Hub Name";
  average_check_size = 250000.0;
  existing_icp_investor = true;
  money_invested = 300000.0;
  existing_icp_portfolio = "Example Portfolio";
  type_of_investment = "Seed";
  project_on_multichain = opt "Yes";
  category_of_investment = "Tech";
  reason_for_joining = "Interest in ICP ecosystem";
  preferred_icp_hub = "Preferred ICP Hub";
  investor_type = "Venture Capital";
  number_of_portfolio_companies = 15;
  portfolio_link = "http://example.com/portfolio";
  announcement_details = "No announcements at this time";
  user_data = record {
    full_name = "VC Representative Name 1 ";
    profile_picture = opt vec { 80; 75; 3; 4; };
    email = opt "contact@examplefund.com";
    country = "Wonderland";
    telegram_id = opt "vc_telegram";
    bio = opt "A brief bio of the VC representative.";
    area_of_intrest = "Blockchain";
    twitter_id = opt "vc_twitter";
    openchat_username = opt "vc_openchat";
  };
})'


venture_capitalist_data[principal2]='(record {
  name_of_fund = "Example Fund 2 ";
  fund_size = 1000000.0;
  assets_under_management = "5000000";
  logo = vec { 80; 75; 3; 4; }; 
  registered_under_any_hub = opt "ICP Hub Name";
  average_check_size = 250000.0;
  existing_icp_investor = true;
  money_invested = 300000.0;
  existing_icp_portfolio = "Example Portfolio";
  type_of_investment = "Seed";
  project_on_multichain = opt "Yes";
  category_of_investment = "Tech";
  reason_for_joining = "Interest in ICP ecosystem";
  preferred_icp_hub = "Preferred ICP Hub";
  investor_type = "Venture Capital";
  number_of_portfolio_companies = 15;
  portfolio_link = "http://example.com/portfolio";
  announcement_details = "No announcements at this time";
  user_data = record {
    full_name = "VC Representative Name 2 ";
    profile_picture = opt vec { 80; 75; 3; 4; };
    email = opt "contact@examplefund.com";
    country = "Wonderland";
    telegram_id = opt "vc_telegram";
    bio = opt "A brief bio of the VC representative.";
    area_of_intrest = "Blockchain";
    twitter_id = opt "vc_twitter";
    openchat_username = opt "vc_openchat";
  };
})'


venture_capitalist_data[principal3]='(record {
  name_of_fund = "Example Fund 3 ";
  fund_size = 1000000.0;
  assets_under_management = "5000000";
  logo = vec { 80; 75; 3; 4; }; 
  registered_under_any_hub = opt "ICP Hub Name";
  average_check_size = 250000.0;
  existing_icp_investor = true;
  money_invested = 300000.0;
  existing_icp_portfolio = "Example Portfolio";
  type_of_investment = "Seed";
  project_on_multichain = opt "Yes";
  category_of_investment = "Tech";
  reason_for_joining = "Interest in ICP ecosystem";
  preferred_icp_hub = "Preferred ICP Hub";
  investor_type = "Venture Capital";
  number_of_portfolio_companies = 15;
  portfolio_link = "http://example.com/portfolio";
  announcement_details = "No announcements at this time";
  user_data = record {
    full_name = "VC Representative Name 3 ";
    profile_picture = opt vec { 80; 75; 3; 4; };
    email = opt "contact@examplefund.com";
    country = "Wonderland";
    telegram_id = opt "vc_telegram";
    bio = opt "A brief bio of the VC representative.";
    area_of_intrest = "Blockchain";
    twitter_id = opt "vc_twitter";
    openchat_username = opt "vc_openchat";
  };
})'


venture_capitalist_data[principal4]='(record {
  name_of_fund = "Example Fund 4 ";
  fund_size = 1000000.0;
  assets_under_management = "5000000";
  logo = vec { 80; 75; 3; 4; }; 
  registered_under_any_hub = opt "ICP Hub Name";
  average_check_size = 250000.0;
  existing_icp_investor = true;
  money_invested = 300000.0;
  existing_icp_portfolio = "Example Portfolio";
  type_of_investment = "Seed";
  project_on_multichain = opt "Yes";
  category_of_investment = "Tech";
  reason_for_joining = "Interest in ICP ecosystem";
  preferred_icp_hub = "Preferred ICP Hub";
  investor_type = "Venture Capital";
  number_of_portfolio_companies = 15;
  portfolio_link = "http://example.com/portfolio";
  announcement_details = "No announcements at this time";
  user_data = record {
    full_name = "VC Representative Name 4 ";
    profile_picture = opt vec { 80; 75; 3; 4; };
    email = opt "contact@examplefund.com";
    country = "Wonderland";
    telegram_id = opt "vc_telegram";
    bio = opt "A brief bio of the VC representative.";
    area_of_intrest = "Blockchain";
    twitter_id = opt "vc_twitter";
    openchat_username = opt "vc_openchat";
  };
})'


venture_capitalist_data[principal5]='(record {
  name_of_fund = "Example Fund 5 ";
  fund_size = 1000000.0;
  assets_under_management = "5000000";
  logo = vec { 80; 75; 3; 4; }; 
  registered_under_any_hub = opt "ICP Hub Name";
  average_check_size = 250000.0;
  existing_icp_investor = true;
  money_invested = 300000.0;
  existing_icp_portfolio = "Example Portfolio";
  type_of_investment = "Seed";
  project_on_multichain = opt "Yes";
  category_of_investment = "Tech";
  reason_for_joining = "Interest in ICP ecosystem";
  preferred_icp_hub = "Preferred ICP Hub";
  investor_type = "Venture Capital";
  number_of_portfolio_companies = 15;
  portfolio_link = "http://example.com/portfolio";
  announcement_details = "No announcements at this time";
  user_data = record {
    full_name = "VC Representative Name 5 ";
    profile_picture = opt vec { 80; 75; 3; 4; };
    email = opt "contact@examplefund.com";
    country = "Wonderland";
    telegram_id = opt "vc_telegram";
    bio = opt "A brief bio of the VC representative.";
    area_of_intrest = "Blockchain";
    twitter_id = opt "vc_twitter";
    openchat_username = opt "vc_openchat";
  };
})'




# Loop through each principal ID
for PRINCIPAL_ID in "${!venture_capitalist_data[@]}"
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
  MENTOR_DATA=${venture_capitalist_data[$PRINCIPAL_ID]}
  echo "Registering with data: $MENTOR_DATA"

  # Use MENTOR_DATA in your intended operation, such as registering a mentor profile
  # For demonstration, this example just echoes the constructed MENTOR_DATA
  dfx canister call IcpAccelerator_backend  register_venture_capitalist "($MENTOR_DATA)"
  echo "Constructed mentor data for ${PRINCIPAL_ID}: ${MENTOR_DATA}"
done

dfx identity use default

echo "Listing all mentors users:"
dfx canister call IcpAccelerator_backend list_all_vcs