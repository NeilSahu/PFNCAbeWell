import { api, LightningElement, wire } from 'lwc';
import {CurrentPageReference} from 'lightning/navigation';
import ImageURL from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import allIcons from '@salesforce/resourceUrl/BWPSPhotos';
import getUserProfileName from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
export default class Bwps_WIP_DynamicHero  extends LightningElement {
      @api title = '';
    @api description = 'Our company and mission';
    @api buttontext = 'Get Guest Pass';
    @api isdescription = false;
    @api isbutton = false;
    guestButton= true;
    //ImageUrl = 'https://i.dailymail.co.uk/i/pix/2017/07/18/14/427394C200000578-0-image-a-24_1500384481554.jpg';
    @api imgUrl = `${ImageURL}/WebsiteGeneralFiles/bg3.png`;
      @api bannerimage = `${allIcons}/BWPSPhotos/group5.jpg `;
    get backgroundStyle() {
        return `
                background-image: url("${this.imgUrl}");`;
    }
    // connectedCallback() {
    //     try{
    //         let currentUrl = window.location.href;
    //         let get = this.template.querySelector('.submit-button-parent-div');
    //         if(currentUrl.includes('guestuserbrowseclasses')){
    //             get.style.display = 'none';
    //         }
    //     }
    //     catch(e){
    //         console.log('Error aa ri : ',e,e.message);
    //     }
    // }
    
    @wire(getUserProfileName)
    getUserProfile({data,error}){
        if(data){
            if(data.Profile.Name == 'Guest User' || data.Profile.Name == 'Member User'){
                let get = this.template.querySelector('.submit-button-parent-div');
                console.log('get okay : ',get);
                function getCurrentURL () {
                    return window.location.href
                }
                const url = getCurrentURL();
                console.log('Url',url);
                if(url.includes('guest')){
                    this.guestButton = false;
                } 
                else{
                    this.guestButton = true;
                }
                //get.style.display = 'none';
            }
        }
        if(error){
            console.log('Error : ',error);
        }
    }
}