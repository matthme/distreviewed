import { LitElement, html, css } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, AppWebsocket, Record, ActionHash, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import { Paper } from './paper';
import '@material/mwc-circular-progress';
import './review-for-paper';

@customElement('paper-page')
export class PaperPage extends LitElement {
  @property()
  actionHash!: ActionHash;

  @state()
  _paper: Paper | undefined;

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;
  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async firstUpdated() {
    // get all reviews for paper
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'distreview')!;
    const record: Record | undefined = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'reviews',
      fn_name: 'get_paper',
      payload: this.actionHash,
      provenance: cellData.cell_id[1]
    });
    if (record) {
      this._paper = decode((record.entry as any).Present.entry) as Paper;
    }
  }

  selectPaper() {
    this.dispatchEvent(new CustomEvent('paper-selected', {
      composed: true,
      bubbles: true,
      detail: this.actionHash
    }));
  }

  createReview() {
    this.dispatchEvent(new CustomEvent('create-review', {
      composed: true,
      bubbles: true,
      detail: {
        paper: this._paper,
        actionHash: this.actionHash,
      }
    }));
  }

  render() {
    if (!this._paper) {
      return html`<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
    }
    return html`
      <div class="paper-title" style="white-space: pre-line">${this._paper.title }</div>
        <div style="white-space: pre-line">author: ${this._paper.authors }</div>
        <div style="white-space: pre-line">doi: ${this._paper.doi }</div>
        <button @click=${this.createReview}>Create Review</button>
      <!-- add reviews -->
        <review-for-paper .actionHash=${this.actionHash}></review-for-paper>
    `;
  }

  static styles = css`
    .paper-title {
      font-size: 1.2em;
      color: #183E29;
      font-family: 'Space Mono';
    }
  `
}
