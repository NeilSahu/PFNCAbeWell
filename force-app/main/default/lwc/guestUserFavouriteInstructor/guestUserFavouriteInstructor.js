import { LightningElement,track, wire, api } from 'lwc';
import FavouritArticleImage1 from '@salesforce/resourceUrl/FavouritArticleImage1';
import likeButton from '@salesforce/resourceUrl/likeButton';
import FavouritArticleImage2 from '@salesforce/resourceUrl/FavouritArticleImage2';
import FavouritArticleImage3 from '@salesforce/resourceUrl/FavouritArticleImage3';
import FavouriteInstructorImage1 from '@salesforce/resourceUrl/FavouriteInstructorImage1';
import FavouriteInstructorImage2 from '@salesforce/resourceUrl/FavouriteInstructorImage2';
import FavouriteInstructorImage3 from '@salesforce/resourceUrl/FavouriteInstructorImage3';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import getAllInstructors from '@salesforce/apex/DNA_GuestUserClass.getAllInstructors';
import getAllInstructorsData from '@salesforce/apex/BWPS_getInstructorsData.getAllInstructorsData';
import allEntitySubs from '@salesforce/apex/DNA_GuestUserClass.allEntitySubs';
import follow from '@salesforce/apex/DNA_GuestUserClass.follow';
export default class GuestUserFavouriteInstructor extends LightningElement {
    FavouritArticleImage1 = FavouritArticleImage1;
    FavouritArticleImage2 = FavouritArticleImage2;
    FavouritArticleImage3 = FavouritArticleImage3;
    FavouritInstructorImage1 = FavouriteInstructorImage1;
    FavouritInstructorImage2 = FavouriteInstructorImage2;
    FavouritInstructorImage3 = FavouriteInstructorImage3;
    @track defaultInsImage = FavouriteInstructorImage1;
    @track favIcon =  `${allIcons}/PNG/Favorite.png `;
    @track unFavIcon = `${allIcons}/PNG/unfavorite.png `;
    likeButton=likeButton;
    @track instructorMainArr = [];
    @track visibleCardElementArray = [];
    @track instructors = [];
    @track haveFavInstructor = false;
    data = {
      "tranners":[
        {"name":"DEANNA BALLARD", "exp":"Excercise Instructor","imgUrl":`${this.FavouritInstructorImage1}`},
        {"name":"KIM BROOKS", "exp":"Yoga Instructor","imgUrl":`${this.FavouritInstructorImage2}`},
        {"name":"HARRY R. DEBOER", "exp":"Fitness Instructor","imgUrl":`${this.FavouritInstructorImage3}`}
      ]
    }
    // reports={
    //   "articles":[
    //     {"imgUrl":`${this.FavouritArticleImage1}`,"date":"ZACH GALATI","date1":"MARCH 23,2021","lessons":"Lesson's from Being the Child of a parent with Parkinson's","Details":"Parkinson Foundation of the National Capital Area(PFNCA) helps people with Parkinsn's slow with the disease's progression"},
    //     {"imgUrl":`${this.FavouritArticleImage2}`,"date":"ZACH GALATI","date1":"MARCH 23,2021","lessons":"Lesson's from Being the Child of a parent with Parkinson's","Details":"Parkinson Foundation of the National Capital Area(PFNCA) helps people with Parkinsn's slow with the disease's progression"},
    //     {"imgUrl":`${this.FavouritArticleImage3}`,"date":"ZACH GALATI","date1":"MARCH 23,2021","lessons":"Lesson's from Being the Child of a parent with Parkinson's","Details":"Parkinson Foundation of the National Capital Area(PFNCA) helps people with Parkinsn's slow with the disease's progression"}
    //   ]
    // }

    connectedCallback() {
      console.log('connectedCallBack start : ');
      console.log('connectedCallBack second : ');
    }

    renderedCallback(){
      console.log('haveFavInstructor : ',this.haveFavInstructor);
    }
    @wire(getAllInstructors)
    async getFavoriteInstructors({data,error}){
      console.log('data inst : ',JSON.stringify(data));
      let tempArr = [];
      let favTempArr = [];
      if(data && data != undefined && data != null){
        console.log('data inst inside : ',JSON.stringify(data));
        let instructorData = data;
        await getAllInstructorsData()
        .then(result => {
          console.log(result);
          if(result != undefined && result != null && result){
            console.log('check in if : ');
            for (let i = 0; i < result.length; i++) {
              console.log('result.length', result.length);
              const ins = {
                Id: result[i].ContactId,
                name: result[i].Contact.Name,
                exp: (result[i].Contact.BWPS_Type__c == "" ||result[i].Contact.BWPS_Type__c == undefined || result[i].Contact.BWPS_Type__c == null)  ? "" : String(result[i].Contact.BWPS_Type__c).split(";").join(", "),
                imgUrl: result[i].MediumPhotoUrl
              }
              this.instructors.push(ins);
            }
          }
          else{
            console.log('check in else : ');
          }
        })
        .catch(error => {
            console.log('error get data instructor  ', JSON.stringify(error),error.message);
        });
        //console.log('scArr : ',JSON.stringify(scArr));
       try{
          instructorData.forEach(r => {
              let a = JSON.parse(JSON.stringify(r));
              console.log('curUser before : ');
              let curUser = this.instructors.find(e=> e.Id == a.Id);
              // a.instImage = this.defaultInsImage;
              console.log('curUser after : ',JSON.stringify(curUser));
              if(curUser != undefined && curUser != null){
                a.instImage = curUser.imgUrl;
              }
              else{
                a.instImage = this.defaultInsImage;
              }
              tempArr.push(a);
          });

          console.log('after processs inst : ',JSON.stringify(tempArr));
          favTempArr = tempArr;
          this.visibleCardElementArray = [];
       }
       catch(error){
         console.log('error : ',error.message);
       }
        await allEntitySubs()
        .then(result => {
          console.log('outside inst : ',JSON.stringify(result));
          //console.log('visible array : ',JSON.stringify(this.visibleCardElementArray));
          if(result && result != undefined && result != null){
            try{
              console.log('result inst : ',JSON.stringify(result));
                result.forEach(es => {
                  //TODO : currentItem
                  if(favTempArr && favTempArr != undefined && favTempArr != null){
                    favTempArr.forEach(cls => {
                      //TODO : currentItem
                      if(es.ParentId == cls.Id){
                        console.log('Inst name : ',cls.Name);
                        cls.instructorFavStatus = true;
                        
                        this.visibleCardElementArray.push(cls);
                        //favTempArr.push(cls);
                      }
                    });
                  }
                  else{
                    this.visibleCardElementArray = [];
                  }
                });
                console.log(' inside visible array : ',this.visibleCardElementArray.length , JSON.stringify(this.visibleCardElementArray));
                if(this.visibleCardElementArray.length > 0){
                  this.haveFavInstructor = true;
                }
                else{
                  this.haveFavInstructor = false;
                }
              }
              catch(error){
                console.log('errorr : ',error.message);
              }
            }
        })
      }
      if(error){
        console.log('error : ',error);
      }
    }
    favoriteHandler2(event){
      let instId = event.target.dataset.id;
      let instStatus = event.target.dataset.isfav;
      console.log('instStatus : ',instStatus);
      follow({recId : instId , isFollowing : instStatus})
      .then(result => {
        console.log('response : ',result);
        if(result == true){
          this.visibleCardElementArray.forEach(e => {
            //TODO : currentItem
            if(String(e.Id) == instId){
              e.instructorFavStatus = true;
              this.template.querySelector('c-toast-message').showToast('success', 'Favorite successfully.');
              console.log('if true class status : ',e.instructorFavStatus);
              allEntitySubs()
              .then(result => {
                console.log('if true es : ',JSON.stringify(result));
              })
            }
          });
        }
        else if(result == false){
          this.visibleCardElementArray.forEach(e => {
            //TODO : currentItem
            if(e.Id == instId){
              e.instructorFavStatus = false;
              console.log('if false class status : ',e.instructorFavStatus);
              this.template.querySelector('c-toast-message').showToast('success', 'Unfavorite successful.');
              allEntitySubs()
              .then(result => {
                console.log('if false es : ',JSON.stringify(result));
              })
            }
          });
        }
      })
      .catch(error=>{
        console.log('error : ',JSON.stringify(error));
      })

    }
}