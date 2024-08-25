// use candid::{decode_one, encode_one, Principal};
// use pocket_ic::{PocketIc, WasmResult};
// use std::fs;

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
// fn test_get_member_id() {
//     let (pic, backend_canister) = setup();

//     // Define a test principal
//     let test_principal = Principal::from_text("utzoc-lf6wr-ie6uw-c6e3r-mpszm-5e2ss-x6mel-kn26y-ttah4-duojk-eqe").unwrap();
//     let args = encode_one(test_principal).unwrap();
//     // Simulate the state where the user's UID is already stored
//     // For simplicity, assume the user's UID is already present in the state

//     // Call the get_member_id function
//     let Ok(WasmResult::Reply(response)) = pic.query_call(
//         backend_canister,
//         test_principal,
//         "get_member_id",
//         args, // No arguments needed
//     ) else {
//         panic!("Expected reply");
//     };

//     // Decode the response into a String (the user's UID)
//     let result: String = decode_one(&response).unwrap();

//     // Define the expected UID based on what should be stored
//     let expected_uid = "123e4567-e89b-12d3-a456-426614174000".to_string(); // Example UID, replace with expected data

//     // Assert that the returned UID matches the expected UID
//     assert_eq!(result, expected_uid);
// }
