import { LightningElement, track } from 'lwc';
import myResource from '@salesforce/resourceUrl/DNAIcon';

export default class MobileMenuComponent extends LightningElement {
    @track filterIcon = myResource+"/DNAIcons/filterIcon.png";
    @track levelIcon = myResource+"/DNAIcons/levelIcon.png";
    @track shareIcon = myResource+"/DNAIcons/shareIcon.png";
    @track userIcon = myResource+"/DNAIcons/userIcon.png";
    @track likeIcon = myResource+"/DNAIcons/likeIcon.png";
}