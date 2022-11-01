import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import '@material/mwc-circular-progress';
import './paper-detail';
let AllPapers = class AllPapers extends LitElement {
    async firstUpdated() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'distreview');
        this._records = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'reviews',
            fn_name: 'get_all_papers',
            payload: null,
            provenance: cellData.cell_id[1]
        });
    }
    createPaper() {
        this.dispatchEvent(new CustomEvent('create-paper', {
            composed: true,
            bubbles: true,
        }));
    }
    render() {
        if (!this._records) {
            return html `<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
        }
        return html `
      <div style="display: flex; flex: 1; flex-direction: column; align-items: center;">
        <h1 style="font-family: 'Space Mono'; color: #183E29">Papers</h1>
        <div><button @click=${this.createPaper}>Create Paper</button></div>
      </div>
      <div style="display: flex; flex-direction: row; justify-content: flex-start;">
        ${this._records.map(r => html `<paper-detail .actionHash=${r.signed_action.hashed.hash} style="margin-bottom: 16px;"></paper-detail>`)}
      </div>
    `;
    }
};
__decorate([
    state()
], AllPapers.prototype, "_records", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], AllPapers.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], AllPapers.prototype, "appInfo", void 0);
AllPapers = __decorate([
    customElement('all-papers')
], AllPapers);
export { AllPapers };
//# sourceMappingURL=all-papers.js.map