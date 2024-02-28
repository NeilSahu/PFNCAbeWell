import { LightningElement } from 'lwc';

export default class Bwps_WIP_HomePageRunningCards extends LightningElement {
data = [1,2,3,4,5,6,7,8,9,10,11,12];
click=0;

next(event){
    console.log('nexxxt>>>>>>Press');
    
        if( this.click != 0){
        this.click -=1;
        }
        var topDiv = this.template.querySelector('[data-id="container"]');
        
        console.log('valueofsss',typeof(topDiv.scrollLeft), '>>>>>>>>', this.click );
        topDiv.scrollLeft = this.click *463.1111145019531 ;
        console.log('valueofsss',topDiv.scrollLeft , '>>>>>>>>', this.click );
        
};
preview(){
    console.log('preview>>>>>>Press'+ this.data.length-3);
    if(this.data.length-4>= this.click){
        this.click +=1; 
    }
    var topDiv = this.template.querySelector('[data-id="container"]');
    console.log('valueofsss',topDiv.scrollLeft)
    topDiv.scrollLeft =this.click *463.1111145019531;
    console.log('valueofsss',topDiv.scrollLeft , '>>>>>>>>', this.click );
};

}