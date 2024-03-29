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


declare -a anouncement_data

#  project_id: String,
#     announcement_title: String,
#     announcement_description: String,

anouncement_data[0]='record {
    project_id = '$project1'; 
    announcement_title = "Exciting News from DSCVR: Revolutionizing Online Forums on the ICP!";
    announcement_description = "We are thrilled to announce the latest update to DSCVR, the leading decentralized forum platform built on the Internet Computer Protocol (ICP). This update introduces groundbreaking features designed to enhance user engagement and foster community growth. With enhanced content discovery algorithms and user-customizable interfaces, DSCVR is setting a new standard for online discussions. Join us in exploring diverse topics, connecting with like-minded individuals, and contributing to the future of decentralized communication. Experience the power of blockchain-based forums today with DSCVR!";
}'
anouncement_data[1]='record {
    project_id = '$project2'; 
    announcement_title = "OpenChat Unveils Major Upgrade: Secure, Decentralized Messaging for Everyone";
    announcement_description = "OpenChat is proud to announce a major upgrade, reinforcing our commitment to providing a secure and decentralized messaging experience. Leveraging the Internet Computer Protocol, OpenChat now offers end-to-end encryption, ensuring that your conversations remain private and secure. With new features such as group video calls and file sharing, staying connected with friends, family, and colleagues has never been easier—or more secure. Discover the future of messaging with OpenChat, where privacy meets convenience.";
}'
anouncement_data[2]='record {
    project_id = '$project3'; 
    announcement_title = "Distrikt Launches: A New Era of Decentralized Social Networking on ICP";
    announcement_description = "Introducing Distrikt—the next-generation social networking platform that redefines online communities through decentralization. Built on the robust Internet Computer Protocol, Distrikt empowers users with unparalleled control over their data and privacy. Celebrate the launch with us and be part of a vibrant community that values authenticity, privacy, and meaningful connections. Create your profile, connect with friends, and engage in discussions that matter. Welcome to Distrikt, where your digital space is truly yours.";
}'
anouncement_data[3]='record {
    project_id = '$project4'; 
    announcement_title = "Bitfinity EVM Goes Live: Bridging Ethereum and ICP for Limitless Possibilities";
    announcement_description = "We are excited to announce the launch of Bitfinity EVM, the revolutionary platform that seamlessly integrates Ethereum Virtual Machine (EVM) capabilities with the Internet Computer Protocol. This groundbreaking development enables developers to deploy Ethereum-based applications on ICPs fast, secure, and scalable network. Enjoy the best of both worlds—Ethereums rich ecosystem and ICPs cutting-edge technology. Start building on Bitfinity EVM today and unlock a new realm of possibilities for decentralized applications.";
}'
anouncement_data[4]='record {
    project_id = '$project5'; 
    announcement_title = "Yumi Introduces: The Ultimate Decentralized Marketplace on ICP";
    announcement_description = "Yumi is proud to unveil the first decentralized marketplace built on the Internet Computer Protocol, offering a secure and transparent platform for buying and selling goods and services. With Yumi, users enjoy lower transaction fees, faster settlement times, and enhanced security features, all while maintaining complete control over their data. Whether you are a buyer looking for unique items or a seller aiming to reach a global audience, Yumi provides the perfect ecosystem to connect and transact. Join Yumi today and be part of the future of e-commerce.";
}'


# echo ${anouncement_data}


for IDENTITY in "${!anouncement_data[@]}"
do
    userText="user"
    userNumber=$((IDENTITY + 1))
    userText+=$userNumber

    dfx identity use "${userText}"
    CURRENT_PRINCIPAL=$(dfx identity get-principal)
    echo "Using identity $userText with principal $CURRENT_PRINCIPAL"

    # Extract and use the user data for the current identity
    PROJECT_DATA=${anouncement_data[$IDENTITY]}
    # echo "Registering with data: $PROJECT_DATA"

    # Call the register_user function with the current identity and its unique data
    dfx canister call $CANISTER add_announcement "($PROJECT_DATA)"

    # # approve_project_creation_request
    # echo "approving the request"
    # dfx canister call --identity default $CANISTER approve_project_creation_request "(principal \"$CURRENT_PRINCIPAL\")"

done


echo $(dfx --identity ic_admin canister call $CANISTER add_project_to_spotlight '('$project1')')
echo $(dfx --identity ic_admin canister call $CANISTER add_project_to_spotlight '('$project2')')
echo $(dfx --identity ic_admin canister call $CANISTER add_project_to_spotlight '('$project3')')
echo $(dfx --identity ic_admin canister call $CANISTER add_project_to_spotlight '('$project4')')
echo $(dfx --identity ic_admin canister call $CANISTER add_project_to_spotlight '('$project5')')
