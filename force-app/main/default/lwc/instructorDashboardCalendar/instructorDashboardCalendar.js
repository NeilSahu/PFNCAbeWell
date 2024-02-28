import { LightningElement, track, wire } from 'lwc';
import fetchUserDetail from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import { publish,subscribe,unsubscribe,createMessageContext,releaseMessageContext } from 'lightning/messageService';
import SAMPLEMC from "@salesforce/messageChannel/MyMessageChannel__c";
import instructorEventsDateBetween from '@salesforce/apex/DNA_InstructorClass.getInstructorEvent';
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';

export default class InstructorDashboardCalendar extends LightningElement {
    date;
    year;
    monthNo;
    month;
    day;
    calendar_icon =  `${allIcons}/PNG/Calendar.png `;
    prevlogo = `${allIcons}/PNG/Prev.png `;
    nextlogo = `${allIcons}/PNG/Next.png `;
    monthsec=false;
    fulldate;
    fullweek;
    fullmonth;
    //force stop initialDate multiple time
    @track firstrun=true; 
   
    //week 
    @track weekData;
    @track evetMap = new Map();
    timeLable = ["09:00AM","10:00AM","11:00AM","12:00AM","01:00PM","02:00PM","03:00PM","04:00PM","05:00PM"];
    @track mapofTime = new Map([
                ["09:00AM", {}],
                ["10:00AM", {}],
                ["11:00AM", {}],
                ["12:00AM", {}],
                ["01:00PM", {}],
                ["02:00PM", {}],
                ["03:00PM", {}],
                ["04:00PM", {}],
                ["05:00PM", {}]
         ]);
         @track  Start_Date = new Date();
         @track end_Date = new Date();  
    
    // sundayDate = new Date();
    // saturdayDate = new Date();
    @track   sundayDate = new Date();
    @track   saturdayDate = new Date();
   

    subscription = null;
    context = createMessageContext();

    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    dayBtn = true;
    weekBtn = false;
    monthBtn =false;
    updatedDate = new Date();
    @track userFirstName;
    @track crossBrowser = false;
    userData;
    Evendata;
    renderedCallback() {
        this.initialDate();
        let userAgent = navigator.userAgent;
        let browserName;
        if(userAgent.match(/chrome|chromium|crios/i)){
            browserName = "chrome";
          }else if(userAgent.match(/firefox|fxios/i)){
            browserName = "firefox";
            this.crossBrowser=true;
          }  else if(userAgent.match(/safari/i)){
            browserName = "safari";
          }else if(userAgent.match(/opr\//i)){
            browserName = "opera";
          } else if(userAgent.match(/edg/i)){
            browserName = "edge";
          }else{
            browserName="No browser detection";
          }
        
         console.log("You are using "+ browserName +" browser");  
         let dateInput = this.template.querySelector('.date-picker-input');
        dateInput.style.setProperty("--date-picker-background",`url(${this.calendar_icon})`);
    }
    getDateFromHours(time) {
        time = time.split(':');
        let now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time);
    }
    // clickDateInput(e){
    //     console.log('clicked date picker ');
    //     console.log('inputField>> ',JSON.stringify( this.template.querySelector('[data-id="date-picker"]')));
    //       e.preventDefault();
    //     var inputfield =  this.template.querySelector('[data-id="date-picker"]');
    //     // inputfield.focus();
    //     inputfield.click();
    //     console.log('clicked date picker ');
    //     //this.template.querySelector('[data-id="date-picker"]').click();
    // }
    //================================================week======================
      @wire(instructorEventsDateBetween,{satrtDate:'$Start_Date',endDate:'$end_Date'})
    Evendata(data,error){
     if(data){
        this.Data1 = data;
        var  dataArr =[];
        dataArr = data.data;
       // var arrOfevent=[];
        this.mapofTime = new Map([
            ["09:00AM", {}],
            ["10:00AM", {}],
            ["11:00AM", {}],
            ["12:00AM", {}],
            ["01:00PM", {}],
            ["02:00PM", {}],
            ["03:00PM", {}],
            ["04:00PM", {}],
            ["05:00PM", {}]
        ]);
        if(dataArr != null && dataArr != undefined){
            for(let i=0;i<dataArr.length;i++){
            // if(this.dayBtn){
            //     //signal code
            //     var signal;
            //     let sig = dataArr[i].BWPS_Integrity__c;
            //             if(sig == 'Low/Seated'){
            //                 signal = lowSignal;
            //             }
            //             else if(sig == 'Medium'){
            //                 signal = mediumSignal;
            //             }
            //             else if(sig == 'High/Active'){
            //                 signal = highSignal;
            //             }
            //             else{
            //                 signal = lowSignal;
            //             }
            //     //signal code end
            //     var timeofEvent = this.timeInHours(dataArr[i].BWPS_StartTime__c);
            //     const obj={
            //       Id:dataArr[i].Id,
            //       Name:dataArr[i].Name,
            //       classDate:dataArr[i].BWPS_ClassDate__c,
            //       intensity:dataArr[i].BWPS_Integrity__c,
            //       instructor:dataArr[i].Schedule_Class__r.BWPS_instructor__r.Name,
            //       description:dataArr[i].Schedule_Class__r.BWPS_Description__c,
            //       time:timeofEvent,
            //       lavel:signal,
            //     }
            //     obj['timeAndDay'] = timeofEvent+' / '+dataArr[i].BWPS_ClassDay__c.toUpperCase().slice(0, 3);
            //     arrOfevent.push(obj);
            //   }
               if(this.weekBtn){
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
                this.evetMap.set(dataArr[i].Id,dataArr[i]);
                if(this.mapofTime.has(roundTime)){
                    var parsetime =  this.getDateFromHours(timeofEvent.replace('PM','').replace('AM',''));
                    var endTimeparse = this.getDateFromHours(endtime.replace('PM','').replace('AM',''));
                    var className = timeofEvent == roundTime && endTimeparse.getHours() >= parsetime.getHours()+1 ? 'full-block' : (timeofEvent == roundTime || parsetime.getMinutes()<30  ? 'half-block-up':'half-block-down');
                    console.log('className>>> ',className);
                    const obj={
                        Id:dataArr[i].Id,
                        Name:dataArr[i].Name,
                        classDate:dataArr[i].BWPS_ClassDate__c,
                        intensity:dataArr[i].BWPS_Integrity__c,
                        instructor:dataArr[i].Schedule_Class__r.BWPS_instructor__r.Name,
                        description:dataArr[i].Schedule_Class__r.BWPS_Description__c,
                        time:timeofEvent,
                        classendtime:endtime,
                        classCss:className,
                        lavel:signal,
                      }
                      console.log('Object Set');
                      obj['timeAndDay'] = timeofEvent+' / '+dataArr[i].BWPS_ClassDay__c.toUpperCase().slice(0, 3);
                      console.log('time Day>> ',timeofEvent+' / '+dataArr[i].BWPS_ClassDay__c.toUpperCase().slice(0, 3));
                      console.log('DateKey>>> ',dataArr[i].BWPS_ClassDate__c);
                      console.log('roundTime >>> ',roundTime);
                      console.log('dataArr[i].BWPS_ClassDate__c >>> ',dataArr[i].BWPS_ClassDate__c);
                      if(this.mapofTime.get(roundTime).hasOwnProperty(dataArr[i].BWPS_ClassDate__c)){
                        var key = dataArr[i].BWPS_ClassDate__c;
                        this.mapofTime.get(roundTime)[key].push(obj);
                      } else{
                          this.mapofTime.get(roundTime)[dataArr[i].BWPS_ClassDate__c] = [obj];
                      }
                }
              }
            }
        }
       // this.eventsData=arrOfevent;
       // this.totalDayRec =  this.eventsData.length;
       // this.dayDataloading = false;
        if(this.weekBtn){
            this.weekEventHandler();
           // console.log('1');
        }
     } else {
        console.log(error);
     }
    }
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

    handlePickedDate(event){
    console.log('picked Date>>> ',event.target.value);
    if(event.target.value != null &&  event.target.value != '' && event.target.value != undefined){
        this.updatedDate = new Date(event.target.value);
        console.log('Now Updated Date>>> ',this.updatedDate);
        if(this.dayBtn){
            this.publishMC({
                startDate: this.updatedDate,
                endDate : this.updatedDate,
                status : 'Day',
                dayClick : true,
            });
            this.changeDateFormat();
        } else if(this.weekBtn){
            this.changeWeekMethod(); 
            this.Start_Date = new Date(this.sundayDate);
            this.end_Date  = new Date(this.saturdayDate);
            const weekComp = this.template.querySelector('c-bwps_-Instructor-Week-View');
            weekComp.getWeek(this.sundayDate);
            weekComp.closeOpenEventCard();
        } else if(this.monthBtn){
            this.changeMonthMethod();
            var dateVal = new Date(this.updatedDate);
            const objChild = this.template.querySelector('c-bwps_instructor-month-View');
            objChild.getMonthData(dateVal);
            objChild.closeEventCard();
        }
    }
    //var dayString =`${this.dayNames[selectedDate.getDay()]} ${selectedDate.getDate()} ${this.months[selectedDate.getMonth()]}, ${selectedDate.getFullYear()}`;
    }
    // showing date initial without any operation od function call
    initialDate() {
        if(this.firstrun){
            var intialDateObj = new Date();
            // this.day = intialDateObj.getDate();
            // this.monthNo = intialDateObj.getMonth();
            // this.month = this.months[this.monthNo];
            // this.year = intialDateObj.getFullYear();
            // this.fulldate = this.month + " " + this.day + ", " + this.year;
            this.template.querySelector(".fullDate").innerHTML = `${this.dayNames[intialDateObj.getDay()]} ${intialDateObj.getDate()} ${this.months[intialDateObj.getMonth()]}, ${intialDateObj.getFullYear()}`;
            this.publishMC({
                startDate: intialDateObj,
                endDate : intialDateObj,
                status : 'Day',
                dayClick : true,
            });
            this.firstrun = false;  
        }
    }

    // changing th month formate 
    changeMonthMethod() {
        // this.monthNo = this.updatedDate.getMonth();
        // this.month = this.months[this.monthNo];
        // this.year = this.updatedDate.getFullYear();
        // this.fullmonth = this.month + " " + this.year;
        this.template.querySelector(".fullDate").innerHTML = `${this.months[this.updatedDate.getMonth()]} ${this.updatedDate.getFullYear()}`;
    }

    publishMC( date) {
        const message = {
            data: date
        };
        publish(this.context, SAMPLEMC, message);
    }

    // changing the week formate
    changeWeekMethod() {
        // var dayOfDate = this.updatedDate.getDay();
        // console.log("day of the this date is: ", dayOfDate);
        // var sundayDate = new Date();
        // var saturdayDate = new Date();
        // saturdayDate.setDate((this.updatedDate.getDate() + (7 - dayOfDate-1)));
        // console.log("sunday's Date: ", saturdayDate);
        // sundayDate.setDate((this.updatedDate.getDate() - (dayOfDate)));
        // console.log("monday's Date: ", sundayDate);
        // var saturday = this.months[saturdayDate.getMonth()] + " " + saturdayDate.getDate() + ", " + saturdayDate.getFullYear();
        // console.log("sunday formated date =======" + saturday);

        // var sunday = this.months[sundayDate.getMonth()] + " " + sundayDate.getDate();
        // console.log("monday formated date =======" + sunday);

        // this.fullweek = sunday + " - " + saturday;
        // console.log(" Full Week: ", this.fullweek);
        this.sundayDate = new Date(this.updatedDate);
        this.sundayDate.setDate(this.sundayDate.getDate()-this.sundayDate.getDay())
        this.saturdayDate = new Date(this.sundayDate);
        this.saturdayDate.setDate(this.saturdayDate.getDate()+6)

        var weekshow = this.template.querySelector(".fullDate");
        weekshow.innerHTML = `${this.months[this.sundayDate.getMonth()]} ${this.sundayDate.getDate()}-${this.saturdayDate.getDate()}`;
    }

    changeDateFormat() {
        // this.day = this.updatedDate.getDate();
        // this.monthNo = this.updatedDate.getMonth();
        // this.month = this.months[this.monthNo];
        // this.year = this.updatedDate.getFullYear();
        // this.fulldate = this.month + " " + this.day + ", " + this.year;
        this.template.querySelector(".fullDate").innerHTML = `${this.dayNames[this.updatedDate.getDay()]} ${this.updatedDate.getDate()} ${this.months[this.updatedDate.getMonth()]}, ${this.updatedDate.getFullYear()}`;
    }

    nextClickHandler() {
        let startDate, endDate, status;
        if (this.dayBtn == true) {
           // var tomorrowDate = this.template.querySelector(".fullDate");
            this.updatedDate.setDate((this.updatedDate.getDate() + 1));
            this.changeDateFormat();
            // tomorrowDate.innerHTML = this.fulldate;
            startDate = this.updatedDate;
            status = 'Day';
            this.publishMC({
                startDate: startDate,
                endDate : endDate,
                status : status,
                dayClick : true,
            });
        }
        else if (this.weekBtn == true) {
            console.log('nextWeekSunday', this.sundayDate);
            this.sundayDate.setDate(this.sundayDate.getDate()+7)
             //saturdayDate.setDate((this.updatedDate.getDate() + (7 - dayOfDate-1)));
             this.saturdayDate = new Date(this.sundayDate);
             this.saturdayDate.setDate(this.saturdayDate.getDate()+6);
             console.log('nextWeekSunday', this.saturdayDate);
             // sundayDate.setDate((this.updatedDate.getDate() - (dayOfDate)));
            //  var saturday = this.months[this.saturdayDate.getMonth()] + " " + this.saturdayDate.getDate() + ", " + this.saturdayDate.getFullYear();
            //  var sunday = this.months[this.sundayDate.getMonth()] + " " + this.sundayDate.getDate();
            //  this.fullweek = sunday + " - " + saturday;
            this.Start_Date = new Date(this.sundayDate);
            this.end_Date  = new Date(this.saturdayDate);
            var weekshow = this.template.querySelector(".fullDate");
            weekshow.innerHTML = `${this.months[this.sundayDate.getMonth()]} ${this.sundayDate.getDate()}-${this.saturdayDate.getDate()}`;
            const weekComp = this.template.querySelector('c-bwps_-Instructor-Week-View');
            weekComp.getWeek(this.sundayDate);
            weekComp.closeOpenEventCard();
            // startDate = this.saturdayDate;
            // endDate = this.sundayDate;
            // status = 'Week'
        }
        else if (this.monthBtn == true) {
            console.log('NextMothPress');
            // var nextMonth = this.template.querySelector(".fullDate");
            this.updatedDate.setMonth(this.updatedDate.getMonth() + 1);
            console.log('NextMonth>>>', this.updatedDate.getMonth(),'>>>>>>>');
            this.changeMonthMethod();
            // nextMonth.innerHTML = this.fullmonth;
            var dateVal = new Date(this.updatedDate);
            const objChild = this.template.querySelector('c-bwps_instructor-month-View');
            objChild.getMonthData(dateVal);
            objChild.closeEventCard();
            // startDate = this.updatedDate;
            // status = 'Month';
            
        }

        console.log(JSON.stringify(this.updatedDate),JSON.stringify(this.saturdayDate),JSON.stringify(this.sundayDate));
        // this.publishMC({
        //     startDate: startDate,
        //     endDate : endDate,
        //     status : status
        // });
    }

    prevClickHandler() {
        let startDate, endDate, status;
        console.log('Prevclick');
        if (this.dayBtn == true) {
            var tomorrowDate = this.template.querySelector(".fullDate");
            this.updatedDate.setDate((this.updatedDate.getDate() - 1));
            this.changeDateFormat();
            // tomorrowDate.innerHTML = this.fulldate;
            startDate = this.updatedDate;
            status = 'Day';
            this.publishMC({
                startDate: startDate,
                endDate : endDate,
                status : status,
                dayClick : true,
            });
        }

        else if (this.weekBtn == true) {
            this.sundayDate.setDate(this.sundayDate.getDate()-7);
            this.saturdayDate = new Date(this.sundayDate);
            this.saturdayDate.setDate(this.saturdayDate.getDate()+6)
            // var saturday = this.months[this.saturdayDate.getMonth()] + " " + this.saturdayDate.getDate() + ", " + this.saturdayDate.getFullYear();
            // var sunday = this.months[this.sundayDate.getMonth()] + " " + this.sundayDate.getDate();
            // this.fullweek = sunday + " - " + saturday;
            this.Start_Date = new Date(this.sundayDate);
            this.end_Date  = new Date(this.saturdayDate);
            var weekshow = this.template.querySelector(".fullDate");
            weekshow.innerHTML = `${this.months[this.sundayDate.getMonth()]} ${this.sundayDate.getDate()}-${this.saturdayDate.getDate()}`;
            const weekComp = this.template.querySelector('c-bwps_-Instructor-Week-View');
            weekComp.getWeek(this.sundayDate);
            weekComp.closeOpenEventCard();
            // startDate = this.saturdayDate;
            // endDate = this.sundayDate;
            // status = 'Week'
        }

        else if (this.monthBtn == true) {
            console.log('InsideMonth');
            // var prevMonth = this.template.querySelector(".fullDate");
            console.log('MonthOfBeforeUpdatedDate',this.updatedDate.getMonth());
            this.updatedDate.setMonth((this.updatedDate.getMonth() - 1));
            this.changeMonthMethod();
            // prevMonth.innerHTML = this.fullmonth;
            // startDate = this.updatedDate;
            // status = 'Month';
            var dateVal = new Date(this.updatedDate);
            const objChild = this.template.querySelector('c-bwps_instructor-month-View');
            objChild.getMonthData(dateVal);
            objChild.closeEventCard();
        }
    }

    dayClickHandler() {
        console.log('DayClick',this.day);
        this.dayBtn = true;
        this.weekBtn = false;
        this.monthBtn = false;
        console.log('DayClick',this.day);
        this.updatedDate = new Date();
        this.changeDateFormat();
        this.publishMC({
            startDate: this.updatedDate,
            endDate : undefined,
            status : 'Day',
            dayClick : true,
        });
        this.template.querySelector(".week-tag").className = 'box-click-deactive week-tag';
        this.template.querySelector(".month-tag").className = 'box-click-deactive month-tag';
        this.template.querySelector(".day-tag").className = 'box-click-active day-tag';
        const objChild = this.template.querySelector('c-bwps_instructor-month-View');
        objChild.hideMonthView();
        const weekComp = this.template.querySelector('c-bwps_-Instructor-Week-View');
        weekComp.hideWeek();
        
    }

    weekClickHandler() {
        console.log('weekClick',this.weekBtn);
        this.dayBtn = false;
        this.weekBtn = true;
        this.monthBtn = false;
        console.log('weekClick',this.weekBtn);
        this.updatedDate = new Date();
        this.changeWeekMethod();
        var dayOfDate = this.updatedDate.getDay();
        var sundayDate = new Date();
        var saturdayDate = new Date();
        saturdayDate.setDate((this.updatedDate.getDate() + (7 - dayOfDate-1)));
        console.log("sunday's Date: ", saturdayDate);
        sundayDate.setDate((this.updatedDate.getDate() - (dayOfDate)));
        this.publishMC({
            startDate: (saturdayDate),
            endDate : (sundayDate),
            status : 'Day',
            dayClick : false,
        });
        this.template.querySelector(".month-tag").className = 'box-click-deactive month-tag';
        this.template.querySelector(".day-tag").className = 'box-click-deactive day-tag';
        this.template.querySelector(".week-tag").className = 'box-click-active week-tag';
        const objChild = this.template.querySelector('c-bwps_instructor-month-View');
        this.Start_Date = new Date(this.sundayDate);
        this.end_Date  = new Date(this.saturdayDate);
        objChild.hideMonthView();
        this.sundayDate.setDate(this.sundayDate.getDate()-this.sundayDate.getDay());
        const weekComp = this.template.querySelector('c-bwps_-Instructor-Week-View');
        weekComp.getWeek(this.sundayDate);
    }

    monthClickHandler() {
        console.log('MonthClick',this.monthBtn);
        this.dayBtn = false;
        this.weekBtn = false;
        this.monthBtn = true;
        console.log('MonthClick',this.monthBtn);
        this.updatedDate = new Date();
        this.changeMonthMethod();
        this.publishMC({
            startDate: this.updatedDate,
            endDate : undefined,
            status : 'Day',
            dayClick : false,
        });
        this.template.querySelector(".week-tag").className = 'box-click-deactive week-tag';
        this.template.querySelector(".day-tag").className = 'box-click-deactive day-tag';
        this.template.querySelector(".month-tag").className = 'box-click-active month-tag';
        var dateVal = new Date(this.updatedDate);
        const objChild = this.template.querySelector('c-bwps_instructor-month-View');
        objChild.getMonthData(dateVal);
        const weekComp = this.template.querySelector('c-bwps_-Instructor-Week-View');
        weekComp.hideWeek();
    }
    @wire(fetchUserDetail)
    wiredUser({ error, data }) {
        if (data) {
            this.userData = data;
            console.log('data>>>',data);
            this.userName = this.userData.Name;
            let userFullName = this.userName;
            this.userFirstName = userFullName.split(' ')[0];
        } else if (error) {
            this.error = error;
            console.log('erroeeee>>>',error);
        }
    }
    /***time convertor */
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
}