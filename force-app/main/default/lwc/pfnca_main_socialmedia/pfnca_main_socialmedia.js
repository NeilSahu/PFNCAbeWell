import { LightningElement } from 'lwc';
import social from '@salesforce/resourceUrl/WebsiteGeneralFiles';

export default class Pfnca_main_socialmedia extends LightningElement {

    blueIcons = true;
    WhiteIcons = false;

    blueTwitter = `${social}/WebsiteGeneralFiles/Twitter.svg`;
    blueFacebook = `${social}/WebsiteGeneralFiles/Facebook.svg`;
    blueInstragram = `${social}/WebsiteGeneralFiles/Instagram.svg`;

    whiteInstragram = `${social}/WebsiteGeneralFiles/Instagram.svg`;
    whiteTwitter = `${social}/WebsiteGeneralFiles/Twitter.svg`;
    whitefacebook = `${social}/WebsiteGeneralFiles/Facebook.svg`;

}