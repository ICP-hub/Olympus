// use candid::{decode_one, encode_one, Principal};
// use pocket_ic::{PocketIc, WasmResult};
// use std::fs;

// use IcpAccelerator_backend::user_module::UserInformation;

// // Define the path to your compiled Wasm file
// const BACKEND_WASM: &str = "/Users/mridulyadav/Desktop/ICPAccelerator/target/wasm32-unknown-unknown/release/IcpAccelerator_backend.wasm";


// // Setup function to initialize PocketIC and install the Wasm module
// fn setup() -> (PocketIc, Principal) {
//     let pic = PocketIc::new();

//     let backend_canister = pic.create_canister();
//     pic.add_cycles(backend_canister, 2_000_000_000_000); // 2T Cycles
//     let wasm = fs::read(BACKEND_WASM).expect("Wasm file not found, run 'dfx build'.");
//     pic.install_canister(backend_canister, wasm, vec![], None);
//     (pic, backend_canister)
// }

// #[test]
// fn test_update_user_data() {
//     let (pic, backend_canister) = setup();

//     // Define a test principal
//     let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

//     // Prepare the new user data to be updated
//     let new_user_data = UserInformation {
//         full_name: "Jane Doe".to_string(),
//         profile_picture: Some(vec![1, 2, 3, 4, 5]), // Example binary data
//         email: Some("janedoe@example.com".to_string()),
//         country: "Canada".to_string(),
//         social_links: None, // Replace with actual data if needed
//         bio: Some("Blockchain enthusiast.".to_string()),
//         area_of_interest: "DeFi".to_string(),
//         openchat_username: Some("jane_doe".to_string()),
//         type_of_profile: Some("Mentor".to_string()),
//         reason_to_join: Some(vec!["Networking".to_string(), "Learning".to_string()]),
//     };

//     // Call the update_user_data function using an update call
//     let Ok(WasmResult::Reply(_response)) = pic.update_call(
//         backend_canister,
//         test_principal,
//         "update_user_data",
//         encode_one((test_principal, new_user_data.clone())).unwrap(),
//     ) else {
//         panic!("Expected reply");
//     };

//     // Verify the updated user data
//     // Call the get_user_info_struct function to retrieve the updated user information
//     let Ok(WasmResult::Reply(response)) = pic.query_call(
//         backend_canister,
//         test_principal,
//         "get_user_info_struct",
//         Vec::new(), // No arguments needed
//     ) else {
//         panic!("Expected reply");
//     };

//     let result: Option<UserInformation> = decode_one(&response).unwrap();

//     // Assert that the returned user information matches the updated information
//     assert_eq!(result, Some(new_user_data));
// }
