import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

function InstallApp() {
  const [platform, setPlatform] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);
  const [showIOSPopup, setShowIOSPopup] = useState(false);

  useEffect(() => {
    const detectPlatform = () => {
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        setPlatform('ios');
      } else if (/Android/.test(navigator.userAgent)) {
        setPlatform('android');
      } else {
        setPlatform('desktop');
      }
    };
    detectPlatform();

    const checkInstalled = () => {
      if (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true
      ) {
        setIsInstalled(true);
      }
    };
    checkInstalled();

    const onAppInstalled = () => {
      setIsInstalled(true);
      deferredPrompt = null;
      toast.success('App installed successfully!');
    };
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    // For iOS, open the instructions modal.
    if (platform === 'ios') {
      setShowIOSPopup(true);
      return;
    }
    // For non-iOS platforms.
    if (!deferredPrompt) {
      toast.error('Installation not available');
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        deferredPrompt = null;
        toast.success('Installation accepted');
        setShowInstallPrompt(false);
      } else {
        toast.error('Installation rejected');
      }
    } catch (error) {
      toast.error('Installation failed');
    }
  };

  return (
    <>
      {!isInstalled && showInstallPrompt && (
        <div className="fixed top-4 left-4 right-4 bg-green-50 bg-opacity-80 text-green-800 p-4 flex items-center justify-between shadow-lg rounded-lg z-50">
          <div>
            <h3 className="text-lg font-medium">Download Our App</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-700 flex items-center transition-colors duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Now
            </button>
            <button onClick={() => setShowInstallPrompt(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {showIOSPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Install App</h3>
            <p className="text-gray-700 mb-4">
              To install this app on your iOS device, tap the Share icon in Safari or Chrome and select "Add to Home Screen".
            </p>
            <button
              onClick={() => setShowIOSPopup(false)}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default InstallApp;
