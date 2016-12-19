/**
 * Sub-view to display  the user data in a table row
 */

"use strict";
import _ from 'underscore';
import Backbone from 'backbone';

//jQuery
import jQuery from 'jquery';
import $ from 'jquery';
// export for others scripts to use
window.$ = $;
window.jQuery = jQuery;

var SingleUserView = Backbone.View.extend( {
    tagName      : 'tr',
    post_template: _.template( $( '#user-single-template' ).html() ),
    initialize () {
        this.render();
    },
    render () {
        var currentId = "user" + this.model.get( 'id' )
        this.$el.attr( 'id', currentId );
        this.$el.html( this.post_template( this.model.toJSON() ) );

        return this;

    },
    events       : {}

} );

export  {SingleUserView};
