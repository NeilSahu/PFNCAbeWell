import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
export default class Pfnca_Main_Subnav_BrowseClasses extends LightningElement {
    @track ClassesOnDemand = false;
    @track LiveClassSchedule = true;
    @track Instructors = false;

    cpr;
    active = 'none';
    classId = '';
    intensityURL = '';
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            this.cpr = currentPageReference;
            console.log('CPR Data:', JSON.stringify(this.cpr));
            this.active = this.cpr?.state?.active;
            this.classId = this.cpr?.state?.cls;
            console.log('this.classId current ref', this.classId);
            console.log('CPR Active:', this.active);
            this.intensityURL = this.cpr?.state?.app;
            //this.intensityURL = window.atob(tempint);
            console.log(' this.intensityURL current ref', this.intensityURL);
        }
        else {
            console.log("page reference not set");
        }
    }
    connectedCallback() {

        const param = 'cid';
        this.selectedClassId = this.getUrlParamValue(window.location.href, param);
        console.log('selectedClassId: ', this.selectedClassId);

        if (this.selectedClassId != null && this.selectedClassId != '') {
            console.log('selectedClassId: ', this.selectedClassId);

            this.ClassesOnDemand = true;
            this.LiveClassSchedule = false;
            this.Instructors = false;
        }


        if (this.active == 'cod') {
            this.ClassesOnDemand = true;
            this.LiveClassSchedule = false;
            this.Instructors = false;
        }
        else if (this.active == 'lcs') {
            this.ClassesOnDemand = false;
            this.LiveClassSchedule = true;
            this.Instructors = false;
        }
        else if (this.active == 'ins') {
            this.ClassesOnDemand = false;
            this.LiveClassSchedule = false;
            this.Instructors = true;
        }
    }

     getUrlParamValue(url, key) {
        return new URL(url).searchParams.get(key);
    }

    
    pageChangeHandler(evt) {
        let pageId = evt.target.dataset.id;
        console.log('ComponentID:>>>>>>>>>', pageId);

        if (pageId == 'cod') {
            this.ClassesOnDemand = true;
            this.LiveClassSchedule = false;
            this.Instructors = false;
        }
        else if (pageId == 'lcs') {
            this.ClassesOnDemand = false;
            this.LiveClassSchedule = true;
            this.Instructors = false;
        }
        else if (pageId == 'ins') {
            this.ClassesOnDemand = false;
            this.LiveClassSchedule = false;
            this.Instructors = true;
        }
    }
    // constructor() {
    //     super();
    //     this.addEventListener('selectlive', this.selectlive.bind(this));      
    // }
    LiveClassSchedule() {
        console.log('LiveClassSchedule>>> ');
        this.ClassesOnDemand = false;
        this.LiveClassSchedule = true;
        this.Instructors = false;
    }

}