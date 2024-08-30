use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use std::fs;


use IcpAccelerator_backend::{user_modules::user_types::UserInformation, vc_module::vc_types::*};

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
fn test_filter_venture_capitalists() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal1 = Principal::anonymous(); // Replace with a specific principal if needed
    let test_principal2 = Principal::from_text("jwyik-wtp73-7aqic-gggmg-rb3mh-6vsg4-wzfw6-awdvm-sq4nc-o3lmr-cqe")
    .expect("Failed to parse principal");

    // Define the UserInformation with some fields set to None
    let user_info1 = UserInformation {
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
    };

    // Simulate registering the user
    pic.update_call(
        backend_canister,
        test_principal1,
        "register_user",
        encode_one(user_info1).unwrap(),
    ).expect("User registration failed");

    // Define the UserInformation with some fields set to None
    let user_info2 = UserInformation {
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
    };

    // Simulate registering the user
    pic.update_call(
        backend_canister,
        test_principal2,
        "register_user",
        encode_one(user_info2).unwrap(),
    ).expect("User registration failed");

    // Simulate the registration of a VC to ensure the profile exists
    let vc_info_1 = VentureCapitalist {
        name_of_fund: "Tech Fund".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities".to_string()),
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 10,
        portfolio_link: "https://portfolio.example.com".to_string(),
        website_link: None,
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: None,
        range_of_check_size: Some("$10m-$50m".to_string()),
    };

    let vc_info_2 = VentureCapitalist {
        name_of_fund: "Health Fund".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 15_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(100_000_00.0),
        existing_icp_portfolio: Some("Health Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum".to_string()),
        category_of_investment: "Marketing".to_string(),
        reason_for_joining: Some("Healthcare advancements".to_string()),
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 20,
        portfolio_link: "https://portfolio.example.com".to_string(),
        website_link: None,
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: None,
        range_of_check_size: Some("$50m-$100m".to_string()),
    };

    // Register both VCs
    pic.update_call(
        backend_canister,
        test_principal1,
        "register_venture_capitalist",
        encode_one(vc_info_1).unwrap(),
    ).expect("Expected reply");

    pic.update_call(
        backend_canister,
        test_principal2,
        "register_venture_capitalist",
        encode_one(vc_info_2).unwrap(),
    ).expect("Expected reply");

    // Define filter criteria to match only Technology VCs with check sizes between $10m and $50m
    let criteria = VcFilterCriteria {
        country: Some("United States".to_string()),
        category_of_investment: Some("Technology".to_string()),
        money_invested_range: Some((5000000.0, 10000000.0)),
    };

    // Call the filter_venture_capitalists function
    let Ok(WasmResult::Reply(filtered_response)) = pic.query_call(
        backend_canister,
        test_principal1,
        "filter_venture_capitalists",
        encode_one(criteria).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the filtering was successful
    let filtered_vcs: Vec<VentureCapitalist> = decode_one(&filtered_response).unwrap();
    ic_cdk::println!("FILTERED VC {:?}",filtered_vcs);

    // There should only be one result that matches the criteria
    assert_eq!(filtered_vcs.len(), 1, "Should only match one VC");

    // Verify the matching VC is the Technology VC with the correct range of check size
    let vc = &filtered_vcs[0];
    assert_eq!(vc.category_of_investment, "Technology");
    assert_eq!(vc.range_of_check_size.as_deref(), Some("$10m-$50m"));
}





#[test]
fn test_filter_vcs_no_criteria() {
    let (pic, backend_canister) = setup();

    let test_principal1 = Principal::anonymous();
    let test_principal2 = Principal::from_text("w4y3i-jpzmi-7yrb5-bqcwy-gtpw4-oxgkq-i6bxd-nprn5-aorx3-xai62-4ae").unwrap();

    let user_info = UserInformation {
        full_name: "VC User".to_string(),
        profile_picture: None,
        email: None,
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Tech Investor".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("vc".to_string()),
        reason_to_join: None,
    };

    pic.update_call(backend_canister, test_principal1, "register_user", encode_one(user_info.clone()).unwrap()).expect("User registration failed");
    pic.update_call(backend_canister, test_principal2, "register_user", encode_one(user_info.clone()).unwrap()).expect("User registration failed");

    let vc_info_1 = VentureCapitalist {
        name_of_fund: "Tech Fund".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities".to_string()),
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 10,
        portfolio_link: "https://portfolio.example.com".to_string(),
        website_link: None,
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: None,
        range_of_check_size: Some("$10m-$50m".to_string()),
    };

    let vc_info_2 = VentureCapitalist {
        name_of_fund: "Health Fund".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 15_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("Health Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum".to_string()),
        category_of_investment: "Marketing".to_string(),
        reason_for_joining: Some("Healthcare advancements".to_string()),
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 20,
        portfolio_link: "https://portfolio.example.com".to_string(),
        website_link: None,
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: None,
        range_of_check_size: Some("$50m-$100m".to_string()),
    };

    pic.update_call(backend_canister, test_principal1, "register_venture_capitalist", encode_one(vc_info_1).unwrap()).expect("VC registration failed");
    pic.update_call(backend_canister, test_principal2, "register_venture_capitalist", encode_one(vc_info_2).unwrap()).expect("VC registration failed");

    let criteria = VcFilterCriteria {
        country: None,
        category_of_investment: None,
        money_invested_range: None,
    };

    let Ok(WasmResult::Reply(filtered_response)) = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "filter_venture_capitalists",
        encode_one(criteria).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let filtered_vcs: Vec<VentureCapitalist> = decode_one(&filtered_response).unwrap();
    assert_eq!(filtered_vcs.len(), 2, "Both VCs should be returned with no criteria.");
}





#[test]
fn test_filter_vcs_non_matching_criteria() {
    let (pic, backend_canister) = setup();

    let test_principal1 = Principal::anonymous();
    let test_principal2 = Principal::from_text("w4y3i-jpzmi-7yrb5-bqcwy-gtpw4-oxgkq-i6bxd-nprn5-aorx3-xai62-4ae").unwrap();

    let user_info = UserInformation {
        full_name: "VC User".to_string(),
        profile_picture: None,
        email: None,
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Tech Investor".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("vc".to_string()),
        reason_to_join: None,
    };

    pic.update_call(backend_canister, test_principal1, "register_user", encode_one(user_info.clone()).unwrap()).expect("User registration failed");
    pic.update_call(backend_canister, test_principal2, "register_user", encode_one(user_info.clone()).unwrap()).expect("User registration failed");

    let vc_info_1 = VentureCapitalist {
        name_of_fund: "Tech Fund".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities".to_string()),
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 10,
        portfolio_link: "https://portfolio.example.com".to_string(),
        website_link: None,
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: None,
        range_of_check_size: Some("$10m-$50m".to_string()),
    };

    let vc_info_2 = VentureCapitalist {
        name_of_fund: "Health Fund".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 15_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("Health Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum".to_string()),
        category_of_investment: "Healthcare".to_string(),
        reason_for_joining: Some("Healthcare advancements".to_string()),
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 20,
        portfolio_link: "https://portfolio.example.com".to_string(),
        website_link: None,
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: None,
        range_of_check_size: Some("$50m-$100m".to_string()),
    };

    pic.update_call(backend_canister, test_principal1, "register_venture_capitalist", encode_one(vc_info_1).unwrap()).expect("VC registration failed");
    pic.update_call(backend_canister, test_principal2, "register_venture_capitalist", encode_one(vc_info_2).unwrap()).expect("VC registration failed");

    let criteria = VcFilterCriteria {
        country: Some("Canada".to_string()),
        category_of_investment: Some("Education".to_string()),
        money_invested_range: Some((50000.0, 100000.0)),
    };

    let Ok(WasmResult::Reply(filtered_response)) = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "filter_venture_capitalists",
        encode_one(criteria).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let filtered_vcs: Vec<VentureCapitalist> = decode_one(&filtered_response).unwrap();
    assert_eq!(filtered_vcs.len(), 0, "No VCs should match the non-existent criteria.");
}



#[test]
fn test_filter_vcs_by_inactive_only() {
    let (pic, backend_canister) = setup();

    let test_principal1 = Principal::anonymous();
    let test_principal2 = Principal::from_text("w4y3i-jpzmi-7yrb5-bqcwy-gtpw4-oxgkq-i6bxd-nprn5-aorx3-xai62-4ae").unwrap();

    let user_info = UserInformation {
        full_name: "VC User".to_string(),
        profile_picture: None,
        email: None,
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Tech Investor".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("vc".to_string()),
        reason_to_join: None,
    };

    pic.update_call(backend_canister, test_principal1, "register_user", encode_one(user_info.clone()).unwrap()).expect("User registration failed");
    pic.update_call(backend_canister, test_principal2, "register_user", encode_one(user_info.clone()).unwrap()).expect("User registration failed");

    let mut vc_info_1 = VentureCapitalist {
        name_of_fund: "Tech Fund".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities".to_string()),
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 10,
        portfolio_link: "https://portfolio.example.com".to_string(),
        website_link: None,
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: None,
        range_of_check_size: Some("$10m-$50m".to_string()),
    };

    let vc_info_2 = VentureCapitalist {
        name_of_fund: "Tech Fund Canada".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 15_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities".to_string()),
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 20,
        portfolio_link: "https://portfolio.example.com".to_string(),
        website_link: None,
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: None,
        range_of_check_size: Some("$50m-$100m".to_string()),
    };

    pic.update_call(backend_canister, test_principal1, "register_venture_capitalist", encode_one(vc_info_1).unwrap()).expect("VC registration failed");
    pic.update_call(backend_canister, test_principal2, "register_venture_capitalist", encode_one(vc_info_2).unwrap()).expect("VC registration failed");

    // Manually set the first VC to inactive
    pic.update_call(backend_canister, test_principal1, "deactivate_venture_capitalist", encode_one(test_principal1).unwrap()).expect("VC deactivation failed");

    let criteria = VcFilterCriteria {
        country: Some("United States".to_string()),
        category_of_investment: Some("Technology".to_string()),
        money_invested_range: Some((5000000.0, 10000000.0)),
    };

    let Ok(WasmResult::Reply(filtered_response)) = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "filter_venture_capitalists",
        encode_one(criteria).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let filtered_vcs: Vec<VentureCapitalist> = decode_one(&filtered_response).unwrap();
    assert_eq!(filtered_vcs.len(), 1, "Only one VC should be active and match the criteria.");
    assert_eq!(filtered_vcs[0].name_of_fund, "Tech Fund Canada");
}



#[test]
fn test_filter_vcs_with_partially_matching_range() {
    let (pic, backend_canister) = setup();

    let test_principal1 = Principal::anonymous();
    let test_principal2 = Principal::from_text("w4y3i-jpzmi-7yrb5-bqcwy-gtpw4-oxgkq-i6bxd-nprn5-aorx3-xai62-4ae").unwrap();

    let user_info = UserInformation {
        full_name: "VC User".to_string(),
        profile_picture: None,
        email: None,
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Tech Investor".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("vc".to_string()),
        reason_to_join: None,
    };

    pic.update_call(backend_canister, test_principal1, "register_user", encode_one(user_info.clone()).unwrap()).expect("User registration failed");
    pic.update_call(backend_canister, test_principal2, "register_user", encode_one(user_info.clone()).unwrap()).expect("User registration failed");

    let vc_info_1 = VentureCapitalist {
        name_of_fund: "Tech Fund".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities".to_string()),
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 10,
        portfolio_link: "https://portfolio.example.com".to_string(),
        website_link: None,
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: None,
        range_of_check_size: Some("$10m-$50m".to_string()),
    };

    let vc_info_2 = VentureCapitalist {
        name_of_fund: "Tech Fund Canada".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 15_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities".to_string()),
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 20,
        portfolio_link: "https://portfolio.example.com".to_string(),
        website_link: None,
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: None,
        range_of_check_size: Some("$50m-$100m".to_string()),
    };

    pic.update_call(backend_canister, test_principal1, "register_venture_capitalist", encode_one(vc_info_1).unwrap()).expect("VC registration failed");
    pic.update_call(backend_canister, test_principal2, "register_venture_capitalist", encode_one(vc_info_2).unwrap()).expect("VC registration failed");

    let criteria = VcFilterCriteria {
        country: Some("United States".to_string()),
        category_of_investment: Some("Technology".to_string()),
        money_invested_range: Some((30000000.0, 80000000.0)),
    };

    let Ok(WasmResult::Reply(filtered_response)) = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "filter_venture_capitalists",
        encode_one(criteria).unwrap());
    else {
        panic!("Expected reply");
    };

    let filtered_vcs: Vec<VentureCapitalist> = decode_one(&filtered_response).unwrap();
    assert_eq!(filtered_vcs.len(), 1, "Only one VC should match the partially overlapping range.");
    assert_eq!(filtered_vcs[0].name_of_fund, "Tech Fund");
}
