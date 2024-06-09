// use ic_cdk_macros::query;
// use ic_cdk_macros::update;
// use candid::CandidType;
// use std::cell::RefCell;

// #[derive(CandidType, Clone)]
// pub struct Role {
//     id: i32,
//     name: String,
// }

// #[derive(CandidType)]
// pub struct RolesResponse {
//     roles: Vec<Role>,
// }

// Use RefCell for interior mutability and thread_local to maintain state across calls in the same canister.
// thread_local! {
//     static ROLES: RefCell<Vec<Role>> = RefCell::new(Vec::new());
// }


//they will be used by admin side 

// 
// pub fn get_roles() -> RolesResponse {
//     // Retrieve the roles from the global state
//     ROLES.with(|roles| RolesResponse {
//         roles: roles.borrow().clone(),
//     })
// }

// #[update]
// pub fn add_role(name: String) -> Role {
//     // Generate a new ID based on the count of existing roles + 1 to ensure uniqueness
//     let new_role = ROLES.with(|roles| {
//         let mut roles = roles.borrow_mut();
//         let new_id = (roles.len() as i32) + 1; // Simple auto-increment, assumes roles are never removed
//         let role = Role { id: new_id, name: name.clone() };
//         roles.push(role.clone());
//         role
//     });

//     ic_cdk::println!("Added new role: {}", name);
//     new_role
// }

//they will be used by admin side ...........



use ic_cdk_macros::query;
use candid::CandidType;

// Define a struct for a role with an id and a name.
#[derive(CandidType)]
pub struct Role {
    id: i32,
    name: &'static str,
}

// Update the RolesResponse struct to use a vector of Role objects.
#[derive(CandidType)]
pub struct RolesResponse {
    roles: Vec<Role>,
}


pub fn get_roles() -> RolesResponse {
    RolesResponse {
        roles: vec![
            Role { id: 1, name: "Mentor" },
            Role { id: 2, name: "Project" },
            Role { id: 3, name: "VC" },
            Role { id: 4, name: "ICPHubOrganizer" },
        ],
    }
}

//purana
// use ic_cdk_macros::query;
// use candid::CandidType;

// #[derive(CandidType)]
// pub struct RolesResponse {
//     roles: Vec<&'static str>,
// }

// 
// pub fn get_roles() -> RolesResponse {
//     RolesResponse {
//         roles: vec!["Mentor/Expert", "Project", "Venture Capital", "Hub Organizer", "Admin"],
//     }
// }

// pub fn pre_upgrade_upvotes() {
//     ROLES.with(|notifications| {
//         let serialized =
//             bincode::serialize(&*notifications.borrow()).expect("Serialization failed");
//         let mut writer = StableWriter::default();
//         writer
//             .write(&serialized)
//             .expect("Failed to write to stable storage");
//     });
// }

// pub fn post_upgrade_upvotes() {
//     let mut reader = StableReader::default();
//     let mut data = Vec::new();
//     reader
//         .read_to_end(&mut data)
//         .expect("Failed to read from stable storage");
//     let upvotes: UpvoteStorage =
//         bincode::deserialize(&data).expect("Deserialization failed of notification");
//     UPVOTES.with(|notifications_ref| {
//         *notifications_ref.borrow_mut() = upvotes;
//     });
// }

