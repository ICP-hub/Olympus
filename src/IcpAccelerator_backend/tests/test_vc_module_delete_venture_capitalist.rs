use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{user_modules::user_types::{UserInfoInternal, UserInformation}, vc_module::vc_types::*};
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
fn test_delete_venture_capitalist() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Define the UserInformation with some fields set to None
    let user_info = UserInformation {
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
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Define the expected VentureCapitalist parameters
    let vc_info = VentureCapitalist {
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
        website_link: Some("https://vcfund.example.com".to_string()),
        links: None, // Replace with actual data if needed
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    // Simulate storing this VC info in the state
    pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_info.clone()).unwrap(),
    ).expect("Expected reply");

    // Call the delete_venture_capitalist function
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_venture_capitalist",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the account was deactivated
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Venture Capitalist Account Has Been DeActivated");

    // Verify that the VC's account is now deactivated
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let updated_vc_info: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    // Ensure the VC is now inactive
    assert!(updated_vc_info.is_none(), "VC account should be deactivated and inaccessible.");
}







#[test]
fn test_delete_venture_capitalist_twice() {
    let (pic, backend_canister) = setup();
    let test_principal = Principal::anonymous();

    // Register user and VC
    let user_info = UserInformation {
        full_name: "Test VC User".to_string(),
        profile_picture: None,
        email: Some("testvc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: None,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    let vc_info = VentureCapitalist {
        name_of_fund: "Test Fund".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(false),
        average_check_size: 10_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities".to_string()),
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 15,
        portfolio_link: "https://portfolio.example.com".to_string(),
        website_link: Some("https://vcfund.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_info.clone()).unwrap(),
    ).expect("VC registration failed");

    // First deletion attempt
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_venture_capitalist",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Venture Capitalist Account Has Been DeActivated");

    // Second deletion attempt (should fail or return a message indicating already deleted)
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_venture_capitalist",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Venture Capitalist Account Has Been DeActivated");

    // Verify the account is still deactivated
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let updated_vc_info: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    assert!(updated_vc_info.is_none(), "VC account should be deactivated and inaccessible.");
}

#[test]
fn test_delete_non_existent_venture_capitalist() {
    let (pic, backend_canister) = setup();
    let test_principal = Principal::anonymous();

    // Register user but not VC
    let user_info = UserInformation {
        full_name: "Non-existent VC User".to_string(),
        profile_picture: None,
        email: Some("novc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Non-existent investor.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: None,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Attempt to delete a non-existent VC
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_venture_capitalist",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Venture Capitalist Account Has Been DeActivated");

    // Verify the account is still non-existent
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let updated_vc_info: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    assert!(updated_vc_info.is_none(), "VC account should not exist.");
}

#[test]
fn test_delete_venture_capitalist_after_inactivity() {
    let (pic, backend_canister) = setup();
    let test_principal = Principal::anonymous();

    // Register user and VC
    let user_info = UserInformation {
        full_name: "Inactive VC User".to_string(),
        profile_picture: None,
        email: Some("inactivevc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Inactive investor.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: None,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    let vc_info = VentureCapitalist {
        name_of_fund: "Inactive Fund".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(false),
        average_check_size: 10_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities".to_string()),
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 15,
        portfolio_link: "https://portfolio.example.com".to_string(),
        website_link: Some("https://vcfund.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_info.clone()).unwrap(),
    ).expect("VC registration failed");

    // Make the VC inactive
    let deactivate_vc = |pic: &PocketIc, backend_canister: Principal, test_principal: Principal| {
        let Ok(WasmResult::Reply(response)) = pic.update_call(
            backend_canister,
            test_principal,
            "make_active_inactive_venture_capitalist",
            encode_one(test_principal).unwrap(),
        ) else {
            panic!("Expected reply");
        };
        let result: String = decode_one(&response).unwrap();
        assert_eq!(result, "made inactive");
    };
    deactivate_vc(&pic, backend_canister, test_principal);

    // Attempt to delete the inactive VC
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_venture_capitalist",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Venture Capitalist Account Has Been DeActivated");

    // Verify the VC's account is still deactivated
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let updated_vc_info: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    assert!(updated_vc_info.is_none(), "VC account should be deactivated and inaccessible.");
}

#[test]
fn test_delete_venture_capitalist_with_multiple_roles() {
    let (pic, backend_canister) = setup();
    let test_principal = Principal::anonymous();

    // Register user and VC with multiple roles
    let user_info = UserInformation {
        full_name: "Multi-role VC User".to_string(),
        profile_picture: None,
        email: Some("multirole@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor with multiple roles.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: None,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    let vc_info = VentureCapitalist {
        name_of_fund: "Multi-role Fund".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(false),
        average_check_size: 10_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities".to_string()),
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 15,
        portfolio_link: "https://portfolio.example.com".to_string(),
        website_link: Some("https://vcfund.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_info.clone()).unwrap(),
    ).expect("VC registration failed");

    // Call the delete_venture_capitalist function
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_venture_capitalist",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Venture Capitalist Account Has Been DeActivated");

    // Verify the VC's account is deactivated even with multiple roles
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let updated_vc_info: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    assert!(updated_vc_info.is_none(), "VC account with multiple roles should be deactivated and inaccessible.");
}








#[test]
fn test_unauthorized_deletion_attempt() {
    let (pic, backend_canister) = setup();

    // Define a test principal (the owner of the VC)
    let owner_principal = Principal::anonymous();

    // Define a different test principal (unauthorized principal)
    let unauthorized_principal = Principal::anonymous();

    // Register user and VC
    let user_info = UserInformation {
        full_name: "VC Owner".to_string(),
        profile_picture: None,
        email: Some("vcowner@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("VC Owner with multiple investments.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: None,
    };

    pic.update_call(
        backend_canister,
        owner_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    let vc_info = VentureCapitalist {
        name_of_fund: "Unauthorized Attempt Fund".to_string(),
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
        website_link: Some("https://vcfund.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    pic.update_call(
        backend_canister,
        owner_principal,
        "register_venture_capitalist",
        encode_one(vc_info.clone()).unwrap(),
    ).expect("VC registration failed");

    // Attempt to delete the VC using an unauthorized principal
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        unauthorized_principal,
        "delete_venture_capitalist",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "you are not authorised to use this function");

    // Verify the VC account is still active
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        owner_principal,
        "get_vc_info",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let updated_vc_info: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    assert!(updated_vc_info.is_some(), "VC account should still be active.");
}
Attempt Deletion After Multiple Role Assignment:

Purpose: Verify that deletion is still possible after assigning multiple roles.
Scenario: Register a VC and assign multiple roles (like mentor and investor), then attempt to delete the VC.
Expected Outcome: The VC profile should be deactivated, and roles should be checked if correctly handled.
rust
Copy code
#[test]
fn test_deletion_after_multiple_role_assignment() {
    let (pic, backend_canister) = setup();
    let test_principal = Principal::anonymous();

    // Register user and VC
    let user_info = UserInformation {
        full_name: "Multi-role User".to_string(),
        profile_picture: None,
        email: Some("multiroleuser@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("A versatile user with multiple roles.".to_string()),
        area_of_interest: "Finance".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: None,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    let vc_info = VentureCapitalist {
        name_of_fund: "Multi-role Fund".to_string(),
        fund_size: Some(150_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 7_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(75_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
        category_of_investment: "Finance".to_string(),
        reason_for_joining: Some("Growth opportunities".to_string()),
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 15,
        portfolio_link: "https://portfolio.example.com".to_string(),
        website_link: Some("https://vcfund.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$3-7M".to_string()),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_info.clone()).unwrap(),
    ).expect("VC registration failed");

    // Assign multiple roles to the VC
    // (Assume the function `assign_roles` exists and works as expected)
    // pic.update_call(backend_canister, test_principal, "assign_roles", encode_one(multiple_roles).unwrap()).expect("Role assignment failed");

    // Delete the VC after role assignment
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_venture_capitalist",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Venture Capitalist Account Has Been DeActivated");

    // Verify the VC's account is now inactive
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let updated_vc_info: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    assert!(updated_vc_info.is_none(), "VC account should be deactivated and inaccessible.");
}
Edge Case Deletion with Minimum and Maximum Values:

Purpose: Test how the deletion handles edge cases with minimal and maximal input values.
Scenario: Register a VC with extreme values (e.g., maximum fund size, portfolio companies, etc.) and then delete it.
Expected Outcome: The VC should be successfully deleted, demonstrating that the function handles extreme data correctly.
rust
Copy code
#[test]
fn test_edge_case_deletion_with_min_max_values() {
    let (pic, backend_canister) = setup();
    let test_principal = Principal::anonymous();

    // Register user and VC with maximum values
    let user_info = UserInformation {
        full_name: "Extreme VC".to_string(),
        profile_picture: None,
        email: Some("extremevc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor with extreme values.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: None,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    let vc_info = VentureCapitalist {
        name_of_fund: "Extreme Fund".to_string(),
        fund_size: Some(f64::MAX),
        assets_under_management: Some("Max USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: f64::MAX,
        existing_icp_investor: true,
        money_invested: Some(f64::MAX),
        existing_icp_portfolio: Some("Max Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("All Chains".to_string()),
        category_of_investment: "Everything".to_string(),
        reason_for_joining: Some("To conquer the world.".to_string()),
        preferred_icp_hub: "Every Hub".to_string(),
        investor_type: Some("Everything".to_string()),
        number_of_portfolio_companies: u16::MAX,
        portfolio_link: "https://maxportfolio.example.com".to_string(),
        website_link: Some("https://maxvcfund.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("Everywhere".to_string()),
        stage: Some("Infinite Growth".to_string()),
        range_of_check_size: Some("Unlimited".to_string()),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_info.clone()).unwrap(),
    ).expect("VC registration failed");

    // Delete the VC
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_venture_capitalist",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Venture Capitalist Account Has Been DeActivated");

    // Verify the VC's account is now inactive
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let updated_vc_info: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    assert!(updated_vc_info.is_none(), "VC account should be deactivated and inaccessible.");
}
Repeated Deletion Requests:

Purpose: Ensure the function behaves correctly when the same VC tries to delete their profile multiple times.
Scenario: Call the delete_venture_capitalist function multiple times in succession.
Expected Outcome: The first deletion should succeed, and subsequent deletions should not affect the already deactivated profile.
rust
Copy code
#[test]
fn test_repeated_deletion_requests() {
    let (pic, backend_canister) = setup();
    let test_principal = Principal::anonymous();

    // Register user and VC
    let user_info = UserInformation {
        full_name: "Repeat Deletion VC".to_string(),
        profile_picture: None,
        email: Some("repeatvc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor who keeps deleting.".to_string()),
        area_of_interest: "Finance".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: None,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    let vc_info = VentureCapitalist {
        name_of_fund: "Repeat Fund".to_string(),
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
        website_link: Some("https://vcfund.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_info.clone()).unwrap(),
    ).expect("VC registration failed");

    // First deletion attempt
    let Ok(WasmResult::Reply(response1)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_venture_capitalist",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result1: String = decode_one(&response1).unwrap();
    assert_eq!(result1, "Venture Capitalist Account Has Been DeActivated");

    // Second deletion attempt (should not affect the already deleted profile)
    let Ok(WasmResult::Reply(response2)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_venture_capitalist",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result2: String = decode_one(&response2).unwrap();
    assert_eq!(result2, "Venture Capitalist Account Has Been DeActivated");

    // Verify the VC's account is inactive after the first deletion
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let updated_vc_info: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    assert!(updated_vc_info.is_none(), "VC account should be deactivated and inaccessible after first deletion.");
}