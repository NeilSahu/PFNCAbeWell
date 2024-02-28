import { LightningElement, track, api, wire } from 'lwc';
import { publish, subscribe, unsubscribe, createMessageContext, releaseMessageContext } from 'lightning/messageService';
import SENDDATA from "@salesforce/messageChannel/VimeoOff__c";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import imageResource from "@salesforce/resourceUrl/WebsiteGenFaqImage";
import doLogin from '@salesforce/apex/CommunityAuthController.doLogin';
import registerUser from '@salesforce/apex/CommunitiesSelfRegControllerGuest.registerUser';
//import registerUser from '@salesforce/apex/CommunitiesSelfRegControllerGuest.registerUser';
import isEmailExist from '@salesforce/apex/CommunityAuthController.isEmailExist';
import CheckPaymentStatus from '@salesforce/apex/CommunityAuthController.CheckPaymentStatus';
import updateUserProfile from '@salesforce/apex/CommunityAuthController.updateUserProfile';
import forgotPassword from '@salesforce/apex/CommunityAuthController.forgotPassword';
import { CurrentPageReference } from 'lightning/navigation';
const ACTIVE_NAV_CSS_CLASS = 'nav active';
const DEFAULT_NAV_CSS_CLASS = 'nav';
const ACTIVE_SUB_NAV_CSS_CLASS = 'sub-nav sub-nav-active';
const DEFAULT_SUB_NAV_CSS_CLASS = 'sub-nav';

export default class Bwps_WIP_SignInUniversal extends LightningElement {
    context = createMessageContext();
    subscription = null;
    urlStateParameters;
    @track firstName = null;
    @track lastName = null;
    @track email = null;
    @track confirmEmail = null;
    @track userName = null;
    @track password = null;
    @track confirmPassword = null;
    @track companyName = null;
    @track errorCheck;
    @track errorMessage;
    showUserName;
    @track showTermsAndConditions;
    @track showTermsAndConditionsLoading = false;
    @track infoTooltipDisplayData = {};
    @track requiredTooltipDisplayData = {};
    @track errorTooltipDisplayData = {};
    @track emailError;
    @track passwordError;
    @track isguest;
    @track showSpinner = false;
    @track userIdUpdation;
    typeOfuser ='';
     @track flowcall = false;
     //@api GatewayId ='';
     @api OppId; //'0063C00000KOfm6QAD';
      @track OppIds; //'0063C00000KOfm6QAD';
      flowApiName = "PaymentAccept";
       get flowInputVariables() {
        console.log('this.OppId get ',this.OppId);
        return [
            {
               name: "DonorId",
			type: "String",
			value: this.OppId,//"0063C00000JqTWUQA3",//"a1D3C000000o66TUAQ",// this.OppId,
            }
        ];
    }
    signinImg = imageResource + '/signinImg.png';

    showMemberForm = true;
    showGuestForm = false;
    showDonorForm = false;
    showInstructorForm = false;

    showMemberLogin = true;
    showBecomeMember = false;
    showGetAGuestPass = false;
    showGuestLogin = true;
    showGuestSignUp = false;

    memberCssClass = ACTIVE_NAV_CSS_CLASS;
    guestCssClass = DEFAULT_NAV_CSS_CLASS;
    donorCssClass = DEFAULT_NAV_CSS_CLASS;
    instructorCssClass = DEFAULT_NAV_CSS_CLASS;

    becomeMemberCssClass = DEFAULT_SUB_NAV_CSS_CLASS;
    memberLoginCssClass = ACTIVE_SUB_NAV_CSS_CLASS;
    getAGuestPassCssClass = DEFAULT_SUB_NAV_CSS_CLASS;
    guestSignUpCssClass = DEFAULT_SUB_NAV_CSS_CLASS;
    guestLoginCssClass = ACTIVE_SUB_NAV_CSS_CLASS;

    connectedCallback() {
        this.subscription = subscribe(this.context, SENDDATA, (message) => {
            console.log('msg : ', message);
            if (message.isGuest) {
                this.handleSubNavigation({target:{dataset:{subnav:'getAGuestPass'}}})
            }
        });
        // const urlParams = new URL(window.location.href).searchParams;
        // const isGuestt = urlParams.get('guest');
        // console.log('isGuest : ',isGuestt);
        // if(isGuestt){
        //     this.handleSubNavigation({target:{dataset:{subnav:'getAGuestPass'}}})
        // }
        this.showUserName = false;

        this.infoTooltipDisplayData.username = "tooltiptext usernameTooltiptext";
        this.infoTooltipDisplayData.password = "tooltiptext";

        this.requiredTooltipDisplayData.firstName = 'tooltiptext tooltipHide';
        this.requiredTooltipDisplayData.lastName = 'tooltiptext tooltipHide';
        this.requiredTooltipDisplayData.email = 'tooltiptext tooltipHide';
        //this.requiredTooltipDisplayData.username = 'tooltiptext tooltipHide';        
        //this.requiredTooltipDisplayData.hearAboutUs = 'tooltiptext tooltipHide';
        this.requiredTooltipDisplayData.password = 'tooltiptext tooltipHide';
        this.requiredTooltipDisplayData.confirmPassword = 'tooltiptext tooltipHide';

        this.errorTooltipDisplayData.email = 'tooltiptext tooltipHide';
 
        this.errorTooltipDisplayData.password = 'tooltiptext tooltipHide';
    }

    // @wire(CurrentPageReference)
    // getStateParameters(currentPageReference) {
    //    if (currentPageReference) {
    //       this.urlStateParameters = currentPageReference.state;
    //       this.setParametersBasedOnUrl();
    //     /* if(currentPageReference.state?.guest || currentPageReference.state?.guest == 'true'){
    //        this.showGuestForm = true;
    //    }*/
    // }
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        // if (currentPageReference) {
        //     console.log('Stata>. ', currentPageReference.state?.guest);
        //     if (currentPageReference.state?.guest || currentPageReference.state?.guest == 'true') {

        //         this.handleSubNavigation({target:{dataset:{subnav:'getAGuestPass'}}})
        //         // this.showMemberForm = false;
        //         // this.isguest = true;
        //         // this.showGuestForm = true;
        //         if(currentPageReference.state?.signup || currentPageReference.state?.signup == 'true'){
        //         //   this.showGuestLogin = false;
        //         //   this.showGuestSignUp = true;
        //         // this.handleSubNavigation( {target: {dataset: {subnav: "guestSignUp"}}});
        //         }
        //     }
        //     // this.setParametersBasedOnUrl();
        //     /* if(currentPageReference.state?.guest || currentPageReference.state?.guest == 'true'){
        //        this.showGuestForm = true;*/
        // }
    }
    @track firstCall = true;
    renderedCallback() {
        if (this.isguest) {
            // this.memberCssClass = DEFAULT_NAV_CSS_CLASS;
            // this.guestCssClass = ACTIVE_NAV_CSS_CLASS;
            // this.donorCssClass = DEFAULT_NAV_CSS_CLASS;
            // this.instructorCssClass = DEFAULT_NAV_CSS_CLASS;
        }
        if(this.firstCall){
            let username = this.readCookie('email');
            let userpass =  this.readCookie('pass');
            if(username != ''){
                this.template.querySelector(`[data-id='memberEmailAddress']`).value = username;
            }else{
                this.template.querySelector(`[data-id='memberEmailAddress']`).value = '';
            }
            if(userpass != ''){
                this.template.querySelector(`[data-id='memberPassword']`).value = userpass;

            }else{
                this.template.querySelector(`[data-id='memberPassword']`).value = '';
            }
            this.firstCall = false;
        }
    }
    handleNavigation(event) {
        let nav = event.target.dataset.nav;
        console.log("event : ", event.target.dataset.nav);

        if (nav == 'member') {

            this.showMemberForm = true;
            this.showGuestForm = false;
            this.showDonorForm = false;
            this.showInstructorForm = false;
            this.isguest = false;

            this.memberCssClass = ACTIVE_NAV_CSS_CLASS;
            this.guestCssClass = DEFAULT_NAV_CSS_CLASS;
            this.donorCssClass = DEFAULT_NAV_CSS_CLASS;
            this.instructorCssClass = DEFAULT_NAV_CSS_CLASS;
        }
        else if (nav == 'guest') {

            this.isguest = true;
            this.showMemberForm = false;
            this.showGuestForm = true;
            this.showDonorForm = false;
            this.showInstructorForm = false;

            this.memberCssClass = DEFAULT_NAV_CSS_CLASS;
            this.guestCssClass = ACTIVE_NAV_CSS_CLASS;
            this.donorCssClass = DEFAULT_NAV_CSS_CLASS;
            this.instructorCssClass = DEFAULT_NAV_CSS_CLASS;

        }
        else if (nav == 'donor') {
            this.isguest = false;
            this.showMemberForm = false;
            this.showGuestForm = false;
            this.showDonorForm = true;
            this.showInstructorForm = false;

            this.memberCssClass = DEFAULT_NAV_CSS_CLASS;
            this.guestCssClass = DEFAULT_NAV_CSS_CLASS;
            this.donorCssClass = ACTIVE_NAV_CSS_CLASS;
            this.instructorCssClass = DEFAULT_NAV_CSS_CLASS;


        }
        else if (nav == 'instructor') {
            this.isguest = false;
            this.showMemberForm = false;
            this.showGuestForm = false;
            this.showDonorForm = false;
            this.showInstructorForm = true;

            this.memberCssClass = DEFAULT_NAV_CSS_CLASS;
            this.guestCssClass = DEFAULT_NAV_CSS_CLASS;
            this.donorCssClass = DEFAULT_NAV_CSS_CLASS;
            this.instructorCssClass = ACTIVE_NAV_CSS_CLASS;
        }
    }

    handleSubNavigation(event) {
        const subnav = event.target.dataset.subnav;

        if (subnav == 'becomeMember') {
            this.showBecomeMember = true;
            this.showMemberLogin = false;
            this.showGetAGuestPass = false;
            this.becomeMemberCssClass = ACTIVE_SUB_NAV_CSS_CLASS;
            this.getAGuestPassCssClass = DEFAULT_SUB_NAV_CSS_CLASS;
            this.memberLoginCssClass = DEFAULT_SUB_NAV_CSS_CLASS;

        }
        else if (subnav == 'memberLogin') {
            this.showBecomeMember = false;
            this.showMemberLogin = true;
            this.showGetAGuestPass = false;
            this.becomeMemberCssClass = DEFAULT_SUB_NAV_CSS_CLASS;
             this.getAGuestPassCssClass = DEFAULT_SUB_NAV_CSS_CLASS;
            this.memberLoginCssClass = ACTIVE_SUB_NAV_CSS_CLASS;
          }
        else if (subnav == 'getAGuestPass') {
            this.showBecomeMember = false;
            this.showMemberLogin = false;
            this.showGetAGuestPass = true;

            this.becomeMemberCssClass = DEFAULT_SUB_NAV_CSS_CLASS;
            this.getAGuestPassCssClass = ACTIVE_SUB_NAV_CSS_CLASS;
            this.memberLoginCssClass = DEFAULT_SUB_NAV_CSS_CLASS;
        }
        else if (subnav == 'guestLogin') {
            this.showGuestLogin = true;
            this.showGuestSignUp = false;

            this.guestLoginCssClass = ACTIVE_SUB_NAV_CSS_CLASS;
            this.guestSignUpCssClass = DEFAULT_SUB_NAV_CSS_CLASS;
        }
        else if (subnav == 'guestSignUp') {
            this.showGuestLogin = false;
            this.showGuestSignUp = true;

            this.guestLoginCssClass = DEFAULT_SUB_NAV_CSS_CLASS;
            this.guestSignUpCssClass = ACTIVE_SUB_NAV_CSS_CLASS;
        }



    }
    handleUserNameChange(event) {

        this.username = event.target.value;
        console.log(' this.username ', this.username);
    }

    handlePasswordChange(event) {
        if (event.target.dataset.id == 'becomeMemberPassword' || event.target.dataset.id == 'guestPassword' || event.target.dataset.id == 'memberPassword' || event.target.dataset.id == 'instructorSignupPassword' || event.target.dataset.id == 'donorPassword' || event.target.dataset.id == 'GuestLoginPassword') {
            this.password = event.target.value;
        }
        //  else if (event.target.dataset.id == 'becomeMemberconfirm' || event.target.dataset.id == 'guestconfirm') {
        //     this.confirmPassword = event.target.value;
        // }
        console.log(' this.password ', this.password);
        console.log(' this.confirmPassword ', this.confirmPassword);
    }
    handleconfirmPassword(event){
       if (event.target.dataset.id == 'becomeMemberconfirm' || event.target.dataset.id == 'guestconfirm') {
            this.confirmPassword = event.target.value;
        }
    }
    async handleLogin(event) {
        this.username = this.template.querySelector(`[data-id='memberEmailAddress']`).value;
        this.password = this.template.querySelector(`[data-id='memberPassword']`).value;
        console.log('this.username ', this.username);
        console.log('this.password ', this.password);

        this.handlleRememberMe(this.username , this.password);
        event.preventDefault();
        if (!this.template.querySelector('input[type="email"]').reportValidity()) {
            return
        };
        if (!this.template.querySelector('input[type="password"]').reportValidity()) {
            return
        };
        if (this.username && this.password) {
            await doLogin({ username: this.username, password: this.password })
                .then((result) => {
                    console.log('loginResult : ', result);
                    if (result == null && result == undefined) {
                        this.showErrorToast();
                    }
                    else {
                        window.location.href = result;
                        // this.ShowToast();
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

    }
    ShowToast() {
        const event = new ShowToastEvent({
            title: 'You Loged In Successfully :)',
            message: 'Welcome',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
    ShowToastPasswordReset() {
        const event = new ShowToastEvent({
            title: 'Please check your mail for Reset Password',
            message: 'Reset your password and log In again ',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
    showErrorToast() {
        const evt = new ShowToastEvent({
            title: 'Oops! The email or password you entered is incorrect.',
            message: 'please check your email and password again or contact your systemadmin',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }
     showErrorToastpayment() {
        const evt = new ShowToastEvent({
            title: 'Your payment was not successful',
            message: 'please try again',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    handleFirstNameChange(event) {

        this.firstName = event.target.value;
        console.log('this.firstName ', this.firstName);
    }

    handleLastNameChange(event) {

        this.lastName = event.target.value;
        console.log('this.lastName ', this.lastName);
    }

    handleEmailChange(event) {

        if (event.target.value) {

            this.email = event.target.value;
            this.userName = this.email;
            console.log('this.userName ', this.userName);
            console.log('this.email ', this.email);


        } else {

            this.email = event.target.value;
            this.userName = this.email;
            console.log('else this.userName ', this.userName);
            console.log('this.email ', this.email);
        }
    }

    handleEmailChangeconfirm(){

     this.confirmEmail =this.template.querySelector(`[data-id= 'becomeMemberEmailAddressconfirmconfirm']`).value;   
     console.log('conemail',this.confirmEmail)
    //  this.confirmEmail =this.template.querySelector(`[data-id= 'EmailChangeconfirm']`).value;  
    //   console.log('conemail1',this.confirmEmail) 
    }

    handleEmailChangeconfirm1(){

          this.confirmEmail =this.template.querySelector(`[data-id= 'guestEmailAddressconfirm']`).value;  
      console.log('conemail1',this.confirmEmail) 
    }
    


       async paysuccess(){
        console.log('inside method');
        console.log('User Name ' ,this.email);
        console.log('Password con' , this.confirmPassword);
        if (this.email && this.confirmPassword) {
            console.log('insdi pass and username ');
            await doLogin({ username: this.email, password: this.confirmPassword })
           .then((result) => {
               console.log('result ', result);
               if (result == null && result == undefined) {
                this.updateProfile();
                this.forgetPasswordfun();
                   this.ShowToastPasswordReset();
               }
               else {
                    this.updateProfile();
                   window.location.href = result;
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
       }
        updateProfile(){
                 console.log('update profile ',this.email);
        if (this.email) {
            console.log('insde update user ');
            updateUserProfile({ Username: this.email})
           .then((result) => {
               console.log('result update profile ', result);
               if (result == null && result == undefined) {
                   this.showErrorToast();
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
        }
        forgetPasswordfun(){
            console.log('forget password ',this.email);
   if (this.email) {
       console.log('inside forget password ');
       forgotPassword({ userName: this.email})
      .then((result) => {
          console.log('forget password return ', result);
          if (result == null && result == undefined) {
              this.showErrorToast();
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
   }

     async offpay(){
         this.flowcall = false;
         console.log('this.OppIds offpay',this.OppIds);
         console.log('opds ',this.OppIds);
         this.showSpinner = true;
          await CheckPaymentStatus({oppId:this.OppIds})
           .then((result) => {
                  console.log('result pay inside ',result);
                   this.showSpinner = false;
                  if(result=='Approved'){
                     console.log('result inside if',result);
                      this.paysuccess();
                  }
                  else if(result=='Failed'){
                      console.log('result inside else if',result);
                       this.showErrorToastpayment();
                       

                  }
                  else if(result=='Error'){
                     console.log('result inside else if 2',result);
                       this.showErrorToast();
                  }
                 })
                .catch((error) => {
                    this.error = error;                  
                    console.log('this.errorMessage ', this.errorMessage);
                    
                });         
     }
    /*********** user self registration>>>>>>>>>>>>>*********************************************** */
    handleRegister(event) {
        console.log("type14444");
        console.log(' this.confirmPassword ', this.confirmPassword);
        if(this.showGetAGuestPass == true)
        {
            this.typeOfuser = 'Guest';
            console.log("type1111111111",this.typeOfuser);
        }
        else
        {
            this.typeOfuser = 'Member';
            console.log("type2222222222222222",this.typeOfuser);
        }
         
        event.preventDefault();
        this.errorCheck = false;
        this.errorMessage = null;
        this.hearAboutUs = 'Web';
        this.errorTooltipDisplayData.email = 'tooltiptext tooltipHide';
        this.errorTooltipDisplayData.password = 'tooltiptext tooltipHide';

        if (!this.firstName) {
            this.requiredTooltipDisplayData.firstName = 'tooltiptext tooltipShow';
        } else {
            this.requiredTooltipDisplayData.firstName = 'tooltiptext tooltipHide';
        }

        if (!this.lastName) {
            this.requiredTooltipDisplayData.lastName = 'tooltiptext tooltipShow';
        } else {
            this.requiredTooltipDisplayData.lastName = 'tooltiptext tooltipHide';
        }

        if (!this.email) {
            console.log('email if');
            this.requiredTooltipDisplayData.email = 'tooltiptext tooltipShow'
        } else {
             console.log('email else');
            this.requiredTooltipDisplayData.email = 'tooltiptext tooltipHide';
        }

        if (!this.password) {
             console.log('password if');
            this.requiredTooltipDisplayData.password = 'tooltiptext tooltipShow';
        } else {
             console.log('password else');
            this.requiredTooltipDisplayData.password = 'tooltiptext tooltipHide';
        }

        if (!this.confirmPassword) {
             console.log('confirm if');
            this.requiredTooltipDisplayData.confirmPassword = 'tooltiptext tooltipShow';
        } else {
             console.log('confirm else');
            this.requiredTooltipDisplayData.confirmPassword = 'tooltiptext tooltipHide';
        }

        if (this.firstName && this.lastName && this.email && this.userName && this.hearAboutUs && this.password && this.confirmPassword) {
            //this.showTermsAndConditionsLoading = true;
            if (this.password != this.confirmPassword) {
                this.infoTooltipDisplayData.password = "tooltiptext tooltipHide";
                this.passwordError = 'Password did not match. Please Make sure both the passwords match.';
                this.errorTooltipDisplayData.password = 'tooltiptext tooltipShow tooltipError';
                 this.errorTooltipDisplayData.confirmPassword = 'tooltiptext tooltipShow tooltipError';
                event.preventDefault();
                //this.showTermsAndConditionsLoading = false;
                return;
            }

              if (this.email != this.confirmEmail) {
                this.infoTooltipDisplayData.email = "tooltiptext tooltipHide";
                this.emailError = 'email did not match. Please Make sure both the passwords match.';
                this.errorTooltipDisplayData.email = 'tooltiptext tooltipShow tooltipError';
                 this.errorTooltipDisplayData.confirmEmail = 'tooltiptext tooltipShow tooltipError';
                event.preventDefault();
                //this.showTermsAndConditionsLoading = false;
                return;
            }

            let emailCheck = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email);

            console.log('emailCheck--', emailCheck);

            if (emailCheck == null || emailCheck == undefined || emailCheck == false) {
                //this.showTermsAndConditionsLoading = false;
                console.log('inside email check');
                this.emailError = 'Please enter a valid email address';
                this.errorTooltipDisplayData.email = 'tooltiptext tooltipShow tooltipError';
                return;
            }

            let passwordCheck = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(this.password);

            if (passwordCheck == null || passwordCheck == undefined || passwordCheck == false) {

                //this.showTermsAndConditionsLoading = false;

                this.infoTooltipDisplayData.password = "tooltiptext tooltipHide";
                this.passwordError = 'Password must be Minimum eight characters, at least one letter, one number and one special character.';
                this.errorTooltipDisplayData.password = 'tooltiptext tooltipShow tooltipError';

                return;
            }

            //event.preventDefault();

            isEmailExist({ username: this.userName, GuestUser : this.showGetAGuestPass, MemberUser :this.showBecomeMember })
                .then((result) => {
                    console.log('login result---' + result, typeof result);
                    console.log('result ',result[0]);
                    if(result[0]){
                       console.log(' this.showGetAGuestPass ', this.showGetAGuestPass);
                       if( this.showGetAGuestPass){
                        console.log('inside result guestttt');
                        console.log('result[0].profile.Name ',result[0].Profile.Name);
                           if( result[0].Profile.Name == 'Guest User'){
                              //if (result != null && result != undefined && result == true) {
                                //this.emailError = 'Your username already exists somewhere on the  Salesforce Ecosystem.';
                                this.emailError = 'You have already Used Our Guest User Pass';
                                  this.errorTooltipDisplayData.email = 'tooltiptext tooltipShow tooltipError';
                                 //this.showTermsAndConditionsLoading = false;
                                //} 
                           }
                           else if(result[0].Profile.Name == 'Member User'){
                            this.emailError = 'You are Already a member of our site';
                            this.errorTooltipDisplayData.email = 'tooltiptext tooltipShow tooltipError';
                           }
                       }
                       else if(this.showBecomeMember){
                        console.log('inside result mem');
                        console.log('result[0].profile.Name ',result[0].Profile.Name);
                          if( result[0].Profile.Name == 'Member User'){
                                this.emailError = 'You are Already a member of our site';
                                this.errorTooltipDisplayData.email = 'tooltiptext tooltipShow tooltipError';
                          }   
                       }
                    }
                   
                    else {
                        console.log('inside else');
                        console.log('this.firstName ', this.firstName);
                        console.log('this.lastName ', this.lastName);
                        console.log('this.userName ', this.userName);
                        console.log('this.email ', this.email);
                        console.log('this.communityNickname ', this.firstName);
                        console.log('this.password ', this.password);
                        this.showSpinner = true;
                        registerUser({
                            firstName: this.firstName, lastName: this.lastName, email: this.email, password: this.password, confirmPassword:
                                this.confirmPassword, SignUpAs: this.typeOfuser
                        })
                            .then((result) => {
                                if (result) {
                                    console.log('result Neha check ', result);
                                    this.showSpinner = false;
                                    if(result=='Error'){
                                      this.showErrorToast();
                                       if(this.showBecomeMember){                                           
                                             this.flowcall = true;
                                        }
                                    } else if(result !='Error') {
                                        //window.location.href = result;
                                         let arrreturn = [];
                                         var PayId ;
                                           arrreturn = result.split(",");
                                           PayId = arrreturn[0];
                                           //userIdguest = arrreturn[1];
                                           console.log('arrreturn ',arrreturn[0]);
                                            console.log('arrreturn ',arrreturn[1]);
                                             console.log('PayId ',PayId);
                                        if(this.showBecomeMember){ 
                                            this.OppId = PayId;
                                            this.OppIds = PayId;
                                            //this.userIdUpdation = userIdguest;
                                             this.flowcall = true;
                                        }
                                         if( this.showGetAGuestPass){
                                            window.location.href = result;
                                         }
                                   
                                    this.showSpinner = false;
                                    }
                                }
                                this.password = null;
                                //this.showTermsAndConditionsLoading = false;
                            })
                            .catch((error) => {
                                this.showSpinner = false;
                                this.error = error;

                                console.log('error-', JSON.stringify(error));

                                //this.showTermsAndConditionsLoading = false;

                                if (error && error.body && error.body.message) {

                                    //this.showTermsAndConditions = false;
                                    this.errorCheck = true;
                                    this.errorMessage = error.body.message;

                                }

                            });
                    }


                })
                .catch((error) => {
                    this.error = error;

                    if (error && error.body && error.body.message) {

                        console.log('error msg-', error.body.message);
                    }

                    //this.showTermsAndConditionsLoading = false;

                });

        }


    }
    handlleRememberMe(email, pass){
        console.log('rememberMe : ');
        let checkFlag = this.template.querySelector(`[data-id='memberRememberMe']`).checked;

        if(checkFlag){
            console.log('checkFlag true : ');
            function newCookie(name,value,days) {
                console.log('newCookie : ',name +' : '+ value +' : ' +days);
                var days = 365;   // the number at the left reflects the number of days for the cookie to last
                                // modify it according to your needs
                if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                var expires = "; expires="+date.toGMTString(); }
                else var expires = "";
                document.cookie = name+"="+value+expires+"; path=/"; 
                console.log('docCookie : ',document.cookie, JSON.stringify(document.cookie));
            }
            console.log('oldCookieMail : ', this.readCookie('email'));
            console.log('oldCookiePass : ', this.readCookie('pass'));
            newCookie('email',email,365);
            newCookie('pass',pass,365);

            function eraseCookie(name) {
                newCookie(name,"",1); 
            }

            function toMem(a) {
                newCookie('theName', document.form.name.value);     // add a new cookie as shown at left for every
                newCookie('theEmail', document.form.email.value);   // field you wish to have the script remember
            }

            function delMem(a) {
                eraseCookie('theName');   // make sure to add the eraseCookie function for every field
                eraseCookie('theEmail');

                document.form.name.value = '';   // add a line for every field
                document.form.email.value = ''; 
            }
        }
    }
    readCookie(name) {
        var nameSG = name + "=";
        var nuller = '';
        if (document.cookie.indexOf(nameSG) == -1) return nuller;

        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameSG) == 0) return c.substring(nameSG.length,c.length); 
        }
        return null;
    }
}