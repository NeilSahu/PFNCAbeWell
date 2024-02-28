import { LightningElement, track, wire } from 'lwc';
import BELLICON from '@salesforce/resourceUrl/Bell_Icon';
import updateUserData from '@salesforce/apex/BWPS_LoginUserProfileCtrl.survay';
import fetchProfileDetails from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchProfileDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class GuestUserProfileParent extends LightningElement {
    

    @track showNotificationFlag = false;
    bellIcon = BELLICON;
    count = 0
    employee;
    firstChild = true
    secondChild = false
    thirdChild = false
    fourthChild = false
    fifthChild = false
    backButton = false;
    formInfo = [];
    submitbtnm = '';
    fname = '';
    lname = '';
    lastname = '';
    birthday = '';
    gender = '';
    street = '';
    city = '';
    state = '';
    email = '';
    postalcode;
    homePhone = '';
    mobileNumber = '';
    name = '';
    relationship = '';
    phone = '';
    facebookUser = '';
    question = '';
    question2 = '';
    question3 = '';
    name1 = '';
    city1 = '';
    email1 = '';
    state1 = '';
    donation ='';
    donation1 = '';
    apartment = '';
    street = '';
    genderSelected = 'None';
    relationshipSelected = 'None';
    annualDonation = '';
    country = '';



    handleDateChange(event) {
        const selectedDate = new Date(event.target.value);
        const currentDate = new Date();
        if (selectedDate > currentDate) {
            event.target.setCustomValidity('You cannot select a future date.');
        } else {
            event.target.setCustomValidity('');
        }
        event.target.reportValidity();
    }

    @wire(fetchProfileDetails)
    Rec({ error, data }) {
        if (data) {
            this.fname = data[0].Name ?? '';
            this.lastname = data[0].Last_name__c ?? '';
            this.birthday = data[0].Birthday__c ?? '';
            this.gender = data[0].Gende__c ?? '';
            setTimeout(() => { this.template.querySelector('[data-id="Gender"]').value = this.gender; }, 200);
            this.email = data[0].Email__c ?? '';
            this.homePhone = data[0].Home_Phone_Number__c ?? '';
            this.apartment = data[0].Apartment__c ?? '';
            this.street = data[0].Street__c ?? '';
            this.city = data[0].City__c ?? '';
            this.state = data[0].State__c ?? '';
            this.postalcode = data[0].postalcode__c;
            this.country = data[0].Country__c ?? '';
            this.name = data[0].Name__c ?? '';
            if(data[0].Relationship__c == 'undefined'){
                
                this.relationship = 'Select';
            }
         
              console.log("state178",data[0].Relationship__c);
            this.phone = data[0].Phone_Number__c ?? '';
            this.lname = data[0].Lname__c ?? '';
            this.name1 = data[0].Q2_Name__c ?? '';
            this.state1 = data[0].Q2_State__c ?? '';
            console.log("state1",this.state1);
            this.city1 = data[0].Q2_City__c ?? '';
            this.email1 = data[0].Q2_Email_Address__c ?? '';
            this.donation = data[0].Tax_Deductible_contribution__c ?? '';
            this.annualDonation = data[0].Donation_for_annual_administrative__c ?? '';
            this.question2 = data[0].Question_2_Answers__c ?? '';
            this.question3 = data[0].Page3_Answer1__c ?? '';
            setTimeout(() => { this.template.querySelector(`[data-id="facebookUser${data[0].Facebook__c}"]`).checked = true }, 200);
            this.question = data[0].Question1__c;
            setTimeout(() => { this.template.querySelector(`[data-id="${data[0].Question1__c}"]`).checked = true }, 200);

        }
        else if (error) {
            console.log('error ', error);
        }
    }



    handleClick() {

        if (this.count == 0) {
            setTimeout(() => { this.template.querySelector('[data-id="relationship"]').value = this.relationship }, 200);


            this.fname = this.template.querySelector(`[data-id= 'firstname']`).value;
            this.lastname = this.template.querySelector(`[data-id= 'lastname']`).value;
            this.birthday = this.template.querySelector(`[data-id= 'birthday']`).value;
            this.gender = this.template.querySelector(`[data-id= 'Gender']`).value;
            this.email = this.template.querySelector(`[data-id= 'EmailAddress']`).value.trim();
            let emailFieldElement = this.template.querySelector(`[data-id= 'EmailAddress']`);
            this.homePhone = this.template.querySelector(`[data-id= 'homePhone']`).value;

            this.apartment = this.template.querySelector(`[data-id= 'Apartment']`).value;
            console.log('Apartment',this.apartment);
            this.street = this.template.querySelector(`[data-id= 'street']`).value;
            this.city = this.template.querySelector(`[data-id= 'city']`).value;
            this.state = this.template.querySelector(`[data-id= 'state']`).value;
            this.postalcode = this.template.querySelector(`[data-id= 'postalcode']`).value;
            this.country = this.template.querySelector(`[data-id= 'Country']`).value;
            let check = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(this.email);
            if (!check) {

                emailFieldElement.setCustomValidity('Invalid Email');
                emailFieldElement.reportValidity();

            } else {

                emailFieldElement.setCustomValidity('');
                emailFieldElement.reportValidity();
                this.secondChild = true;
                this.firstChild = false
                this.thirdChild = false
                this.fourthChild = false
                this.fifthChild = false
                this.template.querySelector('.circle2').classList.add('circle1');
                this.template.querySelector('.circle2').classList.remove('circle2');
                this.backButton = true;
                this.count += 1
            }
        }
        else if (this.count == 1) {
            console.log("787");

           // setTimeout(() => { this.template.querySelector(`[data-id="${this.question2}"]`).checked = true }, 2000);
            setTimeout(() => { this.template.querySelector(`[data-id="${this.question}"]`).checked = true }, 100);
            this.name = this.template.querySelector(`[data-id= 'fname']`).value;
            this.relationship = this.template.querySelector(`[data-id= 'relationship']`).value;
            this.phone = this.template.querySelector(`[data-id= 'phone']`).value;
            this.lname = this.template.querySelector(`[data-id= 'lname']`).value;

            this.thirdChild = true
            this.firstChild = false
            this.secondChild = false
            this.fourthChild = false
            this.fifthChild = false
            this.count += 1
            this.template.querySelector('.circle3').classList.add('circle1');
            this.template.querySelector('.circle3').classList.remove('circle3');

        }
        else if (this.count == 2) {
            console.log("588", this.question3);
            this.relationship = this.relationship;

            this.question2 = this.template.querySelector(`[data-id= 'years']`).value;
            console.log("8585",this.question2)
            setTimeout(() => { this.template.querySelector(`[data-id="${this.question3}"]`).checked = true }, 2000);

            this.fourthChild = true
            this.firstChild = false
            this.secondChild = false
            this.thirdChild = false
            this.fifthChild = false
            this.template.querySelector('.circle4').classList.add('circle1');
            this.template.querySelector('.circle4').classList.remove('circle4');
            this.count += 1
        }
        else if (this.count == 3) {
            console.log("55");
            setTimeout(() => {
                this.template.querySelector(`[data-id="${this.question}"]`).checked = true
            }, 2000);
            this.name1 = this.template.querySelector(`[data-id= 'name1']`).value;
            this.state1 = this.template.querySelector(`[data-id= 'state_drop']`).value;
            this.city1 = this.template.querySelector(`[data-id= 'city1']`).value;
            this.email1 = this.template.querySelector(`[data-id= 'Email1']`).value.trim();
            let email1FieldElement = this.template.querySelector(`[data-id= 'Email1']`);

            let check = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(this.email1);

            if (!check) {

                email1FieldElement.setCustomValidity('Invalid Email');
                email1FieldElement.reportValidity();

            } else {

                email1FieldElement.setCustomValidity('');
                email1FieldElement.reportValidity();

                this.fourthChild = false
                this.firstChild = false
                this.secondChild = false
                this.thirdChild = false
                this.fifthChild = true


                this.template.querySelector('.circle5').classList.add('circle1');
                this.template.querySelector('.circle5').classList.remove('circle5')
                this.submitbtnm = this.template.querySelector('.button1').innerHTML = 'SUBMIT';
                this.count += 1
            }
        }
        else if (this.submitbtnm == "SUBMIT") {
            this.donation = this.template.querySelector(`[data-id= 'donation']`).value;
            this.donation1 = this.template.querySelector(`[data-id= 'donation1']`).value;
            console.log('OUTPU888888888888888888888888 : ', this.donation);

            console.log('length ', this.postalcode.length == 0);
            if (this.postalcode.length == 0) {
                this.postalcode = 0;
            }
            if (this.donation.length == 0) {
                this.donation = 0;
            }
            if (this.donation1.length == 0) {
                this.donation1 = 0;
            }



            this.employee = {
                "firstName": this.fname,
                "lastName": this.lastname,
                "birthday": this.birthday,
                "gender": this.gender,
                "street": this.street,
                "apartment": this.apartment,
                "email": this.email,
                "city": this.city,
                "state": this.state,
                "postalcode": this.postalcode,
                "country": this.country,
                "facebookUser": this.facebookUser,
                "homePhone": this.homePhone,
                "name": this.name,
                "lname": this.lname,
                "phone": this.phone,
                "relationship": this.relationship,
                "question1": this.question,
                "question2": this.question2,
                "question3": this.question3,
                "Name1": this.name1,
                "city1": this.city1,
                "email1": this.email1,
                "state1": this.state1,
                "donation": this.donation,
                "donation1": this.donation1

            }

            console.log('OUTPUT1 : ', this.employee);
            updateUserData({ userData: JSON.stringify(this.employee) })
                .then(result => {
                    window.location.reload();
                    //this.template.querySelector('c-toast-message').showToast('success', 'form submitted successfully.');
                     this.ShowToast();
                })
                .catch(error => {
                    console.log(error);
                        this.showErrorToast(error.body.message);
                //    this.template.querySelector('c-toast-message').showToast('error', 'An error occurred while trying to submit the form.');
                });
        }
    }

    handlePreviousButton() {
        if (this.count == 1) {
            this.firstChild = true;
            this.secondChild = false
            this.thirdChild = false
            this.fourthChild = false

            this.template.querySelector('.two').classList.remove('circle1')
            this.template.querySelector('.two').classList.add('circle2')
            this.backButton = false;
            this.count -= 1
        }
        if (this.count == 2) {
            this.firstChild = false;
            this.secondChild = true;
            this.thirdChild = false;
            this.fourthChild = false
            this.template.querySelector('.three').classList.remove('circle1')
            this.template.querySelector('.three').classList.add('circle3')
            this.count -= 1
        }
        if (this.count == 3) {
            this.firstChild = false;
            this.secondChild = false;
            this.thirdChild = true;
            this.fourthChild = false;
            this.template.querySelector('.four').classList.remove('circle1')
            this.template.querySelector('.four').classList.add('circle4')
            this.template.querySelector('.button1').innerHTML = 'Next';
            this.count -= 1
        }
        if (this.count == 4) {
            this.firstChild = false;
            this.secondChild = false;
            this.thirdChild = false;
            this.fourthChild = true;
            this.fifthChild = false;
            this.template.querySelector('.five').classList.remove('circle1')
            this.template.querySelector('.five').classList.add('circle5')
            this.template.querySelector('.button1').innerHTML = 'Next';
            this.count -= 1
        }

    }

    radioClickHandler(evt) {
        this.facebookUser = evt.target.dataset.value;
        console.log('OUTPUT radio>>>>>>> : ', this.facebookUser);
    }

    handleClickq1(evt) {
        this.question = evt.target.dataset.label;
        console.log('OUTPUT questio>>>>>>> : ', evt.target.dataset.label);
    }
    // handleC(evt) {
    //     this.question2 = evt.target.dataset.label;
    //     console.log('OUTPUT question1>>>>>>> : ', evt.target.dataset.label);
    // }

    handleclick(evt) {
        this.question3 = evt.target.dataset.label;
        console.log('OUTPUT question1>>>>>>> : ', evt.target.dataset.label);
    }

    showNotificationMethod() {
        this.showNotificationFlag = !this.showNotificationFlag;
    }

        ShowToast() {
        const event = new ShowToastEvent({
            title: 'Thank you for Contacting Us',
            message: 'Our team will get back to you soon :)',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
    showErrorToast( messagetext = 'please check your details again') {
        const evt = new ShowToastEvent({
            title: 'Some unexpected error occured',
            message: messagetext,
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }
}