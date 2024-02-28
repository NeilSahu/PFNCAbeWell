import { LightningElement, track, wire } from 'lwc';
import backArrow from '@salesforce/resourceUrl/backArrow';
import searchlogo from '@salesforce/resourceUrl/searchlogo';
import greenTick from '@salesforce/resourceUrl/greenRight';
import redCross from '@salesforce/resourceUrl/redCross';
import blurRight from '@salesforce/resourceUrl/blurRight';
import blurCross from '@salesforce/resourceUrl/blurCross';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import previous from '@salesforce/resourceUrl/previous';
import download from '@salesforce/resourceUrl/download';
import addIcon from '@salesforce/resourceUrl/InstructorDashboardAddIcon';
import MinusIcon from '@salesforce/resourceUrl/InstructorDashboardMinusIcon';
import BWPS_GetUser from '@salesforce/apex/BWPS_InsDashboardTakeAttendanceClass.BWPS_GetUser';
import takeAttendence from '@salesforce/apex/BWPS_InsDashboardTakeAttendanceClass.BWPS_GetAttendance';
//import BWPS_GetAllUsers from '@salesforce/apex/BWPS_InsDashboardTakeAttendanceClass.BWPS_GetAllUsers';
import BWPS_GetFilterUsers from '@salesforce/apex/BWPS_InsDashboardTakeAttendanceClass.BWPS_GetFilterUsers';
import BWPS_GetAttendeeFromCon from '@salesforce/apex/BWPS_InsDashboardTakeAttendanceClass.BWPS_GetAttendeeFromCon';
import BWPS_GetAttendeeName from '@salesforce/apex/BWPS_InsDashboardTakeAttendanceClass.BWPS_GetAttendeeName';
import { CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import fetchUserDetail from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
import imageResource from '@salesforce/resourceUrl/WebsiteGenFaqImage';

export default class TakeAttendanceInstructorDashboard extends LightningElement {


    backIcom = imageResource + "/chevron-1.svg";

    date;
    year;
    monthNo;
    month;
    day;
    @track contactIds = [];
    //@track ScheduleClassName;
    monthsec = false;
    fulldate;
    fullweek;
    fullmonth;
    wiredUsers;
    sundayDate = new Date();
    saturdayDate = new Date();
    @track userFirstName;
    userData;
    wiredSch;
    @track showButton = false;
    @track showNextButton = true;
    @track loadContact = false;
    @track systemTodaysDate;
    @track selectedClassDate;
    allContacts;
    filterContacts;
    // renderedCallback() {
    //     if(this.initialCount == 0){
    //         this.initialDate();
    //         this.initialCount++;
    //         console.log("render1");
    //     }
    //     else if(this.initialCount>1){
    //         console.log("render2");
    //         this.showPresentAbsentData();
    //     }
    // }
    months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    weeks = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    // dayBtn = true;
    // weekBtn = false;
    // monthBtn =false;

    updatedDate = new Date();
    @track input = '';
    @track searchlogo = searchlogo;
    @track addIcon = addIcon;
    @track MinusIcon = MinusIcon;
    @track backIcon = backArrow;
    @track green = greenTick;
    @track red = redCross;
    @track blurRightIcon = blurRight;
    @track blurCrossIcon = blurCross;
    @track userImg = `${allIcons}/PNG/Instructor-Image.png `;
    previous = `${allIcons}/PNG/GO.png `;
    download = `${allIcons}/PNG/Download.png `;
    @track AttendanceImage2 = blurCross;
    @track AttendanceImage1 = blurRight;
    @track showPopUp = false;
    @track showNextPopUp = false;
    @track userArray = [];
    activeLink1 = false;
    activeLink2 = false;
    wiredUser;
    @track JSONArray = [];
    error;
    @track attendeelist;
    @track id;
    attendance;
    base64Data;
    @track temp = [];
    result;
    getStateParameters;
    schlnId;
    @track arr = [];
    decodeTime;
    decodeid;
    decodeDate;
    @track enrolledUser;
    @track searchResultArray = [];
    schName;
    schTime;
    checktoday = false;
    urlDate;
    noData;
    initialCount = 0;
    intialDateObj;
    wiredSchClassName;
    @track className;
    @track weekday;
    @track plusMinus;
    @track JSONConId = '';
    @track addNewUserArr = [];
    splitUpdatedDate;
    // showing date initial without any operation od function call
    @track availableIds = [];
    @track availableArray = [];
    @track noClassMsg;
    @track showmsg = false;
    @track headingButton = true;
    @track finalUserArr = [];
    // @track isLoading = false;
    // initialDate() {
    //     refreshApex(this.getStateParameters);

    //     console.log('Fulldate',this.fulldate);

    //     this.template.querySelector(".fullDate").innerHTML = this.fulldate;
    //     this.updatedDate = new Date(this.result.ClassDate);
    //     if(this.intialDateObj == new Date()){
    //         this.checktoday = true;
    //     }
    //     // let todayDate =new Date();
    //     // if(this.intialDateObj.getDate()==todayDate.getDate() && this.intialDateObj.getFullYear()==todayDate.getFullYear() && this.intialDateObj.getMonth()==todayDate.getMonth()){
    //     //     this.showNextButton=false;
    //     //     this.showButton=true;
    //     // }
    //     // else{
    //     //         this.showNextButton=true;
    //     //          this.showButton=false;
    //     // }
    // }
    // changeDateFormat() {
    //     this.day = this.updatedDate.getDate();
    //     this.monthNo = this.updatedDate.getMonth();
    //     this.month = this.months[this.monthNo];
    //     this.year = this.updatedDate.getFullYear();
    //     this.fulldate = this.month + " " + this.day + ", " + this.year;
    //     console.log("full Date: ", this.fulldate);
    //     this.template.querySelector(".fullDate").innerHTML = this.fulldate;
    // }

    // nextClickHandler() {
    //     this.loadContact = true;
    //     // this.showmsg = false;
    //     //  this.headingButton = true;
    //     if (this.dayBtn == true) {
    //         this.JSONArray = [];
    //         // this.isLoading = true;
    //         var tomorrowDate = this.template.querySelector(".fullDate");
    //         this.updatedDate.setDate((this.updatedDate.getDate() + 1));
    //         this.changeDateFormat();
    //         tomorrowDate.innerHTML = this.fulldate;
    //         var splitDay=this.updatedDate.getDate();
    //         var splitMonth=this.updatedDate.getMonth()+1;
    //         var splitYear=this.updatedDate.getFullYear();
    //         this.splitUpdatedDate=splitYear+"-"+splitMonth+"-"+splitDay;
    //         this.weekday = this.weeks[this.updatedDate.getDay()];
    //     BWPS_GetUser({schlnId:this.schlnId,schdate : this.splitUpdatedDate}) .then(result => {
    //         console.log('OUTPUT>>>>>>>>> : ',JSON.stringify(result));
    //         // if(result == NULL || result == undefined || result.length ==0){
    //         //     console.log('Null');
    //         //     // this.isLoading = false;
    //         //     // console.log('Spinner 2 : ',this.isLoading);
    //         //     this.showmsg = true;
    //         //     this.headingButton = false;
    //         //     this.noClassMsg = 'No Class Scheduled on this Day.';

    //         // }
    //         // else{
    //         //     // this.isLoading = false;
    //         //     this.showmsg = false;
    //         //     this.headingButton = true;
    //         // }
    //    var data =[];
    //     data = result;
    //     console.log('length',data.length);
    //     this.showmsg = false;
    //     this.headingButton = true;
    //     console.log('contact data',JSON.stringify(data));
    //        this.enrolledUser = data;
    //     //    this.showmsg = false;
    //        for(let i=0;i<this.enrolledUser.length;i++){
    //            var attend='Not Marked';
    //            var imgForAttendRight=this.blurRightIcon;
    //            var imgForAttendCross=this.blurCrossIcon;
    //            if(this.enrolledUser[i].Is_Present__c){
    //                    attend = this.enrolledUser[i].Is_Present__c;
    //                    if(this.enrolledUser[i].Is_Present__c == 'Present'){
    //                        imgForAttendRight=this.green;
    //                    }
    //                    if(this.enrolledUser[i].Is_Present__c == 'Absent'){
    //                        imgForAttendCross=this.red;
    //                    }
    //                }
    //            var obj={
    //             Id:this.enrolledUser[i].Id,  
    //             Name:this.enrolledUser[i].Attendee_Name_del__r.Name,
    //             Sch:this.enrolledUser[i].Schedule_Class_Line_Item_del__c,
    //             ImageURL:this.userImg,
    //             ImageAttendancep :imgForAttendRight,
    //             ImageAttendancea :imgForAttendCross,
    //             Attendance:attend
    //            };
    //         this.availableIds.push(this.enrolledUser[i].Attendee_Name_del__c);
    //         this.JSONArray.push(obj);
    //         // this.isLoading = false;
    //         console.log('Next JSON Array',JSON.stringify(this.JSONArray));
    //            if(i == (data.length)-1){
    //               this.showPresentAbsentData();
    //            }
    //        }
    //        this.availableArray = JSON.stringify(this.availableIds);
    //        this.loadContact = false;
    //     }).catch(e=>{
    //             // this.headingButton = false;
    //             // this.isLoading = false;
    //             this.showmsg = true;
    //             this.headingButton = false;
    //             this.noClassMsg = 'No Class Scheduled on this Day.';

    //         });  
    //         //  this.showmsg = false;
    //         //  this.headingButton = true;
    //          let todayDate =new Date();
    //          let changeableDate =new Date(this.splitUpdatedDate);
    //         if(changeableDate.getDate()==todayDate.getDate() && changeableDate.getMonth()==todayDate.getMonth() && changeableDate.getFullYear()==todayDate.getFullYear()  ){
    //             this.showNextButton=false;
    //             this.showButton=true;
    //         }
    //         else{
    //             this.showNextButton=true;
    //             this.showButton=false;
    //         }
    //     }
    // }

    // prevClickHandler() {
    //     // this.showmsg = false;
    //     // this.headingButton = true;
    //     console.log('Prev>>>>>>>>>>')
    //     // this.isLoading = true;
    //     console.log('Spinner 1 : ',this.loadContact);
    //     if (this.dayBtn == true) {
    //         this.JSONArray = [];
    //         // this.isLoading = true;
    //        console.log('Prevclick');
    //         var tomorrowDate = this.template.querySelector(".fullDate");
    //         this.updatedDate.setDate((this.updatedDate.getDate() - 1));
    //         this.changeDateFormat();
    //         tomorrowDate.innerHTML = this.fulldate;
    //          var splitDay=this.updatedDate.getDate();
    //         var splitMonth=this.updatedDate.getMonth()+1;
    //         var splitYear=this.updatedDate.getFullYear();
    //         this.splitUpdatedDate=splitYear+"-"+splitMonth+"-"+splitDay;
    //         this.weekday = this.weeks[this.updatedDate.getDay()];
    //          console.log('Prev 1111>>>>>>>>>',this.splitUpdatedDate);
    //         BWPS_GetUser({schlnId:this.schlnId,schdate : this.splitUpdatedDate}) .then(result => {
    //             console.log('OUTPUT>>>>>>>>> : ',JSON.stringify(result));
    //             // if(result == NULL || result == undefined || result.length ==0){
    //             //     console.log('Null');
    //             //     // this.isLoading = false;
    //             //     // console.log('Spinner 2 : ',this.isLoading);
    //             //     this.showmsg = true;
    //             //     this.headingButton = false;
    //             //     this.noClassMsg = 'No Class Scheduled on this Day.';

    //             // }
    //             // else{
    //             //      this.showmsg = false;
    //             // this.headingButton = true;
    //             // }
    //             var data =[];
    //             data = result;
    //             console.log('length',data.length);
    //             console.log("Prev res", data);
    //             // this.showmsg = false;
    //             this.showmsg = false;
    //             this.headingButton = true;
    //             console.log('Prev contact data',JSON.stringify(data));
    //                this.enrolledUser = data;
    //             //    if(this.enrolledUser.length == 0){
    //             //     console.log('Null');
    //             //     // this.isLoading = false;
    //             //     // console.log('Spinner 2 : ',this.isLoading);
    //             //     this.showmsg = true;
    //             //     this.headingButton = false;
    //             //     this.noClassMsg = 'No Class Scheduled on this Day.';

    //             //     }
    //             //     else{
    //             //         // this.isLoading = false;
    //             //         this.showmsg = false;

    //             //     }
    //                for(let i=0;i<this.enrolledUser.length;i++){
    //                    var attend='Not Marked';
    //                    var imgForAttendRight=this.blurRightIcon;
    //                    var imgForAttendCross=this.blurCrossIcon;
    //                    if(this.enrolledUser[i].Is_Present__c){
    //                         attend = this.enrolledUser[i].Is_Present__c;
    //                         if(this.enrolledUser[i].Is_Present__c == 'Present'){
    //                             imgForAttendRight=this.green;
    //                         }
    //                         if(this.enrolledUser[i].Is_Present__c == 'Absent'){
    //                             imgForAttendCross=this.red;
    //                         }
    //                     }
    //                    var obj={
    //                     Id:this.enrolledUser[i].Id,  
    //                     Name:this.enrolledUser[i].Attendee_Name_del__r.Name,
    //                     Sch:this.enrolledUser[i].Schedule_Class_Line_Item_del__c,
    //                     ImageURL:this.userImg,
    //                     ImageAttendancep :imgForAttendRight,
    //                     ImageAttendancea :imgForAttendCross,
    //                     Attendance:attend
    //                    };
    //                this.availableIds.push(this.enrolledUser[i].Attendee_Name_del__c);
    //                this.JSONArray.push(obj);
    //                this.isLoading = false;
    //                    if(i == (data.length)-1){
    //                       this.showPresentAbsentData();
    //                    }
    //                }this.availableArray = JSON.stringify(this.availableIds);
    //                console.log('Prev JSON Array',JSON.stringify(this.JSONArray));
    //             //    this.loadContact = false;
    //             //    this.showmsg = false;
    //               console.log('Show Msg : ',this.showmsg);
    //            }).catch(e=>{
    //                 // this.isLoading = false;
    //                 this.showmsg = true;
    //                 this.headingButton = false;
    //                 this.noClassMsg = 'No Class Scheduled on this Day.';
    //                     // this.headingButton = false;
    //                 });  
    //         //  this.showmsg = false;
    //         //  console.log('Show Msg : ',this.showmsg);
    //          this.headingButton = true;
    //          let todayDate =new Date();
    //          let changeableDate =new Date(this.splitUpdatedDate);
    //          if(changeableDate.getDate()==todayDate.getDate() && changeableDate.getMonth()==todayDate.getMonth() && changeableDate.getFullYear()==todayDate.getFullYear()  ){
    //             this.showNextButton=false;
    //             this.showButton=true;
    //         }
    //         else{
    //             this.showNextButton=true;
    //             this.showButton=false;
    //         }
    //     }    
    // }
    showPresentAbsentData() {
        for (let j = 0; j < this.JSONArray.length; j++) {
            let check = this.JSONArray[j].Attendance;
            if (check == "Present") {
                this.AttendanceImage1 = this.green;
                this.AttendanceImage2 = this.blurCrossIcon;
            }
            else if (check == "Absent") {
                this.AttendanceImage2 = this.red;
                this.AttendanceImage1 = this.blurRightIcon;
            }
            else {
                this.AttendanceImage1 = this.blurRightIcon;
                this.AttendanceImage2 = this.blurCrossIcon;
            }
        }
    }
    // dayClickHandler() {
    //     this.dayBtn = true;
    //     this.weekBtn = false;
    //     this.monthBtn = false;
    //     this.updatedDate = new Date();
    //     this.changeDateFormat();
    //     this.template.querySelector(".week-tag").className = 'box-click-deactive week-tag';
    //     this.template.querySelector(".month-tag").className = 'box-click-deactive month-tag';
    //     this.template.querySelector(".day-tag").className = 'box-click-active day-tag';

    // }
    @wire(fetchUserDetail)
    wiredUser({ error, data }) {
        if (data) {
            this.userData = data;
            this.userName = this.userData.Name;
            let userFullName = this.userName;
            this.userFirstName = userFullName.split(' ')[0];
        } else if (error) {
            this.error = error;
        }
    }

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        function msToTime(duration) {
            var milliseconds = Math.floor((duration % 1000) / 100),
                minutes = Math.floor((duration / (1000 * 60)) % 60),
                hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ampm;
            return strTime;
        }
        if (currentPageReference) {
            this.base64Data = currentPageReference.state?.app;
            this.result1 = window.atob(this.base64Data);
            this.result = JSON.parse(this.result1);

            this.schlnId = this.result.SchId;
            this.schName = this.result.Name;
            this.schTime = msToTime(this.result.Time);
            this.className = this.result.ClassName;
            this.urlDate = this.result.ClassDate;
            this.intialDateObj = new Date(this.result.ClassDate);
            this.weekday = this.weeks[this.intialDateObj.getDay()];
            var splitDay = this.intialDateObj.getDate();
            var splitMonth = this.months[this.intialDateObj.getMonth()];
            var splitYear = this.intialDateObj.getFullYear();
            this.splitUpdatedDate = this.weekday + "," + " " + splitMonth + " " + splitDay + "," + " " + splitYear;
            console.log('OUTPUT : ', this.splitUpdatedDate);
            this.systemTodaysDate = new Date().toLocaleDateString();
            this.selectedClassDate = new Date(this.urlDate).toLocaleDateString();
            console.log('this.intialDateObj main', new Date(this.urlDate).toLocaleDateString());
            console.log('new darrrr ', new Date().toLocaleDateString());
        }
    }
    connectedCallback() {
        // this.isLoading = true;
        // this.showmsg = false;
        // this.headingButton = true;
        // this.weekday = this.weeks[this.intialDateObj.getDay()];
        // this.day = this.intialDateObj.getDate();
        // this.monthNo = this.intialDateObj.getMonth();
        // this.month = this.months[this.monthNo];
        // this.year = this.intialDateObj.getFullYear();
        // this.fulldate = this.month + " " + this.day + ", " + this.year;
        BWPS_GetUser({ schlnId: this.schlnId, schdate: this.urlDate })
            .then(result => {
                let data = result;
                // this.showmsg = false;
                //  this.headingButton = true;
                console.log('contact data', JSON.stringify(data));
                this.enrolledUser = data;
                for (let i = 0; i < this.enrolledUser.length; i++) {
                    var attend = 'Not Marked';
                    var imgForAttendRight = this.blurRightIcon;
                    var imgForAttendCross = this.blurCrossIcon;
                    if (this.enrolledUser[i].Is_Present__c) {
                        attend = this.enrolledUser[i].Is_Present__c;
                        if (this.enrolledUser[i].Is_Present__c == 'Present') {
                            imgForAttendRight = this.green;
                        }
                        if (this.enrolledUser[i].Is_Present__c == 'Absent') {
                            imgForAttendCross = this.red;
                        }
                    }
                    var obj = {
                        Id: this.enrolledUser[i].Id,
                        Name: this.enrolledUser[i].Attendee_Name_del__r.Name,
                        Sch: this.enrolledUser[i].Schedule_Class_Line_Item_del__c,
                        ImageURL: this.userImg,
                        ImageAttendancep: imgForAttendRight,
                        ImageAttendancea: imgForAttendCross,
                        Attendance: attend
                    };
                    this.contactIds.push(this.enrolledUser[i].Id);
                    this.availableIds.push(this.enrolledUser[i].Attendee_Name_del__c);
                    this.JSONArray.push(obj);
                    //  this.isLoading = false;
                    if (i == (data.length) - 1) {
                        this.showPresentAbsentData();
                    }
                    this.showmsg = false;
                } this.availableArray = JSON.stringify(this.availableIds);
                this.searchResultArray = this.JSONArray;
                if (this.searchResultArray.length == 0) {
                    this.noSearchResultArray = true;
                }
                else {
                    this.noSearchResultArray = false;
                }
                console.log('availableIds : ', JSON.stringify(this.availableIds));
                console.log(' JSON Array', JSON.stringify(this.JSONArray));
            });
    }

    @track noSearchResultArray = false;
    renderedCallback() {
        if (this.selectedClassDate == this.systemTodaysDate) {
            console.log('inside if');
        }
        else {
            this.template.querySelector(`[data-id="attbutton"]`).className = 'submitbuttonDisabled';
            console.log('inside else');
        }
    }
    clickHandlerActive1() {
        console.log('active 1 : a to z');
        this.activeLink1 = true;
        this.activeLink2 = false;
        this.template.querySelector('.sort-filter-link1').className = 'sort-filter-link1 sort-filter-active';
        this.template.querySelector('.sort-filter-link2').className = 'sort-filter-link2  sort-filter-deactive';
        if (this.rev == 1) {
            this.reverseJSON();
            this.rev = 0;
        }
    }
    clickHandlerActive2() {
        this.activeLink2 = true;
        this.activeLink1 = false;
        this.template.querySelector('.sort-filter-link2').className = 'sort-filter-link2 sort-filter-active';
        this.template.querySelector('.sort-filter-link1').className = 'sort-filter-link1 sort-filter-deactive';
        if (this.rev == 0) {
            this.reverseJSON();
            this.rev = 1;
        }
    }
    rev = 0;
    reverseJSON() {
        this.JSONArray = this.JSONArray.sort().reverse();
    }
    clickHandlerAttedanceMarkPresent(evt) {
        if (this.selectedClassDate == this.systemTodaysDate) {
            this.pid = evt.target.dataset.pid;
            this.sid = evt.target.dataset.sid;
            console.log(this.id);
            this.attendance = "Present";
            const obj1 = {
                "Attendeeid": this.pid,
                "attendance": this.attendance,
                "scheduleId": this.sid
            }
            this.temp.push(obj1);
            this.template.querySelector(`[data-pid = '${this.pid}']`).src = this.green;
            this.template.querySelector(`[data-aid = '${this.pid}']`).src = this.blurCrossIcon;
        }
    }

    clickHandlerAttedanceMarkAbsent(evt) {
        if (this.selectedClassDate == this.systemTodaysDate) {
            this.id = evt.target.dataset.aid;
            this.sid = evt.target.dataset.sid;
            this.attendance = "Absent";
            const obj1 = {
                "Attendeeid": this.id,
                "attendance": this.attendance,
                "scheduleId": this.sid
            }
            this.temp.push(obj1);
            this.template.querySelector(`[data-aid = '${this.id}']`).src = this.red;
            this.template.querySelector(`[data-pid = '${this.id}']`).src = this.blurRightIcon;
        }
    }

    clickHandlerUsers() {
        this.addNewUserArr = [];
        this.finalUserArr = [];
        this.submitIdArr = [];
        this.showPopUp = true;
        this.loadContact = true;
        this.getUserFromCon();
        this.showNextButton = false;
    }
    hideSendModalBox() {
        this.finalUserArr = [];
        this.showPopUp = false;
        this.showNextPopUp = false;
    }
    val;
    inputValue(event) {
        this.val = event.target.value.toLowerCase();
        console.log('event str : ', this.val);
        //   this.val = '';
        if (this.val == '') {
            this.searchResultArray = this.JSONArray;
        }

        if (this.searchResultArray.length == 0) {
            this.template.querySelector('.submitClass').style.display = 'none';
        }
        else {
            this.template.querySelector('.submitClass').style.display = 'block';
        }
    }
    handleSubmitUsers() {
        //   let val = event.target.value.toLowerCase();
        //   console.log('event str : ',val);
        //   this.isLoaded = false;
        this.searchResultArray = [];
        console.log('OUTPUT : ', this.JSONArray);
        this.JSONArray.forEach(e => {
            if (this.val == '' || e.Name.toLowerCase().includes(this.val)) {
                console.log('get name : ', e.Name);
                this.searchResultArray.push(e);
                console.log('OUTPUT : ', JSON.stringify(this.searchResultArray));
            }
        });

        if (this.searchResultArray.length == 0) {
            this.template.querySelector('.submitClass').style.display = 'none';
        }
        else {
            this.template.querySelector('.submitClass').style.display = 'block';
        }
    }
    handleDownload() {
        console.log('inside prient method');
        window.print();
        console.log('prient');
    }
    // inputValue(e){
    //     this.input = e.target.value;
    //     this.loadContact = true;
    //     this.getUserFromCon();
    //    this.input = '';
    // }
    // async getUserFromCon(){
    //     this.userArray = [];
    //     await BWPS_GetFilterUsers({input : this.input , availableIds : this.availableArray})
    //     .then(result => {
    //         let filterData = result;
    //         this.filterContacts=filterData;
    //         for(let i = 0;i < this.filterContacts.length; i++){
    //             var obj={
    //                 Name:this.filterContacts[i].Name,
    //                 Id:this.filterContacts[i].Id
    //             }
    //             this.userArray.push(obj);
    //         }
    //         this.loadContact = false;
    //     });
    // }
    // @track submitIdArr = [];
    // @track addNewUserNameArr = [];
    // @track showNextButton = false;
    //  addClass(e){
    //     this.showNextButton = true;
    //     this.JSONConId = '';
    //     var conId =  e.target.dataset.id ;
    //     var conName =  e.target.dataset.name ;

    //     this.addNewUserArr.push(conId);
    //     console.log('addNewUserArr : ',JSON.stringify(this.addNewUserArr));
    //    // console.log('OUTPUT >>>: ',this.addNewUserArr);
    //     var obj={
    //         Id: conId,
    //         Name:conName
    //     }
    //     this.finalUserArr.push(obj);
    //     console.log('FINAL user : ',JSON.stringify(this.finalUserArr));
    //     var stringSrc= JSON.stringify(this.template.querySelector(`[data-id = '${conId}']`).src);
    //         if(stringSrc.includes(this.MinusIcon)) {
    //             console.log('true');
    //             var index = this.addNewUserArr.indexOf(conId);
    //             console.log('Index : ',index);
    //             // this.addNewUserArr.splice(this.addNewUserArr.indexOf(conId),1);
    //             // this.addNewUserArr.pop();
    //             this.finalUserArr.splice(this.finalUserArr.indexOf(this.finalUserArr[this.addNewUserArr.indexOf(conId)]),1);
    //             this.finalUserArr.pop();
    //             this.template.querySelector(`[data-id = '${conId}']`).src = this.addIcon;
    //             console.log('addNewUserArr : ',JSON.stringify(this.addNewUserArr));
    //             console.log('final : ',JSON.stringify(this.finalUserArr));
    //         } 
    //         else if(stringSrc.includes(this.addIcon)){

    //             this.template.querySelector(`[data-id = '${conId}']`).src = this.MinusIcon;

    //         }

    //     }
    // lastResult;
    // @track lastArr = [];
    // handleSelectedUsers(){
    //     this.showNextPopUp = true;
    // }
    // minusClass(e){
    //     var conId =  e.target.dataset.id ;
    //     //var index = event.target.dataset.index;
    //     console.log('Con IDS : ',conId);
    //     //this.addNewUserArr.splice(this.addNewUserArr.indexOf(conId),1);
    //     this.finalUserArr.splice(this.finalUserArr.indexOf(this.finalUserArr[this.addNewUserArr.indexOf(conId)]),1);
    // }
    // @track submitButton = false;
    // consentClass(event){
    //      if (event.target.checked == true){
    //         this.submitButton = true;
    //     } else {
    //         this.submitButton = false;
    //     }
    // }
    // handleSubmitUsers(){
    //    BWPS_GetAttendeeFromCon({schlnId:this.schlnId ,schdate : this.splitUpdatedDate , JSONConId : JSON.stringify(this.finalUserArr) })
    //         .then(result => {
    //             let data = result;
    //             for(let i=0;i<data.length;i++){
    //                     let submitId = data[i].Id;
    //                     this.submitIdArr.push(submitId);
    //             }
    //             // this.isLoading = true;
    //             BWPS_GetAttendeeName({ submitIdArr : this.submitIdArr})
    //             .then(result =>{
    //             this.lastResult = result;
    //             console.log('Result : ', JSON.stringify(this.lastResult));
    //                 for(let i=0;i< this.lastResult.length;i++){
    //                     var imgForAttendRight=this.blurRightIcon;
    //                     var imgForAttendCross=this.blurCrossIcon;
    //                     console.log('Last i : ',this.lastResult[i].Attendee_Name_del__c);
    //                     var obj={
    //                             Id: this.lastResult[i].Id,  
    //                             Name: this.lastResult[i].Attendee_Name_del__r.Name,
    //                             ImageURL:this.userImg,
    //                             ImageAttendancep :imgForAttendRight,
    //                             ImageAttendancea :imgForAttendCross,
    //                             Attendance: this.lastResult[i].Is_Present__c
    //                     };
    //                     this.JSONArray.push(obj);
    //                     // this.isLoading = false;
    //                     this.JSONArray.sort(function (a, b) {
    //                         return a.Name - b.Name;
    //                       });
    //                     this.availableIds.push(this.lastResult[i].Attendee_Name_del__c);
    //                 }
    //                 console.log('Last JSON Array : ',JSON.stringify(this.JSONArray));

    //                 this.availableArray = JSON.stringify(this.availableIds);

    //                 console.log('availableIds',this.availableArray);

    //                 }).catch(e=>{
    //                     console.log("e>>>>");
    //                     console.log('Error>>>>>',e.getMessage());
    //         });
    //      });

    //      this.showPopUp = false;
    //    this.showNextPopUp = false; 

    // }
    handleAttendance() {
        console.log('this.selectedclassdate ', this.selectedClassDate);
        console.log('this.sysstemtodaysdate ', this.systemTodaysDate);
        if (this.selectedClassDate == this.systemTodaysDate) {
            console.log('inside click if');
            console.log();
            const obj = { request: this.temp };
            console.log('OUTPUT OBJ>>>> : ', JSON.stringify(obj));
            console.log('OUTPUT Contact id>>>> : ', JSON.stringify(this.contactIds));
            takeAttendence({ attendeeData: JSON.stringify(obj), schId: this.schlnId, ContactIds: this.contactIds }).then(result => {
                let result1 = result;
                console.log('Submit Result : ', result1);
            }).catch({
            });
            this.template.querySelector('c-recurring-donation').showToast('success', 'Attendance has been submitted.');
        }
        else {
            console.log('inside click else');
            this.template.querySelector(`[data-id="attbutton"]`).className = 'submitbuttonDisabled';
        }
    }
    backButton() {
        window.open('/PFNCADNA/s/instructordashboard', '_self');
    }
}