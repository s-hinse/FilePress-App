/**
 * The main app view, contains the menu and controls sub-views
 */
"use strict";
import _ from 'underscore';
import Backbone from 'backbone';
import {app} from "../main.js";

//jQuery
import jQuery from 'jquery';
import $ from 'jquery';
// export for others scripts to use
window.$ = $;
window.jQuery = jQuery;
require( 'bootstrap' );

//import model(s)
import {FilePressFile} from  '../models/file.js';
import {User} from '../models/user';
//import sub-views
import {UsersView} from './users';
import {FilesView} from './files';


var AppView = Backbone.View.extend( {

        post_template: _.template( $( '#menu-template' ).html() ),
        initialize () {



            //add credentials to every ajax request
            var credentials = this.model.get( 'credentials' );
            Backbone.$.ajaxSetup( {
                    headers: { "Authorization": "Basic " + credentials }
                }
            );





            this.render();
        },
        addListeners( obj ) {
            //add listeners for success and error events
            obj.listenTo( app.eventBus, 'successMessage', app.showSuccessModal );
            obj.listenTo( app.eventBus, 'errorMessage', app.showErrorModal );
        },
        render () {




            this.$el.html( this.post_template( this.model.toJSON() ) );
            $( '#app-container' ).html( this.el );
            return this;

        },
        events       : {
            "click #logout"    : "logoutHandler",
            "click #users-view": "showUsersView",
            "click #files-view": "showFilesView",

        },
    createUsersCollection(){  //setting up a User collection class with REST URL
        var Users = Backbone.Collection.extend( {
            model: User,
            //sort collection by user id
            comparator( model ) {
                return model.get( 'id' );
            },
            url  : app.USERS_URL
        } );
        app.users= new Users();},
        showUsersView(){
            if ( this.subview ) {
                this.subview.remove();
            }

            this.createUsersCollection();

            //create a view with this collection
            this.subview = new UsersView( { collection: app.users } );
            this.addListeners( this );

            this.subview.collection.on( 'error', ( source, error )=> {
                app.showErrorModal( error.responseText );

            } );

        },
        showFilesView (){
            if (!app.users){
                this.createUsersCollection();
            }
            if ( this.subview ) {
                this.subview.remove();
            }
            //setting up a Files collection class with REST URL
            var Files = Backbone.Collection.extend( {
                model: FilePressFile,
                //sort collection by  id
                comparator( model ) {
                    return model.get( 'id' );
                },
                url  : app.REST_URL + '/wp-json/wp/v2/filepress-files/v1'

            } );
            this.subview = new FilesView( { collection: new Files() } );
            this.addListeners(this);
        },
        logoutHandler() {
            this.trigger( 'app:logout' );

        },

    } )
    ;

export {AppView};