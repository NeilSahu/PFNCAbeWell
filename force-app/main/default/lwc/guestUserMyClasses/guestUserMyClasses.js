import { LightningElement, wire, track } from 'lwc';
// import { CurrentPageReference } from 'lightning/navigation';
import { publish, subscribe, unsubscribe, createMessageContext, releaseMessageContext } from 'lightning/messageService';
import IFRAMEMC from "@salesforce/messageChannel/ZoomSdkMessageChannel__c";

import bellIcon from '@salesforce/resourceUrl/Bell_Icon';
import myResource from '@salesforce/resourceUrl/DNAIcon';
//high signal
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
//low signal
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
//medium signal
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';
import shareIcon from '@salesforce/resourceUrl/ShareIconBlueColor';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
// import favIcon from '@salesforce/resourceUrl/instructorAndGuestUser';
// import unFavIcon from '@salesforce/resourceUrl/unlikeIcon'
import myImage from '@salesforce/resourceUrl/ExerciseImage';
import allEntitySubs from '@salesforce/apex/DNA_GuestUserClass.allEntitySubs';
import follow from '@salesforce/apex/DNA_GuestUserClass.follow';
import getAllClasses from '@salesforce/apex/DNA_GuestUserClass.getAllClasses';
import getFavAttendees from '@salesforce/apex/DNA_GuestUserClass.getFavAttendees';
import LeadData from '@salesforce/apex/BWPS_ShareScheduleClass.CreateLeadforScheduleClassshared';
import fetchNotification from '@salesforce/apex/Bwps_getuserNotification.getUserNotification';
import getUserProfileName from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';

export default class OnDemandClassesComponent extends LightningElement {
    context = createMessageContext();
    subscription = null;

    @track search = `${allIcons}/PNG/Search.png `;
    @track bellIcon = bellIcon;
    @track filterIcon = myResource + "/DNAIcon/filterIcon.png";
    @track shareIcon = shareIcon;
    @track userIcon = `${allIcons}/PNG/Instructor-Image.png `;
    @track favIcon = `${allIcons}/PNG/Favorite.png `;
    @track unFavIcon = `${allIcons}/PNG/unfavorite.png `;
    @track showClassesOfWeek = false;
    @track showRecentLine = true;
    @track showFavLine = false;
    @track showCompletedLine = false;
    @track showInProgressLine = false;
    @track isShowSendModal = false;
    @track ExerciseImage = myImage;
    @track defaultSCImage = myImage;
    @track showClassesOfWeek = false;
    @track haveClass = false;
    @track tab = 'recent';
    @track currentArray = [];
    @track searchResultArray = [];
    @track rowLimit = 9;
    @track page = 1;
    @track showMoreData = true;
    @track showNotificationFlag = false;
    @track notrecords = [];
    @track notificationVisibel = [];
    @track totalNotifications = 0;
    months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    weeks = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    @track rowOffSet = 0;
    loaded = false;
    @track currentTab = 'Recent';
    @track recent;
    @track blueLine = true;
    @track loading = false;
    @track startTime;
    @track userName = '';

    @track endPage = 0;
    @track curPage = 0;

    context = createMessageContext();
    subscription = null;

    @wire(getUserProfileName)
    getUserProfile({ data, error }) {
        if (data) {
            // console.log(data);
            this.userName = data.FirstName ?? '' + ' ' + data.LastName ?? '';
            console.log('profile name : ', data.Profile.Name);
        }
        if (error) {
            console.log('error : ', error, JSON.stringify(error), error.message);
        }
    }

    sendZoomData(meetingId, name) {
        console.log('send2 : ', meetingId, name);
        let message = {
            meetingId: meetingId,
            AttendeeName: name,
            iframeStatus: 'Zoom'
        };
        publish(this.context, IFRAMEMC, message);
    }
    sendZoomData(meetingId, name) {
        console.log('send2 : ', meetingId, name);
        let message = {
            meetingId: meetingId,
            AttendeeName: name,
            iframeStatus: 'Zoom'
        };
        publish(this.context, IFRAMEMC, message);
    }
    updateCurrentVideoUrlHandler(scliId, videoId, watchTime) {
        let message = {
            videoId: videoId,
            scliId: scliId,
            iframeStatus: 'Vimeo',
            watchTime: watchTime
        };
        publish(this.context, IFRAMEMC, message);
        // this.currentVideoUrl = "https://player.vimeo.com/video/"+videoId+"&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479";
    }

    handleVimeoIframe(event) {
        let currData = this.searchResultArray.find(e => e.Id == event.target.dataset.key);
        let status = currData.btnLabel;
        console.log('IframeStatus : ', status);
        //for vimeo iframe
        if (status == 'PLAY ON-DEMAND' || status == 'RESUME' || status == 'COMPLETED') {
            //this.showHideVimeoIframe();
            let videoId = currData.videoId;
            let scliId = currData.scliId;
            let watchTime = currData.WatchTime;

            this.updateCurrentVideoUrlHandler(scliId, videoId, watchTime);
        }
        //for zoom iframe
        else if (status == 'JOIN') {
            let meetingId = currData.meetingId;
            let name = currData.userName;
            // this.sendZoomData(meetingId, name);
            this.sendZoomData(meetingId, name);
        }
    }

    // StartClass(event){
    //     let status = event.target.dataset.status;
    //     console.log('Status in startClass : ',status);
    //     if(status == "In Person"){
    //       let latlong = event.target.dataset.latlong;
    //       window.open('https://www.google.com/maps/place/'+latlong,'blank');
    //     }
    //     else{
    //       let meetingId = event.target.dataset.meetingid;
    //       let scliName = event.target.dataset.name;
    //       console.log('live output : ', meetingId);
    //       this.sendZoomData2(meetingId, scliName);
    //     }
    // }

    showNotificationMethod() {
        console.log("call1", this.showNotificationFlag);
        this.showNotificationFlag = !this.showNotificationFlag;
    }
    handleRecentUnderline(loadMore) {
        this.haveClass = false;
        this.showMoreData = false;
        if (!loadMore || loadMore == undefined || loadMore == null || loadMore != true) {
            this.rowOffSet = 0;
            this.currentArray = [];
            this.searchResultArray = [];
            console.log('tab changed to fav : ');
        }
        // this.recent = event.target.value;
        this.currentTab = 'Recent';
        this.tab = 'recent';
        // console.log(event.target);
        this.showFavLine = false;
        this.showCompletedLine = false;
        this.showInProgressLine = false;
        this.showRecentLine = true;
        // this.template.querySelector('.recentClass').style="font-weight:600";
        // this.template.querySelector('.favClas').style="font-weight:400";
        // this.template.querySelector('.completeClass').style="font-weight:400";
        // this.template.querySelector('.progressClass').style="font-weight:400";
        this.page = 1;
        // this.currentArray =[];
        // this.searchResultArray = [];
        this.loadData();
        console.log('favAttendees1 : ', res.length, this.rowOffSet, this.rowLimit);
        this.currentArray = [];
        this.allClassArray.forEach(ca => {
            this.currentArray.push(ca);
        });
        this.searchHandler({ target: { value: '' } });

    }
    fav;
    handleFavUnderline(loadMore) {
        this.haveClass = false;
        this.showMoreData = false;
        this.loading = true;
        console.log('favLoadMore : ', loadMore);
        if (!loadMore || loadMore == undefined || loadMore == null || loadMore != true) {
            this.rowOffSet = 0;
            this.currentArray = [];
            this.searchResultArray = [];
            console.log('tab changed to fav : ');
        }
        // this.fav = e.target.value; 
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
        var timeElapsed = Date.now();
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
        console.log('OUTPUT Date: ', splitUpdatedDate);
        this.currentTab = 'Fav';
        this.tab = 'favorite';
        console.log('check Anjali 1.0 ', this.currentTab);
        this.showFavLine = true;
        this.showCompletedLine = false;
        this.showInProgressLine = false;
        this.showRecentLine = false;
        // this.template.querySelector('.recentClass').style="font-weight:400";
        // this.template.querySelector('.favClas').style="font-weight:600";
        // this.template.querySelector('.completeClass').style="font-weight:400";
        // this.template.querySelector('.progressClass').style="font-weight:400";
        console.log('check Anjali 1.1 ');
        console.log('ALL CLASS ARR : ', JSON.stringify(this.allClassArray));
        allEntitySubs()
            .then(result => {
                console.log('check Anjali 1.2 ', JSON.parse(JSON.stringify(result)));
                if (result) {
                    if (result.length == 0) {
                        this.showMoreData = false;
                    } else {
                        //this.showMoreData = true;
                    }
                    console.log('check Anjali 1.3  ', JSON.stringify(result));
                    // this.currentArray = [];
                    var favSelectedClasses = [];
                    this.page = 1;

                    let recIds = [];
                    result.forEach(es => {
                        recIds.push(es.ParentId);
                    });
                    console.log('recIdss : ', JSON.stringify(recIds));
                    getFavAttendees({ recIds: recIds, limitSize: this.rowLimit, offset: this.rowOffSet })
                        .then(res => {
                            if (!res.Class_Status__c) {
                                res.Class_Status__c = 'JOIN';
                            }
                            if (res.length < 1) {
                                this.haveClass = false;
                                this.showMoreData = false;
                            }
                            //handle Load More Button Visibility
                            console.log('favAttendees1 : ', res.length, this.rowOffSet, this.rowLimit);
                            if (res.length < (this.rowOffSet + this.rowLimit)) {
                                this.showMoreData = false;
                            }
                            console.log('FavAttendees : ', JSON.stringify(res));
                            let favData = JSON.parse(JSON.stringify(res));
                            let tempArr = [];
                            favData.forEach(favRec => {
                                if (!favRec.Class_Status__c) {
                                    favRec.Class_Status__c = 'JOIN';
                                }
                                // let favClass  = JSON.parse(JSON.stringify(cls));
                                // if(es.ParentId == favClass.Id){
                                favRec.scImage = this.defaultSCImage;
                                try {
                                    favRec['classFavStatus'] = true;
                                }
                                catch (err) {
                                    console.log('catch favRec', err.message);
                                }
                                // favSelectedClasses.push(favClass);
                                // }
                                try {
                                    let scLineItemArr = favRec.Schedule_Class_Line_Item_del__r;
                                    if (favRec.Schedule_Class_Line_Item_del__r != undefined) {
                                        if (scLineItemArr.length > 1) {
                                            scLineItemArr.forEach(scli => {
                                                var classDate = (scli.BWPS_ClassDate__c).split('-');
                                                var classSplitUpdatedDate = classDate[0] + "-" + classDate[1] + "-" + classDate[2];
                                                console.log('OUTPUT Class: ', classSplitUpdatedDate);
                                                if (splitUpdatedDate == classSplitUpdatedDate) {
                                                    this.blueLine = true;
                                                    scli.shortDay = 'TODAY';
                                                    sclie.scLineItemTime = msToTime(scli.BWPS_StartTime__c);
                                                    // console.log('OUTPUT CON: ',e.shortDay,e.scLineItemTime,this.blueLine);

                                                }
                                                else {
                                                    this.blueLine = false;
                                                    e.scLineItemTime = msToTime(scli.BWPS_StartTime__c);
                                                    e.shortDay = scli.BWPS_ClassDate__c;
                                                }
                                                let e = JSON.parse(JSON.stringify(scli));
                                                //e.action = 'EDIT';

                                                let sig = e.BWPS_Integrity__c;
                                                console.log('loop intensity : ', e.BWPS_Integrity__c);
                                                if (sig == 'Low/Seated') {
                                                    e.intensity = lowSignal;
                                                }
                                                else if (sig == 'Medium') {
                                                    e.intensity = mediumSignal;
                                                }
                                                else if (sig == 'High/Active') {
                                                    e.intensity = highSignal;
                                                }
                                                else {
                                                    e.intensity = lowSignal;
                                                }
                                            });
                                            // lineItemTempArr.push();
                                        }
                                        else {
                                            let e = favRec.Schedule_Class_Line_Item_del__r;
                                            //let e = JSON.parse(JSON.stringify(scli));
                                            //e.action = 'EDIT';
                                            var classDate = (e.BWPS_ClassDate__c).split('-');
                                            var classSplitUpdatedDate = classDate[0] + "-" + classDate[1] + "-" + classDate[2];
                                            console.log('OUTPUT Class: ', classSplitUpdatedDate);
                                            if (splitUpdatedDate == classSplitUpdatedDate) {
                                                this.blueLine = true;
                                                e.shortDay = 'TODAY';
                                                e.scLineItemTime = msToTime(e.BWPS_StartTime__c);
                                                // console.log('OUTPUT CON: ',e.shortDay,e.scLineItemTime,this.blueLine);

                                            }
                                            else {
                                                this.blueLine = false;
                                                e.scLineItemTime = msToTime(e.BWPS_StartTime__c);
                                                e.shortDay = e.BWPS_ClassDate__c;
                                            }
                                            let sig = e.BWPS_Integrity__c;
                                            console.log('single intensity : ', e.BWPS_Integrity__c);
                                            if (sig == 'Low/Seated') {
                                                e.intensity = lowSignal;
                                            }
                                            else if (sig == 'Medium') {
                                                e.intensity = mediumSignal;
                                            }
                                            else if (sig == 'High/Active') {
                                                e.intensity = highSignal;
                                            }
                                            else {
                                                e.intensity = lowSignal;
                                            }
                                            let AttendeeStatus = '';
                                            if (favRec.Class_Status__c != '' || favRec.Class_Status__c != null || favRec.Class_Status__c != undefined) {
                                                AttendeeStatus = favRec.Class_Status__c;
                                            }
                                            favRec.WatchTime = e.BWPS_WatchedTimeStamp__c;

                                            let jDate = new Date(new Date(e.BWPS_ClassDate__c));
                                            let j1Date = new Date();
                                            jDate.setHours(0, 0, 0, 0);
                                            let datestart = new Date();
                                            datestart.setHours(0, 0, 0, 0);
                                            let todayms = j1Date.getTime() - datestart.getTime();
                                            j1Date.setHours(0, 0, 0, 0);
                                            let btnClass = '';
                                            let btnLabel = 'JOIN';
                                            let isOver = false;
                                            console.log('j1Date : ', j1Date);
                                            console.log('check : ', j1Date === jDate);
                                            if (j1Date - jDate == 0) {
                                                let updatedLineItemStartTime = Number(e.BWPS_StartTime__c) - 900000;
                                                let updatedLineItemEndTime = Number(e.BWPS_EndTime__c) + 900000;
                                                //cur['disabledClass'] = 'statusClass unDisabledClass';
                                                if (todayms >= updatedLineItemStartTime && todayms <= updatedLineItemEndTime) {
                                                    btnClass = 'buttonContainer';
                                                }
                                                else {
                                                    if (e.BWPS_Vimeo_video_Id__c != null && e.BWPS_Vimeo_video_Id__c != undefined && e.BWPS_Vimeo_video_Id__c != '') {
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
                                                        btnLabel = (todayms >= updatedLineItemEndTime) ? 'OVER' : 'JOIN';
                                                        btnClass = 'buttonContainer btnDisabled';

                                                    }
                                                }
                                            } else {
                                                if (e.BWPS_Vimeo_video_Id__c != null && e.BWPS_Vimeo_video_Id__c != undefined && e.BWPS_Vimeo_video_Id__c != '') {
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
                                                    btnLabel = (j1Date < jDate) ? 'JOIN' : 'OVER';
                                                    isOver = btnLabel == 'OVER' ? true : false;
                                                    btnClass = 'buttonContainer btnDisabled';
                                                }
                                            }
                                            favRec.btnClass = btnClass;
                                            favRec.btnLabel = btnLabel;
                                            favRec.userName = this.userName;
                                            favRec.lineItemStartTime = e.BWPS_StartTime__c;
                                            favRec.lineItemEndTime = e.BWPS_EndTime__c;
                                            favRec.lineItemDate = e.BWPS_ClassDate__c;
                                            favRec.scheduleLineItemName = e.Name;
                                            favRec.lineItemLectureUrl = e.BWPS_Lecture_Link__c;
                                            favRec.lineItemType = e.Schedule_Class__r.Schedule_Type__c;
                                            favRec.LatLong = e.Schedule_Class__r.LatitudeLongitude__c;
                                            favRec.videoId = e.BWPS_Vimeo_video_Id__c;
                                            favRec.meetingId = e.LectureId__c;
                                            favRec.scliId = e.Id;
                                            favRec.VideoDuration = e.Video_Duration__c;
                                            favRec.watchTime = favRec.BWPS_WatchedTimeStamp__c;
                                            favRec.Schedule_Class_Line_Item_del__r = e;
                                        }

                                    }
                                    tempArr.push(favRec);
                                }
                                catch (err) {
                                    console.log('favImg : ', err.message);
                                }
                            });
                            try {
                                this.searchResultArray = [];
                                this.currentArray = [];
                                this.currentArray.push(...tempArr);
                                if (this.currentArray != undefined && this.currentArray != null) {
                                    if (this.currentArray.length / 9 == 0) {
                                        this.showMoreData = true;
                                    }
                                    else {
                                        this.showMoreData = false;
                                    }
                                }
                                console.log('currentArrTemp : ', JSON.stringify(tempArr));
                                this.searchHandler({ target: { value: '' } });
                            }
                            catch (err) {
                                console.log('maintainRecsFav : ', err.message);
                            }
                        })
                    // })
                    console.log('check Anjali 1.4  ', JSON.parse(JSON.stringify(favSelectedClasses)));
                }
                // this.currentArray = [...favSelectedClasses];
                this.searchHandler({ target: { value: '' } });
                console.log('check Anjali 1.5  ', JSON.parse(JSON.stringify(this.currentArray)));
                this.loading = false;
            })
        //this.paginationHandler();
        console.log('visible arr in fav : ', JSON.stringify(this.currentArray));
    }
    handleCompletedUnderline(loadMore) {
        this.haveClass = false;
        this.showMoreData = false;
        this.loading = true;
        this.showFavLine = false;
        this.currentTab = 'Complete';
        this.tab = 'completed';
        this.showCompletedLine = true;
        this.showInProgressLine = false;
        this.showRecentLine = false;
        if (!loadMore || loadMore == undefined || loadMore == null || loadMore != true) {
            this.rowOffSet = 0;
            this.currentArray = [];
            this.searchResultArray = [];
            this.allClassArray = [];
            console.log('tab changed to fav : ', this.rowOffSet, this.currentTab);
        }
        this.loadData();
        // this.template.querySelector('.recentClass').style="font-weight:400";
        // this.template.querySelector('.favClas').style="font-weight:400";
        // this.template.querySelector('.completeClass').style="font-weight:600";
        // this.template.querySelector('.progressClass').style="font-weight:400";
        // this.currentArray = [];
        // this.searchResultArray =[];

        // this.allClassArray.forEach(ca => {
        //     // this.loadData();
        //     console.log('btnLabell : ',ca.btnLabel);
        //     if(ca.btnLabel == 'COMPLETED'){
        //         this.currentArray.push(ca);
        //     }
        // });
        // if(this.currentArray != undefined && this.currentArray != null){
        //     if(this.currentArray.length % this.rowLimit == 0){
        //         this.showMoreData = true;
        //     }
        //     if(this.currentArray.length <= 0 ){
        //         this.haveClass = false;
        //     }
        // }
        //this.searchResultArray = this.currentArray;
        //this.searchHandler({target: {value: ''}});
        //this.searchHandler({target: {value: ''}});
    }
    handleInProgressUnderline(loadMore) {
        this.haveClass = false;
        this.showMoreData = false;
        this.showFavLine = false;
        this.currentTab = 'InProg';
        this.tab = 'in progress';
        this.showCompletedLine = false;
        this.showInProgressLine = true;
        this.showRecentLine = false;
        if (!loadMore || loadMore == undefined || loadMore == null || loadMore != true) {
            this.rowOffSet = 0;
            this.currentArray = [];
            this.searchResultArray = [];
            this.allClassArray = [];
            console.log('tab changed to fav : ', this.rowOffSet, this.currentTab);
        }
        this.loadData();
        // this.template.querySelector('.recentClass').style="font-weight:400";
        // this.template.querySelector('.favClas').style="font-weight:400";
        // this.template.querySelector('.completeClass').style="font-weight:400";
        // this.template.querySelector('.progressClass').style="font-weight:600";
        this.page = 1;
        // this.loadData();
        // this.currentArray =[];
        // this.searchResultArray =[];
        // if(this.allClassArray != undefined && this.allClassArray != null){
        //     this.allClassArray.forEach(ca => {
        //         //TODO : currentItem
        //         if(ca.btnLabel == 'RESUME' ){
        //             this.currentArray.push(ca);
        //         }
        //     });
        //     if(this.currentArray.length == 9){
        //         this.showMoreData = true;
        //     }
        //     if(this.currentArray.length <= 0 ){
        //         this.haveClass = false;
        //     }
        // }
        // this.searchResultArray = this.currentArray;
        //this.searchHandler({target: {value: ''}});
        //this.paginationHandler();
    }
    connectedCallback() {
        this.loadData();
    }
    loadData() {
        this.showMoreData = false;
        this.loading = true;
        getAllClasses({ limitSize: this.rowLimit, offset: this.rowOffSet, currentTab: this.currentTab })
            .then(result => {
                if (result && result != undefined && result != null) {
                    if (result.length == 0) {
                        this.showMoreData = false;
                    } else {
                        this.haveClass = false;
                        this.showMoreData = true;
                    }
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
                    var timeElapsed = Date.now();
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
                    console.log('OUTPUT Date: ', splitUpdatedDate);
                    var data = result;
                    let attendeeData = data;
                    let tempArr = [];
                    console.log('scArr : ', JSON.stringify(data));
                    attendeeData.forEach(r => {
                        let a = JSON.parse(JSON.stringify(r));
                        a.scImage = this.defaultSCImage;
                        a.classFavStatus = false;
                        if (!a.Class_Status__c) {
                            a.Class_Status__c = 'JOIN';
                        }
                        if (a.Schedule_Class_Line_Item_del__r != undefined) {
                            let e = a.Schedule_Class_Line_Item_del__r;
                            var classDate = (e.BWPS_ClassDate__c).split('-');
                            var classSplitUpdatedDate = classDate[0] + "-" + classDate[1] + "-" + classDate[2];
                            console.log('OUTPUT Class: ', classSplitUpdatedDate);
                            if (splitUpdatedDate == classSplitUpdatedDate) {
                                this.blueLine = true;
                                e.shortDay = 'TODAY';
                                e.scLineItemTime = msToTime(e.BWPS_StartTime__c);
                                console.log('OUTPUT CON: ', e.shortDay, e.scLineItemTime, this.blueLine);

                            }
                            else {
                                this.blueLine = false;
                                e.scLineItemTime = msToTime(e.BWPS_StartTime__c);
                                e.shortDay = e.BWPS_ClassDate__c;
                            }
                            // let e = JSON.parse(JSON.stringify(scli));
                            // console.log('OUTPUT COMPARE: ',scli);
                            // var intialDateObj = new Date(e.BWPS_ClassDate__c);
                            // // var classweekday = this.weeks[intialDateObj.getDay()];
                            // var classplitDay=intialDateObj.getDate();
                            // var classplitMonth=this.months[intialDateObj.getMonth()];
                            // var classplitYear= intialDateObj.getFullYear();
                            // if(classplitDay.toString().length == 1  ){
                            //     classplitDay = '0'+classplitDay;
                            // }
                            // else {
                            //     classplitDay = classplitDay;
                            // }
                            // if(classplitMonth.toString().length == 1  ){
                            // classplitMonth = '0'+classplitMonth;
                            // }
                            // else {
                            //     classplitMonth = classplitMonth;
                            // }
                            // var classSplitUpdatedDate = classplitYear+"-"+classplitMonth+"-"+classplitDay;
                            // console.log('OUTPUT Class: ',classSplitUpdatedDate);
                            // if(splitUpdatedDate == classSplitUpdatedDate){
                            //     this.blueLine = true;
                            //     e.shortDay = 'TODAY';
                            //     e.scLineItemTime = msToTime(e.BWPS_StartTime__c);

                            // }
                            // else{
                            //     this.blueLine = false;
                            // }
                            let sig = e.BWPS_Integrity__c;
                            console.log('single intensity : ', e.BWPS_Integrity__c);
                            if (sig == 'Low/Seated') {
                                e.intensity = lowSignal;
                            }
                            else if (sig == 'Medium') {
                                e.intensity = mediumSignal;
                            }
                            else if (sig == 'High/Active') {
                                e.intensity = highSignal;
                            }
                            else {
                                e.intensity = lowSignal;
                            }

                            let AttendeeStatus = '';
                            if (a.Class_Status__c != '' || a.Class_Status__c != null || a.Class_Status__c != undefined) {
                                AttendeeStatus = a.Class_Status__c;
                            }
                            a.WatchTime = e.BWPS_WatchedTimeStamp__c;

                            let jDate = new Date(new Date(e.BWPS_ClassDate__c));
                            let j1Date = new Date();
                            jDate.setHours(0, 0, 0, 0);
                            let datestart = new Date();
                            datestart.setHours(0, 0, 0, 0);
                            let todayms = j1Date.getTime() - datestart.getTime();
                            j1Date.setHours(0, 0, 0, 0);
                            let btnClass = '';
                            let btnLabel = 'JOIN';
                            let isOver = false;
                            console.log('j1Date : ', j1Date);
                            console.log('check : ', j1Date === jDate);
                            if (j1Date - jDate == 0) {
                                let updatedLineItemStartTime = Number(e.BWPS_StartTime__c) - 900000;
                                let updatedLineItemEndTime = Number(e.BWPS_EndTime__c) + 900000;
                                //cur['disabledClass'] = 'statusClass unDisabledClass';
                                if (todayms >= updatedLineItemStartTime && todayms <= updatedLineItemEndTime) {
                                    btnClass = 'buttonContainer';
                                }
                                else {
                                    if (e.BWPS_Vimeo_video_Id__c != null && e.BWPS_Vimeo_video_Id__c != undefined && e.BWPS_Vimeo_video_Id__c != '') {
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
                                        btnLabel = (todayms >= updatedLineItemEndTime) ? 'OVER' : 'JOIN';
                                        btnClass = 'buttonContainer btnDisabled';

                                    }
                                }
                            } else {
                                if (e.BWPS_Vimeo_video_Id__c != null && e.BWPS_Vimeo_video_Id__c != undefined && e.BWPS_Vimeo_video_Id__c != '') {
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
                                    btnLabel = (j1Date < jDate) ? 'JOIN' : 'OVER';
                                    isOver = btnLabel == 'OVER' ? true : false;
                                    btnClass = 'buttonContainer btnDisabled';
                                }
                            }
                            a.btnClass = btnClass;
                            a.btnLabel = btnLabel;
                            a.userName = this.userName;
                            a.lineItemStartTime = e.BWPS_StartTime__c;
                            a.lineItemEndTime = e.BWPS_EndTime__c;
                            a.lineItemDate = e.BWPS_ClassDate__c;
                            a.scheduleLineItemName = e.Name;
                            a.lineItemLectureUrl = e.BWPS_Lecture_Link__c;
                            a.lineItemType = e.Schedule_Class__r.Schedule_Type__c;
                            a.LatLong = e.Schedule_Class__r.LatitudeLongitude__c;
                            a.videoId = e.BWPS_Vimeo_video_Id__c;
                            a.meetingId = e.LectureId__c;
                            a.scliId = e.Id;
                            a.VideoDuration = e.Video_Duration__c;
                            a.watchTime = a.BWPS_WatchedTimeStamp__c;
                            a.Schedule_Class_Line_Item_del__r = e;
                        }
                        tempArr.push(a);
                    });
                    console.log('after processs : ', JSON.stringify(tempArr));
                    if (tempArr.length > 0) {
                        this.allClassArray = tempArr;
                        //this.currentArray = tempArr;
                    }
                    allEntitySubs()
                        .then(result => {
                            console.log('outside 11 : ', JSON.stringify(result));
                            //console.log('visible array : ',JSON.strClass_Status__cingify(this.visibleCardElementArray));
                            if (result) {
                                console.log('result1 : ', JSON.stringify(result));
                                //console.log(' inside visible array : ',JSON.stringify(this.visibleCardElementArray));
                                result.forEach(es => {
                                    //TODO : currentItem
                                    this.allClassArray.forEach(cls => {
                                        //TODO : currentItem
                                        if (es.ParentId == cls.scliId) {
                                            cls.classFavStatus = true;
                                            console.log('check in parentid : ', cls.classFavStatus);
                                        }
                                    });
                                });
                                console.log('allClassArray in log : ', JSON.stringify(this.allClassArray));
                                this.currentArray = this.allClassArray;
                                // if(this.currentArray != undefined && this.currentArray != null){
                                //     if(this.currentArray.length % rowLimit == 0){
                                //         this.showMoreData = true;
                                //     }
                                //     if(this.currentArray.length <= 0 ){
                                //         this.haveClass = false;
                                //     }
                                // }
                                this.searchHandler({ target: { value: '' } });
                            }
                        })
                    this.loading = false;
                }
                else {
                    this.currentArray = [];
                    this.searchHandler({ target: { value: '' } });
                }
            })
    }
    loadMoreData(event) {
        console.log('LOAD DATA 1 ');
        let currentRecord = this.currentArray;
        const { target } = event;
        target.isLoading = true;

        this.rowOffSet = this.rowOffSet + this.rowLimit;

        console.log('LOAD DATA 2 ', this.recent, this.rowOffSet);
        if (this.currentTab == 'Recent') {
            console.log('LOAD RECENT DATA', this.recent);
            this.loadData();
        }
        else if (this.currentTab == 'Fav') {
            console.log('LOAD Favorites DATA', this.fav);
            this.handleFavUnderline();
        }
        else if (this.currentTab == 'InProg') {
            this.showMoreData = false;
        }
        else if (this.currentTab == 'Complete') {
            this.handleCompletedUnderline();
        }
    }
    paginationHandler() {

    }
    favoriteHandler(event) {
        let classId = event.target.dataset.id;
        let classStatus = event.target.dataset.isfav;
        console.log('classStatus : ', classStatus, classId);
        follow({ recId: classId, isFollowing: classStatus })
            .then(result => {
                //console.log('response : ',result);
                if (result == true) {
                    this.currentArray.forEach(e => {
                        //TODO : currentItem
                        if (String(e.scliId) == classId) {
                            e.classFavStatus = true;
                            this.template.querySelector('c-toast-message').showToast('success', 'Favorite successfully.');
                            //console.log('if true class status : ',e.classFavStatus);
                        }
                    });
                }
                else if (result == false) {
                    this.currentArray.forEach(e => {
                        //TODO : currentItem
                        if (e.scliId == classId) {
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
    // share code   
    handleShare(event) {
        this.showSendModalBox();
        let scId = event.target.dataset.id;
        let scDescription = event.target.dataset.description;
        console.log('Schedule Class Id : ', scId);
        console.log('Schedule Class Id : ', scDescription);
    }
    hideSendModalBox() {
        this.isShowSendModal = false;
    }
    showSendModalBox() {
        this.isShowSendModal = true;
    }

    // send email code
    @track CaseRecords;
    @track temp;
    Subject = 'Subject data';
    Body = 'Body Data';
    Email = 'LWC@gmail.com';
    sendMailMethod() {
        this.isShowSendModal = false;
        console.log('ind');
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
        console.log("body  " + this.Body);
        console.log("temp : ", JSON.stringify(this.temp));
        LeadData({ LeadDetails: this.temp })
            .then(result => {
                this.CaseRecords = result;
                console.log("output");
                console.log(this.CaseRecords);
            })
            .catch(error => {
                this.error = error;
                console.log('error', JSON.stringify(this.error))
            });
        console.log("fire");
        const custEvent = new CustomEvent(
            'callpasstoparent', {
            detail: 'false'
        });
        this.dispatchEvent(custEvent);
        this.template.querySelector('c-toast-meassage').showToast('success', 'Mail sent successfully.');
        this.hideSendModalBox();
        this.isShowSendModal = false;
    }
    viewAllNavigationHandler() {
        console.log('view all');
    }

    @track isLoaded = true;

    searchHandler(event) {
        let val = event.target.value.toLowerCase();
        console.log('event str : ', val);
        this.isLoaded = false;
        if (val != '') {
            this.searchResultArray = [];
        }
        //this.searchResultArray = [];
        try {
            if (this.currentArray != null && this.currentArray != undefined && this.currentArray.length > 0) {
                // if(this.currentArray.length == 9){
                //     this.showMoreData = true;
                // }
                this.currentArray.forEach(e => {
                    // if(this.currentTab == 'Recent'){
                    //         let jDate = new Date(e.Schedule_Class_Line_Item_del__r.BWPS_ClassDate__c);
                    //         let j1Date = new Date();
                    //         jDate.setHours(0,0,0,0);
                    //         j1Date.setHours(0,0,0,0);
                    //         console.log(' array date : ', jDate );
                    //         console.log(' current date : ', j1Date );
                    //         if(jDate.valueOf() == j1Date.valueOf()){
                    //             this.searchResultArray.push(ca);
                    //         }
                    // }else
                    if (val == '' || e.Schedule_Class_Line_Item_del__r.Name.toLowerCase().includes(val) || e.Schedule_Class_Line_Item_del__r.BWPS_Integrity__c.toLowerCase().includes(val) || e.Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_instructor__r.Name.toLowerCase().includes(val)) {
                        console.log('get name : ', e.Schedule_Class_Line_Item_del__r.Name);
                        let haveRec = this.searchResultArray.findIndex(i => i.Id === e.Id);
                        if (haveRec == -1) {
                            this.searchResultArray.push(e);
                        }
                    }
                });
                if (this.searchResultArray.length % this.rowLimit == 0) {
                    this.showMoreData = true;
                }
                else {
                    this.showMoreData = false;
                }
            }
            else {
                this.searchResultArray = [];
            }

            if (this.searchResultArray.length > 0) {
                this.haveClass = true;
            }
            else {
                this.haveClass = false;
                this.showMoreData = false;
            }
        }
        catch (error) {
            console.log('Error in search : ', JSON.stringify(error), error.message);
        }
    }



    @wire(fetchNotification)
    wiredData({ data, error }) {
        if (data != null && data != '' && data != undefined) {
            var notificationData = JSON.parse(JSON.parse(data));
            var firstLoop = true;
            for (let i = 0; i < notificationData.notifications.length; i++) {
                var nottificationdate = new Date(notificationData.notifications[i].mostRecentActivityDate);
                var todayDate = new Date();
                var timeinMilliSec = todayDate - nottificationdate + 'ago';
                if (notificationData.notifications[i].read == false) {
                    this.totalNotifications += 1;
                }
                var obj = {
                    id: notificationData.notifications[i].id,
                    Name: 'Kirsten Bodensteiner',
                    image: notificationData.notifications[i].image,
                    Active__c: timeinMilliSec,
                    Message__c: notificationData.notifications[i].messageBody,
                }
                this.notrecords.push(obj);
                if (firstLoop) {
                    this.notificationVisibel.push(obj);
                    firstLoop = false;
                }

            }

        } else {
            console.log('errorfghgg>>> ', JSON.stringify(error));
        }
    }


    // active = ''; //for checking
    // @wire(CurrentPageReference)
    // getStateParameters(currentPageReference) {
    //     if (currentPageReference)
    //         this.active = currentPageReference.state?.active;
    // }
    // renderedCallback(){
    //     if(this.active == 'favorites'){
    //         this.handleFavUnderline();
    //     }

    // }
}