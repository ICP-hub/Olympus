#!/bin/bash

set -e

CANISTER=$(dfx canister id IcpAccelerator_backend)
echo "Canister ID: $CANISTER"

project1=$(dfx --identity user1 canister call $CANISTER get_project_id '()' | sed 's/[()]//g')
project2=$(dfx --identity user2 canister call $CANISTER get_project_id '()' | sed 's/[()]//g')
project3=$(dfx --identity user3 canister call $CANISTER get_project_id '()' | sed 's/[()]//g')
project4=$(dfx --identity user4 canister call $CANISTER get_project_id '()' | sed 's/[()]//g')
project5=$(dfx --identity user5 canister call $CANISTER get_project_id '()' | sed 's/[()]//g')
project6=$(dfx --identity user6 canister call $CANISTER get_project_id '()' | sed 's/[()]//g')
project7=$(dfx --identity user7 canister call $CANISTER get_project_id '()' | sed 's/[()]//g')
project8=$(dfx --identity user8 canister call $CANISTER get_project_id '()' | sed 's/[()]//g')
project9=$(dfx --identity user9 canister call $CANISTER get_project_id '()' | sed 's/[()]//g')
project10=$(dfx --identity user10 canister call $CANISTER get_project_id '()' | sed 's/[()]//g')
project11=$(dfx --identity user11 canister call $CANISTER get_project_id '()' | sed 's/[()]//g')
project12=$(dfx --identity user12 canister call $CANISTER get_project_id '()' | sed 's/[()]//g')

echo $project1

user13=$(dfx --identity user13 identity get-principal)
user14=$(dfx --identity user14 identity get-principal)
user15=$(dfx --identity user15 identity get-principal)
user16=$(dfx --identity user16 identity get-principal)
user17=$(dfx --identity user17 identity get-principal)
user18=$(dfx --identity user18 identity get-principal)
user19=$(dfx --identity user19 identity get-principal)
user20=$(dfx --identity user20 identity get-principal)
user21=$(dfx --identity user21 identity get-principal)
user22=$(dfx --identity user22 identity get-principal)
user23=$(dfx --identity user23 identity get-principal)
user24=$(dfx --identity user24 identity get-principal)
user25=$(dfx --identity user25 identity get-principal)

# echo $user13

echo $(dfx --identity user1 canister call $CANISTER update_team_member '('$project1', principal "'$user13'")')
echo $(dfx --identity user1 canister call $CANISTER update_team_member '('$project1', principal "'$user14'")')
echo $(dfx --identity user2 canister call $CANISTER update_team_member '('$project2', principal "'$user15'")')
echo $(dfx --identity user2 canister call $CANISTER update_team_member '('$project2', principal "'$user16'")')
echo $(dfx --identity user3 canister call $CANISTER update_team_member '('$project3', principal "'$user17'")')
echo $(dfx --identity user4 canister call $CANISTER update_team_member '('$project4', principal "'$user18'")')
echo $(dfx --identity user5 canister call $CANISTER update_team_member '('$project5', principal "'$user19'")')
echo $(dfx --identity user6 canister call $CANISTER update_team_member '('$project6', principal "'$user20'")')
echo $(dfx --identity user7 canister call $CANISTER update_team_member '('$project7', principal "'$user21'")')
echo $(dfx --identity user8 canister call $CANISTER update_team_member '('$project8', principal "'$user22'")')
echo $(dfx --identity user9 canister call $CANISTER update_team_member '('$project9', principal "'$user23'")')
echo $(dfx --identity user9 canister call $CANISTER update_team_member '('$project9', principal "'$user24'")')


# job_data[0]='"DSCVR Frontend Integration on Internet Computer","DSCVR is a decentralized borrowing protocol that allows users to draw interest-free loans against Ether used as collateral. DSCVR now has a fully decentralized, immutable frontend hosted on the Internet Computer.","job","https://dscvr.one/",'${project1}''
# job_data[1]='"OpenChats Unique Approach to Data Exploration","OpenChat is the most advanced web3.0 search engine of exceptional speed and accuracy, that empowers its users to search over the Internet Computer.","bounty","https://oc.app/",'${project2}''
# job_data[2]='"Distrikt - Transactions with Unparalleled Isolation","Self-custody made simple and secure. Turn a spare smartphone into a cold wallet that can store a plethora of tokens including ICP and ckBTC. Using Distrikt, you can stake ICP directly on the NNS and participate in governance.","job","https://distrikt.app/",'${project3}''
# job_data[3]='"Bitfinity EVM - Revolutionizing Scalability on the Internet Computer","Worried about data being persisted or how your data structure will scale across canisters? Bitfinity EVM can help you focus more on building out your vision, and spend less time thinking about how to scale out your multi-canister architecture on the IC.","bounty","https://bitfinity.network/",'${project4}''
# job_data[4]='"Yumi - Empowering Community Moderation with Innovative Tools","Modclub is an AI-enhanced decentralized crowdwork platform that handles resource-intensive tasks such as moderation, user verification and data labeling.","bounty","https://tppkg-ziaaa-aaaal-qatrq-cai.raw.ic0.app/",'${project5}''
# job_data[5]='"Bioniq - Empowering Decentralized Staking on the Internet Computer Network","Bioniq is the liquid-staking protocol revolutionizing staking on the Internet Computer, putting control in investors hands. ICP is staked in the NNS DAO, and stakers receive rewards just by holding the stICP token. The stICP token is DeFi-compatible, to support protocols building on the Internet Computer, and always fully-backed by ICP staked in the NNS.","job","https://bioniq.io/home/24-hours",'${project6}''

# echo ${job_data}


# for IDENTITY in "${!job_data[@]}"
# do
#     userText="user"
#     userNumber=$((IDENTITY + 1))
#     userText+=$userNumber

#     dfx identity use "${userText}"
#     CURRENT_PRINCIPAL=$(dfx identity get-principal)
#     echo "Using identity $userText with principal $CURRENT_PRINCIPAL"

#     # Extract and use the user data for the current identity
#     PROJECT_DATA=${job_data[$IDENTITY]}
#     echo "Registering with data: $PROJECT_DATA"

#     # Call the register_user function with the current identity and its unique data
#     dfx canister call $CANISTER post_job "($PROJECT_DATA)"

#     # # approve_project_creation_request
#     # echo "approving the request"
#     # dfx canister call --identity default $CANISTER approve_project_creation_request "(principal \"$CURRENT_PRINCIPAL\")"

# done


# dfx identity use default

# echo "Listing all registered jobs:"
# dfx canister call $CANISTER list_all_projects