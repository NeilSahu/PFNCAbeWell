import { LightningElement,wire,track } from 'lwc';
import INSTRUCTOR_SLIDER_IMAGES from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import getAllInstructors from '@salesforce/apex/BWPS_getInstructorsData.getAllInstructorsData';
export default class Bwps_WIP_HomePageInstructorComponent extends LightningElement {
click=0;
slideButton = false;
@track instemp =[];
@track instructors = [];
@track Arr = [];
@wire(getAllInstructors)
wiredData({data,error}){
  if(data){
     var result = data;
     console.log('OUTPUT 1.0>>>>: ',result);
     if(data.length<4){
         this.slideButton = false;
     }
     else{
          this.slideButton = true;
     }
     for(let i=0;i<result.length;i++){
       var instructorType = [];
       var instructor =[];
       if (result[i].Contact.hasOwnProperty('BWPS_Type__c')) {
       instructorType = result[i].Contact.BWPS_Type__c.split(';');
       for(let j=0;j<instructorType.length;j++){
          instructorType[j] = " " +instructorType[j] ;
          instructor.push(instructorType[j]);
       }
       }
       var obj={
          
              "Name": result[i].Contact.Name,
              "Type": instructor +' Instructor',
              "imgUrl": (result[i]?.Contact.BWPS_publicProfileLink__c) ? result[i].Contact.BWPS_publicProfileLink__c : result[i].FullPhotoUrl,
                  
            }
      this.Arr.push(obj);
     }
     console.log('OUTPUT 1.1>>>>: ',JSON.stringify(this.Arr));
  }else if(error){
    console.log(error,'error');
  }
}


// connectedCallback() {
//     getAllInstructors()
//       .then(result => {
//         console.log('"Type": instructor +' Instructor',');
//         this.instemp = result;
//         for (let i = 0; i < this.instemp.length; i++) {
//           console.log('this.instemp.length', this.instemp.length);
//           const ins = {
//             Id: this.instemp[i].ContactId,
//             Name: this.instemp[i].Contact.Name,
//             Type: this.instemp[i].Contact.BWPS_Type__c,
//             imgUrl: this.instemp[i].MediumPhotoUrl
//           }
//           this.instructors.push(ins);
//         }
//         console.log('All sinstructor ',JSON.stringify(this.instructors));
//       })
//     .catch(error => {
//         this.error = error;
//       console.log('error get data instructor  ', JSON.stringify(this.error))
//      });
//   }
  // containerLength ;
  // renderedCallback(){
  //   var topDiv = this.template.querySelector('[data-id="card-1"]');
  //   this.containerLength =   this.template.querySelector('[data-id="container_I"]');
  //   console.log("CardLength",topDiv);
  // }
  // sliderMaxVal = (this.Arr.length-1);
  // sliderChange(){
  //   console.log('>>> slider');
  //   var topDiv = this.template.querySelector('[data-id="container_I"]');
  //   console.log('>>>',topDiv.scrollLeft,">>>width",this.containerLength);
  //   var slider = this.template.querySelector('[data-id="myRange"]');
  //   console.log('>>>SliderVAl>>',slider.value);
  //   topDiv.scrollLeft = (slider.value)*this.containerLength;

  // }

  // next(){
  //   console.log('nexxxt>>>>>>Press');
  //     if(this.Arr.length - 4 > this.click){
  //       this.click +=1;
  //     }
  //       var topDiv = this.template.querySelector('[data-id="container_I"]');
  //       console.log('valueofsss',typeof(topDiv.scrollLeft), '>>>>>>>>', this.click );
  //       topDiv.scrollLeft = this.click *this.containerLength;
  //       console.log('valueofsss',topDiv.scrollLeft , '>>>>>>>>', this.click );
  // };
  // preview(){
  //   console.log('preview>>>>>>Press');
  //   if(this.click >0){
  //       this.click -=1; 
  //   }
  //   var topDiv = this.template.querySelector('[data-id="container_I"]');
  //   console.log('valueofsss',topDiv.scrollLeft)
  //   topDiv.scrollLeft =this.click *this.containerLength;
  //   console.log('valueofsss',topDiv.scrollLeft , '>>>>>>>>', this.click );
  // };
  handlePrev(event) {
        this.template.querySelector(".slider").scrollLeft -= 368;
  }
  handleNext(event){
          this.template.querySelector(".slider").scrollLeft += 368;
  }

}