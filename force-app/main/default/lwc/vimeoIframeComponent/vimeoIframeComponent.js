import { LightningElement , wire, track, api } from 'lwc';
import { publish,subscribe,unsubscribe,createMessageContext,releaseMessageContext } from 'lightning/messageService';
import VIMEOMC from "@salesforce/messageChannel/ZoomSdkMessageChannel__c";
// import SAMPLEMC from "@salesforce/messageChannel/ZoomSdkMessageChannel__c";
export default class VimeoIframeComponent extends LightningElement {
    context = createMessageContext();
    subscription = null; 

    @track currentVideoUrl;

    @track showVimeoIframe = false;
    showHideVimeoIframe(){
        this.showVimeoIframe = !this.showVimeoIframe;
    }
    // updateCurrentVideoUrlHandler(){
    //   this.currentVideoUrl = "https://player.vimeo.com/video/"+this.currentVideoId+"&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479";
    //   //this.currentVideoUrl = "https://player.vimeo.com/video/762784047?h=315f56a57e";
    // }
    updateCurrentVideoUrlHandler(videoId){
      this.currentVideoUrl = "https://player.vimeo.com/video/"+videoId+"&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479";
      //this.currentVideoUrl = "https://player.vimeo.com/video/762784047?h=315f56a57e";
    }
    connectedCallback() {
      this.subscription = subscribe(this.context, VIMEOMC, (message) => {
          // this.displayMessage(message);
          console.log('VIMEO Id : ',message.videoId);
          this.showHideVimeoIframe();
          this.updateCurrentVideoUrlHandler(message.videoId);
      });
    }
}