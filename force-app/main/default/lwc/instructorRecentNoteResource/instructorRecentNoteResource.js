import { LightningElement,track,wire,api } from 'lwc';
import getResources from '@salesforce/apex/DNA_InstructorClass.getResources';
// import Instructor_Dashboard_cardsImages from '@salesforce/resourceUrl/Instructor_Dashboard_cardsImages';
export default class InstructorRecentNoteResource extends LightningElement {
    wiredRes;
    @track Arr= [];
    // @track code = 494249160;
    months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    weeks=["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
    splitUpdatedDate;
    @wire(getResources)
    wiredRes({ error, data }) {
        if (data) {
            var data = data;
            console.log('OUTPUT : ',data);
            
            for(let i =0;i<2;i++){
                var intialDateObj = new Date(data[i].CreatedDate);
                this.weekday = this.weeks[intialDateObj.getDay()];
                var splitDay=intialDateObj.getDate();
                var splitMonth=this.months[intialDateObj.getMonth()];
                var splitYear= intialDateObj.getFullYear();
                this.splitUpdatedDate = splitMonth+" "+splitDay+","+" "+splitYear;
                var obj={
                    Name:'Resource '+[i+1],
                    Description:data[i].Description__c,
                    Link:"https://player.vimeo.com/video/"+data[i].BWPS_Link__c,
                    // Date : data[i].CreatedDate,
                }
                this.Arr.push(obj);
            }
        } else if (error) {
            var error = error;
        }
    }
}