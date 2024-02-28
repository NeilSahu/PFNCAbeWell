import { LightningElement,track,wire } from 'lwc';
import myResource from '@salesforce/resourceUrl/Bell_Icon';
import WaiverPdf from '@salesforce/resourceUrl/WaiverPdf';
import pdflib from '@salesforce/resourceUrl/pdflib';
import {loadScript} from "lightning/platformResourceLoader";
import { NavigationMixin } from 'lightning/navigation';
import fetchNotification from '@salesforce/apex/Bwps_getuserNotification.getUserNotification';
import downloadWaiverPdf from '@salesforce/apex/DNA_InstructorClass.downloadWaiverPdf';
import getWaiverData from '@salesforce/apex/DNA_GuestUserClass.getWaiverData';
import getUserProfileName from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';

export default class WaiverAndRuleComponent extends NavigationMixin (LightningElement) {
    @track bellIcon = myResource;
    @track waiverData;
    @track showDownloadPDF = false;
    @track notrecords=[];
    @track notificationVisibel=[];
    @track totalNotifications =0;
    @track WaiverPdf = WaiverPdf;

    number = 3;
    json = [];
    selItem;
    @track showNotificationFlag = false;
    @track loading = false;
    @track signDate;
    
    showNotificationMethod(){
        this.showNotificationFlag = !this.showNotificationFlag;
    }
    renderedCallback(){
        loadScript(this,pdflib).then(()=>{});
    }

    @wire(getUserProfileName)
    getUserProfile({ data, error }) {
        if (data) {
            console.log(data);
            console.log('dataJson : ',JSON.stringify(data));
            console.log('datelog : ',data.Contact.CreatedDate);
            let signD ;
            if(data.Contact.CreatedDate != null && data.Contact.CreatedDate != undefined){
                signD = new Date(data.Contact.CreatedDate);
            }
            else{
                signD = new Date();
            }
            let signDay = signD.getDate();
            let signMonth = signD.toLocaleString('en-US', { month: 'long' });
            let signYear = signD.getUTCFullYear();
            this.signDate = signMonth+' '+signDay+', '+signYear;
        }
        if (error) {
            console.log('error : ', error, JSON.stringify(error), error.message);
        }
    }
    connectedCallback(){
        // loadScript(this,pdflib).then(()=>{}).catch(error => {
        //     throw error;
        // });

        // let str = `ParkinsonFoundation.org/Be Well Parkinson's <br>
        // Waiver & Rules of Participation<br>
        // <br>
        // <br>
        // By participating in Be Well Parkinson's classes and programs, you agree to the following.
        // If you do not agree, please do not participate.<br>
        // <br>
        // I understand that the programs I am participating in online are designed for people with
        // Parkinson's disease and may not be suitable for the general population. There are
        // potential risks associated with participation in any movement/exercise program. I
        // understand that it is my responsibility to obtain the approval of my physician before
        // participating in any new exercise routine. I hereby certify that I know of no medical
        // problems that would impair my ability to participate in these programs and accept any
        // risk of illness or injury as a result of my participation.<br>
        // <br>
        // I understand that if I participate in an online program with an aide, he or she should be
        // staying and helping me at all times as needed. The aide should not leave me alone.<br>
        // <br>
        // I hereby confirm that I am a participant in these programs of my own free will.<br>
        // <br>
        // Additionally, I acknowledge that this program is not therapeutic; it is not a cure for any
        // medical condition, nor a substitute for other treatments. I hereby release and hold
        // harmless ParkinsonFoundation.org, all program host organizations and their instructors,
        // agents, employees, independent contractors, Directors, and volunteers from any and all
        // liability, damage, expense, causes of action, suits, claims, or judgments arising from
        // injury, damage, or loss to me or my personal property, my aides, family or other friends
        // who may accompany me, and which may arise in whole or in part out of my participation
        // in these programs, in travel to or from the program site or in any other manner related
        // thereto. I understand that my registration can be revoked at any time with or without
        // cause by ParkinsonFoundation.org or the host program site.<br>
        // <br>
        // About Recording of classes: Be Well Parkinson's classes that focus on exercise may be
        // recorded for evaluation and other purposes including use on the Be Well Parkinson's
        // website so I and others can use them in the future. Be Well Parkinson's
        // Communications classes will not be recorded without the permission of the group.<br>
        // <br>
        // I authorize use of my image and likeness for fundraising or other purposes at ParkinsonFoundation.org's discretion.<br>
        // <br>
        // I understand that if the instructor of the program I attend is a Physical Therapist or
        // Speech Therapist, they are providing services in a role as program instructor/facilitator
        // and not as a therapist. The program they lead is NOT therapy. If you would like
        // individualized therapy for your specific needs, please consult with your physician.<br>
        // <br>
        // I understand that if I am participating in an online program with
        // ParkinsonFoundation.org and turn on my video, that others will see me and possibly
        // other images that are picked up by my computer or device's camera.<br>
        // <br>
        // I also understand that, should there be a conflict between any suggestions or directives
        // of the program instructor and my physician, the physician's orders and advice should be
        // followed.<br>
        // <br>
        // Since important program information is sent to you by email, ParkinsonFoundation.org
        // reserves the right to opt you in as needed.`;

        // let str = `Be Well Parkinson’s Waiver and Rules of Participation<br> <br>
        //     By participating in Be Well Parkinson’s Classes (online or in-person), you 
        //     agree to the following. [If you do not agree, please do not participate.]<br><br>
        //     I understand that the programs I am participating in online and/or in-person 
        //     pose potential risks associated with participation in any movement/exercise 
        //     program. I understand that it is my responsibility to obtain the approval of 
        //     my physician before participating in any new exercise routine. I hereby 
        //     certify that I know of no medical problems that would impair my ability to 
        //     participate in these programs and accept any risk of illness or injury because
        //     of my participation.<br><br>  
        //     I understand that if I participate in a program with an aide either online or in-
        //     person, he or she should be always staying and helping me as needed. The 
        //     aide should not leave me alone.<br><br>
        //     I hereby confirm that I am a participant in these programs of my own free 
        //     will.<br><br>
        //     Additionally, I acknowledge that this program is not therapeutic; it is not a 
        //     cure for any medical condition, nor a substitute for other treatments. I 
        //     hereby release and hold harmless ParkinsonFoundation.Org and its affiliates, 
        //     all program host organizations and its and their instructors, agents, 
        //     employees, independent contractors, Directors, and volunteers from any and
        //     all liability, damage, expense, causes of action, suits, claims, or judgments 
        //     arising from injury, damage, or loss to me or my personal property, my 
        //     aides, family or other friends who may accompany me, and which may arise 
        //     in whole or in part out of my participation in these programs, in travel to or 
        //     from the program site or in any other manner related thereto. I understand 
        //     that my registration can be revoked at any time with or without cause by 
        //     ParkinsonFoundation.Org or the host program site.<br><br>
        //     About Recording of classes: Be Well Parkinson’s classes that focus on 
        //     exercise will be recorded for evaluation and other purposes including use on 
        //     the Be Well Parkinson’s website so I and others can use them in the future. 
        //     Be Well Parkinson’s Communication Club sessions will not be recorded 
        //     without the permission of the group.<br><br>
        //     I authorize use of my image and likeness for fundraising or other purposes at
        //     the discretion of ParkinsonFoundation.Org and its affiliates.<br><br>
        //     I understand that if the instructor of the program I attend is a Physical 
        //     Therapist or Speech Therapist, they are providing services in a role as 
        //     program instructor/facilitator and not as a therapist. The program they lead 
        //     is NOT therapy. If you would like individualized therapy for your specific 
        //     needs, please consult with your physician.<br><br>
        //     I understand that if I am participating in an online program with Be Well 
        //     Parkinson’s and turn on my video, that others will see me and possibly other 
        //     images that are picked up by my computer or device’s camera.<br><br>
        //     I also understand that, should there be a conflict between any suggestions or
        //     directives of the program instructor and my physician, the physician’s orders 
        //     and advice should be followed.`;
        // this.waiverData = str;
        // this.json.push(str);
        // var e = [...this.template.querySelector(".btn")];
        // console.log(e,' EEE');
        // console.log(this.template.querySelector(".btn"));
    }
    @wire(getWaiverData)
    waiverData({data,error}){
        if(data){
            console.log('waiver data : ',data);
            this.waiverData = data;
        }
        if(error){
            console.log('error in waiver : ',error);
        }
    }
    // downloadPDF(event){
    //     this.template.querySelector();
    //     console.log("Download PDF");
    //     this.selItem = this.waiverData;
    //     //console.log(this.selItem);
    //     //this.createPdf();
    //     //this.showDownloadPDF = true;
    //     this.dispatchEvent(new CustomEvent(
    //         'dosearch', 
    //         {
    //             detail: { data:  this.waiverData},
    //             bubbles: true,
    //             composed: true,
    //         }
    //     ));
        
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__webPage',
    //         attributes: {
    //             url: encodeURI('https://parkinsonfoundationofthenationalca--pfncadna.sandbox.lightning.force.com/apex/PageThatGeneratesPdf?data='+this.waiverData)
    //         }
    //     })
        
    // }
    // async createPdf() {
    //     console.log('second function');
    //     var finalPdfData = this.selItem;
    
    //     const pdfDoc = await pdflib.PDFDocument.create()
    //     const timesRomanFont = await pdfDoc.embedFont(pdflib.StandardFonts.TimesRoman)
    
    //     const page = pdfDoc.addPage()
    //     const { width, height } = page.getSize()
    //     const fontSize = 20
    //     page.drawText(finalPdfData, {
    //         x: 50,
    //         y: height - 4 * fontSize,
    //         size: fontSize,
    //         font: timesRomanFont,
    //         color: rgb(0, 0.53, 0.71),
    //     })
    //     const pdfBytes = await pdfDoc.save()
    //     this.saveByteArray("WaiverRulesPDF",pdfBytes);
    // }
    // saveByteArray(pdfName,byte){
    //     //var link = this.template.querySelector(`[data-id="WaiverRules"]`);
    //     console.log("third function");
    //     var blob = new Blob([byte],{type:"application/pdf"});
    //     var link = document.createElement("a");
    //     link.href = window.URL.createObjectURL(blob);
    //     var fileName = pdfName;
    //     link.download = fileName;
    //     link.click();
    // }
    downloadWavierPdfMethod(){
        this.loading = true;
        console.log('hiiii : ');
        let contentID;
        // downloadWaiverPdf()
        // .then((result) => { 
        //     if(result){
        //         console.log('result inner : ',result);
        //         contentID = result;
        //     }
        // })
        // .catch(error => {
        //     console.log('error : ',error);
        // })
        contentID = '0683C000001fdkaQAA';
        console.log('contentID : ',contentID);
        var url = 'https://parkinsonfoundationofthenationalca--pfncadna.sandbox.my.salesforce.com/sfc/servlet.shepherd/version/download/'+contentID+'?operationContext=S1'
        // var url = '/PFNCADNA/sfc/servlet.shepherd/version/download/' + contentID + '?operationContext=S1';
        //var url = 'https://https://parkinsonfoundationofthenationalca--pfncadna.sandbox.lightning.force.com/sfc/servlet.shepherd/document/download/'+contentID+'?operationContext=S1';
        //var element = 'data:text/csv;charset=utf-8,%EF%BB%BF,' + encodeURIComponent(StringCSV);
        let downloadElement = document.createElement('a');
        downloadElement.href = url;
        downloadElement.target = '_blank';
        downloadElement.download = 'WaiverAndRules.pdf';
        document.body.appendChild(downloadElement);
        downloadElement.click();
        this.loading = false;   
    }

    
    @wire(fetchNotification)
    wiredData({ data, error }) {
    if(data != null && data != '' && data != undefined){
    var notificationData =  JSON.parse(JSON.parse(data));
    var firstLoop = true;
    for(let i= 0;i<notificationData.notifications.length;i++){
      var nottificationdate = new Date(notificationData.notifications[i].mostRecentActivityDate);
      var todayDate = new Date();
      var timeinMilliSec = todayDate-nottificationdate+'ago';
    if(notificationData.notifications[i].read == false){
      this.totalNotifications+=1;
     }
     var obj = {
       id:notificationData.notifications[i].id,
       Name:'Kirsten Bodensteiner',
       image:notificationData.notifications[i].image,
       Active__c : timeinMilliSec,
       Message__c:notificationData.notifications[i].messageBody,
     }
     this.notrecords.push(obj);
     if(firstLoop){
     this.notificationVisibel.push(obj);
     firstLoop=false;
     }
    
    }
    
    } else {
       console.log('errorfghgg>>> ',JSON.stringify(error));
    }
    }
}