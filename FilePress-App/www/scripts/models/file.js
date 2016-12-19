/**
 * The model for a single file.
 */

import Backbone from 'backbone';
var FilePressFile = Backbone.Model.extend( {

    defaults: {
        content:{raw:'no file associated'},
        status:'publish'
    }
} );

export{FilePressFile};
