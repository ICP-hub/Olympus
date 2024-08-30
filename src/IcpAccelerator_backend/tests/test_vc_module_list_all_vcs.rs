use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::types::individual_types::VcWithRoles;
use std::fs;
use std::collections::HashMap;

use IcpAccelerator_backend::user_modules::user_types::*;
use IcpAccelerator_backend::vc_module::vc_types::*;

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
fn test_list_all_vcs() {
    let (pic, backend_canister) = setup();

    // Define a list of test principals
    let test_principal1 = Principal::anonymous(); // Replace with specific principals if needed
    let test_principal2 = Principal::from_text("jwyik-wtp73-7aqic-gggmg-rb3mh-6vsg4-wzfw6-awdvm-sq4nc-o3lmr-cqe")
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
        test_principal1,
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
        test_principal2,
        "register_user",
        encode_one(user_info2.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Define the expected VentureCapitalist parameters for each principal
    let vc_info1 = VentureCapitalist {
        name_of_fund: "Tech Fund 1".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0),
        existing_icp_portfolio: Some("ICP Projects 1".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities 1".to_string()),
        preferred_icp_hub: "ICP Hub 1".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 10,
        portfolio_link: "https://portfolio1.example.com".to_string(),
        website_link: Some("https://vcfund1.example.com".to_string()),
        links: None, // Replace with actual data if needed
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    let vc_info2 = VentureCapitalist {
        name_of_fund: "Tech Fund 2".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 10_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("ICP Projects 2".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities 2".to_string()),
        preferred_icp_hub: "ICP Hub 2".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 20,
        portfolio_link: "https://portfolio2.example.com".to_string(),
        website_link: Some("https://vcfund2.example.com".to_string()),
        links: None, // Replace with actual data if needed
        registered: true,
        registered_country: Some("Canada".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$5-10M".to_string()),
    };

    // Simulate storing these VC infos in the state
    pic.update_call(
        backend_canister,
        test_principal1,
        "register_venture_capitalist",
        encode_one(vc_info1.clone()).unwrap(),
    ).expect("Expected reply");

    pic.update_call(
        backend_canister,
        test_principal2,
        "register_venture_capitalist",
        encode_one(vc_info2.clone()).unwrap(),
    ).expect("Expected reply");

    // Call the list_all_vcs function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "list_all_vcs",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response into a HashMap<Principal, VcWithRoles>
    let result: HashMap<Principal, (VentureCapitalistInternal, UserInfoInternal, Vec<Role>)> = decode_one(&response).unwrap();

    // Define the expected VcWithRoles structure for each principal
    let expected_vc_with_roles1 = VcWithRoles {
        vc_profile: VentureCapitalistInternal {
            params: vc_info1,
            uid: String::from(""), // UID will be generated during registration
            is_active: true,
            approve: false,
            decline: false,
        },
        roles: vec![], // This should match the roles returned by get_roles_for_principal
    };

    let expected_vc_with_roles2 = VcWithRoles {
        vc_profile: VentureCapitalistInternal {
            params: vc_info2,
            uid: String::from(""), // UID will be generated during registration
            is_active: true,
            approve: false,
            decline: false,
        },
        roles: vec![], // This should match the roles returned by get_roles_for_principal
    };


    let binding = (expected_vc_with_roles1.vc_profile, user_info1, expected_vc_with_roles1.roles);
    let compare = Some(&binding);



    //Assert that the returned VC information matches the expected VC information
    assert_eq!(result.get(&test_principal1), compare);
    (result.get(&test_principal2), Some(&expected_vc_with_roles2));
}









#[test]
fn test_list_all_vcs_with_inactive_vcs() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();

    let user_info = UserInformation {
        full_name: "Inactive VC User".to_string(),
        profile_picture: None,
        email: None,
        country: "United States".to_string(),
        social_links: None,
        bio: Some("An inactive VC user.".to_string()),
        area_of_interest: "Finance".to_string(),
        openchat_username: None,
        type_of_profile: Some("vc".to_string()),
        reason_to_join: None,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info.clone()).unwrap(),
    ).expect("User registration failed");

    let vc_info = VentureCapitalist {
        name_of_fund: "Inactive Fund".to_string(),
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

    pic.update_call(
        backend_canister,
        test_principal,
        "deactivate_vc", // Assuming a deactivate function exists
        encode_one(()).unwrap(),
    ).expect("VC deactivation failed");

    // Call the list_all_vcs function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "list_all_vcs",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: HashMap<Principal, (VentureCapitalistInternal, UserInfoInternal, Vec<Role>)> = decode_one(&response).unwrap();

    assert!(result.is_empty(), "The VC list should be empty when all VCs are inactive.");
}




#[test]
fn test_list_all_vcs_with_large_number_of_vcs() {
    let (pic, backend_canister) = setup();

    let mut expected_vc_info_map = HashMap::new();

    for i in 0..100 {
        let test_principal = Principal::anonymous();

        let user_info = UserInformation {
            full_name: format!("VC User {}", i),
            profile_picture: None,
            email: None,
            country: "United States".to_string(),
            social_links: None,
            bio: Some(format!("VC user {}.", i)),
            area_of_interest: "Finance".to_string(),
            openchat_username: None,
            type_of_profile: Some("vc".to_string()),
            reason_to_join: None,
        };

        pic.update_call(
            backend_canister,
            test_principal,
            "register_user",
            encode_one(user_info.clone()).unwrap(),
        ).expect("User registration failed");

        let vc_info = VentureCapitalist {
            name_of_fund: format!("Fund {}", i),
            fund_size: Some(100_000_000.0 + i as f64),
            assets_under_management: Some(format!("{}B USD", i + 1)),
            registered_under_any_hub: Some(true),
            average_check_size: 5_000_000.0 + i as f64,
            existing_icp_investor: true,
            money_invested: Some(50_000_000.0 + i as f64),
            existing_icp_portfolio: Some(format!("ICP Projects {}", i)),
            type_of_investment: "Equity".to_string(),
            project_on_multichain: Some("Ethereum, Solana".to_string()),
            category_of_investment: "Technology".to_string(),
            reason_for_joining: Some(format!("Growth opportunities {}", i)),
            preferred_icp_hub: format!("ICP Hub {}", i),
            investor_type: Some("Venture Capital".to_string()),
            number_of_portfolio_companies: 10 + i,
            portfolio_link: format!("https://portfolio{}.example.com", i),
            website_link: Some(format!("https://vcfund{}.example.com", i)),
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

        expected_vc_info_map.insert(test_principal, vc_info);
    }

    // Call the list_all_vcs function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "list_all_vcs",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: HashMap<Principal, (VentureCapitalistInternal, UserInfoInternal, Vec<Role>)> = decode_one(&response).unwrap();

    assert_eq!(result.len(), 100, "The VC list should contain exactly 100 VCs.");

    for (principal, expected_vc_info) in expected_vc_info_map {
        let (returned_vc_internal, _, _) = result.get(&principal).expect("VC info should be found for the registered principal.");
        assert_eq!(returned_vc_internal.params, expected_vc_info, "Returned VC info should match the registered VC info.");
    }
}




#[test]
fn test_list_all_vcs_with_duplicate_vcs() {
    let (pic, backend_canister) = setup();

    let test_principal1 = Principal::anonymous();
    let test_principal2 = test_principal1; // Intentionally duplicate the principal

    let user_info = UserInformation {
        full_name: "Duplicate VC User".to_string(),
        profile_picture: None,
        email: None,
        country: "United States".to_string(),
        social_links: None,
        bio: Some("A VC user with a duplicate principal.".to_string()),
        area_of_interest: "Finance".to_string(),
        openchat_username: None,
        type_of_profile: Some("vc".to_string()),
        reason_to_join: None,
    };

    pic.update_call(
        backend_canister,
        test_principal1,
        "register_user",
        encode_one(user_info.clone()).unwrap(),
    ).expect("User registration failed");

    let vc_info1 = VentureCapitalist {
        name_of_fund: "Duplicate Fund 1".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0),
        existing_icp_portfolio: Some("ICP Projects 1".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities 1".to_string()),
        preferred_icp_hub: "ICP Hub 1".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 10,
        portfolio_link: "https://portfolio1.example.com".to_string(),
        website_link: Some("https://vcfund1.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    let vc_info2 = VentureCapitalist {
        name_of_fund: "Duplicate Fund 2".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 10_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("ICP Projects 2".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities 2".to_string()),
        preferred_icp_hub: "ICP Hub 2".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 20,
        portfolio_link: "https://portfolio2.example.com".to_string(),
        website_link: Some("https://vcfund2.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    pic.update_call(
        backend_canister,
        test_principal1,
        "register_venture_capitalist",
        encode_one(vc_info1.clone()).unwrap(),
    ).expect("VC 1 registration failed");

    pic.update_call(
        backend_canister,
        test_principal2,
        "register_venture_capitalist",
        encode_one(vc_info2.clone()).unwrap(),
    ).expect("VC 2 registration failed");

    // Call the list_all_vcs function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "list_all_vcs",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: HashMap<Principal, (VentureCapitalistInternal, UserInfoInternal, Vec<Role>)> = decode_one(&response).unwrap();

    assert_eq!(result.len(), 1, "The VC list should contain only one VC due to duplicate principal.");
    let (returned_vc_internal, _returned_user_info, _) = result.get(&test_principal1).expect("VC info should be found for the registered principal.");
    assert_eq!(returned_vc_internal.params, vc_info2, "Returned VC info should match the second registered VC info.");
    //assert_eq!(*returned_user_info, user_info, "Returned user info should match the registered user info.");
}
