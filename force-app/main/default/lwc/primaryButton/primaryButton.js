import { LightningElement, api } from 'lwc';

export default class PrimaryButton extends LightningElement {

    @api btnData;
    @api btnLabel = 'Button';
    @api btnDisabled = false;
    @api btnClass = '';
    @api btnSize = 'small';

    get btnContainerClass() {
        if (this.btnSize == 'large') {
            return this.btnDisabled ? "box-button-large box-button-disabled " : "box-button-large box-button";
        } else {
            return this.btnDisabled ? "box-button-small box-button-disabled" : "box-button-small box-button";
        }
    }

    get buttonClass() {
        if (this.btnSize == 'large') {
            return this.btnClass ? "btn-large btn button-large-—-18pt-nocolor btn-label" + this.btnClass : "btn-large btn button-large-—-18pt-nocolor btn-label";
        } else {
            return this.btnClass ? "btn-small btn button-small-—-14pt-nocolor btn-label" + this.btnClass : "btn-small btn button-small-—-14pt-nocolor btn-label";
        }
    }

    handleonClick(event) {
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