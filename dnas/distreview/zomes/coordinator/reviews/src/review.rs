use hdk::prelude::*;
use reviews_integrity::*;

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateReviewInput {
    doi: String,
    review: Review,
    paper_hash: ActionHash,
}

#[hdk_extern]
pub fn create_review(input: CreateReviewInput) -> ExternResult<Record> {
    let review_hash = create_entry(&EntryTypes::Review(input.review.clone()))?;
    let doi_hash = hash_doi(input.doi)?;
    create_link(doi_hash, review_hash.clone(), LinkTypes::DoiToReview, ())?;
    create_link(input.paper_hash, review_hash.clone(), LinkTypes::PaperToReview, ())?;
    let record = get(review_hash, GetOptions::default())?
        .ok_or(
            wasm_error!(
                WasmErrorInner::Guest(String::from("Could not find the newly created Review"))
            ),
        )?;
    Ok(record)
}
#[hdk_extern]
pub fn get_review(action_hash: ActionHash) -> ExternResult<Option<Record>> {
    get(action_hash, GetOptions::default())
}
#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateReviewInput {
    original_action_hash: ActionHash,
    updated_review: Review,
}
#[hdk_extern]
pub fn update_review(input: UpdateReviewInput) -> ExternResult<Record> {
    let updated_review_hash = update_entry(
        input.original_action_hash,
        &input.updated_review,
    )?;
    let record = get(updated_review_hash.clone(), GetOptions::default())?
        .ok_or(
            wasm_error!(
                WasmErrorInner::Guest(String::from("Could not find the newly updated Review"))
            ),
        )?;
    Ok(record)
}

#[hdk_extern]
pub fn delete_review(action_hash: ActionHash) -> ExternResult<ActionHash> {
    delete_entry(action_hash)
}
#[derive(Serialize, Deserialize, Debug)]
pub struct CreateDoiForReviewInput {
    doi_hosh: ActionHash,
    review_hash: ActionHash,
}
fn hash_doi(doi: String) -> ExternResult<EntryHash> {
    let blake_hash = hdk::hash::hash_blake2b(doi.as_bytes().to_vec(), 36)?;
    Ok(EntryHash::from_raw_36(blake_hash))
}


#[hdk_extern]
pub fn get_reviews_for_doi(doi: String) -> ExternResult<Vec<Record>> {
    let doi_hash = hash_doi(doi)?;
    let links = get_links(doi_hash, LinkTypes::DoiToReview, None)?;
    let get_input: Vec<GetInput> = links
        .into_iter()
        .map(|link| GetInput::new(
            ActionHash::from(link.target).into(),
            GetOptions::default(),
        ))
        .collect();
    let maybe_records = HDK.with(|hdk| hdk.borrow().get(get_input))?;
    let records: Vec<Record> = maybe_records.into_iter().filter_map(|r| r).collect();
    Ok(records)
}
