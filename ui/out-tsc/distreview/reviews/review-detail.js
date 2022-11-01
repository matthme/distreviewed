import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import '@material/mwc-circular-progress';
let ReviewDetail = class ReviewDetail extends LitElement {
    async firstUpdated() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'distreview');
        const record = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'reviews',
            fn_name: 'get_review',
            payload: this.actionHash,
            provenance: cellData.cell_id[1]
        });
        if (record) {
            this._review = decode(record.entry.Present.entry);
        }
    }
    render() {
        if (!this._review) {
            return html `<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
        }
        return html `
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Review</span>
		  <div style="display: flex; flex-direction: column">
		    <span><strong></strong></span>
		    <span style="white-space: pre-line">${this._review.review}</span>
		  </div>
      </div>
    `;
    }
};
__decorate([
    property()
], ReviewDetail.prototype, "actionHash", void 0);
__decorate([
    state()
], ReviewDetail.prototype, "_review", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], ReviewDetail.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], ReviewDetail.prototype, "appInfo", void 0);
ReviewDetail = __decorate([
    customElement('review-detail')
], ReviewDetail);
export { ReviewDetail };
//# sourceMappingURL=review-detail.js.map