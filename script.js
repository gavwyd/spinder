// Spotify Configuration
const SPOTIFY_CONFIG = {
    CLIENT_ID: '32e9e5d5c4d74bf98e34f5e240070726', // Replace with your actual Client ID
    REDIRECT_URI: window.location.origin + window.location.pathname,
    SCOPES: [
        'user-read-private',
        'user-read-email', 
        'user-top-read',
        'user-read-recently-played',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-library-read'
    ].join(' ')
};

// Application State
class AppState {
    constructor() {
        this.accessToken = null;
        this.currentUser = null;
        this.recommendations = [];
        this.currentCardIndex = 0;
        this.lovedSongs = this.loadFromStorage('lovedSongs', []);
        this.passedCount = this.loadFromStorage('passedCount', 0);
        this.discoveredCount = this.loadFromStorage('discoveredCount', 0);
        this.playlistId = this.loadFromStorage('playlistId', null);
        this.isSwipingEnabled = true;
        this.cardStack = [];
    }

    loadFromStorage(key, defaultValue) {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Failed to save to storage:', error);
        }
    }

    addLovedSong(song) {
        this.lovedSongs.unshift(song);
        if (this.lovedSongs.length > 100) {
            this.lovedSongs = this.lovedSongs.slice(0, 100);
        }
        this.saveToStorage('lovedSongs', this.lovedSongs);
    }

    incrementPassed() {
        this.passedCount++;
        this.saveToStorage('passedCount', this.passedCount);
    }

    incrementDiscovered() {
        this.discoveredCount++;
        this.saveToStorage('discoveredCount', this.discoveredCount);
    }

    setPlaylistId(id) {
        this.playlistId = id;
        this.saveToStorage('playlistId', id);
    }
}

// DOM Elements
const elements = {
    // Sections
    loginSection: document.getElementById('loginSection'),
    appSection: document.getElementById('appSection'),
    
    // Navigation
    userProfile: document.getElementById('userProfile'),
    userAvatar: document.getElementById('userAvatar'),
    userName: document.getElementById('userName'),
    logoutBtn: document.getElementById('logoutBtn'),
    
    // Login
    spotifyLoginBtn: document.getElementById('spotifyLoginBtn'),
    
    // App
    loadingState: document.getElementById('loadingState'),
    cardStack: document.getElementById('cardStack'),
    
    // Stats
    likedCount: document.getElementById('likedCount'),
    passedCount: document.getElementById('passedCount'),
    discoveredCount: document.getElementById('discoveredCount'),
    
    // Controls
    skipBtn: document.getElementById('skipBtn'),
    loveBtn: document.getElementById('loveBtn'),
    
    // Indicators
    loveIndicator: document.getElementById('loveIndicator'),
    skipIndicator: document.getElementById('skipIndicator'),
    
    // Playlist
    recentLoved: document.getElementById('recentLoved'),
    playlistStatus: document.getElementById('playlistStatus'),
    openPlaylistBtn: document.getElementById('openPlaylistBtn'),
    
    // Toast
    toastContainer: document.getElementById('toastContainer')
};

// Initialize app state
const appState = new AppState();

// Spotify API Helper
class SpotifyAPI {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.baseURL = 'https://api.spotify.com/v1';
    }

    async request(endpoint, options = {}) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('UNAUTHORIZED');
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }

    async getCurrentUser() {
        return this.request('/me');
    }

    async getTopTracks(timeRange = 'medium_term', limit = 20) {
        return this.request(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
    }

    async getTopArtists(timeRange = 'medium_term', limit = 10) {
        return this.request(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
    }

    async getRecommendations(params) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/recommendations?${query}`);
    }

    async createPlaylist(userId, name, description) {
        return this.request(`/users/${userId}/playlists`, {
            method: 'POST',
            body: JSON.stringify({
                name,
                description,
                public: false
            })
        });
    }

    async addTracksToPlaylist(playlistId, trackUris) {
        return this.request(`/playlists/${playlistId}/tracks`, {
            method: 'POST',
            body: JSON.stringify({
                uris: trackUris
            })
        });
    }

    async getPlaylist(playlistId) {
        return this.request(`/playlists/${playlistId}`);
    }
}

// Utility Functions
function getHashParams() {
    const hashParams = {};
    const hash = window.location.hash.substring(1);
    const pairs = hash.split('&');
    
    for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key && value) {
            hashParams[key] = decodeURIComponent(value);
        }
    }
    
    return hashParams;
}

function generateAuthURL() {
    const params = new URLSearchParams({
        client_id: SPOTIFY_CONFIG.CLIENT_ID,
        response_type: 'token',
        redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
        scope: SPOTIFY_CONFIG.SCOPES,
        show_dialog: 'true'
    });
    
    return `https://accounts.spotify.com/authorize?${params}`;
}

function isTokenValid() {
    const token = localStorage.getItem('spotifyAccessToken');
    const timestamp = localStorage.getItem('tokenTimestamp');
    
    if (!token || !timestamp) return false;
    
    const tokenAge = Date.now() - parseInt(timestamp);
    const oneHour = 60 * 60 * 1000;
    
    return tokenAge < oneHour;
}

function saveToken(token) {
    localStorage.setItem('spotifyAccessToken', token);
    localStorage.setItem('tokenTimestamp', Date.now().toString());
}

function clearToken() {
    localStorage.removeItem('spotifyAccessToken');
    localStorage.removeItem('tokenTimestamp');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    elements.toastContainer.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // Remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
}

function getDefaultImage() {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMjgyODI4Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiMxREI5NTQiLz4KPHJlY3QgeD0iMTEwIiB5PSIxNjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzFEQjk1NCIvPgo8L3N2Zz4K';
}

// App Initialization
async function initializeApp() {
    try {
        showLoading(true);
        
        const spotify = new SpotifyAPI(appState.accessToken);
        
        // Get user profile
        appState.currentUser = await spotify.getCurrentUser();
        updateUserProfile();
        
        // Load recommendations
        await loadRecommendations();
        
        // Switch to app view
        elements.loginSection.style.display = 'none';
        elements.appSection.style.display = 'block';
        
        showLoading(false);
        
        // Setup UI
        updateStats();
        updateRecentLoved();
        setupEventListeners();
        displayNextCard();
        
        showToast('Welcome to Spinder! Start discovering music.', 'success');
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        
        if (error.message === 'UNAUTHORIZED') {
            clearToken();
            showToast('Session expired. Please login again.', 'error');
            setTimeout(() => {
                elements.appSection.style.display = 'none';
                elements.loginSection.style.display = 'block';
            }, 2000);
        } else {
            showToast('Failed to load app. Please try again.', 'error');
        }
        
        showLoading(false);
    }
}

async function loadRecommendations() {
    try {
        const spotify = new SpotifyAPI(appState.accessToken);
        let seedTracks = [];
        let seedArtists = [];
        
        // Get user's top tracks for personalized recommendations
        try {
            const topTracks = await spotify.getTopTracks('short_term', 5);
            if (topTracks.items && topTracks.items.length > 0) {
                seedTracks = topTracks.items.map(track => track.id);
            }
        } catch (error) {
            console.log('Could not get top tracks, trying artists');
        }
        
        // If no top tracks, get top artists
        if (seedTracks.length === 0) {
            try {
                const topArtists = await spotify.getTopArtists('medium_term', 3);
                if (topArtists.items && topArtists.items.length > 0) {
                    seedArtists = topArtists.items.map(artist => artist.id);
                }
            } catch (error) {
                console.log('Could not get top artists, using fallback');
            }
        }
        
        // Fallback to popular seeds if no user data available
        if (seedTracks.length === 0 && seedArtists.length === 0) {
            seedArtists = [
                '4NHQUGzhtTLFvgF5SZesLK', // Tame Impala
                '1Xyo4u8uXC1ZmMpatF05PJ', // The Weeknd
                '06HL4z0CvFAxyc27GXpf02', // Taylor Swift
                '1McMsnEElThX1knmY4oliG', // Olivia Rodrigo
                '4q3ewBCX7sLwd24euuV69X'  // Bad Bunny
            ];
        }
        
        // Build recommendation parameters
        const params = {
            limit: 50,
            market: appState.currentUser?.country || 'US',
            min_popularity: 30,
            target_energy: 0.7,
            target_danceability: 0.6
        };
        
        if (seedTracks.length > 0) {
            params.seed_tracks = seedTracks.slice(0, 5).join(',');
        } else {
            params.seed_artists = seedArtists.slice(0, 5).join(',');
        }
        
        // Get recommendations
        const recommendationsData = await spotify.getRecommendations(params);
        
        // Filter out already loved songs
        const lovedIds = new Set(appState.lovedSongs.map(song => song.id));
        appState.recommendations = recommendationsData.tracks.filter(
            track => !lovedIds.has(track.id) && track.preview_url
        );
        
        appState.currentCardIndex = 0;
        
    } catch (error) {
        console.error('Failed to load recommendations:', error);
        throw error;
    }
}

function updateUserProfile() {
    if (!appState.currentUser) return;
    
    elements.userProfile.style.display = 'flex';
    elements.userAvatar.src = appState.currentUser.images?.[0]?.url || getDefaultImage();
    elements.userName.textContent = appState.currentUser.display_name;
}

function updateStats() {
    elements.likedCount.textContent = appState.lovedSongs.length;
    elements.passedCount.textContent = appState.passedCount;
    elements.discoveredCount.textContent = appState.discoveredCount;
}

function updateRecentLoved() {
    if (appState.lovedSongs.length === 0) {
        elements.recentLoved.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💝</div>
                <p>Songs you love will appear here</p>
                <span>Start swiping to build your collection!</span>
            </div>
        `;
        return;
    }
    
    const recentSongs = appState.lovedSongs.slice(0, 6);
    elements.recentLoved.innerHTML = recentSongs.map(song => `
        <div class="loved-song-item" onclick="openSpotifyTrack('${song.external_url}')">
            <img src="${song.image || getDefaultImage()}" alt="${song.name}" class="loved-song-cover">
            <div class="loved-song-info">
                <div class="loved-song-title">${truncateText(song.name, 25)}</div>
                <div class="loved-song-artist">${truncateText(song.artist, 30)}</div>
            </div>
        </div>
    `).join('');
    
    // Show playlist button if we have loved songs
    if (appState.lovedSongs.length > 0) {
        elements.openPlaylistBtn.style.display = 'flex';
    }
}

function displayNextCard() {
    if (appState.currentCardIndex >= appState.recommendations.length) {
        showNoMoreSongs();
        return;
    }
    
    const song = appState.recommendations[appState.currentCardIndex];
    const cardElement = createSongCard(song);
    
    // Clear existing cards
    elements.cardStack.innerHTML = '';
    elements.cardStack.appendChild(cardElement);
    
    setupCardInteractions(cardElement);
}

function createSongCard(song) {
    const card = document.createElement('div');
    card.className = 'song-card';
    card.tabIndex = 0;
    
    const imageUrl = song.album.images?.[0]?.url || getDefaultImage();
    const albumType = song.album.album_type === 'single' ? 'Single' : 'Album';
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${song.album.name}" class="song-card-image" onerror="this.src='${getDefaultImage()}'">
        <div class="song-card-content">
            <div class="song-card-header">
                <div class="song-card-title">${truncateText(song.name, 35)}</div>
                <div class="song-card-artist">${truncateText(song.artists.map(a => a.name).join(', '), 45)}</div>
            </div>
            <div class="song-card-footer">
                <div class="song-card-album">${albumType}</div>
                <div class="song-card-popularity">${song.popularity}% popular</div>
            </div>
        </div>
    `;
    
    return card;
}

function setupCardInteractions(card) {
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
        if (!appState.isSwipingEnabled) return;
        
        isDragging = true;
        card.classList.add('dragging');
        
        const clientX = e.clientX || e.touches?.[0]?.clientX;
        const clientY = e.clientY || e.touches?.[0]?.clientY;
        
        startX = clientX;
        startY = clientY;
        
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging || !appState.isSwipingEnabled) return;
        
        const clientX = e.clientX || e.touches?.[0]?.clientX;
        const clientY = e.clientY || e.touches?.[0]?.clientY;
        
        currentX = clientX - startX;
        currentY = clientY - startY;
        
        const rotation = currentX * 0.1;
        const scale = Math.max(0.8, 1 - Math.abs(currentX) * 0.0008);
        
        card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg) scale(${scale})`;
        
        // Show appropriate indicator
        const threshold = 80;
        const opacity = Math.min(Math.abs(currentX) / threshold, 1);
        
        if (currentX > threshold) {
            elements.loveIndicator.style.opacity = opacity;
            elements.skipIndicator.style.opacity = 0;
        } else if (currentX < -threshold) {
            elements.skipIndicator.style.opacity = opacity;
            elements.loveIndicator.style.opacity = 0;
        } else {
            elements.loveIndicator.style.opacity = 0;
            elements.skipIndicator.style.opacity = 0;
        }
        
        e.preventDefault();
    }
    
    function endDrag() {
        if (!isDragging || !appState.isSwipingEnabled) return;
        
        isDragging = false;
        card.classList.remove('dragging');
        
        elements.loveIndicator.style.opacity = 0;
        elements.skipIndicator.style.opacity = 0;
        
        const swipeThreshold = 120;
        
        if (Math.abs(currentX) > swipeThreshold) {
            const direction = currentX > 0 ? 'love' : 'skip';
            processSongAction(direction);
        } else {
            // Snap back
            card.style.transform = '';
            card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => {
                card.style.transition = '';
            }, 300);
        }
        
        currentX = 0;
        currentY = 0;
    }
}

function processSongAction(action) {
    if (!appState.isSwipingEnabled) return;
    
    appState.isSwipingEnabled = false;
    const card = elements.cardStack.querySelector('.song-card');
    const song = appState.recommendations[appState.currentCardIndex];
    
    if (action === 'love') {
        card.classList.add('swiped-love');
        loveSong(song);
        showToast(`Added "${truncateText(song.name, 20)}" to your collection!`, 'success');
    } else {
        card.classList.add('swiped-skip');
        appState.incrementPassed();
    }
    
    appState.incrementDiscovered();
    updateStats();
    
    setTimeout(() => {
        appState.currentCardIndex++;
        displayNextCard();
        appState.isSwipingEnabled = true;
    }, 400);
}

function loveSong(song) {
    const lovedSong = {
        id: song.id,
        name: song.name,
        artist: song.artists.map(a => a.name).join(', '),
        album: song.album.name,
        image: song.album.images?.[0]?.url,
        external_url: song.external_urls.spotify,
        uri: song.uri,
        dateAdded: new Date().toISOString()
    };
    
    appState.addLovedSong(lovedSong);
    updateRecentLoved();
    
    // Create or update playlist
    updateSpotifyPlaylist();
}

async function updateSpotifyPlaylist() {
    if (appState.lovedSongs.length === 0) return;
    
    try {
        const spotify = new SpotifyAPI(appState.accessToken);
        
        // Create playlist if it doesn't exist
        if (!appState.playlistId) {
            const playlist = await spotify.createPlaylist(
                appState.currentUser.id,
                'Spinder Discoveries',
                'Songs discovered and loved through Spinder 🎵'
            );
            
            appState.setPlaylistId(playlist.id);
            elements.playlistStatus.style.display = 'flex';
            showToast('Created "Spinder Discoveries" playlist!', 'success');
        }
        
        // Add the latest song to playlist
        const latestSong = appState.lovedSongs[0];
        await spotify.addTracksToPlaylist(appState.playlistId, [latestSong.uri]);
        
    } catch (error) {
        console.error('Failed to update playlist:', error);
        showToast('Could not add to playlist. Try again later.', 'warning');
    }
}

function showNoMoreSongs() {
    elements.cardStack.innerHTML = `
        <div class="no-more-songs">
            <h3>🎉 Amazing musical taste!</h3>
            <p>You've explored ${appState.discoveredCount} songs and loved ${appState.lovedSongs.length} of them.</p>
            <p>Your discoveries are saved in your Spotify playlist.</p>
            <button class="refresh-btn" onclick="refreshRecommendations()">Discover More Music</button>
        </div>
    `;
}

async function refreshRecommendations() {
    showLoading(true);
    
    try {
        await loadRecommendations();
        displayNextCard();
        showToast('New recommendations loaded!', 'success');
    } catch (error) {
        console.error('Failed to refresh recommendations:', error);
        showToast('Failed to load new songs. Try again later.', 'error');
    }
    
    showLoading(false);
}

function setupEventListeners() {
    // Button actions
    elements.skipBtn.addEventListener('click', () => processSongAction('skip'));
    elements.loveBtn.addEventListener('click', () => processSongAction('love'));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                e.preventDefault();
                processSongAction('skip');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                e.preventDefault();
                processSongAction('love');
                break;
        }
    });
    
    // Logout
    elements.logoutBtn.addEventListener('click', logout);
    
    // Open playlist
    elements.openPlaylistBtn.addEventListener('click', openPlaylist);
}

function showLoading(show) {
    elements.loadingState.style.display = show ? 'flex' : 'none';
}

function openSpotifyTrack(url) {
    window.open(url, '_blank');
}

function openPlaylist() {
    if (appState.playlistId) {
        const playlistUrl = `https://open.spotify.com/playlist/${appState.playlistId}`;
        window.open(playlistUrl, '_blank');
    }
}

function logout() {
    clearToken();
    localStorage.clear();
    window.location.reload();
}

// Authentication Flow
function handleAuthCallback() {
    const hashParams = getHashParams();
    const accessToken = hashParams.access_token;
    
    if (accessToken) {
        appState.accessToken = accessToken;
        saveToken(accessToken);
        
        // Clean URL
        window.history.replaceState(null, '', window.location.pathname);
        
        initializeApp();
        return true;
    }
    
    return false;
}

function checkExistingAuth() {
    if (isTokenValid()) {
        appState.accessToken = localStorage.getItem('spotifyAccessToken');
        initializeApp();
        return true;
    }
    
    clearToken();
    return false;
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Check for auth callback first
    if (handleAuthCallback()) {
        return;
    }
    
    // Check for existing valid token
    if (checkExistingAuth()) {
        return;
    }
    
    // Setup login button
    elements.spotifyLoginBtn.addEventListener('click', () => {
        window.location.href = generateAuthURL();
    });
    
    console.log('Spinder loaded and ready!');
});

// Global functions for onclick handlers
window.refreshRecommendations = refreshRecommendations;
window.openSpotifyTrack = openSpotifyTrack;
