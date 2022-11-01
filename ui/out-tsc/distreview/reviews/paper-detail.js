import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import '@material/mwc-circular-progress';
let PaperDetail = class PaperDetail extends LitElement {
    async firstUpdated() {
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
    render() {
        if (!this._paper) {
            return html `<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
        }
        return html `
      <div class="paper-container" @click=${this.selectPaper}>
        <div style="white-space: pre-line">title: ${this._paper.title}</div>
        <div style="white-space: pre-line">author: ${this._paper.authors}</div>
        <div style="white-space: pre-line">doi: ${this._paper.doi}</div>
      </div>
    `;
    }
};
PaperDetail.styles = css `
    .paper-container {
      display: flex;
      flex-direction: column;
      align-items: start;
      width: 200px;
      height: 180px;
      border: 1px solid black;
      font-size: 1.2em;
      border: 2px solid #183E29;
      box-shadow: 4px 6px #183E29;
      background: #FCF1E9;
      font-family: 'Space Mono';
      margin: 10px 40px;
      padding: 15px;
      cursor: pointer;
    }
  `;
__decorate([
    property()
], PaperDetail.prototype, "actionHash", void 0);
__decorate([
    state()
], PaperDetail.prototype, "_paper", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], PaperDetail.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], PaperDetail.prototype, "appInfo", void 0);
PaperDetail = __decorate([
    customElement('paper-detail')
], PaperDetail);
export { PaperDetail };
//# sourceMappingURL=paper-detail.js.map