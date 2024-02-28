import { LightningElement } from 'lwc';
import WomenImg from '@salesforce/resourceUrl/WomenImg';
export default class Bwps_ClassDetailsViewLocked extends LightningElement {

    get backgroundImage(){
        return `
        position:absolute;
        height:31rem;
        background-size:cover;
        background-repeat:no-repeat;
        background-image:url(${WomenImg})`;
    }
}