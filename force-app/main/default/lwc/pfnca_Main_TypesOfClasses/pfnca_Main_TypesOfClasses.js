import { LightningElement,track,wire } from 'lwc';
import getAllClasses from '@salesforce/apex/BWPS_WIPBrowseClasses.getAllClasses';
import Logo from '@salesforce/resourceUrl/WIPlogo';
import imageResource from '@salesforce/resourceUrl/bwps_WIP_TypesOfClasses';
import heroImage from '@salesforce/resourceUrl/headerHeroImages';
import getUserProfileName from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
export default class Pfnca_Main_TypesOfClasses extends LightningElement {
typeofclass = `${Logo}/WIPlogo/typeofclass.png`;
    heroImage = heroImage + '/headerTOC.png';

    exerciseIcon = imageResource + '/exerciseIcon.png';
    communicationIcon = imageResource + '/communicationIcon.png';
    danceIcon = imageResource + '/danceIcon.png';
    aerobicsIcon = imageResource + '/aerobicsIcon.png';
    martialArtsIcon = imageResource + '/martialArtsIcon.png';
    yogaIcon = imageResource + '/yogaIcon.png';
    boxingIcon = imageResource + '/boxingIcon.png';
    signalIcon1 = imageResource + '/1.png';
    signalIcon2 = imageResource + '/2.png';
    signalIcon3 = imageResource + '/3.png';

    fallbackImg = imageResource + '/yogaIcon.png';

    classTypeData = [];
    @track VALID_USER = false;
    @wire(getUserProfileName)
    getUserProfile({data,error}){
        if(data){
            console.log(data);
            console.log('profile name : ',data.Profile.Name);
            if(data.Profile.Name == 'Guest User' || data.Profile.Name == 'Member User'){
                console.log('Hello guest');
                this.VALID_USER = true;
            }
        }
        if(error){
            console.log('error : ',error, JSON.stringify(error),error.message);
        }
    }

    connectedCallback(){
        getAllClasses()
        .then( result => {

            console.log("result ( classes ) : ",result);
            this.classTypeData = result;
            
            this.classTypeData =  this.classTypeData.map((ele) => {
                // console.log('ele.BWPS_Image_Base64code__c ',ele.BWPS_Image_Base64code__c);
                if(this.VALID_USER){
                    ele.Link = '/PFNCADNA/s/guestuserbrowseclasses?active=cod&cls='+ele.Id;
                }
                else{
                    ele.Link = '/PFNCADNA/s/bwps-wip-browseclasses?active=cod&cls='+ele.Id;
                }
                ele.logoimgLink = (ele.BWPS_Image_Base64code__c == '' || ele.BWPS_Image_Base64code__c == 'Sample Base64 Code' || ele.BWPS_Image_Base64code__c == undefined || ele.BWPS_Image_Base64code__c == null ) ? this.fallbackImg :  `data:image/png;base64,${ele.BWPS_Image_Base64code__c}`  ;
                // ele.logoimgLink = ele.hasOwnProperty('ContentDocumentLinks') ? ele.ContentDocumentLinks[0].ContentDocument.LatestPublishedVersionId : 'noid';

                // if(ele.hasOwnProperty('ContentDocumentLinks')){
                //     let prefixLink = `https://parkinsonfoundationofthenationalca--pfncadna.sandbox.file.force.com/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=`;
                //     ele.logoimgLink = prefixLink + ele.ContentDocumentLinks[0].ContentDocument.LatestPublishedVersionId;
                // }
                // else {
                //     ele.logoimgLink = this.fallbackImg;
                // }
                return ele;
            });

            // console.log("this.classTypeData (classes) : ", this.classTypeData);
        })
        .catch( error => {
            console.log("error (classes)  : ", error.message)
        })

        
    }

    get liveClassScheduleLink(){
        if(this.VALID_USER){
            return '/PFNCADNA/s/guestuserbrowseclasses?active=lcs';
        }
        else{
            return '/PFNCADNA/s/bwps-wip-browseclasses?active=lcs';
        }
    }

    get classOnDemandLink(){
        if(this.VALID_USER){
            return '/PFNCADNA/s/guestuserbrowseclasses?active=cod';
        }
        else{
            return '/PFNCADNA/s/bwps-wip-browseclasses?active=cod';
        }  
    }


}