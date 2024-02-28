import { api, LightningElement, wire, track } from 'lwc';
import imageResource from '@salesforce/resourceUrl/WebsiteGenFaqImage';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
// import userId from '@salesforce/user/Id';
import getUserProfileName from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
import allEntitySubs from '@salesforce/apex/DNA_GuestUserClass.allEntitySubs';
import follow from '@salesforce/apex/DNA_GuestUserClass.follow';

export default class Bwps_WIP_BlogPostView extends LightningElement {

    currentUserProfileName;

    downloadIcon = imageResource + "/Download.svg";
    // likeIcon = imageResource + "/Favorite.svg";
    shareIcon = imageResource + "/Share.svg";

    backIcom = imageResource + "/chevron-1.svg";

    @track unFavIcon = `${allIcons}/PNG/unfavorite.png `;
    @track favIcon = `${allIcons}/PNG/Favorite.png `;

    //for parent to child (blog to blogPostView)
    @api blogHeading = '8 Tips for Surviving the Winter with Parkinson\'s';
    @api blogDate = 'MARCH 23, 2021';
    @api blogAuthor = 'ZACH GALATI';
    @api blogImage = this.downloadIcon;
    // @api blogInfo = 'test content';
    @api blogInfo = '';
    @api blogId = '';

    @track blogFavStatus = false;

    get isLoggedInMemberOrGuest() {
        if (this.currentUserProfileName == 'Member User' || this.currentUserProfileName == 'Guest User') {
            return true;
        }
        else
            return false;
    }


    @wire(getUserProfileName)
    profileName({ data, error }) {
        if (data) {
            this.currentUserProfileName = data.Profile.Name;
            // console.log(this.currentUserProfileName);
        }
        else if (error) {
            console.log("error", error.body.message);
        }
    }


    //for child to parent (for going back to parent using back button - i.e. blogPostView to blog)
    handleBack() {
        this.dispatchEvent(
            new CustomEvent('backclick')
        );
    }

    scrollToTop() {
        const scrollOptions = {
            left: 0,
            top: 0,
            behavior: 'smooth'
        }
        window.scrollTo(scrollOptions);
    }

    connectedCallback() {
        this.scrollToTop();

        // console.log("in child connected callback : ", this.blogId);

        allEntitySubs()
            .then(result => {
                if (result) {
                    result.forEach(es => {
                        // console.log("es.parentid ", es.ParentId);
                        if (es.ParentId == this.blogId) {
                            this.blogFavStatus = true;
                        }
                    });

                }
            });
    }
    renderedCallback() {
        this.scrollToTop();
        console.log('this.blogInfo : ' + this.blogInfo);
        this.blogInfo.replaceAll('my.site.com', 'file.force.com');
        console.log('this.blogInfo : ' + this.blogInfo);
        let innerStyle = `<style>p{margin-bottom: 1rem;} ul{list-style: Unset;margin-left: 2.5rem;}ol{list-style: decimal;margin-left: 2.5rem;margin-bottom: 1rem;}a{text-decoration:underline; color:#008ba7 !important;}</style>`
        this.template.querySelector(".blog-info").innerHTML = innerStyle + this.blogInfo;
    }

    handleDownloadPDF() {
        window.print();
    }

    favoriteHandler(event) {
        //   let classId = event.target.dataset.id;
        //   let blogId = event.target.dataset.id;
        //   let blogStatus = event.target.dataset.isfav;
        let blogId = this.blogId
        let blogStatus = this.blogFavStatus;

        // imperative apex call
        follow({ recId: blogId, isFollowing: blogStatus })
            .then(result => {
                // console.log('response : ', result);
                if (result == true) {
                    this.blogFavStatus = true;
                }
                else if (result == false) {
                    this.blogFavStatus = false;
                }
            })
            .catch((e) => {
                console.log(JSON.stringify(e), e.Message);
            });

    }



    /*
        To use this componenet as a child in another parent component

        <c-bwps_-w-i-p_-blog-post-view blog-heading="test heading" blog-date="test date" blog-author="test autohr" blog-image="test image url" blog-info="blog info" onbackclick={handlebackClick}></c-bwps_-w-i-p_-blog-post-view>


        and 

        this.showChild = true;
        this.showParent = false;
        handleBackClick(){
            this.showChild = false;
            this.showParent = true;

        }

    */



}