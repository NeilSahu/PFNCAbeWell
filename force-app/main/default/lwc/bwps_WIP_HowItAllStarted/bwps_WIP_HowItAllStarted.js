import { LightningElement,track,wire,api} from 'lwc';
import ABOUT_US_IMAGE from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import istoimage from '@salesforce/resourceUrl/istoimage';
import allIcons from '@salesforce/resourceUrl/BWPSPhotos';
import Logo from '@salesforce/resourceUrl/WIPlogo';
import getAboutUsFaq from '@salesforce/apex/bwps_websiteGeneralFaqClass.getAboutUsFaq';
import GetAboutUs from '@salesforce/apex/GetSliderSRecords.GetAboutUs';
import heroImage from '@salesforce/resourceUrl/headerHeroImages';

export default class Bwps_WIP_HowItAllStarted extends LightningElement {
        aboutus = `${Logo}/WIPlogo/aboutus.png`;
          heroImage = heroImage + '/heaserHIAS.png';
          FirstImage ='';
          FirstTitle;
          FirstDescription;
          SecondImage ='';
          SecondTitle;
          SeondDescription;
        aboutUsImage = `${ABOUT_US_IMAGE}/WebsiteGeneralFiles/hands-image.png `;
        participateImg= `${Logo}/WIPlogo/photo-grid.png `;
        @api aboutusimg = `${allIcons}/BWPSPhotos/group3.png `;
        @api istoimageagain = `${allIcons}/BWPSPhotos/group4.jpg `;
        @track istoimage =istoimage;
        @track Gallery = [
                {'image' : `${ABOUT_US_IMAGE}/WebsiteGeneralFiles/running.jpg `,'count':1},
                {'image' : `${ABOUT_US_IMAGE}/WebsiteGeneralFiles/running.jpg `,'count':2},
                {'image' : `${ABOUT_US_IMAGE}/WebsiteGeneralFiles/running.jpg `,'count':3},
                {'image' : `${ABOUT_US_IMAGE}/WebsiteGeneralFiles/running.jpg `,'count':4},
                {'image' : `${ABOUT_US_IMAGE}/WebsiteGeneralFiles/running.jpg `,'count':5},
                {'image' : `${ABOUT_US_IMAGE}/WebsiteGeneralFiles/running.jpg `,'count':6},
                {'image' : `${ABOUT_US_IMAGE}/WebsiteGeneralFiles/running.jpg `,'count':7},
                {'image' : `${ABOUT_US_IMAGE}/WebsiteGeneralFiles/running.jpg `,'count':8},
                {'image' : `${ABOUT_US_IMAGE}/WebsiteGeneralFiles/running.jpg `,'count':9}
        ];
        get backgroundStyle() {
                return `background: url(${this.istoimage});`;
                }
        Subscribe(){
                window.open('/PFNCADNA/s/bwps-wip-signin','_self');
        }     
        data; 

        @wire(getAboutUsFaq)
        wiredFAQ({data,error}){
                if(data){
                        this.data = data;
                        console.log('faqData : ',JSON.stringify(this.data));
                }
                else if(error){
                        console.log('OUTPUTError : ',error.message, error, JSON.stringify(error));
                }
        } 
        
         handleDetailsToggle(event){    
                const allDetails = this.template.querySelectorAll('details');
                if(event.target.open){
                        allDetails.forEach(ele => {
                        if(ele != event.target && ele.open){
                        ele.open = false;
                        }
                        });
                }
        }
        connectedCallback() {
             GetAboutUs()
             .then((result) => {
                     console.log('result ', result);
                     if(result != null && result != undefined){
                      this.FirstTitle = result[0].Title__c;
                      this.FirstDescription = result[0].description__c;
                      this.FirstImage = result[0].Photo_URL__c;
                      this.SecondTitle = result[1].Title__c;
                      this.SeondDescription = result[1].description__c;
                      this.SecondImage = result[1].Photo_URL__c;
                      if(this.FirstImage == undefined){
                          this.FirstImage = this.aboutusimg;
                      }
                      if(this.SecondImage == undefined)
                      {
                            this.SecondImage = this.participateImg;
                      }
                     }
                     
             }).catch((err) => {
                     console.log('error ' ,err);
             });   
        }
}