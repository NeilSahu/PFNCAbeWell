import { LightningElement,track } from 'lwc';
import CaseData from '@salesforce/apex/BWPS_NeedHelpcaseCreate.createCase';
export default class EmailUsContactForm extends LightningElement {
    @track CaseRecords;
    @track temp;
    Subject ='Subject data';
    Body ='Body Data';
    Email ='LWC@gmail.com';
    handleClick(event){
        event.preventDefault();
        this.Subject = this.template.querySelector(`[data-id= 'Subject']`).value;
        this.Body = this.template.querySelector(`[data-id= 'Description']`).value;
        this.Email = this.template.querySelector(`[data-id= 'Email']`).value;
        let sub = this.template.querySelector(`[data-id= 'Subject']`).reportValidity();
        let body = this.template.querySelector(`[data-id= 'Description']`).reportValidity();
        let email = this.template.querySelector(`[data-id= 'Email']`).reportValidity();
       
        this.temp={
            "CaseData":{
                "Subject":this.Subject,
            "Body":this.Body,
            "Email": this.Email
            }            
        }
        console.log('tempObj : ',JSON.stringify(this.temp));
        if(this.Subject != '' && this.Body != '' && this.Email != '' ){
            CaseData({CaseMap:this.temp})			
            .then(result => {
                if(result){
                    this.CaseRecords = result;
                    console.log("output");
                    console.log(this.CaseRecords);
                    console.log("fire");
                    const custEvent = new CustomEvent(
                    'callpasstoparent', {
                        detail: 'false'
                    });
                    this.dispatchEvent(custEvent);
                }
            })
            .catch(error => {
                this.error = error;
                console.log('error',this.error)
            });
        }
    }
    

}

// import { LightningElement,track } from 'lwc';
// import CaseData from '@salesforce/apex/BWPS_NeedHelpcaseCreate.createCase';
// export default class EmailUsContactForm extends LightningElement {
//     @track CaseRecords;
//     @track temp;
//     Subject ='Subject data';
//     Body ='Body Data';
//     Email ='LWC@gmail.com';

//     handleClick(event){

//        this.Subject = this.template.querySelector(`[data-id= 'Subject']`).value;
   
//         if(this.Subject != null && this.Subject != undefined && this.Subject != "")
//         {
//                  console.log("sub",this.Subject);
//             FormData();
//         }
//         else
//         {
//              this.template.querySelector(`[data-id= 'Subject']`).style.border= "1px solid red";   
//         }   
//     }

//     formdata(){
//                      this.Body = this.template.querySelector(`[data-id= 'Description']`).value;
//         this.Email = this.template.querySelector(`[data-id= 'Email']`).value;
       
//          this.temp={
//              "CaseData":{
//                  "Subject":this.Subject,
//              "Body":this.Body,
//              "Email": this.Email
//              }            
//          }

//         console.log("DataMap "+ this.temp);
//         console.log("DataMap 11111",JSON.stringify(this.temp));

//         CaseData({CaseMap:this.temp})			
// 		.then(result => {
//                 this.CaseRecords = result;
//                 console.log("output");
//                 console.log(this.CaseRecords);
//             })
//             .catch(error => {
//                 this.error = error;
//                 console.log('error',this.error)
//             });


//             // console.log("fire");
//             // const custEvent = new CustomEvent(
//             // 'callpasstoparent', {
//             //     detail: 'false'
//             // });
//             this.dispatchEvent(custEvent);

//                     event.preventDefault();
    
//     }

    

// }