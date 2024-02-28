import { LightningElement, wire, api, track } from 'lwc';
import generateSignature from '@salesforce/apex/ZoomIframeController.generateSignature';
import { publish, subscribe, unsubscribe, createMessageContext, releaseMessageContext } from 'lightning/messageService';
import IFRAMEMC from "@salesforce/messageChannel/ZoomSdkMessageChannel__c";
import VIMEOMC from "@salesforce/messageChannel/VimeoOff__c";
import createGetAttendee from '@salesforce/apex/Bwps_PlayOnDemandHendler.createGetAttendee';
import updateTime from '@salesforce/apex/BWPS_LoginUserProfileCtrl.updateAttendeeTime';

export default class ZoomWebSdk extends LightningElement {
    context = createMessageContext();
    subscription = null;
    showClassIframe = false;
    @track meeting = 'okay';
    @track currentVideoUrl;
    @track showVimeoIframe = false;
    @track url = '';
    showHideIframe() {
        this.showClassIframe = !this.showClassIframe;
    }
    @track intevelId;
    @track ss = 1;
    @track mm = 0;
    @track hh = 0;
    @track totalSec = 0;
    @track scliId;
    @track watchedTime = 0;

    stopTimer() {
        clearInterval(this.intevelId);
        updateTime({ watchTime: `${this.totalSec}`, classId: this.scliId }).then((r) => {
            console.log('rrr>>', r);
        }).catch(e => {
            console.log('eee>>', e, e.message);
        });
    }
    startTimer() {
        this.totalSec = 0;
        createGetAttendee({ lineItemId: this.scliId })
            .then(result => {
                if (result) {
                    console.log('Resultid : ', result);
                }
            })
        this.intevelId = setInterval(() => {
            if (this.ss < 59) {
                this.ss = this.ss + 1;
            } else if (this.mm < 59 && this.ss == 59) {
                this.mm = this.mm + 1;
                this.ss = 0;
            } else if (this.mm == 59) {
                this.hh = this.hh + 1;
            }
            this.totalSec = this.totalSec + 1;
            console.log(`${this.ss} ss: ${this.mm} mm : ${this.hh} hh`);
        }, 1000);
    }
    showVimeoIframeMethod() {
        this.showVimeoIframe = true;
        //     let message = {
        //         iframeStatus : 'close'
        //     };
        //     publish(this.context, VIMEOMC, message);
        //     // console.log('okaye : ',this.template.querySelector('c-on-demand-classes-component'));
        //     // const vimeoTime = this.template.querySelector('c-on-demand-classes-component');
        //     // vimeoTime.closeIframeTime();
        //     // console.log('okayy : '); 
    }
    hideVimeoIframeMethod() {
        this.showVimeoIframe = false;
        if (this.showVimeoIframe == false) {
            this.stopTimer();
        }
        //     let message = {
        //         iframeStatus : 'close'
        //     };
        //     publish(this.context, VIMEOMC, message);
        //     // console.log('okaye : ',this.template.querySelector('c-on-demand-classes-component'));
        //     // const vimeoTime = this.template.querySelector('c-on-demand-classes-component');
        //     // vimeoTime.closeIframeTime();
        //     // console.log('okayy : '); 
    }
    updateCurrentVideoUrlHandler(videoId) {
        this.currentVideoUrl = `https://player.vimeo.com/video/${videoId}&amp;badge=0&amp;autoplay=1#t=${this.watchedTime}s&amp;player_id=0&amp;app_id=58479`;
        console.log('currentVideoUrl : ', this.currentVideoUrl);
    }



    @track runOnlyOnce = false;
    connectedCallback() {

        if (this.runOnlyOnce == false) {
            console.log('Checking');
            this.subscription = subscribe(this.context, IFRAMEMC, (message) => {
                // this.displayMessage(message);
                console.log('msg : ', message);
                if (message.iframeStatus == 'Zoom') {
                    this.meeting = JSON.stringify(message);
                    this.showHideIframe();
                    this.handleJoin(message.meetingId, message.AttendeeName);
                }
                else {
                    console.log('VIMEO Id : ', message.videoId);
                    this.scliId = message.scliId;
                    let wt = message.watchTime;
                    if (wt != undefined && wt != null) {
                        this.watchedTime = wt;
                    }
                    else {
                        this.watchedTime = '0';
                    }
                    this.updateCurrentVideoUrlHandler(message.videoId);
                    this.showVimeoIframeMethod();
                    this.startTimer();
                }
            });

            this.runOnlyOnce = true;
        }

    }
    // handleZoomData(event) {
    //     console.log('OUTPUT : ',);
    //     const data = event.detail;
    //     console.log('zoomData : ',JSON.stringify(data));
    //     this.showHideIframe();
    //     this.handleJoin(data.meetingId , data.name);
    // }
    handleJoin(meeting, name) {
        var pass = ''; // 1234567890
        console.log(name + ' : ' + encodeURIComponent(name));
        //var name = 'Sahil';
        //var meeting = '84066963579'; // 83060012514 pass  // 84066963579

        generateSignature({ sdkKey: 'jpRcWIOXgSwGICKPUeOfGjAJq0rqsCZnAbg9', sdkSecret: 'Tjef3A5o6mEEdUYjvRuUNVOxfdWgxQDdUtRW', meetingNumber: meeting, role: 0 })
            .then(res => {
                console.log('SIGNATURERes : ', res);
                //this.url = 'https://parkinsonfoundationofthenationalca--pfncadna.sandbox.my.salesforce.com/_ui/common/apex/ZoomWebSdk?name='+encodeURIComponent(name)+'&mn='+meeting+'&email=&pwd='+pass+'&role=0&lang=en-US&signature='+res+'&china=0&sdkKey=jpRcWIOXgSwGICKPUeOfGjAJq0rqsCZnAbg9';
                this.url = 'https://parkinsonfoundationofthenationalca--pfncadna.sandbox.my.site.com/PFNCADNA/apex/ZoomWebSdk?name=' + encodeURIComponent(name) + '&mn=' + meeting + '&email=&pwd=' + pass + '&role=0&lang=en-US&signature=' + res + '&china=0&sdkKey=jpRcWIOXgSwGICKPUeOfGjAJq0rqsCZnAbg9';
                console.log(this.url);
                this.show = true;
            })
    }
}