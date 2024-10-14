#!/bin/bash

set -e

# Number of mentors you want to register (ensure this matches the number of existing identities)
NUM_MENTORS=20
START=6

echo "Using existing User Identities to Register as Mentors..."
CANISTER=$(dfx canister id IcpAccelerator_backend)
echo "Canister ID: $CANISTER"

# Define announcement titles and descriptions
titles=(
    "Exciting News from DSCVR: Revolutionizing Online Forums on the ICP!"
    "OpenChat Unveils Major Upgrade: Secure, Decentralized Messaging for Everyone"
    "Distrikt Launches: A New Era of Decentralized Social Networking on ICP"
    "Bitfinity EVM Goes Live: Bridging Ethereum and ICP for Limitless Possibilities"
    "Yumi Introduces: The Ultimate Decentralized Marketplace on ICP"
)

descriptions=(
    "We are thrilled to announce the latest update to DSCVR, the leading decentralized forum platform built on the Internet Computer Protocol (ICP). This update introduces groundbreaking features designed to enhance user engagement and foster community growth. With enhanced content discovery algorithms and user-customizable interfaces, DSCVR is setting a new standard for online discussions. Join us in exploring diverse topics, connecting with like-minded individuals, and contributing to the future of decentralized communication. Experience the power of blockchain-based forums today with DSCVR!"
    "OpenChat is proud to announce a major upgrade, reinforcing our commitment to providing a secure and decentralized messaging experience. Leveraging the Internet Computer Protocol, OpenChat now offers end-to-end encryption, ensuring that your conversations remain private and secure. With new features such as group video calls and file sharing, staying connected with friends, family, and colleagues has never been easier—or more secure. Discover the future of messaging with OpenChat, where privacy meets convenience."
    "Introducing Distrikt—the next-generation social networking platform that redefines online communities through decentralization. Built on the robust Internet Computer Protocol, Distrikt empowers users with unparalleled control over their data and privacy. Celebrate the launch with us and be part of a vibrant community that values authenticity, privacy, and meaningful connections. Create your profile, connect with friends, and engage in discussions that matter. Welcome to Distrikt, where your digital space is truly yours."
    "We are excited to announce the launch of Bitfinity EVM, the revolutionary platform that seamlessly integrates Ethereum Virtual Machine (EVM) capabilities with the Internet Computer Protocol. This groundbreaking development enables developers to deploy Ethereum-based applications on ICPs fast, secure, and scalable network. Enjoy the best of both worlds—Ethereums rich ecosystem and ICPs cutting-edge technology. Start building on Bitfinity EVM today and unlock a new realm of possibilities for decentralized applications."
    "Yumi is proud to unveil the first decentralized marketplace built on the Internet Computer Protocol, offering a secure and transparent platform for buying and selling goods and services. With Yumi, users enjoy lower transaction fees, faster settlement times, and enhanced security features, all while maintaining complete control over their data. Whether you are a buyer looking for unique items or a seller aiming to reach a global audience, Yumi provides the perfect ecosystem to connect and transact. Join Yumi today and be part of the future of e-commerce."
)

# Job Types
job_types=(
    "Full-time"
    "Part-time"
    "Freelance"
    "Contract"
    "Internship"
)

locations=(
    "India"
    "USA"
    "UK"
    "Germany"
    "Australia"
)

# Loop through users and create jobs dynamically
for i in $(seq $START $NUM_MENTORS); do
    identity_name="user$i"
    dfx identity use "$identity_name"
    CURRENT_PRINCIPAL=$(dfx identity get-principal)
    echo "Using identity $identity_name with principal $CURRENT_PRINCIPAL"

    # Job data creation
    JOB_DATA="(record {
        title = \"${titles[$((i-1))]}\";
        description = \"${descriptions[$((i-1))]}\";
        category = \"Technical\";
        link = \"https://example.com/job/$identity_name\";
        location = \"${locations[$((i-1))]}\";
        job_type = \"${job_types[$((i-1))]}\";
    })"

    # Call the post_job function with the current identity and its unique job data
    dfx canister call $CANISTER post_job "$JOB_DATA"
    echo "Job posted for identity $identity_name"
done