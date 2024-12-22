use ic_cdk_macros::*;
use crate::state_handler;
use crate::types::individual_types::*;
use serde::{Deserialize, Serialize};
use candid::{CandidType, Principal};
use serde_bytes::ByteBuf;
use crate::state_handler::*;
use ic_cdk::api::caller;
use ic_cdk::api::call::call;

#[derive(Serialize, Deserialize, Debug, CandidType)]
pub struct IcpHub {
    pub id: i32,
    pub name: String,
    pub region: String,
}
#[derive(Serialize, Deserialize, Debug, CandidType,Clone)]
pub struct Sociallinks{
    pub links: Option<String>
}
#[derive(Serialize, Deserialize, Debug, CandidType, Clone)]
pub struct IcpHubDetails{
    pub name: Option<String>,
    pub flag: Option<Vec<u8>>,
    pub links: Option<Vec<Sociallinks>>,
    pub description: Option<String>,
    pub website: Option<String>
}

pub async fn add_hubs_images(_caller: Principal, mut data: IcpHubDetails)->IcpHubDetails{
    let hub_flag = data.flag.clone();
    let canister_id = crate::asset_manager::get_asset_canister();
    let name = data.name.clone().unwrap();

    if hub_flag.is_none(){
        let full_url = canister_id.to_string() + "/uploads/default_hub_logo.jpeg";
        data.flag = Some((full_url).as_bytes().to_vec());
    }else if hub_flag.clone().unwrap().len() < 300 {
        ic_cdk::println!("Project logo is already uploaded");
    }else {
        let hub_logo_key = "/uploads/".to_owned() + &name + "_hub_logo.jpeg";

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
    ic_cdk::println!("Done with Image Upload {:?}", data.clone());

    data

}

#[update]
pub async fn add_icp_hub_details(data: IcpHubDetails) -> String {
    let caller = caller();

    let data_to_store = add_hubs_images(caller, data).await; 

    let key = ic_cdk::api::time();

    mutate_state(|state| {
        if let Some(mut existing_data) = state.hubs_data.get(&key) {
            ic_cdk::println!("Inside Pushing Logic");
            existing_data.0.push(data_to_store);  
        } else {
            ic_cdk::println!("Inside Inserting Logic");
            state.hubs_data.insert(key, state_handler::Candid(vec![data_to_store]));
        }
    });

    // Return success message
    "ICP Hub details added successfully.".to_string()
}




#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct ListAllIcpHubs {
    params: Vec<IcpHubDetails>, 
}

#[query]
pub fn get_icp_hub_details() -> Vec<ListAllIcpHubs> {
    let hubs_snapshot = read_state(|state| {
        state.hubs_data.iter().map(|(principal, details)| {
            (principal.clone(), details.0.clone()) 
        }).collect::<Vec<_>>()
    });

    let mut list_all_hubs: Vec<ListAllIcpHubs> = Vec::new();

    for (_stored_principal, hub_details_vec) in hubs_snapshot {
        let hub_struct = ListAllIcpHubs {
            params: hub_details_vec,       
        };
        list_all_hubs.push(hub_struct);
    }

    list_all_hubs
}


