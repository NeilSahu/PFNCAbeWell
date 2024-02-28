import { LightningElement, wire, track } from 'lwc';
import getAllInstructors from '@salesforce/apex/BWPS_getInstructorsData.getAllInstructorsData';

export default class Pfnca_main_passionateinstructors extends LightningElement {

    @track InstructorDetailView = false;
    @track Arr = [];
    @track slideButton = false;
    @track instemp = [];
    @track instructors = [];
    click = 0;
    Instructor;
    instructorprofile;
    instructorname;
    instructorexp;
    @track instructorDescription = '';

    @wire(getAllInstructors)
    wiredData({ data, error }) {
        if (data) {
            var result = data;
            console.log('getAllInstructorsData: ', result);

            for (let i = 0; i < result.length; i++) {

                var instructorType = [];
                var instructor = [];

                if (result[i].Contact.hasOwnProperty('BWPS_Type__c')) {

                    instructorType = result[i].Contact.BWPS_Type__c.split(';');

                    for (let j = 0; j < instructorType.length; j++) {
                        instructorType[j] = " " + instructorType[j];
                        instructor.push(instructorType[j]);
                    }
                }
                console.log('instructor array: ', JSON.stringify(instructor));

                var obj = {
                    "Id": result[i].ContactId,
                    "exp": (result[i].Contact.BWPS_Type__c == "" || result[i].Contact.BWPS_Type__c == undefined || result[i].Contact.BWPS_Type__c == null) ? "" : String(result[i].Contact.BWPS_Type__c).split(";").join(", "),
                    "Name": result[i].Contact.Name,
                    "Type": instructor + ' Instructor',
                    "imgUrl": (result[i]?.Contact.BWPS_publicProfileLink__c) ? result[i].Contact.BWPS_publicProfileLink__c : result[i].FullPhotoUrl,
                    "description": result[i].Contact.Description ?? '',
                }
                this.Arr.push(obj);
            }

            if (this.Arr.length < 5) {
                this.slideButton = false;
            }
            else {
                this.slideButton = true;
            }
            console.log('instructor data array: ', JSON.stringify(this.Arr));
        } else if (error) {
            console.log('Error: ' + error);
        }
    }

    InstructorDetailViewhandle(event) {
        console.log('InstructorDetailViewhandle: ', JSON.stringify(event.target.dataset, null, 2));
        let dataID = event.currentTarget.dataset.id;
        let dataname = event.currentTarget.dataset.name;
        let dataprofile = event.currentTarget.dataset.pic;
        let dataexp = event.currentTarget.dataset.exp;

        this.InstructorDetailView = true;
        this.Instructor = dataID;
        this.instructorname = dataname;
        this.instructorprofile = dataprofile;
        this.instructorexp = dataexp;
        this.instructorDescription = event.currentTarget.dataset.description;

        // console.log('this.Instructor----',this.Instructor);
        // console.log('this.instructorname------',this.instructorname);
        // console.log('this.instructorprofile-----',this.instructorprofile);
        // console.log('this.instructorexp-----',this.instructorexp);
        // console.log('DATA_All>>>>>>>>>>>>>>>>',this.Instructor);
        // console.log('InstructorDetailViewhandle' ,this.InstructorDetailView);
        // console.log('instructorDescription: ', this.instructorDescription);
    }

    handlePrev(event) {
        this.template.querySelector(".slider").scrollLeft -= 368;
    }

    handleNext(event) {
        this.template.querySelector(".slider").scrollLeft += 368;
    }

    trueInstructors(event) {
        let parent = event.detail.offinstructor;
        this.InstructorDetailView = false;
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

}