import { LightningElement, track, wire } from 'lwc';
import myResource from '@salesforce/resourceUrl/DNAIcon';
import userImage from '@salesforce/resourceUrl/Usericon';
import FavouriteInstructorImage1 from '@salesforce/resourceUrl/FavouriteInstructorImage1';
import fetchNotification from '@salesforce/apex/Bwps_getuserNotification.getUserNotification';

export default class NotificationComponent extends LightningElement {
    @track filterIcon = myResource + "/DNAIcons/filterIcon.png";
    @track levelIcon = myResource + "/DNAIcons/levelIcon.png";
    @track shareIcon = myResource + "/DNAIcons/shareIcon.png";
    @track userIcon = myResource + "/DNAIcons/userIcon.png";
    @track likeIcon = myResource + "/DNAIcons/likeIcon.png";
    userImage = userImage;
    @track showClassesOfWeek = false;
    @track notifications = [];
    @track noNotifications = false;
    @track loader = true;
    renderedCallback() {
        let height = screen.height;
        console.log('OUTPUT : ', height);
        this.template.querySelector(".mainclass").style.height = height + "px";
    }

    @track notificationVisibel = [];
    @wire(fetchNotification)
    wiredData({ data, error }) {
        if (data != null && data != '' && data != undefined) {
            console.log('Result got');
            var notificationData = JSON.parse(JSON.parse(data));
            console.log('OUTPUT123 : ', JSON.stringify(notificationData.notifications));

            if (notificationData.notifications == undefined) {
                this.loader = false;
                this.noNotifications = true;
            }
            else {
                var firstLoop = true;
                for (let i = 0; i < notificationData.notifications.length; i++) {


                    var nottificationdate = new Date(notificationData.notifications[i].mostRecentActivityDate);
                    var todayDate = new Date();
                    var timeinMilliSec = todayDate - nottificationdate;
                    console.log("log", timeinMilliSec);
                    var seconds = Math.floor(timeinMilliSec / 1000);
                    var minutes = Math.floor(seconds / 60);
                    var hours = Math.floor(minutes / 60);

                    console.log('OUTPUT NEW: ', minutes, seconds, hours);
                    if (seconds < 60 && hours == 0 && minutes == 0) {
                        timeinMilliSec = seconds + ' sec ago';
                    }
                    else if (seconds > 60 && hours == 0 && minutes < 60) {
                        timeinMilliSec = minutes + ' min ago';
                    }
                    else if (seconds > 60 && hours < 24 && minutes > 60) {
                        timeinMilliSec = hours + ' hr ago';
                    }
                    else {
                        timeinMilliSec = '1 day ago';
                    }
                    var obj = {
                        Id: notificationData.notifications[i].id,
                        Name: 'Administrator',
                        image: notificationData.notifications[i].image,
                        Time: timeinMilliSec,
                        Message: notificationData.notifications[i].messageBody,
                    }
                    this.notifications.push(obj);
                    if (firstLoop) {
                        this.notificationVisibel.push(obj);
                        firstLoop = false;
                    }

                }

                this.loader = false;
                if (this.notifications.length == 0) {
                    this.noNotifications = true;
                }
                else {
                    this.noNotifications = false;
                }
            }

        } else {
            console.log('errorfghgg>>> ', JSON.stringify(error));
        }
    }

    navigateToNotification() {
        window.open('/s/notificationpage', '_self');
    }
    handleClose() {
        const closeEvent = new CustomEvent("getclosebutton", {
            detail: false
        });
        this.dispatchEvent(closeEvent);
    }

}