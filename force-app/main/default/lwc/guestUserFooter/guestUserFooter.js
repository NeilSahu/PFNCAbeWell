import { LightningElement, track, wire } from 'lwc';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import ImageURL from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import getUserProfileName from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
import basePath from '@salesforce/community/basePath';

export default class GuestUserFooter extends LightningElement {

    @track VALID_USER = true;
    // @track giftOfMembershipPage;


    giftOfMembershipPage(event) {
        console.log('Clicked');
        const sitePrefix = basePath.replace(/\/s$/i, ""); // site prefix is the site base path without the trailing "/s"
        console.log('sitePrefix : ' + sitePrefix);
        console.log(sitePrefix + "/secur/logout.jsp?redirectURL="+sitePrefix+"/s/bwps-wip-giftamembership");
        window.open(sitePrefix + "/s/bwps-wip-giftamembership");
        window.location.href = sitePrefix+"/secur/logout.jsp";
    }

    // facebook_logo = `${allIcons}/PNG/Facebook.png `;
    // insta_logo = `${allIcons}/PNG/Instagram.png `;
    // twitter_logo = `${allIcons}/PNG/Twitter.png `;
    //  navigateToDonatePage(){
    //     window.open('/PFNCADNA/s/donationpageguest','_self');
    // }
    // navigateToAboutUs(){
    //     window.open('/PFNCADNA/s/guestuseraboutus','_self');
    // }
    // navigateToFaq(){
    //     window.open('/PFNCADNA/s/guestuserfaq','_self');
    // }
    // navigateToBlog(){
    //     window.open('/PFNCADNA/s/guestuserblog','_self');
    // }
    // navigateToMembership(){
    //     window.open('/PFNCADNA/s/guestusergiftamembership','_self');
    // }
    facebook_logo = `${ImageURL}/WebsiteGeneralFiles/Facebook.svg`;
    insta_logo = `${ImageURL}/WebsiteGeneralFiles/Instagram.svg`;
    twitter_logo = `${ImageURL}/WebsiteGeneralFiles/Twitter.svg`;

    date = new Date();

    currentYear = this.date.getFullYear();

    @wire(getUserProfileName)
    getUserProfile({ data, error }) {
        if (data) {
            console.log(data);
            this.userName = data.FirstName ?? '' + ' ' + data.LastName ?? '';
            console.log('profile name : ', data.Profile.Name);
            if (data.Profile.Name == 'Instructor') {
                this.VALID_USER = false;
            }
            else if (data.Profile.Name == 'Guest User' || data.Profile.Name == 'Member User') {
                console.log('Hello guest');
                this.VALID_USER = false;
            }
            else {
                this.VALID_USER = true;
            }
        }
        if (error) {
            console.log('error : ', error, JSON.stringify(error), error.message);
        }
    }

}