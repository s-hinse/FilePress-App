/**
 * Sub-view to display  the file data in a table row
 */

"use strict";
import _ from 'underscore';
import Backbone from 'backbone';
import {app} from '../main';

//jQuery
import jQuery from 'jquery';
import $ from 'jquery';
// export for others scripts to use
window.$ = $;
window.jQuery = jQuery;

var SingleFileView = Backbone.View.extend( {
    tagName: 'tr',

    post_template: _.template( $( '#file-single-template' ).html() ),
    initialize () {
        this.render();
    },
    render () {
        this.$el.html( this.post_template( this.model.toJSON() ) );
        //build an ID amd display it
        var currentId = "file" + this.model.get( 'id' );
        this.$el.attr( 'id', currentId );
        //get the author ID
        var authorID = this.model.get( 'author' );
        //get the authors' username
        var user = app.users.get( authorID );
        //display the name
        this.$( '#author' ).html( user.get( 'username' ) );

        return this;

    },
    events       : {
        'click .delete-file-btn'  : 'deleteFile',
        'click .download-file-btn': 'downloadFile'
    },
    //returns the URL of clicked file
    getItemURL   ( event ) {
        var collectionURL = this.model.attributes._links.collection[ 0 ].href;
        //get file ID
        var fileID = event.currentTarget.name;
        var fileURL = collectionURL + '/' + fileID;
        return fileURL;
    },
    //triggers the file download
    downloadFile ( event ){
        var fileURL = this.getItemURL( event ) + '?context=view';
        //get the file name and the download code from the server
        Backbone.$.get( fileURL, function( data ) {
            var filename = data.file;
            var salt = data.salt;
            //build the url for the request to the "download" endpoint
            var url = app.REST_URL + '/wp-json/wp/v2/filepress-files/v1/download?file=' + filename + "&salt=" + salt;
            // trigger download in a new window
            window.location = url;
        } );



    },
    deleteFile( event ){
        var fileURL = this.getItemURL( event );
        //we need to build a custom url for the delete request as jQuery does not support the "data" attribute for DELETE
        fileURL += "?force=true";

        //call "destroy" using our custom URL
        this.model.destroy( {
            url: fileURL,
            wait: true,

            success: ( model, resp )=> {
                app.eventBus.trigger( 'successMessage', 'File deleted.' );

            },
            error  : ( model, response )=> {

                app.eventBus.trigger( 'errorMessage', response.responseText );
            },

        }, );

    }

} );

export  {SingleFileView};
