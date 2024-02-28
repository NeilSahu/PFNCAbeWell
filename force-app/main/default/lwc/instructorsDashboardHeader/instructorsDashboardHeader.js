import { LightningElement, wire, track, api } from 'lwc';
import HeaderLogo from '@salesforce/resourceUrl/BewellLogo';
import UserLogo from '@salesforce/resourceUrl/UserLogo';
import Id from '@salesforce/user/Id';
import notificationIcon from '@salesforce/resourceUrl/notificationIcon';
import fetchUserDetail from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
//import getLogoutUrl from '@salesforce/apex/applauncher.IdentityHeaderController.getLogoutUrl';
import basePath from '@salesforce/community/basePath';
import myImage from '@salesforce/resourceUrl/ExerciseImage';
import imageResoure1 from '@salesforce/resourceUrl/WebsiteGeneralHeader';
import imageResoure from '@salesforce/resourceUrl/instructorDashboard';
import fetchNotification from '@salesforce/apex/Bwps_getuserNotification.getUserNotification';

export default class InstructorsDashboardHeader extends LightningElement {
    userId = Id
    Header_logo = HeaderLogo;
    User_logo = UserLogo;
    userData;
    url_string;
    bellIcon = notificationIcon;
    @track showNotificationFlag = false;
    @track profileImg
    @track userName
    @track userFirstName
    @track logoutUrl
    @track showProfileMenu = false;
    error
    @track ExerciseImage = myImage;
    @track notificationCountVisibility = false;
    @track notificationCount = 0;
    @track totalRecords = [
        { id: "1", image: this.ExerciseImage, Name: "Kirsten Bodensteiner" }
    ];
    basePath = basePath

    img_Home = imageResoure1 + '/Home.svg';
    img_Close = imageResoure1 + '/Close.svg';

    menuIcon = imageResoure + '/instructorDashboard/menu.png';
    calendarIcon = imageResoure + '/instructorDashboard/calendar.png';
    classesIcon = imageResoure + '/instructorDashboard/classes.png';
    notesIcon = imageResoure + '/instructorDashboard/notes.png';
    dashboardIcon = imageResoure + '/instructorDashboard/dashboard.png';
    classroomIcon = imageResoure + '/instructorDashboard/classroom.png';
    ResourcesIcon = imageResoure + '/instructorDashboard/resources.png';
    SupportIcon = imageResoure + '/instructorDashboard/support.png';
    ReferralIcon = imageResoure + '/instructorDashboard/referral.png';

    @track notificationVisibel = [];
    @wire(fetchNotification)
    wiredData({ data, error }) {
        if (data != null && data != '' && data != undefined) {
            console.log('Result Got : ' + data);
            var notificationData = JSON.parse(JSON.parse(data));
            if (notificationData.notifications == undefined) {
                this.notificationCountVisibility = true;
                this.notificationCount = 0;
            }
            else {
                this.notificationCountVisibility = true;
                this.notificationCount = notificationData.notifications.length;
            }
        } else {
            console.log('errorfghgg>>> ', JSON.stringify(error));
        }
    }

    connectedCallback() {
        this.visibleRecords = this.totalRecords;
        this.url_string = window.location.href;
    }
    get logoutLink() {
        const sitePrefix = this.basePath.replace(/\/s$/i, ""); // site prefix is the site base path without the trailing "/s"
        return sitePrefix + "/secur/logout.jsp";
    }
    renderedCallback() {
        console.log('URL>>>>> ', this.url_string);
        try {
            if (this.url_string.includes("instructordashboardtodayclasses")) {
                this.template.querySelector(`[data-id='dis-btn-link']`).removeAttribute('href');
                this.template.querySelector(`[data-id='MyDBBtnBox']`).className = 'disable-btn-box';
                this.template.querySelector(`[data-id='MyDBBtn']`).className = 'disable-btn';
            } else if (this.url_string.endsWith('PFNCADNA/s/') || this.url_string.endsWith('PFNCADNA/s/#')) {
                this.template.querySelector(`[data-id='dis-btn-link']`).removeAttribute('href');
                this.template.querySelector(`[data-id='MyDBBtnBox']`).className = 'disable-btn-box';
                this.template.querySelector(`[data-id='MyDBBtn']`).className = 'disable-btn';
            }
            else if (this.url_string.includes("instructordashboard")) {   
                //this.template.querySelector(`[data-id='1']`).style.fontWeight = "900";
            }
            else if (this.url_string.includes("instructorclassroom")) {
                this.template.querySelector(`[data-id='2']`).style.fontWeight = "900";
            }
            // else if(this.url_string.includes("instructordashboard") {
            //      this.template.querySelector(`[data-id='1']`).style.fontWeight = "900";
            // }
            else if (this.url_string.includes("instructorresourcespage")) {
                //this.template.querySelector(`[data-id='4']`).style.fontWeight = "900";
            }
            else if (this.url_string.includes("yournotes")) {
                this.template.querySelector(`[data-id='5']`).style.fontWeight = "900";
            }
            else if (this.url_string.includes("instructorsupporttabs")) {
                this.template.querySelector(`[data-id='6']`).style.fontWeight = "900";
            }
            else if (this.url_string.includes("instructorreferralprogram")) {
                this.template.querySelector(`[data-id='7']`).style.fontWeight = "900";
            }
        }
        catch (error) {
            console.log('error : ', error.message);
        }
    }
    // getHeader(e){
    //     let targetId = e.target.dataset.id; 
    //     console.log('OUTPUT : ',targetId);
    //     if(this.url_string.includes("instructordashboard") ||this.url_string.includes("instructordashboard") ||this.url_string.includes("instructordashboard") ||
    //         this.url_string.includes("instructorresourcespage") || this.url_string.includes("instructordashboard")||this.url_string.includes("instructorsupporttabs") || this.url_string.includes("instructorreferralprogram")) {
    //             this.template.querySelector(`[data-id='2']`).style.fontWeight = "900"
    //     }
    // }
    showProfileMenuMethod() {
        window.open('/PFNCADNA/s/instructordashboardform', '_self');
        //this.showProfileMenu = !this.showProfileMenu;
    }


    @track profileOptions = false;

    showProfileOptions() {
        if (this.profileOptions) {
            this.profileOptions = false;
        }
        else {
            this.profileOptions = true;
        }
    }
    // @wire(getLogoutUrl) wirelogout({error,data}){
    //     if(data){
    //         console.log('logoutData>>>',data);
    //     } else{
    //         console.log('errorurl>>>>',error);
    //     }
    // }
    // renderedCallback(){
    // this.logoutUrl=this.logoutLink();
    // console.log('logoutURL>>>>',this.logoutUrl);

    // }
    // logoutLink() {
    //   //  const sitePrefix = basePath.replace(/\/s$/i, ""); 
    //     return  "https://parkinsonfoundationofthenationalca--pfncadna.sandbox.my.site.com/secur/logout.jsp";
    // }
    showNotifications() {
        this.showNotificationFlag = !this.showNotificationFlag;
    }
    get logoutLink() {
        const sitePrefix = basePath.replace(/\/s$/i, ""); // site prefix is the site base path without the trailing "/s"
        return sitePrefix + "/secur/logout.jsp";
    }
    logout() {
        console.log('logoutcalled');
        //     var newURL =
        //     Window.location.protocol +
        //       "//" +
        //      Window.location.host +
        //      "/" +
        //     Window.location.pathname;        
        //     Window.location.href = newURL + '/secure/logout.jsp';   
        //   //  Window.location.href = 'https://parkinsonfoundationofthenationalca--pfncadna.sandbox.my.site.com/secur/logout.jsp';
    }
    getProfileMenuItemMethod(event) {
        //window.open('/s/instructordashboardform','_self');
        let name = event.target.dataset.name;
        if (name == 'Achievements') {
            console.log('Achievements');
            window.open('/PFNCADNA/s/achievementpage', '_self');
        } else if (name == 'Class History') {
            console.log('Class History');
            window.open('/PFNCADNA/s/classhistorypage', '_self');
        } else if (name == 'Account Settings') {
            console.log('Account Settings');
            window.open('/PFNCADNA/s/accountsetting', '_self');
        } else if (name == 'Profile Survey') {
            console.log('Profile Survey');
            window.open('/PFNCADNA/s/profileserveypage', '_self');
        } else if (name == 'Payment Method') {
            console.log('Payment Method');
            window.open('/PFNCADNA/s/paymentmethodpage', '_self');
        } else if (name == 'Payment History') {
            console.log('Payment History');
            window.open('/PFNCADNA/s/paymenthistorypage', '_self');
        } else if (name == 'Waiver') {
            console.log('Waiver');
            window.open('/PFNCADNA/s/waiverpage', '_self');
        } else if (name == 'Support') {
            console.log('Support');
            window.open('/PFNCADNA/s/supportpage', '_self');
        } else if (name == 'Notifications') {
            console.log('Notifications');
            window.open('/PFNCADNA/s/notificationpage', '_self');
            //notificationpage
        }
    }


    @wire(fetchUserDetail)
    wiredUser({ error, data }) {
        if (data) {
            try {
                this.userData = data;
                console.log('data>>>', data);
                this.profileImg = this.userData.MediumPhotoUrl;
                this.userName = this.userData.Name;
                let userFullName = this.userName;
                this.userFirstName = (userFullName.split(' ')[0]);
            }
            catch (error) {
                console.log('errr : ', error.message);
            }
        } else if (error) {
            this.error = error;
            console.log('erroeeee>>>', error);
        }
    }
    // Close notification Button
    handleClose(e) {
        this.showNotificationFlag = e.detail;
    }


    @track mobileHeaderMenuOptions = false;
    showMobileHeaderMenuOptions() {
        this.mobileHeaderMenuOptions = !this.mobileHeaderMenuOptions;
    }
    // navigateToCalendar(){
    //     window.open("/PFNCADNA/s/instructordashboard","_self");
    // }
}