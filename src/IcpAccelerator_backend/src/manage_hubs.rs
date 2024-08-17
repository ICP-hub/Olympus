use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use candid::{CandidType, Principal};
use serde_bytes::ByteBuf;
use crate::{is_user_anonymous, state_handler::{self, mutate_state, read_state, StoredPrincipal}};
use ic_cdk::api::caller;
use crate::user_module::*;
use ic_cdk::api::call::call;

#[derive(Serialize, Deserialize, Debug, CandidType)]
pub struct IcpHub {
    id: i32,
    name: String,
    region: String,
}

#[derive(Serialize, Deserialize, Debug, CandidType, Clone)]
pub struct IcpHubDetails{
    name: Option<String>,
    flag: Option<Vec<u8>>,
    twitter: Option<String>,
    telegram: Option<String>,
    discord: Option<String>,
    description: Option<String>,
    website: Option<String>,
}

pub async fn add_hubs_images(caller: Principal, mut data: IcpHubDetails)->IcpHubDetails{
    let hub_flag = data.flag.clone();
    let canister_id = crate::asset_manager::get_asset_canister();

    if hub_flag.is_none(){
        let full_url = canister_id.to_string() + "/uploads/default_hub_logo.jpeg";
        data.flag = Some((full_url).as_bytes().to_vec());
    }else if hub_flag.clone().unwrap().len() < 300 {
        ic_cdk::println!("Project logo is already uploaded");
    }else {
        let hub_logo_key = "/uploads/".to_owned() + &caller.to_string() + "_hub_logo.jpeg";

        let project_logo_arg = StoreArg {
            key: hub_logo_key.clone(),
            content_type: "image/*".to_string(),
            content_encoding: "identity".to_string(),
            content: ByteBuf::from(hub_flag.unwrap()),
            sha256: None,
        };

        let delete_asset = DeleteAsset {
            key: hub_logo_key.clone(),
        };

        let (_deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
            .await
            .unwrap();

        let (_result,): ((),) = call(canister_id, "store", (project_logo_arg,))
            .await
            .unwrap();

        data.flag = Some(
            (canister_id.to_string() + &hub_logo_key)
                .as_bytes()
                .to_vec(),
        );
    }

    data

}

#[update(guard="is_user_anonymous")]
pub async fn add_icp_hub_details(data: IcpHubDetails)->String{
    let caller = caller();

    let mut data_to_store = add_hubs_images(caller, data.clone()).await;

    // Insert or update the hub details in the state
    mutate_state(|state| {
        state.hubs_data.insert(StoredPrincipal(caller), state_handler::Candid(data_to_store));
    });

    // Return success message
    "ICP Hub details added successfully.".to_string()
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct ListAllIcpHubs {
    principal: Principal,
    params: IcpHubDetails,
}

#[query]
pub fn get_icp_hub_details() -> Vec<ListAllIcpHubs> {
    // Retrieve and process the state
    let hubs_snapshot = read_state(|state| {
        state.hubs_data.iter().map(|(principal, details)| {
            (principal, details.clone())  // Clone the data to use outside the state borrow
        }).collect::<Vec<_>>()
    });

    let mut list_all_hubs: Vec<ListAllIcpHubs> = Vec::new();

    // Process the hubs outside of the state borrow
    for (stored_principal, hub_details) in hubs_snapshot {
        // Construct the result struct
        let hub_struct = ListAllIcpHubs {
            principal: stored_principal.0,
            params: hub_details.0,
        };
        list_all_hubs.push(hub_struct);
    }

    list_all_hubs
}

pub fn get_icp_hubs() -> Vec<IcpHub> {
    vec![
        IcpHub {
            id: 1,
            name: "ICP Hub".to_string(),
            region: "Bulgaria".to_string(),
        },
        IcpHub {
            id: 2,
            name: "ICP Hub".to_string(),
            region: "Brazil".to_string(),
        },
        IcpHub {
            id: 3,
            name: "ICP Hub".to_string(),
            region: "Canada".to_string(),
        },
        IcpHub {
            id:4,
            name: "ICP Hub".to_string(),
            region: "China".to_string(),
        },
        IcpHub {
            id: 5,
            name: "ICP Hub".to_string(),
            region: "East Africa".to_string(),
        },
        IcpHub {
            id: 6,
            name: "ICP Hub".to_string(),
            region: "Germany".to_string(),
        },
        IcpHub {
            id: 7,
            name: "ICP Hub".to_string(),
            region: "Holland".to_string(),
        },
        IcpHub {
            id: 8,
            name: "ICP Hub".to_string(),
            region: "Honkong".to_string(),
        },
        IcpHub {
            id: 9,
            name: "ICP Hub".to_string(),
            region: "India".to_string(),
        },
        IcpHub {
            id: 10,
            name: "ICP Hub".to_string(),
            region: "Indonesia".to_string(),
        },
        // ... Continue for the second image
        IcpHub {
            id: 11,
            name: "ICP Hub".to_string(),
            region: "Italia".to_string(),
        },
        IcpHub {
            id: 12,
            name: "ICP Hub".to_string(),
            region: "Italy".to_string(),
        },
        IcpHub {
            id: 13,
            name: "ICP Hub".to_string(),
            region: "Kenya".to_string(),
        },
        IcpHub {
            id: 14,
            name: "ICP Hub".to_string(),
            region: "Korea".to_string(),
        },
        IcpHub {
            id: 15,
            name: "ICP Hub".to_string(),
            region: "Malaysia".to_string(),
        },
        IcpHub {
            id: 16,
            name: "ICP Hub".to_string(),
            region: "Mexico".to_string(),
        },
        IcpHub {
            id: 17,
            name: "ICP Hub".to_string(),
            region: "Nigeria".to_string(),
        },
        IcpHub {
            id: 18,
            name: "ICP Hub".to_string(),
            region: "North America".to_string(),
        },
        IcpHub {
            id: 19,
            name: "ICP Hub".to_string(),
            region: "Philippines".to_string(),

        },
        IcpHub {
            id: 20,
            name: "ICP Hub".to_string(),
            region: "Poland".to_string(),
        },
        IcpHub {
            id: 21,
            name: "ICP Hub".to_string(),
            region: "Portugal".to_string(),
        },
        IcpHub {
            id: 22,
            name: "ICP Hub".to_string(),
            region: "Singapore".to_string(),
        },
        IcpHub {
            id: 23,
            name: "ICP Hub".to_string(),
            region: "South Africa".to_string(),
        },
        IcpHub {
            id: 24,
            name: "ICP Hub".to_string(),
            region: "Thailand".to_string(),
        },
        IcpHub {
            id: 25,
            name: "ICP Hub".to_string(),
            region: "Turkiye".to_string(),
        },
        IcpHub {
            id: 26,
            name: "ICP Hub".to_string(),
            region: "UAE".to_string(),
        },
        IcpHub {
            id: 27,
            name: "ICP Hub".to_string(),
            region: "USA".to_string(),
        },
        IcpHub {
            id: 28,
            name: "ICP Hub".to_string(),
            region: "Vietnam".to_string(),
        },
        IcpHub {
            id: 29,
            name: "ICP Hub".to_string(),
            region: "West Africa".to_string(),
        },
        // Add any other Hubs from the images provided
    ]
}
