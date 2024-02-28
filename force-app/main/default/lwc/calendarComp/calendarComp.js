import { api, LightningElement,track,wire } from 'lwc';
import { publish,subscribe,unsubscribe,createMessageContext,releaseMessageContext } from 'lightning/messageService';
import IFRAMEMC from "@salesforce/messageChannel/ZoomSdkMessageChannel__c";
import VIMEOMC from "@salesforce/messageChannel/VimeoOff__c";

import BWPS_MonthsName  from '@salesforce/label/c.BWPS_MonthsName';
import BWPS_WeekDays  from '@salesforce/label/c.BWPS_WeekDays';
import backgroundUrl from '@salesforce/resourceUrl/ExerciseImage';
//import UserAvtar from '@salesforce/resourceUrl/userImage';
//import Intencity from '@salesforce/resourceUrl/lowLevelSignal';
import getUserEvents from '@salesforce/apex/BWPS_GuestMemberEvents.guestEvents';
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
import FAVORITE from '@salesforce/resourceUrl/likeButtonSvg';
import Instructor from '@salesforce/resourceUrl/InstructorLogo';
import updateTime from '@salesforce/apex/BWPS_LoginUserProfileCtrl.updateAttendeeTime';
import getAllEntitySubsMap from '@salesforce/apex/DNA_GuestUserClass.getAllEntitySubsMap';
import follow from '@salesforce/apex/DNA_GuestUserClass.follow';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';

const currentDate = new Date();

export default class CalendarComp extends LightningElement {
context = createMessageContext();
subscription2 = null;
@track favIcon =  `${allIcons}/PNG/Favorite.png `;
@track unFavIcon = `${allIcons}/PNG/unfavorite.png `;
todaydate = new Date();
monthString = BWPS_MonthsName;
weekString = BWPS_WeekDays;
showEvent = false;
usericon=Instructor;
favorite=FAVORITE;
//intencityicon=Intencity;
monthNumber = currentDate.getMonth();
dataYear = currentDate.getFullYear();
@track eventMap= new Map();
@track previousEvent = '';
@track eventIdKeyMap = new Map();
@track clickedEvent ={};
@track isLoading= false;
@track playersrc ='';
@track showIframe =false;
@api subsmap;
mList
isShowModal =false;
WEEK_DAYS
renderedCallback(){
    console.log('ListOfMonth>>>',this.monthString);
    this.mList =  this.monthString.split(",");
    console.log('WeekList>>>',this.weekString);
    this.WEEK_DAYS = this.weekString.split(";");
}
@track fullmonth=[];
istoday=false;
isCalendarMonth;
showCalendar=false;
innerString='';
 @track eventsDiv = [];


/* get calender */
@api
hideMonthView(){
    this.showCalendar = false;
}
/****This method use to hide event card when month is changed */
@api 
closeEventCard(){
  if(this.previousEvent != '' && this.previousEvent != null && this.previousEvent != undefined
  && this.template.querySelector(`[data-id=${this.previousEvent}]`) != null){
    this. hideEvent();
  }
}
/*** this method call from parent my schedule component to show month view of calender *****************/
@api
async getMonthData(dateVal){
    this.fullmonth = [];
    var monthstartDate = new Date();
    if(dateVal!= null && dateVal != '' && dateVal != undefined){
        monthstartDate = dateVal;
    }
    this.showCalendar = true;
    this.isLoading = true;
    monthstartDate.setDate(monthstartDate.getDate() - (monthstartDate.getDate()-1));
    this.monthNumber= monthstartDate.getMonth()+1;
    this.dataYear =  monthstartDate.getFullYear();
    this.eventMap.clear();
    this.eventIdKeyMap.clear();
 /**********************get month Event List ************************************************************************/
  // await this.getEventsOfMonth();
   await  getUserEvents({ monthOfData:this.monthNumber, yearOfData:this.dataYear})
        .then(result => {
            for(let i=0 ; i< result.length;i++){
             if(this.eventMap.has(result[i].BWPS_ClassDate__c)){
                 this.eventMap.get(result[i].BWPS_ClassDate__c).push(result[i]);
             }
             else{
                 this.eventMap.set(result[i].BWPS_ClassDate__c,[result[i]]);
             }
             this.eventIdKeyMap.set(result[i].Id,result[i]);
            }
        })
        .catch(error => {
            console.log('Errorured:- '+error.body.message);
        });
/**********************get month Event end************************************************************************/
    var calendarStart = new Date(monthstartDate);
    calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay());
    var arr =[];
     // creating date object which having  event detail repected date
        for(let i=0; i<42; i++){
            if(i>0){ 
                calendarStart.setDate(calendarStart.getDate() +1);
            }
            // finding date is today date or not
            if(calendarStart.getDate()  == this.todaydate.getDate() && calendarStart.getDay()  == this.todaydate.getDay() && calendarStart.getMonth() == this.todaydate.getMonth()){
               this.istoday =true;
            } else {
                this.istoday =false;
            }
            // finding date is refering from current month or not 
            if(calendarStart.getMonth()==monthstartDate.getMonth()){
               this.isCalendarMonth = 'yesCalanderMonth';
            } else {
                this.isCalendarMonth = 'notCalanderMonth';
            }
           // final date object creation 
            const obj = {
                    data_id : `${this.mList[calendarStart.getMonth()+1]}_${calendarStart.getDate()}`,
                    value : calendarStart.getDate(),
                    istoday :this.istoday,
                    calandarDay :`${this.WEEK_DAYS[calendarStart.getDay()]}`,
                    key: i,
                    calandarMonth : 'date ' + this.isCalendarMonth,
                  
                };
                //finding event of date and attached to date object
                var dayEvKey = calendarStart.getDate().toString().length == 1 ? `0${calendarStart.getDate()}` : `${calendarStart.getDate()}`;
                var monthEvkey =(calendarStart.getMonth()+1).toString().length == 1 ? `0${calendarStart.getMonth()+1}`:`${calendarStart.getMonth()+1}`;
                var keyOfEventMap = `${calendarStart.getFullYear()}-${monthEvkey}-${dayEvKey}`;
                if(this.eventMap.has(keyOfEventMap)){
                    obj['eventdata'] = this.eventMap.get(keyOfEventMap);
                }
                arr.push(obj);
       }
       this.fullmonth = arr;
       this.isLoading = false;
    }

 getEvent(event){
   if(this.previousEvent != '' && this.previousEvent != null && this.previousEvent != undefined
  && this.template.querySelector(`[data-id=${this.previousEvent}]`) != null){
    this.template.querySelector(`[data-id=${this.previousEvent}]`).style.backgroundColor = '#008ba7';
   } 
    this.template.querySelector(`[data-id=${event.target.getAttribute('data-id')}]`).style.backgroundColor = '#9da4b4';
    this.previousEvent = event.target.getAttribute('data-id');
     this.showEvent = false;
     var x = event.clientX;
     var y = event.clientY;
  //  console.log('SCREEENSIZE>>>>',screen.width , typeof(screen.width));
     this.clickedEvent ={};
   //  console.log('>>>> X ',x,' >>>>  Y ',y);
     var eventDataItem = this.eventIdKeyMap.get(event.target.getAttribute('data-id'));
     var timeOfClass = this.timeInHours(eventDataItem.BWPS_StartTime__c);
   //  console.log('iinnn>>>',eventDataItem.BWPS_Integrity__c)
     var signal;
     let sig = eventDataItem.BWPS_Integrity__c;
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
            console.log('Signal>>>',signal);
    //button validation logic
     let AttendeeStatus = '', WatchTime = '0';
        if(eventDataItem.hasOwnProperty('Attendees_del__r')){
            AttendeeStatus = eventDataItem.Attendees_del__r[0].Class_Status__c??'';
            WatchTime = eventDataItem.Attendees_del__r[0].BWPS_WatchedTimeStamp__c??'0';
         }
    let jDate = new Date(new Date(eventDataItem.BWPS_ClassDate__c));
    let j1Date = new Date();
    jDate.setHours(0,0,0,0);
    let datestart = new Date();
    datestart.setHours(0,0,0,0);
    let todayms = j1Date.getTime() - datestart.getTime();
    j1Date.setHours(0,0,0,0);
    let btnClass = '';
    let btnLabel = 'JOIN';
    console.log('j1Date : ',j1Date);
    console.log('check : ',jDate);
    if(j1Date-jDate == 0){
        let updatedLineItemStartTime = Number(eventDataItem.BWPS_StartTime__c) - 900000;
        let updatedLineItemEndTime = Number(eventDataItem.BWPS_EndTime__c) + 900000;
        //cur['disabledClass'] = 'statusClass unDisabledClass';
        if(todayms >= updatedLineItemStartTime && todayms <= updatedLineItemEndTime){
            btnClass = 'box-orange-button';
        }
        else{
            if(eventDataItem.BWPS_Vimeo_video_Id__c != null && eventDataItem.BWPS_Vimeo_video_Id__c != undefined && eventDataItem.BWPS_Vimeo_video_Id__c != '' ){
                btnClass  = 'box-orange-button';
                 if(AttendeeStatus == 'RESUME'){
                   btnLabel = 'RESUME';
                }
                 else if(AttendeeStatus == 'COMPLETED'){
                  btnLabel = 'COMPLETED';
                }
                 else {
                  btnLabel = 'PLAY ON-DEMAND';
                }
            }else{
                btnLabel = (todayms >= updatedLineItemEndTime)?'OVER':'JOIN';
                btnClass = 'box-orange-button btnDisabled';

            }
        }
    }else{
        if(eventDataItem.BWPS_Vimeo_video_Id__c != null && eventDataItem.BWPS_Vimeo_video_Id__c != undefined && eventDataItem.BWPS_Vimeo_video_Id__c != '' ){
                btnClass  = 'box-orange-button';
                if(AttendeeStatus == 'RESUME'){
                   btnLabel = 'RESUME';
                }
                 else if(AttendeeStatus == 'COMPLETED'){
                  btnLabel = 'COMPLETED';
                }
                 else {
                  btnLabel = 'PLAY ON-DEMAND';
                }
          } else {
            console.log('out1 : ',);
            btnLabel = (j1Date < jDate)?'JOIN':'OVER';
            btnClass = 'box-orange-button btnDisabled';
            }
    }    
    let fav = this.subsmap.hasOwnProperty(eventDataItem.Id);
    this.clickedEvent['Name'] =  eventDataItem.Name;
    this.clickedEvent['Id'] = eventDataItem.Id;
    this.clickedEvent['classDate'] =  eventDataItem.BWPS_ClassDate__c;
    this.clickedEvent['intensity'] =  eventDataItem.BWPS_Integrity__c;
    this.clickedEvent['instructor'] =  eventDataItem.Schedule_Class__r.BWPS_instructor__r.Name;
    this.clickedEvent['vimeoId'] = eventDataItem.BWPS_Vimeo_video_Id__c;
    this.clickedEvent['meetingId'] = eventDataItem.LectureId__c;
    this.clickedEvent['description'] = eventDataItem.Schedule_Class__r.BWPS_Description__c;
    this.clickedEvent['time'] =  timeOfClass +' / '+ eventDataItem.BWPS_ClassDay__c.toUpperCase().slice(0, 3);
    this.clickedEvent['intencityicon'] =signal;
    this.clickedEvent['btnClass'] =btnClass;
    this.clickedEvent['WatchTime'] =WatchTime;
    this.clickedEvent['btnLabel'] =btnLabel;
    this.clickedEvent['favClassStatus'] = fav?this.favIcon:this.unFavIcon;
    setTimeout(() => { 
        //this.showEvent = true;
        const element = this.template.querySelector("[data-id='calenderparentCard']");
        let boundry = element.getBoundingClientRect();
        // for (const [key, value] of boundry) {
        //  console.log(JSON.stringify(boundry));
          x = x-boundry.left+20;
          y = y-boundry.top+20;
        //  console.log('bbbb',boundry.right,'x+392>>>',x+392,'XXXX>>>> ',x,'>>>>>y ',y);
         if(parseInt(screen.width) >= 1300){
             if(x+450 > boundry.right){
               x = x-430;
             } else if (x < 40){
               x + 60;
             }
             if(y+400 > boundry.bottom){
               y= 100;
             }
         }
    if(parseInt(screen.width) >= 1100  && parseInt(screen.width) < 1300){
        if(x+450 > boundry.right){
            x = x-430;
          } else if (x < 40){
            x + 60;
          }
          if(y+400 > boundry.bottom){
            y =100;
          }
      } 
      if(parseInt(screen.width) >= 1000  && parseInt(screen.width) < 1100){
        if(x+395 > boundry.right){
            x = x-420;
          } else if (x < 40){
            x + 60;
          }
          if(y+400 > boundry.bottom){
            y =100;
          }
      } 
      if(parseInt(screen.width) > 768  && parseInt(screen.width) < 1000){
        if(x+328 > boundry.right){
            x = x-350;
          } else if (x < 40){
            x + 60;
          }
          if(y+400 > boundry.bottom){
            y =100;
          }
      } 
        this.template.querySelector("[data-id='eventCardData']").style.display  = 'block'; 
        if(parseInt(screen.width) > 768){
            this.template.querySelector("[data-id='eventCardData']").style.left  =x+'px';// x-180+'px'; 
            this.template.querySelector("[data-id='eventCardData']").style.top  =y+'px'; //y-190+'px';
        }
      }, 100);
     
    }
    hideEvent(){
        this.showEvent = false;
        this.template.querySelector(`[data-id=${this.previousEvent}]`).style.backgroundColor = '#008ba7';
        this.template.querySelector("[data-id='eventCardData']").style.display  = 'none'; 
    }
    get backgroundStyle() {
        return `background-image:url(${backgroundUrl})`;
    }

    play(){

    }
   favHandler(event){
        console.log('IMAGE CLICK : ',event.target.dataset.image);
        console.log('Fav CLICK : ',this.favIcon);
        let src = this.template.querySelector(`[data-image=${event.target.dataset.image}]`).src;
        let favStr = src.split('PNG/')[1];
        let recId = event.target.dataset.image;
        console.log('Fav CLICK2 : ',favStr,src,this.favIcon,favStr == 'Favorite.png');
        if(favStr == 'Favorite.png'){
            console.log('in if : ');

            this.favoriteHandler(recId, true);
            this.template.querySelector(`[data-image=${event.target.dataset.image}]`).src=this.unFavIcon;
        }
        else{
            console.log('in else : ');
            this.favoriteHandler(recId, false);
            this.template.querySelector(`[data-image=${event.target.dataset.image}]`).src=this.favIcon;
        }
        console.log('IMAGE CLICK2 : ');

    }
    favoriteHandler(recId , status){
    //   let classId = event.target.dataset.id;
    //   let classStatus = event.target.dataset.isfav;
      //console.log('classStatus : ',classStatus);
      follow({recId : recId , isFollowing : status})
      .then(result => {
        //console.log('response : ',result);
        if(result == true){
            this.template.querySelector('c-toast-message').showToast('success', 'Update successfully.');
        }
        else if(result == false){
                this.template.querySelector('c-toast-message').showToast('success', 'Update successfully.');
        }
      })
      .catch(error => {
          console.log('Error : ',JSON.stringify(error));
      })

    }
 /***************************** this function use to convert milisecond to time *************************************************/
 timeInHours(miliseconds){
    var hours = Math.floor(miliseconds / (1000*60 * 60));
    var divisor_for_minutes = miliseconds  % (1000*60 * 60);
    var minutes = Math.floor(divisor_for_minutes / (60*1000));
    var formatedHr=hours.toString().length ==1 ? `0${hours}`:hours;
    var formatedMinuts= minutes.toString().length ==1 ? `0${minutes}`:minutes ;
    console.log('Time In 24 hrs:----',formatedHr+ ':'+formatedMinuts);
    return  this.convert12Clock(formatedHr+ ':'+formatedMinuts);
 }
 /***************************** End Of time convertor function  *************************************************/
 /*********************************** time formate into 12 hr clock start***************************************/
 convert12Clock(str){
    console.log('String Val Of Time:--',str);
    var time='';
    var h1 = Number(str[0] - '0');
    console.log(h1);
    var h2 = Number(str[1] - '0');
     console.log(h2);
    var hh = h1 * 10 + h2;
    console.log(hh);
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
        console.log('time>>>hr',hh,' >>length>>> ',hh.toString().length)
        time = hh.toString().length ==1 ? `0${hh}`:hh;
        time+=str.substring(2);
     }
  time +=Meridien;
  return time;
}

/*********************************** time formate into 12 hr clock end *********************************/


    /***************************** Wait for Events*************************************************/
    // async  getEventsOfMonth(){
    //     return new Promise(async (resolve, reject) => {
    //      await  getUserEvents({ monthOfData:this.monthNumber, yearOfData:this.dataYear})
    //     .then(result => {
    //         console.log('ResultOFEVENT>> ',result);
    //         for(let i=0 ; i< result.length ;i++){
    //          if(this.eventMap.has(result[i].BWPS_ClassDate__c)){
    //              this.eventMap.get(result[i].BWPS_ClassDate__c).push(result[i]);
    //          }
    //          else{
    //              this.eventMap.set(result[i].BWPS_ClassDate__c,[result[i]]);
    //          }
    //          this.eventIdKeyMap.set(result[i].Id,result[i]);
    //         }
    //         resolve(result);
    //     })
    //     .catch(error => {
    //         console.log('Errorured:- '+error.body.message);
    //         reject(error.body.message);
    //     });
    // });
    // }
@track intevelId;
@track ss =1;
@track mm = 0;
@track hh = 0;
StartClass(){
//   //this.showIframe = !this.showIframe;
//    updateTime({watchTime:`${this.ss} ss: ${this.mm} mm : ${this.hh} hh`,classId :this.clickedEvent.Id}).then((r)=>{
//       console.log('rrr>>',r);
//     }).catch(e=>{
//        console.log('rrr>>',e);
//     });
}
play(){
    //this.playersrc =`https://player.vimeo.com/video/${this.clickedEvent.vimeoId}`;
    //this.showIframe = true;
    let className = this.clickedEvent.btnLabel;
    if(className == 'PLAY ON-DEMAND' || className == 'COMPLETED' || className == 'RESUME' ){
        let videoId = this.clickedEvent.vimeoId;
        console.log('playOnDemand : ',videoId);
        this.startTimer();
        this.updateCurrentVideoUrlHandler(videoId,this.clickedEvent.Id,this.clickedEvent.WatchTime);
    }
    if(className == 'JOIN'){
        let name = this.clickedEvent.instructor;
        let meetingId = this.clickedEvent.meetingId;
        console.log('playJoin : ',name,meetingId);
        this.sendZoomData(meetingId, name);
    }
}
startTimer(){
    // this.intevelId = setInterval(() => {
    //     if(this.ss<59){
    //         this.ss= this.ss+ 1; 
    //      } else if(this.mm < 59 && this.ss == 59){
    //          this.mm =  this.mm +1;
    //          this.ss = 0;
    //      } else if (this.mm == 59){
    //          this.hh =this.hh+1;
    //      }
    //      this.totalSec = this.totalSec+1;
    //  console.log(`${this.ss} ss: ${this.mm} mm : ${this.hh} hh`);
    // },1000);
}
    connectedCallback() {
       ` // this.subscription2 = subscribe(this.context, VIMEOMC, (message) => {
        //     // this.displayMessage(message);
        //     console.log('msg : ',message);
        //    if(message.iframeStatus == 'close'){
        //        console.log('msg4 : ');
        //         //this.closeIframeTime();
        //         this.StartClass();
        //    }
        // });`
    }
    sendZoomData(meetingId, name) {
      console.log('send : ',meetingId ,name );
        let message = {
            meetingId : meetingId,
            AttendeeName : name,
            iframeStatus : 'Zoom'
        };
        publish(this.context, IFRAMEMC, message);
    }
    // updateCurrentVideoUrlHandler(videoId){
    //     let message = {
    //         videoId : videoId,
    //         iframeStatus : 'Vimeo'
    //     };
    //     publish(this.context, IFRAMEMC, message);
    // }

      updateCurrentVideoUrlHandler(videoId,scliId,watchTime){
        let message = {
            videoId : videoId,
            iframeStatus : 'Vimeo',
            scliId : scliId,
            watchTime : watchTime
        };
        publish(this.context, IFRAMEMC, message);
        //this.currentVideoUrl = "https://player.vimeo.com/video/"+videoId+"&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479";
        //this.currentVideoUrl = "https://player.vimeo.com/video/762784047?h=315f56a57e";
    }

}