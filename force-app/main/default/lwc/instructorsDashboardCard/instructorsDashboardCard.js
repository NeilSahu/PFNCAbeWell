import { LightningElement,track,wire,api } from 'lwc';
import Instructor_Dashboard_cardsImages from '@salesforce/resourceUrl/Instructor_Dashboard_cardsImages';
//high signal
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
//low signal
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
//medium signal
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';

import ShareIconBlueColor from '@salesforce/resourceUrl/ShareIconBlueColor';
import InstructorDashboardMinusIcon from '@salesforce/resourceUrl/InstructorDashboardMinusIcon';
import InstructorDashboardAddIcon from '@salesforce/resourceUrl/InstructorDashboardAddIcon';
import getClasses from '@salesforce/apex/DNA_InstructorClass.getClasses';
import getScheduleClasses from '@salesforce/apex/DNA_InstructorClass.getScheduleClasses';
import insertScheduleClass from '@salesforce/apex/DNA_InstructorClass.insertScheduleClass';
import LeadData from '@salesforce/apex/BWPS_ShareScheduleClass.CreateLeadforScheduleClassshared';
//import CaseData from '@salesforce/apex/BWPS_NeedHelpcaseCreate.createCase';
//import getContentVersionAndScheduleClasses from '@salesforce/apex/DNA_InstructorClass.getContentVersionAndScheduleClasses';
import ScheduleClassEdit from '@salesforce/apex/BWPS_editScheduleIlneitemClass.ScheduleClassEdit';
import getScheduleLineItem from '@salesforce/apex/BWPS_editScheduleIlneitemClass.ScheduleLineItemClassDetails';
//import ScheduleClassInsertion from '@salesforce/apex/BWPS_createScheduleClass.ScheduleClassInsertion';
import getBaseUrl from '@salesforce/apex/DNA_InstructorClass.getBaseUrl';
import communityPath from '@salesforce/community/basePath';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class InstructorsDashboardCard extends NavigationMixin(LightningElement) {

    @track Printcards=[];
    cardsImage = Instructor_Dashboard_cardsImages;
    defaultSCImage = Instructor_Dashboard_cardsImages;
    signal = lowSignal;
    share = ShareIconBlueColor;
    MinusIcon = InstructorDashboardMinusIcon;
    AddIcon = InstructorDashboardAddIcon;
    @track classArray = [];
    @track scheduleClassesArray;
    @track classYouTeachArray;
    @track selectedDaysList;
    @track isShowModal = false;
    @track isEditShowModal = false;
    @track isAllClassShowModal = false;
    @track showBwps_instructorDashboardRemoveClass = false;
    @track isShowSendModal = false;
    @track isShowAddClassChoiceModal = false;
    @track isRecurringModal = false;
    @track value = '';
    @track ScheduleLineItemRec={};
    @track nameOfclass='';
    @track formdataJson={};
    @track isLoading = false;
    @track scArrFlag = false;
    timeHoursArray = [];
    timeMinsArray = [];

    listDays = [
        { value: 'Monday', label: 'Monday' },
        { value: 'Tuesday', label: 'Tuesday' },
        { value: 'Wednesday', label: 'Wednesday' },
        { value: 'Thursday', label: 'Thursday' },
        { value: 'Friday', label: 'Friday' },
        { value: 'Saturday', label: 'Saturday' },
    ];

    get options() {
        return [
            { label: 'One Time Class', value: 'OneTime' },
            { label: 'Recurring Class', value: 'Recurring' },
        ];
    }

    @wire(getScheduleClasses)
    async scheduleClasses({data,error}){
        let scArr = [];
        let BaseUrl;
        await getBaseUrl()
        .then((result)=>{
            if(result){
                BaseUrl = result;
            }
        })
        //console.log('Data : ',JSON.stringify(data));
        if(data){
            scArr = [...data];
            let tempArr = [];
            //console.log('scArr : ',JSON.stringify(scArr));
            scArr.forEach(r => {
                let sc = JSON.parse(JSON.stringify(r));
                console.log('ContentVersionId__c : ',sc.ContentVersionId__c);
                if(sc.ContentVersionId__c != undefined){
                    //var imageUrl = urlCreator.createObjectURL();
                    //sc.scImage = sc.ContentImageUrl__c;
                    console.log('BaseUrl : ',BaseUrl);
                    let burl = BaseUrl.replace("site","salesforce");
                    console.log(burl);
                    //Sandbox baseUrl - https://parkinsonfoundationofthenationalca--pfncadna.sandbox.file.force.com
                    sc.scImage = 'https://parkinsonfoundationofthenationalca--pfncadna.sandbox.file.force.com'+'/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId='+sc.ContentVersionId__c;
                    //sc.scImage = '/sfc/servlet.shepherd/version/download/'+sc.ContentVersionId__c;
                }else{
                    sc.scImage = this.defaultSCImage;
                }
                //sc.scImage = this.cardsImage;
                let sig = sc.Integrity__c;
                if(sig == 'Low/Seated'){
                    sc.Level = lowSignal;
                }
                else if(sig == 'Medium'){
                    sc.Level = mediumSignal;
                }
                else if(sig == 'High/Active'){
                    sc.Level = highSignal;
                }
                else{
                    sc.Level = lowSignal;
                }
                let scLineItemArr = r.Schedule_Class_Line_Items__r;

                let lineItemArr = [];
                let count = 1;
                if(r.Schedule_Class_Line_Items__r != undefined){
                    scLineItemArr.forEach(scli => {
                        let e = JSON.parse(JSON.stringify(scli));
                        e.action = 'EDIT';
                        e.shortDay = '';
                        if(e.BWPS_ClassDay__c != undefined && e.BWPS_ClassDay__c != null && e.BWPS_ClassDay__c != ''){
                            let day = e.BWPS_ClassDay__c;
                            e.shortDay = day.substring(0,3).toUpperCase();
                        }
                        if(e.BWPS_StartTime__c != undefined){
                            var timeInHours = ((Number(e.BWPS_StartTime__c)/1000)/60)/60;
                            if(timeInHours == 0){
                                e.scLineItemTime = '12:00AM';
                            }else{
                                var isInteger = Number.isInteger(timeInHours)
                                let timeOfDay = timeInHours < 12 ? 'AM' : 'PM';
                                timeInHours -= timeInHours <= 12 ? 0 : 12;
                                if(isInteger){
                                    e.scLineItemTime = String(timeInHours).padStart(2, '0')+':00' + timeOfDay;
                                }else{
                                    var hours = String(timeInHours).split('.')[0];
                                    var decimalMins = String(timeInHours).split('.')[1];
                                    // convert decimalMin to seconds
                                    decimalMins = (String(decimalMins)[0]) + '.' + (String(decimalMins).substr(1));
                                    var min = Math.round(6 * decimalMins);
                                    e.scLineItemTime = String(hours).padStart(2, '0')+':'+String(min).padStart(2, '0')+'' + timeOfDay;
                                }
                            }
                        }
                        else{
                            e.scLineItemTime = '00:00AM';
                        }
                        e.firstCard = count == 1 ? true: false;
                        e.secCard = count == 2 ? true: false;
                        count++;
                        lineItemArr.push(e);
                    });
                }
                
                console.log('Before Sort',JSON.stringify(lineItemArr));
                for (let i = 0; i < lineItemArr.length; i++) {
                    for (let j = 0; j < lineItemArr.length-i-1; j++) {
                        let jDate = new Date(new Date(lineItemArr[j].BWPS_ClassDate__c).valueOf() + lineItemArr[j].BWPS_StartTime__c);
                        let j1Date = new Date(new Date(lineItemArr[j+1].BWPS_ClassDate__c).valueOf() + lineItemArr[j+1].BWPS_StartTime__c);
                        if(jDate.valueOf() > j1Date.valueOf()){
                            let temp = lineItemArr[j + 1];
                            lineItemArr[j + 1] = lineItemArr[j];
                            lineItemArr[j] = temp;
                        }  
                    }
                }
                //console.log('After Sort',JSON.stringify(lineItemArr));
                sc.Schedule_Class_Line_Items__r = lineItemArr;
                sc.moreCheck = lineItemArr.length > 2 ? true : false;
                sc.footText = "Scheduled Classes: " + lineItemArr.length + (lineItemArr.length > 2 ? ' |': '');
                // sc.secCard = lineItemArr.length >= 2 ? lineItemArr[1].scLineItemTime:undefined;
                console.log('Status : ',sc.BWPS_Status__c);
                if(sc.BWPS_Status__c == 'Active'){
                    tempArr.push(sc);
                }
            });
            this.scheduleClassesArray = tempArr;
            if(this.scheduleClassesArray.length > 0){
                this.scArrFlag = true;
            }
            //this.TEST =scArr[0].Schedule_Class_Line_Items__r[0].Name;
        }

    }
    connectedCallback(){
        for (let i = 0; i < 60; i++) {
            let count = i;
            if(i < 10 ){
                count = '0'+i;
            }
            if(i <= 12 && i > 0){
                this.timeHoursArray.push(count);
            }
            this.timeMinsArray.push(count); 
        }
        console.log('timeHoursArray : ', this.timeHoursArray);
        console.log('timeMinsArray : ', this.timeMinsArray);
        console.log('Connected Callback  : ');
        // getContentVersionAndScheduleClasses()
        // .then(result =>{
        //     let scArr = [];
        //     if(result){
        //         let temp = [...result];
        //         console.log('Result of connected callback : ',JSON.stringify(temp));
        //         // temp.forEach(e => {
        //         //     console.log('eeeee : ',e);
        //         //     // console.log('e ',e);
        //         //     // let contentVerId = e.key();
        //         //     // console.log('converid ',contentVerId);
        //         //     // let scObj = e.get(contentVerId);
        //         //     // console.log('sc object ',scObj);
        //         //     // scObj.imageUrl = '/sfc/servlet.shepherd/version/download/'+contentVerId;
        //         //     // scArr.push(scObj);
        //         // });
        //         this.classYouTeachArray = scArr;
        //     }
        // })
        // contentVersionId = 'id';
        // imageUrl = '/sfc/servlet.shepherd/version/download/'  + contentVersionId;
    }
    showRecurringModalBox() {  
        this.isRecurringModal = true;
    }
    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
        this.isRecurringModal = false;
    }
    showEditModalBox() {  
        this.isEditShowModal = true;
    }

    hideEditModalBox() {  
        this.nameOfclass ='';
        this.ScheduleLineItemRec = {};
        this.isEditShowModal = false;
    }
    showAllClassModalBox() {  
        this.isAllClassShowModal = true;
    }

    hideAllClassModalBox() {  
        this.isAllClassShowModal = false;
    }

    AddAClass(){
        this.showAddClassChoiceModalBox();
        
        // this[NavigationMixin.Navigate]({
        //     type: 'standard__objectPage',
        //     attributes: {
        //         actionName: "new",
        //         objectApiName: "Schedule_Class__c"
        //     }
        //     // ,
        //     // state: {
        //     //    recordTypeId: "0123C000000T1L8QAK",
        //     // }
        // });
    }

    RemoveAClass(){
        //this.showBwps_instructorDashboardRemoveClass = true;
        const classtTem = this.template.querySelector('c-bwps_instructor-dashboard-remove-class');
        classtTem.donateClickHandler();
    }

    handleSignal(){

    }

    handleShare(event){
        this.showSendModalBox();
        let scId = event.target.dataset.id;
        let scDescription = event.target.dataset.description;
        console.log('Schedule Class Id : ', scId);
        console.log('Schedule Class Id : ', scDescription);   
    }
    hideSendModalBox(){
        this.isShowSendModal = false;
    }
    showSendModalBox(){
        this.isShowSendModal = true;
    }
    showAddClassChoiceModalBox(){
        this.isShowAddClassChoiceModal = true;
    }
    hideAddClassChoiceModalBox(){
        this.isShowAddClassChoiceModal = false;
    }
    nextAddClassChoiceModalMethod(){
        let option = this.template.querySelector('.classOptionClass').value;
        console.log('Option : ',option);
        if(option == 'OneTime'){
            this.hideAddClassChoiceModalBox();
            this.showModalBox();
            getClasses()
            .then(result =>{
                this.classArray = result;
            });
        }
        else if(option == 'Recurring'){
            this.showRecurringModalBox();
            getClasses()
            .then(result =>{
                this.classArray = result;
            });
        }
    }
    handleDayChange(event) {
        // Get the list of the "value" attribute on all the selected options
        this.selectedDaysList = event.detail.value;
    }
    saveClassMethod(event){
        this.hideAddClassChoiceModalBox();
        let classType = event.target.dataset.classtype;
        let tempRecurring;
        let scObj;
        if(classType == 'oneTime'){
            let scheduleClassName = this.template.querySelector('.scName').value;
            let className = this.template.querySelector('.className').value;
            let startDate = this.template.querySelector('.startDate').value;
            let integrity = this.template.querySelector('.intensity').value;
            // StartTime logic
            let startTimeHours = this.template.querySelector('.startTimeHours').value;
            let startTimeMins = this.template.querySelector('.startTimeMins').value;
            let startTimeAmPm = this.template.querySelector('.startTimeAmPm').value;
            let startTime = '';
            if(startTimeAmPm == 'PM'){
                let startHours = Number(startTimeHours) + 12 ;
                startTime = startHours+':'+startTimeMins;
            }
            else{
                startTime = startTimeHours+':'+startTimeMins;
            }
            // EndTime logic
            let endTime = '';
            let endTimeHours = this.template.querySelector('.endTimeHours').value;
            let endTimeMins = this.template.querySelector('.endTimeMins').value;
            let endTimeAmPm = this.template.querySelector('.endTimeAmPm').value;
            if(endTimeAmPm == 'PM'){
                let endHours = Number(endTimeHours) + 12 ;
                endTime = endHours+':'+endTimeMins;
            }
            else{
                endTime = endTimeHours+':'+endTimeMins;
            }
            // let startTime = this.template.querySelector('.startTime').value;
            // let endTime = this.template.querySelector('.endTime').value;
            //let description) = this.template.querySelector('.description')?.value;

            tempRecurring = {
                "ScheduleClassDetails":{
                    "recordType":"OneTime",
                    "integrity" : integrity,
                    "className":className,
                    "startDate":startDate,
                    "startTime":startTime,
                    "endTime":endTime,
                    "scheduleClassName":scheduleClassName,
                    //"decription":description
                }
            }
            scObj = {
                "recordType":"OneTime",
                "integrity" : integrity,
                "className":className,
                "startDate":startDate,
                "startTime":startTime,
                "endTime":endTime,
                "scheduleClassName":scheduleClassName,
                //"description":description
            }
        }
        else if(classType == 'recurring'){
            let scheduleClassName = this.template.querySelector('.scName').value;
            let className = this.template.querySelector('.className').value;
            let startDate = this.template.querySelector('.startDate').value;
             // StartTime logic
             let startTimeHours = this.template.querySelector('.startTimeHours').value;
             let startTimeMins = this.template.querySelector('.startTimeMins').value;
             let startTimeAmPm = this.template.querySelector('.startTimeAmPm').value;
             let startTime = '';
             if(startTimeAmPm == 'PM' || startTimeHours == '12'){
                if(startTimeHours == '12'){
                    let startHours = Number(startTimeHours) - 12 ;
                    startTime = startHours+':'+startTimeMins;
                
                }else{
                    let startHours = Number(startTimeHours) + 12 ;
                    startTime = startHours+':'+startTimeMins;
                }
             }
             else{
                 startTime = startTimeHours+':'+startTimeMins;
             }
             // EndTime logic
             let endTime = '';
             let endTimeHours = this.template.querySelector('.endTimeHours').value;
             let endTimeMins = this.template.querySelector('.endTimeMins').value;
             let endTimeAmPm = this.template.querySelector('.endTimeAmPm').value;
             if(endTimeAmPm == 'PM' || endTimeHours == '12'){
                 if(endTimeHours == '12'){
                     let endHours = Number(endTimeHours) - 12 ;
                    endTime = endHours+':'+endTimeMins;
                 }
                 else{
                     let endHours = Number(endTimeHours) + 12 ;
                    endTime = endHours+':'+endTimeMins;
                 }
             }
             else{
                 endTime = endTimeHours+':'+endTimeMins;
             }
            // let startTime = this.template.querySelector('.startTime').value;
            // let endTime = this.template.querySelector('.endTime').value;
            let integrity = this.template.querySelector('.intensity').value;
            let classFrequency = this.template.querySelector('.classFrequency').value;
            let description = this.template.querySelector('.description').value;
            let classDays = '';
            if(this.selectedDaysList != undefined ){
                for (let i = 0; i < this.selectedDaysList.length; i++) {
                    classDays += this.selectedDaysList[i];
                    if(i < this.selectedDaysList.length-1){
                        classDays += ';';
                    }
                }
            }
            console.log('dayString : ',classDays);

            tempRecurring = {
                "ScheduleClassDetails":{
                    "recordType":"Recurring",
                    "integrity" : integrity,
                    "className":className,
                    "startDate":startDate,
                    "startTime":startTime,
                    "endTime":endTime,
                    "scheduleClassName":scheduleClassName,
                    "classDays":classDays,
                    "classFrequency":classFrequency,
                    "decription":description
                }
            }
            scObj = {
                "recordType":"Recurring",
                "integrity" : integrity,
                "className":className,
                "startDate":startDate,
                "startTime":startTime,
                "endTime":endTime,
                "scheduleClassName":scheduleClassName,
                "classDays":classDays,
                "classFrequency":classFrequency,
                "description":description
            } 
        }
        
        this.showToast();
        console.log(tempRecurring);
        // ScheduleClassInsertion({ScheduleClassData : tempRecurring})
        // .then((result)=>{
        //     console.log('result : ',result);
        // }).catch(error => {
        //     this.error = error;
        // });
        console.log('scObj : ',JSON.stringify(scObj));
        insertScheduleClass({scObj : scObj})
        .then((result)=>{
            console.log('result : ',result);
            if(result != null){
                this.template.querySelector('c-recurring-donation').showToast('success', 'Class add successfully.');
            }
            else{
                this.template.querySelector('c-recurring-donation').showToast('error', 'Class is not add successfully.');
            } is
        }).catch(error => {
            console.log(error);
        });
        this.hideModalBox();
        this.template.querySelector('c-recurring-donation').showToast('success', 'Class has been added successfully.');
    }
    showToast() {
        const event = new ShowToastEvent({
            title: 'Success!',
            variant : 'success',
            message:
                'Class Successfully Created !',
        });
        this.dispatchEvent(event);
    }
    showMoreSCLineItemMethod(event){
        this.showAllClassModalBox();
        let scId = event.target.dataset.id;
        this.showMoreClassMethod(scId);
    }
    showEditPageModalMethod(event){
        this.hideAllClassModalBox();
        console.log('ScheduleLineItem',event.target.getAttribute('data-id'));
        getScheduleLineItem({ScheduleLineClassId:event.target.getAttribute('data-id')}).then(result=>{
            console.log('result>>> ',JSON.stringify(result))
            this.ScheduleLineItemRec = result;
            this.nameOfclass = this.ScheduleLineItemRec.Schedule_Class__r.Name;
            console.log('ScheduleLineItemRec>>> ',JSON.stringify(this.ScheduleLineItemRec))
            if(this.ScheduleLineItemRec.BWPS_EndTime__c != '' &&  this.ScheduleLineItemRec.BWPS_EndTime__c != null 
            && this.ScheduleLineItemRec.BWPS_EndTime__c != undefined){
                var hours = Math.floor(this.ScheduleLineItemRec.BWPS_EndTime__c / (1000*60 * 60));
                var divisor_for_minutes = this.ScheduleLineItemRec.BWPS_EndTime__c  % (1000*60 * 60);
                var minutes = Math.floor(divisor_for_minutes / (60*1000));
                console.log( `TIME>>${hours}:${minutes}`);
                var formatedHr=hours.toString().length ==1 ? `0${hours}`:hours;
                var formatedSS= minutes.toString().length ==1 ? `0${minutes}`:minutes ;
                if(hours > 11){
                    this.ScheduleLineItemRec.BWPS_EndTime__c = formatedHr + ":" + formatedSS;
                }else{
                    this.ScheduleLineItemRec.BWPS_EndTime__c = formatedHr + ":" + formatedSS;
                }
                
                console.log('after>>>>',this.ScheduleLineItemRec.BWPS_EndTime__c);
            }
            if(this.ScheduleLineItemRec.BWPS_StartTime__c != '' &&  this.ScheduleLineItemRec.BWPS_StartTime__c != null 
            && this.ScheduleLineItemRec.BWPS_StartTime__c != undefined){
                var hours = Math.floor(this.ScheduleLineItemRec.BWPS_StartTime__c / (1000*60 * 60));
                var divisor_for_minutes = this.ScheduleLineItemRec.BWPS_StartTime__c %(1000*60 * 60);
                var minutes = Math.floor(divisor_for_minutes /(1000*60));
                console.log( `TIME>>${hours}:${minutes}`);
                var formatedHr=hours.toString().length ==1 ? `0${hours}`: hours;
                var formatedSS= minutes.toString().length ==1 ?`0${minutes}`: minutes ;
                if(hours > 11){
                    this.ScheduleLineItemRec.BWPS_StartTime__c =  formatedHr + ":" +formatedSS;
                }else{
                    this.ScheduleLineItemRec.BWPS_StartTime__c = formatedHr + ":" + formatedSS;
                }
                
                console.log('after>>>>',this.ScheduleLineItemRec.BWPS_StartTime__c);
            }

        }).catch(e=>{ 
            console.log('erroe While geting record',JSON.stringify(e));
        });
        this.showEditModalBox();
    }
    saveEditClassMethod(){
        const form = this.template.querySelector('[data-id="ScheduleLineItem"]');
        const formData = new FormData(form);
        console.log('formData>>>>',formData);
        this.isLoading=true;
        if(formData!=null && formData != undefined){
            for (const [key, value] of formData) {
              this.formdataJson[key] = `${value}`;
              console.log(`KEY: ${key}  VALUE:  ${value} \n`);
              }
              ScheduleClassEdit({ScheduleClassData:JSON.stringify(this.formdataJson), classId:this.ScheduleLineItemRec.Id}).then(result=>{
               console.log("Result>>",result)
               this.nameOfclass ='';
               this.ScheduleLineItemRec = {};
               this.isLoading=false;
               this.hideEditModalBox();
              }).catch(exception=>{
                console.log('Exception While saving class information',exception)
              });

        }
    }
    // send email code
    @track CaseRecords;
    @track temp;
    Subject ='Subject data';
    Body ='Body Data';
    Email ='LWC@gmail.com';
    sendMailMethod(){
        console.log('ind');
        this.Subject = this.template.querySelector(`[data-id= 'Subject']`).value;
        this.Body = this.template.querySelector(`[data-id= 'Description']`).value;
        this.Email = this.template.querySelector(`[data-id= 'Email']`).value;
         this.temp={
             "LeadDetails":{
                 "Subject":this.Subject,
             "Body":this.Body,
             "Email": this.Email
             }
         }
        console.log("body  "+this.Body);
        console.log("temp : ",JSON.stringify(this.temp));
        LeadData({LeadDetails:this.temp})
        .then(result => {
            this.CaseRecords = result;
            console.log("output");
            console.log(this.CaseRecords);
        })
        .catch(error => {
            this.error = error;
            console.log('error',this.error)
        });
        console.log("fire");
        const custEvent = new CustomEvent(
        'callpasstoparent', {
            detail: 'false'
        });
        this.dispatchEvent(custEvent);
        this.template.querySelector('c-toast-message').showToast('success', 'Mail sent successfully.');
        this.hideSendModalBox();
    }
    @track showMoreScheduleClassLineItemArray = [];
    showMoreClassMethod(scId){
        this.showMoreScheduleClassLineItemArray = [];
        console.log('scid From show more : ', scId);
        this.scheduleClassesArray.forEach(e => {
            if(e.Id == scId){
                var scLineItemArr = e.Schedule_Class_Line_Items__r;
                console.log("scLineItemArr : ",JSON.stringify(scLineItemArr));
                // scLineItemArr.forEach(r => {
                    for (let i = 0; i < scLineItemArr.length; i++) {
                        for (let j = 0; j < scLineItemArr.length-i-1; j++) {
                            let jDate = new Date(new Date(scLineItemArr[j].BWPS_ClassDate__c).valueOf() + scLineItemArr[j].BWPS_StartTime__c);
                            let j1Date = new Date(new Date(scLineItemArr[j+1].BWPS_ClassDate__c).valueOf() + scLineItemArr[j+1].BWPS_StartTime__c);
                            // jDate.setHours(0,0,0,0);
                            // j1Date.setHours(0,0,0,0);
        
                            if(jDate.valueOf() > j1Date.valueOf()){
                                let temp = scLineItemArr[j + 1];
                                scLineItemArr[j + 1] = scLineItemArr[j];
                                scLineItemArr[j] = temp;
                            }  
                        }
                    }
                    this.showMoreScheduleClassLineItemArray.push(...scLineItemArr);
                // });
            }
        });

    }
}