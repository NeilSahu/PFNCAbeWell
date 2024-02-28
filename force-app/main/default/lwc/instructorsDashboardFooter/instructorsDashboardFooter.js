import { LightningElement } from 'lwc';
import facebookLogo from '@salesforce/resourceUrl/facebookLogo';
import InstaLogo from '@salesforce/resourceUrl/InstaLogo';
import twitterLogo from '@salesforce/resourceUrl/twitterLogo';
export default class InstructorsDashboardFooter extends LightningElement {

    facebook_logo = facebookLogo;
    insta_logo = InstaLogo;
    twitter_logo = twitterLogo;
}