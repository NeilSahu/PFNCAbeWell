import { LightningElement, track, wire, api } from 'lwc';
import { publish, subscribe, unsubscribe, createMessageContext, releaseMessageContext } from 'lightning/messageService';
import IFRAMEMC from "@salesforce/messageChannel/ZoomSdkMessageChannel__c";

import FilterWIP from '@salesforce/resourceUrl/FilterWIP';
import myResource from '@salesforce/resourceUrl/DNAIcon';
import filter from '@salesforce/resourceUrl/filter';
import Logo from '@salesforce/resourceUrl/WIPlogo';
import myImage from '@salesforce/resourceUrl/ExerciseImage';
import yogaWIP from '@salesforce/resourceUrl/yogaWIP';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import allIcon from '@salesforce/resourceUrl/BWPSPhotos';
import getScheduleClassRecords from '@salesforce/apex/BWPS_WIPBrowseClasses.getScheduleClassRecords';
import getAllLineItems from '@salesforce/apex/BWPS_WIPBrowseClasses.getAllLineItems';
import Instructor_Dashboard_cardsImages from '@salesforce/resourceUrl/Instructor_Dashboard_cardsImages';
import getAllInstructors from '@salesforce/apex/BWPS_WIPBrowseClasses.getAllInstructors';
// import allEntitySubs from '@salesforce/apex/DNA_GuestUserClass.allEntitySubs';
import getAllEntitySubsMap from '@salesforce/apex/DNA_GuestUserClass.getAllEntitySubsMap';
import follow from '@salesforce/apex/DNA_GuestUserClass.follow';
import getClasses from '@salesforce/apex/BWPS_WIPBrowseClasses.getAllClasses';
//high signal
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
//low signal
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
//medium signal
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';
import getUserProfileName from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
import { CurrentPageReference } from 'lightning/navigation';
export default class Pfnca_Main_BrowseClasses extends LightningElement {
    context = createMessageContext();
    subscription = null;

    scheduleClassName;
    scheduleClassInstName;
    scheduelClassDescription;
    scheduleclassintensity;
    @track selectedClass = {};
    InstDetailView = false;
    InsVal = 'none';
    clsVal = 'none';
    inpsrch = '';
    morning = '';
    @track pageName;
    // @track FilterImg = FilterWIP;
    @track FilterImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' id='Filter' width='16' height='16' viewBox='0 0 16 16'%3E%3Crect id='Bounding_Box' data-name='Bounding Box' width='16' height='16' fill='none'/%3E%3Cg id='np_filter_4651673_000000' transform='translate(-3.555 -3.734)'%3E%3Cpath id='Path_11184' data-name='Path 11184' d='M42.2,8.062a1.5,1.5,0,0,1-1,1.41v7.939a.5.5,0,1,1-1,0V9.472a1.5,1.5,0,0,1,0-2.823V6.058a.5.5,0,1,1,1,0v.591a1.506,1.506,0,0,1,1,1.413Z' transform='translate(-28.964)' fill='%23fff'/%3E%3Cpath id='Path_11185' data-name='Path 11185' d='M75.836,15.407a1.507,1.507,0,0,1-1,1.413v.591a.5.5,0,1,1-1,0V16.82a1.5,1.5,0,0,1,0-2.823V6.058a.5.5,0,1,1,1,0V14a1.5,1.5,0,0,1,1,1.41Z' transform='translate(-57.924)' fill='%23fff'/%3E%3Cpath id='Path_11186' data-name='Path 11186' d='M8.559,15.407a1.5,1.5,0,0,1-1,1.413v.591a.5.5,0,1,1-1,0V16.82a1.5,1.5,0,0,1,0-2.823V6.058a.5.5,0,1,1,1,0V14a1.5,1.5,0,0,1,1,1.41Z' fill='%23fff'/%3E%3C/g%3E%3C/svg%3E";
    @track FilterNew = filter;
    FilterApply = false;
    alldata = true;
    FilterSearch = true;
    @api filterclassid;
    @api fiterintensity;
    //@track filtericon=  allIcons+"/PNG/Filter.png ";
    @track Classimage = `${allIcon}/BWPSPhotos/group.jpg `;
    @track typeLogo = Logo + "/WIPlogo/Type.svg";
    @track TimeLogo = Logo + "/WIPlogo/Time.svg";
    @track unFavIcon = `${allIcons}/PNG/unfavorite.png `;
    @track favIcon = `${allIcons}/PNG/Favorite.png `;
    //@track Classimage = Logo + "/WIPlogo/Class_image.png";
    @track seatedLogo = Logo + "/WIPlogo/Seated_Icon.svg";
    @track levelLogo = Logo + "/WIPlogo/Level_Small.svg";
    @track instructorLogo = Logo + "/WIPlogo/Instructor_Image.svg";
    @track durationLogo = Logo + "/WIPlogo/duration-icon.svg";
    @track filterIcon = myResource + "/DNAIcons/filterIcon.png";
    @track levelIcon = myResource + "/DNAIcons/levelIcon.png";
    @track shareIcon = myResource + "/DNAIcons/shareIcon.png";
    // @track userIcon = myResource + "/DNAIcons/userIcon.png";
    @track userIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='23.999' viewBox='0 0 24 23.999'%3E%3Cg id='Instructor_Image' transform='translate(-5.432 -5.433)'%3E%3Cpath id='Path_10946' data-name='Path 10946' d='M35.365,36.137a3.64,3.64,0,1,0-3.64-3.64A3.644,3.644,0,0,0,35.365,36.137Z' transform='translate(-17.933 -15.976)' fill='%23008BA7'/%3E%3Cpath id='Path_10947' data-name='Path 10947' d='M8.951,25.95l.545.48,0,0a11.99,11.99,0,0,0,15.866,0l0,0,.545-.48-.018-.016a12,12,0,1,0-16.925,0ZM6.719,17.433a10.713,10.713,0,1,1,18.2,7.659,11.986,11.986,0,0,0-14.97,0A10.715,10.715,0,0,1,6.719,17.433Z' transform='translate(0 0)' fill='%23008BA7'/%3E%3C/g%3E%3C/svg%3E";
    @track userIcon1 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='23.999' viewBox='0 0 24 23.999'%3E%3Cg id='Instructor_Image' transform='translate(-5.432 -5.433)'%3E%3Cpath id='Path_10946' data-name='Path 10946' d='M35.365,36.137a3.64,3.64,0,1,0-3.64-3.64A3.644,3.644,0,0,0,35.365,36.137Z' transform='translate(-17.933 -15.976)' fill='%23ffffff'/%3E%3Cpath id='Path_10947' data-name='Path 10947' d='M8.951,25.95l.545.48,0,0a11.99,11.99,0,0,0,15.866,0l0,0,.545-.48-.018-.016a12,12,0,1,0-16.925,0ZM6.719,17.433a10.713,10.713,0,1,1,18.2,7.659,11.986,11.986,0,0,0-14.97,0A10.715,10.715,0,0,1,6.719,17.433Z' transform='translate(0 0)' fill='%23ffffff'/%3E%3C/g%3E%3C/svg%3E";
    // @track userIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' id='Instructor-Image' width='24' height='24' viewBox='0 0 24 24'%3E%3Crect id='Bounding_Box' data-name='Bounding Box' width='24' height='24' fill='none'/%3E%3Cg id='Instructor_Image' transform='translate(-5.432 -5.433)'%3E%3Cpath id='Path_10946' data-name='Path 10946' d='M35.365,36.137a3.64,3.64,0,1,0-3.64-3.64A3.644,3.644,0,0,0,35.365,36.137Z' transform='translate(-17.933 -15.976)' fill='%23fff'/%3E%3Cpath id='Path_10947' data-name='Path 10947' d='M8.951,25.95l.545.48,0,0a11.99,11.99,0,0,0,15.866,0l0,0,.545-.48-.018-.016a12,12,0,1,0-16.925,0ZM6.719,17.433a10.713,10.713,0,1,1,18.2,7.659,11.986,11.986,0,0,0-14.97,0A10.715,10.715,0,0,1,6.719,17.433Z' transform='translate(0 0)' fill='%23fff'/%3E%3C/g%3E%3C/svg%3E";
    @track likeIcon = myResource + "/DNAIcons/likeIcon.png";
    @track highInt = highSignal;
    @track mediumInt = mediumSignal;
    @track logInt = lowSignal;
    @track yogaWIP = yogaWIP;
    @track ExerciseImage = myImage;
    @track totalClassesOfWeeks = 0;
    @track exerciseTotalTime;
    @track showClassesOfWeek = true;
    @track ScheduleClass = [];
    @track data = [];
    @track instructors = [];
    @track instemp = [];
    @track ScheduleClassNew = [];
    @track Classes = [];
    @track ClassList = [];
    //pagination 
    @track paginationData = [];
    pageSize = 12;
    totalData;
    @track data2 = [];
    @track checkData = [];
    @track value = true;
    @track paginationShow = true;
    @track paginationFilteredData;
    totalFilteredData;
    durationClick = '';
    IntensityClick = '';
    timeClick = '';
    @track allSubEntityMap;
    @track VALID_USER = false;
    @track classViewType = true;
    @track userName;
    @wire(getUserProfileName)
    getUserProfile({ data, error }) {
        if (data) {
            console.log(data);
            this.userName = data.FirstName ?? '' + ' ' + data.LastName ?? '';
            console.log('profile name : ', data.Profile.Name);
            if (data.Profile.Name == 'Instructor') {
                this.VALID_USER = true;
            }
            else if (data.Profile.Name == 'Donor User') {
                this.VALID_USER = true;
            }
            else if (data.Profile.Name == 'Guest User' || data.Profile.Name == 'Member User') {
                console.log('Hello guest');
                this.VALID_USER = true;
            }
            else {
                this.VALID_USER = false;
            }
        }
        if (error) {
            console.log('error : ', error, JSON.stringify(error), error.message);
        }
    }
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            console.log('Stata>. ', currentPageReference.attributes.name);
            this.pageName = currentPageReference.attributes.name;
            if (this.pageName == 'guestUserBrowseClasses__c') {
                this.classViewType = false;
            }
        }
    }

    connectedCallback() {
        getAllEntitySubsMap()
            .then(result => {
                console.log('outside : ', JSON.stringify(result));
                //console.log('visible array : ',JSON.strClass_Status__cingify(this.visibleCardElementArray));
                if (result) {
                    this.allSubEntityMap = result;
                }
            })
        getAllInstructors()
            .then(result => {
                this.instemp = result;
                for (let i = 0; i < this.instemp.length; i++) {
                    const ins = {
                        Id: this.instemp[i].Id,
                        Name: this.instemp[i].Name
                    }
                    this.instructors.push(ins);
                }
            }).catch(error => {
                this.error = error;
                console.log('error ', this.error)
            });

        getClasses()
            .then(result => {
                for (let i = 0; i < result.length; i++) {
                    const cls = {
                        Id: result[i].Id,
                        Name: result[i].Name
                    }
                    this.Classes.push(cls);
                    this.ClassList.push(cls);
                }
            }).catch(error => {
                this.error = error;
                console.log('error ', this.error)
            });
        console.log('this.pageName>> ', this.pageName);
        if (this.pageName == 'guestUserBrowseClasses__c') {
            getAllLineItems()
                .then(result => {
                    console.log('resultt : ', result);
                    if (result) {
                        console.log('resultt2 : ', result);
                        var obj = {};
                        for (let i = 0; i < result.length; i++) {
                            var intensity;
                            // if(!result[i].hasOwnProperty('Schedule_Class__r')){
                            //     result.splice(i,1);
                            //      console.log('184 : ',result[i]);
                            //      console.log('184 : ',result.length);
                            //     // continue;
                            // }

                            // else{
                            if (result[i].Schedule_Class__r.Integrity__c == 'Low/Seated') {
                                intensity = this.logInt;
                            }
                            else if (result[i].Schedule_Class__r.Integrity__c == 'Medium') {
                                intensity = this.mediumInt;
                            }
                            else if (result[i].Schedule_Class__r.Integrity__c == 'High/Active') {
                                intensity = this.highInt;
                            }
                            // }

                            let AttendeeStatus = '', WatchTime = '0';
                            if (result[i].hasOwnProperty('Attendees_del__r')) {
                                AttendeeStatus = result[i].Attendees_del__r[0].Class_Status__c;
                                WatchTime = result[i].Attendees_del__r[0].BWPS_WatchedTimeStamp__c;
                            }
                            console.log('chek1');
                            let jDate = new Date(new Date(result[i].BWPS_ClassDate__c));
                            let j1Date = new Date();
                            jDate.setHours(0, 0, 0, 0);
                            let datestart = new Date();
                            datestart.setHours(0, 0, 0, 0);
                            let todayms = j1Date.getTime() - datestart.getTime();
                            j1Date.setHours(0, 0, 0, 0);
                            let btnClass = '';
                            let btnLabel = 'START';
                            let isOver = false;
                            console.log('j1Date : ', j1Date);
                            console.log('check : ', j1Date === jDate);
                            if (j1Date - jDate == 0) {
                                let updatedLineItemStartTime = Number(result[i].BWPS_StartTime__c) - 900000;
                                let updatedLineItemEndTime = Number(result[i].BWPS_EndTime__c) + 900000;
                                //cur['disabledClass'] = 'statusClass unDisabledClass';
                                if (todayms >= updatedLineItemStartTime && todayms <= updatedLineItemEndTime) {
                                    btnClass = 'buttonContainer';
                                }
                                else {
                                    if (result[i].BWPS_Vimeo_video_Id__c != null && result[i].BWPS_Vimeo_video_Id__c != undefined && result[i].BWPS_Vimeo_video_Id__c != '') {
                                        btnClass = 'buttonContainer';
                                        if (AttendeeStatus == 'RESUME') {
                                            btnLabel = 'RESUME';
                                        }
                                        else if (AttendeeStatus == 'COMPLETED') {
                                            btnLabel = 'COMPLETED';
                                        }
                                        else {
                                            btnLabel = 'PLAY ON-DEMAND';
                                        }
                                        isOver = true;
                                    } else {
                                        btnLabel = (todayms >= updatedLineItemEndTime) ? 'OVER' : 'START';
                                        btnClass = 'buttonContainer btnDisabled';

                                    }
                                }
                            } else {
                                if (result[i].BWPS_Vimeo_video_Id__c != null && result[i].BWPS_Vimeo_video_Id__c != undefined && result[i].BWPS_Vimeo_video_Id__c != '') {
                                    btnClass = 'buttonContainer';
                                    if (AttendeeStatus == 'RESUME') {
                                        btnLabel = 'RESUME';
                                    }
                                    else if (AttendeeStatus == 'COMPLETED') {
                                        btnLabel = 'COMPLETED';
                                    }
                                    else {
                                        btnLabel = 'PLAY ON-DEMAND';
                                    }
                                    isOver = true;
                                } else {
                                    // btnLabel = (todayms >= updatedLineItemEndTime)?'OVER':'START';
                                    // btnClass = 'box-orange btnDisabled';
                                    btnLabel = (j1Date < jDate) ? 'START' : 'OVER';
                                    isOver = btnLabel == 'OVER' ? true : false;
                                    btnClass = 'buttonContainer btnDisabled';
                                }
                                // if(result[i].BWPS_Vimeo_video_Id__c != null && result[i].BWPS_Vimeo_video_Id__c != undefined && result[i].BWPS_Vimeo_video_Id__c != '' ){
                                //     btnClass  = 'box-orange';
                                //     btnLabel = 'PLAY ON-DEMAND';
                                //     isOver = true;
                                // } else {
                                // btnLabel = (j1Date < jDate)?'JOIN':'OVER';
                                // isOver = btnLabel == 'OVER'?true:false;
                                // btnClass = 'box-orange btnDisabled';
                                // }
                            }
                            console.log('check2 button complete');
                            let fav = this.allSubEntityMap.hasOwnProperty(result[i].Id);
                            let classimg ; 
                             if(result[i].Schedule_Class__r.Header_Img_URL__c != null && result[i].Schedule_Class__r.Header_Img_URL__c != undefined && result[i].Schedule_Class__r.Header_Img_URL__c != '' ){
                                 console.log('inside if URL');
                               classimg = result[i].Schedule_Class__r.Header_Img_URL__c;
                                }
                                else{
                                    classimg = this.Classimage;
                                     console.log('inside else URL');
                                }
                                console.log('picture ', JSON.stringify(classimg));
                            obj = {
                                "BWPS_Date__c": result[i].BWPS_ClassDate__c,
                                "BWPS_EndTime__c": result[i].BWPS_EndTime__c,
                                "BWPS_StartTime__c": result[i].BWPS_StartTime__c,
                                "BWPS_instructor__c": result[i].Schedule_Class__r.BWPS_instructor__c,
                                "Schedule_Type__c": result[i].Schedule_Class__r.Schedule_Type__c,
                                "BWPS_Description__c": result[i].Schedule_Class__r.BWPS_Description__c,
                                "classFavStatus": fav,
                                "Name": result[i].Name,
                                "Integrity__c": result[i].Schedule_Class__r.Integrity__c,
                                "integrityLogo": intensity,
                                "Id": result[i].Id,
                                "Photo":classimg,
                                "btnLabel": btnLabel,
                                "btnClass": btnClass,
                                "userName": this.userName,
                                "vimeoId": result[i].BWPS_Vimeo_video_Id__c,
                                "meetingId": result[i].LectureId__c,
                                "VideoDuration": result[i].Video_Duration__c,
                                "WatchTime": WatchTime,
                                "AttendeeStatus": AttendeeStatus,
                                "Class__c": result[i].Schedule_Class__r.Class__c,
                                "BWPS_instructor__r": {
                                    "Id": result[i].Schedule_Class__r.BWPS_instructor__r.Id,
                                    "Name": result[i].Schedule_Class__r.BWPS_instructor__r.Name,
                                    "npe01__WorkEmail__c": result[i].Schedule_Class__r.BWPS_instructor__r.npe01__WorkEmail__c,
                                },
                                "Class__r": {
                                    "Id": result[i].Schedule_Class__r.Class__r.Id,
                                    "Name": result[i].Schedule_Class__r.Class__r.Name,
                                }
                            }
                            console.log('object button complete');
                            this.data.push(obj);

                        }
                        this.ScheduleClass = this.data;
                        this.ScheduleClassNew = this.data;
                        console.log('filterclassid ', this.filterclassid);
                        console.log('this.fiterintensity ', this.fiterintensity);
                        if (this.filterclassid != '' && this.filterclassid != undefined) {
                            this.clsVal = this.filterclassid;
                            console.log('this.filterclassid ', this.filterclassid);
                            console.log('clsVal ', this.clsVal);
                            this.GetClassesFromClass(this.clsVal);
                        }
                        else if (this.fiterintensity != '' && this.fiterintensity != undefined && (this.fiterintensity == 'low' || this.fiterintensity == 'medium' || this.fiterintensity == 'high')) {
                            console.log('intensitydfjfdng  ', this.fiterintensity);
                            // this.FilterApplied();
                            this.IntensityFilterURL(this.fiterintensity);
                        }
                        else {
                            console.log('allData page', JSON.stringify(this.ScheduleClass), this.ScheduleClass.length);
                            this.totalData = this.ScheduleClass.length;
                            this.paginationData = this.ScheduleClass.slice(0, this.pageSize);
                            if (this.totalData <= this.pageSize) {
                                this.paginationShow = false;
                            }
                            else {
                                this.paginationShow = true;
                            }
                        }
                    }
                })
                .catch(error => {
                    console.log('error 1212: ', JSON.stringify(error), error.message);
                })
        }
        else {
            getScheduleClassRecords()
                .then(result => {
                    var obj = {};
                    for (let i = 0; i < result.length; i++) {
                        var intensity;
                        if (result[i].Integrity__c == 'Low/Seated') {
                            intensity = this.logInt;
                        }
                        else if (result[i].Integrity__c == 'Medium') {
                            intensity = this.mediumInt;
                        }
                        else if (result[i].Integrity__c == 'High/Active') {
                            intensity = this.highInt;
                        }
                        let btnClass = 'buttonContainer';
                        let btnLabel = 'START';
                        let classimg ; 
                             if(result[i].Header_Img_URL__c != null && result[i].Header_Img_URL__c != undefined && result[i].Header_Img_URL__c != '' ){
                                 console.log('inside if URL');
                               classimg = result[i].Header_Img_URL__c;
                                }
                                else{
                                    classimg = this.Classimage;
                                     console.log('inside else URL');
                                }
                                console.log('picture ', JSON.stringify(classimg));
                        let fav = this.allSubEntityMap.hasOwnProperty(result[i].Id);
                        obj = {
                            "BWPS_Date__c": result[i].BWPS_Date__c,
                            "BWPS_EndTime__c": result[i].BWPS_EndTime__c,
                            "BWPS_StartTime__c": result[i].BWPS_StartTime__c,
                            "BWPS_instructor__c": result[i].BWPS_instructor__c,
                            "Schedule_Type__c": result[i].Schedule_Type__c,
                            "BWPS_Description__c": result[i].BWPS_Description__c,
                            "classFavStatus": fav,
                            "btnLabel": btnLabel,
                            "btnClass": btnClass,
                             "Photo":classimg,
                            "Name": result[i].Name,
                            "Integrity__c": result[i].Integrity__c,
                            "integrityLogo": intensity,
                            "Id": result[i].Id,
                            "Class__c": result[i].Class__c,
                            "BWPS_instructor__r": {
                                "Id": result[i].BWPS_instructor__r.Id,
                                "Name": result[i].BWPS_instructor__r.Name,
                                "npe01__WorkEmail__c": result[i].BWPS_instructor__r.npe01__WorkEmail__c,
                            },
                            "Class__r": {
                                "Id": result[i].Class__r.Id,
                                "Name": result[i].Class__r.Name,
                            }
                        }
                        this.data.push(obj);

                    }

                    this.ScheduleClass = this.data;
                    this.ScheduleClassNew = this.data;
                    console.log('filterclassid ', this.filterclassid);
                    console.log('this.fiterintensity ', this.fiterintensity);
                    if (this.filterclassid != '' && this.filterclassid != undefined) {
                        this.clsVal = this.filterclassid;
                        console.log('this.filterclassid ', this.filterclassid);
                        console.log('clsVal ', this.clsVal);
                        this.GetClassesFromClass(this.clsVal);
                    }
                    else if (this.fiterintensity != '' && this.fiterintensity != undefined && (this.fiterintensity == 'low' || this.fiterintensity == 'medium' || this.fiterintensity == 'high')) {
                        console.log('intensitydfjfdng  ', this.fiterintensity);
                        // this.FilterApplied();
                        this.IntensityFilterURL(this.fiterintensity);
                    }
                    else {
                        console.log('allData page', this.ScheduleClass);
                        this.totalData = this.ScheduleClass.length;
                        this.paginationData = this.ScheduleClass.slice(0, this.pageSize);
                        if (this.totalData <= this.pageSize) {
                            this.paginationShow = false;
                        }
                        else {
                            this.paginationShow = true;
                        }
                    }

                }).catch(error => {
                    this.error = error;
                    console.log('error', JSON.stringify(error));
                });
        }
    }


    trueparent(evt) {
        var getvalue = evt.detail;
        this.InstDetailView = false;
        console.log('getvalue ', getvalue);
    }


    TimeFilter(evt) {
        this.timeClick = evt.currentTarget.dataset.time;
        if (this.timeClick == 'mrng') {
            this.template.querySelector(`[data-time="mrng"]`).className = 'filter-btn filter-btn-active';
            this.template.querySelector(`[data-time='aftn']`).className = 'filter-btn';
            this.template.querySelector(`[data-time='eve']`).className = 'filter-btn';
            this.toggleFilter(this.IntensityClick, this.durationClick, this.timeClick);
            // let arrFlt = [];
            // let i;
            // for (i = 0; i < this.ScheduleClassNew.length; i++) {
            //     var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
            //     var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
            //     var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
            //     var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
            //     if (hoursFinal <= '12') {
            //         arrFlt.push(this.ScheduleClassNew[i]);
            //     }
            // }
            // console.log('hoursFinal ' + arrFlt.length);
            // this.ScheduleClass = arrFlt;
            // this.totalData = this.ScheduleClass.length;
            // console.log(' this.totalData ', this.totalData);
            // this.paginationData = this.ScheduleClass.slice(0, this.pageSize);
        } else if (this.timeClick == 'aftn') {
            this.template.querySelector(`[data-time='mrng']`).className = 'filter-btn ';
            this.template.querySelector(`[data-time='aftn']`).className = 'filter-btn filter-btn-active';
            this.template.querySelector(`[data-time='eve']`).className = 'filter-btn';
            this.toggleFilter(this.IntensityClick, this.durationClick, this.timeClick);
            // let arrFlt = [];
            // let i;
            // for (i = 0; i < this.ScheduleClassNew.length; i++) {
            //     var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
            //     var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
            //     var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
            //     var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
            //     if (hoursFinal <= '16' && hoursFinal > '12') {
            //         arrFlt.push(this.ScheduleClassNew[i]);
            //     }
            // }
            // console.log('hoursFinal ' + arrFlt.length);
            // this.ScheduleClass = arrFlt;
            // this.totalData = this.ScheduleClass.length;
            // console.log(' this.totalData ', this.totalData);
            // this.paginationData = this.ScheduleClass.slice(0, this.pageSize);
        }
        else if (this.timeClick == 'eve') {
            this.template.querySelector(`[data-time='mrng']`).className = 'filter-btn';
            this.template.querySelector(`[data-time='aftn']`).className = 'filter-btn';
            this.template.querySelector(`[data-time='eve']`).className = 'filter-btn filter-btn-active';
            this.toggleFilter(this.IntensityClick, this.durationClick, this.timeClick);
            // let arrFlt = [];
            // let i;
            // for (i = 0; i < this.ScheduleClassNew.length; i++) {
            //     var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
            //     var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
            //     var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
            //     var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
            //     if (hoursFinal <= '24' && hoursFinal > '16') {
            //         arrFlt.push(this.ScheduleClassNew[i]);
            //     }
            // }
            // console.log('hoursFinal ' + arrFlt.length);
            // this.ScheduleClass = arrFlt;
            // this.totalData = this.ScheduleClass.length;
            // console.log(' this.totalData ', this.totalData);
            // this.paginationData = this.ScheduleClass.slice(0, this.pageSize);
        }
    }

    DurationFilter(event) {
        this.durationClick = event.currentTarget.dataset.duration;
        if (this.durationClick == 'quarterly') {
            this.template.querySelector(`[data-duration='quarterly']`).className = 'filter-btn filter-btn-active';
            this.template.querySelector(`[data-duration='halfhour']`).className = 'filter-btn';
            this.template.querySelector(`[data-duration='fullhour']`).className = 'filter-btn';
            this.toggleFilter(this.IntensityClick, this.durationClick, this.timeClick);
            // let arrFlt = [];
            // let i;
            // for (i = 0; i < this.ScheduleClassNew.length; i++) {
            //     var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
            //     var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
            //     var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
            //     var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
            //     if (minutesfinal <= '15') {
            //         arrFlt.push(this.ScheduleClassNew[i]);
            //     }
            // }
            // this.ScheduleClass = arrFlt;
            // this.totalData = this.ScheduleClass.length;
            // console.log(' this.totalData ', this.totalData);
            // this.paginationData = this.ScheduleClass.slice(0, this.pageSize);
        }
        else if (this.durationClick == 'halfhour') {
            this.template.querySelector(`[data-duration='quarterly']`).className = 'filter-btn';
            this.template.querySelector(`[data-duration='halfhour']`).className = 'filter-btn filter-btn-active';
            this.template.querySelector(`[data-duration='fullhour']`).className = 'filter-btn';
            this.toggleFilter(this.IntensityClick, this.durationClick, this.timeClick);
            // let arrFlt = [];
            // let i;
            // for (i = 0; i < this.ScheduleClassNew.length; i++) {
            //     var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
            //     var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
            //     var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
            //     var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
            //     if (minutesfinal > '15' && minutesfinal <= '30') {
            //         arrFlt.push(this.ScheduleClassNew[i]);
            //     }
            // }
            // this.ScheduleClass = arrFlt;
            // this.totalData = this.ScheduleClass.length;
            // console.log(' this.totalData ', this.totalData);
            // this.paginationData = this.ScheduleClass.slice(0, this.pageSize);
        }
        else if (this.durationClick == 'fullhour') {
            this.template.querySelector(`[data-duration='quarterly']`).className = 'filter-btn';
            this.template.querySelector(`[data-duration='halfhour']`).className = 'filter-btn';
            this.template.querySelector(`[data-duration='fullhour']`).className = 'filter-btn filter-btn-active';
            this.toggleFilter(this.IntensityClick, this.durationClick, this.timeClick);
            // let arrFlt = [];
            // let i;
            // for (i = 0; i < this.ScheduleClassNew.length; i++) {
            //     var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
            //     var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
            //     var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
            //     var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
            //     if (minutesfinal >= '31') {
            //         arrFlt.push(this.ScheduleClassNew[i]);
            //     }
            // }
            // this.ScheduleClass = arrFlt;
            // this.totalData = this.ScheduleClass.length;
            // console.log(' this.totalData ', this.totalData);
            // this.paginationData = this.ScheduleClass.slice(0, this.pageSize);
        }
    }
    IntensityFilterURL(IntURI) {
        //this.IntensityClick = event.currentTarget.dataset.intensity;
        console.log('IntURI ', IntURI);
        if (IntURI == 'low') {
            //this.template.querySelector(`[data-intensity='low']`).className = 'filter-btn filter-btn-active';
            //this.template.querySelector(`[data-intensity='medium']`).className = 'filter-btn';
            //this.template.querySelector(`[data-intensity='high']`).className = 'filter-btn';
            console.log('before call filter method');
            this.toggleFilter(IntURI, this.durationClick, this.timeClick);
            console.log('After call filter method');
            console.log('before apply background color');
            setTimeout(() => {
                this.template.querySelector(`[data-intensity='low']`).classList.add('filter-btn-active');
            }, 0);
            //this.template.querySelector(`[data-id='low']`).style = "background-color: white";
            console.log('after apply background color');
        }
        else if (IntURI == 'medium') {
            //this.template.querySelector(`[data-intensity='low']`).className = 'filter-btn';
            //this.template.querySelector(`[data-intensity='medium']`).className = 'filter-btn filter-btn-active';
            //this.template.querySelector(`[data-intensity='high']`).className = 'filter-btn';
            console.log('before call filter method');
            this.toggleFilter(IntURI, this.durationClick, this.timeClick);
            console.log('After call filter method');
            console.log('before apply background color');
            setTimeout(() => {
                this.template.querySelector(`[data-intensity='medium']`).classList.add('filter-btn-active');
            }, 0);
            //this.template.querySelector(`[data-id='medium']`).style = "background-color: white";
            console.log('after apply background color');
        }
        else if (IntURI == 'high') {
            //this.template.querySelector(`[data-intensity='low']`).className = 'filter-btn';
            //this.template.querySelector(`[data-intensity='medium']`).className = 'filter-btn';
            //this.template.querySelector(`[data-intensity='high']`).className = 'filter-btn filter-btn-active';
            console.log('before call filter method');
            this.toggleFilter(IntURI, this.durationClick, this.timeClick);
            console.log('After call filter method');
            console.log('before apply background color');
            console.log(JSON.stringify(this.template.querySelector(`[data-id='high']`)));
            setTimeout(() => {
                console.log(JSON.stringify(this.template.querySelector(`[data-id='high']`)));
                this.template.querySelector(`[data-intensity='high']`).classList.add('filter-btn-active');
            }, 0);

            console.log('after apply background color');
        }
    }

    IntensityFilter(event) {
        this.IntensityClick = event.currentTarget.dataset.intensity;
        console.log('IntensityClick ', this.IntensityClick);
        if (this.IntensityClick == 'low') {
            this.template.querySelector(`[data-intensity='low']`).className = 'filter-btn filter-btn-active';
            this.template.querySelector(`[data-intensity='medium']`).className = 'filter-btn';
            this.template.querySelector(`[data-intensity='high']`).className = 'filter-btn';
            this.toggleFilter(this.IntensityClick, this.durationClick, this.timeClick);
        }
        else if (this.IntensityClick == 'medium') {
            this.template.querySelector(`[data-intensity='low']`).className = 'filter-btn';
            this.template.querySelector(`[data-intensity='medium']`).className = 'filter-btn filter-btn-active';
            this.template.querySelector(`[data-intensity='high']`).className = 'filter-btn';
            this.toggleFilter(this.IntensityClick, this.durationClick, this.timeClick);
        }
        else if (this.IntensityClick == 'high') {
            this.template.querySelector(`[data-intensity='low']`).className = 'filter-btn';
            this.template.querySelector(`[data-intensity='medium']`).className = 'filter-btn';
            this.template.querySelector(`[data-intensity='high']`).className = 'filter-btn filter-btn-active';
            this.toggleFilter(this.IntensityClick, this.durationClick, this.timeClick);
        }
    }

    GetClassesFromInstructor(evt) {
        var val = this.template.querySelector('[data-id="insSelect"]').value;
        let arrIns = [];
        console.log('val ', val);
        let i;
        console.log('this.ScheduleClass.length ', this.ScheduleClassNew.length);
        for (i = 0; i < this.ScheduleClassNew.length; i++) {
            console.log('this.ScheduleClass[i].BWPS_instructor__r.Id ', this.ScheduleClassNew[i].BWPS_instructor__c);
            if (this.ScheduleClassNew[i].BWPS_instructor__c == val) {
                arrIns.push(this.ScheduleClassNew[i]);
                console.log(arrIns);
            }
            console.log(this.ScheduleClassNew.length);
        }
        this.ScheduleClass = arrIns;
        this.totalData = this.ScheduleClass.length;
        console.log(' this.totalData ', this.totalData);
        this.paginationData = this.ScheduleClass.slice(0, this.pageSize);
        if (this.totalData <= this.pageSize) {
            this.paginationShow = false;
        }
        else {
            this.paginationShow = true;
        }
    }
    GetClassesFromClass(clsId) {
        this.FilterApplied();
        console.log('clsId curr ref', clsId);
        let arrcls = [];
        let i;
        for (i = 0; i < this.ScheduleClassNew.length; i++) {
            if (this.ScheduleClassNew[i].Class__c == clsId) {
                console.log('this.ScheduleClassNew[i].Class__c ', this.ScheduleClassNew[i].Class__c);
                arrcls.push(this.ScheduleClassNew[i]);
                console.log(arrcls);
            }
            console.log(this.ScheduleClassNew.length);
        }
        this.ScheduleClass = arrcls;
        this.totalData = this.ScheduleClass.length;
        console.log(' this.totalData ', this.totalData);
        this.paginationData = this.ScheduleClass.slice(0, this.pageSize);
        if (this.totalData <= this.pageSize) {
            this.paginationShow = false;
        }
        else {
            this.paginationShow = true;
        }
        setTimeout(() => { this.template.querySelector('[data-id="clsSelect"]').value = clsId; }, 200);
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    buttonSearch() {
        //this.clearFilteralt();
        var val = this.template.querySelector('[data-inpsearch="inpsrch"]').value.trim();
        this.inpsrch = val;
        //this.paginationData = [];
        this.ScheduleClass = [];
        console.log(' this.inpsrch imparitive ', this.inpsrch);
        //let SerLower = ser.toLowerCase();
        //console.log('SerLower ',SerLower);
        //var val = this.capitalizeFirstLetter(SerLower);
        var valLower = val.toLowerCase();
        console.log('val ', valLower);
        let arrint = [];
        let i;
        for (i = 0; i < this.ScheduleClassNew.length; i++) {
            //if (this.ScheduleClassNew[i].BWPS_instructor__r.hasOwnProperty('npe01__WorkEmail__c')) {
            var InsName = this.ScheduleClassNew[i].BWPS_instructor__r.Name.toLowerCase();
            var ClassName = this.ScheduleClassNew[i].Name.toLowerCase();
            var InsInstensity = this.ScheduleClassNew[i].Integrity__c ?? '';
            if (InsInstensity != '' && InsInstensity != null && InsInstensity != undefined) {
                InsInstensity = InsInstensity.toLowerCase();
            }

            //var InsInstensity = this.ScheduleClassNew[i].Integrity__c.toLowerCase();
            //console.log('InsInstensity ',InsInstensity);
            //console.log('InsName ',InsName);
            //console.log('InsName.includes(valLower) ',InsName.includes(valLower));
            //console.log('InsInstensity.includes(valLower) ',InsInstensity.includes(valLower));
            if (InsName.includes(valLower) || InsInstensity.includes(valLower) || ClassName.includes(valLower)) {
                //console.log('iffffff');
                //console.log('arr first ',arrint); 
                this.ScheduleClass.push(this.ScheduleClassNew[i]);
                //console.log('arr last ',arrint); 
            }
            // }
        }
        console.log('sddfg ', arrint);
        //this.ScheduleClass = arrint;
        this.totalData = this.ScheduleClass.length;
        this.template.querySelector('[data-inpsearch="inpsrch"]').value = val;
        console.log(' this.totalData ', this.totalData);
        this.paginationData = this.ScheduleClass.slice(0, this.pageSize);
        if (this.totalData <= this.pageSize) {
            this.paginationShow = false;
        }
        else {
            this.paginationShow = true;
        }

    }
    handlePaginationAllData(event) {
        const start = (event.detail - 1) * this.pageSize;
        const end = this.pageSize * event.detail;
        console.log(start, end);
        //this.accounts = this.allaccounts.slice(start, end);
        this.paginationData = this.ScheduleClass.slice(start, end);

    }
    handlePaginationFilteredData(event) {
        const start = (event.detail - 1) * this.pageSize;
        const end = this.pageSize * event.detail;
        console.log(start, end);
        //this.accounts = this.allaccounts.slice(start, end);
        this.paginationFilteredData = this.checkData.slice(start, end);

    }
    FilterApplied() {
        if (this.FilterSearch == true) {
            this.FilterSearch = false;
        }
        else if (this.FilterSearch == false) {
            this.FilterSearch = true;
        }
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

    updateCurrentVideoUrlHandler(videoId, scliId, watchTime) {
        let message = {
            videoId: videoId,
            iframeStatus: 'Vimeo',
            scliId: scliId,
            watchTime: watchTime
        };
        publish(this.context, IFRAMEMC, message);
        //this.currentVideoUrl = "https://player.vimeo.com/video/"+videoId+"&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479";
        //this.currentVideoUrl = "https://player.vimeo.com/video/762784047?h=315f56a57e";
    }

    scheduleClassDetailViewHandle(event) {
        console.log('calling : ');
        this.selectedClass = this.paginationData.find(e => e.Id == event.target.dataset.key);
        console.log('selectedClass : ', JSON.stringify(this.selectedClass));
        if (this.pageName == 'guestUserBrowseClasses__c') {
            console.log('in iffff : ');
            if (event.currentTarget.dataset.btnstatus == 'name') {
                let instname = event.currentTarget.dataset.name;
                let schcname = event.currentTarget.dataset.schname;
                let schdescp = event.currentTarget.dataset.descp;
                let Intensity = event.currentTarget.dataset.ints;
                this.InstDetailView = true;
                this.scheduleClassName = schcname;
                this.scheduleClassInstName = instname;
                this.scheduelClassDescription = schdescp;
                this.scheduleclassintensity = Intensity;
                console.log('classData>>> ', JSON.stringify(this.selectedClass));
                console.log('this.scheduleClassName----', this.scheduleClassName);
                console.log('this.scheduleClassInstName------', this.scheduleClassInstName);
                console.log('this.scheduelClassDescription-----', this.scheduelClassDescription);
                console.log('this.scheduleclassintensity-----', this.scheduleclassintensity);
                console.log('InstDetailView', this.InstDetailView);
            }
            else if (event.currentTarget.dataset.btnstatus == 'btn') {
                let meetingId = this.selectedClass.meetingId;
                let videoId = this.selectedClass.vimeoId;
                let name = this.selectedClass.userName;
                let scliId = this.selectedClass.Id;
                let watchTime = this.selectedClass.WatchTime;
                if (this.selectedClass.btnLabel == 'PLAY ON-DEMAND' || this.selectedClass.btnLabel == 'RESUME' || this.selectedClass.btnLabel == 'COMPLETED') {
                    //Vimeo Iframe
                    console.log('Opening Video');
                    this.updateCurrentVideoUrlHandler(videoId, scliId, watchTime);
                }
                else if (this.selectedClass.btnLabel == 'START' || this.selectedClass.btnLabel == 'JOIN') {
                    //Zoom Iframe
                    this.sendZoomData2(meetingId, name);
                }
            }

        }
        else {
            console.log('event.target.dataset----', event.target.dataset);
            let instname = event.currentTarget.dataset.name;
            let schcname = event.currentTarget.dataset.schname;
            let schdescp = event.currentTarget.dataset.descp;
            let Intensity = event.currentTarget.dataset.ints;
            this.InstDetailView = true;
            this.scheduleClassName = schcname;
            this.scheduleClassInstName = instname;
            this.scheduelClassDescription = schdescp;
            this.scheduleclassintensity = Intensity;
            console.log('classData>>> ', JSON.stringify(this.selectedClass));
            console.log('this.scheduleClassName----', this.scheduleClassName);
            console.log('this.scheduleClassInstName------', this.scheduleClassInstName);
            console.log('this.scheduelClassDescription-----', this.scheduelClassDescription);
            console.log('this.scheduleclassintensity-----', this.scheduleclassintensity);
            console.log('InstDetailView', this.InstDetailView);
        }
    }
    FilterClasses(evt) {
        this.clearFilteralt();
        var clsval = this.template.querySelector(`[data-id="clsSelect"]`);
        var clsvalue = clsval.value;
        var insval = this.template.querySelector('[data-id="insSelect"]');
        var insvalue = insval.value;;
        if (clsvalue != 'none' && insvalue != 'none') {
            let arrClsandIns = [];
            let i;
            for (i = 0; i < this.ScheduleClassNew.length; i++) {
                if (this.ScheduleClassNew[i].BWPS_instructor__c == insvalue && this.ScheduleClassNew[i].Class__c == clsvalue) {
                    arrClsandIns.push(this.ScheduleClassNew[i]);
                }
                console.log(this.ScheduleClassNew.length);
            }
            this.ScheduleClass = arrClsandIns;
            this.totalData = this.ScheduleClass.length;
            console.log(' this.totalData ', this.totalData);
            this.paginationData = this.ScheduleClass.slice(0, this.pageSize);
            if (this.totalData <= this.pageSize) {
                this.paginationShow = false;
            }
            else {
                this.paginationShow = true;
            }
        }
        else if (insvalue != 'none') {
            let arrIns = [];
            let i;
            for (i = 0; i < this.ScheduleClassNew.length; i++) {
                if (this.ScheduleClassNew[i].BWPS_instructor__c == insvalue) {
                    arrIns.push(this.ScheduleClassNew[i]);
                }
            }
            this.ScheduleClass = arrIns;
            this.totalData = this.ScheduleClass.length;
            console.log(' this.totalData ', this.totalData);
            this.paginationData = this.ScheduleClass.slice(0, this.pageSize);
            if (this.totalData <= this.pageSize) {
                this.paginationShow = false;
            }
            else {
                this.paginationShow = true;
            }
        }
        else if (clsvalue != 'none') {
            let arrcls = [];
            let i;
            for (i = 0; i < this.ScheduleClassNew.length; i++) {
                if (this.ScheduleClassNew[i].Class__c == clsvalue) {
                    arrcls.push(this.ScheduleClassNew[i]);
                }
            }
            this.ScheduleClass = arrcls;
            this.totalData = this.ScheduleClass.length;
            console.log(' this.totalData ', this.totalData);
            this.paginationData = this.ScheduleClass.slice(0, this.pageSize);
            if (this.totalData <= this.pageSize) {
                this.paginationShow = false;
            }
            else {
                this.paginationShow = true;
            }
        }

    }
    toggleFilter(intens, durtn, timedays) {
        setTimeout(() => { this.template.querySelector('[data-id="clsSelect"]').value = 'none'; }, 200);
        setTimeout(() => { this.template.querySelector('[data-id="insSelect"]').value = 'none'; }, 200);
        console.log('intens ', intens);
        console.log('durtn ', durtn);
        console.log('timedays ', timedays);
        let arrFltquaterlylow = [];
        let arrFltquaterlymedium = [];
        let arrFltquaterlyhigh = [];
        let arrFlthalflow = [];
        let arrFlthalfmedium = [];
        let arrFlthalfhigh = [];
        let arrFlfullflow = [];
        let arrFltfullmedium = [];
        let arrFltfullhigh = [];

        let arrFltquaterly = [];
        let arrFltfull = [];
        let arrFlthalf = [];
        let arrinthigh = [];
        let arrintmedium = [];
        let arrintlow = [];
        let arrFltTimeMrg = [];
        let arrFltTimeaft = [];
        let arrFltTimeeve = [];
        let arrFltTimeMrgLow = [];
        let arrFltTimeMrgMdm = [];
        let arrFltTimeMrghigh = [];
        let arrFltTimeAftLow = [];
        let arrFltTimeAftMdm = [];
        let arrFltTimeAftHigh = [];
        let arrFltTimeEveLow = [];
        let arrFltTimeEveMdm = [];
        let arrFltTimeEveHigh = [];
        let arrFltTimeMrgQut = [];
        let arrFltTimeMrgHalf = [];
        let arrFltTimeMrgFull = [];
        let arrFltTimeAftQut = [];
        let arrFltTimeAftHalf = [];
        let arrFltTimeAftFull = [];
        let arrFltTimeEveQut = [];
        let arrFltTimeEveHalf = [];
        let arrFltTimeEveFull = [];

        let arrFltMrgQutLow = [];
        let arrFltMrgQutMdm = [];
        let arrFltMrgQutHigh = [];
        let arrFltMrgHalfLow = [];
        let arrFltMrgHalfMdm = [];
        let arrFltMrgHalfHigh = [];
        let arrFltMrgFullLow = [];
        let arrFltMrgFullMdm = [];
        let arrFltMrgFullHigh = [];

        let arrFltAftQutLow = [];
        let arrFltAftQutMdm = [];
        let arrFltAftQutHigh = [];
        let arrFltAftHalfLow = [];
        let arrFltAftHalfMdm = [];
        let arrFltAftHalfHigh = [];
        let arrFltAftFullLow = [];
        let arrFltAftFullMdm = [];
        let arrFltAftFullHigh = [];

        let arrFltEveQutLow = [];
        let arrFltEveQutMdm = [];
        let arrFltEveQutHigh = [];
        let arrFltEveHalfLow = [];
        let arrFltEveHalfMdm = [];
        let arrFltEveHalfHigh = [];
        let arrFltEveFullLow = [];
        let arrFltEveFullMdm = [];
        let arrFltEveFullHigh = [];


        if (intens != '' && durtn != '' && timedays != '') {
            if (timedays == 'mrng' && durtn == 'quarterly' && intens == 'low') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '12' && minutesfinal <= '15' && this.ScheduleClassNew[i].Integrity__c == 'Low/Seated') {
                        arrFltMrgQutLow.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'mrng' && durtn == 'quarterly' && intens == 'medium') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '12' && minutesfinal <= '15' && this.ScheduleClassNew[i].Integrity__c == 'Medium') {
                        arrFltMrgQutMdm.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'mrng' && durtn == 'quarterly' && intens == 'high') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '12' && minutesfinal <= '15' && this.ScheduleClassNew[i].Integrity__c == 'High/Active') {
                        arrFltMrgQutHigh.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'mrng' && durtn == 'halfhour' && intens == 'low') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '12' && minutesfinal > '15' && minutesfinal <= '30' && this.ScheduleClassNew[i].Integrity__c == 'Low/Seated') {
                        arrFltMrgHalfLow.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'mrng' && durtn == 'halfhour' && intens == 'medium') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '12' && minutesfinal > '15' && minutesfinal <= '30' && this.ScheduleClassNew[i].Integrity__c == 'Medium') {
                        arrFltMrgHalfMdm.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'mrng' && durtn == 'halfhour' && intens == 'high') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '12' && minutesfinal > '15' && minutesfinal <= '30' && this.ScheduleClassNew[i].Integrity__c == 'High/Active') {
                        arrFltMrgHalfHigh.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'mrng' && durtn == 'fullhour' && intens == 'low') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '12' && minutesfinal >= '31' && this.ScheduleClassNew[i].Integrity__c == 'Low/Seated') {
                        arrFltMrgFullLow.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'mrng' && durtn == 'fullhour' && intens == 'medium') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '12' && minutesfinal >= '31' && this.ScheduleClassNew[i].Integrity__c == 'Medium') {
                        arrFltMrgFullMdm.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'mrng' && durtn == 'fullhour' && intens == 'high') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '12' && minutesfinal >= '31' && this.ScheduleClassNew[i].Integrity__c == 'High/Active') {
                        arrFltMrgFullHigh.push(this.ScheduleClassNew[i]);
                    }
                }
            }

            else if (timedays == 'aftn' && durtn == 'quarterly' && intens == 'low') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '16' && hoursFinal > '12' && minutesfinal <= '15' && this.ScheduleClassNew[i].Integrity__c == 'Low/Seated') {
                        arrFltAftQutLow.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'aftn' && durtn == 'quarterly' && intens == 'medium') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '16' && hoursFinal > '12' && minutesfinal <= '15' && this.ScheduleClassNew[i].Integrity__c == 'Medium') {
                        arrFltAftQutMdm.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'aftn' && durtn == 'quarterly' && intens == 'high') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '16' && hoursFinal > '12' && minutesfinal <= '15' && this.ScheduleClassNew[i].Integrity__c == 'High/Active') {
                        arrFltAftQutHigh.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'aftn' && durtn == 'halfhour' && intens == 'low') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '16' && hoursFinal > '12' && minutesfinal > '15' && minutesfinal <= '30' && this.ScheduleClassNew[i].Integrity__c == 'Low/Seated') {
                        arrFltAftHalfLow.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'aftn' && durtn == 'halfhour' && intens == 'medium') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '16' && hoursFinal > '12' && minutesfinal > '15' && minutesfinal <= '30' && this.ScheduleClassNew[i].Integrity__c == 'Medium') {
                        arrFltAftHalfMdm.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'aftn' && durtn == 'halfhour' && intens == 'high') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '16' && hoursFinal > '12' && minutesfinal > '15' && minutesfinal <= '30' && this.ScheduleClassNew[i].Integrity__c == 'High/Active') {
                        arrFltAftHalfHigh.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'aftn' && durtn == 'fullhour' && intens == 'low') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '16' && hoursFinal > '12' && minutesfinal >= '31' && this.ScheduleClassNew[i].Integrity__c == 'Low/Seated') {
                        arrFltAftFullLow.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'aftn' && durtn == 'fullhour' && intens == 'medium') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '16' && hoursFinal > '12' && minutesfinal >= '31' && this.ScheduleClassNew[i].Integrity__c == 'Medium') {
                        arrFltAftFullMdm.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'aftn' && durtn == 'fullhour' && intens == 'high') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '16' && hoursFinal > '12' && minutesfinal >= '31' && this.ScheduleClassNew[i].Integrity__c == 'High/Active') {
                        arrFltAftFullHigh.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'eve' && durtn == 'quarterly' && intens == 'low') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '24' && hoursFinal > '16' && minutesfinal <= '15' && this.ScheduleClassNew[i].Integrity__c == 'Low/Seated') {
                        arrFltEveQutLow.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'eve' && durtn == 'quarterly' && intens == 'medium') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '24' && hoursFinal > '16' && minutesfinal <= '15' && this.ScheduleClassNew[i].Integrity__c == 'Medium') {
                        arrFltEveQutMdm.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'eve' && durtn == 'quarterly' && intens == 'high') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '24' && hoursFinal > '16' && minutesfinal <= '15' && this.ScheduleClassNew[i].Integrity__c == 'High/Active') {
                        arrFltEveQutHigh.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'eve' && durtn == 'halfhour' && intens == 'low') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '24' && hoursFinal > '16' && minutesfinal > '15' && minutesfinal <= '30' && this.ScheduleClassNew[i].Integrity__c == 'Low/Seated') {
                        arrFltEveHalfLow.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'eve' && durtn == 'halfhour' && intens == 'medium') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '24' && hoursFinal > '16' && minutesfinal > '15' && minutesfinal <= '30' && this.ScheduleClassNew[i].Integrity__c == 'Medium') {
                        arrFltEveHalfMdm.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'eve' && durtn == 'halfhour' && intens == 'high') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '24' && hoursFinal > '16' && minutesfinal > '15' && minutesfinal <= '30' && this.ScheduleClassNew[i].Integrity__c == 'High/Active') {
                        arrFltEveHalfHigh.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'eve' && durtn == 'fullhour' && intens == 'low') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '24' && hoursFinal > '16' && minutesfinal >= '31' && this.ScheduleClassNew[i].Integrity__c == 'Low/Seated') {
                        arrFltEveFullLow.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'eve' && durtn == 'fullhour' && intens == 'medium') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '24' && hoursFinal > '16' && minutesfinal >= '31' && this.ScheduleClassNew[i].Integrity__c == 'Medium') {
                        arrFltEveFullMdm.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'eve' && durtn == 'fullhour' && intens == 'high') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '24' && hoursFinal > '16' && minutesfinal >= '31' && this.ScheduleClassNew[i].Integrity__c == 'High/Active') {
                        arrFltEveFullHigh.push(this.ScheduleClassNew[i]);
                    }
                }
            }
        }

        else if (intens != '' && durtn != '') {
            if (durtn == 'quarterly' && intens == 'low') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    console.log('full qua ', minutesfinal);
                    if (minutesfinal <= '15' && this.ScheduleClassNew[i].Integrity__c == 'Low/Seated') {
                        arrFltquaterlylow.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (durtn == 'quarterly' && intens == 'medium') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    console.log('full qua ', minutesfinal);
                    if (minutesfinal <= '15' && this.ScheduleClassNew[i].Integrity__c == 'Medium') {
                        arrFltquaterlymedium.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (durtn == 'quarterly' && intens == 'high') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    console.log('full qua ', minutesfinal);
                    if (minutesfinal <= '15' && this.ScheduleClassNew[i].Integrity__c == 'High/Active') {
                        arrFltquaterlyhigh.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (durtn == 'halfhour' && intens == 'low') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    console.log('full qua ', minutesfinal);
                    if (minutesfinal > '15' && minutesfinal <= '30' && this.ScheduleClassNew[i].Integrity__c == 'Low/Seated') {
                        arrFlthalflow.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (durtn == 'halfhour' && intens == 'medium') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    console.log('full qua ', minutesfinal);
                    if (minutesfinal > '15' && minutesfinal <= '30' && this.ScheduleClassNew[i].Integrity__c == 'Medium') {
                        arrFlthalfmedium.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (durtn == 'halfhour' && intens == 'high') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    console.log('full qua ', minutesfinal);
                    if (minutesfinal > '15' && minutesfinal <= '30' && this.ScheduleClassNew[i].Integrity__c == 'High/Active') {
                        arrFlthalfhigh.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (durtn == 'fullhour' && intens == 'low') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    console.log('full qua ', minutesfinal);
                    if (minutesfinal >= '31' && this.ScheduleClassNew[i].Integrity__c == 'Low/Seated') {
                        arrFlfullflow.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (durtn == 'fullhour' && intens == 'medium') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    console.log('full qua ', minutesfinal);
                    if (minutesfinal >= '31' && this.ScheduleClassNew[i].Integrity__c == 'Medium') {
                        arrFltfullmedium.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (durtn == 'fullhour' && intens == 'high') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    console.log('full qua ', minutesfinal);
                    if (minutesfinal >= '31' && this.ScheduleClassNew[i].Integrity__c == 'High/Active') {
                        arrFltfullhigh.push(this.ScheduleClassNew[i]);
                    }
                }
            }
        }
        else if (durtn != '' && timedays != '') {
            if (timedays == 'mrng' && durtn == 'quarterly') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '12' && minutesfinal <= '15') {
                        arrFltTimeMrgQut.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'mrng' && durtn == 'halfhour') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '12' && minutesfinal > '15' && minutesfinal <= '30') {
                        arrFltTimeMrgHalf.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'mrng' && durtn == 'fullhour') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '12' && minutesfinal >= '31') {
                        arrFltTimeMrgFull.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'aftn' && durtn == 'quarterly') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '16' && hoursFinal > '12' && minutesfinal <= '15') {
                        arrFltTimeAftQut.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'aftn' && durtn == 'halfhour') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '16' && hoursFinal > '12' && minutesfinal > '15' && minutesfinal <= '30') {
                        arrFltTimeAftHalf.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'aftn' && durtn == 'fullhour') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '16' && hoursFinal > '12' && minutesfinal >= '31') {
                        arrFltTimeAftFull.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'eve' && durtn == 'quarterly') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '24' && hoursFinal > '16' && minutesfinal <= '15') {
                        arrFltTimeEveQut.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'eve' && durtn == 'halfhour') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '24' && hoursFinal > '16' && minutesfinal > '15' && minutesfinal <= '30') {
                        arrFltTimeEveHalf.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'eve' && durtn == 'fullhour') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '24' && hoursFinal > '16' && minutesfinal >= '31') {
                        arrFltTimeEveFull.push(this.ScheduleClassNew[i]);
                    }
                }
            }
        }
        else if (intens != '' && timedays != '') {
            if (timedays == 'mrng' && intens == 'low') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '12' && this.ScheduleClassNew[i].Integrity__c == 'Low/Seated') {
                        arrFltTimeMrgLow.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'mrng' && intens == 'medium') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '12' && this.ScheduleClassNew[i].Integrity__c == 'Medium') {
                        arrFltTimeMrgMdm.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'mrng' && intens == 'high') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '12' && this.ScheduleClassNew[i].Integrity__c == 'High/Active') {
                        arrFltTimeMrghigh.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'aftn' && intens == 'low') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '16' && hoursFinal > '12' && this.ScheduleClassNew[i].Integrity__c == 'Low/Seated') {
                        arrFltTimeAftLow.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'aftn' && intens == 'medium') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '16' && hoursFinal > '12' && this.ScheduleClassNew[i].Integrity__c == 'Medium') {
                        arrFltTimeAftMdm.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'aftn' && intens == 'high') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '16' && hoursFinal > '12' && this.ScheduleClassNew[i].Integrity__c == 'High/Active') {
                        arrFltTimeAftHigh.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'eve' && intens == 'low') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '24' && hoursFinal > '16' && this.ScheduleClassNew[i].Integrity__c == 'Low/Seated') {
                        arrFltTimeEveLow.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'eve' && intens == 'medium') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '24' && hoursFinal > '16' && this.ScheduleClassNew[i].Integrity__c == 'Medium') {
                        arrFltTimeEveMdm.push(this.ScheduleClassNew[i]);
                    }
                }
            }
            else if (timedays == 'eve' && intens == 'high') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '24' && hoursFinal > '16' && this.ScheduleClassNew[i].Integrity__c == 'High/Active') {
                        arrFltTimeEveHigh.push(this.ScheduleClassNew[i]);
                    }
                }
            }
        }


        else if (durtn != '') {
            if (durtn == 'quarterly') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    console.log('full qua ', minutesfinal);
                    if (minutesfinal <= '15') {
                        arrFltquaterly.push(this.ScheduleClassNew[i]);
                    }
                }
            }

            else if (durtn == 'halfhour') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    console.log('half min ', minutesfinal);
                    if (minutesfinal > '15' && minutesfinal <= '30') {
                        arrFlthalf.push(this.ScheduleClassNew[i]);
                    }
                }

            }

            else if (durtn == 'fullhour') {
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = (this.ScheduleClassNew[i].BWPS_EndTime__c - this.ScheduleClassNew[i].BWPS_StartTime__c);
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    console.log('full min ', minutesfinal);
                    if (minutesfinal >= '31') {
                        arrFltfull.push(this.ScheduleClassNew[i]);
                    }
                }

            }
        }
        else if (intens != '') {

            if (intens == 'high') {
                console.log('intens high ', intens);
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    if (this.ScheduleClassNew[i].Integrity__c == 'High/Active') {
                        arrinthigh.push(this.ScheduleClassNew[i]);
                    }
                }
            }

            else if (intens == 'medium') {
                console.log('intens medium ', intens);
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    if (this.ScheduleClassNew[i].Integrity__c == 'Medium') {
                        arrintmedium.push(this.ScheduleClassNew[i]);
                    }
                }
            }

            else if (intens == 'low') {
                console.log('intens low ', intens);
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    if (this.ScheduleClassNew[i].Integrity__c == 'Low/Seated') {
                        arrintlow.push(this.ScheduleClassNew[i]);
                    }
                }
            }
        }
        else if (timedays != '') {

            if (timedays == 'mrng') {
                console.log('timedays mrng ', timedays);
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '12') {
                        arrFltTimeMrg.push(this.ScheduleClassNew[i]);
                    }
                }
            }

            else if (timedays == 'aftn') {
                console.log('timedays aftn ', timedays);
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '16' && hoursFinal > '12') {
                        arrFltTimeaft.push(this.ScheduleClassNew[i]);
                    }
                }
            }

            else if (timedays == 'eve') {
                console.log('timedays eve ', timedays);
                let i;
                for (i = 0; i < this.ScheduleClassNew.length; i++) {
                    var Time = this.ScheduleClassNew[i].BWPS_StartTime__c;
                    var hoursFinal = Math.floor(Time / (1000 * 60 * 60));
                    var divisor_for_minutesFinal = Time % (1000 * 60 * 60);
                    var minutesfinal = Math.floor(divisor_for_minutesFinal / (1000 * 60));
                    if (hoursFinal <= '24' && hoursFinal > '16') {
                        arrFltTimeeve.push(this.ScheduleClassNew[i]);
                    }
                }
            }
        }
        let arrintInts = [];

        if (timedays == 'mrng' && durtn == 'quarterly' && intens == 'low') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltMrgQutLow;
        }
        else if (timedays == 'mrng' && durtn == 'quarterly' && intens == 'medium') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltMrgQutMdm;
        }
        else if (timedays == 'mrng' && durtn == 'quarterly' && intens == 'high') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltMrgQutHigh;
        }
        else if (timedays == 'mrng' && durtn == 'halfhour' && intens == 'low') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltMrgHalfLow;
        }
        else if (timedays == 'mrng' && durtn == 'halfhour' && intens == 'medium') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltMrgHalfMdm;
        }
        else if (timedays == 'mrng' && durtn == 'halfhour' && intens == 'high') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltMrgHalfHigh;
        }
        else if (timedays == 'mrng' && durtn == 'fullhour' && intens == 'low') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltMrgFullLow;
        }
        else if (timedays == 'mrng' && durtn == 'fullhour' && intens == 'medium') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltMrgFullMdm;
        }
        else if (timedays == 'mrng' && durtn == 'fullhour' && intens == 'high') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltMrgFullHigh;
        }
        else if (timedays == 'aftn' && durtn == 'quarterly' && intens == 'low') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltAftQutLow;
        }
        else if (timedays == 'aftn' && durtn == 'quarterly' && intens == 'medium') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltAftQutMdm;
        }
        else if (timedays == 'aftn' && durtn == 'quarterly' && intens == 'high') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltAftQutHigh;
        }
        else if (timedays == 'aftn' && durtn == 'halfhour' && intens == 'low') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltAftHalfLow;
        }
        else if (timedays == 'aftn' && durtn == 'halfhour' && intens == 'medium') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltAftHalfMdm;
        }
        else if (timedays == 'aftn' && durtn == 'halfhour' && intens == 'high') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltAftHalfHigh;
        }
        else if (timedays == 'aftn' && durtn == 'fullhour' && intens == 'low') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltAftFullLow;
        }
        else if (timedays == 'aftn' && durtn == 'fullhour' && intens == 'medium') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltAftFullMdm;
        }
        else if (timedays == 'aftn' && durtn == 'fullhour' && intens == 'high') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltAftFullHigh;
        }
        else if (timedays == 'eve' && durtn == 'quarterly' && intens == 'low') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltEveQutLow;
        }
        else if (timedays == 'eve' && durtn == 'quarterly' && intens == 'medium') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltEveQutMdm;
        }
        else if (timedays == 'eve' && durtn == 'quarterly' && intens == 'high') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltEveQutHigh;
        }
        else if (timedays == 'eve' && durtn == 'halfhour' && intens == 'low') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltEveHalfLow;
        }
        else if (timedays == 'eve' && durtn == 'halfhour' && intens == 'medium') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltEveHalfMdm;
        }
        else if (timedays == 'eve' && durtn == 'halfhour' && intens == 'high') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltEveHalfHigh;
        }
        else if (timedays == 'eve' && durtn == 'fullhour' && intens == 'low') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltEveFullLow;
        }
        else if (timedays == 'eve' && durtn == 'fullhour' && intens == 'medium') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltEveFullMdm;
        }
        else if (timedays == 'eve' && durtn == 'fullhour' && intens == 'high') {
            console.log('mrg qua low 1 ', timedays);
            arrintInts = arrFltEveFullHigh;
        }
        else if (durtn == 'quarterly' && intens == 'low') {
            console.log('intens qua low 1 ', intens);
            arrintInts = arrFltquaterlylow;
        }
        else if (durtn == 'quarterly' && intens == 'medium') {
            console.log('intens qua med 1 ', intens);
            arrintInts = arrFltquaterlymedium;
        }
        else if (durtn == 'quarterly' && intens == 'high') {
            console.log('intens qua high 1 ', intens);
            arrintInts = arrFltquaterlyhigh;
        }
        else if (durtn == 'halfhour' && intens == 'low') {
            console.log('intens half low 1 ', intens);
            arrintInts = arrFlthalflow;
        }
        else if (durtn == 'halfhour' && intens == 'medium') {
            console.log('intens half med 1 ', intens);
            arrintInts = arrFlthalfmedium;
        }
        else if (durtn == 'halfhour' && intens == 'high') {
            console.log('intens half high 1 ', intens);
            arrintInts = arrFlthalfhigh;
        }
        else if (durtn == 'fullhour' && intens == 'low') {
            console.log('intens full low 1 ', intens);
            arrintInts = arrFlfullflow;
        }
        else if (durtn == 'fullhour' && intens == 'medium') {
            console.log('intens full med 1 ', intens);
            arrintInts = arrFltfullmedium;
        }
        else if (durtn == 'fullhour' && intens == 'high') {
            console.log('intens full high 1 ', intens);
            arrintInts = arrFltfullhigh;
        }
        else if (timedays == 'mrng' && intens == 'low') {
            console.log('timedays mrn low 1 ', intens);
            arrintInts = arrFltTimeMrgLow;
        }
        else if (timedays == 'mrng' && intens == 'medium') {
            console.log('timedays mrn med 1 ', intens);
            arrintInts = arrFltTimeMrgMdm;
        }
        else if (timedays == 'mrng' && intens == 'high') {
            console.log('timedays mrn high 1 ', intens);
            arrintInts = arrFltTimeMrghigh;
        }
        else if (timedays == 'aftn' && intens == 'low') {
            console.log('timedays aft low 1 ', intens);
            arrintInts = arrFltTimeAftLow;
        }
        else if (timedays == 'aftn' && intens == 'medium') {
            console.log('timedays aft med 1 ', intens);
            arrintInts = arrFltTimeAftMdm;
        }
        else if (timedays == 'aftn' && intens == 'high') {
            console.log('timedays aft high 1 ', intens);
            arrintInts = arrFltTimeAftHigh;
        }
        else if (timedays == 'eve' && intens == 'low') {
            console.log('timedays eve low 1 ', intens);
            arrintInts = arrFltTimeEveLow;
        }
        else if (timedays == 'eve' && intens == 'medium') {
            console.log('timedays eve med 1 ', intens);
            arrintInts = arrFltTimeEveMdm;
        }
        else if (timedays == 'eve' && intens == 'high') {
            console.log('timedays eve high 1 ', intens);
            arrintInts = arrFltTimeEveHigh;
        }
        else if (timedays == 'mrng' && durtn == 'quarterly') {
            console.log('timedays mrn qut 1 ', durtn);
            arrintInts = arrFltTimeMrgQut;
        }
        else if (timedays == 'mrng' && durtn == 'halfhour') {
            console.log('timedays mrn half 1 ', durtn);
            arrintInts = arrFltTimeMrgHalf;
        }
        else if (timedays == 'mrng' && durtn == 'fullhour') {
            console.log('timedays mrn full 1 ', durtn);
            arrintInts = arrFltTimeMrgFull;
        }
        else if (timedays == 'aftn' && durtn == 'quarterly') {
            console.log('timedays aft qut 1 ', durtn);
            arrintInts = arrFltTimeAftQut;
        }
        else if (timedays == 'aftn' && durtn == 'halfhour') {
            console.log('timedays aft hald 1 ', durtn);
            arrintInts = arrFltTimeAftHalf;
        }
        else if (timedays == 'aftn' && durtn == 'fullhour') {
            console.log('timedays aft full 1 ', durtn);
            arrintInts = arrFltTimeAftFull;
        }
        else if (timedays == 'eve' && durtn == 'quarterly') {
            console.log('timedays eve qut 1 ', durtn);
            arrintInts = arrFltTimeEveQut;
        }
        else if (timedays == 'eve' && durtn == 'halfhour') {
            console.log('timedays eve half 1 ', durtn);
            arrintInts = arrFltTimeEveHalf;
        }
        else if (timedays == 'eve' && durtn == 'fullhour') {
            console.log('timedays eve full 1 ', durtn);
            arrintInts = arrFltTimeEveFull;
        }
        else if (durtn == 'quarterly') {
            console.log('intens qua 1 ', intens);
            arrintInts = arrFltquaterly;
        }
        else if (durtn == 'halfhour') {
            console.log('intens half 1 ', intens);
            arrintInts = arrFlthalf;
        }
        else if (durtn == 'fullhour') {
            console.log('intens full 1 ', intens);
            arrintInts = arrFltfull;
        }
        else if (intens == 'low') {
            console.log('intens low 1 ', intens);
            arrintInts = arrintlow;
        }
        else if (intens == 'medium') {
            console.log('intens medium 1 ', intens);
            arrintInts = arrintmedium;
        }

        else if (intens == 'high') {
            console.log('intens hight 1 ', intens);
            arrintInts = arrinthigh;
        }
        else if (timedays == 'mrng') {
            console.log('timedays mrng 1 ', timedays);
            arrintInts = arrFltTimeMrg;
        }
        else if (timedays == 'aftn') {
            console.log('timedays aftn 1 ', timedays);
            arrintInts = arrFltTimeaft;
        }

        else if (timedays == 'eve') {
            console.log('timedays eve 1 ', timedays);
            arrintInts = arrFltTimeeve;
        }
        console.log(this.ScheduleClass.length);
        //console.log('arrintInts ', JSON.stringify(arrintInts));
        this.ScheduleClass = arrintInts;
        this.totalData = this.ScheduleClass.length;
        console.log(' this.totalData ', this.totalData);
        this.paginationData = this.ScheduleClass.slice(0, this.pageSize);
        if (this.totalData <= this.pageSize) {
            this.paginationShow = false;
        }
        else {
            this.paginationShow = true;
        }
    }
    clearFilter() {
        this.template.querySelector(`[data-duration='fullhour']`).className = 'filter-btn';
        this.template.querySelector(`[data-duration='quarterly']`).className = 'filter-btn';
        this.template.querySelector(`[data-duration='halfhour']`).className = 'filter-btn';
        this.template.querySelector(`[data-time='eve']`).className = 'filter-btn';
        this.template.querySelector(`[data-time='mrng']`).className = 'filter-btn';
        this.template.querySelector(`[data-time='aftn']`).className = 'filter-btn';
        this.template.querySelector(`[data-intensity='low']`).className = 'filter-btn';
        this.template.querySelector(`[data-intensity='medium']`).className = 'filter-btn';
        this.template.querySelector(`[data-intensity='high']`).className = 'filter-btn';
        setTimeout(() => { this.template.querySelector('[data-id="clsSelect"]').value = 'none'; }, 200);
        setTimeout(() => { this.template.querySelector('[data-id="insSelect"]').value = 'none'; }, 200);
        this.InsVal = '';
        this.clsVal = '';
        this.durationClick = '';
        this.IntensityClick = '';
        this.timeClick = '';
        this.inpsrch = '';
        this.ScheduleClass = this.ScheduleClassNew;
        this.totalData = this.ScheduleClass.length;
        console.log(' this.totalData ', this.totalData);
        this.paginationData = this.ScheduleClass.slice(0, this.pageSize);
        if (this.totalData <= this.pageSize) {
            this.paginationShow = false;
        }
        else {
            this.paginationShow = true;
        }
    }
    clearFilteralt() {
        this.template.querySelector(`[data-duration='fullhour']`).className = 'filter-btn';
        this.template.querySelector(`[data-duration='quarterly']`).className = 'filter-btn';
        this.template.querySelector(`[data-duration='halfhour']`).className = 'filter-btn';
        this.template.querySelector(`[data-time='eve']`).className = 'filter-btn';
        this.template.querySelector(`[data-time='mrng']`).className = 'filter-btn';
        this.template.querySelector(`[data-time='aftn']`).className = 'filter-btn';
        this.template.querySelector(`[data-intensity='low']`).className = 'filter-btn';
        this.template.querySelector(`[data-intensity='medium']`).className = 'filter-btn';
        this.template.querySelector(`[data-intensity='high']`).className = 'filter-btn';
        this.durationClick = '';
        this.IntensityClick = '';
        this.timeClick = '';
        this.inpsrch = '';
        this.ScheduleClass = this.ScheduleClassNew;
        this.totalData = this.ScheduleClass.length;
        console.log(' this.totalData ', this.totalData);
        this.paginationData = this.ScheduleClass.slice(0, this.pageSize);
        if (this.totalData <= this.pageSize) {
            this.paginationShow = false;
        }
        else {
            this.paginationShow = true;
        }
    }

    favoriteHandler(event) {
        if (this.VALID_USER) {
            let classId = event.target.dataset.id;
            let classStatus = event.target.dataset.isfav;
            console.log('classStatus : ', classStatus);
            console.log('classId : ', classId);
            // imperative apex call
            follow({ recId: classId, isFollowing: classStatus })
                .then(result => {
                    console.log('response : ', result);
                    if (result == true) {
                        console.log('inside if  : ');
                        this.paginationData.forEach(e => {
                            //TODO : currentItem
                            if (String(e.Id) == classId) {
                                console.log('inside e.Id  : ');
                                e.classFavStatus = true;
                                console.log('inside e.Id 2 : ');
                                this.template.querySelector('c-toast-message').showToast('success', 'Favorite successfully.');
                                console.log('if true class status : ', e.classFavStatus);
                            }
                        });
                    }
                    else if (result == false) {
                        this.paginationData.forEach(e => {
                            //TODO : currentItem
                            if (e.Id == classId) {
                                e.classFavStatus = false;
                                this.template.querySelector('c-toast-message').showToast('success', 'Unfavorite successfully.');
                                console.log('if false class status : ', e.classFavStatus);
                            }
                        });
                    }
                })
                .catch((e) => {
                    console.log(JSON.stringify(e), e.Message);
                });
        }
        else {
            window.open('/PFNCADNA/s/bwps-wip-signin', '_self');
        }
    }

    liveCick() {
        console.log('click>>> ', this.pageName);
        if (this.pageName == 'bwps_WIP_BrowseClasses__c') {
            window.open('/PFNCADNA/s/bwps-wip-browseclasses?active=lcs', '_self');
        } else if (this.pageName == 'guestUserBrowseClasses__c') {
            window.open('/PFNCADNA/s/guestuserbrowseclasses?active=lcs', '_self');
        }

    }
}