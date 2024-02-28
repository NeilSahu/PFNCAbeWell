import { LightningElement, track, api, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import BELLICON from '@salesforce/resourceUrl/Bell_Icon';
import fetchUserDetail from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
import fetchNotification from '@salesforce/apex/Bwps_getuserNotification.getUserNotification';
import createOpportunityForCurrentUser from '@salesforce/apex/BWPS_BecomeAMember.createOpportunityForCurrentUser';
import CheckPaymentStatus from '@salesforce/apex/CommunityAuthController.CheckPaymentStatus';
// import updateUserProfile from '@salesforce/apex/CommunityAuthController.updateUserProfile';
import updateUserProfile from '@salesforce/apex/CommunityAuthController.updateUserProfileViaApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Welcomepage extends LightningElement {
    userData
    @track profileImg
    @track userName
    @track userFirstName
    @track logoutUrl
    @track showNotificationFlag = false;
    @track isMember = true;
    @track currentUserName;

    error
    @track totalNotifications = 0;
    @track reamainingPassDays = 0;
    @track totaldays = 14;
    BELLICON = BELLICON;
    @track notrecords = [];
    @track notificationVisibel = [];

    showSpinner = false;
    //@api GatewayId = '';
    @api OppId;
    flowcall = false;
    flowApiName = "PaymentAccept";
    get flowInputVariables() {
        console.log('this.OppId get ', this.OppId);
        return [
            {
                name: "DonorId",
                type: "String",
                value: this.OppId,//"0063C00000JqTWUQA3",//"a1D3C000000o66TUAQ",// this.OppId,
            }
        ];
    }
    handleFlowStatusChange(event) {

    }
    async offpay() {
        this.flowcall = false;
        //  console.log('this.OppIds offpay',this.OppIds);
        //  console.log('opds ',this.OppIds);
        this.showSpinner = true;
        await CheckPaymentStatus({ oppId: this.OppId })
            .then((result) => {
                this.showSpinner = false;
                console.log("INSIDE OFF PAY RESULT : ", this.currentUserName);

                if (result == 'Approved') {
                    updateUserProfile({ Username: this.currentUserName })
                        .then((result) => {
                            console.log('result update profile ', result);
                            if (result == null || result == undefined) {
                                this.showErrorToast();
                            }
                            console.log('result update profile 3 ', result);
                            if(result == '"Profile Updated Successfully"'){
                            console.log('result update profile 2 ', result);
                                // location.reload();
                                refreshApex(this.wiredUserData);
                                // this.isMember = true;
                            }
                        })
                        .catch((error) => {
                            this.error = error;
                            this.errorCheck = true;
                            this.errorMessage = error.body.message;
                            console.log('this.errorMessage ', this.errorMessage);
                            this.showErrorToast();
                        });
                }
                else if (result == 'Failed') {
                    //    this.showErrorToastpayment();
                    this.showErrorToast();


                }
                else if (result == 'Error') {
                    //  console.log('result inside else if 2',result);
                    this.showErrorToast();
                }
            })
            .catch((error) => {
                this.error = error;
                console.log('this.errorMessage ', error);

            });
    }



    showErrorToast() {
        const evt = new ShowToastEvent({
            title: 'Oops! An error occured',
            message: 'please check your email and password again or contact your systemadmin',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }


    dateFormatter(dateString) {
        const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric', dayPeriod: undefined });

        const formattedDate = formatter.format(dateString)
            .replace(/(\d)(?:st|nd|rd|th)?$/, '$1' + getSuffix(dateString.getDate()));
        function getSuffix(day) {
            switch (day) {
                case 1:
                case 21:
                case 31:
                    return 'st';
                case 2:
                case 22:
                    return 'nd';
                case 3:
                case 23:
                    return 'rd';
                default:
                    return 'th';
            }
        }

        return formattedDate;
    }

    currentFormattedDate = this.dateFormatter(new Date());

    @track wiredUserData;
    @wire(fetchUserDetail)
    // wiredUser({ error, data }) {
    wiredUser(wireResult) {
        //this.wiredUserData = {error, data};
        const { data, error } = wireResult;
        this.wiredUserData = wireResult;
        if (data) {
            this.userData = data;
            console.log('data>>>', data);
            this.profileImg = this.userData.MediumPhotoUrl;
            this.userName = this.userData.Name;
            let userFullName = this.userName;
            this.userFirstName = userFullName.split(' ')[0];
            console.log('profileName : ', this.userData.Profile.Name);
            if (this.userData.Profile.Name == 'Member User') {
                this.isMember = true;
            }else{
                this.isMember = false;
            }
            
            //calculate remaining days of guest pass
            if(this.userData.Profile.Name == 'Guest User'){
                let passDate = new Date();
                console.log('memberDate : ',this.userData.MemberPassDate__c);
                if (this.userData.MemberPassDate__c != null && this.userData.MemberPassDate__c != undefined && this.userData.MemberPassDate__c != '') {
                    passDate = new Date(this.userData.MemberPassDate__c);
                    // passDate = new Date('2023-03-15');
                }
                let today = new Date();
                today.setHours(0, 0, 0, 0);
                passDate.setHours(0, 0, 0, 0);
                console.log('passDate : ',passDate);
                console.log('today : ',today);
                if (passDate <= today) {
                    console.log('totaldays : ',this.totaldays);
                    let days = this.totaldays - ( today.getDate() - passDate.getDate() );
                    console.log('days : ',days);
                    if(days > 0 && days <= 14){
                        this.reamainingPassDays = days;
                    }else{
                        this.reamainingPassDays = 0;
                    }
                } 
            }

        } else if (error) {
            this.error = error;
            console.log('erroeeee>>>', error);
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
    showNotificationMethod() {
        this.showNotificationFlag = !this.showNotificationFlag;
    }
    navigateToParticipate() {
        window.open('/PFNCADNA/s/guestuserhowtoparticipate', '_self');
    }
    async navigateToBecomeMember() {
        // window.open('/PFNCADNA/s/guestuserbecomemember', '_self');

        this.showSpinner = true;

        let result = await createOpportunityForCurrentUser();

        console.log('OUTPUT RESULT NTBM: ', result);
        this.OppId = result.split(",")[0];
        this.currentUserName = result.split(",")[1];

        this.showSpinner = false;
        this.flowcall = true;
    }


}