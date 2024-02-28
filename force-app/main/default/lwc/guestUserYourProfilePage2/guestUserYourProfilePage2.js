import { LightningElement } from 'lwc';
export default class GuestUserYourProfilePage2 extends LightningElement {


// //question 1 option
//     get options() {
//         return [
//             { label: `Living with Parkinsons's`, value: 'option1' },
//             { label: 'Living with another movement disorder (ataxia,psp,etc)', value: 'option3' },
//             { label: 'Personal/Medical Aide', value: 'option5' },
        
//         ];
//     }
//     get options1() {
//         return [
//             { label: 'A carepartner', value: 'option2' },
//             { label: `A relative someone with parkinson's (not primary carepartner)` , value: 'option4' },
//             { label: 'other', value: 'option6' }
//         ];
//     }

//     //question 1 option

//       get options3() {
//         return [
//             { label: 'Less then 2 Year ago', value: 'option1' },
//             { label: '7 to 15 years ago', value: 'option3' },
//             { label: `I do not have Parkinson's`, value: 'option5' },
        
//         ];
//     }
//     get options4() {
//         return [
//             { label: '2 to 7 years ago', value: 'option2' },
//             { label:' More then 15 years ago ', value: 'option4' }
           
//         ];
//     }

 handlePrint() {
    window.print();
  }

}