pub(crate) use candid::{CandidType, Principal};
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;

use crate::is_admin;

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct AssetManager {
    pub canister_id: Principal,
}

impl Default for AssetManager {
    fn default() -> Self {
        AssetManager {
            canister_id: Principal::anonymous(),
        }
    }
}

thread_local! {
    pub static ASSET_CANISTER_STORAGE : RefCell<AssetManager> = RefCell::new(AssetManager::default());
}

#[update(guard = "is_admin")]
fn set_asset_canister(new_canister_id: Principal) {
    ASSET_CANISTER_STORAGE.with(|asset_manager| {
        asset_manager.borrow_mut().canister_id = new_canister_id;
    });
}

#[query]
pub fn get_asset_canister() -> Principal {
    ASSET_CANISTER_STORAGE.with(|asset_manager| asset_manager.borrow().canister_id.clone())
}
