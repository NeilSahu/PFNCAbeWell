import { LightningElement, wire, track } from 'lwc';
import Instructor_Dashboard_cardsImages from '@salesforce/resourceUrl/Instructor_Dashboard_cardsImages';
//import BWPS_InstructorClassProfileMethod from '@salesforce/apex/BWPS_InstructorClassProfile.BWPS_InstructorClassProfileMethod';
//import updateProfile from '@salesforce/apex/BWPS_InstructorClassProfile.updateProfile';
import updateUserData from '@salesforce/apex/BWPS_LoginUserProfileCtrl.updateIntructor';
//import updateUserData from '@salesforce/apex/BWPS_LoginUserProfileCtrl.updateUser';
import fetchUserDetail from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
export default class InstructorsDashboardForm extends LightningElement {

  fileexcept = ['.png', '.jpg', '.gif'];
  @track profileImg;
  @track userData
  @track profileImg;
  @track userName;
  @track userFirstName;
  @track userLastName;
  @track data;
  @track error;
  @track loader = false;
  instructorId;
  cardsImage = Instructor_Dashboard_cardsImages;
  value = 'Male';
  LastName = '';
  FirstName = '';
  Location = '';
  AboutMe = '';
  Phone ='';
  fileData;

  FirstName1 = '';
  Gender = '';
  BrMonth = '';
  BrDay = '';
  BrYear = '';
  conid = '';
  checkAllThatApply;
  record;
  gender_pickVal;

  @track formdataJson = {};


  saveDetail() {
    if ((this.template.querySelector('[data-id="Profile-edit"]').innerHTML).trim() == 'EDIT') {
      var inputs = this.template.querySelectorAll(".enable-input");
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
      }
      this.template.querySelector('[data-id="Profile-edit"]').innerHTML = 'SUBMIT';
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    // else {
    //     const form = this.template.querySelector('[data-id="form"]');
    //     const formData = new FormData(form);
    //     var formDetail = JSON.stringify(formData);
    //     for (const [key, value] of formData) {
    //      // formMap.set(`${key}` , ` ${value}`);
    //       this.formdataJson[key] = `${value}`;
    //          //console.log('values:'+`${key}: ${value}\n`);
    //         console.log('form',JSON.stringify(this.formdataJson));

    //     }
    //   updateProfile({formData: JSON.stringify(this.formdataJson)})
    //   .then(result=>{
    //     console.log("class");
    //     var inputs = this.template.querySelectorAll(".enable-input");
    //    for( let i=0 ;i<inputs.length;i++) {
    //     inputs[i].disabled = true;
    //   }
    //   this.template.querySelector('[data-id="Profile-edit"]').innerHTML = 'EDIT';
    //   })
    //   .catch ( error => {
    //     console.log('OUTPUT1 : ',error);
    //   })
    // }
    else {
      this.loader = true;
      const form = this.template.querySelector('[data-id="form"]');
      const formData = new FormData(form);
      if (this.fileData != null && this.fileData != undefined && this.fileData != '') {
        console.log("log");
        for (const [key, value] of formData) {
          // this.formdataJson[key] = `${value}`;
          this.formdataJson[key] = `${value}`;
          //console.log(`KEY: ${key}  VALUE:  ${value} \n`);

        }
        console.log('FormData>>>', JSON.stringify(this.formdataJson));
        updateUserData({ userData: JSON.stringify(this.formdataJson), userProfilePic: this.fileData.base64 })
          .then(result => {
            //toast Msg  
            // this.template.querySelector('c-recurring-donation').showToast('success', 'Profile updated successfully.');
            this.loader = false;
            this.template.querySelector('c-toast-message').showToast('success', 'Form submited successfully.');
            console.log("log2")
            console.log('result>>>> ', result);
            var inputs = this.template.querySelectorAll(".enable-input");
            for (let i = 0; i < inputs.length; i++) {
              inputs[i].disabled = true;
            }
            this.template.querySelector('[data-id="Profile-edit"]').innerHTML = 'EDIT';
          })
          .catch(error => {
            console.log('OUTPUT1 : ', error);
            this.loader = false;

            this.template.querySelector('c-toast-message').showToast('error', 'An error occurred while trying to submit the form.');
          })
      } else {
        for (const [key, value] of formData) {
          this.formdataJson[key] = `${value}`;
        }
        updateUserData({ userData: JSON.stringify(this.formdataJson), userProfilePic: '' })
          .then(result => {

            console.log("log3")
            console.log('result>>>>< ', result);
            //toast Msg  

            this.loader = false;

            this.template.querySelector('c-toast-message').showToast('success', 'Form submited successfully.');

            var inputs = this.template.querySelectorAll(".enable-input");
            for (let i = 0; i < inputs.length; i++) {
              inputs[i].disabled = true;
              console.log("log5")
            }
            console.log("log6");

            this.template.querySelector('[data-id="Profile-edit"]').innerHTML = 'EDIT';
            console.log("log7");
          })
          .catch(error => {
            this.loader = false;
            this.template.querySelector('c-toast-message').showToast('error', 'An error occurred while trying to submit the form.');
            console.log('OUTPUT22 : ', JSON.stringify(error));
          })
      }
    }
  }


  inputImg(event) {
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
      console.log(this.fileData)
    }
    reader.readAsDataURL(file)
  }

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


  @wire(fetchUserDetail)
  wiredUser({ error, data }) {
    if (data) {
      this.userData = data;
      console.log('data>>>', this.userData);
      this.profileImg = data.MediumPhotoUrl;
      this.LastName = data.LastName ?? '';
      this.FirstName = data.FirstName ?? '';
      this.Location = data.Location__c ?? '';
      this.AboutMe = data.AboutMe ?? '';
      this.Phone = data.Phone ?? '';
      console.log('phone554', data.Phone);
      this.Gender = data.Contact.BWPS_Gender__c;

      let Birthdate = data.Contact.Birthdate;
      console.log('hhbv');
      console.log(Birthdate.split("-"));
      const myArray = Birthdate.split("-");
      this.BrYear = myArray[0];
      this.BrMonth = myArray[1];
      this.BrDay = myArray[2];
      console.log("birthday",data.Phone);
      this.template.querySelector('[data-id="month_drop"]').value = this.BrMonth;
      this.template.querySelector('[data-id="Day_drop"]').value = this.BrDay;
      this.template.querySelector('[data-id="year_drop"]').value = this.BrYear;

      if (this.Gender == "Male") {
        this.template.querySelector('[data-id="Male"]').checked = true;
      }
      else if (this.Gender == "Female") {

        this.template.querySelector('[data-id="Female"]').checked = true;
      }
      else if (this.Gender == "Others") {

        this.template.querySelector('[data-id="Others"]').checked = true;
      }
      else {

        this.template.querySelector('[data-id="DoNotSay"]').checked = true;
      }


    } else if (error) {
      this.error = error;
      console.log('erroeeee>>>', error);
    }
  }
}