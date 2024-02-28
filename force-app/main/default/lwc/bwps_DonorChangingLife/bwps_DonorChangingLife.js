import { LightningElement,track,api,wire } from 'lwc';
import ImageURL from '@salesforce/resourceUrl/WebsiteGeneralFiles';
export default class Bwps_DonorChangingLife extends LightningElement {
    ImgUrl = `${ImageURL}/WebsiteGeneralFiles/blog_photo.png`;
    USAimg = `${ImageURL}/WebsiteGeneralFiles/usimg.png`;
    WORLDimg =  `${ImageURL}/WebsiteGeneralFiles/worldimg.png`;
    get backgroundStyle() {
        return `
        width: 100%;
        /* height: 250px; */
        position: relative;
        background: url("${this.ImgUrl}");
        background-size: cover;
        background-position: 50% 50%;
        background-color: #000000ab;
        background-blend-mode: color;`;
    }
    handleClick(){
        const paymentComp = this.template.querySelector('c-bwps_-Donor-Dashboard-Donate-Form');
        paymentComp.donateClickHandler();
    }
}