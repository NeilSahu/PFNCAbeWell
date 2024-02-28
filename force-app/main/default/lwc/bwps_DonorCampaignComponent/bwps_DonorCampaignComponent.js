import { LightningElement,track,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import DonorDash from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import imageResoure from '@salesforce/resourceUrl/WebsiteGeneralHeader';

import fetchUserDetail from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
import campaignDetails from '@salesforce/apex/BWPS_campaigndetails.campaignDetails'
export default class Bwps_DonorCampaignComponent extends NavigationMixin(LightningElement) {
    // cam = `${DonorDash}/WebsiteGeneralFiles/blog_1.png`;

    bg1 = imageResoure + '/bg1.png';
    bg2 = imageResoure + '/bg2.png';
    @track userData
    @track userName
    @track name;
    @track Description ; 
    // error
    showdata = false;
    showModal1 = false;
     @wire(fetchUserDetail)
     wiredUser({ error, data }) {
         if (data) {
             this.userData = data;
             console.log('data>>>',data);
             //this.profileImg = this.userData.MediumPhotoUrl;
             this.userName = this.userData.Name;
         } else if (error) {
            //  this.error = error;
             console.log('erroeeee>>>',error);
         }
     }
     connectedCallback(){
        campaignDetails()
        .then(result=>{
            console.log('resultt : ',JSON.stringify(result));
            this.name = result[0].Name;
            this.Description = result[0].Description;
        })
        .catch(error=>{
            console.log('error : ',JSON.stringify(error),error,error.message);
        })
     }

     redirectToAboutUs(){
        // console.log('test Neha check 1');
        // this[NavigationMixin.Navigate]({
        //     type: 'comm__namedPage',
        //     attributes: {
        //         pageName: 'bwps-wip-aboutus'
        //     },
        // });
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://parkinsonfoundation.org/'
            },
        });
    }
}