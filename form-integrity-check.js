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



    try to guess if the form is an Ontraport one via the post url and the uid 

*/
(function(){

    var $ = document.querySelectorAll,

        template = function t( s, d ) {
        for ( var p in d )
            s = s.replace( new RegExp( '{' + p + '}', 'g' ), d[ p ] );
        return s;
    },
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

    */
    linkedAssetUrls = {
        'scripts': [

        ],
        'styles': [
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

    }

})();