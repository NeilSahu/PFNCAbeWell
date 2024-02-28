import { LightningElement, api, track, wire } from 'lwc';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import InstructorNotes from '@salesforce/apex/BWPS_InstructorNotes.InstructorNotes';
import InsertNotes from '@salesforce/apex/BWPS_NotesData.InsertNotes';
import UpdateNotes from '@salesforce/apex/BWPS_NotesData.UpdateNotes';
import ScheduleClassesData from '@salesforce/apex/BWPS_NotesData.ScheduleClassesData';
import getNotesData from '@salesforce/apex/BWPS_NotesData.getNotesData';
import deleteNote from '@salesforce/apex/BWPS_NotesData.deleteNote';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
// import CheckmanagePackageCall from '../checkmanagePackageCall/checkmanagePackageCall';

export default class BWPS_YourNotes extends LightningElement {
    @track yourNotes = {};
    @track notes = [];
    @track SelectedDate;
    @track SelectedTitle;
    @track notesaction = true;
    @track SelectedDescription;
    @track classArray = [];
    @track notesData = [];
    @track notesDataFilter = [];
    @track temp = {};
    @track notesDatatemp = [];
    clsVal = 'none';
    NotesRecords;
    inpsrch = '';
    Title = 'title';
    Description = 'description';
    pencil = `${allIcons}/PNG/Edit.png `;
    Noteid = '';
    UpdateNoteId = '';
    UpdateDescription = '';
    showmodel = false;
    Notesshowmodel = false;
    // @wire(getNotesData)
    // wiredata({ data, error }) {
    //     if (data) {
    //         this.notesDatatemp = data;
    //         let arrFlt = [];
    //         let i;
    //         let obj = {};
    //         for (i = 0; i < this.notesDatatemp.length; i++) {
    //             var body = [];
    //             //  var Dateformat = [];
    //             body = this.notesDatatemp[i].Body.split('#');
    //             console.log('body ', body[0]);
    //             console.log('body ', body[1]);
    //             //    Dateformat =this.notesDatatemp[i].CreatedDate.split('T');
    //             let formattedDate = new Date(this.notesDatatemp[i].CreatedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });


    //             // let body = this.notesDatatemp[i].Body.substring(19);
    //             obj = {
    //                 "Id": this.notesDatatemp[i].Id,
    //                 "Title": this.notesDatatemp[i].Title,
    //                 "Body": body[1],
    //                 "CreatedDate": formattedDate
    //                 // "CreatedDate":Dateformat[0]
    //             }
    //             arrFlt.push(obj);
    //         }
    //         this.notesData = arrFlt;
    //         this.notesDataFilter = arrFlt;
    //     }
    //     else {
    //         this.error = error;
    //         console.log('error ', this.error)
    //     }
    // }

    handleData(event) {
        //var setId =  this.template.querySelector(`[data-id='quarterly']`);
        var setId = event.currentTarget.dataset.id;
        var setTitle = event.currentTarget.dataset.title;
        var setDate = event.currentTarget.dataset.date;
        var setDesc = event.currentTarget.dataset.desc;
        this.noteToDelete = setId;

        console.log('setId ', setId);
        console.log('setTitle ', setTitle);
        console.log('setDate ', setDate);
        console.log('setDesc ', setDesc);
        this.showmodel = true;
        this.SelectedDate = setDate;
        this.SelectedTitle = setTitle;
        this.SelectedDescription = setDesc;
        this.Noteid = setId;
    }

    getAllNotesRecords() {
        getNotesData().then(data => {
            this.notesDatatemp = data;
            let arrFlt = [];
            let i;
            let obj = {};
            for (i = 0; i < this.notesDatatemp.length; i++) {
                var body = [];
                //  var Dateformat = [];
                body = this.notesDatatemp[i].Body.split('#');
                console.log('body ', body[0]);
                console.log('body ', body[1]);
                //    Dateformat =this.notesDatatemp[i].CreatedDate.split('T');
                let formattedDate = new Date(this.notesDatatemp[i].CreatedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });


                // let body = this.notesDatatemp[i].Body.substring(19);
                obj = {
                    "Id": this.notesDatatemp[i].Id,
                    "Title": this.notesDatatemp[i].Title,
                    "Body": body[1],
                    "CreatedDate": formattedDate
                    // "CreatedDate":Dateformat[0]
                }
                arrFlt.push(obj);
            }
            this.notesData = arrFlt;
            this.notesDataFilter = arrFlt;
        }).catch(error => {
            console.log(error);
        })
    }

    connectedCallback() {
        this.getAllNotesRecords();

        ScheduleClassesData()
            .then(result => {
                console.log('result classes data ', result);
                this.classArray = result;
            })
            .catch(error => {
                this.error = error;
                console.log('error ', this.error)
            });
    }
    InsertNoteHandle(event) {
       this.Title = this.template.querySelector(`[data-id= 'insttl']`).value.trim();
        this.Description = this.template.querySelector(`[data-id= 'insdesc']`).value.trim();
        if(this.Title =="" || this.Description==""){
            if(this.Title ==""){
               this.template.querySelector(`[data-id= 'insttl']`).className = "card-error-input";
            }
            if(this.Description==""){
               this.template.querySelector(`[data-id= 'insdesc']`).className = "card-error-desc";
            }
             
        }
        else{

        this.Notesshowmodel = false;
        this.template.querySelector(`[data-id='note-modal']`).style.display = "none";
          this.notesaction = false;
        console.log('ind');
        this.Description = this.template.querySelector(`[data-id= 'insdesc']`).value;
        this.Title = this.template.querySelector(`[data-id= 'insttl']`).value;
        this.clsVal = this.template.querySelector(`[data-id="clsSelect"]`).value;
        this.temp = {
            "NoteDetail": {
                "Body": this.Description,
                "Title": this.Title,
                "ClassId": this.clsVal
            }
        }
        console.log("body  " + this.clsVal);
        console.log("temp : ", JSON.stringify(this.temp));
        InsertNotes({ NotesDetails: this.temp })
            .then(result => {
                 this.notesaction = true;
                this.NotesRecords = result;
                console.log("output");
                console.log(this.NotesRecords);
                if (this.NotesRecords == 'Error') {
                    this.showErrorToast();
                }
                else {
                    this.ShowToast();
                }
                this.getAllNotesRecords();
                return refreshApex(this.notesData);
            })
            .catch(error => {
                this.error = error;
                console.log('error', this.error);
                this.showErrorToast();
            });
        }

    }

    @track noteToDelete;
    deleteNote() {
        this.off();
        this.notesaction = false;
        deleteNote({ noteId: this.noteToDelete }).then(result => {
              this.notesaction = true;
             this.ShowToastDelete();
            this.getAllNotesRecords();
        }).catch(error => {
            console.log(error);
        })
    }

    UpdateNoteHandle(event) {
        this.showmodel = false;
        this.template.querySelector(`[data-id='form-modal']`).style.display = "none";
        this.UpdateDescription = this.template.querySelector(`[data-id= 'selectinsdesc']`).value;
        this.UpdateNoteId = event.currentTarget.dataset.idnotes;
        console.log('UpdateDescription', this.UpdateDescription);
        console.log('UpdateNoteId', this.UpdateNoteId);
        this.temp = {
            "NoteDetail": {
                "Body": this.UpdateDescription,
                "NoteId": this.UpdateNoteId,
            }
        }
        console.log("temp update : ", JSON.stringify(this.temp));
        UpdateNotes({ NotesDetails: this.temp })
            .then(result => {
                this.NotesRecords = result;
                console.log("output");
                console.log(this.NotesRecords);
                this.ShowToastUpdate();
                this.getAllNotesRecords();
                return refreshApex(this.notesData);
            })
            .catch(error => {
                this.error = error;
                console.log('error', this.error);
                this.showErrorToastUpdate();
            });

    }
    ShowToast() {
        const event = new ShowToastEvent({
            title: 'New Note Created',
            message: 'Your note is created:)',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
     ShowToastDelete() {
        const event = new ShowToastEvent({
            title: ' Note Deleted',
            message: 'Your note is Deleted Successfully:)',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
    showErrorToast() {
        const evt = new ShowToastEvent({
            title: 'Some unexpected error occured',
            message: 'You might be not a Instructor',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }
    ShowToastUpdate() {
        const event = new ShowToastEvent({
            title: ' Note Updated',
            message: 'Your note is Updated:)',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
    showErrorToastUpdate() {
        const evt = new ShowToastEvent({
            title: 'Some unexpected error occured',
            message: 'You might be not a Instructor',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }
    donateClickHandler() {
        this.showmodel = true;
        this.template.querySelector(`[data-id='form-modal']`).style.display = "block";
    }
    off() {
        this.showmodel = false;
        this.template.querySelector(`[data-id='form-modal']`).style.display = "none";
    }
    NewNoteClickHandler() {
        this.Notesshowmodel = true;
        setTimeout(() => {
            console.log(JSON.stringify(this.template.querySelector(`[data-id='note-modal']`)))
            this.template.querySelector("[data-id='note-modal']").style.display = 'block';
        }, 100);
    }
    offAdd() {
        this.Notesshowmodel = false;
        this.template.querySelector(`[data-id='note-modal']`).style.display = "none";
    }
    buttonSearch() {
        var val = this.template.querySelector('[data-inpsearch="inpsrch"]').value;
        this.template.querySelector('[data-inpsearch="inpsrch"]').value = val;
        this.inpsrch = val.toLowerCase();
        console.log('val notes ', val);
        let arrint = this.notesDataFilter.filter((text) => {
            return (text.Title.toLowerCase().includes(val) || text.Body.toLowerCase().includes(val));
        })
        // let i;
        // for (i = 0; i < this.notesDataFilter.length; i++) {
        //     if (this.notesDataFilter[i].Title.includes(val)) {
        //         arrint.push(this.notesDataFilter[i]);
        //         console.log('log this.notesDataFilter[i]', JSON.stringify(this.notesDataFilter[i]));
        //     }
        // }
        this.notesData = arrint;
        console.log('loged data search', JSON.stringify(this.notesData));
    }
}