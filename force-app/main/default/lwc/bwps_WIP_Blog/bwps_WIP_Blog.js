import { LightningElement, wire, track } from 'lwc';
import getBlogs from '@salesforce/apex/bwps_WIP_blogsController.getBlogs';

import blogs from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import heroImage from '@salesforce/resourceUrl/headerHeroImages';


export default class Bwps_WIP_Blog extends LightningElement {

    heroImage = heroImage + '/headerBLOG.png';


    blog_photo = `${blogs}/WebsiteGeneralFiles/blog_photo.png`;
    blog_1 = `${blogs}/WebsiteGeneralFiles/blog_1.png`;

    @track data = { "blogs": [{}] };

    @track header_blog = {};

    pageSize = 6; //for pagination
    totalData = 0; //for pagination

    @track blogsRecord;

    @track used_blogs = this.data.blogs;
    @track blogNotFornd = true;
    // date time formatter
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
                // console.log(result);
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

        this.blogsRecord = this.used_blogs.slice(1, Number(this.pageSize) + 1);

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

}