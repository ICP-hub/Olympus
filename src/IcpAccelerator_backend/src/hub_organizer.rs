    use candid::{CandidType, Deserialize};
    use ic_cdk::api::caller;
    use ic_cdk::api::management_canister::main::raw_rand;
    // use ic_cdk::export::Principal;
    use candid::Principal;
    use ic_cdk_macros::{query, update};
    use serde::Serialize;
    use sha2::{Digest, Sha256};
    use std::cell::RefCell;
    use std::collections::HashMap;

    #[derive(Serialize, Deserialize, Clone, Debug, CandidType)]
    pub struct HubOrganizerRegistration {
        pub full_name: Option<String>,
        email: Option<String>,
        contact_number: Option<String>,
        pub profile_picture: Option<Vec<u8>>,
        hub_name: Option<String>,
        hub_location: Option<String>,
        hub_description: Option<String>,
        website_url: Option<String>,
        privacy_policy_consent: Option<bool>,
        communication_consent: Option<bool>,
        id_professional_document_upload: Option<Vec<u8>>,
    }

    #[derive(Clone, CandidType)]
    pub struct UniqueHubs {
        pub hubs: HubOrganizerRegistration,
        uuid: String,
    }

    thread_local! {
        static HUB_ORGANIZER_REGISTRATIONS: RefCell<HashMap<Principal, UniqueHubs>> = RefCell::new(HashMap::new());
    }

    
    pub async fn register_hub_organizer(form: HubOrganizerRegistration) -> String {
        let caller = caller();

        let random_bytes = raw_rand().await.expect("couldn't get random number").0;
        let uuid = format!("{:x}", Sha256::digest(&random_bytes));

        if let Some(privacy_consent) = form.privacy_policy_consent {
            if let Some(communication_consent) = form.communication_consent {
                if !communication_consent || !privacy_consent {
                    return "Consent to privacy policy and communication is required.".to_string();
                } else {
                    HUB_ORGANIZER_REGISTRATIONS.with(|organizer_registry| {
                        let mut registry = organizer_registry.borrow_mut();
                        if registry.contains_key(&caller) {
                            return "you are a registered one".to_string();
                        }

                        let obj = UniqueHubs { hubs: form, uuid };

                        registry.insert(caller, obj);
                        "you hv got urself registered".to_string()
                    })
                }
            } else {
                return "communication consent field was supposed to be filled".to_string();
            }
        } else {
            return "privacy consent field was supposed to be filled".to_string();
        }
    }

    
    pub fn get_hub_organizer() -> Option<UniqueHubs> {
        let caller = caller();
        HUB_ORGANIZER_REGISTRATIONS.with(|registry| {
            let registry = registry.borrow();
            registry.get(&caller).cloned()
        })
    }

    
    pub fn update_hub_organizer(params: HubOrganizerRegistration) -> String {
        let caller = caller();

        HUB_ORGANIZER_REGISTRATIONS.with(|all_hub_organizers| {
            let mut hub_organizers = all_hub_organizers.borrow_mut();
            if let Some(existing_hub) = hub_organizers.get_mut(&caller) {
                if let Some(full_name) = params.full_name {
                    existing_hub.hubs.full_name = Some(full_name);
                }
                if let Some(email) = params.email {
                    existing_hub.hubs.email = Some(email);
                }
                if let Some(contact_number) = params.contact_number {
                    existing_hub.hubs.contact_number = Some(contact_number);
                }
                existing_hub.hubs.profile_picture = params
                    .profile_picture
                    .or(existing_hub.hubs.profile_picture.clone());
                existing_hub.hubs.hub_name = params.hub_name.or(existing_hub.hubs.hub_name.clone());
                if let Some(hub_loc) = params.hub_location {
                    existing_hub.hubs.hub_location = Some(hub_loc);
                }
                if let Some(hub_description) = params.hub_description {
                    existing_hub.hubs.hub_description = Some(hub_description);
                }
                if let Some(web_url) = params.website_url {
                    existing_hub.hubs.website_url = Some(web_url);
                }
                if let Some(consent) = params.privacy_policy_consent {
                    existing_hub.hubs.privacy_policy_consent = Some(consent);
                }
                existing_hub.hubs.communication_consent = params
                    .communication_consent
                    .or(existing_hub.hubs.communication_consent);
                existing_hub.hubs.id_professional_document_upload = params
                    .id_professional_document_upload
                    .or(existing_hub.hubs.id_professional_document_upload.clone());
                "You have updated yourself successfully".to_string()
            } else {
                "You are not existing, do register yourself".to_string()
            }
        })
    }

    pub fn get_hub_organizer_principals_by_region(region: String) -> Vec<String> {
        HUB_ORGANIZER_REGISTRATIONS.with(|registry| {
            registry.borrow()
                .iter()
                .filter_map(|(principal, unique_hub)| {
                    if let Some(hub_region) = &unique_hub.hubs.hub_location {
                        if hub_region.to_lowercase() == region.to_lowercase() {
                            Some(principal.to_text())
                        } else {
                            None
                        }
                    } else {
                        None
                    }
                })
                .collect()
        })
    }

