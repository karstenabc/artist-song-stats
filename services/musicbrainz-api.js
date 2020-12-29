const base = 'http://musicbrainz.org/ws/2/'
const format = '&fmt=json'
const headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Artist Song Seach/0.1 ( development@karsten-lloyd.dev )',
})

// Send request to API with relevent headers and handle exception
function sendRequest(url) {
    return fetch(url + format, {
        method: 'GET',
        headers: headers
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            console.log(response)
            throw new Error('Error searching for artist')
        }
    })
}

// Return top 10 artists matching the search term
export function artistSearch(artist) {
    let endpoint = base + 'artist/?query=artist:' + artist + '&limit=10'
    return sendRequest(endpoint)
}
