import { LightningElement,track,wire } from 'lwc';
import fetchUserDetail from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
export default class DonorDashboard extends LightningElement {
   @track userData
   @track userName
   error
   showdata = false;
   showModal1 = false;
    @wire(fetchUserDetail)
    wiredUser({ error, data }) {
        if (data) {
            this.userData = data;
            console.log('data>>>',data);
            //this.profileImg = this.userData.MediumPhotoUrl;
            this.userName = this.userData.Name;
        } else if (error) {
            this.error = error;
            console.log('erroeeee>>>',error);
        }
    }

    //  handleClick()
    // {
    //     this.showdata = true;
    //      console.log('Inside',this.showdata);

    // }
    handleClick(){
    const paymentComp = this.template.querySelector('c-bwps_-Donor-Dashboard-Donate-Form');
    paymentComp.donateClickHandler();
}

    // handleClick()
    // {
    //     this.showModal = true;
    //    

    // }

    // closeModal(){
    //       this.showModal = false;
    // }

    //   closeModal1(){
    //       this.showModal1 = false;
    // }

    // passToParent(event){
    //       this.showModal= false;
    //     this.showModal1 = true;
    
         

    // }


}