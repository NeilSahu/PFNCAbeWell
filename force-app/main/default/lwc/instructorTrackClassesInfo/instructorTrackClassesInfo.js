import { LightningElement,wire,track } from 'lwc';
import getClassCount from '@salesforce/apex/DNA_InstructorClass.getClassCount';
export default class InstructorTrackClassesInfo extends LightningElement {
@track classCount;
@track studentCount;
@track Name;
@track Email;
@wire(getClassCount)
    wiredCount({ error, data }) {
        if (data) {
            var data = data;
            this.studentCount = data.Attendee;
            this.classCount = data.Class;
            console.log('OUTPUT : ',data);
            this.Name = data.Name;
            this.Email = data.Email;
            // for(let i=0;i<data.length;i++){
            //     console.log('NAME & EMAIL : ',data[i].Attendee_Name_del__r.Name, this.Email);
            // }
            
        } else if (error) {
            var error = error;
            
        }
    }
}