/**
 * The view to display the user management.
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

import {SingleUserView} from './singleUser';
import {EditSingleUserView} from './editSingleUser';
import {AddUserView} from './addUser';
import {app} from '../main';

var UsersView = Backbone.View.extend( {

    post_template: _.template( $( '#users-template' ).html() ),

    initialize () {
        this.listenTo( this.collection, ' sync destroy ', this.render );

        //in order to get all user details we need to pass the query parameter ?context=edit
        this.collection.fetch( {
            data : { context: 'edit' },
            reset: true
        } );

    },
    render () {
        this.$el.html( this.post_template() );
        $( '#sub-view-container' ).html( this.el );
        //add "Add user" form
        var addUserView = new AddUserView( { collection: this.collection } );
        $( '#sub-view-container #show-add-user-form' ).after( addUserView.el );
        //show add user row when "add user"  is clicked
        $( '#show-add-user-form' ).click( function( event ) {
            $( '.add-user' ).toggle();
        } );

        //iterate over collection and show and edit all users
        this.collection.forEach( ( user )=> {
            var singleUserView = new SingleUserView( { model: user } );
            $( '#user-table' ).append( singleUserView.el );
            var editSingleUserView = new EditSingleUserView( { model: user } );
            $( '#user-table' ).append( editSingleUserView.el );
        } );

        //show edit row for user  when "edit user" button is clicked
        $( '.edit-user-btn' ).click( function( event ) {
            var currentUser = event.currentTarget.name;
            var currentUserEditID = "#edit-user" + currentUser;

            var currentEditRow = $( currentUserEditID );
            if ( !currentEditRow.is( ":visible" ) ) {
                $( '.edit-user' ).hide();
                currentEditRow.fadeIn();
            }
            else {
                currentEditRow.fadeOut();
            }

        } );

        return this;

    }

} );

export default { UsersView };
