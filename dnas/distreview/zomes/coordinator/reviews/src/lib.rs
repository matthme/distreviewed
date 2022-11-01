pub mod all_papers;
pub mod paper_to_review;
pub mod paper;
pub mod review;
use hdk::prelude::*;
#[hdk_extern]
pub fn init(_: ()) -> ExternResult<InitCallbackResult> {
    Ok(InitCallbackResult::Pass)
}
