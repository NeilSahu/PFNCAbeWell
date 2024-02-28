import { LightningElement ,api, track} from 'lwc';

export default class BWPS_EditBox extends LightningElement {
    @track card1 = false;
    @api notes = {};
    connectedCallback(){
       console.log('called bales ');
      this.ClickHandler();
       //console.log('NotesDetails ',notes);
    }
    @api ClickHandler() {

        // let id = this.template.querySelector(`[data-id='form-modal']`);
        // console.log("click handler11111111111111111111111>>>>>>>>>");
        // console.log(this.template.querySelector('.form-overlay'));
        // var selectComponent = this.template.querySelector('.form-overlay');
        // selectComponent.className = "form-overlay overlay-on";
        // console.log("click handler>>>>>>>>>");
        this.card1 = true;
    }
    off() {
        // this.template.querySelector(`[data-id='form-modal']`).style.display = "none";
        this.card1 = false;
    }
}