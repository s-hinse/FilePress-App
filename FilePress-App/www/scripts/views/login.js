/**
 * The view to display the login screen
 */

import _ from 'underscore';
import Backbone from 'backbone';
import {app} from '../main';

//jQuery
import $ from 'jquery';

var LoginView = Backbone.View.extend( {

    post_template: _.template( $( '#login-template' ).html() ),
    initialize () {

        this.render();
    },
    render () {
        console.log( "login render" );
        this.$el.html( this.post_template() );
        console.log( this.el );
        $( '#app-container' ).html( this.el );

    },
    events       : { 'submit': 'logIn' },
    /**
     * The handler for the submit event
     * @param event
     */
    logIn     ( event ) {
        event.preventDefault();
        var user = $( '#user' ).val().trim();
        var password = $( '#password' ).val().trim();

        this.checkCredentials( user, password );

    },

    /**
     * checks the user credendtials by performing a request to the wp REST API
     * @param  {string} user
     * @param  {string}password
     * fires the event login:success if request was successful
     * displays a error message if an error occurred
     */
    checkCredentials ( user, password ) {
        //encode user and password
        var credentials = btoa( user + ':' + password );

        //make a request to the /is-logged-in endpoint to check if the credentials are correct

        $.ajax( {
            type      : "GET",
            url       : app.REST_URL + '/wp-json/wp/v2/filepress-files/v1/is-logged-in',
            context   : this,
            beforeSend: function( xhr ) {
                xhr.setRequestHeader( 'Authorization', 'Basic ' + credentials );

            },
            success   : function( data ) {
                //we store the user and the credentials in the model
                this.model.set( { 'user': user, 'credentials': credentials } );
                console.log( data );
                //fire success event for main view
                this.trigger( 'login:success' );

            },
            /**
             *if error, we show a error message
             @todo: Check for different errors
             */
            error     : function( error ) {

                var msg = '<div class="alert alert-warning margin-top-small text-centered" id="error">Wrong User or Password! </div>';
                if ( !$( '#error' ).length ) {
                    $( '#login-form' ).append( msg );

                }

            }

        } );

    }
} );

export {LoginView};

