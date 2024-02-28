import { LightningElement,track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

export default class Pfnca_Main_HowToParticipate extends LightningElement {

     @track  HowItWork = true;
    @track  TypeOfClasses = false;

    active = "none";

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            
           console.log("currentPageReference : ", currentPageReference);
            this.active = currentPageReference?.state?.active;
        
        }
        else {
            console.log("page reference not set");
        }
    }

    connectedCallback(){
        if(this.active == 'toc'){
            this.HowItWork = false;
            this.TypeOfClasses= true ;
        }
    }

    pageChangeHandler(evt)
    {
        let pageId = evt.target.dataset.id;
        console.log('ComponentID:>>>>>>>>>',pageId);
        
        if(pageId == 'hiw'){
            this.HowItWork = true;
            this.TypeOfClasses = false;
        }
        else if(pageId == 'toc'){
            this.HowItWork = false;
            this.TypeOfClasses= true ;
        }
    }


}