import { useState, useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const USERS = {
  student: { id: "s1", name: "Arjun Sahu", role: "student", village: "Kendrapara", class: "Class 6", avatar: "AS" },
  teacher: { id: "t1", name: "Priya Mishra", role: "teacher", village: "Kendrapara", avatar: "PM" },
  parent:  { id: "p1", name: "Ramesh Sahu", role: "parent",  village: "Kendrapara", avatar: "RS" },
};

const SUBJECTS = [
  { id: "math",    name: "Mathematics", icon: "📐", color: "#1D9E75", bg: "#E1F5EE", total: 5, done: 3 },
  { id: "science", name: "Science",     icon: "🔬", color: "#185FA5", bg: "#E6F1FB", total: 5, done: 2 },
  { id: "odia",    name: "Odia",        icon: "📖", color: "#993C1D", bg: "#FAECE7", total: 5, done: 4 },
  { id: "english", name: "English",     icon: "🗣️", color: "#854F0B", bg: "#FAEEDA", total: 5, done: 1 },
  { id: "social",  name: "Social",      icon: "🌍", color: "#3C3489", bg: "#EEEDFE", total: 5, done: 2 },
];

const QUESTS = {
  math: [
    { id: "m1", title: "Counting Stars", desc: "Numbers 1–100 and place values", xp: 50, locked: false, done: true },
    { id: "m2", title: "Addition Kingdom", desc: "Adding numbers up to 1000", xp: 75, locked: false, done: true },
    { id: "m3", title: "Subtraction Battle", desc: "Subtract and find the difference", xp: 75, locked: false, done: true },
    { id: "m4", title: "Multiplication Maze", desc: "Tables from 2 to 12", xp: 100, locked: false, done: false },
    { id: "m5", title: "Division Dragon", desc: "Divide and conquer", xp: 120, locked: true, done: false },
  ],
  science: [
    { id: "sc1", title: "Plants Around Us", desc: "Parts of a plant and photosynthesis", xp: 50, locked: false, done: true },
    { id: "sc2", title: "Animal Kingdom", desc: "Types and habitats of animals", xp: 75, locked: false, done: true },
    { id: "sc3", title: "Water Cycle", desc: "Evaporation, condensation, rain", xp: 75, locked: false, done: false },
    { id: "sc4", title: "Force & Motion", desc: "Push, pull, gravity", xp: 100, locked: true, done: false },
    { id: "sc5", title: "Light & Shadow", desc: "How light travels", xp: 120, locked: true, done: false },
  ],
  odia: [
    { id: "o1", title: "ବର୍ଣ୍ଣମାଳା", desc: "Odia alphabet and vowels", xp: 50, locked: false, done: true },
    { id: "o2", title: "ସଂଖ୍ୟା", desc: "Numbers in Odia", xp: 75, locked: false, done: true },
    { id: "o3", title: "ଗପ ସ୍ୱ", desc: "Short stories in Odia", xp: 75, locked: false, done: true },
    { id: "o4", title: "କବିତା", desc: "Poems and rhythm", xp: 100, locked: false, done: true },
    { id: "o5", title: "ରଚନା", desc: "Essay writing basics", xp: 120, locked: false, done: false },
  ],
  english: [
    { id: "e1", title: "ABC Adventure", desc: "Alphabet and phonics", xp: 50, locked: false, done: true },
    { id: "e2", title: "Word Village", desc: "Common words and spelling", xp: 75, locked: true, done: false },
    { id: "e3", title: "Sentence Builder", desc: "Simple sentences", xp: 75, locked: true, done: false },
    { id: "e4", title: "Story Time", desc: "Reading short stories", xp: 100, locked: true, done: false },
    { id: "e5", title: "Grammar Gate", desc: "Nouns, verbs, adjectives", xp: 120, locked: true, done: false },
  ],
  social: [
    { id: "ss1", title: "My Village", desc: "Community and local governance", xp: 50, locked: false, done: true },
    { id: "ss2", title: "Odisha History", desc: "Kings and culture of Odisha", xp: 75, locked: false, done: true },
    { id: "ss3", title: "India Map Quest", desc: "States, capitals, rivers", xp: 75, locked: false, done: false },
    { id: "ss4", title: "Farming & Food", desc: "Agriculture in Odisha", xp: 100, locked: true, done: false },
    { id: "ss5", title: "Festivals of Odisha", desc: "Rath Yatra, Durga Puja and more", xp: 120, locked: true, done: false },
  ],
};

const QUIZ_QUESTIONS = [
  { q: "What is 7 × 8?", opts: ["54", "56", "64", "48"], ans: 1 },
  { q: "What is 144 ÷ 12?", opts: ["11", "13", "12", "14"], ans: 2 },
  { q: "Which is the largest 3-digit number?", opts: ["899", "999", "909", "990"], ans: 1 },
  { q: "What is 1000 − 367?", opts: ["633", "643", "623", "663"], ans: 0 },
  { q: "How many sides does a hexagon have?", opts: ["5", "7", "8", "6"], ans: 3 },
];

const LEADERBOARD = [
  { rank: 1, name: "Sunita Panda",  village: "Cuttack",     xp: 1840, badge: "🏆", streak: 21 },
  { rank: 2, name: "Raju Nayak",   village: "Bhubaneswar",  xp: 1720, badge: "🥈", streak: 18 },
  { rank: 3, name: "Arjun Sahu",   village: "Kendrapara",   xp: 1580, badge: "🥉", streak: 15, isMe: true },
  { rank: 4, name: "Meena Das",    village: "Puri",         xp: 1450, badge: "⭐", streak: 12 },
  { rank: 5, name: "Bikash Kar",   village: "Sambalpur",    xp: 1310, badge: "⭐", streak: 9 },
  { rank: 6, name: "Priti Sethi",  village: "Berhampur",    xp: 1200, badge: "⭐", streak: 7 },
  { rank: 7, name: "Dipak Jena",   village: "Balasore",     xp: 1100, badge: "⭐", streak: 5 },
];

const BADGES = [
  { id: "b1", name: "First Step",     icon: "👣", desc: "Complete your first quest",      earned: true },
  { id: "b2", name: "Math Warrior",   icon: "⚔️",  desc: "Finish 3 math quests",           earned: true },
  { id: "b3", name: "Streak Keeper",  icon: "🔥", desc: "7-day learning streak",          earned: true },
  { id: "b4", name: "Quiz Champion",  icon: "🏆", desc: "Score 100% in a quiz",           earned: true },
  { id: "b5", name: "Odia Scholar",   icon: "📜", desc: "Complete all Odia quests",       earned: false },
  { id: "b6", name: "Village Hero",   icon: "🌟", desc: "Reach top 3 in village rank",    earned: false },
  { id: "b7", name: "Science Star",   icon: "🔬", desc: "Finish all Science quests",      earned: false },
  { id: "b8", name: "Grand Master",   icon: "👑", desc: "Complete all 25 quests",         earned: false },
];

const STUDENT_PROGRESS = {
  xp: 1580, level: 8, streak: 15, totalQuests: 13, totalPossible: 25,
  weeklyXP: [120, 200, 180, 300, 150, 280, 200],
  subjects: SUBJECTS,
};

const TEACHER_STUDENTS = [
  { name: "Arjun Sahu",    xp: 1580, streak: 15, quests: 13, lastSeen: "Today",      status: "active" },
  { name: "Sunita Mohanty",xp: 1200, streak: 8,  quests: 10, lastSeen: "Yesterday",  status: "active" },
  { name: "Rohit Das",     xp: 980,  streak: 3,  quests: 8,  lastSeen: "3 days ago", status: "at-risk" },
  { name: "Priya Kar",     xp: 1450, streak: 12, quests: 12, lastSeen: "Today",      status: "active" },
  { name: "Bikash Nayak",  xp: 450,  streak: 0,  quests: 4,  lastSeen: "1 week ago", status: "inactive" },
  { name: "Mita Jena",     xp: 760,  streak: 5,  quests: 7,  lastSeen: "2 days ago", status: "active" },
];

// ─── STYLES ───────────────────────────────────────────────────────────────────

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
  input  { font-family: 'Nunito', sans-serif; }

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

  /* CARDS */
  .card { background: ${G.white}; border: 1px solid ${G.grayBorder}; border-radius: 14px; padding: 20px; }
  .card-sm { background: ${G.white}; border: 1px solid ${G.grayBorder}; border-radius: 12px; padding: 16px; }

  /* LOGIN */
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #FFF4EE 0%, #E1F5EE 100%); padding: 20px; }
  .login-box { background: ${G.white}; border-radius: 20px; padding: 40px 32px; width: 100%;
    max-width: 420px; box-shadow: 0 4px 40px rgba(0,0,0,.08); }
  .login-logo { font-size: 32px; font-weight: 800; color: ${G.orange}; margin-bottom: 4px; }
  .login-sub  { color: ${G.textSub}; font-size: 14px; margin-bottom: 32px; }
  .login-label { display: block; font-size: 13px; font-weight: 700; color: ${G.textSub};
    margin-bottom: 6px; text-transform: uppercase; letter-spacing: .5px; }
  .login-select { width: 100%; padding: 12px 16px; border: 1.5px solid ${G.grayBorder};
    border-radius: 10px; font-size: 15px; font-family: 'Nunito', sans-serif;
    color: ${G.text}; background: ${G.white}; appearance: none; margin-bottom: 20px; outline: none; }
  .login-select:focus { border-color: ${G.orange}; }
  .btn-primary { background: ${G.orange}; color: ${G.white}; padding: 13px 28px; border-radius: 10px;
    font-size: 16px; font-weight: 700; width: 100%; transition: opacity .2s; }
  .btn-primary:hover { opacity: .9; }
  .btn-sm { padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; }
  .btn-outline { border: 1.5px solid ${G.grayBorder}; color: ${G.textSub}; border-radius: 8px;
    padding: 7px 14px; font-size: 13px; font-weight: 600; transition: all .2s; }
  .btn-outline:hover { border-color: ${G.orange}; color: ${G.orange}; }

  /* DASHBOARD */
  .dash-hero { background: linear-gradient(120deg, ${G.orange} 0%, #F2A623 100%);
    border-radius: 16px; padding: 24px; color: ${G.white}; margin-bottom: 20px; position: relative; overflow: hidden; }
  .dash-hero::after { content: '🎮'; position: absolute; right: 20px; top: 50%;
    transform: translateY(-50%); font-size: 64px; opacity: .3; }
  .dash-hero h2 { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
  .dash-hero p  { font-size: 14px; opacity: .9; margin-bottom: 16px; }
  .hero-stats { display: flex; gap: 16px; }
  .hero-stat { background: rgba(255,255,255,.2); border-radius: 10px; padding: 10px 16px; text-align: center; }
  .hero-stat-num { font-size: 20px; font-weight: 800; }
  .hero-stat-lbl { font-size: 11px; opacity: .8; }

  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  @media(max-width: 600px) { .grid2 { grid-template-columns: 1fr; } .grid3 { grid-template-columns: 1fr 1fr; } }

  .section-title { font-size: 17px; font-weight: 800; color: ${G.text}; margin-bottom: 14px; }

  /* SUBJECT CARDS */
  .subj-card { border-radius: 12px; padding: 16px; cursor: pointer; transition: transform .15s, box-shadow .15s;
    border: 1.5px solid transparent; }
  .subj-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,.1); }
  .subj-card.active { border-color: ${G.orange}; }
  .subj-icon { font-size: 28px; margin-bottom: 8px; }
  .subj-name { font-size: 14px; font-weight: 800; margin-bottom: 4px; }
  .subj-prog-bar { height: 6px; border-radius: 3px; background: rgba(0,0,0,.1); margin-top: 8px; }
  .subj-prog-fill { height: 6px; border-radius: 3px; }

  /* QUEST MAP */
  .quest-list { display: flex; flex-direction: column; gap: 12px; }
  .quest-item { display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: 12px;
    border: 1.5px solid ${G.grayBorder}; background: ${G.white}; cursor: pointer; transition: all .2s; }
  .quest-item:hover:not(.locked) { border-color: ${G.orange}; box-shadow: 0 2px 12px rgba(232,93,32,.15); }
  .quest-item.locked { opacity: .5; cursor: not-allowed; }
  .quest-item.done { background: ${G.greenLight}; border-color: ${G.green}; }
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
  .xp-bar-fill    { height: 3px; background: ${G.orange}; width: 65%; transition: width 1s; }
`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Toast({ msg }) {
  if (!msg) return null;
  return <div className="toast">{msg}</div>;
}

function Avatar({ initials, size = 34, color = G.orange }) {
  return (
    <div className="avatar" style={{ width: size, height: size, background: color, fontSize: size * .35 }}>
      {initials}
    </div>
  );
}

// ─── LOGIN ─────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [role, setRole] = useState("student");
  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="login-logo">🎮 VidyaQuest</div>
        <div className="login-sub">Gamified Learning for Odisha — Smart India Hackathon</div>
        <label className="login-label">Login as</label>
        <select className="login-select" value={role} onChange={e => setRole(e.target.value)}>
          <option value="student">Student — Arjun Sahu (Class 6)</option>
          <option value="teacher">Teacher — Priya Mishra</option>
          <option value="parent">Parent — Ramesh Sahu</option>
        </select>
        <button className="btn-primary" onClick={() => onLogin(USERS[role])}>
          Start Learning →
        </button>
        <div className="divider" />
        <div className="flex gap-8" style={{ justifyContent: "center", flexWrap: "wrap" }}>
          {["📶 Offline Mode", "🗣️ Odia + English", "🆓 Free Forever"].map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT DASHBOARD ────────────────────────────────────────────────────────
function StudentDashboard({ user, setPage, setActiveSubject }) {
  const p = STUDENT_PROGRESS;
  const xpForLevel = 200;
  const xpInLevel = p.xp % xpForLevel;
  return (
    <div>
      {/* Hero */}
      <div className="dash-hero">
        <h2>Jai Jagannath, {user.name.split(" ")[0]}! 🙏</h2>
        <p>You are on a {p.streak}-day streak. Keep it going!</p>
        <div className="hero-stats">
          <div className="hero-stat"><div className="hero-stat-num">{p.xp}</div><div className="hero-stat-lbl">Total XP</div></div>
          <div className="hero-stat"><div className="hero-stat-num">Lv. {p.level}</div><div className="hero-stat-lbl">Level</div></div>
          <div className="hero-stat"><div className="hero-stat-num">{p.streak}🔥</div><div className="hero-stat-lbl">Streak</div></div>
          <div className="hero-stat"><div className="hero-stat-num">{p.totalQuests}/{p.totalPossible}</div><div className="hero-stat-lbl">Quests</div></div>
        </div>
      </div>

      {/* Level progress */}
      <div className="card mb-20">
        <div className="flex justify-between mb-8">
          <div className="font-bold">Level {p.level} → Level {p.level + 1}</div>
          <div className="text-sm text-muted">{xpInLevel}/{xpForLevel} XP</div>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${(xpInLevel / xpForLevel) * 100}%` }} />
        </div>
      </div>

      {/* Subjects */}
      <div className="section-title">Choose a Subject</div>
      <div className="grid3 mb-24">
        {SUBJECTS.map(s => (
          <div key={s.id} className="subj-card" style={{ background: s.bg }}
            onClick={() => { setActiveSubject(s.id); setPage("quests"); }}>
            <div className="subj-icon">{s.icon}</div>
            <div className="subj-name" style={{ color: s.color }}>{s.name}</div>
            <div className="text-xs text-muted">{s.done}/{s.total} quests</div>
            <div className="subj-prog-bar">
              <div className="subj-prog-fill" style={{ background: s.color, width: `${(s.done / s.total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Badges preview */}
      <div className="flex justify-between items-center mb-12">
        <div className="section-title" style={{ marginBottom: 0 }}>My Badges</div>
        <button className="btn-outline" onClick={() => setPage("badges")}>View all</button>
      </div>
      <div className="flex gap-12 mb-24" style={{ overflowX: "auto", paddingBottom: 4 }}>
        {BADGES.filter(b => b.earned).map(b => (
          <div key={b.id} style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 36 }}>{b.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4, color: G.textSub }}>{b.name}</div>
          </div>
        ))}
      </div>

      {/* Quick nav */}
      <div className="grid2">
        <button className="card" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => setPage("leaderboard")}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🏆</div>
          <div className="font-heavy mb-4">Leaderboard</div>
          <div className="text-sm text-muted">You are rank #3 in Odisha</div>
        </button>
        <button className="card" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => { setActiveSubject("math"); setPage("quests"); }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>▶️</div>
          <div className="font-heavy mb-4">Continue Learning</div>
          <div className="text-sm text-muted">Math: Multiplication Maze</div>
        </button>
      </div>
    </div>
  );
}

// ─── QUEST MAP ─────────────────────────────────────────────────────────────────
function QuestMap({ subjectId, setPage, setActiveQuest }) {
  const subject = SUBJECTS.find(s => s.id === subjectId) || SUBJECTS[0];
  const quests  = QUESTS[subjectId] || QUESTS.math;
  return (
    <div className="lesson-wrap">
      <div className="lesson-header">
        <div style={{ fontSize: 28 }}>{subject.icon}</div>
        <div>
          <div className="font-heavy" style={{ fontSize: 18 }}>{subject.name} Quests</div>
          <div className="text-sm text-muted">{subject.done}/{subject.total} complete</div>
        </div>
      </div>
      <div className="quest-list">
        {quests.map((q, i) => {
          const cls = q.done ? "done" : q.locked ? "locked" : "current";
          const icon = q.done ? "✅" : q.locked ? "🔒" : "▶️";
          return (
            <div key={q.id} className={`quest-item ${q.done ? "done" : ""} ${q.locked ? "locked" : ""}`}
              onClick={() => { if (!q.locked) { setActiveQuest(q); setPage("lesson"); } }}>
              <div className={`quest-circle ${cls}`}>{icon}</div>
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
    setTimeout(() => { setPlaying(false); setWatched(true); showToast("Video complete! +10 XP"); }, 2000);
  };

  return (
    <div className="lesson-wrap">
      <div className="lesson-header">
        <button className="btn-outline btn-sm" onClick={() => setPage("quests")}>← Back</button>
        <div className="font-heavy" style={{ fontSize: 17 }}>{quest?.title || "Multiplication Maze"}</div>
      </div>

      {/* Video player mock */}
      <div className="lesson-video">
        <div style={{ position: "absolute", top: 12, left: 16, color: "rgba(255,255,255,.6)", fontSize: 12 }}>
          📹 {quest?.title || "Multiplication Maze"} — Class 6 Math
        </div>
        {!playing ? (
          <div className="play-btn" onClick={handlePlay}>▶</div>
        ) : (
          <div style={{ textAlign: "center", color: G.white }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>⏳</div>
            <div style={{ fontSize: 14 }}>Playing lesson…</div>
          </div>
        )}
        {watched && (
          <div style={{ position: "absolute", top: 12, right: 16 }}>
            <span style={{ background: G.green, color: G.white, fontSize: 11, fontWeight: 700,
              padding: "3px 8px", borderRadius: 20 }}>✓ Watched</span>
          </div>
        )}
        <div style={{ position: "absolute", bottom: 12, left: 16, right: 16,
          height: 4, background: "rgba(255,255,255,.2)", borderRadius: 2 }}>
          {watched && <div style={{ height: 4, background: G.white, borderRadius: 2, width: "100%" }} />}
        </div>
      </div>

      {/* Notes */}
      <div className="lesson-notes mb-20">
        <h3>📝 Key Points</h3>
        <ul>
          <li>Multiplication is repeated addition: 4 × 3 = 4 + 4 + 4 = 12</li>
          <li>Learn tables from 2 to 12 by practising daily</li>
          <li>Use the grid method for larger numbers</li>
          <li>Remember: any number × 0 = 0, any number × 1 = itself</li>
        </ul>
      </div>

      {/* Practice examples */}
      <div className="card mb-20">
        <div className="font-heavy mb-12">Practice Examples</div>
        <div className="grid2">
          {["6 × 7 = 42", "9 × 8 = 72", "12 × 4 = 48", "7 × 11 = 77"].map(ex => (
            <div key={ex} style={{ background: G.grayLight, borderRadius: 8, padding: "10px 14px",
              fontWeight: 700, fontSize: 15 }}>{ex}</div>
          ))}
        </div>
      </div>

      <button className="btn-primary" onClick={() => setPage("quiz")}>
        Take Quiz → (+{quest?.xp || 100} XP)
      </button>
    </div>
  );
}

// ─── QUIZ ──────────────────────────────────────────────────────────────────────
function Quiz({ quest, setPage, showToast, addXP }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUIZ_QUESTIONS[current];

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.ans) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= QUIZ_QUESTIONS.length) {
      setDone(true);
      const earned = Math.round(((score + (selected === q.ans ? 1 : 0)) / QUIZ_QUESTIONS.length) * (quest?.xp || 100));
      showToast(`🎉 Quiz done! +${earned} XP earned`);
      addXP(earned);
    } else {
      setCurrent(c => c + 1);
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
            {pct >= 80 ? "Excellent! 🏆" : pct >= 60 ? "Good job! ⭐" : "Keep practising! 💪"}
          </div>
          <div className="text-muted mb-24">{finalScore}/{QUIZ_QUESTIONS.length} correct</div>
          <div className="flex gap-12" style={{ justifyContent: "center" }}>
            <button className="btn-outline" onClick={() => setPage("quests")}>Back to Quests</button>
            <button className="btn-primary" style={{ width: "auto" }} onClick={() => setPage("dashboard")}>🏠 Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-wrap">
      <div className="flex justify-between items-center mb-12">
        <div className="text-sm text-muted">Question {current + 1}/{QUIZ_QUESTIONS.length}</div>
        <div className="xp-badge">Score: {score}/{current}</div>
      </div>
      <div className="quiz-progress">
        <div className="quiz-progress-fill" style={{ width: `${((current) / QUIZ_QUESTIONS.length) * 100}%` }} />
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
              <span style={{ marginRight: 8, opacity: .5 }}>{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <button className="btn-primary" onClick={handleNext}>
          {current + 1 >= QUIZ_QUESTIONS.length ? "See Results" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

// ─── LEADERBOARD ───────────────────────────────────────────────────────────────
function Leaderboard() {
  return (
    <div>
      <div className="section-title">🏆 Odisha State Leaderboard</div>
      <div className="card-sm mb-16" style={{ background: G.orangeLight, borderColor: G.orange }}>
        <div className="text-sm text-muted mb-4">This week's top learners from across Odisha</div>
        <div className="flex gap-12">
          <span className="tag">🟢 Active now: 1,240 students</span>
          <span className="tag">📅 Resets Sunday</span>
        </div>
      </div>
      {LEADERBOARD.map(r => (
        <div key={r.rank} className={`lb-row ${r.isMe ? "me" : ""}`}>
          <div className="lb-rank">{r.badge}</div>
          <Avatar initials={r.name.split(" ").map(w => w[0]).join("").slice(0,2)}
            color={r.isMe ? G.orange : G.gray} size={36} />
          <div className="lb-name">
            <strong>{r.name} {r.isMe && <span style={{ color: G.orange }}>(You)</span>}</strong>
            <span>🏘️ {r.village} · 🔥 {r.streak} day streak</span>
          </div>
          <div className="lb-xp">{r.xp} XP</div>
        </div>
      ))}
    </div>
  );
}

// ─── BADGES ────────────────────────────────────────────────────────────────────
function Badges() {
  return (
    <div>
      <div className="section-title">🎖️ My Badges</div>
      <div className="card-sm mb-20" style={{ background: G.grayLight }}>
        <div className="font-bold mb-4">{BADGES.filter(b => b.earned).length}/{BADGES.length} earned</div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${(BADGES.filter(b => b.earned).length / BADGES.length) * 100}%` }} />
        </div>
      </div>
      <div className="badge-grid">
        {BADGES.map(b => (
          <div key={b.id} className={`badge-item ${b.earned ? "earned" : "locked-b"}`}>
            <div className="badge-icon">{b.icon}</div>
            <div className="badge-name">{b.name}</div>
            <div style={{ fontSize: 11, color: G.textSub, marginTop: 4 }}>{b.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TEACHER DASHBOARD ────────────────────────────────────────────────────────
function TeacherDashboard({ user }) {
  const active   = TEACHER_STUDENTS.filter(s => s.status === "active").length;
  const atRisk   = TEACHER_STUDENTS.filter(s => s.status === "at-risk").length;
  const inactive = TEACHER_STUDENTS.filter(s => s.status === "inactive").length;

  return (
    <div>
      <div className="card mb-20" style={{ background: "linear-gradient(120deg, #185FA5, #1D9E75)", color: G.white, border: "none" }}>
        <div className="font-heavy mb-4" style={{ fontSize: 20 }}>Teacher Dashboard</div>
        <div className="text-sm mb-16" style={{ opacity: .9 }}>Welcome, {user.name} · {user.village} Village School</div>
        <div className="flex gap-16">
          {[["Total Students", TEACHER_STUDENTS.length],["Active Today", active],["At Risk", atRisk],["Inactive", inactive]].map(([l, v]) => (
            <div key={l} style={{ background: "rgba(255,255,255,.15)", borderRadius: 10, padding: "10px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{v}</div>
              <div style={{ fontSize: 11, opacity: .8 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-title">Student Progress</div>
      {TEACHER_STUDENTS.map((s, i) => (
        <div key={i} className="student-row">
          <Avatar initials={s.name.split(" ").map(w => w[0]).join("").slice(0,2)}
            color={s.status === "active" ? G.green : s.status === "at-risk" ? "#EF9F27" : "#E24B4A"} size={38} />
          <div style={{ flex: 1 }}>
            <div className="font-bold">{s.name}</div>
            <div className="text-xs text-muted">Last seen: {s.lastSeen} · 🔥 {s.streak} day streak · {s.quests}/25 quests</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="font-bold mb-4" style={{ color: G.orange }}>{s.xp} XP</div>
            <span className={`status-badge ${s.status}`}>{s.status === "at-risk" ? "At risk" : s.status}</span>
          </div>
        </div>
      ))}

      <div className="divider" />
      <div className="card" style={{ background: "#FFF4EE", borderColor: G.orange }}>
        <div className="font-heavy mb-8">⚠️ Action Needed</div>
        <div className="text-sm text-muted">
          Bikash Nayak hasn't logged in for 7 days. A WhatsApp reminder has been sent to parents.
          Rohit Das is on a 3-day streak after being inactive — encourage him!
        </div>
      </div>
    </div>
  );
}

// ─── PARENT DASHBOARD ────────────────────────────────────────────────────────
function ParentDashboard({ user }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const xps  = STUDENT_PROGRESS.weeklyXP;
  const maxXP = Math.max(...xps);
  return (
    <div>
      <div className="card mb-20" style={{ background: "linear-gradient(120deg, #534AB7, #185FA5)", color: G.white, border: "none" }}>
        <div className="font-heavy mb-4" style={{ fontSize: 20 }}>Parent Dashboard</div>
        <div className="text-sm mb-4" style={{ opacity: .9 }}>Tracking: Arjun Sahu — Class 6</div>
        <div className="text-sm" style={{ opacity: .7 }}>Village: Kendrapara · Last active: Today, 4:30 PM</div>
      </div>

      <div className="grid2 mb-20">
        {[["Total XP", "⭐ 1580", G.orange], ["Level", "🎮 Level 8", G.purple], ["Streak", "🔥 15 days", G.green], ["Quests", "📚 13/25", G.blue]].map(([l, v, c]) => (
          <div key={l} className="card-sm" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{v}</div>
            <div className="text-xs text-muted">{l}</div>
          </div>
        ))}
      </div>

      <div className="card mb-20">
        <div className="font-heavy mb-16">This Week's XP</div>
        <div className="weekly-bar-wrap">
          {xps.map((xp, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className={`weekly-bar ${i === 6 ? "today" : ""}`}
                style={{ height: `${(xp / maxXP) * 80}px`, width: "100%" }} />
              <div className="weekly-bar-lbl">{days[i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-title">Subject Progress</div>
      {SUBJECTS.map(s => (
        <div key={s.id} className="flex items-center gap-12 mb-12">
          <div style={{ fontSize: 20, width: 28 }}>{s.icon}</div>
          <div style={{ flex: 1 }}>
            <div className="flex justify-between mb-4">
              <span className="font-bold text-sm">{s.name}</span>
              <span className="text-xs text-muted">{s.done}/{s.total} quests</span>
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${(s.done / s.total) * 100}%`, background: s.color }} />
            </div>
          </div>
        </div>
      ))}

      <div className="divider" />
      <div className="card" style={{ background: G.greenLight, borderColor: G.green }}>
        <div className="font-heavy mb-8" style={{ color: G.green }}>✅ Great Progress!</div>
        <div className="text-sm text-muted">
          Arjun has completed 52% of all quests and earned 4 badges this month.
          He's ranked #3 in Odisha. Keep encouraging him!
        </div>
      </div>
    </div>
  );
}

// ─── NAV BAR ──────────────────────────────────────────────────────────────────
function NavBar({ user, page, setPage, xp, onLogout }) {
  const studentTabs = [
    { id: "dashboard", label: "Home" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "badges", label: "Badges" },
  ];

  return (
    <>
      <nav className="nav">
        <div className="nav-logo">🎮 <span>VidyaQuest</span></div>
        {user.role === "student" && (
          <div className="nav-tabs">
            {studentTabs.map(t => (
              <button key={t.id} className={`nav-tab ${page === t.id ? "active" : ""}`}
                onClick={() => setPage(t.id)}>{t.label}</button>
            ))}
          </div>
        )}
        <div className="nav-right">
          {user.role === "student" && (
            <>
              <span className="streak-pill">🔥 15</span>
              <span className="xp-pill">⭐ {xp} XP</span>
            </>
          )}
          <Avatar initials={user.avatar} size={34} />
          <button className="btn-outline btn-sm" onClick={onLogout}>Logout</button>
        </div>
      </nav>
      <div className="xp-bar-global">
        {user.role === "student" && <div className="xp-bar-fill" style={{ width: `${((xp % 200) / 200) * 100}%` }} />}
      </div>
    </>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [activeSubject, setActiveSubject] = useState("math");
  const [activeQuest, setActiveQuest] = useState(QUESTS.math[3]);
  const [xp, setXP] = useState(STUDENT_PROGRESS.xp);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };
  const addXP = (n) => setXP(prev => prev + n);

  const handleLogin = (u) => {
    setUser(u);
    setPage(u.role === "student" ? "dashboard" : u.role === "teacher" ? "teacher" : "parent");
    showToast(`Welcome back, ${u.name.split(" ")[0]}! 👋`);
  };

  const handleLogout = () => { setUser(null); setPage("dashboard"); };

  if (!user) return (
    <>
      <style>{css}</style>
      <Login onLogin={handleLogin} />
      <Toast msg={toast} />
    </>
  );

  const renderPage = () => {
    switch (page) {
      case "dashboard":   return <StudentDashboard user={user} setPage={setPage} setActiveSubject={setActiveSubject} />;
      case "quests":      return <QuestMap subjectId={activeSubject} setPage={setPage} setActiveQuest={setActiveQuest} />;
      case "lesson":      return <Lesson quest={activeQuest} setPage={setPage} showToast={showToast} />;
      case "quiz":        return <Quiz quest={activeQuest} setPage={setPage} showToast={showToast} addXP={addXP} />;
      case "leaderboard": return <Leaderboard />;
      case "badges":      return <Badges />;
      case "teacher":     return <TeacherDashboard user={user} />;
      case "parent":      return <ParentDashboard user={user} />;
      default:            return <StudentDashboard user={user} setPage={setPage} setActiveSubject={setActiveSubject} />;
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <NavBar user={user} page={page} setPage={setPage} xp={xp} onLogout={handleLogout} />
        <main className="main">{renderPage()}</main>
      </div>
      <Toast msg={toast} />
    </>
  );
}
