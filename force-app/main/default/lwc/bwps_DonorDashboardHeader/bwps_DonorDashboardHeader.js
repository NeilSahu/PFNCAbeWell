import { LightningElement, wire,track} from 'lwc';
//import HeaderLogo from '@salesforce/resourceUrl/HeaderLogo';
import imageResoure from '@salesforce/resourceUrl/WebsiteGeneralHeader';
import UserLogo from '@salesforce/resourceUrl/UserLogo';
import Id from '@salesforce/user/Id';
import fetchUserDetail from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
//import getLogoutUrl from '@salesforce/apex/applauncher.IdentityHeaderController.getLogoutUrl';
import basePath from "@salesforce/community/basePath";
import myImage from '@salesforce/resourceUrl/ExerciseImage';

export default class Bwps_DonorDashboardHeader extends LightningElement {  
    userId = Id
    
    //Header_logo = HeaderLogo;
     Header_logo = imageResoure + '/PFNCA_PrimaryLogo_Color_tm_RGB_150dpi-1@2x.png';
    User_logo = UserLogo;
    url_string;
    userData
    @track profileImg   
    @track userName
    @track userFirstName
    @track logoutUrl
    @track showProfileMenu = false;
    error;

    @track ExerciseImage = myImage;
    @track totalRecords = [
        {id : "1", image : this.ExerciseImage , Name : "Kirsten Bodensteiner"}
    ];
    connectedCallback(){
        this.visibleRecords = this.totalRecords;
        this.url_string = window.location.href;
    }
    navigateToDashboard(){
        window.open('/PFNCADNA/s/donordashboard','_self');
    }
    renderedCallback(){
        if(this.url_string.includes("donordashboard") && !this.url_string.includes("donordashboarddetails")){
            this.template.querySelector(`[data-id='dis-btn-link']`).href = '#';
            this.template.querySelector(`[data-id='MyDBBtnBox']`).className = 'disable-btn-box';
            this.template.querySelector(`[data-id='MyDBBtn']`).className = 'disable-btn';
        }
        else if(this.url_string.includes("donationpage") && !this.url_string.includes("donordashboarddetails")){
            this.template.querySelector(`[data-id='dis-btn-link-2']`).href = '#';
            this.template.querySelector(`[data-id='MyDBBtnBox-2']`).className = 'disable-btn-box';
            this.template.querySelector(`[data-id='MyDBBtn-2']`).className = 'disable-btn';
        }
        else{
            this.template.querySelector(`[data-id='dis-btn-link']`).href = '#';
            this.template.querySelector(`[data-id='MyDBBtnBox']`).className = 'disable-btn-box';
            this.template.querySelector(`[data-id='MyDBBtn']`).className = 'disable-btn';
        }
    }
    showProfileMenuMethod(){
        this.showProfileMenu = !this.showProfileMenu;
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
    get logoutLink() {
        const sitePrefix = basePath.replace(/\/s$/i, ""); // site prefix is the site base path without the trailing "/s"
        return sitePrefix + "/secur/logout.jsp";
    }
    logout(){
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
    getProfileMenuItemMethod(event){
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
        }
    }


    @wire(fetchUserDetail)
    wiredUser({ error, data }) {
        if (data) {
            this.userData = data;
            console.log('data>>>',data);
            this.profileImg = this.userData.MediumPhotoUrl;
            this.userName = this.userData.Name;
            let userFullName = this.userName;
            this.userFirstName = userFullName.split(' ')[0];
        } else if (error) {
            this.error = error;
            console.log('erroeeee>>>',error);
        }
    }
}