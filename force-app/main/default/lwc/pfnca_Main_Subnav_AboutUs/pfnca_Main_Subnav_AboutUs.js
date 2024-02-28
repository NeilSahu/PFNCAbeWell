import { LightningElement,track,wire} from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

export default class Bwps_WIP_Subnav_AboutUs extends LightningElement {
    @track  HowItAllStarted = true;
    @track  ParkinsonD = false;
    @track  WaysToGive = false;

    @track active = "none";

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            this.cpr = currentPageReference;
            console.log('CPR Data:', this.cpr);
            this.active = this.cpr?.state?.active;
            console.log('CPR Active:', this.active);
            this.active = currentPageReference?.state?.active;
        }
        else {
            console.log("page reference not set");
        }
    }
    connectedCallback(){
        if(this.active == 'hias'){
            this.HowItAllStarted = true;
            this.ParkinsonD = false;
            this.WaysToGive = false;
        }
        else if(this.active == 'pp'){
            this.HowItAllStarted = false;
            this.ParkinsonD= true ;
            this.WaysToGive= false ;
        }
        else if(this.active == 'wtg'){
            this.HowItAllStarted = false;
            this.ParkinsonD= false ;
            this.WaysToGive= true ;
        }
    }

    pageChangeHandler(evt)
    {
        let pageId = evt.target.dataset.id;
        console.log('ComponentID:>>>>>>>>>',pageId);
        
        if(pageId == 'hias'){
            this.HowItAllStarted = true;
            this.ParkinsonD = false;
            this.WaysToGive = false;
        }
        else if(pageId == 'pp'){
            this.ParkinsonD= true ;
            this.HowItAllStarted = false;
            this.WaysToGive = false;
        }
        else if(pageId == 'wtg'){
            this.HowItAllStarted = false;
            this.ParkinsonD= false;
            this.WaysToGive= true;
        }
        const url = new URL(location);
        url.searchParams.set("active", pageId);
        history.pushState({}, "", url);
    }
}