#!/bin/bash

set -e


NUM_MENTORS=5


CANISTER=$(dfx canister id IcpAccelerator_backend)
echo "Canister ID: $CANISTER"

# Define job details
titles=(
    "DSCVR Frontend Integration on Internet Computer"
    "OpenChats Unique Approach to Data Exploration"
    "Distrikt - Transactions with Unparalleled Isolation"
    "Bitfinity EVM - Revolutionizing Scalability on the Internet Computer"
    "Yumi - Empowering Community Moderation with Innovative Tools"
    "Bioniq - Empowering Decentralized Staking on the Internet Computer Network"
)

descriptions=(
    "DSCVR is a decentralized borrowing protocol that allows users to draw interest-free loans against Ether used as collateral. DSCVR now has a fully decentralized, immutable frontend hosted on the Internet Computer."
    "OpenChat is the most advanced web3.0 search engine of exceptional speed and accuracy, that empowers its users to search over the Internet Computer."
    "Self-custody made simple and secure. Turn a spare smartphone into a cold wallet that can store a plethora of tokens including ICP and ckBTC. Using Distrikt, you can stake ICP directly on the NNS and participate in governance."
    "Worried about data being persisted or how your data structure will scale across canisters? Bitfinity EVM can help you focus more on building out your vision, and spend less time thinking about how to scale out your multi-canister architecture on the IC."
    "Modclub is an AI-enhanced decentralized crowdwork platform that handles resource-intensive tasks such as moderation, user verification and data labeling."
    "Bioniq is the liquid-staking protocol revolutionizing staking on the Internet Computer, putting control in investors hands. ICP is staked in the NNS DAO, and stakers receive rewards just by holding the stICP token. The stICP token is DeFi-compatible, to support protocols building on the Internet Computer, and always fully-backed by ICP staked in the NNS."
)

categories=(
    "JOBS"
    "BOUNTY"
    "JOBS"
    "BOUNTY"
    "BOUNTY"
    "RFP"
)

links=(
    "https://dscvr.one/"
    "https://oc.app/"
    "https://distrikt.app/"
    "https://bitfinity.network/"
    "https://tppkg-ziaaa-aaaal-qatrq-cai.raw.ic0.app/"
    "https://bioniq.io/home/24-hours"
)

locations=(
    "Remote"
    "Bangalore"
    "Bangalore"
    "Bangalore"
    "Bangalore"
    "Bangalore"
)


# Get project IDs dynamically
project_ids=()
for i in $(seq 1 $NUM_MENTORS); do
    identity_name="user$i"
    project_id=$(dfx --identity "$identity_name" canister call $CANISTER get_project_id '()' | sed 's/[()]//g' | tr -d '[:space:]')
    project_ids+=($project_id)

    echo "the project id is $project_id"
done


# Loop through users and create job postings dynamically
for i in $(seq 1 $NUM_MENTORS); do
    identity_name="user$i"
    dfx identity use "$identity_name"
    CURRENT_PRINCIPAL=$(dfx identity get-principal)
    echo "Using identity $identity_name with principal $CURRENT_PRINCIPAL"

    # Get project ID dynamically
   

    # Create Candid data for the job posting
    JOB_DATA="(record {
        title = \"${titles[$i-1]}\";
        description = \"${descriptions[$i-1]}\";
        category = \"${categories[$i-1]}\";
        link = \"${links[$i-1]}\";
        project_id = ${project_ids[$((i-1))]};
        location = \"${locations[$i-1]}\";
    })"

    echo "Registering with data: $JOB_DATA"

    # Call the post_job function with the current identity and its unique data
    dfx canister call $CANISTER post_job "$JOB_DATA"
    echo "registered data successfully"
done