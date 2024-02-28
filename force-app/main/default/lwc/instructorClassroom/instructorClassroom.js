import { api, LightningElement } from 'lwc';
import ImageURL from '@salesforce/resourceUrl/WebsiteGeneralFiles';

export default class Bwps_WIP_DynamicHero  extends LightningElement {
    @api title = '';
    @api description = 'Our company and mission';
    @api buttontext = 'Get Guest Pass';
    @api isdescription = false;
    @api  isbutton = false;
    
    //ImageUrl = 'https://i.dailymail.co.uk/i/pix/2017/07/18/14/427394C200000578-0-image-a-24_1500384481554.jpg';
    @api ImgUrl = `${ImageURL}/WebsiteGeneralFiles/bg3.png`;
    get backgroundStyle() {
        return `
                width: 100%;
                height: 250px;
                
                position: relative;
                background: url("${this.ImgUrl}");
                background-size: cover;
                background-position: 50% 50%;
                background-color: #0000004d;
                background-blend-mode: color;`;
                
    }

}