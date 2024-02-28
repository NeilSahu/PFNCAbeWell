import { LightningElement, track, wire } from 'lwc';
import BELLICON  from '@salesforce/resourceUrl/Bell_Icon';
import REMOVE from '@salesforce/resourceUrl/InstructorDashboardMinusIcon';
import BWPS_MonthsName  from '@salesforce/label/c.BWPS_MonthsName';
import guestEventsDateBetween from '@salesforce/apex/BWPS_GuestMemberEvents.guestEventsDateBetween';
import getClassData from '@salesforce/apex/BWPS_GuestMemberEvents.getScheduleClass';
import addclass from '@salesforce/apex/BWPS_GuestMemberEvents.enrolledA_Class';
import removeEvent from '@salesforce/apex/BWPS_GuestMemberEvents.removeClassFromCalendar';
import { refreshApex } from '@salesforce/apex';
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
import fetchNotification from '@salesforce/apex/Bwps_getuserNotification.getUserNotification';
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
import allEntitySubs from '@salesforce/apex/DNA_GuestUserClass.allEntitySubs';
import getAllEntitySubsMap from '@salesforce/apex/DNA_GuestUserClass.getAllEntitySubsMap';
import follow from '@salesforce/apex/DNA_GuestUserClass.follow';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
export default class myscheduleCalendar extends LightningElement {
    bellicon = BELLICON;
    removeIcon =REMOVE;
    @track favIcon =  `${allIcons}/PNG/Favorite.png `;
    @track unFavIcon = `${allIcons}/PNG/unfavorite.png `;
    @track totalDayRec=0;
    @track dayDataloading=true;
    @track removeClass = false;
    @track conformremove = false;
    @track addClass=false;
    @track dateOfDay='';
    @track showNotificationFlag=false;
    @track ss =55;
    @track mm = 0;
    @track hh = 0;
    @track isTimerOn = false;
    @track timecount = '';
    @track intevelId;
    @track allClassArray;
    @track allSubEntityMap = {}
    monthString = BWPS_MonthsName;
    date;
    year;
    monthNo;
    month;
    day;
    /***Notification */
    @track notrecords=[];
    @track notificationVisibel=[];
    
    monthsec=false;
    fulldate;
    fullweek;
    fullmonth;

    //use to hide previouse buttom on Ui
    @track todayStartDate = new Date();
    @track showBackButton = false;

    @track numberOfClasses =0;
    @track eventsOfDay = [];
    @track weekData;
    @track evetMap = new Map();
    //this use to get map values based on time form mapOftime  
    timeLable = ["09:00AM","10:00AM","11:00AM","12:00PM","01:00PM","02:00PM","03:00PM","04:00PM","05:00PM"];
    @track mapofTime = new Map([
                ["09:00AM", {}],
                ["10:00AM", {}],
                ["11:00AM", {}],
                ["12:00PM", {}],
                ["01:00PM", {}],
                ["02:00PM", {}],
                ["03:00PM", {}],
                ["04:00PM", {}],
                ["05:00PM", {}]
         ]);

 @track startClassVar = '';///////
 @track notCheck = true;
 @track StartString = 'You don\'t have any upcoming class today';
 @track checkFirst =true;

 @track   sundayDate = new Date();
 @track   saturdayDate = new Date();

    //months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    months
    dayBtn = true;
    weekBtn = false;
    monthBtn =false;
    @track Data1;
   //var use to run rander callback iniciateDate only first rander
   @track firstrun=0;
    updatedDate = new Date();
    
   @track eventsData;
   @track  StartDate = new Date();
   @track endDate = new Date();
    renderedCallback() {
        this.months = this.monthString.split(',');
        this.initialDate();
    }
    @wire(fetchNotification)
   wiredData({ data, error }) {
    if(data != null && data != '' && data != undefined){

    var notificationData =  JSON.parse(JSON.parse(data));
    var firstLoop = true;
    for(let i= 0;i<notificationData.notifications.length;i++){
      var nottificationdate = new Date(notificationData.notifications[i].mostRecentActivityDate);
      var todayDate = new Date();
      var timeinMilliSec = todayDate-nottificationdate+'ago';
    if(notificationData.notifications[i].read == false){
      this.totalNotifications+=1;
     }
     var obj = {
       id:notificationData.notifications[i].id,
       Name:'Kirsten Bodensteiner',
       image:notificationData.notifications[i].image,
       Active__c : timeinMilliSec,
       Message__c:notificationData.notifications[i].messageBody,
     }
     this.notrecords.push(obj);
     if(firstLoop){
     this.notificationVisibel.push(obj);
     firstLoop=false;
     }
    
    }
    
    } else {
       console.log('errorfghgg>>> ',JSON.stringify(error));
    }
    }
    @wire(guestEventsDateBetween,{satrtDate:'$StartDate',endDate:'$endDate'})
    async Evendata(data,error){
     if(data){
        this.Data1 = data;
        var  dataArr =[];
        dataArr = data.data;
        console.log('dataJson>>>>',JSON.stringify(dataArr));
        var arrOfevent=[];
        this.mapofTime = new Map([
            ["09:00AM", {}],
            ["10:00AM", {}],
            ["11:00AM", {}],
            ["12:00PM", {}],
            ["01:00PM", {}],
            ["02:00PM", {}],
            ["03:00PM", {}],
            ["04:00PM", {}],
            ["05:00PM", {}]
        ]);
        if(dataArr != null && dataArr != undefined){
            if(this.checkFirst){
            await getAllEntitySubsMap()
            .then(result => {
                console.log('outside : ',JSON.stringify(result));
                //console.log('visible array : ',JSON.strClass_Status__cingify(this.visibleCardElementArray));
                if(result){
                    console.log('allSubsMap2 : ',JSON.stringify(result));
                    console.log('allSubsMapid : ',result.hasOwnProperty('a0x3C000001dFAOQA2'));
                    this.allSubEntityMap = result;
                }
            })
            }

            for(let i=0;i<dataArr.length;i++){
            if(this.dayBtn || this.weekBtn){
              
                //signal code
                var signal;
                let sig = dataArr[i].BWPS_Integrity__c;
                        if(sig == 'Low/Seated'){
                            signal = lowSignal;
                        }
                        else if(sig == 'Medium'){
                            signal = mediumSignal;
                        }
                        else if(sig == 'High/Active'){
                            signal = highSignal;
                        }
                        else{
                            signal = lowSignal;
                        }
                  //signal code end
                 let AttendeeStatus = '', WatchTime = '0';
                 if(dataArr[i].hasOwnProperty('Attendees_del__r')){
                    AttendeeStatus = dataArr[i].Attendees_del__r[0].Class_Status__c??'';
                    WatchTime = dataArr[i].Attendees_del__r[0].BWPS_WatchedTimeStamp__c??'0';
                  }
                var timeofEvent = this.timeInHours(dataArr[i].BWPS_StartTime__c);
                let jDate = new Date(new Date(dataArr[i].BWPS_ClassDate__c));
                let j1Date = new Date();
                jDate.setHours(0,0,0,0);
                let datestart = new Date();
                datestart.setHours(0,0,0,0);
                let todayms = j1Date.getTime() - datestart.getTime();
                j1Date.setHours(0,0,0,0);
                let btnClass = '';
                let btnLabel = 'JOIN';
                let isOver = false;
                console.log('j1Date : ',j1Date);
                console.log('check : ',j1Date === jDate);
                // if(this.checkFirst){
                //      let updatedLineItemStartTime = Number(dataArr[i].BWPS_StartTime__c);
                //      let updatedLineItemEndTime = Number(dataArr[i].BWPS_EndTime__c);
                //      var hrr=0;    
                //      var min =0;
                //   if(todayms >= updatedLineItemStartTime && todayms <= updatedLineItemEndTime && this.notCheck){
                //     this.StartString = 'Your elapsed time is '+ Math.floor(parseInt((todayms - updatedLineItemStartTime)/1000)/60) + ' min';
                //     this.notCheck = false;
                //     this.startClassVar = dataArr[i];
                //   } else if (todayms < updatedLineItemStartTime &&  this.notCheck ){
                //     let totalMin =Math.ceil(parseInt((updatedLineItemStartTime -todayms)/1000)/60);
                //     if(totalMin > 59){
                //        hrr = Math.floor(totalMin/60);
                //        min = totalMin%60;
                //     }  
                //     this.StartString = hrr==0?'Your next class in ' +totalMin + ' min': 'Your next class in ' +hrr+'hr ' + min + ' min';
                //     this.notCheck = false;
                //     this.startClassVar = dataArr[i];
                //     // console.log(todayms , '>>>44 ',updatedLineItemStartTime,' >> ',updatedLineItemEndTime);
                //   }
                // }
                if(j1Date-jDate == 0){
                    let updatedLineItemStartTime = Number(dataArr[i].BWPS_StartTime__c) - 900000;
                    let updatedLineItemEndTime = Number(dataArr[i].BWPS_EndTime__c) + 900000;
                    //cur['disabledClass'] = 'statusClass unDisabledClass';
                    if(todayms >= updatedLineItemStartTime && todayms <= updatedLineItemEndTime){
                       btnClass = 'box-orange';
                    }
                    else{
                        if(dataArr[i].BWPS_Vimeo_video_Id__c != null && dataArr[i].BWPS_Vimeo_video_Id__c != undefined && dataArr[i].BWPS_Vimeo_video_Id__c != '' ){
                            btnClass  = 'box-orange';
                              if(AttendeeStatus == 'RESUME'){
                                     btnLabel = 'RESUME';
                                 }
                              else if(AttendeeStatus == 'COMPLETED'){
                                     btnLabel = 'COMPLETED';
                                 }
                               else {
                                     btnLabel = 'PLAY ON-DEMAND';
                                 }
                            isOver = true;
                        }else{
                            btnLabel = (todayms >= updatedLineItemEndTime)?'OVER':'JOIN';
                            btnClass = 'box-orange btnDisabled';
                            
                        }
                    }
                }else{
                     if(dataArr[i].BWPS_Vimeo_video_Id__c != null && dataArr[i].BWPS_Vimeo_video_Id__c != undefined && dataArr[i].BWPS_Vimeo_video_Id__c != '' ){
                            btnClass  = 'box-orange';
                             if(AttendeeStatus == 'RESUME'){
                                 btnLabel = 'RESUME';
                                 }
                             else if(AttendeeStatus == 'COMPLETED'){
                                 btnLabel = 'COMPLETED';
                                 }
                             else {
                                 btnLabel = 'PLAY ON-DEMAND';
                                 }
                            isOver = true;
                        } else {
                         btnLabel = (j1Date < jDate)?'JOIN':'OVER';
                         isOver = btnLabel == 'OVER'?true:false;
                         btnClass = 'box-orange btnDisabled';
                        }
                }
                let fav = this.allSubEntityMap.hasOwnProperty(dataArr[i].Id);
                console.log('OUTPUTfav : ',fav?this.favIcon:this.unFavIcon);
                const obj={
                  Id:dataArr[i].Id,
                  Name:dataArr[i].Name,
                  classDate:dataArr[i].BWPS_ClassDate__c,
                  intensity:dataArr[i].BWPS_Integrity__c,
                  instructor:dataArr[i].Schedule_Class__r.BWPS_instructor__r.Name,
                  description:dataArr[i].Schedule_Class__r.BWPS_Description__c,
                  meetingurl:dataArr[i].Schedule_Class__r.BWPS_Lecture_Link__c,
                  meetingId:dataArr[i].LectureId__c,
                  favClassStatus:fav?this.favIcon:this.unFavIcon,
                  time:timeofEvent,
                  WatchTime:WatchTime,
                  lavel:signal,
                  btnLabel:btnLabel,
                  btnClass:btnClass,
                  isOver:isOver,
                  vimeoId:dataArr[i].BWPS_Vimeo_video_Id__c,
                }
                console.log('objfav : ',obj);
                obj['timeAndDay'] = timeofEvent+' / '+dataArr[i].BWPS_ClassDay__c.toUpperCase().slice(0, 3);
                arrOfevent.push(obj);
              }
              else if(this.weekBtn){
                 //signal code
                 var signal;
                 let sig = dataArr[i].BWPS_Integrity__c;
                         if(sig == 'Low/Seated'){
                             signal = lowSignal;
                         }
                         else if(sig == 'Medium'){
                             signal = mediumSignal;
                         }
                         else if(sig == 'High/Active'){
                             signal = highSignal;
                         }
                         else{
                             signal = lowSignal;
                         }
                 //signal code end
                var timeofEvent = this.timeInHours(dataArr[i].BWPS_StartTime__c);
                var endtime = this.timeInHours(dataArr[i].BWPS_EndTime__c);
                var roundTime = timeofEvent.substring(0,3)+timeofEvent.slice(3,-4)+'00'+ timeofEvent.slice(5,7);
               // var endTimeRound = endtime.substring(0,3)+endtime.slice(3,-4)+'00'+ endtime.slice(5,7);
               console.log('roundTime>>> ',roundTime);
                this.evetMap.set(dataArr[i].Id,dataArr[i]);
                if(this.mapofTime.has(roundTime)){
                    var parsetime =  this.getDateFromHours(timeofEvent.replace('PM','').replace('AM',''));
                    var endTimeparse = this.getDateFromHours(endtime.replace('PM','').replace('AM',''));
                    var className = timeofEvent == roundTime && endTimeparse.getHours() >= parsetime.getHours()+1 ? 'full-block' : (timeofEvent == roundTime || parsetime.getMinutes()<30  ? 'half-block-up':'half-block-down');
                    console.log('className>>> ',className);
                    let fav = this.allSubEntityMap.hasOwnProperty(dataArr[i].Id);
                    const obj={
                        Id:dataArr[i].Id,
                        Name:dataArr[i].Name,
                        classDate:dataArr[i].BWPS_ClassDate__c,
                        intensity:dataArr[i].BWPS_Integrity__c,
                        instructor:dataArr[i].Schedule_Class__r.BWPS_instructor__r.Name,
                        description:dataArr[i].Schedule_Class__r.BWPS_Description__c,
                        meetingurl:dataArr[i].Schedule_Class__r.BWPS_Lecture_Link__c,
                        meetingId:dataArr[i].LectureId__c,
                        favClassStatus:fav?this.favIcon:this.unFavIcon,
                        time:timeofEvent,   
                        classendtime:endtime,
                        classCss:className,
                        lavel:signal,
                      }
                      obj['timeAndDay'] = timeofEvent+' / '+dataArr[i].BWPS_ClassDay__c.toUpperCase().slice(0, 3);
                      console.log('DateKey>>> ',dataArr[i].BWPS_ClassDate__c,'roundTime>> ',roundTime);
                      if(this.mapofTime.get(roundTime).hasOwnProperty(dataArr[i].BWPS_ClassDate__c)){
                        this.mapofTime.get(roundTime)[dataArr[i].BWPS_ClassDate__c].push(obj);
                      }else{
                            this.mapofTime.get(roundTime)[dataArr[i].BWPS_ClassDate__c] = [obj];
                      }
                }
              }
            }
        }
        this.eventsData=arrOfevent;
        this.totalDayRec =  this.eventsData.length;
        this.dayDataloading = false;
        if(this.weekBtn){
            this.weekEventHandler();
        }
        //  if(dataArr != null && dataArr != undefined){
        //  this.checkFirst = false;
        //  console.log('This.firstcheck>>> ',this.checkFirst);
        // }
     } else {
        console.log(error);
     }
    }

    // showing date initial without any operation od function call
    initialDate() {
        if(this.firstrun==0){
            var intialDateObj = new Date();
            this.day = intialDateObj.getDate();
            this.monthNo = intialDateObj.getMonth();
            this.month = this.months[this.monthNo];
            this.year = intialDateObj.getFullYear();
            this.fulldate = this.month + " " + this.day + ", " + this.year;
            this.template.querySelector(".fullDate").innerHTML = this.fulldate;
        }
        this.firstrun+=1;
    }
    redirectToParticipate(){
        window.open('/PFNCADNA/s/guestuserhowtoparticipate','_self');
    }
    @track showIframe= false;
    StartClass(){
        this.showIframe = !this.showIframe;
        this.timer();
        console.log('timerstart>>> ' ,this.ss);
        // this.startClassVar >>> single class access vedio fields>>>>
    }
    offIframe(){
       this.showIframe = !this.showIframe;
    //    clearInterval(this.intevelId);
    //   console.log('timeroff>>> ',`${this.ss} ss: ${this.mm} mm : ${this.hh} hh`);
    }
    timer(){
    //  this.intevelId = setInterval(() => {
    //     if(this.ss<59){
    //         this.ss= this.ss+ 1; 
    //      } else if(this.mm < 59 && this.ss == 59){
    //          this.mm =  this.mm +1;
    //          this.ss = 0;
    //      } else if (this.mm == 59){
    //          this.hh =this.hh+1;
    //      }
    //  this.timecount = `${this.ss} ss: ${this.mm} mm : ${this.hh} hh`;
    //  console.log(`${this.ss} ss: ${this.mm} mm : ${this.hh} hh`);
    // }, 1000);
   
}
    //week events handler for formate week data 
    weekEventHandler(){
        console.log('hendlerCall');
        var arr =[];
        var lableval = 0 ;
        var objKey =0;
        for (let i = 0; i < 9; i++) {
            var dateIttrator = new Date(this.sundayDate);
            var timeEvents = this.mapofTime.get(this.timeLable[lableval])
            console.log('timeEvents>>> ',JSON.stringify(timeEvents));
             for(let j=0;j<7;j++){
                var dayKey = dateIttrator.getDate().toString().length == 1 ? `0${dateIttrator.getDate()}` : `${dateIttrator.getDate()}`;
                var monthkey =(dateIttrator.getMonth()+1).toString().length == 1 ? `0${dateIttrator.getMonth()+1}`:`${dateIttrator.getMonth()+1}`;
                var keyOfDate =`${dateIttrator.getFullYear()}-${monthkey}-${dayKey}`;
                console.log('keyOfDate',keyOfDate);
                if(timeEvents.hasOwnProperty(keyOfDate)){
                    console.log('DateEvents>>>',JSON.stringify(timeEvents[keyOfDate]));
                    const obje= {
                        key:`Event-${objKey}`,
                        eventsClass:timeEvents[keyOfDate],
                     }
                     arr.push(obje);
                } else {
                    const obje= {
                              key:`Event-${objKey}`,
                              eventsClass:[]
                           }
                    arr.push(obje);
                }
                dateIttrator.setDate(dateIttrator.getDate() +1);
                objKey++;
             } 
            
            // for (let [key, value] of this.mapofTime) {
            //     console.log(key + " = " + value);
            // }
    //     if(i == 5){
    //     const obje= {
    //         key:`Event-${i}`,
    //         eventsClass:[{key:`event-${i}`, eventName: 'Dance class ...',time : 'full-block'}]
    //     }
    //    arr.push(obje);
    //    } else if(i==7){
    //     const obje= {
    //         key:`Event-${i}`,
    //         eventsClass:[{ key:`event-${i}`, eventName: 'Dance class for parkisegdgsdggh', time : 'half-block-up'}]
    //      }
    //     arr.push(obje);
    //    } else if (i==8) { 
    //         const obje= {
    //             key:`Event-${i}`,
    //             eventsClass:[{key:`event-${i}`, eventName: 'Dance class ...', time : 'half-block-down'}]
    //         }
    //          arr.push(obje);
    //    } else {
    //             const obje= {
    //                 key:`Event-${i}`,
    //                 eventsClass:[]
    //             }
    //             arr.push(obje);
    //     }
      lableval++;
     }
    //     this.showWeak =true;
    console.log ('atrrr>>>>>',JSON.stringify(arr));
    this.weekData = arr;
    }
    showNotificationMethod(){
        this.showNotificationFlag = !this.showNotificationFlag;
    }
    // changing th month formate 
    changeMonthMethod() {
        this.monthNo = this.updatedDate.getMonth();
        this.month = this.months[this.monthNo];
        this.year = this.updatedDate.getFullYear();
        this.fullmonth = this.month + " " + this.year;
        this.template.querySelector(".fullDate").innerHTML = this.fullmonth;

    }

    // changing the week formate
    changeWeekMethod() {
        // console.log("day of the this date is: ", dayOfDate);
        this.sundayDate = new Date(this.updatedDate);
        this.sundayDate.setDate(this.sundayDate.getDate()-this.sundayDate.getDay())
        this.saturdayDate = new Date(this.sundayDate);
        this.saturdayDate.setDate(this.saturdayDate.getDate()+6)
        this.StartDate = new Date(this.sundayDate); 
        this.endDate = new Date(this.saturdayDate);
        var saturday = this.months[this.saturdayDate.getMonth()] + " " + this.saturdayDate.getDate() + ", " + this.saturdayDate.getFullYear();
        var sunday = this.months[this.sundayDate.getMonth()] + " " + this.sundayDate.getDate();
        this.fullweek = sunday + " - " + saturday;
        var weekshow = this.template.querySelector(".fullDate");
        weekshow.innerHTML = this.fullweek;

    }

    changeDateFormat() {
        this.day = this.updatedDate.getDate();
        this.monthNo = this.updatedDate.getMonth();
        this.month = this.months[this.monthNo];
        this.year = this.updatedDate.getFullYear();
        this.fulldate = this.month + " " + this.day + ", " + this.year;
        this.template.querySelector(".fullDate").innerHTML = this.fulldate;
    }

    nextClickHandler() {
        // this.updatedDate.setMonth(this.updatedDate.getMonth() - 1);
        console.log('MonthBeforeINC>>>',this.months[this.updatedDate.getMonth()],' Date>>',this.updatedDate);
        if (this.dayBtn == true) {
            this.showBackButton = true;
            var tomorrowDate = this.template.querySelector(".fullDate");
            this.updatedDate.setDate((this.updatedDate.getDate() + 1));
            //const dateIssue = new Date(this.updatedDate);
            this.dayDataloading = true;
            this.StartDate = new Date(this.updatedDate); //new Date(dateIssue.setDate((dateIssue.getDate() + 1)));
            this.endDate = new Date(this.StartDate);
            this.changeDateFormat();
            tomorrowDate.innerHTML = this.fulldate;
        }
        else if (this.weekBtn == true) {
           // var dayOfDate = this.updatedDate.getDay();
           console.log('nextWeekSunday', this.sundayDate);
           this.sundayDate.setDate(this.sundayDate.getDate()+7)
            //saturdayDate.setDate((this.updatedDate.getDate() + (7 - dayOfDate-1)));
            this.saturdayDate = new Date(this.sundayDate);
            this.saturdayDate.setDate(this.saturdayDate.getDate()+6);
            console.log('nextWeekSunday', this.saturdayDate);
            // sundayDate.setDate((this.updatedDate.getDate() - (dayOfDate)));
            var saturday = this.months[this.saturdayDate.getMonth()] + " " + this.saturdayDate.getDate() + ", " + this.saturdayDate.getFullYear();
            var sunday = this.months[this.sundayDate.getMonth()] + " " + this.sundayDate.getDate();
            this.fullweek = sunday + " - " + saturday;
            this.showBackButton = true;
            this.dayDataloading = true; // for loading on day in week
            this.StartDate = new Date(this.sundayDate); 
            this.endDate = new Date(this.saturdayDate);
            var weekshow = this.template.querySelector(".fullDate");
            weekshow.innerHTML = this.fullweek;
            // const weekComp = this.template.querySelector('c-week-Calendar');
            // weekComp.closeOpenEventCard();
            // weekComp.getWeek(this.sundayDate);
        }
        else if (this.monthBtn == true) {
            console.log('NextMothPress');
            console.log('MonthBeforeINC>>>',this.months[this.updatedDate.getMonth()],' Date>>',this.updatedDate);
            var nextMonth = this.template.querySelector(".fullDate");
            this.updatedDate.setMonth(this.updatedDate.getMonth() + 1);
            console.log('NextMonth>>>', this.months[this.updatedDate.getMonth()],'>>>>>>>');
            this.changeMonthMethod();
            nextMonth.innerHTML = this.fullmonth;
            var dateVal = new Date(this.updatedDate);
            const objChild = this.template.querySelector('c-calendar-Comp');
            objChild.closeEventCard();
            objChild.getMonthData(dateVal);

        }
    }

    prevClickHandler() {
        console.log('Prevclick>>>',this.months[this.updatedDate.getMonth()],' Date>>',this.updatedDate);
        if (this.dayBtn == true) {
            var tomorrowDate = this.template.querySelector(".fullDate");
            this.updatedDate.setDate((this.updatedDate.getDate() - 1));
            this.dayDataloading = true;
            let newDate = new Date(this.updatedDate);
            newDate.setHours(5,0,0,0);
            this.todayStartDate.setHours(5,0,0,0);
            console.log('dateTime : ',this.updatedDate,this.todayStartDate);
            this.showBackButton = newDate.valueOf() == this.todayStartDate.valueOf()? false :true;
            this.StartDate = new Date(this.updatedDate);
            this.endDate = new Date(this.updatedDate);
            console.log('startEndDate : ',this.StartDate,this.endDate);
            this.changeDateFormat();
            tomorrowDate.innerHTML = this.fulldate;
        }

        else if (this.weekBtn == true) {
          this.sundayDate.setDate(this.sundayDate.getDate()-7);
          this.saturdayDate = new Date(this.sundayDate);
          this.saturdayDate.setDate(this.saturdayDate.getDate()+6)
          var saturday = this.months[this.saturdayDate.getMonth()] + " " + this.saturdayDate.getDate() + ", " + this.saturdayDate.getFullYear();
          var sunday = this.months[this.sundayDate.getMonth()] + " " + this.sundayDate.getDate();
          this.fullweek = sunday + " - " + saturday;
          this.StartDate = new Date(this.sundayDate); 
          this.endDate = new Date(this.saturdayDate);
          this.dayDataloading = true; // for loading day week aswell
         this.showBackButton = this.todayStartDate <= this.saturdayDate &&  this.todayStartDate >= this.sundayDate ? false :true;
          var weekshow = this.template.querySelector(".fullDate");
          weekshow.innerHTML = this.fullweek;
        //   const weekComp = this.template.querySelector('c-week-Calendar');
        //   weekComp.closeOpenEventCard();
        //   weekComp.getWeek(this.sundayDate);
        }

        else if (this.monthBtn == true) {
            console.log('prevBEforeUpdate>>>',this.months[this.updatedDate.getMonth()],' Date>>',this.updatedDate);
            var prevMonth = this.template.querySelector(".fullDate");
            this.updatedDate.setMonth(this.updatedDate.getMonth() - 1);
            this.changeMonthMethod();
            console.log('prevAfterreUpdate>>>',this.months[this.updatedDate.getMonth()],' Date>>',this.updatedDate)
            prevMonth.innerHTML = this.fullmonth;
            var dateVal = new Date(this.updatedDate);
            const objChild = this.template.querySelector('c-calendar-Comp');
            objChild.closeEventCard();
            objChild.getMonthData(dateVal);
        }
    }

    dayClickHandler() {
        this.showBackButton = false;
        this.dayBtn = true;
        this.weekBtn = false;
        this.monthBtn = false;
        this.updatedDate = new Date();
        this.changeDateFormat();
        this.template.querySelector(".week-tag").className = 'box-click-deactive week-tag';
        this.dayDataloading = true;
        this.StartDate = new Date(this.updatedDate);
        this.endDate = new Date(this.updatedDate);
        this.template.querySelector(".month-tag").className = 'box-click-deactive month-tag';
        this.template.querySelector(".day-tag").className = 'box-click-active day-tag';
        const objChild = this.template.querySelector('c-calendar-Comp');
        objChild.hideMonthView();
        const weekComp = this.template.querySelector('c-week-Calendar');
        weekComp.hideWeek();
        
    }

    weekClickHandler() {
        this.showBackButton = false;
        this.dayDataloading = true;
        this.dayBtn = false;//change to true
        this.weekBtn = true;// change to false
        this.monthBtn = false;
        this.updatedDate = new Date();
        this.changeWeekMethod();
        this.template.querySelector(".month-tag").className = 'box-click-deactive month-tag';
        this.template.querySelector(".day-tag").className = 'box-click-deactive day-tag';
        this.template.querySelector(".week-tag").className = 'box-click-active week-tag';
        // const objChild = this.template.querySelector('c-calendar-Comp');
        // objChild.hideMonthView();
      // week component called
       this.sundayDate.setDate(this.sundayDate.getDate()-this.sundayDate.getDay())
    //    const weekComp = this.template.querySelector('c-week-Calendar');
    //    weekComp.getWeek(this.sundayDate);
    }

    monthClickHandler() {
        this.dayBtn = false;
        this.weekBtn = false;
        this.monthBtn = true;
        this.updatedDate = new Date();
        this.changeMonthMethod();
        this.template.querySelector(".week-tag").className = 'box-click-deactive week-tag';
        this.template.querySelector(".day-tag").className = 'box-click-deactive day-tag';
        this.template.querySelector(".month-tag").className = 'box-click-active month-tag';
        var dateVal = new Date(this.updatedDate);
        const objChild = this.template.querySelector('c-calendar-Comp');
        objChild.getMonthData(dateVal);
        const weekComp = this.template.querySelector('c-week-Calendar');
        weekComp.hideWeek();
    }
    addEvent(){
        // this.addClass=true;
    }
    closeAddClass(){
        this.addClass=false;  
    }
    removeClassHandler(){
        this.removeClass = true;
        this.eventsOfDay = [];
    }
    removeClassClose(){
        this.removeClass = false;
        this.eventsOfDay = [];
    }

    /***************************** this function use to convert milisecond to time *************************************************/
timeInHours(miliseconds){
    var hours = Math.floor(miliseconds / (1000*60 * 60));
    var divisor_for_minutes = miliseconds  % (1000*60 * 60);
    var minutes = Math.floor(divisor_for_minutes / (60*1000));
    var formatedHr=hours.toString().length ==1 ? `0${hours}`:hours;
    var formatedMinuts= minutes.toString().length ==1 ? `0${minutes}`:minutes ;
    return  this.convert12Clock(formatedHr+ ':'+formatedMinuts);
 }
 /***************************** End Of time convertor function  *************************************************/
 /*********************************** time formate into 12 hr clock start***************************************/
 convert12Clock(str){
    var time='';
    var h1 = Number(str[0] - '0');
    console.log(h1);
    var h2 = Number(str[1] - '0');
     console.log(h2);
    var hh = h1 * 10 + h2;
    var Meridien;
    if (hh < 12) {
         Meridien = "AM";
     }else{
        Meridien = "PM";  
     } 
     hh%=12;
     if (hh == 0) {
         time = '12';
         time+=str.substring(2);
     }
     else {
        time = hh.toString().length ==1 ? `0${hh}`:hh;
        time+=str.substring(2);
     }
  time +=Meridien;
  return time;
}
/*********************************** time formate into 12 hr clock end *********************************/

/*************************************for convert time into date value ***************************** */
@track eventsRemoveIds=[];
getDateFromHours(time) {
    time = time.split(':');
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time);
}
getIdOfEvt(event){
var dataId = event.target.getAttribute('data-id');
if(event.target.checked){
    console.log('Data>>> ',dataId)
    this.eventsRemoveIds.push(dataId);
} else {
    var index = this.eventsRemoveIds.indexOf(event.target.getAttribute('data-id'));
     this.eventsRemoveIds.splice(index, 1)
}
console.log('EVENTS IDS>>>> ', JSON.stringify(this.eventsRemoveIds));

}

handelDateChange(evt){
this.dateOfDay = evt.target.value;
}
@wire(guestEventsDateBetween,{satrtDate:'$dateOfDay',endDate:'$dateOfDay'})
dayData(data,error){ 
var  dataArr =[];
var finalEvntArr =[];
if(data){
  dataArr  =  data.data;
 // console.log('dataArr>>>> ',JSON.stringify(dataArr));
  if(dataArr != null && dataArr != undefined){ 
     for(let i=0 ;i< dataArr.length;i++){
        const event = Object.assign({}, dataArr[i]);
        event["BWPS_StartTime__c"] = this.timeInHours(event.BWPS_StartTime__c);
        finalEvntArr.push(event);
    }
  }
 this.eventsOfDay = finalEvntArr;
 this.numberOfClasses = finalEvntArr.length;
 console.log('dayData>>>> ', JSON.stringify(this.eventsOfDay));
}
else{
    console.log('Error>> ',error)
}
}
removeNextHandler(){
if(this.eventsRemoveIds.length > 0){
    this.removeClass = false;
    this.conformremove = true;
} else{
    window.alert("Please select class/classes which you want to remove from your calendar");
}
}
conformColose(){
    this.eventsRemoveIds =[];
    this.removeClass = true;
    this.conformremove = false; 
}
removeFromCalender(){
    removeEvent({clsIds:this.eventsRemoveIds}).then(result=>{
     console.log('Result>>> ',result)
     this.eventsRemoveIds =[];
     this.removeClass = false;
     this.conformremove = false; 
     if(result =="Success"){
        this.template.querySelector('c-toast-message').showToast('success', `${result}.Class removed Successfully`);
     } else {
        this.template.querySelector('c-toast-message').showToast('error', 'Error While removing class.');
     }
     if(this.dayBtn || this.dayBtn){
        return refreshApex(this.Data1);
     } else {
        var dateVal = new Date(this.updatedDate);
        const objChild = this.template.querySelector('c-calendar-Comp');
        objChild.getMonthData(dateVal);
     }
    
   
    }).catch(e=>{
        this.eventsRemoveIds =[];
        this.removeClass = false;
        this.conformremove = false; 
        console.log('ERROR>>>',JSON.stringify(e));
        this.template.querySelector('c-toast-message').showToast('error', 'Error While removing class.'); 
    })
}
@track scheduleClass={};
@track classDataModel = false;
handleSelectedLookup(event){
    this.classDataModel= false;
    console.log('Evet Detail',JSON.stringify(event.detail))
    if(event.detail != null && event.detail != undefined){
    getClassData({recordId:event.detail}).then(result=>{
        console.log('ScheduleClass>> ',JSON.stringify(result));
        if(result != null){
            result['BWPS_StartTime__c'] = this.timeInHours(result.BWPS_StartTime__c);
            result['BWPS_EndTime__c'] =   this.timeInHours(result.BWPS_EndTime__c);
        this.scheduleClass = result;
        } else{
            this.template.querySelector('c-toast-message').showToast('error', 'Error While geting schedule class.');  
        }
        this.classDataModel= true;
    }).catch(e=>{
        this.template.querySelector('c-toast-message').showToast('error', 'Error While geting schedule class.'); 
    });
}
}
enroledHandler(){
    if(this.scheduleClass.BWPS_Status__c == 'Active'){
        addclass({recordId:this.scheduleClass.Id}).then(result=>{
         if(result=='Success'){
         this.closeAddClass();
         this.scheduleClass ={};
         this.template.querySelector('c-toast-message').showToast('success', `${result}.Class add Successfully`);
         } else if(result == 'Already enroled in this class.') {
            this.template.querySelector('c-toast-message').showToast('error', 'Already enroled in this class.');
         } 
         if(this.dayBtn || this.weekBtn){
            return refreshApex(this.Data1);
         } else if(this.monthBtn) {
            var dateVal = new Date(this.updatedDate);
            const objChild = this.template.querySelector('c-calendar-Comp');
            objChild.getMonthData(dateVal);
         }
         this.classDataModel= false;
        }).catch(e=>{
            this.template.querySelector('c-toast-message').showToast('error', 'Error While scheduling class.');
        }) 
    } else if(this.scheduleClass.BWPS_Status__c == 'Deactive'){
        this.template.querySelector('c-toast-message').showToast('error', 'Schedule class not Active.'); 
    }
}
}