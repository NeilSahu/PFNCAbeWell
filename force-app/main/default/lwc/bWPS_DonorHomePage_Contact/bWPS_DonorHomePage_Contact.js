import { LightningElement } from 'lwc';
import BackgroundImageContact from '@salesforce/resourceUrl/BackgroundImageContact';
export default class BWPS_DonorHomePage_Contact extends LightningElement {
    BackgroundImageContact=BackgroundImageContact
    get backgroundStyle() 
    {
        return `background-image:url(${BackgroundImageContact})`;
    }
}