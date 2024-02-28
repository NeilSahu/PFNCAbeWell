import { LightningElement,track,wire,api } from 'lwc';
import InstructorNotes from '@salesforce/apex/BWPS_InstructorNotes.InstructorNotes';
// import FavouriteInstructorImage1 from '@salesforce/resourceUrl/FavouriteInstructorImage1';
import userImage from '@salesforce/resourceUrl/Usericon';
import getNotesData from '@salesforce/apex/BWPS_NotesData.getNotesData'; 
export default class InstructorAnnouncementSection extends LightningElement {
    @track userImage = userImage;
    @track splitUpdatedDate;
    @track body;
    title;
    NotesAvailable= false;
    body1
    months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    
    connectedCallback(){
            getNotesData()
            .then(result=>{
                var result = result;
                if(result.length > 0){
                 this.NotesAvailable = true;
                var date = new Date(result[0].CreatedDate);
                var splitDay=date.getDate();
                var splitMonth=this.months[date.getMonth()];
                var splitYear= date.getFullYear();
                this.splitUpdatedDate = splitMonth+" "+splitDay+","+" "+splitYear;
                this.body =result[0].Body.split('#');
                this.title = result[0].Title;
                if( this.body[1] != null && this.body[1] !=''){
                    this.body1 = this.body[1];
                }
                else{
                    this.body1 = result[0].Body;
                }
                console.log('title ',this.title);
                console.log('body ',result[0].Body);
                console.log('OUTPUT 1: ',this.body[0]);
                console.log('OUTPUT 2: ',this.body[1]);
                }
                else{
                     this.NotesAvailable = false;
                }
                
            })
            .catch(error => {
                this.error = error;
                console.log('error ', this.error)
            });
        }
    handleNotes(){
        window.open('/PFNCADNA/s/yournotes','_self');
    }      
}