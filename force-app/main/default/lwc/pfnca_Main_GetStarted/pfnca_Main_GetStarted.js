import { LightningElement, track } from 'lwc';
import imageResource from '@salesforce/resourceUrl/bwps_WIP_GetStarted';
import StayConnected from '@salesforce/resourceUrl/WebsiteGeneralFiles';


export default class Pfnca_Main_GetStarted extends LightningElement {

    @track StayConnectedButterfly = `${StayConnected}/WebsiteGeneralFiles/butterflyPng.png`;
    backgroundImage = `background-image: url(${this.StayConnectedButterfly})`;

    // sideImage = imageResource+'/sideImage.png';
    sideImageDesktop = imageResource + '/sideImageDesktop.png';
    sideImageMobile = imageResource + '/sideImageMobile.png';
    sideImageTablet = imageResource + '/sideImageTablet.png';
    colorBeeImage = imageResource + '/colorBeeImage.png';
    blueBeeImage = imageResource + '/blueBeeImage.png';
    handleGuest() {
        window.location.href = window.location.origin + '/pfnca/pfnca-main-login';
        // window.open('/PFNCADNA/s/bwps-wip-signin?guest=true');
    }
}