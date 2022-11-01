import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, ActionHash, Record, AppWebsocket, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import { Review, CreateReviewInput } from './review';
import '@material/mwc-button';
import '@material/mwc-textarea';
import '@material/mwc-textfield';

@customElement('create-review')
export class CreateReview extends LitElement {

  @state()
  _review: string
 | undefined;

  @property()
  paperHash: Uint8Array | undefined;

  @property()
  doi: string | undefined;

  isReviewValid() {
    return this._review;
  }

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;



  async createReview() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'distreview')!;
    console.log("DOI: ", this.doi);
    console.log("review: ", this._review);
    console.log("paper hash: ", this.paperHash);
    console.log("paper hash: ", typeof this.paperHash);
    const reviewInput: CreateReviewInput = {
      doi: this.doi!,
      review: {
        review: this._review!
      },
      paper_hash: this.paperHash!,
    };

    const record: Record = await this.appWebsocket.callZome({
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
    return html`
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Create Review</span>

          <mwc-textarea style="margin: 5px;" outlined label="Review" @input=${(e: CustomEvent) => { this._review = (e.target as any).value;} }></mwc-textarea>

        <mwc-button
          label="Create Review"
          .disabled=${!this.isReviewValid()}
          @click=${() => this.createReview()}
        ></mwc-button>
    </div>`;
  }
}
