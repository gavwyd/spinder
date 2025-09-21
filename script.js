// Spotify API Configuration
const CLIENT_ID = '32e9e5d5c4d74bf98e34f5e240070726';
const CLIENT_SECRET = '8551fdb948c640368215e3a99c38fa7e';
const REDIRECT_URI = window.location.origin + window.location.pathname;

// App State Variables
let accessToken = null;
let currentUser = null;
let recommendations = [];
let currentSongIndex = 0;
let likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
let swipedCount = parseInt(localStorage.getItem('swipedCount') || '0');
let isSwipingEnabled = true;

// DOM Elements
const loginSection = document.getElementById('loginSection');
const appSection = document.getElementById('appSection');
const spotifyLoginBtn = document.getElementById('spotifyLoginBtn');
const loadingState = document.getElementById('loadingState');
const cardContainer = document.getElementById('cardContainer');
const userProfile = document.getElementById('userProfile');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const likedCount = document.getElementById('likedCount');
const swipedCountEl = document.getElementById('swipedCount');
const discoveredCount = document.getElementById('discoveredCount');
const recentLiked = document.getElementById('recentLiked');
const rejectBtn = document.getElementById('rejectBtn');
const likeBtn = document.getElementById('likeBtn');
const likeIndicator = document.getElementById('likeIndicator');
const rejectIndicator = document.getElementById('rejectIndicator');

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    updateStats();
    updateRecentLiked();
    
    // Check if returning from Spotify auth
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
        exchangeCodeForToken(code);
    } else {
        // Check for saved token
        const savedToken = localStorage.getItem('spotifyAccessToken');
        if (savedToken) {
            accessToken = savedToken;
            initializeApp();
        }
    }
});

// Spotify Authentication Functions
spotifyLoginBtn.addEventListener('click', () => {
    const scope = 'user-read-private user-read-email user-top-read playlist-modify-public playlist-modify-private';
    const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${CLIENT_ID}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
        `scope=${encodeURIComponent(scope)}`;
    
    window.location.href = authUrl;
});

async function exchangeCodeForToken(code) {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI
            })
        });

        const data = await response.json();
        
        if (data.access_token) {
            accessToken = data.access_token;
            localStorage.setItem('spotifyAccessToken', accessToken);
            
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
            initializeApp();
        } else {
            console.error('Failed to get access token:', data);
            showError('Login failed. Please make sure your redirect URI is properly configured in your Spotify app settings.');
        }
    } catch (error) {
        console.error('Auth error:', error);
        showError('Login failed. Please check your internet connection and try again.');
    }
}

// App Initialization
async function initializeApp() {
    try {
        await getCurrentUser();
        await getRecommendations();
        
        loginSection.style.display = 'none';
        appSection.style.display = 'block';
        loadingState.style.display = 'none';
        
        displayCurrentSong();
        setupSwipeListeners();
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        localStorage.removeItem('spotifyAccessToken');
        
        if (error.message.includes('401')) {
            showError('Session expired. Please login again.');
        } else {
            showError('Failed to load app. Please check your internet connection and try again.');
        }
        
        setTimeout(() => {
            location.reload();
        }, 3000);
    }
}

// Spotify API Functions
async function getCurrentUser() {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to get user info`);
    }
    
    currentUser = await response.json();
    
    // Update user profile in navigation
    userProfile.style.display = 'flex';
    userAvatar.src = currentUser.images?.[0]?.url || getDefaultAvatar();
    userName.textContent = currentUser.display_name;
}

async function getRecommendations() {
    try {
        // Get user's top tracks for seed data
        const topTracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=medium_term', {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
        
        if (!topTracksResponse.ok) {
            throw new Error(`HTTP ${topTracksResponse.status}: Failed to get top tracks`);
        }
        
        const topTracksData = await topTracksResponse.json();
        
        // If user has no top tracks, use some popular artists as seeds
        let seedParam = '';
        if (topTracksData.items && topTracksData.items.length > 0) {
            const seedTracks = topTracksData.items.map(track => track.id).slice(0, 5).join(',');
            seedParam = `seed_tracks=${seedTracks}`;
        } else {
            // Fallback: use popular artist seeds
            const popularArtists = ['4NHQUGzhtTLFvgF5SZesLK', '1Xyo4u8uXC1ZmMpatF05PJ', '06HL4z0CvFAxyc27GXpf02']; // Tame Impala, The Weeknd, Taylor Swift
            seedParam = `seed_artists=${popularArtists.join(',')}`;
        }
        
        // Get recommendations based on seeds
        const recommendationsResponse = await fetch(
            `https://api.spotify.com/v1/recommendations?${seedParam}&limit=50&market=${currentUser.country || 'US'}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            }
        );
        
        if (!recommendationsResponse.ok) {
            throw new Error(`HTTP ${recommendationsResponse.status}: Failed to get recommendations`);
        }
        
        const recommendationsData = await recommendationsResponse.json();
        recommendations = recommendationsData.tracks.filter(track => 
            track.preview_url && !likedSongs.some(liked => liked.id === track.id)
        );
        
        // If no recommendations with previews, show all recommendations
        if (recommendations.length === 0) {
            recommendations = recommendationsData.tracks.filter(track =>
                !likedSongs.some(liked => liked.id === track.id)
            );
        }
        
        currentSongIndex = 0;
        updateStats();
        
    } catch (error) {
        console.error('Failed to get recommendations:', error);
        throw error;
    }
}

// Card Display and Management
function displayCurrentSong() {
    if (currentSongIndex >= recommendations.length) {
        showNoMoreSongs();
        return;
    }
    
    const song = recommendations[currentSongIndex];
    const existingCard = document.querySelector('.song-card');
    if (existingCard) existingCard.remove();
    
    const card = document.createElement('div');
    card.className = 'song-card';
    card.innerHTML = `
        <img src="${song.album.images[0]?.url || getDefaultAlbumCover()}" alt="${song.album.name}" class="song-card-image">
        <div class="song-card-content">
            <div>
                <div class="song-card-title">${truncateText(song.name, 40)}</div>
                <div class="song-card-artist">${truncateText(song.artists.map(a => a.name).join(', '), 50)}</div>
            </div>
            <div class="song-card-details">
                <div class="song-card-genre">${capitalizeFirst(song.album.album_type)}</div>
                <div class="song-card-popularity">${song.popularity}% popular</div>
            </div>
        </div>
    `;
    
    cardContainer.appendChild(card);
    setupCardSwipe(card);
}

function getDefaultAlbumCover() {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMjgyODI4Ii8+CjxwYXRoIGQ9Ik0xNTAgMjEwQzE4My4xMzcgMjEwIDIxMCAxODMuMTM3IDIxMCAxNTBDMjEwIDExNi44NjMgMTgzLjEzNyA5MCAxNTAgOTBDMTE2Ljg2MyA5MCA5MCAxMTYuODYzIDkwIDE1MEM5MCAxODMuMTM3IDExNi44NjMgMjEwIDE1MCAyMTBaIiBmaWxsPSIjMURCOTU0Ii8+CjxwYXRoIGQ9Ik0xMzIuNSAxMzVWMTY1SDE1N1YxMzVIMTMyLjVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
}

function getDefaultAvatar() {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMxREI5NTQiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNDEuNzktNCA0IDEuNzkgNCA0IDQgek0xMiAxNGMtMi42NyAwLTggMS4zNC04IDR2MmgxNnYtMmMwLTIuNjYtNS4zMy00LTQiLz4KPC9zdmc+Cjwvc3ZnPgo=';
}

// Swipe Functionality
function setupCardSwipe(card) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;

    // Mouse events
    card.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    // Touch events
    card.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', endDrag);

    function startDrag(e) {
        if (!isSwipingEnabled) return;
        
        isDragging = true;
        card.classList.add('dragging');
        
        const clientX = e.clientX || e.touches?.[0]?.clientX;
        const clientY = e.clientY || e.touches?.[0]?.clientY;
        
        startX = clientX;
        startY = clientY;
        
        // Prevent default to avoid scrolling on mobile
        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging || !isSwipingEnabled) return;
        e.preventDefault();
        
        const clientX = e.clientX || e.touches?.[0]?.clientX;
        const clientY = e.clientY || e.touches?.[0]?.clientY;
        
        currentX = clientX - startX;
        currentY = clientY - startY;
        
        const rotation = currentX * 0.1;
        const scale = 1 - Math.abs(currentX) * 0.0005;
        card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg) scale(${scale})`;
        
        // Show indicators based on swipe direction
        const opacity = Math.min(Math.abs(currentX) / 100, 1);
        if (currentX > 50) {
            likeIndicator.style.opacity = opacity;
            rejectIndicator.style.opacity = 0;
        } else if (currentX < -50) {
            rejectIndicator.style.opacity = opacity;
            likeIndicator.style.opacity = 0;
        } else {
            likeIndicator.style.opacity = 0;
            rejectIndicator.style.opacity = 0;
        }
    }

    function endDrag(e) {
        if (!isDragging || !isSwipingEnabled) return;
        
        isDragging = false;
        card.classList.remove('dragging');
        
        // Reset indicators
        likeIndicator.style.opacity = 0;
        rejectIndicator.style.opacity = 0;
        
        const threshold = 100;
        
        if (Math.abs(currentX) > threshold) {
            const direction = currentX > 0 ? 'right' : 'left';
            swipeSong(direction);
        } else {
            // Snap back to center
            card.style.transform = '';
            card.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                card.style.transition = '';
            }, 300);
        }
        
        currentX = 0;
        currentY = 0;
    }
}

function swipeSong(direction) {
    if (!isSwipingEnabled) return;
    
    isSwipingEnabled = false;
    const card = document.querySelector('.song-card');
    const song = recommendations[currentSongIndex];
    
    // Update swipe count
    swipedCount++;
    localStorage.setItem('swipedCount', swipedCount.toString());
    
    if (direction === 'right') {
        card.classList.add('swiped-right');
        likeSong(song);
    } else {
        card.classList.add('swiped-left');
    }
    
    updateStats();
    
    setTimeout(() => {
        currentSongIndex++;
        displayCurrentSong();
        isSwipingEnabled = true;
    }, 300);
}

// Song Management
function likeSong(song) {
    const likedSong = {
        id: song.id,
        name: song.name,
        artist: song.artists.map(a => a.name).join(', '),
        album: song.album.name,
        image: song.album.images[0]?.url,
        preview_url: song.preview_url,
        external_url: song.external_urls.spotify,
        dateAdded: new Date().toISOString()
    };
    
    likedSongs.unshift(likedSong); // Add to beginning of array
    if (likedSongs.length > 50) {
        likedSongs = likedSongs.slice(0, 50); // Keep only last 50 liked songs
    }
    
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    updateRecentLiked();
}

// UI Management Functions
function updateStats() {
    likedCount.textContent = likedSongs.length;
    swipedCountEl.textContent = swipedCount;
    discoveredCount.textContent = Math.max(0, currentSongIndex);
}

function updateRecentLiked() {
    if (likedSongs.length === 0) {
        recentLiked.innerHTML = '<p class="empty-state">Start swiping to see your liked songs!</p>';
        return;
    }
    
    const recentSongs = likedSongs.slice(0, 5); // Show only last 5
    recentLiked.innerHTML = recentSongs.map(song => `
        <div class="liked-song-item">
            <img src="${song.image || getDefaultAlbumCover()}" alt="${song.album}" class="liked-song-cover">
            <div class="liked-song-info">
                <div class="liked-song-title">${truncateText(song.name, 20)}</div>
                <div class="liked-song-artist">${truncateText(song.artist, 25)}</div>
            </div>
        </div>
    `).join('');
}

function showNoMoreSongs() {
    cardContainer.innerHTML = `
        <div class="no-more-songs">
            <h3>🎉 Amazing taste in music!</h3>
            <p>You've discovered ${swipedCount} songs and liked ${likedSongs.length} of them.</p>
            <p>Your liked songs are saved and ready to explore.</p>
            <button class="refresh-btn" onclick="refreshRecommendations()">Discover More Music</button>
        </div>
    `;
}

async function refreshRecommendations() {
    loadingState.style.display = 'block';
    cardContainer.innerHTML = '';
    
    try {
        await getRecommendations();
        loadingState.style.display = 'none';
        displayCurrentSong();
    } catch (error) {
        loadingState.style.display = 'none';
        showError('Failed to load new recommendations. Please try again.');
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ff4458;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 9999;
        text-align: center;
        box-shadow: 0 10px 30px rgba(255, 68, 88, 0.3);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// Event Listeners Setup
function setupSwipeListeners() {
    rejectBtn.addEventListener('click', () => swipeSong('left'));
    likeBtn.addEventListener('click', () => swipeSong('right'));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            e.preventDefault();
            swipeSong('left');
        }
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            e.preventDefault();
            swipeSong('right');
        }
    });
}

// Utility Functions
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Global Functions (for onclick handlers)
window.refreshRecommendations = refreshRecommendations;
