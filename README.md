# Kane-CLI Workshop — V16 Food Ordering (Web)

A tiny, self-contained web app for the **kane-cli** workshop. Use it to run the
complete AI-driven assurance loop in your own browser:

**context → design → author → execute → evidence**

Requirements go in as a plain-English PRD; a passing browser test + a shareable
evidence pack come out — no CSS selectors, no Playwright/Selenium written by hand.

---

## What's here

```
app/            The web app under test — index.html, styles.css, app.js (no build step)
docs/PRD.md     The product doc you feed kane-cli as context
serve.sh        Serve the app at http://localhost:4173
reset.sh        Clean slate (stop the server + clear run outputs)
SETUP.md        Full setup guide (Chrome + kane-cli + Python)
```

## Requirements

- **Google Chrome** (stable) — kane-cli drives it via the DevTools Protocol
- **kane-cli** — `npm install -g @testmuai/kane-cli` (or Homebrew / curl — see [SETUP.md](SETUP.md))
- **Python 3** — for the tiny local static server (or serve `app/` any other way)

Runs on **any OS** (macOS, Windows, Linux).

## Quick start

```bash
git clone https://github.com/siddhant573/Kane-CLI-Workshop
cd Kane-CLI-Workshop

# 1) serve the app (leave running in its own terminal tab)
./serve.sh                       # → http://localhost:4173

# 2) in a second tab: sign in to kane-cli, then drive the app
kane-cli login
kane-cli run "Sign in with any email and password, then confirm the V16 Food menu appears" \
  --url http://localhost:4173
```

If Chrome opens, signs in, and lands on the menu — you're ready. 🎉

## Run the full loop

Once the app is being served at `http://localhost:4173`:

```bash
# 1 · Context — read the PRD, extract the business use-cases
kane-cli context ingest docs/PRD.md
kane-cli context list
kane-cli context view                       # opens a graph in the browser

# 2 · Design — acceptance criteria, scenarios, and one runnable test each
kane-cli context review --approve <checkout-use-case-id>
kane-cli design tests --use-case <checkout-use-case-id> --max 3

# 3 · Author & execute — the AI drives Chrome (no selectors)
kane-cli run "Sign in, add a Sushi Platter and a Chocolate Cake, verify the cart total is \$26.50" \
  --url http://localhost:4173
kane-cli testmd run <your_test>.md --url http://localhost:4173   # replay from cache

# 4 · Evidence — portable proof + coverage
kane-cli evidence serve <run>.evidence
kane-cli cover gaps
```

> Tip: `kane-cli context list` prints the extracted use-case ids — use the checkout
> one in the `review`/`design` commands above.

## The app

**V16 Food** — login → menu (6 items) → cart (quantity steppers) → checkout →
confirmation. No backend; all state is in-memory and **deterministic** (fixed menu and
prices, flat $2 delivery, order number `V16-1042`), so every run is identical. Every
interactive element has a stable `data-testid`, so both the AI agent and the generated
tests are robust.

## Links

- **kane-cli docs:** https://www.testmuai.com/docs
- **kane-cli on GitHub:** https://github.com/LambdaTest/kane-cli
- **Get workshop credits:** https://www.testmuai.com/kane-cli

## License

[MIT](LICENSE)
