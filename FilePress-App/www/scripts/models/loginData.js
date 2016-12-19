/**
 * Created by SvenH on 11.10.2016.
 */

import Backbone from 'backbone';
var LoginData = Backbone.Model.extend( {

    defaults: {

        user              : 'empty',
        credentialsEncoded: ''
    }
} );

export{LoginData};
