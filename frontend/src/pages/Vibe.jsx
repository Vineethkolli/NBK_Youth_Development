import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CollectionManager from '../components/vibe/CollectionManager';
import CollectionItem from '../components/vibe/CollectionItem';
import MusicPlayer from '../components/vibe/MusicPlayer';
import SearchBar from '../components/vibe/SearchBar';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../utils/config';
import { createSongQueue, getNextSongIndex, getPreviousSongIndex, findSongIndex } from '../utils/songQueue';
import { filterCollections } from '../utils/search';

function Vibe() {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songQueue, setSongQueue] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    // Create song queue whenever collections change
    const queue = createSongQueue(collections);
    setSongQueue(queue);
  }, [collections]);

  const fetchCollections = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/collections`);
      // Sort collections alphabetically
      data.sort((a, b) => a.name.localeCompare(b.name));
      setCollections(data);
    } catch (error) {
      toast.error('Failed to fetch collections');
    }
  };

  const handleSongSelect = (song) => {
    const index = findSongIndex(song, songQueue);
    setCurrentSongIndex(index);
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handleNext = () => {
    const nextIndex = getNextSongIndex(currentSongIndex, songQueue);
    setCurrentSongIndex(nextIndex);
    setCurrentSong(songQueue[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex = getPreviousSongIndex(currentSongIndex, songQueue);
    setCurrentSongIndex(prevIndex);
    setCurrentSong(songQueue[prevIndex]);
  };

  // Collection CRUD operations
  const handleCollectionEdit = async (collection) => {
    const newName = prompt('Enter new collection name:', collection.name);
    if (!newName || newName === collection.name) return;

    try {
      await axios.put(`${API_URL}/api/collections/${collection._id}`, {
        name: newName
      });
      toast.success('Collection updated successfully');
      fetchCollections();
    } catch (error) {
      toast.error('Failed to update collection');
    }
  };

  const handleCollectionDelete = async (collection) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return;
    try {
      await axios.delete(`${API_URL}/api/collections/${collection._id}`);
      toast.success('Collection deleted successfully');
      fetchCollections();
    } catch (error) {
      toast.error('Failed to delete collection');
    }
  };

  // Sub-collection CRUD operations
  const handleSubCollectionEdit = async (subCollection) => {
    const newName = prompt('Enter new sub-collection name:', subCollection.name);
    if (!newName || newName === subCollection.name) return;

    try {
      const collectionId = collections.find(c => 
        c.subCollections.some(sc => sc._id === subCollection._id)
      )?._id;
      
      if (!collectionId) throw new Error('Collection not found');

      await axios.put(
        `${API_URL}/api/collections/${collectionId}/subcollections/${subCollection._id}`,
        { name: newName }
      );
      toast.success('Sub-collection updated successfully');
      fetchCollections();
    } catch (error) {
      toast.error('Failed to update sub-collection');
    }
  };

  const handleSubCollectionDelete = async (subCollection) => {
    if (!window.confirm('Are you sure you want to delete this sub-collection?')) return;
    try {
      const collectionId = collections.find(c => 
        c.subCollections.some(sc => sc._id === subCollection._id)
      )?._id;
      
      if (!collectionId) throw new Error('Collection not found');

      await axios.delete(
        `${API_URL}/api/collections/${collectionId}/subcollections/${subCollection._id}`
      );
      toast.success('Sub-collection deleted successfully');
      fetchCollections();
    } catch (error) {
      toast.error('Failed to delete sub-collection');
    }
  };

  // Song CRUD operations
  const handleSongEdit = async (song) => {
    const newName = prompt('Enter new song name:', song.name);
    if (!newName || newName === song.name) return;

    try {
      const collection = collections.find(c => 
        c.subCollections.some(sc => 
          sc.songs.some(s => s._id === song._id)
        )
      );
      
      const subCollection = collection?.subCollections.find(sc => 
        sc.songs.some(s => s._id === song._id)
      );

      if (!collection || !subCollection) throw new Error('Song not found');

      await axios.put(
        `${API_URL}/api/collections/${collection._id}/subcollections/${subCollection._id}/songs/${song._id}`,
        { name: newName }
      );
      toast.success('Song updated successfully');
      fetchCollections();
    } catch (error) {
      toast.error('Failed to update song');
    }
  };

  const handleSongDelete = async (song) => {
    if (!window.confirm('Are you sure you want to delete this song?')) return;
    try {
      const collection = collections.find(c => 
        c.subCollections.some(sc => 
          sc.songs.some(s => s._id === song._id)
        )
      );
      
      const subCollection = collection?.subCollections.find(sc => 
        sc.songs.some(s => s._id === song._id)
      );

      if (!collection || !subCollection) throw new Error('Song not found');

      await axios.delete(
        `${API_URL}/api/collections/${collection._id}/subcollections/${subCollection._id}/songs/${song._id}`
      );
      toast.success('Song deleted successfully');
      fetchCollections();
    } catch (error) {
      toast.error('Failed to delete song');
    }
  };

  const filteredCollections = filterCollections(collections, searchQuery);

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-0 py-0">
      <div className="space-y-8">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <CollectionManager 
            collections={collections}
            onUpdate={fetchCollections}
            isEditMode={isEditMode}
            onEditModeToggle={() => setIsEditMode(!isEditMode)}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredCollections.map(collection => (
            <CollectionItem
              key={collection._id}
              collection={collection}
              isEditMode={isEditMode}
              currentSong={currentSong}
              onSongPlay={handleSongSelect}
              onEdit={handleCollectionEdit}
              onDelete={handleCollectionDelete}
              onSubCollectionEdit={handleSubCollectionEdit}
              onSubCollectionDelete={handleSubCollectionDelete}
              onSongEdit={handleSongEdit}
              onSongDelete={handleSongDelete}
            />
          ))}
        </div>
      </div>

      {currentSong && (
        <MusicPlayer
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={true}
          hasPrevious={true}
        />
      )}
    </div>
  );
}

export default Vibe;