import { LightningElement ,track,api, wire} from 'lwc';
import bloges from '@salesforce/apex/bwps_WIP_blogsController.getBlogs';
export default class Bwps_chargentParent extends LightningElement {
    // @track recordIdee = '0063C00000JqblPQAR';
    // @track amount=300;
    // @track gatewayId = 'a173C000002vIIvQAM';
@track dataOfBlogs =[];
@wire(bloges)
wiredData({ data, error }) {
if(data){
    if(data != null && data != '' && data != undefined){
     console.log('data .>>> ',JSON.stringify(data));  
     for(let i = 0 ; i < data.length; i++){
    var imgString = `data:image/png;base64,${data[i].BWPS_Image_Base64code__c}`;
    console.log('immmge>>> ',imgString);
      const obj ={
       image : imgString,
       id:data[i].Id,
      }
      this.dataOfBlogs.push(obj);
     }
     console.log('dfghjihgcfvgh>> ',JSON.stringify(this.dataOfBlogs))
    }
} else {
    console.log('Data>> ',JSON.stringify(error));
}
}
renderedCallback(){
    // console.log('inside render>>> ' ,JSON.stringify(this.dataOfBlogs));
    // if( this.dataOfBlogs.length > 0){
    //     console.log('inside render length calsculat');
    //     this.template.querySelector('.imageShow').innerHTML =  this.dataOfBlogs[0].BWPS_Blog_Image__c;
    // }
}

}