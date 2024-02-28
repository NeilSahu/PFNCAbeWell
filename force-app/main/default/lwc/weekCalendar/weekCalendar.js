/*
* @author     	 Cyntexa Labs
* @description	 This is week component js use to generate Event Arrry and generate dynamic dates. 
* @date       	 09-10-2022          	
*/

import { api, LightningElement, track } from 'lwc';
import { publish,subscribe,unsubscribe,createMessageContext,releaseMessageContext } from 'lightning/messageService';
import IFRAMEMC from "@salesforce/messageChannel/ZoomSdkMessageChannel__c";
import VIMEOMC from "@salesforce/messageChannel/VimeoOff__c";

import backgroundUrl from '@salesforce/resourceUrl/ExerciseImage';
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
import FAVORITE from '@salesforce/resourceUrl/likeButtonSvg';
import Instructor from '@salesforce/resourceUrl/InstructorLogo';
import updateTime from '@salesforce/apex/BWPS_LoginUserProfileCtrl.updateAttendeeTime';
// import allEntitySubs from '@salesforce/apex/DNA_GuestUserClass.allEntitySubs';
import follow from '@salesforce/apex/DNA_GuestUserClass.follow';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';

export default class WeekCalendar extends LightningElement {
context = createMessageContext();
subscription2 = null; 
@track favIcon =  `${allIcons}/PNG/Favorite.png `;
@track unFavIcon = `${allIcons}/PNG/unfavorite.png `;
todaysDate = new Date();
@track weekArray =[];
@track eventArray =[];
//like =  `${SVG_LIKE}#Favorite`;
favorite=FAVORITE;
usericon=Instructor;
isToday=false;
showWeak = false;
@track previousEvent ='';
@api weekevnts;
@api eventmap;
@api subsmap;
@track clickedEvent ={};
@track playersrc ='';
@track showIframe =false;
@api
hideWeek(){
    this.showWeak =false;
}
@api
closeOpenEventCard(){
if(this.previousEvent != '' && this.previousEvent != null && this.previousEvent != undefined
&&  this.template.querySelector(`[data-id=${this.previousEvent}]`) != null){
this.hideEvent();
}
}
@api
getWeek(weekstart) {
 this.weekArray =[];
 var weekstartDate = new Date(weekstart);
 for(let i=0;i<7;i++){
    if(i>0){
     weekstartDate.setDate(weekstartDate.getDate()+1);
    }
    if(weekstartDate.getDate()== this.todaysDate.getDate() && weekstartDate.getDay()== this.todaysDate.getDay() 
    && weekstartDate.getFullYear() == this.todaysDate.getFullYear()) {
        this.isToday = true;
    } else {
        this.isToday=false;
    }
   const obj = {
       date:weekstartDate.getDate(),
        todayDate:this.isToday,
         key:i
   }
   this.weekArray.push(obj);
}
// var arr =[];
// for (let i = 0; i < 63; i++) {
//     if(i == 5){
//         const obje= {
//             key:`Event-${i}`,
//             eventsClass:[{key:`event-${i}`, eventName: 'Dance class ...',time : 'full-block'}]
//         }
//         arr.push(obje);
//     } else if(i==7){
//         const obje= {
//             key:`Event-${i}`,
//             eventsClass:[{ key:`event-${i}`, eventName: 'Dance class for parkisegdgsdggh', time : 'half-block-up'}]
//         }
//         arr.push(obje);
//     } else if (i==8) { 
//             const obje= {
//                 key:`Event-${i}`,
//                 eventsClass:[{key:`event-${i}`, eventName: 'Dance class ...', time : 'half-block-down'}]
//             }
//             arr.push(obje);
//          } else {
//                 const obje= {
//                     key:`Event-${i}`,
//                     eventsClass:[]
//                 }
//                 arr.push(obje);
//             }
//         }
        this.showWeak =true;
        // this.eventArray = arr;
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

getdataEvnt(event){
    if(this.previousEvent != '' && this.previousEvent != null && this.previousEvent != undefined
    &&  this.template.querySelector(`[data-id=${this.previousEvent}]`) != null){
        this.template.querySelector(`[data-id=${this.previousEvent}]`).style.backgroundColor = '#008ba7';
      } 
    this.template.querySelector(`[data-id=${event.target.getAttribute('data-id')}]`).style.backgroundColor = '#9da4b4';
    this.previousEvent = event.target.getAttribute('data-id');
    var x = event.clientX;
    var y = event.clientY;
    this.clickedEvent ={};
    var eventDataItem = this.eventmap.get(event.target.getAttribute('data-id'));
    var timeOfClass = this.timeInHours(eventDataItem.BWPS_StartTime__c);
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
  //  console.log('timeOfClass>>> ',timeOfClass);
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
    console.log('out2 : ',);
    this.clickedEvent['Name'] =  eventDataItem.Name;
    this.clickedEvent['Id'] = eventDataItem.Id;
    this.clickedEvent['classDate'] =  eventDataItem.BWPS_ClassDate__c;
    this.clickedEvent['intensity'] =  eventDataItem.BWPS_Integrity__c;
    this.clickedEvent['instructor'] =  eventDataItem.Schedule_Class__r.BWPS_instructor__r.Name;
    this.clickedEvent['description'] = eventDataItem.Schedule_Class__r.BWPS_Description__c;
    this.clickedEvent['vimeoId'] = eventDataItem.BWPS_Vimeo_video_Id__c;
    this.clickedEvent['meetingId'] = eventDataItem.LectureId__c;
    this.clickedEvent['time'] =  timeOfClass +' / '+ eventDataItem.BWPS_ClassDay__c.toUpperCase().slice(0, 3);
    this.clickedEvent['intencityicon'] =signal;
    this.clickedEvent['btnClass'] =btnClass;
    this.clickedEvent['btnLabel'] =btnLabel;
    this.clickedEvent['WatchTime'] =WatchTime;
    this.clickedEvent['favClassStatus'] = fav?this.favIcon:this.unFavIcon;
    console.log('clickedEVENT>>> ',this.clickedEvent);
  
     setTimeout(() => { 
        //this.showEvent = true;
    //    console.log('settimeOutCall');
        const elementt = this.template.querySelector("[data-id='event-continer-box']");
        let boundry = elementt.getBoundingClientRect();
        // for (const [key, value] of boundry) {
        //     console.log('boundry');
        //    console.log('Boundry',JSON.stringify(boundry));
            x = x-boundry.left+20;
            y = y-boundry.top+20;
        //   }
    if(parseInt(screen.width) >= 1300){
        if(x+500 > boundry.right){
        x = x-400;
        } else if (x < 40){
        x + 60;
        }
    if(y+400 > boundry.bottom){
        y -=200;
        }
    }
if(parseInt(screen.width) >= 1100  && parseInt(screen.width) < 1300){
if(x+500 > boundry.right){
    x = x-400;
    } else if (x < 40){
    x + 60;
    }
    if(y+400 > boundry.bottom){
    y -=200;
    }
} 
if(parseInt(screen.width) >= 1000  && parseInt(screen.width) < 1100){
if(x+395 > boundry.right){
    x = x-400;
    } else if (x < 40){
    x + 60;
    }
    if(y+400 > boundry.bottom){
    y -=200;
    }
} 
if(parseInt(screen.width) > 768  && parseInt(screen.width) < 1000){
if(x+328 > boundry.right){
    x = x-370;
    } else if (x < 40){
    x + 60;
    }
    if(y+400 > boundry.bottom){
    y -=200;
    }
} 
this.template.querySelector("[data-id='eventCardData']").style.display  = 'block'; 
if(parseInt(screen.width) > 768){
    this.template.querySelector("[data-id='eventCardData']").style.left  =x +'px'; 
    this.template.querySelector("[data-id='eventCardData']").style.top  = y+ 'px';
}
//   console.log('endSETTime Out');
    }, 100);
}

get backgroundStyle() {
    return `background-image:url(${backgroundUrl})`;
}

hideEvent(){
    this.template.querySelector(`[data-id=${this.previousEvent}]`).style.backgroundColor = '#008ba7';
    this.template.querySelector("[data-id='eventCardData']").style.display  = 'none'; 
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
/************** Play and or start and count time ******/
@track intevelId;
@track ss =1;
@track mm = 0;
@track hh = 0;
@track totalSec = 0;
StartClass(){
    // console.log('startClassLog : ');
    // //this.showIframe = !this.showIframe;
    // clearInterval(this.intevelId);
    // updateTime({watchTime:`${this.totalSec}`,classId :this.clickedEvent.Id}).then((r)=>{
    //   console.log('rrr>>',r);
    // }).catch(e=>{
    //    console.log('eee>>',e);
    // });

}
play(){
    //this.playersrc =`https://player.vimeo.com/video/${this.clickedEvent.vimeoId}`;
    //this.showIframe = true;
    let className = this.clickedEvent.btnLabel;
    if(className == 'PLAY ON-DEMAND' || className == 'COMPLETED' || className == 'RESUME' ){
        let videoId = this.clickedEvent.vimeoId;
        console.log('playOnDemand : ',videoId);
       // this.startTimer();
        this.updateCurrentVideoUrlHandler(videoId,this.clickedEvent.Id,this.clickedEvent.WatchTime);
    }
    if(className == 'JOIN'){
        let name = this.clickedEvent.instructor;
        let meetingId = this.clickedEvent.meetingId;
        console.log('playJoin : ',name,meetingId);
        this.sendZoomData(meetingId, name);
    }
}
// startTimer(){
//     this.intevelId = setInterval(() => {
//         if(this.ss<59){
//             this.ss= this.ss+ 1; 
//          } else if(this.mm < 59 && this.ss == 59){
//              this.mm =  this.mm +1;
//              this.ss = 0;
//          } else if (this.mm == 59){
//              this.hh =this.hh+1;
//          }
//          this.totalSec = this.totalSec+1;
//      console.log(`${this.ss} ss: ${this.mm} mm : ${this.hh} hh`);
//     },1000);
// }
    connectedCallback() {
        // this.subscription2 = subscribe(this.context, VIMEOMC, (message) => {
        //     // this.displayMessage(message);
        //     console.log('msg : ',message);
        //    if(message.iframeStatus == 'close'){
        //        console.log('msg3 : ');
        //         //this.closeIframeTime();
        //         this.StartClass();
        //    }
        // });
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