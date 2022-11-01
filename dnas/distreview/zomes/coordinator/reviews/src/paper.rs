use hdk::prelude::*;
use reviews_integrity::*;
#[hdk_extern]
pub fn create_paper(paper: Paper) -> ExternResult<Record> {
    let paper_hash = create_entry(&EntryTypes::Paper(paper.clone()))?;
    let record = get(paper_hash.clone(), GetOptions::default())?
        .ok_or(
            wasm_error!(
                WasmErrorInner::Guest(String::from("Could not find the newly created Paper"))
            ),
        )?;
    let path = Path::from("all_papers");
    create_link(path.path_entry_hash()?, paper_hash.clone(), LinkTypes::AllPapers, ())?;
    Ok(record)
}
#[hdk_extern]
pub fn get_paper(action_hash: ActionHash) -> ExternResult<Option<Record>> {
  println!("ACTION HASH: {:?}", action_hash);
    get(action_hash, GetOptions::default())
}
#[derive(Serialize, Deserialize, Debug)]
pub struct UpdatePaperInput {
    original_action_hash: ActionHash,
    updated_paper: Paper,
}
#[hdk_extern]
pub fn update_paper(input: UpdatePaperInput) -> ExternResult<Record> {
    let updated_paper_hash = update_entry(
        input.original_action_hash,
        &input.updated_paper,
    )?;
    let record = get(updated_paper_hash.clone(), GetOptions::default())?
        .ok_or(
            wasm_error!(
                WasmErrorInner::Guest(String::from("Could not find the newly updated Paper"))
            ),
        )?;
    Ok(record)
}
#[hdk_extern]
pub fn delete_paper(action_hash: ActionHash) -> ExternResult<ActionHash> {
    delete_entry(action_hash)
}
