// 照片数据
const photosData = [
  { src: 'IMG_2107.JPG', caption: '初遇' },
  { src: '1.jpg', caption: '🌻 花之日' },
  { src: 'IMG_2605.JPG', caption: '🌻 花之日·小猫的睡姿' },
  { src: 'IMG_2516.JPG', caption: '❤️' },
  { src: 'IMG_2508.JPG', caption: '丑丑' },
  { src: 'IMG_2868.JPG', caption: '笼中大鸟' },
  { src: '2.jpeg', caption: '🌟 小王子·B612' },
  { src: '看太阳.jpeg', caption: '☀️ 小王子·看太阳' },
  { src: 'IMG_2423 2.JPG', caption: '自由' },
  { src: '3.JPG', caption: '🍀 四叶草' },
  { src: '4.JPG', caption: '💫 INFP & ISTJ' },
  { src: 'IMG_2891.JPG', caption: '小手办 & 小猫' },
  { src: '5.JPG', caption: '📸 偷拍' },
  { src: '6.JPG', caption: '😴 睡觉时间到' },
  { src: '7.JPG', caption: '训练程子' }
];

// 关卡定义
const levels = [
  {
    name: '关卡1：记忆翻牌🎴',
    description: '找出所有匹配的卡片对（共6对）',
    type: 'memory',
    hints: ['需要找到配对的卡片', '每张卡片代表一个数字'],
    data: {
      pairs: [
        { id: 1, emoji: '🌻' }, { id: 1, emoji: '🌻' },
        { id: 2, emoji: '🎂' }, { id: 2, emoji: '🎂' },
        { id: 3, emoji: '💕' }, { id: 3, emoji: '💕' },
        { id: 4, emoji: '🎉' }, { id: 4, emoji: '🎉' },
        { id: 5, emoji: '✨' }, { id: 5, emoji: '✨' },
        { id: 6, emoji: '🎁' }, { id: 6, emoji: '🎁' }
      ]
    }
  },
  {
    name: '关卡2：打字挑战⌨️',
    description: '快速打出以下文字（限时10秒）',
    type: 'typing',
    hints: ['放松心态，一个字一个字打', '检查你的打字速度'],
    data: { text: '生日快乐彼小猫', timeLimit: 10 }
  },
  {
    name: '关卡3：打字挑战⌨️',
    description: '快速打出以下文字（限时8秒）',
    type: 'typing',
    hints: ['速度在提升', '保持专注'],
    data: { text: '愿长欢乐', timeLimit: 8 }
  },
  {
    name: '关卡4：打字挑战⌨️',
    description: '快速打出以下文字（限时7秒）',
    type: 'typing',
    hints: ['越来越快了', '你可以的'],
    data: { text: '瞌睡猫', timeLimit: 7 }
  },
  {
    name: '关卡5：数学闯关🧮',
    description: '解答5个数学题（每题限时5秒）',
    type: 'math',
    hints: ['仔细计算', '不要急，检查答案'],
    data: {
      questions: [
        { q: '2 + 2 = ?', answer: '4' },
        { q: '10 - 3 = ?', answer: '7' },
        { q: '5 × 3 = ?', answer: '15' },
        { q: '20 ÷ 4 = ?', answer: '5' },
        { q: '程子的生日（月+日）+彼的生日（月+日）+ 1 = ?', answer: '22' }
      ],
      timeLimit: 5
    }
  },
  {
    name: '关卡6：选择题🎯',
    description: '选择正确答案',
    type: 'quiz',
    hints: ['想想回忆中的细节', '相信你的直觉'],
    data: {
      questions: [
        { q: '程曾经问小猫"程的口头禅是什么？"小猫的回答是？', options: ['👀', '😂', '🤔', '😎'], answer: 0 },
        { q: '程子曾经的朋友"看月亮🌙"的发生地在？', options: ['蝴蝶平原', '荧光森林', '星光沙漠', '静谧庭院'], answer: 2 },
        { q: '你们认识多久了？', options: ['六个月', '152天', '194天', '更久'], answer: 2 },
        { q: '彼跟程第一次添加除了光遇意外的联系方式的时间是？', options: ['2025年12月', '2026年1月', '2026年2月', '2026年3月'], answer: 1 },
        { q: '程的性格类型是？', options: ['INFP', 'ENFP', 'ISTJ', 'ESTP'], answer: 2 }
      ]
    }
  }
];

// 游戏状态和全局变量
let currentLevel = 0;
let gameState = {};
let audioCtx, analyser, source, bufferLength, dataArray;

function createPlaceholderSrc(label) {
  const text = String(label || '照片').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
    <rect width="100%" height="100%" fill="#f2f8e8"/>
    <rect x="18" y="18" width="364" height="264" rx="18" fill="#ffffff" stroke="#aacb8c" stroke-width="2"/>
    <circle cx="132" cy="118" r="44" fill="#f8d9a4"/>
    <path d="M90 214c18-44 58-68 96-68s78 24 96 68" fill="#9fcf7f"/>
    <text x="200" y="268" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#4e6b3e">${text}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// DOM 元素变量
let startOverlay, startBtn, gameContainer, gameContent, levelTitle, levelDescription, progressFill;
let hintBtn, restartLevelBtn, audio, galleryContainer, galleryHeader, galleryFooter, gallery;
let canvas, ctx, playBtn, muteBtn, colsInput, saveBtn, restoreBtn;

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 获取所有 DOM 元素
  startOverlay = document.getElementById('start-overlay');
  startBtn = document.getElementById('start-btn');
  gameContainer = document.getElementById('game-container');
  gameContent = document.getElementById('game-content');
  levelTitle = document.getElementById('level-title');
  levelDescription = document.getElementById('level-description');
  progressFill = document.getElementById('progress-fill');
  hintBtn = document.getElementById('hint-btn');
  restartLevelBtn = document.getElementById('restart-level-btn');
  audio = document.getElementById('bg-audio');
  galleryContainer = document.getElementById('gallery-container');
  galleryHeader = document.getElementById('gallery-header');
  galleryFooter = document.getElementById('gallery-footer');
  gallery = document.getElementById('gallery');
  canvas = document.getElementById('visual');
  ctx = canvas.getContext('2d');
  playBtn =     document.getElementById('play-pause');
  muteBtn = document.getElementById('mute-toggle');
  colsInput = document.getElementById('cols');
  saveBtn = document.getElementById('save-layout');
  restoreBtn = document.getElementById('restore-layout');

  // 初始化游戏状态
  gameState = { completedLevels: parseInt(localStorage.getItem('completedLevels') || '0') };

  // 绑定开始按钮
  startBtn.addEventListener('click', async () => {
    startOverlay.style.display = 'none';
    gameContainer.style.display = 'block';
    await startAudio();
    initLevel(0);
  });

  // 监听用户交互
  document.addEventListener('pointerdown', () => { startAudio(); }, { once: true });
  document.addEventListener('keydown', () => { startAudio(); }, { once: true });
});

// 启动音频
async function startAudio() {
  if (!audio.paused) return;
  try {
    await audio.play();
    playBtn.textContent = '⏸ 暂停';
  } catch (e) {
    console.warn('audio play failed', e);
  }
}

// 初始化关卡
function initLevel(levelIndex) {
  if (levelIndex >= levels.length) {
    showGallery();
    return;
  }

  currentLevel = levelIndex;
  const level = levels[levelIndex];
  
  levelTitle.textContent = level.name;
  levelDescription.textContent = level.description;
  updateProgress();
  gameContent.innerHTML = '';

  switch (level.type) {
    case 'memory':
      initMemoryGame();
      break;
    case 'typing':
      initTypingGame();
      break;
    case 'math':
      initMathGame();
      break;
    case 'quiz':
      initQuizGame();
      break;
    case 'rhythm':
      initRhythmGame();
      break;
  }
}

// 更新进度条
function updateProgress() {
  const percent = ((currentLevel + 1) / levels.length) * 100;
  progressFill.style.width = percent + '%';
}

// 完成关卡
function completeLevel() {
  gameState.completedLevels = currentLevel + 1;
  localStorage.setItem('completedLevels', gameState.completedLevels);
  
  const celebration = document.createElement('div');
  celebration.className = 'celebration';
  celebration.innerHTML = '<h3>🎉 恭喜闯关成功！</h3>';
  gameContent.appendChild(celebration);
  
  setTimeout(() => {
    initLevel(currentLevel + 1);
  }, 1500);
}

// 关卡1：记忆翻牌
function initMemoryGame() {
  const level = levels[currentLevel];
  const pairs = level.data.pairs.sort(() => Math.random() - 0.5);
  let matched = 0;
  let firstCard = null;
  let locked = false;

  const board = document.createElement('div');
  board.className = 'memory-board';
  gameContent.appendChild(board);

  pairs.forEach((pair) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.innerHTML = '<span>?</span>';
    card.dataset.id = pair.id;
    card.dataset.emoji = pair.emoji;

    card.addEventListener('click', () => {
      if (locked || card.classList.contains('flipped') || card === firstCard) return;

      card.classList.add('flipped');
      card.innerHTML = `<span>${pair.emoji}</span>`;

      if (!firstCard) {
        firstCard = card;
        return;
      }

      locked = true;
      const secondCard = card;

      if (firstCard.dataset.id === secondCard.dataset.id) {
        matched++;
        firstCard = null;
        locked = false;

        if (matched === level.data.pairs.length / 2) {
          completeLevel();
        }
      } else {
        setTimeout(() => {
          firstCard.classList.remove('flipped');
          firstCard.innerHTML = '<span>?</span>';
          secondCard.classList.remove('flipped');
          secondCard.innerHTML = '<span>?</span>';
          firstCard = null;
          locked = false;
        }, 800);
      }
    });

    board.appendChild(card);
  });

  hintBtn.onclick = () => alert(level.hints[0]);
  restartLevelBtn.onclick = () => initLevel(currentLevel);
}

// 关卡2/3/4：打字挑战
function initTypingGame() {
  const level = levels[currentLevel];
  const targetText = level.data.text;
  const timeLimit = level.data.timeLimit || 30;
  
  const container = document.createElement('div');
  container.className = 'typing-container';
  
  const targetDisplay = document.createElement('p');
  targetDisplay.className = 'typing-target';
  targetDisplay.textContent = targetText;
  
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'typing-input';
  input.placeholder = '在这里输入...';
  input.autofocus = true;
  
  const timer = document.createElement('p');
  timer.className = 'typing-timer';
  timer.textContent = `剩余时间: ${timeLimit}秒`;
  
  let timeLeft = timeLimit;
  const timerInterval = setInterval(() => {
    timeLeft--;
    timer.textContent = `剩余时间: ${timeLeft}秒`;
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert('时间到！没有完成，重新开始');
      initLevel(currentLevel);
      return;
    }
  }, 1000);

  input.addEventListener('input', (e) => {
    if (e.target.value === targetText) {
      clearInterval(timerInterval);
      completeLevel();
    }
  });

  container.appendChild(targetDisplay);
  container.appendChild(timer);
  container.appendChild(input);
  gameContent.appendChild(container);

  hintBtn.onclick = () => alert(level.hints[0]);
  restartLevelBtn.onclick = () => {
    clearInterval(timerInterval);
    initLevel(currentLevel);
  };
}

// 关卡5：数学挑战（支持每题限时）
function initMathGame() {
  const level = levels[currentLevel];
  const questions = level.data.questions;
  const questionTimeLimit = level.data.timeLimit || 0;
  let currentQuestion = 0;
  let questionTimer = null;

  function showQuestion() {
    gameContent.innerHTML = '';
    const q = questions[currentQuestion];
    
    const container = document.createElement('div');
    container.className = 'quiz-container';
    
    const progress = document.createElement('p');
    progress.className = 'quiz-progress';
    progress.textContent = `第 ${currentQuestion + 1} / ${questions.length} 题`;
    
    const question = document.createElement('h3');
    question.textContent = q.q;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '输入答案';
    input.autofocus = true;
    
    // 如果有限时，显示计时器
    let timer = null;
    if (questionTimeLimit > 0) {
      timer = document.createElement('p');
      timer.className = 'typing-timer';
      timer.textContent = `剩余时间: ${questionTimeLimit}秒`;
      
      let timeLeft = questionTimeLimit;
      questionTimer = setInterval(() => {
        timeLeft--;
        timer.textContent = `剩余时间: ${timeLeft}秒`;
        
        if (timeLeft <= 0) {
          clearInterval(questionTimer);
          alert('时间到！该题已超时，重新开始');
          initLevel(currentLevel);
          return;
        }
      }, 1000);
    }
    
    const submitBtn = document.createElement('button');
    submitBtn.textContent = '提交';
    submitBtn.className = 'quiz-btn';
    
    submitBtn.addEventListener('click', () => {
      if (questionTimer) clearInterval(questionTimer);
      
      if (input.value === q.answer) {
        currentQuestion++;
        if (currentQuestion >= questions.length) {
          completeLevel();
        } else {
          showQuestion();
        }
      } else {
        alert('答案错误，请重试');
        input.value = '';
        input.focus();
      }
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') submitBtn.click();
    });

    container.appendChild(progress);
    container.appendChild(question);
    if (timer) container.appendChild(timer);
    container.appendChild(input);
    container.appendChild(submitBtn);
    gameContent.appendChild(container);
  }

  showQuestion();
  hintBtn.onclick = () => alert(level.hints[0]);
  restartLevelBtn.onclick = () => {
    if (questionTimer) clearInterval(questionTimer);
    initLevel(currentLevel);
  };
}

// 关卡6：选择题
function initQuizGame() {
  const level = levels[currentLevel];
  const questions = level.data.questions;
  let currentQuestion = 0;

  function showQuestion() {
    gameContent.innerHTML = '';
    const q = questions[currentQuestion];
    
    const container = document.createElement('div');
    container.className = 'quiz-container';
    
    const progress = document.createElement('p');
    progress.className = 'quiz-progress';
    progress.textContent = `第 ${currentQuestion + 1} / ${questions.length} 题`;
    
    const question = document.createElement('h3');
    question.textContent = q.q;
    
    const options = document.createElement('div');
    options.className = 'quiz-options';
    
    if (q.isMultiSelect) {
      // 多选题
      let selectedIndices = new Set();
      
      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.textContent = opt;
        btn.dataset.index = idx;
        
        btn.addEventListener('click', () => {
          if (selectedIndices.has(idx)) {
            selectedIndices.delete(idx);
            btn.classList.remove('selected');
          } else {
            if (selectedIndices.size >= q.needToSelect) {
              alert(`请只选择 ${q.needToSelect} 个选项`);
              return;
            }
            selectedIndices.add(idx);
            btn.classList.add('selected');
          }
          
          // 更新计数
          const countDisplay = document.getElementById('selection-count');
          if (countDisplay) {
            countDisplay.textContent = `已选: ${selectedIndices.size} / ${q.needToSelect}`;
          }
          
          // 选满后自动检查
          if (selectedIndices.size === q.needToSelect) {
            const allCorrect = Array.from(selectedIndices).every(i => q.answer.includes(i));
            if (allCorrect) {
              setTimeout(() => {
                currentQuestion++;
                if (currentQuestion >= questions.length) {
                  completeLevel();
                } else {
                  showQuestion();
                }
              }, 500);
            } else {
              alert('选择错误，请重新选择');
              selectedIndices.clear();
              document.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('selected'));
              const cd = document.getElementById('selection-count');
              if (cd) cd.textContent = `已选: 0 / ${q.needToSelect}`;
            }
          }
        });
        
        options.appendChild(btn);
      });
      
      const countDisplay = document.createElement('p');
      countDisplay.id = 'selection-count';
      countDisplay.className = 'selection-count';
      countDisplay.textContent = `已选: 0 / ${q.needToSelect}`;
      
      container.appendChild(progress);
      container.appendChild(question);
      container.appendChild(options);
      container.appendChild(countDisplay);
    } else {
      // 单选题
      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.textContent = opt;
        
        btn.addEventListener('click', () => {
          if (idx === q.answer) {
            currentQuestion++;
            if (currentQuestion >= questions.length) {
              completeLevel();
            } else {
              showQuestion();
            }
          } else {
            alert('答案错误，请重试');
          }
        });
        
        options.appendChild(btn);
      });
      
      container.appendChild(progress);
      container.appendChild(question);
      container.appendChild(options);
    }
    
    gameContent.appendChild(container);
  }

  showQuestion();
  hintBtn.onclick = () => alert(level.hints[0]);
  restartLevelBtn.onclick = () => initLevel(currentLevel);
}

// 关卡节奏游戏（预留但未使用）
function initRhythmGame() {
  const level = levels[currentLevel];
  const targetClicks = level.data.targetClicks || 10;
  let clickCount = 0;

  const container = document.createElement('div');
  container.className = 'rhythm-container';
  
  const counter = document.createElement('p');
  counter.className = 'rhythm-counter';
  counter.textContent = `点击次数: ${clickCount} / ${targetClicks}`;
  
  const clickArea = document.createElement('div');
  clickArea.className = 'rhythm-click-area';
  clickArea.textContent = '点击这里！';
  
  clickArea.addEventListener('click', () => {
    clickCount++;
    counter.textContent = `点击次数: ${clickCount} / ${targetClicks}`;
    
    clickArea.style.transform = 'scale(0.95)';
    setTimeout(() => {
      clickArea.style.transform = 'scale(1)';
    }, 100);
    
    if (clickCount >= targetClicks) {
      completeLevel();
    }
  });

  container.appendChild(counter);
  container.appendChild(clickArea);
  gameContent.appendChild(container);

  hintBtn.onclick = () => alert(level.hints[0]);
  restartLevelBtn.onclick = () => initLevel(currentLevel);
}

function ensureZoomOverlay() {
  if (document.getElementById('image-zoom-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'image-zoom-overlay';
  overlay.className = 'image-zoom-overlay';
  overlay.innerHTML = `
    <div class="image-zoom-panel" role="dialog" aria-modal="true" aria-label="图片放大预览">
      <button class="image-zoom-close" type="button" aria-label="关闭">×</button>
      <img class="image-zoom-image" src="" alt="" />
      <p class="image-zoom-caption"></p>
    </div>`;

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeImageZoom();
  });
  overlay.querySelector('.image-zoom-close').addEventListener('click', closeImageZoom);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeImageZoom();
  });

  document.body.appendChild(overlay);
}

function openImageZoom(src, caption) {
  ensureZoomOverlay();
  const overlay = document.getElementById('image-zoom-overlay');
  const zoomImage = overlay.querySelector('.image-zoom-image');
  const zoomCaption = overlay.querySelector('.image-zoom-caption');

  zoomImage.src = src;
  zoomImage.alt = caption || '放大图片';
  zoomCaption.textContent = caption || '';
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeImageZoom() {
  const overlay = document.getElementById('image-zoom-overlay');
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function createGalleryFigure({ src, caption, id }) {
  const figure = document.createElement('figure');
  figure.className = 'gallery-item';
  figure.draggable = true;
  figure.dataset.id = id;

  const img = document.createElement('img');
  img.src = src;
  img.alt = `图片 ${id}`;
  img.onerror = function () {
    this.onerror = null;
    this.src = createPlaceholderSrc(caption || src);
  };
  img.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    openImageZoom(img.currentSrc || img.src, caption);
  });

  const figcaption = document.createElement('figcaption');
  figcaption.contentEditable = true;
  figcaption.textContent = caption;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  return figure;
}

// 显示画廊
function showGallery() {
  gameContainer.style.display = 'none';
  galleryContainer.style.display = 'block';
  galleryHeader.style.display = 'flex';
  galleryFooter.style.display = 'block';
  canvas.style.display = 'block';

  gallery.innerHTML = '';
  photosData.forEach((photo, index) => {
    const figure = createGalleryFigure({
      src: photo.src,
      caption: photo.caption,
      id: index + 1
    });
    gallery.appendChild(figure);
  });

  setupGalleryFeatures();
  initAudioViz();
}

// 画廊功能
function setupGalleryFeatures() {
  let dragEl = null;

  function setCols(n) {
    document.documentElement.style.setProperty('--cols', n);
  }
  setCols(colsInput.value);
  colsInput.addEventListener('input', e => setCols(e.target.value));

  gallery.addEventListener('dragstart', e => {
    const fig = e.target.closest('.gallery-item');
    if (!fig) return;
    dragEl = fig;
    e.dataTransfer.effectAllowed = 'move';
  });

  gallery.addEventListener('dragover', e => {
    e.preventDefault();
    const over = e.target.closest('.gallery-item');
    if (!over || over === dragEl) return;
    const rect = over.getBoundingClientRect();
    const after = (e.clientY - rect.top) > (rect.height / 2);
    if (after) over.parentNode.insertBefore(dragEl, over.nextSibling);
    else over.parentNode.insertBefore(dragEl, over);
  });

  gallery.addEventListener('dragend', () => {
    updateDataIds();
    saveLayoutToLocal();
  });

  function updateDataIds() {
    [...gallery.children].forEach((fig, i) => fig.setAttribute('data-id', i + 1));
  }

  function getLayout() {
    return [...gallery.children].map(fig => ({
      id: fig.getAttribute('data-id'),
      caption: fig.querySelector('figcaption')?.textContent || '',
      src: fig.querySelector('img')?.getAttribute('src') || ''
    }));
  }

  function saveLayoutToLocal() {
    localStorage.setItem('galleryLayout', JSON.stringify(getLayout()));
  }

  saveBtn.addEventListener('click', () => {
    const data = JSON.stringify(getLayout(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gallery-layout.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    saveLayoutToLocal();
  });

  restoreBtn.addEventListener('click', () => {
    const raw = localStorage.getItem('galleryLayout');
    if (!raw) {
      alert('没有已保存的布局');
      return;
    }
    try {
      const layout = JSON.parse(raw);
      applyLayout(layout);
      updateDataIds();
    } catch (e) {
      console.error(e);
      alert('恢复失败');
    }
  });

  function applyLayout(layout) {
    gallery.innerHTML = '';
    layout.forEach(item => {
      const fig = createGalleryFigure({
        src: item.src,
        caption: item.caption || '',
        id: item.id
      });
      gallery.appendChild(fig);
    });
  }

  gallery.addEventListener('focusout', e => {
    if (e.target.tagName === 'FIGCAPTION') {
      saveLayoutToLocal();
    }
  });

  audio.addEventListener('play', () => { playBtn.textContent = '⏸ 暂停'; });
  audio.addEventListener('pause', () => { playBtn.textContent = '▶️ 播放'; });

  playBtn.addEventListener('click', async () => {
    if (audio.paused) {
      await startAudio();
    } else {
      audio.pause();
    }
  });

  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? '🔇 取消静音' : '🔊 静音';
  });

  window.addEventListener('beforeunload', saveLayoutToLocal);
}

// 音频可视化
function initAudioViz() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    draw();
  } catch (e) {
    console.warn('AudioContext init failed', e);
  }
}

function draw() {
  requestAnimationFrame(draw);
  if (!analyser) return;
  analyser.getByteFrequencyData(dataArray);
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const barWidth = w / bufferLength;
  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 255;
    const x = i * barWidth;
    const y = h * v;
    ctx.fillStyle = `hsl(${120 * v},60%,50%)`;
    ctx.fillRect(x, h - y, barWidth * 0.9, y);
  }
}

