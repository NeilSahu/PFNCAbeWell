import { LightningElement, api } from 'lwc';
export default class ShareClassForm extends LightningElement {

    @api getIdFromParent ;

  constructor(){
      console.log('log',getIdFromParent);
  }
}