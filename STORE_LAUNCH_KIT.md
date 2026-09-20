# Rafeeq — App Store & Google Play launch kit

Everything needed to publish, ready to copy-paste. Two things still need you: the developer accounts (Apple $99/yr, Google $25) and capturing screenshots on a device/emulator (spec below). Privacy URL is live: `https://ibd-connect.vercel.app/privacy.html`.

---

## Identity
- **App name:** Rafeeq: IBD Companion
- **Bundle / package ID:** `com.sga.rafeeq`
- **Category:** Health & Fitness *(recommended over “Medical” — matches the non-medical positioning and avoids stricter Medical-category review)*
- **Default language:** English; **Arabic** as a localized listing
- **Support email:** majid.almadi@gmail.com · **Publisher:** Saudi Gastroenterology Association
- **Marketing URL:** https://ibd-connect.vercel.app · **Privacy URL:** https://ibd-connect.vercel.app/privacy.html

## App Store (Apple)
- **Subtitle (≤30):** Your IBD journey, connected
- **Promotional text (≤170):** Track symptoms, meals, sleep and meds, see your patterns, and share a clean summary with your doctor — bilingual and private on your device.
- **Keywords (≤100):** IBD,Crohn,colitis,UC,gut,symptom tracker,bowel,IBD-DISC,health diary,Arabic,Saudi,diet,FODMAP
- **Description (EN):**
  > Rafeeq is a bilingual (Arabic/English) companion for living with inflammatory bowel disease (Crohn’s and ulcerative colitis). Log symptoms, bowel movements, meals, sleep, mood, activity, hydration, medications and labs in seconds; see clean, descriptive trends over time; and generate a read-only summary your doctor can open by scanning a QR code or opening a link.
  >
  > • Fast daily check-in with streaks and gentle reminders
  > • IBD-DISC self-reflection with a clear visual
  > • Diet guidance for the Gulf — FODMAP, Mediterranean, and local foods
  > • Supplements, vaccinations, travel mode and a medication letter
  > • Education reviewed against the Saudi Gastroenterology Association’s IBD guide
  > • Private by design: your data stays on your device; sharing is always your choice
  >
  > Rafeeq is a non-medical health companion for personal tracking and education. It does not provide diagnosis, prediction, or treatment and is not a substitute for professional care. Always consult your healthcare provider.
- **Description (AR):**
  > رفيق رفيق ثنائي اللغة (العربية/الإنجليزية) للتعايش مع التهاب الأمعاء (كرون والتهاب القولون التقرّحي). سجّل الأعراض والتبرّز والوجبات والنوم والمزاج والنشاط والترطيب والأدوية والتحاليل بسرعة، وشاهد اتجاهات وصفية واضحة عبر الوقت، وأنشئ ملخّصًا للقراءة فقط يفتحه طبيبك بمسح رمز QR أو رابط.
  >
  > • تسجيل يومي سريع مع سلاسل إنجاز وتذكيرات لطيفة
  > • أداة التأمّل IBD-DISC مع عرض بصري واضح
  > • إرشادات غذائية للخليج — FODMAP والمتوسطي والأطعمة المحلية
  > • المكمّلات والتطعيمات ووضع السفر وخطاب الدواء
  > • محتوى تثقيفي مستند إلى دليل IBD للجمعية السعودية للجهاز الهضمي
  > • خصوصية بالتصميم: تبقى بياناتك على جهازك، والمشاركة دائمًا باختيارك
  >
  > رفيق رفيق صحي غير طبي للتتبّع الذاتي والتثقيف، ولا يقدّم تشخيصًا أو علاجًا وليس بديلًا عن الرعاية المهنية. استشر دائمًا مقدّم الرعاية الصحية.
- **Age rating:** 12+ (set “Medical/Treatment Information” to *Infrequent/Mild*; everything else None).
- **App Privacy (nutrition labels):**
  - *Data Not Collected* by default. With opt-in features: **Health & Fitness** (symptom/lifestyle summary — only when the user shares with a doctor; user-initiated), **Diagnostics/Crash data** (optional, not linked to identity), **Identifiers** (push token, only if notifications enabled). Nothing used for tracking/advertising. Data **not linked** to identity.

## Google Play
- **Short description (≤80):** Bilingual IBD companion: track symptoms, learn, and share with your doctor.
- **Full description:** reuse the App Store EN description above (≤4000 chars).
- **Content rating (IARC questionnaire):** Reference/education + health; no violence, sex, gambling, or user-to-user comms → expected **Everyone / PEGI 3**.
- **Data safety form:**
  - *Data collected:* Health & fitness info — **only** when the user uses “share with my doctor” (initials + descriptive summary); Personal info — none required (no account); App activity/crash logs — optional (opt-in diagnostics); Device/IDs — push token only if notifications enabled.
  - *Data shared with third parties:* No (processors only: hosting/backend/diagnostics).
  - *Encrypted in transit:* Yes. *Users can request deletion:* Yes (in-app export/delete; email for backend).
  - *Committed to Play Families policy:* not a children’s app.

## Screenshot & asset spec (capture on device/emulator)
Cannot be auto-generated here. Capture these 6 screens (EN + AR): **Today dashboard, Tracking/log, Reports, Diet/FODMAP, Learn, Share-with-doctor**.
- **iPhone:** 6.7" (1290×2796) and 6.5" (1242×2688) — 3–10 each.
- **iPad:** 12.9" (2048×2732) if you list for iPad.
- **Android phone:** 1080×1920+ (min 2, up to 8); plus 7" and 10" tablet sets if targeting tablets.
- **Icons:** App Store 1024×1024 (use `icon-512.png` upscaled or re-export); Play 512×512 + feature graphic 1024×500.
- Tip: use the desktop full-screen mode or a phone to grab clean frames; keep one Arabic (RTL) set.

## Pre-submission checklist
- [ ] Apple + Google developer accounts enrolled
- [ ] Android: `bubblewrap build` → upload .aab → add Play App-Signing SHA-256 to `/.well-known/assetlinks.json`
- [ ] iOS: Capacitor build (see `native/README_IOS.md`) or ship the RN project
- [ ] Screenshots (EN/AR) + icons + feature graphic
- [ ] Privacy URL + data-safety/app-privacy answers entered
- [ ] Internal testing track first, then production rollout
