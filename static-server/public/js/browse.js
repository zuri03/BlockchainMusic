const renderSongs = function (data) {
    $('#song-list-container').empty();
    
    if (!data || !data.length) {
        $('#song-no-result').show();
        return;
    }

    const rows = [];
    for (let i = 0; i < data.length; i += 2) {
        let songRow = [ data[i] ]

        if (i + 1 < data.length) {
            songRow.push(data[i + 1])
        }   

        rows.push(songRow)
    }

    let htmlContainerString = `<div>`
    for (let i = 0; i < rows.length; i++) {
        let [ firstSong, secondSong ] = rows[i]
        let htmlString = `
        <div class="row">
            <div class="col-6 my-2">
                <div class="card">
                    <img src="./example-cover.png" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title text-start"><b>${firstSong['author']}</b>: ${firstSong['title']}</h5>
                        <p class="card-text text-start">${firstSong['description'] || ''}</p>
                        <a href="#" class="btn btn-success">Download</a>
                    </div>
                </div>
            </div>`

        if (secondSong) {
            htmlString += 
               `<div class="col-6 my-2">
                    <div class="card">
                        <img src="./example-cover.png" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title text-start"><b>${secondSong['author']}</b>: ${secondSong['title']}</h5>
                            <p class="card-text text-start">${secondSong['description'] || ''}</p>
                            <a href="#" class="btn btn-success">Download</a>
                        </div>
                    </div>
                </div>`
        }

        htmlString += '</div>'
        htmlContainerString += htmlString;
    }
    htmlContainerString += `</div>`
    $('#song-list-container').append(htmlContainerString);
}

const LoadSongs = function () {
    $('#song-no-result').hide();
    const searchTerm = $('#search-box-input').val();

    const apiUrl = searchTerm && searchTerm !== '' ? `http://localhost:8888/api/Song/Search/${searchTerm}` : 
        `http://localhost:8888/api/Song`

    $('#song-loading').show();

    $.ajax({
        url: apiUrl,
        beforeSend: () => $('#song-loading').show(),
        success: function (result) {
            $('#song-loading').hide();
            renderSongs(result);
            console.log({ result })
        },
        error: function (xhr, textStatus, errorThrown) {
            $('#song-loading').hide();
            alert('Server error has occured');
            console.log({ xhr, textStatus, errorThrown })
        }
    })
}

$('#search-form').submit(function (event) {
    event.preventDefault();
    LoadSongs();
});

$(document).ready(function () {
    LoadSongs();
});