import { LightningElement,wire,api,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import BLOGIMAGE from '@salesforce/schema/BWPS_Resource__c.BWPS_Resource_Image__c';
import ID_FIELD from '@salesforce/schema/BWPS_Resource__c.Id';
import base64_field from '@salesforce/schema/BWPS_Resource__c.BWPS_Image_Base64code__c';
const fieldsvalues = ['BWPS_Resource__c.BWPS_Image_Base64code__c' , 'BWPS_Resource__c.BWPS_Resource_Image__c' , 'BWPS_Resource__c.Id'];
export default class Bwps_WIP_resourceImageUploader extends LightningElement {
     blogImage;
    @api recordId;
    @track blogRec;
    @track imageFile
    fileData
    openfileUpload(event) {
        const file = event.target.files[0]
        var reader = new FileReader()
        console.log('OUTPUT : ',this.recordId);
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': file.name,
                'base64': base64,
                'recordId': this.recordId
            }
            console.log('OUTPUT 2',JSON.stringify(this.fileData));
        }
        reader.readAsDataURL(file)
    }
    @wire(getRecord, { recordId: '$recordId', fields: fieldsvalues })
    wiredRecord({ error, data }) {
        if (error) {
           console.log('Error',error);
        } else if (data) {
            console.log('OUTPUT 3: ',data);
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
                   .then((e) => {
                    console.log('OUTPUT 4: ',JSON.stringify(e));
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Resource updated',
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
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
    }
}