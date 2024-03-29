#!/bin/bash

set -e

CANISTER=$(dfx canister id IcpAccelerator_backend --network ic)
echo "Canister ID: $CANISTER"

declare -a job_data

project1=$(dfx --identity user1 canister --network ic call $CANISTER get_project_id '()' | sed 's/[()]//g')
project2=$(dfx --identity user2 canister --network ic call $CANISTER get_project_id '()' | sed 's/[()]//g')
project3=$(dfx --identity user3 canister --network ic call $CANISTER get_project_id '()' | sed 's/[()]//g')
project4=$(dfx --identity user4 canister --network ic call $CANISTER get_project_id '()' | sed 's/[()]//g')
project5=$(dfx --identity user5 canister --network ic call $CANISTER get_project_id '()' | sed 's/[()]//g')
project6=$(dfx --identity user6 canister --network ic call $CANISTER get_project_id '()' | sed 's/[()]//g')
# for project in $project1
# do 
#     set -- $project
#     echo $1 | sed 's/[()]//g'
# done
# echo 'record { "DSCVR Frontend Integration on Internet Computer","DSCVR is a decentralized borrowing protocol that allows users to draw interest-free loans against Ether used as collateral. DSCVR now has a fully decentralized, immutable frontend hosted on the Internet Computer.","job","https://dscvr.one/",'${project1}'}'

job_data[0]='record { title = "DSCVR Frontend Integration on Internet Computer"; description = "DSCVR is a decentralized borrowing protocol that allows users to draw interest-free loans against Ether used as collateral. DSCVR now has a fully decentralized, immutable frontend hosted on the Internet Computer."; category = "JOBS"; link = "https://dscvr.one/"; project_id = '${project1}'; location = "Remote";}'
job_data[1]='record { title = "OpenChats Unique Approach to Data Exploration"; description = "OpenChat is the most advanced web3.0 search engine of exceptional speed and accuracy, that empowers its users to search over the Internet Computer."; category = "BOUNTY"; link = "https://oc.app/"; project_id = '${project2}'; location = "Bangalore";}'
job_data[2]='record { title = "Distrikt - Transactions with Unparalleled Isolation"; description = "Self-custody made simple and secure. Turn a spare smartphone into a cold wallet that can store a plethora of tokens including ICP and ckBTC. Using Distrikt, you can stake ICP directly on the NNS and participate in governance."; category = "JOBS"; link = "https://distrikt.app/"; project_id = '${project3}'; location = "Bangalore";}'
job_data[3]='record { title = "Bitfinity EVM - Revolutionizing Scalability on the Internet Computer"; description = "Worried about data being persisted or how your data structure will scale across canisters? Bitfinity EVM can help you focus more on building out your vision, and spend less time thinking about how to scale out your multi-canister architecture on the IC."; category = "BOUNTY"; link = "https://bitfinity.network/"; project_id = '${project4}'; location = "Bangalore";}'
job_data[4]='record { title = "Yumi - Empowering Community Moderation with Innovative Tools"; description = "Modclub is an AI-enhanced decentralized crowdwork platform that handles resource-intensive tasks such as moderation, user verification and data labeling."; category = "BOUNTY"; link = "https://tppkg-ziaaa-aaaal-qatrq-cai.raw.ic0.app/"; project_id = '${project5}'; location = "Bangalore";}'
job_data[5]='record { title = "Bioniq - Empowering Decentralized Staking on the Internet Computer Network"; description = "Bioniq is the liquid-staking protocol revolutionizing staking on the Internet Computer, putting control in investors hands. ICP is staked in the NNS DAO, and stakers receive rewards just by holding the stICP token. The stICP token is DeFi-compatible, to support protocols building on the Internet Computer, and always fully-backed by ICP staked in the NNS."; category = "RFP"; link = "https://bioniq.io/home/24-hours"; project_id = '${project6}'; location = "Bangalore";}'
# echo ${job_data}


for IDENTITY in "${!job_data[@]}"
do
    userText="user"
    userNumber=$((IDENTITY + 1))
    userText+=$userNumber

    dfx identity use "${userText}"
    CURRENT_PRINCIPAL=$(dfx identity get-principal)
    echo "Using identity $userText with principal $CURRENT_PRINCIPAL"

    # Extract and use the user data for the current identity
    PROJECT_DATA=${job_data[$IDENTITY]}
    echo "Registering with data: $PROJECT_DATA"

    # Call the register_user function with the current identity and its unique data
    dfx canister call $CANISTER post_job "($PROJECT_DATA)" --network ic

    # # approve_project_creation_request
    # echo "approving the request"
    # dfx canister call --identity default $CANISTER approve_project_creation_request "(principal \"$CURRENT_PRINCIPAL\")"

done


# dfx identity use default

# echo "Listing all registered jobs:"
# dfx canister call $CANISTER list_all_projects