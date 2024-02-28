import { LightningElement,track } from 'lwc';
import myResource from '@salesforce/resourceUrl/DNAIcon';
import myImage from '@salesforce/resourceUrl/ExerciseImage';

export default class FavoriteComponent extends LightningElement {
    @track filterIcon = myResource+"/DNAIcons/filterIcon.png";
    @track levelIcon = myResource+"/DNAIcons/levelIcon.png";
    @track shareIcon = myResource+"/DNAIcons/shareIcon.png";
    @track userIcon = myResource+"/DNAIcons/userIcon.png";
    @track likeIcon = myResource+"/DNAIcons/likeIcon.png";
    @track ExerciseImage = myImage;
    @track showClassesOfWeek = false;
    @track visibleRecords = [];
    @track totalRecords = [
            {id : "1", image : this.ExerciseImage , Name : "Kirsten Bodensteiner", Active__c : "2 days ago", Message__c : "Class cancelled today. Please join me next week!"},
            {id : "2", image : this.ExerciseImage , Name : "Kirsten Bodensteiner", Active__c : "3 days ago", Message__c : "Class cancelled today. Please join me next week!"},
            {id : "3", image : this.ExerciseImage , Name : "Kirsten Bodensteiner", Active__c : "4 days ago", Message__c : "Class cancelled today. Please join me next week!"}
        ];
    connectedCallback(){
        this.visibleRecords = this.totalRecords;
        this.totalNotifications = this.totalRecords.length;
        // var e = [...this.template.querySelector(".btn")];
        // console.log(e,' EEE');
        // console.log(this.template.querySelector(".btn"));
    }
}