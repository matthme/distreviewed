import { LitElement, html } from 'lit';
import { state, property, customElement } from 'lit/decorators.js';
import { InstalledCell, AgentPubKey, ActionHash, Record, AppWebsocket, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import '@material/mwc-circular-progress';
import './review-detail';

@customElement('review-for-review')
export class ReviewForReview extends LitElement {

  @property()
  actionHash!: ActionHash; 

  @state()
  _records: Array<Record> | undefined;

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async firstUpdated() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'distreview')!;

    this._records = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'reviews',
      fn_name: 'get_review_for_review',
      payload: this.actionHash,
      provenance: cellData.cell_id[1]
    });
  }

  render() {
    if (!this._records) {
      return html`<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
    }
    return html`
      <div style="display: flex; flex-direction: column">
        ${this._records.map(r => 
          html`<review-detail .actionHash=${r.signed_action.hashed.hash} style="margin-bottom: 16px;"></review-detail>`
        )}
      </div>
    `;
  }
}
