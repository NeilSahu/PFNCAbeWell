import { LightningElement, track, wire, api } from 'lwc';
import getUserProfileName from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
export default class BwpsAllHeaderComponent extends LightningElement {
    @track isInstructor = false;
    @track isDonor = false;
    @track isGuest = false;

    @wire(getUserProfileName)
    getUserProfile({data,error}){
        if(data){
            console.log(data);
            console.log('profile name : ',data.Profile.Name);
            if(data.Profile.Name == 'Instructor'){
                this.showInstructorDashboard(); 
            }
            else if(data.Profile.Name == 'Donor User'){
                this.showDonorDashboard(); 
            }
            else if(data.Profile.Name == 'Guest User' || data.Profile.Name == 'Member User'){
                console.log('Hello guest');
                this.showGuestDashboard(); 
            }
        }
    }
    showInstructorDashboard(){
        this.isInstructor = true;
    }
    showDonorDashboard(){
        this.isDonor = true;
    }
    showGuestDashboard(){
        this.isGuest = true;
    }
}