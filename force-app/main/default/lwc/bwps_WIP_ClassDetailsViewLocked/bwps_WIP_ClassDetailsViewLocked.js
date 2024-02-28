import { LightningElement } from 'lwc';
import imageResource from '@salesforce/resourceUrl/bwps_WIP_ClassDetailsViewLocked';


export default class Bwps_WIP_ClassDetailsViewLocked extends LightningElement {

    classBackgroundImage = `background-image: Url(${imageResource}/classBackgroungImage.png);`;

    lockIcon = imageResource + '/lockIcon.png';

    high_seated = imageResource + '/3.png';
    like_icon = imageResource + '/like.png';
    share_icon = imageResource + '/shareIcon.png';

}