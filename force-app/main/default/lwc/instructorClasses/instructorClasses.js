import { LightningElement, track } from 'lwc';
import imageResource from '@salesforce/resourceUrl/bwps_WIP_LiveClassSchedule';
import getScheduleClassRecords from '@salesforce/apex/BWPS_WIPBrowseClasses.getScheduleClassRecords';
export default class Bwps_WIP_LiveClassSchedule extends LightningElement {

    /*fullClassData = [
        {   Id: "1",
        BWPS_StartTime__c : "09:30 AM EST",
        Name : "DANCE FOR PARKINSON'S",
        BWPS_Description__c : "Made possible with support from Virginian Outpatient Therapy.",
        Instructor : "Kim Brooks",
        Integrity__c : "Low/Seated",
        Duration : "30 min",
            totalMembers : "8",
            
        },
        {   Id: "2",
        BWPS_StartTime__c : "09:30 AM EST",
            Name : "DANCE FOR PARKINSON'S",
            BWPS_Description__c : "Made possible with support from Virginian Outpatient Therapy.",
            Instructor : "Kim Brooks",
            Integrity__c : "Low/Seated",
            Duration : "30 min",
            totalMembers : "18",

        },
        {   Id: "3",
            scheBWPS_StartTime__cduleTime : "11:00 AM EST",
            Name : "BOXING FOR PARKINSON'S",
            BWPS_Description__c : "Made possible with support from Virginian Outpatient Therapy.",
            Instructor : "Kristian Bain",
            Integrity__c : "Low/Seated",
            Duration : "30 min",
            totalMembers : "10",

        },
        {   Id: "4",
        BWPS_StartTime__c : "11:30 AM EST",
            Name : "DANCE FOR PARKINSON'S",
            BWPS_Description__c : "Made possible with support from Virginian Outpatient Therapy.",
            Instructor : "Kim Brooks",
            Integrity__c : "Low/Seated",
            Duration : "30 min",
            totalMembers : "8",
            
        },
        {   Id: "5",
        BWPS_StartTime__c : "12:30 AM EST",
            Name : "DANCE FOR PARKINSON'S",
            BWPS_Description__c : "Made possible with support from Virginian Outpatient Therapy.",
            Instructor : "Kim Brooks",
            Integrity__c : "Low/Seated",
            Duration : "30 min",
            totalMembers : "18",

        },
        {   Id: "6",
        BWPS_StartTime__c : "1:00 AM EST",
            Name : "BOXING FOR PARKINSON'S",
            BWPS_Description__c : "Made possible with support from Virginian Outpatient Therapy.",
            Instructor : "Kristian Bain",
            Integrity__c : "Low/Seated",
            Duration : "30 min",
            totalMembers : "10",

        },
        {   Id: "7",
        BWPS_StartTime__c : "09:30 AM EST",
            Name : "DANCE FOR PARKINSON'S",
            BWPS_Description__c : "Made possible with support from Virginian Outpatient Therapy.",
            Instructor : "Kim Brooks",
            Integrity__c : "Low/Seated",
            Duration : "30 min",
            totalMembers : "8",
            
        }
    ];*/
    
    //classData = this.fullClassData.slice(0,4); //for showing first four data of classes ;  for all data fullClassData is used.

    capacityIcon = imageResource + '/capacityIcon.png';
    durationIcon = imageResource + '/durationIcon.png';
    likeIcon = imageResource + '/likeIcon.png';
    profileIcon = imageResource + '/profileIcon.png';
    shareIcon = imageResource + '/shareIcon.png';
    calendarIcon = imageResource + '/calendarIcon.png';
    @track classData =[];

    showFullData = false;
    showFullDataButton = true;
    @track ScheduleClass = [];
    @track ScheduleClassNew = [];
    //splitUpdatedDate;
    totalData ;
    connectedCallback(){
        getScheduleClassRecords()
        .then(result=>{
            this.ScheduleClass = result;
                this.ScheduleClassNew = result;
                const timeElapsed = Date.now();
                const tempDate = new Date(timeElapsed);
                var splitDay=tempDate.getDate();
                if(tempDate.getDate()<10){
                    splitDay='0'+tempDate.getDate();
                }
                var splitMonth=tempDate.getMonth()+1;
                if(tempDate.getMonth()+1<10){
                    splitMonth='0'+tempDate.getMonth()+1;
                }
                var splitYear=tempDate.getFullYear();
               var splitUpdatedDate = splitYear+"-"+splitMonth+"-"+splitDay;
               let arrFlt = [];
               let i ;
               let obj={};
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
        for(i=0; i<this.ScheduleClassNew.length;i++){
            var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
               var hoursFinal = Math.floor(Time / (1000*60 * 60));
               var divisor_for_minutesFinal = Time %(1000*60 * 60);
               var minutesfinal = Math.floor(divisor_for_minutesFinal /(1000*60));
               if(this.ScheduleClassNew[i].BWPS_Date__c == splitUpdatedDate){
                obj ={
                    "Id":this.ScheduleClassNew[i].Id,
                    "Name":this.ScheduleClassNew[i].Name,
                    "Integrity__c":this.ScheduleClassNew[i].Integrity__c,
                    "BWPS_StartTime__c":msToTime(this.ScheduleClassNew[i].BWPS_StartTime__c),
                    "BWPS_Date__c":this.ScheduleClassNew[i].BWPS_Date__c,
                    "BWPS_Description__c":this.ScheduleClassNew[i].BWPS_Description__c,
                    "Instructor":this.ScheduleClassNew[i].BWPS_instructor__r.Name,
                    "Duration":minutesfinal,
                    totalMembers : "10"
                }
                arrFlt.push(obj);
               }
           }
         this.ScheduleClass = arrFlt;
         if(this.ScheduleClass.length > 0 && this.ScheduleClass.length >=4 ){
             this.classData = this.ScheduleClass.slice(0,4)
         } else if(this.ScheduleClass.length != 0){
            this.classData = this.ScheduleClass.slice(0,this.ScheduleClass.length)
         }
         this.totalData = this.ScheduleClass.length; 
        })
        .catch(error=>{
           this.error = error;
                console.log('error', this.error);
        });
    }

    handleFullList(){

        console.log("%c HandleFullList", "color:green;");
        
        if(this.showFullData == true){
            this.showFullData = false;
            this.showFullDataButton = true;
        }
        else if(this.showFullData == false){
            this.showFullData = true;
            this.showFullDataButton = false;
        }

    }

    renderedCallback(){
        let dateInput = this.template.querySelector('.date-picker-input');
        dateInput.style.setProperty("--date-picker-background",`url(${this.calendarIcon})`);

        // this.dateValue = new Date().toISOString().slice(0, -14);
    }
    

    todayDate = new Date();
    @track dateValue = this.todayDate.toISOString().slice(0, -14);
    formattedDateValue = this.todayDate.toLocaleDateString('en-IN', {  dateStyle:'full' });
    showTodayButton = false;

    handleShowToday(){
        let todayDate = new Date();
        this.dateValue = todayDate.toISOString().slice(0, -14);
        this.formattedDateValue = todayDate.toLocaleDateString('en-IN', {  dateStyle:'full' });
        this.showTodayButton = false;
        let arrFlt = [];
        let i ;
        let obj={};
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

        for(i=0; i<this.ScheduleClassNew.length;i++){
            var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
               var hoursFinal = Math.floor(Time / (1000*60 * 60));
               var divisor_for_minutesFinal = Time %(1000*60 * 60);
               var minutesfinal = Math.floor(divisor_for_minutesFinal /(1000*60));
               if(this.ScheduleClassNew[i].BWPS_Date__c == this.dateValue){
                obj ={
                    "Id":this.ScheduleClassNew[i].Id,
                    "Name":this.ScheduleClassNew[i].Name,
                    "Integrity__c":this.ScheduleClassNew[i].Integrity__c,
                    "BWPS_StartTime__c":msToTime(this.ScheduleClassNew[i].BWPS_StartTime__c),
                    "BWPS_Date__c":this.ScheduleClassNew[i].BWPS_Date__c,
                    "BWPS_Description__c":this.ScheduleClassNew[i].BWPS_Description__c,
                    "Instructor":this.ScheduleClassNew[i].BWPS_instructor__r.Name,
                    "Duration":minutesfinal,
                    totalMembers : "10"
                }
                arrFlt.push(obj);
               }
           }
         this.ScheduleClass = arrFlt;
         if(this.ScheduleClass.length > 0 && this.ScheduleClass.length >=4 ){
            this.classData = this.ScheduleClass.slice(0,4)
        } else if(this.ScheduleClass.length != 0){
           this.classData = this.ScheduleClass.slice(0,this.ScheduleClass.length)
        }
         this.totalData = this.ScheduleClass.length; 


        
    }

       
    handleDateChange(event){
        this.dateValue = event.target.value;
        let tempDate = new Date(this.dateValue);
        this.formattedDateValue = tempDate.toLocaleDateString('en-IN',{  dateStyle:'full' })
        var splitDay=tempDate.getDate();
        if(tempDate.getDate()<10){
            splitDay='0'+tempDate.getDate();
        }
        var splitMonth=tempDate.getMonth()+1;
        if(tempDate.getMonth()+1<10){
            splitMonth='0'+tempDate.getMonth()+1;
        }
        var splitYear=tempDate.getFullYear();
        var splitUpdatedDate = splitYear+"-"+splitMonth+"-"+splitDay;
        let arrFlt = [];
        let i ;
        let obj={};
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

        for(i=0; i<this.ScheduleClassNew.length;i++){
            var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
               var hoursFinal = Math.floor(Time / (1000*60 * 60));
               var divisor_for_minutesFinal = Time %(1000*60 * 60);
               var minutesfinal = Math.floor(divisor_for_minutesFinal /(1000*60));
               if(this.ScheduleClassNew[i].BWPS_Date__c == splitUpdatedDate){
                obj ={
                    "Id":this.ScheduleClassNew[i].Id,
                    "Name":this.ScheduleClassNew[i].Name,
                    "Integrity__c":this.ScheduleClassNew[i].Integrity__c,
                    "BWPS_StartTime__c":msToTime(this.ScheduleClassNew[i].BWPS_StartTime__c),
                    "BWPS_Date__c":this.ScheduleClassNew[i].BWPS_Date__c,
                    "BWPS_Description__c":this.ScheduleClassNew[i].BWPS_Description__c,
                    "Instructor":this.ScheduleClassNew[i].BWPS_instructor__r.Name,
                    "Duration":minutesfinal,
                    totalMembers : "10"
                }
                arrFlt.push(obj);
               }
           }
         this.ScheduleClass = arrFlt;
         if(this.ScheduleClass.length > 0 && this.ScheduleClass.length >=4 ){
            this.classData = this.ScheduleClass.slice(0,4)
        } else if(this.ScheduleClass.length != 0){
           this.classData = this.ScheduleClass.slice(0,this.ScheduleClass.length)
        }
         this.totalData = this.ScheduleClass.length; 
        if(this.dateValue == this.todayDate.toISOString().slice(0, -14)){
            this.showTodayButton = false;
        }
        else{
            this.showTodayButton = true;
        }
    }


    
    

    handlePreviousDateChange(){
        var dateFormatTotime = new Date(this.dateValue);
        var decreasedDate = new Date(dateFormatTotime.getTime() -(86400000)); //one day to milliseconds
        this.dateValue = decreasedDate.toISOString().slice(0, -14);
        let tempDate = new Date(this.dateValue);
        this.formattedDateValue = tempDate.toLocaleDateString('en-IN',{  dateStyle:'full' })
        var splitDay=tempDate.getDate();
        if(tempDate.getDate()<10){
            splitDay='0'+tempDate.getDate();
        }
        var splitMonth=tempDate.getMonth()+1;
        if(tempDate.getMonth()+1<10){
            splitMonth='0'+tempDate.getMonth()+1;
        }
        var splitYear=tempDate.getFullYear();
        var splitUpdatedDate = splitYear+"-"+splitMonth+"-"+splitDay;
        let arrFlt = [];
        let i ;
        let obj={};
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

        for(i=0; i<this.ScheduleClassNew.length;i++){
            var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
               var hoursFinal = Math.floor(Time / (1000*60 * 60));
               var divisor_for_minutesFinal = Time %(1000*60 * 60);
               var minutesfinal = Math.floor(divisor_for_minutesFinal /(1000*60));
               if(this.ScheduleClassNew[i].BWPS_Date__c == splitUpdatedDate){
                obj ={
                    "Id":this.ScheduleClassNew[i].Id,
                    "Name":this.ScheduleClassNew[i].Name,
                    "Integrity__c":this.ScheduleClassNew[i].Integrity__c,
                    "BWPS_StartTime__c":msToTime(this.ScheduleClassNew[i].BWPS_StartTime__c),
                    "BWPS_Date__c":this.ScheduleClassNew[i].BWPS_Date__c,
                    "BWPS_Description__c":this.ScheduleClassNew[i].BWPS_Description__c,
                    "Instructor":this.ScheduleClassNew[i].BWPS_instructor__r.Name,
                    "Duration":minutesfinal,
                    totalMembers : "10"
                }
                arrFlt.push(obj);
               }
           }
         this.ScheduleClass = arrFlt;
         if(this.ScheduleClass.length > 0 && this.ScheduleClass.length >=4 ){
            this.classData = this.ScheduleClass.slice(0,4)
        } else if(this.ScheduleClass.length != 0){
           this.classData = this.ScheduleClass.slice(0,this.ScheduleClass.length)
        }
         this.totalData = this.ScheduleClass.length; 
        if(this.dateValue == this.todayDate.toISOString().slice(0, -14)){
            this.showTodayButton = false;
        }
        else{
            this.showTodayButton = true;
        }
    }

    handleNextDateChange(){
        var dateFormatTotime = new Date(this.dateValue);
        var increasedDate = new Date(dateFormatTotime.getTime() +(86400000)); //one day to milliseconds
        this.dateValue = increasedDate.toISOString().slice(0, -14);
        let tempDate = new Date(this.dateValue);
        this.formattedDateValue = tempDate.toLocaleDateString('en-IN',{  dateStyle:'full' })
        var splitDay=tempDate.getDate();
        if(tempDate.getDate()<10){
            splitDay='0'+tempDate.getDate();
        }
        var splitMonth=tempDate.getMonth()+1;
        if(tempDate.getMonth()+1<10){
            splitMonth='0'+tempDate.getMonth()+1;
        }
        var splitYear=tempDate.getFullYear();
        var splitUpdatedDate = splitYear+"-"+splitMonth+"-"+splitDay;
        let arrFlt = [];
        let i ;
        let obj={};
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

        for(i=0; i<this.ScheduleClassNew.length;i++){
            var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
               var hoursFinal = Math.floor(Time / (1000*60 * 60));
               var divisor_for_minutesFinal = Time %(1000*60 * 60);
               var minutesfinal = Math.floor(divisor_for_minutesFinal /(1000*60));
               if(this.ScheduleClassNew[i].BWPS_Date__c == splitUpdatedDate){
                obj ={
                    "Id":this.ScheduleClassNew[i].Id,
                    "Name":this.ScheduleClassNew[i].Name,
                    "Integrity__c":this.ScheduleClassNew[i].Integrity__c,
                    "BWPS_StartTime__c":msToTime(this.ScheduleClassNew[i].BWPS_StartTime__c),
                    "BWPS_Date__c":this.ScheduleClassNew[i].BWPS_Date__c,
                    "BWPS_Description__c":this.ScheduleClassNew[i].BWPS_Description__c,
                    "Instructor":this.ScheduleClassNew[i].BWPS_instructor__r.Name,
                    "Duration":minutesfinal,
                    totalMembers : "10"
                }
                arrFlt.push(obj);
               }
           }
         this.ScheduleClass = arrFlt;
         if(this.ScheduleClass.length > 0 && this.ScheduleClass.length >=4 ){
            this.classData = this.ScheduleClass.slice(0,4)
        } else if(this.ScheduleClass.length != 0){
           this.classData = this.ScheduleClass.slice(0,this.ScheduleClass.length)
        }
         this.totalData = this.ScheduleClass.length; 
        if(this.dateValue == this.todayDate.toISOString().slice(0, -14)){
            this.showTodayButton = false;
        }
        else{
            this.showTodayButton = true;
        }
    }



}