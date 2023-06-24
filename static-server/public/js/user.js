const tenSecondDelay = 10000;

$(document).ready(() => {
    $('#signup-form').validate({
        rules: {
            username: {
                minlength: 5
            },
            password: {
                required: true,
                minlength: 5
            },
            passwordConfirm: {
                required: true,
                minlength: 5,
                equalTo: '#password'
            }
        },
    });

    $('#signup-form').submit(function (event) {
        event.preventDefault();

        if (!$('#signup-form').valid()) {
            return;
        }

        let user = {};
        const formFields = $(this).serializeArray();

        for (let i = 0; i < formFields.length; i++) {
            const field = formFields[i];

            if (field['name'] === 'passwordConfirm') {
                continue; 
            }

            user[field['name']] = field['value'];
        }

        $.ajax({
            type: "POST",
            url: "http://localhost:8008/api/User",
            data: JSON.stringify(user),
            contentType: "application/json; charset=utf-8",
            success: function () {
                window.location.reload();
            },
            error: function (xhr, textStatus, errorThrown) {
                $('#error-alert').show();
                setTimeout(() => $('#error-alert').hide(), tenSecondDelay);
            }
        });
    })
});