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
fn test_get_vc_info() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

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
    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_args((captcha_id, captcha_input, user_info.params.clone())).unwrap(),
    )else{
        panic!("Expected Reply")
    };

    let result:Result<std::string::String, std::string::String>= decode_one(&response).unwrap();
    ic_cdk::println!("REGISTERED USER {:?}", result);

    // Define the expected VentureCapitalist parameters
    let expected_vc_info = VentureCapitalist {
        name_of_fund: "Tech Fund".to_string(),
        fund_size: Some(100000000.0),
        assets_under_management: Some("1B USD".to_string()),
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
        encode_one(expected_vc_info.clone()).unwrap(),
    ).expect("Expected reply");

    // Call the get_vc_info function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info",
        encode_one(()).unwrap(), // No arguments needed
        
    ) else {
        ic_cdk::println!("Error occured");
        panic!("Expected reply");
    };

    ic_cdk::println!("response {:?}",response);

    // Decode the response into an Option<VentureCapitalist>
    let result: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&response).unwrap();
    let project = result.unwrap();
    let binding1 = project.0.clone();

    // Assert that the returned VC information matches the expected VC information
    assert_eq!(binding1, expected_vc_info);
}






#[test]
fn test_attempt_to_retrieve_info_for_non_registered_vc() {
    let (pic, backend_canister) = setup();

    // Define a test principal with no registered VC profile
    let test_principal = Principal::anonymous(); 

    // Register the user
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
            profile_picture: None, 
            email: None, 
            country: "United States".to_string(),
            social_links: None, 
            bio: Some("An enthusiastic tech investor focused on blockchain technologies.".to_string()),
            area_of_interest: "Blockchain".to_string(),
            openchat_username: None, 
            type_of_profile: Some("investor".to_string()),
            reason_to_join: None,
        },
        uid: "839047bc25dd6b3d25bf153f8ae121bdfb5ca2cc9246763fb59a679c1eeb4586".to_string(),
        is_active: true,
        joining_date: 06062003,
        profile_completion: 50,
    };

    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_args((captcha_id, captcha_input, user_info.params.clone())).unwrap(),
    )else{
        panic!("Expected Reply")
    };

    let result:Result<std::string::String, std::string::String>= decode_one(&response).unwrap();
    ic_cdk::println!("REGISTERED USER {:?}", result);

    // Attempt to retrieve VC info without having registered as a VC
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(result.is_none(), "VC information should not exist for a non-registered VC.");
}





#[test]
fn test_retrieve_vc_info_for_deactivated_account() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous();

    // Register the user
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
            full_name: "Deactivated VC".to_string(),
            profile_picture: None, 
            email: None, 
            country: "United States".to_string(),
            social_links: None, 
            bio: Some("A former VC.".to_string()),
            area_of_interest: "Finance".to_string(),
            openchat_username: None, 
            type_of_profile: Some("investor".to_string()),
            reason_to_join: None,
        },
        uid: "839047bc25dd6b3d25bf153f8ae121bdfb5ca2cc9246763fb59a679c1eeb4586".to_string(),
        is_active: true,
        joining_date: 06062003,
        profile_completion: 50,
    };

    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_args((captcha_id, captcha_input, user_info.params.clone())).unwrap(),
    )else{
        panic!("Expected Reply")
    };

    let result:Result<std::string::String, std::string::String>= decode_one(&response).unwrap();
    ic_cdk::println!("REGISTERED USER {:?}", result);

    // Register the VC
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
        project_on_multichain: None,
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

    // Deactivate the VC account
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

    // Attempt to retrieve the VC info
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&response).unwrap();
    ic_cdk::println!("RESULT {:?}",result);
    assert!(result.is_none(), "VC information should not be accessible after deactivation.");
}






#[test]
fn test_retrieve_vc_info_after_multiple_updates() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous();

    // Register the user
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
            full_name: "Multi-Update VC".to_string(),
            profile_picture: None, 
            email: None, 
            country: "United States".to_string(),
            social_links: None, 
            bio: Some("A VC with multiple updates.".to_string()),
            area_of_interest: "Blockchain".to_string(),
            openchat_username: None, 
            type_of_profile: Some("investor".to_string()),
            reason_to_join: None,
        },
        uid: "839047bc25dd6b3d25bf153f8ae121bdfb5ca2cc9246763fb59a679c1eeb4586".to_string(),
        is_active: true,
        joining_date: 06062003,
        profile_completion: 50,
    };

    let Ok(WasmResult::Reply(response))= pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_args((captcha_id, captcha_input, user_info.params.clone())).unwrap(),
    )else{
        panic!("Expected Reply")
    };

    let result:Result<std::string::String, std::string::String>= decode_one(&response).unwrap();
    ic_cdk::println!("REGISTERED USER {:?}", result);

    // Register the VC
    let vc_info_initial = VentureCapitalist {
        name_of_fund: "Initial Fund".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: None,
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
        encode_one(vc_info_initial.clone()).unwrap(),
    ).expect("VC registration failed");

    // Update the VC info
    let vc_info_updated = VentureCapitalist {
        name_of_fund: "Updated Fund".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(false),
        average_check_size: 10_000_000.0,
        existing_icp_investor: false,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("Updated ICP Projects".to_string()),
        type_of_investment: "Debt".to_string(),
        project_on_multichain: Some("Polkadot, Cosmos".to_string()),
        category_of_investment: "Finance".to_string(),
        reason_for_joining: Some("New opportunities".to_string()),
        preferred_icp_hub: "ICP Hub 2".to_string(),
        investor_type: Some("Private Equity".to_string()),
        number_of_portfolio_companies: 20,
        portfolio_link: "https://updatedportfolio.example.com".to_string(),
        website_link: Some("https://updatedvcfund.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("Canada".to_string()),
        stage: Some("Expansion".to_string()),
        range_of_check_size: Some("$5-10M".to_string()),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "update_venture_capitalist",
        encode_one(vc_info_updated.clone()).unwrap(),
    ).expect("VC update failed");

    // Retrieve the VC info after the update
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&response).unwrap();
    let project = result.unwrap();
    let binding1 = project.0.clone();

    // Assert that the returned VC information matches the latest update
    assert_eq!(binding1, vc_info_updated);
}






#[test]
fn test_retrieve_vc_info_with_different_principal() {
    let (pic, backend_canister) = setup();

    // Define two test principals
    let registering_principal = Principal::anonymous();
    let querying_principal = Principal::anonymous();

    // Register the user for the registering principal
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
            full_name: "Registering User".to_string(),
            profile_picture: None, 
            email: None, 
            country: "United States".to_string(),
            social_links: None, 
            bio: Some("A user registering as VC.".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: None, 
            type_of_profile: Some("investor".to_string()),
            reason_to_join: None,
        },
        uid: "839047bc25dd6b3d25bf153f8ae121bdfb5ca2cc9246763fb59a679c1eeb4586".to_string(),
        is_active: true,
        joining_date: 06062003,
        profile_completion: 50,
    };

    pic.update_call(
        backend_canister,
        registering_principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Register the VC with the registering principal
    let vc_info = VentureCapitalist {
        name_of_fund: "Test Fund".to_string(),
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
        registering_principal,
        "register_venture_capitalist",
        encode_one(vc_info.clone()).unwrap(),
    ).expect("VC registration failed");

    // Attempt to retrieve the VC info using a different principal
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        querying_principal,
        "get_vc_info",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(result.is_none(), "VC information should not be accessible by a different principal.");
}
