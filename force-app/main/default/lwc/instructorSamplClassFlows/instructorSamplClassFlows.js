import { LightningElement, track, wire, api } from 'lwc';
import myImage from '@salesforce/resourceUrl/ExerciseImage';
import fetchSampleDetail from '@salesforce/apex/BWPS_InstructorResourcesData.fetchSampleDetail';
export default class InstructorSamplClassFlows extends LightningElement {

  myImage = myImage;
  @track response = [];
  @track filteredArr = [];
  @api searchKeyword = '';

  //   response1 =
  //  [
  //    { "text1": "SAMPLE FLOW 1","text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.","date1":"March 23, 2021", "imgUrl":myImage },
  //     { "text1": "SAMPLE FLOW 2","text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.","date1":"March 23, 2021", "imgUrl":myImage },
  //        { "text1": "SAMPLE FLOW 3","text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.","date1":"March 23, 2021", "imgUrl":myImage },
  //           { "text1": "SAMPLE FLOW 4","text2": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.","date1":"March 23, 2021", "imgUrl":myImage }
  //  ]



  @wire(fetchSampleDetail)
  conrecords({ error, data }) {
    if (data) {

      this.response = data;
      console.log("log", JSON.stringify(this.response));
      this.response = JSON.parse(JSON.stringify(data));
      for (let i = 0; i < this.response.length; i++) {

        const str = this.response[i].Date__c;
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var now = new Date(str);
        months[now.getMonth()] + ' ' + now.getDate() + ',' + now.getFullYear()

        this.response[i].Date__c = months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear()
      }
    } else if (error) {
      this.error = error;
      console.log('erroeeee>>>', error);
    }
  }



  get showAllData() {
    if (this.searchKeyword != '') {

      this.filteredArr = (this.response).filter(ele => ((ele.Name).toLowerCase()).includes(this.searchKeyword.toLowerCase()) || ((ele.Description__c).toLowerCase()).includes(this.searchKeyword.toLowerCase()));

      console.log('showdetails4447', this.filteredArr);
      return false;
    }

    else {
      this.filteredArr = [];
      return true;
    }
  }

}