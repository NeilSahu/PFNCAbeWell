import { LightningElement,api,track,wire} from 'lwc';
import { publish,subscribe,unsubscribe,createMessageContext,releaseMessageContext } from 'lightning/messageService';
import IFRAMEMC from "@salesforce/messageChannel/ZoomSdkMessageChannel__c";
//import VIMEOMC from "@salesforce/messageChannel/VimeoOff__c";

import testpic from '@salesforce/resourceUrl/Cardimg';
import UserLogo from '@salesforce/resourceUrl/InstructorLogo';
import sharelogo from '@salesforce/resourceUrl/ShareBlueIcon';
import signal from '@salesforce/resourceUrl/signal';
import heartlogo from '@salesforce/resourceUrl/likeButtonSvg';
import allEntitySubs from '@salesforce/apex/DNA_GuestUserClass.allEntitySubs';
import follow from '@salesforce/apex/DNA_GuestUserClass.follow';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
//import guestEventsDateBetween from '@salesforce/apex/BWPS_GuestMemberEvents.guestEventsDateBetween';
export default class Bwps_MyScheduleDayComp extends LightningElement {
    context = createMessageContext();
    //subscription2 = null; 
    @track favIcon =  `${allIcons}/PNG/Favorite.png `;
    @track unFavIcon = `${allIcons}/PNG/unfavorite.png `;
    imgsrc = testpic;
    sharelogo = sharelogo;
    UserLogo = UserLogo;
    signal = signal;
    heartlogo = heartlogo;
    @track eventsData;
    @api eventsofday=[];
    @api loding;
    @api totalclasses;
    @track showIframe = false;
    @track playersrc = '';
    // @track  StartDate = new Date();
   // @track  endDate = new Date();

   // @api
   // getdates(dataofEvent){
   //  this.StartDate = new Date(dataofEvent);
   //  this.endDate =  new Date(dataofEvent);
   // }
   // @wire(guestEventsDateBetween,{satrtDate:'$StartDate',endDate:'$endDate'})
   // Evendata(data,error){
   //  if(data){
   //     this.eventsData=data;
   //     console.log('todayData>>>>>>',JSON.stringify(this.eventsData));
   //  } else {
   //     console.log(error);
   //  }
   // }

   @track classViewType = false;
    scheduleClassName;
    scheduleClassInstName;
    scheduelClassDescription;
    scheduleclassintensity;
    classdata;
    @track selectedClass = {}
    @api InstDetailView = false;

    scheduleClassDetailViewHandle(event) {
        console.log('Classed CLicked');
        console.log(event.target.dataset.key);
        console.log(event.target.dataset.name);
        console.log(event.target.dataset.schname);
        console.log(event.target.dataset.descp);
        console.log(event.target.dataset.ints);
        this.selectedClass = this.eventsofday.find(e => e.Id == event.target.dataset.key);
        this.scheduleClassName = event.currentTarget.dataset.schname;
        this.scheduleClassInstName = event.currentTarget.dataset.name;
        this.scheduelClassDescription = event.currentTarget.dataset.descp;
        this.scheduleclassintensity = event.currentTarget.dataset.ints;
        console.log('Tested');
        this.InstDetailView = true;
        document.querySelector('html').style.overflow = 'hidden';
    }

    trueparent() {
        this.InstDetailView = false;
        document.querySelector('html').style.overflow = 'auto';
    }
    
   @track currentRecId;
    StartClass(){
        console.log('startClassLog : ');
        //this.showIframe = !this.showIframe;
        clearInterval(this.intevelId);
        updateTime({watchTime:`${this.totalSec}`,classId : this.currentRecId}).then((r)=>{
        console.log('rrr>>',r);
        }).catch(e=>{
        console.log('eee>>',e);
        });
    }
    startTimer(){
        this.intevelId = setInterval(() => {
            if(this.ss<59){
                this.ss= this.ss+ 1; 
            } else if(this.mm < 59 && this.ss == 59){
                this.mm =  this.mm +1;
                this.ss = 0;
            } else if (this.mm == 59){
                this.hh =this.hh+1;
            }
            this.totalSec = this.totalSec+1;
        console.log(`${this.ss} ss: ${this.mm} mm : ${this.hh} hh`);
        },1000);
    }
    connectedCallback() {
        // this.subscription2 = subscribe(this.context, VIMEOMC, (message) => {
        //     // this.displayMessage(message);
        //     console.log('msg : ',message);
        //     if(message.iframeStatus == 'close'){
        //         console.log('msg3 : ');
        //             //this.closeIframeTime();
        //             this.StartClass();
        //     }
        // });
    }
    favHandler(event){
        console.log('IMAGE CLICK : ',event.target.dataset.image);
        console.log('Fav CLICK : ',this.favIcon);
        let src = this.template.querySelector(`[data-image=${event.target.dataset.image}]`).src;
        let favStr = src.split('PNG/')[1];
        let recId = event.target.dataset.image;
        console.log('Fav CLICK2 : ',favStr,src,this.favIcon,favStr == 'Favorite.png');
        if(favStr == 'Favorite.png'){
            console.log('in if : ');

            this.favoriteHandler(recId, true);
            this.template.querySelector(`[data-image=${event.target.dataset.image}]`).src=this.unFavIcon;
        }
        else{
            console.log('in else : ');
            this.favoriteHandler(recId, false);
            this.template.querySelector(`[data-image=${event.target.dataset.image}]`).src=this.favIcon;
        }
        console.log('IMAGE CLICK2 : ');

    }
    favoriteHandler(recId , status){
    //   let classId = event.target.dataset.id;
    //   let classStatus = event.target.dataset.isfav;
      //console.log('classStatus : ',classStatus);
      follow({recId : recId , isFollowing : status})
      .then(result => {
        //console.log('response : ',result);
        if(result == true){
            this.template.querySelector('c-toast-message').showToast('success', 'Update successfully.');
        }
        else if(result == false){
                this.template.querySelector('c-toast-message').showToast('success', 'Update successfully.');
        }
      })
      .catch(error => {
          console.log('Error : ',JSON.stringify(error));
      })

    }
    playClass(event){
        const obj = this.eventsofday.find(e=> e.Id == event.target.dataset.key);
        this.currentRecId = obj.Id;
        let className = obj.btnLabel;
        let videoId = obj.vimeoId;
        let meetingId = obj.meetingId;
        let name = obj.instructor;
        console.log('className : ',className);
        if(className == 'PLAY ON-DEMAND' || className == 'COMPLETED' || className == 'RESUME' ){
            this.updateCurrentVideoUrlHandler(videoId, this.currentRecId,obj.WatchTime);
        }
        if(className == 'JOIN'){
            this.sendZoomData2(meetingId, name);
        }
        // console.log('vedio play',event.target.dataset.key);
        // console.log('vedio play',JSON.stringify(this.eventsofday));
        // const obj = this.eventsofday.find(e=> e.Id == event.target.dataset.key);
        // console.log('hhhhhh>>> ', JSON.stringify(obj));
        //this.playersrc =`https://player.vimeo.com/video/${obj.vimeoId}`;
        // setTimeout((e) => {
        //     // window.scrollTo({top:0,left:0,behavior:'smooth'});
        //     //this.showIframe =true;
        // }, 100);
    }
    // updateCurrentVideoUrlHandler(videoId){
    //     let message = {
    //         videoId : videoId,
    //         iframeStatus : 'Vimeo'
    //     };
    //     publish(this.context, IFRAMEMC, message);
    //     //this.currentVideoUrl = "https://player.vimeo.com/video/"+videoId+"&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479";
    //     //this.currentVideoUrl = "https://player.vimeo.com/video/762784047?h=315f56a57e";
    // }
     updateCurrentVideoUrlHandler(videoId,scliId,watchTime){
        let message = {
            videoId : videoId,
            iframeStatus : 'Vimeo',
            scliId : scliId,
            watchTime : watchTime
        };
        publish(this.context, IFRAMEMC, message);
        //this.currentVideoUrl = "https://player.vimeo.com/video/"+videoId+"&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479";
        //this.currentVideoUrl = "https://player.vimeo.com/video/762784047?h=315f56a57e";
    }
    // sendZoomData(meetingId, name) {
    //   console.log('send : ',meetingId ,name );
    //     let message = {
    //         meetingId : meetingId,
    //         AttendeeName : name,
    //         iframeStatus : 'Zoom'
    //     };
    //     publish(this.context, IFRAMEMC, message);
    // }  
     sendZoomData2(meetingId, name) {
      console.log('send2 : ',meetingId ,name );
        let message = {
            meetingId : meetingId,
            AttendeeName : name,
            iframeStatus : 'Zoom'
        };
        publish(this.context, IFRAMEMC, message);
    } 
}