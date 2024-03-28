#!/bin/bash

set -e

CANISTER=$(dfx canister id IcpAccelerator_backend --network ic)
echo "Canister ID: $CANISTER"

declare -a testimonial_data

testimonial_data[0]='"Joining the accelerator platform was a game-changer for our startup. The direct access to ICPs cutting-edge technology allowed us to build a decentralized application that was not only scalable but also secure beyond anything we imagined. The mentorship and networking opportunities provided us with invaluable insights and connections that propelled our project forward. I cant recommend this platform enough to any startup looking to disrupt the tech space with blockchain technology."'
testimonial_data[1]='"As a developer deeply interested in the possibilities of the Internet Computer Protocol, this accelerator platform offered me the tools, resources, and community support needed to turn my ideas into reality. The workshops and hackathons were especially enlightening, pushing me to innovate and improve my skills. Its incredible to be part of a community thats shaping the future of the decentralized web."'
testimonial_data[2]='"This accelerator platform is at the forefront of the blockchain revolution, and its been thrilling to watch and support startups that are building on the Internet Computer. The platforms dedication to fostering innovation and providing startups with the resources they need to succeed has made it a magnet for high-potential projects. Its an essential resource for anyone looking to invest in the next big thing in tech."'
testimonial_data[3]='"Transitioning our product to operate on the ICP blockchain seemed daunting at first, but the accelerator platform made this process seamless. The technical support and strategic advice we received were top-notch, enabling us to leverage blockchain technology to enhance our products performance and security. This platform is a beacon for anyone wanting to innovate with confidence in the blockchain space."'
testimonial_data[4]='"As someone whos always on the lookout for groundbreaking technology, I was impressed by the accelerator platforms commitment to advancing ICPs ecosystem. The success stories of startups that have gone through the program are a testament to the platforms role in driving real-world adoption of blockchain technology. Its inspiring to see such a vibrant community dedicated to innovation and excellence."'


# echo ${testimonial_data}


for IDENTITY in "${!testimonial_data[@]}"
do
    userText="user"
    userNumber=$((IDENTITY + 1))
    userText+=$userNumber

    dfx identity use "${userText}"
    CURRENT_PRINCIPAL=$(dfx identity get-principal)
    echo "Using identity $userText with principal $CURRENT_PRINCIPAL"

    # Extract and use the user data for the current identity
    PROJECT_DATA=${testimonial_data[$IDENTITY]}
    # echo "Registering with data: $PROJECT_DATA"

    # Call the register_user function with the current identity and its unique data
    dfx canister call $CANISTER add_testimonial "($PROJECT_DATA)"  --network ic

    # # approve_project_creation_request
    # echo "approving the request"
    # dfx canister call --identity default $CANISTER approve_project_creation_request "(principal \"$CURRENT_PRINCIPAL\")"

done


# dfx identity use default

# echo "Listing all registered jobs:"
# dfx canister call $CANISTER list_all_projects