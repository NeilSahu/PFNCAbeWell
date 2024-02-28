import { LightningElement, wire, track, api } from 'lwc'; 
import getResources from '@salesforce/apex/DNA_InstructorClass.getResources';
export default class InstructorVideos extends LightningElement {
    //  response =
    // [
    //   { "text1": "EXERCISE FOR PARKINSON'S INSTRUCTIONAL VIDEO" },
    //    { "text1": "EXERCISE FOR PARKINSON'S INSTRUCTIONAL VIDEO"},
    //     { "text1": "USEFUL TIPS"},
    //      { "text1": "HOW TO ENGAGE YOUR STUDENTS"}
    // ]
    @track Arr = [];
    filteredArr = [];
    wiredata1 ='';
    @api searchKeyword = '';
    @wire(getResources)
    wiredRes({ data, error }) {
        if (data) {
            let wiredata = data;
            
            this.wiredata1 = data;
            
            for(let i =0;i<4;i++){
               var obj={
                    'Id': wiredata[i].Id,
                    Name:wiredata[i].Name,
                    
                    // Description:data[i].Description__c,
                    Link:"https://player.vimeo.com/video/"+wiredata[i].BWPS_Link__c,
                    // Date : data[i].CreatedDate,
                }
                this.Arr.push(obj);
                console.log('OUTPUT7777 : ',this.Arr);
            }

          // this.Arr = wiredata.map(element =>({ Name: element.Name , Id: element.Id, Link: "https://player.vimeo.com/video/"+element.BWPS_Link__c}));
        } else if (error) {
            var error = error;
        }
    }

    get showAllData(){
        if(this.searchKeyword != ''){
        
            this.filteredArr = (this.Arr).filter(ele => ((ele.Name).toLowerCase()).includes(this.searchKeyword.toLowerCase()));
            return false;
        }
            else
            {
                this.filteredArr = [];
                return true;
            }
        }
        
    }