use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{project_module::project_types::ProjectInfo, user_modules::user_types::{UserInfoInternal, UserInformation}};
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
fn test_filter_projects_by_live_status() {
    let (pic, backend_canister) = setup();

    // Define test principals
    let test_principal_1 = Principal::anonymous(); // Replace with specific principals as needed
    let test_principal_2 = Principal::from_text("jwyik-wtp73-7aqic-gggmg-rb3mh-6vsg4-wzfw6-awdvm-sq4nc-o3lmr-cqe")
    .expect("Failed to parse principal");


    // Define the UserInformation with some fields set to None
    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "generate_captcha_with_id",
        encode_one(()).unwrap()
    )else{
        panic!("Expected reply")
    };

    let result: (String,String) = decode_args(&response).unwrap();

    let captcha_id = &result.0;
    let captcha_input=&result.1;
    ic_cdk::println!("CAPTCHA {:?}", result);

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
        profile_completion: 50,
    };

    // Simulate registering the user
    pic.update_call(
        backend_canister,
        test_principal_1,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Simulate registering the user
    pic.update_call(
        backend_canister,
        test_principal_2,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");



    // Define test projects
    let project_1 = ProjectInfo {
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
    };

    let project_2 = ProjectInfo {
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
    };

    // Register the test projects
    pic.update_call(
        backend_canister,
        test_principal_1,
        "register_project",
        encode_one(project_1).unwrap(),
    ).expect("Expected reply");

    pic.update_call(
        backend_canister,
        test_principal_2,
        "register_project",
        encode_one(project_2).unwrap(),
    ).expect("Expected reply");

    // Filter projects that are live on ICP mainnet
    let Ok(WasmResult::Reply(response_live) ) = pic.query_call(
        backend_canister,
        test_principal_1,
        "filter_projects_by_live_status",
        encode_one(true).unwrap(),
    )else {
        panic!("Expected reply");
    };

    let live_projects: Vec<ProjectInfo> =
        decode_one(&response_live).unwrap();

    // Verify only project_1 is returned
    assert_eq!(live_projects.len(), 1);
    assert_eq!(live_projects[0].project_name, "Project 1");

    // Filter projects that are not live on ICP mainnet
    let Ok(WasmResult::Reply(response_not_live)) = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "filter_projects_by_live_status",
        encode_one(false).unwrap(),
    )else {
        panic!("Expected reply");
    };

    let not_live_projects: Vec<ProjectInfo> =
        decode_one(&response_not_live).unwrap();

    // Verify only project_2 is returned
    assert_eq!(not_live_projects.len(), 1);
    assert_eq!(not_live_projects[0].project_name, "Project 2");
}
