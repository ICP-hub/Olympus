use candid::{candid_method, CandidType, Deserialize};
use ic_cdk_macros::{init, post_upgrade, pre_upgrade};
// use ic_cdk::{init, post_upgrade, pre_upgrade};
// use ic_certified_assets::{state_machine::StableState};

#[init]
#[candid_method(init)]
fn init() {
    ic_certified_assets::init();
}

#[pre_upgrade]
fn pre_upgrade() {
    ic_cdk::storage::stable_save((ic_certified_assets::pre_upgrade(),))
        .expect("failed to save stable state");
}

#[post_upgrade]
fn post_upgrade() {
    let (stable_state,): (ic_certified_assets::StableState,) =
        ic_cdk::storage::stable_restore().expect("failed to restore stable state");
    ic_certified_assets::post_upgrade(stable_state);
}

// #[derive(Clone, Debug, Deserialize)]
// struct StableStateStruct {
//     assets: StableState,
// }

// #[init]
// fn init() {
//     ic_certified_assets::init();
// }

// #[pre_upgrade]
// fn pre_upgrade() {
//     let stable_state = StableStateStruct {
//         assets: ic_certified_assets::pre_upgrade(),
//     };
//     ic_cdk::storage::stable_save((stable_state,)).expect("failed to save stable state");
// }

// #[post_upgrade]
// fn post_upgrade(stable_state: StableState) {
//     let (StableStateStruct { assets },): (StableStateStruct,) =
//         ic_cdk::storage::stable_restore().expect("failed to restore stable state");
//     ic_certified_assets::post_upgrade(assets);
// }