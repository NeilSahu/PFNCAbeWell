import { LightningElement, wire, track, api } from 'lwc';
import getBlogs from '@salesforce/apex/bwps_WIP_blogsController.getBlogs';

import blogs from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import heroImage from '@salesforce/resourceUrl/headerHeroImages';

import imageResource from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import bgimg from '@salesforce/resourceUrl/bwps_WIP_BlogPostView';
import getEducationalResourcesForBlogs from '@salesforce/apex/bwps_websiteGeneralFaqClass.getEducationalResourcesForBlogs';
import getStoriesforBlog from '@salesforce/apex/bwps_websiteGeneralFaqClass.getStoriesforBlog';

export default class Pfnca_main_blogs extends LightningElement {

    img2 = `${imageResource}/WebsiteGeneralFiles/blog_1.png`;

    heroImage = heroImage + '/headerBLOG.png';


    blog_photo = `${blogs}/WebsiteGeneralFiles/blog_photo.png`;
    blog_1 = `${blogs}/WebsiteGeneralFiles/blog_1.png`;

    @track data = { "blogs": [{}], "eduBlogs": [{}] , "storyBlogs": [{}] };

    @track header_blog = {};

    pageSize = 6; //for pagination
    totalData = 0; //for pagination

    @track blogsRecord;

    @track used_blogs = this.data.blogs;
    @track blogNotFornd = true;

    @track used_blogs_edu;

    @track used_blogs_story;



    img1 = `${imageResource}/WebsiteGeneralFiles/blog_photo.png`;
    img2 = `${imageResource}/WebsiteGeneralFiles/blog_1.png`;
    bgimg = `${bgimg}/Background_Circle_Graphic.svg`;
    get backgroundStyle() {
        return `
                width: 100%;
                position: relative;
                background: url("${this.bgimg}");
                background-size: cover;
                background-position: -20rem 65%;
                background-blend-mode: color;
                background-size: inherit;
                background-repeat: no-repeat;`;

    }




    dateTimeFormatter(dateString) {
        // - dateString: "2023-01-17T11:01:12.000Z"
        // - retrun format: "January 17, 2023"
        const event = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return event.toLocaleDateString('en-US', options);
    }

    get showPaginationComponent() {
        if (this.totalData <= this.pageSize) {
            return false;
        }
        return true;
    }

    async connectedCallback() {

        await getBlogs()
            .then((result) => {
                let d = result;
                if (result != undefined && result != null) {
                    this.blogNotFornd = false;
                }
                 console.log('blog data rj',JSON.stringify(result));
                this.data.blogs = d.map((element) => {
                    return {
                        "id": element.Id,
                        "photo": (element?.BlogHeaderUrl__c) ? element.BlogHeaderUrl__c : this.blog_photo,
                        "auther": element.CreatedBy.FirstName + ' ' + element.CreatedBy.LastName,
                        "date": this.dateTimeFormatter(element.CreatedDate),
                        "category": element.BWPS_Category__c, //
                        "heading": element.Name,
                        "description": element.BWPS_Discription__c,
                        "info": (element?.BWPS_Blog_content1__c) ? element.BWPS_Blog_content__c + " " + element.BWPS_Blog_content1__c : element.BWPS_Blog_content__c
                    }
                })

                // console.log("this.data.blogs : ", this.data.blogs);
                this.used_blogs = this.data.blogs;
                // console.log(' this.used_blogs length ', this.used_blogs.length);
                // console.log(' this.used_blogs ', JSON.stringify(this.used_blogs[0]));
                this.header_blog = this.data.blogs[0];

                this.recentUpdatesBlogs = this.data.blogs.slice(0, 3);

                this.totalData = d.length;

            })

        await getEducationalResourcesForBlogs()
            .then((result) => {
                let d = result;
                console.log('eduBlogs rj', JSON.stringify(result));

                this.data.eduBlogs = d.map((element) => {
                    return {
                        "id": element.Id,
                        "photo": element.ResouceImageUrl__c != null && element.ResouceImageUrl__c != undefined && element.ResouceImageUrl__c != '' ? element.ResouceImageUrl__c : this.img2,
                        "auther": element.CreatedBy.FirstName + ' ' + element.CreatedBy.LastName,
                        "date": this.dateTimeFormatter(element.CreatedDate),
                        "category": element.Type__c, 
                        "heading": element.Name,
                        "description": element.Description__c,
                        "info": (element?.Content_Body__c) ? element.Content_Body__c  : ''
                    }
                })

                // console.log("this.data.blogs : ", this.data.blogs);
                this.used_blogs_edu = this.data.eduBlogs;                // console.log(' this.used_blogs length ', this.used_blogs.length);
                 console.log('used_blogs_edu', JSON.stringify(this.used_blogs_edu));

                //this.recentUpdatesBlogs = this.data.eduBlogs.slice(0, 3);

                this.totalData = d.length;

            })

          await getStoriesforBlog()
            .then((result) => {
                let d = result;
                console.log('stroryBlogs rj', JSON.stringify(result));

                this.data.storyBlogs = d.map((element) => {
                    return {
                        "id": element.Id,
                        "photo": element.ResouceImageUrl__c != null && element.ResouceImageUrl__c != undefined && element.ResouceImageUrl__c != '' ? element.ResouceImageUrl__c : this.img2,
                        "auther": element.CreatedBy.FirstName + ' ' + element.CreatedBy.LastName,
                        "date": this.dateTimeFormatter(element.CreatedDate),
                        "category": element.Type__c, 
                        "heading": element.Name,
                        "description": element.Description__c,
                        "info": (element?.Content_Body__c) ? element.Content_Body__c : ''
                    }
                })

                // console.log("this.data.blogs : ", this.data.blogs);
                this.used_blogs_story = this.data.storyBlogs;                // console.log(' this.used_blogs length ', this.used_blogs.length);
                 console.log('used_blogs_edu', JSON.stringify(this.used_blogs_story));

                //this.recentUpdatesBlogs = this.data.eduBlogs.slice(0, 3);

                this.totalData = d.length;

            })    


        this.blogsRecord = this.used_blogs.slice(1, Number(this.pageSize) + 1);
        this.blogsRecord1 = this.used_blogs_edu;
        this.blogsRecord2 = this.used_blogs_story;




    }


    handlePagination(event) {
        const start = (event.detail - 1) * this.pageSize;
        // console.log("handlePagination =    ", start);
        const end = this.pageSize * event.detail;
        console.log(start, end);
        this.blogsRecord = this.used_blogs.slice(Number(start) + 1, Number(end) + 1); //plus 1 is added for skipping first blog since it is visible header blog
    }


    searchValue = '';
    handleSearchValue(event) {
        this.searchValue = event.target.value;
    }

    handleSearch(event) {

        let searchValue = this.searchValue;

        let allSearchedBlogs = this.used_blogs.filter((element) => (element.heading).toLowerCase().includes(searchValue.toLowerCase()));
        const headerBlogIndex = allSearchedBlogs.findIndex(element => element.id == this.header_blog.id);
        if (headerBlogIndex != -1) {
            allSearchedBlogs.splice(headerBlogIndex, 1);
        }

        this.blogsRecord = allSearchedBlogs;
        this.totalData = this.blogsRecord.length;

    }

    filterToggle;
    handleCategoryClick(event) {
        let filterCatagory = event.target.innerText;


        if (this.filterToggle != filterCatagory) {
            this.filterToggle = filterCatagory;

            let selected = this.template.querySelector('.selected');

            if (selected != undefined && selected != null) {
                selected.classList.toggle('selected');
            }
            event.target.classList.toggle('selected');

            console.log(filterCatagory.toLowerCase());

            let allSearchedBlogs = this.used_blogs.filter((element) => (element.category).toLowerCase().includes(filterCatagory.toLowerCase()));

            if (allSearchedBlogs.length != 0)

                var headerBlogIndex = allSearchedBlogs.findIndex(element => element.id == this.header_blog.id);
            if (headerBlogIndex != -1) {
                allSearchedBlogs.splice(headerBlogIndex, 1);
            }
            this.blogsRecord = allSearchedBlogs;
            this.totalData = this.blogsRecord.length;


        } else {
            this.filterToggle = '';

            this.blogsRecord = this.used_blogs.slice(1, Number(this.pageSize) + 1);

            this.totalData = this.used_blogs.length;

            event.target.classList.toggle('selected');

        }


    }



    showBlog = true;
    blogHeading = '';
    blogDate = '';
    blogAuthor = '';
    blogImage = '';
    blogInfo = '';
    blogId = '';

    handleBlogClick(event) {
        // console.log("------data-id----", event.target.dataset.id);
        let id;
        if (event.target.dataset.id != undefined && event.target.dataset.id != null) {
            id = event.target.dataset.id;
        } else if (event.target.dataset.img != undefined && event.target.dataset.img != null) {
            id = event.target.dataset.img;
        } else if (event.target.dataset.des != undefined && event.target.dataset.des != null) {
            id = event.target.dataset.des;
        }

        let blogIndex = this.data.blogs.findIndex((element) => element.id == id);

        this.blogHeading = this.data.blogs[blogIndex].heading;
        this.blogDate = this.data.blogs[blogIndex].date;
        this.blogAuthor = this.data.blogs[blogIndex].auther;
        this.blogImage = this.data.blogs[blogIndex].photo;
        this.blogInfo = this.data.blogs[blogIndex].info;
        this.blogId = this.data.blogs[blogIndex].id;


        this.showBlog = false;
        this.template.querySelector('.blogsPage').style.display = 'none';

    }

    handleBlogClickEdu(event) {
        // console.log("------data-id----", event.target.dataset.id);
        let id;
        if (event.target.dataset.id != undefined && event.target.dataset.id != null) {
            id = event.target.dataset.id;
        } else if (event.target.dataset.img != undefined && event.target.dataset.img != null) {
            id = event.target.dataset.img;
        } else if (event.target.dataset.des != undefined && event.target.dataset.des != null) {
            id = event.target.dataset.des;
        }

        let blogIndex = this.data.eduBlogs.findIndex((element) => element.id == id);

        this.blogHeading = this.data.eduBlogs[blogIndex].heading;
        this.blogDate = this.data.eduBlogs[blogIndex].date;
        this.blogAuthor = this.data.eduBlogs[blogIndex].auther;
        this.blogImage = this.data.eduBlogs[blogIndex].photo;
        this.blogInfo = this.data.eduBlogs[blogIndex].info;
        this.blogId = this.data.eduBlogs[blogIndex].id;


        this.showBlog = false;
        this.template.querySelector('.blogsPage').style.display = 'none';

    }

    handleBlogClickStory(event) {
        // console.log("------data-id----", event.target.dataset.id);
        let id;
        if (event.target.dataset.id != undefined && event.target.dataset.id != null) {
            id = event.target.dataset.id;
        } else if (event.target.dataset.img != undefined && event.target.dataset.img != null) {
            id = event.target.dataset.img;
        } else if (event.target.dataset.des != undefined && event.target.dataset.des != null) {
            id = event.target.dataset.des;
        }

        let blogIndex = this.data.storyBlogs.findIndex((element) => element.id == id);

        this.blogHeading = this.data.storyBlogs[blogIndex].heading;
        this.blogDate = this.data.storyBlogs[blogIndex].date;
        this.blogAuthor = this.data.storyBlogs[blogIndex].auther;
        this.blogImage = this.data.storyBlogs[blogIndex].photo;
        this.blogInfo = this.data.storyBlogs[blogIndex].info;
        this.blogId = this.data.storyBlogs[blogIndex].id;


        this.showBlog = false;
        this.template.querySelector('.blogsPage').style.display = 'none';

    }


    handleBackClick() {
        this.showBlog = true;
        this.template.querySelector('.blogsPage').style.display = 'block';
    }

    //recent blog functionality
    recentUpdatesBlogs = this.data.blogs.slice(0, 3);

    handleRecentBlogClick(event) {
        let id = event.detail.blogId;

        let blogIndex = this.data.blogs.findIndex((element) => element.id == id);

        this.blogHeading = this.data.blogs[blogIndex].heading;
        this.blogDate = this.data.blogs[blogIndex].date;
        this.blogAuthor = this.data.blogs[blogIndex].auther;
        this.blogImage = this.data.blogs[blogIndex].photo;
        this.blogInfo = this.data.blogs[blogIndex].info;
        this.blogId = this.data.blogs[blogIndex].id;

        this.showBlog = false;
        this.template.querySelector('.blogsPage').style.display = 'none';
    }

    // education blog start 
    // EduResources;
    // @wire(getEducationalResources)
    // wiredRes({ data, error }) {
    //     if (data) {
    //         try {
    //             let arr = JSON.parse(JSON.stringify(data));
    //             arr.forEach(ele => {
    //                 let img;
    //                 if (ele.ResouceImageUrl__c != null && ele.ResouceImageUrl__c != undefined && ele.ResouceImageUrl__c != '') {
    //                     img = ele.ResouceImageUrl__c;
    //                 }
    //                 else {
    //                     img = this.img2;
    //                 }
    //                 ele.ResourceImage = img;
    //             });
    //             this.EduResources = arr;
    //         }
    //         catch (error) {
    //             console.log('error : ', error, error.message);
    //         }

    //     }
    //     else if (error) {
    //         console.log('OUTPUT : ', error);
    //     }
    // }
    // stories;
    // @wire(getStories)
    // wiredStories({ data, error }) {
    //     if (data) {
    //         //this.stories =data;
    //         try {
    //             let arr = JSON.parse(JSON.stringify(data));
    //             arr.forEach(ele => {
    //                 let img;
    //                 if (ele.ResouceImageUrl__c != null && ele.ResouceImageUrl__c != undefined && ele.ResouceImageUrl__c != '') {
    //                     img = ele.ResouceImageUrl__c;
    //                 }
    //                 else {
    //                     img = this.img2;
    //                 }
    //                 ele.ResourceImage = img;
    //             });
    //             this.stories = arr;
    //         }
    //         catch (error) {
    //             console.log('error : ', error, error.message);
    //         }
    //     }
    //     else if (error) {
    //         console.log('OUTPUT : ', error);
    //     }
    // }
    handleClick(e) {
         var id = e.target.dataset.id;
        var result = window.btoa(id);
        window.open('/PFNCADNA/s/resourcesdetailview?app=' + result, '_self');
        console.log('Id', id, result);
    }

}