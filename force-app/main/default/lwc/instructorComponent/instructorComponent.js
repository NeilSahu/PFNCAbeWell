import { LightningElement } from 'lwc';

export default class InstructorComponent extends LightningElement {
    data = {
        "tranners":[
          {"name":"SANDY DOWNING 1", "exp":"Excercise Instructor","imgUrl":"/sfsites/c/file-asset/ins1?v=1"},
          {"name":"SHAHANA AILUS 2", "exp":"Excercise Instructor","imgUrl":"/sfsites/c/file-asset/ins1?v=1"},
          {"name":"KRISTEN BODENSTEINER 3", "exp":"Danse Instructor","imgUrl":"/sfsites/c/file-asset/ins1?v=1"},
          {"name":"KIM BROOKS 4", "exp":"Yoga Instructor","imgUrl":"/sfsites/c/file-asset/ins1?v=1"},
          {"name":"KIM BROOKS 5", "exp":"Yoga Instructor","imgUrl":"/sfsites/c/file-asset/ins1?v=1"},
          {"name":"KRISTEN BODENSTEINER 6", "exp":"Danse Instructor","imgUrl":"/sfsites/c/file-asset/ins1?v=1"},
          {"name":"KIM BROOKS 7", "exp":"Yoga Instructor","imgUrl":"/sfsites/c/file-asset/ins1?v=1"},
          {"name":"KIM BROOKS 8", "exp":"Yoga Instructor","imgUrl":"/sfsites/c/file-asset/ins1?v=1"}
        ]
      }
  click=0;
  containerLength;
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
}