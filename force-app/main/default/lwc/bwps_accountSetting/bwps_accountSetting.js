import { LightningElement, track, wire } from 'lwc';
import BELLICON from '@salesforce/resourceUrl/Bell_Icon';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import fetchUserDetail from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
import updateUserData from '@salesforce/apex/BWPS_LoginUserProfileCtrl.updateUser';
import updateUserPassword from '@salesforce/apex/BWPS_LoginUserProfileCtrl.updateUserPassword';
import updateuserProfilePicture from '@salesforce/apex/BWPS_LoginUserProfileCtrl.updateProfilePicture';
import deleteProfilePicture from '@salesforce/apex/BWPS_LoginUserProfileCtrl.deleteUserProfilePic';
import updateUserEmail from '@salesforce/apex/BWPS_LoginUserProfileCtrl.updateUserEmail';
import userImg from '@salesforce/resourceUrl/No_imageUser_Avtar';
import { refreshApex } from '@salesforce/apex';
import fetchNotification from '@salesforce/apex/Bwps_getuserNotification.getUserNotification';
import LightningConfirm from "lightning/confirm";
export default class Bwps_accountSetting extends LightningElement {
  bellIcon = BELLICON;
   userIconNoimg =userImg;
  @track isSavetrue = false;
  @track emailError = false;
  @track phoneError = false;
  @track zipCodeError = false;

  @track userData;
  @track classOfAddress = 'input-box';
  @track fileData;
  @track profileImg;
  @track wiredMarketData;
  @track userName = '';
  @track userFirstName = '';
  @track userLastName = '';
  @track phoneNumber = '';
  @track birthDate = '';
  @track location = '';
  @track gender = '';
  @track formdataJson = {};
  @track recordId;
  @track passwordJson = {};
  @track userEmail = '';
  @track notrecords = [];
  @track notificationVisibel = [];
  @track totalNotifications = 0;
  @track showNotificationFlag = false;

  //NewUiChanges
  @track userBirthday ='2007-04-11';
  @track userEmail = '';
  @track userAddress = '';
  @track userApartment = '';
  @track userCity = '';
  @track userState = '';
  @track userZipPostalCode = '';
  @track userCountry = '';


  // @track birthYear='';
  // @track  birthMonth
  // @track  birthDay
  data;
  error;
  
  @wire(fetchUserDetail)
  wiredUser(wireResult) {
   const { data, error } = wireResult;
   this.wiredMarketData = wireResult;
    if (data) {
      console.log('runnnn>>> ');
      this.userData = data;
      console.log('data>>>', data);
      this.profileImg = this.userData.MediumPhotoUrl;
      this.userName = this.userData.Name ??'';
      let userFullName = this.userName ??'';
      this.userFirstName = userFullName.split(' ')[0];
      this.userLastName = userFullName.split(' ')[1];
      this.phoneNumber = this.userData.Phone ??'';
      this.location = this.userData.Location__c ??'';
      this.userEmail = this.userData.Email ??'';
      this.gender = this.userData.Contact.BWPS_Gender__c;
      console.log('GENDERRRRR>>> ',this.userData.Contact.BWPS_Gender__c,'>>> ',this.gender);
      if(this.userData.Contact.BWPS_Gender__c != undefined && this.userData.Contact.BWPS_Gender__c != null && this.userData.Contact.BWPS_Gender__c != ''){
      this.template.querySelector('[data-id="gender-drop"]').value = this.gender;
      }
      this.birthDate = this.userData.Contact.Birthdate;
       console.log('Birthdate>>> ',this.userData.Contact.Birthdate,'>>> ', this.birthDate);
      this.recordId = this.userData.Id;
      this.userBirthday =  this.userData.Contact.Birthdate;
     // console.log('Birthdate11>>> ',  this.userBirthday,'>>> ', new Date(this.userData.Contact.Birthdate));
      this.userEmail = this.userData.Email ??'';
      console.log('Email>>> ', this.userData.Email,'>>> ',  this.userEmail);
      this.userState = this.userData.State ??'';
      this.userCity = this.userData.City ??'';
      console.log('PostalCode>>> ', this.userData.PostalCode,'>>> ', this.userData.PostalCode);
      this.userZipPostalCode = this.userData.PostalCode??'';
      console.log('PostalCode1>>> ',  this.userZipPostalCode);
      this.userApartment = this.userData.Street ??'';
      this.userCountry = this.userData.Country ??'';
      this.userAddress =  (this.userData.Street ?this.userData.Street+', ':'') + (this.userData.City ?this.userData.City +', ':'') +
                          (this.userData.State ?this.userData.State+', ':'') + (this.userData.PostalCode? this.userData.PostalCode+', ':'') +this.userCountry;
      // const arr = this.birthDate.split('-');
      // this.template.querySelector('[data-id="year_drop"]').value = arr[0];
      // this.template.querySelector('[data-id="month_drop"]').value = arr[1];
      // //for upend month dates***********************************?????????????////
      // var yearDrop = this.template.querySelector('[data-id="year_drop"]');
      // var monthDrop = this.template.querySelector('[data-id="month_drop"]');
      // if (yearDrop.value != "none" && monthDrop.value != 'none') {
      //   var daysInMonth = new Date(yearDrop.value, monthDrop.value, 0).getDate();
      //   var dayDrop = this.template.querySelector('[data-id="Day_drop"]');
      //   for (var i = 1; i <= daysInMonth; i++) {
      //     var option = document.createElement("OPTION");
      //     option.innerHTML = i.toString().length == 1 ? '0' + i : i.toString();
      //     option.value = i.toString().length == 1 ? '0' + i : i.toString();
      //     dayDrop.appendChild(option);
      //   }
      // } else {
      //   var dayDrop = this.template.querySelector('[data-id="Day_drop"]');
      //   for (var i = 1; i <= 31; i++) {
      //     var option = document.createElement("OPTION");
      //     option.innerHTML = i.toString().length == 1 ? '0' + i : i.toString();
      //     option.value = i.toString().length == 1 ? '0' + i : i.toString();
      //     dayDrop.appendChild(option);
      //   }
      // }
      // //***************************************************** */
      // this.template.querySelector('[data-id="Day_drop"]').value = arr[2];
      // console.log('gender>>>', this.gender);
      // if (this.gender == `I'd rather not say`) {
      //   var radiobutton = this.template.querySelector('[data-id="donot-say"]');
      //   radiobutton.checked = true;
      // } else if (this.gender != null && this.gender != '') {
      //   console.log('gender>>>', this.gender);
      //   var radiobutton = this.template.querySelector(`[data-id="${this.gender}"]`);
      //   console.log('element>>', JSON.stringify(radiobutton));
      //   radiobutton.checked = true;
      // }

    } else if (error) {
      this.error = error;
      console.log('erroeeee>>>', error);
    }
  }

  saveDetail() {
    if ((this.template.querySelector('[data-id="profile-edit-button"]').innerHTML).trim() == 'EDIT') {
      var inputs = this.template.querySelectorAll(".enable");
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
      }
      this.template.querySelector('[data-id="profile-edit-button"]').innerHTML = 'SUBMIT';
    } else {
      const form = this.template.querySelector('[data-id="form"]');
      const formData = new FormData(form);
      if (this.fileData != null && this.fileData != undefined && this.fileData != '') {
        for (const [key, value] of formData) {
          // this.formdataJson[key] = `${value}`;
          this.formdataJson[key] = `${value}`;
          //console.log(`KEY: ${key}  VALUE:  ${value} \n`);

        }
        // console.log('FormData>>>',JSON.stringify(this.formdataJson));
        updateUserData({ userData: JSON.stringify(this.formdataJson), userProfilePic: this.fileData.base64 })
          .then(result => {
            console.log('result>>>> ', result);
            var inputs = this.template.querySelectorAll(".enable");
            for (let i = 0; i < inputs.length; i++) {
              inputs[i].disabled = true;
            }
            this.template.querySelector('[data-id="profile-edit-button"]').innerHTML = 'EDIT';
          })
          .catch(error => {
            console.log('OUTPUT1 : ', error);
          })
      } else {
        for (const [key, value] of formData) {
          this.formdataJson[key] = `${value}`;
        }
        updateUserData({ userData: JSON.stringify(this.formdataJson), userProfilePic: '' })
          .then(result => {
            console.log('result>>>> ', result);
            var inputs = this.template.querySelectorAll(".enable");
            for (let i = 0; i < inputs.length; i++) {
              inputs[i].disabled = true;
            }
            this.template.querySelector('[data-id="profile-edit-button"]').innerHTML = 'EDIT';
          })
          .catch(error => {
            console.log('OUTPUT1 : ', error);
          })
      }
    }
  }

  async removeimage() {
    const result = await LightningConfirm.open({
        message: "Are you sure you want to delete this?",
        variant: "default", // headerless
        label: "Delete a record"
    });
    if (result) {
      deleteProfilePicture().then(res=>{
        console.log(res);
        if(res=='Updated successfull'){
                this.tostMessage('Profile picture remove Successfully','Success','Success');
                  this.template.querySelector('[data-id="img-change"]').innerHTML = 'CHANGE IMAGE';
                   refreshApex(this.wiredMarketData);
                   this.profileImg = this.userIconNoimg;

              } else {
                 this.tostMessage('Error while remove profile picture','error','Error');
               }
      }).catch(error=>{
        this.tostMessage('Error while remove profile picture','error','Error');
        console.log('error');
      });
    }
}

  // removeimage(){
  //   deleteProfilePicture().then(result=>{
  //     console.log(result);
  //     if(result=='Updated successfull'){
  //             this.tostMessage('Profile picture remove Successfully','Success','Success');
  //               this.template.querySelector('[data-id="img-change"]').innerHTML = 'CHANGE IMAGE';
  //           } else {
  //              this.tostMessage('Error while remove profile picture','error','Error');
  //            }
  //   }).catch(error=>{
  //     this.tostMessage('Error while remove profile picture','error','Error');
  //     console.log('error');
  //   });
  // }
  getImage(){
     let input = document.createElement('input');
     input.type = 'file';
     input.accept = 'image/*';
    input.onchange = ((event)=> {
          var image = this.template.querySelector('[data-id="output"]');
            image.src = URL.createObjectURL(event.target.files[0]);
            const file = event.target.files[0]
            var reader = new FileReader()
            reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
            'filename': file.name,
            'base64': base64,
            'recordId': this.recordId
          }
        this.template.querySelector('[data-id="img-change"]').innerHTML = 'SAVE';
    }
    reader.readAsDataURL(file)
    });
  input.click();
 }
 uploadImage(){
    if(this.fileData != null &&  this.fileData != undefined &&   this.fileData != '' && 
    this.template.querySelector('[data-id="img-change"]').innerHTML == 'SAVE'){
    this.isSavetrue = true;
     updateuserProfilePicture({userProfilePic : this.fileData.base64}).then(result=>{
      console.log('resut of picture updatte>> ',result)
       if(result=='Updated successfull'){
            this.isSavetrue = false;
         this.tostMessage('Profile picture updated Successfully','Success','Success');
          this.template.querySelector('[data-id="img-change"]').innerHTML = 'CHANGE IMAGE';
      } else {
         this.isSavetrue = false;
         this.tostMessage('Error while saving profile picture','error','Error');
       }
     });
     } else if(this.fileData == null ||  this.fileData == undefined ||  this.fileData == '' ){
       let input = document.createElement('input');
       input.type = 'file';
       input.accept = 'image/*';
       input.onchange = ((event)=> {
       var image = this.template.querySelector('[data-id="output"]');
       image.src = URL.createObjectURL(event.target.files[0]);
       const file = event.target.files[0]
       var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
            'filename': file.name,
            'base64': base64,
            'recordId': this.recordId
          }
      }
     reader.readAsDataURL(file)
    //  if(this.fileData != null &&  this.fileData != undefined &&   this.fileData != '' ){
    //  updateuserProfilePicture({userProfilePic : this.fileData.base64}).then(result=>{
    //   console.log('resut of picture updatte>> ',result)
    //   if(result=='Updated successfull'){
    //     this.tostMessage('Profile picture updated Successfully','Success','Success');
    //      this.template.querySelector('[data-id="img-change"]').innerHTML = 'CHANGE IMAGE';
    //   } else {
    //      this.tostMessage('Error while saving profile picture','error','Error');
    //    }
    //   });
    //  }
    this.template.querySelector('[data-id="img-change"]').innerHTML ='SAVE';
     });
    input.click();
    }
 }
 tostMessage(message , type , title){
   const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: type,
      
        });
        this.dispatchEvent(event);
 }
  // inputImg(event) {
  //   var image = this.template.querySelector('[data-id="output"]');
  //   image.src = URL.createObjectURL(event.target.files[0]);
  //   const file = event.target.files[0]
  //   let fileSize = Math.round(file.size / 1024);
  //   if (fileSize > 1024) {
  //     alert('Size should be less or 1 MB');
  //   }
  //   var reader = new FileReader()
  //   reader.onload = () => {
  //     var base64 = reader.result.split(',')[1]
  //     this.fileData = {
  //       'filename': file.name,
  //       'base64': base64,
  //       'recordId': this.recordId
  //     }
  //     console.log(this.fileData)
  //   }
  //   reader.readAsDataURL(file)
  // }
  renderedCallback() {
    //Reference the DropDownList.
    var topDiv = this.template.querySelector('[data-id="year_drop"]');
    //Determine the Current Year.
    var currentYear = (new Date()).getFullYear();
    //Loop and add the Year values to DropDownList.
    for (var i = currentYear - 120; i <= currentYear; i++) {
      var option = document.createElement("OPTION");
      option.innerHTML = i;
      option.value = i;
      topDiv.appendChild(option);
    }
  };
  // dayClick() {
  //   var yearDrop = this.template.querySelector('[data-id="year_drop"]');
  //   var monthDrop = this.template.querySelector('[data-id="month_drop"]');
  //   if (yearDrop.value != "none" && monthDrop.value != 'none') {
  //     var daysInMonth = new Date(yearDrop.value, monthDrop.value, 0).getDate();
  //     var dayDrop = this.template.querySelector('[data-id="Day_drop"]');
  //     for (var i = 1; i <= daysInMonth; i++) {
  //       var option = document.createElement("OPTION");
  //       option.innerHTML = i.toString().length == 1 ? '0' + i : i.toString();
  //       option.value = i.toString().length == 1 ? '0' + i : i.toString();
  //       dayDrop.appendChild(option);
  //     }
  //   } else {
  //     var dayDrop = this.template.querySelector('[data-id="Day_drop"]');
  //     for (var i = 1; i <= 31; i++) {
  //       var option = document.createElement("OPTION");
  //       option.innerHTML = i.toString().length == 1 ? '0' + i : i.toString();
  //       option.value = i.toString().length == 1 ? '0' + i : i.toString();
  //       dayDrop.appendChild(option);
  //     }
  //   }
  // }

  /* dataMasking(){
      var myMask = "___  ___ ____";
      var inputVal = this.template.querySelector('[data-id="mask"]');
      var myText = "";
      var myNumbers = [];
      var myOutPut = ""
      var theLastPos = 1;
      myText = inputVal.value;
      //get numbers
      for (var i = 0; i < myText.length; i++) {
        if (!isNaN(myText.charAt(i)) && myText.charAt(i) != " ") {
          myNumbers.push(myText.charAt(i));
        }
      }
      //write over mask
      for (var j = 0; j < myMask.length; j++) {
        if (myMask.charAt(j) == "_") { //replace "_" by a number 
          if (myNumbers.length == 0)
            myOutPut = myOutPut + myMask.charAt(j);
          else {
            myOutPut = myOutPut + myNumbers.shift();
            theLastPos = j + 1; //set caret position
          }
        } else {
          myOutPut = myOutPut + myMask.charAt(j);
        }
      }
      inputVal.value = myOutPut;
    }*/

  passWordValidation(password) {
    const formate = `(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[?!@$%^&*]).{8,}$`;
    const regex = new RegExp(formate);
    return regex.test(password);
  }
  phoneNumberValidation(phoneNumber){
    const formate = '^[0-9]+$';
    const regex = new RegExp(formate);
    console.log(regex.test(phoneNumber))
    return regex.test(phoneNumber);
  }
  // zipcodeValidation(){
  //   const formate = '^[0-9]+$';
  //   const regex = new RegExp(formate);
  //   console.log(regex.test(phoneNumber))
  //   return regex.test(phoneNumber); 
  // }
  ///******************update password********************** */
 @track oldPass ='';
 @track newPass ='';
 @track confPass ='';

  updatePassword() {
    const form = this.template.querySelector('[data-id="form2"]');
    const formData = new FormData(form);
    for (const [key, value] of formData) {
     this.passwordJson[key] = `${value}`;
    }
    if(this.passWordValidation(this.passwordJson.newPassword)) {
      if (this.passwordJson.newPassword == this.passwordJson.retypePassword) {
        updateUserPassword({newPassword: formData.get('newPassword'), confirmPassword: formData.get('retypePassword'), oldPassword:formData.get('oldPassword')
        }).then(result => {
          console.log('result>> ', result);
          if(result.includes('Success')){
             this.isSavetrue = false;
          this.tostMessage('Password updated successfully','Success','Success');
          this.passwordEditSubmitButtonText = 'EDIT';
          this.oldPass ='';
          this.newPass ='';
          this.confPass ='';
           this.passwordInputDisabled = true;
         } else if(result.includes('Error')) {
           this.isSavetrue = false;
         this.tostMessage(result,'error','Error');
         }
        }).catch(e => {
         // console.log('Error While Updating Password', e);
           this.isSavetrue = false;
          this.tostMessage('Error While Updating Password','error','Error');
        })
      } else {
       // alert('New password and re-type password should be same');
         this.isSavetrue = false;
        this.tostMessage('New password and re-type password should be same','error','Error');
      }
    } else {
       this.isSavetrue = false;
       var message ='password minimum eight in length , At least one upper case, At least one lower case English letter ,'+
       'At least one digit, At least one special character[?!@$%^&*]';
       this.tostMessage(message,'error','Error');
    }
  }
  @track email = '';
  @track reType_email = '';
  getEmail(evt) {
    if (evt.target.getAttribute('data-id') == 'emailField') {
      this.email = evt.target.value;
      console.log('this.email ', this.email);
    } else if (evt.target.getAttribute('data-id') == 're-emailField') {
      this.reType_email = evt.target.value;
      console.log('this.reType_email ', this.reType_email);
    }
  }
  // ============================ Update User Email ====================================================================
  updateUserEmailAddress() {
    if (this.email == this.reType_email && this.email != '' && this.reType_email != '' &&
      this.email != null && this.reType_email != null) {
      console.log('id>>> ', this.userData.Id);
      const userObj = {
        "User": {
          "Id": this.userData.Id,
          "Email": this.email,
        }
      }
      updateUserEmail({ userData: JSON.stringify(userObj) }).then(result => {
        console.log(result);
      }).catch(error => {
        console.log('Error>>> ', error);
      });

    } else {
      alert('please fill All required detail');
    }
  }
  showNotificationMethod() {
    console.log('OUTPUT1 : ');
    this.showNotificationFlag = !this.showNotificationFlag;
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

  showAccountInfo = true;

  handleSidebar(event) {
    // console.log("-----____-----", event.target.dataset.id)
    let dataId = event.target.dataset.id;

    if (dataId == "accountInfo") {
      this.showAccountInfo = true;
      this.template.querySelector('[data-id="accountInfo"]').classList.toggle("active");
      this.template.querySelector('[data-id="paymentMethod"]').classList.toggle("active");
    }
    else if (dataId == "paymentMethod") {
      this.showAccountInfo = false;
      this.template.querySelector('[data-id="accountInfo"]').classList.toggle("active");
      this.template.querySelector('[data-id="paymentMethod"]').classList.toggle("active");
    }
  }

  editSubmitButtonText = 'EDIT';  // - edit submit button text - EDIT / SUBMIT
  passwordEditSubmitButtonText = 'EDIT';
  inputDisabled = true;
  passwordInputDisabled = true;

  handleEditSubmitButtonClick(event) {
    event.preventDefault();

    if (this.editSubmitButtonText == 'EDIT') {
      this.classOfAddress = 'input-hide';
      this.editSubmitButtonText = 'SAVE';
      this.inputDisabled = false;
      // this.infoTitle = '';

      // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    }
    else if (this.editSubmitButtonText == 'SAVE') {
      this.isSavetrue = true;
      const form = this.template.querySelector('[data-id="form"]');
      const formData = new FormData(form);
      console.log('FormData>>> ',JSON.stringify(formData));
        for (const [key, value] of formData) {
          // this.formdataJson[key] = `${value}`;
           this.formdataJson[key] = `${value}`;
          console.log(`KEY: ${key}  VALUE:  ${value} \n`);

        }
       console.log(' this.formdataJson>> ',JSON.stringify(this.formdataJson));
        console.log('>>>>??? ',this.formdataJson['Phone']);
       this.phoneNumber = this.formdataJson['Phone'];
       this.userZipPostalCode = this.formdataJson['ZipPostalCode'];
       console.log('zippp code',this.phoneNumberValidation(this.formdataJson['ZipPostalCode']));
       if(!this.phoneNumberValidation(this.formdataJson['Phone']) && this.formdataJson['Phone'] != '' && this.formdataJson['Phone'] != null){
          this.isSavetrue = false;
          this.phoneError = true;
        } else {
         this.phoneError = false;
        }
        if(!this.phoneNumberValidation(this.formdataJson['ZipPostalCode']) && this.formdataJson['ZipPostalCode'] != '' && this.formdataJson['ZipPostalCode'] != null ){
           this.isSavetrue = false;
           this.zipCodeError = true;
        } else{
           this.zipCodeError = false;
        }
        if((this.phoneNumberValidation(this.formdataJson['Phone']) ||this.formdataJson['Phone'] == null  || this.formdataJson['Phone'] == '') 
        && (this.phoneNumberValidation(this.formdataJson['ZipPostalCode']) || this.formdataJson['ZipPostalCode'] == null  || this.formdataJson['ZipPostalCode'] == '')) {
          updateUserData({ userData: JSON.stringify(this.formdataJson), userProfilePic: '' })
          .then(result => {
            console.log('result>>> ',result);
           if( result== 'Update Successfully.'){
           refreshApex(this.wiredMarketData);
            this.isSavetrue = false;
            this.phoneError = false;
            this.zipCodeError = false;
           this.tostMessage('Profile updated Successfully','Success','Success');
          } else {
             this.isSavetrue = false;
            this.phoneError = false;
            this.zipCodeError = false;
          this.tostMessage('Error while saving profile detail','error','Error');
         }
          })
          .catch(error => {
            this.phoneError = false;
            this.zipCodeError = false;
             this.tostMessage('Error while saving profile detail','error','Error');
            console.log('OUTPUT1 : ', error);
          })
        this.classOfAddress = 'input-box';
        this.editSubmitButtonText = 'EDIT';
        this.inputDisabled = true;
        } else {
          this.isSavetrue = false;
          this.tostMessage('Error while saving profile detail','error','Error');
        }
      // this.infoTitle = 'Click below edit button to edit your info';

      // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

      // this.saveDetail();
    }
  }
  handlePasswordEditSubmitButtonClick(event) {
    event.preventDefault();

    console.log(this.passwordEditSubmitButtonText);

    if (this.passwordEditSubmitButtonText == 'EDIT') {

      this.passwordEditSubmitButtonText = 'SAVE';
      this.passwordInputDisabled = false;
      // this.passwordInputDisabled = false;
  
    }
    else if (this.passwordEditSubmitButtonText == 'SAVE') {
      this.isSavetrue = true;
      this.updatePassword();
      this.passwordEditSubmitButtonText = 'EDIT';
      this.passwordInputDisabled = true;
      // this.passwordInputDisabled = true;

    }
  }
}