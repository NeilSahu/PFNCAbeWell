import { LightningElement,track } from 'lwc';
//import HowItWorksTab from '@salesforce/resourceUrl/HowItWorksTab';
import HowItWorksTab from '@salesforce/resourceUrl/HowItWorksTab';
import InstaLogo from '@salesforce/resourceUrl/InstaLogo';
import TwitterLogo  from '@salesforce/resourceUrl/twitterLogo';
import FacebookLogo from '@salesforce/resourceUrl/facebookLogo';

export default class BWPS_HowItWorksTabComponent extends LightningElement {

    // @track HowItWorksTabImage=HowItWorksTab;
    @track instaLogo=InstaLogo;
    @track twitterLogo=TwitterLogo;
    @track facebookLogo=FacebookLogo;

    get backgroundStyle() {
        return `
        position:relative;
        height: 20rem;
        background-size: cover;
        background-repeat: no-repeat;
        background-image:url(${HowItWorksTab});`;
    }

}