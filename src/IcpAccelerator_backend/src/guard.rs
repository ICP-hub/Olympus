pub fn is_admin() -> Result<(), String> {
    Ok(())
    // if !ic_cdk::api::is_controller(&caller()) {
    //     Err("Only Admin can use these functions".to_string())
    // } else {
    //     Ok(())
    // }
}

pub fn is_user_anonymous() -> Result<(), String> {
    Ok(())
    // let caller = caller();

    // if caller.to_string() != "2vxsx-fae" {
    //     Ok(())
    // } else {
    //     Err("login with your identity to use functions".to_string())
    // }
}