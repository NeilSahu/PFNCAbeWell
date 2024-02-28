import { LightningElement,wire,track,api } from 'lwc';
import INSTRUCTOR_SLIDER_IMAGES from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import getAllInstructors from '@salesforce/apex/BWPS_getInstructorsData.getAllInstructorsData';

export default class Pfnca_Main_HomePageInstructorComponent extends LightningElement {

click=0;
@track slideButton = false;

@track instemp =[];
@track instructors = [];
@track Arr = [];

Instructor;
instructorprofile;
instructorname;
instructorexp;
@track instructorDescription = '';
@track InstructorDetailView = false;

img = {"Aerobic":"data:image/svg+xml,%3Csvg id='Aerobic' xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect id='Bounding_Box' data-name='Bounding Box' width='48' height='48' fill='none'/%3E%3Cg id='Group_8092' data-name='Group 8092' transform='translate(-9.57 -5.057)'%3E%3Cpath id='Path_11014' data-name='Path 11014' d='M32.217,54.031a2.6,2.6,0,0,0-3.378,1.446L26.58,61.841a2.58,2.58,0,0,0,4.714,2.1c.03-.068.058-.137.082-.208l2.292-6.364A2.58,2.58,0,0,0,32.217,54.031Z' transform='translate(-5.25 -22.051)' fill='%23008ba7'/%3E%3Cpath id='Path_11015' data-name='Path 11015' d='M23.859,32.236a4.659,4.659,0,1,0,0,.028Z' transform='translate(0 -9.696)' fill='%23008ba7'/%3E%3Cpath id='Path_11016' data-name='Path 11016' d='M63.423,47.181,55.845,24.993a5.387,5.387,0,0,0-5.14-3.323H43.1l3.378-10.882a2.8,2.8,0,0,0-2.29-3.367,3.145,3.145,0,0,0-3.638,1.835L35.611,25.034a2.536,2.536,0,0,0-.1,1.057v.179a4.848,4.848,0,0,0,5.067,4.594h4.605L38.854,47.2a2.737,2.737,0,0,0,1.835,3.573,3.158,3.158,0,0,0,3.937-1.619l0-.009,6.914-17.824,6.1,17.788a3.177,3.177,0,0,0,3.952,1.659,2.727,2.727,0,0,0,1.83-3.583Z' transform='translate(-11.04 0)' fill='%23008ba7'/%3E%3C/g%3E%3C/svg%3E%0A",
"Boxing":"data:image/svg+xml,%3Csvg id='Box' xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg id='Group_8094' data-name='Group 8094' transform='translate(-686 -888)'%3E%3Crect id='Bounding_Box' data-name='Bounding Box' width='48' height='48' transform='translate(686 888)' fill='none'/%3E%3Cg id='Group_8090' data-name='Group 8090' transform='translate(692.148 894.986)'%3E%3Cg id='Group_7156' data-name='Group 7156'%3E%3Cpath id='Path_10970' data-name='Path 10970' d='M25.448,14.133A6.993,6.993,0,0,1,30.24,17.19a8.142,8.142,0,0,1-.033,5.767c-.578,1.6-1.008,3.288-.281,4.742-2.908.6-5.85,1.124-8.742,1.735a9.866,9.866,0,0,0-1.421-9.915,12.905,12.905,0,0,0,5.42-.876l-.3-.876c-2.759.909-4.792,1.091-6,.6a2.427,2.427,0,0,1-1.322-1.273,5.318,5.318,0,0,1-.463-2.148C19.978,14.447,22.705,13.7,25.448,14.133Zm-9.287.859a6.329,6.329,0,0,0,.562,2.512,3.365,3.365,0,0,0,.81,1.091,5.562,5.562,0,0,1-5.635-.661C12.823,16,14.261,14.81,16.161,14.992ZM31.414,17.52l7.915,1.24a.692.692,0,0,1,.314.38,10.366,10.366,0,0,1,.347,3.255l-6.957,4.693-2.148.43c-.81-1.437-.248-2.941.2-4.263A8.672,8.672,0,0,0,31.414,17.52Zm-19.8,1.355a6.787,6.787,0,0,0,6.693.347c2.941,3.52,3.437,6.709,1.685,10.691-2.561,1.107-5.437,1.289-7.37-.859a7.032,7.032,0,0,1-1.5-3.7A18,18,0,0,1,11.617,18.875Zm29.216,4.082a11.789,11.789,0,0,1,4.412,3.288,15.543,15.543,0,0,1,2.132,4.875,79.5,79.5,0,0,1-6.792,5.024,20.046,20.046,0,0,0-6.692-8.494ZM32.9,28.063c2.991,2.2,5.949,5.585,6.974,8.923v1.107a24.608,24.608,0,0,1-13.005,9.485,12.761,12.761,0,0,1-6.329-3.635,9.76,9.76,0,0,1-2.974-6.527c.413-1.107,1.587-1.967,2.545-2.892a14.287,14.287,0,0,0,4.131-.942l-.3-.892a14.886,14.886,0,0,1-3.668.909,2.832,2.832,0,0,1,1.256-3.288Z' transform='translate(-11.003 -14.004)' fill='%23008ba7'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
"Dance":"data:image/svg+xml,%3Csvg id='Dance' xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect id='Bounding_Box' data-name='Bounding Box' width='48' height='48' fill='none'/%3E%3Cpath id='Path_11183' data-name='Path 11183' d='M21.72,48.28c-.721-.1-1.01-.673-1.25-1.3C19.46,44.289,18.354,41.644,17.3,39a2.023,2.023,0,0,1-.048-1.587c1.01-2.693,1.972-5.338,2.982-8.031a2.536,2.536,0,0,0,.144-.577V21.4a.644.644,0,0,0-.048-.24,3.315,3.315,0,0,0-.192.481L18.69,25.245A1.708,1.708,0,0,1,16.43,26.4l-6.348-1.587a1.67,1.67,0,0,1-1.395-1.827,1.616,1.616,0,0,1,2.02-1.443c.914.192,1.827.433,2.741.673.818.192,1.683.433,2.549.625.048-.144.144-.289.192-.433.866-2.116,1.683-4.232,2.549-6.348a2.063,2.063,0,0,1,1.587-1.346c2.645-.529,5.242-1.058,7.887-1.587a1.931,1.931,0,0,1,1.875.577c1.154,1.2,2.356,2.356,3.559,3.559a2.667,2.667,0,0,1,.289.385c1.346-.866,2.549-1.731,3.8-2.549a1.675,1.675,0,0,1,2.308,2.4,1.924,1.924,0,0,1-.577.481c-1.491,1.01-3.03,2.02-4.52,3.03a1.8,1.8,0,0,1-2.6-.24l-3.222-3.222c-.1-.1-.24-.192-.385-.337v20.1a1.3,1.3,0,0,0,.24.721c1.395,1.875,2.837,3.751,4.28,5.674a2.255,2.255,0,0,1,.433,1.058,1.5,1.5,0,0,1-1.106,1.683,1.577,1.577,0,0,1-1.875-.625c-1.346-1.827-2.645-3.655-4.088-5.434a6.551,6.551,0,0,1-1.443-3.655c-.192-1.972-.529-3.9-.769-5.915a2.945,2.945,0,0,0-.192.289c-1.01,2.356-2.068,4.665-3.078,7.021a1.172,1.172,0,0,0,0,.577c.818,2.26,1.587,4.52,2.4,6.781.481,1.395.337,2.164-1.106,2.693C22.393,48.28,21.96,48.328,21.72,48.28ZM42.594,27.042a3.615,3.615,0,0,0-2.453-3.462,6.517,6.517,0,0,0-2.885-.144c-.625.1-.769.289-.769.914v6.059a1.331,1.331,0,0,1-.048.433,3.026,3.026,0,0,0-2.982.914,1.687,1.687,0,0,0,.577,2.789,2.71,2.71,0,0,0,3.8-2.5c-.048-1.731,0-3.462,0-5.242,0-.625.24-.818.866-.818a5.226,5.226,0,0,1,.866.048c1.346.192,2.549.529,3.03,2.02ZM22.874,5a3.9,3.9,0,1,0,3.9,3.9A3.91,3.91,0,0,0,22.874,5Z' transform='translate(-1.635 -2.648)' fill='%23008ba7' fill-rule='evenodd'/%3E%3C/svg%3E%0A",
"Exercise":"data:image/svg+xml,%3Csvg id='Exercise' xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect id='Bounding_Box' data-name='Bounding Box' width='48' height='48' fill='none'/%3E%3Cg id='Group_8089' data-name='Group 8089' transform='translate(8.285 2.201)'%3E%3Ccircle id='Ellipse_80' data-name='Ellipse 80' cx='4.061' cy='4.061' r='4.061' transform='translate(11.203 7.953)' fill='%23008ba7'/%3E%3Cpath id='Path_10963' data-name='Path 10963' d='M36.115,30.206c-.339-.225-.667-.427-.981-.611V18.82a12.738,12.738,0,0,0,1.292-1.944,12.99,12.99,0,0,0,1.6-6.195C38.034,7.721,36.959,4.192,33.9.522a1.444,1.444,0,1,0-2.222,1.845c2.692,3.256,3.452,6.04,3.46,8.314a10.32,10.32,0,0,1-2.09,6.121H27.457a10.32,10.32,0,0,1-2.09-6.121c.007-2.274.767-5.058,3.46-8.314A1.444,1.444,0,1,0,26.6.522c-3.059,3.67-4.134,7.2-4.126,10.159a12.978,12.978,0,0,0,1.6,6.195A12.7,12.7,0,0,0,25.37,18.82V29.595q-.471.275-.98.611A30.038,30.038,0,0,0,15.3,40.19a2.257,2.257,0,1,0,3.882,2.3,25.535,25.535,0,0,1,7.692-8.52A14.323,14.323,0,0,1,29.4,32.619c.293-.118.513-.19.645-.23.066-.02.111-.032.132-.038h0c.024-.005.047-.014.071-.02s.048.015.073.021.105.027.233.069c1.158.39,6.144,2.309,10.759,10.071a2.257,2.257,0,1,0,3.883-2.3A30.032,30.032,0,0,0,36.115,30.206Z' transform='translate(-14.989 0)' fill='%23008ba7'/%3E%3C/g%3E%3C/svg%3E%0A",
"MartialArts":"data:image/svg+xml,%3Csvg id='Martial-Arts' xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect id='Bounding_Box' data-name='Bounding Box' width='48' height='48' fill='none'/%3E%3Cg id='Group_8093' data-name='Group 8093' transform='translate(3.537 2.289)'%3E%3Ccircle id='Ellipse_89' data-name='Ellipse 89' cx='4.478' cy='4.478' r='4.478' transform='translate(15.984 0)' fill='%23008ba7'/%3E%3Cpath id='Path_10979' data-name='Path 10979' d='M12.434,34.133A2.431,2.431,0,0,0,11.1,35.973L9.508,47.12a2.438,2.438,0,0,0,2.069,2.758,2.485,2.485,0,0,0,.348.025,2.438,2.438,0,0,0,2.411-2.094l1.411-9.874,7.506-3.71a2.37,2.37,0,0,0,.28-.165,2.406,2.406,0,0,0,.28.165l7.506,3.71,1.411,9.874A2.439,2.439,0,0,0,35.14,49.9a2.412,2.412,0,0,0,.347-.025,2.438,2.438,0,0,0,2.069-2.758L35.964,35.973a2.429,2.429,0,0,0-1.333-1.841l-5.715-2.825V19.419a34.539,34.539,0,0,0,14.39-5.342A1.592,1.592,0,0,0,41.5,11.455,29.506,29.506,0,0,1,31.934,15.6a33.769,33.769,0,0,1-3.409.661c-.416.058-.742.094-.96.115l-.191.017h-7.69A31.89,31.89,0,0,1,5.567,11.455,1.592,1.592,0,1,0,3.76,14.077a34.541,34.541,0,0,0,14.39,5.342V31.308Z' transform='translate(-3.071 -6.302)' fill='%23008ba7'/%3E%3C/g%3E%3C/svg%3E",
"Speech":"data:image/svg+xml,%3Csvg id='Speech' xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect id='Bounding_Box' data-name='Bounding Box' width='48' height='48' fill='none'/%3E%3Cpath id='Path_11182' data-name='Path 11182' d='M13.867,37.384a1.113,1.113,0,0,1-1.473.731L2.379,34.221a1.112,1.112,0,0,1-.522-1.654,11.674,11.674,0,0,0,2.038-6.616,6.215,6.215,0,0,0-.527-2.365c-.153-.379-.338-.781-.589-1.288-.13-.262-.619-1.225-.713-1.413A15.911,15.911,0,0,1,0,13.155,11.683,11.683,0,0,1,11.684,1.471h.557q.267,0,.533.012a11.745,11.745,0,0,1,11.2,12.267l-.038.835,2.4,4.807a2.225,2.225,0,0,1-1.99,3.221h-.425v1.113a1.112,1.112,0,0,1-.54.954l-2.673.936,2.331,1.218a1.111,1.111,0,0,1,.326.787,3.5,3.5,0,0,1-4.031,3.459l-3.514-.541ZM27.52,27.879l-.821-.821a.556.556,0,0,1-.1-.653.778.778,0,0,0,.061-.145,1.12,1.12,0,0,0,.023-.521.911.911,0,0,0-.091-.238.556.556,0,0,1,.1-.651l.828-.828a.555.555,0,0,1,.785,0,.537.537,0,0,1,.07.086,3.28,3.28,0,0,1,.313.594,3.344,3.344,0,0,1-.3,3.069l-.019.029h0a.557.557,0,0,1-.773.146A.608.608,0,0,1,27.52,27.879Zm3.17,3.17-.791-.791a.556.556,0,0,1-.029-.756c.069-.081.126-.151.171-.21a5.567,5.567,0,0,0-.058-6.76q-.047-.059-.111-.135h0a.557.557,0,0,1,.029-.756l.79-.79a.557.557,0,0,1,.787,0l.025.026c.033.037.062.071.087.1a7.792,7.792,0,0,1,.05,9.882q-.057.07-.138.162h0a.556.556,0,0,1-.785.05ZM33.845,34.2l-.788-.788a.556.556,0,0,1-.017-.769l.106-.118a10.016,10.016,0,0,0-.059-13.221l-.047-.052h0a.557.557,0,0,1,.018-.768l.788-.788a.556.556,0,0,1,.787,0l.017.018.021.023a12.241,12.241,0,0,1,.1,16.312q-.052.06-.123.136h0a.557.557,0,0,1-.786.031Z' transform='translate(5 4.531)' fill='%23008ba7' fill-rule='evenodd'/%3E%3C/svg%3E%0A",
"Yoga":"data:image/svg+xml,%3Csvg id='Yoga' xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect id='Bounding_Box' data-name='Bounding Box' width='48' height='48' fill='none'/%3E%3Cg id='Group_8091' data-name='Group 8091' transform='translate(5 4)'%3E%3Cg id='Group_7158' data-name='Group 7158' transform='translate(0 0)'%3E%3Ccircle id='Ellipse_81' data-name='Ellipse 81' cx='5.201' cy='5.201' r='5.201' transform='translate(13.877 0)' fill='%23008ba7'/%3E%3Cpath id='Path_10971' data-name='Path 10971' d='M21.734,29.293h2.4a3.539,3.539,0,0,1,3.3,2l4.1,7.4c.3.5.6,1.2,1,1.8a12.223,12.223,0,0,0,3.2,3.6l2.6,1.9s2.1,1.6,1.4,3c-.8,1.5-3.1.8-6.3-1.1-4.6-2.8-7.8-11.1-7.8-11.1V50.3h-9.4v-13.5s-3.2,8.3-7.8,11.1c-3.2,1.8-5.5,2.5-6.3,1.1-.8-1.5,1.4-3,1.4-3l2.6-1.9a12.219,12.219,0,0,0,3.2-3.6c.4-.6.7-1.3,1-1.8l4.1-7.4a3.834,3.834,0,0,1,3.3-2h4Z' transform='translate(-1.957 -17.692)' fill='%23008ba7'/%3E%3Cpath id='Path_10972' data-name='Path 10972' d='M31.709,83.548a134.754,134.754,0,0,1-22-.5,3.008,3.008,0,0,0-3.3,2.6h0a3.013,3.013,0,0,0,2.7,3.3,141.539,141.539,0,0,0,29.1,0,3.013,3.013,0,0,0,2.7-3.3h0a3.008,3.008,0,0,0-3.3-2.6C35.61,83.248,33.709,83.448,31.709,83.548Z' transform='translate(-4.631 -50.144)' fill='%23008ba7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A"
};

fitnessImage = this.img.Exercise;
ImageYoga = this.img.Yoga;
DanceImage = this.img.Dance;
BoxingImage = this.img.Boxing;
MartialArtsImage = this.img.MartialArts;
AerobicImage = this.img.Aerobic;
SpeechImage = this.img.Speech;

@wire(getAllInstructors)
wiredData({data,error}){
  if(data){
     var result = data;
     console.log('OUTPUT 1.0>>>>: ',result);
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
              "Id" : result[i].ContactId,
              "exp" : (result[i].Contact.BWPS_Type__c == "" ||result[i].Contact.BWPS_Type__c == undefined || result[i].Contact.BWPS_Type__c == null)  ? "" : String(result[i].Contact.BWPS_Type__c).split(";").join(", "),
              "Name": result[i].Contact.Name,
              "Type": instructor +' Instructor',
              "imgUrl": (result[i]?.Contact.BWPS_publicProfileLink__c) ? result[i].Contact.BWPS_publicProfileLink__c : result[i].FullPhotoUrl,
              "description": result[i].Contact.Description ?? '',
                  
            }

      //console.log("@@@Description@@@ : ", obj.description)
      this.Arr.push(obj);
     }
     if(this.Arr.length < 5){
        this.slideButton = false;
     }
     else{
        this.slideButton = true;
     }
     console.log('arr length : ',this.Arr.length);
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

  trueInstructors(event){
    let parent = event.detail.offinstructor;
    this.InstructorDetailView = false;
  }

  InstructorDetailViewhandle(event){
    console.log('event.target.dataset----',JSON.stringify(event.target.dataset, null, 2));
    let dataID = event.currentTarget.dataset.id;
    let dataname = event.currentTarget.dataset.name;
    let dataprofile = event.currentTarget.dataset.pic;
    let dataexp = event.currentTarget.dataset.exp;

    this.InstructorDetailView = true;
    this.Instructor = dataID;
    this.instructorname = dataname;
    this.instructorprofile = dataprofile;
    this.instructorexp = dataexp;
    this.instructorDescription = event.currentTarget.dataset.description ;

    // console.log('this.Instructor----',this.Instructor);
    // console.log('this.instructorname------',this.instructorname);
    // console.log('this.instructorprofile-----',this.instructorprofile);
    // console.log('this.instructorexp-----',this.instructorexp);
    // console.log('DATA_All>>>>>>>>>>>>>>>>',this.Instructor);
    // console.log('InstructorDetailViewhandle' ,this.InstructorDetailView);
    console.log('instructorDescription @@@@@@@@@' ,this.instructorDescription);
  }

}