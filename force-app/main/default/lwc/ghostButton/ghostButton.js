import { LightningElement, api } from 'lwc';
export default class GhostButton extends LightningElement {

    @api btnLabel = 'Button';
    @api btnDisabled = false;
    @api btnClass = '';
    @api btnSize = 'small';

    get buttonClass() {
        if (this.btnSize == 'large') {
            return this.btnClass ? "btn-large btn button-large-—-18pt-nocolor" + this.btnClass : "btn-large btn button-large-—-18pt-nocolor";
        } else {
            return this.btnClass ? "btn-small btn button-small-—-14pt-nocolor" + this.btnClass : "btn-small btn button-small-—-14pt-nocolor";
        }
    }

    handleonClick(event) {

        this.template.querySelector('button').classList.toggle('active');

        const customEvent = new CustomEvent('click', {
            // detail: {
            //     message: 'any message'
            // }
            //bubbles: true,
            //composed: true
        })
        this.dispatchEvent(customEvent);
    }

}