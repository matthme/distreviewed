use hdi::prelude::*;
#[hdk_entry_helper]
#[derive(Clone)]
pub struct Review {
    pub review: String,
}
