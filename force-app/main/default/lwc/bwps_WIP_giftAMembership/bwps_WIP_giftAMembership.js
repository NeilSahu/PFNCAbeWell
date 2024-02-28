import { LightningElement } from 'lwc';
import imageResource from '@salesforce/resourceUrl/bwps_WIP_giftAMembership';
import CreateMember from '@salesforce/apex/BWPS_WIP_GiftMembershipHelper.CreateMember';
export default class Bwps_WIP_giftAMembership extends LightningElement {

    paypalLogo = imageResource + '/paypal.png';
    visaLogo = imageResource + '/visa.png';
    downArrow = imageResource + '/downArrow.png';

    //for populating background image url to info-header div
    infoHeaderStyle =  `background-image: url(${imageResource}/infoBackground.png)`;
    //----
  
    newsLetterChecked = false;
    handleNewsLetterCheck(){
        this.newsLetterChecked = this.newsLetterChecked ? false : true;
    }


    connectedCallback(){
        // console.log('------------111111111111111111----------------',imageResource);
        // console.log('---------------2222222222222222-------------',imageResource+'/infoBackground.png');
    }


    handleSubmit(){
        //const form = this.template.querySelector('.form-2');
        const formData = new FormData(this.template.querySelector('.form-2'));
        const MemberData = JSON.stringify(Object.fromEntries(formData));
        CreateMember({memberDetails :MemberData })
        .then(result=>{
            console.log('result ',result);

        })
        .catch(error=>{
              console.log('error ',error);
        });
        console.log('---------------------------------------------');
        for (const [key, value] of formData) {
            console.log(`----${key}----: ${value}\n`);
          }
        console.log('---------------------------------------------');

        for (const pair of formData.entries()) {
            console.log(`-------${pair[0]}------, ${pair[1]}`);
          }

          console.log('---------------------------------------------');
        //   console.table( formData);
        //   console.log('---------------------------------------------');

        
    }

   
}