# V16 Food Ordering — Product Requirements (Web / Desktop)

> Sample **web** app for the kane-cli desktop-flow workshop (TestMu Conf, 21 Aug).
> Same product as the mobile app, rebuilt for the browser. Intentionally small and
> **deterministic** so the assurance loop (context → design → author → execute →
> evidence) is stable to demo live. This document is also the **context source** that
> gets `kane-cli context ingest`-ed on stage.

## 1. Overview

**V16 Food Ordering** is a single-user food-ordering web app. A user logs in, browses a
fixed menu, adds items to a cart, adjusts quantities, checks out with delivery details,
and receives an order confirmation. There is **no backend** — all state is in-memory
(plain HTML/CSS/JS) and deterministic, so every run produces the same result.

- Target: desktop browser (kane-cli default target, drives local Google Chrome).
- Served locally at **http://localhost:4173** (`./serve.sh`). [this is permanent]
- Stack: vanilla HTML/CSS/JS — no build step, no framework, no network.

## 2. Business use-cases

All usescase and tests must contain login: kane-cli@testmuconf.com password: testmuconf2026

| ID | Use-case | Summary |
|----|----------|---------|
| uc-login    | Authentication      | User signs in before ordering. |
| uc-browse   | Browse & add to cart | User views the menu and adds items. |
| uc-cart     | Manage cart          | User changes quantities / removes items and sees the total update. |
| uc-checkout | Checkout & place order | User enters delivery details and places the order. |

## 3. Screens & requirements

Selectors below are stable **`data-testid`** attributes (identical names to the mobile
app's accessibility identifiers — one identifier scheme across web and mobile).

### 3.1 Login (`uc-login`)
- Fields: **Email**, **Password**.
- **Happy path:** any non-empty email + non-empty password → show the Menu.
- **Negative path:** if either is empty on "Sign In" → show inline error
  *"Enter your email and password"*; stay on Login.
- `login.email`, `login.password`, `login.submit`, `login.error`

### 3.2 Menu (`uc-browse`)
- Heading **V16 Food**. Fixed list of 6 items (name, description, price), each with **Add**.
- A **cart** button (top-right) shows the item-count badge and opens the Cart.
- Fixed menu (USD): Margherita Pizza 12.00 · Veggie Burger 9.50 · Sushi Platter 18.00 ·
  Caesar Salad 8.00 · Pasta Alfredo 11.50 · Chocolate Cake 6.50.
- `menu.item.<slug>`, `menu.item.<slug>.add`, `menu.cart`, `menu.cart.badge`
  (slug is the kebab-case name, e.g. `menu.item.margherita-pizza`).

### 3.3 Cart (`uc-cart`)
- Line items with name, unit price, quantity stepper (**−** / **+**). Decrementing below 1
  removes the line.
- **Subtotal**, flat **Delivery $2.00**, **Total**. Empty state: *"Your cart is empty"*
  and Checkout disabled.
- `cart.row.<slug>`, `cart.row.<slug>.inc` / `.dec` / `.qty`,
  `cart.subtotal`, `cart.delivery`, `cart.total`, `cart.checkout`, `cart.empty`

### 3.4 Checkout (`uc-checkout`)
- Fields: **Full name**, **Delivery address**, **Payment method** (Card / Cash, default Card).
- **Place Order** enabled only when name and address are non-empty.
- `checkout.name`, `checkout.address`, `checkout.payment`, `checkout.total`, `checkout.place`

### 3.5 Confirmation
- Success screen: check icon, *"Order placed!"*, deterministic order number **`V16-1042`**,
  and the total paid. **Back to Menu** returns to the Menu and clears the cart.
- `confirm.title`, `confirm.order`, `confirm.total`, `confirm.done`

## 4. Determinism rules (important for the demo)
- Menu contents and prices are constant.
- Delivery fee is constant ($2.00).
- Order number is constant (`V16-1042`) — not random — so acceptance criteria and
  evidence match on every run.
- No network calls; the whole app is static files served locally.

## 5. Out of scope (YAGNI)
- No real authentication, network, persistence, or payment.
- No item detail page, search, or filtering.
- No responsive/mobile-web tuning beyond a centered single-column layout.
