import { LightningElement, track } from 'lwc';
import myImage from '@salesforce/resourceUrl/ExerciseImage';

export default class ProfileMenuMobile extends LightningElement {
    @track ExerciseImage = myImage;
    @track totalRecords = [
        {id : "1", image : this.ExerciseImage , Name : "Kirsten Bodensteiner"}
    ];
    connectedCallback(){
        this.visibleRecords = this.totalRecords;
        this.totalNotifications = this.totalRecords.length;
        // var e = [...this.template.querySelector(".btn")];
        // console.log(e,' EEE');
        // console.log(this.template.querySelector(".btn"));
    }
}