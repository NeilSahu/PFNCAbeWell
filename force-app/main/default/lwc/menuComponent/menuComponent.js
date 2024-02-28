import { LightningElement, track, wire, api } from 'lwc';
import allIcons from '@salesforce/resourceUrl/instructorAndGuestUser';
import menuIcons from '@salesforce/resourceUrl/menuComponentIcons';
import basePath from '@salesforce/community/basePath';
export default class MenuComponent extends LightningElement {
    @track showMenu = false;
    @track home = `${allIcons}/PNG/Home.png `;
    @track cancel = `${allIcons}/PNG/Close.png `;
    @track browseClasses = `${allIcons}/PNG/Browse_Classes.png `;
    @track faq = `${allIcons}/PNG/FAQs.png `;
    @track blog = `${allIcons}/PNG/Blog.png `;
    @track about = `${allIcons}/PNG/About.png `;
    // @track menu =  `${allIcons}/PNG/Contact.png `;
    @track contact = `${allIcons}/PNG/Contact.png `;
    @track contact = `${allIcons}/PNG/Contact.png `;
    @track contact = `${allIcons}/PNG/Contact.png `;
    @track menu = menuIcons + `/menuComponentIcons/Menu.svg `;
    @track favorites = menuIcons + `/menuComponentIcons/Favorites.svg `;
    @track schedule = menuIcons + `/menuComponentIcons/Schedule.svg `;
    @track classes = menuIcons + `/menuComponentIcons/Classes.svg `;
    @track activity = menuIcons + `/menuComponentIcons/Activity.svg `;
    @track menu = menuIcons + `/menuComponentIcons/Burger_Menu.svg `;
    @track browse = menuIcons + `/menuComponentIcons/Browse_Classes.svg `;
    @track howto = menuIcons + `/menuComponentIcons/How_to_Participate.svg `;
    @track contact = menuIcons + `/menuComponentIcons/Contact.svg `;
    @track about = menuIcons + `/menuComponentIcons/About@2x.png `;
    @track blog = menuIcons + `/menuComponentIcons/Blog.svg `;
    @track faqs = menuIcons + `/menuComponentIcons/FAQs.svg `;
    name = 'Menu';
    menuHandler(event) {
        var name = event.currentTarget.dataset.name;
        console.log('Menu : ', name);
        if (name == 'Menu') {
            this.showMenu = !this.showMenu;
        } else if (name == 'My Favorites') {
            window.open('/PFNCADNA/s/favoritepage', '_self');
        } else if (name == 'My Classes') {
            window.open('/PFNCADNA/s/myclassespage', '_self');
        } else if (name == 'My Schedule') {
            window.open('/PFNCADNA/s/myschedule', '_self');
        } else if (name == 'My Activity') {
            window.open('/PFNCADNA/s/guestuserdashboard', '_self');
        } else {
            this.showMenu = !this.showMenu;
        }
    }
    handleSubMenu(event){
        let name = event.target.dataset.name;
        if (name == 'BrowseClass') {
            window.open('/PFNCADNA/s/guestuserbrowseclasses', '_self');
        } else if (name == 'HowToParticipate') {
            window.open('/PFNCADNA/s/guestuserhowtoparticipate', '_self');
        } else if (name == 'Blog') {
            window.open('/PFNCADNA/s/guestuserblog', '_self');
        } else if (name == 'Faq') {
            window.open('/PFNCADNA/s/guestuserfaq', '_self');
        }else if (name == 'AboutUs') {
            window.open('/PFNCADNA/s/guestuseraboutus', '_self');
        }else if (name == 'ContactUs') {
            window.open('/PFNCADNA/s/guestusercontact', '_self');
        }
    }
    get logoutLink() {
        const sitePrefix = basePath.replace(/\/s$/i, ""); // site prefix is the site base path without the trailing "/s"
        return sitePrefix + "/secur/logout.jsp";
    }
}