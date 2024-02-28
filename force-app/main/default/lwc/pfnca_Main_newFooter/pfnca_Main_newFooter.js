import { LightningElement } from 'lwc';
import basePath from '@salesforce/community/basePath';
import ImageURL from '@salesforce/resourceUrl/WebsiteGeneralFiles';

export default class Pfnca_Main_newFooter extends LightningElement {
facebook_logo = `${ImageURL}/WebsiteGeneralFiles/Facebook.svg`;
    insta_logo= `${ImageURL}/WebsiteGeneralFiles/Instagram.svg`;
    twitter_logo = `${ImageURL}/WebsiteGeneralFiles/Twitter.svg`;

 giftOfMembershipPage(event) {
        console.log('Clicked');
        const sitePrefix = basePath.replace(/\/s$/i, ""); // site prefix is the site base path without the trailing "/s"
        console.log('sitePrefix : ' + sitePrefix);
        console.log(sitePrefix + "/secur/logout.jsp?redirectURL="+sitePrefix+"/s/bwps-wip-giftamembership");
        window.open(sitePrefix + "/s/bwps-wip-giftamembership");
        window.location.href = sitePrefix+"/secur/logout.jsp";
    }
}