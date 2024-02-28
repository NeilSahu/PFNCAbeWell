import { LightningElement } from 'lwc';

export default class Bwps_DonorProfile extends LightningElement {
    
    showAccountInfo = true;

    handleSidebar(event){
        // console.log("-----____-----", event.target.dataset.id)
       let  dataId = event.target.dataset.id;

    //    if (dataId == "accountInfo"){
    //     this.showAccountInfo = true;
    //     this.template.querySelector('[data-id="accountInfo"]').classList.toggle("active");
    //     this.template.querySelector('[data-id="paymentMethod"]').classList.toggle("active");
    //    }
    //    else if (dataId == "paymentMethod"){
    //     this.showAccountInfo = false;
    //     this.template.querySelector('[data-id="accountInfo"]').classList.toggle("active");
    //     this.template.querySelector('[data-id="paymentMethod"]').classList.toggle("active");
    //    }
    
    }
}