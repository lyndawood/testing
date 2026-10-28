import * as THREE from 'https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js';

// Game state
const gameState = {
    cards: [],
    selectedCards: [],
    matchedPairs: 0,
    moves: 0,
    startTime: null,
    isAnimating: false,
    gameOver: false,
    hintActive: false,
};

// Emoji pairs for the game
const emojis = ['🎮', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺'];

// Three.js setup
let scene, camera, renderer;
let cardMeshes = [];
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let animationFrameId = null;

// Initialize Three.js
function initThreeJS() {
    const canvas = document.getElementById('gameCanvas');
    const gameArea = document.querySelector('.game-area');
    
    if (!canvas || !gameArea) {
        console.error('Canvas or game area not found');
        return;
    }
    
    // Get dimensions - use clientWidth/Height or fallback to window
    let width = gameArea.clientWidth || window.innerWidth;
    let height = gameArea.clientHeight || window.innerHeight * 0.6;
    
    // Ensure minimum dimensions
    if (width < 100) width = 400;
    if (height < 100) height = 400;
    
    console.log('Initializing Three.js with dimensions:', width, height);
    
    // Set canvas size attributes
    canvas.width = width;
    canvas.height = height;
    
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 8;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x6366f1, 0.5);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Mouse events
    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('mousemove', onCanvasMouseMove);
    
    // Start animation loop
    animate();
}

function onWindowResize() {
    const canvas = document.getElementById('gameCanvas');
    const gameArea = document.querySelector('.game-area');
    
    if (!gameArea || !renderer) return;
    
    let width = gameArea.clientWidth || window.innerWidth;
    let height = gameArea.clientHeight || window.innerHeight * 0.6;
    
    if (width < 100) width = 400;
    if (height < 100) height = 400;
    
    canvas.width = width;
    canvas.height = height;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
}

function onCanvasClick(event) {
    if (gameState.isAnimating || gameState.gameOver) return;
    
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cardMeshes);
    
    if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const card = clickedMesh.userData;
        
        if (!card.flipped && !card.matched && !gameState.selectedCards.includes(card)) {
            flipCard(card, clickedMesh);
        }
    }
}

function onCanvasMouseMove(event) {
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cardMeshes);
    
    cardMeshes.forEach(mesh => {
        const isHovered = intersects.some(i => i.object === mesh);
        mesh.userData.isHovered = isHovered;
    });
}

// Create 3D card
function createCard(emoji, index) {
    const geometry = new THREE.BoxGeometry(1.5, 2, 0.1);
    
    // Front face (with emoji)
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 256;
    frontCanvas.height = 256;
    const frontCtx = frontCanvas.getContext('2d');
    frontCtx.fillStyle = '#6366f1';
    frontCtx.fillRect(0, 0, 256, 256);
    frontCtx.fillStyle = '#ffffff';
    frontCtx.font = 'bold 120px Arial';
    frontCtx.textAlign = 'center';
    frontCtx.textBaseline = 'middle';
    frontCtx.fillText(emoji, 128, 128);
    
    const frontTexture = new THREE.CanvasTexture(frontCanvas);
    const frontMaterial = new THREE.MeshStandardMaterial({ map: frontTexture });
    
    // Back face (card back)
    const backCanvas = document.createElement('canvas');
    backCanvas.width = 256;
    backCanvas.height = 256;
    const backCtx = backCanvas.getContext('2d');
    backCtx.fillStyle = '#ec4899';
    backCtx.fillRect(0, 0, 256, 256);
    backCtx.fillStyle = '#ffffff';
    backCtx.font = 'bold 80px Arial';
    backCtx.textAlign = 'center';
    backCtx.textBaseline = 'middle';
    backCtx.fillText('?', 128, 128);
    
    const backTexture = new THREE.CanvasTexture(backCanvas);
    const backMaterial = new THREE.MeshStandardMaterial({ map: backTexture });
    
    // Create materials array for each face
    const materials = [
        backMaterial, // right
        backMaterial, // left
        backMaterial, // top
        backMaterial, // bottom
        backMaterial, // front
        frontMaterial, // back
    ];
    
    const mesh = new THREE.Mesh(geometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // Store card data
    mesh.userData = {
        emoji: emoji,
        flipped: false,
        matched: false,
        isHovered: false,
        rotationY: 0,
        targetRotationY: 0,
        index: index,
    };
    
    return mesh;
}

// Create game board
function createGameBoard() {
    // Clear existing cards
    cardMeshes.forEach(mesh => scene.remove(mesh));
    cardMeshes = [];
    gameState.cards = [];
    
    // Create shuffled emoji array
    const shuffledEmojis = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    
    // Create cards in a grid
    const cols = 4;
    const rows = 4;
    const spacing = 1.8;
    const startX = -(cols - 1) * spacing / 2;
    const startY = (rows - 1) * spacing / 2;
    
    console.log('Creating game board with', shuffledEmojis.length, 'cards');
    
    shuffledEmojis.forEach((emoji, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        
        const card = createCard(emoji, index);
        card.position.x = startX + col * spacing;
        card.position.y = startY - row * spacing;
        card.position.z = 0;
        
        scene.add(card);
        cardMeshes.push(card);
        gameState.cards.push(card.userData);
    });
    
    console.log('Game board created with', cardMeshes.length, 'cards');
}

// Flip card animation
function flipCard(card, mesh) {
    gameState.selectedCards.push(card);
    gameState.moves++;
    updateStats();
    
    // Animate flip
    const startRotation = mesh.rotation.y;
    const targetRotation = startRotation + Math.PI;
    
    animateCardFlip(mesh, startRotation, targetRotation, () => {
        card.flipped = true;
        
        if (gameState.selectedCards.length === 2) {
            checkMatch();
        }
    });
}

function animateCardFlip(mesh, startRot, targetRot, onComplete) {
    gameState.isAnimating = true;
    const startTime = Date.now();
    const duration = 600;
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        mesh.rotation.y = startRot + (targetRot - startRot) * easeInOutCubic(progress);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            gameState.isAnimating = false;
            onComplete();
        }
    }
    
    animate();
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Check for match
function checkMatch() {
    const [card1, card2] = gameState.selectedCards;
    const mesh1 = cardMeshes.find(m => m.userData === card1);
    const mesh2 = cardMeshes.find(m => m.userData === card2);
    
    if (card1.emoji === card2.emoji) {
        // Match found
        card1.matched = true;
        card2.matched = true;
        gameState.matchedPairs++;
        updateStats();
        
        // Celebrate matched cards
        celebrateMatch(mesh1, mesh2);
        
        gameState.selectedCards = [];
        
        if (gameState.matchedPairs === 8) {
            endGame();
        }
    } else {
        // No match - flip back
        setTimeout(() => {
            animateCardFlip(mesh1, mesh1.rotation.y, 0, () => {
                card1.flipped = false;
            });
            
            animateCardFlip(mesh2, mesh2.rotation.y, 0, () => {
                card2.flipped = false;
            });
            
            gameState.selectedCards = [];
        }, 1000);
    }
}

function celebrateMatch(mesh1, mesh2) {
    // Pulse and rotate animation
    const startTime = Date.now();
    const duration = 600;
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.1;
        mesh1.scale.set(scale, scale, scale);
        mesh2.scale.set(scale, scale, scale);
        
        mesh1.rotation.z = Math.sin(progress * Math.PI * 4) * 0.1;
        mesh2.rotation.z = Math.sin(progress * Math.PI * 4) * 0.1;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            mesh1.scale.set(1, 1, 1);
            mesh2.scale.set(1, 1, 1);
            mesh1.rotation.z = 0;
            mesh2.rotation.z = 0;
        }
    }
    
    animate();
}

// Update stats display
function updateStats() {
    document.getElementById('moves').textContent = gameState.moves;
    document.getElementById('matches').textContent = `${gameState.matchedPairs}/8`;
}

// Update timer
function updateTimer() {
    if (!gameState.startTime || gameState.gameOver) return;
    
    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    document.getElementById('timer').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// End game
function endGame() {
    gameState.gameOver = true;
    
    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('finalMoves').textContent = gameState.moves;
    document.getElementById('finalTime').textContent = timeStr;
    
    setTimeout(() => {
        document.getElementById('winModal').classList.remove('hidden');
    }, 500);
}

// New game
function newGame() {
    gameState.cards = [];
    gameState.selectedCards = [];
    gameState.matchedPairs = 0;
    gameState.moves = 0;
    gameState.startTime = Date.now();
    gameState.isAnimating = false;
    gameState.gameOver = false;
    gameState.hintActive = false;
    
    document.getElementById('winModal').classList.add('hidden');
    
    createGameBoard();
    updateStats();
}

// Hint functionality
function showHint() {
    if (gameState.hintActive || gameState.selectedCards.length > 0 || gameState.gameOver) return;
    
    gameState.hintActive = true;
    
    // Find unmatched cards
    const unmatchedCards = cardMeshes.filter(m => !m.userData.matched);
    
    if (unmatchedCards.length < 2) return;
    
    // Pick two random unmatched cards
    const card1 = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
    let card2 = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
    
    while (card2 === card1 && unmatchedCards.length > 1) {
        card2 = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
    }
    
    // Flip them briefly
    const originalRot1 = card1.rotation.y;
    const originalRot2 = card2.rotation.y;
    
    animateCardFlip(card1, originalRot1, originalRot1 + Math.PI, () => {
        setTimeout(() => {
            animateCardFlip(card1, originalRot1 + Math.PI, originalRot1, () => {
                gameState.hintActive = false;
            });
        }, 1000);
    });
    
    animateCardFlip(card2, originalRot2, originalRot2 + Math.PI, () => {
        setTimeout(() => {
            animateCardFlip(card2, originalRot2 + Math.PI, originalRot2, () => {});
        }, 1000);
    });
}

// Animation loop
function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    // Update hover effects
    cardMeshes.forEach(mesh => {
        if (mesh.userData.isHovered && !mesh.userData.flipped && !mesh.userData.matched) {
            mesh.position.z = 0.3;
            mesh.scale.lerp(new THREE.Vector3(1.05, 1.05, 1.05), 0.1);
        } else {
            mesh.position.z = 0;
            mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }
    });
    
    // Update timer
    updateTimer();
    
    // Render
    renderer.render(scene, camera);
}

// Event listeners
document.getElementById('newGameBtn').addEventListener('click', newGame);
document.getElementById('hintBtn').addEventListener('click', showHint);
document.getElementById('playAgainBtn').addEventListener('click', newGame);

// Initialize on page load
function startGame() {
    initThreeJS();
    newGame();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startGame);
} else {
    startGame();
}
