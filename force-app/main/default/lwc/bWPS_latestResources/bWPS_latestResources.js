import { LightningElement,track,api,wire } from 'lwc';
import getResources from '@salesforce/apex/DNA_InstructorClass.getResources';
import yogaWIP from '@salesforce/resourceUrl/yogaWIP';

export default class BWPS_latestResources extends LightningElement {
    @track yogaWIP = yogaWIP;
    inpsrch = '';
    months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    Resources =true;
    showVideo = false;
    showQuizes = false;
    showClassFlow = false;

    searchKeyword = '';


    wiredRes;
    @track Arr= [];
    splitUpdatedDate;
    @wire(getResources)
    wiredRes({ error, data }) {
        if (data) {
            console.log('OUTPUT : ',data);
            for(let i =0;i<1;i++){
            var intialDateObj = new Date(data[i].CreatedDate);
            var splitDay=intialDateObj.getDate();
            var splitMonth=this.months[intialDateObj.getMonth()];
            var splitYear= intialDateObj.getFullYear();
            this.splitUpdatedDate = splitMonth+" "+splitDay+","+" "+splitYear;
                var obj={
                    Name:data[i].Name,
                    Description:data[i].Description__c,
                     Link:"https://player.vimeo.com/video/"+data[i].BWPS_Link__c,
                }
                this.Arr.push(obj);
            }
        } else if (error) {
            var error = error;
            console.log('error : ',JSON.stringify(error) , error.message);
        }
    }

    

      handleClick(event) {

        this.inpsrch = event.target.dataset.id;

        this.searchKeyword = this.inpsrch;
       
        console.log("filterValue",this.inpsrch);
    }
    changeSearchKeyword(){
        this.inpsrch = event.target.value;
    }
   

    buttonSearch(){

        this.searchKeyword = this.inpsrch;
        console.log("showd",this.searchKeyword);
    }


}