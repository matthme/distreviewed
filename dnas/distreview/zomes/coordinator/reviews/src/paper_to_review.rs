use hdk::prelude::*;
use reviews_integrity::*;
#[derive(Serialize, Deserialize, Debug)]
pub struct CreateReviewForPaperInput {
    paper_hash: ActionHash,
    review_hash: ActionHash,
}
#[hdk_extern]
pub fn add_review_for_paper(input: CreateReviewForPaperInput) -> ExternResult<()> {
    create_link(input.paper_hash, input.review_hash, LinkTypes::PaperToReview, ())?;
    Ok(())
}
#[hdk_extern]
pub fn get_review_for_paper(paper_hash: ActionHash) -> ExternResult<Vec<Record>> {
    let links = get_links(paper_hash, LinkTypes::PaperToReview, None)?;
    let get_input: Vec<GetInput> = links
        .into_iter()
        .map(|link| GetInput::new(
            ActionHash::from(link.target).into(),
            GetOptions::default(),
        ))
        .collect();
    let maybe_records = HDK.with(|hdk| hdk.borrow().get(get_input))?;
    let record: Vec<Record> = maybe_records.into_iter().filter_map(|r| r).collect();
    Ok(record)
}
