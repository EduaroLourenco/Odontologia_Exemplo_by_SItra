// Renderiza apresentacao.html em MP4 (1080x1920, 30 fps) com Chrome headless + ffmpeg.
// uso: node renderizar.js apresentacao <saida.mp4>          (vídeo)
//      node renderizar.js apresentacao <pasta> 1.5 9 20       (quadros soltos em JPG, para conferir)
// ffmpeg: variável FFMPEG ou ffmpeg no PATH (ex.: npx ffmpeg-static).
const { spawn } = require("child_process");
const fs = require("fs"), path = require("path"), os = require("os");
const [nome, saida, ...tempos] = process.argv.slice(2);
const FPS = 30, CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const url = "file:///" + path.join(__dirname, nome + ".html").replace(/\\/g, "/");
const perfil = fs.mkdtempSync(path.join(os.tmpdir(), "lume-video-"));
const porta = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=" + porta, "--user-data-dir=" + perfil, "--hide-scrollbars", "--no-first-run", "--force-device-scale-factor=1", "--allow-file-access-from-files", "about:blank"], { stdio: "ignore" });
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  let ws;
  for (let i = 0; i < 40 && !ws; i++) { try { const l = await (await fetch(`http://127.0.0.1:${porta}/json/list`)).json(); const p = l.find(x => x.type === "page"); if (p) ws = new WebSocket(p.webSocketDebuggerUrl); } catch (e) {} if (!ws) await sleep(250); }
  await new Promise(r => ws.onopen = r);
  let id = 0; const pend = {};
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d); delete pend[d.id]; } };
  const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async expr => { const r = await cmd("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails)); return r.result.result.value; };
  await cmd("Page.enable");
  await cmd("Emulation.setDeviceMetricsOverride", { width: 1080, height: 1920, deviceScaleFactor: 1, mobile: false });
  await cmd("Page.navigate", { url }); await sleep(1500);
  await ev(`document.fonts.ready.then(()=>Promise.all([...document.images].map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r})))).then(()=>1)`);
  const dur = await ev("DURACAO");
  const quadro = async t => { await ev(`render(${t});1`); const s = await cmd("Page.captureScreenshot", { format: "jpeg", quality: 92, optimizeForSpeed: true }); return Buffer.from(s.result.data, "base64"); };

  if (tempos.length) {
    fs.mkdirSync(saida, { recursive: true });
    for (const t of tempos) { fs.writeFileSync(path.join(saida, `${nome}-${t}.jpg`), await quadro(+t)); console.log("quadro", t); }
  } else {
    const ff = spawn(process.env.FFMPEG || "ffmpeg", ["-y", "-v", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
      "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-pix_fmt", "yuv420p", "-movflags", "+faststart", saida], { stdio: ["pipe", "inherit", "inherit"] });
    const total = Math.round(dur * FPS);
    for (let f = 0; f < total; f++) {
      const buf = await quadro(f / FPS);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
      if (f % 150 === 0) console.log(`${nome}: ${f}/${total}`);
    }
    ff.stdin.end(); await new Promise(r => ff.on("close", r));
    console.log("pronto:", saida);
  }
  ws.close(); chrome.kill(); process.exit(0);
})().catch(e => { console.error(e); chrome.kill(); process.exit(1); });
