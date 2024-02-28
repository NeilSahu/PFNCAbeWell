import { LightningElement } from 'lwc';
import { publish, subscribe, unsubscribe, createMessageContext, releaseMessageContext } from 'lightning/messageService';
import SENDDATA from "@salesforce/messageChannel/VimeoOff__c";
import ImageURL from '@salesforce/resourceUrl/WebsiteGeneralFiles';
export default class Bwps_WIP_Footer extends LightningElement {
    context = createMessageContext();
    subscription = null;
    facebook_logo = `${ImageURL}/WebsiteGeneralFiles/Facebook.svg`;
    insta_logo= `${ImageURL}/WebsiteGeneralFiles/Instagram.svg`;
    twitter_logo = `${ImageURL}/WebsiteGeneralFiles/Twitter.svg`;

    get currentYear(){
        let date = new Date();

        return date.getFullYear();
    }
    navigateToGuestPass() {
        let message = {
            isGuest : true
        };
        publish(this.context, SENDDATA, message);
    }
}