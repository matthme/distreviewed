import { __decorate } from "tslib";
import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AppWebsocket, } from '@holochain/client';
import { contextProvider } from '@lit-labs/context';
import '@material/mwc-circular-progress';
import { appWebsocketContext, appInfoContext } from './contexts';
import './distreview/reviews/create-review';
import './distreview/reviews/create-paper';
import './distreview/reviews/all-papers';
import './distreview/reviews/paper-page';
// import "@fontsource/space-mono";
var PageView;
(function (PageView) {
    PageView[PageView["AllPapers"] = 0] = "AllPapers";
    PageView[PageView["Paper"] = 1] = "Paper";
    PageView[PageView["CreateReview"] = 2] = "CreateReview";
    PageView[PageView["CreatePaper"] = 3] = "CreatePaper";
})(PageView || (PageView = {}));
let HolochainApp = class HolochainApp extends LitElement {
    constructor() {
        super(...arguments);
        this.loading = true;
        this.pageView = PageView.AllPapers;
    }
    async firstUpdated() {
        this.appWebsocket = await AppWebsocket.connect(`ws://localhost:${process.env.HC_PORT}`);
        this.appInfo = await this.appWebsocket.appInfo({
            installed_app_id: 'distreviewed',
        });
        this.loading = false;
    }
    selectPaper(e) {
        this._selectedPaperHash = e.detail;
        this.pageView = PageView.Paper;
    }
    createReview(e) {
        this._selectedPaperHash = e.detail.actionHash;
        this._selectedDoi = e.detail.paper.doi;
        this.pageView = PageView.CreateReview;
    }
    renderContent() {
        if (this.pageView == PageView.AllPapers) {
            return html `
      <div style="display: flex; flex-direction: column; width: 50%;">
        <all-papers @create-paper=${() => this.pageView = PageView.CreatePaper} @paper-selected=${(e) => this.selectPaper(e)}></all-papers>
      </div>
      `;
        }
        else if (this.pageView == PageView.Paper) {
            return html `<paper-page .actionHash=${this._selectedPaperHash} @create-review=${(e) => this.createReview(e)}></paper-page>`;
        }
        else if (this.pageView == PageView.CreatePaper) {
            return html `<create-paper @paper-created=${() => this.pageView = PageView.AllPapers}></create-paper>`;
        }
        else if (this.pageView == PageView.CreateReview) {
            return html `<create-review .paperHash=${this._selectedPaperHash}, .doi=${this._selectedDoi} @review-created=${() => this.pageView = PageView.Paper}></create-review>`;
        }
    }
    render() {
        if (this.loading) {
            return html `
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      `;
        }
        else {
            return html `
        <main style="width: 100%;">

        <div class="title-bar">
          <h1>Distreviewed</h1>
        </div>
          ${this.renderContent()}
        </main>
      `;
        }
    }
};
HolochainApp.styles = css `
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      color: #183E29;
      margin: 0 auto;
      text-align: center;
      background-color: var(--lit-element-background-color);
      background: #FCF1E9;
    }

    main {
      flex-grow: 1;
    }

    .title-bar {
      border: 2px solid #183E29;
      box-shadow: 9px 12px #183E29;
      background: #FCF1E9;
      font-family: 'Space Mono';
      margin: 10px 40px;
    }

    .app-footer {
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;
__decorate([
    state()
], HolochainApp.prototype, "loading", void 0);
__decorate([
    contextProvider({ context: appWebsocketContext }),
    property({ type: Object })
], HolochainApp.prototype, "appWebsocket", void 0);
__decorate([
    contextProvider({ context: appInfoContext }),
    property({ type: Object })
], HolochainApp.prototype, "appInfo", void 0);
__decorate([
    state()
], HolochainApp.prototype, "pageView", void 0);
__decorate([
    state()
], HolochainApp.prototype, "_selectedPaperHash", void 0);
__decorate([
    state()
], HolochainApp.prototype, "_selectedDoi", void 0);
HolochainApp = __decorate([
    customElement('holochain-app')
], HolochainApp);
export { HolochainApp };
//# sourceMappingURL=holochain-app.js.map