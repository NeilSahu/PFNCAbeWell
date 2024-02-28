import { LightningElement, track } from 'lwc';
import downarrow from "@salesforce/resourceUrl/downarrow";
import uparrow from "@salesforce/resourceUrl/uparrow";

export default class Pfnca_main_pagescrollbuttons extends LightningElement {

    downarrowURL = `${downarrow}#downarrow`;
    uparrowURL = `${uparrow}#uparrow`;

    @track isDivVisible = true;
    @track isDivVisibleDown = true; // Use this variable to track the visibility of the div

    connectedCallback() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('scroll', this.handleScrollDown.bind(this));
        this.handleScroll();
    }

    disconnectedCallback() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        window.removeEventListener('scroll', this.handleScrollDown.bind(this));
    }

    topFunction() {
        const scrollY = window.scrollY || window.pageYOffset;
        const viewportHeight = window.innerHeight;

        const scrollOptions = {
            left: 0,
            top: scrollY - viewportHeight * 1.8,
            behavior: 'smooth'
        }
        window.scrollTo(scrollOptions);
    }

    DownFunction() {
        const scrollY = window.scrollY || window.pageYOffset;
        const viewportHeight = window.innerHeight;
        const scrollOptionsdown = {
            left: 0,
            top: scrollY + viewportHeight * 1.8,
            behavior: 'smooth'
        }
        window.scrollTo(scrollOptionsdown);
    }

    handleScroll() {
        // Get the scroll position of the window
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

        // Determine the desired condition to hide the div based on the scroll position
        const shouldHideDiv = scrollTop == 0; // Change this condition as needed

        // Update the visibility of the div based on the condition
        this.isDivVisible = !shouldHideDiv;

        //if(this.isDivVisible == false){
        // this.template.querySelector(`[data-intensity='scrollup']`).classList.add('hide');
        //}
    }

    handleScrollDown() {
        // Get the scroll position of the window
        //const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        // Determine the desired condition to hide the div based on the scroll position
        //const shouldHideDiv = scrollTop >0; // Change this condition as needed
        // Update the visibility of the div based on the condition
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );

        // Get the visible height of the window
        const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        // Determine the desired condition to hide the div based on the scroll position
        const shouldHideDiv = scrollTop + windowHeight >= documentHeight; // Change this condition as needed

        console.log('shouldHideDiv ',shouldHideDiv);
        this.isDivVisibleDown = !shouldHideDiv;
        console.log('isDivVisibleDown ',this.isDivVisibleDown);

    }

}