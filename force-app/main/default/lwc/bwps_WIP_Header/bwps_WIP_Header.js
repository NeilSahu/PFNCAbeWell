import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

import HeaderLogo from '@salesforce/resourceUrl/HeaderLogo';
// import imageResoure from '@salesforce/resourceUrl/WebsiteGenFaqImage';
import imageResoure from '@salesforce/resourceUrl/WebsiteGeneralHeader';


export default class Bwps_WIP_Header extends LightningElement {

    // Header_logo = HeaderLogo;
    Header_logo = imageResoure + '/PFNCA_PrimaryLogo_Color_tm_RGB_150dpi-1@2x.png';

    img_Home = imageResoure + '/Home.svg';
    img_Browse_Classes = imageResoure + '/Browse_Classes.svg';
    img_How_to_Participate = imageResoure + '/How_to_Participate.svg';
    img_FAQs = imageResoure + '/FAQs.svg';
    img_Blog = imageResoure + '/Blog.svg';
    img_About = imageResoure + '/About@2x.png';
    img_Contact = imageResoure + '/Contact.svg';
    img_Close = imageResoure + '/Close.svg';
    img_MenuActive = imageResoure + '/Menu.svg';
    img_MenuDisabled = imageResoure + '/manugray.svg';
    img_Menu = this.img_MenuActive;
    
    mobileLoginClass = ''; //for removing button on mobile ui login page only
    menuStyle = '';
    closeBackgroundImage = `background-image: url(${this.img_Close})`;

    url_string = '';
    activeMenu = 'Home';
    img_ActiveMenu = this.img_Home;


    connectedCallback() {
        this.url_string = window.location.href;
        console.log('URL >>>>>>>>>>>>>>>>>> : ',this.url_string); 
    }
    renderedCallback(){
      if(this.url_string.includes("bwps-wip-browseclasses")){
          this.template.querySelector(`[data-id='browseclasses']`).className = 'menuItemClass font-800';
          
          this.img_ActiveMenu = this.img_Browse_Classes;
          this.activeMenu = 'Browse Classes';
      }
      else if(this.url_string.includes("bwps-wip-howtoparticipate")){
          this.template.querySelector(`[data-id='howtoparticipate']`).className = 'menuItemClass font-800';

          this.img_ActiveMenu = this.img_How_to_Participate;
          this.activeMenu = 'How To Participate';
      }
      else if(this.url_string.includes("bwps-wip-faqs")){
          this.template.querySelector(`[data-id='faqs']`).className = 'menuItemClass font-800';

          this.img_ActiveMenu = this.img_FAQs;
          this.activeMenu = 'FAQs';
      }
      else if(this.url_string.includes("bwps-wip-blog")){
          this.template.querySelector(`[data-id='blog']`).className = 'menuItemClass font-800';

          this.img_ActiveMenu = this.img_Blog;
          this.activeMenu = 'Blog';
      }
      else if(this.url_string.includes("bwps-wip-aboutus")){
          this.template.querySelector(`[data-id='aboutus']`).className = 'menuItemClass font-800';

          this.img_ActiveMenu = this.img_About;
          this.activeMenu = 'About Us';
      }
      else if(this.url_string.includes("bwps-wip-contactus")){
          this.template.querySelector(`[data-id='contactus']`).className = 'menuItemClass font-800';

          this.img_ActiveMenu = this.img_Contact;
          this.activeMenu = 'Contact Us';
      }

      if(this.url_string.includes("bwps-wip-signin")){
          this.mobileLoginClass = 'm-login-link';
      }
      if(this.url_string.includes("bwps-wip-donationpage")){
        this.template.querySelector(`[data-donate='donate']`).className = 'box-blue-button donateDisableClass';
      }
      if(this.url_string.includes("bwps-wip-signin")){
        this.template.querySelector(`[data-login='login']`).className = 'box-white-button donateDisableClass';
      }
    }

    handleNavModalClose(event){
        let tabletLinkBox =  this.template.querySelectorAll('.tablet-link-box');
        tabletLinkBox.forEach(currentItem => {
            currentItem.style = 'display: none;'
        });

            this.img_Menu = this.img_MenuActive;
        this.menuStyle = '';



    }
    handleNavModalOpen(event){
        let tabletLinkBox =  this.template.querySelector('.tablet-link-box');
        tabletLinkBox.style = 'display: block;'

        this.img_Menu = this.img_MenuDisabled;
        this.menuStyle = 'color: #DEE2E6';
    }
openNavigateToDonatePage(){
         const paymentComp = this.template.querySelector('c-bwps_-Donor-Dashboard-Donate-Form');
         paymentComp.donateClickHandler();
    }

    handleMobileNavModalClose(){
        let mobileModal = this.template.querySelector(`[data-id="m-header-main"]`);
        mobileModal.style = `display: none`;

        let mobileTop = this.template.querySelector(`[data-id="m-header-top"]`);
        mobileTop.style = `display: flex`;
    }
    handleMobileNavModalOpen(){
        let mobileModal = this.template.querySelector(`[data-id="m-header-main"]`);
        mobileModal.style = `display: block`;

        let mobileTop = this.template.querySelector(`[data-id="m-header-top"]`);
        mobileTop.style = `display: none`;


    }

}