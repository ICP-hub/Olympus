use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{types::{individual_types::VcWithRoles, pagination_types::*}, vc_module::vc_types::{VentureCapitalist, VentureCapitalistInternal}};
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
fn test_list_all_vcs_with_pagination() {
    let (pic, backend_canister) = setup();

    // Define a list of test principals
    let test_principal1 = Principal::anonymous(); // Replace with specific principals if needed
    let test_principal2 = Principal::anonymous();
    let test_principal3 = Principal::anonymous();

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

    let vc_info3 = VentureCapitalist {
        name_of_fund: "Tech Fund 3".to_string(),
        fund_size: Some(300_000_000.0),
        assets_under_management: Some("3B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 15_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(150_000_000.0),
        existing_icp_portfolio: Some("ICP Projects 3".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities 3".to_string()),
        preferred_icp_hub: "ICP Hub 3".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 30,
        portfolio_link: "https://portfolio3.example.com".to_string(),
        website_link: Some("https://vcfund3.example.com".to_string()),
        links: None, // Replace with actual data if needed
        registered: true,
        registered_country: Some("United Kingdom".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$10-20M".to_string()),
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

    pic.update_call(
        backend_canister,
        test_principal3,
        "register_venture_capitalist",
        encode_one(vc_info3.clone()).unwrap(),
    ).expect("Expected reply");

    // Define pagination parameters
    let pagination_params = PaginationParams {
        page: 1,
        page_size: 2,
    };

    // Call the list_all_vcs_with_pagination function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "list_all_vcs_with_pagination",
        encode_one(pagination_params).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response into PaginationReturnVcData
    let result: PaginationReturnVcData = decode_one(&response).unwrap();

    // Define the expected VcWithRoles structure for the first page of results
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

    // Check the first page results
    assert_eq!(result.data.len(), 2);
    assert_eq!(result.data.get(&test_principal1), Some(&expected_vc_with_roles1));
    assert_eq!(result.data.get(&test_principal2), Some(&expected_vc_with_roles2));
    assert_eq!(result.count, 3); // Total active VCs should be 3

    // Test the second page of results
    let pagination_params_page_2 = PaginationParams {
        page: 2,
        page_size: 2,
    };

    let Ok(WasmResult::Reply(response_page_2)) = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "list_all_vcs_with_pagination",
        encode_one(pagination_params_page_2).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response into PaginationReturnVcData for page 2
    let result_page_2: PaginationReturnVcData = decode_one(&response_page_2).unwrap();

    let expected_vc_with_roles3 = VcWithRoles {
        vc_profile: VentureCapitalistInternal {
            params: vc_info3,
            uid: String::from(""), // UID will be generated during registration
            is_active: true,
            approve: false,
            decline: false,
        },
        roles: vec![], // This should match the roles returned by get_roles_for_principal
    };

    // Check the second page results
    assert_eq!(result_page_2.data.len(), 1);
    assert_eq!(result_page_2.data.get(&test_principal3), Some(&expected_vc_with_roles3));
    assert_eq!(result_page_2.count, 3); // Total active VCs should still be 3
}
