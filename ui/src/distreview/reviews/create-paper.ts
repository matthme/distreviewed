import { LitElement, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { InstalledCell, ActionHash, Record, AppWebsocket, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import { Paper } from './paper';
import '@material/mwc-button';
import '@material/mwc-textfield';


@customElement('create-paper')
export class CreatePaper extends LitElement {

  @state()
  _authors: string = "";

  @state()
  _title: string = "";

 @state()
 _doi: string = "";

  isPaperValid() {
    return this._authors && this._title;
  }

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async createPaper() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'distreview')!;

    const paper: Paper = {
      authors: [this._authors!],
      title: this._title!,
      doi: this._doi,
    };

    const record: Record = await this.appWebsocket.callZome({
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
    return html`
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Create Paper</span>

          <mwc-textfield style="margin: 5px" outlined label="author" @input=${(e: CustomEvent) => { this._authors = (e.target as any).value; } }></mwc-textfield>
          <mwc-textfield style="margin: 5px" outlined label="title" @input=${(e: CustomEvent) => { this._title = (e.target as any).value; } }></mwc-textfield>
          <mwc-textfield style="margin: 5px" outlined label="doi" @input=${(e: CustomEvent) => { this._doi = (e.target as any).value; } }></mwc-textfield>

        <mwc-button
          label="Create Paper"
          .disabled=${!this.isPaperValid()}
          @click=${() => this.createPaper()}
        ></mwc-button>
    </div>`;
  }
}
