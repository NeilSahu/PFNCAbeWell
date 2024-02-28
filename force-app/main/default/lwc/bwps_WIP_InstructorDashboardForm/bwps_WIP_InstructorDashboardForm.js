import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Instructor_Dashboard_cardsImages from '@salesforce/resourceUrl/Instructor_Dashboard_cardsImages';
//import BWPS_InstructorClassProfileMethod from '@salesforce/apex/BWPS_InstructorClassProfile.BWPS_InstructorClassProfileMethod';
//import updateProfile from '@salesforce/apex/BWPS_InstructorClassProfile.updateProfile';
import updateUserData from '@salesforce/apex/BWPS_LoginUserProfileCtrl.updateDonorProfile';
import fetchUserDetail from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
export default class Bwps_WIP_InstructorDashboardForm extends LightningElement {
  fileexcept = ['.png', '.jpg', '.gif'];
  @track profileImg;
  @track userData
  @track profileImg;
  @track userName;
  @track userFirstName;
  @track userLastName;
  @track data;
  @track error;
  instructorId;
  cardsImage = Instructor_Dashboard_cardsImages;
  value = 'Male';
  LastName = '';
  FirstName = '';
  Location = '';
  AboutMe = '';
  phone = '';
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

  infoTitle = 'Click below edit button to edit your info';

  @track formdataJson = {};

  //changes------------
  email = '';
  address = '';
  apartmentSuiteEtc = '';
  city = '';
  state = '';
  ZipPostalCode = '';
  country ='';

  editSubmitButtonText = 'EDIT';  // - edit submit button text - EDIT / SUBMIT
  inputDisabled = true;



  handleEditSubmitButtonClick(event){
    if(this.editSubmitButtonText == 'EDIT'){

      this.editSubmitButtonText = 'SUBMIT';
      this.inputDisabled = false;
      this.infoTitle = '';

      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    }
    else if(this.editSubmitButtonText == 'SUBMIT'){
      
      this.editSubmitButtonText = 'EDIT';
      this.inputDisabled = true;
      this.infoTitle = 'Click below edit button to edit your info';

      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

      this.saveDetail();
       window.location.reload();
    }
  }

  saveDetail(){
  if((this.template.querySelector('[data-id="Profile-edit"]').innerHTML).trim()== 'EDIT') {
    var inputs = this.template.querySelectorAll(".enable-input");
     for( let i=0 ;i<inputs.length;i++) {
      inputs[i].disabled = false;
    }
    this.template.querySelector('[data-id="Profile-edit"]').innerHTML = 'SUBMIT';
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
   }
  
  else {
    const form = this.template.querySelector('[data-id="form"]');
    const formData = new FormData(form);
    if(this.fileData !=null && this.fileData != undefined && this.fileData != ''){
      console.log("log");
     for (const [key, value] of formData) {
       // this.formdataJson[key] = `${value}`;
       this.formdataJson[key] = `${value}`;
       //console.log(`KEY: ${key}  VALUE:  ${value} \n`);

       }
      console.log('FormData>>>',JSON.stringify(this.formdataJson));
      updateUserData({userData:JSON.stringify(this.formdataJson)})
      .then(result=>{ 
       //toast Msg  
       // this.template.querySelector('c-recurring-donation').showToast('success', 'Profile updated successfully.');
       
       this.template.querySelector('c-toast-message').showToast('success', 'Form submited successfully.'); 
        console.log("log2")
        console.log('result>>>> ',result);
        var inputs = this.template.querySelectorAll(".enable-input");
        for( let i=0 ;i<inputs.length;i++) {
         inputs[i].disabled = true;

       }
        this.template.querySelector('[data-id="Profile-edit"]').innerHTML = 'EDIT';
        })
      .catch ( error => {
        console.log('OUTPUT1 : ',error);
        
        this.template.querySelector('c-toast-message').showToast('error', 'An error occurred while trying to submit the form.');
      })
    } else {
      for (const [key, value] of formData) {
         this.formdataJson[key] = `${value}`;
        }
      updateUserData({userData:JSON.stringify(this.formdataJson)})
      .then(result=>{ 
        
        console.log("log3") 
        console.log('result>>>> ',JSON.stringify(this.formdataJson));
      //toast Msg  
      
      this.template.querySelector('c-toast-message').showToast('success', 'Form submited successfully.'); 

        var inputs = this.template.querySelectorAll(".enable-input");
        for( let i=0 ;i<inputs.length;i++) {
         inputs[i].disabled = true;
         console.log("log5")
       }
       console.log("log6");
       
    this.template.querySelector('[data-id="Profile-edit"]').innerHTML = 'EDIT';
       console.log("log7");
       })
      .catch ( error => {
        
        this.template.querySelector('c-toast-message').showToast('error', 'An error occurred while trying to submit the form.');
        console.log('OUTPUT22 : ',JSON.stringify(error));
      })
    }
}
}


 
  @wire(fetchUserDetail)
  wiredUser({ error, data }) {
    if (data) {
 
      console.log('data>>', data);
      this.LastName = data.LastName ?? '';
      this.FirstName = data.FirstName?? '';
      
      this.phone = data.Phone?? '';

      this.email =  data.Email?? '';

      if (data.Address != undefined && data.Address != null) {
        this.address =  data.Address.street?? '';
        this.apartmentSuiteEtc = data.Address.street?? '';

        this.city = data.Address.city?? '';

        this.state = data.Address.state?? '';
        this.country = data.Address.country?? '';
        this.ZipPostalCode =  data.Address.postalCode?? '';
      }


    } else if (error) {
      this.error = error;
      console.log('erroeeee>>>', error);
      this.dispatchEvent(new ShowToastEvent({
        title: 'ERROR',
        message: 'An error occurred while trying to fetch user data',
        variant: 'error',

      }))
      this.dispatchEvent(new ShowToastEvent({
        title: 'ERROR',
        message: error.body.message,
        variant: 'error',
        mode: 'pester'

      }))
    }
  }
}




// import { LightningElement, wire, track } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import Instructor_Dashboard_cardsImages from '@salesforce/resourceUrl/Instructor_Dashboard_cardsImages';
// //import BWPS_InstructorClassProfileMethod from '@salesforce/apex/BWPS_InstructorClassProfile.BWPS_InstructorClassProfileMethod';
// //import updateProfile from '@salesforce/apex/BWPS_InstructorClassProfile.updateProfile';
// import updateUserData from '@salesforce/apex/BWPS_LoginUserProfileCtrl.updateDonorProfile';
// import fetchUserDetail from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
// export default class Bwps_WIP_InstructorDashboardForm extends LightningElement {
//   fileexcept = ['.png', '.jpg', '.gif'];
//   @track profileImg;
//   @track userData
//   @track profileImg;
//   @track userName;
//   @track userFirstName;
//   @track userLastName;
//   @track data;
//   @track error;
//   instructorId;
//   cardsImage = Instructor_Dashboard_cardsImages;
//   value = 'Male';
//   LastName = '';
//   FirstName = '';
//   Location = '';
//   AboutMe = '';
//   phone = '';
//   fileData;

//   FirstName1 = '';
//   Gender = '';
//   BrMonth = '';
//   BrDay = '';
//   BrYear = '';

//   conid = '';
//   checkAllThatApply;
//   record;
//   gender_pickVal;

//   infoTitle = 'Click below edit button to edit your info';

//   @track formdataJson = {};

//   //changes------------
//   email = '';
//   address = '';
//   apartmentSuiteEtc = '';
//   city = '';
//   state = '';
//   ZipPostalCode = '';

//   editSubmitButtonText = 'EDIT';  // - edit submit button text - EDIT / SUBMIT
//   inputDisabled = true;

//   handleEditSubmitButtonClick(event){
//     if(this.editSubmitButtonText == 'EDIT'){

//       this.editSubmitButtonText = 'SUBMIT';
//       this.inputDisabled = false;
//       this.infoTitle = '';

//       window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

//     }
//     else if(this.editSubmitButtonText == 'SUBMIT'){
      
//       this.editSubmitButtonText = 'EDIT';
//       this.inputDisabled = true;
//       this.infoTitle = 'Click below edit button to edit your info';

//       window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

//       this.saveDetail();
//     }
//   }

//   saveDetail(){
//   if((this.template.querySelector('[data-id="Profile-edit"]').innerHTML).trim()== 'EDIT') {
//     var inputs = this.template.querySelectorAll(".enable-input");
//      for( let i=0 ;i<inputs.length;i++) {
//       inputs[i].disabled = false;
//     }
//     this.template.querySelector('[data-id="Profile-edit"]').innerHTML = 'SUBMIT';
//     window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
//    }
  
//   else {
//     const form = this.template.querySelector('[data-id="form"]');
//     const formData = new FormData(form);
//     if(this.fileData !=null && this.fileData != undefined && this.fileData != ''){
//       console.log("log");
//      for (const [key, value] of formData) {
//        // this.formdataJson[key] = `${value}`;
//        this.formdataJson[key] = `${value}`;
//        //console.log(`KEY: ${key}  VALUE:  ${value} \n`);

//        }
//       console.log('FormData>>>',JSON.stringify(this.formdataJson));
//       updateUserData({userData:JSON.stringify(this.formdataJson)})
//       .then(result=>{ 
//        //toast Msg  
//        // this.template.querySelector('c-recurring-donation').showToast('success', 'Profile updated successfully.');
       
//        this.template.querySelector('c-toast-message').showToast('success', 'Form submited successfully.'); 
//         console.log("log2")
//         console.log('result>>>> ',result);
//         var inputs = this.template.querySelectorAll(".enable-input");
//         for( let i=0 ;i<inputs.length;i++) {
//          inputs[i].disabled = true;

//        }
//         this.template.querySelector('[data-id="Profile-edit"]').innerHTML = 'EDIT';
//         })
//       .catch ( error => {
//         console.log('OUTPUT1 : ',error);
        
//         this.template.querySelector('c-toast-message').showToast('error', 'An error occurred while trying to submit the form.');
//       })
//     } else {
//       for (const [key, value] of formData) {
//          this.formdataJson[key] = `${value}`;
//         }
//       updateUserData({userData:JSON.stringify(this.formdataJson)})
//       .then(result=>{ 
        
//         console.log("log3") 
//         console.log('result>>>> ',JSON.stringify(this.formdataJson));
//       //toast Msg  
      
//       this.template.querySelector('c-toast-message').showToast('success', 'Form submited successfully.'); 

//         var inputs = this.template.querySelectorAll(".enable-input");
//         for( let i=0 ;i<inputs.length;i++) {
//          inputs[i].disabled = true;
//          console.log("log5")
//        }
//        console.log("log6");
       
//     this.template.querySelector('[data-id="Profile-edit"]').innerHTML = 'EDIT';
//        console.log("log7");
//        })
//       .catch ( error => {
        
//         this.template.querySelector('c-toast-message').showToast('error', 'An error occurred while trying to submit the form.');
//         console.log('OUTPUT22 : ',JSON.stringify(error));
//       })
//     }
// }
// }


 
//   @wire(fetchUserDetail)
//   wiredUser({ error, data }) {
//     if (data) {
//       // this.userData = data;
//       console.log('data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', data);
//       // this.profileImg = data.MediumPhotoUrl;
//       this.LastName = data.LastName;
//       this.FirstName = data.FirstName;
      
//       this.phone = (data.Phone == undefined || data.Phone == null) ? '' : data.Phone;

//       this.email = (data.Email == undefined || data.Email == null) ? '' : data.Email;

//       if (data.Address != undefined && data.Address != null) {
//         this.address = (data.Address.street == undefined || data.Address.street == null) ? '' : data.Address.street;
//         //this.apartmentSuiteEtc = data.Address.street ;

//         this.city = (data.Address.city == undefined || data.Address.city == null) ? '' : data.Address.city;

//         this.state = (data.Address.state == undefined || data.Address.state == null) ? '' : data.Address.state;

//         this.ZipPostalCode = (data.Address.postalCode == undefined || data.Address.postalCode == null) ? '' : data.Address.postalCode;
//       }


//     } else if (error) {
//       this.error = error;
//       console.log('erroeeee>>>', error);
//       this.dispatchEvent(new ShowToastEvent({
//         title: 'ERROR',
//         message: 'An error occurred while trying to fetch user data',
//         variant: 'error',

//       }))
//       this.dispatchEvent(new ShowToastEvent({
//         title: 'ERROR',
//         message: error.body.message,
//         variant: 'error',
//         mode: 'pester'

//       }))
//     }
//   }
// }