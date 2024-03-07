import { LightningElement, track, wire } from 'lwc';
import Bg_IMAGES from '@salesforce/resourceUrl/WebsiteGenFaqImage';

import fetchFaqsDetails from '@salesforce/apex/bwps_WIP_blogsController.getAllFaqRecords1';
import searchResponse from '@salesforce/apex/bwps_WIP_blogsController.getAllFaqRecords';
import popularQuestion from '@salesforce/apex/bwps_WIP_blogsController.popularQuestion'
export default class Bwps_WIP_FAQs extends LightningElement {

    backIcom = Bg_IMAGES + "/chevron-1.svg";
       data = {};

    showSearchMode = false;
    
    FAQsHeading = "GETTING STARTED";

    response = [];
    faqsresponse = [];
    searchFilterResponse =[];
    searchresultLength = 0;
    searchresultboardershow = true;
    Faqsearchlength = 0;
    faqsearchresultline = false;
    popularQue =[];
    // BgImage = `${CAROUSEL_IMAGES}/WebsiteGeneralFiles/pxfuelcom.jpg`;
    bgImgStyle = `background-image: url(${Bg_IMAGES}/HeaderImage.png)`;
    bgImgStyle1 = `background-image: url(${Bg_IMAGES}/How-to-particapte_Image-2.png)`;
    bgImgStyle2 = `background-image: url(${Bg_IMAGES}/How-to-particapte_Image-1.png)`;
    bgImgStyle3 = `background-image: url(${Bg_IMAGES}/How-to-particapte_Image.png)`;
    bgBeeSymbol = `${Bg_IMAGES}/PFNCA_BeeSymbol_White_RGB_150dpi.png`;


         @wire(popularQuestion)
        conrecor({ error, data }) {
            if (data) {

                this.popularQue = data;
                console.log("data11",this.popularQue);
            } else if (error) {
                this.error = error;
                console.log('erroeeee>>>', error);
            }

        }
        
     
    
    handleDetailsToggle(event) {
        const allDetails = this.template.querySelectorAll('details');
        if (event.target.open) {   
            allDetails.forEach(ele => {
                if (ele != event.target && ele.open) {
                    ele.open = false; 
                }
            });
        }
    }


    fetchFaqs() {
        fetchFaqsDetails({ faqsType: this.FAQsHeading })
            .then((result) => {
                this.response = result;
                 this.Faqsearchlength = this.response.length();
        if(this.Faqsearchlength == 1){
          this.faqsearchresultline = true;
        }

                console.log("lo1", this.response);
            })
            .catch((error) => {
                console.log(error);
            })


        //   Record({ error, data }) {
        //     if (data) {
        //         this.response = data;
        //         console.log("log1",this.response);

        //     }
        //     else if (error) {
        //     console.log('error ',error);
        //     }


    }



    category_q_data = [];
    connectedCallback() {
        this.category_q_data = this.data.getting_started;
        this.fetchFaqs();
    }

    handlePrev(event) {
        this.template.querySelector(".slider").scrollLeft -= 360;
    }
    handleNext(event) {
        this.template.querySelector(".slider").scrollLeft += 360;
    }
    handleClick_gettingStarted() {
        this.FAQsHeading = "GETTING STARTED";
        this.fetchFaqs();
        this.category_q_data = this.data.getting_started;
        this.changeAllcatagoryBackgroundColor();
        var item1 = this.template.querySelector('.item-1');
        item1.style.backgroundColor = '#008CA7';
        item1.style.color = 'white';
    }
    item2;
    handleClick_aboutTheProgram(event) {
        this.FAQsHeading = "ABOUT THE PROGRAM";
        this.fetchFaqs();
        this.category_q_data = this.data.about_the_program;
        this.changeAllcatagoryBackgroundColor();
        var item2 = this.template.querySelector('.item-2');
        item2.style.backgroundColor = '#008CA7';
        item2.style.color = 'white';
    }
    handleClick_joiningClasses() {
        this.FAQsHeading = "JOINING CLASSES";
        this.fetchFaqs();
        this.category_q_data = this.data.joining_classes;
        this.changeAllcatagoryBackgroundColor();
        var item3 = this.template.querySelector('.item-3');
        item3.style.backgroundColor = '#008CA7';
        item3.style.color = 'white';
    }


    
        @wire(searchResponse)
        conrecords({ error, data }) {
            if (data) {

                this.faqsresponse = data;
                console.log("data",this.faqsresponse);
            } else if (error) {
                this.error = error;
                console.log('erroeeee>>>', error);
            }

        }
        
    handlePopularQue(event){
        
        this.showSearchMode = true;
    const searchData = event.target.innerText;

    this.searchFilterResponse = this.faqsresponse.filter((ele)=> ele.Name.toLowerCase().includes(searchData.toLowerCase()));
     this.searchresultLength = this.searchFilterResponse.length;
    console.log('searchresultLength lenght ',this.searchresultLength);
    if(this.searchresultLength == 1){
          this.searchresultboardershow = false;
        }

    }
     handleKeyPress(event){
    if(event.keyCode === 13){
      this.handlesearch();
    }
  }
  handleClearSerach(){
      this.template.querySelector(`[data-id= 'searchInput']`).value = "";
      this.handlesearch();
  }
    handlesearch() {


        const searchData = this.template.querySelector(`[data-id= 'searchInput']`).value.trim();
        
        if(searchData == ''){
            this.showSearchMode = false;
            return 
        }

      this.showSearchMode = true;
      this.searchFilterResponse = this.faqsresponse.filter((ele)=> ele.Name.toLowerCase().includes(searchData.toLowerCase()));
        this.searchresultLength = this.searchFilterResponse.length;
        if(this.searchresultLength == 1){
          this.searchresultboardershow = false;
        }
    }

    handleGoBack(){
        this.showSearchMode = false;
    }

}