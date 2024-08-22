// use candid::{decode_one, encode_one, Principal};
// use pocket_ic::{PocketIc, WasmResult};

// use std::fs;

// use IcpAccelerator_backend::user_module::Role;

// // Define the path to your compiled Wasm file
// const BACKEND_WASM: &str = "/home/harman/accelerator/ICPAccelerator/target/wasm32-unknown-unknown/release/IcpAccelerator_backend.wasm";

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
// fn test_get_roles_for_principal() {
//     let (pic, backend_canister) = setup();

//     // Define a test principal
//     let test_principal = Principal::from_text("2vxsx-fae").unwrap(); // Replace with a specific principal if needed

//     // Call the get_roles_for_principal function
//     let Ok(WasmResult::Reply(response)) = pic.query_call(
//         backend_canister,
//         test_principal,
//         "get_roles_for_principal",
//         encode_one(test_principal).unwrap(),
//     ) else {
//         panic!("Expected reply");
//     };

//     // Decode the response into a vector of Role structs
//     let result: Vec<Role> = decode_one(&response).unwrap();
//     ic_cdk::println!("Result from API is {:?}", result);

//     // Define the expected roles for an uninitialized principal
//     let expected_roles = vec![
//         Role {
//             name: "user".to_string(),
//             status: "default".to_string(),
//             requested_on: None,
//             approved_on: None,
//             rejected_on: None,
//             approval_status: Some("default".to_string()),
//         },
//         Role {
//             name: "project".to_string(),
//             status: "default".to_string(),
//             requested_on: None,
//             approved_on: None,
//             rejected_on: None,
//             approval_status: Some("default".to_string()),
//         },
//         Role {
//             name: "mentor".to_string(),
//             status: "default".to_string(),
//             requested_on: None,
//             approved_on: None,
//             rejected_on: None,
//             approval_status: Some("default".to_string()),
//         },
//         Role {
//             name: "vc".to_string(),
//             status: "default".to_string(),
//             requested_on: None,
//             approved_on: None,
//             rejected_on: None,
//             approval_status: Some("default".to_string()),
//         },
//     ];

//     // Assert that the returned roles match the expected default roles
//     assert_eq!(result, expected_roles);
// }
