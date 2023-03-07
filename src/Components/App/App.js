import React, { useState } from 'react';

import './App.css';
import './SearchResults.css';
import './SearchBar.css';
import './TrackList.css';
import './Track.css';
import './Playlist.css';

import Spotify from '../../util/Spotify';

function App(props) {
  const [searchResults, setSearchResults] = useState([]);

  const [playlist, setPlaylist] = useState({
    playlistName: 'My Playlist',
    playlistTracks: []
  });

  const [playlistName, setPlaylistName] = useState(playlist.playlistName);
  
  const addTrack = (track) => {
    if (!playlist.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      setPlaylist({
        ...playlist,
        playlistTracks: [...playlist.playlistTracks, track]
      });
    }
  };

  const removeTrack = (track) => {
    setPlaylist(prevPlaylist => {
      const updatedPlaylist = {
        ...prevPlaylist,
        playlistTracks: prevPlaylist.playlistTracks.filter(currentTrack => currentTrack.id !== track.id)
      };
      return updatedPlaylist;
    });
  };

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
    setPlaylist(prevPlaylist => ({
      ...prevPlaylist,
      playlistName: name
    }));
  }

  const savePlaylist = () => {
    const trackUris = playlist.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(playlistName, trackUris).then(() => {
      setPlaylist({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }  

  const search = (term) => {
    Spotify.search(term).then(searchResults => {
      setSearchResults(searchResults);
    });
  };
  
  

  return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar onSearch={search}/>
        <div className="App-playlist">
          <SearchResults searchResults={searchResults}
                         onAdd={addTrack}/>
          <Playlist playlist={playlist}
                    onRemove={removeTrack}
                    onNameChange={updatePlaylistName}
                    playlistName={playlistName}
                    onSave={savePlaylist} />
        </div>
      </div>
    </div>
  );
}

function Playlist(props) {

  const handleNameChange = (event) => {
    props.onNameChange(event.target.value);
  }

  return (
    <div className="Playlist">
      <input defaultValue={'New Playlist'} 
             onChange={handleNameChange}/>
      <h2>{props.playlist.playlistName}</h2>
      <TrackList tracks={props.playlist.playlistTracks}
                 onRemove={props.onRemove}
                 isRemoval={true}/>
      <button className="Playlist-save" onClick={props.onSave}>
        SAVE TO SPOTIFY
      </button>
    </div>
  );
}

function SearchResults(props) {
  return (
    <div className="SearchResults">
      <h2>Results</h2>
      <TrackList tracks={props.searchResults}
                 onAdd={props.onAdd}
                 isRemoval={false} />
    </div>
  );
}

function TrackList(props) {
  return (
    <div className="TrackList">
      {props.tracks.map(track => (
        <Track key={track.id} 
               track={track} 
               onAdd={props.onAdd} 
               onRemove={props.onRemove}
               isRemoval={props.isRemoval}/>
      ))}
    </div>
  );
}

function Track(props) {
  const { track } = props;

  function renderAction() {
    if(props.isRemoval) {
      return <button className='Track-action' onClick={removeTrack}>-</button>
    } else {
      return <button className='Track-action' onClick={addTrack}>+</button>
    }
  }

  function addTrack() {
    props.onAdd(props.track);
  }

  function removeTrack() {
    props.onRemove(props.track);
  }

  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{props.track.name}</h3>
        <p>{`${track.artist} | ${track.album}`}</p>
      </div>
      {renderAction()}
    </div>
  );
}

function SearchBar(props) {

  const [term, setTerm] = useState('');

  const search = () => {
    props.onSearch(term);
  };

  const handleTermChange = (event) => {
    setTerm(event.target.value);
  };

  return (
    <div className="SearchBar">
      <input onChange={handleTermChange} placeholder="Enter A Song, Album, or Artist" />
      <button className="SearchButton" onClick={search}>SEARCH</button>
    </div>
  );
}

export default App;
