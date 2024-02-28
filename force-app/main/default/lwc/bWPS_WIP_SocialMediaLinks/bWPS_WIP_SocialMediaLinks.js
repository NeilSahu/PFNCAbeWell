import { LightningElement,api } from 'lwc';
import social from '@salesforce/resourceUrl/WebsiteGeneralFiles';


export default class BWPS_WIP_SocialMediaLinks extends LightningElement {
    
     blueIcons = true;
     WhiteIcons = false;

    blueTwitter = `${social}/WebsiteGeneralFiles/Twitter.svg`;
    blueFacebook = `${social}/WebsiteGeneralFiles/Facebook.svg`;
    blueInstragram = `${social}/WebsiteGeneralFiles/Instagram.svg`;

    whiteInstragram = `${social}/WebsiteGeneralFiles/Instagram.svg`;
    whiteTwitter = `${social}/WebsiteGeneralFiles/Twitter.svg`;
    whitefacebook = `${social}/WebsiteGeneralFiles/Facebook.svg`;
}