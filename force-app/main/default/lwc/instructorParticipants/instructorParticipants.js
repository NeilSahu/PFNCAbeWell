import { LightningElement, api, track } from 'lwc';
import ImageYoga from '@salesforce/resourceUrl/ImageYoga';
import fitnessImage from '@salesforce/resourceUrl/fitnessImage';
import DanceImage from '@salesforce/resourceUrl/DanceImage';
import BoxingImage from '@salesforce/resourceUrl/BoxingImage';
import MartialArtsImage from '@salesforce/resourceUrl/MartialArtsImage';
import AerobicImage from '@salesforce/resourceUrl/AerobicImage';
import SpeechImage from '@salesforce/resourceUrl/SpeechImage';
import FilterImage from '@salesforce/resourceUrl/FilterImage';
import SearchIcon from '@salesforce/resourceUrl/SearchIcon';
import FavouriteInstructorImage1 from '@salesforce/resourceUrl/FavouriteInstructorImage1';
import FavouriteInstructorImage2 from '@salesforce/resourceUrl/FavouriteInstructorImage2';
import FavouriteInstructorImage3 from '@salesforce/resourceUrl/FavouriteInstructorImage3';
import getAllInstructorsData from '@salesforce/apex/BWPS_getInstructorsData.getAllInstructorsData';

export default class Bwps_WIP_Instructors extends LightningElement {
  SearchIcon = SearchIcon;
  FilterImage = FilterImage;
  ImageYoga = ImageYoga;
  fitnessImage = fitnessImage;
  Instructor;
  instructorprofile;
  instructorname;
  instructorexp;
  @track checkData = [];
  @track instructors = [];
  @track data2 = [];
  searchfield = "name";
  searchActionfield = "exp"
  @track value = true;
  DanceImage = DanceImage;
  BoxingImage = BoxingImage;
  MartialArtsImage = MartialArtsImage;
  AerobicImage = AerobicImage;
  SpeechImage = SpeechImage;
  FavouritInstructorImage1 = FavouriteInstructorImage1
  FavouritInstructorImage2 = FavouriteInstructorImage2
  FavouritInstructorImage3 = FavouriteInstructorImage3
  @track InstructorDetailView = false;
  @track allData = {};
  /*allData = {
    tranners: [
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "KIM BROOKS", "exp": "Yoga Instructor", "imgUrl": `${this.FavouritInstructorImage2}` },
      { "name": "HARRY R. DEBOER", "exp": "Boxing Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "KIM BROOKS", "exp": "Boxing Instructor", "imgUrl": `${this.FavouritInstructorImage2}` },
      { "name": "HARRY R. DEBOER", "exp": "Martial Arts Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "KIM BROOKS", "exp": "Yoga Instructor", "imgUrl": `${this.FavouritInstructorImage2}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "HARRY R. DEBOER", "exp": "Aerobic Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "KIM BROOKS", "exp": "Speech Instructor", "imgUrl": `${this.FavouritInstructorImage2}` },
      { "name": "HARRY R. DEBOER", "exp": "Boxing Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "KIM BROOKS", "exp": "Aerobic Instructor", "imgUrl": `${this.FavouritInstructorImage2}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "HARRY R. DEBOER", "exp": "Boxing Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "KIM BROOKS", "exp": "Yoga Instructor", "imgUrl": `${this.FavouritInstructorImage2}` },
      { "name": "HARRY R. DEBOER", "exp": "Dance Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "KIM BROOKS", "exp": "Boxing Instructor", "imgUrl": `${this.FavouritInstructorImage2}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "HARRY R. DEBOER", "exp": "Speech Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "KIM BROOKS", "exp": "Dance Instructor", "imgUrl": `${this.FavouritInstructorImage2}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "KIM BROOKS", "exp": "Yoga Instructor", "imgUrl": `${this.FavouritInstructorImage2}` },
      { "name": "HARRY R. DEBOER", "exp": "Boxing Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "KIM BROOKS", "exp": "Boxing Instructor", "imgUrl": `${this.FavouritInstructorImage2}` },
      { "name": "HARRY R. DEBOER", "exp": "Martial Arts Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "KIM BROOKS", "exp": "Yoga Instructor", "imgUrl": `${this.FavouritInstructorImage2}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "HARRY R. DEBOER", "exp": "Aerobic Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "KIM BROOKS", "exp": "Speech Instructor", "imgUrl": `${this.FavouritInstructorImage2}` },
      { "name": "HARRY R. DEBOER", "exp": "Boxing Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "KIM BROOKS", "exp": "Aerobic Instructor", "imgUrl": `${this.FavouritInstructorImage2}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "HARRY R. DEBOER", "exp": "Boxing Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "KIM BROOKS", "exp": "Yoga Instructor", "imgUrl": `${this.FavouritInstructorImage2}` },
      { "name": "HARRY R. DEBOER", "exp": "Dance Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "KIM BROOKS", "exp": "Boxing Instructor", "imgUrl": `${this.FavouritInstructorImage2}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "HARRY R. DEBOER", "exp": "Speech Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` },
      { "name": "KIM BROOKS", "exp": "Dance Instructor", "imgUrl": `${this.FavouritInstructorImage2}` },
      { "name": "HARRY R. DEBOER", "exp": "Fitness Instructor", "imgUrl": `${this.FavouritInstructorImage3}` }
    ]
  }*/

  searchIconBankground = `background-image: url(${SearchIcon});`;

  input = '';
  count = 0;
  yoga = false;
  fitness = false;
  boxing = false;
  aerobic = false;
  martialArts = false;
  dance = false;
  speech = false;

  @track paginationData;
  pageSize = 12;
  totalData;

  @track paginationFilteredData;
  totalFilteredData;

  instemp = [];
  connectedCallback() {
    getAllInstructorsData()
      .then(result => {
        console.log(result);
        this.instemp = result;
        for (let i = 0; i < this.instemp.length; i++) {
          console.log('this.instemp.length', this.instemp.length);
          const ins = {
            Id: this.instemp[i].ContactId,
            name: this.instemp[i].Contact.Name,
            exp: this.instemp[i].Contact.BWPS_Type__c,
            imgUrl: this.instemp[i].MediumPhotoUrl
          }
          this.instructors.push(ins);
        }
        this.allData['tranners'] = this.instructors;
        console.log('allData ', this.allData);
        this.totalData = this.allData.tranners.length;
        this.paginationData = this.allData.tranners.slice(0, this.pageSize);
      })
    .catch(error => {
        this.error = error;
      console.log('error get data instructor  ', JSON.stringify(this.error))
     });
  }
  searchfunction() {
    // console.log('this.allData-----', JSON.stringify(this.allData));
    // this.input = this.template.querySelector(`[data-id= 'myinput']`).value;
    // console.log('inputData----- ', this.input)
    // for (var i = 0; i < this.allData.tranners.length; i++) {
    //   if (this.allData.tranners[i][this.searchfield] == this.input) {
    //     count += 1
    //     this.checkData.push(this.allData.tranners[i]);
    //   }
    // }
    // if (count > 1) {
    //   this.value = false;
    // }
    // else {
    //   this.value = true;
    // }
    // console.log('this.checkData-----', JSON.stringify(this.checkData));

    console.log('**** IN SEARCH FUNCTION ****');


    let searchInput = this.template.querySelector(`[data-id= 'searchInput']`).value;

    // console.log(searchInput);

    this.checkData = [];

    this.allData.tranners.forEach((element, index) => {

      console.log(String(element.name));

      if (String(element.name).toLowerCase().includes(searchInput.toLowerCase())) {
        this.checkData.push(element);
      }

      if (this.checkData.length > 0) {
        this.value = false;
        this.totalFilteredData = this.checkData.length;
        this.paginationFilteredData = this.checkData.slice(0, this.pageSize);
      }
      else {
        this.value = true;
      }
    })




  }


  filterToggle; //for toggling the filter view on clicking on same button/div
//   handleAction(event) {
    // console.log('------------------------ --------',this.SearchIcon);
    // console.log("1-1-1-1-1-1-1-1-1-1- ", event.target.dataset );
    // var action = this.template.querySelector(`[data-id= 'myAction']`);
    // const result = action.innerText;
    // const searchAction = result + ' ' + 'Instructor';
    // console.log('Result ---> ', result);
    // console.log('SearchAction ----> ', searchAction);
    // if (result == 'Yoga') {
    //   this.value = false;
    //   for (var i = 0; i < this.allData.tranners.length; i++) {
    //     if (this.allData.tranners[i][this.searchActionfield] == searchAction) {
    //       this.checkData.push(this.allData.tranners[i]);
    //     }
    //   }
    // }
    // else if (result == 'Fitness') {
    //   for (var i = 0; i < this.allData.tranners.length; i++) {
    //     if (this.allData.tranners[i][this.searchActionfield] == searchAction) {
    //       this.checkData.push(this.allData.tranners[i]);
    //     }
    //   }
    // }

//     let expertise = event.target.dataset.expertise;
//     if (this.filterToggle != expertise) {

//       this.filterToggle = expertise;
//       this.checkData = [];

//       this.allData.tranners.forEach((element, index) => {
//         // console.log('123  ',String(element.exp).includes('Yoga'));
//         if (String(element.exp).includes(expertise)) {
//           this.checkData.push(element);
//         }
//         this.totalFilteredData = this.checkData.length;
//         this.paginationFilteredData = this.checkData.slice(0, this.pageSize);
//       })

//       if (this.checkData.length > 0) {
//         this.value = false;
//         this.totalFilteredData = this.checkData.length;
//         this.paginationFilteredData = this.checkData.slice(0, this.pageSize);

//       } else {
//         this.value = true;
//       }


//     }
//     else {
//       this.value = true;
//       this.filterToggle = '';
//     }
//   }

  // showMobileFilter = false;
  handleMobileFilter() {

    this.template.querySelector(`[data-id= 'filterDivId']`).classList.toggle("showMobileFilterButton");
  }




  handlePaginationAllData(event) {
    const start = (event.detail - 1) * this.pageSize;
    const end = this.pageSize * event.detail;
    console.log(start, end);
    //this.accounts = this.allaccounts.slice(start, end);
    this.paginationData = this.allData.tranners.slice(start, end);

  }



  handlePaginationFilteredData(event) {
    const start = (event.detail - 1) * this.pageSize;
    const end = this.pageSize * event.detail;
    console.log(start, end);
    //this.accounts = this.allaccounts.slice(start, end);
    this.paginationFilteredData = this.checkData.slice(start, end);

  }
  InstructorDetailViewhandle(event){
    console.log('event.target.dataset----',event.target.dataset);
    let dataID = event.currentTarget.dataset.id;
    let dataname = event.currentTarget.dataset.name;
    let dataprofile = event.currentTarget.dataset.pic;
    let dataexp = event.currentTarget.dataset.exp;
    this.InstructorDetailView = true;
    this.Instructor = dataID;
    this.instructorname = dataname;
    this.instructorprofile = dataprofile;
    this.instructorexp = dataexp;
    console.log('this.Instructor----',this.Instructor);
    console.log('this.instructorname------',this.instructorname);
    console.log('this.instructorprofile-----',this.instructorprofile);
    console.log('this.instructorexp-----',this.instructorexp);
    console.log('DATA_All>>>>>>>>>>>>>>>>',this.Instructor);
    console.log('InstructorDetailViewhandle' ,this.InstructorDetailView);
  }
}