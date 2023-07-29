const titleError = function () {
   $('#song-title').attr('style', 'border-color: red; animation: horizontal-shaking 0.25s linear infinite;');
    $('#error-title-alert').show();

    setTimeout(() => $('#song-title').attr('style', 'border-color: red;'), 1000);
    setTimeout(() => $('#song-title').removeAttr('style'), 5000);
    setTimeout(() => $('#error-title-alert').hide(), 5000);
}

const tenSecondDelay = 10000;

const submitSongMetaData = function (songCoverUrl) {
    const title = $('#song-title').val();
    const description = $('#song-description').val();

    //TODO: determine how to handle authorId
    //const authorId = $('#author-id').val();
    const authorId = 'authorId'

    //TODO: Author name will come from sessionStorage
    //const author = $('#author-name').val();
    const author = 'author name';

    if (!title || title.length === 0) {
        titleError();
        return;
    }

    const requestObj = {
        title,
        author,
        authorId
    }

    if (description) {
        requestObj['description'] = description;
    }

    if (songCoverUrl) {
        requestObj['coverURL'] = songCoverUrl;
    }

    $.ajax({
        type: "POST",
        url: "http://localhost:9090/api/Song",
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
}

const submitSongCover = function () {
    const file = $('#cover-file')[0].files[0];
    const data = new FormData();
    data.append('cover-file', file);

    $.ajax({
        url: "http://localhost:9090/api/Cover",
        data: data,
        encType: 'multipart/form-data',
        contentType: false,
        processData: false,
        cache: false,
        method: 'POST',
        success: function (result) {
            console.log(result);
            submitSongMetaData(result['data']);
        },
        error: function (xhr, textStatus, errorThrown) {
            $('#error-alert').show();
            setTimeout(() => $('#error-alert').hide(), tenSecondDelay);
            console.log({ xhr, textStatus, errorThrown })
        }
    });
}

$('#song-form').submit(function (event) {
    event.preventDefault();
    if ($('#cover-file').val() !== '') {
        submitSongCover();
    } else {
        submitSongMetaData();
    }
});