import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../../utils/config';

function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    image: '',
    video: '',
    status: 'disabled',
    periodicity: 1,
    duration: 0
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/banners`);
      setBanners(data);
    } catch (error) {
      toast.error('Failed to fetch banners');
    }
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size should be less than 50MB');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFormData({ ...formData, [type]: reader.result });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await axios.put(`${API_URL}/api/banners/${formData._id}`, formData);
        toast.success('Banner updated successfully');
      } else {
        await axios.post(`${API_URL}/api/banners`, formData);
        toast.success('Banner created successfully');
      }
      setShowForm(false);
      setFormData({
        title: '',
        message: '',
        image: '',
        video: '',
        status: 'disabled',
        periodicity: 1,
        duration: 0
      });
      fetchBanners();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (banner) => {
    setFormData(banner);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      await axios.delete(`${API_URL}/api/banners/${id}`);
      toast.success('Banner deleted successfully');
      fetchBanners();
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Popup Banner</h2>
        <div className="space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-md ${
              isEditing ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
          <button
            onClick={() => {
              setFormData({
                title: '',
                message: '',
                image: '',
                video: '',
                status: 'disabled',
                periodicity: 1,
                duration: 0
              });
              setShowForm(true);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Add Banner
          </button>
        </div>
      </div>

      {/* Banner List */}
      <div className="space-y-4">
        {banners.map((banner) => (
          <div
            key={banner._id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">{banner.title || 'Untitled Banner'}</h3>
              <p className="text-sm text-gray-500">
                Status: {banner.status}
                {banner.periodicity > 1 && ` | Shows ${banner.periodicity} times`}
                {banner.duration > 0 && ` | Duration: ${banner.duration}s`}
              </p>
            </div>
            {isEditing ? (
              <button
                onClick={() => handleDelete(banner._id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={() => handleEdit(banner)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Banner Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {formData._id ? 'Edit Banner' : 'Add Banner'}
              </h3>
              <button onClick={() => setShowForm(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'image')}
                  className="mt-1 block w-full"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-2 h-32 object-contain"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, 'video')}
                  className="mt-1 block w-full"
                />
                {formData.video && (
                  <video
                    src={formData.video}
                    controls
                    className="mt-2 h-32 object-contain"
                  />
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="disabled">Disabled</option>
                    <option value="enabled">Enabled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Periodicity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.periodicity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        periodicity: parseInt(e.target.value)
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration: parseInt(e.target.value)
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {formData._id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BannerManager;