import { LightningElement, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiRecordApi';
export default class GuestUserYourProfilePage1 extends LightningElement {
    
    @track selectedCountry;
    @track selectedState;
    @track countries = [];
    @track states = [];

    connectedCallback() {
        this.getCountries();
    }

    async getCountries() {
        const objectInfo = await getObjectInfo({ objectApiName: 'Account' });
        this.countries = objectInfo.picklistFields.BillingCountry.picklistValues;
    }

    handleCountryChange(event) {
        this.selectedCountry = event.target.value;
        this.getStates();
    }

    async getStates() {
        const objectInfo = await getObjectInfo({ objectApiName: 'Account' });
        this.states = objectInfo.picklistFields.BillingState.picklistValues
            .filter(value => value.validFor.includes(this.selectedCountry));
    }
}