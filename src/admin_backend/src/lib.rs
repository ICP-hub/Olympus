use ic_cdk_macros::query;
use ic_kit::candid::{candid_method, export_service};
use ic_cdk::api::caller;

#[query]
#[candid_method(query)]
fn greet() -> String {
    let principal_id = caller().to_string();
    format!("principal id - : {:?}", principal_id)
}

#[query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    export_service!();
    __export_service()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn save_candid() {
        use std::env;
        use std::fs::write;
        use std::path::PathBuf;

        let dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());
        let dir = dir.parent().unwrap().parent().unwrap().join("candid");
        write(dir.join("C:/Users/user/OneDrive/Desktop/Company/ICPAccelerator/src/admin_backend/admin_backend.did"), export_candid()).expect("Write failed.");
    }
}
