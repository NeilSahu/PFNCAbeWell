import { LightningElement, api } from 'lwc';
export default class LinkCmp extends LightningElement {

    @api linkUrl = 'https://www.google.com/';
    @api linkTarget = '_self';
    @api linkLabel = 'Link';
    @api variant = 'standalone';

    get fontClass() {
        return this.variant == 'inline' ? 'link-inline' : 'link-standalone';
    }

}