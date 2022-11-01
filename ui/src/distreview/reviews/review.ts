import { Record, ActionHash, EntryHash, AgentPubKey } from '@holochain/client';

export interface Review {
  review: string,
}


export interface CreateReviewInput {
  doi: string,
  review: Review,
  paper_hash: EntryHash,
}