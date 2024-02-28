import { LightningElement, track, wire } from 'lwc';
import greenTick from '@salesforce/resourceUrl/greenRight';
import redCross from '@salesforce/resourceUrl/redCross';
import blurRight from '@salesforce/resourceUrl/blurRight';
import blurCross from '@salesforce/resourceUrl/blurCross';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import myResource from '@salesforce/resourceUrl/Bell_Icon';
import fetchUserDetail from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
import CaseData from '@salesforce/apex/BWPS_NeedHelpcaseCreate.createCase';
import getCaseNumber from '@salesforce/apex/BWPS_NeedHelpcaseCreate.getCaseNumber';
import BWPS_GetClassHistory from '@salesforce/apex/BWPS_GuestUserHistoryClass.BWPS_GetClassHistory';
import BWPS_GetClassCount from '@salesforce/apex/BWPS_GuestUserHistoryClass.BWPS_GetClassCount'
import fetchNotification from '@salesforce/apex/Bwps_getuserNotification.getUserNotification';

export default class TakeAttendanceInstructorDashboard extends LightningElement {
    @track bellIcon = myResource;
    @track green = greenTick;
    @track red = redCross;
    @track blurRightIcon = blurRight;
    @track blurCrossIcon = blurCross;
    @track notrecords = [];
    @track notificationVisibel = [];
    @track totalNotifications = 0;
    @track notesaction = false;
    @track JSONArray = [];
    count;
    @track userImg = `${allIcons}/PNG/Instructor-Image.png `;
    activeLink1 = false;
    activeLink2 = false;
    wiredClass;
    @track rowLimit = 5;
    rowOffSet = 0;
    @track showMoreData = true;
    @track showNotificationFlag = false;
    @track isShowModal = false;
    @track isShowNextModal = false;
    userName;
    userEmail;
    @wire(fetchUserDetail)
    wiredUser({ error, data }) {
        if (data) {
            var userData = data;
            console.log('data>>>', userData);
            //this.profileImg = this.userData.MediumPhotoUrl;
            this.userName = userData.Name;
            this.userEmail = userData.Email;
            console.log('userData>>>', this.userName, this.userEmail);
        } else if (error) {
            var error = error;
            console.log('erroeeee>>>', error);
        }
    }
    showNotificationMethod() {
        this.showNotificationFlag = !this.showNotificationFlag;
    }
    clickHandlerActive1() {
        this.activeLink1 = true;
        this.activeLink2 = false;
        this.template.querySelector('.sort-filter-link1').className = 'sort-filter-link1 sort-filter-active';
        this.template.querySelector('.sort-filter-link2').className = 'sort-filter-link2 sort-filter-deactive';
        if (this.rev == 1) {
            this.reverseJSON();
            this.rev = 0;
        }
    }

    clickHandlerActive2() {
        this.activeLink2 = true;
        this.activeLink1 = false;
        this.template.querySelector('.sort-filter-link2').className = 'sort-filter-link2 sort-filter-active';
        this.template.querySelector('.sort-filter-link1').className = 'sort-filter-link1 sort-filter-deactive';
        if (this.rev == 0) {
            this.reverseJSON();
            this.rev = 1;
        }
    }
    rev = 0;
    reverseJSON() {
        this.JSONArray = this.JSONArray.sort().reverse();
    }
    backClick() {
        window.history.back();
    }
    @wire(BWPS_GetClassCount)
    wiredClass({ data, error }) {
        if (data) {

        }
        else if (error) {
            let error = error;
        }
    }
    connectedCallback() {
        BWPS_GetClassCount()
            .then(result => {
                this.count = result.length;
                console.log('OUTPUT : ', this.count);
            })
        this.loadData();

    }
    // renderedCallback() {
    //     window.addEventListener( 'scroll', (e) => {this.handleScroll(e)});
    // }

    // handleScroll(event) {
    //     let element= this.template.querySelector('.lazyLoadData')
    //       if ( window.scrollY > element.offsetHeight + 440) { 
    //         //   if(!this.loaded) {
    //             console.log("can use to load some more content here for infinite scrolling", window.scrollY, window.innerHeight, element.offsetHeight); 
    //             this.loaded = true;
    //             this.loadMoreData({"target": {"isLoading": false}});
    //         //   }

    //     //   } else {
    //     //     this.loaded = false;
    //       }
    // }
    loadData() {
        return BWPS_GetClassHistory({ limitSize: this.rowLimit, offset: this.rowOffSet })
            .then(result => {
                if (result.length == 0) {
                    this.showMoreData = false;
                }
                else {
                    if (result.length < this.rowLimit) {
                        this.showMoreData = false;
                    }
                    else {
                        this.showMoreData = true;
                    }
                    var data = result;
                    //this.count=0;
                    console.log(data);
                    for (let i = 0; i < data.length; i++) {
                        var date = data[i].Schedule_Class_Line_Item_del__r.BWPS_ClassDate__c.split('-');
                        console.log('OUTPUT : ', JSON.stringify(date));
                        var sortedDate = date[1] + '/' + date[2] + '/' + date[0];
                        var scitem = data[i].Schedule_Class_Line_Item_del__r;
                        //this.count+=1;
                        console.log('data[i].Id : ' + data[i].Id);
                        var obj = {
                            Id: data[i].Schedule_Class_Line_Item_del__c,
                            Date: sortedDate,
                            Name: data[i].Schedule_Class_Line_Item_del__r.Name,
                            InstructorName: scitem.Schedule_Class__r.BWPS_instructor__r.Name,
                            Image: this.userImg
                        }
                        this.JSONArray.push(obj);
                    } console.log('JSON Array>>>>', JSON.stringify(this.JSONArray));

                }
            }).catch(error => {
                var error = error;
            });

    }

    loadMoreData(event) {
        let currentRecord = this.JSONArray;
        const { target } = event;
        target.isLoading = true;

        this.rowOffSet = this.rowOffSet + this.rowLimit;
        this.loadData()
            .then(() => {
                target.isLoading = false;
            });
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

        }
        else if (error) {
            var error = error;
            console.log('errorfghgg>>> ', JSON.stringify(error));
        }
    }
    @track lineItemId;
    handleReport(e) {
        this.lineItemId = e.target.dataset.id;
        console.log('OUTPUT lineItemId: ', this.lineItemId);
        this.isShowModal = true;

    }
    hideModalBox() {
        this.isShowModal = false;
        this.isShowNextModal = false;
    }
    @track caseNumber;
    @track caseTemp;
    @track CaseRecords;
    @track Title = '';
    @track Description = '';
    @track showButton = true;
    handleSubmitClick() {
        this.Title = this.template.querySelector(`[data-id= 'Subject']`).value.trim();
        this.Description = this.template.querySelector(`[data-id= 'Description']`).value.trim();
        var Subject = this.template.querySelector(`[data-id= 'Subject']`).value;
        var Body = this.template.querySelector(`[data-id= 'Description']`).value;

        if (this.Title == "" || this.Description == "") {
            if (this.Title == "") {
                this.template.querySelector(`[data-id= 'Subject']`).className = "card-error-input";
            }
            if (this.Description == "") {
                this.template.querySelector(`[data-id= 'Description']`).className = "card-error-desc";
            }

        }
        else {
            this.notesaction = true;
            this.caseTemp = {
                "CaseData": {
                    "Subject": Subject,
                    "Body": Body,
                    "Email": this.userEmail,
                    "Name": this.userName
                }
            }
            console.log('Temp : ', JSON.stringify(this.caseTemp));
            CaseData({ CaseMap: this.caseTemp, lineItemId: this.lineItemId })
                .then(result => {
                    this.CaseRecords = result;
                    this.isShowModal = false;
                    this.notesaction = true;
                    console.log(this.CaseRecords);
                    getCaseNumber({ CaseId: this.CaseRecords })
                        .then(result => {
                            this.caseNumber = result[0].CaseNumber;
                            console.log("output", result);
                            console.log(this.caseNumber);
                            if (this.caseNumber != '') {
                                this.notesaction = false;
                                this.isShowNextModal = true;

                            }
                        })
                    //this.dispatchEvent(custEvent);
                })
                .catch(error => {
                    this.notesaction = false;
                    console.log('error>>>', error.Message);
                });

        }
        // console.log('OUTPUT : ',this.CaseRecords);       
    }
}