import { LightningElement,track,wire} from 'lwc';
// import signal from '@salesforce/resourceUrl/signal';
//import logo from '@salesforce/resourceUrl/GuestUserHeaderLogos1';
import imageResoure from '@salesforce/resourceUrl/WebsiteGeneralHeader';
import notificationIcon from '@salesforce/resourceUrl/notificationIcon';
import BrowseClasses from '@salesforce/label/c.BrowseClasses';      
import 	HowToParticipate from '@salesforce/label/c.HowToParticipate';
import FAqs from '@salesforce/label/c.FAqs';
import BLOGS from '@salesforce/label/c.BLOGS';  
import ABOUTUS from '@salesforce/label/c.ABOUTUS';
import CONTACT from '@salesforce/label/c.CONTACT';
//import Usericon from '@salesforce/resourceUrl/Usericon';
import BELLICON  from '@salesforce/resourceUrl/Bell_Icon';
import fetchUserDetail from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
import basePath from '@salesforce/community/basePath';
import fetchNotification from '@salesforce/apex/Bwps_getuserNotification.getUserNotification';
import { refreshApex } from '@salesforce/apex';

export default class GuestUserHeader extends LightningElement {
    userData
    @track profileImg   
    @track userName
    @track userFirstName
    @track logoutUrl
    @track  showNotificationFlag = false;
    @track notrecords=[];
    @track notificationVisibel=[];
    @track allNotications;
    @track totalNotifications = 0;
    @track notificationCount = 0;
    error
    showProfileMenu = false;
    // signal = signal;
    BELLICON =BELLICON;
    notificationIcon = notificationIcon;
    logo =  imageResoure + '/PFNCA_PrimaryLogo_Color_tm_RGB_150dpi-1@2x.png';
    //profileIcon=Usericon;
    BrowseClasses = BrowseClasses;
    HowToParticipate =HowToParticipate;
    FAqs=FAqs;
    BLOGS=BLOGS;
    ABOUTUS=ABOUTUS;
    CONTACT;
    url_string;
    @track firstLoad = false;
    profileCard(){
        this.showProfileMenu = this.showProfileMenu ? false : true;
        this.showNotificationFlag = false;
    }
    connectedCallback(){
        // this.visibleRecords = this.totalRecords;
        this.url_string= window.location.href;
        // this.firstLoad = false;

    }
    renderedCallback(){
       
        console.log('URL>>>>> ' ,this.url_string);
        if(this.firstLoad){
            if(this.url_string.includes("")  ){
                this.template.querySelector(`[data-id='3']`).style.fontWeight = "900";
                // this.template.querySelector(`[data-id='guestpage']`).href = '#';
                //this.template.querySelector(`[data-id='MyDBBtnBox']`).className = 'disable-btn-box';
                //this.template.querySelector(`[data-id='MyDBBtn']`).className = 'disable-btn';
            }
            if(this.url_string.includes("guestuserbrowseclasses")){
                this.template.querySelector(`[data-id='1']`).style.fontWeight = "900"; 
                this.template.querySelector(`[data-id='3']`).style.fontWeight = "500";
            }
            //  else if(this.url_string.includes("guestuserhowtoparticipate")){
            //       this.template.querySelector(`[data-id='6']`).style.fontWeight = "900";
            //  }
            else if(this.url_string.includes("guestuserdashboard")) {
                this.template.querySelector(`[data-id='2']`).style.fontWeight = "900";
                this.template.querySelector(`[data-id='3']`).style.fontWeight = "500";
            }
            // else if(this.url_string.includes("myclassespage")) {
            //      this.template.querySelector(`[data-id='4']`).style.fontWeight = "900";
            // }
            // else if(this.url_string.includes("favoritepage")) {
            //      this.template.querySelector(`[data-id='5']`).style.fontWeight = "900";
            // }
            else if(this.url_string.includes("myschedule")) {
                this.template.querySelector(`[data-id='3']`).style.fontWeight = "900";
            }
            else{
                this.template.querySelector(`[data-id='1']`).style.fontWeight = "500"; 
                this.template.querySelector(`[data-id='2']`).style.fontWeight = "500";
                this.template.querySelector(`[data-id='3']`).style.fontWeight = "500";
            }
        }
        else{
            if(this.url_string.includes("myschedule")) {
                this.template.querySelector(`[data-id='3']`).style.fontWeight = "900";
            }
            else{
                this.template.querySelector(`[data-id='1']`).style.fontWeight = "500"; 
                this.template.querySelector(`[data-id='2']`).style.fontWeight = "500";
                this.template.querySelector(`[data-id='3']`).style.fontWeight = "500";
            }
            this.firstLoad = true;
        }
    }

    @wire(fetchUserDetail)
    wiredUser({ error, data }) {
        if (data) {
            this.userData = data;
            console.log('data>>>',data);
            console.log('img>>>',this.userData.MediumPhotoUrl);

            this.profileImg = this.userData.MediumPhotoUrl;
            this.userName = this.userData.Name;
            let userFullName = this.userName;
            this.userFirstName = userFullName.split(' ')[0];
            console.log('OUTPUT12 : ');
        } else if (error) {
            this.error = error;
            console.log('erroeeee>>>',error.Message);
        }
    }

   

    navigateToHomepage() {
        window.open('/PFNCADNA/s/myschedule','_self');
    }
    navigateToGuestUserDashboard(){
      window.open('/PFNCADNA/s/myschedule','_self');
    }
    get logoutLink() {
        const sitePrefix = basePath.replace(/\/s$/i, ""); // site prefix is the site base path without the trailing "/s"
        return sitePrefix + "/secur/logout.jsp";
    }
    getProfileMenuItemMethod(event) {
        //window.open('/s/instructordashboardform','_self');
        let name = event.target.dataset.name;
        if(name == 'Achievements'){
            console.log('Achievements');
            window.open('/PFNCADNA/s/achievementpage','_self');
        }else if(name == 'Class History'){
            console.log('Class History');
            window.open('/PFNCADNA/s/classhistorypage','_self');
        }else if(name == 'Account Settings'){
            console.log('Account Settings');
            window.open('/PFNCADNA/s/accountsetting','_self');
        }else if(name == 'Profile Survey'){
            console.log('Profile Survey');
            window.open('/PFNCADNA/s/profileserveypage','_self');
        }else if(name == 'Payment Method'){
            console.log('Payment Method');
            window.open('/PFNCADNA/s/paymentmethodpage','_self');
        }else if(name == 'Payment History'){
            console.log('Payment History');
            window.open('/PFNCADNA/s/paymenthistorypage','_self');
        }else if(name == 'Waiver'){
            console.log('Waiver');
            window.open('/PFNCADNA/s/waiverpage','_self');
        }else if(name == 'Support'){
            console.log('Support');
            window.open('/PFNCADNA/s/supportpage','_self');
        }else if(name == 'Notifications'){
            console.log('Notifications');
            window.open('/PFNCADNA/s/notificationpage','_self');
            //notificationpage
        }else if(name == 'My Classes'){
            console.log('My Classes');
            window.open('/PFNCADNA/s/myclassespage','_self');
        }else if(name == 'Favorites'){
            console.log('Favorites');
            window.open('/PFNCADNA/s/favoritepage','_self');
        }else if(name == 'My Schedule'){
            console.log('My Schedule');
            window.open('/PFNCADNA/s/myschedule','_self');
        }else if(name == 'Faq'){
            console.log('Faq');
            window.open('/PFNCADNA/s/guestuserfaq','_self');
        }else if(name == 'Blog'){
            console.log('Blog');
            window.open('/PFNCADNA/s/guestuserblog','_self'); 
        }
        else if (name == 'AboutUs') {
            window.open('/PFNCADNA/s/guestuseraboutus', '_self');
        }
         else if (name == 'Ways Give') {
             window.open('/PFNCADNA/s/donationpageguest','_self');
        }
        else if(name == 'Contact'){
            console.log('Contact');
            window.open('/PFNCADNA/s/guestusercontact','_self');
        }else if(name == 'DonationHistory'){
            console.log('DonationHistory');
            window.open('/PFNCADNA/s/guestuserdonationpage','_self');
        }
    }
    navigateToDonatePage(){
        window.open('/PFNCADNA/s/donationpageguest','_self');
    }
    openNavigateToDonatePage(){
         const paymentComp = this.template.querySelector('c-bwps_-Donor-Dashboard-Donate-Form');
         paymentComp.donateClickHandler();
    }
    navigateToHowToParticipate(){
        window.open('/PFNCADNA/s/guestuserhowtoparticipate','_self');
        
         this.template.querySelector(`[data-id='6']`).className = 'font-800';
    }
    navigateToActivity(){
        window.open('/PFNCADNA/s/guestuserdashboard','_self');
         this.template.querySelector(`[data-id='2']`).className = 'font-800';
    }
    navigateToSchedule(){
        window.open('/PFNCADNA/s/myschedule','_self');
        
         this.template.querySelector(`[data-id='3']`).className = 'font-800';
    }
    navigateToClass(){
        window.open('/PFNCADNA/s/myclassespage','_self');
        
         this.template.querySelector(`[data-id='4']`).className = 'font-800';
    }
    navigateToFavorite(){
        window.open('/PFNCADNA/s/favoritepage','_self');
        
         this.template.querySelector(`[data-id='5']`).className = 'font-800';
    }
    navigateToBrowseClasses(){
        window.open('/PFNCADNA/s/guestuserbrowseclasses','_self');
         this.template.querySelector(`[data-id='1']`).className = 'font-800';
    }

    showNotificationMethod(){
        console.log('OUTPUT1 : ');
        this.showNotificationFlag = !this.showNotificationFlag;
        this.showProfileMenu = false;
     }

    @wire(fetchNotification)
    wiredData(wireNotification) {
      const {error,data} = wireNotification;
      this.allNotications = wireNotification;
      this.notificationVisibel = [];
      this.notrecords = [];
      
    if(data != null && data != '' && data != undefined){
    var notificationData =  JSON.parse(JSON.parse(data));
    console.log('OUTPUT123 : ',JSON.stringify(notificationData.notifications));

    var firstLoop = true;
    for(let i= 0;i<notificationData.notifications.length;i++){
    //  var createddate = new Date(notificationData.notifications[i].mostRecentActivityDate).toLocaleString('en-US',{timeZone : 'America/New_York'});
    // var currentdate = new Date().toLocaleString('en-US', {timeZone : 'America/New_York'});
    // var newCreatedTime = new Date(createddate).getTime();
    // var newCurrentTime = new Date(currentdate).getTime();
    var nottificationdate = new Date(notificationData.notifications[i].mostRecentActivityDate);
    var todayDate = new Date();
    var timeinMilliSec = todayDate-nottificationdate;
    // console.log('createddate : ',newCreatedTime);
    // console.log('currentdate : ',newCurrentTime);
   // var status = newCurrentTime - newCreatedTime;
    var seconds = Math.floor(timeinMilliSec / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    console.log('OUTPUT NEW: ',minutes,seconds,hours);
    if (seconds < 60 && hours==0 && minutes==0){
        status = seconds + ' sec ago';
    }
    else if(seconds > 60 && hours==0 && minutes < 60 ){
        status = minutes +' min ago';
    }
    else if(seconds > 60 && hours <24 && minutes > 60 ){
        status = hours +' hr ago';
    }
    // else if(createddate.getDate() + 1 == currentdate.getDate() ) {
    //     status = '1 day ago';
    // }
    else {
        status = 'Few days ago';
    }
    var nottificationdate = new Date(notificationData.notifications[i].mostRecentActivityDate);
    var todayDate = new Date();
    var timeinMilliSec = todayDate-nottificationdate+'ago';
    if(notificationData.notifications[i].read == false){
        this.totalNotifications+=1;
        this.notificationCount+=1;
    }
    var obj = {
       id:notificationData.notifications[i].id,
       Name:'Administrator',
       image:notificationData.notifications[i].image,
       Active__c : status,
       Message__c:notificationData.notifications[i].messageBody,
       ButtonColor: notificationData.notifications[i].read ? 'readClass':'unReadClass',
    }
     this.notrecords.push(obj);
     if(firstLoop){
        this.notificationVisibel.push(obj);
        firstLoop=false;
     }
    
    }
    
    } else {
       console.log('errorfghgg>>> ',JSON.stringify(error));
    }
    }

    handleRead(){
        refreshApex(this.allNotications);
    }

    
}