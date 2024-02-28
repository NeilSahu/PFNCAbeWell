import { api, LightningElement,track,wire } from 'lwc';
import BWPS_MonthsName  from '@salesforce/label/c.BWPS_MonthsName';
import BWPS_WeekDays  from '@salesforce/label/c.BWPS_WeekDays';
import backgroundUrl from '@salesforce/resourceUrl/ExerciseImage';
import UserAvtar from '@salesforce/resourceUrl/shareImage';
//import Intencity from '@salesforce/resourceUrl/lowLevelSignal';
import getUserEvents from '@salesforce/apex/DNA_InstructorClass.instructorMonthData';
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
const currentDate = new Date();
export default class Bwps_instructorMonthView extends LightningElement {
    @track showEmailUI=false;
    todaydate = new Date();
    monthString = BWPS_MonthsName;
    weekString = BWPS_WeekDays;
    showEvent = false;
    usericon=UserAvtar;
    //intencityicon=Intencity;
    monthNumber = currentDate.getMonth();
    dataYear = currentDate.getFullYear();
    @track eventMap= new Map();
    @track previousEvent = '';
    @track eventIdKeyMap = new Map();
    @track clickedEvent ={};
    @track isLoading= false;
    mList
    isShowModal =false;
    WEEK_DAYS
    renderedCallback(){
        console.log('ListOfMonth>>>',this.monthString);
        this.mList =  this.monthString.split(",");
        console.log( this.mList);
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
                        data_id : `${this.mList[calendarStart.getMonth()]}_${calendarStart.getDate()}`,
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
                      console.log('lengthofArray>>> ',this.eventMap.get(keyOfEventMap).length);
                      console.log(JSON.stringify(this.eventMap.get(keyOfEventMap).slice(0,2)));
                       if(this.eventMap.get(keyOfEventMap).length >2 && parseInt(screen.width) > 768){
                         obj['eventdata'] = this.eventMap.get(keyOfEventMap).slice(0,2);
                         obj['showButton'] = true;
                         obj['moreEvents'] = this.eventMap.get(keyOfEventMap).slice(2,this.eventMap.get(keyOfEventMap).length);
                         obj['mobileView'] = true;
                       } else if(parseInt(screen.width) < 768){
                        obj['eventdata'] = this.eventMap.get(keyOfEventMap);
                        obj['showButton'] = false;
                        obj['mobileView'] = false;
                       } else if (parseInt(screen.width) > 768 && this.eventMap.get(keyOfEventMap).length <= 2){
                        obj['eventdata'] = this.eventMap.get(keyOfEventMap);
                        obj['showButton'] = false;
                        obj['mobileView'] = true;
                       }
                    }
                  //  console.log('FinalObjjj>> ',JSON.stringify(obj))
                    arr.push(obj);
           }
           this.fullmonth = arr;
           this.isLoading = false;
        }
    
     getEvent(event){
       if(this.previousEvent != '' && this.previousEvent != null && this.previousEvent != undefined
      && this.template.querySelector(`[data-id=${this.previousEvent}]`) != null){
        this.template.querySelector(`[data-id=${this.previousEvent}]`).style.backgroundColor = '#ddf0f3';
       } 
        this.template.querySelector(`[data-id=${event.target.getAttribute('data-id')}]`).style.backgroundColor = '#dee2e6';
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
            
        this.clickedEvent['Name'] =  eventDataItem.Name;
        this.clickedEvent['classDate'] =  eventDataItem.BWPS_ClassDate__c;
        this.clickedEvent['intensity'] =  eventDataItem.BWPS_Integrity__c;
        this.clickedEvent['instructor'] =  eventDataItem.Schedule_Class__r.BWPS_instructor__r.Name;
        this.clickedEvent['description'] = eventDataItem.Schedule_Class__r.BWPS_Description__c;
        this.clickedEvent['time'] =  timeOfClass +' / '+ eventDataItem.BWPS_ClassDay__c.toUpperCase().slice(0, 3);
        this.clickedEvent['intencityicon'] =signal;
        this.clickedEvent['Id'] =eventDataItem.Id;
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
                //  if(y+400 > boundry.bottom){
                //    y= 250;
                //  }
             }
        if(parseInt(screen.width) >= 1100  && parseInt(screen.width) < 1300){
            if(x+450 > boundry.right){
                x = x-430;
              } else if (x < 40){
                x + 60;
              }
              // if(y+400 > boundry.bottom){
              //   y =250;
              // }
          } 
          if(parseInt(screen.width) >= 1000  && parseInt(screen.width) < 1100){
            if(x+395 > boundry.right){
                x = x-420;
              } else if (x < 40){
                x + 60;
              }
              // if(y+400 > boundry.bottom){
              //   y =250;
              // }
          } 
          if(parseInt(screen.width) > 768  && parseInt(screen.width) < 1000){
            if(x+328 > boundry.right){
                x = x-350;
              } else if (x < 40){
                x + 60;
              }
              // if(y+400 > boundry.bottom){
              //   y =250;
              // }
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
            this.template.querySelector(`[data-id=${this.previousEvent}]`).style.backgroundColor = '#ddf0f3';
            this.template.querySelector("[data-id='eventCardData']").style.display  = 'none'; 
        }
        get backgroundStyle() {
            return `background-image:url(${backgroundUrl})`;
        }
    
        play(){
    
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
    
//display extra events
viewMoreEventItem(evet){
  if(this.template.querySelector(`[data-id=${evet.target.getAttribute('data-key')}]`).style.display  == 'none'){
    this.template.querySelector(`[data-id=${evet.target.getAttribute('data-key')}]`).style.display  = 'block'; 
    console.log('Added');
    this.template.querySelector(`[data-arr=${evet.target.getAttribute('data-key')}]`).style.transform = 'rotate(225deg)';
  } else {
    this.template.querySelector(`[data-id=${evet.target.getAttribute('data-key')}]`).style.display  = 'none'; 
    this.template.querySelector(`[data-arr=${evet.target.getAttribute('data-key')}]`).style.transform  = 'rotate(45deg)';
  }
}
opensendEmail(){
  this.showEmailUI = !this.showEmailUI;
}
takeAttendenceMethod(){
  console.log('ClickedEvt>t>> ',JSON.stringify( this.clickedEvent));
  var name = this.clickedEvent.Name;
  var scLineItemId =this.clickedEvent.Id;
  var time= this.clickedEvent.time;
  var date = this.clickedEvent.classDate;
  var className= this.clickedEvent.Name;
  var classDate =this.clickedEvent.classDate;
  var obj={
      SchId:scLineItemId,
      Name:name,
      Date:date,
      Time:time,
      ClassName:className,
      ClassDate : classDate
  }
  var result=window.btoa(JSON.stringify(obj));
  console.log('OUTPUT : ',result);
  window.open('/PFNCADNA/s/-instructordashboardtakeattendance?app='+result,'_self');
}
}