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
  const [searched, setSearched] = useState(false)
  const [artists, setArtists] = useState([])
  const [artist, setArtist] = useState()
  const [work, setWork] = useState([]);
  const [message, setMessage] = useState('')
  const [artistSearchCache, setArtistSearchCache] = useState(new Map())
  const [artistWorkCache, setArtistWorkCache] = useState(new Map())

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
        console.log('work from cache')
        setWork(artistWorkCache.get(artist.id))
        setMessage('')
      } else {
        // Get array of songs for the artist
        getArtistWork(artist.id).then(data => {
          Promise.all(data.works.map(async (song) => {
            let wordsInSong = await lyricsSearch(artist.name, song.title)
            console.log('results', wordsInSong, song.title)
            return wordsInSong
          })).then(results => {
            setArtistWorkCache(artistWork => (artistWork.set(artist.id, results)))
            setWork(results)
            setMessage('')
          })
        }).catch(error => console.log(error))
      }
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
          {searched && artists.length === 0 && (
            <div>
              <p>No artists were found matching:
                <span className={styles.artistNotFound}> {searchterm}</span>
              </p>
              <p>Please check you have spelled the name correctly and try again.</p>
            </div>
          )}
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
