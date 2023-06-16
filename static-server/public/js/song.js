const titleError = function () {
   $('#song-title').attr('style', 'border-color: red; animation: horizontal-shaking 0.25s linear infinite;');
    $('#error-title-alert').show();

    setTimeout(() => $('#song-title').attr('style', 'border-color: red;'), 1000);
    setTimeout(() => $('#song-title').removeAttr('style'), 5000);
    setTimeout(() => $('#error-title-alert').hide(), 5000);
}

const tenSecondDelay = 10000;

$('#song-form').submit(function (event) {
    event.preventDefault();

    const title = $('#song-title').val();
    const description = $('#song-description').val();
    const authorId = $('#author-id').val();
    const author = $('#author-name').val();

    if (!title || title.length === 0) {
        titleError();
        return;
    }

    if (!author || !author.length || !authorId || !authorId.length) {
        $('#error-alert').show();
        setTimeout(() => $('#error-alert').hide(), 5000);
        return;
    }

    const requestObj = {
        title,
        author,
        authorId
    }

    if (description && description !== '') {
        requestObj['description'] = description;
    }

    $.ajax({
        type: "POST",
        url: "http://localhost:8888/api/Song",
        data: JSON.stringify(requestObj),
        contentType: "application/json; charset=utf-8",
        success: function () {
            $('#song-form')[0].reset();
            $('#success-alert').show();
            setTimeout(() => $('#success-alert').hide(), tenSecondDelay);
        },
        error: function (xhr, textStatus, errorThrown) {
            $('#error-alert').show();
            setTimeout(() => $('#error-alert').hide(), tenSecondDelay);
            console.log({ xhr, textStatus, errorThrown })
        }
    });
});