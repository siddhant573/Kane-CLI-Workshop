# Setup — Kane-CLI Workshop (Web)

> Run the V16 Food Ordering app in your browser with kane-cli.
> Works on **any OS** — all you need is **Google Chrome**, **kane-cli**, and **Python 3**.

Do the "Before you start" steps ahead of time — the downloads are large and you don't
want to run them on conference Wi-Fi.

---

## Before you start

### 1. Install Google Chrome
kane-cli drives your locally installed **Google Chrome** (stable channel) via the
DevTools Protocol. Install it from https://www.google.com/chrome/ if you don't have it.
- macOS: `/Applications/Google Chrome.app`
- Windows: `C:\Program Files\Google\Chrome\Application\chrome.exe`
- Linux: `/usr/bin/google-chrome`

### 2. Install kane-cli
Pick one:
```bash
# Homebrew (macOS / Linux)
brew install LambdaTest/kane/kane-cli

# …or npm (any OS with Node)
npm install -g @testmuai/kane-cli

# …or curl (macOS / Linux)
curl -fsSL https://raw.githubusercontent.com/LambdaTest/kane-cli/main/install.sh | sh
```
Check it:
```bash
kane-cli --version
```

### 3. Sign in (and grab workshop credits)
```bash
kane-cli login                 # opens a browser for OAuth
kane-cli whoami                # confirms you're authenticated
```
Workshop credits: https://www.testmuai.com/kane-cli

### 4. Confirm Python 3 (for the local server)
```bash
python3 --version              # 3.x is fine; ships with macOS and most Linux
```
(Windows: install from https://python.org, or serve the `app/` folder another way —
e.g. the VS Code "Live Server" extension.)

---

## Get the code

```bash
git clone https://github.com/siddhant573/Kane-CLI-Workshop
cd Kane-CLI-Workshop
```
No build step — it's plain HTML/CSS/JS:
```
app/            the web app (index.html, styles.css, app.js)
docs/PRD.md     what we feed kane-cli as context
serve.sh        starts a local server at http://localhost:4173
reset.sh        clean slate to start over
```

## Serve the app (leave running in its own tab)
```bash
./serve.sh                     # → http://localhost:4173
```
Open it once in Chrome to see it:
```bash
open -a "Google Chrome" http://localhost:4173      # macOS
# Windows: start chrome http://localhost:4173
# Linux:   google-chrome http://localhost:4173
```

## Smoke-test your setup (from a second tab)
```bash
kane-cli run "Sign in with any email and password, then confirm the V16 Food menu appears" \
  --url http://localhost:4173
```
If Chrome opens, signs in, and lands on the menu — you're ready. 🎉

See the [README](README.md) for the full context → design → author → execute → evidence loop.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| "Chrome not found" | Install Google Chrome (stable) at the standard path for your OS |
| `./serve.sh` fails | Make sure Python 3 is installed; or serve `app/` another way |
| Port 4173 already in use | `./serve.sh 5173` then use `--url http://localhost:5173` |
| Run fails: "no start URL" | Pass `--url http://localhost:4173` (or start the objective with the URL) |
| Auth errors | `kane-cli logout` then `kane-cli login` again |

Need to start fresh:
```bash
./reset.sh
```
