import { LightningElement } from 'lwc';
import allFiles from '@salesforce/resourceUrl/WebsiteGeneralFiles';
export default class Test30DNACommunity3 extends LightningElement {
    AboutParkinsonimage = `${allFiles}/WebsiteGeneralFiles/oldman.png`; 
    WideImage=`${allFiles}/WebsiteGeneralFiles/Wide Image.png`; 
    get backgroundStyle() {
        return `background-size: cover;background-image:url(${this.WideImage})`;
    }
}