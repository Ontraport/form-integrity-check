Ontraport form integrity check
====================

This tool allows customers and developers alike to quickly identify potential issues with ONTRAPORT forms after they have been customized outside of the form editor. 

After scanning the page, it will place one or more message boxes on the page. The presence of warnings does not necessarily indicate that a form is broken, but rather points out issues that should be considered by your developer. As always, any customized form should be thoroughly tested before use. ONTRAPORT can not guarantee that any customized form will work properly

This tool currently checks and creates warnings for the following components:

    * hidden fields
    * div form wrapper classes
    * scripts
        * genjs
        * validator
    * css
    * form post url

You can either clone and link the script on your page while you're customizing your form or grab the bookmarklet.

To "install" the **bookmarklet**. Go to [this page](https://rawgit.com/Ontraport/form-integrity-check/master/bookmarklet.html) and drag the link into your bookmark toolbar. Then when visiting a page with an ONTRAPORT form, click the bookmark to check it out.

Think you found a bug or want to add another check? Please either submit an issue or fork and create a pull request.



