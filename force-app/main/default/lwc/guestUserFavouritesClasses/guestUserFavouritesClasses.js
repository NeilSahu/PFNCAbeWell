import { LightningElement ,track,wire,api } from 'lwc';
import { publish,subscribe,unsubscribe,createMessageContext,releaseMessageContext } from 'lightning/messageService';
import IFRAMEMC from "@salesforce/messageChannel/ZoomSdkMessageChannel__c";

import Instructor_Dashboard_cardsImages from '@salesforce/resourceUrl/Instructor_Dashboard_cardsImages';
import myImage from '@salesforce/resourceUrl/ExerciseImage';
//high signal
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
//low signal
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
//medium signal
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';
import shareIcon from '@salesforce/resourceUrl/ShareIconBlueColor';
import userIcon from '@salesforce/resourceUrl/UserLogo';
import Instructor from '@salesforce/resourceUrl/InstructorLogo';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import bellIcon from '@salesforce/resourceUrl/Bell_Icon';
import getFavClasses from '@salesforce/apex/DNA_GuestUserClass.getFavClasses';
import getFavRecords from '@salesforce/apex/DNA_GuestUserClass.getFavRecords';
import getAllFavLineItems from '@salesforce/apex/BWPS_WIPBrowseClasses.getAllFavLineItems';
import updateFavClass from '@salesforce/apex/DNA_GuestUserClass.updateFavClass';
import allEntitySubs from '@salesforce/apex/DNA_GuestUserClass.allEntitySubs';
import follow from '@salesforce/apex/DNA_GuestUserClass.follow';
import {refreshApex} from '@salesforce/apex';
import fetchNotification from '@salesforce/apex/Bwps_getuserNotification.getUserNotification';
import getUserProfileName from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';

export default class GuestUserFavouritesClasses extends LightningElement {
    highSignal = highSignal;
    lowSignal = lowSignal;
    bellIcon = bellIcon;
    mediumSignal = mediumSignal;
    shareIcon = shareIcon;
    userIcon = Instructor;
    @track favIcon =  `${allIcons}/PNG/Favorite.png `;
    @track unFavIcon = `${allIcons}/PNG/unfavorite.png `;
    totalCardElementArray;
    visibleCardArray;
    @track haveFav = false;
    @track visibleCardElementArray = [];
    @track searchResultArray = [];
    // defaultSCImage = Instructor_Dashboard_cardsImages;
    defaultSCImage = myImage;
    cardElementArray;
    @track joinCheck=[];
    @track joinCheck1=[];
    @track favMainArr = [];
    @track isShowSendModal = false;
    @track isFavoriteFlag = false;
    @track notrecords=[];
    @track notificationVisibel=[];
    @track totalNotifications =0;
    @track showInsLine = false;
    @track showFavLine = true;
    @track showArticlesLine = false;
    @track userName = '';
    context = createMessageContext();
    subscription = null; 

    @wire(getUserProfileName)
    getUserProfile({data,error}){
        if(data){
            // console.log(data);
            this.userName = data.FirstName??'' +' '+data.LastName??'';
            console.log('profile name : ',data.Profile.Name);
        }
        if(error){
            console.log('error : ',error, JSON.stringify(error),error.message);
        }
    }
    sendZoomData(meetingId, name) {
      console.log('send2 : ',meetingId ,name );
        let message = {
            meetingId : meetingId,
            AttendeeName : name,
            iframeStatus : 'Zoom'
        };
        publish(this.context, IFRAMEMC, message);
    }
    updateCurrentVideoUrlHandler(scliId,videoId,watchTime){
        let message = {
            videoId : videoId,
            scliId : scliId,
            iframeStatus : 'Vimeo',
            watchTime : watchTime
        };
        publish(this.context, IFRAMEMC, message);
      // this.currentVideoUrl = "https://player.vimeo.com/video/"+videoId+"&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479";
    }
    handleVimeoIframe(event){
        let currData = this.searchResultArray.find(e=> e.Id == event.target.dataset.key);
        let status = currData.btnLabel;
        console.log('IframeStatus : ', status);
        //for vimeo iframe
        if(status == 'PLAY ON-DEMAND' || status == 'RESUME' || status == 'COMPLETED'){
          //this.showHideVimeoIframe();
          let videoId = currData.videoId;
          let meetingId = currData.meetingId;
          let name = currData.userName;
          let scliId = currData.Id;
          let watchTime = currData.WatchTime;

          this.updateCurrentVideoUrlHandler(scliId,videoId,watchTime);
        }
        //for zoom iframe
        else if(status == 'JOIN'){
          let meetingId = currData.meetingId;
          let name = currData.userName;
          // this.sendZoomData(meetingId, name);
          this.sendZoomData(meetingId, name);
        }
    }

    handleClasses(){
      this.showFavLine = true;
      this.showInsLine = false;
      this.showArticlesLine = false;
    }
    handleInstructor(){
      this.showFavLine = false;
      this.showInsLine = true;
      this.showArticlesLine = false;
    }
    handleArticles(){
      this.showFavLine = false;
      this.showInsLine = false;
      this.showArticlesLine = true;
    }
   @wire(fetchNotification)
   wiredData({ data, error }) {
    if(data != null && data != '' && data != undefined){
    var notificationData =  JSON.parse(JSON.parse(data));
    var firstLoop = true;
    for(let i= 0;i<notificationData.notifications.length;i++){
      var nottificationdate = new Date(notificationData.notifications[i].mostRecentActivityDate);
      var todayDate = new Date();
      var timeinMilliSec = todayDate-nottificationdate+'ago';
    if(notificationData.notifications[i].read == false){
      this.totalNotifications+=1;
     }
     var obj = {
       id:notificationData.notifications[i].id,
       Name:'Kirsten Bodensteiner',
       image:notificationData.notifications[i].image,
       Active__c : timeinMilliSec,
       Message__c:notificationData.notifications[i].messageBody,
     }
     this.notrecords.push(obj);
     if(firstLoop){
     this.notificationVisibel.push(obj);
     firstLoop=false;
     }
    
    }
    
    } else {
       console.log('errorfghgg>>> ',JSON.stringify(error));
    }
    }
    // @track visibleCardElementArray = [{url:this.defaultSCImage,text:'Deanna Ballard',textName:'HIGH AEROBIC EXERCISE FOR PARINSON\'S' , textButton:'COMPLETED' , time:''},
    // {url:this.defaultSCImage,text:'Joy McLaughing', textName:'EXERCISE FOR PARINSON\'S',textButton:'JOINED', time:'05:00/TUE'},
    // {url:this.defaultSCImage,text:'Kristain Bain',textName:'BOXING FOR PARINSON\'S',textButton:'START', time:''},
    // {url:this.defaultSCImage,text:'Deanna Ballard',textName:'HIGH AEROBIC EXERCISE FOR PARINSON\'S',textButton:'COMPLETED', time:''},
    // {url:this.defaultSCImage,text:'Joy McLaughing',textName:'EXERCISE FOR PARINSON\'S',textButton:'JOINED', time:'05:00/TUE'},
    // {url:this.defaultSCImage,text:'Kristain Bain',textName:'BOXING FOR PARINSON\'S',textButton:'START', time:''}];

    renderedCallback(){
        this.clickHandlerJoin();
        //refreshApex(this.favMainArr);
    }
    @track showNotificationFlag = false;
    showNotificationMethod(){
        this.showNotificationFlag = !this.showNotificationFlag;
    }
    connectedCallback() {
    }

    clickHandlerJoin(){
      console.log('Function call check.');
      try{
        this.joinCheck = this.template.querySelectorAll('[data-id="COMPLETED"]');
        console.log("Join check:--------------",this.joinCheck);   
          this.joinCheck.forEach(Item => {
          Item.className = "green-buttonSH";
          });
      }
      catch(error){
        console.log('errorrr : ',error);
      }
    }

    // handle Fav and unFav code
    // favIconMethod(){
    //   this.isFavoriteFlag = true;
    // }
    // unFavIconMethod(){
    //   this.isFavoriteFlag = false;
    // }
    favoriteHandler2(event){
      let classId = event.target.dataset.id;
      let classStatus = event.target.dataset.isfav;
      //console.log('classStatus : ',classStatus);
      follow({recId : classId , isFollowing : classStatus})
      .then(result => {
        //console.log('response : ',result);
        if(result == true){
          this.visibleCardElementArray.forEach(e => {
            //TODO : currentItem
            if(String(e.Id) == classId){
              e.classFavStatus = true;
              this.template.querySelector('c-toast-message').showToast('success', 'Favorite successfully.');
              console.log('if true class status : ',e.classFavStatus);
            }
          });
        }
        else if(result == false){
          this.visibleCardElementArray.forEach(e => {
            //TODO : currentItem
            if(e.Id == classId){
              e.classFavStatus = false;
              this.template.querySelector('c-toast-message').showToast('success', 'Unfavorite successfully.');
              console.log('if false class status : ',e.classFavStatus);
            }
          });
        }
      })

    }
    favoriteHandler(event){
      //this.favIconMethod();
      let classId = event.target.dataset.id;
      //let classId = 'a0x3C000001cmDJQAA';
      //console.log('ClassId : ',classId);
      updateFavClass({clsId : classId})
      .then(result => {
        //console.log('fav result : ',result);
        if(result == 'Success'){
          this.visibleCardElementArray.forEach(e => {
            //TODO : currentItem
            let eId = e.Id;
            if(eId == classId){
              e.BPWS_Favourite__c = !e.BPWS_Favourite__c;
              if(e.BPWS_Favourite__c){
                this.template.querySelector('c-toast-message').showToast('success', 'Favorite successfully.');
              }
              else{
                this.template.querySelector('c-toast-message').showToast('success', 'Unfavorite successfully.');
              }
            }
          });
        }
        else if(result == 'Failed'){
          //this.template.querySelector('c-recurring-donation').showToast('error', 'Unfavorite was not successful.');
          this.visibleCardElementArray.forEach(e => {
            //TODO : currentItem
            let eId = e.Id;
            //.log('Inside failed loop ');
            if(eId == classId){
              //console.log('(e.BPWS_Favourite__c : ',e.BPWS_Favourite__c);
              //e.BPWS_Favourite__c = !e.BPWS_Favourite__c;
              if(e.BPWS_Favourite__c){
                //console.log('inside of failed if');
                this.template.querySelector('c-toast-message').showToast('error', 'Unfavorite was not successful.');
              }
              else{
                this.template.querySelector('c-toast-message').showToast('error', 'Favorite was not successful.');
              }
            }
          });
        }
      })
      .catch(error =>{
        console.log('error : ',JSON.stringify(error));
      })
      //this.renderedCallback();
      //refreshApex(this.favMainArr);
      console.log('Hii fav',);

    }


    // Share a class block
    hideSendModalBox(){
        this.isShowSendModal = false;
    }
    showSendModalBox(){
        this.isShowSendModal = true;
    }

    handleShare(event){
        this.showSendModalBox();
        let scId = event.target.dataset.id;
        let scDescription = event.target.dataset.description;
        console.log('Schedule Class Id : ', scId);
        console.log('Schedule Class Id : ', scDescription);
        
    }

    @track CaseRecords;
    @track temp;
    Subject ='Subject data';
    Body ='Body Data';
    Email ='LWC@gmail.com';
    sendMailMethod(){
        console.log('ind');
        this.Subject = this.template.querySelector(`[data-id= 'Subject']`).value;
        this.Body = this.template.querySelector(`[data-id= 'Description']`).value;
        this.Email = this.template.querySelector(`[data-id= 'Email']`).value;
         this.temp={
             "LeadDetails":{
                "Subject":this.Subject,
                "Body":this.Body,
                "Email": this.Email
             }
         }
        console.log("body  "+this.Body);
        console.log("temp : ",JSON.stringify(this.temp));
        LeadData({LeadDetails:this.temp})
        .then(result => {
            this.CaseRecords = result;
            console.log("output");
            console.log(this.CaseRecords);
        })
        .catch(error => {
            this.error = error;
            console.log('error',this.error)
        });
        console.log("fire");
        const custEvent = new CustomEvent(
        'callpasstoparent', {
            detail: 'false'
        });
        this.dispatchEvent(custEvent);
        this.template.querySelector('c-recurring-donation').showToast('success', 'Mail sent successfully.');
        this.hideSendModalBox();
    }

    // Getting all fav and their parent records
    // @wire(getFavClasses)
    // getFavoriteClass({data,error}){
    //   console.log('data : ',JSON.stringify(data));
    //   if(data){
    //     this.favMainArr = data;
    //     let attendeeData = this.favMainArr;
    //     let tempArr = [];
    //     //console.log('scArr : ',JSON.stringify(scArr));
    //     attendeeData.forEach(r => {
    //         let a = JSON.parse(JSON.stringify(r));
    //         a.scImage = this.defaultSCImage;
    //         a.classFavStatus = false;
    //         a.instructorFavStatus = false;
    //         a.articleFavStatus = false;
    //         a.instructorName = 'Kristain Bain';
    //         a.classTime = '05:00/TUE';
    //         //a.Class_Status__c = 'JOINED';
    //         if(!a.Class_Status__c){
    //           a.Class_Status__c = 'COMPLETED';
    //         }
    //         let lineItemTempArr = [];
    //         let scLineItemArr = a.Schedule_Class_Line_Item_del__r;
    //         if(a.Schedule_Class_Line_Item_del__r != undefined){
    //             if(scLineItemArr.length > 1){
    //               scLineItemArr.forEach(scli => {
    //                   let e = JSON.parse(JSON.stringify(scli));
    //                   //e.action = 'EDIT';
    //                   e.shortDay = 'MON';
    //                   if(e.BWPS_ClassDay__c != undefined && e.BWPS_ClassDay__c != null && e.BWPS_ClassDay__c != ''){
    //                       let day = e.BWPS_ClassDay__c;
    //                       e.shortDay = day.substring(0,3).toUpperCase();
    //                   }
    //                   if(e.BWPS_StartTime__c != undefined){
    //                     var timeInHours = ((Number(e.BWPS_StartTime__c)/1000)/60)/60;
    //                     if(timeInHours == 0){
    //                         e.scLineItemTime = '12:00AM';
    //                     }else{
    //                         var isInteger = Number.isInteger(timeInHours)
    //                         let timeOfDay = timeInHours < 12 ? 'AM' : 'PM';
    //                         timeInHours -= timeInHours <= 12 ? 0 : 12;
    //                         if(isInteger){
    //                             e.scLineItemTime = String(timeInHours).padStart(2, '0')+':00' + timeOfDay;
    //                         }else{
    //                             var hours = String(timeInHours).split('.')[0];
    //                             var decimalMins = String(timeInHours).split('.')[1];
    //                             // convert decimalMin to seconds
    //                             decimalMins = (String(decimalMins)[0]) + '.' + (String(decimalMins).substr(1));
    //                             var min = Math.round(6 * decimalMins);
    //                             e.scLineItemTime = String(hours).padStart(2, '0')+':'+String(min).padStart(2, '0')+'' + timeOfDay;
    //                         }
    //                     }
    //                   }
    //                   else{
    //                       e.scLineItemTime = '00:00AM';
    //                   }
    //                   let sig = e.BWPS_Integrity__c;
    //                   console.log('loop intensity : ',e.BWPS_Integrity__c);
    //                   if(sig == 'Low/Seated'){
    //                       e.intensity = lowSignal;
    //                   }
    //                   else if(sig == 'Medium'){
    //                       e.intensity = mediumSignal;
    //                   }
    //                   else if(sig == 'High/Active'){
    //                       e.intensity = highSignal;
    //                   }
    //                   else{
    //                       e.intensity = lowSignal;
    //                   }
    //               });
    //               lineItemTempArr.push(a);
    //             }
    //             else{
    //               let e = a.Schedule_Class_Line_Item_del__r;
    //               e.shortDay = 'MON';
    //               if(e.BWPS_ClassDay__c != undefined && e.BWPS_ClassDay__c != null && e.BWPS_ClassDay__c != ''){
    //                   let day = e.BWPS_ClassDay__c;
    //                   e.shortDay = day.substring(0,3).toUpperCase();
    //               }
    //               if(e.BWPS_StartTime__c != undefined){
    //                 var timeInHours = ((Number(e.BWPS_StartTime__c)/1000)/60)/60;
    //                 if(timeInHours == 0){
    //                     e.scLineItemTime = '12:00AM';
    //                 }else{
    //                     var isInteger = Number.isInteger(timeInHours)
    //                     let timeOfDay = timeInHours < 12 ? 'AM' : 'PM';
    //                     timeInHours -= timeInHours <= 12 ? 0 : 12;
    //                     if(isInteger){
    //                         e.scLineItemTime = String(timeInHours).padStart(2, '0')+':00' + timeOfDay;
    //                     }else{
    //                         var hours = String(timeInHours).split('.')[0];
    //                         var decimalMins = String(timeInHours).split('.')[1];
    //                         // convert decimalMin to seconds
    //                         decimalMins = (String(decimalMins)[0]) + '.' + (String(decimalMins).substr(1));
    //                         var min = Math.round(6 * decimalMins);
    //                         e.scLineItemTime = String(hours).padStart(2, '0')+':'+String(min).padStart(2, '0')+'' + timeOfDay;
    //                     }
    //                 }
    //               }
    //               else{
    //                   e.scLineItemTime = '00:00AM';
    //               }
    //               //let e = JSON.parse(JSON.stringify(scli));
    //               //e.action = 'EDIT';
    //               let sig = e.BWPS_Integrity__c;
    //               console.log('single intensity : ',e.BWPS_Integrity__c);
    //               if(sig == 'Low/Seated'){
    //                   e.intensity = lowSignal;
    //               }
    //               else if(sig == 'Medium'){
    //                   e.intensity = mediumSignal;
    //               }
    //               else if(sig == 'High/Active'){
    //                   e.intensity = highSignal;
    //               }
    //               else{
    //                   e.intensity = lowSignal;
    //               }
    //               a.Schedule_Class_Line_Item_del__r = scLineItemArr;
    //             }

    //         } 
    //         tempArr.push(a);
    //     });

    //     console.log('after processs : ',JSON.stringify(tempArr));
    //     this.visibleCardElementArray = tempArr;
    //     this.searchHandler({'target':{'value':''}});

        // allEntitySubs()
        // .then(result => {
        //   console.log('outside : ',JSON.stringify(result));
        //   //console.log('visible array : ',JSON.stringify(this.visibleCardElementArray));
        //   if(result){
        //     console.log('result : ',JSON.stringify(result));
        //     //console.log(' inside visible array : ',JSON.stringify(this.visibleCardElementArray));
        //     result.forEach(es => {
        //       //TODO : currentItem
        //       this.visibleCardElementArray.forEach(cls => {
        //         //TODO : currentItem
        //         if(es.ParentId == cls.Id){
        //           console.log('class name : ',cls.Name);
        //           cls.classFavStatus = true;
        //           this.haveFav = true;
        //         }
        //       });
        //     });
        //   }
        // })

    //   }
    //   if(error){
    //     console.log('error : ',error);
    //   }
    // }
    @wire(getAllFavLineItems)
    getAllFavLineItems({data,error}){
      console.log('data : ',JSON.stringify(data));
      if(data){
        try{
          this.favMainArr = data;
          let attendeeData = this.favMainArr;
          let tempArr = [];
          //console.log('scArr : ',JSON.stringify(scArr));
          attendeeData.forEach(r => {
              let a = JSON.parse(JSON.stringify(r));
              a.scImage = this.defaultSCImage;
              a.classFavStatus = true;
              a.instructorFavStatus = false;
              a.articleFavStatus = false;
              // a.instructorName = 'Kristain Bain';
              a.classTime = true;
              //a.Class_Status__c = 'JOINED';
              if(a.BWPS_Class_Day__c != undefined && a.BWPS_Class_Day__c != null && a.BWPS_Class_Day__c != ''){
                  let day = a.BWPS_Class_Day__c;
                  a.shortDay = day.substring(0,3).toUpperCase();
              }
              else{
                a.shortDay = 'NA';
              }
              if(a.BWPS_StartTime__c != undefined){
                var timeInHours = ((Number(a.BWPS_StartTime__c)/1000)/60)/60;
                if(timeInHours == 0){
                    a.scLineItemTime = '12:00AM';
                }else{
                    var isInteger = Number.isInteger(timeInHours)
                    let timeOfDay = timeInHours < 12 ? 'AM' : 'PM';
                    timeInHours -= timeInHours <= 12 ? 0 : 12;
                    if(isInteger){
                        a.scLineItemTime = String(timeInHours).padStart(2, '0')+':00' + timeOfDay;
                    }else{
                        var hours = String(timeInHours).split('.')[0];
                        var decimalMins = String(timeInHours).split('.')[1];
                        // convert decimalMin to seconds
                        decimalMins = (String(decimalMins)[0]) + '.' + (String(decimalMins).substr(1));
                        var min = Math.round(6 * decimalMins);
                        a.scLineItemTime = String(hours).padStart(2, '0')+':'+String(min).padStart(2, '0')+'' + timeOfDay;
                    }
                }
              }
              else{
                  a.scLineItemTime = '00:00AM';
              }
              let sig = a.Schedule_Class__r.Integrity__c;
              console.log('single intensity : ',a.Schedule_Class__r.Integrity__c);
              if(sig == 'Low/Seated'){
                  a.intensity = lowSignal;
              }
              else if(sig == 'Medium'){
                  a.intensity = mediumSignal;
              }
              else if(sig == 'High/Active'){
                  a.intensity = highSignal;
              }
              else{
                  a.intensity = lowSignal;
              }
              a.videoDuration = a.Video_Duration__c;
              a.videoId = a.BWPS_Vimeo_video_Id__c;
              a.meetingId = a.LectureId__c;
              a.WatchTime = 0;
              let AttendeeStatus = '';
              if(a.Attendees_del__r != undefined){
                let e = a.Attendees_del__r[0];
                if(!e.Class_Status__c){
                  // a.Class_Status__c = e.Class_Status__c;
                  a.AttendeeStatus = e.Class_Status__c;
                }
                a.WatchTime = e.BWPS_WatchedTimeStamp__c;
                //let e = JSON.parse(JSON.stringify(scli));
                //e.action = 'EDIT';
                a.Attendees_del__r = e;
              }
              let jDate = new Date(new Date(a.BWPS_ClassDate__c));
              let j1Date = new Date();
              jDate.setHours(0,0,0,0);
              let datestart = new Date();
              datestart.setHours(0,0,0,0);
              let todayms = j1Date.getTime() - datestart.getTime();
              j1Date.setHours(0,0,0,0);
              let btnClass = '';
              let btnLabel = 'JOIN';
              let isOver = false;
              console.log('j1Date : ',j1Date);
              console.log('check : ',j1Date === jDate);
              if(j1Date-jDate == 0){
                  let updatedLineItemStartTime = Number(a.BWPS_StartTime__c) - 900000;
                  let updatedLineItemEndTime = Number(a.BWPS_EndTime__c) + 900000;
                  //cur['disabledClass'] = 'statusClass unDisabledClass';
                  if(todayms >= updatedLineItemStartTime && todayms <= updatedLineItemEndTime){
                  btnClass = 'buttonContainer';
                  }
                  else{
                      if(a.BWPS_Vimeo_video_Id__c != null && a.BWPS_Vimeo_video_Id__c != undefined && a.BWPS_Vimeo_video_Id__c != '' ){
                          btnClass  = 'buttonContainer';
                          if(AttendeeStatus == 'RESUME'){
                              btnLabel = 'RESUME';
                          }
                          else if(AttendeeStatus == 'COMPLETED'){
                              btnLabel = 'COMPLETED';
                          }
                          else{
                              btnLabel = 'PLAY ON-DEMAND';
                          }
                          isOver = true;
                      }else{
                          btnLabel = (todayms >= updatedLineItemEndTime)?'OVER':'JOIN';
                          btnClass = 'buttonContainer btnDisabled';

                      }
                  }
              }else{
                  if(a.BWPS_Vimeo_video_Id__c != null && a.BWPS_Vimeo_video_Id__c != undefined && a.BWPS_Vimeo_video_Id__c != '' ){
                      btnClass  = 'buttonContainer';
                      if(AttendeeStatus == 'RESUME'){
                          btnLabel = 'RESUME';
                      }
                      else if(AttendeeStatus == 'COMPLETED'){
                          btnLabel = 'COMPLETED';
                      }
                      else{
                          btnLabel = 'PLAY ON-DEMAND';
                      }
                      isOver = true;
                  }else{
                      // btnLabel = (todayms >= updatedLineItemEndTime)?'OVER':'START';
                      // btnClass = 'box-orange btnDisabled';
                      btnLabel = (j1Date < jDate)?'JOIN':'OVER';
                      isOver = btnLabel == 'OVER'?true:false;
                      btnClass = 'buttonContainer btnDisabled';
                  }
                  a.btnClass = btnClass;
                  a.btnLabel = btnLabel;
                  // if(a.BWPS_Vimeo_video_Id__c != null && a.BWPS_Vimeo_video_Id__c != undefined && a.BWPS_Vimeo_video_Id__c != '' ){
                  //     btnClass  = 'box-orange';
                  //     btnLabel = 'PLAY ON-DEMAND';
                  //     isOver = true;
                  // } else {
                      // btnLabel = (j1Date < jDate)?'JOIN':'OVER';
                      // isOver = btnLabel == 'OVER'?true:false;
                      // btnClass = 'box-orange btnDisabled';
                  // }

              }

              tempArr.push(a);
              console.log('after processs : ',JSON.stringify(tempArr));
              this.visibleCardElementArray = tempArr;
          })
          allEntitySubs()
          .then(result => {
            console.log('outside : ',JSON.stringify(result));
            //console.log('visible array : ',JSON.stringify(this.visibleCardElementArray));
            if(result){
              console.log('result : ',JSON.stringify(result));
              //console.log(' inside visible array : ',JSON.stringify(this.visibleCardElementArray));
              result.forEach(es => {
                //TODO : currentItem
                this.visibleCardElementArray.forEach(cls => {
                  //TODO : currentItem
                  if(es.ParentId == cls.Id){
                    cls.classFavStatus = true;
                    this.haveFav = true;
                  }
                });
              });
            }
          })
          this.searchHandler({'target':{'value':''}});
        }
        catch(error){
          console.log('errorr : ',JSON.stringify(error),error.message);
        }
      }
      if(error){
        console.log('error : ',error);
      }
    }

    searchIconHandler(){
      try{
        console.log('inhandler');
        var searchInputValue = this.template.querySelector('.searchInputClass').value;
        console.log('searchInputValue : ',searchInputValue);
        this.searchHandler({'target':{'value': searchInputValue}});
      }
      catch(error){
        console.log('error : ',error.message);
      }
    }
    @track isLoaded = true;
    searchHandler(event){
      try{
        let val = event.target.value.toLowerCase();
          console.log('event str : ',val);
          this.isLoaded = false;
          this.searchResultArray = [];
          var tempArr = [];
          this.visibleCardElementArray.forEach(e => {
              if(val == '' ||  e.Name.toLowerCase().includes(val) || e.Schedule_Class__r.Integrity__c.toLowerCase().includes(val) || e.Schedule_Class__r.BWPS_instructor__r.Name.toLowerCase().includes(val)){
                console.log('get name : ',e.Name);
                console.log('classFavStatus : ',e.classFavStatus);
                if(e.classFavStatus){
                  tempArr.push(e);
                }
              }
          });
          this.searchResultArray = tempArr;
          console.log('searchArray : ',JSON.stringify(this.searchResultArray));
          console.log('searchlength : ',tempArr.length);

          if(tempArr.length > 0){
            this.haveFav = true;
          }
          else{
            this.haveFav = false;
          }
          this.isLoaded = true;
        }
        catch(error){
          console.log('errorr : ',error.message);
        }
    }
}