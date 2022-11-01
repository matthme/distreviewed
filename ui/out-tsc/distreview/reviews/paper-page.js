import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import '@material/mwc-circular-progress';
import './review-for-paper';
let PaperPage = class PaperPage extends LitElement {
    async firstUpdated() {
        // get all reviews for paper
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'distreview');
        const record = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'reviews',
            fn_name: 'get_paper',
            payload: this.actionHash,
            provenance: cellData.cell_id[1]
        });
        if (record) {
            this._paper = decode(record.entry.Present.entry);
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
            return html `<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
        }
        return html `
      <div class="paper-title" style="white-space: pre-line">${this._paper.title}</div>
        <div style="white-space: pre-line">author: ${this._paper.authors}</div>
        <div style="white-space: pre-line">doi: ${this._paper.doi}</div>
        <button @click=${this.createReview}>Create Review</button>
      <!-- add reviews -->
        <review-for-paper .actionHash=${this.actionHash}></review-for-paper>
    `;
    }
};
PaperPage.styles = css `
    .paper-title {
      font-size: 1.2em;
      color: #183E29;
      font-family: 'Space Mono';
    }
  `;
__decorate([
    property()
], PaperPage.prototype, "actionHash", void 0);
__decorate([
    state()
], PaperPage.prototype, "_paper", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], PaperPage.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], PaperPage.prototype, "appInfo", void 0);
PaperPage = __decorate([
    customElement('paper-page')
], PaperPage);
export { PaperPage };
//# sourceMappingURL=paper-page.js.map