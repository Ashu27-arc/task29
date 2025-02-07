import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/videos');
            const data = await response.json();
            setVideos(data);
        } catch (err) {
            setError('Error fetching videos');
            console.error(err);
        }
    };

    const handleVideoSelect = (event) => {
        setSelectedVideo(event.target.value);
    };

    return (
        <div className="App">
            <h1>Video Streaming App</h1>
            
            <div className="video-selector">
                <select 
                    value={selectedVideo} 
                    onChange={handleVideoSelect}
                    className="video-select"
                >
                    <option value="">Select a video</option>
                    {videos.map((video) => (
                        <option key={video.name} value={video.path}>
                            {video.name}
                        </option>
                    ))}
                </select>
            </div>

            {error && <div className="error">{error}</div>}

            {selectedVideo && (
                <div className="video-container">
                    <video 
                        controls 
                        width="100%" 
                        height="auto"
                        key={selectedVideo}
                    >
                        <source 
                            src={`http://localhost:5000${selectedVideo}`} 
                            type="video/mp4" 
                        />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
        </div>
    );
}

export default App;
