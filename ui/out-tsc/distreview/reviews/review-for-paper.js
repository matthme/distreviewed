import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, property, customElement } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import '@material/mwc-circular-progress';
import './review-detail';
let ReviewForPaper = class ReviewForPaper extends LitElement {
    async firstUpdated() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'distreview');
        this._records = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'reviews',
            fn_name: 'get_review_for_paper',
            payload: this.actionHash,
            provenance: cellData.cell_id[1]
        });
    }
    render() {
        if (!this._records) {
            return html `<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
        }
        return html `
      <div style="display: flex; flex-direction: column">
        ${this._records.map(r => html `<review-detail .actionHash=${r.signed_action.hashed.hash} style="margin-bottom: 16px;"></review-detail>`)}
      </div>
    `;
    }
};
__decorate([
    property()
], ReviewForPaper.prototype, "actionHash", void 0);
__decorate([
    state()
], ReviewForPaper.prototype, "_records", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], ReviewForPaper.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], ReviewForPaper.prototype, "appInfo", void 0);
ReviewForPaper = __decorate([
    customElement('review-for-paper')
], ReviewForPaper);
export { ReviewForPaper };
//# sourceMappingURL=review-for-paper.js.map