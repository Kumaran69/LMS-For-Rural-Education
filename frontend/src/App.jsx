import { useState, useEffect } from "react";

// ─── STATIC DATASETS ──────────────────────────────────────────────────────────

const SUBJECTS = [
  { id: "math",    name: "Mathematics", icon: "📐", color: "#1D9E75", bg: "#E1F5EE", total: 5 },
  { id: "science", name: "Science",     icon: "🔬", color: "#185FA5", bg: "#E6F1FB", total: 5 },
  { id: "odia",    name: "Odia",        icon: "📖", color: "#993C1D", bg: "#FAECE7", total: 5 },
  { id: "english", name: "English",     icon: "🗣️", color: "#854F0B", bg: "#FAEEDA", total: 5 },
  { id: "social",  name: "Social",      icon: "🌍", color: "#3C3489", bg: "#EEEDFE", total: 5 },
];

const QUESTS = {
  math: [
    { id: "m1", title: "Counting Stars", desc: "Numbers 1–100 and place values", xp: 50 },
    { id: "m2", title: "Addition Kingdom", desc: "Adding numbers up to 1000", xp: 75 },
    { id: "m3", title: "Subtraction Battle", desc: "Subtract and find the difference", xp: 75 },
    { id: "m4", title: "Multiplication Maze", desc: "Tables from 2 to 12", xp: 100 },
    { id: "m5", title: "Division Dragon", desc: "Divide and conquer", xp: 120 },
  ],
  science: [
    { id: "sc1", title: "Plants Around Us", desc: "Parts of a plant and photosynthesis", xp: 50 },
    { id: "sc2", title: "Animal Kingdom", desc: "Types and habitats of animals", xp: 75 },
    { id: "sc3", title: "Water Cycle", desc: "Evaporation, condensation, rain", xp: 75 },
    { id: "sc4", title: "Force & Motion", desc: "Push, pull, gravity", xp: 100 },
    { id: "sc5", title: "Light & Shadow", desc: "How light travels", xp: 120 },
  ],
  odia: [
    { id: "o1", title: "ବର୍ଣ୍ଣମାଳା", desc: "Odia alphabet and vowels", xp: 50 },
    { id: "o2", title: "ସଂଖ୍ୟା", desc: "Numbers in Odia", xp: 75 },
    { id: "o3", title: "ଗପ ସ୍ୱ", desc: "Short stories in Odia", xp: 75 },
    { id: "o4", title: "କବିତା", desc: "Poems and rhythm", xp: 100 },
    { id: "o5", title: "ରଚନା", desc: "Essay writing basics", xp: 120 },
  ],
  english: [
    { id: "e1", title: "ABC Adventure", desc: "Alphabet and phonics", xp: 50 },
    { id: "e2", title: "Word Village", desc: "Common words and spelling", xp: 75 },
    { id: "e3", title: "Sentence Builder", desc: "Simple sentences", xp: 75 },
    { id: "e4", title: "Story Time", desc: "Reading short stories", xp: 100 },
    { id: "e5", title: "Grammar Gate", desc: "Nouns, verbs, adjectives", xp: 120 },
  ],
  social: [
    { id: "ss1", title: "My Village", desc: "Community and local governance", xp: 50 },
    { id: "ss2", title: "Odisha History", desc: "Kings and culture of Odisha", xp: 75 },
    { id: "ss3", title: "India Map Quest", desc: "States, capitals, rivers", xp: 75 },
    { id: "ss4", title: "Farming & Food", desc: "Agriculture in Odisha", xp: 100 },
    { id: "ss5", title: "Festivals of Odisha", desc: "Rath Yatra, Durga Puja and more", xp: 120 },
  ],
};

const QUIZ_QUESTIONS = [
  { q: "What is 7 × 8?", opts: ["54", "56", "64", "48"], ans: 1 },
  { q: "What is 144 ÷ 12?", opts: ["11", "13", "12", "14"], ans: 2 },
  { q: "Which is the largest 3-digit number?", opts: ["899", "999", "909", "990"], ans: 1 },
  { q: "What is 1000 − 367?", opts: ["633", "643", "623", "663"], ans: 0 },
  { q: "How many sides does a hexagon have?", opts: ["5", "7", "8", "6"], ans: 3 },
];

const BADGES = [
  { id: "b1", name: "First Step",     icon: "👣", desc: "Complete your first quest" },
  { id: "b2", name: "Math Warrior",   icon: "⚔️",  desc: "Finish 3 math quests" },
  { id: "b3", name: "Streak Keeper",  icon: "🔥", desc: "7-day learning streak" },
  { id: "b4", name: "Quiz Champion",  icon: "🏆", desc: "Score 100% in a quiz" },
  { id: "b5", name: "Odia Scholar",   icon: "📜", desc: "Complete all Odia quests" },
  { id: "b6", name: "Village Hero",   icon: "🌟", desc: "Reach top 3 in village rank" },
  { id: "b7", name: "Science Star",   icon: "🔬", desc: "Finish all Science quests" },
  { id: "b8", name: "Grand Master",   icon: "👑", desc: "Complete all 25 quests" },
];

const SCIENCE_CONCEPTS = [
  { term: "Photosynthesis", def: "Plants making food from sunlight" },
  { term: "Water Cycle", def: "Continuous movement of water on Earth" },
  { term: "Gravity", def: "Force drawing objects toward Earth" },
  { term: "Evaporation", def: "Liquid water changing into water vapor" },
];

const SOCIAL_CONCEPTS = [
  { term: "Gram Panchayat", def: "Village level local government" },
  { term: "Rath Yatra", def: "Odisha chariot festival in Puri" },
  { term: "Bhubaneswar", def: "Capital city of Odisha state" },
  { term: "Agriculture", def: "Primary source of food and farming" },
];

const ENGLISH_WORDS = [
  { jumble: "HOSPHTOYNESIS", word: "PHOTOSYNTHESIS", hint: "Process by which green plants make food from carbon dioxide and water" },
  { jumble: "GRAVITAYTI", word: "GRAVITY", hint: "The force that pulls objects toward each other" },
  { jumble: "GEONRETNVMN", word: "GOVERNMENT", hint: "The group of people with the authority to govern a country or state" },
];

const ODIA_WORDS = [
  { jumble: "ବର୍ଣ୍ଣମାଳା", word: "ବର୍ଣ୍ଣମାଳା", hint: "Odia alphabet vowels and consonants" },
  { jumble: "ଜଗନ୍ନାଥ", word: "ଜଗନ୍ନାଥ", hint: "Lord of the universe in Odisha culture" },
  { jumble: "ଭୁବନେଶ୍ୱର", word: "ଭୁବନେଶ୍ୱର", hint: "The capital city of Odisha" }
];

// ─── API CONNECTIVITY ─────────────────────────────────────────────────────────

const API_URL = "http://localhost:5000/api";

const apiCall = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
  const config = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
  const response = await fetch(`${API_URL}${endpoint}`, config);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Request failed");
  }
  return response.json();
};

// ─── AUDIO SYNTHESIZER (Web Audio API) ────────────────────────────────────────

const soundSynth = {
  playTone(freq, type, duration) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (err) {
      console.warn("Audio Context blocked or failed:", err);
    }
  },
  playSuccess() {
    this.playTone(523.25, "sine", 0.15); // C5
    setTimeout(() => this.playTone(659.25, "sine", 0.2), 120); // E5
  },
  playError() {
    this.playTone(180, "sawtooth", 0.3);
  },
  playLevelUp() {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major Arpeggio Fanfare
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, "triangle", 0.3);
      }, idx * 90);
    });
  }
};

// ─── STYLES & GLOWING THEMES ──────────────────────────────────────────────────

const G = {
  orange: "#E85D20",
  orangeLight: "#FFF4EE",
  green: "#1D9E75",
  greenLight: "#E1F5EE",
  purple: "#534AB7",
  purpleLight: "#EEEDFE",
  blue: "#185FA5",
  blueLight: "#E6F1FB",
  gray: "#5F5E5A",
  grayLight: "#F1EFE8",
  grayBorder: "#D3D1C7",
  text: "#2C2C2A",
  textSub: "#5F5E5A",
  white: "#FFFFFF",
  bg: "#FAFAF8",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: ${G.bg}; color: ${G.text}; }
  button { font-family: 'Nunito', sans-serif; cursor: pointer; border: none; background: none; }
  input, select { font-family: 'Nunito', sans-serif; }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  .nav { background: ${G.white}; border-bottom: 1.5px solid ${G.grayBorder}; padding: 0 20px;
    display: flex; align-items: center; justify-content: space-between; height: 56px; position: sticky; top: 0; z-index: 100; }
  .nav-logo { display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 800; color: ${G.orange}; }
  .nav-logo span { color: ${G.text}; }
  .nav-tabs { display: flex; gap: 4px; }
  .nav-tab { padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600;
    color: ${G.textSub}; transition: all .2s; }
  .nav-tab:hover { background: ${G.grayLight}; }
  .nav-tab.active { background: ${G.orangeLight}; color: ${G.orange}; }
  .nav-right { display: flex; align-items: center; gap: 10px; }
  .avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 12px; font-weight: 700; color: ${G.white};
    background: ${G.orange}; cursor: pointer; flex-shrink: 0; }
  .xp-pill { background: ${G.orangeLight}; color: ${G.orange}; font-size: 12px; font-weight: 700;
    padding: 4px 10px; border-radius: 20px; }
  .streak-pill { background: #FFF4EE; color: #E85D20; font-size: 12px; font-weight: 700;
    padding: 4px 10px; border-radius: 20px; }

  /* MAIN */
  .main { flex: 1; padding: 24px 20px; max-width: 900px; margin: 0 auto; width: 100%; }

  /* CARDS (GLASSMORPHISM EFFECT) */
  .card { 
    background: rgba(255, 255, 255, 0.85); 
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.5); 
    border-radius: 16px; 
    padding: 24px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .card-sm { 
    background: rgba(255, 255, 255, 0.9); 
    border: 1px solid ${G.grayBorder}; 
    border-radius: 14px; 
    padding: 16px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.02);
  }

  /* LOGIN */
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #FFF4EE 0%, #E1F5EE 100%); padding: 20px; }
  .login-box { background: ${G.white}; border-radius: 20px; padding: 40px 32px; width: 100%;
    max-width: 420px; box-shadow: 0 4px 40px rgba(0,0,0,.08); box-sizing: border-box; }
  .login-logo { font-size: 32px; font-weight: 800; color: ${G.orange}; margin-bottom: 4px; }
  .login-sub  { color: ${G.textSub}; font-size: 14px; margin-bottom: 32px; }
  .login-label { display: block; font-size: 13px; font-weight: 700; color: ${G.textSub};
    margin-bottom: 6px; text-transform: uppercase; letter-spacing: .5px; }
  .login-select { width: 100%; padding: 12px 16px; border: 1.5px solid ${G.grayBorder};
    border-radius: 10px; font-size: 15px; font-family: 'Nunito', sans-serif;
    color: ${G.text}; background: ${G.white}; appearance: none; margin-bottom: 20px; outline: none; box-sizing: border-box; }
  .login-select:focus { border-color: ${G.orange}; }
  
  .google-btn-container { width: 100%; display: flex; justify-content: center; margin-bottom: 20px; }
  .demo-input { width: 100%; padding: 12px 16px; border: 1.5px solid ${G.grayBorder}; border-radius: 10px; font-size: 15px; margin-bottom: 16px; outline: none; box-sizing: border-box; }
  .demo-input:focus { border-color: ${G.orange}; }

  .btn-primary { 
    background: linear-gradient(135deg, ${G.orange} 0%, #F2A623 100%); 
    color: ${G.white}; 
    padding: 13px 28px; 
    border-radius: 12px;
    font-size: 16px; 
    font-weight: 700; 
    width: 100%; 
    box-shadow: 0 4px 14px rgba(232,93,32,0.3);
    transition: transform 0.2s, opacity 0.2s; 
  }
  .btn-primary:hover { transform: translateY(-1px); opacity: 0.95; }
  .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
  .btn-sm { padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; }
  .btn-outline { border: 1.5px solid ${G.grayBorder}; color: ${G.textSub}; border-radius: 8px;
    padding: 7px 14px; font-size: 13px; font-weight: 600; transition: all .2s; }
  .btn-outline:hover { border-color: ${G.orange}; color: ${G.orange}; }

  /* DASHBOARD */
  .dash-hero { 
    background: linear-gradient(135deg, ${G.orange} 0%, #F2A623 50%, ${G.purple} 100%);
    border-radius: 18px; 
    padding: 28px; 
    color: ${G.white}; 
    margin-bottom: 20px; 
    position: relative; 
    overflow: hidden; 
    box-shadow: 0 8px 24px rgba(232,93,32,0.15);
  }
  .dash-hero::after { content: '🎮'; position: absolute; right: 20px; top: 50%;
    transform: translateY(-50%); font-size: 64px; opacity: .25; }
  .dash-hero h2 { font-size: 24px; font-weight: 800; margin-bottom: 6px; }
  .dash-hero p  { font-size: 14px; opacity: .95; margin-bottom: 18px; }
  .hero-stats { display: flex; gap: 16px; flex-wrap: wrap; }
  .hero-stat { background: rgba(255,255,255,.2); backdrop-filter: blur(8px); border-radius: 10px; padding: 10px 16px; text-align: center; flex: 1; min-width: 80px; }
  .hero-stat-num { font-size: 20px; font-weight: 800; }
  .hero-stat-lbl { font-size: 11px; opacity: .85; }

  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  @media(max-width: 600px) { .grid2 { grid-template-columns: 1fr; } .grid3 { grid-template-columns: 1fr 1fr; } }

  .section-title { font-size: 17px; font-weight: 800; color: ${G.text}; margin-bottom: 14px; }

  /* SUBJECT CARDS */
  .subj-card { border-radius: 14px; padding: 18px; cursor: pointer; transition: transform .2s, box-shadow .2s;
    border: 1.5px solid transparent; }
  .subj-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,.08); }
  .subj-card.active { border-color: ${G.orange}; }
  .subj-icon { font-size: 32px; margin-bottom: 8px; }
  .subj-name { font-size: 14px; font-weight: 800; margin-bottom: 4px; }
  .subj-prog-bar { height: 6px; border-radius: 3px; background: rgba(0,0,0,.15); margin-top: 8px; }
  .subj-prog-fill { height: 6px; border-radius: 3px; }

  /* QUEST MAP & GLOWINGS */
  .quest-list { display: flex; flex-direction: column; gap: 12px; }
  .quest-item { display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: 12px;
    border: 1.5px solid ${G.grayBorder}; background: ${G.white}; cursor: pointer; transition: all .2s; }
  .quest-item:hover:not(.locked) { border-color: ${G.orange}; box-shadow: 0 4px 16px rgba(232,93,32,.15); }
  .quest-item.locked { opacity: .5; cursor: not-allowed; }
  .quest-item.done { background: ${G.greenLight}; border-color: ${G.green}; }
  
  @keyframes pulseGlow {
    0% { box-shadow: 0 0 0 0 rgba(232, 93, 32, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(232, 93, 32, 0); }
    100% { box-shadow: 0 0 0 0 rgba(232, 93, 32, 0); }
  }
  .quest-item.current { animation: pulseGlow 2s infinite; border-color: ${G.orange}; }
  
  .quest-circle { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 20px; flex-shrink: 0; }
  .quest-circle.done    { background: ${G.green}; color: ${G.white}; }
  .quest-circle.current { background: ${G.orange}; color: ${G.white}; }
  .quest-circle.locked  { background: ${G.grayBorder}; color: ${G.white}; }
  .quest-info { flex: 1; }
  .quest-title { font-size: 15px; font-weight: 700; }
  .quest-desc  { font-size: 13px; color: ${G.textSub}; margin-top: 2px; }
  .xp-badge { background: ${G.orangeLight}; color: ${G.orange}; font-size: 12px; font-weight: 700;
    padding: 4px 10px; border-radius: 20px; white-space: nowrap; }

  /* LESSON */
  .lesson-wrap { max-width: 680px; margin: 0 auto; }
  .lesson-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .lesson-video { background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 14px;
    height: 220px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; position: relative; }
  .play-btn { width: 64px; height: 64px; background: rgba(255,255,255,.9); border-radius: 50%;
    display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer;
    transition: transform .2s; }
  .play-btn:hover { transform: scale(1.1); }
  .lesson-notes { background: ${G.grayLight}; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
  .lesson-notes h3 { font-size: 16px; font-weight: 800; margin-bottom: 12px; }
  .lesson-notes ul { padding-left: 20px; }
  .lesson-notes li { font-size: 14px; line-height: 1.8; color: ${G.textSub}; }

  /* GAMES STYLING */
  /* Confetti Archer Animation */
  @keyframes shootArrow {
    0% { transform: translateX(200px) scale(0.5); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(0px) scale(1.2); opacity: 0; }
  }
  
  .timer-ring { 
    width: 80px; 
    height: 80px; 
    border-radius: 50%; 
    border: 6px solid ${G.grayBorder}; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 24px; 
    font-weight: 800; 
    margin: 0 auto 20px; 
  }
  .timer-ring.warning { border-color: #E24B4A; color: #E24B4A; animation: heartbeat 1s infinite; }
  
  @keyframes heartbeat {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  /* Memory Match Cards */
  .memory-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
  .memory-card { height: 90px; perspective: 1000px; cursor: pointer; }
  .memory-card-inner { position: relative; width: 100%; height: 100%; text-align: center; transition: transform 0.4s; transform-style: preserve-3d; border-radius: 12px; border: 1.5px solid ${G.grayBorder}; }
  .memory-card.flipped .memory-card-inner { transform: rotateY(180deg); }
  .memory-card-front, .memory-card-back { position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; display: flex; align-items: center; justify-content: center; border-radius: 10px; padding: 6px; box-sizing: border-box; }
  .memory-card-front { background: linear-gradient(135deg, ${G.purple} 0%, ${G.blue} 100%); color: white; font-size: 22px; font-weight: 800; }
  .memory-card-back { background: ${G.white}; transform: rotateY(180deg); font-size: 11px; font-weight: 700; color: ${G.text}; overflow: hidden; }
  .memory-card.matched .memory-card-inner { border-color: ${G.green}; background: ${G.greenLight}; }

  /* Anagram block letters */
  .letter-grid { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin: 20px 0; }
  .letter-block { 
    width: 44px; 
    height: 44px; 
    background: ${G.white}; 
    border: 1.5px solid ${G.grayBorder}; 
    border-radius: 8px; 
    font-size: 18px; 
    font-weight: 800; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    cursor: pointer; 
    user-select: none; 
    transition: transform 0.1s, border-color 0.1s; 
  }
  .letter-block:hover { transform: translateY(-2px); border-color: ${G.orange}; }
  .letter-block.selected { opacity: 0.25; pointer-events: none; }

  /* QUIZ */
  .quiz-wrap { max-width: 600px; margin: 0 auto; }
  .quiz-progress { height: 8px; background: ${G.grayBorder}; border-radius: 4px; margin-bottom: 28px; }
  .quiz-progress-fill { height: 8px; background: ${G.orange}; border-radius: 4px; transition: width .4s; }
  .quiz-q { font-size: 20px; font-weight: 800; margin-bottom: 24px; line-height: 1.4; }
  .quiz-opts { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
  .quiz-opt { padding: 14px 18px; border: 2px solid ${G.grayBorder}; border-radius: 12px;
    font-size: 15px; font-weight: 600; color: ${G.text}; background: ${G.white};
    text-align: left; transition: all .2s; cursor: pointer; }
  .quiz-opt:hover:not(.selected):not(.correct):not(.wrong) { border-color: ${G.orange}; color: ${G.orange}; background: ${G.orangeLight}; }
  .quiz-opt.selected { border-color: ${G.orange}; background: ${G.orangeLight}; color: ${G.orange}; }
  .quiz-opt.correct  { border-color: ${G.green};  background: ${G.greenLight};  color: ${G.green}; }
  .quiz-opt.wrong    { border-color: #E24B4A; background: #FCEBEB; color: #E24B4A; }
  .quiz-result { text-align: center; padding: 40px 20px; }
  .quiz-score-ring { width: 120px; height: 120px; border-radius: 50%; background: ${G.orangeLight};
    display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
    font-size: 36px; font-weight: 800; color: ${G.orange}; }

  /* LEADERBOARD */
  .lb-row { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px;
    margin-bottom: 8px; border: 1.5px solid transparent; transition: all .15s; }
  .lb-row.me { background: ${G.orangeLight}; border-color: ${G.orange}; }
  .lb-row:not(.me) { background: ${G.white}; border-color: ${G.grayBorder}; }
  .lb-rank { width: 28px; font-size: 14px; font-weight: 800; text-align: center; flex-shrink: 0; }
  .lb-name { flex: 1; }
  .lb-name strong { font-size: 15px; font-weight: 700; display: block; }
  .lb-name span   { font-size: 12px; color: ${G.textSub}; }
  .lb-xp { font-size: 15px; font-weight: 700; color: ${G.orange}; }

  /* BADGES */
  .badge-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  @media(max-width: 500px) { .badge-grid { grid-template-columns: repeat(2, 1fr); } }
  .badge-item { text-align: center; padding: 16px 8px; border-radius: 12px;
    border: 1.5px solid ${G.grayBorder}; background: ${G.white}; }
  .badge-item.earned { border-color: ${G.orange}; background: ${G.orangeLight}; }
  .badge-item.locked-b { opacity: .4; }
  .badge-icon { font-size: 32px; margin-bottom: 6px; }
  .badge-name { font-size: 12px; font-weight: 700; }

  /* TEACHER */
  .student-row { display: flex; align-items: center; gap: 12px; padding: 14px 16px; 
    border-radius: 12px; background: ${G.white}; border: 1px solid ${G.grayBorder}; margin-bottom: 10px; }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .status-dot.active   { background: ${G.green}; }
  .status-dot.at-risk  { background: #EF9F27; }
  .status-dot.inactive { background: #E24B4A; }
  .status-badge { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 20px; }
  .status-badge.active   { background: ${G.greenLight}; color: ${G.green}; }
  .status-badge.at-risk  { background: #FAEEDA; color: #854F0B; }
  .status-badge.inactive { background: #FCEBEB; color: #A32D2D; }

  /* PARENT */
  .weekly-bar-wrap { display: flex; align-items: flex-end; gap: 8px; height: 100px; }
  .weekly-bar { flex: 1; border-radius: 4px 4px 0 0; background: ${G.orangeLight}; position: relative;
    transition: all .3s; cursor: default; }
  .weekly-bar.today { background: ${G.orange}; }
  .weekly-bar-lbl { font-size: 11px; text-align: center; color: ${G.textSub}; margin-top: 6px; }

  /* UTILS */
  .flex   { display: flex; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-8  { gap: 8px; }
  .gap-12 { gap: 12px; }
  .gap-16 { gap: 16px; }
  .mb-4   { margin-bottom: 4px; }
  .mb-8   { margin-bottom: 8px; }
  .mb-12  { margin-bottom: 12px; }
  .mb-16  { margin-bottom: 16px; }
  .mb-20  { margin-bottom: 20px; }
  .mb-24  { margin-bottom: 24px; }
  .text-sm { font-size: 13px; }
  .text-xs { font-size: 12px; }
  .text-muted { color: ${G.textSub}; }
  .font-bold { font-weight: 700; }
  .font-heavy { font-weight: 800; }
  .tag { background: ${G.grayLight}; color: ${G.textSub}; font-size: 11px; font-weight: 700;
    padding: 3px 8px; border-radius: 20px; display: inline-block; }
  .divider { height: 1px; background: ${G.grayBorder}; margin: 16px 0; }
  .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: ${G.text}; color: ${G.white}; padding: 12px 24px; border-radius: 12px;
    font-size: 14px; font-weight: 600; z-index: 999; animation: fadeInUp .3s ease; pointer-events: none; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

  .progress-bar-wrap { height: 10px; background: ${G.grayBorder}; border-radius: 5px; }
  .progress-bar-fill { height: 10px; background: ${G.orange}; border-radius: 5px; transition: width .4s; }
  .level-label { font-size: 11px; color: ${G.textSub}; }

  /* XP bar under nav */
  .xp-bar-global { height: 3px; background: ${G.grayBorder}; }
  .xp-bar-fill    { height: 3px; background: ${G.orange}; transition: width 1s; }

  /* RESPONSIVE DESIGN - MEDIA QUERIES FOR MOBILE & TABLETS */
  @media (max-width: 680px) {
    .nav-tabs {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: ${G.white};
      border-top: 1.5px solid ${G.grayBorder};
      display: flex;
      justify-content: space-around;
      height: 56px;
      align-items: center;
      z-index: 1000;
      gap: 0;
      padding: 0;
    }
    .nav-tab {
      flex: 1;
      text-align: center;
      border-radius: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 11px;
    }
    .nav-tab.active {
      background: transparent;
      color: ${G.orange};
    }
    .main {
      padding-bottom: 80px; /* Space for bottom nav */
    }
  }

  @media (max-width: 480px) {
    .nav { padding: 0 10px; }
    .nav-logo { font-size: 16px; gap: 4px; }
    .streak-pill, .xp-pill { font-size: 10px; padding: 3px 6px; }
    .btn-sm { padding: 6px 10px; font-size: 11px; }
    
    .dash-hero { padding: 18px; }
    .dash-hero h2 { font-size: 20px; }
    .dash-hero p { font-size: 12px; }
    .hero-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .hero-stat {
      min-width: 0;
      padding: 8px 10px;
    }
    .hero-stat-num { font-size: 16px; }

    .memory-grid { gap: 6px; }
    .memory-card { height: 75px; }
    .memory-card-back { font-size: 9px; padding: 4px; }
    
    .grid2 { grid-template-columns: 1fr; }
    .grid3 { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 400px) {
    .login-box { padding: 24px 16px; }
    .login-logo { font-size: 26px; }
    .login-sub { margin-bottom: 20px; }
    .grid3 { grid-template-columns: 1fr !important; }
    .weekly-bar-wrap { gap: 4px; }
  }

  @media (max-width: 360px) {
    .badge-grid { grid-template-columns: 1fr; }
    .hero-stats { grid-template-columns: 1fr; }
  }
`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Toast({ msg }) {
  if (!msg) return null;
  return <div className="toast">{msg}</div>;
}

function Avatar({ initials, src, size = 34, color = G.orange }) {
  if (src && src.startsWith("http")) {
    return (
      <img
        src={src}
        alt="avatar"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  );
}

function ConfettiCanvas({ active }) {
  useEffect(() => {
    if (!active) return;
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#E85D20", "#1D9E75", "#534AB7", "#185FA5", "#F2A623", "#E24B4A"];
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticles = false;

      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 15;

        if (p.y < canvas.height) {
          activeParticles = true;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      if (activeParticles) {
        animationId = requestAnimationFrame(draw);
      }
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      id="confetti-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    />
  );
}

// ─── LOGIN & ONBOARDING ─────────────────────────────────────────────────────────

function Login({ onLoginSuccess }) {
  const [demoEmail, setDemoEmail] = useState("");
  const [demoName, setDemoName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleGoogleCallback = async (response) => {
      try {
        const data = await apiCall("/auth/google", "POST", {
          credential: response.credential,
        });
        onLoginSuccess(data);
      } catch (err) {
        setError(err.message || "Google Authentication failed");
      }
    };

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id-here.apps.googleusercontent.com",
        callback: handleGoogleCallback,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "outline", size: "large", width: "100%", text: "signin_with" }
      );
    }
  }, [onLoginSuccess]);

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    if (!demoEmail.trim()) {
      setError("Please enter a demo email address.");
      return;
    }
    setError("");
    try {
      const name = demoName.trim() || "Demo User";
      const data = await apiCall("/auth/google", "POST", {
        isMock: true,
        email: demoEmail.toLowerCase().trim(),
        name,
      });
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message || "Demo login failed");
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="login-logo">🎮 VidyaQuest</div>
        <div className="login-sub">Gamified Learning for Odisha — Smart India Hackathon</div>

        {error && (
          <div
            style={{
              color: "#E24B4A",
              background: "#FCEBEB",
              padding: 10,
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <label className="login-label">Sign in with Google</label>
        <div id="google-signin-btn" className="google-btn-container" style={{ minHeight: 40 }}></div>

        <div className="divider" style={{ margin: "24px 0 16px" }} />

        <div>
          <div className="login-label" style={{ textAlign: "center", marginBottom: 12, fontSize: 11, letterSpacing: 1 }}>
            — DEMO / OFFLINE BYPASS —
          </div>
          <input
            type="email"
            placeholder="Demo Email (e.g. arjun@gmail.com)"
            className="demo-input"
            value={demoEmail}
            onChange={(e) => setDemoEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Demo Name (e.g. Arjun Sahu)"
            className="demo-input"
            value={demoName}
            onChange={(e) => setDemoName(e.target.value)}
          />
          <button className="btn-outline" style={{ width: "100%", padding: 12 }} onClick={handleDemoLogin}>
            Login with Demo Credentials →
          </button>
        </div>

        <div className="divider" />
        <div className="flex gap-8" style={{ justifyContent: "center", flexWrap: "wrap" }}>
          {["📶 Offline Mode", "🗣️ Odia + English", "🆓 Free Forever"].map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Onboarding({ user, onOnboardComplete }) {
  const [role, setRole] = useState("student");
  const [village, setVillage] = useState("");
  const [studentClass, setStudentClass] = useState("Class 6");
  const [childEmail, setChildEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!village.trim()) {
      setError("Please enter your village name.");
      return;
    }
    if (role === "parent" && !childEmail.trim()) {
      setError("Please enter your child's email address.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const updatedUser = await apiCall("/auth/onboard", "POST", {
        role,
        village: village.trim(),
        class: role === "student" ? studentClass : undefined,
        linkedStudentEmail: role === "parent" ? childEmail.trim().toLowerCase() : undefined,
      });
      onOnboardComplete(updatedUser);
    } catch (err) {
      setError(err.message || "Onboarding submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <form className="login-box" onSubmit={handleSubmit}>
        <div className="login-logo">🌱 Welcome, {user.name.split(" ")[0]}!</div>
        <div className="login-sub">Select your account settings to get started.</div>

        {error && (
          <div
            style={{
              color: "#E24B4A",
              background: "#FCEBEB",
              padding: 10,
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <label className="login-label">Register Me As</label>
        <select className="login-select" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student (Take Quests & Quizzes)</option>
          <option value="teacher">Teacher (Monitor Village Students)</option>
          <option value="parent">Parent (Track Child's Learning Logs)</option>
        </select>

        <label className="login-label">My Village / Block</label>
        <input
          type="text"
          placeholder="e.g. Kendrapara"
          className="demo-input"
          value={village}
          onChange={(e) => setVillage(e.target.value)}
          required
        />

        {role === "student" && (
          <>
            <label className="login-label">Class Year</label>
            <select
              className="login-select"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
            >
              {[
                "Class 1",
                "Class 2",
                "Class 3",
                "Class 4",
                "Class 5",
                "Class 6",
                "Class 7",
                "Class 8",
                "Class 9",
                "Class 10",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </>
        )}

        {role === "parent" && (
          <>
            <label className="login-label">Child's Email (Gmail / Demo email they log in with)</label>
            <input
              type="email"
              placeholder="e.g. child@gmail.com"
              className="demo-input"
              value={childEmail}
              onChange={(e) => setChildEmail(e.target.value)}
              required
            />
          </>
        )}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Start VidyaQuest →"}
        </button>
      </form>
    </div>
  );
}

// ─── STUDENT DASHBOARD ────────────────────────────────────────────────────────

function StudentDashboard({ user, setPage, setActiveSubject }) {
  const xpForLevel = 200;
  const xpInLevel = (user.xp || 0) % xpForLevel;

  const SUBJECTS_DYNAMIC = SUBJECTS.map((s) => {
    const subjectQuests = QUESTS[s.id] || [];
    const done = subjectQuests.filter((q) => user.completedQuests?.includes(q.id)).length;
    return { ...s, done, total: subjectQuests.length };
  });

  const earnedBadges = BADGES.filter((b) => user.badges?.includes(b.id));

  return (
    <div>
      {/* Hero */}
      <div className="dash-hero">
        <h2>Jai Jagannath, {user.name.split(" ")[0]}! 🙏</h2>
        <p>You are on a {user.streak || 0}-day streak. Keep up the great work!</p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">{user.xp || 0}</div>
            <div className="hero-stat-lbl">Total XP</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">Lv. {user.level || 1}</div>
            <div className="hero-stat-lbl">Level</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">{user.streak || 0}🔥</div>
            <div className="hero-stat-lbl">Streak</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">
              {user.completedQuests?.length || 0}/25
            </div>
            <div className="hero-stat-lbl">Quests</div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="card mb-20">
        <div className="flex justify-between mb-8">
          <div className="font-bold">Level {user.level || 1} → Level {(user.level || 1) + 1}</div>
          <div className="text-sm text-muted">{xpInLevel}/{xpForLevel} XP</div>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${(xpInLevel / xpForLevel) * 100}%` }} />
        </div>
      </div>

      {/* Mini Games High Scores */}
      {user.gameHighScores && (
        <div className="card mb-20">
          <div className="section-title" style={{ marginBottom: 12 }}>🎮 High Scores</div>
          <div className="grid3" style={{ gap: 10 }}>
            <div style={{ background: G.orangeLight, padding: 12, borderRadius: 10, textAlign: "center", border: `1px solid ${G.orange}40` }}>
              <div style={{ fontSize: 24 }}>🏹</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: G.orange, marginTop: 4 }}>Speed Math</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{user.gameHighScores.speedMath || 0} pts</div>
            </div>
            <div style={{ background: G.blueLight, padding: 12, borderRadius: 10, textAlign: "center", border: `1px solid ${G.blue}40` }}>
              <div style={{ fontSize: 24 }}>🧠</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: G.blue, marginTop: 4 }}>Concept Match</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{user.gameHighScores.conceptMatcher || 0} pts</div>
            </div>
            <div style={{ background: G.purpleLight, padding: 12, borderRadius: 10, textAlign: "center", border: `1px solid ${G.purple}40` }}>
              <div style={{ fontSize: 24 }}>🔠</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: G.purple, marginTop: 4 }}>Word Builder</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{user.gameHighScores.wordBuilder || 0} pts</div>
            </div>
          </div>
        </div>
      )}

      {/* Choose a Subject */}
      <div className="section-title">Choose a Subject</div>
      <div className="grid3 mb-24">
        {SUBJECTS_DYNAMIC.map((s) => (
          <div
            key={s.id}
            className="subj-card"
            style={{ background: s.bg }}
            onClick={() => {
              setActiveSubject(s.id);
              setPage("quests");
            }}
          >
            <div className="subj-icon">{s.icon}</div>
            <div className="subj-name" style={{ color: s.color }}>
              {s.name}
            </div>
            <div className="text-xs text-muted">
              {s.done}/{s.total} quests done
            </div>
            <div className="subj-prog-bar">
              <div
                className="subj-prog-fill"
                style={{ background: s.color, width: `${(s.done / s.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Badges Preview */}
      <div className="flex justify-between items-center mb-12">
        <div className="section-title" style={{ marginBottom: 0 }}>My Badges</div>
        <button className="btn-outline" onClick={() => setPage("badges")}>
          View all
        </button>
      </div>

      <div className="flex gap-12 mb-24" style={{ overflowX: "auto", paddingBottom: 4 }}>
        {earnedBadges.length === 0 ? (
          <div className="text-sm text-muted" style={{ padding: "8px 0" }}>
            No badges unlocked yet. Complete quests to earn badges!
          </div>
        ) : (
          earnedBadges.map((b) => (
            <div key={b.id} style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 36 }}>{b.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4, color: G.textSub }}>
                {b.name}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Navigation shortcuts */}
      <div className="grid2">
        <button className="card" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => setPage("leaderboard")}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🏆</div>
          <div className="font-heavy mb-4">State & Village Rankings</div>
          <div className="text-sm text-muted">See how you rank against students in your block</div>
        </button>
        <button
          className="card"
          style={{ textAlign: "left", cursor: "pointer" }}
          onClick={() => {
            setActiveSubject("math");
            setPage("quests");
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>▶️</div>
          <div className="font-heavy mb-4">Continue Learning</div>
          <div className="text-sm text-muted">Dive back into your Math lessons!</div>
        </button>
      </div>
    </div>
  );
}

// ─── QUEST MAP ─────────────────────────────────────────────────────────────────

function QuestMap({ subjectId, setPage, setActiveQuest, user }) {
  const subject = SUBJECTS.find((s) => s.id === subjectId) || SUBJECTS[0];
  const quests = QUESTS[subjectId] || QUESTS.math;

  const getQuestStatus = (q, index) => {
    if (user.completedQuests?.includes(q.id)) return "done";
    if (index === 0) return "current";
    const prevQuest = quests[index - 1];
    if (user.completedQuests?.includes(prevQuest.id)) return "current";
    return "locked";
  };

  const doneCount = quests.filter((q) => user.completedQuests?.includes(q.id)).length;

  return (
    <div className="lesson-wrap">
      <div className="lesson-header">
        <button className="btn-outline btn-sm" onClick={() => setPage("dashboard")}>
          ← Home
        </button>
        <div style={{ fontSize: 28, marginLeft: 12 }}>{subject.icon}</div>
        <div>
          <div className="font-heavy" style={{ fontSize: 18 }}>
            {subject.name} Quests
          </div>
          <div className="text-sm text-muted">
            {doneCount}/{quests.length} complete
          </div>
        </div>
      </div>

      <div className="quest-list" style={{ marginTop: 16 }}>
        {quests.map((q, i) => {
          const status = getQuestStatus(q, i);
          const done = status === "done";
          const locked = status === "locked";
          const icon = done ? "✅" : locked ? "🔒" : "▶️";

          return (
            <div
              key={q.id}
              className={`quest-item ${done ? "done" : ""} ${locked ? "locked" : ""} ${status === "current" ? "current" : ""}`}
              onClick={() => {
                if (!locked) {
                  setActiveQuest(q);
                  setPage("lesson");
                }
              }}
            >
              <div className={`quest-circle ${status}`}>{icon}</div>
              <div className="quest-info">
                <div className="quest-title">{q.title}</div>
                <div className="quest-desc">{q.desc}</div>
              </div>
              <div className="xp-badge">+{q.xp} XP</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── LESSON ────────────────────────────────────────────────────────────────────

function Lesson({ quest, setPage, showToast }) {
  const [playing, setPlaying] = useState(false);
  const [watched, setWatched] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
    setTimeout(() => {
      setPlaying(false);
      setWatched(true);
      showToast("Video lesson complete! Now play the interactive game.");
      soundSynth.playSuccess();
    }, 1800);
  };

  return (
    <div className="lesson-wrap">
      <div className="lesson-header">
        <button className="btn-outline btn-sm" onClick={() => setPage("quests")}>
          ← Back
        </button>
        <div className="font-heavy" style={{ fontSize: 17, marginLeft: 12 }}>
          {quest?.title || "Multiplication Maze"}
        </div>
      </div>

      {/* Video player mock */}
      <div className="lesson-video">
        <div style={{ position: "absolute", top: 12, left: 16, color: "rgba(255,255,255,.6)", fontSize: 12 }}>
          📹 {quest?.title || "Multiplication Maze"} — Video Lesson
        </div>
        {!playing ? (
          <div className="play-btn" onClick={handlePlay}>
            ▶
          </div>
        ) : (
          <div style={{ textAlign: "center", color: G.white }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>⏳</div>
            <div style={{ fontSize: 14 }}>Streaming lesson details…</div>
          </div>
        )}
        {watched && (
          <div style={{ position: "absolute", top: 12, right: 16 }}>
            <span
              style={{
                background: G.green,
                color: G.white,
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 20,
              }}
            >
              ✓ Watched
            </span>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 16,
            right: 16,
            height: 4,
            background: "rgba(255,255,255,.2)",
            borderRadius: 2,
          }}
        >
          {watched && <div style={{ height: 4, background: G.white, borderRadius: 2, width: "100%" }} />}
        </div>
      </div>

      {/* Notes */}
      <div className="lesson-notes mb-20">
        <h3>📝 Key Points</h3>
        <ul>
          <li>Learn step-by-step through solving example visual problems.</li>
          <li>Practice formulas, maps, or pronunciations daily.</li>
          <li>Review questions and notes before starting the quiz.</li>
          <li>Remember: failing a quiz helps you learn; you can try as many times as you like!</li>
        </ul>
      </div>

      {/* Practice examples */}
      <div className="card mb-20">
        <div className="font-heavy mb-12">Quick Reference Examples</div>
        <div className="grid2">
          {["Problem Set A", "Formula Guide", "Vocabulary List", "Quick Cheat Sheet"].map((ex) => (
            <div
              key={ex}
              style={{
                background: G.grayLight,
                borderRadius: 8,
                padding: "10px 14px",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              📖 {ex}
            </div>
          ))}
        </div>
      </div>

      <button className="btn-primary" onClick={() => setPage("game")} style={{ background: `linear-gradient(135deg, ${G.purple} 0%, ${G.blue} 100%)`, boxShadow: "0 4px 14px rgba(83,74,183,0.3)" }}>
        Play Interactive Game 🎮 (+Bonus XP)
      </button>
    </div>
  );
}

// ─── MINI GAMES ────────────────────────────────────────────────────────────────

function SpeedMathArcher({ onGameComplete }) {
  const [seconds, setSeconds] = useState(30);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(0);
  const [options, setOptions] = useState([]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [arrows, setArrows] = useState([]);

  const generateQuestion = () => {
    const op = Math.random() > 0.5 ? "×" : "+";
    let num1, num2, ans;

    if (op === "×") {
      num1 = Math.floor(Math.random() * 10) + 2;
      num2 = Math.floor(Math.random() * 10) + 2;
      ans = num1 * num2;
    } else {
      num1 = Math.floor(Math.random() * 80) + 10;
      num2 = Math.floor(Math.random() * 80) + 10;
      ans = num1 + num2;
    }

    setQuestion(`${num1} ${op} ${num2}`);
    setAnswer(ans);

    const opts = new Set([ans]);
    while (opts.size < 4) {
      const offset = Math.floor(Math.random() * 15) - 7;
      if (offset !== 0) {
        opts.add(Math.max(1, ans + offset));
      }
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    if (started && seconds > 0 && !finished) {
      const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
      return () => clearTimeout(timer);
    } else if (seconds === 0 && !finished) {
      handleFinish();
    }
  }, [started, seconds, finished]);

  const handleStart = () => {
    setStarted(true);
    generateQuestion();
    soundSynth.playTone(400, "sine", 0.1);
  };

  const handleOptionClick = (opt) => {
    if (finished) return;
    setAnsweredCount((c) => c + 1);

    if (opt === answer) {
      soundSynth.playSuccess();
      const newCombo = combo + 1;
      setCombo(newCombo);
      const points = 10 + Math.min(newCombo * 2, 20);
      setScore((s) => s + points);

      const arrowId = Date.now();
      setArrows((prev) => [...prev, { id: arrowId }]);
      setTimeout(() => setArrows((prev) => prev.filter((a) => a.id !== arrowId)), 600);

      generateQuestion();
    } else {
      soundSynth.playError();
      setCombo(0);
      generateQuestion();
    }
  };

  const handleFinish = () => {
    setFinished(true);
  };

  if (!started) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🎯</div>
        <h2 className="font-heavy mb-8">Speed Math Archer</h2>
        <p className="text-muted mb-20">Solve math equations rapidly in 30 seconds to score points. Speed builds your combo multiplier!</p>
        <button className="btn-primary" onClick={handleStart}>
          Start Archer Game 🏹
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🏆</div>
        <h2 className="font-heavy mb-4">Game Finished!</h2>
        <p className="text-muted mb-8">You completed {answeredCount} calculations</p>
        <div
          className="quiz-score-ring"
          style={{ width: 140, height: 140, fontSize: 28, background: G.orangeLight, color: G.orange }}
        >
          {score} Pts
        </div>
        <button
          className="btn-primary mt-20"
          style={{ width: "auto" }}
          onClick={() => onGameComplete("speedMath", score)}
        >
          Continue to Quiz →
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: 24, top: 24, fontSize: 32 }}>
        🎯
        {arrows.map((a) => (
          <span
            key={a.id}
            style={{
              position: "absolute",
              right: 20,
              top: 0,
              animation: "shootArrow 0.5s ease-out forwards",
            }}
          >
            🏹
          </span>
        ))}
      </div>

      <div className={`timer-ring ${seconds <= 10 ? "warning" : ""}`}>{seconds}s</div>

      <div style={{ fontSize: 13, color: G.textSub, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
        Combo Multiplier: x{1 + Math.floor(combo / 3)} 🔥
      </div>

      <div style={{ fontSize: 32, fontWeight: 800, color: G.text, marginBottom: 28 }}>
        {question} = ?
      </div>

      <div className="quiz-opts" style={{ maxWidth: 360, margin: "0 auto 20px" }}>
        {options.map((opt, i) => (
          <button key={i} className="quiz-opt" style={{ textAlign: "center" }} onClick={() => handleOptionClick(opt)}>
            {opt}
          </button>
        ))}
      </div>

      <div className="font-bold text-muted">Current Score: {score}</div>
    </div>
  );
}

function ConceptMatcher({ subjectId, onGameComplete }) {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [flips, setFlips] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!started) return;
    const pool = subjectId === "social" ? SOCIAL_CONCEPTS : SCIENCE_CONCEPTS;
    const formatted = [];
    pool.forEach((pair, idx) => {
      formatted.push({ id: `t-${idx}`, value: pair.term, matchId: idx, type: "term" });
      formatted.push({ id: `d-${idx}`, value: pair.def, matchId: idx, type: "def" });
    });
    setCards(formatted.sort(() => Math.random() - 0.5));
  }, [started, subjectId]);

  const handleCardClick = (idx) => {
    if (selected.length >= 2 || selected.includes(idx) || matched.includes(idx)) return;

    const newSelected = [...selected, idx];
    setSelected(newSelected);
    soundSynth.playTone(330, "sine", 0.08);

    if (newSelected.length === 2) {
      setFlips((f) => f + 1);
      const card1 = cards[newSelected[0]];
      const card2 = cards[newSelected[1]];

      if (card1.matchId === card2.matchId) {
        setTimeout(() => {
          soundSynth.playSuccess();
          const newMatched = [...matched, ...newSelected];
          setMatched(newMatched);
          setSelected([]);
          if (newMatched.length === cards.length) {
            handleFinish();
          }
        }, 500);
      } else {
        setTimeout(() => {
          soundSynth.playError();
          setSelected([]);
        }, 1200);
      }
    }
  };

  const handleFinish = () => {
    setFinished(true);
  };

  const getScore = () => Math.max(10, 100 - flips * 5);

  if (!started) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🧠</div>
        <h2 className="font-heavy mb-8">Concept Matcher</h2>
        <p className="text-muted mb-20">Match the core science/social concepts with their correct definitions. Flip cards to find matching pairs!</p>
        <button className="btn-primary" onClick={() => setStarted(true)}>
          Start Memory Game 🧠
        </button>
      </div>
    );
  }

  if (finished) {
    const finalScore = getScore();
    return (
      <div className="card" style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🏆</div>
        <h2 className="font-heavy mb-4">Board Cleared!</h2>
        <p className="text-muted mb-8">Completed in {flips} turns</p>
        <div
          className="quiz-score-ring"
          style={{ width: 140, height: 140, fontSize: 28, background: G.greenLight, color: G.green }}
        >
          {finalScore} Pts
        </div>
        <button
          className="btn-primary mt-20"
          style={{ width: "auto" }}
          onClick={() => onGameComplete("conceptMatcher", finalScore)}
        >
          Continue to Quiz →
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-16">
        <div className="font-bold text-sm text-muted">Match Terms and Descriptions</div>
        <div className="xp-badge">Turns: {flips}</div>
      </div>
      <div className="memory-grid">
        {cards.map((c, i) => {
          const isFlipped = selected.includes(i) || matched.includes(i);
          const isMatched = matched.includes(i);
          return (
            <div
              key={c.id}
              className={`memory-card ${isFlipped ? "flipped" : ""} ${isMatched ? "matched" : ""}`}
              onClick={() => handleCardClick(i)}
            >
              <div className="memory-card-inner">
                <div className="memory-card-front">?</div>
                <div className="memory-card-back" style={{ fontSize: c.type === "def" ? "10px" : "12px" }}>
                  {c.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AnagramWordBuilder({ subjectId, onGameComplete }) {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState([]);
  const [lettersPool, setLettersPool] = useState([]);
  const [wordSet, setWordSet] = useState([]);

  useEffect(() => {
    if (!started) return;
    const pool = subjectId === "odia" ? ODIA_WORDS : ENGLISH_WORDS;
    setWordSet(pool);
    loadWord(pool[0]);
  }, [started, subjectId]);

  const loadWord = (wordObj) => {
    if (!wordObj) return;
    const scrambled = wordObj.jumble.split("").sort(() => Math.random() - 0.5);
    setLettersPool(scrambled.map((char, index) => ({ char, index, selected: false })));
    setCurrentAnswer([]);
  };

  const handleLetterClick = (item, poolIdx) => {
    if (item.selected) return;

    soundSynth.playTone(440, "sine", 0.08);
    const newAnswer = [...currentAnswer, item.char];
    setCurrentAnswer(newAnswer);

    const newPool = [...lettersPool];
    newPool[poolIdx].selected = true;
    setLettersPool(newPool);

    const target = wordSet[currentWordIdx].word;
    const answerStr = newAnswer.join("");

    if (answerStr === target) {
      soundSynth.playSuccess();
      setTimeout(() => {
        if (currentWordIdx + 1 < wordSet.length) {
          setCurrentWordIdx((c) => c + 1);
          loadWord(wordSet[currentWordIdx + 1]);
        } else {
          handleFinish();
        }
      }, 800);
    } else if (answerStr.length === target.length) {
      soundSynth.playError();
      setTimeout(() => {
        loadWord(wordSet[currentWordIdx]);
      }, 1000);
    }
  };

  const handleReset = () => {
    soundSynth.playTone(200, "sine", 0.1);
    loadWord(wordSet[currentWordIdx]);
  };

  const handleFinish = () => {
    setFinished(true);
  };

  if (!started) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🔠</div>
        <h2 className="font-heavy mb-8">Anagram Word Builder</h2>
        <p className="text-muted mb-20">Re-assemble letters in the correct sequence to build the terms and answer the prompt hints!</p>
        <button className="btn-primary" onClick={() => setStarted(true)}>
          Start Spelling Game 🔠
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🏆</div>
        <h2 className="font-heavy mb-4">Spelling Champ!</h2>
        <p className="text-muted mb-8">You spelt all vocabulary correctly</p>
        <div
          className="quiz-score-ring"
          style={{ width: 140, height: 140, fontSize: 28, background: G.purpleLight, color: G.purple }}
        >
          100 Pts
        </div>
        <button
          className="btn-primary mt-20"
          style={{ width: "auto" }}
          onClick={() => onGameComplete("wordBuilder", 100)}
        >
          Continue to Quiz →
        </button>
      </div>
    );
  }

  const currentWord = wordSet[currentWordIdx] || { hint: "" };

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <div className="flex justify-between items-center mb-16">
        <span className="font-bold text-sm text-muted">
          Word Builder {currentWordIdx + 1}/{wordSet.length}
        </span>
        <button className="btn-outline btn-sm" onClick={handleReset}>
          Reset Word 🔄
        </button>
      </div>

      <div style={{ background: G.grayLight, padding: 16, borderRadius: 10, marginBottom: 20, fontSize: 14, fontWeight: 600 }}>
        💡 Hint: {currentWord.hint}
      </div>

      {/* Answer Slots */}
      <div
        className="flex justify-center gap-8 mb-24"
        style={{ minHeight: 48, background: G.grayLight, borderRadius: 8, padding: 8, flexWrap: "wrap" }}
      >
        {currentAnswer.map((char, i) => (
          <div key={i} className="letter-block" style={{ background: G.white, borderColor: G.orange, color: G.orange }}>
            {char}
          </div>
        ))}
      </div>

      {/* Scrambled Pool */}
      <div className="letter-grid">
        {lettersPool.map((item, i) => (
          <button
            key={i}
            className={`letter-block ${item.selected ? "selected" : ""}`}
            onClick={() => handleLetterClick(item, i)}
          >
            {item.char}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── QUIZ ──────────────────────────────────────────────────────────────────────

function Quiz({ quest, setPage, showToast, onProgressUpdated }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const q = QUIZ_QUESTIONS[current];

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.ans) {
      setScore((s) => s + 1);
      soundSynth.playSuccess();
    } else {
      soundSynth.playError();
    }
  };

  const handleNext = async () => {
    if (current + 1 >= QUIZ_QUESTIONS.length) {
      setSaving(true);
      const finalScore = score + (selected === q.ans ? 1 : 0);
      const earnedXP = Math.round((finalScore / QUIZ_QUESTIONS.length) * (quest?.xp || 100));

      try {
        const response = await apiCall("/student/complete-quest", "POST", {
          questId: quest.id,
          xpEarned: earnedXP,
        });

        showToast(`Quiz Complete! You earned +${earnedXP} XP!`);
        if (response.newBadgesEarned && response.newBadgesEarned.length > 0) {
          response.newBadgesEarned.forEach((badgeName) => {
            showToast(`🏆 Badge Earned: ${badgeName}!`);
          });
        }

        onProgressUpdated(response);
        setDone(true);
      } catch (err) {
        console.error("Failed to save progress:", err);
        showToast("Error updating score. Running offline bypass!");
        setDone(true);
      } finally {
        setSaving(false);
      }
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (done) {
    const finalScore = score + (selected === q.ans ? 1 : 0);
    const pct = Math.round((finalScore / QUIZ_QUESTIONS.length) * 100);
    return (
      <div className="quiz-wrap">
        <div className="quiz-result">
          <div className="quiz-score-ring">{pct}%</div>
          <div className="font-heavy mb-8" style={{ fontSize: 24 }}>
            {pct >= 80 ? "Excellent! 🏆" : pct >= 60 ? "Good Job! ⭐" : "Keep Practising! 💪"}
          </div>
          <div className="text-muted mb-24">
            {finalScore}/{QUIZ_QUESTIONS.length} questions correct
          </div>
          <div className="flex gap-12" style={{ justifyContent: "center" }}>
            <button className="btn-outline" onClick={() => setPage("quests")}>
              Back to Quests
            </button>
            <button className="btn-primary" style={{ width: "auto" }} onClick={() => setPage("dashboard")}>
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-wrap">
      <div className="flex justify-between items-center mb-12">
        <div className="text-sm text-muted">
          Question {current + 1}/{QUIZ_QUESTIONS.length}
        </div>
        <div className="xp-badge">
          Score: {score}/{current}
        </div>
      </div>
      <div className="quiz-progress">
        <div
          className="quiz-progress-fill"
          style={{ width: `${(current / QUIZ_QUESTIONS.length) * 100}%` }}
        />
      </div>
      <div className="quiz-q">{q.q}</div>
      <div className="quiz-opts">
        {q.opts.map((opt, i) => {
          let cls = "";
          if (answered) {
            if (i === q.ans) cls = "correct";
            else if (i === selected) cls = "wrong";
          } else if (i === selected) cls = "selected";
          return (
            <button key={i} className={`quiz-opt ${cls}`} onClick={() => handleAnswer(i)}>
              <span style={{ marginRight: 8, opacity: 0.5 }}>{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <button className="btn-primary" onClick={handleNext} disabled={saving}>
          {saving
            ? "Saving Score..."
            : current + 1 >= QUIZ_QUESTIONS.length
            ? "Submit & See Results"
            : "Next Question →"}
        </button>
      )}
    </div>
  );
}

// ─── LEADERBOARD ───────────────────────────────────────────────────────────────

function Leaderboard({ user }) {
  const [activeTab, setActiveTab] = useState("state");
  const [stateLeaderboard, setStateLeaderboard] = useState([]);
  const [villageLeaderboard, setVillageLeaderboard] = useState([]);
  const [ranks, setRanks] = useState({ stateRank: null, villageRank: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await apiCall("/student/leaderboard");
        setStateLeaderboard(data.stateLeaderboard || []);
        setVillageLeaderboard(data.villageLeaderboard || []);
        setRanks(data.myRanks || { stateRank: null, villageRank: null });
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const board = activeTab === "state" ? stateLeaderboard : villageLeaderboard;
  const myRank = activeTab === "state" ? ranks.stateRank : ranks.villageRank;

  return (
    <div>
      <div className="section-title">🏆 Odisha Leaderboards</div>

      <div className="flex gap-8 mb-16">
        <button
          className={`btn-outline ${activeTab === "state" ? "active" : ""}`}
          onClick={() => setActiveTab("state")}
          style={{
            background: activeTab === "state" ? G.orangeLight : "",
            borderColor: activeTab === "state" ? G.orange : "",
            color: activeTab === "state" ? G.orange : "",
          }}
        >
          Odisha State
        </button>
        {user.village && (
          <button
            className={`btn-outline ${activeTab === "village" ? "active" : ""}`}
            onClick={() => setActiveTab("village")}
            style={{
              background: activeTab === "village" ? G.orangeLight : "",
              borderColor: activeTab === "village" ? G.orange : "",
              color: activeTab === "village" ? G.orange : "",
            }}
          >
            🏘️ {user.village} Village
          </button>
        )}
      </div>

      <div className="card-sm mb-16" style={{ background: G.orangeLight, borderColor: G.orange }}>
        <div className="text-sm text-muted mb-4">
          {activeTab === "state" ? "Weekly top learners across Odisha" : `Top learners in ${user.village}`}
        </div>
        <div className="flex gap-12">
          {myRank ? (
            <span className="tag">My Rank: #{myRank}</span>
          ) : (
            <span className="tag">Participate in quizzes to rank!</span>
          )}
          <span className="tag">🟢 Live Leaderboard</span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 20 }}>Loading leaderboards...</div>
      ) : board.length === 0 ? (
        <div style={{ textAlign: "center", padding: 20 }}>No students active in this board yet.</div>
      ) : (
        board.map((r, idx) => {
          const isMe = r.name === user.name;
          const medals = ["🏆", "🥈", "🥉"];
          const rankIcon = idx < 3 ? medals[idx] : "⭐";

          return (
            <div key={r._id || idx} className={`lb-row ${isMe ? "me" : ""}`}>
              <div className="lb-rank">{rankIcon}</div>
              <Avatar
                initials={r.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                src={r.avatar}
                color={isMe ? G.orange : G.gray}
                size={36}
              />
              <div className="lb-name">
                <strong>
                  {r.name} {isMe && <span style={{ color: G.orange }}>(You)</span>}
                </strong>
                <span>
                  🏘️ {r.village} · Rank #{idx + 1}
                </span>
              </div>
              <div className="lb-xp">{r.xp} XP</div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ─── BADGES ────────────────────────────────────────────────────────────────────

function Badges({ user }) {
  const earnedCount = BADGES.filter((b) => user.badges?.includes(b.id)).length;

  return (
    <div>
      <div className="section-title">🎖️ My Badges</div>
      <div className="card-sm mb-20" style={{ background: G.grayLight }}>
        <div className="font-bold mb-4">
          {earnedCount}/{BADGES.length} earned
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${(earnedCount / BADGES.length) * 100}%` }} />
        </div>
      </div>
      <div className="badge-grid">
        {BADGES.map((b) => {
          const earned = user.badges?.includes(b.id);
          return (
            <div key={b.id} className={`badge-item ${earned ? "earned" : "locked-b"}`}>
              <div className="badge-icon">{b.icon}</div>
              <div className="badge-name">{b.name}</div>
              <div style={{ fontSize: 11, color: G.textSub, marginTop: 4 }}>{b.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── TEACHER DASHBOARD ────────────────────────────────────────────────────────

function TeacherDashboard({ user }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await apiCall("/teacher/students");
        setStudents(data.students || []);
      } catch (err) {
        setError(err.message || "Failed to load class list.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const active = students.filter((s) => s.status === "active").length;
  const atRisk = students.filter((s) => s.status === "at-risk").length;
  const inactive = students.filter((s) => s.status === "inactive").length;

  return (
    <div>
      <div
        className="card mb-20"
        style={{
          background: "linear-gradient(120deg, #185FA5, #1D9E75)",
          color: G.white,
          border: "none",
        }}
      >
        <div className="font-heavy mb-4" style={{ fontSize: 20 }}>
          Teacher Dashboard
        </div>
        <div className="text-sm mb-16" style={{ opacity: 0.9 }}>
          Welcome, {user.name} · {user.village} Village School
        </div>
        {!loading && (
          <div className="flex gap-16" style={{ flexWrap: "wrap" }}>
            {[
              ["Total Students", students.length],
              ["Active Today", active],
              ["At Risk", atRisk],
              ["Inactive", inactive],
            ].map(([l, v]) => (
              <div
                key={l}
                style={{
                  background: "rgba(255,255,255,.15)",
                  borderRadius: 10,
                  padding: "10px 16px",
                  textAlign: "center",
                  minWidth: 100,
                  flex: 1,
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800 }}>{v}</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>{l}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section-title">Village Student Progress</div>

      {error && <div style={{ color: "#E24B4A", marginBottom: 12 }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: "center", padding: 20 }}>Loading student data...</div>
      ) : students.length === 0 ? (
        <div style={{ textAlign: "center", padding: 20 }}>No students registered in {user.village} village yet.</div>
      ) : (
        students.map((s) => (
          <div key={s._id} className="student-row" style={{ flexWrap: "wrap", gap: 16 }}>
            <Avatar
              initials={s.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              src={s.avatar}
              color={s.status === "active" ? G.green : s.status === "at-risk" ? "#EF9F27" : "#E24B4A"}
              size={38}
            />
            <div style={{ flex: 1, minWidth: 160 }}>
              <div className="font-bold">{s.name}</div>
              <div className="text-xs text-muted">
                Last active: {s.lastSeen} · 🔥 {s.streak} day streak · {s.quests} complete
              </div>
              {s.highScores && (
                <div className="text-xs text-muted" style={{ marginTop: 4, background: G.grayLight, display: "inline-block", padding: "2px 6px", borderRadius: 4 }}>
                  Game Stats: 🏹{s.highScores.speedMath || 0} | 🧠{s.highScores.conceptMatcher || 0} | 🔠{s.highScores.wordBuilder || 0}
                </div>
              )}
            </div>
            <div style={{ textAlign: "right", minWidth: 80 }}>
              <div className="font-bold mb-4" style={{ color: G.orange }}>
                {s.xp} XP
              </div>
              <span className={`status-badge ${s.status}`}>
                {s.status === "at-risk" ? "At risk" : s.status}
              </span>
            </div>
          </div>
        ))
      )}

      {students.some((s) => s.status === "inactive" || s.status === "at-risk") && (
        <>
          <div className="divider" />
          <div className="card" style={{ background: "#FFF4EE", borderColor: G.orange }}>
            <div className="font-heavy mb-8">⚠️ Active Interventions Needed</div>
            <div className="text-sm text-muted">
              Some students haven't completed a lesson this week. Parents can be notified via automated WhatsApp integrations in high-priority status updates.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── PARENT DASHBOARD ────────────────────────────────────────────────────────

function ParentDashboard({ user }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChildProgress = async () => {
      try {
        const data = await apiCall("/parent/child-progress");
        setChild(data);
      } catch (err) {
        setError(err.message || "Failed to load child data.");
      } finally {
        setLoading(false);
      }
    };

    if (user.linkedStudentEmail) {
      fetchChildProgress();
    } else {
      setLoading(false);
      setError("No child account linked yet.");
    }
  }, [user.linkedStudentEmail]);

  if (loading) {
    return <div style={{ textAlign: "center", padding: 20 }}>Loading progress dashboard...</div>;
  }

  if (error || !child) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>👪</div>
        <div className="font-heavy mb-8" style={{ fontSize: 18 }}>Parent Monitoring</div>
        <p className="text-muted mb-20">{error || "Please link a child student account."}</p>
        <div style={{ maxWidth: 360, margin: "0 auto", textAlign: "left" }}>
          <label className="login-label">Student Gmail / Account Email</label>
          <input
            type="email"
            id="link-child-email"
            placeholder="childname@gmail.com"
            className="demo-input"
            required
          />
          <button
            className="btn-primary"
            onClick={async () => {
              const email = document.getElementById("link-child-email").value;
              if (!email) return;
              try {
                await apiCall("/auth/onboard", "POST", {
                  role: user.role,
                  village: user.village,
                  linkedStudentEmail: email,
                });
                window.location.reload();
              } catch (err) {
                alert(err.message);
              }
            }}
          >
            Link Student Account
          </button>
        </div>
      </div>
    );
  }

  const xps = child.weeklyXP || [0, 0, 0, 0, 0, 0, 0];
  const maxXP = Math.max(...xps, 10);

  const SUBJECTS_DYNAMIC = SUBJECTS.map((s) => {
    const subjectQuests = QUESTS[s.id] || [];
    const done = subjectQuests.filter((q) => child.completedQuests?.includes(q.id)).length;
    return { ...s, done, total: subjectQuests.length };
  });

  return (
    <div>
      <div
        className="card mb-20"
        style={{
          background: "linear-gradient(120deg, #534AB7, #185FA5)",
          color: G.white,
          border: "none",
        }}
      >
        <div className="font-heavy mb-4" style={{ fontSize: 20 }}>
          Parent Dashboard
        </div>
        <div className="text-sm mb-4" style={{ opacity: 0.9 }}>
          Tracking Student: {child.name} — {child.class || "Class 6"}
        </div>
        <div className="text-sm" style={{ opacity: 0.7 }}>
          Village: {child.village} · Last active: {child.lastActive ? new Date(child.lastActive).toLocaleDateString() : "Never"}
        </div>
      </div>

      <div className="grid2 mb-20">
        {[
          ["Total XP", `⭐ ${child.xp}`, G.orange],
          ["Level", `🎮 Level ${child.level}`, G.purple],
          ["Streak", `🔥 ${child.streak} days`, G.green],
          ["Quests Done", `📚 ${child.completedQuests?.length}/25`, G.blue],
        ].map(([l, v, c]) => (
          <div key={l} className="card-sm" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{v}</div>
            <div className="text-xs text-muted">{l}</div>
          </div>
        ))}
      </div>

      {/* Child Game Scores */}
      {child.gameHighScores && (
        <div className="card mb-20">
          <div className="font-heavy mb-12">🎮 Game Achievements</div>
          <div className="grid3" style={{ gap: 10 }}>
            <div style={{ background: G.orangeLight, padding: 10, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 18 }}>🏹</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: G.orange }}>Speed Math</div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>{child.gameHighScores.speedMath || 0} pts</div>
            </div>
            <div style={{ background: G.blueLight, padding: 10, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 18 }}>🧠</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: G.blue }}>Concept Match</div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>{child.gameHighScores.conceptMatcher || 0} pts</div>
            </div>
            <div style={{ background: G.purpleLight, padding: 10, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 18 }}>🔠</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: G.purple }}>Word Builder</div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>{child.gameHighScores.wordBuilder || 0} pts</div>
            </div>
          </div>
        </div>
      )}

      <div className="card mb-20">
        <div className="font-heavy mb-16">This Week's XP Graph</div>
        <div className="weekly-bar-wrap">
          {xps.map((xp, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                className="weekly-bar"
                style={{ height: `${(xp / maxXP) * 80}px`, width: "100%" }}
                title={`${xp} XP`}
              />
              <div className="weekly-bar-lbl">{days[i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-title">Subject Completion</div>
      {SUBJECTS_DYNAMIC.map((s) => (
        <div key={s.id} className="flex items-center gap-12 mb-12">
          <div style={{ fontSize: 20, width: 28 }}>{s.icon}</div>
          <div style={{ flex: 1 }}>
            <div className="flex justify-between mb-4">
              <span className="font-bold text-sm">{s.name}</span>
              <span className="text-xs text-muted">
                {s.done}/{s.total} complete
              </span>
            </div>
            <div className="progress-bar-wrap">
              <div
                className="progress-bar-fill"
                style={{ width: `${(s.done / s.total) * 100}%`, background: s.color }}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="divider" />
      <div className="card" style={{ background: G.greenLight, borderColor: G.green }}>
        <div className="font-heavy mb-8" style={{ color: G.green }}>
          🏆 Encourage Learning
        </div>
        <p className="text-sm text-muted">
          Your child is ranked well. Share feedback or sit along with them to review lessons together!
        </p>
      </div>
    </div>
  );
}

// ─── NAV BAR ──────────────────────────────────────────────────────────────────

function NavBar({ user, page, setPage, onLogout }) {
  const studentTabs = [
    { id: "dashboard", label: "Home" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "badges", label: "Badges" },
  ];

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <>
      <nav className="nav">
        <div className="nav-logo">
          🎮 <span>VidyaQuest</span>
        </div>
        {user.role === "student" && (
          <div className="nav-tabs">
            {studentTabs.map((t) => (
              <button
                key={t.id}
                className={`nav-tab ${page === t.id ? "active" : ""}`}
                onClick={() => setPage(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
        <div className="nav-right">
          {user.role === "student" && (
            <>
              <span className="streak-pill">🔥 {user.streak || 0}</span>
              <span className="xp-pill">⭐ {user.xp || 0} XP</span>
            </>
          )}
          <Avatar initials={initials} src={user.avatar} size={34} />
          <button className="btn-outline btn-sm" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="xp-bar-global">
        {user.role === "student" && (
          <div className="xp-bar-fill" style={{ width: `${((user.xp % 200) / 200) * 100}%` }} />
        )}
      </div>
    </>
  );
}

// ─── MAIN APP CONTROL ─────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [page, setPage] = useState("dashboard");
  const [activeSubject, setActiveSubject] = useState("math");
  const [activeQuest, setActiveQuest] = useState(QUESTS.math[0]);
  const [toast, setToast] = useState("");
  const [confettiActive, setConfettiActive] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    if (userData.role) {
      setPage(
        userData.role === "student"
          ? "dashboard"
          : userData.role === "teacher"
          ? "teacher"
          : "parent"
      );
    }
    showToast(`Welcome back, ${userData.name.split(" ")[0]}! 👋`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("dashboard");
  };

  const handleOnboardComplete = (updatedUserData) => {
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    setUser(updatedUserData);
    setPage(
      updatedUserData.role === "student"
        ? "dashboard"
        : updatedUserData.role === "teacher"
        ? "teacher"
        : "parent"
    );
    showToast("Profile Onboarding Complete! 🎉");
    soundSynth.playLevelUp();
  };

  const handleProgressUpdated = (progressData) => {
    if (user) {
      const oldLevel = user.level || 1;
      const newLevel = progressData.level || 1;
      
      if (newLevel > oldLevel) {
        soundSynth.playLevelUp();
        setConfettiActive(true);
        setTimeout(() => setConfettiActive(false), 5000);
        showToast(`🎉 LEVEL UP! You reached Level ${newLevel}!`);
      }

      const updated = {
        ...user,
        xp: progressData.xp,
        level: progressData.level,
        streak: progressData.streak,
        completedQuests: progressData.completedQuests,
        badges: progressData.badges,
        weeklyXP: progressData.weeklyXP,
      };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
    }
  };

  const handleGameComplete = async (gameKey, score) => {
    try {
      const result = await apiCall("/student/save-highscore", "POST", {
        gameKey,
        score,
      });

      if (result.isNewHighScore) {
        soundSynth.playLevelUp();
        setConfettiActive(true);
        setTimeout(() => setConfettiActive(false), 4000);
        showToast(`🏆 New High Score! +${result.bonusXP} Bonus XP awarded!`);
      } else {
        showToast(`Game done! You scored ${score} pts`);
      }

      // Update parent user profile
      if (user) {
        const updated = {
          ...user,
          gameHighScores: result.highScores,
          xp: result.xp,
          level: result.level,
        };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
      }
    } catch (err) {
      console.error("Failed to save highscore:", err);
      showToast("Offline mode: Score recorded locally!");
    }
  };

  const handleGameDoneNext = () => {
    setPage("quiz");
  };

  if (!user) {
    return (
      <>
        <style>{css}</style>
        <Login onLoginSuccess={handleLoginSuccess} />
        <Toast msg={toast} />
      </>
    );
  }

  if (user && !user.role) {
    return (
      <>
        <style>{css}</style>
        <Onboarding user={user} onOnboardComplete={handleOnboardComplete} />
        <Toast msg={toast} />
      </>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return (
          <StudentDashboard
            user={user}
            setPage={setPage}
            setActiveSubject={setActiveSubject}
          />
        );
      case "quests":
        return (
          <QuestMap
            subjectId={activeSubject}
            setPage={setPage}
            setActiveQuest={setActiveQuest}
            user={user}
          />
        );
      case "lesson":
        return <Lesson quest={activeQuest} setPage={setPage} showToast={showToast} />;
      case "game":
        if (activeSubject === "math") {
          return <SpeedMathArcher quest={activeQuest} onGameComplete={(key, score) => { handleGameComplete(key, score); handleGameDoneNext(); }} />;
        } else if (activeSubject === "science" || activeSubject === "social") {
          return <ConceptMatcher subjectId={activeSubject} onGameComplete={(key, score) => { handleGameComplete(key, score); handleGameDoneNext(); }} />;
        } else {
          return <AnagramWordBuilder subjectId={activeSubject} onGameComplete={(key, score) => { handleGameComplete(key, score); handleGameDoneNext(); }} />;
        }
      case "quiz":
        return (
          <Quiz
            quest={activeQuest}
            setPage={setPage}
            showToast={showToast}
            onProgressUpdated={handleProgressUpdated}
          />
        );
      case "leaderboard":
        return <Leaderboard user={user} />;
      case "badges":
        return <Badges user={user} />;
      case "teacher":
        return <TeacherDashboard user={user} />;
      case "parent":
        return <ParentDashboard user={user} />;
      default:
        return (
          <StudentDashboard
            user={user}
            setPage={setPage}
            setActiveSubject={setActiveSubject}
          />
        );
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <NavBar user={user} page={page} setPage={setPage} onLogout={handleLogout} />
        <main className="main">{renderPage()}</main>
      </div>
      <Toast msg={toast} />
      <ConfettiCanvas active={confettiActive} />
    </>
  );
}
