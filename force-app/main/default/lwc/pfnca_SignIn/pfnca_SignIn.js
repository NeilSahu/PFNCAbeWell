import { LightningElement } from 'lwc';
import SIGNIN_IMAGE from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import doLogin from '@salesforce/apex/bwps_SignIn.doLogin';
export default class Pfnca_SignIn extends LightningElement {
 signinImage = `${SIGNIN_IMAGE}/WebsiteGeneralFiles/SignInPageImage.png`;  
    username= '';
    password= '';
    get backgroundStyle() {
        return `height:45rem;background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        position: relative;background-image:url(${this.signinImage})`;
       }
    getUsername(evt){
        this.username = evt.target.value; 
        console.log("Username>>>>>>>>>>>> ", this.username);
    }
    getPassword(evt ){
        this.password = evt.target.value; 
        console.log("password>>>>>>>>>>>> ", this.password);
    }
    signInClickHandle(){
        doLogin({ username: this.username, password: this.password })
              .then((result) => {
                console.log("result:>>>>>>>>>>> ",result);
              if(result.includes("failed")){
                console.log("object");
                alert(result);
                // this.template.querySelector('[data-id="errorInput"]').style="color:red";
                // this.template.querySelector('[data-id="myInput"]').style="color:red";
              }
              else{
                console.log("else part " );
                // let res = result;
                window.location.href =res;
              }
          });
    }

    get getAGuestPassLink(){
      return '/PFNCADNA/s/bwps-wip-getaguestpass'
    }

    get becomeAMemberLink(){
      return '/PFNCADNA/s/bwps-wip-becomeamember';
    }

}