use crate::admin::*;
use crate::cohort_rating::*;

use crate::investor_offer_to_project::*;
use crate::mentor_investor_ratings::*;
use crate::ProjectInfoInternal;
use candid::{CandidType, Principal};
use ic_cdk::api::management_canister::main::{
    canister_status, CanisterIdRecord, CanisterStatusResponse, CanisterStatusType,
    DefiniteCanisterSettings,
};
use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    storable::{Blob, Bound, Storable},
    DefaultMemoryImpl, StableBTreeMap, StableCell, StableVec,
};
use serde::{Deserialize, Serialize};
use std::borrow::Cow;
use std::cell::RefCell;
use std::collections::HashMap;

use crate::project_offer_to_investor::*;

use crate::notification_to_mentor::*;
use crate::ratings::*;

use crate::notification_to_project::*;

pub type VMem = VirtualMemory<DefaultMemoryImpl>;

type AdminNotification = StableBTreeMap<StoredPrincipal, Candid<Vec<Notification>>, VMem>;
const ADMIN_NOTIFICATION_MEMORY_ID: MemoryId = MemoryId::new(0);

type CheckingData = StableBTreeMap<StoredPrincipal, String, VMem>;
const CHECKING_DATA_MEMORY_ID: MemoryId = MemoryId::new(1);

//association-mentor
type ProjectAssociatedWithMentor =
    StableBTreeMap<StoredPrincipal, Candid<Vec<ProjectInfoInternal>>, VMem>;
const PROJECTS_ASSOCIATED_WITH_MENTOR_MEMORY_ID: MemoryId = MemoryId::new(2);

//association-vc
type ProjectAssociatedWithVc =
    StableBTreeMap<StoredPrincipal, Candid<Vec<ProjectInfoInternal>>, VMem>;
const PROJECTS_ASSOCIATED_WITH_VC_MEMORY_ID: MemoryId = MemoryId::new(2);

// cohort_rating type definitions

pub type CohortRatings = StableBTreeMap<String, Candid<CohortProjectRatings>, VMem>;
pub type AverageRatingStorage = StableBTreeMap<String, Candid<HashMap<String, f64>>, VMem>;

const COHORT_RATINGS_MEMORY_ID: MemoryId = MemoryId::new(3);
const AVERAGE_RATINGS_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(4);

//investor_offer_to_investor
pub type OffersSentByInvestor =
    StableBTreeMap<StoredPrincipal, Candid<Vec<OfferToProjectByInvestor>>, VMem>;

pub type ProjectAlertsOfInvestor =
    StableBTreeMap<String, Candid<Vec<OfferToSendToProjectByInvestor>>, VMem>;

const OFFERS_SENT_BY_INVESTOR_MEMORY_ID: MemoryId = MemoryId::new(5);
const PROJECT_ALERTS_OF_INVESTOR_MEMORY_ID: MemoryId = MemoryId::new(6);

//latest popular project
pub type LiveProjects = StableVec<Candid<ProjectInfoInternal>, VMem>;
pub type IncubatedProjects = StableVec<Candid<ProjectInfoInternal>, VMem>;

pub const LIVE_PROJECTS_MEMORY_ID: MemoryId = MemoryId::new(7);
pub const INCUBATED_PROJECTS_MEMORY_ID: MemoryId = MemoryId::new(8);

//mentor_investor_ratings

pub type IndividualRatings =
    StableBTreeMap<StoredPrincipal, Candid<Vec<TimestampedRatingMentorInvestor>>, VMem>;
pub type MentorVcAverageRatingStorage = StableBTreeMap<StoredPrincipal, f64, VMem>;

const MENTOR_INDIVIDUAL_RATINGS_MEMORY_ID: MemoryId = MemoryId::new(9);
const VC_INDIVIDUAL_RATINGS_MEMORY_ID: MemoryId = MemoryId::new(10);
const MENTOR_AVERAGE_RATING_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(11);
const VC_AVERAGE_RATING_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(12);

//project offer to investor

pub type OffersOfferedByMe = StableBTreeMap<String, Candid<Vec<OfferToInvestor>>, VMem>;
pub type InvestorAlerts = StableBTreeMap<StoredPrincipal, Candid<Vec<OfferToSendToInvestor>>, VMem>;

const OFFERS_OFFERED_BY_ME_MEMORY_ID: MemoryId = MemoryId::new(13);
const INVESTOR_ALERTS_MEMORY_ID: MemoryId = MemoryId::new(14);

//rating.rs module

const RATING_SYSTEM_MEMORY_ID: MemoryId = MemoryId::new(15);
const LAST_RATING_TIMESTAMPS_MEMORY_ID: MemoryId = MemoryId::new(16);
const AVERAGE_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(17);

//notification to mentor

pub type MySentNotifications = StableBTreeMap<StoredPrincipal, Candid<Vec<OfferToMentor>>, VMem>;
pub type MentorAlerts = StableBTreeMap<StoredPrincipal, Candid<Vec<OfferToSendToMentor>>, VMem>;

const MY_SENT_NOTIFICATIONS_MEMORY_ID: MemoryId = MemoryId::new(18);
const MENTOR_ALERTS_MEMORY_ID: MemoryId = MemoryId::new(19);

//notification to project

pub type MySentNotificationsProject =
    StableBTreeMap<StoredPrincipal, Candid<Vec<OfferToProject>>, VMem>;
pub type ProjectAlerts = StableBTreeMap<String, Candid<Vec<OfferToSendToProject>>, VMem>;
const MY_SENT_NOTIFICATIONS_PROJECT_MEMORY_ID: MemoryId = MemoryId::new(20);
const PROJECT_ALERTS_MEMORY_ID: MemoryId = MemoryId::new(21);
pub struct State {
    pub admin_notifications: AdminNotification,
    pub checking_data: CheckingData,
    pub projects_associated_with_mentor: ProjectAssociatedWithMentor,
    pub projects_associated_with_vc: ProjectAssociatedWithVc,
    pub cohort_rating_system: CohortRatings,
    pub cohort_average_ratings: AverageRatingStorage,
    pub offers_sent_by_investor: OffersSentByInvestor,
    pub project_alerts_of_investor: ProjectAlertsOfInvestor,
    pub live_projects: LiveProjects,
    pub incubated_projects: IncubatedProjects,
    pub mentor_rating_system: IndividualRatings,
    pub vc_rating_system: IndividualRatings,
    pub mentor_average_rating: MentorVcAverageRatingStorage,
    pub vc_average_rating: MentorVcAverageRatingStorage,
    pub offers_offered_by_me: OffersOfferedByMe,
    pub investor_alerts: InvestorAlerts,
    pub rating_system: RatingSystem,
    pub last_rating_timestamps: LastRatingTimestamps,
    pub average_storage: RatingAverageStorage,
    pub my_sent_notifications: MySentNotifications,
    pub mentor_alerts: MentorAlerts,
    pub my_sent_notifications_project: MySentNotificationsProject,
    pub project_alerts: ProjectAlerts,
}

thread_local! {
    pub static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    pub static STATE: RefCell<State> = RefCell::new(
        MEMORY_MANAGER.with(|mm| State {
            admin_notifications: AdminNotification::init(mm.borrow().get(ADMIN_NOTIFICATION_MEMORY_ID)),
            checking_data: CheckingData::init(mm.borrow().get(CHECKING_DATA_MEMORY_ID)),
            projects_associated_with_mentor:ProjectAssociatedWithMentor::init(mm.borrow().get(PROJECTS_ASSOCIATED_WITH_MENTOR_MEMORY_ID)),
            projects_associated_with_vc:ProjectAssociatedWithVc::init(mm.borrow().get(PROJECTS_ASSOCIATED_WITH_VC_MEMORY_ID)),
            cohort_rating_system : CohortRatings::init(mm.borrow().get(COHORT_RATINGS_MEMORY_ID)),
            cohort_average_ratings: AverageRatingStorage::init(mm.borrow().get(AVERAGE_RATINGS_STORAGE_MEMORY_ID)),
            offers_sent_by_investor: OffersSentByInvestor::init(mm.borrow().get(OFFERS_SENT_BY_INVESTOR_MEMORY_ID)),
            project_alerts_of_investor:ProjectAlertsOfInvestor::init(mm.borrow().get(PROJECT_ALERTS_OF_INVESTOR_MEMORY_ID)),
            live_projects: LiveProjects::init(mm.borrow().get(LIVE_PROJECTS_MEMORY_ID)).expect("Failed to initialize live projects"),
            incubated_projects: IncubatedProjects::init(mm.borrow().get(INCUBATED_PROJECTS_MEMORY_ID)).expect("Failed to initialize incubated projects"),
            mentor_rating_system: IndividualRatings::init(mm.borrow().get(MENTOR_INDIVIDUAL_RATINGS_MEMORY_ID)),
            vc_rating_system:IndividualRatings::init(mm.borrow().get(VC_INDIVIDUAL_RATINGS_MEMORY_ID)),
            mentor_average_rating:MentorVcAverageRatingStorage::init(mm.borrow().get(MENTOR_AVERAGE_RATING_STORAGE_MEMORY_ID)),
            vc_average_rating:MentorVcAverageRatingStorage::init(mm.borrow().get(VC_AVERAGE_RATING_STORAGE_MEMORY_ID)),
            offers_offered_by_me:OffersOfferedByMe::init(mm.borrow().get(OFFERS_OFFERED_BY_ME_MEMORY_ID)),
            investor_alerts: InvestorAlerts::init(mm.borrow().get(INVESTOR_ALERTS_MEMORY_ID)),
            rating_system:RatingSystem::init(mm.borrow().get(RATING_SYSTEM_MEMORY_ID)),
            last_rating_timestamps:LastRatingTimestamps::init(mm.borrow().get(LAST_RATING_TIMESTAMPS_MEMORY_ID)),
            average_storage:RatingAverageStorage::init(mm.borrow().get(AVERAGE_STORAGE_MEMORY_ID)),
            my_sent_notifications:MySentNotifications::init(mm.borrow().get(MY_SENT_NOTIFICATIONS_MEMORY_ID)),
            mentor_alerts:MentorAlerts::init(mm.borrow().get(MENTOR_ALERTS_MEMORY_ID)),
            my_sent_notifications_project:MySentNotificationsProject::init(mm.borrow().get(MY_SENT_NOTIFICATIONS_PROJECT_MEMORY_ID)),
            project_alerts:ProjectAlerts::init(mm.borrow().get(PROJECT_ALERTS_MEMORY_ID)),





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
