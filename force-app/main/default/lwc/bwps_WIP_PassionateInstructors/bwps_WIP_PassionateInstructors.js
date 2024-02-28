import { LightningElement } from 'lwc';
import INSTRUCTOR_SLIDER_IMAGES from '@salesforce/resourceUrl/WebsiteGeneralFiles';

export default class Bwps_WIP_PassionateInstructors extends LightningElement {
    data = {
        "instructors": [
            { "name": "SANDY DOWNING 1", "exp": "Excercise Instructor", "imgUrl": `${INSTRUCTOR_SLIDER_IMAGES}/WebsiteGeneralFiles/PassionateInstructor.jpg` },
            { "name": "SHAHANA AILUS 2", "exp": "Excercise Instructor", "imgUrl": `${INSTRUCTOR_SLIDER_IMAGES}/WebsiteGeneralFiles/PassionateInstructor.jpg` },
            { "name": "KRISTEN BODENSTEINER 3", "exp": "Danse Instructor", "imgUrl": `${INSTRUCTOR_SLIDER_IMAGES}/WebsiteGeneralFiles/PassionateInstructor.jpg` },
            { "name": "KIM BROOKS 4", "exp": "Yoga Instructor", "imgUrl": `${INSTRUCTOR_SLIDER_IMAGES}/WebsiteGeneralFiles/PassionateInstructor.jpg` },
            { "name": "KIM BROOKS 5", "exp": "Yoga Instructor", "imgUrl": `${INSTRUCTOR_SLIDER_IMAGES}/WebsiteGeneralFiles/PassionateInstructor.jpg` },
            { "name": "KRISTEN BODENSTEINER 6", "exp": "Danse Instructor", "imgUrl": `${INSTRUCTOR_SLIDER_IMAGES}/WebsiteGeneralFiles/PassionateInstructor.jpg` },
            { "name": "KIM BROOKS 7", "exp": "Yoga Instructor", "imgUrl": `${INSTRUCTOR_SLIDER_IMAGES}/WebsiteGeneralFiles/PassionateInstructor.jpg` },
            { "name": "KIM BROOKS 8", "exp": "Yoga Instructor", "imgUrl": `${INSTRUCTOR_SLIDER_IMAGES}/WebsiteGeneralFiles/PassionateInstructor.jpg` }
        ]
    }

    //slider functionality
    handlePrev(event) {
        this.template.querySelector(".slider").scrollLeft -= 210;
    }
    handleNext(event) {
        this.template.querySelector(".slider").scrollLeft += 210;
    }
}