import { LightningElement,api,track } from 'lwc';
//import removeScheduleClass from '@salesforce/apex/BWPS_createScheduleClass.removeScheduleClass';

export default class Bwps_instructorDashboardRemoveClass extends LightningElement {
    @track data= [
        {
            ID : '123456789',
            name:`name1`,
        },
        {
            ID : '1234567890',
            name:`name2`,
        },
        {
            ID : '1234567891',
            name:`name3`,
        }
    ];
    @api sclass;
    @track removeClasses=[];
    @track showModal = false;
    @track conformDelete = false;
    @api
    donateClickHandler(){
        this.showModal = true;
        //this.template.querySelector(`[data-id='form-modal']`).style.display = "block";
    }
      
    off() {
        this.showModal = false;
        //this.template.querySelector(`[data-id='form-modal']`).style.display = "none";
    }
    offDelete(){
        this.conformDelete = false;
    }
    getDataRemoveClasses(evt){
       let id = evt.target.dataset.id;
       let check = this.template.querySelector('[data-id="'+id+'"]');

       if(check.checked){ 
           this.removeClasses.push(id);
       }
       else{
        const index = this.removeClasses.indexOf(id);
            if (index > -1) { 
            this.removeClasses.splice(index, 1); 
            }
       }
       console.log("final Array:>>>>>>>>",JSON.stringify(this.removeClasses));
    }

    deleteButton(){
        if(this.removeClasses.length > 0){
            this.conformDelete = true;
         } else{
            alert('Please select class for remove');
         }
    }
    conformForDelete(){
        console.log("final Array:>>>>>>>>",JSON.stringify(this.removeClasses));
        this.conformDelete = false;
        this.showModal = false;
        removeScheduleClass({scheduleClassId : this.removeClasses})
        .then((result)=>{
            console.log('result : ',result);
            
        }).catch(error => {
            console.log(error);
        });

    }
    
}