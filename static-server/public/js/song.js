$('#song-form').submit(function (event) {
    event.preventDefault();

    const title = $('#song-title').val();
    const description = $('#song-description').val();
    const authorId = $('#author-id').val();
    const author = $('#author-name').val();

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
            window.location.reload();
        },
        error: function (xhr, textStatus, errorThrown) {
            alert('Server error has occured');
            console.log({ xhr, textStatus, errorThrown })
        }
    });
});