const base = 'https://api.lyrics.ovh/v1/'

// Send request to API and handle exception
function sendRequest(url) {
    return fetch(url).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            console.log(response)
            throw new Error('Error getting lyrics')
        }
    })
}

// Return the lyrics of a given song by a given artist
export function lyricsSearch(artist, song) {
    let songName = song.replaceAll(' ', '%20').toLowerCase()
    let endpoint = base + artist + '/' + songName
    return sendRequest(endpoint).then(result => {
        // Replace new line characters and convert to array
        // to determine the number of lyrics in the song
        return result.lyrics
            .replace(/[\n\r]+/g, ' ')
            .replace(/\s{2,}/g,' ')
            .trim().split(' ').length
    }).catch(error => console.log(error))
}
