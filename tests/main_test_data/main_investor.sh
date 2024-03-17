#!/bin/bash


set -e

dfx identity new user12 --storage-mode=plaintext || true
dfx identity new user13 --storage-mode=plaintext || true
dfx identity new user14 --storage-mode=plaintext || true
dfx identity new user15 --storage-mode=plaintext || true
dfx identity new user16 --storage-mode=plaintext || true


CANISTER=$(dfx canister id IcpAccelerator_backend --network ic)
echo "Canister ID: $CANISTER"


# IDENTITIES=("default" "principal2" "principal3" "principal4" "principal5")


declare -a investor_data

# investor_data[0]='record { 
#     name_of_fund = "Annabelle Bernard";
#     fund_size = 5000000000.00;
#     assets_under_management= "232000000000";
#     logo= opt vec {134;54;67;8};
#     average_check_size= 5000000000.00;
#     existing_icp_investor= true;
#     money_invested= opt 25000000000;
#     existing_icp_portfolio= opt "openchat";
#     type_of_investment= "defi, nft";
#     project_on_multichain= opt "true";
#     category_of_investment= "defi, nft";
#     reason_for_joining= "funding";
#     preferred_icp_hub= "ICP.HUB India";
#     investor_type= "defi, nft";
#     number_of_portfolio_companies= 4;
#     portfolio_link= "link";
#     announcement_details= opt "dsa";
#     website_link= "link";
#     linkedin_link= "link";
#     user_data= record { full_name = "Annabelle Bernard";email = opt "annabellebernard@gmail.com";country = "Indonesia";telegram_id = opt "annabellebernard";bio = opt "Mobile app developer for Android and iOS, web developer, expert in JavaScript and React, software architect, designs scalable systems, enthusiastic about AI and machine learning, passionate about open.";area_of_intrest = "DeFi";twitter_id = opt "annabellebernard";openchat_username = opt "annabellebernard";};
#     registered_under_any_hub= opt true;
#     }'

investor_data[0]='record { name_of_fund = "Sequoia Capital";fund_size = 2000000000.00;assets_under_management=  "85000000000";logo= opt vec{137;80;78;71;13;10;26;10;0;0;0;13;73;72;68;82;0;0;0;32;0;0;0;32;8;3;0;0;0;68;164;138;198;0;0;0;69;80;76;84;69;255;255;255;177;212;203;96;168;148;237;245;243;216;234;229;193;221;214;154;200;188;144;194;181;164;205;194;124;183;167;0;115;84;226;239;235;6;118;88;87;163;142;80;159;137;108;174;156;119;180;163;250;252;252;246;250;249;185;217;208;111;176;159;202;226;220;71;154;132;8;188;227;74;0;0;0;137;73;68;65;84;120;1;213;208;65;18;131;32;16;68;209;118;80;2;19;133;168;154;251;31;53;189;72;41;53;22;108;45;223;182;255;98;0;207;209;137;56;244;34;3;32;226;129;151;80;192;41;170;190;49;168;114;27;117;2;146;82;190;55;136;137;124;45;248;192;48;193;52;183;3;225;30;165;241;15;148;85;171;71;30;123;37;8;160;229;111;190;6;201;220;103;3;238;88;187;67;111;3;199;125;83;170;221;64;220;155;129;11;165;189;12;236;125;86;252;46;104;90;185;199;209;216;236;75;173;140;210;158;46;60;30;227;7;157;238;13;102;156;107;111;192;0;0;0;0;73;69;78;68;174;66;96;130};average_check_size= 2500000.00;existing_icp_investor= false;existing_icp_portfolio= opt  "";type_of_investment= "Direct";project_on_multichain= opt "true";category_of_investment= "DeFi, NFT, RWA";reason_for_joining= "Funding, Incubation, Engaging and building community";preferred_icp_hub= "ICP.HUb India";investor_type= "DeFi, NFT, RWA";number_of_portfolio_companies=  12;portfolio_link= "https://www.sequoiacap.com/";announcement_details= opt "https://www.sequoiacap.com/";website_link= "https://www.sequoiacap.com/";linkedin_link= "https://www.linkedin.com/";user_data=  record { full_name = "Yaretzi Valencia";email = opt "yaretzivalencia@gmail.com";country = "Indonesia";telegram_id = opt "yaretzivalencia";bio = opt "Web developer, expert in JavaScript and React, machine learning engineer, focused on deep learning, mobile app developer for Android and iOS, machine learning engineer, focused on deep learning.";area_of_intrest = "DeFi";twitter_id = opt "yaretzivalencia";openchat_username = opt "yaretzivalencia";};}'
investor_data[1]='record { name_of_fund = "Andreessen Horowitz";fund_size = 450000000.00;assets_under_management=  "55000000000";logo= opt vec{137;80;78;71;13;10;26;10;0;0;0;13;73;72;68;82;0;0;0;32;0;0;0;32;8;3;0;0;0;68;164;138;198;0;0;0;60;80;76;84;69;71;112;76;237;139;0;237;139;0;237;139;0;237;139;0;237;139;0;237;139;0;237;139;0;237;137;0;239;151;31;241;164;64;247;203;149;255;249;239;253;241;224;237;134;0;250;220;181;252;230;202;255;255;254;245;190;120;243;179;99;138;254;79;76;0;0;0;8;116;82;78;83;0;8;79;208;250;255;172;199;163;2;189;254;0;0;0;248;73;68;65;84;120;1;237;211;85;98;196;48;12;4;208;5;79;86;22;57;178;239;127;215;202;46;243;95;113;39;172;188;112;116;56;28;142;167;115;193;187;73;176;21;224;3;112;220;128;15;193;169;124;2;46;248;4;148;207;0;174;224;27;0;17;221;45;222;6;84;153;111;23;245;29;32;106;32;242;166;76;47;1;205;56;239;1;162;30;221;1;242;12;221;3;130;52;225;94;37;224;172;198;238;24;61;195;119;192;123;168;69;196;72;0;11;13;227;186;171;70;52;186;5;80;229;58;108;1;9;225;17;6;78;19;227;22;208;136;225;228;99;2;214;70;228;125;22;122;136;99;129;181;13;231;91;144;85;226;232;233;27;104;130;2;170;209;200;209;38;168;182;195;61;33;199;190;158;162;204;223;222;91;52;217;99;2;244;104;185;216;177;103;73;6;112;153;141;67;16;83;107;54;186;193;187;169;10;106;179;140;160;156;86;235;209;122;189;21;168;107;149;65;168;43;216;142;119;205;75;51;200;113;173;226;174;80;182;220;253;126;251;151;243;41;143;191;1;139;204;27;230;37;80;64;252;0;0;0;0;73;69;78;68;174;66;96;130};average_check_size= 2500000.00;existing_icp_investor= true;money_invested= opt 2500000.00;existing_icp_portfolio= opt  "Openchat, Plug";type_of_investment= "SNS";project_on_multichain= opt "true";category_of_investment= "DeFi, NFT, RWA";reason_for_joining= "Funding, Incubation, Engaging and building community";preferred_icp_hub= "ICP.HUb India";investor_type= "DeFi, NFT, RWA";number_of_portfolio_companies=  44;portfolio_link= "https://a16z.com/";announcement_details= opt "https://a16z.com/";website_link= "https://a16z.com/";linkedin_link= "https://www.linkedin.com/";user_data=  record { full_name = "Dax Soto";email = opt "daxsoto@gmail.com";country = "India";telegram_id = opt "daxsoto";bio = opt "Expert in Python and data analysis, specializes in frontend development, machine learning engineer, focused on deep learning, expert in Python and data analysis, network engineer, skilled in infrastru.";area_of_intrest = "NFT";twitter_id = opt "daxsoto";openchat_username = opt "daxsoto";};}'
investor_data[2]='record { name_of_fund = "SoftBank Vision Fund";fund_size = 700000000.00;assets_under_management=  "70000000000";logo= opt vec{137;80;78;71;13;10;26;10;0;0;0;13;73;72;68;82;0;0;0;16;0;0;0;16;8;6;0;0;0;31;243;255;97;0;0;0;35;73;68;65;84;120;1;99;24;28;96;231;238;189;255;201;193;131;203;128;3;228;96;134;161;15;40;14;131;225;144;14;134;7;0;0;167;177;94;44;137;236;57;235;0;0;0;0;73;69;78;68;174;66;96;130};average_check_size= 2500000.00;existing_icp_investor= false;existing_icp_portfolio= opt  "";type_of_investment= "Both";project_on_multichain= opt "true";category_of_investment= "DeFi, NFT, RWA";reason_for_joining= "Funding, Incubation, Engaging and building community";preferred_icp_hub= "ICP.HUb India";investor_type= "DeFi, NFT, RWA";number_of_portfolio_companies=  31;portfolio_link= "https://visionfund.com/in";announcement_details= opt "https://visionfund.com/in";website_link= "https://visionfund.com/in";linkedin_link= "https://www.linkedin.com/";user_data=  record { full_name = "Brynlee Cuevas";email = opt "brynleecuevas@gmail.com";country = "Italy";telegram_id = opt "brynleecuevas";bio = opt "Blockchain developer, skilled in smart contracts, database administrator, expert in SQL and NoSQL, specializes in frontend development, passionate about open-source projects, mobile app developer for.";area_of_intrest = "SocialFi";twitter_id = opt "brynleecuevas";openchat_username = opt "brynleecuevas";};}'
investor_data[3]='record { name_of_fund = "Index Ventures";fund_size = 1000000000.00;assets_under_management=  "60000000000";logo= opt vec{137;80;78;71;13;10;26;10;0;0;0;13;73;72;68;82;0;0;0;32;0;0;0;32;8;6;0;0;0;115;122;122;244;0;0;1;11;73;68;65;84;120;1;98;24;5;128;114;234;1;180;131;48;12;192;248;108;219;94;152;25;102;47;206;54;178;150;189;108;44;115;200;88;92;214;114;141;113;153;179;149;102;62;151;221;119;239;189;255;241;234;23;15;207;221;125;239;119;144;153;144;42;20;126;152;149;224;182;159;145;224;56;96;79;224;8;179;90;1;31;66;115;90;1;235;2;219;152;81;10;136;15;22;242;61;204;76;112;219;203;140;255;219;19;98;73;71;159;146;126;116;34;28;198;1;227;120;197;155;130;119;92;163;216;78;192;36;62;20;221;162;196;78;64;29;150;21;45;33;221;40;128;17;179;184;195;67;153;27;126;207;20;84;98;193;85;116;23;161;128;73;192;196;119;7;100;99;218;85;126;248;34;204;136;183;120;194;79;153;7;140;167;160;21;171;138;86;144;13;227;128;137;239;222;138;71;241;160;228;17;103;40;178;19;16;143;70;69;181;8;198;239;217;138;195;145;47;144;139;64;56;14;24;196;37;174;112;105;232;10;135;168;20;4;168;77;193;61;234;53;2;218;177;35;176;133;114;71;1;251;92;12;95;68;9;68;194;27;242;128;127;113;124;2;227;82;86;47;125;167;213;101;0;0;0;0;73;69;78;68;174;66;96;130};average_check_size= 2500000.00;existing_icp_investor= true;money_invested= opt 2500000.00;existing_icp_portfolio= opt  "DSCVR";type_of_investment= "Direct";project_on_multichain= opt "true";category_of_investment= "DeFi, NFT, RWA";reason_for_joining= "Funding, Incubation, Engaging and building community";preferred_icp_hub= "ICP.HUb India";investor_type= "DeFi, NFT, RWA";number_of_portfolio_companies=  12;portfolio_link= "https://www.indexventures.com/";announcement_details= opt "https://www.indexventures.com/";website_link= "https://www.indexventures.com/";linkedin_link= "https://www.linkedin.com/";user_data=  record { full_name = "Brecken Sparks";email = opt "breckensparks@gmail.com";country = "Indonesia";telegram_id = opt "breckensparks";bio = opt "Enthusiastic about AI and machine learning, database administrator, expert in SQL and NoSQL, network engineer, skilled in infrastructure design, network engineer, skilled in infrastructure design.";area_of_intrest = "Developer Tooling";twitter_id = opt "breckensparks";openchat_username = opt "breckensparks";};}'
investor_data[4]='record { name_of_fund = "Greylock Partners";fund_size = 1500000000.00;assets_under_management=  "34000000000";logo= opt vec{137;80;78;71;13;10;26;10;0;0;0;13;73;72;68;82;0;0;0;32;0;0;0;32;8;3;0;0;0;68;164;138;198;0;0;0;93;80;76;84;69;71;112;76;255;255;255;255;255;255;229;231;232;208;210;213;202;204;206;255;255;255;255;255;255;255;255;255;120;126;133;26;42;57;0;17;39;34;49;63;255;255;255;255;255;255;187;190;193;56;67;79;6;29;47;0;6;33;238;239;240;91;100;108;19;36;52;215;217;219;242;243;243;255;255;255;173;176;181;101;108;116;134;139;145;231;233;234;148;153;159;160;164;169;78;211;0;210;0;0;0;23;116;82;78;83;0;79;145;201;236;255;81;30;163;255;255;255;255;166;23;255;255;255;255;225;255;255;253;239;113;39;18;0;0;1;143;73;68;65;84;120;1;141;147;135;122;235;32;12;133;241;32;13;8;15;41;12;121;212;239;255;152;151;128;225;227;174;182;39;211;232;215;176;57;136;70;93;63;140;82;142;67;255;16;255;208;199;83;42;13;73;70;201;105;254;51;222;47;43;160;190;133;180;46;189;104;53;191;44;57;221;200;145;125;205;77;121;111;106;118;17;26;255;81;243;61;186;156;7;20;115;193;105;247;254;160;47;53;94;38;199;201;46;129;57;108;134;118;185;71;194;188;238;249;44;230;248;22;163;222;51;179;82;124;196;53;180;125;106;176;80;142;47;28;118;138;58;152;125;2;226;210;123;140;105;77;13;80;241;137;169;20;172;204;25;112;235;51;2;50;23;128;192;137;204;44;31;153;149;66;60;84;250;235;44;47;84;31;194;121;3;168;58;209;155;156;245;201;137;76;130;45;3;81;189;24;160;172;237;174;0;120;20;0;6;49;102;0;175;22;184;42;48;10;9;101;176;11;10;64;178;2;178;0;218;113;40;128;91;185;1;70;168;131;109;148;227;224;185;105;49;148;60;12;188;33;32;146;145;28;154;33;251;106;1;115;114;216;142;99;97;150;71;1;76;47;58;133;21;217;248;173;112;208;198;246;126;254;143;244;168;139;192;217;227;176;136;116;178;187;111;71;8;241;188;183;0;9;99;17;68;167;65;177;132;124;59;211;219;111;121;15;112;59;47;114;101;55;115;18;45;115;107;152;192;126;37;34;252;100;62;98;129;106;152;98;57;167;61;243;153;29;149;226;213;114;197;180;142;118;201;145;185;116;170;88;76;219;218;222;17;24;77;88;109;255;243;131;147;143;30;97;9;35;180;71;175;20;153;164;50;144;164;149;124;214;242;173;30;229;248;119;205;226;47;24;244;45;204;39;209;7;117;0;0;0;0;73;69;78;68;174;66;96;130};average_check_size= 2500000.00;existing_icp_investor= true;money_invested= opt 5000000.00;existing_icp_portfolio= opt  "DISTRIKT";type_of_investment= "SNS";project_on_multichain= opt "true";category_of_investment= "DeFi, NFT, RWA";reason_for_joining= "Funding, Incubation, Engaging and building community";preferred_icp_hub= "ICP.HUb India";investor_type= "DeFi, NFT, RWA";number_of_portfolio_companies=  54;portfolio_link= "https://greylock.com/";announcement_details= opt "https://greylock.com/";website_link= "https://greylock.com/";linkedin_link= "https://www.linkedin.com/";user_data=  record { full_name = "Aisha Gutierrez";email = opt "aishagutierrez@gmail.com";country = "India";telegram_id = opt "aishagutierrez";bio = opt "VR/AR developer, creating immersive experiences, passionate about open-source projects, blockchain developer, skilled in smart contracts, enthusiastic about AI and machine learning, passionate about o.";area_of_intrest = "DeFi";twitter_id = opt "aishagutierrez";openchat_username = opt "aishagutierrez";};}'

# echo ${investor_data}


for IDENTITY in "${!investor_data[@]}"
do
    userText="user"
    userNumber=$((IDENTITY + 12))
    userText+=$userNumber

    dfx identity use "${userText}"
    CURRENT_PRINCIPAL=$(dfx identity get-principal)
    echo "Using identity $userText with principal $CURRENT_PRINCIPAL"

    # Extract and use the user data for the current identity
    USER_DATA=${investor_data[$IDENTITY]}
    echo "Registering with data: $USER_DATA"

    # Call the register_user function with the current identity and its unique data
    dfx canister call $CANISTER register_venture_capitalist "($USER_DATA)" --network ic

    # approve_vc_creation_request
    echo "approving the request"
    dfx canister call --identity default $CANISTER approve_vc_creation_request "(principal \"$CURRENT_PRINCIPAL\", true)" --network ic
done


# dfx identity use default

# echo "Listing all registered investors:"
# dfx canister call $CANISTER list_all_vcs