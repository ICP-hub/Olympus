#!/bin/bash


set -e

dfx identity new user17 --storage-mode=plaintext || true
dfx identity new user18 --storage-mode=plaintext || true
dfx identity new user19 --storage-mode=plaintext || true
dfx identity new user20 --storage-mode=plaintext || true


CANISTER=$(dfx canister id IcpAccelerator_backend --network ic)
echo "Canister ID: $CANISTER"


# IDENTITIES=("default" "principal2" "principal3" "principal4" "principal5")


declare -a mentor_data

# mentor_data[0]='record { 
#     preferred_icp_hub = opt "";
#     user_data = ;
#     existing_icp_mentor = true;
#     existing_icp_project_porfolio = opt "";
#     icop_hub_or_spoke = true;
#     category_of_mentoring_service = "";
#     linkedin_link = "";
#     multichain = opt "";
#     years_of_mentoring = "";
#     website = "";
#     area_of_expertise = "";
#     reason_for_joining = "";
#     hub_owner = opt "";    
# }'

mentor_data[0]='record { preferred_icp_hub = opt "ICP.HUB India";user_data = record { full_name = "Luca Parks";email = opt "lucaparks@gmail.com";country = "Italy";telegram_id = opt "lucaparks";bio = opt "Mobile app developer for Android and iOS, cloud computing specialist, AWS certified, focuses on cybersecurity and ethical hacking, focuses on cybersecurity and ethical hacking, full-stack developer, f.";area_of_intrest = "NFT";twitter_id = opt "lucaparks";openchat_username = opt "lucaparks";};existing_icp_mentor = true;existing_icp_project_porfolio = opt "Openchat, Distrikt";icop_hub_or_spoke = false;category_of_mentoring_service = "Smart Contract Development:";linkedin_link = "https://www.linkedin.com/company/crewsphere/";multichain = opt "ICP, Bitcoin, Ethereum";years_of_mentoring = "3";website = "https://droomdroom.com/";area_of_expertise = "DeFi";reason_for_joining = "Token Integration and Economic Incentives";hub_owner = opt "";}'
mentor_data[1]='record { preferred_icp_hub = opt "ICP.HUB Indonesia";user_data = record { full_name = "Ainsley Stanton";email = opt "ainsleystanton@gmail.com";country = "Indonesia";telegram_id = opt "ainsleystanton";bio = opt "Database administrator, expert in SQL and NoSQL, web developer, expert in JavaScript and React, data scientist, analyzing big data for insights, web developer, expert in JavaScript and React.";area_of_intrest = "SocialFi";twitter_id = opt "ainsleystanton";openchat_username = opt "ainsleystanton";};existing_icp_mentor = false;existing_icp_project_porfolio = opt "https://github.com/huzaifsk/defi-app";icop_hub_or_spoke = true;category_of_mentoring_service = "Security and Auditing";linkedin_link = "https://www.linkedin.com/company/droomdroom/";multichain = opt "ICP, Bitcoin";years_of_mentoring = "5";website = "https://internetcomputer.org/community";area_of_expertise = "Tokenomics and Governance";reason_for_joining = "Community and Ecosystem";hub_owner = opt "ICP.HUB Indonesia";}'
mentor_data[2]='record { preferred_icp_hub = opt "ICP.HUB India";user_data = record { full_name = "Zyair Lawrence";email = opt "zyairlawrence@gmail.com";country = "India";telegram_id = opt "zyairlawrence";bio = opt "Data scientist, analyzing big data for insights, game developer using Unity and Unreal Engine, cloud computing specialist, AWS certified, specializes in frontend development, specializes in frontend d.";area_of_intrest = "Developer Tooling";twitter_id = opt "zyairlawrence";openchat_username = opt "zyairlawrence";};existing_icp_mentor = true;existing_icp_project_porfolio = opt "https://github.com/Kr-Gagandeo1025/dbank_Blockchain";icop_hub_or_spoke = true;category_of_mentoring_service = "Community and Ecosystem Engagement";linkedin_link = "https://www.linkedin.com/in/deepak-goyal-%E2%88%9E-1511ab7/";multichain = opt "ICP, Ethereum";years_of_mentoring = "7";website = "https://internetcomputer.org/events";area_of_expertise = "Blockchain Development";reason_for_joining = "Security";hub_owner = opt "ICP.HUB India";}'
mentor_data[3]='record { preferred_icp_hub = opt "ICP.HUB Indonesia";user_data = record { full_name = "Nicolas Christensen";email = opt "nicolaschristensen@gmail.com";country = "Italy";telegram_id = opt "nicolaschristensen";bio = opt "Web developer, expert in JavaScript and React, machine learning engineer, focused on deep learning, specializes in frontend development, network engineer, skilled in infrastructure design, database ad.";area_of_intrest = "DeFi";twitter_id = opt "nicolaschristensen";openchat_username = opt "nicolaschristensen";};existing_icp_mentor = false;existing_icp_project_porfolio = opt "https://github.com/vittorione94/ICP-Implementation";icop_hub_or_spoke = true;category_of_mentoring_service = "Infrastructure and Deployment";linkedin_link = "https://www.linkedin.com/in/javier-arroyo-ferrer-%E2%99%BE-94546a50/";multichain = opt "ICP, Bitcoin, Ethereum, Solana";years_of_mentoring = "10";website = "https://internetcomputer.org/news";area_of_expertise = "Performance Optimization";reason_for_joining = "Token Integration and Economic Incentives";hub_owner = opt "ICP.HUB Latum";}'


# echo ${mentor_data}


for IDENTITY in "${!mentor_data[@]}"
do
    userText="user"
    userNumber=$((IDENTITY + 17))
    userText+=$userNumber

    dfx identity use "${userText}"
    CURRENT_PRINCIPAL=$(dfx identity get-principal)
    echo "Using identity $userText with principal $CURRENT_PRINCIPAL"

    # Extract and use the user data for the current identity
    USER_DATA=${mentor_data[$IDENTITY]}
    echo "Registering with data: $USER_DATA"

    # Call the register_user function with the current identity and its unique data
    dfx canister call $CANISTER register_mentor_candid "($USER_DATA)" --network ic

    # approve_vc_creation_request
    echo "approving the request"
    dfx canister call --identity default $CANISTER approve_mentor_creation_request_candid "(principal \"$CURRENT_PRINCIPAL\", true)" --network ic
done


# dfx identity use default

# echo "Listing all registered mentors:"
# dfx canister call $CANISTER get_all_mentors