// use candid::{decode_one, Principal};
// use candid::encode_one;
// use pocket_ic::{PocketIc, WasmResult};

// use IcpAccelerator_backend::user_module::Role;

// use std::fs;

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
// fn test_get_role_status() {
//     let (pic, backend_canister) = setup();

//     let principal = Principal::from_text("utzoc-lf6wr-ie6uw-c6e3r-mpszm-5e2ss-x6mel-kn26y-ttah4-duojk-eqe").unwrap();
//     let args = encode_one(principal).unwrap();

//     // Call the get_role_status function with an anonymous principal
//     let result = pic.query_call(
//         backend_canister,
//         principal, // Specified principal
//         "get_role_status",
//         args, // No arguments for this query
//     );

//     ic_cdk::println!("Query result: {:?}", result);


//     if let Ok(WasmResult::Reply(response)) = result {
//         // Decode the response into a vector of Role structs
//         let result: Vec<Role> = decode_one(&response).unwrap();

//         // Define the expected default roles when no role status is found
//         let expected_roles = vec![
//             Role {
//                 name: "user".to_string(),
//                 status: "default".to_string(),
//                 requested_on: None,
//                 approved_on: None,
//                 rejected_on: None,
//                 approval_status: Some("default".to_string()),
//             },
//             Role {
//                 name: "project".to_string(),
//                 status: "default".to_string(),
//                 requested_on: None,
//                 approved_on: None,
//                 rejected_on: None,
//                 approval_status: Some("default".to_string()),
//             },
//             Role {
//                 name: "mentor".to_string(),
//                 status: "default".to_string(),
//                 requested_on: None,
//                 approved_on: None,
//                 rejected_on: None,
//                 approval_status: Some("default".to_string()),
//             },
//             Role {
//                 name: "vc".to_string(),
//                 status: "default".to_string(),
//                 requested_on: None,
//                 approved_on: None,
//                 rejected_on: None,
//                 approval_status: Some("default".to_string()),
//             },
//         ];

//         // Assert that the returned roles match the expected default roles
//         assert_eq!(result, expected_roles);
//     } else {
//         panic!("Expected reply, got: {:?}", result);
//     }
// }
