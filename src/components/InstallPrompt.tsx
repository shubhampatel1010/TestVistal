import { useState, useEffect } from 'react';
import { X, Share, Plus, Download } from 'lucide-react';
import './InstallPrompt.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const isAlreadyInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const hasSeenPrompt = localStorage.getItem('pwaPromptSeen');
    
    if (isAlreadyInstalled) return;

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isIOSDevice && isSafari) {
      setIsIOS(true);
      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 2000);
      }
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 2000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaPromptSeen', 'true');
  };

  const handleRemindLater = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt">
        <button className="install-prompt-close" onClick={handleDismiss}>
          <X size={20} />
        </button>
        
        <div className="install-prompt-icon">
          <img src="/icon-192.png" alt="VitalState" />
        </div>
        
        <h3>Add VitalState to Home Screen</h3>
        <p>Install our app for a better experience with quick access from your home screen.</p>

        {isIOS ? (
          <div className="ios-instructions">
            <div className="ios-step">
              <div className="ios-step-icon">
                <Share size={20} />
              </div>
              <span>Tap the <strong>Share</strong> button below</span>
            </div>
            <div className="ios-step">
              <div className="ios-step-icon">
                <Plus size={20} />
              </div>
              <span>Scroll and tap <strong>Add to Home Screen</strong></span>
            </div>
            <div className="ios-step">
              <div className="ios-step-icon">
                <Download size={20} />
              </div>
              <span>Tap <strong>Add</strong> to install</span>
            </div>
            <button className="install-btn got-it" onClick={handleDismiss}>
              Got it!
            </button>
          </div>
        ) : (
          <div className="android-instructions">
            <button className="install-btn primary" onClick={handleInstall}>
              <Download size={18} />
              Install App
            </button>
            <button className="install-btn secondary" onClick={handleRemindLater}>
              Maybe Later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
