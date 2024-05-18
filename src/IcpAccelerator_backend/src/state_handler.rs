use crate::admin::*;
use candid::{CandidType, Principal};
use ic_cdk::api::management_canister::main::{
    canister_status, CanisterIdRecord, CanisterStatusResponse, CanisterStatusType,
    DefiniteCanisterSettings,
};
use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    storable::{Blob, Bound, Storable},
    DefaultMemoryImpl, StableBTreeMap, StableCell,
};
use serde::{Deserialize, Serialize};
use std::borrow::Cow;
use std::cell::RefCell;
use std::collections::HashMap;

type VMem = VirtualMemory<DefaultMemoryImpl>;

type AdminNotification = StableBTreeMap<StoredPrincipal, Candid<Vec<Notification>>, VMem>;
const ADMIN_NOTIFICATION_MEMORY_ID: MemoryId = MemoryId::new(0);

type CheckingData = StableBTreeMap<StoredPrincipal, String, VMem>;
const CHECKING_DATA_MEMORY_ID: MemoryId = MemoryId::new(1);

pub struct State {
    pub admin_notifications: AdminNotification,
    pub checking_data: CheckingData,
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static STATE: RefCell<State> = RefCell::new(
        MEMORY_MANAGER.with(|mm| State {
            admin_notifications: AdminNotification::init(mm.borrow().get(ADMIN_NOTIFICATION_MEMORY_ID)),
            checking_data: CheckingData::init(mm.borrow().get(CHECKING_DATA_MEMORY_ID)),



        })
    );
}

pub fn read_state<R>(f: impl FnOnce(&State) -> R) -> R {
    STATE.with(|cell| f(&cell.borrow()))
}

pub fn mutate_state<R>(f: impl FnOnce(&mut State) -> R) -> R {
    STATE.with(|cell| f(&mut cell.borrow_mut()))
}

#[derive(Default)]
pub struct Candid<T>(pub T)
where
    T: CandidType + for<'de> Deserialize<'de>;

impl<T> Candid<T>
where
    T: CandidType + for<'de> Deserialize<'de>,
{
    pub fn to_bytes(&self) -> Cow<'_, [u8]> {
        Cow::Owned(candid::encode_one(&self.0).expect("encoding should always succeed"))
    }

    pub fn from_bytes(bytes: Cow<'_, [u8]>) -> Self {
        Self(candid::decode_one(bytes.as_ref()).expect("decoding should succeed"))
    }
}

impl<T> Storable for Candid<T>
where
    T: CandidType + for<'de> Deserialize<'de>,
{
    const BOUND: Bound = Bound::Unbounded;

    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Self::to_bytes(self)
    }

    fn from_bytes(bytes: Cow<'_, [u8]>) -> Self {
        Self::from_bytes(bytes)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct StoredPrincipal(pub Principal);

impl Storable for StoredPrincipal {
    const BOUND: Bound = Blob::<29>::BOUND;

    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Cow::Owned(
            Blob::<29>::try_from(self.0.as_slice())
                .expect("principal length should not exceed 29 bytes")
                .to_bytes()
                .into_owned(),
        )
    }

    fn from_bytes(bytes: Cow<'_, [u8]>) -> Self {
        Self(Principal::from_slice(
            Blob::<29>::from_bytes(bytes).as_slice(),
        ))
    }
}

#[ic_cdk::query]
pub fn get_notifications_check() -> Vec<Notification> {
    read_state(|state| {
        state
            .admin_notifications
            .iter()
            .map(|(_, notifications)| notifications.0.clone())
            .flatten()
            .collect()
    })
}

#[ic_cdk::update]
pub fn add_data_checking() -> String {
    let principal = ic_cdk::caller();
    let checking_data = "checking data".to_string();
    mutate_state(|state| {
        state
            .checking_data
            .insert(StoredPrincipal(principal), checking_data);
    });
    "Data added".to_string()
}

#[ic_cdk::query]
pub fn get_data_checking() -> String {
    let principal = ic_cdk::caller();
    read_state(|state| {
        state
            .checking_data
            .get(&StoredPrincipal(principal))
            .unwrap_or_default()
            .clone()
    })
}
#[ic_cdk::update]
pub async fn get_canister_status() -> Result<CanisterStatusResponse, String> {
    let canister_id = ic_cdk::api::id();
    canister_status(CanisterIdRecord { canister_id })
        .await
        .map_err(|err| format!("Failed to get status: {:#?}", err))
        .map(|(status,)| status) // Extract `CanisterStatusResponse` from the tuple
}
