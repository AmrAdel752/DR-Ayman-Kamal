// ربط البيانات من data.js بالصفحة
const $ = (id) => document.getElementById(id);
const d = SITE.doctor;
const waLink = (phone, msg) => `https://wa.me/${SITE.waNumber(phone)}?text=${encodeURIComponent(msg)}`;

// Navbar: خلفية عند السكرول + قائمة الموبايل
const nav = $("nav");
const onScroll = () => nav.classList.toggle("nav-scrolled", window.scrollY > 30);
window.addEventListener("scroll", onScroll);
onScroll();
$("menuBtn").addEventListener("click", () => $("mobileMenu").classList.toggle("hidden"));
$("mobileMenu").querySelectorAll("a").forEach((a) => a.addEventListener("click", () => $("mobileMenu").classList.add("hidden")));

// Hero
$("heroImg").src = d.photos[0];
$("heroTagline").textContent = `${d.tagline}. ${d.bio}`;
$("heroWa").href = waLink(d.mainPhone, "السلام عليكم، عايز أحجز كشف مع د. أيمن كمال");
$("heroCall").href = `tel:${d.mainPhone}`;
$("heroOps").textContent = SITE.stats[1].suffix + SITE.stats[1].value.toLocaleString("en");

// Stats: عدّاد يبدأ لما السكشن يظهر
$("stats").innerHTML = SITE.stats.map((s) => `
  <div class="bg-white px-4 py-7 text-center">
    <div class="text-3xl font-black text-navy-900 sm:text-4xl" dir="ltr"><span class="counter" data-to="${s.value}">0</span><span class="text-sky-brand">${s.suffix}</span></div>
    <div class="mt-1 text-sm font-semibold text-slate-500">${s.label}</div>
  </div>`).join("");

const countUp = (el) => {
  const to = +el.dataset.to, start = performance.now(), dur = 1600;
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString("en");
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  setTimeout(() => (el.textContent = to.toLocaleString("en")), dur + 200); // ضمان الرقم النهائي لو الأنيميشن اتوقف
};
new IntersectionObserver((entries, obs) => {
  if (!entries[0].isIntersecting) return;
  document.querySelectorAll(".counter").forEach(countUp);
  obs.disconnect();
}, { threshold: 0.4 }).observe($("stats"));

// About
$("aboutImg").src = d.photos[1];
$("aboutTitle").textContent = d.title;
$("aboutBio").textContent = `${d.tagline}. ${d.bio} عشان كده كل مريض بيمشي في رحلة كاملة: تقييم دقيق قبل العملية، جراحة بالمنظار بأحدث التقنيات، ومتابعة تغذية بعدها لحد ما يوصل لوزنه المثالي ويحافظ عليه.`;
$("aboutMemberships").innerHTML = d.memberships.map((m) => `
  <li class="flex items-start gap-3">
    <span class="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sky-brand/15 text-sky-brand">✓</span>
    <span class="font-semibold text-slate-700">${m}</span>
  </li>`).join("");

// Services
$("servicesGrid").innerHTML = SITE.services.map((s) => `
  <article class="group relative overflow-hidden rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-sky-brand/40">
    <div class="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-sky-brand/10 transition group-hover:scale-150"></div>
    <div class="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-sky-brand to-navy-700 text-2xl shadow-lg shadow-sky-brand/30">${s.icon}</div>
    <h3 class="relative mt-5 text-lg font-extrabold text-navy-900">${s.name}</h3>
    <p class="relative mt-2 leading-7 text-slate-600">${s.desc}</p>
    <a href="${waLink(d.mainPhone, `السلام عليكم، عايز أستفسر عن ${s.name}`)}" target="_blank" rel="noopener"
       class="relative mt-5 inline-flex items-center gap-1 text-sm font-bold text-sky-brand hover:gap-2 transition-all">استفسر الآن ←</a>
  </article>`).join("");

// Before / After + lightbox
$("baGrid").innerHTML = SITE.beforeAfter.map((b) => `
  <figure class="group cursor-zoom-in overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10" data-img="${b.img}">
    <div class="overflow-hidden"><img src="${b.img}" alt="${b.caption}" loading="lazy" class="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" /></div>
    <figcaption class="flex items-center justify-between px-5 py-4">
      <span class="font-bold">${b.caption}</span>
      <span class="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">نتيجة حقيقية</span>
    </figcaption>
  </figure>`).join("");
$("baMore").href = SITE.social.instagram;

const lb = $("lightbox");
const closeLb = () => { lb.classList.add("hidden"); lb.classList.remove("grid"); };
// أي عنصر عليه data-img بيفتح الصورة كبيرة
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-img]");
  if (!el) return;
  $("lbImg").src = el.dataset.img;
  lb.classList.remove("hidden"); lb.classList.add("grid");
});
lb.addEventListener("click", (e) => { if (e.target !== $("lbImg")) closeLb(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLb(); });

// Reviews carousel
$("revTrack").innerHTML = SITE.reviews.map((r) => `
  <article class="flex w-[85%] shrink-0 snap-start flex-col rounded-3xl bg-white p-7 shadow-lg shadow-navy-900/5 ring-1 ring-slate-200 sm:w-[46%] lg:w-[31.5%]">
    <div class="flex items-center justify-between">
      <span class="font-sign text-6xl leading-none text-sky-brand/30" aria-hidden="true">“</span>
      <span class="text-lg text-amber-400">★★★★★</span>
    </div>
    <p class="mt-2 flex-1 leading-8 text-slate-700">${r.text}</p>
    <div class="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
      <div class="flex items-center gap-3">
        <span class="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-sky-brand to-navy-700 font-bold text-white">${r.name.trim()[0]}</span>
        <div>
          <div class="font-extrabold text-navy-900">${r.name}</div>
          <div class="text-xs text-slate-500">مريض – تم التحقق ✓</div>
        </div>
      </div>
      <button data-img="${r.img}" class="text-xs font-bold text-sky-brand hover:underline">الصورة الأصلية</button>
    </div>
  </article>`).join("");

const track = $("revTrack");
// RTL: التالي = سكرول لليسار (قيمة سالبة)
const step = () => track.firstElementChild.offsetWidth + 20;
$("revNext").addEventListener("click", () => track.scrollBy({ left: -step() }));
$("revPrev").addEventListener("click", () => track.scrollBy({ left: step() }));

// Videos: embed إنستجرام مقصوص — الفيديو بس من غير الهيدر والفوتر
const IG_HEADER = 54; // ارتفاع هيدر الـ embed اللي بنخفيه
$("videoGrid").innerHTML = SITE.videos.map((v) => `
  <figure class="group">
    <div class="relative aspect-[4/5] overflow-hidden rounded-3xl bg-black shadow-xl shadow-navy-900/15 ring-1 ring-slate-200">
      <iframe src="${v.url}embed/" title="${v.title}" loading="lazy" scrolling="no" allowtransparency="true" allow="autoplay; encrypted-media; fullscreen"
        class="absolute inset-x-0 w-full border-0" style="top:-${IG_HEADER}px;height:calc(100% + ${IG_HEADER + 300}px)"></iframe>
    </div>
    <figcaption class="mt-3 flex items-center justify-between px-1">
      <span class="font-bold text-navy-900">${v.title}</span>
      <a href="${v.url}" target="_blank" rel="noopener" class="text-xs font-bold text-sky-brand hover:underline">إنستجرام ↗</a>
    </figcaption>
  </figure>`).join("");
$("vidIg").href = SITE.social.instagram;
$("vidTt").href = SITE.social.tiktok;
$("vidFb").href = SITE.social.facebook;

// Store (ديمو) — الطلب عبر واتساب
$("storeGrid").innerHTML = SITE.products.map((p) => `
  <article class="group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
    <div class="relative grid h-44 place-items-center bg-gradient-to-br from-sky-50 to-sky-100 text-6xl transition group-hover:from-sky-100 group-hover:to-sky-200">
      ${p.icon}
      ${p.tag ? `<span class="absolute right-4 top-4 rounded-full bg-navy-900 px-3 py-1 text-xs font-bold text-white">${p.tag}</span>` : ""}
    </div>
    <div class="flex flex-1 flex-col p-6">
      <h3 class="font-extrabold text-navy-900">${p.name}</h3>
      <p class="mt-2 flex-1 text-sm leading-6 text-slate-600">${p.desc}</p>
      <div class="mt-5 flex items-center justify-between">
        <span class="text-xl font-black text-navy-900">${p.price.toLocaleString("en")} <span class="text-sm font-bold text-slate-500">ج.م</span></span>
        <a href="${waLink(d.mainPhone, `السلام عليكم، عايز أطلب: ${p.name}`)}" target="_blank" rel="noopener"
           class="rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white transition hover:brightness-95">اطلب الآن</a>
      </div>
    </div>
  </article>`).join("");

// Branches tabs
const tabCls = "shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ";
const showBranch = (id) => {
  const b = SITE.branches.find((x) => x.id === id);
  document.querySelectorAll("#branchTabs button").forEach((t) => {
    const on = t.dataset.id === id;
    t.setAttribute("aria-selected", on);
    t.className = tabCls + (on ? "bg-navy-900 text-white shadow-lg" : "bg-white text-navy-900 ring-1 ring-slate-200 hover:ring-sky-brand");
  });
  $("brName").textContent = "فرع " + b.name;
  $("brAddress").textContent = b.address;
  $("brPhones").innerHTML = b.phones.map((p) => `
    <a href="tel:${p}" class="flex items-center gap-3 font-bold text-navy-800 hover:text-sky-brand"><span>📞</span><span dir="ltr">${p}</span></a>`).join("");
  $("brWa").href = waLink(b.phones[0], `السلام عليكم، عايز أحجز كشف مع د. أيمن كمال في فرع ${b.name}`);
  $("brMap").href = b.map;
  $("brFrame").src = "https://maps.google.com/maps?output=embed&hl=ar&q=" + encodeURIComponent(b.address + "، " + b.name);
  if ($("bfBranch")) $("bfBranch").value = id; // نفس الفرع يتختار في فورم الحجز
};
$("branchTabs").innerHTML = SITE.branches.map((b) => `<button role="tab" data-id="${b.id}">${b.name}</button>`).join("");
$("branchTabs").addEventListener("click", (e) => {
  const t = e.target.closest("button");
  if (t) showBranch(t.dataset.id);
});
showBranch(SITE.branches[0].id);

// Booking form → واتساب الفرع المختار
$("bfBranch").innerHTML = SITE.branches.map((b) => `<option value="${b.id}">${b.name}</option>`).join("");
$("bfService").innerHTML = ["كشف واستشارة", ...SITE.services.map((s) => s.name)].map((s) => `<option>${s}</option>`).join("");
$("bfDay").min = new Date().toISOString().slice(0, 10);

$("bookForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  const phone = f.phone.replace(/[\s-]/g, "");
  const err = !f.name.trim() ? "من فضلك اكتب اسمك" : !/^01[0125]\d{8}$/.test(phone) ? "رقم الموبايل لازم يكون 11 رقم ويبدأ بـ 01" : "";
  $("bfError").textContent = err;
  $("bfError").classList.toggle("hidden", !err);
  if (err) return;

  const b = SITE.branches.find((x) => x.id === f.branch);
  const msg = [
    "السلام عليكم، عايز أحجز مع د. أيمن كمال 🩺",
    `الاسم: ${f.name.trim()}`,
    `الموبايل: ${phone}`,
    `الفرع: ${b.name}`,
    `الخدمة: ${f.service}`,
    f.day ? `اليوم: ${f.day}` : "",
    `الوقت: ${f.time}`,
  ].filter(Boolean).join("\n");
  window.open(waLink(b.phones[0], msg), "_blank");
});

// FAQ
$("faqList").innerHTML = SITE.faq.map((f, i) => `
  <details class="group rounded-2xl bg-slate-50 ring-1 ring-slate-200 open:bg-white open:shadow-lg open:ring-sky-brand/40" ${i === 0 ? "open" : ""}>
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-bold text-navy-900">
      ${f.q}
      <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-brand/15 text-sky-brand transition group-open:rotate-45">+</span>
    </summary>
    <p class="px-6 pb-5 leading-8 text-slate-600">${f.a}</p>
  </details>`).join("");

// Footer
$("ftTitle").textContent = d.title;
$("ftYear").textContent = new Date().getFullYear();
$("ftBranches").innerHTML = SITE.branches.map((b) => `
  <li class="flex justify-between gap-3"><span>${b.name}</span><a href="tel:${b.phones[0]}" dir="ltr" class="hover:text-white">${b.phones[0]}</a></li>`).join("");
$("ftSocial").innerHTML = [["instagram", "IG"], ["tiktok", "TT"], ["facebook", "FB"]].map(([k, t]) => `
  <a href="${SITE.social[k]}" target="_blank" rel="noopener" aria-label="${k}" class="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xs font-bold text-white transition hover:bg-sky-brand">${t}</a>`).join("");

// Floating WhatsApp: يظهر بعد ما الزائر يعدّي الـ Hero
$("waFloat").href = waLink(d.mainPhone, "السلام عليكم، عايز أحجز كشف مع د. أيمن كمال");
const toggleWa = () => $("waFloat").classList.toggle("translate-y-24", window.scrollY < 500);
window.addEventListener("scroll", toggleWa);
toggleWa();

// Reveal on scroll
const revealEls = document.querySelectorAll("main > section:not(:first-child) > div, #storeGrid > *, #servicesGrid > *, #baGrid > *, #videoGrid > *");
const revObs = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  revObs.unobserve(e.target);
}), { threshold: 0.12 });
revealEls.forEach((el, i) => {
  el.classList.add("reveal");
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  revObs.observe(el);
});
