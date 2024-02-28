import { LightningElement,wire,track,api } from 'lwc';
import imageResource from '@salesforce/resourceUrl/WebsiteGeneralFiles';
// import bgimg from '@salesforce/resourceUrl/bwps_WIP_BlogPostView';
import getEducationalResources from '@salesforce/apex/bwps_websiteGeneralFaqClass.getEducationalResources';
import getStories from '@salesforce/apex/bwps_websiteGeneralFaqClass.getStories';
export default class Bwps_WIP_EducationalResourcesAndStories extends LightningElement {
    img1 = `${imageResource}/WebsiteGeneralFiles/blog_photo.png`;
    img2 = `${imageResource}/WebsiteGeneralFiles/blog_1.png`;
    // bgimg = `${bgimg}/Background_Circle_Graphic.svg`;
    get backgroundStyle() {
        return `
                width: 100%;
                position: relative;
                background: url("${this.bgimg}");
                background-size: cover;
                background-position: -20rem 65%;
                background-blend-mode: color;
                background-size: inherit;
                background-repeat: no-repeat;`;
    }
    
    EduResources;
    @wire(getEducationalResources)
    wiredRes({data,error}){
        if(data){
            try{
                let arr = JSON.parse(JSON.stringify(data));
                arr.forEach(ele => {
                    let img;
                    if(ele.ResouceImageUrl__c != null && ele.ResouceImageUrl__c != undefined && ele.ResouceImageUrl__c != '' ){
                        img = ele.ResouceImageUrl__c;
                    }
                    else{
                        img = this.img2;
                    }
                    ele.ResourceImage = img;
                });
                this.EduResources = arr;
            }
            catch(error){
                console.log('error : ',error, error.message);
            }

        }
        else if(error){
            console.log('OUTPUT : ',error);
        }
    }
    stories;
    @wire(getStories)
    wiredStories({data,error}){
        if(data){
            //this.stories =data;
            try{
                let arr = JSON.parse(JSON.stringify(data));
                arr.forEach(ele => {
                    let img;
                    if(ele.ResouceImageUrl__c != null && ele.ResouceImageUrl__c != undefined && ele.ResouceImageUrl__c != '' ){
                        img = ele.ResouceImageUrl__c;
                    }
                    else{
                        img = this.img2;
                    }
                    ele.ResourceImage = img;
                });
                this.stories = arr;
            }
            catch(error){
                console.log('error : ',error, error.message);
            }
        }
        else if(error){
            console.log('OUTPUT : ',error);
        }
    }
    handleClick(e){
        var id = e.target.dataset.id;
        var result = window.btoa(id);
        window.open('/PFNCADNA/s/resourcesdetailview?app='+result,'_self');
        console.log('Id', id, result);
    }
}