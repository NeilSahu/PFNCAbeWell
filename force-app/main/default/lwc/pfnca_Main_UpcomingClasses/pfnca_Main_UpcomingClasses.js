import { LightningElement,track,wire,api} from 'lwc';
import myResource from '@salesforce/resourceUrl/DNAIcon';
import favIcon from '@salesforce/resourceUrl/likeButton';
import unFavIcon from '@salesforce/resourceUrl/unlikeIcon'
import myImage from '@salesforce/resourceUrl/ExerciseImage';
//import userIcon from '@salesforce/resourceUrl/UserLogo';
//high signal
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
//low signal
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
//medium signal
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';
// import calendarlogo from '@salesforce/resourceUrl/calendarlogo';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import likeIconOrange from  '@salesforce/resourceUrl/WebsiteGeneralFiles';
import Instructor from '@salesforce/resourceUrl/InstructorLogo';
import allEntitySubs from '@salesforce/apex/DNA_GuestUserClass.allEntitySubs';
import follow from '@salesforce/apex/DNA_GuestUserClass.follow';
import BWPS_GetUpcomingClasses from '@salesforce/apex/BWPS_GuestUserHistoryClass.BWPS_GetUpcomingClasses';
export default class Pfnca_Main_UpcomingClasses extends LightningElement {
    @track filterIcon = myResource+"/DNAIcons/filterIcon.png";
    @track levelIcon = myResource+"/DNAIcons/levelIcon.png";
    // @track share = shareIcon;
    @track lowSignal = lowSignal;
    @track highSignal = highSignal ;
    @track mediumSignal = mediumSignal;
    @track calendarlogo =  `${allIcons}/PNG/Calendar.png `;
    @track userIcon = Instructor; //myResource+"/DNAIcons/InstructorLogo.png";
    @track likeIcon = myResource+"/DNAIcons/likeIcon.png";
    //@track favIcon = favIcon;
    @track unFavIcon = `${allIcons}/PNG/unfavorite.png `;
    @track favIcon =  `${allIcons}/PNG/Favorite.png `;
    // @track unFavIcon = unFavIcon;
    //@track unFavIcon = likeIconOrange + '/WebsiteGeneralFiles/like.png';
    @track ExerciseImage = myImage;
    @track showClassesOfWeek = false;
    @track showLiveLine = true;
    @track showInPersonLine = false;
    @track userImg =  `${allIcons}/PNG/Instructor-Image.png `;
    @track JSONArray = [];
    @track currentPage = [];
    page;
    pageSize = 3;
    arr = [1,3,4,5,6,6]
    time1;
    time2;
    wiredClass;
    count;
    time;
    //@track visibleRecords = [{id : "1", src : "https://cyntexa-2f6-dev-ed.lightning.force.com/sfc/servlet.shepherd/version/download/0685j00000BDk4TAAT?operationContext=S1" , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore"},{id : "2", src : "https://cyntexa-2f6-dev-ed.lightning.force.com/sfc/servlet.shepherd/version/download/0685j00000BDk4TAAT?operationContext=S1" , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore"},{id : "3", src : "https://cyntexa-2f6-dev-ed.lightning.force.com/sfc/servlet.shepherd/version/download/0685j00000BDk4TAAT?operationContext=S1" , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore"},{id : "4", src : "https://cyntexa-2f6-dev-ed.lightning.force.com/sfc/servlet.shepherd/version/download/0685j00000BDk4TAAT?operationContext=S1" , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore"}]
    @track visibleRecords = [{id : "1", src : this.ExerciseImage , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore",ClassStatus__c : "JOIN"},
        {id : "2", src : this.ExerciseImage , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore",ClassStatus__c : "JOIN"},
        {id : "3", src : this.ExerciseImage , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore",ClassStatus__c : "JOIN"}
    ]
    day;
    ButtonStatus;
    @track timeList=['7 AM-8 AM','8 AM-9 AM','9 AM-10 AM','10 AM-11 AM','11 AM-12 PM','12 PM-1 PM','1 PM-2 PM','2 PM-3 PM','3 PM-4 PM','4 PM-5 PM','5 PM-6 PM','6 PM-7 PM','7 PM-8 PM'];
    @track classTime;
    @track showOver = false;
    @track DisabledButton = false;
    @track showMsg = false;
    @track msg;
    @track prev;
    @track next;
    @track ClassType = 'Live';
    @track isShowSendModal = false;
    @track showLiveLine = true;
    @track showInPersonLine = false;
    @track count = 0;
    connectedCallback() {
        this.handleTime({'target': {'value': '7 AM-8 AM'}});
        this.prev = '7 AM-8 AM';
        // this.ClassType = 'Live';
        console.log('OUTPUT Image: ',this.userImg);
        // this.next = '9 AM-10 AM' ;
    }
    // handleLiveUnderline(event){
    //     console.log(event.target.dataset.id);
    //     this.showInPersonLine = false;
    //     this.showLiveLine = true;
    //     this.handleTime({'target': {'value': '7 AM-8 AM'}});
    //     this.prev = '7 AM-8 AM';
    //     // this.ClassType = 'Live';
    //     this.JSONArray = [];
    //     this.currentPage = [];
    // }
    // handleInPersonUnderline(event){
    //     console.log(event.target.dataset.id);
    //     this.showInPersonLine = true;
    //     this.showLiveLine = false;
    //     // this.handleTime({'target': {'value': '7 AM-8 AM'}});
    //     // this.prev = '7 AM-8 AM';
    //     this.ClassType = 'In Person';
    //     this.JSONArray = [];
    //     this.currentPage = [];
    // }
    handleTime(e){
        if(this.count!=0){
            console.log('OUTPUT 1>>>>>>>: ',e.target.getAttribute('data-id'));
            this.template.querySelector(`[data-id="${this.prev}"]`).style = "border:transparent";
            this.template.querySelector(`[data-id="${e.target.getAttribute('data-id')}"]`).style = "border: 3px solid #008ba7;";
            this.prev = e.target.getAttribute('data-id');
        }
      
        this.JSONArray = [];
        this.currentPage = [];
        var timeElapsed = Date.now();
        var todayDate = new Date(timeElapsed);
        var currentTimeMiliSec = todayDate.toString().split(' ');
        var splitDay = todayDate.getDate();
        var splitTomorrowDay = todayDate.getDate()+1;
        var splitMonth = todayDate.getMonth()+1;
        var splitYear = todayDate.getFullYear();
        if(splitDay.length == 1){
            var splitUpdatedDate = splitYear+"-"+splitMonth+"-"+'0'+splitDay;
        }
        else{
            var splitUpdatedDate = splitYear+"-"+splitMonth+"-"+splitDay;
        }
        if(splitTomorrowDay.length == 1){
            var splitTomorrowDate = splitYear+"-"+splitMonth+"-"+'0'+splitTomorrowDay;
        }
        else{
            var splitTomorrowDate = splitYear+"-"+splitMonth+"-"+splitTomorrowDay;
        }
        
        console.log('this.splitUpdatedDate', splitUpdatedDate);
        var splitCurrentTime = currentTimeMiliSec[4].split(':');
        var currentTime = splitCurrentTime[0] + ':' + splitCurrentTime[1]
        console.log('Current splitDay', splitDay);
        // console.log('Date',todayDate);
        
        function msToTime(duration) {
            var milliseconds = Math.floor((duration % 1000) / 100),
                minutes = Math.floor((duration / (1000 * 60)) % 60),
                hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }
        this.JSONArray = [];
        var unsplittime=(e.target.value);
        //this.template.querySelector('.timeButton').style="border-color:black";
        console.log('Time',JSON.stringify(unsplittime));
        const convertTime12to24 = (time12h) => {
        const [time, modifier] = time12h.split(' ');
        let [hours,minutes] = time.split(':');
        // let minutes = '00';
        if (hours === '12') {
            hours = '00';
        }
        if(minutes  == null){
            minutes = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        return `${hours}:${minutes}`;
        }

        var splittime=unsplittime.split('-');
        this.time1 = convertTime12to24(splittime[0]);
        console.log('this.time1  : ',this.time1 );
        this.time2 = convertTime12to24(splittime[1]);
        console.log('Class Type : ',this.ClassType );
         BWPS_GetUpcomingClasses({time1: this.time1 , time2: this.time2, ClassType: this.ClassType})
        .then(result =>{
            if(result.length ==0){
                this.showMsg = true;
                this.msg = "There is no class on this time."
            }
            else{
                 this.showMsg = false;
            }
           
            var data=result;
            let overVisible = false;
            this.count=0;
            console.log('Upcoming>>>>>>.',data);
            var intensityImage;
            for( let i=0;i<data.length;i++){
                // let sig = data[i].BWPS_Integrity__c;
                let sig = data[i].Schedule_Class__r.Integrity__c;
                console.log("sig>>>> : ", sig);
                if(sig == 'Low/Seated'){
                    intensityImage = lowSignal;
                }
                else if(sig == 'Medium'){
                    intensityImage = mediumSignal;
                }
                else if(sig == 'High/Active'){
                    intensityImage = highSignal;
                }
                else{
                    intensityImage = lowSignal;
                }
                let startTime = msToTime(data[i].BWPS_StartTime__c);
                console.log('start time',convertTime12to24(startTime));
                function getSeconds(timeToConvert) {
                    let hours = timeToConvert.split(':')[0];
                    let mins = timeToConvert.split(':')[1];

                    return (Number(hours) * 60) + (Number(mins));
                }
                let buttDisabled = false;
                if(data[i].BWPS_ClassDate__c == splitUpdatedDate){
                    if(getSeconds(convertTime12to24(startTime)) >= getSeconds(currentTime) ){
                        this.showOver = false;
                        overVisible = false;
                        buttDisabled = false ;
                        this.ButtonStatus = 'Join';
                        console.log('Join');
                    }else if(getSeconds(convertTime12to24(startTime)) < getSeconds(currentTime)){
                        this.showOver = true;
                        overVisible = true;
                        console.log('>>> : ',getSeconds(convertTime12to24(startTime)),getSeconds(currentTime));
                         if(data[i].BWPS_Lecture_Link__c != undefined){
                            console.log('inner Node');
                            // setTimeout(() => {
                            buttDisabled = false;
                            this.ButtonStatus = 'Play On Demand';
                            console.log('Play', this.showOver);
                        }
                        else{
                            buttDisabled = true;
                            this.ButtonStatus = 'Join'
                            console.log('JOIN DISABLED', this.showOver);
                        }
                    }
                }
                else {
                    this.showOver = false;
                    overVisible = false;
                    buttDisabled = false ;
                    this.ButtonStatus = 'Join';
                    console.log('Join');
                }
                console.log(splitUpdatedDate, this.showOver);
                console.log(data[i].BWPS_ClassDate__c);
                console.log(splitTomorrowDate);
                if(data[i].BWPS_ClassDate__c == splitUpdatedDate ){
                    this.day = 'TODAY';
                }
                else if(data[i].BWPS_ClassDate__c == splitTomorrowDate){
                    this.day = 'TOMORROW';
                }
                else {
                    this.day = data[i].BWPS_ClassDay__c;//.toUpperCase();
                }
                var schitem = data[i].Schedule_Class__r;
                var obj={
                Id : data[i].Id,
                RecType:schitem.RecordType.Name,
                ClassType : schitem.Schedule_Type__c,
                Date : data[i].BWPS_ClassDate__c,
                Day : this.day,
                Time : msToTime(data[i].BWPS_StartTime__c),
                Name : data[i].Name,
                Lecture: this.ButtonStatus,
                disabledBtn: buttDisabled,
                InstructorName :schitem.BWPS_instructor__r.Name,
                UserImage : this.userImg,
                Description : schitem.BWPS_Description__c,
                // Intensity:  data[i].BWPS_Integrity__c,
                Intensity:  data[i].Schedule_Class__r.Integrity__c,
                Status : data[i].Class_Status__c,
                IntensityImage : intensityImage,
                CardImage : this.ExerciseImage,
                classFavStatus : false,
                showOver: overVisible

                }
                // if(schitem.Schedule_Type__c == this.LiveClass || schitem.Schedule_Type__c =='Hybrid'){
                //     
                // }
                // if(this.JSONArray.length ==NULL && this.JSONArray == NULL && this.JSONArray == undefined ){
                //     this.showMsg = true;
                //     this.msg = "There is no class on this time."
                // }
                // else{
                //     this.showMsg = false;
                // }
                this.JSONArray.push(obj);
                // this.page = 1;
                // this.handlePagination();
                console.log("Arr",this.JSONArray);
            }
            allEntitySubs()
            .then(result => {
                console.log('outside : ',JSON.stringify(result));
                //console.log('visible array : ',JSON.strClass_Status__cingify(this.visibleCardElementArray));
                if(result){
                    console.log('result : ',JSON.stringify(result));
                    //console.log(' inside visible array : ',JSON.stringify(this.visibleCardElementArray));
                    result.forEach(es => {
                    //TODO : currentItem
                        this.JSONArray.forEach(cls => {
                            //TODO : currentItem
                            console.log('class Status is : ',cls.Class_Status__c);
                            if(es.ParentId == cls.Id){
                                console.log('class name : ',cls.Name);
                                cls.classFavStatus = true;
                            }
                        });
                    });
                }
                  this.count++;
            })
        }).catch(e=>{
            
            console.log("e>>>>",e);
        });
    }

    // handlePagination() {
    //     this.currentPage = [];
    //     let end = (this.pageSize * this.page) - 1;
    //     let start = end - (this.pageSize - 1);
    //     console.log('OUTPUT : ',start, end, this.page, this.pageSize, this.JSONArray[0]);
    //     for(let i = start; i <= Math.min(end, this.JSONArray.length - 1); ++i) {
    //     console.log('OUTPUT1 : ', JSON.stringify(this.currentPage));
    //         this.currentPage.push(this.JSONArray[i]);
    //     console.log('OUTPUT2 : ', JSON.stringify(this.currentPage));
    //     }

    // }

    // PreviousHandler() {
    //     if(this.page > 1) {
    //         this.page -= 1;
    //         this.handlePagination();
    //     }
    // }

    // NextHandler() {
    //     if(this.page < Math.ceil(this.JSONArray.length / 3)) {
    //         this.page += 1;
    //         this.handlePagination();
    //     }
    // }
    handlePrev(event) {
        this.template.querySelector(".slider").scrollLeft -= 368;
    }
    handleNext(event){
        this.template.querySelector(".slider").scrollLeft += 368;
    }
    handleShare(event){
        this.showSendModalBox();
        let scId = event.target.dataset.id;
        let scDescription = event.target.dataset.description;
        console.log('Schedule Class Id : ', scId);
        console.log('Schedule Class Id : ', scDescription);   
    }
    hideSendModalBox(){
        this.isShowSendModal = false;
    }
    showSendModalBox(){
        this.isShowSendModal = true;
    }
     favoriteHandler(event){
      let classId = event.target.dataset.id;
      let classStatus = event.target.dataset.isfav;
      //console.log('classStatus : ',classStatus);
      follow({recId : classId , isFollowing : classStatus})
      .then(result => {
        //console.log('response : ',result);
        if(result == true){
          this.JSONArray.forEach(e => {
            //TODO : currentItem
            if(String(e.Id) == classId){
              e.classFavStatus = true;
              this.template.querySelector('c-toast-message').showToast('success', 'Favorite successfully.');
              //console.log('if true class status : ',e.classFavStatus);
            }
          });
        }
        else if(result == false){
          this.JSONArray.forEach(e => {
            //TODO : currentItem
            if(e.Id == classId){
              e.classFavStatus = false;
              this.template.querySelector('c-toast-message').showToast('success', 'Unfavorite successfully.');
              //console.log('if false class status : ',e.classFavStatus);
            }
          });
        }
      })
      .catch(error => {
          console.log('Error : ',JSON.stringify(error));
      })

    }
    @track CaseRecords;
    @track temp;
    Subject ='Subject data';
    Body ='Body Data';
    Email ='LWC@gmail.com';
    sendMailMethod(){
        this.isShowSendModal = false;
        console.log('ind');
        this.Subject = this.template.querySelector(`[data-id= 'Subject']`).value;
        this.Body = this.template.querySelector(`[data-id= 'Description']`).value;
        this.Email = this.template.querySelector(`[data-id= 'Email']`).value;
         this.temp={
             "LeadDetails":{
                 "Subject":this.Subject,
             "Body":this.Body,
             "Email": this.Email
             }
         }
        console.log("body  "+this.Body);
        console.log("temp : ",JSON.stringify(this.temp));
        LeadData({LeadDetails:this.temp})
        .then(result => {
            this.CaseRecords = result;
            console.log("output");
            console.log(this.CaseRecords);
        })
        .catch(error => {
            this.error = error;
            console.log('error',this.error)
        });
        console.log("fire");
        const custEvent = new CustomEvent(
        'callpasstoparent', {
            detail: 'false'
        });
        this.dispatchEvent(custEvent);
        this.template.querySelector('c-toast-meassage').showToast('success', 'Mail sent successfully.');
        this.hideSendModalBox();
        
    } 
    @track myCalendarUrl;
    viewSchedule(){
        this.myCalendarUrl='/PFNCADNA/s/myschedule';
    }
}