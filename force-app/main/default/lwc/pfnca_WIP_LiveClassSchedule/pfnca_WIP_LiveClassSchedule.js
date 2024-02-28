import { LightningElement, track, wire } from 'lwc';
import USER_ID from '@salesforce/user/Id';
import imageResource from '@salesforce/resourceUrl/bwps_WIP_LiveClassSchedule';
import getScheduleLiveClassRecords from '@salesforce/apex/BWPS_WIPBrowseClasses.getScheduleLiveClassRecords';
import enrollUserByScheduleClass from '@salesforce/apex/BWPS_AttendeeEnrollmentController.enrollUserByScheduleClass';
import heroImage from '@salesforce/resourceUrl/headerHeroImages';
import allEntitySubs from '@salesforce/apex/DNA_GuestUserClass.allEntitySubs';
import follow from '@salesforce/apex/DNA_GuestUserClass.follow';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import Timer15 from '@salesforce/resourceUrl/Timer15';
import Timer30 from '@salesforce/resourceUrl/Timer30';
import Timer45 from '@salesforce/resourceUrl/Timer45';
import Timer60 from '@salesforce/resourceUrl/Timer60';
import { CurrentPageReference } from 'lightning/navigation';

export default class Bwps_WIP_LiveClassSchedule extends LightningElement {

    heroImage = heroImage + '/headerLCS.png';

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
    @track favIcon = `${allIcons}/PNG/Favorite.png `;
    @track unFavIcon = `${allIcons}/PNG/unfavorite.png `;
    @track classData = [];
    showFullData = false;
    showFullDataButton = true;
    showExpandCollapseButton = true;
    @track ScheduleClass = [];
    @track ScheduleClassNew = [];
    //splitUpdatedDate;
    totalData;

    currentPage;
    buttonStatus = 'JOIN';
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            console.log('Stata>. ', currentPageReference.attributes.name);
            this.currentPage = currentPageReference.attributes.name;
        }

        if (this.currentPage == 'guestUserBrowseClasses__c') {
            this.buttonStatus = 'ENROLL'
        }
    }



    connectedCallback() {
        getScheduleLiveClassRecords()
            .then(result => {
                this.ScheduleClass = result;
                this.ScheduleClassNew = result;
                const timeElapsed = Date.now();
                const tempDate = new Date(timeElapsed);
                var splitDay = tempDate.getDate();
                if (tempDate.getDate() < 10) {
                    splitDay = '0' + tempDate.getDate();
                }
                var splitMonth = tempDate.getMonth() + 1;
                console.log('splitMonth ', splitMonth);
                if (tempDate.getMonth() + 1 < 10) {
                    var monthtemp = tempDate.getMonth() + 1;
                    splitMonth = '0' + monthtemp;
                }
                console.log('tempDate.getMonth()+1  ', tempDate.getMonth() + 1);
                console.log('splitMonth ', splitMonth);
                var splitYear = tempDate.getFullYear();
                var splitUpdatedDate = splitYear + "-" + splitMonth + "-" + splitDay;
                console.log('splitUpdatedDate ', splitUpdatedDate);
                let arrFlt = [];
                let i;
                let obj = {};
                function msToTime(duration) {
                    var milliseconds = Math.floor((duration % 1000) / 100),
                        minutes = Math.floor((duration / (1000 * 60)) % 60),
                        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
                    var ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    var strTime = hours + ':' + minutes + ' ' + ampm;
                    return strTime;
                }
                console.log('this.ScheduleClassNew ', this.ScheduleClassNew);
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    //var enrolledUsers = this.ScheduleClassNew[i].Enrolled_Classes__r.length;
                    //console.log('enrolledUsers ',enrolledUsers);
                    // var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
                    // var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    // var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    // var minutesfinal = divisor_for_minutesFinal / (1000 * 60);
                    var minutesfinal = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c) / (1000 * 60);
                    let timeLogo;
                    if (minutesfinal <= '15') {
                        timeLogo = Timer15;
                    }
                    else if (minutesfinal > '15' && minutesfinal <= '30') {
                        timeLogo = Timer30;
                    }
                    else if (minutesfinal > '30' && minutesfinal <= '45') {
                        timeLogo = Timer45;
                    }
                    else if (minutesfinal >= '45') {
                        timeLogo = Timer60;
                    }
                    if (this.ScheduleClassNew[i].BWPS_Date__c == splitUpdatedDate) {
                        console.log('inside BWPS_Date__c ', this.ScheduleClassNew[i].BWPS_Date__c);
                        obj = {
                            "Id": this.ScheduleClassNew[i].Id,
                            "Name": this.ScheduleClassNew[i].Name,
                            "Integrity__c": this.ScheduleClassNew[i].Integrity__c,
                            "BWPS_StartTime__c": msToTime(this.ScheduleClassNew[i].BWPS_StartTime__c),
                            "BWPS_Date__c": this.ScheduleClassNew[i].BWPS_Date__c,
                            "BWPS_Description__c": this.ScheduleClassNew[i].BWPS_Description__c,
                            "Instructor": this.ScheduleClassNew[i].BWPS_instructor__r.Name,
                            "Duration": minutesfinal,
                            "duration_icon": timeLogo,
                            "classFavStatus": false,
                            totalMembers: "10"
                        }
                        arrFlt.push(obj);
                    }
                }
                //Checking isFav or not
                let arrFltFinal = this.checkRecordIsFavOrNot(arrFlt);
                console.log('arrFltFinalLog : ', JSON.stringify(arrFltFinal));
                this.ScheduleClass = arrFltFinal;
                if (this.ScheduleClass.length > 0 && this.ScheduleClass.length <= 4) {
                    this.classData = this.ScheduleClass.slice(0, 4)
                } else if (this.ScheduleClass.length != 0) {
                    this.classData = this.ScheduleClass.slice(0, this.ScheduleClass.length)
                }

                console.log(' this.classData ', this.classData);
                this.totalData = this.ScheduleClass.length;
                console.log('  this.totalData ', this.totalData);
            })
            .catch(error => {
                this.error = error;
                console.log('error', JSON.stringify(this.error));
            });

        if (this.ScheduleClass.length <= 4) {
            this.showExpandCollapseButton = false
        }
        else {
            this.showExpandCollapseButton = true

        }
    }

    handleFullList() {

        console.log("%c HandleFullList", "color:green;");

        if (this.showFullData == true) {
            this.showFullData = false;
            this.showFullDataButton = true;
        }
        else if (this.showFullData == false) {
            this.showFullData = true;
            this.showFullDataButton = false;
        }

    }
    checkRecordIsFavOrNot(arr) {
        console.log('arr in check : ', JSON.stringify(arr));
        allEntitySubs()
            .then(result => {
                console.log('outside : ', JSON.stringify(result));
                if (result) {
                    console.log('result : ', JSON.stringify(result));
                    result.forEach(es => {
                        arr.forEach(cls => {
                            if (es.ParentId == cls.Id) {
                                console.log('incheck if : ');
                                cls.classFavStatus = true;
                                console.log('favstatus in if : ', cls.classFavStatus);
                            }
                        });
                    });
                }
            })
            .catch(error => {
                console.log('errorrinsubs : ', JSON.stringify(error), error.message);
            })
        console.log('arr after : ', JSON.stringify(arr));
        return arr;
    }

    renderedCallback() {
        let dateInput = this.template.querySelector('.date-picker-input');
        dateInput.style.setProperty("--date-picker-background", `url(${this.calendarIcon})`);

        if (this.ScheduleClass.length <= 4) {
            this.showExpandCollapseButton = false
        }
        else {
            this.showExpandCollapseButton = true

        }
        // this.dateValue = new Date().toISOString().slice(0, -14);
    }


    todayDate = new Date();
    @track dateValue = this.todayDate.toISOString().slice(0, -14);
    @track arr = this.todayDate.toLocaleDateString('en-IN', { dateStyle: 'full' }).split(',');
    // formattedDateValue =  this.arr[0]+this.arr[1]+','+ this.arr[2];
    formattedDateValue = this.arr[0] + '' + this.arr[1];
    showTodayButton = false;

    handleShowToday() {
        this.ScheduleClass = [];
        this.classData = [];
        let todayDate = new Date();
        this.dateValue = todayDate.toISOString().slice(0, -14);
        this.arr = todayDate.toLocaleDateString('en-IN', { dateStyle: 'full' }).split(',');
        // this.formattedDateValue =  this.arr[0]+this.arr[1]+','+ this.arr[2];
        this.formattedDateValue = this.arr[0] + '' + this.arr[1];
        //this.formattedDateValue = todayDate.toLocaleDateString('en-IN', {  dateStyle:'full' });
        this.showTodayButton = false;
        let arrFlt = [];
        let i;
        let obj = {};
        function msToTime(duration) {
            var milliseconds = Math.floor((duration % 1000) / 100),
                minutes = Math.floor((duration / (1000 * 60)) % 60),
                hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }

        for (i = 0; i < this.ScheduleClassNew.length; i++) {
            // var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
            // var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
            // var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
            // var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
            // console.log('this.ScheduleClassNew[i].BWPS_Date__c ', this.ScheduleClassNew[i].BWPS_Date__c);
            // console.log(' this.dateValue ', this.dateValue);
            var minutesfinal = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c) / (1000 * 60);
            let timeLogo;
            if (minutesfinal <= '15') {
                timeLogo = Timer15;
            }
            else if (minutesfinal > '15' && minutesfinal <= '30') {
                timeLogo = Timer30;
            }
            else if (minutesfinal > '30' && minutesfinal <= '45') {
                timeLogo = Timer45;
            }
            else if (minutesfinal >= '45') {
                timeLogo = Timer60;
            }
            if (this.ScheduleClassNew[i].BWPS_Date__c == this.dateValue) {
                console.log('inside BWPS_Date__c ', this.ScheduleClassNew[i].BWPS_Date__c);
                obj = {
                    "Id": this.ScheduleClassNew[i].Id,
                    "Name": this.ScheduleClassNew[i].Name,
                    "Integrity__c": this.ScheduleClassNew[i].Integrity__c,
                    "BWPS_StartTime__c": msToTime(this.ScheduleClassNew[i].BWPS_StartTime__c),
                    "BWPS_Date__c": this.ScheduleClassNew[i].BWPS_Date__c,
                    "BWPS_Description__c": this.ScheduleClassNew[i].BWPS_Description__c,
                    "Instructor": this.ScheduleClassNew[i].BWPS_instructor__r.Name,
                    "Duration": minutesfinal,
                    "duration_icon": timeLogo,
                    "classFavStatus": false,
                    totalMembers: "10"
                }
                arrFlt.push(obj);
            }
        }
        //Checking isFav or not
        let arrFltFinal = this.checkRecordIsFavOrNot(arrFlt);
        console.log('arrFltFinalLog : ', JSON.stringify(arrFltFinal));
        this.ScheduleClass = arrFltFinal;
        if (this.ScheduleClass.length > 0 && this.ScheduleClass.length >= 4) {
            this.classData = this.ScheduleClass.slice(0, 4)
        } else if (this.ScheduleClass.length != 0) {
            this.classData = this.ScheduleClass.slice(0, this.ScheduleClass.length)
        }
        this.totalData = this.ScheduleClass.length;

        if (this.ScheduleClass.length <= 4) {
            this.showExpandCollapseButton = false
        }
        else {
            this.showExpandCollapseButton = true

        }

    }


    handleDateChange(event) {
        console.log('Date Changed');

        let eventTargetValue = event.target.value;
        this.ScheduleClass = [];
        this.classData = [];

        if (eventTargetValue == '') {
            let todayDate = new Date();
            this.dateValue = todayDate.getFullYear() + '-' + (todayDate.getMonth() + 1) + '-' + todayDate.getDate();
        }
        else {
            this.dateValue = event.target.value;
        }
        let tempDate = new Date(this.dateValue);
        //this.formattedDateValue = tempDate.toLocaleDateString('en-IN',{  dateStyle:'full' })
        this.arr = tempDate.toLocaleDateString('en-IN', { dateStyle: 'full' }).split(',');
        // this.formattedDateValue =  this.arr[0]+this.arr[1]+','+ this.arr[2];
        this.formattedDateValue = this.arr[0] + '' + this.arr[1];
        var splitDay = tempDate.getDate();
        if (tempDate.getDate() < 10) {
            splitDay = '0' + tempDate.getDate();
        }
        var splitMonth = tempDate.getMonth() + 1;
        if (tempDate.getMonth() + 1 < 10) {
            var monthtemp = tempDate.getMonth() + 1;
            splitMonth = '0' + monthtemp;
        }
        var splitYear = tempDate.getFullYear();
        var splitUpdatedDate = splitYear + "-" + splitMonth + "-" + splitDay;
        console.log('splitUpdatedDate handle ', splitUpdatedDate);
        let arrFlt = [];
        let i;
        let obj = {};
        function msToTime(duration) {
            var milliseconds = Math.floor((duration % 1000) / 100),
                minutes = Math.floor((duration / (1000 * 60)) % 60),
                hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }

        for (i = 0; i < this.ScheduleClassNew.length; i++) {
            // var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
            // var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
            // var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
            // var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
            // console.log('this.ScheduleClassNew[i].BWPS_Date__c >>> ', this.ScheduleClassNew[i].BWPS_Date__c, splitUpdatedDate);
            var minutesfinal = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c) / (1000 * 60);
            let timeLogo;
            if (minutesfinal <= '15') {
                timeLogo = Timer15;
            }
            else if (minutesfinal > '15' && minutesfinal <= '30') {
                timeLogo = Timer30;
            }
            else if (minutesfinal > '30' && minutesfinal <= '45') {
                timeLogo = Timer45;
            }
            else if (minutesfinal >= '45') {
                timeLogo = Timer60;
            }
            if (this.ScheduleClassNew[i].BWPS_Date__c == splitUpdatedDate) {
                console.log('inside handle BWPS_Date__c ', this.ScheduleClassNew[i].BWPS_Date__c);
                obj = {
                    "Id": this.ScheduleClassNew[i].Id,
                    "Name": this.ScheduleClassNew[i].Name,
                    "Integrity__c": this.ScheduleClassNew[i].Integrity__c,
                    "BWPS_StartTime__c": msToTime(this.ScheduleClassNew[i].BWPS_StartTime__c),
                    "BWPS_Date__c": this.ScheduleClassNew[i].BWPS_Date__c,
                    "BWPS_Description__c": this.ScheduleClassNew[i].BWPS_Description__c,
                    "Instructor": this.ScheduleClassNew[i].BWPS_instructor__r.Name,
                    "Duration": minutesfinal,
                    "duration_icon": timeLogo,
                    "classFavStatus": false,
                    totalMembers: "10"
                }
                arrFlt.push(obj);
            }
        }
        this.ScheduleClass = [];
        let arrFltFinal = this.checkRecordIsFavOrNot(arrFlt);
        console.log('arrFltFinalLog : ', JSON.stringify(arrFltFinal));
        this.ScheduleClass = arrFltFinal;
        if (this.ScheduleClass.length > 0 && this.ScheduleClass.length >= 4) {
            this.classData = this.ScheduleClass.slice(0, 4);
        } else if (this.ScheduleClass.length != 0) {
            this.classData = this.ScheduleClass.slice(0, this.ScheduleClass.length);
        }
        this.totalData = this.ScheduleClass.length;
        if (eventTargetValue == '') {
            this.showTodayButton = false;
        }
        else {
            if (this.dateValue == this.todayDate.toISOString().slice(0, -14)) {
                this.showTodayButton = false;
            }
            else {
                this.showTodayButton = true;
            }
        }

        if (this.ScheduleClass.length <= 4) {
            this.showExpandCollapseButton = false
        }
        else {
            this.showExpandCollapseButton = true

        }
    }





    handlePreviousDateChange() {
        //setTimeout(() => {
        this.ScheduleClass = [];
        this.classData = [];
        var dateFormatTotime = new Date(this.dateValue);
        var decreasedDate = new Date(dateFormatTotime.getTime() - (86400000)); //one day to milliseconds
        this.dateValue = decreasedDate.toISOString().slice(0, -14);
        let tempDate = new Date(this.dateValue);
        this.arr = tempDate.toLocaleDateString('en-IN', { dateStyle: 'full' }).split(',');
        // this.formattedDateValue =  this.arr[0]+this.arr[1]+','+ this.arr[2];
        this.formattedDateValue = this.arr[0] + '' + this.arr[1];
        // this.formattedDateValue = tempDate.toLocaleDateString('en-IN',{  dateStyle:'full' })
        var splitDay = tempDate.getDate();
        if (tempDate.getDate() < 10) {
            splitDay = '0' + tempDate.getDate();
        }
        var splitMonth = tempDate.getMonth() + 1;
        if (tempDate.getMonth() + 1 < 10) {
            var monthtemp = tempDate.getMonth() + 1;
            splitMonth = '0' + monthtemp;
        }
        var splitYear = tempDate.getFullYear();
        var splitUpdatedDate = splitYear + "-" + splitMonth + "-" + splitDay;
        console.log('splitUpdatedDate ', splitUpdatedDate);
        let arrFltpost = [];
        let i;
        let obj = {};
        function msToTime(duration) {
            var milliseconds = Math.floor((duration % 1000) / 100),
                minutes = Math.floor((duration / (1000 * 60)) % 60),
                hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }

        for (i = 0; i < this.ScheduleClassNew.length; i++) {
            // var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
            // var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
            // var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
            // var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
            // console.log('this.ScheduleClassNew[i].BWPS_Date__c ', this.ScheduleClassNew[i].BWPS_Date__c);
            var minutesfinal = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c) / (1000 * 60);
            let timeLogo;
            if (minutesfinal <= '15') {
                timeLogo = Timer15;
            }
            else if (minutesfinal > '15' && minutesfinal <= '30') {
                timeLogo = Timer30;
            }
            else if (minutesfinal > '30' && minutesfinal <= '45') {
                timeLogo = Timer45;
            }
            else if (minutesfinal >= '45') {
                timeLogo = Timer60;
            }
            if (this.ScheduleClassNew[i].BWPS_Date__c == splitUpdatedDate) {
                console.log('inside pre BWPS_Date__c ', this.ScheduleClassNew[i].BWPS_Date__c);
                console.log('splitUpdatedDate inside if ', splitUpdatedDate);
                obj = {
                    "Id": this.ScheduleClassNew[i].Id,
                    "Name": this.ScheduleClassNew[i].Name,
                    "Integrity__c": this.ScheduleClassNew[i].Integrity__c,
                    "BWPS_StartTime__c": msToTime(this.ScheduleClassNew[i].BWPS_StartTime__c),
                    "BWPS_Date__c": this.ScheduleClassNew[i].BWPS_Date__c,
                    "BWPS_Description__c": this.ScheduleClassNew[i].BWPS_Description__c,
                    "Instructor": this.ScheduleClassNew[i].BWPS_instructor__r.Name,
                    "Duration": minutesfinal,
                    "duration_icon": timeLogo,
                    "classFavStatus": false,
                    totalMembers: "10"
                }
                arrFltpost.push(obj);
                console.log('arrFltpost ', JSON.stringify(arrFltpost));
            }
        }
        //Checking isFav or not
        let arrFltFinal = this.checkRecordIsFavOrNot(arrFltpost);
        console.log('arrFltFinalLog : ', JSON.stringify(arrFltFinal));
        console.log('check1');
        console.log('arrFltpost ', arrFltpost);
        console.log('arrFltpost length', arrFltpost.length);

        this.ScheduleClass = arrFltFinal;
        console.log('ScheduleClass length ', this.ScheduleClass.length);
        console.log('check2');
        console.log(' this.ScheduleClass ', JSON.stringify(this.ScheduleClass));
        if (this.ScheduleClass.length > 0 && this.ScheduleClass.length >= 4) {
            this.classData = this.ScheduleClass.slice(0, 4);
        } else if (this.ScheduleClass.length != 0) {
            this.classData = this.ScheduleClass.slice(0, this.ScheduleClass.length);
        }
        this.totalData = this.ScheduleClass.length;
        if (this.dateValue == this.todayDate.toISOString().slice(0, -14)) {
            this.showTodayButton = false;
        }
        else {
            this.showTodayButton = true;
        }
        //}, 6000);

        if (this.ScheduleClass.length <= 4) {
            this.showExpandCollapseButton = false
        }
        else {
            this.showExpandCollapseButton = true

        }
    }

    handleNextDateChange() {
        this.ScheduleClass = [];
        this.classData = [];
        var dateFormatTotime = new Date(this.dateValue);
        var increasedDate = new Date(dateFormatTotime.getTime() + (86400000)); //one day to milliseconds
        this.dateValue = increasedDate.toISOString().slice(0, -14);
        let tempDate = new Date(this.dateValue);
        this.arr = tempDate.toLocaleDateString('en-IN', { dateStyle: 'full' }).split(',');
        // this.formattedDateValue =  this.arr[0]+this.arr[1]+','+ this.arr[2];
        this.formattedDateValue = this.arr[0] + '' + this.arr[1];
        //this.formattedDateValue = tempDate.toLocaleDateString('en-IN',{  dateStyle:'full' })
        var splitDay = tempDate.getDate();
        if (tempDate.getDate() < 10) {
            splitDay = '0' + tempDate.getDate();
        }
        var splitMonth = tempDate.getMonth() + 1;
        if (tempDate.getMonth() + 1 < 10) {
            var monthtemp = tempDate.getMonth() + 1;
            splitMonth = '0' + monthtemp;
        }
        var splitYear = tempDate.getFullYear();
        var splitUpdatedDate = splitYear + "-" + splitMonth + "-" + splitDay;
        let arrFltpre = [];
        let i;
        let obj = {};
        function msToTime(duration) {
            var milliseconds = Math.floor((duration % 1000) / 100),
                minutes = Math.floor((duration / (1000 * 60)) % 60),
                hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }

        for (i = 0; i < this.ScheduleClassNew.length; i++) {
            // var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
            // var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
            // var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
            // var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
            // console.log('this.ScheduleClassNew[i].BWPS_Date__c ', this.ScheduleClassNew[i].BWPS_Date__c);
            // console.log(' splitUpdatedDate ', splitUpdatedDate);
            var minutesfinal = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c) / (1000 * 60);
            let timeLogo;
            if (minutesfinal <= '15') {
                timeLogo = Timer15;
            }
            else if (minutesfinal > '15' && minutesfinal <= '30') {
                timeLogo = Timer30;
            }
            else if (minutesfinal > '30' && minutesfinal <= '45') {
                timeLogo = Timer45;
            }
            else if (minutesfinal >= '45') {
                timeLogo = Timer60;
            }
            if (this.ScheduleClassNew[i].BWPS_Date__c == splitUpdatedDate) {
                console.log('next BWPS_Date__c ', this.ScheduleClassNew[i].BWPS_Date__c);
                obj = {
                    "Id": this.ScheduleClassNew[i].Id,
                    "Name": this.ScheduleClassNew[i].Name,
                    "Integrity__c": this.ScheduleClassNew[i].Integrity__c,
                    "BWPS_StartTime__c": msToTime(this.ScheduleClassNew[i].BWPS_StartTime__c),
                    "BWPS_Date__c": this.ScheduleClassNew[i].BWPS_Date__c,
                    "BWPS_Description__c": this.ScheduleClassNew[i].BWPS_Description__c,
                    "Instructor": this.ScheduleClassNew[i].BWPS_instructor__r.Name,
                    "Duration": minutesfinal,
                    "duration_icon": timeLogo,
                    "classFavStatus": false,
                    totalMembers: "10"
                }
                arrFltpre.push(obj);
                console.log('arrFltpre ', JSON.stringify(arrFltpre));
            }
        }
        //Checking isFav or not
        this.ScheduleClass = [];
        let arrFltFinal = this.checkRecordIsFavOrNot(arrFltpre);
        console.log('arrFltFinalLog : ', JSON.stringify(arrFltFinal));
        this.ScheduleClass = arrFltFinal;
        console.log(' this.ScheduleClass ', JSON.stringify(this.ScheduleClass));
        if (this.ScheduleClass.length > 0 && this.ScheduleClass.length >= 4) {
            this.classData = this.ScheduleClass.slice(0, 4);
        } else if (this.ScheduleClass.length != 0) {
            this.classData = this.ScheduleClass.slice(0, this.ScheduleClass.length);
        }
        this.totalData = this.ScheduleClass.length;
        if (this.dateValue == this.todayDate.toISOString().slice(0, -14)) {
            this.showTodayButton = false;
        }
        else {
            this.showTodayButton = true;
        }

        if (this.ScheduleClass.length <= 4) {
            this.showExpandCollapseButton = false
        }
        else {
            this.showExpandCollapseButton = true

        }
    }

    handleLikeClick(event) {
        if (USER_ID || USER_ID) {
            let classId = event.target.dataset.id;
            let classStatus = event.target.dataset.status;
            let type = event.target.dataset.type;
            console.log('status id type : ', classStatus, classId, type);
            var tempArr = [];
            let flag = false;
            if (type == 'FULL') {
                tempArr = this.classData;
                flag = true;
            } else {
                tempArr = this.ScheduleClass;
            }

            follow({ recId: classId, isFollowing: classStatus })
                .then(result => {
                    //console.log('response : ',result);
                    if (result == true) {
                        tempArr.forEach(e => {
                            //TODO : currentItem
                            if (String(e.Id) == classId) {
                                e.classFavStatus = true;
                                this.template.querySelector('c-toast-message').showToast('success', 'Favorite successfully.');
                                //console.log('if true class status : ',e.classFavStatus);
                            }
                        });
                    }
                    else if (result == false) {
                        tempArr.forEach(e => {
                            //TODO : currentItem
                            if (e.Id == classId) {
                                e.classFavStatus = false;
                                this.template.querySelector('c-toast-message').showToast('success', 'Unfavorite successfully.');
                                //console.log('if false class status : ',e.classFavStatus);
                            }
                        });
                    }
                    if (flag) {
                        this.classData = tempArr;
                    }
                    else {
                        this.ScheduleClass = tempArr;
                    }
                })
                .catch(error => {
                    console.log('Error : ', JSON.stringify(error));
                })
        }
        else {
            window.location.href = window.location.origin + '/PFNCADNA/s/bwps-wip-signin';
            // window.open('/PFNCADNA/s/bwps-wip-signin');
        }
    }

    onJoinButtonClick(event) {

        let value = event.target.dataset.value;
        let id = event.target.dataset.id;
        console.log('Value and Id : ', value, id);
        if (value == 'JOIN') {
            window.location.href = window.location.origin + '/PFNCADNA/s/bwps-wip-signin';
            // window.open('/PFNCADNA/s/bwps-wip-signin');
        }
        else if (value == 'ENROLL') {
            // window.open( '/PFNCADNA/s/guestuserbrowseclasses');
            this.enrollUser(id);
            return;
        }

        console.log('Clicked ');
        if (USER_ID == undefined || USER_ID == null) {
            window.location.href = window.location.origin + '/PFNCADNA/s/bwps-wip-signin';
            // window.open('/PFNCADNA/s/bwps-wip-signin');
        }
    }

    enrollUser(schedulClassId) {
        console.log('schedulClassId : ', schedulClassId);
        enrollUserByScheduleClass({ schedulClassId: String(schedulClassId) })
            .then((result) => {

                this.template.querySelector('c-toast-message').showToast('success', result);

            })
            .catch((error) => {

                this.template.querySelector('c-toast-message').showToast('error', error.body.message);
            })
    }


}