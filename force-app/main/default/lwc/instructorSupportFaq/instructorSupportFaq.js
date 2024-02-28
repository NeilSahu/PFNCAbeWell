import { LightningElement , wire, track, api } from 'lwc';
import getAllFaqRecords from '@salesforce/apex/DNA_InstructorClass.getAllFaqRecords';
import Bg_IMAGES from '@salesforce/resourceUrl/WebsiteGenFaqImage';

export default class InstructorSupportFaq extends LightningElement {
    
    showFaqData = [];
    // faq_data = [
    //         {
    //             "ques" : "If I like the free trial how can I Purchase a full membership?",
    //             "ans" : "You gain access to all of Be Well Parkinson's live online classes as well as access to a supportive and helpful community of instructors and fellow Parkinson's patients. You can also access view on demand classes."
    //         },
    //         {
    //             "ques" : "How do I access classes after I sign up for the free trial?",
    //             "ans" : "You gain access to all of Be Well Parkinson's live online classes as well as access to a supportive and helpful community of instructors and fellow Parkinson's patients. You can also access view on demand classes."
    //         },
    //         {
    //             "ques" : "Who do I contact if I am having trouble?",
    //             "ans" : "You gain access to all of Be Well Parkinson's live online classes as well as access to a supportive and helpful community of instructors and fellow Parkinson's patients. You can also access view on demand classes."
    //         },
    //         {
    //             "ques" : "How much does it cost to sign up?",
    //             "ans" : "You gain access to all of Be Well Parkinson's live online classes as well as access to a supportive and helpful community of instructors and fellow Parkinson's patients. You can also access view on demand classes."
    //         },
    //         {
    //             "ques" : "I can't afford the full member fee - is there any help you can offer?",
    //             "ans" : "You gain access to all of Be Well Parkinson's live online classes as well as access to a supportive and helpful community of instructors and fellow Parkinson's patients. You can also access view on demand classes."
    //         },
    //         {
    //             "ques" : "If I like the free trial how can I Purchase a full membership?",
    //             "ans" : "You gain access to all of Be Well Parkinson's live online classes as well as access to a supportive and helpful community of instructors and fellow Parkinson's patients. You can also access view on demand classes."
    //         },
    //         {
    //             "ques" : "How do I access classes after I sign up for the free trial?",
    //             "ans" : "You gain access to all of Be Well Parkinson's live online classes as well as access to a supportive and helpful community of instructors and fellow Parkinson's patients. You can also access view on demand classes."
    //         },
    //         {
    //             "ques" : "Who do I contact if I am having trouble?",
    //             "ans" : "You gain access to all of Be Well Parkinson's live online classes as well as access to a supportive and helpful community of instructors and fellow Parkinson's patients. You can also access view on demand classes."
    //         },
    //         {
    //             "ques" : "How much does it cost to sign up?",
    //             "ans" : "You gain access to all of Be Well Parkinson's live online classes as well as access to a supportive and helpful community of instructors and fellow Parkinson's patients. You can also access view on demand classes."
    //         }
    //     ];
    currentValue = true;
    showHideHandler(){
        var currentStatus = this.template.querySelector();
    }
    @wire(getAllFaqRecords)
    getAllFaqRecords({data,error}){
        if(data){
            this.showFaqData = data;
            console.log('showFaqData : ',JSON.stringify(this.showFaqData));
        }
        if(error){
            console.log('error : ',JSON.stringify(error));
        }
    }
    connectedCallback(){
        //this.showFaqData = this.faq_data;
    }   

    renderedCallback(){
        var slides =  this.template.querySelectorAll('.catagory');
        slides.forEach((element, index)=>{
            console.log('index   ---   ',index);
            console.log('ele   ---   ',element);

            element.style.left = `${index * 33.33333333333333}%`;
        })
    }

    changeAllcatagoryBackgroundColor(){
        var catagory = this.template.querySelectorAll('.catagory');
        console.log('---------------------------------------------->',catagory);
        catagory.forEach(element => {
            element.style.backgroundColor = 'white';
            element.style.color = '#008CA7';
        });
    }
}