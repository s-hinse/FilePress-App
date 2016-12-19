/**
 * The view to display the user's files.
 */

"use strict";

//jQuery
import jQuery from 'jquery';
import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import {SingleFileView} from './singleFile';
import  {UploadFileView} from './uploadFile';
import {app} from '../main';
// export for others scripts to use
window.$ = $;
window.jQuery = jQuery;

var FilesView = Backbone.View.extend( {

    post_template: _.template( $( '#files-template' ).html() ),
    initialize () {

        this.listenTo( this.collection, ' destroy sync ', this.render );
        var col = this.collection;
        //sync user collection, after success sync files collection which causes the view to render
        app.users.fetch( {
            data: { context: 'view' }, success()
            {
                col.fetch( {
                    data : { context: 'view' },
                    reset: true
                } );
            }
        } );

    },
    render () {
        this.$el.html( this.post_template() );
        $( '#sub-view-container' ).html( this.el );
        var uploadFileView = new UploadFileView( { collection: this.collection } );
        $( '#upload-file-wrapper' ).html( uploadFileView.el );
        //if render() is invoked by an event we have to reassign the events
        this.delegateEvents();

        //iterate over collection and show all files
        this.collection.each( ( filepressFile )=> {
            var singleFileView = new SingleFileView( { model: filepressFile } );

            $( '#files-table' ).append( singleFileView.el );
        } );
        return this;

    },
    events       : {
        'click #show-upload-file-form': 'toggleUploadForm'
    },
    toggleUploadForm() {
        $( '#upload-file-wrapper' ).toggle( 'slow' );

    }

} );

export {FilesView};
