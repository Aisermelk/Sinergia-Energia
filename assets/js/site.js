/* LP Sinergia — comportamento das páginas (funciona com ou sem o V8 Loader). */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = function (n) { return Number(n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); };
  var digits = function (v) { return String(v || "").replace(/\D/g, ""); };

  /* Percentuais de referência da Sinergia (Geração Distribuída). Variam por distribuidora, região e modalidade. */
  var UFS = { AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia", CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás", MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul", MG: "Minas Gerais", PA: "Pará", PB: "Paraíba", PR: "Paraná", PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte", RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina", SP: "São Paulo", SE: "Sergipe", TO: "Tocantins" };
  var REF = { CE: [20, 20], RN: [18, 18], BA: [20, 20], PE: [16, 16], AL: [18, 18], MA: [18, 18], PI: [18, 18], PA: [18, 18], GO: [25, 25], MT: [25, 25], MS: [20, 20], TO: [16, 16], MG: [26, 26], SP: [15, 15], ES: [15, 15], RJ: [12, 15], PR: [16, 16], SC: [15, 15], RS: [15, 15] };
  window.SINERGIA_REF = REF;

  function waLink(number, text) {
    var d = digits(number); if (!d) return "";
    if (d.length <= 11) d = "55" + d;
    return "https://wa.me/" + d + (text ? "?text=" + encodeURIComponent(text) : "");
  }
  function currentWhats() { return (window.V8 && window.V8.field && window.V8.field("contact.whatsapp")) || ""; }

  /* links de WhatsApp com mensagem pronta: <a data-wa data-wa-text="..."> (sem número no painel, o botão leva ao formulário) */
  function wireWhatsApp() {
    var num = currentWhats();
    $$("[data-wa]").forEach(function (a) {
      var base = a.getAttribute("data-wa-text") || "Olá! Vim pela página e quero saber mais.";
      var extra = a.__extra ? "\n" + a.__extra : "";
      var url = waLink(num, base + extra);
      if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; } else { a.href = "#contato"; a.removeAttribute("target"); }
    });
  }
  /* botões de cadastro: usam o "Link do office" do painel; sem ele, descem para o formulário */
  function wireOffice() {
    var link = window.V8 && window.V8.field && window.V8.field("content.officeLink");
    $$("[data-office]").forEach(function (a) {
      if (link && /^https?:\/\//i.test(link)) { a.href = link; a.target = "_blank"; a.rel = "noopener"; } else { a.href = "#contato"; a.removeAttribute("target"); }
    });
  }

  /* simulador de economia (página de clientes) */
  function setupSimulator() {
    var form = $("#simulador-form"); if (!form) return;
    var bill = $("#sim-bill"), uf = $("#sim-uf"), box = $("#sim-result"), cta = $("#sim-cta");
    uf.innerHTML = '<option value="">Selecione o estado</option>' + Object.keys(UFS).map(function (k) { return '<option value="' + k + '">' + UFS[k] + (REF[k] ? "" : " (consultar)") + "</option>"; }).join("");
    function calc() {
      var v = parseFloat(String(bill.value).replace(/\./g, "").replace(",", ".")), s = uf.value;
      if (!s || !(v > 0)) { box.hidden = true; return; }
      box.hidden = false;
      var r = REF[s];
      if (!r) {
        box.innerHTML = "<p><b>" + UFS[s] + ":</b> ainda não temos o percentual de referência neste estado. Envie seus dados e consulte a disponibilidade.</p>";
        setCta(v, s, null); return;
      }
      var lo = v * r[0] / 100, hi = v * r[1] / 100, pct = r[0] === r[1] ? r[0] + "%" : r[0] + "% a " + r[1] + "%";
      var m = lo === hi ? money(lo) : money(lo) + " a " + money(hi), y = lo === hi ? money(lo * 12) : money(lo * 12) + " a " + money(hi * 12);
      box.innerHTML = '<div class="big">' + m + '<span style="font-size:1rem;font-weight:600"> / mês</span></div><p>Estimativa com percentual de referência de <b>' + pct + "</b> em " + UFS[s] + " (≈ " + y + " por ano).</p><p class=\"small\">Valor ilustrativo: depende da distribuidora, região, modalidade e disponibilidade de geração. Não é uma promessa de desconto.</p>";
      setCta(v, s, pct);
      $("#f-fatura") && ($("#f-fatura").value = String(v));
    }
    function setCta(v, s, pct) {
      cta.__extra = "Fatura: " + money(v) + " | Estado: " + UFS[s] + (pct ? " | Referência: " + pct : "");
      cta.setAttribute("data-wa-text", "Olá! Quero a análise da minha conta de luz.");
      wireWhatsApp();
    }
    bill.addEventListener("input", calc); uf.addEventListener("change", calc);
    form.addEventListener("submit", function (e) { e.preventDefault(); calc(); box.scrollIntoView({ behavior: "smooth", block: "nearest" }); });
    /* chips de estados */
    var chips = $("#uf-chips");
    if (chips) {
      chips.innerHTML = Object.keys(REF).map(function (k) { var r = REF[k]; return '<button type="button" class="chip" data-uf="' + k + '">' + k + "<b>" + (r[0] === r[1] ? r[0] + "%" : r[0] + "–" + r[1] + "%") + "</b></button>"; }).join("");
      chips.addEventListener("click", function (e) {
        var b = e.target.closest("[data-uf]"); if (!b) return;
        $$(".chip", chips).forEach(function (c) { c.classList.toggle("on", c === b); });
        uf.value = b.getAttribute("data-uf"); calc();
        var note = $("#uf-note"); if (note) note.textContent = UFS[b.getAttribute("data-uf")] + ": percentual de referência. Varia conforme a distribuidora, a região e a modalidade.";
        $("#simulador").scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  /* barra fixa no celular: some quando o formulário está na tela */
  function setupSticky() {
    var bar = $(".sticky"), form = $("#contato"); if (!bar || !form || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (en) { bar.classList.toggle("hide", en[0].isIntersecting); }, { threshold: 0.25 }).observe(form);
  }
  /* depois de enviar o lead: oferece falar agora no WhatsApp */
  document.addEventListener("v8:lead-sent", function () {
    var box = $(".after-lead"); if (box) box.classList.add("on");
  });

  function boot() { wireWhatsApp(); wireOffice(); setupSimulator(); setupSticky(); var y = $("#year"); if (y) y.textContent = new Date().getFullYear(); }
  document.addEventListener("v8:ready", function () { wireWhatsApp(); wireOffice(); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
  if (window.V8 && window.V8.ready) window.V8.ready.then(function () { wireWhatsApp(); wireOffice(); });
})();
