/* ===== GSAP INITIALIZATION ===== */
/* Initialize GSAP plugins and configure performance settings */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

if (window.gsap && gsap.ticker) {
  gsap.ticker.lagSmoothing(500, 33);
  gsap.ticker.fps(60);
}

/* ===== ELEMENT REFERENCES ===== */
/* Core DOM elements and configuration parameters */
const canvasEl = document.querySelector("#gooey-overlay");
const contentEl = document.querySelector(".text-overlay");
const scrollMsgEl = document.querySelector(".scroll-msg");
const titleLines = document.querySelectorAll(".hero .title-line");

const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

const params = {
  scrollProgress: 0,
  colWidth: 0.5239,
  speed: 0.069,
  scale: 0.35,
  seed: 0.118,
  color: [0.42, 0.27, 0.14],
  pageColor: "#f3e7d9",
};

let st, uniforms, gl;
let __shaderStartTime = performance.now();
let __lastFrameTime = __shaderStartTime;
let __shaderTimeMs = 0;

/* ===== HERO SECTION ANIMATIONS ===== */
/* Main hero scroll timeline with gooey shader effects and text animations */
gsap.set("#gooey-overlay", { opacity: 1 });
gsap.set(".next-inner", { opacity: 0, y: 30 });

if (canvasEl) {
  gl = initShader();
  document.body.style.backgroundColor = params.pageColor;

  gsap.set(".hero-copy", {
    opacity: 1,
    autoAlpha: 1,
    filter: "blur(0px)",
    scale: 1,
  });
  gsap.set([".intertitle", ".intertitle-2"], {
    autoAlpha: 0,
    visibility: "visible",
  });

  st = gsap
    .timeline({
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "+=360%", // longest journey for strongest feel
        scrub: 0.4, // quicker response but still smooth
        pin: true,
        anticipatePin: 1,
      },
    })
    .to(params, { scrollProgress: 1 }, 0)
    .to(scrollMsgEl, { opacity: 0, y: 40, duration: 0.3 }, 0.1)
    .set(".hero-copy", { opacity: 1, autoAlpha: 1, filter: "blur(0px)" }, 0)
    .to(
      ".hero-copy",
      {
        opacity: 0,
        filter: "blur(24px)",
        duration: 0.34,
        ease: "none",
        immediateRender: false,
      },
      0.12
    )
    .to(".hero", { "--vignette": 0.9 }, 0.46)
    .to("#gooey-overlay", { filter: "blur(4px)" }, 0.46)
    .fromTo(
      ".choco-sheen",
      { opacity: 0, yPercent: -6 },
      { opacity: 0.22, yPercent: 0, duration: 0.4, ease: "power2.out" },
      0.46
    )
    .to(
      ".choco-sheen",
      { opacity: 0.08, yPercent: 6, duration: 0.5, ease: "power2.inOut" },
      0.7
    )
    .fromTo(
      ":root",
      { "--wipe": "0%" },
      { "--wipe": "100%", duration: 0.9, ease: "power3.inOut" },
      0.55
    )
    .to(
      "#gooey-overlay",
      { filter: "blur(8px)", duration: 0.28, ease: "power2.in" },
      0.58
    )
    .to(
      "#gooey-overlay",
      { opacity: 0.0, duration: 0.28, ease: "power2.out" },
      0.62
    )
    .to(
      ".choco-sheen",
      { opacity: 0, duration: 0.28, ease: "power2.out" },
      0.62
    )
    .to(
      ".choco-grain",
      { opacity: 0, duration: 0.28, ease: "power2.out" },
      0.62
    )
    .fromTo(
      ".intertitle",
      { autoAlpha: 0, scale: 0.98, filter: "blur(10px)" },
      {
        autoAlpha: 1,
        scale: 1.02,
        filter: "blur(0px)",
        duration: 0.35,
        ease: "power2.out",
      },
      0.46
    )
    .to(
      ".intertitle",
      {
        autoAlpha: 0,
        scale: 0.985,
        filter: "blur(24px)",
        duration: 0.4,
        ease: "power2.inOut",
      },
      1.2
    )
    .fromTo(
      ".intertitle-2",
      { autoAlpha: 0, y: 16, scale: 0.995, filter: "blur(10px)" },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.48,
        ease: "power2.out",
      },
      1.5
    )
    .to(
      ".intertitle-2",
      {
        autoAlpha: 0,
        y: -12,
        scale: 0.99,
        filter: "blur(16px)",
        duration: 0.6,
        ease: "power2.inOut",
      },
      2.1
    )
    .to(".hero", { "--vignette": 0 }, 1.25)
    .to("#gooey-overlay", { filter: "blur(0px)" }, 0.75)
    .to(".choco-sheen", { opacity: 0, duration: 0.25 }, 0.78);

  gsap
    .timeline({
      scrollTrigger: {
        trigger: "#next",
        start: "top 90%",
        end: "top 35%",
        scrub: true,
      },
    })
    .to("#gooey-overlay", { opacity: 0 }, 0)
    .to(".next-inner", { opacity: 1, y: 0, ease: "power2.out" }, 0);

  ScrollTrigger.create({
    trigger: "#fold-marquee",
    start: "top 120%",
    end: "bottom top",
    onEnter: () => {
      gsap.set(["#gooey-overlay", ".choco-sheen", ".choco-grain"], {
        opacity: 0,
        clearProps: "filter",
      });
      gsap.set(":root", { "--wipe": "100%" });
    },
    onEnterBack: () => {
      gsap.set(["#gooey-overlay", ".choco-sheen", ".choco-grain"], {
        opacity: 0,
        clearProps: "filter",
      });
      gsap.set(":root", { "--wipe": "100%" });
    },
    onUpdate: () => {
      gsap.set(["#gooey-overlay", ".choco-sheen", ".choco-grain"], {
        opacity: 0,
      });
      gsap.set(":root", { "--wipe": "100%" });
    },
  });

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  render();

  try {
    createControls().catch(() => {});
  } catch (_) {}

  /* ===== CHOCOLATE CHIP RAIN SYSTEM ===== */
  /* Animated chocolate chip particles that fall during hero section */
  const chipLayer = document.querySelector(".chip-rain");
  let raining = false;
  let rainCall = null;
  function spawnChip() {
    if (!chipLayer) return;
    const vw = window.innerWidth;
    const startX = Math.random() * vw;
    const sizeClass =
      Math.random() < 0.5 ? "small" : Math.random() > 0.8 ? "big" : "mid";

    let chip;
    const ns = "http://www.w3.org/2000/svg";
    try {
      // SVG chip with highlight
      const sz = sizeClass === "small" ? 10 : sizeClass === "big" ? 16 : 12;
      const svg = document.createElementNS(ns, "svg");
      svg.setAttribute("width", sz);
      svg.setAttribute("height", sz);
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.style.position = "absolute";
      svg.style.top = "-20px";
      svg.style.left = startX + "px";
      svg.style.pointerEvents = "none";
      svg.style.zIndex = "2";
      // base circle (chocolate)
      const gradId = "g" + Math.floor(Math.random() * 1e9);
      const defs = document.createElementNS(ns, "defs");
      const rg = document.createElementNS(ns, "radialGradient");
      rg.setAttribute("id", gradId);
      rg.setAttribute("cx", "30%");
      rg.setAttribute("cy", "30%");
      rg.setAttribute("r", "70%");
      const s1 = document.createElementNS(ns, "stop");
      s1.setAttribute("offset", "0%");
      s1.setAttribute("stop-color", "#7a4a26");
      const s2 = document.createElementNS(ns, "stop");
      s2.setAttribute("offset", "70%");
      s2.setAttribute("stop-color", "#4a2b16");
      rg.appendChild(s1);
      rg.appendChild(s2);
      defs.appendChild(rg);
      svg.appendChild(defs);
      const c = document.createElementNS(ns, "circle");
      c.setAttribute("cx", "12");
      c.setAttribute("cy", "12");
      c.setAttribute("r", "10");
      c.setAttribute("fill", `url(#${gradId})`);
      svg.appendChild(c);
      // highlight arc
      const hi = document.createElementNS(ns, "path");
      hi.setAttribute("d", "M6,7 A6,6 0 0 1 11,5");
      hi.setAttribute("stroke", "rgba(255,255,255,0.35)");
      hi.setAttribute("stroke-width", "1.6");
      hi.setAttribute("stroke-linecap", "round");
      hi.setAttribute("fill", "none");
      svg.appendChild(hi);
      chip = svg;
    } catch (e) {
      // Emoji fallback
      const span = document.createElement("span");
      span.textContent = Math.random() > 0.5 ? "🍪" : "🍫";
      span.style.position = "absolute";
      span.style.top = "-20px";
      span.style.left = startX + "px";
      span.style.fontSize =
        (sizeClass === "small" ? 12 : sizeClass === "big" ? 18 : 14) + "px";
      span.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,.25))";
      chip = span;
    }

    chipLayer.appendChild(chip);

    const drift = Math.random() * 60 - 30; // -30..30 px
    const rot = Math.random() * 90 - 45;
    const d = 2.2 + Math.random() * 1.6;
    gsap.fromTo(
      chip,
      { y: -20, opacity: 0 },
      {
        y: window.innerHeight + 40,
        opacity: 1,
        x: `+=${drift}`,
        rotation: rot,
        duration: d,
        ease: "power1.in",
        onComplete: () => chip.remove(),
      }
    );
  }
  function rainLoop() {
    if (!raining) return;
    // spawn 1-3 chips per batch
    const n = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) spawnChip();
    rainCall = gsap.delayedCall(0.22 + Math.random() * 0.18, rainLoop);
  }
  function startRain() {
    if (raining) return;
    raining = true;
    rainLoop();
  }
  function burst(n = 8) {
    for (let i = 0; i < n; i++) spawnChip();
  }
  function stopRain() {
    raining = false;
    if (rainCall) rainCall.kill();
    rainCall = null;
  }
  // Bind to hero visibility (same range as pin)
  ScrollTrigger.create({
    trigger: "#hero",
    start: "top top",
    end: "+=360%",
    onEnter: () => {
      // reset wipe and layers when entering from top
      gsap.set(":root", { "--wipe": "0%" });
      gsap.set("#gooey-overlay", { opacity: 1, filter: "blur(0px)" });
      gsap.set([".choco-sheen", ".choco-grain"], { opacity: 0.12 });
      startRain();
      burst(10);
    },
    onEnterBack: () => {
      // reset wipe and layers when re-entering from bottom
      gsap.set(":root", { "--wipe": "0%" });
      gsap.set("#gooey-overlay", { opacity: 1, filter: "blur(0px)" });
      gsap.set([".choco-sheen", ".choco-grain"], { opacity: 0.12 });
      // Reset intertitle states for proper scroll-up visibility
      gsap.set([".intertitle", ".intertitle-2"], {
        autoAlpha: 0,
        visibility: "visible",
      });
      startRain();
      burst(16);
    },
    onLeave: stopRain,
    // when leaving back (scrolling above start), keep rain running at the top hero
    onLeaveBack: () => {
      startRain();
      burst(8);
    },
  });

  // Kick off rain immediately with a small burst; ScrollTrigger will stop it when leaving hero
  startRain();
  burst(10);

  // If layout refreshes and hero is in view, ensure rain is running
  ScrollTrigger.addEventListener("refresh", () => {
    const st = ScrollTrigger.getById("heroRain");
    const heroEl = document.querySelector("#hero");
    if (!heroEl) return;
    const r = heroEl.getBoundingClientRect();
    const inView = r.top < window.innerHeight && r.bottom > 0;
    if (inView) {
      startRain();
      burst(12);
    }
  });
}

/* ===== TEXT ENTRANCE ANIMATIONS ===== */
/* Character-by-character animations for hero and gallery text */
window.addEventListener("load", () => {
  function splitToChars(nodeList) {
    nodeList.forEach((el) => {
      const text = el.textContent;
      el.textContent = "";
      for (const ch of text) {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = ch === " " ? "\u00A0" : ch;
        el.appendChild(span);
      }
    });
  }

  splitToChars(document.querySelectorAll(".gallery-intro .split-text"));

  (function initGalleryIntroAnimation() {
    const section = document.querySelector(".gallery-intro");
    if (!section || !window.gsap) return;
    let didAnimate = false;

    const animate = () => {
      if (didAnimate) return;
      didAnimate = true;
      section.classList.add("is-animated");
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      const hasTitleChars =
        document.querySelectorAll(".gallery-intro .gallery-title .char")
          .length > 0;
      const hasSubChars =
        document.querySelectorAll(".gallery-intro .gallery-sub .char").length >
        0;

      tl.from(
        hasTitleChars
          ? ".gallery-intro .gallery-title .char"
          : ".gallery-intro .gallery-title",
        {
          y: 40,
          opacity: 0,
          stagger: hasTitleChars ? 0.02 : 0,
          duration: 0.6,
        },
        0
      )
        .add(() => {
          const subElement = document.querySelector(
            ".gallery-intro .gallery-sub"
          );
          const fullText =
            "Explore our curated selection: birthday cakes, cupcakes, chocolate indulgence, vegan delights, and more—freshly crafted every day.";
          if (!subElement) return;
          subElement.classList.add("typing");

          let i = 0;
          let forward = true; // typing forward vs deleting

          const TYPE_SPEED = 45; // ms per char when typing
          const DELETE_SPEED = 30; // ms per char when deleting
          const PAUSE_FULL = 1200; // pause after full line
          const PAUSE_EMPTY = 600; // pause after cleared

          function loop() {
            if (forward) {
              if (i < fullText.length) {
                i++;
                subElement.textContent = fullText.slice(0, i);
                setTimeout(loop, TYPE_SPEED);
              } else {
                // full text shown, pause then start deleting
                setTimeout(() => {
                  forward = false;
                  loop();
                }, PAUSE_FULL);
              }
            } else {
              if (i > 0) {
                i--;
                subElement.textContent = fullText.slice(0, i);
                setTimeout(loop, DELETE_SPEED);
              } else {
                // empty, pause then start typing again
                setTimeout(() => {
                  forward = true;
                  loop();
                }, PAUSE_EMPTY);
              }
            }
          }

          subElement.textContent = "";
          loop();
        }, 0.8)
        .add(() => {
          if (hasTitleChars) {
            gsap
              .timeline({ repeat: -1, repeatDelay: 1 })
              .to(".gallery-intro .gallery-title .char", {
                y: -4,
                duration: 0.6,
                ease: "sine.inOut",
                stagger: { each: 0.02, from: "center" },
              })
              .to(
                ".gallery-intro .gallery-title .char",
                {
                  y: 0,
                  duration: 0.6,
                  ease: "sine.inOut",
                  stagger: { each: 0.02, from: "edges" },
                },
                "+=0.2"
              );
          } else {
            gsap.to(".gallery-intro .gallery-title", {
              y: -2,
              duration: 0.8,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          }

        });
    };

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate();
              obs.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      io.observe(section);
    } else {
      let hasAnimated = false;
      const onScroll = () => {
        if (hasAnimated) return;
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          hasAnimated = true;
          window.removeEventListener("scroll", onScroll);
          animate();
        }
      };
      window.addEventListener("scroll", onScroll);
      onScroll();
    }
  })();

  /* ===== 3D IMAGE RING INTERACTIONS ===== */
  /* Interactive 3D carousel with drag controls and hover effects */
  let xPos = 0;
  let isDragging = false;
  let dragVelocity = 0;
  let lastDragTime = 0;
  let draggedImage = null;

  const panels = document.querySelectorAll(".image-ring-3d .img");
  const COUNT = panels.length || 10;
  const ANGLE = 360 / COUNT;

  panels.forEach((p) => {
    p.style.cursor = "pointer";
    const img = p.querySelector("img");
    if (img) img.style.cursor = "pointer";
  });

  const dragIndicator = document.querySelector(".drag-indicator");
  let dragHintTimeout = null;
  if (dragIndicator) {
    dragIndicator.classList.remove("hide");
    dragHintTimeout = setTimeout(
      () => dragIndicator.classList.add("hide"),
      5000
    );
  }

  gsap
    .timeline()
    .set(".image-ring-3d .ring3d", { rotationY: 180 }) // initialize rotation only; avoid overriding cursor
    .set(".image-ring-3d .img", {
      rotateY: (i) => i * -ANGLE,
      transformOrigin: "50% 50% 500px",
      z: -500,
      backfaceVisibility: "hidden",
    })
    .from(".image-ring-3d .img", {
      duration: 1.5,
      y: 200,
      opacity: 0,
      stagger: 0.1,
      ease: "expo",
    })
    .set(".image-ring-3d .img", { opacity: 1, cursor: "pointer" })
    .add(() => {
      $(".image-ring-3d .img").on("mouseenter", (e) => {
        if (isDragging) return;
        const current = e.currentTarget;
        $(".image-ring-3d .img").not(current).addClass("dim");
        $(current).removeClass("dim");
      });
      $(".image-ring-3d .img").on("mouseleave", () => {
        if (isDragging) return;
        $(".image-ring-3d .img").removeClass("dim");
      });
    }, "-=0.5");

  $(".image-ring-3d .img").on("mousedown touchstart", dragStart);
  $(window).on("mouseup touchend", dragEnd);
  $(window).on("touchcancel", dragEnd);

  const ringSection = document.querySelector(".image-ring-3d");
  if (ringSection) {
    ringSection.addEventListener("mouseleave", () => {
      if (isDragging) return;
      $(".image-ring-3d .img").removeClass("dim");
    });
    ringSection.addEventListener(
      "touchend",
      () => {
        if (isDragging) return;
        $(".image-ring-3d .img").removeClass("dim");
      },
      { passive: true }
    );
  }

  function dragStart(e) {
    e.preventDefault();
    if (e.touches) e.clientX = e.touches[0].clientX;
    xPos = Math.round(e.clientX);
    isDragging = true;
    dragVelocity = 0;
    lastDragTime = Date.now();
    if (dragIndicator) {
      dragIndicator.classList.add("hide");
      if (dragHintTimeout) clearTimeout(dragHintTimeout);
    }

    draggedImage = $(e.currentTarget);

    $(".image-ring-3d .img").removeClass("dim");
    $(".image-ring-3d .img").css("cursor", "grab");
    draggedImage.css("cursor", "grabbing");

    $(".image-ring-3d .img").not(draggedImage).css("pointer-events", "none");

    $(window).on("mousemove touchmove", drag);
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault();

    if (e.touches) e.clientX = e.touches[0].clientX;

    const currentX = Math.round(e.clientX);
    const deltaX = currentX - xPos;
    const currentTime = Date.now();
    const deltaTime = currentTime - lastDragTime;

    if (deltaTime > 0) {
      dragVelocity = deltaX / deltaTime;
    }

    gsap.set(".image-ring-3d .ring3d", {
      rotationY: "+=" + -deltaX * 0.1,
    });

    xPos = currentX;
    lastDragTime = currentTime;
  }

  function dragEnd(e) {
    if (!isDragging) return;

    $(window).off("mousemove touchmove", drag);
    isDragging = false;

    if (Math.abs(dragVelocity) > 0.1) {
      const momentumRotation = dragVelocity * -200;
      gsap.to(".image-ring-3d .ring3d", {
        rotationY: "+=" + momentumRotation,
        duration: 1.5,
        ease: "power2.out",
        overwrite: true,
      });
    }

    $(".image-ring-3d .img").css("pointer-events", "auto");

    $(".image-ring-3d .img").css("cursor", "grab");
    $(".image-ring-3d .img").removeClass("dim");

    draggedImage = null;
  }


  /* ===== INLINE TREE ANIMATION ===== */
  /* GSAP-powered tree drawing animation with particle effects */
  function initInlineTreeAnimation() {
    const box = document.querySelector("#next .embed-box");
    if (!box) return;
    const svg = box.querySelector("svg.mainSVG");
    if (!svg || !window.gsap || !window.MotionPathPlugin) return;

    gsap.registerPlugin(MotionPathPlugin);
    const ctx = gsap.context(() => {
      function flicker(el) {
        gsap.killTweensOf(el, { opacity: true });
        gsap.fromTo(
          el,
          { opacity: 1 },
          { duration: 0.07, opacity: () => Math.random(), repeat: -1 }
        );
      }

      let emit = true; // whether particles emit
      const colors =
        "#E8F6F8 #ACE8F8 #F6FBFE #A2CBDC #B74551 #5DBA72 #910B28 #910B28 #446D39".split(
          " "
        );
      const particleIds = ["#star", "#circ", "#cross", "#heart"];
      const particles = [];
      let particleIndex = 0;

      gsap.set(svg, { visibility: "visible" });

      const sparkle = box.querySelector(".sparkle");
      if (sparkle) gsap.set(sparkle, { transformOrigin: "50% 50%", y: -100 });

      const samplePath = (pathEl) => {
        const raw = MotionPathPlugin.getRawPath(pathEl)[0];
        const pts = [];
        raw.forEach((v, i) => {
          if (i % 2) {
            pts.push({ x: raw[i - 1], y: raw[i] });
          }
        });
        return pts;
      };

      const treePath = box.querySelector(".treePath");
      const treeBottomPath = box.querySelector(".treeBottomPath");
      if (!treePath || !treeBottomPath) return;
      const bottomPts = samplePath(treeBottomPath);

      (function seedParticles() {
        for (let a = 201, node; --a >= 0; ) {
          node = box
            .querySelector(particleIds[a % particleIds.length])
            .cloneNode(true);
          svg.appendChild(node);
          node.setAttribute("fill", colors[a % colors.length]);
          node.setAttribute("class", "particle");
          particles.push(node);
          gsap.set(node, { x: -100, y: -100, transformOrigin: "50% 50%" });
        }
      })();

      function onEmit() {
        if (!emit) return;
        const a = particles[particleIndex];
        gsap.set(a, {
          x: gsap.getProperty(box.querySelector(".pContainer"), "x"),
          y: gsap.getProperty(box.querySelector(".pContainer"), "y"),
          scale: randScale(),
        });
        // Simulate physics2D with standard GSAP animations
        const velocity = gsap.utils.random(-23, 23);
        const angle = gsap.utils.random(-180, 180);
        const gravity = gsap.utils.random(-6, 50);
        const duration = gsap.utils.random(0.61, 6);
        
        // Convert angle to radians and calculate movement
        const angleRad = (angle * Math.PI) / 180;
        const moveX = Math.cos(angleRad) * velocity * 10;
        const moveY = Math.sin(angleRad) * velocity * 10 + gravity * 10;
        
        gsap.timeline().to(a, {
          duration: duration,
          x: `+=${moveX}`,
          y: `+=${moveY}`,
          scale: 0,
          rotation: gsap.utils.random(-123, 360),
          ease: "power2.out",
          onStart: flicker,
          onStartParams: [a],
          onRepeat: (b) => gsap.set(b, { scale: randScale() }),
          onRepeatParams: [a],
        });
        particleIndex = (particleIndex + 1) % particles.length;
      }

      const randScale = gsap.utils.random(0.5, 3, 0.001, true);

      const c = gsap.timeline({ delay: 0, repeat: -1, repeatDelay: 3 });
      const k = gsap.timeline({ onUpdate: onEmit });

      k.to([box.querySelector(".pContainer"), sparkle], {
        duration: 6,
        motionPath: { path: treePath, autoRotate: false },
        ease: "linear",
      })
        .to([box.querySelector(".pContainer"), sparkle], {
          duration: 1,
          onStart: () => {
            emit = false;
          },
          x: bottomPts[0].x,
          y: bottomPts[0].y,
        })
        .to(
          [box.querySelector(".pContainer"), sparkle],
          {
            duration: 2,
            onStart: () => {
              emit = true;
            },
            motionPath: { path: treeBottomPath, autoRotate: false },
            ease: "linear",
          },
          "-=0"
        )
        .fromTo(
          box.querySelector(".treeBottomMask"),
          { strokeDasharray: "0 1000", stroke: "#FFF" },
          { duration: 2, strokeDasharray: "1000 0", ease: "linear" },
          "-=2"
        );

      c.fromTo(
        [box.querySelector(".treePathMask"), box.querySelector(".treePotMask")],
        { strokeDasharray: "0 1000", stroke: "#FFF" },
        {
          strokeDasharray: "1000 0",
          stagger: { each: 6 },
          duration: gsap.utils.wrap([6, 1, 2]),
          ease: "linear",
        }
      )
        .from(
          box.querySelector(".treeStar"),
          {
            duration: 3,
            scaleY: 0,
            scaleX: 0.15,
            transformOrigin: "50% 50%",
            ease: "elastic(1,0.5)",
          },
          "-=4"
        )
        .to(
          sparkle,
          {
            duration: 3,
            opacity: 0,
            ease: "rough({strength: 2, points: 100, template: linear, taper: both, randomize: true, clamp: false})",
          },
          "-=0"
        )
        .to(
          box.querySelector(".treeStarOutline"),
          {
            duration: 1,
            opacity: 1,
            ease: "rough({strength: 2, points: 16, template: linear, taper: none, randomize: true, clamp: false})",
          },
          "+=1"
        );

      c.add(k, 0);
      gsap.globalTimeline.timeScale(1.5);

      const endMsg = box.querySelector("#endMessage");
      if (endMsg) {
        k.vars.onComplete = function () {
          gsap.to(endMsg, { opacity: 1, duration: 0.5 });
        };
        c.eventCallback("onStart", () => gsap.set(endMsg, { opacity: 0 }));
        c.eventCallback("onRepeat", () => gsap.set(endMsg, { opacity: 0 }));
      }
    }, box);

    return () => ctx && ctx.revert();
  }

  if (document.readyState !== "loading") initInlineTreeAnimation();
  else document.addEventListener("DOMContentLoaded", initInlineTreeAnimation);
  splitToChars(document.querySelectorAll(".hero .title-line"));
  splitToChars(document.querySelectorAll(".intertitle-text"));
  gsap.set(".hero .title-line .char", { transformOrigin: "50% 80%", z: 0.01 });

  function startTitleAnims() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero .title-line:nth-child(1) .char", {
      autoAlpha: 0,
      y: 64,
      rotationX: 55,
      stagger: { each: 0.02, from: "start" },
      duration: 0.6,
    })
      .from(
        ".hero .title-line:nth-child(2) .char",
        {
          autoAlpha: 0,
          y: 48,
          skewX: 8,
          stagger: { each: 0.025, from: "start" },
          duration: 0.55,
        },
        "-=0.35"
      )
      .from(
        ".hero .title-line.highlight .char",
        {
          autoAlpha: 0,
          y: 50,
          scale: 0.8,
          stagger: { each: 0.02, from: "center" },
          duration: 0.6,
        },
        "-=0.45"
      )
      .fromTo(
        ".hero .title-line.highlight",
        {
          letterSpacing: "-0.04em",
          filter: "drop-shadow(0 0 0 rgba(106,59,30,0))",
        },
        {
          letterSpacing: "0em",
          filter: "drop-shadow(0 8px 18px rgba(106,59,30,0.25))",
          duration: 0.7,
          ease: "power2.out",
        },
        "<"
      )
      .fromTo(
        ".hero .title-line.highlight",
        { backgroundPosition: "0% 50%" },
        { backgroundPosition: "100% 50%", duration: 0.8, ease: "power1.inOut" },
        "<"
      )
      // lock to a highly legible final state
      .add(() => {
        const hl = document.querySelector(".hero .title-line.highlight");
        if (hl) hl.classList.add("legible");
      })
      .to(
        ".hero .title-line",
        { skewX: 0, rotationX: 0, y: 0, duration: 0.22, ease: "power1.out" },
        ">-0.05"
      )
      .from(".hero-sub", { y: 12, opacity: 0, duration: 0.46 }, "-=0.2")
      .from(
        ".hero-cta .btn",
        { y: 14, opacity: 0, stagger: 0.08, duration: 0.48 },
        "-=0.25"
      )
      .timeScale(1.05);

    setTimeout(startBreathingWave, 1000);
  }

  function startBreathingWave() {
    const wave = gsap.timeline({ repeat: -1, repeatDelay: 2.2 });
    const amp = 6; // px
    function waveLine(sel, t) {
      wave.to(
        sel,
        {
          y: -amp,
          duration: 0.5,
          ease: "sine.inOut",
          stagger: { each: 0.02, from: "start" },
          yoyo: true,
          repeat: 1,
        },
        t
      );
    }
    waveLine(".hero .title-line:nth-child(1) .char", 0.0);
    waveLine(".hero .title-line:nth-child(2) .char", 0.18);
    waveLine(".hero .title-line.highlight .char", 0.36);
  }

  const start = () => requestAnimationFrame(startTitleAnims);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
  } else {
    start();
  }

  const subEl = document.querySelector(".hero-sub");
  if (subEl) {
    const full = subEl.textContent.trim();
    const minSpeed = 10,
      varSpeed = 14; // faster typing
    const pauseAfterType = 700; // shorter pause
    const pauseAfterErase = 300; // shorter pause
    function typeLoop() {
      let i = 0;
      subEl.textContent = "";
      // type
      (function type() {
        if (i <= full.length) {
          subEl.textContent = full.slice(0, i);
          i++;
          setTimeout(type, minSpeed + Math.random() * varSpeed);
        } else {
          setTimeout(erase, pauseAfterType);
        }
      })();
      // erase
      function erase() {
        let j = full.length;
        (function back() {
          if (j >= 0) {
            subEl.textContent = full.slice(0, j);
            j--;
            setTimeout(back, minSpeed + Math.random() * varSpeed);
          } else {
            setTimeout(typeLoop, pauseAfterErase);
          }
        })();
      }
    }
    setTimeout(typeLoop, 450);
  }

  const nextSubEl = document.querySelector(".next-sub");
  if (nextSubEl) {
    const nextFull = nextSubEl.textContent.trim();
    const nextMinSpeed = 11,
      nextVarSpeed = 15; // faster typing
    const nextPauseAfterType = 800; // shorter pause
    const nextPauseAfterErase = 320; // shorter pause
    function nextTypeLoop() {
      let i = 0;
      nextSubEl.textContent = "";
      // type
      (function type() {
        if (i <= nextFull.length) {
          nextSubEl.textContent = nextFull.slice(0, i);
          i++;
          setTimeout(type, nextMinSpeed + Math.random() * nextVarSpeed);
        } else {
          setTimeout(erase, nextPauseAfterType);
        }
      })();
      // erase
      function erase() {
        let j = nextFull.length;
        (function back() {
          if (j >= 0) {
            nextSubEl.textContent = nextFull.slice(0, j);
            j--;
            setTimeout(back, nextMinSpeed + Math.random() * nextVarSpeed);
          } else {
            setTimeout(nextTypeLoop, nextPauseAfterErase);
          }
        })();
      }
    }
    ScrollTrigger.create({
      trigger: ".next-sub",
      start: "top 80%",
      once: true,
      onEnter: () => setTimeout(nextTypeLoop, 200),
    });
  }

  function initNextTitleAnimation() {
    const nextSection = document.querySelector(".next-tree");
    const nextTitleLines = nextSection
      ? nextSection.querySelectorAll(".title-line")
      : [];

    if (nextTitleLines.length === 0) return;

    nextTitleLines.forEach((line) => {
      if (line.querySelector(".char")) return;
      const text = line.textContent;
      line.innerHTML = text
        .split("")
        .map((char) =>
          char === " "
            ? '<span class="char">&nbsp;</span>'
            : `<span class="char">${char}</span>`
        )
        .join("");
    });

    gsap.set(".next-tree .title-line .char", {
      transformOrigin: "50% 80%",
      z: 0.01,
    });

    ScrollTrigger.create({
      trigger: ".next-tree",
      start: "top 70%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".next-tree .title-line:nth-child(1) .char", {
          autoAlpha: 0,
          y: 64,
          rotationX: 55,
          stagger: { each: 0.018, from: "start" },
          duration: 0.45,
        })
          .from(
            ".next-tree .title-line:nth-child(2).highlight .char",
            {
              autoAlpha: 0,
              y: 42,
              skewX: 8,
              stagger: { each: 0.02, from: "center" },
              duration: 0.45,
            },
            "-=0.35"
          )
          .fromTo(
            ".next-tree .title-line.highlight",
            {
              letterSpacing: "-0.04em",
              filter: "drop-shadow(0 0 0 rgba(106,59,30,0))",
            },
            {
              letterSpacing: "0em",
              filter: "drop-shadow(0 8px 18px rgba(106,59,30,0.25))",
              duration: 0.55,
              ease: "power2.out",
            },
            "<"
          )
          .fromTo(
            ".next-tree .title-line.highlight",
            {
              backgroundPosition: "0% 50%",
            },
            {
              backgroundPosition: "100% 50%",
              duration: 0.6,
              ease: "power1.inOut",
            },
            "<"
          )
          .to(
            ".next-tree .title-line",
            {
              skewX: 0,
              rotationX: 0,
              y: 0,
              duration: 0.22,
              ease: "power1.out",
            },
            ">-0.05"
          )
          .add(() => {
            const hl = document.querySelector(
              ".next-tree .title-line.highlight"
            );
            if (hl) hl.classList.add("legible");
          });

        startNextWaveAnimations();
      },
    });

    nextSection.addEventListener("mouseenter", () => {
      gsap.fromTo(
        ".next-tree .title-line .char",
        { yPercent: 0 },
        {
          yPercent: gsap.utils.wrap([-6, 6]),
          duration: 0.4,
          ease: "sine.inOut",
          stagger: 0.006,
          yoyo: true,
          repeat: 1,
        }
      );
    });
  }

  function startNextWaveAnimations() {
    function nextWaveLine(
      sel,
      delay,
      amp = 8,
      rot = 4,
      dMin = 1.2,
      dMax = 1.8,
      repMin = 0.1,
      repMax = 0.4
    ) {
      const chars = document.querySelectorAll(sel);
      if (chars.length === 0) return;

      gsap.to(chars, {
        y: () => gsap.utils.random(-amp, amp),
        rotation: () => gsap.utils.random(-rot, rot),
        duration: () => gsap.utils.random(dMin, dMax), // per-char varied
        ease: "sine.inOut",
        stagger: { each: 0.1, repeat: -1, yoyo: true },
        delay: delay,
        repeat: -1,
        yoyo: true,
        repeatDelay: () => gsap.utils.random(repMin, repMax), // less idle time
      });
    }

    nextWaveLine(
      ".next-tree .title-line:nth-child(1) .char",
      0.0,
      12,
      6,
      0.8,
      1.2,
      0.05,
      0.2
    );
    nextWaveLine(
      ".next-tree .title-line:nth-child(2).highlight .char",
      0.15,
      8,
      4,
      1.0,
      1.6,
      0.08,
      0.3
    );

    const pulse = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
    pulse
      .to(".next-tree .title-line.highlight", {
        scale: 1.05,
        letterSpacing: "0.02em",
        duration: 0.4,
        ease: "power2.inOut",
        transformOrigin: "50% 70%",
      })
      .to(
        ".next-tree .title-line.highlight",
        {
          scale: 1,
          letterSpacing: "0em",
          duration: 0.45,
          ease: "power2.out",
        },
        "+=0.2"
      );

    const pulseLine1 = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
    pulseLine1
      .to(".next-tree .title-line:nth-child(1)", {
        scale: 1.025,
        duration: 0.3,
        ease: "power2.inOut",
        transformOrigin: "50% 70%",
      })
      .to(
        ".next-tree .title-line:nth-child(1)",
        {
          scale: 1,
          duration: 0.35,
          ease: "power2.out",
        },
        "+=0.15"
      );
  }

  initNextTitleAnimation();

  initScrollCardsAnimations();

  function initScrollCardsAnimations() {
    const scrollCards = document.querySelectorAll(".scroll-card");

    scrollCards.forEach((card, index) => {
      const title = card.querySelector(".scroll-title");
      const subtitle = card.querySelector(".scroll-subtitle");
      const hint = card.querySelector(".scroll-hint");
      const buttons = card.querySelector(".scroll-buttons");

      if (title && !title.querySelector(".char")) {
        const text = title.textContent;
        title.innerHTML = text
          .split("")
          .map((char) =>
            char === " "
              ? '<span class="char">&nbsp;</span>'
              : `<span class="char">${char}</span>`
          )
          .join("");
      }

      gsap.set([title, subtitle, hint, buttons], { opacity: 0, y: 50 });
      if (title)
        gsap.set(title.querySelectorAll(".char"), {
          opacity: 0,
          y: 30,
          rotationX: 45,
        });

      ScrollTrigger.create({
        trigger: card,
        start: "top 95%",
        end: "bottom 5%",
        invalidateOnRefresh: true,
        onToggle: (self) => {
          if (self.isActive) {
            animateCardIn(card, title, subtitle, hint, buttons);
            card.dataset.revealed = "1";
          } else {
            if (!card.dataset.revealed) {
              animateCardOut(card, title, subtitle, hint, buttons);
            }
          }
        },
      });

      if (title) {
        gsap.to(title.querySelectorAll(".char"), {
          y: () => gsap.utils.random(-8, 8),
          rotation: () => gsap.utils.random(-3, 3),
          duration: () => gsap.utils.random(2, 4),
          ease: "sine.inOut",
          stagger: { each: 0.1, repeat: -1, yoyo: true },
          repeat: -1,
          yoyo: true,
          delay: index * 0.2,
        });
      }

      if (subtitle) {
        gsap.to(subtitle, {
          scale: 1.01,
          y: -0.5,
          duration: 4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          transformOrigin: "50% 65%",
          delay: index * 0.3,
        });
      }
    });

    function isInViewport(el) {
      const r = el.getBoundingClientRect();
      const topGate = window.innerHeight * 0.9;
      const bottomGate = window.innerHeight * 0.1;
      return r.top < topGate && r.bottom > bottomGate;
    }

    function revealVisibleCards() {
      scrollCards.forEach((card) => {
        if (isInViewport(card)) {
          const title = card.querySelector(".scroll-title");
          const subtitle = card.querySelector(".scroll-subtitle");
          const hint = card.querySelector(".scroll-hint");
          const buttons = card.querySelector(".scroll-buttons");
          animateCardIn(card, title, subtitle, hint, buttons);
        }
      });
    }

    revealVisibleCards();
    ScrollTrigger.addEventListener("refresh", revealVisibleCards);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const card = entry.target;
            if (!card.dataset.revealed) {
              const title = card.querySelector(".scroll-title");
              const subtitle = card.querySelector(".scroll-subtitle");
              const hint = card.querySelector(".scroll-hint");
              const buttons = card.querySelector(".scroll-buttons");
              animateCardIn(card, title, subtitle, hint, buttons);
              card.dataset.revealed = "1";
            }
            io.unobserve(card);
          }
        });
      },
      { threshold: [0, 0.3, 0.6, 1] }
    );

    scrollCards.forEach((card) => io.observe(card));

    setTimeout(() => ScrollTrigger.refresh(), 0);
  }

  function animateCardIn(card, title, subtitle, hint, buttons) {
    const tl = gsap.timeline();

    if (title) {
      tl.to(title, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
      });
      tl.to(
        title.querySelectorAll(".char"),
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
          stagger: { each: 0.03, from: "center" },
        },
        "<"
      );
    }

    if (subtitle) {
      tl.to(
        subtitle,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3"
      );
    }

    if (hint) {
      tl.to(
        hint,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.2"
      );
    }

    if (buttons) {
      tl.to(
        buttons,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.1"
      );
    }
  }

  function animateCardOut(card, title, subtitle, hint, buttons) {
    gsap.to([title, subtitle, hint, buttons], {
      opacity: 0.3,
      duration: 0.3,
      ease: "power2.in",
    });
  }

  /* ===== SCROLL CARDS ANIMATIONS ===== */
  /* Scroll-triggered card animations with character effects and continuous motion */

  const hero = document.querySelector(".hero");
  const copy = document.querySelector(".hero-copy");
  if (hero && copy) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(copy, {
        x: cx * 8,
        y: cy * 6,
        duration: 0.4,
        ease: "power2.out",
      });
    });
    /* ===== FOLD MARQUEE ANIMATIONS ===== */
    /* Scroll-controlled marquee text with dynamic positioning and tilt effects */
    if (document.querySelector("#fold-marquee")) {
      const wrap = document.querySelector("#fold-marquee");
      const items = gsap.utils.toArray(".fold-marquee .marquee");

      function setupMarquee() {
        items.forEach((el) => {
          const prev = el._marqTween;
          if (prev) {
            prev.scrollTrigger && prev.scrollTrigger.kill();
            prev.kill();
            el._marqTween = null;
          }
        });
        const biasFractions = [
          -0.2, 0.2, -0.3, 0.3, -0.15, 0.15, -0.25, 0.25, -0.3, 0.3, -0.4, 0.4,
          -0.25, 0.25, -0.35, 0.35,
        ];
        items.forEach((el, idx) => {
          const track = el.querySelector(".track");
          if (!track) return;
          const focus = track.querySelector(".-focus");
          const w = wrap.clientWidth || window.innerWidth;
          const fc = focus
            ? focus.offsetLeft + focus.offsetWidth / 2
            : track.scrollWidth / 2;
          const pad = 40;
          const fw = focus ? focus.offsetWidth : Math.min(240, w * 0.4);
          const minCenter = pad + fw / 2;
          const maxCenter = w - pad - fw / 2;
          const frac = biasFractions[idx % biasFractions.length] || 0;
          const rawCenter = w / 2 + frac * (w * 0.6);
          const desiredCenter = Math.max(
            minCenter,
            Math.min(maxCenter, rawCenter)
          );
          let base = desiredCenter - fc;
          const maxLeftRoom = desiredCenter - minCenter;
          const maxRightRoom = maxCenter - desiredCenter;
          const swayMax = Math.min(260, maxLeftRoom, maxRightRoom);
          const sway = Math.max(120, swayMax);
          const even = idx % 2 === 0;
          const fromX = even ? base - sway : base + sway;
          const toX = even ? base + sway : base - sway;
          gsap.set(track, { x: fromX });
          const quickX = gsap.quickTo(track, "x", {
            duration: 0.2,
            ease: "none",
          });
          const stX = ScrollTrigger.create({
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const eased = Math.pow(p, 0.7);
              const x = gsap.utils.mapRange(0, 1, fromX, toX, eased);
              quickX(x);
            },
            onRefresh: (self) => {
              const p = (self && self.progress) || 0;
              const eased = Math.pow(p, 0.7);
              const x = gsap.utils.mapRange(0, 1, fromX, toX, eased);
              gsap.set(track, { x });
            },
          });
          el._marqTween = stX;

          const maxDeg = 24;
          const zonePx = () => 300;

          const setRot = gsap.quickSetter(track, "rotationX", "deg");
          const setOrigin = gsap.quickSetter(track, "transformOrigin");
          const updateTilt = () => {
            const r = el.getBoundingClientRect();
            const H = window.innerHeight;
            const z = zonePx();
            const topP = Math.max(0, Math.min(1, (z - r.top) / z));
            const botP = Math.max(0, Math.min(1, (r.bottom - (H - z)) / z));
            const tilt = (topP - botP) * maxDeg;
            const origin = topP > botP ? "50% 0%" : "50% 100%";
            setOrigin(origin);
            setRot(tilt);
          };

          const st = ScrollTrigger.create({
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            onUpdate: updateTilt,
            onRefresh: updateTilt,
          });
          el._skewTrigger = st;
          updateTilt();
        });
      }

      function initAfterFonts() {
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => {
            setupMarquee();
            ScrollTrigger.refresh();
          });
        } else {
          setupMarquee();
          ScrollTrigger.refresh();
        }
      }

      initAfterFonts();
      ScrollTrigger.addEventListener("refresh", setupMarquee);
      window.addEventListener("resize", () => ScrollTrigger.refresh());
    }
    copy.addEventListener("mouseenter", () => {
      gsap.fromTo(
        ".hero .title-line .char",
        { yPercent: 0 },
        {
          yPercent: gsap.utils.wrap([-6, 6]),
          duration: 0.4,
          ease: "sine.inOut",
          stagger: 0.006,
          yoyo: true,
          repeat: 1,
        }
      );
    });
  }
});

/* ===== TREE SECTION SCROLL ANIMATION ===== */
/* Scroll-triggered tree path drawing with sparkle motion */
function initTreeSection() {
  if (!(window.gsap && window.ScrollTrigger && window.MotionPathPlugin)) return;
  gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

  const treeSection = document.querySelector("#next.next-tree");
  const path = document.querySelector("#treePath");
  const bottomPath = document.querySelector("#treeBottomPath");
  const sparkle = document.querySelector(".next-tree .sparkle");
  const star = document.querySelector("#treeStar");
  if (!treeSection || !path || !sparkle) return;

    const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  gsap.set(sparkle, { transformOrigin: "50% 50%" });
  if (star)
    gsap.set(star, { transformOrigin: "50% 50%", scale: 0.4, opacity: 0 });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: treeSection,
        start: "top 90%",
        end: "top 35%",
        scrub: true,
      },
    })
    .to(path, { strokeDashoffset: 0, ease: "none" }, 0)
    .to(
      sparkle,
      {
        ease: "none",
        motionPath: {
          path: "#treePath",
          align: "#treePath",
          autoRotate: true,
          alignOrigin: [0.5, 0.5],
        },
      },
      0
    )
    .to(
      sparkle,
      {
        ease: "none",
        motionPath: {
          path: "#treeBottomPath",
          align: "#treeBottomPath",
          autoRotate: true,
          alignOrigin: [0.5, 0.5],
        },
      },
      0.7
    )
    .to(
      star,
      { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2)" },
      0.85
    );

  gsap.to(sparkle, {
    opacity: 0.7,
    duration: 0.08,
    repeat: -1,
    yoyo: true,
    ease: "none",
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTreeSection);
} else {
  initTreeSection();
}

/* ===== WEBGL SHADER UTILITIES ===== */
/* WebGL shader initialization and rendering for gooey chocolate effects */
function initShader() {
  const vsSource = document.getElementById("vertShader").innerHTML;
  const fsSource = document.getElementById("fragShader").innerHTML;
  const gl = canvasEl.getContext("webgl") || canvasEl.getContext("experimental-webgl");
  if (!gl) return null;

  function createShader(gl, sourceCode, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = createShader(gl, vsSource, gl.VERTEX_SHADER);
  const fragmentShader = createShader(gl, fsSource, gl.FRAGMENT_SHADER);

  function createShaderProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Shader link error:", gl.getProgramInfoLog(program));
      return null;
    }
    return program;
  }

  const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);
  uniforms = getUniforms(shaderProgram);

  function getUniforms(program) {
    let uniforms = [];
    let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      let uniformName = gl.getActiveUniform(program, i).name;
      uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
    }
    return uniforms;
  }

  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.useProgram(shaderProgram);
  const positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1f(uniforms.u_col_width, params.colWidth);
  gl.uniform1f(uniforms.u_speed, params.speed);
  gl.uniform1f(uniforms.u_scale, params.scale);
  gl.uniform1f(uniforms.u_seed, params.seed);
  gl.uniform3f(
    uniforms.u_color,
    params.color[0],
    params.color[1],
    params.color[2]
  );

  return gl;
}

function render() {
  if (!gl) return;
  const now = performance.now();
  const dtMs = Math.min(50, Math.max(0, now - __lastFrameTime));
  __shaderTimeMs += dtMs;
  __lastFrameTime = now;
  gl.uniform1f(uniforms.u_time, __shaderTimeMs);
  gl.uniform1f(uniforms.u_scroll_progr, params.scrollProgress);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(render);
}

function resizeCanvas() {
  if (!gl) return;
  canvasEl.width = window.innerWidth * devicePixelRatio;
  canvasEl.height = window.innerHeight * devicePixelRatio;
  gl.viewport(0, 0, canvasEl.width, canvasEl.height);
  gl.uniform2f(uniforms.u_resolution, canvasEl.width, canvasEl.height);
}
