import { LightningElement, track, api, wire } from 'lwc';
import { publish, subscribe, unsubscribe, createMessageContext, releaseMessageContext } from 'lightning/messageService';
import IFRAMEMC from "@salesforce/messageChannel/ZoomSdkMessageChannel__c";
import VIMEOMC from "@salesforce/messageChannel/VimeoOff__c";
import myResource from '@salesforce/resourceUrl/DNAIcon';
//high signal
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
//low signal
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
//medium signal
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';
import shareIcon from '@salesforce/resourceUrl/ShareIconBlueColor';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import Instructor from '@salesforce/resourceUrl/InstructorLogo';
// import favIcon from '@salesforce/resourceUrl/likeButton';
// import unFavIcon from '@salesforce/resourceUrl/unlikeIcon';
//import myResource from '@Salesforce/resourceUrl/DNAIcon';
import myImage from '@salesforce/resourceUrl/ExerciseImage';
import allEntitySubs from '@salesforce/apex/DNA_GuestUserClass.allEntitySubs';
import follow from '@salesforce/apex/DNA_GuestUserClass.follow';
import getAllFavClasses from '@salesforce/apex/DNA_GuestUserClass.getAllFavClasses';
import getUserContactId from '@salesforce/apex/DNA_GuestUserClass.getUserContactId';
// import createGetAttendee from '@salesforce/apex/Bwps_PlayOnDemandHendler.createGetAttendee';
// import updateTime from '@salesforce/apex/BWPS_LoginUserProfileCtrl.updateAttendeeTime';
import getBaseUrl from '@salesforce/apex/DNA_InstructorClass.getBaseUrl';
import LeadData from '@salesforce/apex/BWPS_ShareScheduleClass.CreateLeadforScheduleClassshared';
import getUserProfileName from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';

export default class OnDemandClassesComponent extends LightningElement {
    @track filterIcon = myResource + "/DNAIcon/filterIcon.png";
    @track shareIcon = shareIcon;
    // @track userIcon = myResource+"/DNAIcons/userIcon.png";
    userIcon = Instructor;
    @track favIcon = `${allIcons}/PNG/Favorite.png `;
    @track unFavIcon = `${allIcons}/PNG/unfavorite.png `;
    @track showClassesOfWeek = false;
    @track showRecentLine = true;
    @track showFavLine = false;
    @track showCompletedLine = false;
    @track showInProgressLine = false;
    @track isShowSendModal = false;
    @track noRecordFlag = false;

    @track ExerciseImage = myImage;
    @track defaultSCImage = myImage;
    @track showClassesOfWeek = false;
    @track haveClass = true;
    @track currentArray = [];
    @track visibleRecords = [];
    @track allClassArray = [];
    @track allFavRecords = [];
    @track page = 1;
    @track pageSize = 3;
    @track start = 0;
    @track end = 0;

    //@track visibleRecords = [{id : "1", src : "https://cyntexa-2f6-dev-ed.lightning.force.com/sfc/servlet.shepherd/version/download/0685j00000BDk4TAAT?operationContext=S1" , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore"},{id : "2", src : "https://cyntexa-2f6-dev-ed.lightning.force.com/sfc/servlet.shepherd/version/download/0685j00000BDk4TAAT?operationContext=S1" , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore"},{id : "3", src : "https://cyntexa-2f6-dev-ed.lightning.force.com/sfc/servlet.shepherd/version/download/0685j00000BDk4TAAT?operationContext=S1" , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore"},{id : "4", src : "https://cyntexa-2f6-dev-ed.lightning.force.com/sfc/servlet.shepherd/version/download/0685j00000BDk4TAAT?operationContext=S1" , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore"}]
    // @track allClassArray = [{id : "1", src : this.ExerciseImage , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore",ClassStatus__c : "JOIN"},
    //     {id : "2", src : this.ExerciseImage , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore",ClassStatus__c : "JOIN"},
    //     {id : "3", src : this.ExerciseImage , Name : "Shuhana Ailus", Level__c : "High/Active", ExcerciseName__c : "HIGH AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore",ClassStatus__c : "JOIN"},
    //     {id : "4", src : this.ExerciseImage , Name : "Decole Melesh", Level__c : "Low/Seated", ExcerciseName__c : "LOW AEROBIC EXERCISE FOR PARKINSON'S", Description__c : "Made possible with support from Lorien Encore",ClassStatus__c : "JOIN"}
    // ]
    showIframe = false;
    @track showClassIframe = false;
    @track showVimeoIframe = false;
    @track loading = false;
    @track userName = '';
    @track currentTab = 'Recent';

    context = createMessageContext();
    subscription2 = null;

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
    connectedCallback() {
        // this.subscription2 = subscribe(this.context, VIMEOMC, (message) => {
        //     // this.displayMessage(message);
        //     console.log('msg : ',message);
        //    if(message.iframeStatus == 'close'){
        //        console.log('msg2 : ');
        //         this.closeIframeTime();
        //    }
        // });
    }
    // handleIframe(event){
    //     console.log('handleF : ',);
    //     let status = event.target.dataset.status;
    //     console.log('statusss : ',status);
    //     if(status == 'PLAY ON-DEMAND'){
    //         this.showIframe = !this.showIframe;
    //     }
    // }
    StartClass(event) {
        let status = event.target.dataset.status;
        console.log('Status in startClass : ', status);
        if (status == "In Person") {
            //this.showIframe = !this.showIframe;
            //this.currentVideoId = event.target.dataset.videoid;
            //this.updateCurrentVideoUrlHandler();
            let latlong = event.target.dataset.latlong;
            window.open('https://www.google.com/maps/place/' + latlong, 'blank');
        }
        else {
            // this.showClassIframe = !this.showClassIframe;
            // this.currentClassUrl = event.target.dataset.meetingurl;
            let meetingId = event.target.dataset.meetingid;
            let scliName = event.target.dataset.name;
            console.log('live output : ', meetingId);
            // this.sendZoomData(meetingId, scliName);
            this.sendZoomData2(meetingId, scliName);
            //this.updateCurrentClassUrlHandler();
        }
    }
    showAndHideClassIframeMethod() {
        this.showClassIframe = !this.showClassIframe;
    }
    updateCurrentClassUrlHandler() {
        //this.currentClassUrl = ""; // = "https://player.vimeo.com/video/"+this.currentVideoId+"&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479";
        //this.currentVideoUrl = "https://player.vimeo.com/video/762784047?h=315f56a57e";
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
        let currData = this.allClassArray.find(e => e.Id == event.target.dataset.key);
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
    // hideIframe(){
    //     this.showIframe = !this.showIframe;
    // }

    handleRecentUnderline() {
        // console.log(event.target);
        this.currentTab == 'Recent';
        this.loading = true;
        this.showFavLine = false;
        this.showCompletedLine = false;
        this.showInProgressLine = false;
        this.showRecentLine = true;
        this.template.querySelector('.recentClass').style = "background-color:#008ba7";
        this.template.querySelector('.favClas').style = " background-color: transparent;color:black;";
        this.template.querySelector('.completeClass').style = " background-color: transparent;color:black;";
        this.template.querySelector('.progressClass').style = " background-color: transparent;color:black;";
        this.template.querySelector('.onDemand').style = "background-color:transparent;color:black;";
        this.page = 1;
        this.currentArray = [];
        this.allClassArray.forEach(ca => {
            //TODO : currentItem
            //this.currentArray.push(ca);
            if(ca.Attendee_Name_del__c == this.currentUserContact && ( ca.btnLabel == 'COMPLETED' || ca.btnLabel == 'RESUME')){
                this.currentArray.push(ca);
            }
        });
        this.paginationHandler();

    }
    async handleFavUnderline() {
        this.currentTab == 'Fav';
        this.loading = true;
        this.showFavLine = true;
        this.showCompletedLine = false;
        this.showInProgressLine = false;
        this.showRecentLine = false;
        this.template.querySelector('.recentClass').style = " background-color: transparent;color:black;";
        this.template.querySelector('.favClas').style = "background-color:#008ba7";
        this.template.querySelector('.completeClass').style = " background-color: transparent;color:black;";
        this.template.querySelector('.progressClass').style = " background-color: transparent;color:black;";
        this.template.querySelector('.onDemand').style = "background-color:transparent;color:black;";
        await allEntitySubs()
            .then(result => {
                console.log('outside : ', JSON.stringify(result));
                //console.log('visible array : ',JSON.stringify(this.visibleCardElementArray));
                if (result) {
                    console.log('result : ', JSON.stringify(result));
                    //console.log(' inside visible array : ',JSON.stringify(this.visibleCardElementArray));
                    this.currentArray = [];
                    this.page = 1;
                    result.forEach(es => {
                        //TODO : currentItem
                        this.allClassArray.forEach(cls => {
                            //TODO : currentItem
                            if (cls.Attendee_Name_del__c == this.currentUserContact && es.ParentId == cls.scliId) {
                                console.log('class name : ', cls.Name);
                                cls.classFavStatus = true;
                                this.currentArray.push(cls);
                            }
                        });
                    });
                }
            })
        this.paginationHandler();
        console.log('visible arr in fav : ', JSON.stringify(this.visibleRecords));
    }
    handleCompletedUnderline(event) {
        this.currentTab == 'Complete';
        this.loading = true;
        this.showFavLine = false;
        this.showCompletedLine = true;
        this.showInProgressLine = false;
        this.showRecentLine = false;
        this.template.querySelector('.recentClass').style = " background-color: transparent;color:black;";
        this.template.querySelector('.favClas').style = " background-color: transparent;color:black;";
        this.template.querySelector('.completeClass').style = "background-color:#008ba7";
        this.template.querySelector('.progressClass').style = " background-color: transparent;color:black;";
        this.template.querySelector('.onDemand').style = "background-color:transparent;color:black;";
        this.page = 1;
        this.currentArray = [];
        this.allClassArray.forEach(ca => {
            //TODO : currentItem
            if (ca.Attendee_Name_del__c == this.currentUserContact && ca.btnLabel == 'COMPLETED') {
                this.currentArray.push(ca);
            }
        });
        this.paginationHandler();
    }
    handleInProgressUnderline(event) {
        this.currentTab == 'InProg';
        this.loading = true;
        this.showFavLine = false;
        this.showCompletedLine = false;
        this.showInProgressLine = true;
        this.showRecentLine = false;
        this.template.querySelector('.recentClass').style = " background-color: transparent;color:black;";
        this.template.querySelector('.favClas').style = " background-color: transparent;color:black;";
        this.template.querySelector('.completeClass').style = " background-color: transparent;color:black;";
        this.template.querySelector('.progressClass').style = "background-color:#008ba7";
        this.template.querySelector('.onDemand').style = "background-color:transparent;color:black;";
        this.page = 1;
        this.currentArray = [];
        this.allClassArray.forEach(ca => {
            //TODO : currentItem
            if ( ca.Attendee_Name_del__c == this.currentUserContact && ca.btnLabel == 'RESUME') {
                this.currentArray.push(ca);
            }
        });
        this.paginationHandler();
    }
    handleInOndemandUnderline(event) {
        try{
            this.showFavLine = false;
            this.loading = true;
            this.showCompletedLine = false;
            this.showInProgressLine = true;
            this.showRecentLine = false;
            this.template.querySelector('.recentClass').style = " background-color: transparent;color:black;";
            this.template.querySelector('.favClas').style = " background-color: transparent;color:black;";
            this.template.querySelector('.completeClass').style = " background-color: transparent;color:black;";
            this.template.querySelector('.progressClass').style = "background-color: transparent;color:black;";
            this.template.querySelector('.onDemand').style = "background-color:#008ba7";
            this.page = 1;
            this.currentArray = [];
            
            this.allClassArray.forEach(ca => {
                //TODO : currentItem
                //this.currentArray.push(ca);
                if(ca.Attendee_Name_del__c == this.currentUserContact && ca.btnLabel == 'PLAY ON-DEMAND'){
                    this.currentArray.push(ca);
                }
            });
            this.paginationHandler();
            console.log('checkkk2 : ');
            //this.paginationHandlerForPlayOnDemand();
        }
        catch(error){
            console.log('errrrr : ',error, error.message,JSON.stringify(error));
        }
    }
    recentFlag = false;
    renderedCallback() {
        if (!this.recentFlag) {
            this.handleRecentUnderline();
            this.recentFlag = true;
        }
    }
    @track currentUserContact;
    @track unAssociateFavRecords = [];
    @wire(getAllFavClasses)
    async getFavoriteClass({ data, error }) {
        console.log('fav data : ', JSON.stringify(data));
        if (data) {
            let attendeeData = data;
            let tempArr = [];
            let BaseUrl;
            await getBaseUrl()
            .then((result) => {
                if (result) {
                    console.log('base url in fav : ', result);
                    BaseUrl = result;
                }
            })
            .catch(error => {
                console.log('error in baseurl : ', JSON.stringify(error));
            })

            let ContactId = '';
            await getUserContactId()
            .then(result => {
                if (result) {
                    ContactId = result;
                    this.currentUserContact = result;
                }
            })
            .catch(error => {
                console.log('getUserContactId error : ', error);
            })
            //console.log('scArr : ',JSON.stringify(scArr));
            try {
                attendeeData.forEach(r => {
                    let a = JSON.parse(JSON.stringify(r));
                    let conId;
                    if (a.Schedule_Class_Line_Item_del__r != undefined) {
                        //console.log('lineItem : ',JSON.stringify(a.Schedule_Class_Line_Item_del__r));
                        //console.log('fieldCheck : ',a.Schedule_Class_Line_Item_del__r.Schedule_Class__r.hasOwnProperty('Schedule_Class__r'));
                        conId = a.Schedule_Class_Line_Item_del__r.Schedule_Class__r.ContentVersionId__c ?? '';
                    }
                    if (conId != undefined && conId != '') {
                        //var imageUrl = urlCreator.createObjectURL();
                        //sc.scImage = sc.ContentImageUrl__c;
                        console.log('BaseUrl : ', BaseUrl);
                        let burl = BaseUrl.replace("site", "force");
                        let finalBaseUrl = burl.replace("my", "file");
                        console.log('finalBaseUrl ', finalBaseUrl);
                        //Sandbox return url - https://parkinsonfoundationofthenationalca--pfncadna.sandbox.my.site.com
                        //Sandbox baseUrl - https://parkinsonfoundationofthenationalca--pfncadna.sandbox.file.force.com
                        //a.scImage = 'https://parkinsonfoundationofthenationalca--pfncadna.sandbox.file.force.com'+'/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId='+conId;
                        a.scImage = finalBaseUrl + '/sfc/servlet.shepherd/version/download/' + conId;
                    } else {
                        a.scImage = this.defaultSCImage;
                    }
                    console.log('scImageee : ', a.scImage);
                    //a.scImage = this.defaultSCImage;
                    a.classFavStatus = false;
                    // a.instructorFavStatus = false;
                    // a.articleFavStatus = false;
                    //a.instructorName = 'Kristain Bain';
                    // a.classTime = '05:00/TUE';
                    //a.Class_Status__c = 'JOIN';
                    if (!a.Class_Status__c) {
                        a.Class_Status__c = 'NONE';
                    }
                    if (a.Schedule_Class_Line_Item_del__r != undefined) {
                        let e = a.Schedule_Class_Line_Item_del__r;
                        //let e = JSON.parse(JSON.stringify(scli));
                        //e.action = 'EDIT';
                        let jd = new Date(e.BWPS_ClassDate__c);
                        let jd1 = new Date();
                        jd.setHours(0, 0, 0, 0);
                        jd1.setHours(0, 0, 0, 0);
                        console.log(' array date : ', jd);
                        console.log(' current date : ', jd1);
                        if (jd.valueOf() == jd1.valueOf()) {
                            a.Day = 'TODAY';
                        }
                        else {
                            a.Day = e.BWPS_ClassDay__c.toUpperCase();
                        }
                        if (e.BWPS_StartTime__c != undefined) {
                            let sTime = this.convertTimeInString(String(e.BWPS_StartTime__c));
                            a.scliStartTime = sTime;
                        }
                        else {
                            a.scliStartTime = '00:00 AM';
                        }
                        let sig = e.Schedule_Class__r.Integrity__c;
                        console.log('single intensity : ', e.Schedule_Class__r.Integrity__c);
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
                        console.log('before split : ',);
                        console.log('date split : ', e.BWPS_ClassDate__c);
                        a.Schedule_Class_Line_Item_del__r = e;
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
                    }
                    tempArr.push(a);
                });
            }
            catch (error) {
                console.log('error coming : ', error.message, error.stack, error.lineNumber);
            }
            console.log('after processs : ', JSON.stringify(tempArr));
            //this.allClassArray = tempArr;
            //this.currentArray = tempArr;
            let allPlayOnDemandArr = tempArr;

            // tempArr.forEach(i => {
            //     if (i.Attendee_Name_del__c == ContactId) {
            //         this.allClassArray.push(i);
            //     }
            //     allPlayOnDemandArr.push(i);
            // });

            //let tArr = [];
            allEntitySubs()
            .then(result => {
                console.log('outside22 : ', JSON.stringify(result));
                //console.log('visible array : ',JSON.strClass_Status__cingify(this.visibleCardElementArray));
                if (result) {
                    console.log('result22 : ', JSON.stringify(result));
                    //console.log(' inside visible array : ',JSON.stringify(this.visibleCardElementArray));
                    result.forEach(es => {
                        //TODO : currentItem
                        allPlayOnDemandArr.forEach(cls => {
                            //TODO : currentItem
                            if (es.ParentId == cls.Schedule_Class_Line_Item_del__r.Id) {
                                // console.log('class name : ',cls.Name);
                                cls.classFavStatus = true;
                            }
                        });
                    });
                }
            })
            .catch(error => {
                console.log('errrr : ',error, error.message, JSON.stringify(error));
            })
            this.allClassArray = allPlayOnDemandArr;
            console.log('this.allClassArray : ',JSON.stringify(this.allClassArray));
            console.log('this.ContactId : ',ContactId);
            let count = 1;
            this.allClassArray.forEach(i => {
                console.log('attName Contact  : ',i.Attendee_Name_del__c +" : ",ContactId);
                if (i.Attendee_Name_del__c == ContactId) {
                    console.log('name count  : ',i.Schedule_Class_Line_Item_del__r.Name +" : ",count);
                    count = count + 1;
                    if(i.btnLabel == 'COMPLETED' || i.btnLabel == 'RESUME'){
                        this.currentArray.push(i);
                    }
                    //this.currentArray.push(i);
                    //tArr.push(i);
                }
                else if(i.btnLabel == 'COMPLETED' || i.btnLabel == 'RESUME' || i.btnLabel == 'PLAY ON-DEMAND'){
                    this.unAssociateFavRecords.push(i);
                }
            });

            //this.unAssociateFavRecords = allPlayOnDemandArr;
            console.log('allPlayOnDemandArr : ',JSON.stringify(allPlayOnDemandArr));
            console.log('unAssociateFavRecordss : ',JSON.stringify(this.unAssociateFavRecords));
            this.paginationHandler();
        }
        if (error) {
            console.log('error : ', error);
        }
    }
    convertTimeInString(timeStr) {
        var timeInHours = ((Number(timeStr) / 1000) / 60) / 60;
        var finalTimeStr;
        if (timeInHours == 0) {
            finalTimeStr = '12:00 AM';
        } else {
            var isInteger = Number.isInteger(timeInHours)
            let timeOfDay = timeInHours < 12 ? ' AM' : ' PM';
            timeInHours -= timeInHours <= 12 ? 0 : 12;
            if (isInteger) {
                finalTimeStr = String(timeInHours).padStart(2, '0') + ':00' + timeOfDay;
            } else {
                var hours = String(timeInHours).split('.')[0];
                var decimalMins = String(timeInHours).split('.')[1];
                // convert decimalMin to seconds
                decimalMins = (String(decimalMins)[0]) + '.' + (String(decimalMins).substr(1));
                var min = Math.round(6 * decimalMins);
                finalTimeStr = String(hours).padStart(2, '0') + ':' + String(min).padStart(2, '0') + '' + timeOfDay;
            }
        }
        return finalTimeStr;
    }
    paginationHandler() {
        // this.end = 0;
        // this.start = 0;
        // this.end = (this.page * this.pageSize);
        // this.start = this.end - 3;
        this.visibleRecords = [];
        for (let i = 0; i < this.currentArray.length; i++) {
            if (this.currentArray[i]) {
                if (this.currentTab == 'Recent') {
                        this.visibleRecords.push(this.currentArray[i]);
                    // if (this.currentArray[i].Is_Present__c == 'Present') {
                    //     this.visibleRecords.push(this.currentArray[i]);
                    // }
                }
                else {
                    this.visibleRecords.push(this.currentArray[i]);
                }
            }
        }
        this.loading = false;
        if (this.visibleRecords.length <= 0) {
            this.noRecordFlag = true;
        }
        else {
            this.noRecordFlag = false;
        }
        console.log('VisibleArray : ', JSON.stringify(this.visibleRecords));

    }
    paginationHandlerForPlayOnDemand() {
        // this.end = 0;
        // this.start = 0;
        // this.end = (this.page * this.pageSize);
        // this.start = this.end - 3;
        this.visibleRecords = [];
        for (let i = 0; i < this.unAssociateFavRecords.length; i++) {
            if (this.unAssociateFavRecords[i].btnLabel == 'PLAY ON-DEMAND') {
                this.visibleRecords.push(this.unAssociateFavRecords[i]);
            }
        }
        this.loading = false;
        if (this.visibleRecords.length <= 0) {
            this.noRecordFlag = true;
        }
        else {
            this.noRecordFlag = false;
        }
        console.log('VisibleArray : ', JSON.stringify(this.visibleRecords));

    }
    handlePrev(event) {
        this.template.querySelector(".slider").scrollLeft -= 368;
    }
    handleNext(event) {
        this.template.querySelector(".slider").scrollLeft += 368;
    }

    // NextHandler(){
    //     console.log('Next Handler : ');
    //     if(this.page < (this.currentArray.length/this.pageSize)){
    //         this.page++;
    //         this.paginationHandler();
    //     }
    // }
    // PreviousHandler(){
    //     console.log('Previous Handler : ');
    //     if(this.page > 1){
    //         this.page--;
    //         this.paginationHandler();
    //     }
    // }

    favoriteHandler(event) {
        console.log('fav click : ');
        let classId = event.target.dataset.id;
        let classStatus = event.target.dataset.isfav;
        //console.log('classStatus : ',classStatus);
        follow({ recId: classId, isFollowing: classStatus })
            .then(result => {
                //console.log('response : ',result);
                if (result == true) {
                    this.visibleRecords.forEach(e => {
                        //TODO : currentItem
                        if (String(e.scliId) == classId) {
                            e.classFavStatus = true;
                            this.template.querySelector('c-toast-message').showToast('success', 'Favorite successfully.');
                            //console.log('if true class status : ',e.classFavStatus);
                        }
                    });
                }
                else if (result == false) {
                    this.visibleRecords.forEach(e => {
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
                console.log('error', this.error)
            });
        console.log("fire");
        const custEvent = new CustomEvent(
            'callpasstoparent', {
            detail: 'false'
        });
        this.dispatchEvent(custEvent);
        this.template.querySelector('c-toast-meassage').showToast('success', 'Mail sent successfully.');
        this.hideSendModalBox();
    }
    viewAllNavigationHandler() {
        window.open('/PFNCADNA/s/myclassespage', '_self');
        // window.open('/s/myclassespage','_self');
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