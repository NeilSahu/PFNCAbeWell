import { LightningElement,track,wire,api } from 'lwc';
import { publish,subscribe,unsubscribe,createMessageContext,releaseMessageContext } from 'lightning/messageService';
import IFRAMEMC from "@salesforce/messageChannel/ZoomSdkMessageChannel__c";

import myResource from '@salesforce/resourceUrl/DNAIcon';
import myImage from '@salesforce/resourceUrl/ExerciseImage';
import Instructor_Dashboard_cardsImages from '@salesforce/resourceUrl/Instructor_Dashboard_cardsImages';
//high signal
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
//low signal
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
//medium signal
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import Instructor from '@salesforce/resourceUrl/InstructorLogo';
import shareIcon from '@salesforce/resourceUrl/ShareIconBlueColor';
import userIcon from '@salesforce/resourceUrl/UserLogo';
import favIcon from '@salesforce/resourceUrl/likeButton';
import unFavIcon from '@salesforce/resourceUrl/unlikeIcon';
import getFavClasses from '@salesforce/apex/DNA_GuestUserClass.getFavClasses';
import getAllActivityClasses from '@salesforce/apex/DNA_GuestUserClass.getAllActivityClasses';
import allEntitySubs from '@salesforce/apex/DNA_GuestUserClass.allEntitySubs';
import follow from '@salesforce/apex/DNA_GuestUserClass.follow';
import getScheduleClasses from '@salesforce/apex/DNA_InstructorClass.getScheduleClasses';
import LeadData from '@salesforce/apex/BWPS_ShareScheduleClass.CreateLeadforScheduleClassshared';
import getSignature from '@salesforce/apex/ZoomIntegrationClass.getSignature';
import getUserProfileName from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
// import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

export default class YourTodayScheduleComponent extends LightningElement {
    @track calendarlogo =  `${allIcons}/PNG/Calendar.png `;
    @track userIcon = myResource+"/DNAIcons/userIcon.png";
    // userIcon=Instructor;
    @track favIcon =  `${allIcons}/PNG/Favorite.png `;
    @track unFavIcon = `${allIcons}/PNG/unfavorite.png `;
    @track next =  `${allIcons}/PNG/Next.png `;
    @track shareIcon = shareIcon;
    @track userIcon = `${allIcons}/PNG/Instructor-Image.png `;
    @track defaultSCImage = myImage;
    // highSignal = highSignal;
    // lowSignal = lowSignal;
    // mediumSignal = mediumSignal;
    @track totalClassesOfWeeks = 0;
    @track exerciseTotalTime;
    @track allFavRecordsArray = [];
    @track visibleCardElementArray = [];
    @track haveFav = false;
    @track have2 = false;
    @track showClassesOfWeek = true;
    @track showScroller = false;
    @track isData = true;
    @track currentDay;
    @track currentDate;
    @track currentMonth;
    currentWeek;
    currentDate0;
    scheduleClassesArrayLength;
    @track scheduleClassesArray = [];
    @track scheduleClassLineItemArray = [];
    @track visibleScheduleClassLineItemArray = [];
    @track attendeeArray = [];
    @track visibleAttendeeArray = [];    
    // @track visibleRecords = [
    //     {id : "1", src : this.ExerciseImage , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore"},
    //     {id : "2", src : this.ExerciseImage , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore"}
    // ]
    // @track timeArray = [
    //     {id : 1, Time__c : "09:00AM", scliName : "BOXING FOR PARKINSON'S", ClassStatus__c : "PLAY-ON-DEMAND", class : "Over"},
    //     {id : 2, Time__c : "10:00AM", scliName : "EXERCISE FOR PARKINSON'S", ClassStatus__c : "JOINED", class : "Start"},
    //     {id : 3, Time__c : "11:00AM", scliName : "EXERCISE FOR PARKINSON'S", ClassStatus__c : "REVIEW", class : "Taken"},
    //     {id : 4, Time__c : "12:00PM", scliName : "EXERCISE FOR PARKINSON'S", ClassStatus__c : "PLAY-ON-DEMAND", class : "Over"},
    //     {id : 5, Time__c : "01:00PM", scliName : "EXERCISE FOR PARKINSON'S", ClassStatus__c : "JOINED", class : "Start"},
    //     {id : 6, Time__c : "02:00PM", scliName : "EXERCISE FOR PARKINSON'S", ClassStatus__c : "REVIEW", class : "Taken"},
    //     {id : 7, Time__c : "03:00PM", scliName : "EXERCISE FOR PARKINSON'S", ClassStatus__c : "PLAY-ON-DEMAND", class : "Over"},
    //     {id : 8, Time__c : "04:00PM", scliName : "EXERCISE FOR PARKINSON'S", ClassStatus__c : "REVIEW", class : "Taken"},
    //     {id : 9, Time__c : "05:00PM", scliName : "EXERCISE FOR PARKINSON'S", ClassStatus__c : "JOINED", class : "Start"}
    // ]
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    @track totalwatchTime = {
      "Sunday" : 0,
      "Monday": 0,
      "Tuesday":0,
      "Wednesday":0,
      "Thursday":0,
      "Friday":0,
      "Saturday":0
    }
    @track totalTime = {
      "Sunday" : 0,
      "Monday": 0,
      "Tuesday":0,
      "Wednesday":0,
      "Thursday":0,
      "Friday":0,
      "Saturday":0
    }
    @track timeArray = [
        { Id : 0, Time__c : '08:00 am', MeetingUrl : '', scliId : '', scliName : '', timeInMilliSec : 28800000, ClassStatus__c : '', class : '', LectureVideoId : '', classOver : ''},
        { Id : 1, Time__c : '09:00 am', MeetingUrl : '', scliId : '', scliName : '', timeInMilliSec : 32400000, ClassStatus__c : '', class : '', LectureVideoId : '', classOver : ''},
        { Id : 2, Time__c : '10:00 am', MeetingUrl : '', scliId : '', scliName : '', timeInMilliSec : 36000000, ClassStatus__c : '', class : '', LectureVideoId : '', classOver : ''},
        { Id : 3, Time__c : '11:00 am', MeetingUrl : '', scliId : '', scliName : '', timeInMilliSec : 39600000, ClassStatus__c : '', class : '', LectureVideoId : '', classOver : ''},
        { Id : 4, Time__c : '12:00 pm', MeetingUrl : '', scliId : '', scliName : '', timeInMilliSec : 43200000, ClassStatus__c : '', class : '', LectureVideoId : '', classOver : ''},
        { Id : 5, Time__c : '01:00 pm', MeetingUrl : '', scliId : '', scliName : '', timeInMilliSec : 46800000, ClassStatus__c : '', class : '', LectureVideoId : '', classOver : ''},
        { Id : 6, Time__c : '02:00 pm', MeetingUrl : '', scliId : '', scliName : '', timeInMilliSec : 50400000, ClassStatus__c : '', class : '', LectureVideoId : '', classOver : ''},
        { Id : 7, Time__c : '03:00 pm', MeetingUrl : '', scliId : '', scliName : '', timeInMilliSec : 54000000, ClassStatus__c : '', class : '', LectureVideoId : '', classOver : ''},
        { Id : 8, Time__c : '04:00 pm', MeetingUrl : '', scliId : '', scliName : '', timeInMilliSec : 57600000, ClassStatus__c : '', class : '', LectureVideoId : '', classOver : ''},
        { Id : 9, Time__c : '05:00 pm', MeetingUrl : '', scliId : '', scliName : '', timeInMilliSec : 61200000, ClassStatus__c : '', class : '', LectureVideoId : '', classOver : ''},
        { Id : 10, Time__c : '06:00 pm', MeetingUrl : '', scliId : '', scliName : '', timeInMilliSec : 64800000, ClassStatus__c : '', class : '', LectureVideoId : '', classOver : ''},
        { Id : 11, Time__c : '07:00 pm', MeetingUrl : '', scliId : '', scliName : '', timeInMilliSec : 68400000, ClassStatus__c : '', class : '', LectureVideoId : '', classOver : ''},
        { Id : 12, Time__c : '08:00 pm', MeetingUrl : '', scliId : '', scliName : '', timeInMilliSec : 72000000, ClassStatus__c : '', class : '', LectureVideoId : '', classOver : ''}
    ]
    @track visibleActivityArray = [];
    @track ClassActivitiesArray = [];
    // @track ClassActivitiesArray = [
    //     {id : 1, Image : this.defaultSCImage, Name : "Ricky Feizbakhsh", Time_Left__c : "15", ExcerciseName__c : "MOVEMENT FOR PARKINSON'S THROUGH MARTIAL ARTS", ClassStatus__c : "RESUME", class : "Resume", Completed : false},
    //     {id : 2, Image : this.defaultSCImage, Name : "Shahana Ailus", Time_Left__c : "15", ExcerciseName__c : "EXERCISE FOR PARKINSON'S", ClassStatus__c : "RESUME", class : "Resume", Completed : false},
    //     {id : 3, Image : this.defaultSCImage, Name : "Kirsten Bodensteiner", Time_Left__c : "0", ExcerciseName__c : "BOXING FOR PARKINSON'S", ClassStatus__c : "COMPLETED", class : "Completed", Completed : true},
    //     {id : 4, Image : this.defaultSCImage, Name : "Kirsten Bodensteiner", Time_Left__c : "0", ExcerciseName__c : "EXERCISE FOR PARKINSON'S", ClassStatus__c : "COMPLETED", class : "Completed", Completed : true},
    //     {id : 5, Image : this.defaultSCImage, Name : "Kirsten Bodensteiner", Time_Left__c : "0", ExcerciseName__c : "BOXING FOR PARKINSON'S", ClassStatus__c : "COMPLETED", class : "Completed", Completed : true},
    //     {id : 6, Image : this.defaultSCImage, Name : "Ricky Feizbakhsh", Time_Left__c : "15", ExcerciseName__c : "MOVEMENT FOR PARKINSON'S THROUGH MARTIAL ARTS", ClassStatus__c : "RESUME", class : "Resume", Completed : false},
    //     {id : 7, Image : this.defaultSCImage, Name : "Shahana Ailus", Time_Left__c : "15", ExcerciseName__c : "EXERCISE FOR PARKINSON'S", ClassStatus__c : "RESUME", class : "Resume", Completed : false},
    //     {id : 8, Image : this.defaultSCImage, Name : "Kirsten Bodensteiner", Time_Left__c : "0", ExcerciseName__c : "BOXING FOR PARKINSON'S", ClassStatus__c : "COMPLETED", class : "Completed", Completed : true},
    //     {id : 9, Image : this.defaultSCImage, Name : "Kirsten Bodensteiner", Time_Left__c : "0", ExcerciseName__c : "EXERCISE FOR PARKINSON'S", ClassStatus__c : "COMPLETED", class : "Completed", Completed : true},
    //     {id : 10, Image : this.defaultSCImage, Name : "Kirsten Bodensteiner", Time_Left__c : "0", ExcerciseName__c : "BOXING FOR PARKINSON'S", ClassStatus__c : "COMPLETED", class : "Completed", Completed : true}
    // ]
    @track weekDaysArray = [
        {id : 1, date: '', day : "S", Total_Remaining_Time__c : "", Total_Exercise_Time__c : "" , Total_Watch_Time__c : ""},
        {id : 2, date: '', day : "M", Total_Remaining_Time__c : "", Total_Exercise_Time__c : "", Total_Watch_Time__c : ""},
        {id : 3, date: '', day : "T", Total_Remaining_Time__c : "", Total_Exercise_Time__c : "", Total_Watch_Time__c : ""},
        {id : 4, date: '', day : "W", Total_Remaining_Time__c : "", Total_Exercise_Time__c : "", Total_Watch_Time__c : ""},
        {id : 5, date: '', day : "TH", Total_Remaining_Time__c : "", Total_Exercise_Time__c : "", Total_Watch_Time__c : ""},
        {id : 6, date: '', day : "F", Total_Remaining_Time__c : "", Total_Exercise_Time__c : "", Total_Watch_Time__c : ""},
        {id : 7, date: '', day : "S", Total_Remaining_Time__c : "", Total_Exercise_Time__c : "", Total_Watch_Time__c : ""}
    ]
    @track signature;
    @track currentVideoUrl;
    @track currentVideoId;
    @track showIframe= false;
    @track currentClassUrl;
    @track data
    @track showClassIframe= false;
    @track showVimeoIframe= false;
    @track startDate = new Date();
    @track endDate =  new Date();
    @track updatedDate = new Date();
    @track userName;

    context = createMessageContext();
    subscription = null;

    @wire(getUserProfileName)
    getUserProfile({data,error}){
        if(data){
            // console.log(data);
            this.userName = data.FirstName??'' +' '+data.LastName??'';
            console.log('profile name : ',data.Profile.Name);
        }
        if(error){
            console.log('error : ',error, JSON.stringify(error),error.message);
        }
    }

    sendZoomData(meetingId, name) {
      console.log('send2 : ',meetingId ,name );
        let message = {
            meetingId : meetingId,
            AttendeeName : name,
            iframeStatus : 'Zoom'
        };
        publish(this.context, IFRAMEMC, message);
    }
    updateCurrentVideoUrlHandler(scliId,videoId,watchTime){
        let message = {
            videoId : videoId,
            scliId : scliId,
            iframeStatus : 'Vimeo',
            watchTime : watchTime
        };
        publish(this.context, IFRAMEMC, message);
      // this.currentVideoUrl = "https://player.vimeo.com/video/"+videoId+"&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479";
    }
    handleVimeoIframe(event){
        let currData = this.visibleCardElementArray.find(e=> e.Id == event.target.dataset.key);
        let status = currData.btnLabel;
        console.log('IframeStatus : ', status);
        //for vimeo iframe
        if(status == 'PLAY ON-DEMAND' || status == 'RESUME' || status == 'COMPLETED'){
          //this.showHideVimeoIframe();
          let videoId = currData.videoId;
          let scliId = currData.scliId;
          let watchTime = currData.WatchTime;

          this.updateCurrentVideoUrlHandler(scliId,videoId,watchTime);
        }
        //for zoom iframe
        else if(status == 'JOIN'){
          let meetingId = currData.meetingId;
          let name = currData.userName;
          // this.sendZoomData(meetingId, name);
          this.sendZoomData(meetingId, name);
        }
    }
    handleMyScheduleIframe(event){
      let meetingId = event.target.dataset.meetingid;
      let status = event.target.dataset.status;
      console.log('myschedulee : ',status);
      if(status == 'JOIN'){
        let message = {
            meetingId : meetingId,
            AttendeeName : this.userName,
            iframeStatus : 'Zoom'
        };
        publish(this.context, IFRAMEMC, message);
      }
    }
    handleMyScheduleIframe2(){
        let currData = this.timeArray.find(e=> e.Id == event.target.dataset.key);
        let status = currData.status;
        console.log('IframeStatus : ', status);
        //for zoom iframe
        if(status == 'Live'){
          let meetingId = currData.MeetingUrl;
          let name = this.userName;
          // this.sendZoomData(meetingId, name);
          this.sendZoomData(meetingId, name);
        }
        // //for vimeo iframe
        // else if(status == 'In Person'){
        //   //this.showHideVimeoIframe();
        //   let videoId = currData.LectureVideoId;
        //   let scliId = currData.scliId;
        //   let watchTime = currData.WatchTime;

        //   this.updateCurrentVideoUrlHandler(scliId,videoId,watchTime);
        // }
    }
    nextWeekHandler(){
      console.log('next : ',);
      this.startDate.setDate(this.startDate.getDate()+7)
      //saturdayDate.setDate((this.updatedDate.getDate() + (7 - dayOfDate-1)));
      this.endDate = new Date(this.startDate);
      this.endDate.setDate(this.endDate.getDate()+6);
      console.log('nextWeekSunday', this.startDate);
      console.log('nextWeekSunday', this.endDate);
      // sundayDate.setDate((this.updatedDate.getDate() - (dayOfDate)));
      var saturday = this.months[this.endDate.getMonth()] + " " + this.endDate.getDate();
      var sunday = this.months[this.startDate.getMonth()] + " " + this.startDate.getDate();
      this.currentWeek = sunday + " - " + saturday;
      //let nextWeek = new Date();
      this.currentDate = new Date(this.startDate);
      //this.setWeekFromDay();
    }
    previousWeekHandler(){
      console.log('prev : ',);
      this.startDate.setDate(this.startDate.getDate()-7)
      //saturdayDate.setDate((this.updatedDate.getDate() + (7 - dayOfDate-1)));
      this.endDate = new Date(this.startDate);
      this.endDate.setDate(this.endDate.getDate()+6);
      console.log('nextWeekSunday', this.endDate);
      // sundayDate.setDate((this.updatedDate.getDate() - (dayOfDate)));
      var saturday = this.months[this.endDate.getMonth()] + " " + this.endDate.getDate();
      var sunday = this.months[this.startDate.getMonth()] + " " + this.startDate.getDate();
      this.currentWeek = sunday + " - " + saturday;
      //let nextWeek = new Date();
      this.currentDate = new Date(this.startDate);
    }
    //Variable for activity pagination
    StartIndex = 0;
    EndIndex = 6;
    StartPoint;
    EndPoint;
    @track runOnce = true;
    renderedCallback(){
      this.initialDate();
    }
    connectedCallback(){
    }
  // updateWeekData(arr){
  //   console.log('Arr updateweek : ',arr.length);
  //   console.log('updateweek : ',this.ClassActivitiesArray.length);
  //   try{
  //     if(this.ClassActivitiesArray.length > 0 ){
  //       console.log('nextDate - eDate : ',nextDate,eDate);
  //       this.showClassesOfWeek = true;
  //       var nextDate = this.startDate;
  //       let eDate = this.endDate;
  //       console.log('nextDate - eDate : ',nextDate,eDate);

  //       this.weekDaysArray.forEach(curDate => {
  //         //Total_Exercise_Time__c
  //         //Total_Remaining_Time__c
  //         let totalVideoTime = 0;
  //         let totalWatchedTime = 0;
  //         let totalRemainingTime = 0;
  //         console.log('nextDate - eDate2 : ',nextDate,eDate);
  //         if(nextDate <= eDate){
  //           this.ClassActivitiesArray.forEach(curItem => {
  //             //TODO : currentItem
  //             let arrDate = new Date(curItem.lineItemDate);
  //             let curd = new Date(nextDate);
  //             arrDate.setHours(0,0,0,0);
  //             curd.setHours(0,0,0,0);
  //             console.log(' okay1 : ', arrDate );
  //             console.log(' okay2 : ', curd );
  //             if(arrDate.valueOf() == curd.valueOf()){
  //               console.log('check if 1 : ',);
  //                 totalVideoTime = Number(e.Video_Duration__c) + totalVideoTime;
  //                 totalWatchedTime = Number(a.BWPS_WatchedTimeStamp__c) + totalWatchedTime;
  //                 console.log('totalVideoTime : ',totalVideoTime);
  //                 console.log('totalWatchedTime : ',totalWatchedTime);
  //             }
  //           });
  //           rt = (totalVideoTime - totalWatchedTime) / 60;
  //           if(rt <= 1){
  //             curDate.Total_Remaining_Time__c = 0 + ' Min';
  //           }
  //           else{
  //             if(Number.isInteger(rt)){
  //               curDate.Total_Remaining_Time__c = rt + ' Min';
  //             }
  //             else{
  //               curDate.Total_Remaining_Time__c = parseFloat(rt).toFixed(0) + ' Min';
  //             }
  //           } 
  //           // curDate.Total_Remaining_Time__c = totalRemainingTime + ' Min';

  //           wt = totalVideoTime / 60;
  //           if(wt <= 1){
  //             curDate.Total_Exercise_Time__c = 0 + ' Min';
  //           }
  //           else{
  //             if(Number.isInteger(wt)){
  //               curDate.Total_Exercise_Time__c = wt +' Min';
  //             }
  //             else{
  //               curDate.Total_Exercise_Time__c = parseFloat(wt).toFixed(0) +' Min';
  //             }
  //           } 
  //           // curDate.Total_Exercise_Time__c = totalWatchedTime;
  //           console.log('cur and next Date : ',curDate);
  //           var nextDate = nextDate.setDate(nextDate.getDate() + 1);
  //         }
  //       });
  //     }else{
  //       //this.showClassesOfWeek = false;
  //     }
  //   }
  //   catch(error){
  //     console.log('errorrr : ',JSON.stringify(error),error.message);
  //   }
  // }
  initialDate(){
    if(this.runOnce){
      this.startDate.setDate(this.startDate.getDate()-this.startDate.getDay());
      this.endDate = new Date(this.startDate);
      this.endDate.setDate(this.endDate.getDate()+6);
      var saturday = this.months[this.endDate.getMonth()] + " " + this.endDate.getDate();
      var sunday = this.months[this.startDate.getMonth()] + " " + this.startDate.getDate();
      this.updatedDate = new Date(this.startDate);
      this.currentWeek = sunday +' - '+saturday;
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
      const dayNames = ["Sunday","Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"];
      const today = new Date();
      this.currentDate0 = today.getDate();
      this.currentDay = dayNames[today.getDay()].toUpperCase();
      this.currentMonth = monthNames[today.getMonth()].toUpperCase();
    }
    this.runOnce = false;
  }
  updateWeekdayArrayHandler(){
    try{
      //this.setWeekFromDay(arr);
      //this.updateWeekData(arr);
      //end handle week
      // const monthNames = ["January", "February", "March", "April", "May", "June",
      //   "July", "August", "September", "October", "November", "December"];
      // const dayNames = ["Sunday","Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"];
      // const today = new Date();
      // this.currentDate = today.getDate();
      // this.currentDay = dayNames[today.getDay()].toUpperCase();
      // this.currentMonth = monthNames[today.getMonth()].toUpperCase();

      //this.totalClassesOfWeeks = this.ClassActivitiesArray.length;
      // var e = [...this.template.querySelector(".btn")];
      // console.log(e,' EEE');
      // console.log(this.template.querySelector(".btn"));
      this.totalwatchTime = {
        "Sunday" : 0,
        "Monday": 0,
        "Tuesday":0,
        "Wednesday":0,
        "Thursday":0,
        "Friday":0,
        "Saturday":0
      }
      this.totalTime = {
        "Sunday" : 0,
        "Monday": 0,
        "Tuesday":0,
        "Wednesday":0,
        "Thursday":0,
        "Friday":0,
        "Saturday":0
      }

      if(this.ClassActivitiesArray.length > 0){
        this.ClassActivitiesArray.forEach(item => {
            item.domClass = item.class + ' classStatus';
        })
      }
      // getting max number of time
      let max = 0;
      let totalMinutes = 0;
      this.weekDaysArray.forEach(item => {
          let time = item.Total_Exercise_Time__c.split(' ')[0];
          if(time > max) max = time;
          totalMinutes += Number(time);
      })
      
      var hours = Math.floor(totalMinutes / 60);          
      var minutes = totalMinutes % 60;
      console.log(totalMinutes , " total minutes");
      console.log(hours , " hours");
      console.log(minutes, " mins");
      if(minutes < 10) minutes = '0'+minutes;
      this.exerciseTotalTime = Math.round(hours) + ' h '+Math.round(minutes)+' min';
      let currIndex = this.weekDaysArray.length;
      this.weekDaysArray.forEach(item => {
          item.style = `z-index: ${--currIndex};`;
          let time = item.Total_Exercise_Time__c.split(' ')[0];
          // let et = item.Total_Exercise_Time__c.split(' ')[0];
          // let time;
          // if(Number.isInteger(et)){
          //   time = et;
          // }
          // else{
          //   time = parseFloat(et).toFixed(2);
          // } 
          console.log('Total_Exercise_Time__c et : ');
          let ratio = time * 7.7;
          ratio /= max;
          ratio += 2.3;

          item.ratio = ratio;

          //console.log(time, ratio, max);

          item.ratioStyle = `height: ${ratio}rem;`;

          let remaining = item.Total_Remaining_Time__c.split(' ')[0];
          // let rt = item.Total_Remaining_Time__c.split(' ')[0];
          // let remaining;
          // if(Number.isInteger(rt)){
          //   remaining = rt;
          // }
          // else{
          //   remaining = parseFloat(rt).toFixed(0);
          // } 
          // console.log('Total_Remaining_Time__c rt : ',remaining);
          let orangeStyle = '';
          let greenStyle = '';

          // orange exists
          if(remaining > 0) {
              orangeStyle += 'orangePart '
              greenStyle += 'topFlat '
          } 
          // orange doesn't exist
          else {
              greenStyle += 'rounded '
          }

          //green exists
          if(time - remaining > 0) {
              orangeStyle += 'bottomFlat '
              greenStyle += 'greenPart '
          }
          // green doesn't exist
          else {
              orangeStyle += 'rounded '
          }

          item.orangeClass = orangeStyle;
          item.greenClass = greenStyle;

          item.orangePercent = `height: ${(remaining * 100) / time}%`;
          item.greenPercent = `height: ${((time - remaining) * 100) / time}%`;

          //console.log('ok',orangeStyle, 1, greenStyle, 2, time, remaining);
      })
    }
    catch(error){
      console.log('error : ',JSON.stringify(error),error.message);
    }
  }

  updateActivityArray(){
    try{
      this.visibleActivityArray = [];
      console.log('StartIndex - EndIndex : ',this.StartIndex, this.EndIndex);
      for (let i = this.StartIndex; i < this.EndIndex; i++) {
        this.visibleActivityArray.push(this.ClassActivitiesArray[i]);
      }
      console.log('visibleActivityArray in update : ',JSON.stringify(this.visibleActivityArray));
    }
    catch(error){
      console.log('error : ',JSON.stringify(error),error.message);
    }
  }
  @wire(getAllActivityClasses,{sDate:'$startDate',eDate:'$endDate'})
  getAllActivityData({data,error}){
    console.log('allActivityClass : ',(data));
     this.exerciseTotalTime = 0 + ' h '+0+' min';
     this.weekDaysArray = [
        {id : 1, date: '', day : "S", Total_Remaining_Time__c : "0", Total_Exercise_Time__c : "0", Total_Watch_Time__c : "0"},
        {id : 2, date: '', day : "M", Total_Remaining_Time__c : "0", Total_Exercise_Time__c : "0", Total_Watch_Time__c : "0"},
        {id : 3, date: '', day : "T", Total_Remaining_Time__c : "0", Total_Exercise_Time__c : "0", Total_Watch_Time__c : "0"},
        {id : 4, date: '', day : "W", Total_Remaining_Time__c : "0", Total_Exercise_Time__c : "0", Total_Watch_Time__c : "0"},
        {id : 5, date: '', day : "TH", Total_Remaining_Time__c : "0", Total_Exercise_Time__c : "0", Total_Watch_Time__c : "0"},
        {id : 6, date: '', day : "F", Total_Remaining_Time__c : "0", Total_Exercise_Time__c : "0", Total_Watch_Time__c : "0"},
        {id : 7, date: '', day : "S", Total_Remaining_Time__c : "0", Total_Exercise_Time__c : "0", Total_Watch_Time__c : "0"}
    ];
    this.visibleActivityArray = [];
    this.totalwatchTime = {
      "Sunday" : 0,
      "Monday": 0,
      "Tuesday":0,
      "Wednesday":0,
      "Thursday":0,
      "Friday":0,
      "Saturday":0
    }
    this.totalTime = {
      "Sunday" : 0,
      "Monday": 0,
      "Tuesday":0,
      "Wednesday":0,
      "Thursday":0,
      "Friday":0,
      "Saturday":0
    }
     this.totalClassesOfWeeks = 0;
    this.ClassActivitiesArray = [];
    if(data != null && data != undefined && data.length > 0){
      //this.updateWeekdayArrayHandler();
      console.log('allActivityClass : ',JSON.stringify(data));  
      let attendeeData = data;
      let tempArr = [];
      console.log('attendeeData : ',JSON.stringify(attendeeData));
      let counter = 0;
      try{
        attendeeData.forEach(r => {
          let a = JSON.parse(JSON.stringify(r));
          a.scImage = this.defaultSCImage;  
          a.Image = this.defaultSCImage;
          counter = counter + 1;
          a.seqNo = counter;

          if(!a.Class_Status__c){
            a.Class_Status__c = 'NONE';
          }
          else if(a.Class_Status__c == 'RESUME'){
            a.Completed = false;
            a.class = 'Resume';
          }
          else if(a.Class_Status__c == 'COMPLETED'){
            a.Completed = true;
            a.class = 'Completed';
          }
          let lineItemTempArr = [];
          let scLineItemArr = a.Schedule_Class_Line_Item_del__r;
          if(a.Schedule_Class_Line_Item_del__r != undefined){
            console.log('Schedule_Type__c : ',a.Schedule_Class_Line_Item_del__r.Schedule_Class__r.Schedule_Type__c);
            if(scLineItemArr.length > 1){
                scLineItemArr.forEach(scli => {
                   let e = JSON.parse(JSON.stringify(scli));
                   console.log('attendee ka lineItem : ',e);
                   let watchTime = 0;
                   if(e.Video_Duration__c != null && a.BWPS_WatchedTimeStamp__c != null && e.Video_Duration__c != undefined && a.BWPS_WatchedTimeStamp__c != undefined){
                      watchTime = Number(e.Video_Duration__c) - Number(a.BWPS_WatchedTimeStamp__c);
                      console.log('watchTimeVD : ',watchTime);
                    }
                    if(watchTime <= 0){
                      a.Time_Left__c = 0;
                    }
                    else{
                      let t = watchTime / 60;
                      var t2;
                      if(Number.isInteger(t)){
                        t2 = t;
                      }
                      else{
                        t2 = parseFloat(t).toFixed(2)
                      } 
                      a.Time_Left__c = t2;
                    }
                });
                a.lineItemStartTime = e.BWPS_StartTime__c;
                a.lineItemEndTime = e.BWPS_EndTime__c;
                a.lineItemDate = e.BWPS_ClassDate__c;
                a.scheduleLineItemName = e.Name;
                a.instructorName = e.Schedule_Class__r.BWPS_instructor__r.Name;
                a.lineItemLectureUrl = e.BWPS_Lecture_Link__c;
                a.lineItemType = e.Schedule_Class__r.Schedule_Type__c;
                a.LatLong = e.Schedule_Class__r.LatitudeLongitude__c;
                a.LectureVideoId = e.BWPS_Vimeo_video_Id__c;
                a.meetingId = e.LectureId__c;
                console.log('LineItemName in if : ',e.Name);
                console.log('LectureVideoId in if : ',e.BWPS_Vimeo_video_Id__c);
                lineItemTempArr.push(e);
              }
              else{
                let e = a.Schedule_Class_Line_Item_del__r;
                //let e = JSON.parse(JSON.stringify(scli));
                //e.action = 'EDIT';
                let watchTime = 0;
                if(e.Video_Duration__c != null && a.BWPS_WatchedTimeStamp__c != null){
                  watchTime = Number(e.Video_Duration__c) - Number(a.BWPS_WatchedTimeStamp__c);
                  console.log('watchTimeVD : ',watchTime);
                }
                if(watchTime <= 0){
                  a.Time_Left__c = 0;
                }
                else{
                  let t = watchTime / 60;
                  var t2;
                  if(Number.isInteger(t)){
                    t2 = t;
                  }
                  else{
                    t2 = parseFloat(t).toFixed(2)
                  } 
                  a.Time_Left__c = t2;
                }
                
                console.log('attendee ka lineItem : ',e);
                a.scheduleLineItemName = e.Name;
                a.instructorName = e.Schedule_Class__r.BWPS_instructor__r.Name;
                a.lineItemStartTime = e.BWPS_StartTime__c;
                a.lineItemEndTime = e.BWPS_EndTime__c;
                a.lineItemDate = e.BWPS_ClassDate__c;
                a.lineItemLectureUrl = e.BWPS_Lecture_Link__c;
                a.lineItemType = e.Schedule_Class__r.Schedule_Type__c;
                a.LatLong = e.Schedule_Class__r.LatitudeLongitude__c;
                console.log('LineItemName in else : ',e.Name);
                console.log('Schedule_Type__c11 in else : ',a.lineItemType);
                a.LectureVideoId = e.BWPS_Vimeo_video_Id__c;
                a.meetingId = e.LectureId__c;
                console.log('LectureId__c in else : ',e.LectureId__c);
                a.Schedule_Class_Line_Item_del__r = scLineItemArr;
              }

          } 
          tempArr.push(a);
          this.totalwatchTime[a.Schedule_Class_Line_Item_del__r.BWPS_ClassDay__c] = parseInt(this.totalwatchTime[a.Schedule_Class_Line_Item_del__r.BWPS_ClassDay__c])+parseInt(a.BWPS_WatchedTimeStamp__c);
          this.totalTime[a.Schedule_Class_Line_Item_del__r.BWPS_ClassDay__c] = parseInt(this.totalTime[a.Schedule_Class_Line_Item_del__r.BWPS_ClassDay__c])+parseInt(a.Schedule_Class_Line_Item_del__r.Video_Duration__c);

        });

        console.log('totalwatchTime  : ',JSON.stringify(this.totalwatchTime,this.totalTime),this.dayNames[1]);
        let i=0;
        this.weekDaysArray.forEach(ci => {
          ci.Total_Remaining_Time__c = ((this.totalTime[this.dayNames[i]] - this.totalwatchTime[this.dayNames[i]]) / 60).toFixed(0) + ' Min';
          ci.Total_Exercise_Time__c = (this.totalTime[this.dayNames[i]] / 60).toFixed(0) + ' Min';
          ci.Total_Watch_Time__c = (this.totalTime[this.dayNames[i]] / 60).toFixed(0) + ' Min';
          i = i+1;
        });
        console.log('weekDaysArray  : ',JSON.stringify(this.weekDaysArray));

        console.log('after processs in activity : ',JSON.stringify(tempArr));
        this.ClassActivitiesArray = tempArr;
        console.log('ClassActivitiesArray in activity : ',JSON.stringify(this.ClassActivitiesArray));
        //this.visibleActivityArray = tempArr;
        this.updateWeekdayArrayHandler();
        this.totalClassesOfWeeks =  this.ClassActivitiesArray.length;
        if(this.totalClassesOfWeeks < 1){
          this.showClassesOfWeek = true;
        }
        else{
          this.showClassesOfWeek = false;
        }
        if(this.ClassActivitiesArray.length < 6 && this.ClassActivitiesArray.length > 0 ){
          this.EndIndex = this.ClassActivitiesArray.length;
        }
        if(this.ClassActivitiesArray.length < 6){
          this.showScroller = false;
        }
        else{
          this.showScroller = true;
        }
        console.log('this.EndIndex : ',this.EndIndex);
        this.EndPoint = this.ClassActivitiesArray.length;
        this.updateActivityArray();

      }
      catch(error){
        console.log('errrr in catch : ',JSON.stringify(error),error,error.message);
      }
    }
    if(error){
      console.log('errrr : ',JSON.stringify(error),error,error.message);
    }
  }
    @wire(getFavClasses)
    getFavoriteClass({data,error}){
      console.log('data : ',(data));
      if(data){
        try{
          //this.favMainArr = data;
          let attendeeData = data;
          let tempArr = [];
          console.log('attendeeData : ',JSON.stringify(attendeeData));
          attendeeData.forEach(r => {
              let a = JSON.parse(JSON.stringify(r));
              a.scImage = this.defaultSCImage;
              a.classFavStatus = false;
              // a.instructorFavStatus = false;
              // a.articleFavStatus = false;
              // a.instructorName = 'Kristain Bain';
              //a.classTime = '05:00/TUE';
              //a.Class_Status__c = 'JOINED';
              if(a.Class_Status__c == '' || a.Class_Status__c == undefined || a.Class_Status__c == null ){
                  a.Class_Status__c = 'NONE';
              }
              if(a.Schedule_Class_Line_Item_del__r != undefined){
                  let e = a.Schedule_Class_Line_Item_del__r;
                  //let e = JSON.parse(JSON.stringify(scli));
                  //e.action = 'EDIT';
                  let jd = new Date(e.BWPS_ClassDate__c);
                  let jd1 = new Date();
                  jd.setHours(0,0,0,0);
                  jd1.setHours(0,0,0,0);
                  console.log(' array date : ', jd );
                  console.log(' current date : ', jd1 );
                  if(jd.valueOf() == jd1.valueOf()){
                      a.Day = 'TODAY';
                  }
                  else{
                      a.Day = e.BWPS_ClassDay__c.toUpperCase();
                  }
                  if(e.BWPS_StartTime__c != undefined){
                      let sTime = this.convertTimeInString(String(e.BWPS_StartTime__c));
                      a.scliStartTime = sTime;
                  }
                  else{
                      a.scliStartTime = '00:00 AM';
                  }
                  let sig = e.Schedule_Class__r.Integrity__c;
                  console.log('single intensity : ',e.Schedule_Class__r.Integrity__c);
                  if(sig == 'Low/Seated'){
                      e.intensity =  lowSignal;
                  }
                  else if(sig == 'Medium'){
                      e.intensity = mediumSignal;
                  }
                  else if(sig == 'High/Active'){
                      e.intensity = highSignal;
                  }
                  else{
                      e.intensity = lowSignal;
                  }

                  let AttendeeStatus = '';
                  if(a.Class_Status__c != '' || a.Class_Status__c != null || a.Class_Status__c != undefined){
                      AttendeeStatus = a.Class_Status__c;
                  }
                  a.WatchTime = e.BWPS_WatchedTimeStamp__c;

                  let jDate = new Date(new Date(e.BWPS_ClassDate__c));
                  let j1Date = new Date();
                  jDate.setHours(0,0,0,0);
                  let datestart = new Date();
                  datestart.setHours(0,0,0,0);
                  let todayms = j1Date.getTime() - datestart.getTime();
                  j1Date.setHours(0,0,0,0);
                  let btnClass = '';
                  let btnLabel = 'JOIN';
                  let isLive = false;
                  let isOver = false;
                  if(e.BWPS_Vimeo_video_Id__c == null && e.BWPS_Vimeo_video_Id__c == undefined && e.BWPS_Vimeo_video_Id__c == ''){
                    isLive = true;
                  }
                  console.log('j1Date : ',j1Date);
                  console.log('check : ',j1Date === jDate);
                  if(j1Date-jDate == 0){
                      let updatedLineItemStartTime = Number(e.BWPS_StartTime__c) - 900000;
                      let updatedLineItemEndTime = Number(e.BWPS_EndTime__c) + 900000;
                      //cur['disabledClass'] = 'statusClass unDisabledClass';
                      if(todayms >= updatedLineItemStartTime && todayms <= updatedLineItemEndTime){
                          btnClass = 'buttonContainer';
                      }
                      else{
                          if(e.BWPS_Vimeo_video_Id__c != null && e.BWPS_Vimeo_video_Id__c != undefined && e.BWPS_Vimeo_video_Id__c != '' ){
                              btnClass  = 'buttonContainer';
                              if(AttendeeStatus == 'RESUME'){
                                  btnLabel = 'RESUME';
                              }
                              else if(AttendeeStatus == 'COMPLETED'){
                                  btnLabel = 'COMPLETED';
                              }
                              else{
                                  btnLabel = 'PLAY ON-DEMAND';
                              }
                              isOver = true;
                          }else{
                              btnLabel = (todayms >= updatedLineItemEndTime)?'OVER':'JOIN';
                              btnClass = 'buttonContainer btnDisabled';

                          }
                      }
                  }else{
                      if(e.BWPS_Vimeo_video_Id__c != null && e.BWPS_Vimeo_video_Id__c != undefined && e.BWPS_Vimeo_video_Id__c != '' ){
                          btnClass  = 'buttonContainer';
                          if(AttendeeStatus == 'RESUME'){
                              btnLabel = 'RESUME';
                          }
                          else if(AttendeeStatus == 'COMPLETED'){
                              btnLabel = 'COMPLETED';
                          }
                          else{
                              btnLabel = 'PLAY ON-DEMAND';
                          }
                          isOver = true;
                      }else{
                          // btnLabel = (todayms >= updatedLineItemEndTime)?'OVER':'START';
                          // btnClass = 'box-orange btnDisabled';
                          btnLabel = (j1Date < jDate)?'JOIN':'OVER';
                          isOver = btnLabel == 'OVER'?true:false;
                          btnClass = 'buttonContainer btnDisabled';
                      }
                  }
                  a.btnClass = btnClass;
                  a.btnLabel = btnLabel;
                  console.log('before split : ',);
                  console.log('date split : ',e.BWPS_ClassDate__c);
                  a.Schedule_Class_Line_Item_del__r = e;
                  a.lineItemStartTime = e.BWPS_StartTime__c;
                  a.lineItemEndTime = e.BWPS_EndTime__c;
                  a.lineItemDate = e.BWPS_ClassDate__c;
                  a.scheduleLineItemName = e.Name;
                  a.lineItemLectureUrl = e.BWPS_Lecture_Link__c;
                  a.lineItemType = e.Schedule_Class__r.Schedule_Type__c;
                  a.LatLong = e.Schedule_Class__r.LatitudeLongitude__c;
                  a.videoId = e.BWPS_Vimeo_video_Id__c;
                  a.meetingId = e.LectureId__c;
                  a.scliId = e.Id;
                  a.VideoDuration = e.Video_Duration__c;
                  a.watchTime = a.BWPS_WatchedTimeStamp__c;
                  a.Schedule_Class_Line_Item_del__r = e;
              } 
              tempArr.push(a);
          });

          console.log('after processs : ',JSON.stringify(tempArr));
          this.allFavRecordsArray = tempArr;
          this.attendeeArray = tempArr;
          console.log('AttendeeArray : ',this.attendeeArray);
          this.updateVisibleAttendeeArray();

          allEntitySubs()
          .then(result => {
            console.log('outside : ',JSON.stringify(result));
            console.log('visible array : ',JSON.stringify(this.visibleCardElementArray));
            if(result){
              console.log('result : ',JSON.stringify(result));
              //console.log(' inside visible array : ',JSON.stringify(this.visibleCardElementArray));
              let tempArray = [];
              let counter = 0;
              console.log('allFavRecordsArray array : ',JSON.stringify(this.allFavRecordsArray));
              //TODO : currentItem
              this.allFavRecordsArray.forEach(cls => {
                if(result.length>0){
                  result.forEach(es => {
                    //TODO : currentItem
                    if(es.ParentId == cls.scliId){
                      console.log('class name : ',cls.Name);
                      counter++;
                      cls.classFavStatus = true;
                      if(this.visibleCardElementArray.length < 3){
                        this.visibleCardElementArray.push(cls);
                      }
                    }
                    else{
                      console.log('cls log : ',cls);
                      tempArray.push(cls);
                    }
                  });
                }
                else{
                  tempArray.push(cls);
                }
              });
              console.log('visibleCardElementArray array : ',JSON.stringify(this.visibleCardElementArray));
              console.log('tempArray array : ',JSON.stringify(tempArray));
              if(this.visibleCardElementArray.length > 3 || counter >= 4){
                this.have2 = true;
              }
              if(this.visibleCardElementArray.length > 0 ){
                this.haveFav = true;
              }
              else{
                if(tempArray.length > 0){
                  this.visibleCardElementArray = [];
                  tempArray.forEach(i => {
                    if(this.visibleCardElementArray.length < 3){
                      this.visibleCardElementArray.push(i);
                    }
                  });
                }
              }
            }
          })
        }
        catch(error){
          console.log('errrr in catch : ',JSON.stringify(error),error,error.message);
        }
      }
      if(error){
        console.log('error : ',error);
      }
    }
    updateVisibleAttendeeArray(){
      this.visibleAttendeeArray = [];
      var intialDateObj = new Date();
      let currentdate = `${this.dayNames[intialDateObj.getDay()]} ${intialDateObj.getDate()} ${this.months[intialDateObj.getMonth()]}, ${intialDateObj.getFullYear()}`;
      console.log('attendee array : ',JSON.stringify(this.attendeeArray));
      console.log('currentdate : ',currentdate);
      this.attendeeArray.forEach(scLineItemArr => {
          let jDate = new Date(new Date(scLineItemArr.lineItemDate));
          let j1Date = new Date(new Date(currentdate));
          jDate.setHours(0,0,0,0);
          j1Date.setHours(0,0,0,0);
          console.log(' array date : ', jDate );
          console.log(' current date : ', j1Date );
          if(jDate.valueOf() == j1Date.valueOf()){
              this.visibleAttendeeArray.push(scLineItemArr);
          }
      });
      console.log('visible attendee array : ',JSON.stringify(this.visibleAttendeeArray));
      console.log('time array before : ',JSON.stringify(this.timeArray));
      let tempTimeArray = [];
      let daterightnow = new Date();
      let datestart = new Date();
      datestart.setHours(0,0,0,0);
      let todayms = daterightnow.getTime() - datestart.getTime();
      console.log('todayms and visiLen : ',todayms,this.visibleAttendeeArray.length);

      for (let i = 0; i < this.timeArray.length-1; i++) {
          let cur = this.timeArray[i];
          let curTemp = this.timeArray[i];
          let next = this.timeArray[i+1];
          cur['isClicked'] = false;
          cur['isLive'] = false;
          cur['isInPerson'] = false;
          console.log('cur time111 : ',JSON.stringify(cur));
          console.log('next time111 : ',JSON.stringify(next));
          if(this.visibleAttendeeArray.length > 0){
              for (let j = 0; j < this.visibleAttendeeArray.length; j++) {
                  let arrTime = this.visibleAttendeeArray[j];
                  console.log('arrTime recordd - '+j+' index : ',arrTime.Class_Status__c,JSON.stringify(arrTime));
                  // 10 am >= 10am && 11am <= 10am
                  let updatedLineItemStartTime = Number(arrTime.lineItemStartTime) - 900000;
                  let updatedLineItemEndTime = Number(arrTime.lineItemEndTime) + 900000;
                  //cur['disabledClass'] = 'statusClass unDisabledClass';
                  if(todayms >= updatedLineItemStartTime && todayms <= updatedLineItemEndTime && arrTime.btnLabel == 'JOIN'){
                    cur['disabledClassLive'] = 'buttonClass unDisabledClass';
                    //cur['disabledClassHybrid'] = 'buttonClass unDisabledClass';
                  }
                  else{
                    if(arrTime.lineItemType == 'In Person' || arrTime.lineItemType == 'Hybrid'){
                      cur['disabledClassHybrid'] = 'buttonClass unDisabledClass';
                      //cur['disabledClassLive'] = 'buttonClass disabledClass';
                    }
                    cur['disabledClassLive'] = 'buttonClass disabledClass';
                      // cur['disabledClassHybrid'] = 'buttonClass disabledClass';
                  }
                  if(arrTime.lineItemType != null || arrTime.lineItemType != '' || arrTime.lineItemType != undefined){
                    if(arrTime.lineItemType == 'Live'){
                      cur['classType'] = 'ONLINE CLASS';
                    }
                    // else if(arrTime.lineItemType == 'In Person'){
                    //   cur['classType'] = 'IN-PERSON CLASS';
                    // }
                    // else if(arrTime.lineItemType == 'Hybrid'){
                    //   cur['classType'] = 'HYBRID CLASS';
                    // }
                  }
                  else{
                    //cur['classType'] = 'ONLINE CLASS';
                  }
                  cur['classStartTime'] = arrTime.scliStartTime;
                  cur['classEndTime'] = arrTime.scliEndTime;
                  cur['LatLong'] = '';
                  cur['meetingId'] = arrTime.meetingId;
                  console.log('arrStatus : '+j+'',arrTime.Class_Status__c);
                  if(cur.timeInMilliSec <= arrTime.lineItemStartTime && next.timeInMilliSec > arrTime.lineItemStartTime ){
                      console.log('condition true');
                      console.log('scheduleLineItemName22 ',arrTime.scheduleLineItemName);
                      cur.haveClass = true;
                      cur.scliName = arrTime.scheduleLineItemName;
                      console.log('arrStatus : '+i+'',arrTime.Class_Status__c);
                      cur.ClassStatus__c = arrTime.Class_Status__c;
                      cur.LectureVideoId = arrTime.LectureVideoId;
                      cur.MeetingUrl = arrTime.lineItemLectureUrl;
                      if(arrTime.lineItemType != null || arrTime.lineItemType != '' || arrTime.lineItemType != undefined){
                        if(arrTime.lineItemType == 'Live'){
                          cur['classType'] = 'ONLINE CLASS';
                          //cur.isLive = true;
                          cur['isLive'] = true;
                          cur['isInPerson'] = false;
                        }
                        // else if(arrTime.lineItemType == 'In Person'){
                        //   cur['classType'] = 'IN-PERSON CLASS';
                        //   cur.LatLong = arrTime.LatLong;
                        //   //cur.isInPerson = true;
                        //   cur['isLive'] = false;
                        //   cur['isInPerson'] = true;
                        // }
                        // else if(arrTime.lineItemType == 'Hybrid'){
                        //   cur['classType'] = 'HYBRID CLASS';
                        //   cur.LatLong = arrTime.LatLong;
                        //   //cur.isLive = true;
                        //   //cur.isInPerson = true;
                        //   cur['isLive'] = true;
                        //   cur['isInPerson'] = true;
                        // }
                      }
                      else{
                        cur['classType'] = 'ONLINE CLASS';
                        cur.ClassStatus__c = arrTime.Class_Status__c;
                        //cur.isLive = true;
                        cur['isLive'] = true;
                      }
                      // var lineItemType = arrTime.lineItemType;
                      //console.log('before id : ',arrTime.Schedule_Class_Line_Item_del__r.length);
                      //cur.scliId = arrTime.Schedule_Class_Line_Item_del__r[0].Id;
                      //console.log('after id : ',arrTime.Schedule_Class_Line_Item_del__r[0].Id);
                      if(arrTime.lineItemEndTime <= todayms){
                        console.log('in over if : ',);
                        cur.classOver = 'OVER';
                        cur.class = "Over";
                        // cur.classOver = arrTime.Class_Status__c.toLowerCase();
                        if(arrTime.Class_Status__c == 'REVIEW'){
                          cur.class = "Taken";
                        }
                        if(arrTime.lineItemType == 'In Person'){
                          cur.class = "Start";
                        }
                        else if(arrTime.lineItemType == 'In Person'){
                          cur.class = "Start";
                        }
                        
                      }
                      else{
                        console.log('for class : ',arrTime.Class_Status__c);
                        if(arrTime.Class_Status__c == 'NONE' || arrTime.Class_Status__c == 'JOIN' || arrTime.Class_Status__c == 'JOINED' || arrTime.Class_Status__c == 'ATTENDING' || arrTime.Class_Status__c == 'RESUME' || arrTime.Class_Status__c == 'PLAY ON-DEMAND' || arrTime.Class_Status__c == 'START'){
                          cur.class = "Start";
                          // cur.haveClass = true;
                          //cur.classOver = arrTime.Class_Status__c.toLowerCase();
                          cur.classOver = "";
                          cur.ClassStatus__c = arrTime.Class_Status__c;
                          console.log('curr array  : ',cur.class,arrTime.Class_Status__c);
                        }
                      }
                      break;
                  }
                  else{
                    cur['classType'] = 'ONLINE CLASS';
                    console.log('OUTPUT : other else');
                      cur.scliName = "";
                      cur.classOver = "";
                      cur.haveClass = false;
                      cur.LectureVideoId = "";
                      cur.ClassStatus__c = "";
                      if(arrTime.Class_Status__c == 'PLAY-ON-DEMAND'){
                        cur.class = "";
                      }
                      else if(arrTime.Class_Status__c == 'REVIEW'){
                        cur.class = "";
                      }
                      else if(arrTime.Class_Status__c == 'JOIN'){
                        cur.class = "Start";
                      }
                  }
              }
          }
          else{
              cur.scliName = "";
              cur.ClassStatus__c = "";
              cur.class = "";
              cur.LectureVideoId = "";
              cur.classOver = '';
              cur.class = "";
              // if(arrTime.Class_Status__c == 'PLAY-ON-DEMAND'){
              //   cur.class = "Over";
              // }
              // else if(arrTime.Class_Status__c == 'REVIEW'){
              //   cur.class = "Taken";
              // }
              // else if(arrTime.Class_Status__c == 'JOINED'){
              //   cur.class = "Start";
              // }
          }
          console.log('curop: ',JSON.stringify(cur));
          if(cur.ClassStatus__c != undefined && cur.ClassStatus__c != null){
            if(cur.ClassStatus__c == 'JOIN'){
              console.log('status in if: ',JSON.stringify(cur));
              //tempTimeArray.push(cur);
              this.timeArray[i] = cur;
            }
            else{
              cur.scliName = "";
              cur.classOver = "";
              cur.haveClass = false;
              cur.LectureVideoId = "";
              cur.ClassStatus__c = "";
              cur['classType'] = '';
              cur.class = '';
              console.log('status in else: ',JSON.stringify(cur),cur.ClassStatus__c);
              console.log('this.timeArray[i] : ',JSON.stringify(this.timeArray[i]));
              console.log('this.timecurTemp : ',JSON.stringify(curTemp));
              this.timeArray[i] = cur;
              // if(cur.ClassStatus__c == 'JOIN'){
              //   console.log('status in if: ',JSON.stringify(cur));
              //   this.timeArray[i] = cur;
              //   //tempTimeArray.push(cur);
              // }
              //tempTimeArray.push(curTemp);
              //this.timeArray[i] = curTemp;

            }
          }
          else{
              console.log('status in else2: ',JSON.stringify(cur),cur.ClassStatus__c);
              //tempTimeArray.push(curTemp);
              cur.scliName = "";
              cur.classOver = "";
              cur.haveClass = false;
              cur.LectureVideoId = "";
              cur.ClassStatus__c = "";
              cur['classType'] = '';
              cur.class = '';
              this.timeArray[i] = cur;
          }
          //tempTimeArray.push(cur);
      }
      //this.timeArray = tempTimeArray;
      console.log('time array after : ',JSON.stringify(this.timeArray));
    }
    convertTimeInString(timeStr){
        var timeInHours = ((Number(timeStr)/1000)/60)/60;
        var finalTimeStr;
        if(timeInHours == 0){
            finalTimeStr = '12:00 am';
        }else{
            var isInteger = Number.isInteger(timeInHours)
            let timeOfDay = timeInHours < 12 ? ' am' : ' pm';
            timeInHours -= timeInHours <= 12 ? 0 : 12;
            if(isInteger){
                finalTimeStr = String(timeInHours).padStart(2, '0')+':00' + timeOfDay;
            }else{
                var hours = String(timeInHours).split('.')[0];
                var decimalMins = String(timeInHours).split('.')[1];
                // convert decimalMin to seconds
                decimalMins = (String(decimalMins)[0]) + '.' + (String(decimalMins).substr(1));
                var min = Math.round(6 * decimalMins);
                finalTimeStr = String(hours).padStart(2, '0')+':'+String(min).padStart(2, '0')+'' + timeOfDay;
            }
        }
        return finalTimeStr;
    }

    favoriteHandler(event){
      let classId = event.target.dataset.id;
      let classStatus = event.target.dataset.isfav;
      //console.log('classStatus : ',classStatus);
      follow({recId : classId , isFollowing : classStatus})
      .then(result => {
        //console.log('response : ',result);
        if(result == true){
          this.visibleCardElementArray.forEach(e => {
            //TODO : currentItem
            if(String(e.scliId) == classId){
              e.classFavStatus = true;
              this.template.querySelector('c-toast-message').showToast('success', 'Favorite successfully.');
              //console.log('if true class status : ',e.classFavStatus);
            }
          });
        }
        else if(result == false){
          this.visibleCardElementArray.forEach(e => {
            //TODO : currentItem
            if(e.scliId == classId){
              e.classFavStatus = false;
              this.template.querySelector('c-toast-message').showToast('success', 'Unfavorite successfully.');
              //console.log('if false class status : ',e.classFavStatus);
            }
          });
        }
      })

    }
    viewAllHandler(){
      window.open('/PFNCADNA/s/favoritepage','_self');
    }
    // share code   
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

    // send email code
    @track CaseRecords;
    @track temp;
    Subject ='Subject data';
    Body ='Body Data';
    Email ='LWC@gmail.com';
    sendMailMethod(){
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
    navigateToMySchedule(){
      console.log('myscheduleClick ');
      window.open('/PFNCADNA/s/myschedule','_self');
    }
    navigateToHowToParticipate(){
      window.open('/PFNCADNA/s/guestuserhowtoparticipate','_self');
    }
    showButtonHandler(event){
      let index = event.currentTarget.dataset.index;
      console.log('show index : ',index);
      let currIndex = this.timeArray[index].isClicked;
     // console.log('currItemArrayItem: ', currIndex, this.timeArray[index], JSON.stringify(this.timeArray[index]))
      if(currIndex) this.timeArray[index].isClicked = false;
      else this.timeArray[index].isClicked = true;
    }
    @track showNextButton = false;
    @track showPreButton = false;
    @track showNextPreButton = false;
    showMoreClassHandler(){
      console.log('showMoreClassHandler : ');
      this.showNextPreButton = !this.showNextPreButton;
      if(this.showNextPreButton){
        this.showNextButton = !this.showNextButton;
      }
      else{
        this.showNextButton = false;
        this.showPreButton = false;
      }
    }
    PreviousHandler(){
      console.log('PreviousHandler : ');
      if(this.StartIndex > 0){
        this.StartIndex = this.StartIndex - 1;
        this.EndIndex = this.EndIndex - 1;
        this.showPreButton = true;
        this.showNextButton = true;
      }
      else{
        this.showPreButton = false;
        this.showNextButton = true; 
      }
      // if(this.EndIndex > 6){
      // }
      // if(this.StartIndex == 0){
      //   this.showPreButton = false;
      //   this.showNextButton = true;
      //   this.EndIndex = this.EndIndex - 1;
      // }
      this.updateActivityArray();
    }
    NextHandler(){
      console.log('NextHandler : ');
      if(this.StartIndex < this.EndPoint-6){
        this.StartIndex = this.StartIndex + 1;
        this.EndIndex = this.EndIndex + 1;
        this.showNextButton = true;
        this.showPreButton = true;
      }
      else{
        this.showNextButton = false;
        this.showPreButton = true;
      }
      // if(this.EndIndex < this.EndPoint){
      //   this.EndIndex = this.EndIndex + 1;
      // }
      // if(this.EndIndex == this.EndPoint){
      //   this.showNextButton = false;
      //   this.showPreButton = true;
      // }
      this.updateActivityArray();
    }

    handleIframeBtn(event){
      console.log('iframe call : ');
        let status = event.target.dataset.status;
        console.log('IframeStatuss : ', status);
        if(status == 'COMPLETED' || status == 'RESUME'){
          let videoId = event.target.dataset.vimeoid;
          this.updateCurrentVideoUrlHandler(videoId);
        }
    }
}