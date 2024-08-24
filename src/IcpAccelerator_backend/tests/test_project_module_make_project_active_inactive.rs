use candid::{decode_one, encode_args, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{project_module::project_types::{ProjectInfo, ProjectInfoInternal}, user_modules::user_types::{UserInfoInternal, UserInformation}};
use std::fs;

// Define the path to your compiled Wasm file
const BACKEND_WASM: &str = "/home/harman/accelerator/ICPAccelerator/target/wasm32-unknown-unknown/release/IcpAccelerator_backend.wasm";

// Setup function to initialize PocketIC and install the Wasm module
fn setup() -> (PocketIc, Principal) {
    let pic = PocketIc::new();

    let backend_canister = pic.create_canister();
    pic.add_cycles(backend_canister, 2_000_000_000_000); // 2T Cycles
    let wasm = fs::read(BACKEND_WASM).expect("Wasm file not found, run 'dfx build'.");
    pic.install_canister(backend_canister, wasm, vec![], None);
    (pic, backend_canister)
}

#[test]
fn test_make_project_active_inactive() {
    let (pic, backend_canister) = setup();

   // Define a test principal
   let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

   // Define the UserInformation with some fields set to None
   let user_info = UserInfoInternal{
       params :UserInformation {
           full_name: "Test User".to_string(),
           profile_picture: None, // No initial picture provided
           email: None, // Email not provided
           country: "United States".to_string(),
           social_links: None, // No social links provided
           bio: Some("An enthusiastic tech investor focused on blockchain technologies.".to_string()),
           area_of_interest: "Blockchain".to_string(),
           openchat_username: None, // OpenChat username not provided
           type_of_profile: Some("investor".to_string()),
           reason_to_join: None,
       },
       uid: "839047bc25dd6b3d25bf153f8ae121bdfb5ca2cc9246763fb59a679c1eeb4586".to_string(),
       is_active: true,
       joining_date: 06062003,
   };

   // Simulate registering the user
   pic.update_call(
       backend_canister,
       test_principal,
       "register_user",
       encode_one(user_info.params.clone()).unwrap(),
   ).expect("User registration failed");


   // Create a ProjectInfoInternal object to simulate project registration
   let project_info = ProjectInfoInternal {
       params: ProjectInfo {
           project_name: "Sample Project".to_string(),
           project_logo: None,
           preferred_icp_hub: Some("ICP Hub".to_string()),
           live_on_icp_mainnet: Some(true),
           money_raised_till_now: Some(false),
           supports_multichain: Some("Ethereum, Solana".to_string()),
           project_elevator_pitch: Some("A revolutionary project.".to_string()),
           project_area_of_focus: "Technology".to_string(),
           promotional_video: None,
           reason_to_join_incubator: "Growth opportunities".to_string(),
           project_description: Some("This is a sample project description.".to_string()),
           project_cover: None,
           project_team: None,
           token_economics: None,
           technical_docs: None,
           long_term_goals: Some("Global adoption".to_string()),
           target_market: Some("Worldwide".to_string()),
           self_rating_of_project: 4.5,
           mentors_assigned: None,
           vc_assigned: None,
           project_website: None,
           links: None,
           money_raised: None,
           upload_private_documents: Some(false),
           private_docs: None,
           public_docs: None,
           dapp_link: None,
           weekly_active_users: None,
           revenue: None,
           is_your_project_registered: Some(true),
           type_of_registration: Some("Company".to_string()),
           country_of_registration: Some("United States".to_string()),
       },
       uid: "b7deb0ac398bb66b3d8e1736cd4163d0a8411ec4fda4e8be58de74cdac6c8e08".to_string(),
       is_active: true,
       is_verified: false,
       creation_date: 1625097600, // Example timestamp
   };

   // Simulate the project registration by directly manipulating the canister state
   let Ok(WasmResult::Reply(response)) = pic.update_call(
       backend_canister,
       test_principal,
       "register_project",
       encode_one(project_info.params.clone()).unwrap(),
   ) else {
       panic!("Expected reply");
   };


   let is_registered: String =decode_one(&response).unwrap();
   ic_cdk::println!("IS_REGISTERED {:?}", is_registered);

   // Call the get_project_id function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_project_id",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode and verify the response
    let project_id: String = decode_one(&response).expect("Decoding failed");



    // Test making the project inactive
    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "make_project_active_inactive",
        encode_args((test_principal, project_id.clone())).unwrap(),
    )else{
        panic!("Expected reply");
    };

    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Project made inactive");

    // Test making the project active again
    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "make_project_active_inactive",
        encode_args((test_principal, project_id.clone())).unwrap(),
    )else{
        panic!("Expected reply");
    };

    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Project made active");
}

#[test]
fn test_make_project_active_inactive_unauthorized() {
    let (pic, backend_canister) = setup();

    // Define two principals, one to act as the owner and another as an unauthorized user
    let owner_principal = Principal::anonymous();
    let unauthorized_principal = Principal::from_text("jwyik-wtp73-7aqic-gggmg-rb3mh-6vsg4-wzfw6-awdvm-sq4nc-o3lmr-cqe")
    .expect("Failed to parse principal");

    // Define the UserInformation with some fields set to None
    let user_info1 = UserInfoInternal{
        params :UserInformation {
            full_name: "Test User".to_string(),
            profile_picture: None, // No initial picture provided
            email: None, // Email not provided
            country: "United States".to_string(),
            social_links: None, // No social links provided
            bio: Some("An enthusiastic tech investor focused on blockchain technologies.".to_string()),
            area_of_interest: "Blockchain".to_string(),
            openchat_username: None, // OpenChat username not provided
            type_of_profile: Some("investor".to_string()),
            reason_to_join: None,
        },
        uid: "839047bc25dd6b3d25bf153f8ae121bdfb5ca2cc9246763fb59a679c1eeb4586".to_string(),
        is_active: true,
        joining_date: 06062003,
    };

    // Simulate registering the user
    pic.update_call(
        backend_canister,
        owner_principal,
        "register_user",
        encode_one(user_info1.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Define the UserInformation with some fields set to None
    let user_info2 = UserInfoInternal{
        params :UserInformation {
            full_name: "Second User".to_string(),
            profile_picture: None, // No initial picture provided
            email: None, // Email not provided
            country: "India".to_string(),
            social_links: None, // No social links provided
            bio: Some("An enthusiastic tech investor focused on blockchain technologies.".to_string()),
            area_of_interest: "CyberSecurity".to_string(),
            openchat_username: None, // OpenChat username not provided
            type_of_profile: Some("VC".to_string()),
            reason_to_join: None,
        },
        uid: "gdgdgd".to_string(),
        is_active: true,
        joining_date: 09092003,
    };

    // Simulate registering the user
    pic.update_call(
        backend_canister,
        unauthorized_principal,
        "register_user",
        encode_one(user_info2.params.clone()).unwrap(),
    ).expect("User registration failed");


    // Create a ProjectInfoInternal object to simulate project registration
    let project_info = ProjectInfoInternal {
        params: ProjectInfo {
            project_name: "Sample Project".to_string(),
            project_logo: None,
            preferred_icp_hub: Some("ICP Hub".to_string()),
            live_on_icp_mainnet: Some(true),
            money_raised_till_now: Some(false),
            supports_multichain: Some("Ethereum, Solana".to_string()),
            project_elevator_pitch: Some("A revolutionary project.".to_string()),
            project_area_of_focus: "Technology".to_string(),
            promotional_video: None,
            reason_to_join_incubator: "Growth opportunities".to_string(),
            project_description: Some("This is a sample project description.".to_string()),
            project_cover: None,
            project_team: None,
            token_economics: None,
            technical_docs: None,
            long_term_goals: Some("Global adoption".to_string()),
            target_market: Some("Worldwide".to_string()),
            self_rating_of_project: 4.5,
            mentors_assigned: None,
            vc_assigned: None,
            project_website: None,
            links: None,
            money_raised: None,
            upload_private_documents: Some(false),
            private_docs: None,
            public_docs: None,
            dapp_link: None,
            weekly_active_users: None,
            revenue: None,
            is_your_project_registered: Some(true),
            type_of_registration: Some("Company".to_string()),
            country_of_registration: Some("United States".to_string()),
        },
        uid: "b7deb0ac398bb66b3d8e1736cd4163d0a8411ec4fda4e8be58de74cdac6c8e08".to_string(),
        is_active: true,
        is_verified: false,
        creation_date: 1625097600, // Example timestamp
    };

    // Simulate the project registration by directly manipulating the canister state
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        owner_principal,
        "register_project",
        encode_one(project_info.params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };


    let is_registered: String =decode_one(&response).unwrap();
    ic_cdk::println!("IS_REGISTERED {:?}", is_registered);

    // Call the get_project_id function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        owner_principal,
        "get_project_id",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode and verify the response
    let project_id: String = decode_one(&response).expect("Decoding failed");


    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        unauthorized_principal,
        "make_project_active_inactive",
        encode_args((unauthorized_principal, project_id.clone())).unwrap(),
    )else{
        panic!("Expected reply");
    };

    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "You are not authorized to use this function");
}

#[test]
fn test_make_project_active_inactive_project_not_found() {
    let (pic, backend_canister) = setup();

    // Define a principal and a non-existent project ID
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed
    let non_existent_project_id = "non_existent_project_id".to_string();

    // Attempt to toggle the status of a non-existent project
    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "make_project_active_inactive",
        encode_args((test_principal, non_existent_project_id.clone())).unwrap(),
    )else{
        panic!("Expected reply");
    };

    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Project not found");
}
