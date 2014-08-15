(function ($) {

    window.myContactApp = {
        admin: "juancarlosqxt@gmail.com",
        widgetModal: $('#widgetModal'),
        init: function () {
            Parse.initialize("ychlkAvKVniJfOTdqjjq1SCNe2hsSdp2VFmVOouE", "cO3ZNeBTP8ubupx6ptKfQWNYvHtbE8jVKntiNiEc");
            myContactApp.ContactObject = Parse.Object.extend("Contact");
            myContactApp.mailer = new mandrill.Mandrill('F0uKGr-j1NKZNUGTm2QQqw');
        },
        showModal: function () {
            myContactApp.widgetModal.modal({
                keyboard: false,
                backdrop: 'static'
            });
        },
        hideModal: function () {
            myContactApp.widgetModal.modal('hide');
        },
        save: function (jsonContact)
        {
            // show modal
            myContactApp.showModal();
            // log the information
            console.log(jsonContact);
            // process the information
            var objContact = new myContactApp.ContactObject();
            // save to parse
            objContact.save(jsonContact).then(function(object) {
                console.log('the data was saved successfully :)');
                // send email
                myContactApp.send(jsonContact);
            }, function(error) {
                console.log('the data was not saved successfully :(');
                console.error(error);
                // show failure
                myContactApp.shitHappens();
            });
        },
        saveSuccessSendSuccess: function () {
            // Success message
            $('#success').html("<div class='alert alert-success'>");
            $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                .append("</button>");
            $('#success > .alert-success')
                .append("<strong>Your message has been sent. </strong>");
            $('#success > .alert-success')
                .append('</div>');
            //clear all fields
            $('#contactForm').trigger("reset");
            // hide modal
            myContactApp.hideModal();
        },
        shitHappens: function () {
            var firstName = $("input#name").val(); // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }
            // Fail message
            $('#success').html("<div class='alert alert-danger'>");
            $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                .append("</button>");
            $('#success > .alert-danger').append("<strong>Sorry " + firstName + ", it seems that my mail server is not responding. Please try again later!");
            $('#success > .alert-danger').append('</div>');
            //clear all fields
            $('#contactForm').trigger("reset");
            // hide modal
            myContactApp.hideModal();
        },
        send: function (jsonContact) {
            // API call parameters
            var params = {
                "message": {
                    "from_email":myContactApp.admin,
                    "from_name":"juancarlosqr's admin",
                    "to":[{
                        "email":myContactApp.admin,
                        "name": "juancarlosqr",
                        "type": "to"
                    }],
                    "subject": "[NEW CONTACT] " + jsonContact.name,
                    "html": "<h3>Information</h3><p><strong>Name:</strong> " + jsonContact.name + "</p><p><strong>Email:</strong> " + jsonContact.email + "</p><p><strong>Phone:</strong> " + jsonContact.phone + "</p><p><strong>Message:</strong> " + jsonContact.message + "</p>"
                }
            };
            // Send the email!
            myContactApp.mailer.messages.send(params, function(res) {
                if(res[0].status === "sent") {
                    console.log('and was sended too!');
                    myContactApp.saveSuccessSendSuccess();
                }
                else{
                    console.error('shit happens!');
                    myContactApp.shitHappens();
                }
            }, function(err) {
                console.error('but not sended!');
                console.error('ERROR:',err);
                myContactApp.shitHappens();
            });
        }
    };
    myContactApp.init();

    $("input,textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour

            // get values from FORM
            myContactApp.save({
                name: $("input#name").val(),
                email: $("input#email").val(),
                phone: $("input#phone").val(),
                message: $("textarea#message").val()
            });
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").on('click', function(e) {
        e.preventDefault();
        $(this).tab("show");
    });

    /*When clicking on Full hide fail/success boxes */
    $('#name').focus(function() {
        $('#success').html('');
    });

})(jQuery);
