/* Modern CSS Reset */
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Root Variables - Clean Spotify Theme */
:root {
    --spotify-green: #1db954;
    --spotify-green-hover: #1ed760;
    --spotify-black: #191414;
    --spotify-dark-gray: #121212;
    --spotify-gray: #282828;
    --spotify-light-gray: #535353;
    --spotify-text-gray: #a7a7a7;
    --white: #ffffff;
    
    --shadow-soft: 0 4px 12px rgba(0, 0, 0, 0.15);
    --shadow-medium: 0 8px 24px rgba(0, 0, 0, 0.2);
    --shadow-glow: 0 0 20px rgba(29, 185, 84, 0.4);
    --shadow-glow-strong: 0 0 30px rgba(29, 185, 84, 0.6);
    
    --border-radius: 8px;
    --border-radius-large: 16px;
    --border-radius-pill: 50px;
    
    --transition: all 0.3s ease;
}

/* Base Styles */
html {
    scroll-behavior: smooth;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--spotify-black);
    color: var(--white);
    line-height: 1.6;
    overflow-x: hidden;
    min-height: 100vh;
}

/* Navigation */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: var(--spotify-black);
    border-bottom: 1px solid var(--spotify-gray);
    z-index: 1000;
    padding: 1rem 0;
}

.nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--spotify-green);
}

.logo-icon {
    width: 32px;
    height: 32px;
    background: var(--spotify-green);
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-glow);
}

.logo-icon svg {
    width: 20px;
    height: 20px;
    color: var(--spotify-black);
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--spotify-gray);
    padding: 0.75rem 1.25rem;
    border-radius: var(--border-radius-pill);
    transition: var(--transition);
    border: 1px solid transparent;
}

.user-profile:hover {
    background: var(--spotify-light-gray);
    border-color: var(--spotify-green);
    transform: translateY(-1px);
}

.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--spotify-green);
}

.user-name {
    color: var(--white);
    font-weight: 600;
    font-size: 0.9rem;
}

.logout-btn {
    background: none;
    border: none;
    color: var(--spotify-text-gray);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--border-radius);
    transition: var(--transition);
}

.logout-btn:hover {
    color: var(--white);
    background: var(--spotify-light-gray);
}

.logout-btn svg {
    width: 16px;
    height: 16px;
}

/* Main Content */
.main-content {
    min-height: 100vh;
    padding-top: 80px;
}

/* Login Section */
.login-section {
    min-height: calc(100vh - 80px);
    display: flex;
    align-items: center;
    background: var(--spotify-dark-gray);
}

.hero-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.hero-content {
    max-width: 500px;
}

.hero-title {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    color: var(--white);
}

.hero-subtitle {
    font-size: 1.1rem;
    color: var(--spotify-text-gray);
    margin-bottom: 2.5rem;
    line-height: 1.6;
    font-weight: 400;
}

.spotify-login-btn {
    background: var(--spotify-green);
    color: var(--spotify-black);
    border: none;
    padding: 1rem 2rem;
    border-radius: var(--border-radius-pill);
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    transition: var(--transition);
    box-shadow: var(--shadow-glow);
}

.spotify-login-btn:hover {
    background: var(--spotify-green-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-glow-strong);
}

.spotify-icon {
    width: 20px;
    height: 20px;
}

/* Demo Phone */
.hero-visual {
    display: flex;
    justify-content: center;
    align-items: center;
}

.demo-phone {
    width: 280px;
    height: 560px;
    background: var(--spotify-gray);
    border-radius: 32px;
    padding: 1.5rem;
    box-shadow: var(--shadow-medium);
    border: 2px solid var(--spotify-light-gray);
}

.phone-screen {
    width: 100%;
    height: 100%;
    background: var(--spotify-dark-gray);
    border-radius: 24px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.demo-card {
    width: 85%;
    height: 70%;
    background: var(--spotify-gray);
    border-radius: var(--border-radius-large);
    overflow: hidden;
    box-shadow: var(--shadow-soft);
    animation: demoFloat 3s ease-in-out infinite;
}

@keyframes demoFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
}

.demo-album-art {
    width: 100%;
    height: 60%;
    background: var(--spotify-green);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.demo-album-art::after {
    content: '♫';
    font-size: 2.5rem;
    color: var(--spotify-black);
    opacity: 0.7;
    animation: musicPulse 2s ease-in-out infinite;
}

@keyframes musicPulse {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
}

.demo-song-info {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.demo-title {
    height: 16px;
    background: var(--white);
    border-radius: 8px;
    opacity: 0.9;
    animation: shimmer 2s ease-in-out infinite;
}

.demo-artist {
    height: 14px;
    width: 70%;
    background: var(--spotify-text-gray);
    border-radius: 6px;
    animation: shimmer 2s ease-in-out infinite 0.3s;
}

@keyframes shimmer {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.9; }
}

/* App Section */
.app-section {
    min-height: calc(100vh - 80px);
    background: var(--spotify-dark-gray);
    padding: 2rem 0;
}

.app-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: 280px 1fr 280px;
    gap: 2rem;
    height: calc(100vh - 140px);
}

/* Sidebar Styles */
.sidebar {
    background: var(--spotify-gray);
    border-radius: var(--border-radius-large);
    padding: 1.5rem;
    box-shadow: var(--shadow-soft);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.sidebar h3 {
    color: var(--spotify-green);
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Stats Panel */
.stats-panel {
    background: var(--spotify-light-gray);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    border: 1px solid var(--spotify-green);
    box-shadow: 0 0 15px rgba(29, 185, 84, 0.2);
}

.stats-grid {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}

.stat-item {
    text-align: center;
    flex: 1;
}

.stat-number {
    display: block;
    font-size: 1.8rem;
    font-weight: 900;
    color: var(--spotify-green);
    margin-bottom: 0.25rem;
}

.stat-label {
    font-size: 0.75rem;
    color: var(--spotify-text-gray);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Controls Panel */
.controls-panel {
    background: var(--spotify-light-gray);
    border-radius: var(--border-radius);
    padding: 1.5rem;
}

.control-hint {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
    color: var(--white);
    font-size: 0.9rem;
}

.control-hint:last-child {
    margin-bottom: 0;
}

kbd {
    background: var(--spotify-black);
    border: 1px solid var(--spotify-green);
    border-radius: 4px;
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
    color: var(--spotify-green);
    font-weight: 600;
    box-shadow: var(--shadow-soft);
    min-width: 28px;
    text-align: center;
}

.mouse-icon {
    font-size: 1.1rem;
    width: 28px;
    text-align: center;
}

/* Playlist Panel */
.playlist-panel {
    flex: 1;
    background: var(--spotify-light-gray);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
}

.playlist-status {
    background: rgba(29, 185, 84, 0.1);
    border: 1px solid var(--spotify-green);
    border-radius: var(--border-radius);
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.85rem;
    color: var(--spotify-green);
    font-weight: 600;
}

.status-icon {
    font-size: 1rem;
}

.recent-loved-list {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 1rem;
}

.recent-loved-list::-webkit-scrollbar {
    width: 4px;
}

.recent-loved-list::-webkit-scrollbar-track {
    background: var(--spotify-gray);
}

.recent-loved-list::-webkit-scrollbar-thumb {
    background: var(--spotify-green);
    border-radius: 2px;
}

.loved-song-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: var(--border-radius);
    margin-bottom: 0.5rem;
    background: var(--spotify-gray);
    transition: var(--transition);
    cursor: pointer;
}

.loved-song-item:hover {
    background: var(--spotify-light-gray);
    transform: translateX(4px);
}

.loved-song-cover {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
    flex-shrink: 0;
}

.loved-song-info {
    flex: 1;
    min-width: 0;
}

.loved-song-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--white);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.25rem;
}

.loved-song-artist {
    font-size: 0.75rem;
    color: var(--spotify-text-gray);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.empty-state {
    text-align: center;
    padding: 2rem 1rem;
    color: var(--spotify-text-gray);
}

.empty-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
    opacity: 0.7;
}

.empty-state p {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--white);
}

.empty-state span {
    font-size: 0.8rem;
    font-style: italic;
}

.open-playlist-btn {
    background: var(--spotify-green);
    color: var(--spotify-black);
    border: none;
    padding: 0.75rem 1rem;
    border-radius: var(--border-radius-pill);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: var(--transition);
    box-shadow: var(--shadow-glow);
}

.open-playlist-btn:hover {
    background: var(--spotify-green-hover);
    transform: translateY(-1px);
}

.open-playlist-btn svg {
    width: 14px;
    height: 14px;
}

/* Swipe Area */
.swipe-area {
    position: relative;
    background: var(--spotify-gray);
    border-radius: var(--border-radius-large);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-soft);
}

/* Loading State */
.loading-state {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    z-index: 10;
    background: var(--spotify-gray);
}

.loading-animation {
    position: relative;
    margin-bottom: 2rem;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid var(--spotify-light-gray);
    border-top: 3px solid var(--spotify-green);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-dots {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1rem;
}

.loading-dots span {
    width: 6px;
    height: 6px;
    background: var(--spotify-green);
    border-radius: 50%;
    animation: loadingDots 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes loadingDots {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
}

.loading-state h3 {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--spotify-green);
}

.loading-text {
    color: var(--spotify-text-gray);
    font-size: 0.9rem;
}

/* Card Stack */
.card-stack {
    flex: 1;
    position: relative;
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.song-card {
    position: absolute;
    width: 100%;
    max-width: 350px;
    height: 450px;
    background: var(--spotify-light-gray);
    border-radius: var(--border-radius-large);
    overflow: hidden;
    cursor: grab;
    box-shadow: var(--shadow-medium);
    transition: transform 0.3s ease, opacity 0.3s ease;
    user-select: none;
    border: 2px solid transparent;
}

.song-card:hover {
    border-color: var(--spotify-green);
    box-shadow: var(--shadow-glow);
}

.song-card.dragging {
    cursor: grabbing;
    transition: none;
    z-index: 10;
}

.song-card.swiped-love {
    transform: translateX(120%) rotate(30deg);
    opacity: 0;
}

.song-card.swiped-skip {
    transform: translateX(-120%) rotate(-30deg);
    opacity: 0;
}

.song-card-image {
    width: 100%;
    height: 60%;
    object-fit: cover;
    background: var(--spotify-green);
}

.song-card-content {
    padding: 1.5rem;
    height: 40%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.song-card-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--white);
    margin-bottom: 0.5rem;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.song-card-artist {
    font-size: 0.95rem;
    color: var(--spotify-text-gray);
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.song-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.song-card-album {
    background: rgba(29, 185, 84, 0.2);
    color: var(--spotify-green);
    padding: 0.4rem 0.8rem;
    border-radius: var(--border-radius-pill);
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid var(--spotify-green);
}

.song-card-popularity {
    color: var(--spotify-text-gray);
    font-size: 0.8rem;
    font-weight: 500;
}

/* Action Controls */
.action-controls {
    display: flex;
    justify-content: center;
    gap: 2.5rem;
    padding: 2rem;
    background: var(--spotify-black);
}

.action-button {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    box-shadow: var(--shadow-soft);
    font-weight: 600;
}

.action-button:active {
    transform: scale(0.95);
}

.action-button svg {
    width: 24px;
    height: 24px;
}

.skip-button {
    background: var(--spotify-gray);
    color: var(--white);
    border: 2px solid var(--spotify-light-gray);
}

.skip-button:hover {
    background: var(--spotify-light-gray);
    border-color: var(--white);
    transform: scale(1.1);
}

.love-button {
    background: var(--spotify-green);
    color: var(--spotify-black);
    border: 2px solid var(--spotify-green);
    box-shadow: var(--shadow-glow);
}

.love-button:hover {
    background: var(--spotify-green-hover);
    transform: scale(1.1);
    box-shadow: var(--shadow-glow-strong);
}

/* Swipe Indicators */
.swipe-indicator {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    z-index: 15;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem;
    border-radius: var(--border-radius);
    font-weight: 800;
    letter-spacing: 1px;
}

.indicator-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.indicator-icon svg {
    width: 28px;
    height: 28px;
}

.swipe-indicator span {
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 2px;
}

.love-indicator {
    right: 2rem;
    background: var(--spotify-green);
    color: var(--spotify-black);
    border: 2px solid var(--spotify-green);
    box-shadow: var(--shadow-glow);
}

.skip-indicator {
    left: 2rem;
    background: var(--spotify-light-gray);
    color: var(--white);
    border: 2px solid var(--white);
    box-shadow: var(--shadow-soft);
}

/* Toast Notifications */
.toast-container {
    position: fixed;
    top: 100px;
    right: 2rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.toast {
    background: var(--spotify-gray);
    color: var(--white);
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-medium);
    min-width: 300px;
    transform: translateX(120%);
    transition: var(--transition);
    border-left: 4px solid var(--spotify-green);
}

.toast.show {
    transform: translateX(0);
}

.toast.success {
    border-left-color: var(--spotify-green);
    background: var(--spotify-light-gray);
}

.toast.error {
    border-left-color: #e22134;
    background: rgba(226, 33, 52, 0.1);
}

.toast.warning {
    border-left-color: #ff9500;
    background: rgba(255, 149, 0, 0.1);
}

/* No More Songs */
.no-more-songs {
    text-align: center;
    padding: 3rem 2rem;
    color: var(--white);
}

.no-more-songs h3 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--spotify-green);
    margin-bottom: 1rem;
}

.no-more-songs p {
    color: var(--spotify-text-gray);
    margin-bottom: 0.5rem;
    line-height: 1.5;
    font-size: 0.95rem;
}

.refresh-btn {
    background: var(--spotify-green);
    color: var(--spotify-black);
    border: none;
    padding: 1rem 2rem;
    border-radius: var(--border-radius-pill);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1.5rem;
    transition: var(--transition);
    box-shadow: var(--shadow-glow);
}

.refresh-btn:hover {
    background: var(--spotify-green-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-glow-strong);
}

/* Focus and Accessibility */
button:focus-visible,
a:focus-visible {
    outline: 2px solid var(--spotify-green);
    outline-offset: 2px;
}

.song-card:focus-visible {
    outline: 2px solid var(--spotify-green);
    outline-offset: 4px;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .app-container {
        grid-template-columns: 260px 1fr 260px;
        gap: 1.5rem;
    }
    
    .hero-container {
        gap: 3rem;
    }
}

@media (max-width: 968px) {
    .hero-container {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 3rem;
    }
    
    .app-container {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        height: auto;
    }
    
    .swipe-area {
        order: 1;
        height: 600px;
    }
    
    .left-sidebar {
        order: 2;
    }
    
    .right-sidebar {
        order: 3;
    }
    
    .stats-grid {
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .nav-container {
        padding: 0 1rem;
    }
    
    .hero-container {
        padding: 0 1rem;
    }
    
    .app-container {
        padding: 0 1rem;
    }
    
    .swipe-area {
        height: 500px;
    }
    
    .song-card {
        height: 380px;
    }
    
    .action-controls {
        gap: 2rem;
        padding: 1.5rem;
    }
    
    .action-button {
        width: 48px;
        height: 48px;
    }
    
    .action-button svg {
        width: 20px;
        height: 20px;
    }
    
    .sidebar {
        padding: 1.25rem;
    }
    
    .toast-container {
        right: 1rem;
        left: 1rem;
    }
    
    .toast {
        min-width: auto;
    }
}

@media (max-width: 480px) {
    .demo-phone {
        width: 240px;
        height: 480px;
    }
    
    .song-card {
        height: 320px;
    }
    
    .song-card-content {
        padding: 1.25rem;
    }
    
    .song-card-title {
        font-size: 1.1rem;
    }
    
    .action-controls {
        gap: 1.5rem;
        padding: 1rem;
    }
    
    .action-button {
        width: 44px;
        height: 44px;
    }
    
    .action-button svg {
        width: 18px;
        height: 18px;
    }
    
    .swipe-indicator {
        padding: 1rem;
    }
    
    .swipe-indicator span {
        font-size: 0.85rem;
        letter-spacing: 1px;
    }
}
