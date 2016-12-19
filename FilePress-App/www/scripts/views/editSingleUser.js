/**
 * Sub-view to edit the user data in a table row
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
import {app} from '../main';


var EditSingleUserView = Backbone.View.extend( {
    tagName  : 'tr',
    className: 'warning edit-user  ',

    post_template: _.template( $( '#edit-user-single-template' ).html() ),
    initialize () {
        this.render();
    },
    render () {
        console.log();
        var currentId = "edit-user" + this.model.get( 'id' );
        this.$el.attr( 'id', currentId );

        this.$el.html( this.post_template( this.model.toJSON() ) );

        return this;

    },
    events       : {
        'click .save-changes-btn': 'saveUser',
        'click .delete-user-btn' : 'deleteUser'
    },
    saveUser( event ){
        //get userid
        var currentUserId = event.currentTarget.name;
        console.log( currentUserId );
        var firstName = $( '#first-name' + currentUserId ).val().trim();
        var lastName = $( '#last-name' + currentUserId ).val().trim();
        var eMail = $( '#email' + currentUserId ).val().trim();
        var role = $( '#role' + currentUserId ).val();

        console.log( this.model.toJSON() );
        this.model.set( {first_name: firstName, last_name: lastName, email: eMail, roles: new Array( role ) } );
        this.model.save( null, {
            wait:true,

                success: ( model, resp )=> {
                    app.eventBus.trigger( 'successMessage', 'User successfully saved to server.' );

                },
                error  : function( model, response ) {
                    app.eventBus.trigger( 'errorMessage', response.responseText );

                }
            }
        )
        ;
    },
    deleteUser( event ){
        //we need to build a custom url for the delete request as jQuery does not support the "data" attribute for DELETE
        //get collection URL
        var collectionURL = this.model.attributes._links.collection[ 0 ].href;
        //get user ID
        var userID = event.currentTarget.name;
        //put everything together, add force=true &reassing=1 (see http://v2.wp-api.org/reference/users/)
        collectionURL += "/" + userID + "?force=true&reassign=1";

        //call "destroy" using our custom URL
        this.model.destroy( {
            url: collectionURL,
            wait:true,

            success: ( model, resp )=> {
                app.eventBus.trigger( 'successMessage', 'User deleted.' );

            },
            error  : function( model, response ) {
                app.eventBus.trigger( 'errorMessage', response.responseText );
            }

        } );

    }
} );

export  {EditSingleUserView};
