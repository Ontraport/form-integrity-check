/*
    Ontraport form integrity check

    @Author Jesse Baird <jebaird@gmail.com, jesse@ontraport.com>

    checks all forms on a given page for the common pitfalls that prevent ontraport forms from working correctly

    Checks and creates warnings / errors for the following cases

    * hidden fields
    * div form wrapper classes
    * scripts
        * genjs
        * validator
    * css
    * form post url
    * duplicate versions of jquery


*/
(function(){

        var ontraport = window.ontraport || ( window.ontraport = {} ),

        $ = function( e, context ){
            if( context === undefined ){
                context = document;
            }
            // return an array instead of a node list
            return [].slice.call( context.querySelectorAll( e ), 0 );
        },

        template = function t( s, d ) {
        for ( var p in d )
            s = s.replace( new RegExp( '{' + p + '}', 'g' ), d[ p ] );
        return s;
    },

    containsFormProcessorRegex = /(form_processor.php)/,

    blankUidValueMessage = "This form's hidden field named <b>uid</b> is blank",
    isOntraportFormMessage = 'This form appears to be an ontraport form',
    isNotOntraportFormMessage = 'This form <b>DOES NOT</b> appear to be an ontraport form',

    missingHiddenFieldMessage = "Missing hidden field named <b>{name}</b>",
    // if is an ontraport form, check to make sure that the form contains these fields
    hiddenFieldNames = [
        'contact_id',
        'afft_',
        'aff_',
        'ref_',
        'own_',
        'sess_',
        'utm_source',
        'utm_medium',
        'utm_term',
        'utm_content',
        'utm_campaign',
        'referral_page',
        'oprid', 
        'uid'
    ],
    /*
         check the page for the the following linked assets

         TODO: check the also check the url for the matching uid for the form

         TODO: add check for jquery, required scripts

    */
    linkedAssetUrls = {

        'global': [
            [
                function(){
                    return window.jQuery;
                },
                'It does not appear that this page has jquery on it'
            ],
            [
                function(){
                    return window.jQuery && window.jQuery['fn'].validate
                },
                'This page is missing jquery tools validate, which is used to help validate forms'
            ],
            [
                function(){
                    return window.Orderform
                },
                'This page is missing the code needed to render the grid'
            ],
            [
                '//app.ontraport.com/js/formeditor/moonrayform/paymentplandisplay/production.css',
                'This form appears to be missing the stylesheet needed to display the product grid correctly. //app.ontraport.com/js/formeditor/moonrayform/paymentplandisplay/production.css'
            ],
            [
                '//forms.ontraport.com/formeditor/formeditor/css/form.default.css',
                'Missing //forms.ontraport.com/formeditor/formeditor/css/form.default.css which is needed for the default styles'
            ],
            [
                '//forms.ontraport.com/formeditor/formeditor/css/form.publish.css',
                'Missing //forms.ontraport.com/formeditor/formeditor/css/form.publish.css which is needed for the default styles'
            ],
            [
                '//forms.ontraport.com/v2.4/include/minify/?g=moonrayCSS',
                'Missing moonrayCSS. //forms.ontraport.com/v2.4/include/minify/?g=moonrayCSS'
            ],
            [
                '//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/smoothness/jquery-ui.min.css',
                'Missing jquery ui css, //ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/smoothness/jquery-ui.min.css'
            ]
        ],
        'formSpecific': [
            [
                '//forms.ontraport.com/v2.4/include/formEditor/gencss.php?uid={uid}',
                'This form is missing its generated css needed to display the design from formeditor'
            ],
            [
                '//forms.ontraport.com/v2.4/include/formEditor/genjs-v3.php?html=false&uid={uid}',
                'Missing generated scripts version 3, there isnt a message for missing v2 then its fine'
            ],
            [
                '//forms.ontraport.com/v2.4/include/formEditor/genjs-v2.php?html=false&uid={uid}',
                'Missing generated scripts version 2, there isnt a message for missing v3 then its fine'
            ]
        ]

    };

    console.log('ontraport form form integrity check is running');

    var isOntraportForm = function isOntraportForm( formElement ){
        var isOntraportForm = false,
            fAction = ""+formElement.getAttribute('action');
        // if the form processor is part of the action its more than likey that its an ontraport form
        return containsFormProcessorRegex.test( fAction );

    },

    /*
        show an array off messages in an unordered list in the to left of the element 
    */
    renderMessages = function renderMessages( element, messages ){
        if( messages.length == 0 ){
            return;
        }

        var messages = '<div><ol><li>' + messages.join('</li><li>') + '</li></ol></div>';

        var block = document.createElement( 'div' );

        block.classList.add('form-integrity-check');
        block.innerHTML = messages

        element.appendChild( block )
    }


    // to do add a method to add a message to the form

    ontraport.formInegrityCheck = function( formElement ){
        var messages = [],
            uid = false;

        // check the form for hidden fields
        for ( var i = 0, l = hiddenFieldNames.length; i < l; i++ ){
            var fieldName = hiddenFieldNames[ i ],
                el = $( '[name='+ fieldName +']', formElement );

            
            // store the uid value to look for the formSpecific scripts / styles
            if( fieldName == 'uid' && el.length !=0 ){
                uid = el[0].value;
            }

            if( el.length == 0 ){
                messages.push( template( missingHiddenFieldMessage, { name: fieldName } ) );
            }
        }

        if( uid !== false && ( uid == "" || uid == undefined ) ){
            messages.push( blankUidValueMessage )
        }
        // check for linked assets

        for ( var i = 0, l = linkedAssetUrls.formSpecific.length; i < l; i ++ ) {

            var urlSet = linkedAssetUrls.formSpecific[ i ],
                url = template( urlSet[0], {uid: uid});

            
            if ( $( template('script[src*="{url}"], link[href*="{url}"]', { url: url } ) ).length == 0  ) {
                messages.push( urlSet[ 1 ] );

            }
        }

        // check the forms parents to see if it has the class moonray-form-{uid}
        var wrapperClass = 'moonray-form-' + uid,
            formWrapper = $( '.' + wrapperClass );

        if( formWrapper.length ){

            if( $( 'form', formWrapper[0] ).length == 0 ){

                messages.push( template( 'The div with the class {wclass} does not contain a form', { wclass: wrapperClass }));
            }
        } else {
            messages.push( template( ' missing a div with the class {wclass} wrapping the form', { wclass: wrapperClass }));
        }



        return messages;
    }


    var forms = $('form'),
        form, 
        messages = [],
        hasOpForm = false;

    for ( var i = 0, l = forms.length; l > i; i ++ ) {
        form = forms[ i ],
        messages = [];
        
        if( isOntraportForm( form ) == false ){
            
            messages.push( isNotOntraportFormMessage );

        }else{

            hasOpForm = true;

            messages.push( isOntraportFormMessage );

            messages = messages.concat( ontraport.formInegrityCheck( form ) );

        }

        renderMessages( form, messages );

    }

    /*
        do some checking on the health of the document  see if the all of the right scripts / styles are there

        also take a peak into the loaded js see if the right plugins are loaded

    */
    if ( hasOpForm ) {
         
         messages = [];

        for ( var i = 0, l = linkedAssetUrls.global.length; i < l; i ++ ) {

            var urlSet = linkedAssetUrls.global[ i ],
                url = urlSet[0];

            if( typeof url == 'string' ){

                if ( $( template('script[src*="{url}"], link[href*="{url}"]', { url: url } ) ).length == 0  ) {
                    
                    messages.push( urlSet[ 1 ] );

                }
            } else {
                // is a function to test, if it returns false, then push the message on the stack
                if ( !url.call( window ) ) {
                    messages.push( urlSet[ 1 ] );
                }
            }
        }

        renderMessages( $('body')[0], messages );
    }

    

})();