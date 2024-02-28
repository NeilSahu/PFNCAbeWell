import { LightningElement } from 'lwc';
import ImageURL from '@salesforce/resourceUrl/WebsiteGeneralFiles';

//  import ParkinsonBoxing from '@salesforce/resourceUrl/WebsiteGeneralFiles/WebsiteGeneralFiles/BoxingLady.png';


export default class Bwps_WIP_BecomeAMember extends LightningElement {
    signupImage = `${ImageURL}/WebsiteGeneralFiles/BoxingLady.png`;
    get backgroundStyle() {
        return `height:100%;width:50%;background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        position: absolute;background-image:url(${this.signupImage})`;
    }
    handleClick(){
        console.log('handleClick');
        const form = this.template.querySelector('.form');
        const formData = new FormData(form);
        const json=JSON.stringify(Object.fromEntries(formData));
        console.log(json);
        // console.log('---------------------------------------------');
        // for (const [key, value] of formData) {
        //     console.log(`----${key}----: ${value}\n`);
        //   }
        // console.log('---------------------------------------------');

        // for (const pair of formData.entries()) {
        //     console.log(`-------${pair[0]}------, ${pair[1]}`);
        // }
    }

    get loginLink(){
        return '/PFNCADNA/s/bwps-wip-signin';
    }
}