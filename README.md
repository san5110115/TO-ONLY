# ONLY
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>互动画廊</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <!-- 启动覆盖层：为了保证浏览器允许播放音频并增强参与感 -->
  <div id="start-overlay" class="overlay">
    <div class="start-box">
      <h1>欢迎 — 点击开始体验</h1>
      <p>点击后将开启背景音乐与互动功能，您可以拖动图片重新排版并编辑图片标题。</p>
      <button id="start-btn">点击开始</button>
    </div>
  </div>

  <header class="controls">
    <div class="left">
      <button id="play-pause" title="播放/暂停">播放</button>
      <button id="mute-toggle" title="静音/取消静音">静音</button>
      <label>列数：
        <input id="cols" type="number" min="1" max="6" value="3" />
      </label>
      <button id="save-layout">保存布局 (下载)</button>
      <button id="restore-layout">恢复上次布局</button>
    </div>
    <div class="right">
      <small>主题：黄绿色 • 字体：行书（请参考下方说明添加 webfont）</small>
    </div>
  </header>

  <!-- 音频可视化 -->
  <canvas id="visual" width="800" height="120"></canvas>

  <main>
    <section id="gallery" class="gallery" aria-label="图片画廊">
      <!-- 15 张图片占位：images/img1.jpg ... images/img15.jpg -->
      <!-- 用户可以自行替换图片并编辑标题 -->
      <!-- 每个 caption 可双击编辑（contenteditable） -->
      <!-- 数据-id 用于保存顺序 -->
      <figure class="gallery-item" draggable="true" data-id="1">
        <img src="IMG_2107.JPG" alt="图片 1" />
        <figcaption contenteditable="true">初遇</figcaption>
      </figure>
      <figure class="gallery-item" draggable="true" data-id="2">
        <img src="1.jpg" alt="图片 2" />
        <figcaption contenteditable="true">🌻 花之日</figcaption>
      </figure>
      <figure class="gallery-item" draggable="true" data-id="3">
        <img src="IMG_2605.JPG" alt="图片 3" />
        <figcaption contenteditable="true">🌻 花之日·小猫的睡姿</figcaption>
      </figure>
      <figure class="gallery-item" draggable="true" data-id="4">
        <img src="IMG_2516.JPG" alt="图片 4" />
        <figcaption contenteditable="true">❤️</figcaption>
      </figure>
      <figure class="gallery-item" draggable="true" data-id="5">
        <img src="IMG_2508.JPG" alt="图片 5" />
        <figcaption contenteditable="true">丑丑</figcaption>
      </figure>
      <figure class="gallery-item" draggable="true" data-id="6">
        <img src="IMG_2868.JPG" alt="图片 6" />
        <figcaption contenteditable="true">笼中大鸟</figcaption>
      </figure>
      <figure class="gallery-item" draggable="true" data-id="7">
        <img src="2.jpeg" alt="图片 7" />
        <figcaption contenteditable="true">🌟 小王子·B612</figcaption>
      </figure>
      <figure class="gallery-item" draggable="true" data-id="8">
        <img src="看太阳.jpeg" alt="图片 8" />
        <figcaption contenteditable="true">☀️ 小王子·看太阳</figcaption>
      </figure>
      <figure class="gallery-item" draggable="true" data-id="9">
        <img src="IMG_2423 2.JPG" alt="图片 9" />
        <figcaption contenteditable="true">自由</figcaption>
      </figure>
      <figure class="gallery-item" draggable="true" data-id="10">
        <img src="3.JPG" alt="图片 10" />
        <figcaption contenteditable="true">🍀 四叶草</figcaption>
      </figure>
      <figure class="gallery-item" draggable="true" data-id="11">
        <img src="4.JPG" alt="图片 11" />
        <figcaption contenteditable="true">💫 INFP & ISTJ</figcaption>
      </figure>
      <figure class="gallery-item" draggable="true" data-id="12">
        <img src="IMG_2891.JPG" alt="图片 12" />
        <figcaption contenteditable="true">小手办 & 小猫</figcaption>
      </figure>
      <figure class="gallery-item" draggable="true" data-id="13">
        <img src="5.JPG alt="图片 13" />
        <figcaption contenteditable="true">📸 偷拍</figcaption>
      </figure>
      <figure class="gallery-item" draggable="true" data-id="14">
        <img src="6.JPG" alt="图片 14" />
        <figcaption contenteditable="true">😴 睡觉时间到</figcaption>
      </figure>
      <figure class="gallery-item" draggable="true" data-id="15">
        <img src="7.JPG" alt="图片 15" />
        <figcaption contenteditable="true">训练程子</figcaption>
      </figure>
    </section>
  </main>

  <footer class="footer">
    <p>提示：双击标题直接编辑；拖动图片可改变顺序；列数可调整；布局可以保存为文件并在下次恢复。</p>
  </footer>

  <!-- 隐藏的音频元素（不要直接 autoplay，使用用户手势控制 playback） -->
  <audio id="bg-audio" src="music.mp3" loop crossorigin="anonymous"></audio>

  <script src="script.js"></script>
</body>
</html>
