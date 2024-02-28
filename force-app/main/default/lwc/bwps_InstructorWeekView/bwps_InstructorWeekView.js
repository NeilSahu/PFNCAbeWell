/*
* @author     	 Cyntexa Labs
* @description	 This is week component js use to generate Event Arrry and generate dynamic dates. 
* @date       	 09-10-2022          	
*/

import { api, LightningElement, track } from 'lwc';
import backgroundUrl from '@salesforce/resourceUrl/ExerciseImage';
import mediumSignal from '@salesforce/resourceUrl/mediumLevelSignal';
import highSignal from '@salesforce/resourceUrl/highLevelSignal';
import lowSignal from '@salesforce/resourceUrl/lowLevelSignal';
import UserAvtar from '@salesforce/resourceUrl/shareImage';

export default class Bwps_InstructorWeekView extends LightningElement {
    todaysDate = new Date();
    @track showEmailUI = false;
    @track weekArray = [];
    @track eventArray = [];
    usericon = UserAvtar;
    isToday = false;
    showWeak = false;
    @track previousEvent = '';
    @api weekevnts;
    @api eventmap;
    @track clickedEvent = {};
    @api
    hideWeek() {
        this.showWeak = false;
    }
    @api
    closeOpenEventCard() {
        if (this.previousEvent != '' && this.previousEvent != null && this.previousEvent != undefined
            && this.template.querySelector(`[data-id=${this.previousEvent}]`) != null) {
            this.hideEvent();
        }
    }
    @api
    getWeek(weekstart) {
        this.weekArray = [];
        var weekstartDate = new Date(weekstart);
        for (let i = 0; i < 7; i++) {
            if (i > 0) {
                weekstartDate.setDate(weekstartDate.getDate() + 1);
            }
            if (weekstartDate.getDate() == this.todaysDate.getDate() && weekstartDate.getDay() == this.todaysDate.getDay()
                && weekstartDate.getFullYear() == this.todaysDate.getFullYear()) {
                this.isToday = true;
            } else {
                this.isToday = false;
            }
            const obj = {
                date: weekstartDate.getDate(),
                todayDate: this.isToday,
                key: i
            }
            this.weekArray.push(obj);
        }
        // var arr =[];
        // for (let i = 0; i < 63; i++) {
        //     if(i == 5){
        //         const obje= {
        //             key:`Event-${i}`,
        //             eventsClass:[{key:`event-${i}`, eventName: 'Dance class ...',time : 'full-block'}]
        //         }
        //         arr.push(obje);
        //     } else if(i==7){
        //         const obje= {
        //             key:`Event-${i}`,
        //             eventsClass:[{ key:`event-${i}`, eventName: 'Dance class for parkisegdgsdggh', time : 'half-block-up'}]
        //         }
        //         arr.push(obje);
        //     } else if (i==8) { 
        //             const obje= {
        //                 key:`Event-${i}`,
        //                 eventsClass:[{key:`event-${i}`, eventName: 'Dance class ...', time : 'half-block-down'}]
        //             }
        //             arr.push(obje);
        //          } else {
        //                 const obje= {
        //                     key:`Event-${i}`,
        //                     eventsClass:[]
        //                 }
        //                 arr.push(obje);
        //             }
        //         }
        this.showWeak = true;
        // this.eventArray = arr;
    }
    getdataEvnt(event) {
        if (this.previousEvent != '' && this.previousEvent != null && this.previousEvent != undefined
            && this.template.querySelector(`[data-id=${this.previousEvent}]`) != null) {
            this.template.querySelector(`[data-id=${this.previousEvent}]`).style.backgroundColor = '#ddf0f3';
        }
        this.template.querySelector(`[data-id=${event.target.getAttribute('data-id')}]`).style.backgroundColor = '#dee2e6';
        this.previousEvent = event.target.getAttribute('data-id');
        var x = event.clientX;
        var y = event.clientY;
        this.clickedEvent = {};
        var eventDataItem = this.eventmap.get(event.target.getAttribute('data-id'));
        var timeOfClass = this.timeInHours(eventDataItem.BWPS_StartTime__c);
        var signal;
        let sig = eventDataItem.BWPS_Integrity__c;
        if (sig == 'Low/Seated') {
            signal = lowSignal;
        }
        else if (sig == 'Medium') {
            signal = mediumSignal;
        }
        else if (sig == 'High/Active') {
            signal = highSignal;
        }
        else {
            signal = lowSignal;
        }
        //  console.log('timeOfClass>>> ',timeOfClass);
        this.clickedEvent['Name'] = eventDataItem.Name;
        this.clickedEvent['classDate'] = eventDataItem.BWPS_ClassDate__c;
        this.clickedEvent['intensity'] = eventDataItem.BWPS_Integrity__c;
        this.clickedEvent['instructor'] = eventDataItem.Schedule_Class__r.BWPS_instructor__r.Name;
        this.clickedEvent['description'] = eventDataItem.Schedule_Class__r.BWPS_Description__c;
        this.clickedEvent['time'] = timeOfClass + ' / ' + eventDataItem.BWPS_ClassDay__c.toUpperCase().slice(0, 3);
        this.clickedEvent['intencityicon'] = signal;
        this.clickedEvent['Id'] = eventDataItem.Id;
        //  console.log('clickedEVENT>>> ',this.clickedEvent);
        setTimeout(() => {
            //this.showEvent = true;
            //    console.log('settimeOutCall');
            const elementt = this.template.querySelector("[data-id='event-continer-box']");
            let boundry = elementt.getBoundingClientRect();
            // for (const [key, value] of boundry) {
            //     console.log('boundry');
            //    console.log('Boundry',JSON.stringify(boundry));
            x = x - boundry.left + 20;
            y = y - boundry.top + 20;
            //   }
            if (parseInt(screen.width) >= 1300) {
                if (x + 500 > boundry.right) {
                    x = x - 400;
                } else if (x < 40) {
                    x + 60;
                }
                if (y + 400 > boundry.bottom) {
                    y -= 200;
                }
            }
            if (parseInt(screen.width) >= 1100 && parseInt(screen.width) < 1300) {
                if (x + 500 > boundry.right) {
                    x = x - 400;
                } else if (x < 40) {
                    x + 60;
                }
                if (y + 400 > boundry.bottom) {
                    y -= 200;
                }
            }
            if (parseInt(screen.width) >= 1000 && parseInt(screen.width) < 1100) {
                if (x + 395 > boundry.right) {
                    x = x - 400;
                } else if (x < 40) {
                    x + 60;
                }
                if (y + 400 > boundry.bottom) {
                    y -= 200;
                }
            }
            if (parseInt(screen.width) > 768 && parseInt(screen.width) < 1000) {
                if (x + 328 > boundry.right) {
                    x = x - 370;
                } else if (x < 40) {
                    x + 60;
                }
                if (y + 400 > boundry.bottom) {
                    y -= 200;
                }
            }
            this.template.querySelector("[data-id='eventCardData']").style.display = 'block';
            if (parseInt(screen.width) > 768) {
                this.template.querySelector("[data-id='eventCardData']").style.left = x + 'px';
                this.template.querySelector("[data-id='eventCardData']").style.top = y + 'px';
            }
            //   console.log('endSETTime Out');
        }, 100);
    }

    get backgroundStyle() {
        return `background-image:url(${backgroundUrl})`;
    }

    hideEvent() {
        this.template.querySelector(`[data-id=${this.previousEvent}]`).style.backgroundColor = '#ddf0f3';
        this.template.querySelector("[data-id='eventCardData']").style.display = 'none';
    }
    /***************************** this function use to convert milisecond to time *************************************************/
    timeInHours(miliseconds) {
        var hours = Math.floor(miliseconds / (1000 * 60 * 60));
        var divisor_for_minutes = miliseconds % (1000 * 60 * 60);
        var minutes = Math.floor(divisor_for_minutes / (60 * 1000));
        var formatedHr = hours.toString().length == 1 ? `0${hours}` : hours;
        var formatedMinuts = minutes.toString().length == 1 ? `0${minutes}` : minutes;
        console.log('Time In 24 hrs:----', formatedHr + ':' + formatedMinuts);
        return this.convert12Clock(formatedHr + ':' + formatedMinuts);
    }
    /***************************** End Of time convertor function  *************************************************/
    /*********************************** time formate into 12 hr clock start***************************************/
    convert12Clock(str) {
        console.log('String Val Of Time:--', str);
        var time = '';
        var h1 = Number(str[0] - '0');
        console.log(h1);
        var h2 = Number(str[1] - '0');
        console.log(h2);
        var hh = h1 * 10 + h2;
        console.log(hh);
        var Meridien;
        if (hh < 12) {
            Meridien = "AM";
        } else {
            Meridien = "PM";
        }
        hh %= 12;
        if (hh == 0) {
            time = '12';
            time += str.substring(2);
        }
        else {
            console.log('time>>>hr', hh, ' >>length>>> ', hh.toString().length)
            time = hh.toString().length == 1 ? `0${hh}` : hh;
            time += str.substring(2);
        }
        time += Meridien;
        return time;
    }
    opensendEmail() {
        this.showEmailUI = !this.showEmailUI;
    }

    takeAttendenceMethod() {
        console.log('ClickedEvt>t>> ', JSON.stringify(this.clickedEvent));
        var name = this.clickedEvent.Name;
        var scLineItemId = this.clickedEvent.Id;
        var time = this.clickedEvent.time;
        var date = this.clickedEvent.classDate;
        var className = this.clickedEvent.Name;
        var classDate = this.clickedEvent.classDate;
        var obj = {
            SchId: scLineItemId,
            Name: name,
            Date: date,
            Time: time,
            ClassName: className,
            ClassDate: classDate
        }
        var result = window.btoa(JSON.stringify(obj));
        console.log('OUTPUT : ', result);
        window.open('/PFNCADNA/s/-instructordashboardtakeattendance?app=' + result, '_self');
    }
}