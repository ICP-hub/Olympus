use crate::project_registration::*;
use candid::CandidType;
use ic_cdk::api::stable::{StableReader, StableWriter};
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};
use serde_cbor::{from_slice, to_vec};
use std::{cell::RefCell, collections::HashMap, io::Read};
const PLANNED: &str = "Planned";
const NOT_REQUIRED: &str = "NotRequired";
const COMPLETED: &str = "Completed";
const IN_PROGRESS: &str = "InProgress";
use std::sync::atomic::{AtomicU64, Ordering};

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq, Eq, Hash)]
pub struct Suggestion {
    pub id: u64,
    pub content: String,
    pub status: String,
    pub project_id: String,
    pub parent_id: Option<u64>,
}

thread_local! {
    static SUGGESTIONS_BY_STATUS: RefCell<HashMap<String, HashMap<String, Vec<Suggestion>>>> = RefCell::new(HashMap::new());
}

static NEXT_ID: AtomicU64 = AtomicU64::new(1);

pub fn pre_upgrade() {
    let suggestions = SUGGESTIONS_BY_STATUS.with(|s| s.borrow().clone());
    let next_id = NEXT_ID.load(Ordering::Relaxed);
    let serialized = to_vec(&(suggestions, next_id)).expect("Serialization failed");

    let mut writer = StableWriter::default();
    writer
        .write(&serialized)
        .expect("Failed to write to stable storage");
}

pub fn add_suggestion(content: String, project_id: String) -> Result<(u64, String), &'static str> {
    let status = "Planned".to_string();

    // Check if project_id exists in APPLICATION_FORM

    let project_exists = APPLICATION_FORM.with(|forms| {
        forms.borrow().values().any(|projects| {
            projects
                .iter()
                .any(|project_info| project_info.uid == project_id)
        })
    });

    if !project_exists {
        return Err("Project ID does not exist.");
    }

    let id = NEXT_ID.fetch_add(1, Ordering::SeqCst);

    SUGGESTIONS_BY_STATUS.with(|s| {
        let mut app_details = s.borrow_mut();
        let project_suggestions = app_details
            .entry(project_id.clone())
            .or_insert_with(HashMap::new);
        let status_suggestions = project_suggestions
            .entry(status.clone())
            .or_insert_with(Vec::new);

        status_suggestions.push(Suggestion {
            id,
            content,
            status: status.clone(),
            project_id: project_id.clone(),
            parent_id: None,
        });
    });

    Ok((id, status))
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
                let suggestion = project_suggestions
                    .get_mut(&old_status)
                    .unwrap()
                    .remove(suggestion_index);

                let mut updated_suggestion = suggestion.clone();
                updated_suggestion.status = new_status.clone();

                project_suggestions
                    .entry(new_status)
                    .or_insert_with(Vec::new)
                    .push(updated_suggestion);
            } else {
                eprintln!(
                    "Suggestion with id {} not found in project {}",
                    id, project_id
                );
            }
        } else {
            eprintln!("Project with id {} not found", project_id);
        }
    });
}

pub fn get_suggestions_by_status(project_id: String, status: String) -> Vec<Suggestion> {
    SUGGESTIONS_BY_STATUS.with(|s| {
        let app_details = s.borrow();
        app_details
            .get(&project_id)
            .and_then(|project_suggestions| project_suggestions.get(&status))
            .cloned()
            .unwrap_or_default()
    })
}

pub fn reply_to_suggestion(
    parent_id: u64,
    reply_content: String,
    project_id: String,
) -> (u64, String) {
    let reply_status = PLANNED.to_string();

    let id = SUGGESTIONS_BY_STATUS.with(|s| {
        let mut app_details = s.borrow_mut();

        let id = NEXT_ID.fetch_add(1, Ordering::SeqCst);

        let project_suggestions = app_details
            .entry(project_id.clone())
            .or_insert_with(HashMap::new);

        project_suggestions
            .entry(reply_status.clone())
            .or_insert_with(Vec::new)
            .push(Suggestion {
                id: id,
                content: reply_content,
                status: reply_status.clone(),
                project_id: project_id,
                parent_id: Some(parent_id),
            });

        id
    });

    (id, reply_status)
}

pub fn get_suggestions_by_parent_id(project_id: String, parent_id: u64) -> Vec<Suggestion> {
    SUGGESTIONS_BY_STATUS.with(|s| {
        let app_details = s.borrow();
        if let Some(project_suggestions) = app_details.get(&project_id) {
            project_suggestions
                .values()
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
        app_details
            .get(&project_id)
            .map(|project_suggestions| {
                project_suggestions
                    .values()
                    .map(|suggestions| suggestions.len() as u64)
                    .sum()
            })
            .unwrap_or(0)
    })
}
