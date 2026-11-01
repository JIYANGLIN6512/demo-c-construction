/* ============================================================
   A 线最小交付包 · 站点脚本
   零依赖、零构建。改客户一般不用动这个文件。
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 移动端导航 ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.hidden = open;
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        toggle.setAttribute("aria-expanded", "false");
        nav.hidden = true;
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 640) {
        toggle.setAttribute("aria-expanded", "false");
        nav.hidden = true;
      }
    });
  }

  /* ---------- 图片缺失时的兜底（离线 / 未换图时不出破图） ---------- */
  document.querySelectorAll("img[data-search]").forEach(function (img) {
    img.addEventListener(
      "error",
      function () {
        var box = img.parentElement;
        if (!box || box.dataset.fallbackDone) return;
        box.dataset.fallbackDone = "1";
        var fb = document.createElement("div");
        fb.className = "media-fallback";
        fb.setAttribute("role", "img");
        fb.setAttribute("aria-label", img.getAttribute("alt") || "");
        var label = document.createElement("span");
        label.className = "media-fallback__label";
        label.textContent = img.getAttribute("data-search");
        fb.appendChild(label);
        box.appendChild(fb);
      },
      { once: true }
    );
  });

  /* ---------- 联系表单：前端校验 + 加载态 + 成功态 ---------- */
  var form = document.getElementById("contact-form");

  if (form) {
    var status = document.getElementById("form-status");
    var submit = form.querySelector("button[type=submit]");

    function setError(field, message) {
      var wrap = field.closest(".field");
      var slot = wrap.querySelector(".field__error");
      if (message) {
        wrap.classList.add("is-invalid");
        field.setAttribute("aria-invalid", "true");
        if (slot) slot.textContent = message;
      } else {
        wrap.classList.remove("is-invalid");
        field.removeAttribute("aria-invalid");
        if (slot) slot.textContent = "";
      }
      return !message;
    }

    function validate() {
      var ok = true;
      var name = form.elements.name;
      var contact = form.elements.contact;
      var message = form.elements.message;

      ok = setError(name, name.value.trim() ? "" : "请填写称呼") && ok;
      ok =
        setError(
          contact,
          /[\w.+-]+@[\w-]+\.[\w.]+/.test(contact.value.trim()) ||
            /^[0-9+\-\s]{7,}$/.test(contact.value.trim())
            ? ""
            : "请填写有效的邮箱或手机号"
        ) && ok;
      ok = setError(message, message.value.trim().length >= 10 ? "" : "需求描述至少 10 个字") && ok;
      return ok;
    }

    ["name", "contact", "message"].forEach(function (key) {
      var el = form.elements[key];
      el.addEventListener("blur", function () {
        validate();
      });
      el.addEventListener("input", function () {
        var wrap = el.closest(".field");
        if (wrap.classList.contains("is-invalid")) validate();
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        var bad = form.querySelector(".is-invalid input, .is-invalid textarea");
        if (bad) bad.focus();
        return;
      }

      submit.classList.add("is-loading");
      submit.setAttribute("aria-busy", "true");
      submit.disabled = true;
      status.hidden = true;

      /* 演示用：真实项目把这里换成 POST 到你的表单接口 */
      window.setTimeout(function () {
        submit.classList.remove("is-loading");
        submit.removeAttribute("aria-busy");
        submit.disabled = false;
        status.hidden = false;
        status.textContent = "演示用：表单未连接真实接口，提交不会发送，我们不会收到这条内容。";
        form.reset();
      }, 900);
    });
  }

  /* ---------- 资质证书点击放大 ---------- */
  document.querySelectorAll("[data-cert]").forEach(function (el) {
    var dlg = document.getElementById(el.getAttribute("data-cert"));
    if (!dlg) return;
    function open() {
      if (typeof dlg.showModal === "function") dlg.showModal();
    }
    el.addEventListener("click", open);
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
    var close = dlg.querySelector(".cert-dialog__close");
    if (close) close.addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg) dlg.close();
    });
  });

  /* ---------- 页脚年份 ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
