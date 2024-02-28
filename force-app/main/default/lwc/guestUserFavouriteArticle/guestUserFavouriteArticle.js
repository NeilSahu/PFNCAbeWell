import { LightningElement, track, wire } from 'lwc';
// import FavouritArticleImage1 from '@salesforce/resourceUrl/FavouritArticleImage1';
// import likeButton from '@salesforce/resourceUrl/likeButton';
import FavouritArticleImage2 from '@salesforce/resourceUrl/FavouritArticleImage2';
import FavouritArticleImage3 from '@salesforce/resourceUrl/FavouritArticleImage3';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';

import getBlogs from '@salesforce/apex/bwps_WIP_blogsController.getBlogs';

// import getAllInstructors from '@salesforce/apex/DNA_GuestUserClass.getAllInstructors';
import allEntitySubs from '@salesforce/apex/DNA_GuestUserClass.allEntitySubs';
// import follow from '@salesforce/apex/DNA_GuestUserClass.follow';
export default class GuestUserFavouriteArticle extends LightningElement {
  // FavouritArticleImage1 = FavouritArticleImage1;
  FavouritArticleImage2 = FavouritArticleImage2;
  FavouritArticleImage3 = FavouritArticleImage3;
  // @track defaultInsImage = FavouriteInstructorImage1;
  blog_photo = this.FavouritArticleImage2;
  @track favIcon = `${allIcons}/PNG/Favorite.png `;
  @track unFavIcon = `${allIcons}/PNG/unfavorite.png `;
  // likeButton=likeButton;
  // blogs=[
  //     {"imgUrl":`${this.FavouritArticleImage2}`,"date":"ZACH GALATI","date1":"MARCH 23,2021","lessons":"Lesson's from Being the Child of a parent with Parkinson's","Details":"Parkinson Foundation of the National Capital Area(PFNCA) helps people with Parkinsn's slow with the disease's progression"},
  //     {"imgUrl":`${this.FavouritArticleImage2}`,"date":"ZACH GALATI","date1":"MARCH 23,2021","lessons":"Lesson's from Being the Child of a parent with Parkinson's","Details":"Parkinson Foundation of the National Capital Area(PFNCA) helps people with Parkinsn's slow with the disease's progression"},
  //     {"imgUrl":`${this.FavouritArticleImage3}`,"date":"ZACH GALATI","date1":"MARCH 23,2021","lessons":"Lesson's from Being the Child of a parent with Parkinson's","Details":"Parkinson Foundation of the National Capital Area(PFNCA) helps people with Parkinsn's slow with the disease's progression"}
  //   ];

  @track allBlogs = [];
  @track favouriteBlogs = [];
  @track haveFavArticle = false;

  dateTimeFormatter(dateString) {
    // - dateString: "2023-01-17T11:01:12.000Z"
    // - retrun format: "January 17, 2023"
    const event = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return event.toLocaleDateString('en-US', options);
  }

  async connectedCallback() {
    console.log('connectedCallBack Article');

    await getBlogs()
    .then( result => {
      let d = result;
      this.allBlogs = d.map((element) => {
        return {
          "id": element.Id,
          "photo": (element?.BlogHeaderUrl__c) ? element.BlogHeaderUrl__c : this.blog_photo,
          "auther": element.CreatedBy.FirstName + ' ' + element.CreatedBy.LastName,
          "date": this.dateTimeFormatter(element.CreatedDate),
          "category": element.BWPS_Category__c,
          "heading": element.Name,
          "description": element.BWPS_Discription__c,
          "info": (element?.BWPS_Blog_content1__c) ? element.BWPS_Blog_content__c + " " + element.BWPS_Blog_content1__c : element.BWPS_Blog_content__c
        }
      })
      console.log('favBlogs first : ',JSON.stringify(this.favouriteBlogs));
      if(this.favouriteBlogs.length > 0){
        this.haveFavArticle = true;
      }
      else{
        this.haveFavArticle = false;
      }
    })
    .catch( error => console.log( "error : ", error.body.message));


    await allEntitySubs()
      .then(result => {
        if (result) {
          let data = result;
          this.favouriteBlogs = this.allBlogs.filter(ele => data.some(ele2 => ele2.ParentId == ele.id));
        }

        console.log('favBlogs second : ',JSON.stringify(this.favouriteBlogs));
        if(this.favouriteBlogs.length > 0){
          this.haveFavArticle = true;
        }
        else{
          this.haveFavArticle = false;
        }
      })
    // console.log("this.favouriteBlogs : ", this.favouriteBlogs);
  }


  blogId = '';
  blogHeading = '';
  blogDate = '';
  blogAuthor = '';
  blogInfo = '';
  blogImage = '';
  showBlogDetail = false;

  handleBlogClick(event){

    console.log( "selectedBlog ");
    let selectedBlogId = event.target.dataset.id;
    console.log( "selectedBlog ", selectedBlogId);

    let selectedBlog = this.favouriteBlogs.find( element  => element.id == selectedBlogId );

    console.log( "selectedBlog ", selectedBlog);

    this.blogId = selectedBlog.id;
    this.blogHeading = selectedBlog.heading;
    this.blogDate = selectedBlog.date;
    this.blogAuthor = selectedBlog.auther;
    this.blogInfo = selectedBlog.info;
    this.blogImage = selectedBlog.photo;
    
    this.showBlogDetail = true;
  }
  handleBackClick(){
    this.showBlogDetail = false;

  }


}