// use candid::{decode_one, encode_one, Principal};
// use pocket_ic::{PocketIc, WasmResult};
// use std::fs;

// use IcpAccelerator_backend::user_module::{Role, UserInformation};

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
// fn test_switch_role() {
//     let (pic, backend_canister) = setup();

//     // Define a test principal
//     let test_principal = Principal::anonymous(); // Use a specific principal if needed

//     // Define the role to switch and the new status
//     let role_to_switch = "project".to_string();
//     let new_status = "active".to_string();

//     // Call the switch_role function using an update call
//     let response = pic.update_call(
//         backend_canister,
//         test_principal,
//         "switch_role",
//         encode_one((role_to_switch.clone(), new_status.clone())).unwrap(),
//     );
//     ic_cdk::println!("RESPONSE {:?}", response);

//     // Handle the response and assert success
//     match response {
//         Ok(WasmResult::Reply(_)) => { /* Success case, proceed */ }
//         Ok(WasmResult::Reject(message)) => panic!("Call was rejected: {}", message),
//         Err(e) => panic!("Error during call: {:?}", e),
//     }

//     // Verify the role has been switched
//     let response = pic.query_call(
//         backend_canister,
//         test_principal,
//         "get_roles_for_principal",
//         encode_one(test_principal).unwrap(),
//     );
//     ic_cdk::println!("RESPONSE 2 {:?}", response);

//     // Assert that the query call was successful
//     match response {
//         Ok(WasmResult::Reply(bytes)) => {
//             let roles: Vec<Role> = decode_one(&bytes).unwrap();

//             // Check that the role_to_switch has the new status
//             let switched_role = roles.iter().find(|role| role.name == role_to_switch).unwrap();
//             assert_eq!(switched_role.status, new_status);

//             // Check that the previously active role is now approved
//             let active_role = roles.iter().find(|role| role.status == "approved").unwrap();
//             assert_eq!(active_role.status, "approved");
//         }
//         Ok(WasmResult::Reject(message)) => panic!("Query was rejected: {}", message),
//         Err(e) => panic!("Error during query: {:?}", e),
//     }
// }

// #[test]
// fn test_register_user_with_minimum_valid_input() {
//     let (pic, backend_canister) = setup();

//     let user_info = UserInformation {
//         full_name: "John Doe".to_string(),
//         profile_picture: None,
//         email: None,
//         country: "USA".to_string(),
//         social_links: None,
//         bio: None,
//         area_of_interest: "Technology".to_string(),
//         openchat_username: None,
//         type_of_profile: None,
//         reason_to_join: None,
//     };

//     let response = pic.update_call(
//         backend_canister,
//         Principal::anonymous(),
//         "register_user",
//         encode_one(user_info).unwrap(),
//     );

//     match response {
//         Ok(WasmResult::Reply(reply_bytes)) => {
//             // Decode the reply bytes into a String
//             let response_str: String = decode_one(&reply_bytes).unwrap();
//             assert!(response_str.contains("User registered successfully"));
//         }
//         Ok(WasmResult::Reject(message)) => panic!("Call was rejected: {}", message),
//         Err(e) => panic!("Error during call: {:?}", e),
//     }
// }
