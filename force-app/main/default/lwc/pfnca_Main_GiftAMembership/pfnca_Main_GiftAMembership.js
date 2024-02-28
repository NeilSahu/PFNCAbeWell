import { LightningElement, track, api } from 'lwc';
const DEFAULT_STEP_CSS_CLASS = 'step';
const ACTIVE_STEP_CSS_CLASS = 'step step-active';
import Imageicon from '@salesforce/resourceUrl/WIPlogo';
import VisaLogo from '@salesforce/resourceUrl/VisaLogo';
import creategiftMemberShip from '@salesforce/apex/BWPS_GiftmemberShipHelper.creategiftMemberShip';
import registerUser from '@salesforce/apex/BWPS_GiftmemberShipHelper.registerUser';
import forgotPassword from '@salesforce/apex/CommunityAuthController.forgotPassword';
import CheckPaymentStatus from '@salesforce/apex/CommunityAuthController.CheckPaymentStatus';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import heroImage from '@salesforce/resourceUrl/headerHeroImages';

import intTelInput from '@salesforce/resourceUrl/intTelInput';
import imask from '@salesforce/resourceUrl/imask';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
export default class Pfnca_Main_GiftAMembership extends LightningElement {

    @api OppId;
    @api OppIds;
    //@api GatewayId = 'a173C000002vIIv';
    @track showSpinner = false;
    flowcall = false;
    donationcreated = true;
    VisaLogo = VisaLogo;
    GiftSelected = '';
    DonationSelected = '';
    FName = '';
    lName = '';
    emailAddress = '';
    confirmemailAddress = '';
    phoneNumber = '';
    showFormStep2 = '';
    Street = '';
    city = '';
    state = '';
    postalCode = '';
    country = '';

    FName3 = '';
    lName3 = '';
    emailAddress3 = '';
    confirmemailAddress3 = '';
    phoneNumber3 = '';
    Street3 = '';
    city3 = '';
    state3 = '';
    postalCode3 = '';
    country3 = '';
    previousAvailable = false;
    @track giftonce = true;
    @track giftfrequency = false;
    @track donationonce = true;
    @track donationyearly = false;
    @track totalpayAmount = 0;
    heroImage = heroImage + '/headerGAM.png';

    img_InfoBox = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='Info' width='48' height='48' viewBox='0 0 48 48'%3E%3Cdefs%3E%3CclipPath id='clip-path'%3E%3Crect id='Rectangle_1294' data-name='Rectangle 1294' width='20' height='19.948' fill='%23666667'/%3E%3C/clipPath%3E%3C/defs%3E%3Crect id='Rectangle_1236' data-name='Rectangle 1236' width='48' height='48' fill='none'/%3E%3Cg id='Group_8168' data-name='Group 8168' transform='translate(14 14)'%3E%3Cg id='Group_8167' data-name='Group 8167' clip-path='url(%23clip-path)'%3E%3Cpath id='Path_11244' data-name='Path 11244' d='M20,9.993a10.047,10.047,0,0,1-8.361,9.816A9.93,9.93,0,0,1,5.4,18.837a.478.478,0,0,0-.321-.025q-1.772.519-3.538,1.058A1.125,1.125,0,0,1,.085,18.4q.537-1.756,1.052-3.518a.507.507,0,0,0-.03-.34,9.973,9.973,0,1,1,18.69-6.3c.1.581.136,1.172.2,1.759m-8.917,3.3v-.266q0-1.99,0-3.98a2.473,2.473,0,0,0-.021-.345,1.078,1.078,0,0,0-1.031-.934c-.411-.011-.822-.013-1.232,0a1.093,1.093,0,0,0-1,1.369,1.13,1.13,0,0,0,1.068.853v1.515c0,.944,0,1.889,0,2.833a1.11,1.11,0,0,0,1.181,1.177c.346,0,.693.018,1.037-.007a1.435,1.435,0,0,0,.571-.163,1.073,1.073,0,0,0,.512-1.166,1.14,1.14,0,0,0-1.081-.887M9.973,6.649a1.1,1.1,0,1,0-1.11-1.113,1.1,1.1,0,0,0,1.11,1.113' transform='translate(0 0)' fill='%23666667'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

    prev = Imageicon + '/WIPlogo/Prev.svg';
    next = Imageicon + '/WIPlogo/Next.svg';

    visa = Imageicon + '/WIPlogo/visa.svg';
    paypal = Imageicon + '/WIPlogo/paypal.png';
    hero = Imageicon + '/WIPlogo/loginHero.png';

    step1css = ACTIVE_STEP_CSS_CLASS;
    step2css = DEFAULT_STEP_CSS_CLASS;
    step3css = DEFAULT_STEP_CSS_CLASS;
    step4css = DEFAULT_STEP_CSS_CLASS;

    showFormStep1 = true;
    showFormStep2 = false;
    showFormStep3 = false;
    showFormStep4 = false;

    amountValue =  50.00;
    donationAmountValue = 0;

    nextStyle = `background-image: url(${this.next});background-position: center;width:5rem;height:5rem`;
    prevStyle = `background-image: url(${this.prev});background-position: center;width:5rem;height:5rem`;

    stepcounter = 0;
    flowApiName = "PaymentAccept";

    @track inputElem;
    @track iti;
    @track mask;


    intializeLib(inputId) {
        loadStyle(this, intTelInput + '/democss.css')
            .then(() => {
            });
        loadStyle(this, intTelInput + '/intlTelInputcss.css')
            .then(() => {
            });

        Promise.all([loadScript(this, intTelInput + '/utilsjs.js'), loadScript(this, imask), loadScript(this, intTelInput + '/intlTelInputjs.js')])
            .then(() => {
                //this.inputElem = this.template.querySelector("[data-id=phoneNumber]");
                //this.inputElem = input;
                this.inputElem = this.template.querySelector(`[data-id=${inputId}]`);
                this.iti = window.intlTelInput(this.inputElem, {

                    // utilsScript: utils,
                    preferredCountries: ['US', 'IN'],
                    separateDialCode: true,
                    utilsScript: intTelInput + '/utilsjs.js',
                });

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
    }

    get flowInputVariables() {
        console.log('this.OppId get ', this.OppId);
        return [
            {
                name: "DonorId",
                type: "String",
                value: this.OppId,
            }
        ];
    }

    get showSubmit() {
        if (this.stepcounter === 2)
            return true;
        else
            return false
    }

    get totalAmount() {
        // return this.donationAmountValue + this.amountValue;
        return Number(this.donationAmountValue) + Number(this.amountValue);
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

    handleAmount(event) {
        const id = event.target.dataset.id;

        if (id == 'donationAmount') {
            if (event.target.value == '') {
                this.donationAmountValue = 0;
                this.donationAmountValue + this.amountValue;
            }
            else {
                if (event.target.valueAsNumber < 0) {
                    event.target.value = event.target.valueAsNumber * (-1);
                }
                this.donationAmountValue = event.target.valueAsNumber;
                this.donationAmountValue + this.amountValue;
            }
            console.log('change', this.donationAmountValue + this.amountValue);
        }
        else if (id == 'amount') {
            if (event.target.value == '') {
                this.amountValue = 0;
                this.donationAmountValue + this.amountValue;
            }
            else {
                if (event.target.valueAsNumber < 0) {
                    event.target.value = event.target.valueAsNumber * (-1);
                }
                this.amountValue = event.target.valueAsNumber;
                this.donationAmountValue + this.amountValue;
            }
            console.log('change', this.donationAmountValue + this.amountValue);
        }
    }

    handletotal(event) {
        const id = event.target.dataset.id;

        if (id == 'donationAmount') {
            if (event.target.value == '') {
                this.donationAmountValue = 0;
                this.donationAmountValue + this.amountValue;

            }
            else {
                this.donationAmountValue = event.target.valueAsNumber;
                this.donationAmountValue + this.amountValue;
            }
        }
        else if (id == 'amount') {
            if (event.target.value == '') {
                this.amountValue = 0;
                this.donationAmountValue + this.amountValue;
            }
            else {
                this.amountValue = event.target.valueAsNumber;
                this.donationAmountValue + this.amountValue;
            }
        }
    }
    handlepaytype(event) {
        const id = event.target.dataset.id;

        if (id == 'giftone') {
            this.giftonce = true;
            this.giftfrequency = false;
        }
        else if (id == 'giftyear') {
            this.giftfrequency = true;
            this.giftonce = false;
        }
    }
    hanldedonationpaytype(event) {
        const id = event.target.dataset.id;

        console.log(id);
        if (id == 'donationone') {
            this.donationonce = true;
            this.donationyearly = false;
        }
        else if (id == 'donationyear') {
            this.donationyearly = true;
            this.donationonce = false;
        }

        console.log(this.donationonce);
        console.log(this.donationyearly);
    }
    temp = {};
    async handleSubmit(event) {
        event.preventDefault();
        try {
            this.previousAvailable = true;

            this.FName3 = this.template.querySelector(`[data-id= 'FName3']`).value.trim();
            let FName3FieldElement = this.template.querySelector(`[data-id= 'FName3']`);

            this.lName3 = this.template.querySelector(`[data-id= 'lName3']`).value.trim();
            let lName3FieldElement = this.template.querySelector(`[data-id= 'lName3']`);

            this.emailAddress3 = this.template.querySelector(`[data-id= 'emailAddress3']`).value.trim();
            let emailAddress3FieldElement = this.template.querySelector(`[data-id= 'emailAddress3']`);

            this.confirmemailAddress3 = this.template.querySelector(`[data-id= 'confirmemailAddress3']`).value.trim();
            let comfirmEmailAddress3FieldElement = this.template.querySelector(`[data-id= 'confirmemailAddress3']`);

            this.phoneNumber3 = this.template.querySelector(`[data-id= 'phoneNumber3']`).value.trim();
            let phoneNumber3FieldElement = this.template.querySelector(`[data-id= 'phoneNumber3']`);

            this.Street3 = this.template.querySelector(`[data-id= 'Street3']`).value.trim();
            let street3FieldElement = this.template.querySelector(`[data-id= 'Street3']`);

            console.log("Street3 ", this.Street3);
            this.city3 = this.template.querySelector(`[data-id= 'city3']`).value.trim();
            let city3FieldElement = this.template.querySelector(`[data-id= 'city3']`);

            this.state3 = this.template.querySelector(`[data-id= 'state3']`).value.trim();
            let state3FieldElement = this.template.querySelector(`[data-id= 'state3']`);

            this.postalCode3 = this.template.querySelector(`[data-id= 'postalCode3']`).value.trim();
            let postalCode3FiedlElement = this.template.querySelector(`[data-id= 'postalCode3']`);

            this.country3 = this.template.querySelector(`[data-id= 'country3']`).value.trim();
            let country3FieldElement = this.template.querySelector(`[data-id= 'country3']`);

            let check = /^[a-zA-Z0-9'*+._]+@\w+([\.-]?\w+)*(\.\w{2,6})+$/.test(emailAddress3FieldElement.value);

            console.log('this.FName3 ', this.FName3);
            console.log('this.lName3 ', this.lName3);
            console.log('this.emailAddress3 ', this.emailAddress3);
            console.log('this.confirmemailAddress3 ', this.confirmemailAddress3);
            console.log('this.phoneNumber3 ', this.phoneNumber3);
            console.log('this.Street3 ', this.Street3);
            console.log('this.city3 ', this.city3);
            console.log('this.state3 ', this.state3);
            console.log('this.postalCode3 ', this.postalCode3);
            console.log('this.country3 ', this.country3);


            if (this.FName3 == '') {
                FName3FieldElement.setCustomValidity('Value Required');
                FName3FieldElement.reportValidity();
                this.stepcounter == 1;
                this.scrollWindow(600);
            } else if (this.lName3 == '') {
                lName3FieldElement.setCustomValidity('Value Required');
                lName3FieldElement.reportValidity();
                this.scrollWindow(800);
            } else if (this.emailAddress3 == '') {
                emailAddress3FieldElement.setCustomValidity('Value Required');
                emailAddress3FieldElement.reportValidity();
                this.scrollWindow(1000);
            } else if (!check) {
                emailAddress3FieldElement.setCustomValidity('Invalid Email Address');
                emailAddress3FieldElement.reportValidity();
                this.scrollWindow(1000);
            } else if (this.confirmemailAddress3 == '') {
                comfirmEmailAddress3FieldElement.setCustomValidity('Value Required');
                comfirmEmailAddress3FieldElement.reportValidity();
                this.scrollWindow(1000);
            } else if (this.emailAddress3 != this.confirmemailAddress3) {
                comfirmEmailAddress3FieldElement.setCustomValidity("Email did'nt match");
                comfirmEmailAddress3FieldElement.reportValidity();
                this.scrollWindow(1000);
            } else if (this.phoneNumber3 == '') {
                phoneNumber3FieldElement.setCustomValidity('Value Required');
                phoneNumber3FieldElement.reportValidity();
                this.scrollWindow(1100);
            } else if (this.Street3 == '') {
                street3FieldElement.setCustomValidity('Value Required');
                street3FieldElement.reportValidity();
                this.scrollWindow(1300);
            } else if (this.city3 == '') {
                city3FieldElement.setCustomValidity('Value Required');
                city3FieldElement.reportValidity();
                this.scrollWindow(1500);
            } else if (this.state3 == '') {
                state3FieldElement.setCustomValidity('Value Required');
                state3FieldElement.reportValidity();
                this.scrollWindow(1600);
            } else if (this.postalCode3 == '') {
                postalCode3FiedlElement.setCustomValidity('Value Required');
                postalCode3FiedlElement.reportValidity();
                this.scrollWindow(1600);
            } else if (this.country3 == '') {
                country3FieldElement.setCustomValidity('Value Required');
                country3FieldElement.reportValidity();
                this.scrollWindow(1700);
            } else {
                // this.stepcounter += 1;
                // this.step4css = ACTIVE_STEP_CSS_CLASS;
                // this.showFormStep1 = false;
                // this.showFormStep2 = false;
                // this.showFormStep3 = false;
                // this.showFormStep4 = true;
                // this.scrollWindow(600);
                if (this.giftonce == true) {
                    this.GiftSelected = 'Once';
                }
                if (this.giftfrequency == true) {
                    this.GiftSelected = 'Yearly';
                }
                if (this.donationonce == true) {
                    this.DonationSelected = 'Once';
                }
                if (this.donationyearly == true) {
                    this.DonationSelected = 'Yearly';
                }
                this.temp = {
                    "donorinfo": {
                        "Fname": this.FName,
                        "LName": this.lName,
                        "Email": this.emailAddress,
                        "phoneNumber": this.phoneNumber,
                        "Street": this.Street,
                        "city": this.city,
                        "state": this.state,
                        "postalCode": this.postalCode,
                        "country": this.country,
                        "DonationType": this.DonationSelected,
                        "DonationAmount": Number(this.donationAmountValue) + Number(this.amountValue),
                        "donateAmount": this.donationAmountValue,
                    },
                    "giftinfo": {
                        "Fname": this.FName3,
                        "LName": this.lName3,
                        "Email": this.emailAddress3,
                        "phoneNumber": this.phoneNumber3,
                        "Street": this.Street3,
                        "city": this.city3,
                        "state": this.state3,
                        "postalCode": this.postalCode3,
                        "country": this.country3,
                        "GiftType": this.GiftSelected,
                        "GiftAmount": this.amountValue,
                    }
                }
                this.totalpayAmount = Number(this.donationAmountValue) + Number(this.amountValue);
                console.log("temp : ", JSON.stringify(this.temp));
                this.donationcreated = false;
                await creategiftMemberShip({ giftDetails: this.temp, Donationpay: this.totalpayAmount })
                    .then(result => {
                        console.log('Result ', result);
                        if (result == 'Error' || result == '' || result == null) {
                            this.showErrorToast();
                        }
                        else {
                            let resultArray = result.split(',');
                            this.OppId = resultArray[0];
                            this.OppIds = resultArray[0];
                            let accId = resultArray[1];
                            let conId = resultArray[2];
                            console.log('this.OppId ', this.OppId);
                            console.log('this.flowcall ', this.flowcall);
                            this.updateProfile(accId, conId);
                            this.donationcreated = true;
                            //this.ShowToast();
                            this.flowcall = true;
                        }
                    }).catch(err => {
                        console.log('Error ', err);
                        console.log('Error ', JSON.stringify(err.message));
                        this.showErrorToast();
                    });
            }
        }
        catch (error) {
            console.log('error : ', error, error.message, JSON.stringify(error));
        }
    }

    async updateProfile(accId, conId) {
        console.log('update profile ', this.emailAddress3);
        if (this.emailAddress3) {
            console.log('insde update user ');
            let password = 'Parkinson&1User';
            await registerUser({ firstName: this.FName3, lastName: this.lName3, email: this.emailAddress3, password: password, confirmPassword: password, conId: conId, accId: accId })
                .then((result) => {
                    console.log('result update profile ', result);
                    if (result == null && result == undefined) {
                        this.showErrorToast();
                    }
                    else {
                        forgotPassword({ usernames: this.emailAddress3 })
                            .then(result => {
                                console.log('Resultt>> ', result);
                            }).catch(e => {
                                console.log('ERRRR>> ', e);
                            })
                    }
                })
                .catch((error) => {
                    this.error = error;
                    this.errorCheck = true;
                    this.errorMessage = error.body.message;
                    console.log('this.errorMessage ', this.errorMessage);
                    this.showErrorToast();
                });

        }
    }

    async offpays() {
        this.flowcall = false;
        // location.reload();
        console.log('this.OppIds offpay', this.OppIds);
        this.showSpinner = true;
        await CheckPaymentStatus({ oppId: this.OppIds })
            .then((result) => {
                console.log('result pay inside ', result);
                this.showSpinner = false;
                if (result == 'Approved') {
                    console.log('result inside if', result);
                    //this.updateProfile();
                    window.location.reload();
                }
                else if (result == 'Failed') {
                    console.log('result inside else if', result);
                    this.showErrorToastpayment();


                }
                else if (result == 'Error') {
                    console.log('result inside else if 2', result);
                    this.showErrorToast();
                }
            })
            .catch((error) => {
                this.error = error;
                console.log('this.errorMessage ', this.errorMessage);

            });
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
    ShowToast() {
        const event = new ShowToastEvent({
            title: 'Thank you for registeration',
            message: 'Our team will get back to you soon :)',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
    showErrorToast() {
        const evt = new ShowToastEvent({
            title: 'Some unexpected error occured',
            message: 'please check your details again',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }


    nextPreviousHandler(event) {

        //this.intializeLib();

        if (this.stepcounter == 0) {

             this.intializeLib("phoneNumber");


        } else if (this.stepcounter == 1) {
            this.intializeLib("phoneNumber3");
        }


        const nav = event.target.dataset.nav;
        if (nav == "previous") {

            if (this.stepcounter == 1) {

                this.stepcounter -= 1;

                this.step2css = DEFAULT_STEP_CSS_CLASS;

                this.showFormStep1 = true;
                this.showFormStep2 = false;
                this.showFormStep3 = false;
                this.showFormStep4 = false;
                this.previousAvailable = false;
                this.scrollWindow(600);
            }
            else if (this.stepcounter == 2) {

                this.stepcounter -= 1;

                this.step3css = DEFAULT_STEP_CSS_CLASS;

                this.showFormStep1 = false;
                this.showFormStep2 = true;
                this.showFormStep3 = false;
                this.showFormStep4 = false;
                this.scrollWindow(600);
            }
            // else if (this.stepcounter == 3) {

            //     this.stepcounter -= 1;

            //     this.step4css = DEFAULT_STEP_CSS_CLASS;
            //     this.showFormStep1 = false;
            //     this.showFormStep2 = false;
            //     this.showFormStep3 = true;
            //     this.showFormStep4 = false;
            // }
        }

        else if (nav == "next") {

            if (this.stepcounter == 0) {
                var giftsingle;
                var giftyearly;
                var donationsingle;
                var donationyearly;
                //giftsingle = this.template.querySelector(`[data-id= 'giftone']`).checked;
                //giftyearly = this.template.querySelector(`[data-id= 'giftyear']`).checked;
                this.amountValue = this.template.querySelector(`[data-id= 'amount']`).value.trim();
                let amountFieldElement = this.template.querySelector(`[data-id= 'amount']`);
                donationsingle = this.template.querySelector(`[data-id= 'donationone']`).checked;
                donationyearly = this.template.querySelector(`[data-id= 'donationyear']`).checked;
                this.donationAmountValue = this.template.querySelector(`[data-id= 'donationAmount']`).value.trim();
                let donationAmountFieldElement = this.template.querySelector(`[data-id= 'donationAmount']`);
                console.log('giftsingle ', giftsingle);
                console.log('giftyearly ', giftyearly);
                console.log('this.amountValue ', this.amountValue);
                console.log('donationsingle ', donationsingle);
                console.log('donationyearly ', donationyearly);
                console.log('this.donationAmountValue ', this.donationAmountValue);

                if (this.amountValue == '') {
                    amountFieldElement.setCustomValidity('Value Required');
                    amountFieldElement.reportValidity();
                    this.stepcounter == 0;
                    this.scrollWindow(700);
                }
                else if (this.amountValue <= 0) {
                    amountFieldElement.setCustomValidity('Amount should be greater than $0');
                    amountFieldElement.reportValidity();
                    this.scrollWindow(700);
                    this.stepcounter == 0;
                } else if (this.donationAmountValue == '') {
                    donationAmountFieldElement.setCustomValidity('Value Required');
                    donationAmountFieldElement.reportValidity();
                    this.scrollWindow(1100);
                } else {
                    this.stepcounter += 1;
                    this.step2css = ACTIVE_STEP_CSS_CLASS;
                    this.previousAvailable = true;

                    this.showFormStep1 = false;
                    this.showFormStep2 = true;
                    this.showFormStep3 = false;
                    this.showFormStep4 = false;
                    this.scrollWindow(600);
                }
            }

            else if (this.stepcounter == 1) {
                this.previousAvailable = true;
                //this.stepcounter += 1;

                //this.step3css = ACTIVE_STEP_CSS_CLASS;

                this.FName = this.template.querySelector(`[data-id= 'FName']`).value.trim();
                console.log('this.FName ', this.FName);
                let fNameFieldElement = this.template.querySelector(`[data-id= 'FName']`);

                this.lName = this.template.querySelector(`[data-id= 'lName']`).value.trim();
                let lNameFieldElement = this.template.querySelector(`[data-id= 'lName']`);

                this.emailAddress = this.template.querySelector(`[data-id= 'emailAddress']`).value.trim();
                let emailAddressFieldElement = this.template.querySelector(`[data-id= 'emailAddress']`);

                this.confirmemailAddress = this.template.querySelector(`[data-id= 'confirmemailAddress']`).value.trim();
                let confirmEmailAddressFieldElement = this.template.querySelector(`[data-id= 'confirmemailAddress']`);


                this.phoneNumber = this.template.querySelector(`[data-id= 'phoneNumber']`).value.trim();
                let phoneNumberFieldElement = this.template.querySelector(`[data-id= 'phoneNumber']`);

                this.Street = this.template.querySelector(`[data-id= 'Street']`).value.trim();
                let streetFieldElement = this.template.querySelector(`[data-id= 'Street']`);

                this.city = this.template.querySelector(`[data-id= 'city']`).value.trim();
                let cityFieldElement = this.template.querySelector(`[data-id= 'city']`);

                this.state = this.template.querySelector(`[data-id= 'state']`).value.trim();
                let stateFieldElement = this.template.querySelector(`[data-id= 'state']`);

                this.postalCode = this.template.querySelector(`[data-id= 'postalCode']`).value.trim();
                let postalCodeFieldElement = this.template.querySelector(`[data-id= 'postalCode']`);

                this.country = this.template.querySelector(`[data-id= 'country']`).value.trim();
                let countyFieldElement = this.template.querySelector(`[data-id= 'country']`);

                // let check = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(emailAddressFieldElement.value);
                let check = /^[a-zA-Z0-9'*+._]+@\w+([\.-]?\w+)*(\.\w{2,6})+$/.test(emailAddressFieldElement.value);

                if (this.FName == '') {
                    console.log('test22 ', this.FName);
                    fNameFieldElement.setCustomValidity('Value Required');
                    fNameFieldElement.reportValidity();
                    this.stepcounter == 1;
                    this.scrollWindow(600);
                } else if (this.lName == '') {
                    lNameFieldElement.setCustomValidity('Value Required');
                    lNameFieldElement.reportValidity();
                    this.scrollWindow(800);
                } else if (this.emailAddress == '') {
                    emailAddressFieldElement.setCustomValidity('Value Required');
                    emailAddressFieldElement.reportValidity();
                    this.scrollWindow(1000);
                } else if (!check) {
                    emailAddressFieldElement.setCustomValidity('Invalid Email Address');
                    emailAddressFieldElement.reportValidity();
                    this.scrollWindow(1000);
                } else if (this.confirmemailAddress == '') {
                    confirmEmailAddressFieldElement.setCustomValidity('Value Required');
                    confirmEmailAddressFieldElement.reportValidity();
                    this.scrollWindow(1000);
                } else if (this.confirmemailAddress != this.emailAddress) {
                    confirmEmailAddressFieldElement.setCustomValidity("Email did'nt match");
                    confirmEmailAddressFieldElement.reportValidity();
                    this.scrollWindow(1000);
                } else if (this.phoneNumber == '') {
                    phoneNumberFieldElement.setCustomValidity('Value Required');
                    phoneNumberFieldElement.reportValidity();
                    this.scrollWindow(1100);
                } else if (this.Street == '') {
                    streetFieldElement.setCustomValidity('Value Required');
                    streetFieldElement.reportValidity();
                    this.scrollWindow(1300);
                } else if (this.city == '') {
                    cityFieldElement.setCustomValidity('Value Required');
                    cityFieldElement.reportValidity();
                    this.scrollWindow(1500);
                } else if (this.state == '') {
                    stateFieldElement.setCustomValidity('Value Required');
                    stateFieldElement.reportValidity();
                    this.scrollWindow(1600);
                } else if (this.postalCode == '') {
                    postalCodeFieldElement.setCustomValidity('Value Required');
                    postalCodeFieldElement.reportValidity();
                    this.scrollWindow(1600);
                } else if (this.postalCode.length < 4) {
                    postalCodeFieldElement.setCustomValidity('Invalid Value');
                    postalCodeFieldElement.reportValidity();
                    this.scrollWindow(1600);
                } else if (this.country == '') {
                    countyFieldElement.setCustomValidity('Value Required');
                    countyFieldElement.reportValidity();
                    this.scrollWindow(1700);
                } else {
                    this.stepcounter += 1;
                    this.step3css = ACTIVE_STEP_CSS_CLASS;
                    console.log('this.FName1 ', this.FName);
                    console.log('this.lName ', this.lName);
                    console.log('this.emailAddress ', this.emailAddress);
                    console.log('this.phoneNumber ', this.phoneNumber);
                    console.log('this.Street ', this.Street);
                    console.log('this.city ', this.city);
                    console.log('this.state ', this.state);
                    console.log('this.postalCode ', this.postalCode);
                    console.log('this.country ', this.country);
                    this.showFormStep1 = false;
                    this.showFormStep2 = false;
                    this.showFormStep3 = true;
                    this.showFormStep4 = false;
                    this.scrollWindow(600);
                }

            }
            else if (this.stepcounter == 2) {
                this.previousAvailable = true;

                this.FName3 = this.template.querySelector(`[data-id= 'FName3']`).value.trim();
                let FName3FieldElement = this.template.querySelector(`[data-id= 'FName3']`);

                this.lName3 = this.template.querySelector(`[data-id= 'lName3']`).value.trim();
                let lName3FieldElement = this.template.querySelector(`[data-id= 'lName3']`);

                this.emailAddress3 = this.template.querySelector(`[data-id= 'emailAddress3']`).value.trim();
                let emailAddress3FieldElement = this.template.querySelector(`[data-id= 'emailAddress3']`);

                this.confirmemailAddress3 = this.template.querySelector(`[data-id= 'confirmemailAddress3']`).value.trim();
                let confirmEmailAddress3FieldElement = this.template.querySelector(`[data-id= 'confirmemailAddress3']`);

                this.phoneNumber3 = this.template.querySelector(`[data-id= 'phoneNumber3']`).value.trim();
                let phoneNumber3FieldElement = this.template.querySelector(`[data-id= 'phoneNumber3']`);

                this.Street3 = this.template.querySelector(`[data-id= 'Street3']`).value.trim();
                let street3FieldElement = this.template.querySelector(`[data-id= 'Street3']`);

                console.log("Street3 ", this.Street3);
                this.city3 = this.template.querySelector(`[data-id= 'city3']`).value.trim();
                let city3FieldElement = this.template.querySelector(`[data-id= 'city3']`);

                this.state3 = this.template.querySelector(`[data-id= 'state3']`).value.trim();
                let state3FieldElement = this.template.querySelector(`[data-id= 'state3']`);

                this.postalCode3 = this.template.querySelector(`[data-id= 'postalCode3']`).value.trim();
                let postalCode3FiedlElement = this.template.querySelector(`[data-id= 'postalCode3']`);

                this.country3 = this.template.querySelector(`[data-id= 'country3']`).value.trim();
                let country3FieldElement = this.template.querySelector(`[data-id= 'country3']`);

                let check = /^[a-zA-Z0-9'*+._]+@\w+([\.-]?\w+)*(\.\w{2,6})+$/.test(emailAddress3FieldElement.value);

                console.log('this.FName3 ', this.FName3);
                console.log('this.lName3 ', this.lName3);
                console.log('this.emailAddress3 ', this.emailAddress3);
                console.log('this.phoneNumber3 ', this.phoneNumber3);
                console.log('this.Street3 ', this.Street3);
                console.log('this.city3 ', this.city3);
                console.log('this.state3 ', this.state3);
                console.log('this.postalCode3 ', this.postalCode3);
                console.log('this.country3 ', this.country3);


                if (this.FName3 == '') {
                    FName3FieldElement.setCustomValidity('Value Required');
                    FName3FieldElement.reportValidity();
                    this.stepcounter == 1;
                    this.scrollWindow(600);
                } else if (this.lName3 == '') {
                    lName3FieldElement.setCustomValidity('Value Required');
                    lName3FieldElement.reportValidity();
                    this.scrollWindow(800);
                } else if (this.emailAddress3 == '') {
                    emailAddress3FieldElement.setCustomValidity('Value Required');
                    emailAddress3FieldElement.reportValidity();
                    this.scrollWindow(1000);
                } else if (!check) {
                    emailAddress3FieldElement.setCustomValidity('Invalid Email Address');
                    emailAddress3FieldElement.reportValidity();
                    this.scrollWindow(1000);
                } else if (this.confirmemailAddress3 == '') {
                    confirmEmailAddress3FieldElement.setCustomValidity('Value Required');
                    confirmEmailAddress3FieldElement.reportValidity();
                    this.scrollWindow(1000);
                } else if (this.emailAddress3 != this.confirmemailAddress3) {
                    confirmEmailAddress3FieldElement.setCustomValidity("Email did'nt match");
                    confirmEmailAddress3FieldElement.reportValidity();
                    this.scrollWindow(1000);
                } else if (this.phoneNumber3 == '') {
                    phoneNumber3FieldElement.setCustomValidity('Value Required');
                    phoneNumber3FieldElement.reportValidity();
                    this.scrollWindow(1100);
                } else if (this.Street3 == '') {
                    street3FieldElement.setCustomValidity('Value Required');
                    street3FieldElement.reportValidity();
                    this.scrollWindow(1300);
                } else if (this.city3 == '') {
                    city3FieldElement.setCustomValidity('Value Required');
                    city3FieldElement.reportValidity();
                    this.scrollWindow(1500);
                } else if (this.state3 == '') {
                    state3FieldElement.setCustomValidity('Value Required');
                    state3FieldElement.reportValidity();
                    this.scrollWindow(1600);
                } else if (this.postalCode3 == '') {
                    postalCode3FiedlElement.setCustomValidity('Value Required');
                    postalCode3FiedlElement.reportValidity();
                    this.scrollWindow(1600);
                } else if (this.country3 == '') {
                    country3FieldElement.setCustomValidity('Value Required');
                    country3FieldElement.reportValidity();
                    this.scrollWindow(1700);
                } else {
                    this.stepcounter += 1;
                    this.step4css = ACTIVE_STEP_CSS_CLASS;
                    this.showFormStep1 = false;
                    this.showFormStep2 = false;
                    this.showFormStep3 = false;
                    this.showFormStep4 = true;
                    this.scrollWindow(600);
                }
            }

            // else if (this.stepcounter == 3) {
            //     this.previousAvailable = true;
            //     this.step4css = ACTIVE_STEP_CSS_CLASS;
            //     this.showFormStep1 = false;
            //     this.showFormStep2 = false;
            //     this.showFormStep3 = false;
            //     this.showFormStep4 = true;

            // }
        }
    }


    scrollWindow(scrollToHeight) {
        console.log('scrollToHeight : ' + scrollToHeight);
        window.scrollTo({ top: scrollToHeight, left: 0, behavior: "smooth" });
    }


    validatePhoneField(event) {
        if (event.target.value < 0) {
            event.target.value = event.target.valueAsNumber * (-1);
        }
    }

}