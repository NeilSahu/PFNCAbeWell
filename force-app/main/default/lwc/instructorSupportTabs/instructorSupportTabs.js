import { LightningElement, track } from 'lwc';
export default class InstructorSupportTabs extends LightningElement {


    @track Resources = true;
    contact = false;
    Faqs = false;
    agreement = false;
    @track textHeading;


    handleAgreement() {
        console.log("agreement");
        this.agreement = true;
        this.Resources = false;
        this.contact = false;
        this.Faqs = false;
    }

    handleResources() {
        this.Resources = true;
        this.contact = false;
        this.Faqs = false;
        this.agreement = false;
    }

    handleFaq() {

        this.Faqs = true;
        this.textHeading = 'Still have questions?';
        this.contact = false;
        this.Resources = false;
        this.agreement = false;


    }

    handleContact() {
        this.contact = true;
        this.textHeading = 'Have questions?';
        this.Resources = false;
        this.Faqs = false;
        this.agreement = false;
    }

}