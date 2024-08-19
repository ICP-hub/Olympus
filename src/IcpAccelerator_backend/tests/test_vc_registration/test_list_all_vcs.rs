use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use std::fs;
use std::collections::HashMap;

// Define the path to your compiled Wasm file
const BACKEND_WASM: &str = "../../target/wasm32-unknown-unknown/release/user_module_backend.wasm";

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
    let test_principal2 = Principal::anonymous();

    // Define the expected VentureCapitalist parameters for each principal
    let vc_info1 = VentureCapitalist {
        name_of_fund: "Tech Fund 1".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        logo: Some(vec![1, 2, 3]), // Example binary data
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
        announcement_details: Some("Exciting investment 1".to_string()),
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
        logo: Some(vec![4, 5, 6]), // Example binary data
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
        announcement_details: Some("Exciting investment 2".to_string()),
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
    let result: HashMap<Principal, VcWithRoles> = decode_one(&response).unwrap();

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

    // Assert that the returned VC information matches the expected VC information
    assert_eq!(result.get(&test_principal1), Some(&expected_vc_with_roles1));
    assert_eq!(result.get(&test_principal2), Some(&expected_vc_with_roles2));
}
