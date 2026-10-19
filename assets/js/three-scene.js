/**
 * AJI LEKSONO - THREE.JS 3D BACKGROUND ENGINE
 * Theme: Modern Javanese Cosmic Mandala & Golden Particle Swarm
 */

(function () {
  'use strict';

  const container = document.getElementById('three-canvas-container');
  const canvas = document.getElementById('three-canvas');

  if (!canvas || typeof THREE === 'undefined') {
    console.warn('Three.js canvas not found or library not loaded.');
    return;
  }

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 45;
  camera.position.y = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // State
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let scrollY = 0;
  let isTabActive = true;

  // Colors Palette
  const isLightMode = () => document.documentElement.getAttribute('data-theme') === 'light';
  
  function getThemeColors() {
    if (isLightMode()) {
      return {
        particles: 0xb45309,
        wireframe: 0xd97706,
        innerRing: 0x92400e,
        ambient: 0x78350f,
        particleOpacity: 0.55
      };
    }
    return {
      particles: 0xd4af37,
      wireframe: 0xe6c35c,
      innerRing: 0x06b6d4,
      ambient: 0xffd700,
      particleOpacity: 0.85
    };
  }

  let currentColors = getThemeColors();

  // --- 1. GOLDEN PARTICLES (SWARM / KUNANG-KUNANG) ---
  const particleCount = 1400;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const initialPositions = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    // Spread in a cylindrical / toroidal galaxy formation
    const radius = 12 + Math.random() * 55;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 60;

    positions[i3] = Math.cos(theta) * radius;
    positions[i3 + 1] = y;
    positions[i3 + 2] = Math.sin(theta) * radius;

    initialPositions[i3] = positions[i3];
    initialPositions[i3 + 1] = positions[i3 + 1];
    initialPositions[i3 + 2] = positions[i3 + 2];

    scales[i] = Math.random() * 2 + 1;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

  // Canvas texture for glowing round particles
  function createParticleTexture() {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const ctx = pCanvas.getContext('2d');

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(243, 207, 101, 0.85)');
    grad.addColorStop(0.7, 'rgba(212, 175, 55, 0.3)');
    grad.addColorStop(1, 'rgba(212, 175, 55, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(pCanvas);
  }

  const particleMaterial = new THREE.PointsMaterial({
    size: 1.6,
    map: createParticleTexture(),
    transparent: true,
    opacity: currentColors.particleOpacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: currentColors.particles
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // --- 2. SACRED GEOMETRIC MANDALA & GUNUNGAN SILHOUETTE ---
  const mandalaGroup = new THREE.Group();
  scene.add(mandalaGroup);

  // Outer Rotating Celestial Rings
  const ringGeo1 = new THREE.TorusGeometry(18, 0.08, 16, 100);
  const ringMat1 = new THREE.MeshBasicMaterial({
    color: currentColors.wireframe,
    transparent: true,
    opacity: 0.35,
    wireframe: true
  });
  const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
  mandalaGroup.add(ringMesh1);

  const ringGeo2 = new THREE.TorusGeometry(24, 0.05, 16, 120);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: currentColors.innerRing,
    transparent: true,
    opacity: 0.25,
    wireframe: true
  });
  const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
  ringMesh2.rotation.x = Math.PI / 3;
  mandalaGroup.add(ringMesh2);

  // Inner Geometric Gem (Icosahedron & Octahedron)
  const icoGeo = new THREE.IcosahedronGeometry(8, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: currentColors.wireframe,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });
  const icoMesh = new THREE.Mesh(icoGeo, icoMat);
  mandalaGroup.add(icoMesh);

  const octGeo = new THREE.OctahedronGeometry(11, 0);
  const octMat = new THREE.MeshBasicMaterial({
    color: currentColors.innerRing,
    wireframe: true,
    transparent: true,
    opacity: 0.2
  });
  const octMesh = new THREE.Mesh(octGeo, octMat);
  mandalaGroup.add(octMesh);

  // Position mandala to the right side of hero for cinematic balance
  mandalaGroup.position.set(16, 2, -5);

  // --- MOUSE & SCROLL LISTENERS ---
  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX - window.innerWidth / 2) * 0.02;
    targetY = (e.clientY - window.innerHeight / 2) * 0.02;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // Handle Resize
  window.addEventListener('resize', onWindowResize, false);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Responsive position of 3D mandala
    if (window.innerWidth < 992) {
      mandalaGroup.position.set(0, 8, -15);
      mandalaGroup.scale.set(0.7, 0.7, 0.7);
    } else {
      mandalaGroup.position.set(16, 2, -5);
      mandalaGroup.scale.set(1, 1, 1);
    }
  }
  onWindowResize();

  // Visibility Change (Pause when out of view)
  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
  });

  // --- THEME CHANGE LISTENER ---
  window.addEventListener('themeChanged', (e) => {
    const updatedColors = getThemeColors();
    particleMaterial.color.setHex(updatedColors.particles);
    particleMaterial.opacity = updatedColors.particleOpacity;
    ringMat1.color.setHex(updatedColors.wireframe);
    ringMat2.color.setHex(updatedColors.innerRing);
    icoMat.color.setHex(updatedColors.wireframe);
    octMat.color.setHex(updatedColors.innerRing);
  });

  // --- ANIMATION LOOP ---
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    if (!isTabActive) return;

    const elapsedTime = clock.getElapsedTime();

    // Smooth Lerp Mouse Movement
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    // Camera subtle drift
    camera.position.x = mouseX * 0.8;
    camera.position.y = 5 - mouseY * 0.8 - (scrollY * 0.015);
    camera.lookAt(0, -scrollY * 0.015, 0);

    // Mandala Rotation
    mandalaGroup.rotation.y = elapsedTime * 0.12;
    mandalaGroup.rotation.x = Math.sin(elapsedTime * 0.08) * 0.2;
    ringMesh1.rotation.z = -elapsedTime * 0.15;
    ringMesh2.rotation.y = elapsedTime * 0.2;
    icoMesh.rotation.x = elapsedTime * 0.25;
    icoMesh.rotation.y = -elapsedTime * 0.2;
    octMesh.rotation.z = elapsedTime * 0.1;

    // Organic Waving Particle Movement
    const posAttr = particleGeometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const initX = initialPositions[i3];
      const initY = initialPositions[i3 + 1];
      const initZ = initialPositions[i3 + 2];

      posAttr.array[i3] = initX + Math.sin(elapsedTime * 0.5 + initY * 0.05) * 1.5;
      posAttr.array[i3 + 1] = initY + Math.cos(elapsedTime * 0.4 + initX * 0.05) * 1.5;
      posAttr.array[i3 + 2] = initZ + Math.sin(elapsedTime * 0.6 + initZ * 0.05) * 1.2;
    }
    posAttr.needsUpdate = true;
    particleSystem.rotation.y = elapsedTime * 0.02;

    renderer.render(scene, camera);
  }

  animate();
})();
