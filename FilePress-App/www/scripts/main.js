/**
 * Created by SvenH on 10.10.2016.
 */

//load app dependencies
import _ from 'underscore';
import Backbone from 'backbone';

import {LoginView} from './views/login';
import {LoginData} from './models/loginData';
import {AppView} from './views/app';

var app = {};
//global REST URLs
app.REST_URL = "https://rest.svenhinse.de";
app.USERS_URL = app.REST_URL + '/wp-json/wp/v2/users/';
//add a global event bus
app.eventBus = _.extend( {}, Backbone.Events );
//set debug.enable = true  and enter your credentials to bypass login screen
app.debug = {};
app.debug.enable = false;
app.debug.user = "web_admin";
app.debug.password = "test2000";
//encode user and password
app.debug.credentials = btoa( app.debug.user + ':' + app.debug.password );

//global error and success modals
app.showErrorModal = function( message ) {

    $( '.modal-title' ).html( "Error!" );
    $( '.modal-body' ).html( message );
    $( '#messageModal' ).modal( 'show' );

};
app.showSuccessModal = function( message ) {
    $( '.modal-title' ).html( "Success!" );
    $( '.modal-body' ).html( message );
    $( '#messageModal' ).modal( 'show' );
    setTimeout( function() {
        $( '#messageModal' ).modal( 'hide' );
        $( 'body' ).removeClass( 'modal-open' );
        $( '.modal-backdrop' ).remove();
    }, 2000 );

};

app.Main = Backbone.View.extend( {
    el: '#app-container',
    initialize (){
        app.loginData = new LoginData();
        //if in debug mode, we skip login screen and use the credentials given in app.debug
        if ( app.debug.enable ) {
            app.loginData.set( { "user": app.debug.user, "credentials": app.debug.credentials } );
            this.showAppView();
            return this;
        }
        //show the login screen and add listener for "login:success" event
        this.loginView = new LoginView( { model: app.loginData } );
        this.listenTo( this.loginView, 'login:success', this.showAppView );

    },
    /**
     * callback for the "login:success" event, shows the main app screen
     */
    showAppView() {

        if ( this.loginView ) {
            this.loginView.remove();
        }

        this.appView = new AppView( { model: app.loginData } );
        this.listenTo( this.appView, 'app:logout', this.logout );

    },
    /**
     * callback for "app:logout" event, removes the app view and restarts the app
     */
    logout() {
        this.appView.remove();
        this.initialize();
    }
} );
//start the app whgen device is ready
document.addEventListener( 'deviceready', onDeviceReady, false );

function onDeviceReady() {

    //start the app
    console.log("start");
    app.main = new app.Main();
}

export {app};


