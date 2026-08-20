// V16 Food Ordering — web. In-memory and deterministic, mirroring the iOS app.
(function () {
  "use strict";

  // Fixed menu — constant so demo assertions are stable.
  var MENU = [
    { slug: "margherita-pizza", name: "Margherita Pizza", detail: "Tomato, mozzarella, basil", emoji: "🍕", price: 12.00 },
    { slug: "veggie-burger",    name: "Veggie Burger",    detail: "Grilled patty, lettuce, aioli", emoji: "🍔", price: 9.50 },
    { slug: "sushi-platter",    name: "Sushi Platter",    detail: "Chef's selection, 12 pieces", emoji: "🍣", price: 18.00 },
    { slug: "caesar-salad",     name: "Caesar Salad",     detail: "Romaine, parmesan, croutons", emoji: "🥗", price: 8.00 },
    { slug: "pasta-alfredo",    name: "Pasta Alfredo",    detail: "Creamy parmesan sauce", emoji: "🍝", price: 11.50 },
    { slug: "chocolate-cake",   name: "Chocolate Cake",   detail: "Warm, with vanilla scoop", emoji: "🍰", price: 6.50 },
  ];
  var DELIVERY_FEE = 2.00;
  var ORDER_NUMBER = "V16-1042"; // deterministic — not random

  var cart = {};        // slug -> qty
  var placedTotal = 0;  // captured at order time

  // ---- derived ----
  function itemBySlug(slug) { return MENU.filter(function (m) { return m.slug === slug; })[0]; }
  function cartCount() { return Object.keys(cart).reduce(function (n, s) { return n + cart[s]; }, 0); }
  function cartLines() { return MENU.filter(function (m) { return cart[m.slug] > 0; }).map(function (m) { return { item: m, qty: cart[m.slug] }; }); }
  function subtotal() { return cartLines().reduce(function (t, l) { return t + l.item.price * l.qty; }, 0); }
  function total() { return cartCount() === 0 ? 0 : subtotal() + DELIVERY_FEE; }
  function money(v) { return "$" + v.toFixed(2); }

  // ---- helpers ----
  function $(sel, root) { return (root || document).querySelector(sel); }
  function testid(id) { return document.querySelector('[data-testid="' + id + '"]'); }

  function showView(name) {
    document.querySelectorAll(".view").forEach(function (v) { v.hidden = v.getAttribute("data-view") !== name; });
    if (name === "menu") renderMenu();
    if (name === "cart") renderCart();
    if (name === "checkout") renderCheckout();
    window.scrollTo(0, 0);
  }

  // ---- render: menu ----
  function renderMenu() {
    var list = $("#menuList");
    list.innerHTML = "";
    MENU.forEach(function (m) {
      var row = document.createElement("div");
      row.className = "row";
      row.setAttribute("data-testid", "menu.item." + m.slug);
      row.innerHTML =
        '<div class="row__emoji">' + m.emoji + '</div>' +
        '<div class="row__body">' +
          '<div class="row__name">' + m.name + '</div>' +
          '<div class="row__detail">' + m.detail + '</div>' +
          '<div class="row__price">' + money(m.price) + '</div>' +
        '</div>' +
        '<button class="addbtn" aria-label="Add ' + m.name + '" data-testid="menu.item.' + m.slug + '.add">+</button>';
      row.querySelector(".addbtn").addEventListener("click", function () { cart[m.slug] = (cart[m.slug] || 0) + 1; updateBadge(); });
      list.appendChild(row);
    });
    updateBadge();
  }

  function updateBadge() {
    var badge = testid("menu.cart.badge");
    var n = cartCount();
    if (n > 0) { badge.hidden = false; badge.textContent = String(n); }
    else { badge.hidden = true; badge.textContent = "0"; }
  }

  // ---- render: cart ----
  function renderCart() {
    var list = $("#cartList");
    var lines = cartLines();
    list.innerHTML = "";
    $("#cartSummary").hidden = lines.length === 0;
    testid("cart.empty").hidden = lines.length !== 0;

    lines.forEach(function (l) {
      var row = document.createElement("div");
      row.className = "row";
      row.setAttribute("data-testid", "cart.row." + l.item.slug);
      row.innerHTML =
        '<div class="row__emoji">' + l.item.emoji + '</div>' +
        '<div class="row__body">' +
          '<div class="row__name">' + l.item.name + '</div>' +
          '<div class="row__detail">' + money(l.item.price) + '</div>' +
        '</div>' +
        '<div class="stepper">' +
          '<button aria-label="Decrease ' + l.item.name + '" data-testid="cart.row.' + l.item.slug + '.dec">−</button>' +
          '<span class="stepper__qty" data-testid="cart.row.' + l.item.slug + '.qty">' + l.qty + '</span>' +
          '<button aria-label="Increase ' + l.item.name + '" data-testid="cart.row.' + l.item.slug + '.inc">+</button>' +
        '</div>';
      row.querySelector('[data-testid$=".dec"]').addEventListener("click", function () { decrement(l.item.slug); });
      row.querySelector('[data-testid$=".inc"]').addEventListener("click", function () { cart[l.item.slug] += 1; renderCart(); });
      list.appendChild(row);
    });

    testid("cart.subtotal").textContent = money(subtotal());
    testid("cart.delivery").textContent = money(DELIVERY_FEE);
    testid("cart.total").textContent = money(total());
    testid("cart.checkout").disabled = lines.length === 0;
  }

  function decrement(slug) {
    if (!cart[slug]) return;
    if (cart[slug] <= 1) delete cart[slug]; else cart[slug] -= 1;
    renderCart();
  }

  // ---- render: checkout ----
  function renderCheckout() {
    testid("checkout.total").textContent = money(total());
    validateCheckout();
  }
  function validateCheckout() {
    var name = testid("checkout.name").value.trim();
    var addr = testid("checkout.address").value.trim();
    testid("checkout.place").disabled = !(name && addr);
  }

  // ---- wiring ----
  function init() {
    // login
    $("#loginForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var email = testid("login.email").value.trim();
      var pass = testid("login.password").value;
      if (email && pass) { testid("login.error").hidden = true; showView("menu"); }
      else { testid("login.error").hidden = false; }
    });

    // cart button + nav buttons
    testid("menu.cart").addEventListener("click", function () { showView("cart"); });
    document.querySelectorAll("[data-nav]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-nav");
        if (target === "menu" && btn.getAttribute("data-testid") === "confirm.done") cart = {}; // reset after order
        showView(target);
      });
    });

    // checkout
    testid("checkout.name").addEventListener("input", validateCheckout);
    testid("checkout.address").addEventListener("input", validateCheckout);
    $("#checkoutForm").addEventListener("submit", function (e) {
      e.preventDefault();
      if (testid("checkout.place").disabled) return;
      placedTotal = total();
      testid("confirm.order").textContent = ORDER_NUMBER;
      testid("confirm.total").textContent = "Total paid " + money(placedTotal);
      showView("confirmation");
    });

    showView("login");
  }

  // Run now if the DOM is already parsed, otherwise wait for it.
  // (Relying on DOMContentLoaded alone can miss if this script runs late.)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
