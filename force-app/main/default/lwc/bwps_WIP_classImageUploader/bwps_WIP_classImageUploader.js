import { LightningElement,api,wire ,track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import BLOGIMAGE from '@salesforce/schema/Class__c.BWPS_Class_Image__c';
import ID_FIELD from '@salesforce/schema/Class__c.Id';
import base64_field from '@salesforce/schema/Class__c.BWPS_Image_Base64code__c';
const fieldsvalues = ['Class__c.BWPS_Image_Base64code__c' , 'Class__c.BWPS_Class_Image__c' , 'Class__c.Id'];
export default class Bwps_WIP_ClassImageUploder extends LightningElement {
    blogImage;
    @api recordId;
    @track blogRec;
    @track imageFile
    fileData
    openfileUpload(event) {
        const file = event.target.files[0]
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': file.name,
                'base64': base64,
                'recordId': this.recordId
            }
            console.log(JSON.stringify(this.fileData))
        }
        reader.readAsDataURL(file)
    }
    @wire(getRecord, { recordId: '$recordId', fields: fieldsvalues })
    wiredRecord({ error, data }) {
        if (error) {
           console.log(error);
        } else if (data) {
            if(data != undefined && data != null && data != ''){
            this.blogRec = data;
            if(this.blogRec.fields.BWPS_Image_Base64code__c.value != null && this.blogRec.fields.BWPS_Image_Base64code__c.value != undefined
            && this.blogRec.fields.BWPS_Image_Base64code__c.value != ''){
               this.imageFile = `data:image/png;base64,${this.blogRec.fields.BWPS_Image_Base64code__c.value}`;
             }
            }
        }
    }
      

    handleClick(){
        console.log('Submit Click');
      let fields = {};
            fields[ID_FIELD.fieldApiName] = this.recordId;
            fields[BLOGIMAGE.fieldApiName] = `<img src="data:image/png;base64,${this.fileData.base64}" alt="Red dot" />`;
             fields[base64_field.fieldApiName] = this.fileData.base64;
            let recordInput = { fields };
              console.log('Submit Click',JSON.stringify(recordInput));
          updateRecord(recordInput)
                   .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Blog updated',
                            variant: 'success'
                        })
                    );
                    // Display fresh data in the form
                    return refreshApex(this.blogRec);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error.body.message ,
                            variant: 'error'
                        })
                    );
                });
    }
 renderedCallback(){
//      console.log('contant>>>>> ', JSON.stringify(this.blogRec));
//      console.log('Image Tag>> ',getFieldValue(this.blogRec.data, BLOGIMAGE));
//     if(getFieldValue(this.blogRec.data, BLOGIMAGE) != null && getFieldValue(this.blogRec.data, BLOGIMAGE) != '' 
//     && getFieldValue(this.blogRec.data, BLOGIMAGE) != undefined){
//      this.template.querySelector('[data-id="blog-image"]').innerHtml = getFieldValue(this.blogRec.data, BLOGIMAGE);
//     }
  }
}