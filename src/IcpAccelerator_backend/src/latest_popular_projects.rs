use crate::{project_registration, upvotes};
use candid::Nat;
use project_registration::{ProjectInfoInternal, list_all_projects, APPLICATION_FORM};
use upvotes::{get_upvote_record,UPVOTES};
use std::cell::RefCell;
use num_traits::ToPrimitive;


// #[derive(Debug, Clone, Default)]
// pub struct CategorizedProjects {
//     pub live_proposals_latest: Vec<ProjectInfoInternal>,
//     pub listed_projects_latest: Vec<ProjectInfoInternal>,
//     pub live_proposals_popular: Vec<ProjectInfoInternal>,
//     pub listed_projects_popular: Vec<ProjectInfoInternal>,
// }

thread_local! {
    pub static LIVE_PROPOSALS_LATEST: RefCell<Vec<ProjectInfoInternal>> = RefCell::new(Vec::new());
    pub static LISTED_PROJECTS_LATEST: RefCell<Vec<ProjectInfoInternal>> = RefCell::new(Vec::new());
    pub static LIVE_PROPOSALS_POPULAR: RefCell<Vec<ProjectInfoInternal>> = RefCell::new(Vec::new());
    pub static LISTED_PROJECTS_POPULAR: RefCell<Vec<ProjectInfoInternal>> = RefCell::new(Vec::new());
    // pub static CATEGORIZED_PROJECTS: RefCell<CategorizedProjects> = RefCell::new(CategorizedProjects::default());
}


pub fn update_project_categories() {
     let threshold: usize = 50;
    let mut live_proposals_latest = Vec::new();
    let mut listed_projects_latest = Vec::new();
    let mut live_proposals_popular = Vec::new();
    let mut listed_projects_popular = Vec::new();

    APPLICATION_FORM.with(|app_forms| {
        let app_forms = app_forms.borrow();
        UPVOTES.with(|upvotes_storage| {
            let upvotes_storage = upvotes_storage.borrow();

            for projects in app_forms.values() {
                for project in projects {
                    let upvote_count = upvotes_storage.projects.get(&project.uid)
                        .map_or(0, |record| 
                            record.count.0.to_usize().unwrap_or_default()
                        );

                    if upvote_count < threshold {
                        live_proposals_latest.push(project.clone());
                        live_proposals_popular.push(project.clone());
                    } else {
                        listed_projects_latest.push(project.clone());
                        listed_projects_popular.push(project.clone());
                    }
                }
            }
        });
    });

    live_proposals_popular.sort_by(|a, b| {
        UPVOTES.with(|upvotes| {
            let upvotes = upvotes.borrow();
            upvotes.projects.get(&b.uid).unwrap().count.0.cmp(&upvotes.projects.get(&a.uid).unwrap().count.0)
        })
    });
    listed_projects_popular.sort_by(|a, b| {
        UPVOTES.with(|upvotes| {
            let upvotes = upvotes.borrow();
            upvotes.projects.get(&b.uid).unwrap().count.0.cmp(&upvotes.projects.get(&a.uid).unwrap().count.0)
        })
    });

    LIVE_PROPOSALS_LATEST.with(|v| *v.borrow_mut() = live_proposals_latest);
    LISTED_PROJECTS_LATEST.with(|v| *v.borrow_mut() = listed_projects_latest);
    LIVE_PROPOSALS_POPULAR.with(|v| *v.borrow_mut() = live_proposals_popular);
    LISTED_PROJECTS_POPULAR.with(|v| *v.borrow_mut() = listed_projects_popular);
}

pub fn get_live_proposals_latest() -> Vec<ProjectInfoInternal> {
    update_project_categories();
    LIVE_PROPOSALS_LATEST.with(|c| c.borrow().clone())
}

pub fn get_listed_projects_latest() -> Vec<ProjectInfoInternal> {
    update_project_categories();
    LISTED_PROJECTS_LATEST.with(|c| c.borrow().clone())
}

pub fn get_live_proposals_popular() -> Vec<ProjectInfoInternal> {
    update_project_categories();
    LIVE_PROPOSALS_POPULAR.with(|c| c.borrow().clone())
}

pub fn get_listed_projects_popular() -> Vec<ProjectInfoInternal> {
    update_project_categories();
    LISTED_PROJECTS_POPULAR.with(|c| c.borrow().clone())
}
