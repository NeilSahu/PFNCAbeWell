import { LightningElement, track, wire, api } from 'lwc';
//high signal
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
//low signal
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
//medium signal
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';

import Timer15 from '@salesforce/resourceUrl/Timer15';
import Timer30 from '@salesforce/resourceUrl/Timer30';
import Timer45 from '@salesforce/resourceUrl/Timer45';
import Timer60 from '@salesforce/resourceUrl/Timer60';

import getScheduleClasses from '@salesforce/apex/DNA_InstructorClass.getScheduleClasses';
export default class InstructorTodayClass extends LightningElement {
    // DAY,MONTH, WEEK BUTTONS
    @track monthBtn = false;
    @track weekBtn = false;
    @track first = true;
    // @track dayBtn;
    @track dayView = true;
    @track arr;
    @track scheduleClassesArray = [];
    @track scheduleClassLineItemArray = [];
    @track scheduleClassLineItemArrayLength = 0;
    // @track visibleScheduleClassLineItemArray = [];
    @track visibleScheduleClassLineItemArrayLength = 0;
    @track scheduleClassArrayLength = 0;
    @track visibleScheduleClassLineItemArray = [];
    @track currentDate = [];
    @track splitUpdatedDate;
    @track saturdayDate;
    @track splitUpdatedNextDate;
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // renderedCallback(){
    //     if(this.first){
    //        this.showVisibleScheduleClassMethod();
    //     }

    // }
    @wire(getScheduleClasses)
    scheduleClasses({ data, error }) {
        console.log('WIRE method ', data, error);
        if (data) {
            var records = [...data];
            let scLineItem = [];
            console.log('records data : ', JSON.stringify(records));
            var intialDateObj = new Date();
            var weekday = this.weeks[intialDateObj.getDay()];
            var splitDay = intialDateObj.getDate();
            var splitMonth = this.months[intialDateObj.getMonth()];
            var splitYear = intialDateObj.getFullYear();
            this.splitUpdatedDate = weekday + ", " + splitMonth + " " + splitDay + "  " + splitYear + " ";
            records.forEach(r => {
                let rec = JSON.parse(JSON.stringify(r));
                let scLineItemArr = [];
                let lineItemArr = [];
                let scName = rec.Name;
                if (rec.Schedule_Class_Line_Items__r) {
                    scLineItemArr = rec.Schedule_Class_Line_Items__r;
                    scLineItemArr.forEach(scli => {
                        let e = JSON.parse(JSON.stringify(scli));
                        e.action = 'EDIT';
                        e.scheduleClassName = scName;
                        var today = new Date();
                        console.log('today date  : ', today);
                        console.log('scDAte : ', e.BWPS_ClassDate__c);

                        var today = new Date();
                        today.setHours(0, 0, 0, 0);
                        var todayDay = String(today.getDate()).padStart(2, '0');
                        let scDate = new Date(String(e.BWPS_ClassDate__c));
                        scDate.setHours(0, 0, 0, 0);
                        var scDay = String(scDate.getDate()).padStart(2, '0');
                        console.log('scday and todayDay', scDay, todayDay);
                        e.disabledClass = 'attendance-btn';
                        console.log('today date : ', today);
                        console.log('sc date : ', scDate);
                        console.log('boolean : ', (today == scDate));
                        if (today.valueOf() == scDate.valueOf()) {
                            console.log('if me hu : ');
                            e.disabledClass = 'attendance-btndiv';
                            e.btnName = 'TAKE ATTENDANCE';
                            e.helpText = '';
                        }
                        else if (today > scDate) {
                            e.disabledClass = 'attendance-btndiv';
                            e.btnName = 'VIEW ATTENDANCE';
                            e.helpText = '';
                        }
                        else {
                            e.disabled = true;
                            e.btnName = 'TAKE ATTENDANCE';
                            e.helpText = 'This class is either in future or in past, you cannot take attendance for this class.';
                            e.disabledClass = 'attendance-btndiv disabledClass';
                        }
                        let sig = e.BWPS_Integrity__c;
                        if (sig == 'Low/Seated') {
                            e.Level = lowSignal;
                        }
                        else if (sig == 'Medium') {
                            e.Level = mediumSignal;
                        }
                        else if (sig == 'High/Active') {
                            e.Level = highSignal;
                        }
                        else {
                            e.Level = lowSignal;
                        }
                        if (e.BWPS_StartTime__c != undefined) {
                            var timeInHours = ((Number(e.BWPS_StartTime__c) / 1000) / 60) / 60;
                            if (timeInHours == 0) {
                                e.scLineItemTime = '12:00 AM';
                            } else {
                                var isInteger = Number.isInteger(timeInHours)
                                let timeOfDay = timeInHours < 12 ? 'AM' : 'PM';
                                timeInHours -= timeInHours <= 12 ? 0 : 12;
                                if (isInteger) {
                                    e.scLineItemTime = String(timeInHours).padStart(2, '0') + ':00 ' + timeOfDay;
                                } else {
                                    //timeInHours = parseFloat(String(timeInHours)).toFixed(1);
                                    var hours = String(timeInHours).split('.')[0];
                                    var decimalMins = String(timeInHours).split('.')[1];
                                    // convert decimalMin to seconds
                                    decimalMins = (String(decimalMins)[0]) + '.' + (String(decimalMins).substr(1));
                                    var min = Math.round(6 * decimalMins);
                                    e.scLineItemTime = String(hours).padStart(2, '0') + ':' + String(min).padStart(2, '0') + ' ' + timeOfDay;
                                }
                            }
                        }
                        else {
                            e.BWPS_StartTime__c = 0;
                            e.scLineItemTime = '00:00 AM';
                        }
                        let durationTime = e.BWPS_EndTime__c - e.BWPS_StartTime__c;
                        var mins = (Number(durationTime) / 1000) / 60;
                        e.classDuration = mins;
                        if (mins <= 15) {
                            e.timer = Timer15;
                        }
                        else if (mins <= 30 && mins > 15) {
                            e.timer = Timer30;
                        }
                        else if (mins <= 45 && mins > 30) {
                            e.timer = Timer45;
                        }
                        else if (mins > 45) {
                            e.timer = Timer60;
                        }
                        lineItemArr.push(e);
                        scLineItem.push(e);
                    });
                }


                rec.Schedule_Class_Line_Items__r = lineItemArr;

            });
            // console.log('Before Sort',JSON.stringify(scLineItem));
            for (let i = 0; i < scLineItem.length; i++) {
                for (let j = 0; j < scLineItem.length - i - 1; j++) {
                    let jDate = new Date(String(scLineItem[j].BWPS_ClassDate__c) + ' ' + scLineItem[j].scLineItemTime);
                    let j1Date = new Date(String(scLineItem[j + 1].BWPS_ClassDate__c) + ' ' + scLineItem[j + 1].scLineItemTime);
                    // jDate.setHours(0,0,0,0);
                    // j1Date.setHours(0,0,0,0);

                    if (jDate.valueOf() > j1Date.valueOf()) {
                        let temp = scLineItem[j + 1];
                        scLineItem[j + 1] = scLineItem[j];
                        scLineItem[j] = temp;
                    }
                }
            }
            // console.log('After Sort',JSON.stringify(scLineItem));
            this.arr = records;
            this.scheduleClassesArray = records;
            this.scheduleClassLineItemArray = scLineItem;
            this.scheduleClassArrayLength = this.scheduleClassesArray.length;
            this.scheduleClassLineItemArrayLength = this.scheduleClassLineItemArray.length;
            this.showVisibleScheduleClassMethod();
        }
    }
    //// Changing data acc to month and week.
    showVisibleScheduleClassMethod() {
        console.log('Hello Visible ');
        console.log(JSON.stringify(this.visibleScheduleClassLineItemArray));
        let currentDateSCLineItem = [];
        console.log('lineItenArray : ', this.scheduleClassLineItemArray);
        if (this.currentDate.length <= 0) {
            var day = new Date();
            this.scheduleClassLineItemArray.forEach(ele => {
                console.log('hgdshf>>>', ele.BWPS_ClassDate__c);
                var monthOfDay = (day.getMonth() + 1).toString().length == 1 ? `0${day.getMonth() + 1}` : `${day.getMonth() + 1}`;
                var dateOfDay = day.getDate().toString().length == 1 ? `0${day.getDate()}` : `${day.getDate()}`;
                if (`${day.getFullYear()}-${monthOfDay}-${dateOfDay}` == ele.BWPS_ClassDate__c) {
                    currentDateSCLineItem.push(ele);
                }
            });
        } else {
            this.scheduleClassLineItemArray.forEach(ele => {
                console.log('hgdshf>>>', ele.BWPS_ClassDate__c);
                if (this.currentDate && this.currentDate.includes(ele.BWPS_ClassDate__c)) {
                    currentDateSCLineItem.push(ele);
                }
            });
        }
        this.visibleScheduleClassLineItemArray = currentDateSCLineItem;
        this.visibleScheduleClassLineItemArrayLength = this.visibleScheduleClassLineItemArray.length;
        if (this.visibleScheduleClassLineItemArrayLength == 0) {
            this.noVisibleScheduleClassLineItemArray = true;
        }
        else {
            this.noVisibleScheduleClassLineItemArray = false;
        }
        // this.first = false;
    }

    @track noVisibleScheduleClassLineItemArray = false;
    // --------------------------------------
    takeAttendenceMethod(event) {
        var name = event.target.dataset.name;
        var scLineItemId = event.target.dataset.id;
        var time = event.target.dataset.time;
        var date = event.target.dataset.date;
        var className = event.target.dataset.scname;
        var classDate = event.target.dataset.scliclassdate;
        var obj = {
            SchId: scLineItemId,
            Name: name,
            Date: date,
            Time: time,
            ClassName: className,
            ClassDate: classDate
        }
        var result = window.btoa(JSON.stringify(obj));
        console.log('OUTPUT : ', result);
        window.open('/PFNCADNA/s/instructortodaytakeattendance?app=' + result, '_self');
    }
    // DAY, MONTh, WEEK CHANGE BUTTON
    dayClickHandler() {
        // console.log('DayClick',this.day);
        this.dayView = true;
        this.weekBtn = false;
        this.monthBtn = false;
        this.currentDate = [];
        var date = new Date();
        let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
        let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        let dateString = `${ye}-${mo}-${da}`;
        console.log(dateString);
        this.currentDate.push(dateString);
        console.log('DayClick', this.dayView);
        // this.updatedDate = new Date();
        // this.changeDateFormat();
        // this.publishMC({
        //     startDate: this.updatedDate,
        //     endDate : undefined,
        //     status : 'Day',
        //     dayClick : true,
        // });
        this.template.querySelector(".week-tag").className = 'box-click-deactive week-tag';
        this.template.querySelector(".month-tag").className = 'box-click-deactive month-tag';
        this.template.querySelector(".day-tag").className = 'box-click-active day-tag';
        // const objChild = this.template.querySelector('c-bwps_instructor-month-View');
        // objChild.hideMonthView();
        // const weekComp = this.template.querySelector('c-bwps_-Instructor-Week-View');
        // weekComp.hideWeek();
        this.showVisibleScheduleClassMethod();
    }

    weekClickHandler() {
        console.log('weekClick', this.weekBtn);
        this.dayView = false;
        this.weekBtn = true;
        this.monthBtn = false;
        this.currentDate = [];
        console.log('weekClick', this.weekBtn);
        var sundayDate = new Date();
        this.saturdayDate = new Date();
        console.log('OUTPUT >>>>>>>>>: ', sundayDate);
        console.log('OUTPUT saturdayDate>>>>>>>>>: ', this.saturdayDate);
        sundayDate.setDate(sundayDate.getDate());
        this.saturdayDate.setDate(sundayDate.getDate() + 6);

        var weekday = this.weeks[this.saturdayDate.getDay()];
        var splitDay = this.saturdayDate.getDate();
        var splitMonth = this.months[this.saturdayDate.getMonth()];
        var splitYear = this.saturdayDate.getFullYear();
        this.splitUpdatedNextDate = " " + weekday + ", " + splitMonth + " " + splitDay + "  " + splitYear;
        console.log('OUTPUT SUNDAY AND SAT >>>>>>>>>: ', sundayDate, ' ', this.saturdayDate);
        //    let sd = new Date();
        //  let ed = new Date(message.data.endDate);
        var d = new Date(sundayDate);
        for (d; d <= this.saturdayDate; d.setDate(d.getDate() + 1)) {
            console.log('LOOP CHECK');
            let cd = new Date(d);
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(cd);
            let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(cd);
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(cd);
            let dateString = `${ye}-${mo}-${da}`;
            console.log(dateString);
            this.currentDate.push(dateString);
        }
        console.log('OUTPUT CURRENT DATE>>>>>>>>>: ', JSON.stringify(this.currentDate));
        // this.updatedDate = new Date();
        // this.changeWeekMethod();
        // var dayOfDate = this.updatedDate.getDay();
        // var sundayDate = new Date();
        // var saturdayDate = new Date();
        // saturdayDate.setDate((this.updatedDate.getDate() + (7 - dayOfDate-1)));
        // console.log("sunday's Date: ", saturdayDate);
        // sundayDate.setDate((this.updatedDate.getDate() - (dayOfDate)));
        // this.publishMC({
        //     startDate: (saturdayDate),
        //     endDate : (sundayDate),
        //     status : 'Day',
        //     dayClick : false,
        // });
        this.template.querySelector(".month-tag").className = 'box-click-deactive month-tag';
        this.template.querySelector(".day-tag").className = 'box-click-deactive day-tag';
        this.template.querySelector(".week-tag").className = 'box-click-active week-tag';
        // const objChild = this.template.querySelector('c-bwps_instructor-month-View');
        // this.Start_Date = new Date(this.sundayDate);
        // this.end_Date  = new Date(this.saturdayDate);
        // objChild.hideMonthView();
        // this.sundayDate.setDate(this.sundayDate.getDate()-this.sundayDate.getDay());
        // const weekComp = this.template.querySelector('c-bwps_-Instructor-Week-View');
        // weekComp.getWeek(this.sundayDate);
        this.showVisibleScheduleClassMethod();
    }

    monthClickHandler() {
        console.log('MonthClick', this.monthBtn);
        this.dayView = false;
        this.weekBtn = false;
        this.monthBtn = true;
        var sundayDate = new Date();
        console.log('OUTPUT >>>>>>>>>: ', sundayDate);
        this.saturdayDate = new Date();
        sundayDate.setDate(sundayDate.getDate());
        this.saturdayDate.setDate(sundayDate.getDate() + 30);
        var weekday = this.weeks[this.saturdayDate.getDay()];
        var splitDay = this.saturdayDate.getDate();
        var splitMonth = this.months[this.saturdayDate.getMonth()];
        var splitYear = this.saturdayDate.getFullYear();
        this.splitUpdatedNextDate = " " + weekday + ", " + splitMonth + " " + splitDay + "  " + splitYear;
        console.log('OUTPUT saturdayDate>>>>>>>>>: ', this.splitUpdatedNextDate);
        console.log('OUTPUT SUNDAY AND SAT >>>>>>>>>: ', sundayDate, ' ', this.saturdayDate);
        //    let sd = new Date();
        //  let ed = new Date(message.data.endDate);
        var d = new Date(sundayDate);
        for (d; d <= this.saturdayDate; d.setDate(d.getDate() + 1)) {
            console.log('LOOP CHECK');
            let cd = new Date(d);
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(cd);
            let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(cd);
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(cd);
            let dateString = `${ye}-${mo}-${da}`;
            console.log(dateString);
            this.currentDate.push(dateString);
        }
        console.log('OUTPUT CURRENT DATE>>>>>>>>>: ', JSON.stringify(this.currentDate));
        // console.log('MonthClick',this.monthBtn);
        // this.updatedDate = new Date();
        // this.changeMonthMethod();
        // this.publishMC({
        //     startDate: this.updatedDate,
        //     endDate : undefined,
        //     status : 'Day',
        //     dayClick : false,
        // });
        this.template.querySelector(".week-tag").className = 'box-click-deactive week-tag';
        this.template.querySelector(".day-tag").className = 'box-click-deactive day-tag';
        this.template.querySelector(".month-tag").className = 'box-click-active month-tag';
        // var dateVal = new Date(this.updatedDate);
        // const objChild = this.template.querySelector('c-bwps_instructor-month-View');
        // objChild.getMonthData(dateVal);
        // const weekComp = this.template.querySelector('c-bwps_-Instructor-Week-View');
        // weekComp.hideWeek();
        this.showVisibleScheduleClassMethod();
    }

}