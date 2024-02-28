import { LightningElement, track, wire, api } from 'lwc';
import { publish, subscribe, unsubscribe, createMessageContext, releaseMessageContext } from 'lightning/messageService';
import IFRAMEMC from "@salesforce/messageChannel/ZoomSdkMessageChannel__c";

import myResource from '@salesforce/resourceUrl/DNAIcon';
// import favIcon from '@salesforce/resourceUrl/likeButton';
// import unFavIcon from '@salesforce/resourceUrl/unlikeIcon'
import myImage from '@salesforce/resourceUrl/ExerciseImage';
import userIcon from '@salesforce/resourceUrl/UserLogo';
//high signal
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
//low signal
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
//medium signal
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';
// import calendarlogo from '@salesforce/resourceUrl/calendarlogo';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';

import allEntitySubs from '@salesforce/apex/DNA_GuestUserClass.allEntitySubs';
import follow from '@salesforce/apex/DNA_GuestUserClass.follow';
import BWPS_GetUpcomingClasses from '@salesforce/apex/BWPS_GuestUserHistoryClass.BWPS_GetUpcomingClasses';

import enrollUser from '@salesforce/apex/BWPS_AttendeeEnrollmentController.enrollUser';
import createGetAttendee from '@salesforce/apex/Bwps_PlayOnDemandHendler.createGetAttendee';

export default class UpcomingClassesComponent extends LightningElement {
    context = createMessageContext();
    subscription = null;

    @track filterIcon = myResource + "/DNAIcons/filterIcon.png";
    @track levelIcon = myResource + "/DNAIcons/levelIcon.png";
    // @track share = shareIcon;
    @track lowSignal = lowSignal;
    @track highSignal = highSignal;
    @track mediumSignal = mediumSignal;
    @track calendarlogo = `${allIcons}/PNG/Calendar.png `;
    @track userIcon = myResource + "/DNAIcons/userIcon.png";
    @track likeIcon = myResource + "/DNAIcons/likeIcon.png";
    @track favIcon = `${allIcons}/PNG/Favorite.png `;
    @track unFavIcon = `${allIcons}/PNG/unfavorite.png `;
    @track ExerciseImage = myImage;
    @track showClassesOfWeek = false;
    @track showLiveLine = true;
    @track showInPersonLine = false;
    @track userImg = `${allIcons}/PNG/Instructor-Image.png `;
    @track JSONArray = [];
    @track currentPage = [];
    page;
    pageSize = 3;

    time1;
    time2;
    wiredClass;
    time;
    //@track visibleRecords = [{id : "1", src : "https://cyntexa-2f6-dev-ed.lightning.force.com/sfc/servlet.shepherd/version/download/0685j00000BDk4TAAT?operationContext=S1" , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore"},{id : "2", src : "https://cyntexa-2f6-dev-ed.lightning.force.com/sfc/servlet.shepherd/version/download/0685j00000BDk4TAAT?operationContext=S1" , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore"},{id : "3", src : "https://cyntexa-2f6-dev-ed.lightning.force.com/sfc/servlet.shepherd/version/download/0685j00000BDk4TAAT?operationContext=S1" , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore"},{id : "4", src : "https://cyntexa-2f6-dev-ed.lightning.force.com/sfc/servlet.shepherd/version/download/0685j00000BDk4TAAT?operationContext=S1" , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore"}]
    @track visibleRecords = [{ id: "1", src: this.ExerciseImage, Name: "Shuhana Ailus", Level__c: "High/Active", ExcerciseName__c: "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c: "Made possible with support from Lorien Encore", ClassStatus__c: "JOIN" },
    { id: "2", src: this.ExerciseImage, Name: "Shuhana Ailus", Level__c: "High/Active", ExcerciseName__c: "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c: "Made possible with support from Lorien Encore", ClassStatus__c: "JOIN" },
    { id: "3", src: this.ExerciseImage, Name: "Shuhana Ailus", Level__c: "High/Active", ExcerciseName__c: "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c: "Made possible with support from Lorien Encore", ClassStatus__c: "JOIN" }
    ]
    day;
    ButtonStatus;
    @track timeList = ['7 AM-8 AM', '8 AM-9 AM', '9 AM-10 AM', '10 AM-11 AM', '11 AM-12 PM', '12 PM-1 PM', '1 PM-2 PM', '2 PM-3 PM', '3 PM-4 PM', '4 PM-5 PM', '5 PM-6 PM', '6 PM-7 PM', '7 PM-8 PM'];
    @track classTime;
    @track showOver = false;
    @track DisabledButton = false;
    @track showMsg = false;
    showButton = false;
    @track msg;
    @track prev;
    @track next;
    @track ClassType = 'Live';
    @track isShowSendModal = false;
    @track showLiveLine = true;
    @track showInPersonLine = false;
    @track count = 0;
    @track loading = false;

    tab = true;
    connectedCallback() {
        this.handleTime({ 'target': { 'value': '7 AM-8 AM' } });
        this.prev = '7 AM-8 AM';
    }
    @track firstRenderFlag = true;
    renderedCallback() {
        if (this.firstRenderFlag) {
            this.template.querySelector(`[data-id="7 AM-8 AM"]`).style = "border-color:#008ba7;font-weight:600;";
            this.firstRenderFlag = false;
        }
    }
    handleLiveUnderline(event) {
        // console.log(event.target.dataset.id);
        this.showInPersonLine = false;
        this.showLiveLine = true;
        // this.handleTime({'target': {'value': '7 AM-8 AM'}});
        // this.prev = '7 AM-8 AM';
        this.ClassType = 'Live';
        this.tab = true;
        this.JSONArray = [];
        this.currentPage = [];
    }
    handleInPersonUnderline(event) {
        // console.log(event.target.dataset.id);
        this.showInPersonLine = true;
        this.showLiveLine = false;
        // this.handleTime({'target': {'value': '7 AM-8 AM'}});
        // this.prev = '7 AM-8 AM';
        this.tab = false;
        this.ClassType = 'In Person';
        this.JSONArray = [];
        this.currentPage = [];
    }
    handleTime(e) {
        console.log('handleTime Check : ');
        this.loading = true;
        if (this.count != 0) {
            //console.log('OUTPUT 1>>>>>>>: ',e.target.getAttribute('data-id'));
            this.template.querySelector(`[data-id="${this.prev}"]`).style = "border-color:transparent";
            this.template.querySelector(`[data-id="${e.target.getAttribute('data-id')}"]`).style = "border-color:#008ba7;font-weight:600;";
            this.prev = e.target.getAttribute('data-id');
        }
        console.log('loading Check : ', this.loading);
        this.JSONArray = [];
        this.currentPage = [];
        var timeElapsed = Date.now();
        var todayDate = new Date(timeElapsed);
        var currentTimeMiliSec = todayDate.toString().split(' ');
        var splitUpdatedDate;
        var todayDate = new Date(timeElapsed);
        // var currentTimeMiliSec = todayDate.toString().split(' ');
        var splitDay = todayDate.getDate();
        // var splitTomorrowDay = todayDate.getDate()+1;
        var splitMonth = todayDate.getMonth() + 1;
        var splitYear = todayDate.getFullYear();
        if (splitDay.toString().length == 1) {
            splitDay = '0' + splitDay;
        }
        else {
            splitDay = splitDay;
        }
        if (splitMonth.toString().length == 1) {
            splitMonth = '0' + splitMonth;
        }
        else {
            splitMonth = splitMonth;
        }
        splitUpdatedDate = splitYear + "-" + splitMonth + "-" + splitDay;
        // console.log('OUTPUT Date: ', splitUpdatedDate);

        // console.log('this.splitUpdatedDate', splitUpdatedDate);
        var splitCurrentTime = currentTimeMiliSec[4].split(':');
        var currentTime = splitCurrentTime[0] + ':' + splitCurrentTime[1]
        // console.log('Current splitDay', splitDay);
        // console.log('Date',todayDate);

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
        this.JSONArray = [];
        var unsplittime = (e.target.value);
        //this.template.querySelector('.timeButton').style="border-color:black";
        // console.log('Time',JSON.stringify(unsplittime));
        const convertTime12to24 = (time12h) => {
            const [time, modifier] = time12h.split(' ');
            let [hours, minutes] = time.split(':');
            // let minutes = '00';
            if (hours === '12') {
                hours = '00';
            }
            if (minutes == null) {
                minutes = '00';
            }
            if (modifier === 'PM') {
                hours = parseInt(hours, 10) + 12;
            }
            return `${hours}:${minutes}`;
        }

        var splittime = unsplittime.split('-');
        this.time1 = convertTime12to24(splittime[0]);
        // console.log('this.time1  : ',this.time1 );
        this.time2 = convertTime12to24(splittime[1]);
        // console.log('Class Type : ',this.ClassType );
        BWPS_GetUpcomingClasses({ time1: this.time1, time2: this.time2, ClassType: this.ClassType })
            .then(result => {
                if (result.length == 0) {
                    this.showMsg = true;
                    this.msg = "There is no class on this time."
                }
                else {
                    this.showMsg = false;
                }
                if (result.length > 3) {
                    this.showButton = true;
                }
                else {
                    this.showButton = false;
                }
                var data = result;
                let overVisible = false;
                this.count = 0;
                // console.log('Upcoming>>>>>>.',data);
                for (let i = 0; i < data.length; i++) {
                    var intensityImage;
                    let sig = data[i].Schedule_Class__r.Integrity__c;
                    if (sig == 'Low/Seated') {
                        intensityImage = this.lowSignal;
                    }
                    else if (sig == 'Medium') {
                        intensityImage = this.mediumSignal;
                    }
                    else if (sig == 'High/Active') {
                        intensityImage = this.highSignal;
                    }
                    else {
                        intensityImage = this.lowSignal;
                    }
                    let startTime = msToTime(data[i].BWPS_StartTime__c);
                    let endTime = msToTime(data[i].BWPS_EndTime__c);
                    // console.log('start time',convertTime12to24(startTime));
                    function getSeconds(timeToConvert) {
                        let hours = timeToConvert.split(':')[0];
                        let mins = timeToConvert.split(':')[1];

                        return (Number(hours) * 60) + (Number(mins));
                    }
                    let buttDisabled = false;
                    var classDate = (data[i].BWPS_ClassDate__c).split('-');
                    var classSplitUpdatedDate = classDate[0] + "-" + classDate[1] + "-" + classDate[2];
                    // console.log('OUTPUT : ',classSplitUpdatedDate);
                    let jDate = new Date(new Date(data[i].BWPS_ClassDate__c));
                    let j1Date = new Date();
                    jDate.setHours(0, 0, 0, 0);
                    let datestart = new Date();
                    datestart.setHours(0, 0, 0, 0);
                    let todayms = j1Date.getTime() - datestart.getTime();
                    let updatedLineItemStartTime = Number(data[i].BWPS_StartTime__c) - 900000;
                    let updatedLineItemEndTime = Number(data[i].BWPS_EndTime__c) + 900000;
                    console.log('starttimems : ', updatedLineItemStartTime);
                    console.log('todayms : ', todayms);
                    console.log('endtimems : ', updatedLineItemEndTime);
                    console.log('jDate : ', jDate);
                    console.log('todayDate : ', datestart);
                    if (jDate.valueOf() == datestart.valueOf()) {
                        console.log('date check : ');
                        if (todayms >= updatedLineItemStartTime && todayms <= updatedLineItemEndTime) {
                            console.log('if time check : ');
                            this.showOver = false;
                            overVisible = false;
                            buttDisabled = false;
                            this.ButtonStatus = 'JOIN';
                            // console.log('JOIN');
                        } else {
                            this.showOver = true;
                            overVisible = true;
                            // console.log('>>> : ',getSeconds(convertTime12to24(startTime)),getSeconds(currentTime));
                            //  if(data[i].BWPS_Lecture_Link__c != undefined){
                            //     console.log('inner Node');
                            //     // setTimeout(() => {
                            //     buttDisabled = false;
                            //     this.ButtonStatus = 'Play On Demand';
                            //     console.log('Play', this.showOver);
                            // }
                            // else{
                            buttDisabled = true;
                            this.ButtonStatus = 'JOIN'
                            // console.log('JOIN DISABLED', this.showOver);
                            // }
                        }
                        // if(getSeconds(convertTime12to24(startTime)) >= getSeconds(currentTime) && getSeconds(convertTime12to24(endTime)) <= getSeconds(currentTime)){
                        //     this.showOver = false;
                        //     overVisible = false;
                        //     buttDisabled = false ;
                        //     this.ButtonStatus = 'JOIN';
                        //     // console.log('JOIN');
                        // }else if(getSeconds(convertTime12to24(startTime)) < getSeconds(currentTime)){
                        //     this.showOver = true;
                        //     overVisible = true;
                        //     // console.log('>>> : ',getSeconds(convertTime12to24(startTime)),getSeconds(currentTime));
                        //     //  if(data[i].BWPS_Lecture_Link__c != undefined){
                        //     //     console.log('inner Node');
                        //     //     // setTimeout(() => {
                        //     //     buttDisabled = false;
                        //     //     this.ButtonStatus = 'Play On Demand';
                        //     //     console.log('Play', this.showOver);
                        //     // }
                        //     // else{
                        //         buttDisabled = true;
                        //         this.ButtonStatus = 'JOIN'
                        //         // console.log('JOIN DISABLED', this.showOver);
                        //     // }
                        // }
                    }
                    else {
                        this.showOver = true;
                        overVisible = true;
                        buttDisabled = true;
                        this.ButtonStatus = 'JOIN';
                        // console.log('JOIN');
                    }
                    this.ButtonStatus = 'JOIN';
                    // console.log(splitUpdatedDate, this.showOver);
                    // console.log(data[i].BWPS_ClassDate__c);
                    // console.log(splitTomorrowDate);
                    if (classSplitUpdatedDate == splitUpdatedDate) {
                        this.day = 'TODAY';
                    }
                    else {
                        console.log('BWPS_ClassDay__c in else : ', data[i].BWPS_ClassDay__c);
                        this.day = (data[i].BWPS_ClassDay__c) ?? '';
                    }
                    var schitem = data[i].Schedule_Class__r;
                    var obj = {
                        Id: data[i].Id,
                        RecType: schitem.RecordType.Name,
                        ClassType: schitem.Schedule_Type__c,
                        Date: data[i].BWPS_ClassDate__c,
                        Day: this.day,
                        Time: msToTime(data[i].BWPS_StartTime__c),
                        Name: data[i].Name,
                        Lecture: this.ButtonStatus,
                        LatLong: schitem.LatitudeLongitude__c,
                        disabledBtn: buttDisabled,
                        InstructorName: schitem.BWPS_instructor__r.Name,
                        UserImage: this.userImg,
                        Description: schitem.BWPS_Description__c,
                        Intensity: data[i].Schedule_Class__r.Integrity__c,
                        Status: data[i].Class_Status__c,
                        IntensityImage: intensityImage,
                        CardImage: this.ExerciseImage,
                        LectureId: data[i].LectureId__c,
                        VimeoId: data[i].BWPS_Vimeo_video_Id__c,
                        classFavStatus: false,
                        showOver: overVisible
                    }
                    this.JSONArray.push(obj);
                    console.log("ArrJSON",JSON.stringify(this.JSONArray));
                }
                allEntitySubs()
                    .then(result => {
                        // console.log('outside : ',JSON.stringify(result));
                        //console.log('visible array : ',JSON.strClass_Status__cingify(this.visibleCardElementArray));
                        if (result) {
                            // console.log('result : ',JSON.stringify(result));
                            //console.log(' inside visible array : ',JSON.stringify(this.visibleCardElementArray));
                            result.forEach(es => {
                                //TODO : currentItem
                                this.JSONArray.forEach(cls => {
                                    //TODO : currentItem
                                    // console.log('class Status is : ',cls.Class_Status__c);
                                    if (es.ParentId == cls.Id) {
                                        // console.log('class name : ',cls.Name);
                                        cls.classFavStatus = true;
                                    }
                                });
                            });
                        }
                        this.count++;
                        this.loading = false;
                    })
                console.log('JSONArrayy : ', this.JSONArray);
            }).catch(e => {
                console.log("e>>>>", e.message);
                this.loading = false;
            });
        console.log('loading Check : ', this.loading);
    }
    handlePrev(event) {
        this.template.querySelector(".slider").scrollLeft -= 368;
    }
    handleNext(event) {
        this.template.querySelector(".slider").scrollLeft += 368;
    }
    handleShare(event) {
        this.showSendModalBox();
        let scId = event.target.dataset.id;
        let scDescription = event.target.dataset.description;
        // console.log('Schedule Class Id : ', scId);
        // console.log('Schedule Class Id : ', scDescription);   
    }
    hideSendModalBox() {
        this.isShowSendModal = false;
    }
    showSendModalBox() {
        this.isShowSendModal = true;
    }
    favoriteHandler(event) {
        let classId = event.target.dataset.id;
        let classStatus = event.target.dataset.isfav;
        //console.log('classStatus : ',classStatus);
        follow({ recId: classId, isFollowing: classStatus })
            .then(result => {
                //console.log('response : ',result);
                if (result == true) {
                    this.JSONArray.forEach(e => {
                        //TODO : currentItem
                        if (String(e.Id) == classId) {
                            e.classFavStatus = true;
                            this.template.querySelector('c-toast-message').showToast('success', 'Favorite successfully.');
                            //console.log('if true class status : ',e.classFavStatus);
                        }
                    });
                }
                else if (result == false) {
                    this.JSONArray.forEach(e => {
                        //TODO : currentItem
                        if (e.Id == classId) {
                            e.classFavStatus = false;
                            this.template.querySelector('c-toast-message').showToast('success', 'Unfavorite successfully.');
                            //console.log('if false class status : ',e.classFavStatus);
                        }
                    });
                }
            })
            .catch(error => {
                console.log('Error : ', JSON.stringify(error));
            })

    }
    handleVideo(event) {
        let status = event.target.dataset.status;
        let classId = event.target.dataset.id;
        console.log('upcoStatus : ', status);
        if (status == 'Play On Demand') {
            let vimeoId = event.target.dataset.vimeoId;
            console.log('upvimeoId : ', vimeoId);

            createGetAttendee({ lineItemId: classId })
                .then(result => {
                    console.log("@attendee Id : ", result);
                })
                .catch(error => {

                    console.log("@error(createGetAttendee) : ", error);

                })

            let message = {
                videoId: vimeoId,
                iframeStatus: 'Vimeo'
            };
            publish(this.context, IFRAMEMC, message);

        }
        else if (status == 'JOIN') {
            let lectureId = event.target.dataset.lectureid;
            let name = event.target.dataset.name;
            // console.log('uplectureId : ',lectureId , name);

            enrollUser({ scheduleLineItemId: classId })
                .then((result) => {

                    console.log("@enrolled Id : ", result);
                })
                .catch((error) => {
                    console.log("@error(enrollUser) : ", error);
                })

            let message = {
                meetingId: lectureId,
                AttendeeName: name,
                iframeStatus: 'Zoom'
            };
            publish(this.context, IFRAMEMC, message);

        }
        // if(this.ButtonStatus == 'Play On Demand'){

        // }
        // else if(this.ButtonStatus == 'JOIN'){

        // }
    }
    handleLocation(e) {
        var latlong = e.target.dataset.lat;
        // console.log('OUTPUT ID: ',latlong);
        window.open('https://www.google.com/maps/place/' + latlong, 'blank');
    }
    @track CaseRecords;
    @track temp;
    Subject = 'Subject data';
    Body = 'Body Data';
    Email = 'LWC@gmail.com';
    sendMailMethod() {
        this.isShowSendModal = false;
        // console.log('ind');
        this.Subject = this.template.querySelector(`[data-id= 'Subject']`).value;
        this.Body = this.template.querySelector(`[data-id= 'Description']`).value;
        this.Email = this.template.querySelector(`[data-id= 'Email']`).value;
        this.temp = {
            "LeadDetails": {
                "Subject": this.Subject,
                "Body": this.Body,
                "Email": this.Email
            }
        }
        // console.log("body  "+this.Body);
        // console.log("temp : ",JSON.stringify(this.temp));
        LeadData({ LeadDetails: this.temp })
            .then(result => {
                this.CaseRecords = result;
                // console.log("output");
                // console.log(this.CaseRecords);
            })
            .catch(error => {
                this.error = error;
                console.log('error', this.error)
            });
        // console.log("fire");
        const custEvent = new CustomEvent(
            'callpasstoparent', {
            detail: 'false'
        });
        this.dispatchEvent(custEvent);
        this.template.querySelector('c-toast-meassage').showToast('success', 'Mail sent successfully.');
        this.hideSendModalBox();

    }
    @track myCalendarUrl;
    viewSchedule() {
        this.myCalendarUrl = '/PFNCADNA/s/myschedule';
    }


    @track classViewType = false;
    scheduleClassName;
    scheduleClassInstName;
    scheduelClassDescription;
    scheduleclassintensity;
    classdata;
    @track selectedClass = {}
    @api InstDetailView = false;

    scheduleClassDetailViewHandle(event) {
        console.log('Classed CLicked');
        console.log(event.target.dataset.key);
        console.log(event.target.dataset.name);
        console.log(event.target.dataset.schname);
        console.log(event.target.dataset.descp);
        console.log(event.target.dataset.ints);
        this.selectedClass = this.visibleRecords.find(e => e.Id == event.target.dataset.key);
        this.scheduleClassName = event.currentTarget.dataset.schname;
        this.scheduleClassInstName = event.currentTarget.dataset.name;
        this.scheduelClassDescription = event.currentTarget.dataset.descp;
        this.scheduleclassintensity = event.currentTarget.dataset.ints;
        console.log('Tested');
        this.InstDetailView = true;
        document.querySelector('html').style.overflow = 'hidden';
    }

    trueparent() {
        this.InstDetailView = false;
        document.querySelector('html').style.overflow = 'auto';
    }

    liveCick() {
        // if (this.pageName == 'bwps_WIP_BrowseClasses__c') {
        //     window.open('/PFNCADNA/s/bwps-wip-browseclasses?active=lcs', '_self');
        // } else if (this.pageName == 'guestUserBrowseClasses__c') {
        //     window.open('/PFNCADNA/s/guestuserbrowseclasses?active=lcs', '_self');
        // }
    }

}