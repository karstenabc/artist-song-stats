import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { artistSearch, getArtistWork } from '../services/musicbrainz-api'
import { lyricsSearch } from '../services/lyricsovh-api'
import { dateToString, formattedNumber } from '../helpers/formatters'
import { songStatistics } from '../helpers/statistics'
import { topSongsByWordCount } from '../helpers/charts'
import { compareTableBody } from '../helpers/tables'


// Return information about the selected artist
function artistInfo(artist) {
  let start = dateToString(artist['life-span'].begin);
  let end = artist['life-span'].end ? dateToString(artist['life-span'].end) : 'Present';
  return <p>{artist.type} ({start} - {end})</p>
}

// Return the song stats for the selected artist
function songStats(stats) {
  if (stats.songCount === 0) {
    return <p>No songs for this artist could be found.</p>
  }
  return <>
    <p>Number of songs: {formattedNumber(stats.songCount)}</p>
    <p>Number of words: {formattedNumber(stats.wordCount)}</p>
    <p>Average words per song: {stats.mean.toFixed(0)}</p>
    <p>Fewest words in a song: {stats.min}</p>
    <p>Most words in a song: {stats.max}</p>
  </>
}


export default function Home() {
  const [view, setView] = useState('individual')
  const [compare, setCompare] = useState(new Map())
  const [compareColumn, setCompareColumn] = useState(2)
  const [searchterm, setSearchterm] = useState('')
  const [searched, setSearched] = useState(false)
  const [artists, setArtists] = useState([])
  const [artist, setArtist] = useState()
  const [work, setWork] = useState([]);
  const [message, setMessage] = useState('')
  const [artistSearchCache, setArtistSearchCache] = useState(new Map())
  const [artistWorkCache, setArtistWorkCache] = useState(new Map())

  // Update search term
  const changeView = (e) => {
    let view = e.target.dataset.view;
    if (view == 'individual') {
      let column = e.target.dataset.col;
      setArtists([])
      setArtist(compare.get(parseInt(column)).artist)
      setWork(compare.get(parseInt(column)).work)
    }
    setView(e.target.dataset.view)
  };

  // Update which column to replace with a new search
  const updateCompareColumn = (e) => {
    setCompareColumn(parseInt(e.target.value))
  }

  // Update search term
  const updateTerm = (e) => {
    setSearched(false)
    setSearchterm(e.target.value)
  };

  // Search if enter is pressed
  const checkEnter = (e) => {
    if (e.keyCode === 13) {
      search()
    }
  }

  // Search for an artist
  const search = (e) => {
    setMessage('Searching for Artists')
    setArtist()
    setSearched(false)
    // Load artist results from cache if search term used before
    if (artistSearchCache.has(searchterm)) {
      setArtists(artistSearchCache.get(searchterm))
      setSearched(true)
      setMessage('')
    } else {
      artistSearch(searchterm).then(data => {
        if (data) {
          setArtistSearchCache(artistSearches => (artistSearches.set(searchterm, data.artists)))
          setArtists(data.artists)
          setSearched(true)
          setMessage('')
        } else {
          setArtists([])
          setSearched(true)
          setMessage('No artists found for this search')
        }
      }).catch(error => console.log(error))
    }
  }

  // Clear search and update artist selection
  const selectArtist = (e) => {
    let artist = artists.filter(artist => artist.id == e.target.dataset.id)[0]
    setSearchterm('')
    setSearched(false)
    setWork([])
    setArtists([])
    setArtist(artist)
  }

  // Fetch artist work on artist selection
  useEffect(() => {
    if (artist) {
      let possessivePostfix = artist.name.endsWith('s') ? '\'' : '\'s'
      setMessage('Getting ' + artist.name + possessivePostfix + ' songs')
      // Load lyric count form cache if already searched
      if (artistWorkCache.has(artist.id)) {
        if (view === 'individual') {
          setWork(artistWorkCache.get(artist.id))
          setCompare(compareArtists => (compareArtists.set(1, {
            'artist': artist,
            'work': artistWorkCache.get(artist.id)
          })))
        } else {
          setCompare(compareArtists => (compareArtists.set(compareColumn, {
            'artist': artist,
            'work': artistWorkCache.get(artist.id)
          })))
        }
        setMessage('')
      } else {
        // Get array of songs for the artist
        getArtistWork(artist.id).then(data => {
          Promise.all(data.works.map(async (song) => {
            let wordsInSong = await lyricsSearch(artist.name, song.title)
            return {
              'name': song.title,
              'wordCount': wordsInSong
            }
          })).then(results => {
            setArtistWorkCache(artistWork => (artistWork.set(artist.id, results)))
            if (view === 'individual') {
              setWork(results)
              setCompare(compareArtists => (compareArtists.set(1, {
                'artist': artist,
                'work': results
              })))
            } else {
              setCompare(compareArtists => (compareArtists.set(compareColumn, {
                'artist': artist,
                'work': results
              })))
            }
            setMessage('')
          })
        }).catch(error => console.log(error))
      }
    }
    console.log(compare)
  }, [artist])


  return (
    <div>
      <Head>
        <title>Artist Song Stats</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <h1>Artist Search</h1>
        <p>Search and click on a result to view the artist's song stats</p>
        <div className={styles.search}>
          <input
            type='text' 
            name='search'
            placeholder='Search for an artist'
            autoFocus={true}
            value={searchterm}
            onChange={updateTerm}
            onKeyUp={checkEnter}
          />
          <button title="Search" onClick={search}>
            <FontAwesomeIcon icon={faSearch}/>
          </button>
        </div>
      </div>

      {artists && (
        <div className={styles.results}>
          {searched && artists.length === 0 && (
            <div>
              <p>No artists were found matching:
                <span className={styles.artistNotFound}> {searchterm}</span>
              </p>
              <p>Please check you have spelled the name correctly and try again.</p>
            </div>
          )}
          <ul className={styles.resultlist}>
            {artists.map((artist) => {
              let start = dateToString(artist['life-span'].begin);
              let end = artist['life-span'].end ? dateToString(artist['life-span'].end) : 'Present';
              if (artist.type) {
                return <li
                  className={styles.resultitem}
                  data-id={artist.id}
                  value={artist.id}
                  key={artist.id}
                  onClick={selectArtist}>
                    {artist.name} ({artist.type}, {start} - {end})
                </li>
              }
            })}
          </ul>
        </div>
      )}

      {view === 'individual' && artist && ( 
        <div className={styles.details}>
          <div className={styles.stats}>
            <h2>{artist.name}</h2>
            {artistInfo(artist)}
            <h3>Song Stats</h3>
            {songStats(songStatistics(work))}
            <button onClick={changeView} data-view={'compare'}>Compare Artist</button>
          </div>
          <div className={styles.charts}>
            <h3>Top Songs by Word Count</h3>
            {topSongsByWordCount(work)}
          </div>
        </div>
      )}

      {view === 'compare' && (
        <div className={styles.compare}>
          <table>
            <tbody>
              {compareTableBody(compare)}
              <tr>
              <th scope="row"></th>
              <td>{compare.has(1) && (
                <button data-view={'individual'} data-col={1} onClick={changeView}>View</button>
              )}</td>
              <td>{compare.has(2) && (
                <button data-view={'individual'} data-col={2} onClick={changeView}>View</button>
              )}</td>
              <td>{compare.has(3) && (
                <button data-view={'individual'} data-col={3} onClick={changeView}>View</button>
              )}</td>
              </tr>
              <tr>
                <th scope="row">Artist to search</th>
                <td><input type="radio" name="columnToSearch" value="1" onChange={updateCompareColumn}/></td>
                <td><input type="radio" name="columnToSearch" value="2" onChange={updateCompareColumn}/></td>
                <td><input type="radio" name="columnToSearch" value="3" onChange={updateCompareColumn}/></td>
              </tr>
            </tbody>
          </table>
          <p>Select the column to be overwritten by the next search</p>
        </div>
      )}

      {message !== '' && (
        <div className={styles.message}>
          <Image
            src='/static/loading.gif'
            alt='Loading indicator'
            height={100}
            width={175}
            />
          <p>{message}...</p>
        </div>
      )}
    </div>
  )
}
