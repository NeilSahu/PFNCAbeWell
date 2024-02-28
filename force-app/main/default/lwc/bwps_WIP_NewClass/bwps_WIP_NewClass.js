import { LightningElement,track } from 'lwc';
import USER_ID from '@salesforce/user/Id';
import Logo from '@salesforce/resourceUrl/WIPlogo';
import INSTRUCTOR_SLIDER_IMAGES from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import myResource from '@salesforce/resourceUrl/DNAIcon';
import yogaWIP from '@salesforce/resourceUrl/yogaWIP';
export default class Bwps_WIP_NewClass extends LightningElement {
    data = {
        "tranners":[
          {"name":"SANDY DOWNING 1", "exp":"Excercise Instructor","imgUrl":`${INSTRUCTOR_SLIDER_IMAGES}/WebsiteGeneralFiles/PassionateInstructor.jpg`},
          {"name":"SHAHANA AILUS 2", "exp":"Excercise Instructor","imgUrl":`${INSTRUCTOR_SLIDER_IMAGES}/WebsiteGeneralFiles/PassionateInstructor.jpg`},
          {"name":"KRISTEN BODENSTEINER 3", "exp":"Danse Instructor","imgUrl":`${INSTRUCTOR_SLIDER_IMAGES}/WebsiteGeneralFiles/PassionateInstructor.jpg`},
          {"name":"KIM BROOKS 4", "exp":"Yoga Instructor","imgUrl":`${INSTRUCTOR_SLIDER_IMAGES}/WebsiteGeneralFiles/PassionateInstructor.jpg`},
          {"name":"KIM BROOKS 5", "exp":"Yoga Instructor","imgUrl":`${INSTRUCTOR_SLIDER_IMAGES}/WebsiteGeneralFiles/PassionateInstructor.jpg`},
          {"name":"KRISTEN BODENSTEINER 6", "exp":"Danse Instructor","imgUrl":`${INSTRUCTOR_SLIDER_IMAGES}/WebsiteGeneralFiles/PassionateInstructor.jpg`},
          {"name":"KIM BROOKS 7", "exp":"Yoga Instructor","imgUrl":`${INSTRUCTOR_SLIDER_IMAGES}/WebsiteGeneralFiles/PassionateInstructor.jpg`},
          {"name":"KIM BROOKS 8", "exp":"Yoga Instructor","imgUrl":`${INSTRUCTOR_SLIDER_IMAGES}/WebsiteGeneralFiles/PassionateInstructor.jpg`}
        ]
      }
click=0;
containerLength;
@track Classimage = Logo + "/WIPlogo/Class_image.png";
@track yogaWIP = yogaWIP;
@track filterIcon = myResource + "/DNAIcons/filterIcon.png";
    @track levelIcon = myResource + "/DNAIcons/levelIcon.png";
    @track shareIcon = myResource + "/DNAIcons/shareIcon.png";
    @track userIcon = myResource + "/DNAIcons/userIcon.png";
    @track likeIcon = myResource + "/DNAIcons/likeIcon.png";
renderedCallback(){
var topDiv = this.template.querySelector('[data-id="card-1"]');
this.containerLength =topDiv.offsetWidth;
console.log("CardLength",topDiv.offsetWidth);
}
sliderMaxVal = (this.data.tranners.length-1);
sliderChange(){
console.log('>>> slider');
var topDiv = this.template.querySelector('[data-id="container_I"]');
console.log('>>>',topDiv.scrollLeft,">>>width",this.containerLength);
var slider = this.template.querySelector('[data-id="myRange"]');
console.log('>>>SliderVAl>>',slider.value);
topDiv.scrollLeft = (slider.value)*this.containerLength;

}
next(){
  console.log('nexxxt>>>>>>Press');
    if(this.data.tranners.length - 4 > this.click){
      this.click +=1;
    }
      var topDiv = this.template.querySelector('[data-id="container_I"]');
      console.log('valueofsss',typeof(topDiv.scrollLeft), '>>>>>>>>', this.click );
      topDiv.scrollLeft = this.click *this.containerLength;
      console.log('valueofsss',topDiv.scrollLeft , '>>>>>>>>', this.click );
};
preview(){
  console.log('preview>>>>>>Press');
  if(this.click >0){
      this.click -=1; 
  }
  var topDiv = this.template.querySelector('[data-id="container_I"]');
  console.log('valueofsss',topDiv.scrollLeft)
  topDiv.scrollLeft =this.click *this.containerLength;
  console.log('valueofsss',topDiv.scrollLeft , '>>>>>>>>', this.click );
};
scheduleClassDetailViewHandle(event){
    // console.log('event.target.dataset----',event.target.dataset);
    // let instname = event.currentTarget.dataset.name;
    // let schcname = event.currentTarget.dataset.schname;
    // let schdescp = event.currentTarget.dataset.descp;
    // let Intensity = event.currentTarget.dataset.ints;
    // this.InstDetailView = true;
    // this.scheduleClassName = schcname;
    // this.scheduleClassInstName = instname;
    // this.scheduelClassDescription = schdescp;
    // this.scheduleclassintensity = Intensity;
    // console.log('this.scheduleClassName----',this.scheduleClassName);
    // console.log('this.scheduleClassInstName------',this.scheduleClassInstName);
    // console.log('this.scheduelClassDescription-----',this.scheduelClassDescription);
    // console.log('this.scheduleclassintensity-----',this.scheduleclassintensity);
    // console.log('InstDetailView' ,this.InstDetailView);
  }

  handleLikeClick(event){
    if(USER_ID == undefined || USER_ID == null){
        window.open('/PFNCADNA/s/bwps-wip-signin');
    }
  }

}