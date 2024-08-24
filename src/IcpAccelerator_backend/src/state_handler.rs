use crate::{jobs::job_types::JobsInternal, user_modules::user_types::*};
use crate::vc_module::vc_types::*;
use crate::mentor_module::mentor_types::*;
use crate::project_module::project_types::*;
use crate::cohort_module::cohort_types::*;
use crate::types::ratings_types::*;
use crate::constant_api::manage_hubs::*;
use crate::announcements::ann_types::*;
use crate::types::individual_types::*;
use crate::association_module::investor_offer_to_project::*;
use crate::association_module::project_offer_to_investor::*;
use crate::association_module::notification_to_mentor::*;
use crate::association_module::notification_to_project::*;

use candid::{CandidType, Principal};
use ic_cdk::api::management_canister::main::{
    canister_status, CanisterIdRecord, CanisterStatusResponse,
};
use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    storable::{Blob, Bound, Storable},
    DefaultMemoryImpl, StableBTreeMap, StableCell,
};
use serde::Deserialize;
use std::borrow::Cow;
use std::cell::RefCell;
use std::collections::HashMap;

pub type VMem = VirtualMemory<DefaultMemoryImpl>;

type CheckingData = StableBTreeMap<StoredPrincipal, String, VMem>;
const CHECKING_DATA_MEMORY_ID: MemoryId = MemoryId::new(1);

type UserStorage = StableBTreeMap<StoredPrincipal, Candid<UserInfoInternal>, VMem>;
const USER_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(2);

//association-vc
type ProjectAssociatedWithVc =
    StableBTreeMap<StoredPrincipal, Candid<Vec<ProjectInfoInternal>>, VMem>;
const PROJECTS_ASSOCIATED_WITH_VC_MEMORY_ID: MemoryId = MemoryId::new(3);


type RoleStatus = StableBTreeMap<StoredPrincipal, Candid<Vec<Role>>, VMem>;
const ROLE_STATUS_MEMORY_ID: MemoryId = MemoryId::new(4);

// cohort_rating type definitions

pub type CohortRatings = StableBTreeMap<String, Candid<CohortProjectRatings>, VMem>;
pub type AverageRatingStorage = StableBTreeMap<String, Candid<HashMap<String, f64>>, VMem>;

const COHORT_RATINGS_MEMORY_ID: MemoryId = MemoryId::new(5);
const AVERAGE_RATINGS_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(6);
type UserTestimonial = StableBTreeMap<StoredPrincipal, Candid<Vec<Testimonial>>, VMem>;
const USER_TESTIMONIAL_MEMORY_ID: MemoryId = MemoryId::new(7);

type UserRating = StableBTreeMap<StoredPrincipal, Candid<Vec<Review>>, VMem>;
const USER_RATING_MEMORY_ID: MemoryId = MemoryId::new(8);

type MentorRegistry = StableBTreeMap<StoredPrincipal, Candid<MentorInternal>, VMem>;
const MENTOR_REGISTRY_MEMORY_ID: MemoryId = MemoryId::new(9);

//investor_offer_to_investor
pub type OffersSentByInvestor =
StableBTreeMap<StoredPrincipal, Candid<Vec<OfferToProjectByInvestor>>, VMem>;
const OFFERS_SENT_BY_INVESTOR_MEMORY_ID: MemoryId = MemoryId::new(10);

pub type ProjectAlertsOfInvestor =
StableBTreeMap<String, Candid<Vec<OfferToSendToProjectByInvestor>>, VMem>;
const PROJECT_ALERTS_OF_INVESTOR_MEMORY_ID: MemoryId = MemoryId::new(11);

type MentorAnnouncement = StableBTreeMap<StoredPrincipal, Candid<Vec<MAnnouncements>>, VMem>;
const MENTOR_ANNOUNCEMENTS_MEMORY_ID: MemoryId = MemoryId::new(12);

type VentureCapitalistStorage =
StableBTreeMap<StoredPrincipal, Candid<VentureCapitalistInternal>, VMem>;
const VENTURE_CAPITALIST_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(13);

//mentor_investor_ratings

pub type IndividualRatings =
StableBTreeMap<StoredPrincipal, Candid<Vec<TimestampedRatingMentorInvestor>>, VMem>;
pub type MentorVcAverageRatingStorage = StableBTreeMap<StoredPrincipal, f64, VMem>;

const MENTOR_INDIVIDUAL_RATINGS_MEMORY_ID: MemoryId = MemoryId::new(14);
const VC_INDIVIDUAL_RATINGS_MEMORY_ID: MemoryId = MemoryId::new(15);
const MENTOR_AVERAGE_RATING_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(16);
const VC_AVERAGE_RATING_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(17);

type VentureCapitalistDeclinedRequest =
StableBTreeMap<StoredPrincipal, Candid<VentureCapitalistInternal>, VMem>;
const VENTURE_CAPITALIST_DECLINED_REQUEST_MEMORY_ID: MemoryId = MemoryId::new(18);

type VentureCapitalistAnnouncement =
StableBTreeMap<StoredPrincipal, Candid<Vec<VAnnouncements>>, VMem>;
const VC_ANNOUNCEMENTS_MEMORY_ID: MemoryId = MemoryId::new(19);

//project offer to investor

pub type OffersOfferedByMe = StableBTreeMap<String, Candid<Vec<OfferToInvestor>>, VMem>;
pub type InvestorAlerts = StableBTreeMap<StoredPrincipal, Candid<Vec<OfferToSendToInvestor>>, VMem>;

const OFFERS_OFFERED_BY_ME_MEMORY_ID: MemoryId = MemoryId::new(20);
const INVESTOR_ALERTS_MEMORY_ID: MemoryId = MemoryId::new(21);
type ProjectAccessNotification = StableBTreeMap<String, Candid<Vec<ProjectNotification>>, VMem>;
const PROJECT_ACCESS_NOTIFICATIONS_MEMORY_ID: MemoryId = MemoryId::new(22);

type ProjectStorage = StableBTreeMap<StoredPrincipal, Candid<Vec<ProjectInfoInternal>>, VMem>;
const PROJECT_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(23);


//rating.rs module

const RATING_SYSTEM_MEMORY_ID: MemoryId = MemoryId::new(24);
const LAST_RATING_TIMESTAMPS_MEMORY_ID: MemoryId = MemoryId::new(25);
const AVERAGE_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(26);


type ProjectAnnouncement =
StableBTreeMap<StoredPrincipal, Candid<Vec<AnnouncementsInternal>>, VMem>;
const PROJECT_ANNOUNCEMENT_MEMORY_ID: MemoryId = MemoryId::new(27);


//notification to mentor

pub type MySentNotifications = StableBTreeMap<StoredPrincipal, Candid<Vec<OfferToMentor>>, VMem>;
pub type MentorAlerts = StableBTreeMap<StoredPrincipal, Candid<Vec<OfferToSendToMentor>>, VMem>;

const MY_SENT_NOTIFICATIONS_MEMORY_ID: MemoryId = MemoryId::new(28);
const MENTOR_ALERTS_MEMORY_ID: MemoryId = MemoryId::new(29);

//notification to project

pub type MySentNotificationsProject =
StableBTreeMap<StoredPrincipal, Candid<Vec<OfferToProject>>, VMem>;
pub type ProjectAlerts = StableBTreeMap<String, Candid<Vec<OfferToSendToProject>>, VMem>;
const MY_SENT_NOTIFICATIONS_PROJECT_MEMORY_ID: MemoryId = MemoryId::new(30);
const PROJECT_ALERTS_MEMORY_ID: MemoryId = MemoryId::new(31);
type ProjectAwaitsResponse = StableBTreeMap<StoredPrincipal, Candid<ProjectInfoInternal>, VMem>;
const PROJECT_AWAITS_RESPONSE_MEMORY_ID: MemoryId = MemoryId::new(32);

type PostJob = StableBTreeMap<StoredPrincipal, Candid<Vec<JobsInternal>>, VMem>;
const POST_JOB_MEMORY_ID: MemoryId = MemoryId::new(33);


type MoneyAccess = StableBTreeMap<String, Candid<Vec<Principal>>, VMem>;
const MONEY_ACCESS_MEMORY_ID: MemoryId = MemoryId::new(34);

//admin.rs

type PrivateDocsAccess = StableBTreeMap<String, Candid<Vec<Principal>>, VMem>;
const PRIVATE_DOCS_ACCESS_MEMORY_ID: MemoryId = MemoryId::new(35);

type ProjectRating = StableBTreeMap<String, Candid<Vec<(Principal, ProjectReview)>>, VMem>;
const PROJECT_RATING_MEMORY_ID: MemoryId = MemoryId::new(36);

type MoneyAccessRequest = StableBTreeMap<StoredPrincipal, Candid<Vec<AccessRequest>>, VMem>;
const MONEY_ACCESS_REQUEST_MEMORY_ID: MemoryId = MemoryId::new(37);

type PrivateDocsAccessRequest = StableBTreeMap<StoredPrincipal, Candid<Vec<AccessRequest>>, VMem>;
const PRIVATE_DOCS_ACCESS_REQUEST_MEMORY_ID: MemoryId = MemoryId::new(38);

type ProjectAssociatedWithMentor =
    StableBTreeMap<StoredPrincipal, Candid<Vec<ProjectInfoInternal>>, VMem>;
const PROJECTS_ASSOCIATED_WITH_MENTOR_MEMORY_ID: MemoryId = MemoryId::new(39);


pub type CohortInfo = StableBTreeMap<String, Candid<CohortDetails>, VMem>;
const COHORT_MEMORY_ID: MemoryId = MemoryId::new(40);

pub type ProjectsAppliedForCohort = StableBTreeMap<String, Candid<Vec<(ProjectInfoInternal, UserInformation)>>, VMem>;
const PROJECTS_APPLIED_FOR_COHORT_MEMORY_ID: MemoryId = MemoryId::new(41);

pub type ApplierCount = StableBTreeMap<String, u64, VMem>;
const APPLIER_COUNT_MEMORY_ID: MemoryId = MemoryId::new(42);

pub type CapitalistAppliedForCohort =
StableBTreeMap<String, Candid<Vec<(VentureCapitalistInternal, UserInformation)>>, VMem>;
const CAPITALIST_APPLIED_FOR_COHORT_MEMORY_ID: MemoryId = MemoryId::new(43);

pub type CohortEnrollmentRequests =
StableBTreeMap<StoredPrincipal, Candid<Vec<CohortEnrollmentRequest>>, VMem>;
const COHORT_ENROLLMENT_REQUESTS_MEMORY_ID: MemoryId = MemoryId::new(44);

pub type MentorsRemovedFromCohort =
    StableBTreeMap<String, Candid<Vec<(Principal, MentorInternal, UserInformation)>>, VMem>;
const MENTOR_REMOVED_FROM_COHORT_MEMORY_ID: MemoryId = MemoryId::new(45);

pub type MentorsInviteRequest = StableBTreeMap<String, Candid<InviteRequest>, VMem>;
const PENDING_MENTOR_CONFIRMATION_TO_REJOIN_MEMORY_ID: MemoryId = MemoryId::new(46);


pub type AssetManager = StableCell<StoredPrincipal, VMem>;
const ASSET_CANISTER_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(47);

pub type HubsData = StableBTreeMap<StoredPrincipal, Candid<IcpHubDetails>, VMem>;
const HUBS_DATA_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(48);

pub type MentorsAppliedForCohort = StableBTreeMap<String, Candid<Vec<(MentorInternal, UserInformation)>>, VMem>;
const MENTORS_APPLIED_FOR_COHORT_MEMORY_ID: MemoryId = MemoryId::new(49);

type RateLimitMap = StableBTreeMap<StoredPrincipal, (u64, u64), VMem>; // (last_request_time, request_count)
const RATE_LIMIT_MEMORY_ID: MemoryId = MemoryId::new(50);

type CaptchaStorage = StableBTreeMap<String, Candid<String>, VMem>; // Stores CAPTCHA ID and Text
const CAPTCHA_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(51);

pub struct State {
    pub rate_limiting: RateLimitMap,
    pub captcha_storage: CaptchaStorage,
    pub checking_data: CheckingData,
    pub projects_associated_with_mentor: ProjectAssociatedWithMentor,
    pub projects_associated_with_vc: ProjectAssociatedWithVc,
    pub cohort_rating_system: CohortRatings,
    pub cohort_average_ratings: AverageRatingStorage,
    pub offers_sent_by_investor: OffersSentByInvestor,
    pub project_alerts_of_investor: ProjectAlertsOfInvestor,
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
    pub user_storage: UserStorage,
    pub role_status: RoleStatus,
    pub user_testimonial: UserTestimonial,
    pub user_rating: UserRating,
    pub mentor_storage: MentorRegistry,
    pub mentor_announcement: MentorAnnouncement,
    pub vc_storage: VentureCapitalistStorage,
    pub vc_declined_request: VentureCapitalistDeclinedRequest,
    pub vc_announcement: VentureCapitalistAnnouncement,
    pub project_access_notifications: ProjectAccessNotification,
    pub project_storage: ProjectStorage,
    pub project_announcement: ProjectAnnouncement,
    pub project_awaits_response: ProjectAwaitsResponse,
    pub post_job: PostJob,
    pub money_access: MoneyAccess,
    pub private_docs_access: PrivateDocsAccess,
    pub project_rating: ProjectRating,
    pub money_access_request: MoneyAccessRequest,
    pub private_docs_access_request: PrivateDocsAccessRequest,

    pub cohort_info: CohortInfo,
    pub project_applied_for_cohort: ProjectsAppliedForCohort,
    pub applier_count: ApplierCount,
    pub vc_applied_for_cohort: CapitalistAppliedForCohort,
    pub mentor_applied_for_cohort: MentorsAppliedForCohort,
    pub cohort_enrollment_request: CohortEnrollmentRequests,
    pub mentor_removed_from_cohort: MentorsRemovedFromCohort,
    pub mentor_invite_request: MentorsInviteRequest,
    pub asset_canister_storage: AssetManager,
    pub hubs_data: HubsData,
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static STATE: RefCell<State> = RefCell::new(
        MEMORY_MANAGER.with(|mm| State {
            captcha_storage: CaptchaStorage::init(mm.borrow().get(CAPTCHA_STORAGE_MEMORY_ID)),
            rate_limiting: RateLimitMap::init(mm.borrow().get(RATE_LIMIT_MEMORY_ID)),
            checking_data: CheckingData::init(mm.borrow().get(CHECKING_DATA_MEMORY_ID)),
            projects_associated_with_mentor:ProjectAssociatedWithMentor::init(mm.borrow().get(PROJECTS_ASSOCIATED_WITH_MENTOR_MEMORY_ID)),
            projects_associated_with_vc:ProjectAssociatedWithVc::init(mm.borrow().get(PROJECTS_ASSOCIATED_WITH_VC_MEMORY_ID)),
            cohort_rating_system : CohortRatings::init(mm.borrow().get(COHORT_RATINGS_MEMORY_ID)),
            cohort_average_ratings: AverageRatingStorage::init(mm.borrow().get(AVERAGE_RATINGS_STORAGE_MEMORY_ID)),
            offers_sent_by_investor: OffersSentByInvestor::init(mm.borrow().get(OFFERS_SENT_BY_INVESTOR_MEMORY_ID)),
            project_alerts_of_investor:ProjectAlertsOfInvestor::init(mm.borrow().get(PROJECT_ALERTS_OF_INVESTOR_MEMORY_ID)),
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
            asset_canister_storage: AssetManager::init(
                mm.borrow().get(ASSET_CANISTER_STORAGE_MEMORY_ID),
                StoredPrincipal(Principal::anonymous())
            ).expect("Failed to initialize AssetManager storage"),





            user_storage: UserStorage::init(mm.borrow().get(USER_STORAGE_MEMORY_ID)),
            role_status: RoleStatus::init(mm.borrow().get(ROLE_STATUS_MEMORY_ID)),
            user_testimonial: UserTestimonial::init(mm.borrow().get(USER_TESTIMONIAL_MEMORY_ID)),
            user_rating: UserRating::init(mm.borrow().get(USER_RATING_MEMORY_ID)),
            mentor_storage: MentorRegistry::init(mm.borrow().get(MENTOR_REGISTRY_MEMORY_ID)),
            mentor_announcement: MentorAnnouncement::init(mm.borrow().get(MENTOR_ANNOUNCEMENTS_MEMORY_ID)),
            vc_storage: VentureCapitalistStorage::init(mm.borrow().get(VENTURE_CAPITALIST_STORAGE_MEMORY_ID)),
            vc_declined_request: VentureCapitalistDeclinedRequest::init(mm.borrow().get(VENTURE_CAPITALIST_DECLINED_REQUEST_MEMORY_ID)),
            vc_announcement: VentureCapitalistAnnouncement::init(mm.borrow().get(VC_ANNOUNCEMENTS_MEMORY_ID)),
            project_access_notifications: ProjectAccessNotification::init(mm.borrow().get(PROJECT_ACCESS_NOTIFICATIONS_MEMORY_ID)),
            project_storage: ProjectStorage::init(mm.borrow().get(PROJECT_STORAGE_MEMORY_ID)),
            project_announcement: ProjectAnnouncement::init(mm.borrow().get(PROJECT_ANNOUNCEMENT_MEMORY_ID)),
            project_awaits_response: ProjectAwaitsResponse::init(mm.borrow().get(PROJECT_AWAITS_RESPONSE_MEMORY_ID)),
            post_job: PostJob::init(mm.borrow().get(POST_JOB_MEMORY_ID)),
            money_access: MoneyAccess::init(mm.borrow().get(MONEY_ACCESS_MEMORY_ID)),
            private_docs_access: PrivateDocsAccess::init(mm.borrow().get(PRIVATE_DOCS_ACCESS_MEMORY_ID)),
            project_rating: ProjectRating::init(mm.borrow().get(PROJECT_RATING_MEMORY_ID)),
            money_access_request: MoneyAccessRequest::init(mm.borrow().get(MONEY_ACCESS_REQUEST_MEMORY_ID)),
            private_docs_access_request: PrivateDocsAccessRequest::init(mm.borrow().get(PRIVATE_DOCS_ACCESS_REQUEST_MEMORY_ID)),

            cohort_info: CohortInfo::init(mm.borrow().get(COHORT_MEMORY_ID)),
            project_applied_for_cohort: ProjectsAppliedForCohort::init(mm.borrow().get(PROJECTS_APPLIED_FOR_COHORT_MEMORY_ID)),
            applier_count: ApplierCount::init(mm.borrow().get(APPLIER_COUNT_MEMORY_ID)),
            vc_applied_for_cohort:CapitalistAppliedForCohort::init(mm.borrow().get(CAPITALIST_APPLIED_FOR_COHORT_MEMORY_ID)),
            mentor_applied_for_cohort: MentorsAppliedForCohort::init(mm.borrow().get(MENTORS_APPLIED_FOR_COHORT_MEMORY_ID)),
            cohort_enrollment_request: CohortEnrollmentRequests::init(mm.borrow().get(COHORT_ENROLLMENT_REQUESTS_MEMORY_ID)),
            mentor_removed_from_cohort: MentorsRemovedFromCohort::init(mm.borrow().get(MENTOR_REMOVED_FROM_COHORT_MEMORY_ID)),
            mentor_invite_request: MentorsInviteRequest::init(mm.borrow().get(PENDING_MENTOR_CONFIRMATION_TO_REJOIN_MEMORY_ID)),
            hubs_data: HubsData::init(mm.borrow().get(HUBS_DATA_STORAGE_MEMORY_ID)),
        })
    );
}

pub fn read_state<R>(f: impl FnOnce(&State) -> R) -> R {
    STATE.with(|cell| f(&cell.borrow()))
}

pub fn mutate_state<R>(f: impl FnOnce(&mut State) -> R) -> R {
    STATE.with(|cell| f(&mut cell.borrow_mut()))
}

#[derive(Default, Clone, Debug)]
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

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, CandidType)]
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
