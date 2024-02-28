import { LightningElement } from 'lwc';
export default class GuestUserYourProfilePage3 extends LightningElement {
    value='';
    x=3;
    get options() {
        return [
            { label: 'I was referred by my Physician', value: 'option1' },
            { label: 'I was reffered by Senior Living Community', value: 'option3' },
            { label: 'A Support group', value: 'option5' },
            { label: 'Other', value: 'option7' }
        ];
    }
    get options1() {
        return [
            { label: 'I was reffered by a health professional e.g. Physical Therapist', value: 'option2' },
            { label: 'I was reffered by a friend', value: 'option4' },
            { label: 'Internet Search', value: 'option6' }
        ];
    }
}