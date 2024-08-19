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
fn test_get_vc_announcements() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Define the VC's name and announcement message
    let announcement_name = "New Investment".to_string();
    let announcement_message = "We have made a significant investment in XYZ Company.".to_string();

    // Simulate adding an announcement for the VC
    pic.update_call(
        backend_canister,
        test_principal,
        "add_vc_announcement",
        encode_one((announcement_name.clone(), announcement_message.clone())).unwrap(),
    ).expect("Expected reply");

    // Call the get_vc_announcements function
    let Ok(WasmResult::Reply(announcements_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_announcements",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the announcements were retrieved successfully
    let announcements_map: HashMap<Principal, Vec<Announcements>> =
        decode_one(&announcements_response).unwrap();

    // Verify that the announcement is in the list for the correct principal
    let stored_announcements = announcements_map.get(&test_principal);
    assert!(stored_announcements.is_some(), "No announcements found for the principal");

    let announcement = stored_announcements.unwrap().iter().find(|&a| a.project_name == announcement_name);
    assert!(announcement.is_some(), "Announcement not found in the stored announcements");

    // Verify the contents of the stored announcement
    let announcement = announcement.unwrap();
    assert_eq!(announcement.project_name, announcement_name);
    assert_eq!(announcement.announcement_message, announcement_message);
}
