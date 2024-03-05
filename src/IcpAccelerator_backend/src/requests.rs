use crate::mentor::{MentorInternal, MENTOR_REGISTRY};
use ic_cdk::api::caller;
// use ic_cdk::export::candid::{CandidType, Deserialize};
use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::cell::RefCell;
use std::collections::HashMap;


#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct Request {
    text: String,
    mentor: Option<MentorInternal>, 
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug, Default)]
pub struct ProjectRequests {
    notifications: HashMap<String, Vec<Request>>,
}

thread_local! {
    pub static PROJECT_REQUESTS: RefCell<ProjectRequests> = RefCell::new(ProjectRequests::default());
}

pub fn send_request_to_project(project_id: String, request_text: String)->String {
    let caller_principal = caller();
    let mentor_data = MENTOR_REGISTRY.with(|registry| {
        registry.borrow().get(&caller_principal).cloned()
    });

    let request = Request {
        text: request_text.to_owned(),
        mentor: mentor_data,
    };

    PROJECT_REQUESTS.with(|requests| {
        let mut requests_mut = requests.borrow_mut();
        requests_mut.notifications.entry(project_id.to_owned()).or_default().push(request);
    });
    "Request Successfully Sent To Project Owner".to_string()
}

pub fn get_requests(project_id: String) -> Vec<Request> {
    PROJECT_REQUESTS.with(|requests| {
        requests.borrow().notifications.get(&project_id).cloned().unwrap_or_default()
    })
}

