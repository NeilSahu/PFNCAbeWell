import { LightningElement } from 'lwc';
import facebookLogo from '@salesforce/resourceUrl/Facebook';
import InstaLogo from '@salesforce/resourceUrl/Instagram';
import twitterLogo from '@salesforce/resourceUrl/Twitter';
export default class Bwps_DashboardFooter extends LightningElement {
    facebook_logo = facebookLogo;
    insta_logo = InstaLogo;
    twitter_logo = twitterLogo;
}