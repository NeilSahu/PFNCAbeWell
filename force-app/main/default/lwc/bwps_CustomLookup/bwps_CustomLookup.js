import { LightningElement,api } from 'lwc';
export default class Bwps_CustomLookup extends LightningElement {
    @api name;
    @api variant = "label-hidden";
    @api fieldLabel;
    @api childObjectApiName;
    @api targetFieldApiName;
    @api value;
    @api required = false;
    @api addToRecent = false;

    handleChange(event) {
        console.log('Get Event Value',event.detail.value[0]);
        let selectedEvent = new CustomEvent('valueselected', {detail: event.detail.value[0]});
        this.dispatchEvent(selectedEvent);

        // if (this.addToRecent) {
        //     if (event.detail.value.length > 0 && event.detail.value[0].length > 0) {
        //         addToRecentItems({
        //             recordId: event.detail.value[0]
        //         })
        //             .catch(error => {
        //                 console.log(error);
        //             });
        //     }
        // }
    }

    @api reportValidity() {
        if(this.required) {
            this.template.querySelector('lightning-input-field').reportValidity();
        }
    }

}