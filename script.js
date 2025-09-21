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
let isSwipingEnabled = true;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const mainApp = document.getElementById('mainApp');
const spotifyLoginBtn = document.getElementById('spotifyLoginBtn');
const cardStack = document.getElementById('cardStack');
const loading = document.getElementById('loading');
const userInfo = document.getElementById('userInfo');
const likedCounter = document.getElementById('likedCounter');
const rejectBtn = document.getElementById('rejectBtn');
const likeBtn = document.getElementById('likeBtn');
const likeIndicator = document.getElementById('likeIndicator');
const rejectIndicator = document.getElementById('rejectIndicator');

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    updateLikedCounter();
    
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
            alert('Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Auth error:', error);
        alert('Login failed. Please try again.');
    }
}

// App Initialization
async function initializeApp() {
    try {
        await getCurrentUser();
        await getRecommendations();
        
        loginScreen.style.display = 'none';
        mainApp.style.display = 'block';
        loading.style.display = 'none';
        
        displayCurrentSong();
        setupSwipeListeners();
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        localStorage.removeItem('spotifyAccessToken');
        alert('Session expired. Please login again.');
        location.reload();
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
        throw new Error('Failed to get user info');
    }
    
    currentUser = await response.json();
    userInfo.innerHTML = `
        <div class="user-name">Hi, ${currentUser.display_name}!</div>
        <div>${currentUser.country}</div>
    `;
}

async function getRecommendations() {
    try {
        // Get user's top tracks for seed data
        const topTracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=medium_term', {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
        
        const topTracksData = await topTracksResponse.json();
        const seedTracks = topTracksData.items.map(track => track.id).slice(0, 5).join(',');
        
        // Get recommendations based on top tracks
        const recommendationsResponse = await fetch(
            `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTracks}&limit=50&market=${currentUser.country}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            }
        );
        
        const recommendationsData = await recommendationsResponse.json();
        recommendations = recommendationsData.tracks.filter(track => 
            track.preview_url && !likedSongs.some(liked => liked.id === track.id)
        );
        
        currentSongIndex = 0;
        
    } catch (error) {
        console.error('Failed to get recommendations:', error);
        // Fallback: use some default recommendations
        recommendations = [];
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
        <img src="${song.album.images[0]?.url || getDefaultAlbumCover()}" alt="${song.album.name}" class="album-cover">
        <div class="song-info">
            <div>
                <div class="song-title">${song.name}</div>
                <div class="song-artist">${song.artists.map(a => a.name).join(', ')}</div>
            </div>
            <div class="song-details">
                <div class="song-genre">${song.album.album_type}</div>
                <div class="song-popularity">${song.popularity}% popularity</div>
            </div>
        </div>
    `;
    
    cardStack.appendChild(card);
    setupCardSwipe(card);
}

function getDefaultAlbumCover() {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMjgyODI4Ii8+CjxwYXRoIGQ9Ik0xNTAgMjEwQzE4My4xMzcgMjEwIDIxMCAxODMuMTM3IDIxMCAxNTBDMjEwIDExNi44NjMgMTgzLjEzNyA5MCAxNTAgOTBDMTE2Ljg2MyA5MCA5MCAxMTYuODYzIDkwIDE1MEM5MCAxODMuMTM3IDExNi44NjMgMjEwIDE1MCAyMTBaIiBmaWxsPSIjMURCOTU0Ii8+CjxwYXRoIGQ9Ik0xMzIuNSAxMzVWMTY1SDE1N1YxMzVIMTMyLjVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
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
        
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        startX = clientX;
        startY = clientY;
    }

    function drag(e) {
        if (!isDragging || !isSwipingEnabled) return;
        e.preventDefault();
        
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        currentX = clientX - startX;
        currentY = clientY - startY;
        
        const rotation = currentX * 0.1;
        card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;
        
        // Show indicators
        const opacity = Math.abs(currentX) / 100;
        if (currentX > 50) {
            likeIndicator.style.opacity = Math.min(opacity, 1);
            rejectIndicator.style.opacity = 0;
        } else if (currentX < -50) {
            rejectIndicator.style.opacity = Math.min(opacity, 1);
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
            // Snap back
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
    
    if (direction === 'right') {
        card.classList.add('swiped-right');
        likeSong(song);
    } else {
        card.classList.add('swiped-left');
    }
    
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
        external_url: song.external_urls.spotify
    };
    
    likedSongs.push(likedSong);
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    updateLikedCounter();
}

function updateLikedCounter() {
    likedCounter.textContent = `♥ ${likedSongs.length} Liked`;
}

// UI Management
function showNoMoreSongs() {
    cardStack.innerHTML = `
        <div class="no-more-songs">
            <h3>🎉 You've reached the end!</h3>
            <p>You've discovered all available songs based on your taste.</p>
            <p>Check out your liked songs in your Spotify library!</p>
            <button class="refresh-btn" onclick="refreshRecommendations()">Get More Songs</button>
        </div>
    `;
}

async function refreshRecommendations() {
    loading.style.display = 'block';
    cardStack.innerHTML = '';
    cardStack.appendChild(loading);
    
    await getRecommendations();
    loading.style.display = 'none';
    displayCurrentSong();
}

// Event Listeners Setup
function setupSwipeListeners() {
    rejectBtn.addEventListener('click', () => swipeSong('left'));
    likeBtn.addEventListener('click', () => swipeSong('right'));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') swipeSong('left');
        if (e.key === 'ArrowRight') swipeSong('right');
    });
}

// Global Functions (for onclick handlers)
window.refreshRecommendations = refreshRecommendations;
