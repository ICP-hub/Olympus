use std::{io::Read, collections::HashMap, cell::RefCell};
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};
use candid::CandidType;
use serde_cbor::{to_vec, from_slice};
use ic_cdk::api::stable::{StableWriter, StableReader};

const PLANNED: &str = "Planned";
const NOT_REQUIRED: &str = "NotRequired";
const COMPLETED: &str = "Completed";
const IN_PROGRESS: &str = "InProgress";

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq, Eq, Hash)]
pub struct Suggestion {
    id: u64,
    content: String,
    status: String,
    project_id: String,
    parent_id: Option<u64>,
}

thread_local! {
    static SUGGESTIONS_BY_STATUS: RefCell<HashMap<String, HashMap<String, Vec<Suggestion>>>> = RefCell::new(HashMap::new());
}

static mut NEXT_ID: u64 = 1;

pub fn pre_upgrade() {
    let suggestions = SUGGESTIONS_BY_STATUS.with(|s| s.borrow().clone());
    let next_id = unsafe { NEXT_ID };
    let serialized = to_vec(&(suggestions, next_id)).expect("Serialization failed");

    let mut writer = StableWriter::default();
    writer.write(&serialized).expect("Failed to write to stable storage");
}




pub fn add_suggestion(content: String, project_id: String) -> (u64, String) {
    let status = "Planned".to_string(); 

    let id = unsafe {
        NEXT_ID += 1;
        NEXT_ID
    };

    SUGGESTIONS_BY_STATUS.with(|s| {
        let mut app_details = s.borrow_mut();
        let project_suggestions = app_details.entry(project_id.clone()).or_insert_with(HashMap::new);
        let status_suggestions = project_suggestions.entry(status.clone()).or_insert_with(Vec::new);

        status_suggestions.push(Suggestion {
            id,
            content,
            status: status.clone(),
            project_id,
            parent_id: None,
        });
    });

    (id, status)
}




pub fn update_suggestion_status(id: u64, new_status: String, project_id: String) {
    SUGGESTIONS_BY_STATUS.with(|s| {
        let mut app_details = s.borrow_mut();
        let project_suggestions = app_details.get_mut(&project_id);

        if let Some(project_suggestions) = project_suggestions {
            let mut found = false;
            let mut old_status = String::new();
            let mut suggestion_index = 0;

            for (status, suggestions) in project_suggestions.iter() {
                if let Some(index) = suggestions.iter().position(|s| s.id == id) {
                    found = true;
                    old_status = status.clone();
                    suggestion_index = index;
                    break;
                }
            }

            if found {
                let suggestion = project_suggestions.get_mut(&old_status).unwrap().remove(suggestion_index);

                let mut updated_suggestion = suggestion.clone();
                updated_suggestion.status = new_status.clone();

                project_suggestions.entry(new_status)
                    .or_insert_with(Vec::new)
                    .push(updated_suggestion);
            } else {
                eprintln!("Suggestion with id {} not found in project {}", id, project_id);
            }
        } else {
            eprintln!("Project with id {} not found", project_id);
        }
    });
}




pub fn get_suggestions_by_status(project_id: String, status: String) -> Vec<Suggestion> {
    SUGGESTIONS_BY_STATUS.with(|s| {
        let app_details = s.borrow();
        app_details.get(&project_id) 
            .and_then(|project_suggestions| project_suggestions.get(&status)) 
            .cloned() 
            .unwrap_or_default() 
    })
}


pub fn reply_to_suggestion(parent_id: u64, reply_content: String, project_id: String) -> (u64, String) {
    let reply_status = PLANNED.to_string();

    let id = SUGGESTIONS_BY_STATUS.with(|s| {
        let mut app_details = s.borrow_mut();

        let next_id = unsafe {
            NEXT_ID += 1;
            NEXT_ID
        };

        let project_suggestions = app_details.entry(project_id.clone()).or_insert_with(HashMap::new);

        project_suggestions.entry(reply_status.clone())
            .or_insert_with(Vec::new)
            .push(Suggestion {
                id: next_id,
                content: reply_content,
                status: reply_status.clone(),
                project_id: project_id,
                parent_id: Some(parent_id), 
            });

        next_id
    });

    (id, reply_status)
}


pub fn get_suggestions_by_parent_id(project_id: String, parent_id: u64) -> Vec<Suggestion> {
    SUGGESTIONS_BY_STATUS.with(|s| {
        let app_details = s.borrow();
        if let Some(project_suggestions) = app_details.get(&project_id) {
            project_suggestions.values()
                .flat_map(|suggestions| suggestions.iter())
                .filter(|suggestion| suggestion.parent_id == Some(parent_id))
                .cloned()
                .collect()
        } else {
            Vec::new() 
        }
    })
}


pub fn get_total_suggestions_count(project_id: String) -> u64 {
    SUGGESTIONS_BY_STATUS.with(|s| {
        let app_details = s.borrow();
        app_details.get(&project_id)
            .map(|project_suggestions| {
                project_suggestions.values()
                    .map(|suggestions| suggestions.len() as u64)
                    .sum()
            })
            .unwrap_or(0)
    })
}