pub mod paper;
pub use paper::*;
pub mod review;
pub use review::*;
use hdi::prelude::*;
#[hdk_extern]
pub fn validate(_op: Op) -> ExternResult<ValidateCallbackResult> {
    Ok(ValidateCallbackResult::Valid)
}
#[hdk_entry_defs]
#[unit_enum(UnitEntryTypes)]
pub enum EntryTypes {
    Review(Review),
    Paper(Paper),
}
#[hdk_link_types]
pub enum LinkTypes {
    DoiToReview,
    PaperToReview,
    AllPapers,
}
