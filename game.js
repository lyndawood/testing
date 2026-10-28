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

// Initialize Three.js
function initThreeJS() {
    const canvas = document.getElementById('gameCanvas');
    const gameArea = document.querySelector('.game-area');
    
    if (!canvas || !gameArea) {
        console.error('Canvas or game area not found');
        return;
    }
    
    // Set canvas size to match container
    const width = gameArea.clientWidth;
    const height = gameArea.clientHeight;
    
    console.log('Initializing Three.js with dimensions:', width, height);
    
    canvas.width = width;
    canvas.height = height;
    
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 8;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x6366f1, 0.5);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Mouse events
    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('mousemove', onCanvasMouseMove);
}

function onWindowResize() {
    const canvas = document.getElementById('gameCanvas');
    const gameArea = document.querySelector('.game-area');
    const width = gameArea.clientWidth;
    const height = gameArea.clientHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
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
            flipCard(card);
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
    const group = new THREE.Group();
    
    // Card geometry
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
        backMaterial, // front (will be rotated)
        frontMaterial, // back (will be rotated)
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
    
    group.add(mesh);
    return group;
}

// Create game board
function createGameBoard() {
    // Clear existing cards
    cardMeshes.forEach(mesh => scene.remove(mesh.parent));
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
        cardMeshes.push(card.children[0]);
        gameState.cards.push(card.children[0].userData);
    });
    
    console.log('Game board created with', cardMeshes.length, 'cards');
}

// Flip card animation
function flipCard(card) {
    gameState.selectedCards.push(card);
    gameState.moves++;
    updateStats();
    
    // Animate flip
    const startRotation = card.parent.rotation.y;
    const targetRotation = startRotation + Math.PI;
    
    animateCardFlip(card.parent, startRotation, targetRotation, () => {
        card.flipped = true;
        
        if (gameState.selectedCards.length === 2) {
            checkMatch();
        }
    });
}

function animateCardFlip(cardGroup, startRot, targetRot, onComplete) {
    gameState.isAnimating = true;
    const startTime = Date.now();
    const duration = 600;
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        cardGroup.rotation.y = startRot + (targetRot - startRot) * easeInOutCubic(progress);
        
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
    
    if (card1.emoji === card2.emoji) {
        // Match found
        card1.matched = true;
        card2.matched = true;
        gameState.matchedPairs++;
        updateStats();
        
        // Celebrate matched cards
        celebrateMatch(card1.parent, card2.parent);
        
        gameState.selectedCards = [];
        
        if (gameState.matchedPairs === 8) {
            endGame();
        }
    } else {
        // No match - flip back
        setTimeout(() => {
            const card1Mesh = cardMeshes.find(m => m.userData === card1);
            const card2Mesh = cardMeshes.find(m => m.userData === card2);
            
            animateCardFlip(card1Mesh.parent, card1Mesh.parent.rotation.y, 0, () => {
                card1.flipped = false;
            });
            
            animateCardFlip(card2Mesh.parent, card2Mesh.parent.rotation.y, 0, () => {
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
    if (gameState.hintActive || gameState.selectedCards.length > 0) return;
    
    gameState.hintActive = true;
    
    const unflipped = cardMeshes.filter(m => !m.userData.flipped && !m.userData.matched);
    if (unflipped.length < 2) return;
    
    const hint1 = unflipped[Math.floor(Math.random() * unflipped.length)];
    let hint2 = unflipped[Math.floor(Math.random() * unflipped.length)];
    while (hint2 === hint1) {
        hint2 = unflipped[Math.floor(Math.random() * unflipped.length)];
    }
    
    // Briefly flip hint cards
    const hintDuration = 1500;
    
    animateCardFlip(hint1.parent, hint1.parent.rotation.y, hint1.parent.rotation.y + Math.PI, () => {
        hint1.userData.flipped = true;
    });
    
    animateCardFlip(hint2.parent, hint2.parent.rotation.y, hint2.parent.rotation.y + Math.PI, () => {
        hint2.userData.flipped = true;
    });
    
    setTimeout(() => {
        animateCardFlip(hint1.parent, hint1.parent.rotation.y, 0, () => {
            hint1.userData.flipped = false;
        });
        
        animateCardFlip(hint2.parent, hint2.parent.rotation.y, 0, () => {
            hint2.userData.flipped = false;
            gameState.hintActive = false;
        });
    }, hintDuration);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update card hover effects
    cardMeshes.forEach(mesh => {
        if (mesh.userData.isHovered && !mesh.userData.matched) {
            mesh.parent.position.z += (0.3 - mesh.parent.position.z) * 0.1;
            mesh.parent.rotation.x += (0.1 - mesh.parent.rotation.x) * 0.1;
        } else {
            mesh.parent.position.z += (0 - mesh.parent.position.z) * 0.1;
            mesh.parent.rotation.x += (0 - mesh.parent.rotation.x) * 0.1;
        }
    });
    
    updateTimer();
    renderer.render(scene, camera);
}

// Event listeners
document.getElementById('newGameBtn').addEventListener('click', newGame);
document.getElementById('hintBtn').addEventListener('click', showHint);
document.getElementById('playAgainBtn').addEventListener('click', newGame);

// Initialize
initThreeJS();
newGame();
animate();
