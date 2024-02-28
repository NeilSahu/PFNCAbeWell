import { LightningElement,track,api } from 'lwc';
import myResource from '@salesforce/resourceUrl/DNAIcon';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import FavouriteInstructorImage1 from '@salesforce/resourceUrl/FavouriteInstructorImage1';
import markAsRead from '@salesforce/apex/Bwps_getuserNotification.markAsRead';
import { refreshApex } from '@salesforce/apex';
window.onload = function(){
    console.log('Onclick :');
    var get = document.getElementsByClassName('.notificationContainer');
    document.onclick = function(e){
        if(e.target.class !== 'onNotification'){
            get.style.display = 'none';
        }
    };
};
export default class NotificationComponent extends LightningElement {
    @track filterIcon = myResource+"/DNAIcons/filterIcon.png";
    @track levelIcon = myResource+"/DNAIcons/levelIcon.png";
    @track shareIcon = myResource+"/DNAIcons/shareIcon.png";
    @track userIcon = myResource+"/DNAIcons/userIcon.png";
    @track likeIcon = myResource+"/DNAIcons/likeIcon.png";
    doubletick =  `${allIcons}/PNG/Read.png `;
    @track showClassesOfWeek = false;
    @track visiblerecords = [];
    @api totalrecords =  [];
    @track isNotMarked = true;
    @track notificationId =[];

    
    // showHideHandler(event){
    //     let get = this.template.querySelector('.notificationContainer');
    //     if(event.target.classList !== 'onNotification'){
    //         get.style.display = 'none';
    //     }
    // }
    connectedCallback(){
   //  this.visibleRecords.push(this.totalRecords[0]);
        // var e = [...this.template.querySelector(".btn")];
         console.log(' totalRecords ',JSON.stringify(this.totalrecords));
        // console.log(this.template.querySelector(".btn"));
    }
    navigateToNotification(){
        window.open('/PFNCADNA/s/notificationpage','_self');
    }
    readNotificationHandler(event){
       // this.isNotMarked = false;
       event.stopPropagation();
       var notificationList =[this.totalrecords[0].id]
        const obj ={
         "notificationIds" : notificationList,
         "read" : true,
        }
       /// console.log("flag1>>> ",this.totalrecords[0].id);
       // this.notificationId.push(this.totalrecords[0].id)
    //    const obj ={
    //         read: true,
    //         notificationIds:['ae5b7329f8b46ef4bfe0f621fb43c0ce'],
    //     };

        // Console.log("DTAA1",obj);
        markAsRead({jsonstring:obj}).then(
            result =>{
                console.log("result1",result)
                    const selectedEvent = new CustomEvent('markasread', { 
                        detail:true
                        });
                    // Dispatches the event.
                    this.dispatchEvent(selectedEvent);
                }
        ).catch(error => {
            console.log('error>>> ',JSON.stringify(error),error.message);
        });
    }
}