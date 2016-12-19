/**
 * Sub-view to add a new user
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

import  {app} from '../main';
var AddUserView = Backbone.View.extend( {
    tagName  : 'div',
    className: 'add-user',

    post_template: _.template( $( '#add-user-template' ).html() ),
    initialize () {
        this.render();
    },
    render () {

        this.$el.html( this.post_template() );

        return this;

    },
    events       : { 'submit': 'addUser' },
    addUser( event )
    {
        event.preventDefault();
        console.log( "adduser" );
        var username = $( '#name' ).val().trim();
        var firstName = $( '#first-name' ).val().trim();
        var lastName = $( '#last-name' ).val().trim();
        var eMail = $( '#email' ).val().trim();
        var role = $( '#role' ).val();
        var roleArray = new Array (role);
        var password = $( '#user-password' ).val();
        var userData = {
            username  : username,
            first_name: firstName,
            last_name : lastName,
            email     : eMail,
            roles     : roleArray,
            password  : password
        };
        console.log( userData );
        this.collection.create( userData, {
            success: ( model, resp )=> {
                app.eventBus.trigger( 'successMessage', 'User successfully saved to server.' );

            },
            error  : function( model, response ) {
                app.eventBus.trigger( 'errorMessage', response.responseText );
            }

        } );

    },


} );

export  {AddUserView};
