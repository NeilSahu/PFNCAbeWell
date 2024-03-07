import { LightningElement, track, wire, api } from 'lwc';
import secureDonationImage from '@salesforce/resourceUrl/secureDonation';
//import DonationRec from '@salesforce/apex/BWPS_DonarDashboardDonateFormClass.BWPS_CreateDonation';
import DonationRecs from '@salesforce/apex/BWPS_DonarDashboardDonateFormClass.BWPS_CreateDonations';
import recurringRecs from '@salesforce/apex/BWPS_DonarDashboardDonateFormClass.BWPS_CreateRecurringDonations';
//import recurringRec from '@salesforce/apex/BWPS_DonarDashboardDonateFormClass.CreateRecurringDonationRecord';
import sendEmail from '@salesforce/apex/BWPS_EmailSend.memoriesSendEmail';
import CheckPaymentStatus from '@salesforce/apex/CommunityAuthController.CheckPaymentStatus';
import sendingEmail from '@salesforce/apex/BWPS_TributeMail.sendingEmail';
import googlePayImage from '@salesforce/resourceUrl/googlePayImage';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import intTelInput from '@salesforce/resourceUrl/intTelInput';
import imask from '@salesforce/resourceUrl/imask';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
export default class Bwps_DonorDashboardDonateForm extends LightningElement {
    secureDonationImageUrl = secureDonationImage;
    @track count = 1;
    @track DonationRecords;
    @track temp;
    @track closecancel = true;
    @track tempRecurring;
    @track currentSelectBtn = '';
    @track currentRecurringType = '';
    @track Donationval = '';
    //@api GatewayId ='a173C000002vIIv';
    @api OppId;
    mailreqvalidation;
    @track mailonchange = false;
    payPalImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='19.788' height='23.374' viewBox='0 0 19.788 23.374'%3E%3Cpath id='Paypal_Icon' d='M9.742,15.573c-.181.99-.9,5.6-1.108,6.907-.016.093-.052.129-.155.129H4.634a.626.626,0,0,1-.623-.717L7.032,2.723a1.047,1.047,0,0,1,1.031-.871c7.85,0,8.51-.191,10.515.588,3.1,1.2,3.381,4.1,2.268,7.232-1.108,3.227-3.737,4.613-7.221,4.655-2.237.036-3.582-.361-3.881,1.247ZM22.407,8.156c-.093-.067-.129-.093-.155.067A12.112,12.112,0,0,1,21.8,9.954c-2.057,5.866-7.757,5.356-10.54,5.356a.518.518,0,0,0-.562.484c-1.164,7.237-1.4,8.747-1.4,8.747a.548.548,0,0,0,.546.665h3.273a.925.925,0,0,0,.9-.768c.036-.278-.057.314.742-4.706.238-1.134.737-1.015,1.51-1.015,3.66,0,6.515-1.484,7.365-5.789.335-1.794.238-3.681-1.226-4.773Z' transform='translate(-4.005 -1.831)' fill='%23ff9f37'/%3E%3C/svg%3E";
    googlePayImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44.991' height='18.117' viewBox='0 0 44.991 18.117'%3E%3Cpath id='Google_Pay_Icon' d='M7.432,133.33v2.9h4.014a3.491,3.491,0,0,1-1.486,2.292,4.473,4.473,0,0,1-6.7-2.386,4.612,4.612,0,0,1,0-2.882h0a4.449,4.449,0,0,1,4.169-3.119,3.967,3.967,0,0,1,2.848,1.13l2.129-2.153a7.117,7.117,0,0,0-4.974-1.957A7.42,7.42,0,0,0,.8,131.311a7.567,7.567,0,0,0,0,6.761v.011a7.41,7.41,0,0,0,6.635,4.148,7.043,7.043,0,0,0,4.921-1.821,7.4,7.4,0,0,0,2.208-5.547,9.4,9.4,0,0,0-.123-1.531Zm27.375-.281a4.118,4.118,0,0,0-2.91-.994,4,4,0,0,0-3.55,1.748l1.466.932a2.517,2.517,0,0,1,2.2-1.2,2.394,2.394,0,0,1,1.6.618,1.978,1.978,0,0,1,.681,1.492v.387a4.94,4.94,0,0,0-2.435-.545,4.315,4.315,0,0,0-2.776.827,2.694,2.694,0,0,0-1.042,2.219,2.794,2.794,0,0,0,.98,2.2,3.534,3.534,0,0,0,2.446.879,3.155,3.155,0,0,0,2.742-1.539h.07v1.246h1.589v-5.533A3.531,3.531,0,0,0,34.807,133.049Zm-1.352,6.278a2.624,2.624,0,0,1-1.868.785,2.011,2.011,0,0,1-1.289-.439,1.364,1.364,0,0,1-.546-1.1,1.468,1.468,0,0,1,.671-1.225,2.827,2.827,0,0,1,1.692-.492,3.294,3.294,0,0,1,2.165.617A2.488,2.488,0,0,1,33.456,139.327Zm-6.584-9.982a3.916,3.916,0,0,0-2.848-1.146H19.619v13.128H21.28v-5.317h2.742a3.96,3.96,0,0,0,2.848-1.12l.186-.188a3.828,3.828,0,0,0-.183-5.359Zm-1.166,4.375a2.155,2.155,0,0,1-1.641.681H21.28v-4.584h2.786a2.25,2.25,0,0,1,1.589.649,2.333,2.333,0,0,1,.052,3.252Zm17.479-1.373-2.569,6.446h-.032l-2.631-6.446H36.149l3.641,8.4-2.063,4.522h1.712l5.554-12.926Z' transform='translate(0 -127.155)' fill='%23ff9f37'/%3E%3C/svg%3E";
    bankTransferImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16.858' height='25.426' viewBox='0 0 16.858 25.426'%3E%3Cg id='Transfer_Icon' transform='translate(-29.999 -17.992)'%3E%3Cpath id='Path_11170' data-name='Path 11170' d='M31.782,24.179a.418.418,0,0,1,0-.537l3.141-3.806a.421.421,0,0,1,.747.268v1.251a.011.011,0,0,0,.012.012h8.977a.422.422,0,0,1,.421.421V26a.422.422,0,0,1-.421.421H35.712a.041.041,0,0,0-.041.041v1.253a.422.422,0,0,1-.747.268Zm5.535-4.5a2.11,2.11,0,0,0-3.694-.919l-3.141,3.806a2.106,2.106,0,0,0,0,2.683l3.141,3.806a2.11,2.11,0,0,0,3.7-.948h7.337A2.107,2.107,0,0,0,46.766,26V21.788a2.107,2.107,0,0,0-2.107-2.107Z' fill='%23ff9f37' fill-rule='evenodd'/%3E%3Cpath id='Path_11171' data-name='Path 11171' d='M42.028,52.049l1.3-1.078,3.171,3.814a2.1,2.1,0,0,1,0,2.693L45.2,56.4a.422.422,0,0,0,0-.54Zm-.746.619v-.351a.422.422,0,0,1,.746-.268l1.3-1.078a2.11,2.11,0,0,0-3.668.835H32.322a2.107,2.107,0,0,0-2.107,2.107v4.214a2.107,2.107,0,0,0,2.107,2.107h7.293a2.108,2.108,0,0,0,3.709,1.058l3.171-3.814L45.2,56.4l-3.171,3.813a.422.422,0,0,1-.746-.268m0-1.2v-.061a.137.137,0,0,0-.074-.122.124.124,0,0,0-.064-.016H32.322a.422.422,0,0,1-.421-.421V53.912a.422.422,0,0,1,.421-.421h8.539a.426.426,0,0,0,.151-.028.393.393,0,0,0,.074-.038.421.421,0,0,0,.2-.356v-.4m0,6.079v0Z' transform='translate(-0.125 -18.638)' fill='%23ff9f37' fill-rule='evenodd'/%3E%3C/g%3E%3C/svg%3E";
    creditcardImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26.507' height='21.471' viewBox='0 0 26.507 21.471'%3E%3Cpath id='Credit_Card_Icon' d='M9.349,33.132A1.824,1.824,0,0,0,11.414,35.2H30.108a1.819,1.819,0,0,0,2.049-2.064v-6.9H9.349ZM7.5,19.471q0-3.9,3.915-3.9H30.109q3.9,0,3.9,3.9V33.132q0,3.914-3.9,3.913H11.415q-3.914,0-3.915-3.913Zm1.849,0v1.586H32.158V19.471a1.811,1.811,0,0,0-2.049-2.049H11.416A1.82,1.82,0,0,0,9.35,19.471Z' transform='translate(-7.5 -15.574)' fill='%23ff9f37' fill-rule='evenodd'/%3E%3C/svg%3E";
    flowcall = false;
    card1 = true;
    card2 = false;
    card3 = false;
    card4 = false;
    amount = '';
    firstName = "";
    lastName = "";
    Email = "";
    ConfirmEmail = "";
    Phone = "";
    MailingState = "";
    MailingApartment = "";
    MailingPostalCode = "";
    MailingCountry = "";
    MailingCity = "";
    MailingStreet = "";
    SendMailingCountry = "";
    SendMailingZipCode = "";
    SendMailingState = "";
    SendMailingCity = "";
    SendMailingApartment = "";
    SendMailingStreet = "";
    Amounts = 0;
    PaymentMethod = "Credit Card";
    transactionCost = 8;
    coverTC = true;
    totalAmount = 0;
    showError = false;
    giveOnce = true;
    recurring = false;
    payMethodError = false;
    period = '';
    stopDate = false;
    stopcount = false;
    stopunending = false;
    stopSelectedDate;
    stopSelectedCount;
    showRecuuringEndCount = false;
    showRecuuringEndDate = false;
    selectedtype = '';
    frequencytemp = '';
    memoRLName = "";
    memoRFName = "";
    memoHLName = "";
    memoHFName = "";
    RecipientName = "";
    @track memoName = "no one";
    RecipientAddress = "";
    memoEmail = "";
    memoConfirmEmail = "";
    memoMessage = "";
    memoImg = "";
    CardSendAddress = false;
    honor = false;
    Inmemory = false;
    paid = false;
    GivenHonorOrMemory = false;
    IncludeTransactionChargeCheckbox = true;
    @track donationcreated = false;
    flowApiName = "PaymentAccept";

    @track inputElem;
    @track iti;
    @track mask;

    connectedCallback() {
        this.intilalizeLib();
    }

    intilalizeLib() {
        loadStyle(this, intTelInput + '/democss.css')
            .then(() => {
            });
        loadStyle(this, intTelInput + '/intlTelInputcss.css')
            .then(() => {
            });

        Promise.all([loadScript(this, intTelInput + '/utilsjs.js'), loadScript(this, imask), loadScript(this, intTelInput + '/intlTelInputjs.js')])
            .then(() => {

                this.inputElem = this.template.querySelector("[data-id=Phone]");
                this.iti = window.intlTelInput(this.inputElem, {

                    // utilsScript: utils,
                    preferredCountries: ['US','IN'],
                    separateDialCode: true,
                    //customContainer: "iti_margin",
                    utilsScript: intTelInput + '/utilsjs.js',

                });

                const itiElement = this.template.querySelector(".iti__flag-container");
                if (itiElement) {
                    itiElement.style.margin = '0px 9%';
                }

                // const countryData = window.intlTelInputGlobals.getCountryData();
                // console.log('cd ', JSON.stringify(window.intlTelInputGlobals));
                let firstMaskChange = false;
                this.inputElem.addEventListener('countrychange', (event) => {
                    var selectedCountryData = this.iti.getSelectedCountryData();

                    console.log("selectedCountryData ", JSON.stringify(selectedCountryData, null, 2));
                    let newPlaceHolder = intlTelInputUtils.getExampleNumber(selectedCountryData.iso2, true, intlTelInputUtils.numberFormat.INTERNATIONAL);
                    this.iti.setNumber("");


                    let newmask = newPlaceHolder.replace(/[1-9]/g, "0");


                    if (firstMaskChange) {

                        this.mask.destroy();

                        var maskOptions = {
                            mask: newmask
                        };
                        this.mask = IMask(this.inputElem, maskOptions);
                        this.mask.updateValue()

                    } else {
                        firstMaskChange = true;

                        var maskOptions = {
                            mask: newmask
                        };
                        this.mask = IMask(this.inputElem, maskOptions);
                        console.log('mask : ', this.mask.toString());
                    }
                });

                this.iti.promise.then(() => {
                    this.inputElem.dispatchEvent(new CustomEvent('countrychange'));
                })

            })

        // console.log('OUTPUT : Imask', JSON.stringify( imask.toString())  );


    }

    renderedCallback() {
        console.log('Render Callback Run count');
        console.log('card4 ', this.card4);
        console.log('count ', this.count);
        if (this.oppId != undefined && this.oppId != '' && this.count == 4) {
            console.log('inside condition off pay ');
            setTimeout(() => {
                this.offpay();
            }, 20000);
        }
    }

    get flowInputVariables() {
        console.log('this.OppId get ', this.OppId);
        return [
            {
                name: "DonorId",
                type: "String",
                value: this.OppId,//"0063C00000JqTWUQA3",//"a1D3C000000o66TUAQ",// this.OppId,
            }
        ];
    }

    getFormData(evt) {
        let fieldId = evt.target.dataset.id;
        if (fieldId == 'firstName') {
            this.firstName = this.template.querySelector(`[data-id='firstName']`).value;
            console.log("First name: ", this.firstName);
        } else if (fieldId == 'lastName') {
            this.lastName = this.template.querySelector(`[data-id='lastName']`).value;
            console.log("last name: ", this.lastName);
        }
        else if (fieldId == 'Email') {
            this.Email = this.template.querySelector(`[data-id='Email']`).value;
            console.log("Email: ", this.Email);
        }
        else if (fieldId == 'ConfirmEmail') {
            this.ConfirmEmail = this.template.querySelector(`[data-id='ConfirmEmail']`).value;
            console.log("Email: ", this.ConfirmEmail);
        }
        else if (fieldId == 'Phone') {
            this.Phone = this.template.querySelector(`[data-id='Phone']`).value;
        }
        else if (fieldId == 'MailingApartment') {
            this.MailingApartment = this.template.querySelector(`[data-id= 'MailingApartment']`).value;
            console.log("MailingApartment: ", this.MailingApartment);
        }
        else if (fieldId == 'MailingStreet') {
            this.MailingStreet = this.template.querySelector(`[data-id= 'MailingStreet']`).value;
            console.log("MailingStreet: ", this.MailingStreet);
        }
        else if (fieldId == 'MailingPostalCode') {
            this.MailingPostalCode = this.template.querySelector(`[data-id= 'MailingPostalCode']`).value;
            console.log("MailingPostalCode: ", this.MailingPostalCode);
        }
        else if (fieldId == 'MailingCountry') {
            this.MailingCountry = this.template.querySelector(`[data-id= 'MailingCountry']`).value;
            console.log("MailingCountry: ", this.MailingCountry);
        }
        else if (fieldId == 'MailingCity') {
            this.MailingCity = this.template.querySelector(`[data-id= 'MailingCity']`).value;
            console.log("MailingCity: ", this.MailingCity);
        }
        else if (fieldId == 'MailingState') {
            this.MailingState = this.template.querySelector(`[data-id= 'MailingState']`).value;
            console.log("MailingState: ", this.MailingState);
        }
        else if (fieldId == 'memoriesHFName') {
            this.memoHFName = this.template.querySelector(`[data-id= 'memoriesHFName']`).value;
            console.log("memoHFName: ", this.memoHFName);
        }
        else if (fieldId == 'memoriesHLName') {
            this.memoHLName = this.template.querySelector(`[data-id= 'memoriesHLName']`).value;
            console.log("memoHLName: ", this.memoHLName);
        }
        else if (fieldId == 'memoriesEmail') {
            this.memoEmail = this.template.querySelector(`[data-id= 'memoriesEmail']`).value;
            this.mailonchange = true;
            console.log("memoEmail: ", this.memoEmail);
        }
        else if (fieldId == 'memoriesConfirmEmail') {
            this.memoConfirmEmail = this.template.querySelector(`[data-id= 'memoriesConfirmEmail']`).value;
            this.mailonchange = true;
            console.log("memoConfirmEmail: ", this.memoConfirmEmail);
        }
        else if (fieldId == 'memoriesRFName') {
            this.memoRFName = this.template.querySelector(`[data-id= 'memoriesRFName']`).value;
            console.log("memoRFName: ", this.memoRFName);
        }
        else if (fieldId == 'memoriesRLName') {
            this.memoRLName = this.template.querySelector(`[data-id= 'memoriesRLName']`).value;
            console.log("memoRLName: ", this.memoRLName);
        }
        /*else if (fieldId == 'SendMailAddress') {
            this.RecipientAddress = this.template.querySelector(`[data-id= 'SendMailAddress']`).value;
            console.log("RecipientAddress: ", this.RecipientAddress);
            
        }*/
        else if (fieldId == 'SendMailingStreet') {
            this.SendMailingStreet = this.template.querySelector(`[data-id= 'SendMailingStreet']`).value;
            console.log("SendMailingStreet: ", this.SendMailingStreet);
        }
        else if (fieldId == 'SendMailingCity') {
            this.SendMailingCity = this.template.querySelector(`[data-id= 'SendMailingCity']`).value;
            console.log("SendMailingCity: ", this.SendMailingCity);
        }
        else if (fieldId == 'SendMailingApartment') {
            this.SendMailingApartment = this.template.querySelector(`[data-id= 'SendMailingApartment']`).value;
            console.log("SendMailingApartment: ", this.SendMailingApartment);
        }
        else if (fieldId == 'SendMailingState') {
            this.SendMailingState = this.template.querySelector(`[data-id= 'SendMailingState']`).value;
            console.log("SendMailingState: ", this.SendMailingState);
        }
        else if (fieldId == 'SendMailingZipCode') {
            this.SendMailingZipCode = this.template.querySelector(`[data-id= 'SendMailingZipCode']`).value;
            console.log("SendMailingZipCode: ", this.SendMailingZipCode);
        }
        else if (fieldId == 'SendMailingCountry') {
            this.SendMailingCountry = this.template.querySelector(`[data-id= 'SendMailingCountry']`).value;
            console.log("SendMailingCountry: ", this.SendMailingCountry);
        }
        else if (fieldId == 'memoriesMessage') {
            this.memoMessage = this.template.querySelector(`[data-id= 'memoriesMessage']`).value;
            console.log("memoMessage: ", this.memoMessage);
        }
        else if (fieldId == 'countselected') {
            this.stopSelectedCount = this.template.querySelector(`[data-id= 'countselected']`).value;
            console.log("stopSelectedCount: ", this.stopSelectedCount);
        }
        else if (fieldId == 'dateselected') {
            this.stopSelectedDate = this.template.querySelector(`[data-id= 'dateselected']`).value;
            console.log("stopSelectedDate: ", this.stopSelectedDate);
        }
    }
    @track fileData;
    openfileUpload(event) {
        console.log("file data call");
        const file = event.target.files[0]
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': file.name,
                'base64': base64,
                'recordId': this.recordId
            }
            console.log("FileData:>>>>>>>>>>>>>>>>>>>>>", JSON.stringify(this.fileData));
        }
        reader.readAsDataURL(file)
    }
    memoData() {
        console.log("Memo data call");
        //const { base64, filename, recordId } = this.fileData
        //sendEmail({ base64, filename, recordId, name: this.memoName, email: this.memoEmail, description: this.memoMessage }).then(result => {
        //})
    }

    async handleClick() {
        console.log("inside handle ");
        this.closecancel = false;
        if (this.coverTC) {
            var tempAmt = Number(this.transactionCost) + parseInt(this.amount);
            this.totalAmount = tempAmt.toFixed(2);
        }
        else {
            var tempAmt = parseInt(this.amount);
            this.totalAmount = tempAmt.toFixed(2);

        }
        this.Amounts = this.totalAmount;
        if (this.stopcount) {
            this.frequencytemp = 'Count';
        }
        else if (this.stopDate) {
            this.frequencytemp = 'Date';
        }
        else if (this.stopunending) {
            this.frequencytemp = 'Unending';
        }
        if (this.honor) {
            this.selectedtype = 'Honor';
        }
        else if (this.Inmemory) {
            this.selectedtype = 'Memorial';
        }
        console.log("insids this.frequencytemp ", this.frequencytemp);
        this.temp = {
            "ContactDetails": {
                "firstName": this.firstName,
                "lastName": this.lastName,
                "Amounts": this.Amounts,
                "Phone": this.Phone,
                "Email": this.Email,
                "MailingStreet": this.MailingStreet,
                "MailingPostalCode": this.MailingPostalCode,
                "MailingCountry": this.MailingCountry,
                "MailingApartment": this.MailingApartment,
                "MailingCity": this.MailingCity,
                "MailingState": this.MailingState,

                "HonoreeName": this.memoName,
                "RecipientName": this.RecipientName,
                "RecipientEmail": this.memoEmail,
                "RecipientAddress": this.SendMailingStreet + ' ' + this.SendMailingApartment + ' ' + this.SendMailingCity + ' ' + this.SendMailingState + ' ' + this.SendMailingCountry + ' ' + this.SendMailingZipCode,
                "SendMailingCountry": this.SendMailingCountry,
                "SendMailingZipCode": this.SendMailingZipCode,
                "SendMailingState": this.SendMailingState,
                "SendMailingCity": this.SendMailingCity,
                "SendMailingStreet": this.SendMailingStreet + ' ' + this.SendMailingApartment,
                "HonoreeDescription": this.memoMessage,
                "tributetype": this.selectedtype


            },
            "DonationDetails": {
                "PaymentMethod": this.PaymentMethod,
                "Amounts": this.Amounts
            }
        }

        this.tempRecurring = {
            "ContactDetails": {
                "firstName": this.firstName,
                "lastName": this.lastName,
                "Amounts": this.Amounts,
                "Phone": this.Phone,
                "Email": this.Email,
                "MailingStreet": this.MailingStreet,
                "MailingPostalCode": this.MailingPostalCode,
                "MailingCountry": this.MailingCountry,
                "MailingApartment": this.MailingApartment,
                "MailingCity": this.MailingCity,
                "MailingState": this.MailingState,

                "HonoreeName": this.memoName,
                "RecipientName": this.RecipientName,
                "RecipientEmail": this.memoEmail,
                "RecipientAddress": this.RecipientAddress,
                "HonoreeDescription": this.memoMessage,
                "tributetype": this.selectedtype

            },
            "DonationDetails": {
                "Amounts": this.Amounts,
                "Period": this.period,
                "Frequency": this.frequencytemp,
                "ScheDate": this.stopSelectedDate,
                "selectedCount": this.stopSelectedCount
            }
        }
        this.donationcreated = false;
        console.log("this.donationcreated ", this.donationcreated);
        console.log("inside before once");
        console.log("DataMap same ", JSON.stringify(this.tempRecurring));
        console.log("DataMap same  ", JSON.stringify(this.temp));
        console.log('this.fileData.base64 ', JSON.stringify(this.fileData));
        var mailphoto = JSON.stringify(this.fileData);
        var honorphoto;
        if (mailphoto != undefined) {
            honorphoto = this.fileData.base64;
        }
        else {
            honorphoto = null;
        }
        if (this.giveOnce) {
            console.log("DataMap " + this.temp);
            console.log("DataMap 11111", JSON.stringify(this.temp));
            let str = 'hey';
            await DonationRecs({ DataMap: this.temp, HonneePhoto: honorphoto, OpportunityDetails: this.OppId })
                .then(result => {
                    this.DonationRecords = result;
                    console.log('result ', result);
                    console.log('result.Id ', result.Id);
                    this.OppId = result.Id;
                    this.donationcreated = true;
                    this.closecancel = true;
                    console.log(' this.OppId ', this.OppId);
                    console.log(JSON.stringify(this.DonationRecords));
                })
                .catch(error => {
                    console.log('test 1');
                    console.log('error', error.body.message);
                    console.log('error JSOn ', JSON.stringify(error.body.message));
                });
        }

        else if (this.recurring) {
            console.log("DataMap recurring " + this.tempRecurring);
            console.log("DataMap recurring 11111", JSON.stringify(this.tempRecurring));
            await recurringRecs({ DataMap: this.tempRecurring, HonneePhoto: honorphoto, OpportunityDetails: this.OppId })
                .then(result => {
                    this.DonationRecords = result;
                    console.log('result ', result);
                    this.OppId = result.Id;
                    this.donationcreated = true;
                    this.closecancel = true;
                    console.log("rec result.Id ", this.OppId);
                    console.log("output");
                    console.log(' this.OppId ', this.OppId);
                    console.log(this.DonationRecords);
                })
                .catch(error => {
                    this.error = error;
                    console.log('error', this.error)
                });
        }
        // else{
        //     console.log("DataMap "+ this.temp);
        //     console.log("DataMap 1111t1",JSON.stringify(this.temp));
        //     await DonationRec({DataMap:this.temp})			
        //     .then(result => {
        //             this.DonationRecords = result;
        //              this.OppId = result.Id;
        //                  this.donationcreated = true;
        //             console.log("output");
        //             console.log("rec result.Id ", this.OppId);
        //             console.log(this.DonationRecords);
        //         })
        //         .catch(error => {
        //             this.error = error;
        //             console.log('error',this.error)
        //         });
        // }

    }
    amountClickHandler(evt) {
        try {
            this.amount = evt.currentTarget.dataset.id;
            let className;
            if (this.currentRecurringType != '') {
                className = this.currentRecurringType;
            }
            this.template.querySelectorAll('.amt-sec').forEach(
                ele => {
                    let clsName = ele.dataset.id;
                    console.log('clsNameOut : ', clsName);
                    if (clsName != 'by-count' || clsName != 'by-date' || clsName != 'unending') {
                        ele.className = "amount-div amount-section-margin amt-sec";
                        console.log('clsNameIn : ', clsName);
                    }
                }
            );
            console.log('amount : ', this.amount);
            this.template.querySelector("[data-id='" + this.amount + "']").className = 'amount-div amount-section-margin selected-btn amt-sec';
            this.template.querySelector("[data-id='" + className + "']").className = 'amount-div amount-section-margin selected-btn amt-sec';
            this.template.querySelector("[data-id='amount-input']").value = this.amount;
        }
        catch (error) {
            console.log('error : ', error, error.message);
        }
    }

    HandleGiveHonorOrMemory(evt) {
        let dataselected = evt.target.dataset.id;
        this.currentSelectBtn = dataselected;
        console.log('dataselected : ', dataselected);
        if (dataselected == 'HonorIn') {
            this.honor = true;
            this.Inmemory = false;
            setTimeout(() => {
                this.template.querySelector("[data-id='HonorIn']").className = 'amount-div amount-div-full-width selected-btn';
                this.template.querySelector("[data-id='MemoryIn']").className = 'amount-div';
            }, 100);

        }
        else if (dataselected == 'MemoryIn') {
            this.Inmemory = true;
            this.honor = false;
            setTimeout(() => {
                this.template.querySelector("[data-id='MemoryIn']").className = 'amount-div amount-div-full-width selected-btn';
                this.template.querySelector("[data-id='HonorIn']").className = 'amount-div';
            }, 100);
        }
    }
    GiveOnceOrMonthly(evt) {
        let selectedtype = evt.target.value;
        if (selectedtype == 'GiveOnce') {
            this.giveOnce = true;
            this.recurring = false;
            // this.period= '';
            /*this.template.querySelector("[data-id='giveonce']").className = 'amount-div amount-div-full-width selected-btn';
            this.template.querySelector("[data-id='monthly']").className = 'amount-div';
            this.template.querySelector("[data-id='quaterly']").className = 'amount-div';
            this.template.querySelector("[data-id='semiAnnual']").className = 'amount-div';
            this.template.querySelector("[data-id='annual']").className = 'amount-div';*/
        }
        else if (selectedtype == 'Monthly') {
            this.giveOnce = false;
            this.recurring = true;
            this.period = 'Monthly';
            /*this.template.querySelector("[data-id='giveonce']").className = 'amount-div amount-div-full-width';
            this.template.querySelector("[data-id='monthly']").className = 'amount-div selected-btn';
            this.template.querySelector("[data-id='quaterly']").className = 'amount-div';
            this.template.querySelector("[data-id='semiAnnual']").className = 'amount-div';
            this.template.querySelector("[data-id='annual']").className = 'amount-div';*/
        }
        else if (selectedtype == 'Quaterly') {
            this.giveOnce = false;
            this.recurring = true;
            this.period = 'Quarterly';
            /* this.template.querySelector("[data-id='giveonce']").className = 'amount-div amount-div-full-width';
             this.template.querySelector("[data-id='monthly']").className = 'amount-div';
             this.template.querySelector("[data-id='quaterly']").className = 'amount-div selected-btn';
             this.template.querySelector("[data-id='semiAnnual']").className = 'amount-div';
             this.template.querySelector("[data-id='annual']").className = 'amount-div';*/
        }
        else if (selectedtype == 'Semi Annual') {
            this.giveOnce = false;
            this.recurring = true;
            this.period = 'Semiannual';
            /*this.template.querySelector("[data-id='giveonce']").className = 'amount-div amount-div-full-width';
            this.template.querySelector("[data-id='monthly']").className = 'amount-div ';
            this.template.querySelector("[data-id='quaterly']").className = 'amount-div';
            this.template.querySelector("[data-id='semiAnnual']").className = 'amount-div selected-btn';
            this.template.querySelector("[data-id='annual']").className = 'amount-div';*/
        }
        else if (selectedtype == 'Annual') {
            this.giveOnce = false;
            this.recurring = true;
            this.period = 'Annual';
            //this.template.querySelector("[data-id='giveonce']").className = 'amount-div amount-div-full-width';
            //this.template.querySelector("[data-id='monthly']").className = 'amount-div ';
            //this.template.querySelector("[data-id='quaterly']").className = 'amount-div';
            //this.template.querySelector("[data-id='semiAnnual']").className = 'amount-div';
            //this.template.querySelector("[data-id='annual']").className = 'amount-div selected-btn';
        }
        console.log('Give once ', this.giveOnce);
        console.log('Give period ', this.period);
        console.log('Give recurring ', this.recurring);
    }
    amountInputChange(evt) {
        let val = evt.target.value;
        this.amount = val;

        this.template.querySelectorAll('.amt-sec').forEach(element => {
            if (parseInt(element.dataset.id) == parseInt(this.amount)) {
                element.classList.add('selected-btn');
            }
            else {
                element.classList.remove('selected-btn');
            }
        });
    }

    continueClickHandler(evt) {
        // console.log("this.continue click hanlder inside")
        let skip = evt.target.dataset.id;
        this.count++;
        this.creditcard = false;
        this.gpay = false;
        this.paypal = false;
        this.banktransfer = false;
        console.log('test DNA = ', this.count);
        if (this.count == 2) {
            console.log("inside count 2");
            this.Email = this.template.querySelector(`[data-id= 'Email']`).value.trim();
            let emailAddress3FieldElement = this.template.querySelector(`[data-id= 'Email']`);
            let check = /^[a-zA-Z0-9'*+._]+@\w+([\.-]?\w+)*(\.\w{2,6})+$/.test(emailAddress3FieldElement.value);

            if (this.firstName == "") {
                this.count--;
                this.template.querySelector(`[data-id= 'firstName']`).className = "card-error-input";
                this.template.querySelector(`[data-id= 'first-label']`).className = "card-error-input-label"
            }
            else if (this.lastName == "") {
                this.count--;
                this.template.querySelector(`[data-id= 'firstName']`).className = "card-input-validinp";
                this.template.querySelector(`[data-id= 'first-label']`).className = "card-input-validlbl"
                this.template.querySelector(`[data-id= 'lastName']`).className = "card-error-input";
                this.template.querySelector(`[data-id= 'last-label']`).className = "card-error-input-label"
            }
            else if (this.Email == "") {
                this.count--;
                this.template.querySelector(`[data-id= 'lastName']`).className = "card-input-validinp";
                this.template.querySelector(`[data-id= 'last-label']`).className = "card-input-validlbl"
                this.template.querySelector(`[data-id= 'Email']`).className = "card-error-input";
                this.template.querySelector(`[data-id= 'email-label']`).className = "card-error-input-label"
            }
            else if (this.ConfirmEmail == "") {
                this.count--;
                // this.template.querySelector(`[data-id= 'lastName']`).className = "card-input-validinp";
                // this.template.querySelector(`[data-id= 'last-label']`).className = "card-input-validlbl"
                this.template.querySelector(`[data-id= 'ConfirmEmail']`).className = "card-error-input";
                this.template.querySelector(`[data-id= 'confirm-email-label']`).className = "card-error-input-label";
                let confMail = this.template.querySelector(`[data-id= 'ConfirmEmail']`);
                confMail.setCustomValidity('Value Required');
                confMail.reportValidity();
            }
            else if (this.ConfirmEmail != this.Email) {
                this.count--;
                // this.template.querySelector(`[data-id= 'lastName']`).className = "card-input-validinp";
                // this.template.querySelector(`[data-id= 'last-label']`).className = "card-input-validlbl"
                this.template.querySelector(`[data-id= 'ConfirmEmail']`).className = "card-error-input";
                this.template.querySelector(`[data-id= 'confirm-email-label']`).className = "card-error-input-label";
                let confMail = this.template.querySelector(`[data-id= 'ConfirmEmail']`);
                confMail.setCustomValidity('Password Not Match');
                confMail.reportValidity();
            }
            else if (this.Phone == "") {
                this.count--;
                this.template.querySelector(`[data-id= 'Email']`).className = "card-input-validinp";
                this.template.querySelector(`[data-id= 'email-label']`).className = "card-input-validlbl"
                this.template.querySelector(`[data-id= 'Phone']`).className = "card-error-input";
                this.template.querySelector(`[data-id= 'phone-label']`).className = "card-error-input-label"
            }
            else if (this.Email == '') {
                this.count--;
                emailAddress3FieldElement.setCustomValidity('Value Required');
                emailAddress3FieldElement.reportValidity();
            } else if (!check) {
                this.count--;
                emailAddress3FieldElement.setCustomValidity('Invalid Email Address');
                emailAddress3FieldElement.reportValidity();
            }
            else {
                if (this.currentSelectBtn != '') {
                    this.HandleGiveHonorOrMemory({ target: { dataset: { id: this.currentSelectBtn } } });
                }
                this.card1 = false;
                this.card2 = true;
                this.card3 = false;
                this.card4 = false;
            }

        }
        else if (this.count == 3) {
            console.log("inside count 3");
            if (skip == "skipLink") {
                console.log("Event>>>>>>", skip);
                this.card1 = false;
                this.card2 = false;
                this.card3 = true;
                this.card4 = false;
            }

            if (this.MailingPostalCode == "" || this.MailingPostalCode == null) {
                this.count--;
                this.template.querySelector(`[data-id='MailingPostalCode']`).className = "card-error-input";
                this.template.querySelector(`[data-id='MailingPostalCode-label']`).className = "card-error-input-label"
            }
            else {
                if (this.currentSelectBtn != '') {
                    this.HandleGiveHonorOrMemory({ target: { dataset: { id: this.currentSelectBtn } } });
                }
                this.card1 = false;
                this.card2 = false;
                this.card3 = true;
                this.card4 = false;
            }
        }
        else if (this.count == 4) {
            console.log("inside count 4");
            // console.log("inside count 4 === ", this.transactionCost, parseInt(this.amount));
            if (this.coverTC) {
                var tempAmt = Number(this.transactionCost) + parseInt(this.amount);
                this.totalAmount = tempAmt.toFixed(2);
            }
            else {
                var tempAmt = parseInt(this.amount);
                this.totalAmount = tempAmt.toFixed(2);
            }

            // console.log("inside count 4 === temp", tempAmt);
            console.log("this.honor : ", this.honor);
            console.log("this.Inmemory : ", this.Inmemory);
            let flag = false;
            if (this.honor || this.Inmemory) {
                console.log("inside 4.1 ");
                // console.log("inside count 4.2 ",this.memoHFName);
                // console.log("inside count 4.3");
                this.RecipientName = this.memoRFName + " " + this.memoRLName;
                this.memoName = this.memoHFName + " " + this.memoHLName;

                if (this.fileData != null && this.fileData != undefined) {
                    this.memoData();
                }
                // this.memoHFName = this.template.querySelector(`[data-id= 'memoriesHFName']`).value;
                console.log("memoHFName: ", this.memoHFName, this.memoHLName);


                let hf = this.template.querySelector(`[data-id='memoriesHFName']`);
                let hl = this.template.querySelector(`[data-id='memoriesHLName']`);
                let mail = this.template.querySelector(`[data-id='memoriesEmail']`);
                let emailAddressRep = this.template.querySelector(`[data-id= 'memoriesEmail']`);
                let checkmail = /^[a-zA-Z0-9'*+._]+@\w+([\.-]?\w+)*(\.\w{2,6})+$/.test(emailAddressRep.value);
                let confirmMail = this.template.querySelector(`[data-id='memoriesConfirmEmail']`);
                let confirmMailvalid = this.template.querySelector(`[data-id='memoriesConfirmEmail']`);
                let checkmailconfirm = /^[a-zA-Z0-9'*+._]+@\w+([\.-]?\w+)*(\.\w{2,6})+$/.test(confirmMailvalid.value);

                if (hf.value == "") {
                    console.log('FirstName : ');
                    hf.setCustomValidity('Value Required');
                    hf.reportValidity();
                    this.count--;
                    console.log('hf : ', hf);
                    flag = true;
                }
                else if (hl.value == "") {
                    console.log('LastName : ');
                    hl.setCustomValidity('Value Required');
                    hl.reportValidity();
                    this.count--;
                    flag = true;
                }
                else if (mail.value == "") {
                    console.log('Mail : ');
                    mail.setCustomValidity('Value Required');
                    mail.reportValidity();
                    this.count--;
                    flag = true;
                }
                else if (!checkmail) {
                    this.count--;
                    emailAddressRep.setCustomValidity('Invalid Email Address');
                    emailAddressRep.reportValidity();
                    flag = true;
                }
                else if (confirmMail.value == "") {
                    console.log('ConfirmMail : ');
                    confirmMail.setCustomValidity('Value Required');
                    confirmMail.reportValidity();
                    this.count--;
                    flag = true;
                }
                else if (!checkmailconfirm) {
                    this.count--;
                    confirmMailvalid.setCustomValidity('Invalid Email Address');
                    confirmMailvalid.reportValidity();
                    flag = true;
                }
                else if (confirmMail.value != mail.value) {
                    console.log('ConfirmMail : ');
                    confirmMail.setCustomValidity("Mail did'nt match");
                    confirmMail.reportValidity();
                    this.count--;
                    flag = true;
                }
            }
            // console.log("inside count 4.11");
            this.amount = this.template.querySelector(`[data-id= 'amount-input']`).value.trim();
            let amountrequired = this.template.querySelector(`[data-id= 'amount-input']`);

            //this.mailreqvalidation = this.template.querySelector(`[data-id= 'memoriesEmail']`).value.trim();
            //let emailAddress3FieldElementrep = this.template.querySelector(`[data-id= 'memoriesEmail']`);
            //let checkmemoMail = /^[a-zA-Z0-9'*+._]+@\w+([\.-]?\w+)*(\.\w{2,6})+$/.test(emailAddress3FieldElementrep.value);
            if (this.amount == '' || this.amount == 0) {
                //   console.log("inside count 4.22");
                amountrequired.setCustomValidity('Value Required');
                amountrequired.reportValidity();
                this.count--;
            }

            // else if(this.mailonchange && this.GivenHonorOrMemory && !checkmemoMail){
            //      console.log('indide mail');
            //     if (!checkmemoMail) {
            //     this.count--;
            //     emailAddress3FieldElementrep.setCustomValidity('Invalid Email Address');
            //     emailAddress3FieldElementrep.reportValidity();
            // }

            // }
            else if ((this.giveOnce || this.period != '') && this.amount != "") {
                // console.log("before call handle");
                if (flag) {
                    this.card1 = false; this.card2 = false; this.card3 = true; this.card4 = false;
                }
                else {
                    this.handleClick();
                    if (this.currentSelectBtn != '') {
                        this.HandleGiveHonorOrMemory({ target: { dataset: { id: this.currentSelectBtn } } });
                    }
                    this.card1 = false; this.card2 = false; this.card3 = false; this.card4 = true;
                }
            }
            else {
                // console.log("inside count 4.33");
                this.payMethodError = true;
                this.count--;
            }

        }
    }
    backClickHandler() {

        this.intilalizeLib();

        this.count--;
        this.creditcard = false;
        this.gpay = false;
        this.paypal = false;
        this.banktransfer = false;
        console.log('count : ', this.count);

        if (this.count == 1) {
            this.card1 = true; this.card2 = false; this.card3 = false; this.card4 = false;
        }
        else if (this.count == 2) {
            console.log('this.currentRecurringType : ', this.currentRecurringType);
            if (this.currentRecurringType != '') {
                this.handleRecurringEndtype({ target: { dataset: { id: this.currentRecurringType } } });
            }
            this.card1 = false; this.card2 = true; this.card3 = false; this.card4 = false;
        }
        else if (this.count == 3) {
            //this.honor=false;
            this.CardSendAddress = false;
            this.card1 = false; this.card2 = false; this.card3 = true; this.card4 = false;
            if (this.giveOnce == true) {
                setTimeout(() => {
                    this.template.querySelector("[data-id='giveonce']").value = 'GiveOnce';
                }, 200);
            }
            else if (this.recurring == true) {
                if (this.period == 'Monthly') {
                    setTimeout(() => {
                        this.template.querySelector("[data-id='monthly']").value = 'Monthly';
                    }, 200);
                }
                else if (this.period == 'Quarterly') {
                    setTimeout(() => {
                        this.template.querySelector("[data-id='quaterly']").value = 'Quaterly';
                    }, 200);
                }
                else if (this.period == 'Semiannual') {
                    setTimeout(() => {
                        this.template.querySelector("[data-id='semiAnnual']").value = 'Semi Annual';
                    }, 200);
                }
                else if (this.period == 'Annual') {
                    setTimeout(() => {
                        this.template.querySelector("[data-id='annual']").className = 'Annual';
                    }, 200);
                }
            }
            console.log('currentSelectBtn1 : ', this.currentSelectBtn);
            this.HandleGiveHonorOrMemory({ target: { dataset: { id: this.currentSelectBtn } } });
            console.log('currentSelectBtn2 : ', this.currentSelectBtn);
            console.log('this.currentRecurringType : ', this.currentRecurringType);
            setTimeout(() => {
                this.template.querySelectorAll('.amt-sec').forEach(ele => ele.className = "amount-div amount-section-margin amt-sec");
                this.template.querySelector("[data-id='" + this.amount + "']").className = 'amount-div amount-section-margin selected-btn amt-sec';
                this.template.querySelector("[data-id='amount-input']").value = this.amount;
            }, 200);
            setTimeout(() => {
                if (this.currentRecurringType != '') {
                    this.handleRecurringEndtype({ target: { dataset: { id: this.currentRecurringType } } });
                }
            }, 500);
        }
        else if (this.count == 4) {
            this.card1 = false; this.card2 = false; this.card3 = false; this.card4 = true;

        }
    }

    @api
    donateClickHandler() {
        console.log('inside form comp method');
        this.template.querySelector(`[data-id='form-modal']`).style.display = "block";
        console.log('inside form comp method visible');
    }

    off() {
        this.template.querySelector(`[data-id='form-modal']`).style.display = "none";
    }
    // offpay() {
    //     this.template.querySelector(`[data-id='pay-modal']`).style.display = "none";
    //     window.location.reload();
    // }


    // for show address field 
    ShowCardSendAddress() {
        this.CardSendAddress = this.CardSendAddress ? false : true;
    }
    // Honor name Show
    ShowGiveHonorNameField() {
        if (this.GivenHonorOrMemory == false) {
            this.GivenHonorOrMemory = true;
            this.honor = true;
            setTimeout(() => {
                this.template.querySelector("[data-id='HonorIn']").className = 'amount-div amount-div-full-width selected-btn';
            }, 200);
        }
        else {
            this.GivenHonorOrMemory = false;
            this.honor = false;
            this.Inmemory = false;
            setTimeout(() => {
                this.template.querySelector("[data-id='MemoryIn']").className = 'amount-div';
            }, 200);
        }
    }


    // Payment Method
    creditcard = false;
    gpay = false;
    paypal = false;
    banktransfer = false;
    paymentMethodHandler(evt) {
        let pay = evt.currentTarget.dataset.id;
        console.log("element>>>>>>>>>", pay);
        if (pay == 'cc') {
            //count++;
            this.creditcard = true;

            this.gpay = false;
            this.paypal = false;
            this.banktransfer = false;
            this.card1 = false;
            this.card2 = false;
            this.card3 = false;
            this.card4 = false;
            // this.off();
            console.log('this.OppId ', this.OppId);
            this.closecancel = false;
            this.flowcall = true;
            this.paid = true;
            // this.template.querySelector(`[data-id='cc']`).className = 'payment-options-btn selected-btn';
            // this.template.querySelector(`[data-id='pp']`).className = 'payment-options-btn '; 
            // this.template.querySelector(`[data-id='gp']`).className = 'payment-options-btn '; 
            // this.template.querySelector(`[data-id='bt']`).className = 'payment-options-btn ';  
        }
        else if (pay == 'pp') {
            this.creditcard = false;
            this.gpay = false;
            this.paypal = true;
            this.banktransfer = false;
            this.card1 = false;
            this.card2 = false;
            this.card3 = false;
            this.card4 = false;
            this.off();
            // this.template.querySelector(`[data-id='cc']`).className = 'payment-options-btn ';
            // this.template.querySelector(`[data-id='pp']`).className = 'payment-options-btn selected-btn'; 
            // this.template.querySelector(`[data-id='gp']`).className = 'payment-options-btn '; 
            // this.template.querySelector(`[data-id='bt']`).className = 'payment-options-btn '; 
        }
        else if (pay == 'gp') {
            this.creditcard = false;
            this.gpay = true;
            this.paypal = false;
            this.banktransfer = false;
            this.card1 = false;
            this.card2 = false;
            this.card3 = false;
            this.card4 = false;
            this.off();
            // this.template.querySelector(`[data-id='cc']`).className = 'payment-options-btn ';
            // this.template.querySelector(`[data-id='pp']`).className = 'payment-options-btn '; 
            // this.template.querySelector(`[data-id='gp']`).className = 'payment-options-btn selected-btn'; 
            // this.template.querySelector(`[data-id='bt']`).className = 'payment-options-btn '; 
        }
        else if (pay == 'bt') {
            //count++;
            this.creditcard = false;
            this.gpay = false;
            this.paypal = false;
            this.banktransfer = true;
            this.card1 = false;
            this.card2 = false;
            this.card3 = false;
            this.card4 = false;
            this.off();
            console.log('this.OppId ', this.OppId);
            this.flowcall = true;
            this.paid = true;
            // this.template.querySelector(`[data-id='cc']`).className = 'payment-options-btn ';
            // this.template.querySelector(`[data-id='pp']`).className = 'payment-options-btn '; 
            // this.template.querySelector(`[data-id='gp']`).className = 'payment-options-btn '; 
            // this.template.querySelector(`[data-id='bt']`).className = 'payment-options-btn selected-btn'; 
        }
    }

    AddTransactionCost(evt) {
        // if(this.coverTC == true){
        //     this.coverTC = false;
        //     var tempAmt  = parseInt(this.amount); 
        //     this.totalAmount = tempAmt.toFixed(2);
        // }
        // else
        // {
        //     this.coverTC = true;
        //     var tempAmt = Number(this.transactionCost) + parseInt(this.amount);
        //     this.totalAmount = tempAmt.toFixed(2);
        // }
    }
    handleFlowStatusChange(event) {
        // console.logstatus("flow status", event.detail.status);
        // if (event.detail.status === "FINISHED") {
        // 	this.dispatchEvent(
        // 		new ShowToastEvent({
        // 			title: "Success",
        // 			message: "Flow Finished Successfully",
        // 			variant: "success",
        // 		})
        // 	);
        // }
    }

    handleRecurringEndtype(event) {
        this.currentRecurringType = event.target.dataset.id;
        try {
            console.log('event : ', event.target.dataset.id);
            let evt = event.target.dataset.id;
            setTimeout((event) => {
                console.log('eventt : ', evt);
                if (evt === 'by-count') {

                    this.template.querySelector(`[data-id='by-count']`).className = 'amount-div amount-section-margin selected-btn amt-sec';
                    this.template.querySelector(`[data-id='by-date']`).className = 'amount-div amount-section-margin amt-sec';
                    this.template.querySelector(`[data-id='unending']`).className = 'amount-div amount-section-margin amt-sec';
                    this.stopcount = true;
                    this.stopDate = false;
                    this.stopunending = false;
                    this.showRecuuringEndCount = true;
                    this.showRecuuringEndDate = false;
                }
                else if (evt === 'by-date') {

                    this.template.querySelector(`[data-id='by-count']`).className = 'amount-div amount-section-margin amt-sec';
                    this.template.querySelector(`[data-id='by-date']`).className = 'amount-div amount-section-margin selected-btn amt-sec';
                    this.template.querySelector(`[data-id='unending']`).className = 'amount-div amount-section-margin amt-sec';
                    this.stopcount = false;
                    this.stopDate = true;
                    this.stopunending = false;
                    this.showRecuuringEndCount = false;
                    this.showRecuuringEndDate = true;
                }
                else if (evt === 'unending') {
                    console.log('event2 : ', evt);
                    try {
                        this.template.querySelector(`[data-id='by-count']`).className = 'amount-div amount-section-margin amt-sec';
                        this.template.querySelector(`[data-id='by-date']`).className = 'amount-div amount-section-margin amt-sec';
                        this.template.querySelector(`[data-id='unending']`).className = 'amount-div amount-section-margin selected-btn amt-sec';
                        this.stopcount = false;
                        this.stopDate = false;
                        this.stopunending = true;
                        this.showRecuuringEndCount = false;
                        this.showRecuuringEndDate = false;
                    }
                    catch (error) {
                        console.log('error : ', error, error.message, JSON.stringify(error));
                    }
                    console.log('event3 : ');
                }

            }, 0)
        }
        catch (error) {
            console.log('error : ', error.message);
        }

    }

    get CalculatedTransactionCharge() {
        if (this.amount == undefined || this.amount == '')
            return "";
        this.transactionCost = ((Number(this.amount) * 0.029) + 0.30).toFixed(2);
        return this.transactionCost;
    }
    async sendmail() {
        console.log('before mail inside');
        await sendingEmail({ oppId: this.OppId })
            .then((result) => {
                console.log('result mail ', result);
                window.location.reload();
            })
            .catch((error) => {
                this.error = error;
                console.log('this.errorMessage ', this.error);
                window.location.reload();
            });
    }
    async offpay() {
        this.flowcall = false;
        await CheckPaymentStatus({ oppId: this.OppId })
            .then((result) => {
                console.log('result pay inside ', result);
                if (result == 'Approved') {
                    console.log('result inside if', result);
                    console.log('before mail');
                    //this.sendmail();
                    window.location.reload();
                }
                else if (result == 'Failed') {
                    console.log('result inside else if', result);
                    this.showErrorToastpayment();
                    this.closecancel = true;
                    this.donateClickHandler();
                    this.card1 = false; this.card2 = false; this.card3 = false; this.card4 = true;
                }
                else if (result == 'Error') {
                    console.log('result inside else if 2', result);
                    this.closecancel = true;
                    this.showErrorToast();
                    this.donateClickHandler();
                    this.card1 = false; this.card2 = false; this.card3 = false; this.card4 = true;
                }
            })
            .catch((error) => {
                this.error = error;
                console.log('this.errorMessage ', this.errorMessage);

            });
    }
    showErrorToast() {
        const evt = new ShowToastEvent({
            title: 'Oops! there is a issue please try again.',
            message: 'please try again',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }
    showErrorToastpayment() {
        const evt = new ShowToastEvent({
            title: 'Your payment was not successful',
            message: 'please try again',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    ShowIncludeTransactionChargeCheckbox(event) {
        console.log("this.amount : ", this.amount);
        console.log("this.checked : ", event.target.checked);

        this.IncludeTransactionChargeCheckbox = event.target.checked;

        if (this.IncludeTransactionChargeCheckbox) {
            this.transactionCost = ((Number(this.amount) * 0.029) + 0.30).toFixed(2);
            this.coverTC = true;
        }
        else if (!this.IncludeTransactionChargeCheckbox) {
            this.transactionCost = Number(0);
            this.coverTC = false;
        }

        this.totalAmount = Number(this.transactionCost) + parseFloat(this.amount);
        console.log("this.totalAmount  : ", this.totalAmount);
    }
}