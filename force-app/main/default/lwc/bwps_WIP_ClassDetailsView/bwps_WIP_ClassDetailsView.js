import { LightningElement, api, track, wire } from 'lwc';
import imageResource from '@salesforce/resourceUrl/bwps_WIP_ClassDetailsViewLocked';
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
import { CurrentPageReference } from 'lightning/navigation';
import imageResource1 from '@salesforce/resourceUrl/WebsiteGenFaqImage';

export default class Bwps_WIP_ClassDetailsViewLocked extends LightningElement {

  
  backIcom = imageResource1 + "/chevron-1.svg";

  @api showfooter;

  @track classBackgroundImage;
  offclass = true;
  lockIcon = imageResource + '/lockIcon.png';
  @track highInt = highSignal;
  @track pageName;
  @track mediumInt = mediumSignal;
  @track logInt = lowSignal;
  high_seated = imageResource + '/3.png';
  like_icon = imageResource + '/like.png';
  share_icon = imageResource + '/shareIcon.png';
  @api scheduleclassname;
  @api scheduleclassinstname;
  @api scheduelclassdescription;
  @api scheduleclassintensity;
  @track intensityLogo;
  @api classdata;
  @api classviewtype;
  connectedCallback() {
    var intensity;
    if (this.scheduleclassintensity == 'Low/Seated') {
      intensity = this.logInt;
    }
    else if (this.scheduleclassintensity == 'Medium') {
      intensity = this.mediumInt;
    }
    else if (this.scheduleclassintensity == 'High/Active') {
      intensity = this.highInt;
    }
    this.intensityLogo = intensity;
    console.log('Instructor ID : parent>>>>>>>>>>>', this.scheduleclassname);
    console.log('Instructor name : parent>>>>>>>>>>>', this.scheduleclassinstname);
    console.log('Instructor profile : parent>>>>>>>>>>>', this.scheduelclassdescription);
    console.log('Instructor exp : parent>>>>>>>>>>>', this.scheduleclassintensity);


    if (this.classviewtype) {
      this.classBackgroundImage = `background-image: Url(${imageResource}/classBackgroungImage.png);background-color: #000000c5;`;
    }
    else {
      this.classBackgroundImage = `background-image: Url(${imageResource}/classBackgroungImage.png);background-color: #0002;`;
    }
    
  }
  backClickedHandle() {
    console.log('back clicked');
    this.dispatchEvent(new CustomEvent('classdetailreturn', {
      "detail": this.offclass,
      bubbles: true,
      composed: true
    }));
    console.log('back clicked end');
    // if(this.pageName == 'bwps_WIP_BrowseClasses__c'){

    // }
  }
  @wire(CurrentPageReference)
  getStateParameters(currentPageReference) {
    if (currentPageReference) {
      console.log('Stata>. ', currentPageReference.attributes.name);
      this.pageName = currentPageReference.attributes.name;
    }
  }

  doLogin() {
    if (this.pageName == 'bwps_WIP_BrowseClasses__c') {
      window.open('/PFNCADNA/s/bwps-wip-signin', '_self');
    }

  }
  clickLiveClass() {
    console.log('click Live');
    const selectEvent = new CustomEvent('selectlive', {
      bubbles: true,
      composed: true,
      detail: true
    });
    this.dispatchEvent(selectEvent);
  }
}