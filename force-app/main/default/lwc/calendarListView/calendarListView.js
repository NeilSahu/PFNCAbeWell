import { LightningElement, track, wire } from 'lwc';
//import timer from '@salesforce/resourceUrl/timer';
//high signal
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
//low signal
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
//medium signal
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import Timer15 from '@salesforce/resourceUrl/Timer15';
import Timer30 from '@salesforce/resourceUrl/Timer30';
import Timer45 from '@salesforce/resourceUrl/Timer45';
import Timer60 from '@salesforce/resourceUrl/Timer60';

import getScheduleClasses from '@salesforce/apex/DNA_InstructorClass.getScheduleClasses';
//import getScheduleClassLineItems from '@salesforce/apex/DNA_InstructorClass.getScheduleClassLineItems';
import { publish, subscribe, unsubscribe, createMessageContext, releaseMessageContext } from 'lightning/messageService';
import fetchUserDetail from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
import SAMPLEMC from "@salesforce/messageChannel/MyMessageChannel__c";
import IFRAMEMC from "@salesforce/messageChannel/ZoomSdkMessageChannel__c";

export default class CalendarListView extends LightningElement {
    @track dayView = true;
    @track arr;
    @track scheduleClassesArray = [];
    @track scheduleClassLineItemArray = [];
    @track scheduleClassLineItemArrayLength = 0;
    @track visibleScheduleClassLineItemArrayLength = 0;
    @track scheduleClassArrayLength = 0;
    @track visibleScheduleClassLineItemArray = [];
    @track noVisibleScheduleClassLineItem = false;
    @track currentDate = [];
    EncodedArr = [];
    subscription = null;
    doubletick = `${allIcons}/PNG/Read.png `;
    context = createMessageContext();
    // arr = [
    //     {t:'09:00AM',p:'low/Seated',h:'EXERCISE FOR PARKINSONS I',duration : '30 Min',key:'001',check:false, underLine : true},
    //     {t:'11:00AM',p:'medium/Seated',h:'EXERCISE FOR PARKINSONS II',duration : '30 Min',key:'002',check:false, underLine : true},
    //     {t:'03:00PM',p:'high/Seated',h:'EXERCISE FOR PARKINSONS III',duration : '30 Min',key:'003',check:false, underLine : false},
    //     // {
    //     //     "BWPS_StartTime__c":32400000,"BWPS_Date__c":"2022-11-10","BWPS_EndTime__c":34200000,
    //     //     "BWPS_ClassFrequency__c":1,"Id":"a0u3C000001cvcVQAQ","Class__c":"a0t3C000001jHe3QAE",
    //     //     "BWPS_instructor__c":"0033C00000Za9uzQAB","Name":"EXERCISE FOR PARKINSON'S 2"
    //     // }
    // {"Schedule_Class__c":"a0u3C000001cwHVQAY","Id":"a0w3C000002c7QCQAY",
    // "Name":"EXERCISE FOR PARKINSON'S 3","BWPS_Status__c":"Active"}
    // ]

    @track userFullName;

    @wire(fetchUserDetail)
    wiredUser({ error, data }) {
        if (data) {
            let userData = data;
            this.userFullName = userData.Name;
        } else if (error) {
            this.error = error;
            console.log('erroeeee>>>', error);
        }
    }

    @wire(getScheduleClasses)
    scheduleClasses({ data, error }) {
        console.log('WIRE method ', data, error);
        if (data) {
            var records = [...data];
            let scLineItem = [];
            console.log('records data : ', JSON.stringify(records));
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
                        // var today = new Date();
                        // console.log('today date  : ',today);
                        // console.log('scDAte : ',e.BWPS_ClassDate__c);


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

                        if (e.BWPS_EndTime__c != undefined) {
                            var timeInHours = ((Number(e.BWPS_EndTime__c) / 1000) / 60) / 60;
                            if (timeInHours == 0) {
                                e.scLineItemTimeEnd = '12:00 AM';
                            } else {
                                var isInteger = Number.isInteger(timeInHours)
                                let timeOfDay = timeInHours < 12 ? 'AM' : 'PM';
                                timeInHours -= timeInHours <= 12 ? 0 : 12;
                                if (isInteger) {
                                    e.scLineItemTimeEnd = String(timeInHours).padStart(2, '0') + ':00 ' + timeOfDay;
                                } else {
                                    //timeInHours = parseFloat(String(timeInHours)).toFixed(1);
                                    var hours = String(timeInHours).split('.')[0];
                                    var decimalMins = String(timeInHours).split('.')[1];
                                    // convert decimalMin to seconds
                                    decimalMins = (String(decimalMins)[0]) + '.' + (String(decimalMins).substr(1));
                                    var min = Math.round(6 * decimalMins);
                                    e.scLineItemTimeEnd = String(hours).padStart(2, '0') + ':' + String(min).padStart(2, '0') + ' ' + timeOfDay;
                                }
                            }
                        }
                        else {
                            e.BWPS_EndTime__c = 0;
                            e.scLineItemTimeEnd = '00:00 AM';
                        }


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

                            let classStartTime = new Date();
                            if (e.scLineItemTime.split(' ')[1] == 'PM') {
                                if (parseInt(e.scLineItemTime.split(' ')[0].split(':')[0]) + 12 > 24) {
                                    classStartTime.setHours((parseInt(e.scLineItemTime.split(' ')[0].split(':')[0]) + 12 - 24));
                                }
                                else {
                                    classStartTime.setHours(parseInt(e.scLineItemTime.split(' ')[0].split(':')[0]) + 12);
                                }
                                classStartTime.setMinutes(parseInt(e.scLineItemTime.split(' ')[0].split(':')[1]));
                            }
                            else {
                                classStartTime.setHours(e.scLineItemTime.split(' ')[0].split(':')[0]);
                                classStartTime.setMinutes(parseInt(e.scLineItemTime.split(' ')[0].split(':')[1]));
                            }
                            classStartTime.setTime(classStartTime.getTime() - (15 * 1000 * 60))

                            let classEndTime = new Date();
                            if (e.scLineItemTimeEnd.split(' ')[1] == 'PM') {
                                if (parseInt(e.scLineItemTime.split(' ')[0].split(':')[0]) + 12 > 24) {
                                    classEndTime.setHours((parseInt(e.scLineItemTimeEnd.split(' ')[0].split(':')[0]) + 12 - 24));
                                }
                                else {
                                    classEndTime.setHours(parseInt(e.scLineItemTimeEnd.split(' ')[0].split(':')[0]) + 12);
                                }
                                classEndTime.setMinutes(parseInt(e.scLineItemTimeEnd.split(' ')[0].split(':')[1]));
                            }
                            else {
                                classEndTime.setHours(e.scLineItemTimeEnd.split(' ')[0].split(':')[0]);
                                classEndTime.setMinutes(parseInt(e.scLineItemTimeEnd.split(' ')[0].split(':')[1]));
                            }
                            classEndTime.setTime(classEndTime.getTime() + (15 * 1000 * 60))

                            let currentTime = new Date();
                            console.log('Current Timexone Time : ' + currentTime);
                            // currentTime = currentTime.toLocaleString('en-IN', {
                            //     timeZone: 'Asia/Calcutta',
                            //     // timeZone: 'America/Los_Angeles',
                            //     //timeZone: 'America/New_York',
                            // });
                            // currentTime = new Date(currentTime);

                            console.log("Class Start Time : " + classStartTime);
                            console.log(currentTime);
                            console.log("Class End Time : " + classEndTime);

                            if (currentTime > classStartTime && currentTime < classEndTime) {
                                e.joinStatus = 'JOIN';
                                e.joinStatusClass = 'attendance-btndiv';
                                e.helpText = '';
                            }
                            else {
                                if (currentTime < classStartTime) {
                                    e.joinStatus = 'JOIN';
                                    e.joinStatusClass = 'attendance-btndiv disabledClass';
                                    e.joinHelpText = 'This class is in future, you cannot join this class right now.';
                                }
                                else {
                                    e.joinStatus = 'OVER';
                                    e.joinStatusClass = 'attendance-btndiv disabledClass';
                                    e.joinHelpText = 'This class is over now, you cannot join this class.';
                                }
                            }
                        }
                        else if (today > scDate) {
                            e.disabledClass = 'attendance-btndiv';
                            e.btnName = 'VIEW ATTENDANCE';
                            e.joinStatus = 'OVER';
                            e.joinStatusClass = 'attendance-btndiv disabledClass';
                            e.helpText = '';
                            e.joinHelpText = 'This class is over now, you cannot join this class.';
                        }
                        else {
                            e.disabled = true;
                            e.btnName = 'TAKE ATTENDANCE';
                            e.disabledClass = 'attendance-btndiv disabledClass';
                            e.joinStatus = 'JOIN';
                            e.joinStatusClass = 'attendance-btndiv disabledClass';
                            e.helpText = 'This class is in future, you cannot take attendance for this class.';
                            e.joinHelpText = 'This class is in future, you cannot join this class right now.';
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
            console.log('Before Sort', JSON.stringify(scLineItem));
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
            console.log('After Sort', JSON.stringify(scLineItem));
            this.arr = records;
            this.scheduleClassesArray = records;
            this.scheduleClassLineItemArray = scLineItem;
            this.scheduleClassArrayLength = this.scheduleClassesArray.length;
            this.scheduleClassLineItemArrayLength = this.scheduleClassLineItemArray.length;
            this.showVisibleScheduleClassMethod();
        }
    }
    connectedCallback() {
        console.log('Sub Connected CallBack');
        this.subscribeMC();
    }
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
            this.noVisibleScheduleClassLineItem = true;
        }
        else {
            this.noVisibleScheduleClassLineItem = false;
        }
    }
    // msToTime(duration) {
    //     var milliseconds = Math.floor((duration % 1000) / 100),
    //         minutes = Math.floor((duration / (1000 * 60)) % 60),
    //         hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    //     var ampm = hours >= 12 ? 'PM' : 'AM';
    //     hours = hours % 12;
    //     hours = hours ? hours : 12; // the hour '0' should be '12'
    //     minutes = minutes < 10 ? '0'+minutes : minutes;
    //     var strTime = hours + ':' + minutes + ' ' + ampm;
    //     return strTime;
    // }

    subscribeMC() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(this.context, SAMPLEMC, (message) => {
            console.log(
                message.data
            );
            this.currentDate = [];
            if (message.data.status == 'Day') {
                let d = new Date(message.data.startDate);
                let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
                let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
                let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
                let dateString = `${ye}-${mo}-${da}`;
                this.dayView = message.data.dayClick;
                console.log(dateString);
                this.currentDate.push(dateString);
                // } else if(message.data.status == 'Week') {
                //     let sd = new Date(message.data.startDate);
                //     let ed = new Date(message.data.endDate);    
                //     console.log(sd, ed);
                //     for (var d = ed; d <= sd; d.setDate(d.getDate() + 1)) {
                //         let cd = new Date(d);
                //         let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(cd);
                //         let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(cd);
                //         let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(cd);
                //         let dateString = `${ye}-${mo}-${da}`;
                //         console.log(dateString);
                //         this.currentDate.push(dateString);
                //     }
                // } else if(message.data.status == 'Month') {
                //     var date = new Date(message.data.startDate);
                //     var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                //     var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                //     for (var d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
                //         let cd = new Date(d);
                //         let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(cd);
                //         let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(cd);
                //         let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(cd);
                //         let dateString = `${ye}-${mo}-${da}`;
                //         console.log(dateString);
                //         this.currentDate.push(dateString);
                //     }
            }

            console.log(JSON.stringify(this.currentDate));
            if (this.dayView) {
                this.showVisibleScheduleClassMethod();
            }
        });
    }
    takeAttendenceMethod(event) {
        console.log('Viewing Attendance');
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

        console.log("Setting Result");
        console.log(JSON.stringify(obj));
        let result = window.btoa(JSON.stringify(obj));
        console.log('OUTPUT : ', result);
        window.open('/PFNCADNA/s/-instructordashboardtakeattendance?app=' + result, '_self');
    }

    joinClass(event) {
        console.log(event.currentTarget.dataset.id);
        console.log(this.userFullName);

        this.sendZoomData2(event.currentTarget.dataset.id, this.userFullName);

    }

    sendZoomData2(meetingId, name) {
        console.log('send2 : ', meetingId, name);
        let message = {
            meetingId: meetingId,
            AttendeeName: name,
            iframeStatus: 'Zoom'
        };
        publish(this.context, IFRAMEMC, message);
    }
}