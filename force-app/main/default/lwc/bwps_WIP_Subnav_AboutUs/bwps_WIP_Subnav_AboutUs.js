import { LightningElement,track} from 'lwc';

export default class Bwps_WIP_Subnav_AboutUs extends LightningElement {
    @track  HowItAllStarted = true;
    @track  ParkinsonD = false;

    pageChangeHandler(evt)
    {
        let pageId = evt.target.dataset.id;
        console.log('ComponentID:>>>>>>>>>',pageId);
        
        if(pageId == 'hias'){
            this.HowItAllStarted = true;
            this.ParkinsonD = false;
        }
        else if(pageId == 'pp'){
            this.HowItAllStarted = false;
            this.ParkinsonD= true ;
        }
    }
}