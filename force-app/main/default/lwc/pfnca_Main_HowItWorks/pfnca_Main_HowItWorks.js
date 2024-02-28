import { LightningElement, track, wire } from 'lwc';
import { publish, subscribe, unsubscribe, createMessageContext, releaseMessageContext } from 'lightning/messageService';
import IFRAMEMC from "@salesforce/messageChannel/ZoomSdkMessageChannel__c";

import USER_ID from '@salesforce/user/Id';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import allIcon from '@salesforce/resourceUrl/BWPSPhotos';
import Logo from '@salesforce/resourceUrl/WIPlogo';
import downloadFileIcon from '@salesforce/resourceUrl/downloadFileIcon';
import LiveClassImage from '@salesforce/resourceUrl/LiveClassImage';
import liveGymImage from '@salesforce/resourceUrl/liveGymImage';
import workoutImage from '@salesforce/resourceUrl/workoutImage';
import butterfly_gray from '@salesforce/resourceUrl/butterfly_gray';
import heroImage from '@salesforce/resourceUrl/headerHeroImages';
import getWibResources from '@salesforce/apex/BWPS_WIPBrowseClasses.getWibResources';
import getUserProfileName from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';


export default class Pfnca_Main_HowItWorks extends LightningElement {
context = createMessageContext();
    subscription = null;

    // @track downloadIcon= `${allIcons}/PNG/Download.png `;
    @track downloadIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' id='Download' width='16' height='16' viewBox='0 0 16 16'%3E%3Crect id='Bounding_Box' data-name='Bounding Box' width='16' height='16' fill='none'/%3E%3Cg id='Download_Icon' data-name='Download Icon' transform='translate(-562 -2322.999)'%3E%3Cg id='noun_Download_file_598283' data-name='noun_Download file_598283' transform='translate(565 2325)'%3E%3Cpath id='Path_10926' data-name='Path 10926' d='M12.931,19.317a.385.385,0,0,1-.273-.113l-1.545-1.545a.386.386,0,0,1,.546-.546l1.272,1.272L14.2,17.113a.386.386,0,0,1,.546.546L13.2,19.2A.385.385,0,0,1,12.931,19.317Z' transform='translate(-7.91 -10.435)' fill='%23008ba7'/%3E%3Cpath id='Path_10927' data-name='Path 10927' d='M15.386,15.634A.386.386,0,0,1,15,15.248V11.386a.386.386,0,0,1,.772,0v3.862A.386.386,0,0,1,15.386,15.634Z' transform='translate(-10.366 -6.752)' fill='%23008ba7'/%3E%3Cpath id='Path_10928' data-name='Path 10928' d='M14.02,25.772H9.386a.386.386,0,1,1,0-.772H14.02a.386.386,0,1,1,0,.772Z' transform='translate(-6.683 -15.346)' fill='%23008ba7'/%3E%3Cpath id='Path_10929' data-name='Path 10929' d='M12.05,12.357H3.992A.981.981,0,0,1,3,11.391V3.458a1.285,1.285,0,0,1,.373-.9L5.556.374A1.266,1.266,0,0,1,6.458,0h5.592a.98.98,0,0,1,.991.966V11.392A.979.979,0,0,1,12.05,12.357ZM6.458.772A.5.5,0,0,0,6.1.919L3.919,3.1a.507.507,0,0,0-.147.356v7.933a.208.208,0,0,0,.219.194h8.058a.207.207,0,0,0,.219-.193V.966a.207.207,0,0,0-.219-.193Z' transform='translate(-3 0)' fill='%23008ba7'/%3E%3Cpath id='Path_10930' data-name='Path 10930' d='M7.738,5.7H6.386a.386.386,0,1,1,0-.772H7.738a.193.193,0,0,0,.193-.193V3.386a.386.386,0,0,1,.772,0V4.738A.967.967,0,0,1,7.738,5.7Z' transform='translate(-4.841 -1.841)' fill='%23008ba7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
    @track butterfly = butterfly_gray;
    howitworks = `${Logo}/WIPlogo/howitworks.png`;
    heroImage = heroImage + '/headerHIW.png';

    @track howToParticipateResourceId;
    @track liveClassesResourceId;
    @track classesOnDemandResourceId;
    @track VALID_USER = true;

    @wire(getUserProfileName)
    getUserProfile({ data, error }) {
        if (data) {
            console.log(data);
            this.userName = data.FirstName ?? '' + ' ' + data.LastName ?? '';
            console.log('profile name : ', data.Profile.Name);
            if (data.Profile.Name == 'Guest User' || data.Profile.Name == 'Member User') {
                this.VALID_USER = true;
            }
            else {
                this.VALID_USER = false;
            }
        }
        if (error) {
            console.log('error : ', error, JSON.stringify(error), error.message);
        }
    }
    get participateBackground() {
        return `
        height: 26rem;
        background-size: cover;     
        background-repeat: no-repeat;
        background-image:url(${liveGymImage});`;
    }

    get liveClassBackground() {
        return `
        height: 24rem;
        background-size: cover;
        background-repeat: no-repeat;
        background-image:url(${LiveClassImage});`;
    }

    get classesOnDemandBackground() {
        return `
        height: 25rem;
        background-size: cover;
        background-repeat: no-repeat;
        background-image:url(${workoutImage});`;  //workoutImage
    }

    get handleClassOnDemandClick() {
        if (this.VALID_USER) {
            return '/PFNCADNA/s/guestuserbrowseclasses?active=cod';
        }
        else {
            return '/PFNCADNA/s/bwps-wip-browseclasses?active=cod';
        }


    }
    get handleLiveClassScheduleClick() {
        if (this.VALID_USER) {
            return '/PFNCADNA/s/guestuserbrowseclasses?active=lcs';
        }
        else {
            return '/PFNCADNA/s/bwps-wip-browseclasses?active=lcs';
        }


    }
    get handleGetStartedClick() {
        if (this.VALID_USER) {
            return '#';
        }
        else {
            return '/PFNCADNA/s/bwps-wip-signin';
        }

    }
    @wire(getWibResources)
    getAllWibResources({ error, data }) {
        if (data) {
            data.forEach(i => {
                console.log('getVideoId : ', i.BWPS_Link__c);
                if (i.ResourceSection__c == 'HowToParticpate') {
                    this.howToParticipateResourceId = i.BWPS_Link__c;
                } else if (i.ResourceSection__c == 'LiveClasses') {
                    this.liveClassesResourceId = i.BWPS_Link__c;
                } else if (i.ResourceSection__c == 'ClassesOnDemand') {
                    this.classesOnDemandResourceId = i.BWPS_Link__c;
                }
            });
        }
        if (error) {
            var error = error;
            console.log('error : ', JSON.stringify(error), error.message);
        }
    }

    iframeHandler(event) {
        let status = event.target.dataset.status;
        let videoId = event.target.dataset.vimeoid;
        console.log('videoId0 : ', videoId);

        if (status == 'howtoparticipate') {
            console.log('videoId1 : ', videoId);
            //this.howToParticipateResourceId = videoId;
            this.updateCurrentVideoUrlHandler(videoId);

        } else if (status == 'liveclasses') {
            console.log('videoId2 : ', videoId);
            //this.liveClassesResourceId = videoId;
            this.updateCurrentVideoUrlHandler(videoId);

        } else if (status == 'ondemand') {
            console.log('videoId3 : ', videoId);
            //this.classesOnDemandResourceId = videoId;
            this.updateCurrentVideoUrlHandler(videoId);

        }
    }
    updateCurrentVideoUrlHandler(videoId) {
        let message = {
            videoId: videoId,
            iframeStatus: 'Vimeo'
        };
        publish(this.context, IFRAMEMC, message);
    }
}