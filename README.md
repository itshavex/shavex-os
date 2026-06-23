# ShaVex OS | GPS for Goals (Beta v1.0)

**ShaVex OS** is a premium, dark-themed **AI-Powered Personal Operating System** designed to eliminate confusion and help users achieve long-term goals through AI-driven planning, adaptive roadmaps, and personalized execution.

*Tagline: Life Is Complex. Progress Shouldn't Be.*

---

## 🚀 Key Features

* **Mission Control Dashboard:** Streamlined daily execution deck showing Destination, Position, Next Move Engine, Today's Mission, Momentum, Journey Progress, Coach Insights, and Road Health.
* **AI Mission Builder:** Enter your daily available time budget (15m, 30m, 45m, 1h, 2h, 3h, Custom) to automatically generate personalized daily missions.
* **Adaptive Journey Maps:** Automatically builds phase/milestone sequences. If user consistency or completion rates drop, the AI automatically injects revision checkpoints and reinforcement missions.
* **Profile Control Center:** Premium profile card supporting name editing, smart username suggestions, inline validation check, profile completion percentage dial, and read-only diagnostics (XP, Milestones, Streak).
* **AI Coach Insights:** An invisible coach that monitors learning speeds, strong/weak areas, and consistency to compile weekly insights (e.g. "Statistics revision recommended").
* **Knowledge Vault:** Central searchable and format-filtered catalog (Playlists, Courses, PDFs, Books, Notes) organized by Journey Map phase.
* **Focus Mode Cockpit:** Distraction-free countdown timer displaying target missions, active resources, and Journey Progress indicators.
* **Fitness GPS Tracker:** Logs steps, distances, sleep, water, and weight. Built with connectivity indicators for future wearable device sync (Apple Health, Google Fit, Fitbit).
* **Errors & Offline Fallback:** Graceful loading states, skeletons, and simulated local storage database fallbacks when Supabase services are not configured.

---

## 📸 Screenshots

### 1. Mission Control Dashboard
Displays key target goals, next move recommendations, daily mission generator, and diagnostics.

![Mission Control Dashboard](./dist/assets/dashboard_screenshot.png)

### 2. Profile Control Center
Interactive drawer for editing biography, goals, study metrics, and tracking completion dials.

![Profile Control Center](./dist/assets/profile_screenshot.png)

---

## 🛠️ Tech Stack

* **Frontend:** React, React Router
* **Styling & Transitions:** Vanilla CSS (custom properties, glassmorphism), Tailwind CSS
* **Build System:** Vite
* **Database & Auth:** Supabase Auth & PostgreSQL Realtime
* **Icons:** Lucide Icons

---

## ⚙️ Environment Variables

Copy the `.env.example` template to `.env.local` to enable cloud synchronization:

```bash
cp .env.example .env.local
```

Fill in the credentials:

```ini
# Supabase live connection
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OAuth Configurations (Optional)
VITE_GOOGLE_AUTH_CLIENT_ID=your-google-oauth-client-id
VITE_GITHUB_AUTH_CLIENT_ID=your-github-oauth-client-id
```

---

## 🚀 Installation & Local Development Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/shashwat/shavex-os.git
   cd shavex-os
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 📦 Build Instructions

To build the application bundle for production:

```bash
npm run build
```
This generates optimized, minified production assets inside the `dist/` directory.

---

## 📦 Deployment Instructions

### Deploy to GitHub Pages
1. Install `gh-pages` helper tool:
   ```bash
   npm install gh-pages --save-dev
   ```
2. Configure `package.json` with homepage url:
   ```json
   "homepage": "https://<username>.github.io/<repo-name>"
   ```
3. Run deploy command:
   ```bash
   npm run deploy
   ```

### Deploy to Vercel
1. Push your repository to **GitHub**.
2. Open the **Vercel Dashboard** and click **Add New > Project**.
3. Select your repository.
4. Set the **Framework Preset** to `Vite`.
5. Add the environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**. Vercel will compile the project and host it.

---

## 🔮 Future Roadmap

* **WakaTime IDE Sync:** Track daily coding hours spent inside Journey Map tasks.
* **Wearable Health Sync:** Real-time biometrics updates from Apple Health / Google Fit.
* **Dynamic AI Prompts:** Generate custom milestone phases from natural language descriptions.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](file:///c:/Users/shash/OneDrive/Desktop/ShaVex%20Daily%20Tracker/LICENSE) file for details.
