$(document).ready(() => {
    $('#signup-form').submit(function (event) {
        event.preventDefault();
        console.log($(this).serialize())
    })
});