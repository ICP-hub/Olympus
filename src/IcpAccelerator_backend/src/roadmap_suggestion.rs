use std::{io::Read, collections::HashMap, cell::RefCell};
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};
use candid::CandidType;
use serde_cbor::{to_vec, from_slice};
use ic_cdk::api::stable::{StableWriter, StableReader};


#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq, Eq, Hash)]
pub enum Status {
    Planned,
    NotRequired,
    Completed,
    InProgress,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq, Eq, Hash)]
pub struct Suggestion {
    id: u64,
    content: String,
    status: Status,
    parent_id: Option<u64>,
}

pub type ApplicationDetails = HashMap<Status, Vec<Suggestion>>;

thread_local! {
    pub static SUGGESTIONS_BY_STATUS: RefCell<ApplicationDetails> = RefCell::new(ApplicationDetails::new());
}

static mut NEXT_ID: u64 = 1;

pub fn pre_upgrade() {
    let suggestions = SUGGESTIONS_BY_STATUS.with(|s| s.borrow().clone());
    let next_id = unsafe { NEXT_ID };
    let serialized = to_vec(&(suggestions, next_id)).expect("Serialization failed");

    let mut writer = StableWriter::default();
    writer.write(&serialized).expect("Failed to write to stable storage");
}



#[update]
pub fn add_suggestion(content: String) -> (u64, Status) {
    let status = Status::Planned; 
    let cloned_status = status.clone(); 

    let (id, status) = SUGGESTIONS_BY_STATUS.with(|s| {
        let mut suggestions = s.borrow_mut();
        let id = suggestions
            .values()
            .flat_map(|v| v.iter())
            .map(|s| s.id)
            .max()
            .unwrap_or(0)
            + 1;

        suggestions
            .entry(cloned_status.clone())
            .or_insert_with(Vec::new)
            .push(Suggestion {
                id,
                content: content.clone(), 
                status: cloned_status.clone(),
                parent_id: None,
            });

        (id, cloned_status)
    });

    (id, status)
}



#[update]
pub fn update_suggestion_status(id: u64, new_status: Status) {
    SUGGESTIONS_BY_STATUS.with(|s| {
        let mut suggestions = s.borrow_mut();

        let (current_status, suggestion_index) = suggestions.iter()
            .find_map(|(status, vec)| {
                vec.iter().position(|s| s.id == id).map(|index| (status.clone(), index))
            })
            .unwrap(); 

        if &current_status == &new_status {
            if let Some(vec) = suggestions.get_mut(&current_status) {
                if let Some(suggestion) = vec.get_mut(suggestion_index) {
                    suggestion.status = new_status; 
                }
            }
            return;
        }

        if let Some(suggestion) = suggestions.get_mut(&current_status).and_then(|vec| vec.get_mut(suggestion_index)) {
            if &suggestion.status != &new_status {
                let updated_suggestion = suggestion.clone();
                suggestions.entry(new_status).or_insert_with(Vec::new).push(updated_suggestion);
                suggestions.get_mut(&current_status).unwrap().remove(suggestion_index);
            }
        }
    });
}



#[query]
pub fn get_suggestions_by_status(status: Status) -> Vec<Suggestion> {
    SUGGESTIONS_BY_STATUS.with(|s| {
        let suggestions = s.borrow();
        suggestions.get(&status).cloned().unwrap_or_default()
    })
}

#[update]
pub fn reply_to_suggestion(parent_id: u64, reply_content: String) -> (u64, Status) {
    let reply_status = Status::Planned;
    let cloned_reply_status = reply_status.clone();

    let (id, status) = SUGGESTIONS_BY_STATUS.with(|s| {
        let mut suggestions = s.borrow_mut();
        let id = suggestions
            .values()
            .flat_map(|v| v.iter())
            .map(|s| s.id)
            .max()
            .unwrap_or(0)
            + 1;

        // Assuming all replies are initially Planned. Adjust as needed.
        suggestions
            .entry(cloned_reply_status.clone())
            .or_insert_with(Vec::new)
            .push(Suggestion {
                id,
                content: reply_content.clone(),
                status: cloned_reply_status.clone(),
                parent_id: Some(parent_id), // Set the parent ID
            });

        (id, cloned_reply_status)
    });

    (id, status)
}

#[query]
pub fn get_suggestions_by_parent_id(parent_id: u64) -> Vec<Suggestion> {
    SUGGESTIONS_BY_STATUS.with(|s| {
        let suggestions = s.borrow();
        suggestions
            .values() // Iterate over all vectors of suggestions by status
            .flat_map(|vec| vec.iter()) // Flatten the vectors into a single iterator
            .filter(|suggestion| suggestion.parent_id == Some(parent_id)) // Filter by parent_id
            .cloned() // Clone the suggestions
            .collect() // Collect the filtered suggestions into a Vec
    })
}

#[query]
pub fn get_suggestions_grouped_by_status() -> ApplicationDetails {
    SUGGESTIONS_BY_STATUS.with(|s| {
        let suggestions = s.borrow();

        let mut grouped_suggestions: ApplicationDetails = HashMap::new();

        for (status, vec) in suggestions.iter() {
            let cloned_status = status.clone();
            let filtered_vec: Vec<Suggestion> = vec.iter().cloned().filter(|suggestion| suggestion.status == cloned_status).collect();
            grouped_suggestions.insert(cloned_status, filtered_vec);
        }

        grouped_suggestions
    })
}