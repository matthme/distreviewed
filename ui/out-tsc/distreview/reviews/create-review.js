import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import '@material/mwc-button';
import '@material/mwc-textarea';
import '@material/mwc-textfield';
let CreateReview = class CreateReview extends LitElement {
    isReviewValid() {
        return this._review;
    }
    async createReview() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'distreview');
        console.log("DOI: ", this.doi);
        console.log("review: ", this._review);
        console.log("paper hash: ", this.paperHash);
        console.log("paper hash: ", typeof this.paperHash);
        const reviewInput = {
            doi: this.doi,
            review: {
                review: this._review
            },
            paper_hash: this.paperHash,
        };
        const record = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'reviews',
            fn_name: 'create_review',
            payload: reviewInput,
            provenance: cellData.cell_id[1]
        });
        this.dispatchEvent(new CustomEvent('review-created', {
            composed: true,
            bubbles: true,
            detail: {
                actionHash: record.signed_action.hashed.hash
            }
        }));
    }
    render() {
        return html `
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Create Review</span>

          <mwc-textarea style="margin: 5px;" outlined label="Review" @input=${(e) => { this._review = e.target.value; }}></mwc-textarea>

        <mwc-button
          label="Create Review"
          .disabled=${!this.isReviewValid()}
          @click=${() => this.createReview()}
        ></mwc-button>
    </div>`;
    }
};
__decorate([
    state()
], CreateReview.prototype, "_review", void 0);
__decorate([
    property()
], CreateReview.prototype, "paperHash", void 0);
__decorate([
    property()
], CreateReview.prototype, "doi", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], CreateReview.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], CreateReview.prototype, "appInfo", void 0);
CreateReview = __decorate([
    customElement('create-review')
], CreateReview);
export { CreateReview };
//# sourceMappingURL=create-review.js.map