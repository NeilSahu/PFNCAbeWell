import { LightningElement,wire,track } from 'lwc';
import imageResource from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import Logo from '@salesforce/resourceUrl/WIPlogo';
import FetchRecordType from '@salesforce/apex/BWPS_GuestUserHistoryClass.FetchRecordType';
export default class Bwps_WIP_VarietyOfClasses extends LightningElement {

    img1 = `${imageResource}/WebsiteGeneralFiles/blog_photo.png`;
    img2 = `${imageResource}/WebsiteGeneralFiles/blog_1.png`;

    get typesOfClassesLink(){
        return "/PFNCADNA/s/bwps-wip-howtoparticipate?active=toc";
    }
    @track Arr = [];
    @wire(FetchRecordType)
    wiredRec({data,error}){
        if(data){
        var data = data;
        console.log('OUTPUT REC: ',JSON.stringify(data));
        function removeDuplicates(data) {
            let unique = [];
            data.forEach(element => {
                if (!unique.includes(element.RecordType.Name)) {
                    unique.push(element.RecordType.Name);
                }
            });
            return unique;
        }
        var recordTypes =  removeDuplicates(data);
        recordTypes.forEach(rec => {
                rec = rec.toUpperCase() ;
                let img;
                if(rec == 'COMMUNICATION'){
                    img = rec.ResouceImageUrl__c;
                }else if(rec == 'EXERCISE'){
                    img = rec.ResouceImageUrl__c;
                }else if(rec == 'SOCIALIZATION'){
                    img = rec.ResouceImageUrl__c;
                }
                else{
                    img = `${Logo}/WIPlogo/COMMUNICATION.png`;
                }
                var obj={
                    Name : rec+" FOR PARKINSON'S",
                    Img : img,
                    Img : `${Logo}/WIPlogo/${rec}.png`,
                }
                this.Arr.push(obj);
            });
        console.log('recordTypes',this.Arr);
        }
        
        else if(error){
        console.log('errr',errors);
        }
    }
}