use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use std::fs;
use std::collections::VecDeque;

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
fn test_get_top_three_vc() {
    let (pic, backend_canister) = setup();

    // Define a list of test principals
    let test_principal1 = Principal::anonymous(); // Replace with specific principals if needed
    let test_principal2 = Principal::anonymous();
    let test_principal3 = Principal::anonymous();
    let test_principal4 = Principal::anonymous();

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

    let vc_info3 = VentureCapitalist {
        name_of_fund: "Tech Fund 3".to_string(),
        fund_size: Some(300_000_000.0),
        assets_under_management: Some("3B USD".to_string()),
        logo: Some(vec![7, 8, 9]), // Example binary data
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
        announcement_details: Some("Exciting investment 3".to_string()),
        website_link: Some("https://vcfund3.example.com".to_string()),
        links: None, // Replace with actual data if needed
        registered: true,
        registered_country: Some("United Kingdom".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$10-20M".to_string()),
    };

    let vc_info4 = VentureCapitalist {
        name_of_fund: "Tech Fund 4".to_string(),
        fund_size: Some(400_000_000.0),
        assets_under_management: Some("4B USD".to_string()),
        logo: Some(vec![10, 11, 12]), // Example binary data
        registered_under_any_hub: Some(true),
        average_check_size: 20_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(200_000_000.0),
        existing_icp_portfolio: Some("ICP Projects 4".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities 4".to_string()),
        preferred_icp_hub: "ICP Hub 4".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 40,
        portfolio_link: "https://portfolio4.example.com".to_string(),
        announcement_details: Some("Exciting investment 4".to_string()),
        website_link: Some("https://vcfund4.example.com".to_string()),
        links: None, // Replace with actual data if needed
        registered: true,
        registered_country: Some("Australia".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$20-30M".to_string()),
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

    pic.update_call(
        backend_canister,
        test_principal4,
        "register_venture_capitalist",
        encode_one(vc_info4.clone()).unwrap(),
    ).expect("Expected reply");

    // Call the get_top_three_vc function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "get_top_three_vc",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response into Vec<ListAllVC>
    let result: Vec<ListAllVC> = decode_one(&response).unwrap();

    // Define the expected ListAllVC structure for the top 3 VCs
    let expected_vc1 = ListAllVC {
        principal: StoredPrincipal(test_principal1),
        params: VentureCapitalistInternal {
            params: vc_info1,
            uid: String::from(""), // UID will be generated during registration
            is_active: true,
            approve: false,
            decline: false,
        },
    };

    let expected_vc2 = ListAllVC {
        principal: StoredPrincipal(test_principal2),
        params: VentureCapitalistInternal {
            params: vc_info2,
            uid: String::from(""), // UID will be generated during registration
            is_active: true,
            approve: false,
            decline: false,
        },
    };

    let expected_vc3 = ListAllVC {
        principal: StoredPrincipal(test_principal3),
        params: VentureCapitalistInternal {
            params: vc_info3,
            uid: String::from(""), // UID will be generated during registration
            is_active: true,
            approve: false,
            decline: false,
        },
    };

    // Check that the returned vector contains exactly three elements
    assert_eq!(result.len(), 3);

    // Check that the top three VCs match the expected ones
    assert_eq!(result[0], expected_vc1);
    assert_eq!(result[1], expected_vc2);
    assert_eq!(result[2], expected_vc3);
}
