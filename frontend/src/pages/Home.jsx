import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Edit2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '../utils/config';
import Slideshow from '../components/home/Slideshow';
import Timeline from '../components/home/Timeline';
import Footer from '../components/Footer';

function Home() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/homepage/events`);
      setEvents(data);
    } catch (error) {
      toast.error('Failed to fetch events');
    }
  };

  return (
    <div>
      {/* Home component */}
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-0 space-y-8">
        {['developer', 'financier', 'admin'].includes(user?.role) && (
          <div className="flex justify-end">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              {isEditing ? 'Done Editing' : 'Edit Homepage'}
            </button>
          </div>
        )}

        {/* Slideshow Component */}
        <Slideshow isEditing={isEditing} />

        {/* Welcome Message */}
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Hello, {user?.name}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome to NBK Youth Web APP.
          </p>
        </div>

        {/* Timeline Component */}
        <Timeline events={events} isEditing={isEditing} onUpdate={fetchEvents} />
        
        <div className="bg-gray-100 border-t border-gray-200 rounded-lg">
          <p className="mt-4 text-sm text-gray-500 px-4">
            If any issue is faced at any time, just refresh the page by scrolling down. We are working hard to sort out the errors.
          </p>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default Home;
