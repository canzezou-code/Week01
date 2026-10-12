import { useCallback, useEffect, useRef, useState } from "react";

const classroomPhoto =
  "https://images.unsplash.com/photo-1788882680471-86ba7f651dac?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1800";
const sunlightPhoto =
  "https://images.unsplash.com/photo-1614590474556-801972bd1b93?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1800";

const songLines = [
  { word: "Doe", line: "a deer, a female deer", note: "一只鹿，一只母鹿", sound: "/doʊ/" },
  { word: "Ray", line: "a drop of golden sun", note: "一滴金色的阳光", sound: "/reɪ/" },
  { word: "Me", line: "a name I call myself", note: "我称呼自己的名字", sound: "/miː/" },
  { word: "Far", line: "a long, long way to run", note: "一段很长很长的路", sound: "/fɑːr/" },
  { word: "Sew", line: "a needle pulling thread", note: "针牵引着线", sound: "/soʊ/" },
];

const sounds = [
  { sound: "/θ/", text: "舌尖轻触上齿背，送气，声带不振动", example: "thread", cue: "AIR" },
  { sound: "/ð/", text: "舌尖轻触上齿背，送气，声带振动", example: "the", cue: "VOICE" },
  { sound: "/ɑːr/", text: "嘴巴张大，结尾记得卷舌", example: "far", cue: "OPEN" },
  { sound: "/ɔː/", text: "嘴唇收圆，拉长发音", example: "long", cue: "ROUND" },
  { sound: "/ʊ/", text: "嘴放松，短音，不要读成 /uː/", example: "pulling", cue: "SHORT" },
  { sound: "/dʒ/", text: "类似轻轻读“知”，短促", example: "deer", cue: "QUICK" },
  { sound: "/oʊ/", text: "嘴唇由圆慢慢向前滑动，连贯滑音", example: "sew", cue: "GLIDE" },
];

const darkPages = new Set([0, 7, 8, 9, 10, 11, 12, 13, 16, 17]);

type ArrowProps = { direction: "up" | "down" };

function Arrow({ direction }: ArrowProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d={direction === "up" ? "m5 15 7-7 7 7" : "m5 9 7 7 7-7"}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MusicMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40">
      <path
        d="M27.5 6.5v21.2c0 3-2.7 5.5-6 5.5s-6-2-6-4.8 2.7-5 6-5c1.1 0 2.1.2 3 .6V11l-12 2.6v10.2c0 3-2.7 5.5-6 5.5s-6-2-6-4.8 2.7-5 6-5c1.1 0 2.1.2 3 .6V10.8L27.5 6.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function App() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const locked = useRef(false);
  const touchStart = useRef(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const total = 18;

  const startAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.paused) return;
    audio.muted = false;
    audio.volume = 1;
    void audio.play().catch(() => undefined);
  }, []);

  useEffect(() => {
    startAudio();
    const retry = () => startAudio();
    window.addEventListener("pointerdown", retry, { once: true });
    window.addEventListener("keydown", retry, { once: true });
    return () => {
      window.removeEventListener("pointerdown", retry);
      window.removeEventListener("keydown", retry);
    };
  }, [startAudio]);

  const goTo = useCallback(
    (next: number) => {
      const target = Math.max(0, Math.min(total - 1, next));
      if (target === page || locked.current) return;
      setDirection(target > page ? 1 : -1);
      setPage(target);
      locked.current = true;
      window.setTimeout(() => {
        locked.current = false;
      }, 850);
    },
    [page],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "PageDown") goTo(page + 1);
      if (event.key === "ArrowUp" || event.key === "PageUp") goTo(page - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, page]);

  return (
    <main
      className="lesson"
      onWheel={(event) => {
        if (Math.abs(event.deltaY) < 18) return;
        goTo(page + (event.deltaY > 0 ? 1 : -1));
      }}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientY;
      }}
      onTouchEnd={(event) => {
        const delta = touchStart.current - event.changedTouches[0].clientY;
        if (Math.abs(delta) > 45) goTo(page + (delta > 0 ? 1 : -1));
      }}
    >
      <audio
        className="lesson-audio"
        ref={audioRef}
        src="/audio/lesson-14.m4a"
        autoPlay
        loop
        playsInline
        preload="auto"
        onCanPlay={startAudio}
      >
        您的浏览器不支持音频播放。
      </audio>

      <header className={`topbar ${darkPages.has(page) ? "on-dark" : ""}`}>
        <div className="brand"><span className="brand-mark"><MusicMark /></span><span>VOICE LAB</span></div>
        <div className="lesson-label"><span>WEEK 01</span><i /><span>LESSON 14</span></div>
      </header>

      <section className={`page page-cover ${page === 0 ? "is-active" : ""}`} aria-hidden={page !== 0}>
        <img src={classroomPhoto} alt="老师弹着吉他，和孩子们一起上音乐课" />
        <div className="cover-shade" /><div className="cover-orbit orbit-one" /><div className="cover-orbit orbit-two" />
        <div className="cover-content">
          <p className="eyebrow light">A NEW VOICE BEGINS HERE</p>
          <h1>唱出第一声<br /><em>遇见发音的乐趣</em></h1>
          <div className="cover-meta">
            <div><strong>40</strong><span>分钟沉浸课堂</span></div>
            <div><strong>05</strong><span>句经典旋律</span></div>
            <div><strong>07</strong><span>个重点发音</span></div>
          </div>
        </div>
        <p className="photo-credit">Photo by Yegor Makarenko / Unsplash</p>
      </section>

      <section className={`page page-song ${page === 1 ? "is-active" : ""}`} aria-hidden={page !== 1}>
        <div className="sun-photo"><img src={sunlightPhoto} alt="温暖夕阳下的草地" /><span className="sun-index">01</span></div>
        <div className="song-content">
          <p className="eyebrow">ORIGINAL · 原文听读</p>
          <h2>先听见旋律，<br />再读懂每一句。</h2>
          <div className="lyrics compact">
            {songLines.map((item, index) => <div className="lyric" key={item.word}><span>0{index + 1}</span><strong>{item.word}</strong><p>{item.line}</p></div>)}
          </div>
        </div>
      </section>

      {songLines.map((item, index) => {
        const pageIndex = index + 2;
        return (
          <section className={`page page-word word-${index + 1} ${page === pageIndex ? "is-active" : ""}`} aria-hidden={page !== pageIndex} key={item.word}>
            <div className="word-number">0{index + 1}</div>
            <div className="word-main">
              <p className="eyebrow">LYRIC · 逐句精读</p>
              <span className="word-sound">{item.sound}</span>
              <h2>{item.word}</h2>
              <p className="word-line">{item.line}</p>
            </div>
            <div className="word-note"><span>MEANING</span><p>{item.note}</p><i /></div>
            <div className="word-beat">LISTEN&nbsp;&nbsp;·&nbsp;&nbsp;SPEAK&nbsp;&nbsp;·&nbsp;&nbsp;SING</div>
          </section>
        );
      })}

      {sounds.map((item, index) => {
        const pageIndex = index + 7;
        return (
          <section className={`page page-sound-focus sound-tone-${index % 3} ${page === pageIndex ? "is-active" : ""}`} aria-hidden={page !== pageIndex} key={item.sound}>
            <div className="sound-ghost">{item.sound}</div>
            <div className="sound-focus-copy">
              <p className="eyebrow light">SOUND 0{index + 1} · 发音训练</p>
              <span className="sound-cue">{item.cue}</span>
              <h2>{item.sound}</h2>
              <p>{item.text}</p>
            </div>
            <div className="example-chip"><span>EXAMPLE</span><strong>{item.example}</strong></div>
            <div className="mouth-guide"><i /><i /><i /><span>慢慢读三遍</span></div>
          </section>
        );
      })}

      <section className={`page page-practice ${page === 14 ? "is-active" : ""}`} aria-hidden={page !== 14}>
        <div className="practice-copy"><p className="eyebrow">PRACTICE 01 · 连读挑战</p><h2>让长句，<br />自然地流动。</h2><p className="intro">先按音组停顿，再逐步连成完整的一句。</p><div className="tempo"><span>SLOW</span><i /><i /><i /><i /><span>FLOW</span></div></div>
        <div className="practice-lines single"><div className="phrase-card coral"><span>FAR · FOLLOW THE BEAT</span><p>Far <b>/fɑːr/</b> a <b>/ə/</b> long <b>/lɔːŋ/</b>,<br />long <b>/lɔːŋ/</b> way <b>/weɪ/</b> to <b>/tuː/</b> run <b>/rʌn/</b></p></div></div>
      </section>

      <section className={`page page-practice practice-second ${page === 15 ? "is-active" : ""}`} aria-hidden={page !== 15}>
        <div className="practice-copy"><p className="eyebrow">PRACTICE 02 · 连读挑战</p><h2>轻一点，<br />把词牵起来。</h2><p className="intro">注意短音 /ʊ/ 和结尾 /θ/，气流不要中断。</p><div className="tempo"><span>SLOW</span><i /><i /><i /><i /><span>FLOW</span></div></div>
        <div className="practice-lines single"><div className="phrase-card butter"><span>SEW · FOLLOW THE BEAT</span><p>Sew <b>/soʊ/</b> a <b>/ə/</b> needle <b>/ˈniːdl/</b><br />pulling <b>/ˈpʊlɪŋ/</b> thread <b>/θred/</b></p></div></div>
      </section>

      <section className={`page page-plan ${page === 16 ? "is-active" : ""}`} aria-hidden={page !== 16}>
        <div className="plan-top"><p className="eyebrow light">WEEK ONE · 课程计划</p><h2>40 分钟，<br />完成一次声音探索。</h2></div>
        <div className="timeline">
          <div className="timeline-item main-time"><span>30</span><small>MIN</small><div><strong>新课教学</strong><p>歌词理解 · 音标拆解 · 句子连读</p></div></div>
          <div className="timeline-item"><span>05</span><small>MIN</small><div><strong>自主练习</strong><p>从慢到快，找到自己的声音</p></div></div>
          <div className="timeline-item"><span>05</span><small>MIN</small><div><strong>完整演唱</strong><p>把发音放进旋律，大胆唱出来</p></div></div>
        </div>
        <div className="final-note"><span>LESSON 14</span><p>第一周，不追求完美。<br /><strong>只需要勇敢地发出声音。</strong></p></div>
      </section>

      <section className={`page page-finale ${page === 17 ? "is-active" : ""}`} aria-hidden={page !== 17}>
        <div className="finale-rings"><i /><i /><i /></div>
        <div className="finale-copy"><p className="eyebrow light">NOW, SING IT OUT</p><h2>准备好了吗？<br /><em>从第一句开始。</em></h2><p>听 · 读 · 唱<br />让今天练习的每一个音，都回到旋律里。</p><button type="button" onClick={() => { if (audioRef.current) { audioRef.current.currentTime = 0; startAudio(); } }}>重新播放课程音频</button></div>
        <div className="finale-words">DOE · RAY · ME · FAR · SEW</div>
      </section>

      <nav className={`page-nav ${darkPages.has(page) ? "" : "on-light"}`} aria-label="页面导航">
        <button aria-label="上一页" disabled={page === 0} onClick={() => goTo(page - 1)}><Arrow direction="up" /></button>
        <div className="page-count"><strong>{String(page + 1).padStart(2, "0")}</strong><span /><small>{String(total).padStart(2, "0")}</small></div>
        <button aria-label="下一页" disabled={page === total - 1} onClick={() => goTo(page + 1)}><Arrow direction="down" /></button>
      </nav>
      <div className={`page-fold ${direction > 0 ? "fold-down" : "fold-up"}`} key={page} />
    </main>
  );
}

export default App;
