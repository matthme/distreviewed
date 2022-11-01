import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, AppWebsocket, Record, ActionHash, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import { Review } from './review';
import '@material/mwc-circular-progress';

@customElement('review-detail')
export class ReviewDetail extends LitElement {
  @property()
  actionHash!: ActionHash;

  @state()
  _review: Review | undefined;

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;
  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async firstUpdated() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'distreview')!;
    const record: Record | undefined = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'reviews',
      fn_name: 'get_review',
      payload: this.actionHash,
      provenance: cellData.cell_id[1]
    });
    if (record) {
      this._review = decode((record.entry as any).Present.entry) as Review;
    }
  }

  render() {
    if (!this._review) {
      return html`<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
    }
    return html`
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Review</span>
		  <div style="display: flex; flex-direction: column">
		    <span><strong></strong></span>
		    <span style="white-space: pre-line">${ this._review.review }</span>
		  </div>
      </div>
    `;
  }
}
