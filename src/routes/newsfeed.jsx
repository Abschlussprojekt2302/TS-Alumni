import React, { useState, useEffect } from 'react';
import '../newsfeed.css';

const NewsFeed = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/getAllPosts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.status === 'ok') {
          setMessages(data.posts);
        } else {
          console.error('Fehler beim Abrufen der Nachrichten', data);
        }
      } catch (error) {
        console.error('Fehler beim Netzwerkaufruf', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return; // Verhindert das Senden leerer Nachrichten
    try {
      const response = await fetch('https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/addPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: localStorage.getItem("UserID"),
          content: newMessage.trim(),
          media_link: uploadedImage,
        }),
      });

      const data = await response.json();

      if (data.status === 'ok') {
        // Setze die Nachrichtenliste neu und füge die neue Nachricht hinzu
        setMessages([...messages, {
          content: newMessage,
          MediaLink: uploadedImage,
          timestamp: new Date() // Hier wird die aktuelle Zeit als Timestamp genommen
        }]);
        setNewMessage(''); // Nachrichtenfeld leeren
        setUploadedImage(null); // Zurücksetzen des Uploads
      } else {
        console.error('Fehler beim Senden der Nachricht', data);
      }
    } catch (error) {
      console.error('Fehler beim Netzwerkaufruf', error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="app">
      <img src="https://cdn.discordapp.com/attachments/1195301143161606205/1195301598507827240/techst_logo_rz_white.png" alt="Logo" className="logo" />
      <div className="chat">
        <div className="messages">
          {isLoading ? (
            <p>Lädt Nachrichten...</p>
          ) : (
            messages.slice(-1000).map((message, index) => (
              <div className="message" key={index}>
                <p>{message.content}</p>
                {message.MediaLink && <img src={message.MediaLink} alt="Uploaded" width='600px' />}
                {/* Anzeige des Zeitstempels */}
                <span className="timestamp">{message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : 'Zeit unbekannt'}</span>
              </div>
            ))
          )}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="fileInput"
          />
          <label htmlFor="fileInput" className="upload-button">Upload Image</label>
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
