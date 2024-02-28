import { LightningElement, track, wire, api } from 'lwc';
//high signal
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
//low signal
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
//medium signal
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';
import ExerciseImage from '@salesforce/resourceUrl/ExerciseImage';
import shareImage from '@salesforce/resourceUrl/shareImage';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import { publish, subscribe, unsubscribe, createMessageContext, releaseMessageContext } from 'lightning/messageService';
import SAMPLEMC from "@salesforce/messageChannel/MyMessageChannel__c";
import getScheduleClasses from '@salesforce/apex/DNA_InstructorClass.getScheduleClasses';
import getBaseUrl from '@salesforce/apex/DNA_InstructorClass.getBaseUrl';

import { loadStyle, loadScript } from 'lightning/platformResourceLoader';

export default class InstructorClassroomClasses extends LightningElement {
    @track lowSignal = lowSignal;
    @track shareImage = shareImage;
    @track defaultSCImage = ExerciseImage;
    @track showDropdown = false;
    scheduleClassesArrayLength;
    @track noScheduleClasses = false;
    @track scheduleClassesArray = [];
    @track scheduleClassLineItemArray = [];
    @track visibleScheduleClassLineItemArray = [];
    @track InstDetailView = false;
    // calendar_icon = calendarIcon;
    date;
    year;
    monthNo;
    month;
    day;
    calendar_icon = `${allIcons}/PNG/Calendar.png `;
    prevlogo = `${allIcons}/PNG/Prev.png `;
    nextlogo = `${allIcons}/PNG/Next.png `;
    calendarIconClass;
    monthsec = false;
    @track firstrun = true;
    @api classViewType = false;
    @track initialLoader= true;
    fulldate;
    fullweek;
    fullmonth;
    months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    @track timeArray = [
        { Id: 1, Time: '09:00 am', scliName: '', timeInMilliSec: 32400000 },
        { Id: 2, Time: '09:30 am', scliName: '', timeInMilliSec: 34200000 },
        { Id: 3, Time: '10:00 am', scliName: '', timeInMilliSec: 36000000 },
        { Id: 4, Time: '10:30 am', scliName: '', timeInMilliSec: 37800000 },
        { Id: 5, Time: '11:00 am', scliName: '', timeInMilliSec: 39600000 },
        { Id: 6, Time: '11:30 am', scliName: '', timeInMilliSec: 41400000 },
        { Id: 7, Time: '12:00 pm', scliName: '', timeInMilliSec: 43200000 },
        { Id: 8, Time: '12:30 pm', scliName: '', timeInMilliSec: 45000000 },
        { Id: 9, Time: '01:00 pm', scliName: '', timeInMilliSec: 46800000 },
        { Id: 10, Time: '01:30 pm', scliName: '', timeInMilliSec: 48600000 },
        { Id: 11, Time: '02:00 pm', scliName: '', timeInMilliSec: 50400000 },
        { Id: 12, Time: '02:30 pm', scliName: '', timeInMilliSec: 52200000 },
        { Id: 13, Time: '03:00 pm', scliName: '', timeInMilliSec: 54000000 },
        { Id: 14, Time: '03:30 pm', scliName: '', timeInMilliSec: 55800000 },
        { Id: 15, Time: '04:30 pm', scliName: '', timeInMilliSec: 57600000 },
        { Id: 16, Time: '05:00 pm', scliName: '', timeInMilliSec: 59400000 },
        { Id: 17, Time: '05:30 pm', scliName: '', timeInMilliSec: 61200000 },
        { Id: 18, Time: '06:00 pm', scliName: '', timeInMilliSec: 63000000 },
        { Id: 19, Time: '06:30 pm', scliName: '', timeInMilliSec: 64800000 },
        { Id: 20, Time: '07:00 pm', scliName: '', timeInMilliSec: 66600000 },
        { Id: 21, Time: '07:30 pm', scliName: '', timeInMilliSec: 68400000 },
        { Id: 22, Time: '08:00 pm', scliName: '', timeInMilliSec: 70200000 },
        { Id: 23, Time: '08:30 pm', scliName: '', timeInMilliSec: 72000000 },
        { Id: 24, Time: '09:00 pm', scliName: '', timeInMilliSec: 73800000 },
        { Id: 25, Time: '09:30 pm', scliName: '', timeInMilliSec: 75600000 }
    ]
    updatedDate = new Date();

    dropdownHandler(event) {
        this.showDropdown = !this.showDropdown;
        this.scheduleClassesArray[event.target.dataset.index].dropdown = this.showDropdown;
    }
    connectedCallback() {
        //loadScript(this,'https://player.vimeo.com/api/player.js').then(() => {});
    }

    @wire(getScheduleClasses)
    async scheduleClasses({ data, error }) {
        let scArr = [];
        let BaseUrl;
        await getBaseUrl()
            .then((result) => {
                if (result) {
                    BaseUrl = result;
                }
            })
        //console.log('Data : ',JSON.stringify(data));
        if (data) {
            scArr = [...data];
            let tempArr = [];
            //console.log('scArr : ',JSON.stringify(scArr));
            scArr.forEach(r => {
                let sc = JSON.parse(JSON.stringify(r));
                console.log('ContentVersionId__c : ', sc.ContentVersionId__c);
                if (sc.ContentVersionId__c != undefined) {
                    //var imageUrl = urlCreator.createObjectURL();
                    //sc.scImage = sc.ContentImageUrl__c;
                    console.log('BaseUrl : ', BaseUrl);
                    let burl = BaseUrl.replace("site", "salesforce");
                    console.log(burl);
                    //Sandbox baseUrl - https://parkinsonfoundationofthenationalca--pfncadna.sandbox.file.force.com
                    sc.scImage = 'https://parkinsonfoundationofthenationalca--pfncadna.sandbox.file.force.com' + '/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=' + sc.ContentVersionId__c;
                    //sc.scImage = '/sfc/servlet.shepherd/version/download/'+sc.ContentVersionId__c;
                } else {
                    sc.scImage = this.defaultSCImage;
                }
                //sc.scImage = this.cardsImage;
                sc.dropdown = false;
                let sig = sc.Integrity__c;
                if (sig == 'Low/Seated') {
                    sc.Level = lowSignal;
                }
                else if (sig == 'Medium') {
                    sc.Level = mediumSignal;
                }
                else if (sig == 'High/Active') {
                    sc.Level = highSignal;
                }
                else {
                    sc.Level = lowSignal;
                }
                let scLineItemArr = sc.Schedule_Class_Line_Items__r;
                console.log('lineITem array : ', JSON.stringify(scLineItemArr));
                let lineItemArr = [];
                if (r.Schedule_Class_Line_Items__r != undefined) {
                    scLineItemArr.forEach(scli => {
                        let e = JSON.parse(JSON.stringify(scli));
                        e.action = 'EDIT';
                        e.shortDay = '';
                        if (e.BWPS_ClassDay__c != undefined && e.BWPS_ClassDay__c != null && e.BWPS_ClassDay__c != '') {
                            let day = e.BWPS_ClassDay__c;
                            e.shortDay = day.substring(0, 3).toUpperCase();
                        }
                        var today = new Date(e.BWPS_ClassDate__c); // yyyy-mm-dd
                        var month = today.toLocaleString('default', { month: 'short' });
                        console.log(month);
                        e.month = month;
                        e.date = today.getDate();
                        if (e.BWPS_StartTime__c != undefined) {
                            e.scliStartTime = this.convertTimeInString(String(e.BWPS_StartTime__c));
                        }
                        else {
                            e.scliStartTime = '00:00 am';
                        }
                        if (e.BWPS_EndTime__c != undefined) {
                            e.scliEndTime = this.convertTimeInString(String(e.BWPS_EndTime__c));
                        }
                        else {
                            e.scliEndTime = '00:00 am';
                        }
                        lineItemArr.push(e);
                        this.scheduleClassLineItemArray.push(e);
                    });
                }
                //this.scheduleClassLineItemArray.push(lineItemArr);
                if (lineItemArr.length > 0) {
                    sc.TotalLineItems = lineItemArr.length;
                }
                //sort lineItemArr
                console.log(lineItemArr, JSON.stringify(lineItemArr), 'before sort')
                for (let i = 0; i < lineItemArr.length; ++i) {
                    for (let j = 0; j < lineItemArr.length - i - 1; ++j) {
                        let d1 = new Date(lineItemArr[j].BWPS_ClassDate__c);
                        d1.setTime(d1.getTime() + lineItemArr[j].BWPS_StartTime__c);
                        let d2 = new Date(lineItemArr[j + 1].BWPS_ClassDate__c);
                        d2.setTime(d2.getTime() + lineItemArr[j + 1].BWPS_StartTime__c);
                        console.log(d1, d2, d1.getTime(), d2.getTime(), 'date in sort', i, j)
                        if (d1.getTime() > d2.getTime()) {
                            let temp = lineItemArr[j];
                            lineItemArr[j] = lineItemArr[j + 1];
                            lineItemArr[j + 1] = temp;
                        }
                    }
                }
                console.log(lineItemArr, JSON.stringify(lineItemArr), 'after sort')
                sc.Schedule_Class_Line_Items__r = lineItemArr;
                if (sc.BWPS_Status__c == 'Active') {
                    // tempArr.push(sc);
                    let tempSC = sc;
                    if (sc.TotalLineItems == undefined) {
                        tempSC.label = 'No Classes';
                    }
                    else {
                        if (parseInt(sc.TotalLineItems) == 1) {
                            tempSC.label = 'Class';
                        }
                        else {
                            tempSC.label = 'Classes';
                        }
                    }
                    tempArr.push(tempSC);
                }
            });
            this.initialLoader = false;
            this.scheduleClassesArray = tempArr;
            if (this.scheduleClassesArray.length == 0) {
                this.noScheduleClasses = true;
            }
            else {
                this.noScheduleClasses = false;
            }
            var intialDateObj = new Date();
            this.updatedDate.setDate((intialDateObj.getDate()));
            this.initialDate();
        }
    }
    convertTimeInString(timeStr) {
        var timeInHours = ((Number(timeStr) / 1000) / 60) / 60;
        var finalTimeStr;
        if (timeInHours == 0) {
            finalTimeStr = '12:00 am';
        } else {
            var isInteger = Number.isInteger(timeInHours)
            let timeOfDay = timeInHours < 12 ? 'am' : 'pm';
            timeInHours -= timeInHours <= 12 ? 0 : 12;
            if (isInteger) {
                finalTimeStr = String(timeInHours).padStart(2, '0') + ':00 ' + timeOfDay;
            } else {
                var hours = String(timeInHours).split('.')[0];
                var decimalMins = String(timeInHours).split('.')[1];
                // convert decimalMin to seconds
                decimalMins = (String(decimalMins)[0]) + '.' + (String(decimalMins).substr(1));
                var min = Math.round(6 * decimalMins);
                finalTimeStr = String(hours).padStart(2, '0') + ':' + String(min).padStart(2, '0') + ' ' + timeOfDay;
            }
        }
        return finalTimeStr;
    }

    // Calendar Code 
    renderedCallback() {
        try {
            //this.initialDate();
        } catch (err) {
            console.log('err.... ', err, err.message);
        }
        //     console.log('dpi',this.calendarIconClass);
        // this.calendarIconClass = 'background-image: ' + this.calendar_icon + ';';
        // setTimeout(() => {
        // console.log('dpi',this.calendarIconClass);
        let dateInput = this.template.querySelector('.date-picker-input');
        // console.log('dpi',JSON.stringify(dateInput));
        dateInput.style.setProperty("--date-picker-background", `url(${this.calendar_icon})`);
        // }
        // ,0)
    }

    initialDate() {
        // var intialDateObj = new Date();
        // console.log('initialdate : ',intialDateObj);
        this.visibleScheduleClassLineItemArray = [];
        this.template.querySelector(".fullDate").innerHTML = `${this.dayNames[this.updatedDate.getDay()]}, ${this.months[this.updatedDate.getMonth()]} ${this.updatedDate.getDate()}, ${this.updatedDate.getFullYear()}`;
        let currentdate = `${this.dayNames[this.updatedDate.getDay()]} ${this.updatedDate.getDate()} ${this.months[this.updatedDate.getMonth()]}, ${this.updatedDate.getFullYear()}`;
        console.log('schedule array : ', JSON.stringify(this.scheduleClassLineItemArray));
        console.log('currentdate : ', currentdate);
        this.scheduleClassLineItemArray.forEach(scLineItemArr => {
            let jDate = new Date(new Date(scLineItemArr.BWPS_ClassDate__c));
            let j1Date = new Date(new Date(currentdate));
            jDate.setHours(0, 0, 0, 0);
            j1Date.setHours(0, 0, 0, 0);
            console.log(' array date : ', jDate);
            console.log(' current date : ', j1Date);
            if (jDate.valueOf() == j1Date.valueOf()) {
                this.visibleScheduleClassLineItemArray.push(scLineItemArr);
            }
        });
        console.log('visible array : ', JSON.stringify(this.visibleScheduleClassLineItemArray));
        console.log('time array before : ', JSON.stringify(this.timeArray));
        for (let i = 0; i < this.timeArray.length - 1; i++) {
            let cur = this.timeArray[i];
            let next = this.timeArray[i + 1];
            console.log('cur time : ', JSON.stringify(cur));
            console.log('next time : ', JSON.stringify(next));
            if (this.visibleScheduleClassLineItemArray.length > 0) {
                for (let j = 0; j < this.visibleScheduleClassLineItemArray.length; j++) {
                    let arrTime = this.visibleScheduleClassLineItemArray[j];
                    console.log('arrTime record : ', JSON.stringify(arrTime), arrTime.BWPS_StartTime__c);
                    // 10 am >= 10am && 11am <= 10am
                    if (cur.timeInMilliSec <= arrTime.BWPS_StartTime__c && next.timeInMilliSec > arrTime.BWPS_StartTime__c) {
                        console.log('condition true ');
                        cur.scliName = arrTime.Name;
                    }
                    else {
                        cur.scliName = "";
                    }
                }
            }
            else {
                cur.scliName = "";
            }
        }
        // this.timeArray.forEach(e => {
        //     this.visibleScheduleClassLineItemArray.forEach(r => {
        //         if(e.Time == r.scliStartTime){
        //             console.log('condition true ');
        //             e.scliName = r.Name;
        //         }
        //     });
        // });

        // this.publishMC({
        //     startDate: intialDateObj,
        //     endDate : intialDateObj,
        //     status : 'Day',
        //     dayClick : true,
        // });
    }
    handlePickedDate(event) {
        console.log('picked Date>>> ', event.target.value);
        if(event.target.value != ''){
            this.updatedDate = new Date(event.target.value);
        }else{
            this.updatedDate = new Date();
        }
        this.initialDate();
        console.log('Now Updated Date>>> ', this.updatedDate);
        this.publishMC({
            startDate: this.updatedDate,
            endDate: this.updatedDate,
            status: 'Day',
            dayClick: true,
        });
        this.changeDateFormat();
        //var dayString =`${this.dayNames[selectedDate.getDay()]} ${selectedDate.getDate()} ${this.months[selectedDate.getMonth()]}, ${selectedDate.getFullYear()}`;
    }
    publishMC(date) {
        const message = {
            data: date
        };
        publish(this.context, SAMPLEMC, message);
    }
    changeDateFormat() {
        // this.day = this.updatedDate.getDate();
        // this.monthNo = this.updatedDate.getMonth();
        // this.month = this.months[this.monthNo];
        // this.year = this.updatedDate.getFullYear();
        // this.fulldate = this.month + " " + this.day + ", " + this.year;
        this.template.querySelector(".fullDate").innerHTML = `${this.dayNames[this.updatedDate.getDay()]}, ${this.months[this.updatedDate.getMonth()]} ${this.updatedDate.getDate()}, ${this.updatedDate.getFullYear()}`;
    }

    nextClickHandler() {
        let startDate, endDate, status;
        // var tomorrowDate = this.template.querySelector(".fullDate");
        this.updatedDate.setDate((this.updatedDate.getDate() + 1));
        this.initialDate();
        this.changeDateFormat();
        // tomorrowDate.innerHTML = this.fulldate;
        startDate = this.updatedDate;
        status = 'Day';
        this.publishMC({
            startDate: startDate,
            endDate: endDate,
            status: status,
            dayClick: true,
        });
        console.log(JSON.stringify(this.updatedDate), JSON.stringify(this.saturdayDate), JSON.stringify(this.sundayDate));
    }
    prevClickHandler() {
        let startDate, endDate, status;
        console.log('Prevclick');
        var tomorrowDate = this.template.querySelector(".fullDate");
        this.updatedDate.setDate((this.updatedDate.getDate() - 1));
        this.initialDate();
        this.changeDateFormat();
        // tomorrowDate.innerHTML = this.fulldate;
        startDate = this.updatedDate;
        status = 'Day';
        this.publishMC({
            startDate: startDate,
            endDate: endDate,
            status: status,
            dayClick: true,
        });
    }
    navigateToReferralPage() {
        window.open('/PFNCADNA/s/instructorreferralprogram', '_self');
    }


    scheduleClassName;
    scheduleClassInstName;
    scheduelClassDescription;
    scheduleclassintensity;
    classdata;
    @track selectedClass = {}

    scheduleClassDetailViewHandle(event) {
        console.log('Classed CLicked');
        console.log(event.target.dataset.key);
        console.log(event.target.dataset.name);
        console.log(event.target.dataset.schname);
        console.log(event.target.dataset.descp);
        console.log(event.target.dataset.ints);
        this.selectedClass = this.scheduleClassesArray.find(e => e.Id == event.target.dataset.key);
        this.scheduleClassName = event.currentTarget.dataset.schname;
        this.scheduleClassInstName = event.currentTarget.dataset.name;
        this.scheduelClassDescription = event.currentTarget.dataset.descp;
        this.scheduleclassintensity = event.currentTarget.dataset.ints;
        this.InstDetailView = true;
        this.template.querySelector('.myClassesComponent').style.display = 'none';
    }

    trueparent() {
        this.InstDetailView = false;
        this.template.querySelector('.myClassesComponent').style.display = 'block';
    }

    liveCick() {
        // if (this.pageName == 'bwps_WIP_BrowseClasses__c') {
        //     window.open('/PFNCADNA/s/bwps-wip-browseclasses?active=lcs', '_self');
        // } else if (this.pageName == 'guestUserBrowseClasses__c') {
        //     window.open('/PFNCADNA/s/guestuserbrowseclasses?active=lcs', '_self');
        // }
    }
}