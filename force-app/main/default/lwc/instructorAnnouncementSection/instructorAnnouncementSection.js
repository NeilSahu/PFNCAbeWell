import { LightningElement, track, wire, api } from 'lwc';
// import FavouriteInstructorImage1 from '@salesforce/resourceUrl/FavouriteInstructorImage1';
import userImage from '@salesforce/resourceUrl/Usericon';
import getAnnouncements from '@salesforce/apex/DNA_InstructorClass.getAnnouncements';
export default class InstructorAnnouncementSection extends LightningElement {
    @track userImage = userImage;
    @track Arr = [];
    @track Arr1 = [];
    status;
    @track noAnouncementInstructor = false;
    @track noAnouncementStudent = false;
    @wire(getAnnouncements)
    wiredAnn({ error, data }) {
        if (data) {
            var data = data;
            const convertTime12to24 = (time12h) => {
                const [time, modifier] = time12h.split(' ');
                let [hours, minutes] = time.split(':');
                if (hours === '12') {
                    hours = '00';
                }
                if (modifier === 'PM') {
                    hours = parseInt(hours, 10) + 12;
                }
                return `${hours}:${minutes}`;
            }
            console.log('OUTPUT : ', data);
            for (let i = 0; i < data.length; i++) {
                var createddate = new Date(data[i].CreatedDate).toLocaleString('en-US', { timeZone: 'America/New_York' });
                var currentdate = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
                var newCreatedTime = new Date(createddate).getTime();
                var newCurrentTime = new Date(currentdate).getTime();
                console.log('createddate : ', newCreatedTime);
                console.log('currentdate : ', newCurrentTime);
                this.status = newCurrentTime - newCreatedTime;
                var seconds = Math.floor(this.status / 1000);
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                console.log('OUTPUT NEW: ', minutes, seconds, hours.length);
                if (seconds < 60 && hours == 0 && minutes == 0) {
                    this.status = seconds + ' sec ago';
                }
                else if (seconds > 60 && hours == 0 && minutes < 60) {
                    this.status = minutes + ' min ago';
                }
                else if (seconds > 60 && hours < 24 && minutes > 60) {
                    this.status = hours + ' hr ago';
                }
                else {
                    this.status = '1 day ago';
                }
                //  this.status = createddate - currentdate;
                //  var time = createddate.toString().split('T')[1];
                var obj = {
                    Name: data[i].Owner.Name,
                    Img: this.userImage,
                    Time: this.status,
                    Detail: data[i].Detail__c,
                };
                console.log('data[i].Announcement_for__c : ' + data[i].Announcement_for__c);
                if (data[i].Announcement_for__c == 'Instructor') {
                    this.Arr.push(obj);
                }
                else {
                    if (data[i].Announcement_for__c == 'Student') {
                        this.Arr1.push(obj);
                    }
                }
            }

            if (this.Arr.length == 0) {
                this.noAnouncementInstructor = true;
            } else {
                this.noAnouncementInstructor = false;
            }

            if (this.Arr1.length == 0) {
                this.noAnouncementStudent = true;
            } else {
                this.noAnouncementStudent = false;
            }

            console.log('OUTPUT >>>>>>>>>>: ', JSON.stringify(this.Arr));
        } else if (error) {
            var error = error;

        }
    }
}