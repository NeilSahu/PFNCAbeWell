import { LightningElement ,api} from 'lwc';
import Logo from '@salesforce/resourceUrl/WIPlogo';
import allIcons from '@salesforce/resourceUrl/BWPSPhotos';
import allFiles from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import heroImage from '@salesforce/resourceUrl/headerHeroImages';
import GetAboutUsPaltform from '@salesforce/apex/GetSliderSRecords.GetAboutUsPaltform';

export default class Bwps_WIP_ParkinsonPlatform extends LightningElement {
      heroImage = heroImage + '/headerPP.png';
        showimage;
        showtitle;
        showdescription;
    AboutParkinsonimage = `${allFiles}/WebsiteGeneralFiles/oldman.png`; 
    parkinsondisease = `${Logo}/WIPlogo/parkinsondisease.png`;
    WideImage=`${allFiles}/WebsiteGeneralFiles/Wide Image.png`; 
     @api AboutParkinsonimageagain = `${allIcons}/BWPSPhotos/group3.png `;
    get backgroundStyle() {
        return `background-size: cover;background-image:url(${this.WideImage})`;
    }
    handleVisit(){
        window.open('https://parkinsonfoundation.org');
    }
    connectedCallback() {
       GetAboutUsPaltform()
       .then((result) => {
           console.log('result' , result);
           if(result !=null && result!= undefined){
            this.showtitle = result[0].Title__c;
            this.showdescription = result[0].description__c;
            this.showimage = result[0].Photo_URL__c;
            if(this.showimage == undefined){
                this.showimage = this.AboutParkinsonimageagain;
            }
           }
       }).catch((err) => {
           console.log('error ',err);
           
       });
    }
}