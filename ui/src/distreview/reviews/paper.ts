import { Record, ActionHash, EntryHash, AgentPubKey } from '@holochain/client';

export interface Paper {
  authors: string[],
  title: string,
  doi: string,
}
