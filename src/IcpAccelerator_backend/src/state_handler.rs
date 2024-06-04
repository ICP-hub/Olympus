use crate::admin::*;
use crate::cohort_rating::*;
use crate::vc_registration::Announcements;
use crate::{admin::*, mentor::*, project_registration::*, user_module::*, vc_registration::*};
use candid::{CandidType, Principal};
use ic_cdk::api::management_canister::main::{
    canister_status, CanisterIdRecord, CanisterStatusResponse, CanisterStatusType,
    DefiniteCanisterSettings,
};
use ic_stable_structures::StableVec;
use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    storable::{Blob, Bound, Storable},
    DefaultMemoryImpl, Memory, StableBTreeMap, StableCell,
};
use serde::{Deserialize, Serialize};
use std::borrow::Cow;
use std::cell::RefCell;
use std::collections::HashMap;

use crate::cohort::*;
use crate::investor_offer_to_project::*;
use crate::mentor_investor_ratings::*;
use crate::notification_to_mentor::*;
use crate::project_offer_to_investor::*;
use crate::ratings::*;

use crate::admin::*;
use crate::notification_to_project::*;

pub type VMem = VirtualMemory<DefaultMemoryImpl>;

type AdminNotification = StableBTreeMap<StoredPrincipal, Candid<Vec<Notification>>, VMem>;
const ADMIN_NOTIFICATION_MEMORY_ID: MemoryId = MemoryId::new(0);

type CheckingData = StableBTreeMap<StoredPrincipal, String, VMem>;
const CHECKING_DATA_MEMORY_ID: MemoryId = MemoryId::new(1);

type UserStorage = StableBTreeMap<StoredPrincipal, Candid<UserInfoInternal>, VMem>;
const USER_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(2);

//association-vc
type ProjectAssociatedWithVc =
    StableBTreeMap<StoredPrincipal, Candid<Vec<ProjectInfoInternal>>, VMem>;
const PROJECTS_ASSOCIATED_WITH_VC_MEMORY_ID: MemoryId = MemoryId::new(3);

type ProjectAssociatedWithMentor =
    StableBTreeMap<StoredPrincipal, Candid<Vec<ProjectInfoInternal>>, VMem>;
const PROJECTS_ASSOCIATED_WITH_MENTOR_MEMORY_ID: MemoryId = MemoryId::new(59);

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

pub type ProjectAlertsOfInvestor =
    StableBTreeMap<String, Candid<Vec<OfferToSendToProjectByInvestor>>, VMem>;

const OFFERS_SENT_BY_INVESTOR_MEMORY_ID: MemoryId = MemoryId::new(10);
const PROJECT_ALERTS_OF_INVESTOR_MEMORY_ID: MemoryId = MemoryId::new(11);
type MentorAwaitsResponse = StableBTreeMap<StoredPrincipal, Candid<MentorInternal>, VMem>;
const MENTOR_AWAITS_RESPONSE_MEMORY_ID: MemoryId = MemoryId::new(12);

type MentorDeclinedRequest = StableBTreeMap<StoredPrincipal, Candid<MentorInternal>, VMem>;
const MENTOR_DECLINED_REQUEST_MEMORY_ID: MemoryId = MemoryId::new(13);

type MentorProfileEditAwaits = StableBTreeMap<StoredPrincipal, Candid<MentorUpdateRequest>, VMem>;
const MENTOR_PROFILE_EDIT_AWAITS_MEMORY_ID: MemoryId = MemoryId::new(14);

//latest popular project
pub type LiveProjects = StableBTreeMap<String, Candid<ProjectInfoInternal>, VMem>;
pub type IncubatedProjects = StableBTreeMap<String, Candid<ProjectInfoInternal>, VMem>;

pub const LIVE_PROJECTS_MEMORY_ID: MemoryId = MemoryId::new(15);
pub const INCUBATED_PROJECTS_MEMORY_ID: MemoryId = MemoryId::new(16);
type MentorProfileEditDeclined = StableBTreeMap<StoredPrincipal, Candid<MentorUpdateRequest>, VMem>;
const MENTOR_PROFILE_EDIT_DECLINED_MEMORY_ID: MemoryId = MemoryId::new(17);

type MentorAnnouncement = StableBTreeMap<StoredPrincipal, Candid<Vec<MAnnouncements>>, VMem>;
const MENTOR_ANNOUNCEMENTS_MEMORY_ID: MemoryId = MemoryId::new(18);

type VentureCapitalistStorage =
    StableBTreeMap<StoredPrincipal, Candid<VentureCapitalistInternal>, VMem>;
const VENTURE_CAPITALIST_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(19);

//mentor_investor_ratings

pub type IndividualRatings =
    StableBTreeMap<StoredPrincipal, Candid<Vec<TimestampedRatingMentorInvestor>>, VMem>;
pub type MentorVcAverageRatingStorage = StableBTreeMap<StoredPrincipal, f64, VMem>;

const MENTOR_INDIVIDUAL_RATINGS_MEMORY_ID: MemoryId = MemoryId::new(20);
const VC_INDIVIDUAL_RATINGS_MEMORY_ID: MemoryId = MemoryId::new(21);
const MENTOR_AVERAGE_RATING_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(22);
const VC_AVERAGE_RATING_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(23);
type VentureCapitalistAwaitsResponse =
    StableBTreeMap<StoredPrincipal, Candid<VentureCapitalistInternal>, VMem>;
const VENTURE_CAPITALIST_AWAIT_RESPONSE_MEMORY_ID: MemoryId = MemoryId::new(24);

type VentureCapitalistDeclinedRequest =
    StableBTreeMap<StoredPrincipal, Candid<VentureCapitalistInternal>, VMem>;
const VENTURE_CAPITALIST_DECLINED_REQUEST_MEMORY_ID: MemoryId = MemoryId::new(25);

type VentureCapitalistEditAwaits = StableBTreeMap<StoredPrincipal, Candid<UpdateInfoStruct>, VMem>;
const VENTURE_CAPITALIST_EDIT_AWAITS_MEMORY_ID: MemoryId = MemoryId::new(26);

type VentureCapitalistEditDeclined =
    StableBTreeMap<StoredPrincipal, Candid<UpdateInfoStruct>, VMem>;
const VENTURE_CAPITALIST_EDIT_DECLINED_MEMORY_ID: MemoryId = MemoryId::new(27);

type VentureCapitalistAnnouncement =
    StableBTreeMap<StoredPrincipal, Candid<Vec<Announcements>>, VMem>;
const VC_ANNOUNCEMENTS_MEMORY_ID: MemoryId = MemoryId::new(28);

//project offer to investor

pub type OffersOfferedByMe = StableBTreeMap<String, Candid<Vec<OfferToInvestor>>, VMem>;
pub type InvestorAlerts = StableBTreeMap<StoredPrincipal, Candid<Vec<OfferToSendToInvestor>>, VMem>;

const OFFERS_OFFERED_BY_ME_MEMORY_ID: MemoryId = MemoryId::new(29);
const INVESTOR_ALERTS_MEMORY_ID: MemoryId = MemoryId::new(30);
type ProjectAccessNotification = StableBTreeMap<String, Candid<Vec<ProjectNotification>>, VMem>;
const PROJECT_ACCESS_NOTIFICATIONS_MEMORY_ID: MemoryId = MemoryId::new(31);

type ProjectStorage = StableBTreeMap<StoredPrincipal, Candid<Vec<ProjectInfoInternal>>, VMem>;
const PROJECT_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(32);

type Notifications = StableBTreeMap<StoredPrincipal, Candid<Vec<NotificationProject>>, VMem>;
const NOTIFICATIONS_MEMORY_ID: MemoryId = MemoryId::new(33);

//rating.rs module

const RATING_SYSTEM_MEMORY_ID: MemoryId = MemoryId::new(34);
const LAST_RATING_TIMESTAMPS_MEMORY_ID: MemoryId = MemoryId::new(35);
const AVERAGE_STORAGE_MEMORY_ID: MemoryId = MemoryId::new(36);
type OwnerNotification = StableBTreeMap<StoredPrincipal, Candid<Vec<NotificationForOwner>>, VMem>;
const OWNER_NOTIFICATION_MEMORY_ID: MemoryId = MemoryId::new(37);

type ProjectAnnouncement =
    StableBTreeMap<StoredPrincipal, Candid<Vec<AnnouncementsInternal>>, VMem>;
const PROJECT_ANNOUNCEMENT_MEMORY_ID: MemoryId = MemoryId::new(38);

type BlogPost = StableBTreeMap<StoredPrincipal, Candid<Vec<Blog>>, VMem>;
const BLOG_POST_MEMORY_ID: MemoryId = MemoryId::new(39);

//notification to mentor

pub type MySentNotifications = StableBTreeMap<StoredPrincipal, Candid<Vec<OfferToMentor>>, VMem>;
pub type MentorAlerts = StableBTreeMap<StoredPrincipal, Candid<Vec<OfferToSendToMentor>>, VMem>;

const MY_SENT_NOTIFICATIONS_MEMORY_ID: MemoryId = MemoryId::new(40);
const MENTOR_ALERTS_MEMORY_ID: MemoryId = MemoryId::new(41);

//notification to project

pub type MySentNotificationsProject =
    StableBTreeMap<StoredPrincipal, Candid<Vec<OfferToProject>>, VMem>;
pub type ProjectAlerts = StableBTreeMap<String, Candid<Vec<OfferToSendToProject>>, VMem>;
const MY_SENT_NOTIFICATIONS_PROJECT_MEMORY_ID: MemoryId = MemoryId::new(42);
const PROJECT_ALERTS_MEMORY_ID: MemoryId = MemoryId::new(43);
type ProjectAwaitsResponse = StableBTreeMap<StoredPrincipal, Candid<ProjectInfoInternal>, VMem>;
const PROJECT_AWAITS_RESPONSE_MEMORY_ID: MemoryId = MemoryId::new(44);

type ProjectDeclinedRequest = StableBTreeMap<StoredPrincipal, Candid<ProjectInfoInternal>, VMem>;
const PROJECT_DECLINED_REQUEST_MEMORY_ID: MemoryId = MemoryId::new(45);

type PendingProjectDetails = StableBTreeMap<String, Candid<ProjectUpdateRequest>, VMem>;
const PROJECT_UPDATE_PENDING_MEMORY_ID: MemoryId = MemoryId::new(46);

type DeclinedProjectDetails = StableBTreeMap<String, Candid<ProjectUpdateRequest>, VMem>;
const PROJECT_UPDATE_DECLINED_MEMORY_ID: MemoryId = MemoryId::new(47);

type PostJob = StableBTreeMap<StoredPrincipal, Candid<Vec<JobsInternal>>, VMem>;
const POST_JOB_MEMORY_ID: MemoryId = MemoryId::new(48);

type JobType = StableBTreeMap<String, String, VMem>;
const JOB_TYPE_MEMORY_ID: MemoryId = MemoryId::new(49);

type SpotLightProjects = StableBTreeMap<String, Candid<Vec<SpotlightDetails>>, VMem>;
const SPOTLIGHT_PROJECT_MEMORY_ID: MemoryId = MemoryId::new(50);

type MoneyAccess = StableBTreeMap<String, Candid<Vec<Principal>>, VMem>;
const MONEY_ACCESS_MEMORY_ID: MemoryId = MemoryId::new(51);

//admin.rs

pub type CohortRequestNotification = StableBTreeMap<String, Candid<Vec<CohortRequest>>, VMem>;
const COHORT_REQUEST_MEMORY_ID: MemoryId = MemoryId::new(52);

type PrivateDocsAccess = StableBTreeMap<String, Candid<Vec<Principal>>, VMem>;
const PRIVATE_DOCS_ACCESS_MEMORY_ID: MemoryId = MemoryId::new(53);

type ProjectRating = StableBTreeMap<String, Candid<Vec<(Principal, ProjectReview)>>, VMem>;
const PROJECT_RATING_MEMORY_ID: MemoryId = MemoryId::new(54);

pub type AcceptedCohorts = StableBTreeMap<String, Candid<Vec<CohortRequest>>, VMem>;
const ACCEPTED_COHORTS_MEMORY_ID: MemoryId = MemoryId::new(55);
type MoneyAccessRequest = StableBTreeMap<StoredPrincipal, Candid<Vec<AccessRequest>>, VMem>;
const MONEY_ACCESS_REQUEST_MEMORY_ID: MemoryId = MemoryId::new(56);

pub type DeclinedCohorts = StableBTreeMap<String, Candid<Vec<CohortRequest>>, VMem>;
const DECLINED_COHORTS_MEMORY_ID: MemoryId = MemoryId::new(57);
type PrivateDocsAccessRequest = StableBTreeMap<StoredPrincipal, Candid<Vec<AccessRequest>>, VMem>;
const PRIVATE_DOCS_ACCESS_REQUEST_MEMORY_ID: MemoryId = MemoryId::new(58);

pub struct State {
    pub admin_notifications: AdminNotification,
    pub cohort_request_admin: CohortRequestNotification,
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
    pub accepted_cohorts: AcceptedCohorts,
    pub declined_cohorts: DeclinedCohorts,
    pub user_storage: UserStorage,
    pub role_status: RoleStatus,
    pub user_testimonial: UserTestimonial,
    pub user_rating: UserRating,
    pub mentor_storage: MentorRegistry,
    pub mentor_awaits_response: MentorAwaitsResponse,
    pub mentor_declined_request: MentorDeclinedRequest,
    pub mentor_profile_edit_awaits: MentorProfileEditAwaits,
    pub mentor_profile_edit_declined: MentorProfileEditDeclined,
    pub mentor_announcement: MentorAnnouncement,
    pub vc_storage: VentureCapitalistStorage,
    pub vc_awaits_response: VentureCapitalistAwaitsResponse,
    pub vc_declined_request: VentureCapitalistDeclinedRequest,
    pub vc_profile_edit_awaits: VentureCapitalistEditAwaits,
    pub vc_profile_edit_declined: VentureCapitalistEditDeclined,
    pub vc_announcement: VentureCapitalistAnnouncement,
    pub project_access_notifications: ProjectAccessNotification,
    pub project_storage: ProjectStorage,
    pub notifications: Notifications,
    pub owner_notification: OwnerNotification,
    pub project_announcement: ProjectAnnouncement,
    pub blog_post: BlogPost,
    pub project_awaits_response: ProjectAwaitsResponse,
    pub project_declined_request: ProjectDeclinedRequest,
    pub pending_project_details: PendingProjectDetails,
    pub declined_project_details: DeclinedProjectDetails,
    pub post_job: PostJob,
    pub job_type: JobType,
    pub spotlight_projects: SpotLightProjects,
    pub money_access: MoneyAccess,
    pub private_docs_access: PrivateDocsAccess,
    pub project_rating: ProjectRating,
    pub money_access_request: MoneyAccessRequest,
    pub private_docs_access_request: PrivateDocsAccessRequest,
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static STATE: RefCell<State> = RefCell::new(
        MEMORY_MANAGER.with(|mm| State {
            admin_notifications: AdminNotification::init(mm.borrow().get(ADMIN_NOTIFICATION_MEMORY_ID)),
            checking_data: CheckingData::init(mm.borrow().get(CHECKING_DATA_MEMORY_ID)),
            projects_associated_with_mentor:ProjectAssociatedWithMentor::init(mm.borrow().get(PROJECTS_ASSOCIATED_WITH_MENTOR_MEMORY_ID)),
            projects_associated_with_vc:ProjectAssociatedWithVc::init(mm.borrow().get(PROJECTS_ASSOCIATED_WITH_VC_MEMORY_ID)),
            cohort_rating_system : CohortRatings::init(mm.borrow().get(COHORT_RATINGS_MEMORY_ID)),
            cohort_average_ratings: AverageRatingStorage::init(mm.borrow().get(AVERAGE_RATINGS_STORAGE_MEMORY_ID)),
            offers_sent_by_investor: OffersSentByInvestor::init(mm.borrow().get(OFFERS_SENT_BY_INVESTOR_MEMORY_ID)),
            project_alerts_of_investor:ProjectAlertsOfInvestor::init(mm.borrow().get(PROJECT_ALERTS_OF_INVESTOR_MEMORY_ID)),
            live_projects: LiveProjects::init(mm.borrow().get(LIVE_PROJECTS_MEMORY_ID)),
            incubated_projects: IncubatedProjects::init(mm.borrow().get(INCUBATED_PROJECTS_MEMORY_ID)),
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
            cohort_request_admin: CohortRequestNotification::init(mm.borrow().get(COHORT_REQUEST_MEMORY_ID)),
            accepted_cohorts:AcceptedCohorts::init(mm.borrow().get(ACCEPTED_COHORTS_MEMORY_ID)),
            declined_cohorts:DeclinedCohorts::init(mm.borrow().get(DECLINED_COHORTS_MEMORY_ID)),






            user_storage: UserStorage::init(mm.borrow().get(USER_STORAGE_MEMORY_ID)),
            role_status: RoleStatus::init(mm.borrow().get(ROLE_STATUS_MEMORY_ID)),
            user_testimonial: UserTestimonial::init(mm.borrow().get(USER_TESTIMONIAL_MEMORY_ID)),
            user_rating: UserRating::init(mm.borrow().get(USER_RATING_MEMORY_ID)),
            mentor_storage: MentorRegistry::init(mm.borrow().get(MENTOR_REGISTRY_MEMORY_ID)),
            mentor_awaits_response: MentorAwaitsResponse::init(mm.borrow().get(MENTOR_AWAITS_RESPONSE_MEMORY_ID)),
            mentor_declined_request: MentorDeclinedRequest::init(mm.borrow().get(MENTOR_DECLINED_REQUEST_MEMORY_ID)),
            mentor_profile_edit_awaits: MentorProfileEditAwaits::init(mm.borrow().get(MENTOR_PROFILE_EDIT_AWAITS_MEMORY_ID)),
            mentor_profile_edit_declined: MentorProfileEditDeclined::init(mm.borrow().get(MENTOR_PROFILE_EDIT_DECLINED_MEMORY_ID)),
            mentor_announcement: MentorAnnouncement::init(mm.borrow().get(MENTOR_ANNOUNCEMENTS_MEMORY_ID)),
            vc_storage: VentureCapitalistStorage::init(mm.borrow().get(VENTURE_CAPITALIST_STORAGE_MEMORY_ID)),
            vc_awaits_response: VentureCapitalistAwaitsResponse::init(mm.borrow().get(VENTURE_CAPITALIST_AWAIT_RESPONSE_MEMORY_ID)),
            vc_declined_request: VentureCapitalistDeclinedRequest::init(mm.borrow().get(VENTURE_CAPITALIST_DECLINED_REQUEST_MEMORY_ID)),
            vc_profile_edit_awaits: VentureCapitalistEditAwaits::init(mm.borrow().get(VENTURE_CAPITALIST_EDIT_AWAITS_MEMORY_ID)),
            vc_profile_edit_declined: VentureCapitalistEditDeclined::init(mm.borrow().get(VENTURE_CAPITALIST_EDIT_DECLINED_MEMORY_ID)),
            vc_announcement: VentureCapitalistAnnouncement::init(mm.borrow().get(VC_ANNOUNCEMENTS_MEMORY_ID)),
            project_access_notifications: ProjectAccessNotification::init(mm.borrow().get(PROJECT_ACCESS_NOTIFICATIONS_MEMORY_ID)),
            project_storage: ProjectStorage::init(mm.borrow().get(PROJECT_STORAGE_MEMORY_ID)),
            notifications: Notifications::init(mm.borrow().get(NOTIFICATIONS_MEMORY_ID)),
            owner_notification: OwnerNotification::init(mm.borrow().get(OWNER_NOTIFICATION_MEMORY_ID)),
            project_announcement: ProjectAnnouncement::init(mm.borrow().get(PROJECT_ANNOUNCEMENT_MEMORY_ID)),
            blog_post: BlogPost::init(mm.borrow().get(BLOG_POST_MEMORY_ID)),
            project_awaits_response: ProjectAwaitsResponse::init(mm.borrow().get(PROJECT_AWAITS_RESPONSE_MEMORY_ID)),
            project_declined_request: ProjectDeclinedRequest::init(mm.borrow().get(PROJECT_DECLINED_REQUEST_MEMORY_ID)),
            pending_project_details: PendingProjectDetails::init(mm.borrow().get(PROJECT_UPDATE_PENDING_MEMORY_ID)),
            declined_project_details: DeclinedProjectDetails::init(mm.borrow().get(PROJECT_UPDATE_DECLINED_MEMORY_ID)),
            post_job: PostJob::init(mm.borrow().get(POST_JOB_MEMORY_ID)),
            job_type: JobType::init(mm.borrow().get(JOB_TYPE_MEMORY_ID)),
            spotlight_projects: SpotLightProjects::init(mm.borrow().get(SPOTLIGHT_PROJECT_MEMORY_ID)),
            money_access: MoneyAccess::init(mm.borrow().get(MONEY_ACCESS_MEMORY_ID)),
            private_docs_access: PrivateDocsAccess::init(mm.borrow().get(PRIVATE_DOCS_ACCESS_MEMORY_ID)),
            project_rating: ProjectRating::init(mm.borrow().get(PROJECT_RATING_MEMORY_ID)),
            money_access_request: MoneyAccessRequest::init(mm.borrow().get(MONEY_ACCESS_REQUEST_MEMORY_ID)),
            private_docs_access_request: PrivateDocsAccessRequest::init(mm.borrow().get(PRIVATE_DOCS_ACCESS_REQUEST_MEMORY_ID)),
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
