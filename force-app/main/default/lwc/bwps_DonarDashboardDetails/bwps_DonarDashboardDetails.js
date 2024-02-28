import { LightningElement, wire, track } from 'lwc';
import PHOTOS from '@salesforce/resourceUrl/photos';
import { CurrentPageReference } from 'lightning/navigation';
import ticklogo from '@salesforce/resourceUrl/ticklogo';
import failedlogo from '@salesforce/resourceUrl/failedlogo';
import getOppPDFDocId from '@salesforce/apex/BWPS_DonationHistoryClass.getOppPDFDocId';
import imageResource from '@salesforce/resourceUrl/WebsiteGenFaqImage';

export default class Bwps_DonarDashboardDetails extends LightningElement {

  backIcom = imageResource + "/chevron-1.svg";

  ticklogo = ticklogo;
  failedlogo = failedlogo;
  backArrow = PHOTOS + '/backArrow.png';
  backblueArrow = PHOTOS + '/GO.svg';
  // DedicationLogo = PHOTOS+'/DedicationLogo.png';
  DedicationLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='125.531' height='74.947' viewBox='0 0 125.531 74.947'%3E%3Cpath id='Dedication_Icon' d='M93.127,23.133c-8.281,0-15.043,7-15.043,15.642,0,13.479,21.6,28.081,24.082,29.682a3.905,3.905,0,0,0,4.277,0c2.484-1.6,24.088-16.2,24.088-29.682,0-8.641-6.761-15.642-15.043-15.642a14.7,14.7,0,0,0-11.158,5.16,14.861,14.861,0,0,0-11.2-5.16ZM43.068,52.478a20.429,20.429,0,0,0-3.122.234c-5.677.872-10.542,3.8-19.424,8.935L5,70.609l5.35,9.262,4.713,8.167,3.983,6.9L20.86,98.08l7.464-4.31c7.464-4.31,7.464-4.31,15.4-2.179L59.6,95.841c7.938,2.125,7.938,2.125,19.973-.768l12.035-2.893,18.852-4.533c3.095-.746,3.394-4.108,1.9-6.712a6.1,6.1,0,0,0-5.279-3.2l-12.182.033-9.028.027c-9.028.027-9.028.027-20.018-3.34L54.857,71.083l-.7-.212-.005.011a2.355,2.355,0,1,1,1.335-4.517,2.174,2.174,0,0,1,.539.24l13.713,4.468A5.349,5.349,0,1,0,73.054,60.9L57.809,55.932c-6.026-1.961-10.3-3.438-14.743-3.454Z' transform='translate(-5 -23.133)' fill='%23ff9f37' fill-rule='evenodd'/%3E%3C/svg%3E";
  // EyeLogo = PHOTOS+'/EyeLogo.png';
  EyeLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' id='View_Icon' width='33.625' height='22.416' viewBox='0 0 33.625 22.416'%3E%3Cpath id='Path_11167' data-name='Path 11167' d='M36.6,29.406c-3.766-6.672-10-10.656-16.668-10.656S7.034,22.734,3.268,29.406a1.123,1.123,0,0,0,0,1.1c3.766,6.672,10,10.656,16.668,10.656S32.837,37.182,36.6,30.51A1.123,1.123,0,0,0,36.6,29.406ZM19.935,38.924c-5.669,0-11.007-3.339-14.394-8.966,3.386-5.628,8.725-8.966,14.394-8.966s11.007,3.339,14.394,8.966C30.943,35.586,25.6,38.924,19.935,38.924Z' transform='translate(-3.123 -18.75)' fill='%23008ba7'/%3E%3Cpath id='Path_11168' data-name='Path 11168' d='M48.233,45.992a2.242,2.242,0,1,1-2.242-2.242,2.241,2.241,0,0,1,2.242,2.242' transform='translate(-29.179 -34.784)' fill='%23008ba7'/%3E%3Cpath id='Path_11169' data-name='Path 11169' d='M37.975,31.25a6.73,6.73,0,1,0,4.754,1.971,6.725,6.725,0,0,0-4.754-1.971Zm0,11.208a4.482,4.482,0,1,1,3.17-1.313,4.484,4.484,0,0,1-3.17,1.313Z' transform='translate(-21.162 -26.767)' fill='%23008ba7'/%3E%3C/svg%3E";
  right = PHOTOS + '/right.png';
  // DownloadLogo =  PHOTOS+'/DownloadLogo.png';
  DownloadLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' id='Download' width='16' height='16' viewBox='0 0 16 16'%3E%3Crect id='Bounding_Box' data-name='Bounding Box' width='16' height='16' fill='none'/%3E%3Cg id='Download_Icon' data-name='Download Icon' transform='translate(-562 -2324.999)'%3E%3Cg id='noun_Download_file_598283' data-name='noun_Download file_598283' transform='translate(565 2325)'%3E%3Cpath id='Path_10926' data-name='Path 10926' d='M12.931,19.317a.385.385,0,0,1-.273-.113l-1.545-1.545a.386.386,0,0,1,.546-.546l1.272,1.272L14.2,17.113a.386.386,0,0,1,.546.546L13.2,19.2A.385.385,0,0,1,12.931,19.317Z' transform='translate(-7.098 -9.127)' fill='%23008ba7'/%3E%3Cpath id='Path_10927' data-name='Path 10927' d='M15.386,15.634A.386.386,0,0,1,15,15.248V11.386a.386.386,0,0,1,.772,0v3.862A.386.386,0,0,1,15.386,15.634Z' transform='translate(-9.553 -5.652)' fill='%23008ba7'/%3E%3Cpath id='Path_10928' data-name='Path 10928' d='M15.529,25.772H9.5A.4.4,0,1,1,9.5,25h6.027a.4.4,0,1,1,0,.772Z' transform='translate(-6.683 -13.679)' fill='%23008ba7'/%3E%3Cpath id='Path_10929' data-name='Path 10929' d='M13.515,14.357H4.152A1.139,1.139,0,0,1,3,13.234V4.017A1.494,1.494,0,0,1,3.434,2.97L5.969.434A1.471,1.471,0,0,1,7.017,0h6.5a1.138,1.138,0,0,1,1.151,1.122V13.235A1.138,1.138,0,0,1,13.515,14.357ZM7.017.9a.58.58,0,0,0-.413.171L4.068,3.6a.589.589,0,0,0-.171.413v9.217a.242.242,0,0,0,.255.226h9.362a.241.241,0,0,0,.254-.225V1.122A.241.241,0,0,0,13.514.9Z' transform='translate(-3 0)' fill='%23008ba7'/%3E%3Cpath id='Path_10930' data-name='Path 10930' d='M7.738,5.7H6.386a.386.386,0,1,1,0-.772H7.738a.193.193,0,0,0,.193-.193V3.386a.386.386,0,0,1,.772,0V4.738A.967.967,0,0,1,7.738,5.7Z' transform='translate(-4.841 -1.841)' fill='%23008ba7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
  base64Data;
  getStateParameters;
  date;
  tributeName;
  @track newdate;
  @track datechanged
  @track result;
  @wire(CurrentPageReference)
  getStateParameters(currentPageReference) {
    if (currentPageReference) {
      this.base64Data = currentPageReference.state?.ap;
      console.log('Base64Data', this.base64Data);
      this.result = window.atob(this.base64Data);
      this.result1 = JSON.parse(this.result);
      this.result1.Amount = Number(this.result1.ChargentOrders__Amount__c).toFixed(2);
      console.log('result---', this.result1);
      if (this.result1.ChargentOrders__Response_Status__c == 'Approved') {
        this.result1.Status = true;
      }
      else {
        this.result1.Status = false;
      }

      this.date = this.result1.CreatedDate;
      this.tributeName = this.result1.npsp__Honoree_Name__c;
      console.log(this.date);
      
      this.newdate = new Date(this.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }); //for changing date format mm/dd/yyyy
      this.datechanged = new Date(this.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
      //  this.newdate = this.date.toString().split('T')[0];
      console.log(this.newdata);
      console.log('trans id : ', this.result1.Id);
    }
  }
  async downloadReceiptPDFMethod(event) {
    var oppId = event.target.dataset.id;
    var oppName = event.target.dataset.name;
    console.log('oppId ', oppId);
    console.log('oppName ', oppName);
    let contentID;
    console.log('opid : ', oppId);
    await getOppPDFDocId({ oppId: oppId })
      .then((result) => {
        if (result) {
          console.log('result inner : ', result);
          contentID = result;
        }
      })
    console.log('contentID : ', contentID);
    var url = '/PFNCADNA/sfc/servlet.shepherd/version/download/' + contentID + '?operationContext=S1'
    //var url = 'https://https://parkinsonfoundationofthenationalca--pfncadna.sandbox.lightning.force.com/sfc/servlet.shepherd/document/download/'+contentID
    //var element = 'data:text/csv;charset=utf-8,%EF%BB%BF,' + encodeURIComponent(StringCSV);
    let downloadElement = document.createElement('a');
    downloadElement.href = url;
    downloadElement.target = '_self';
    downloadElement.download = oppName + '.pdf';
    document.body.appendChild(downloadElement);
    downloadElement.click();
  }

}