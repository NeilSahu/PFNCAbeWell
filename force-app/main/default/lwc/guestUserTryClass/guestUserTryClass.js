import { LightningElement ,wire,track } from 'lwc';
import signal from '@salesforce/resourceUrl/tryclassicon';
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import FetchRecordType from '@salesforce/apex/BWPS_GuestUserHistoryClass.FetchRecordType';
import fetchContactDetail from '@salesforce/apex/BWPS_GuestUserHistoryClass.fetchContactDetail';
export default class guestUserTryclass extends LightningElement {

  lowSignal= lowSignal;
  highSignal =highSignal;
  mediumSignal= mediumSignal;
  isShowModal = false;
  signal = signal;
 @track Exercise =  `${allIcons}/PNG/Exercise.svg `;
  @track Communication =  `${allIcons}/PNG/Speech.svg `;
  @track Socialization =  `${allIcons}/PNG/Yoga.svg `;
  ClassList =[] ;
  @track response;
  // response =
  //   [
  //     { "heading": " Exercise for Parkinson's", "text1": "6", "text2": "6", "text3": "6", "imgUrl": "/sfsites/c/file-asset/Screen1?v=1" },
  //     { "heading": " Parkinson's Communication Clud", "text1": "6", "text2": "6", "text3": "6", "imgUrl": "/sfsites/c/file-asset/Screen1?v=1" },
  //     { "heading": " Dance for Parkinson's ", "text1": "6", "text2": "6", "text3": "6", "imgUrl": "/sfsites/c/file-asset/Screen1?v=1" },
  //     { "heading": " Boxing for Parkinson's", "text1": "6", "text2": "6", "text3": "6", "imgUrl": "/sfsites/c/file-asset/Screen1?v=1" },
  //     { "heading": " Yoga-Chi For Parkinson's", "text1": "6", "text2": "6", "text3": "6", "imgUrl": "/sfsites/c/file-asset/Screen1?v=1" },
  //     { "heading": " High Aerobic Exercise Parkinson's", "text1": "6", "text2": "6", "text3": "6", "imgUrl": "/sfsites/c/file-asset/Screen1?v=1" },
  //     { "heading": " Movement for Parkinson's through martial Arts ", "text1": "6", "text2": "6", "text3": "6", "imgUrl": "/sfsites/c/file-asset/Screen1?v=1" },

  //   ]

   liveCount = 0;
   inPersonCount = 0;
   nameArr= [];
   value;
  @track JSONArr = [];
  @track commInPersonCount = 0;
  @track commLiveCount = 0;
  @track exInPersonCount = 0;
  @track exLiveCount = 0;
  @track soInPersonCount = 0;
  @track soLiveCount = 0;
  @track recordTypes;
  @track Arr = [];
  @wire(FetchRecordType)
  wiredRec({data,error}){
    if(data){
      var data = data;
      console.log('OUTPUT REC: ',JSON.stringify(data));
      function removeDuplicates(data) {
        let unique = [];
        data.forEach(element => {
            if (!unique.includes(element.RecordType.Name)) {
                unique.push(element.RecordType.Name);
            }
        });
        return unique;
      }
      var recordTypes =  removeDuplicates(data);
      console.log('OUTPUT UNIQUE : ',JSON.stringify(recordTypes));
      for( let i=0 ; i < recordTypes.length; i++) {
        
        var LiveCount = 0;
        var InPersonCount = 0;
        for( let j=0 ;j<data.length;j++) {
          // console.log('OUTPUT RECORDS : ',JSON.stringify(recordTypes), data.length);
          if(data[j].RecordType.Name == recordTypes[i]){
            // console.log('OUTPUT Rec : ',recordTypes[i]);
            if(data[j].hasOwnProperty('Schedule_Classes__r')){
              for(let k=0; k < data[j].Schedule_Classes__r.length ; k++){
                var type= data[j].Schedule_Classes__r[k].Schedule_Type__c ;
                if(type == 'Live' || type == 'Hybrid'){
                    // console.log('OUTPUT rhyufwuhfis 2>>>>>>>>>>>>>>>>>>>');
                    LiveCount ++ ;
                }
                if(type == 'In Person' ||  type == 'Hybrid'){
                    // console.log('OUTPUT :fhyurisd 3>>>>>>>>>>>>>>>>>>>');
                    InPersonCount++ ;
                }
              }
            }
          }
        }
        var obj={
          Name : recordTypes[i],
          Live :LiveCount,
          InPerson :InPersonCount,
          Img: `${allIcons}/PNG/${recordTypes[i]}.svg `,
        }
        this.Arr.push(obj);
       
      }console.log('OUTPUT Arr>>>>>>>>>>>>>>>: ',JSON.stringify(obj));  
       
    }
    
    else if(error){
      console.log('errr',errors);
    }
  }
  getClasses(e){
    this.value = e.target.value;
    console.log('OUTPUT COM : ',this.value);
    this.JSONArr = [];
    fetchContactDetail({recType: this.value})
    .then(result =>{
      var data=result;
      try{
            this.response=data;
            // console.log("log",JSON.stringify(this.response));       
            //  console.log("length",this.response.length);       
            for( let i=0 ;i<this.response.length;i++) {
              this.inPersonCount = 0;
              this.liveCount = 0;
              this.nameArr = [];
              if(this.response[i].hasOwnProperty('Schedule_Classes__r')){
                // console.log('if check')
                for(let j=0; j < this.response[i].Schedule_Classes__r.length ; j++){
                  // console.log('OUTPUT : 1>>>>>>>>>>>>>>>>>>>');
                  let type= this.response[i].Schedule_Classes__r[j].Schedule_Type__c ;
                  let name = this.response[i].Schedule_Classes__r[j].Name  ;
                  this.nameArr.push(name);
                  // console.log('OUTPUT!@#%2345678654>>>>>>>>> : ',JSON.stringify(this.nameArr));
                  // console.log('TYPE : ',type);
                  if(type == 'Live' || type == 'Hybrid'){
                      // console.log('OUTPUT : 2>>>>>>>>>>>>>>>>>>>');
                      this.liveCount++ ;
                  }
                  if(type == 'In Person' ||  type == 'Hybrid'){
                    // console.log('OUTPUT : 3>>>>>>>>>>>>>>>>>>>');
                    this.inPersonCount++ ;
                  }
                }  
                
              }
              var obj={
                  Live: this.liveCount,
                  InPerson: this.inPersonCount,
                  Name:this.response[i].Name,
                  SchName: this.nameArr,
                  Img: `${allIcons}/PNG/${this.value}.svg `,
                }
                this.JSONArr.push(obj);
          }}
          catch(e){
            console.log('error msg  : ',e);
            console.log('error msg str  : ',JSON.stringify(e));
          }this.isShowModal = true;
      }).catch(e=>{
            
            console.log("e>>>>",e);
        });
  }
  hideModalBox(){
    this.isShowModal = false;
  }
  handleBrowse(e){
    var intensity = e.target.dataset.id;
    console.log('OUTPUT : ',intensity);
    // var result=window.btoa(intensity);
    window.open('/PFNCADNA/s/guestuserbrowseclasses?active=cod&app='+intensity,'_self');
  }
}