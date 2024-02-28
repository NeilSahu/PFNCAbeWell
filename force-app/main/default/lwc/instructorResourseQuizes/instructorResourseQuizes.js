import { LightningElement,track, wire } from 'lwc';
import myImage from '@salesforce/resourceUrl/ExerciseImage';
import fetchQuizesDetail from '@salesforce/apex/BWPS_InstructorResourcesData.fetchQuizesDetail';
export default class InstructorResourseQuizes extends LightningElement {

 visibleRecords =[];

 
      myImage =myImage;
    @track page = 1;
    @track pageSize = 3;
    @track start = 0;
    @track end = 0;
     @track response =[];

 currentArray =
    [
      { "text1": "QUIZ 1", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },
      { "text1": "QUIZ 2", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },
      { "text1": "QUIZ 3", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },    
      // { "text1": "QUIZ 4", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },
      // { "text1": "QUIZ 5", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },
      // { "text1": "QUIZ 6", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },
      // { "text1": "QUIZ 7", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },
      // { "text1": "QUIZ 8", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },
      // { "text1": "QUIZ 9", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },      
      // { "text1": "QUIZ 10", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },
      // { "text1": "QUIZ 11", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },
      // { "text1": "QUIZ 12", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage }, 
      // { "text1": "QUIZ 13", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },
      // { "text1": "QUIZ 14", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },
      // { "text1": "QUIZ 15", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },    
      // { "text1": "QUIZ 16", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },
      // { "text1": "QUIZ 17", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },
      // { "text1": "QUIZ 18", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },
      // { "text1": "QUIZ 19", "text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "imgUrl":myImage },

    ]

    // connectedCallback() {
    //   this.paginationHandler();
    // }
    // paginationHandler(){
    //     this.end = 0;
    //     this.start = 0;
    //     this.end = (this.page * this.pageSize);
    //     this.start = this.end - 3;
    //     this.visibleRecords = [];
    //     for (let i = this.start; i < this.end; i++) {
    //         if(this.currentArray[i]){
    //             this.visibleRecords.push(this.currentArray[i]);
    //         }
    //     }
    //     if(this.visibleRecords.length <= 0){
    //         //this.noRecordFlag = true;
    //     }
    //     else{
    //         //this.noRecordFlag = false;
    //     }
    //     console.log('VisibleArray : ',JSON.stringify(this.visibleRecords));

    // }

    // NextHandler(){
    //     console.log('Next Handler : ');
    //     if(this.page < (this.currentArray.length/this.pageSize)){
    //         this.page++;
    //         this.paginationHandler();
    //     }
    // }
    // PreviousHandler(){
    //     console.log('Previous Handler : ');
    //     if(this.page > 1){
    //         this.page--;
    //         this.paginationHandler();
    //     }
    // }


      @wire(fetchQuizesDetail)
  conrecords({ error, data }) {
     if (data) {

         this.response=data;
       console.log("log",JSON.stringify(this.response));       
        console.log("data");
     } else if (error) {
         this.error = error;
         console.log('erroeeee>>>',error);
     }


  }
}