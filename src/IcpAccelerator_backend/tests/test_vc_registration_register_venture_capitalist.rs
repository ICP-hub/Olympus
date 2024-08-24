use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use std::fs;

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
fn test_register_venture_capitalist() {
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
    let vc_params = VentureCapitalist {
        name_of_fund: "Tech Fund".to_string(),
        fund_size: Some(100000000.0),
        assets_under_management: Some("1B USD".to_string()),
        logo: None, // Example binary data
        registered_under_any_hub: Some(true),
        average_check_size: 5000000.0,
        existing_icp_investor: true,
        money_invested: Some(50000000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: None,
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities".to_string()),
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 10,
        portfolio_link: "https://portfolio.example.com".to_string(),
        announcement_details: Some("Exciting investment".to_string()),
        website_link: Some("https://vcfund.example.com".to_string()),
        links: None, // Replace with actual data if needed
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };
    // Call the register_venture_capitalist function
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response to ensure the VC was registered
    let result: String = decode_one(&response).unwrap();
    ic_cdk::println!("RESULT FROM POST VC API {}", result);

    // The result should contain the UID of the new VC, so we check for the expected output pattern
    assert!(result.starts_with("Venture Capitalist Created With UID"));

    // Verify the VC is stored in the state by querying the VC info
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info_using_principal",
        encode_one(test_principal).unwrap(), // No arguments needed
    ) else {
        panic!("Expected reply");
    };

    // Decode the response into VentureCapitalistAll
    let vc_info_all: Option<VentureCapitalistInternal> = decode_one(&vc_info_response).unwrap();
    ic_cdk::println!("VC_INFO RESULT: {:?}", vc_info_all);

    // Access the profile field which contains the VentureCapitalist data
    //let venture_capitalist = &vc_info_all.profile.params;

    // Now perform the assertion to check if the stored VentureCapitalist matches the input parameters
    assert_eq!(
        vc_info_all.unwrap().params, vc_params,
        "The stored VentureCapitalist does not match the input parameters."
    );
}
