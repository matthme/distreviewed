use hdk::prelude::*;
use reviews_integrity::*;
#[hdk_extern]
pub fn get_all_papers(_: ()) -> ExternResult<Vec<Record>> {
    let path = Path::from("all_papers");
    let links = get_links(path.path_entry_hash()?, LinkTypes::AllPapers, None)?;
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
