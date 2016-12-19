/**
 * Sub-view to add a new file
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
var UploadFileView = Backbone.View.extend( {
        tagName  : 'div',
        className: 'upload-file',

        post_template: _.template( $( '#upload-file-template' ).html() ),
        initialize () {
            this.render();
        },
        render () {
            this.$el.html( this.post_template() );
            return this;

        },
        events       : { 'submit': 'uploadFile' },
        uploadFile( event )
        {
            event.preventDefault();
            var url = app.REST_URL + '/wp-json/wp/v2/filepress-files/v1';

            var fileInput = $( '#file-input' );
            var file = fileInput[ 0 ].files[ 0 ];
            var formData = new FormData();
            formData.append( 'file', file );

            Backbone.$.ajax( {
                url        : url,
                method     : 'POST',
                data       : formData,
                crossDomain: true,
                contentType: false,
                processData: false,

                success: ( resp )=> {
                    app.eventBus.trigger( 'successMessage', 'File successfully saved to server.' );
                    //update collection with the new cpt entry that was created on the server
                    this.collection.fetch( { wait: true, data: { context: 'view' },reset:true } );

                },
                error  : function( response ) {
                    app.eventBus.trigger( 'errorMessage', response.responseText );
                }

            } );

        },

    } )
    ;

export  {UploadFileView};
