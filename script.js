window.addEventListener("load", () => {
  const video = document.createElement("video");
  const midiaBackground = document.querySelector(".hero .midiaBackground");

  video.src = "assets/img/video-hero.mp4";
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;
  video.loop = true;

  video.style.opacity = 0;

  video.addEventListener("canplaythrough", () => {
    video.style.opacity = 1;
  });

  midiaBackground.appendChild(video);

  const videoFooter = document.createElement("video");
  const midiaBackgroundFooter = document.querySelector(
    "footer .midiaBackground",
  );

  videoFooter.src = "assets/img/video-footer.mp4";
  videoFooter.autoplay = true;
  videoFooter.muted = true;
  videoFooter.playsInline = true;
  videoFooter.loop = true;

  videoFooter.style.opacity = 0;

  videoFooter.addEventListener("canplaythrough", () => {
    videoFooter.style.opacity = 1;
  });

  midiaBackgroundFooter.appendChild(videoFooter);
});

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

if (window.innerWidth > 1000) {
  ScrollSmoother.create({
    smooth: 2,
    effects: true,
  });
}
const larguraTela = window.innerWidth;
window.addEventListener("resize", () => {
  const larguraAtual = window.innerWidth;

  const diferenca = Math.abs(larguraAtual - larguraTela);

  if (diferenca > 300) {
    location.reload();
  }
});

const tlTransitionHero = gsap.timeline({
  scrollTrigger: {
    trigger: "main",
    scrub: 1,
    pin: true,
    start: "100% 100%",
    end: "+=2000",
  },
});
tlTransitionHero.from(".transition div", {
  height: "0%",
  duration: 1,
  stagger: 0.08,
});

// TEXTO TRANSICAO HERO
const split2 = new SplitText(".textoAnimado2", {
  types: "lines, words, chars",
  mask: "lines",
});
tlTransitionHero.from(
  split2.chars,
  {
    y: "100%",
    opacity: 0,
    duration: 0.3,
    stagger: 0.03,
  },
  "-=.5",
);

// TITULOS ANIMADOS
const textos = document.querySelectorAll(".textoAnimado");
textos.forEach((texto) => {
  const split = new SplitText(texto, { types: "lines, words, chars" });

  // Cria animação com ScrollTrigger
  gsap.from(split.chars, {
    filter: "blur(20px)",
    opacity: 0,
    duration: 0.3,
    stagger: {
      each: 0.02,
      from: "random",
    },
    scrollTrigger: {
      trigger: texto,
      start: "top 80%",
      toggleActions: "play none restart none",
    },
  });
});

// PROJETOS
const projetos = document.querySelectorAll(".projeto");
projetos.forEach((projeto) => {
  const imgProjeto = projeto.querySelector("img");
  gsap.to(projeto, {
    width: "100%",
    borderRadius: 0,
    scrollTrigger: {
      trigger: projeto,
      end: "50% 50%",
      scrub: 1,
    },
  });

  gsap.to(imgProjeto, {
    filter: "saturate(100%)",
    scrollTrigger: {
      trigger: projeto,
      start: "0% 70%",
      end: "50% 50%",
      scrub: 1,
    },
  });
});

// CÓDIGO THREEJS
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const cena = new THREE.Scene();

// CAMERA
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 4;

// RENDERIZADOR
const renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderizador.setSize(window.innerWidth, window.innerHeight);

renderizador.physicallyCorrectLights = true;
renderizador.outputColorSpace = THREE.SRGBColorSpace;
renderizador.toneMapping = THREE.ACESFilmicToneMapping;
renderizador.toneMappingExposure = 1.2;
renderizador.setPixelRatio(window.devicePixelRatio);

const div3d = document.querySelector(".div3d");
div3d.appendChild(renderizador.domElement);

const textureLoader = new THREE.TextureLoader();

textureLoader.load("assets/img/hdri.webp", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;

  const pmrem = new THREE.PMREMGenerator(renderizador);
  const envMap = pmrem.fromEquirectangular(texture).texture;

  cena.environment = envMap;

  texture.dispose();
  pmrem.dispose();
});

// OBJETO3D
let objeto;
const loader = new GLTFLoader();

loader.load("assets/img/diamond-compressed.glb", (objetoCarregado) => {
  objeto = objetoCarregado.scene;
  objeto.position.z = -12;
  objeto.position.y = 2;

  const tl3d = gsap.timeline({
    scrollTrigger: {
      trigger: ".animations",
      scrub: true,
      pin: true,
      end: "+=2000",
    },
  });

  tl3d.to(objeto.position, {
    x: 0,

    y: 0,
    duration: 1,
  });
  tl3d.to(
    objeto.rotation,
    {
      x: 1.5 * Math.PI,
      duration: 1,
    },
    "<",
  );
  tl3d.to(
    objeto.position,
    {
      duration: 0.2,
      z: 3.2,
    },
    "-=.1",
  );

  tl3d.from("footer", {
    opacity: 0,
    duration: 0.1,
  });
  tl3d.from("footer", {
    duration: 0.1,
  });

  cena.add(objeto);
});

// Configuração centralizada
const config = {
  stagger: { each: 0.3, from: "random" },
  duration: 1,
  blur: "20px",
  pauseEntre: 2,
};

// Selecionar todos os h2 dentro de .div3d
const h2s = document.querySelectorAll(".div3d h2");

// Criar array com SplitText de cada h2
const splits = Array.from(h2s).map(
  (h2) => new SplitText(h2, { type: "chars" }),
);

// Criar timeline
const tlTextos3d = gsap.timeline({
  scrollTrigger: {
    scrub: 2,
    trigger: ".animations",
    start: "0% 50%",
    end: "+=2000",
  },
});

// Loop através de cada split
splits.forEach((split) => {
  // Aparecer
  tlTextos3d.from(split.chars, {
    opacity: 0,
    filter: `blur(${config.blur})`,
    duration: config.duration,
    stagger: config.stagger,
  });

  // Pausa
  tlTextos3d.to({}, { duration: config.pauseEntre });

  // Desaparecer
  tlTextos3d.to(split.chars, {
    opacity: 0,
    filter: `blur(${config.blur})`,
    duration: config.duration,
    stagger: config.stagger,
  });
});

function animar() {
  if (objeto) {
    objeto.rotation.y += 0.005;
  }

  requestAnimationFrame(animar);
  renderizador.render(cena, camera);
}

animar();

//PRELOADER
const preloaderText = document.querySelector(".preloader-text");
const preloader = document.getElementById("preloader");
let count = 0;

// Simula atualização do progresso enquanto a página carrega
const interval = setInterval(() => {
  if (document.readyState === "complete") count = 100;
  else count += Math.random() * 5; // Incremento variável para dar efeito natural

  if (count >= 100) count = 100;

  preloaderText.textContent = `${Math.floor(count)}%`;

  if (count === 100) {
    clearInterval(interval);
    gsap.to(preloader, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => preloader.remove(),
    });
  }
}, 50);
