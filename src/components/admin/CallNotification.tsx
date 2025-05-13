
import React, { useEffect, useRef } from 'react';
import { useVideoCall } from '@/contexts/VideoCallContext';
import { 
  PhoneCall,
  PhoneOff,
  Video,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

// Base64 encoded short ringtone audio
const RINGTONE_BASE64 = "data:audio/mpeg;base64,SUQzAwAAAAABDFRJVDIAAAAFAAAAU29uZwBUUEUxAAAAEAAAAEZyZWUgU291bmQgRWZmZWN0APBWSW5mbwAAAA8AAABMYXZmNTguNDUuMTAwAAAAAAAAAAAAAAD/+xDEAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAADAAACQAAYGBgYREREREScnJyc3Nzc3N0VFRUVZWVlZWWZmZmZ6enp6eoqKioqampqam6mpqanAwMDAwNTU1NTU6enp6ekCAgICFBQUFBQoKCgoQEBAQEBaWlpaWnNzc3OLi4uLi6Wlpaen09PT09P////wTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EMQpAATwBF7AEG3AAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xDEfwAAA0gAAAAAAAAAA0gAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";

const CallNotification = () => {
  const { incomingCall, acceptCall, rejectCall } = useVideoCall();
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element and play/stop ringtone when incomingCall changes
  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!ringtoneRef.current) {
      try {
        ringtoneRef.current = new Audio(RINGTONE_BASE64);
        ringtoneRef.current.loop = true;
        
        // Add event listener for errors
        ringtoneRef.current.addEventListener('error', (e) => {
          console.error("Ringtone error:", e);
          // Fallback to browser's native notification sound if available
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Appel entrant", {
              icon: "/favicon.ico",
              silent: false
            });
          }
        });
      } catch (err) {
        console.error("Could not create audio element:", err);
      }
    }
    
    // Play ringtone when there's an incoming call
    if (incomingCall && ringtoneRef.current) {
      ringtoneRef.current.play().catch(err => {
        console.error("Could not play ringtone:", err);
        // Request permission for notifications as fallback
        if ("Notification" in window && Notification.permission !== "denied") {
          Notification.requestPermission();
        }
      });
    } else if (ringtoneRef.current) {
      // Stop ringtone when there's no incoming call
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
    
    // Cleanup on unmount
    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current.currentTime = 0;
      }
    };
  }, [incomingCall]);
  
  // Handle accept call with error handling
  const handleAcceptCall = async () => {
    try {
      await acceptCall();
    } catch (error) {
      console.error("Error accepting call:", error);
      toast.error("Impossible d'accepter l'appel. Vérifiez vos permissions de microphone et caméra.");
    }
  };
  
  if (!incomingCall) return null;
  
  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 border z-50 w-80 animate-in fade-in slide-in-from-top-5 duration-300" role="alertdialog" aria-labelledby="incoming-call-title" aria-describedby="incoming-call-desc">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-red-800 text-white rounded-full flex items-center justify-center mr-4">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h3 id="incoming-call-title" className="font-medium">{incomingCall.name}</h3>
          <p id="incoming-call-desc" className="text-sm text-muted-foreground">
            {incomingCall.isVideo ? "Appel vidéo entrant" : "Appel audio entrant"}
          </p>
        </div>
        {incomingCall.isVideo ? <Video className="ml-auto h-5 w-5" /> : <PhoneCall className="ml-auto h-5 w-5" />}
      </div>
      
      <div className="flex space-x-2 justify-center">
        <Button
          onClick={rejectCall}
          className="bg-red-600 hover:bg-red-700 text-white"
          size="sm"
        >
          <PhoneOff className="h-4 w-4 mr-2" />
          Refuser
        </Button>
        <Button
          onClick={handleAcceptCall}
          className="bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          <PhoneCall className="h-4 w-4 mr-2" />
          Répondre
        </Button>
      </div>
    </div>
  );
};

export default CallNotification;
