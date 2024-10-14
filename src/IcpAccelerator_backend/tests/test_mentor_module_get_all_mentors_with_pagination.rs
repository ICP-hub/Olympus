use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{
    mentor_module::mentor_types::{MentorInternal, MentorProfile}, types::{individual_types::MentorWithRoles, pagination_types::{PaginationParamMentor, PaginationReturnMentor}}, user_modules::user_types::{Role, UserInfoInternal, UserInformation}
};
use std::fs;

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
fn test_get_all_mentors_with_pagination() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Define the UserInformation with some fields set to None
let user_info = UserInfoInternal {
        params: UserInformation {
            full_name: "Test Mentor".to_string(),
            profile_picture: None,
            email: Some("mentor@example.com".to_string()),
            country: "United States".to_string(),
            social_links: None,
            bio: Some("Experienced mentor with a focus on technology.".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: None,
            type_of_profile: Some("mentor".to_string()),
            reason_to_join: Some(vec!["Contribute to innovative projects.".to_string()]),
        },
        uid: "839047bc25dd6b3d25bf153f8ae121bdfb5ca2cc9246763fb59a679c1eeb4586".to_string(),
        is_active: true,
        joining_date: 1625097600,
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

    // Create a MentorProfile object to simulate mentor registration
    let mentor_profile = MentorInternal {
        profile: MentorProfile {
            preferred_icp_hub: Some("ICP Hub".to_string()),
            existing_icp_mentor: true,
            existing_icp_project_porfolio: Some("Portfolio of ICP projects".to_string()),
            icp_hub_or_spoke: false,
            category_of_mentoring_service: "Technology".to_string(),
            links: None,
            multichain: Some(vec!["Ethereum".to_string(), "Solana".to_string()]),
            years_of_mentoring: "10".to_string(),
            website: Some("https://mentor.example.com".to_string()),
            area_of_expertise: vec!["Blockchain".to_string()],
            reason_for_joining: Some("To mentor emerging projects.".to_string()),
            hub_owner: Some("ICP Hub Owner".to_string()),
        },
        uid: "b7deb0ac398bb66b3d8e1736cd4163d0a8411ec4fda4e8be58de74cdac6c8e08".to_string(),
        active: true,
        approve: true,
        decline: false,
        profile_completion: 50,
    };

    // Simulate the mentor registration by directly manipulating the canister state
    let Ok(WasmResult::Reply(_)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.profile.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Define pagination parameters (e.g., page 1 with page size 10)
    let pagination_params = PaginationParamMentor {
        page: 1,
        page_size: 10,
    };

    // Call the get_all_mentors_with_pagination function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_all_mentors_with_pagination",
        encode_one(pagination_params).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the paginated mentor info was retrieved correctly
    let retrieved_mentors: PaginationReturnMentor = decode_one(&response).unwrap();

    // There should be one mentor registered, and it should match the mentor_profile we registered
    assert_eq!(retrieved_mentors.data.len(), 1, "There should be one mentor in the paginated list");
    assert_eq!(retrieved_mentors.count, 1, "The total count of mentors should be 1");

    // Extract the retrieved mentor details
    let retrieved_mentor_info = retrieved_mentors.data.get(&test_principal).expect("Mentor not found");
    assert_eq!(retrieved_mentor_info.mentor_profile.uid, mentor_profile.uid, "Mentor UID should match");
    assert_eq!(retrieved_mentor_info.mentor_profile.profile.area_of_expertise, mentor_profile.profile.area_of_expertise, "Area of expertise should match");

    // Verify user data
    let retrieved_user_info = retrieved_mentors.user_data.get(&test_principal).expect("User not found");
    assert_eq!(retrieved_user_info.full_name, user_info.params.full_name, "User full name should match");

    // Additional assertions for roles (if roles were to be added)
    // assert_eq!(retrieved_mentor_info.roles.len(), expected_role_count, "Expected number of roles should match");
}






#[test]
fn test_multiple_pages() {
    let (pic, backend_canister) = setup();

    // Register multiple mentors
    let num_mentors = 10;
    let page_size = 5;
    for i in 1..=num_mentors {
        let principal = Principal::from_slice(&[i as u8]);
        ic_cdk::println!("PRINCIPAL {:?}",principal);

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
        pic.update_call(
            backend_canister,
            principal,
            "register_user",
            encode_one(user_info.params.clone()).unwrap(),
        ).expect("User registration failed");


        let mentor_role = Role {
            name: "Mentor".to_string(),
            status: "Approved".to_string(),
            requested_on: None,
            approved_on: None,
            rejected_on: None,
            approval_status: Some("Approved".to_string()),
        };
        let mentor_profile = MentorWithRoles {
            mentor_profile: MentorInternal {
                profile: MentorProfile {
                    preferred_icp_hub: Some("ICP Hub".to_string()),
                    existing_icp_mentor: true,
                    existing_icp_project_porfolio: Some(format!("Portfolio of mentor {}", i)),
                    icp_hub_or_spoke: false,
                    category_of_mentoring_service: "Technology".to_string(),
                    links: None,
                    multichain: Some(vec!["Ethereum".to_string(), "Solana".to_string()]),
                    years_of_mentoring: "10".to_string(),
                    website: Some(format!("https://mentor{}.com", i)),
                    area_of_expertise: vec!["Blockchain".to_string()],
                    reason_for_joining: Some(format!("To mentor project {}", i)),
                    hub_owner: Some("ICP Hub Owner".to_string()),
                },
                uid: format!("mentor_uid_{}", i),
                active: true,
                approve: true,
                decline: false,
                profile_completion: 50,
            },
            roles: vec![mentor_role],  // Assign the mentor role
        };
        // Simulate the mentor registration by directly manipulating the canister state
        let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.mentor_profile.profile.clone()).unwrap(),
        ) else {
            panic!("Expected reply");
        };

        let registered_mentor_list:String = decode_one(&response).unwrap();
        ic_cdk::println!("REGISTERED MENTORS {:?}",registered_mentor_list);
    }

    // Test first page
    let pagination_params = PaginationParamMentor {
        page: 1,
        page_size,
    };
    let result = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "get_all_mentors_with_pagination",
        encode_one(pagination_params).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let pagination_result: PaginationReturnMentor = decode_one(&response).unwrap();
            assert_eq!(pagination_result.data.len(), page_size, "First page should have the correct number of mentors");
            assert_eq!(pagination_result.count, num_mentors as u64, "Total count should match the number of registered mentors");
        },
        _ => panic!("Test failed for multiple pages (first page)"),
    }

    // Test second page
    let pagination_params = PaginationParamMentor {
        page: 2,
        page_size,
    };
    let result = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "get_all_mentors_with_pagination",
        encode_one(pagination_params).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let pagination_result: PaginationReturnMentor = decode_one(&response).unwrap();
            assert_eq!(pagination_result.data.len(), page_size, "Second page should have the correct number of mentors");
            assert_eq!(pagination_result.count, num_mentors as u64, "Total count should remain consistent");
        },
        _ => panic!("Test failed for multiple pages (second page)"),
    }
}






#[test]
fn test_empty_mentor_list() {
    let (pic, backend_canister) = setup();

    // Test pagination with no mentors
    let pagination_params = PaginationParamMentor {
        page: 1,
        page_size: 5,
    };
    let result = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "get_all_mentors_with_pagination",
        encode_one(pagination_params).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let pagination_result: PaginationReturnMentor = decode_one(&response).unwrap();
            assert!(pagination_result.data.is_empty(), "Mentor list should be empty");
            assert_eq!(pagination_result.count, 0, "Total count should be zero");
        },
        _ => panic!("Test failed for empty mentor list"),
    }
}















#[test]
fn test_non_existent_page() {
    let (pic, backend_canister) = setup();

    // Register a small number of mentors
    let num_mentors = 3;
    for i in 1..=num_mentors {
        let principal = Principal::from_slice(&[i as u8]);

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
                pic.update_call(
                    backend_canister,
                    principal,
                    "register_user",
                    encode_one(user_info.params.clone()).unwrap(),
                ).expect("User registration failed");

        let mentor_role = Role {
            name: "Mentor".to_string(),
            status: "Approved".to_string(),
            requested_on: None,
            approved_on: None,
            rejected_on: None,
            approval_status: Some("Approved".to_string()),
        };
        let mentor_profile = MentorWithRoles {
            mentor_profile: MentorInternal {
                profile: MentorProfile {
                    preferred_icp_hub: Some("ICP Hub".to_string()),
                    existing_icp_mentor: true,
                    existing_icp_project_porfolio: Some(format!("Portfolio of mentor {}", i)),
                    icp_hub_or_spoke: false,
                    category_of_mentoring_service: "Technology".to_string(),
                    links: None,
                    multichain: Some(vec!["Ethereum".to_string(), "Solana".to_string()]),
                    years_of_mentoring: "10".to_string(),
                    website: Some(format!("https://mentor{}.com", i)),
                    area_of_expertise: vec!["Blockchain".to_string()],
                    reason_for_joining: Some(format!("To mentor project {}", i)),
                    hub_owner: Some("ICP Hub Owner".to_string()),
                },
                uid: format!("mentor_uid_{}", i),
                active: true,
                approve: true,
                decline: false,
                profile_completion: 50,
            },
            roles: vec![mentor_role],  // Assign the mentor role
        };
        // Simulate the mentor registration by directly manipulating the canister state
        let Ok(WasmResult::Reply(response)) = pic.update_call(
            backend_canister,
            principal,
            "register_mentor",
            encode_one(mentor_profile.mentor_profile.profile.clone()).unwrap(),
            ) else {
                panic!("Expected reply");
            };
    
            let registered_mentor_list:String = decode_one(&response).unwrap();
            ic_cdk::println!("REGISTERED MENTORS {:?}",registered_mentor_list);
    }

    // Request a page that doesn't exist
    let pagination_params = PaginationParamMentor {
        page: 2,
        page_size: 5,
    };
    let result = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "get_all_mentors_with_pagination",
        encode_one(pagination_params).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let pagination_result: PaginationReturnMentor = decode_one(&response).unwrap();
            assert!(pagination_result.data.is_empty(), "Mentor list should be empty for non-existent page");
            assert_eq!(pagination_result.count, num_mentors as u64, "Total count should remain consistent");
        },
        _ => panic!("Test failed for non-existent page"),
    }
}


















#[test]
fn test_page_size_larger_than_total_mentors() {
    let (pic, backend_canister) = setup();

    // Register a small number of mentors
    let num_mentors = 3;
    for i in 1..=num_mentors {
        let principal = Principal::from_slice(&[i as u8]);

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
        pic.update_call(
            backend_canister,
            principal,
            "register_user",
            encode_one(user_info.params.clone()).unwrap(),
        ).expect("User registration failed");

        let mentor_role = Role {
            name: "Mentor".to_string(),
            status: "Approved".to_string(),
            requested_on: None,
            approved_on: None,
            rejected_on: None,
            approval_status: Some("Approved".to_string()),
        };
        let mentor_profile = MentorWithRoles {
            mentor_profile: MentorInternal {
                profile: MentorProfile {
                    preferred_icp_hub: Some("ICP Hub".to_string()),
                    existing_icp_mentor: true,
                    existing_icp_project_porfolio: Some(format!("Portfolio of mentor {}", i)),
                    icp_hub_or_spoke: false,
                    category_of_mentoring_service: "Technology".to_string(),
                    links: None,
                    multichain: Some(vec!["Ethereum".to_string(), "Solana".to_string()]),
                    years_of_mentoring: "10".to_string(),
                    website: Some(format!("https://mentor{}.com", i)),
                    area_of_expertise: vec!["Blockchain".to_string()],
                    reason_for_joining: Some(format!("To mentor project {}", i)),
                    hub_owner: Some("ICP Hub Owner".to_string()),
                },
                uid: format!("mentor_uid_{}", i),
                active: true,
                approve: true,
                decline: false,
                profile_completion: 50,
            },
            roles: vec![mentor_role],  // Assign the mentor role
        };
        // Simulate the mentor registration by directly manipulating the canister state
        let Ok(WasmResult::Reply(response)) = pic.update_call(
            backend_canister,
            principal,
            "register_mentor",
            encode_one(mentor_profile.mentor_profile.profile.clone()).unwrap(),
            ) else {
                panic!("Expected reply");
            };
    
            let registered_mentor_list:String = decode_one(&response).unwrap();
            ic_cdk::println!("REGISTERED MENTORS {:?}",registered_mentor_list);
    }

    // Request with page size larger than total mentors
    let pagination_params = PaginationParamMentor {
        page: 1,
        page_size: 10,
    };
    let result = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "get_all_mentors_with_pagination",
        encode_one(pagination_params).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let pagination_result: PaginationReturnMentor = decode_one(&response).unwrap();
            assert_eq!(pagination_result.data.len(), num_mentors, "All mentors should be returned if page size exceeds total mentors");
            assert_eq!(pagination_result.count, num_mentors as u64, "Total count should match the number of registered mentors");
        },
        _ => panic!("Test failed for page size larger than total mentors"),
    }
}













#[test]
fn test_zero_values() {
    let (pic, backend_canister) = setup();

    // Register a mentor to test
    let principal = Principal::from_slice(&[1 as u8]);

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
    pic.update_call(
        backend_canister,
        principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    let mentor_role = Role {
        name: "Mentor".to_string(),
        status: "Approved".to_string(),
        requested_on: None,
        approved_on: None,
        rejected_on: None,
        approval_status: Some("Approved".to_string()),
    };
    let mentor_profile = MentorWithRoles {
        mentor_profile: MentorInternal {
            profile: MentorProfile {
                preferred_icp_hub: Some("ICP Hub".to_string()),
                existing_icp_mentor: true,
                existing_icp_project_porfolio: Some("Portfolio of mentor".to_string()),
                icp_hub_or_spoke: false,
                category_of_mentoring_service: "Technology".to_string(),
                links: None,
                multichain: Some(vec!["Ethereum".to_string(), "Solana".to_string()]),
                years_of_mentoring: "10".to_string(),
                website: Some("https://mentor.com".to_string()),
                area_of_expertise: vec!["Blockchain".to_string()],
                reason_for_joining: Some("To mentor project".to_string()),
                hub_owner: Some("ICP Hub Owner".to_string()),
            },
            uid: "mentor_uid".to_string(),
            active: true,
            approve: true,
            decline: false,
            profile_completion: 50,
        },
        roles: vec![mentor_role],  // Assign the mentor role
    };
    // Simulate the mentor registration by directly manipulating the canister state
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.mentor_profile.profile.clone()).unwrap(),
        ) else {
            panic!("Expected reply");
        };

        let registered_mentor_list:String = decode_one(&response).unwrap();
        ic_cdk::println!("REGISTERED MENTORS {:?}",registered_mentor_list);

    // Test with page size of zero
    let pagination_params = PaginationParamMentor {
        page: 1,
        page_size: 0,
    };
    let result = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "get_all_mentors_with_pagination",
        encode_one(pagination_params).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let pagination_result: PaginationReturnMentor = decode_one(&response).unwrap();
            assert!(pagination_result.data.is_empty(), "Mentor list should be empty when page size is zero");
            assert_eq!(pagination_result.count, 1, "Total count should remain consistent");
        },
        _ => panic!("Test failed for zero page size"),
    }

}

