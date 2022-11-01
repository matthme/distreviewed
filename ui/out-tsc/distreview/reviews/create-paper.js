import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import '@material/mwc-button';
import '@material/mwc-textfield';
let CreatePaper = class CreatePaper extends LitElement {
    constructor() {
        super(...arguments);
        this._authors = "";
        this._title = "";
        this._doi = "";
    }
    isPaperValid() {
        return this._authors && this._title;
    }
    async createPaper() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'distreview');
        const paper = {
            authors: [this._authors],
            title: this._title,
            doi: this._doi,
        };
        const record = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'reviews',
            fn_name: 'create_paper',
            payload: paper,
            provenance: cellData.cell_id[1]
        });
        this.dispatchEvent(new CustomEvent('paper-created', {
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
        <span style="font-size: 18px">Create Paper</span>

          <mwc-textfield style="margin: 5px" outlined label="author" @input=${(e) => { this._authors = e.target.value; }}></mwc-textfield>
          <mwc-textfield style="margin: 5px" outlined label="title" @input=${(e) => { this._title = e.target.value; }}></mwc-textfield>
          <mwc-textfield style="margin: 5px" outlined label="doi" @input=${(e) => { this._doi = e.target.value; }}></mwc-textfield>

        <mwc-button
          label="Create Paper"
          .disabled=${!this.isPaperValid()}
          @click=${() => this.createPaper()}
        ></mwc-button>
    </div>`;
    }
};
__decorate([
    state()
], CreatePaper.prototype, "_authors", void 0);
__decorate([
    state()
], CreatePaper.prototype, "_title", void 0);
__decorate([
    state()
], CreatePaper.prototype, "_doi", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], CreatePaper.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], CreatePaper.prototype, "appInfo", void 0);
CreatePaper = __decorate([
    customElement('create-paper')
], CreatePaper);
export { CreatePaper };
//# sourceMappingURL=create-paper.js.map