import { dateToString, formattedNumber } from '../helpers/formatters'
import { songStatistics } from '../helpers/statistics'

export function compareTableBody(compare) {
    let rows = []
    let artists = [null, null, null]
    let stats = [null, null, null]
    for (let i = 0; i < 3; i++) {
      if (compare.has(i+1)) {
        artists[i] = compare.get(i+1).artist
        stats[i] = songStatistics(compare.get(i+1).work)
      }
    }
  
    let row = [<th scope="row">Name</th>];
    artists.map((artist) => {
      let data = artist ? artist.name : ''
      row.push(<td>{data}</td>)
    })
    rows.push(<tr>{row}</tr>)
  
    row = [<th scope="row">Person/Group</th>];
    artists.map((artist) => {
      let data = artist ? artist.type : ''
      row.push(<td>{data}</td>)
    })
    rows.push(<tr>{row}</tr>)
  
    row = [<th scope="row">From</th>];
    artists.map((artist) => {
      let data = artist ? dateToString(artist['life-span'].begin) : ''
      row.push(<td>{data}</td>)
    })
    rows.push(<tr>{row}</tr>)

    row = [<th scope="row">To</th>];
    artists.map((artist) => {
      let data = artist
        ? artist['life-span'].end ? dateToString(artist['life-span'].end) : 'Present'
        : ''
      row.push(<td>{data}</td>)
    })
    rows.push(<tr>{row}</tr>)
  
    row = [<th scope="row">Number of Songs</th>];
    stats.map((stat) => {
      let data = stat ? formattedNumber(stat.songCount) : ''
      row.push(<td>{data}</td>)
    })
    rows.push(<tr>{row}</tr>)
  
    row = [<th scope="row">Number of Words</th>];
    stats.map((stat) => {
      let data = stat ? formattedNumber(stat.wordCount) : ''
      row.push(<td>{data}</td>)
    })
    rows.push(<tr>{row}</tr>)
  
    row = [<th scope="row">Average words per song</th>];
    stats.map((stat) => {
      let data = stat ? formattedNumber(stat.mean) : ''
      row.push(<td>{data}</td>)
    })
    rows.push(<tr>{row}</tr>)
  
    row = [<th scope="row">Fewest words in a song</th>];
    stats.map((stat) => {
      let data = stat ? formattedNumber(stat.min) : ''
      row.push(<td>{data}</td>)
    })
    rows.push(<tr>{row}</tr>)
  
    row = [<th scope="row">Most words in a song</th>];
    stats.map((stat) => {
      let data = stat ? formattedNumber(stat.max) : ''
      row.push(<td>{data}</td>)
    })
    rows.push(<tr>{row}</tr>)
  
    return rows
  }
  