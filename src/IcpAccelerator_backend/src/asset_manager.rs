
use crate::is_admin;
use crate::state_handler::*;
pub(crate) use candid::{CandidType, Principal};
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;

#[update(guard = "is_admin")]
fn set_asset_canister(new_canister_id: Principal) {
    mutate_state(|state| {
        let asset_manager = &mut state.asset_canister_storage;
        asset_manager
            .set(StoredPrincipal(new_canister_id))
            .expect("Failed to set new canister ID");
    })
}

#[query]
pub fn get_asset_canister() -> Principal {
    read_state(|state| {
        let asset_manager = &state.asset_canister_storage;
        asset_manager.get().0
    })
}