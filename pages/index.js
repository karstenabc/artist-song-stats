import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { artistSearch, getArtistWork } from '../services/musicbrainz-api'
import { lyricsSearch } from '../services/lyricsovh-api'

// Calculate statistics for an artist's work
function songStatistics(work) {
  console.log('STATS')
  console.log(work)
  let min = 0
  let max = 0
  let wordCount = 0

  for (let i = 0; i < work.length; i++) {
      if (work[i] > 1) {
          // Calculate min and max words in a song
          if (work[i] < min || min === 0) {
              min = work[i]
          }
          if (work[i] > max || max === 0) {
              max = work[i]
          }
          // Calculate total words
          wordCount += work[i]
      }
  }

  // Calculate the mean
  let mean = wordCount / work.length

  // Return the stats
  return {
      'min': min,
      'max': max,
      'songCount': work.length,
      'wordCount': wordCount,
      'mean': mean
  }
}

// Format date
function dateToString(dateString) {
  let date = new Date(dateString)
  return date.toDateString()
}

// Comma seperate thousands
export function formattedNumber(number) {
  return number 
  ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  : ''
}

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
  const [searchterm, setSearchterm] = useState('')
  const [artists, setArtists] = useState([])
  const [artist, setArtist] = useState()
  const [work, setWork] = useState([]);

  // Update search term
  const updateTerm = (e) => { setSearchterm(e.target.value) };

  // Search if enter is pressed
  const checkEnter = (e) => {
    if (e.keyCode === 13) {
      search()
    }
  }

  // Search for an artist
  const search = (e) => {
    console.log('search for artist')
    artistSearch(searchterm).then(data => {
      if (data) {
        setArtists(data.artists)
      } else {
        setArtists([])
      }
    }).catch(error => console.log(error))
  }

  // Clear search and update artist selection
  const selectArtist = (e) => {
    let artist = artists.filter(artist => artist.id == e.target.dataset.id)[0]
    setSearchterm('')
    setWork([])
    setArtists([])
    setArtist(artist)
  }

  // Fetch artist work on artist selection
  useEffect(() => {
    if (artist) {
      console.log('getting artist work')
      // Get array of songs for the artist
      getArtistWork(artist.id).then(data => {
        Promise.all(data.works.map(async (song) => {
          let wordsInSong = await lyricsSearch(artist.name, song.title)
          console.log('results', wordsInSong, song.title)
          return wordsInSong
        })).then(results => {
          setWork(results)
        })
      }).catch(error => console.log(error))
    }
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
          <ul className={styles.resultlist}>
            {artists.map((artist) => (
              <li
                className={styles.resultitem}
                data-id={artist.id}
                value={artist.id}
                key={artist.id}
                onClick={selectArtist}>
                  {artist.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {artist && ( 
        <div className={styles.details}>
          <h2>{artist.name}</h2>
          {artistInfo(artist)}
          <h3>Song Stats</h3>
          {songStats(songStatistics(work))}
        </div>
      )}
    </div>
  )
}
