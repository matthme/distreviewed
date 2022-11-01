use hdi::prelude::*;
#[hdk_entry_helper]
#[derive(Clone)]
pub struct Paper {
    pub authors: Vec<String>,
    pub title: String,
    pub doi: String,
}
