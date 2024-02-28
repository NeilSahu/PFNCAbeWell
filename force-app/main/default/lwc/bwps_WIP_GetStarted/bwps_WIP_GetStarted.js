import { LightningElement } from 'lwc';
import imageResource from '@salesforce/resourceUrl/bwps_WIP_GetStarted';

export default class Bwps_WIP_GetStarted extends LightningElement {

    // sideImage = imageResource+'/sideImage.png';
    sideImage = imageResource+'/sideImage2x.png';
    colorBeeImage = imageResource+'/colorBeeImage.png';
    handleGuest(){
        window.location.href = window.location.origin + '/PFNCADNA/bwps-wip-signin?guest=true';
        // window.open('/PFNCADNA/s/bwps-wip-signin?guest=true');
    }
}