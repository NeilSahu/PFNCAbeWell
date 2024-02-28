import { LightningElement, track,wire } from 'lwc';
import getBlogs from '@salesforce/apex/bwps_WIP_blogsController.getRecentBlogs';
import blogs from '@salesforce/resourceUrl/WebsiteGeneralFiles';
export default class Bwps_DonorBlog extends LightningElement {
    blog_photo = `${blogs}/WebsiteGeneralFiles/blog_photo.png`;
    blog_1 = `${blogs}/WebsiteGeneralFiles/blog_1.png`;

    @track showBlog = false;

    data = {"blogs": [{}]};
    
    @track blogsRecord = [];

    blogInfo = '';
    blogImage = '';
    blogAuthor = '';
    blogDate = '';
    blogHeading = '';
    blogId = '';

    handleBlogClick(event){


        let id = event.target.dataset.id;


        let blog = this.blogsRecord.find((ele) => ele.id == id);

        this.blogInfo = blog.info;
        this.blogImage = blog.photo;
        this.blogAuthor = blog.auther;
        this.blogDate = blog.date;
        this.blogHeading = blog.heading;
        this.blogId = blog.id;
        this.showBlog = true;
        console.log(' blogclick '+this.showBlog);

    }
    handleBackClick(){
        this.showBlog = false;
    }
    
    dateTimeFormatter(dateString) {
        // - dateString: "2023-01-17T11:01:12.000Z"
        // - retrun format: "January 17, 2023"
        const event = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return event.toLocaleDateString('en-US', options);
    }
    

    @wire(getBlogs,{ numberOfBlogs : 3})
    wiredBlogs({data, error}){

        // console.log("@@@@@@@@@@@@@>>>>>>>>>>>>>>>>@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        if (data) {
            //    console.log('sfdf ',JSON.stringify(data));
               let d = data;
            this.blogsRecord = d.map((element) => {
                    
                    return {
                        "id": element.Id,
                        "photo": (element?.BlogHeaderUrl__c) ? element.BlogHeaderUrl__c : this.blog_photo,
                        "auther": element.CreatedBy.FirstName +' '+ element.CreatedBy.LastName,
                        "date": this.dateTimeFormatter(element.CreatedDate),
                        "category": element.BWPS_Category__c, 
                        "heading": element.Name,
                        "description": element.BWPS_Discription__c,
                        "info": (element?.BWPS_Blog_content1__c) ? element.BWPS_Blog_content__c +" "+element.BWPS_Blog_content1__c : element.BWPS_Blog_content__c 
                    }
                })
            // console.log('sfdf ',JSON.stringify(this.blogsRecord));

        } else if (error) {
            console.log("error ", error)
        }
    }

    // fetchBlogs(){
    //     getBlogs()
    //         .then((result) => {
    //             let d = result;
    //             // if(result != undefined && result != null){
    //             //    this.blogNotFornd = false;
    //             // }
    //             // console.log(result);
    //             this.blogsRecord = d.map((element) => {
    //                 return {
    //                     "id": element.Id,
    //                     "photo": (element?.BlogHeaderUrl__c) ? element.BlogHeaderUrl__c : this.blog_photo,
    //                     "auther": element.CreatedBy.FirstName +' '+ element.CreatedBy.LastName,
    //                     "date": this.dateTimeFormatter(element.CreatedDate),
    //                     "category": element.BWPS_Category__c, //
    //                     "heading": element.Name,
    //                     "description": element.BWPS_Discription__c,
    //                     "info": (element?.BWPS_Blog_content1__c) ? element.BWPS_Blog_content__c +" "+element.BWPS_Blog_content1__c : element.BWPS_Blog_content__c 
    //                 }
    //             })

    //             console.log(">>>>>@@@@@@<<<<<< ", JSON.stringify(this.blogsRecord));
    //             // console.log("this.data.blogs : ", this.data.blogs);
    //             // this.used_blogs = this.data.blogs;
    //             // console.log(' this.used_blogs length ', this.used_blogs.length);
    //             // console.log(' this.used_blogs ', JSON.stringify(this.used_blogs[0]));
    //             // this.header_blog = this.data.blogs[0];

    //             // this.recentUpdatesBlogs = this.data.blogs.slice(0, 3);

               

    //         })
    //         .catch( error => console.log("error 251",error))
    // }

    // connectedCallback() {
    //     console.log("@@@@@@@@@>>>>>>>>>>>>>");

    //     this.fetchBlogs();

        
    //     // this.blogsRecord = this.data.blogs;

    // }



 
}