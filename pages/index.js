import React, { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'


export default function Home() {
  const [searchterm, setSearchterm] = useState('')

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
  }

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
    </div>
  )
}
