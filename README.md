# Feelgrove

## Project info

Here's a **comprehensive README.md** file for your GitHub repository, covering installation, setup, troubleshooting, and features of **FeelGroove**.  

---

# **🎵 FeelGroove – Mood-Based Song Recommendation App**  

🚀 **FeelGroove** is an AI-powered **mood-based song recommendation** application that integrates **Facial Emotion Recognition**, **Spotify API**, and **real-time syncing** to provide a personalized music experience.

## **📌 Features**  

✅ **Facial Emotion Recognition** – Detects mood using AI and recommends songs  
✅ **Spotify Integration** – Play songs directly via Spotify  
✅ **Manual Mood Selection** – Choose mood manually if face recognition fails  
✅ **Real-time Syncing** – Instant updates across devices using **Supabase**  
✅ **Custom Playlists & Queue** – Like/Dislike songs, create playlists, and manage queues  
✅ **Lyrics Display** – View lyrics of currently playing songs  
✅ **Smooth UI Animations** – Inspired by **Apple Music, Spotify, and Amazon Music**  
✅ **Light & Dark Mode** – User-friendly theme switching  
✅ **Weekly Mood Insights** – See mood trends and song recommendations  
✅ **Collaborative Playlists** – Share and edit playlists with friends  

---

## **🚀 Installation Guide**  

### **1️⃣ Prerequisites**  
Before running FeelGroove, install the following:  

✅ **Node.js & npm (or Yarn/Pnpm)** – Required for package management  
✅ **Git** – To clone the repository  
✅ **VS Code** – Recommended code editor  

#### **🔹 Install Dependencies**  
```bash
# Install Node.js & npm
sudo apt update && sudo apt install nodejs npm  # Ubuntu
brew install node  # macOS
choco install nodejs  # Windows (if using Chocolatey)

# Install Git
sudo apt install git  # Ubuntu
brew install git  # macOS
choco install git  # Windows
```

---

### **2️⃣ Clone the Repository**  
```bash
git clone https://github.com/yesmanthan/feelgroove.git
cd feelgroove
```

---

### **3️⃣ Install Project Dependencies**  
Run one of the following based on your package manager:  
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

---

### **4️⃣ Set Up Environment Variables (.env)**  
Create a `.env` file in the project root directory and add:  
```ini
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
VITE_REDIRECT_URI=http://localhost:5173/
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```
**⚠️ Important:** Replace `your_*` values with actual credentials from **Spotify Developer Dashboard** & **Supabase**.

---

### **5️⃣ Start the Development Server**  
```bash
# If using npm
npm run dev

# If using yarn
yarn dev

# If using pnpm
pnpm dev
```
🔹 This will start the app at **http://localhost:5173/**.

---

## **🛠️ Troubleshooting & Fixes**  

### **1️⃣ Fix "Invalid Client: Invalid Client" (Spotify Auth Error)**  
✔ **Solution:**  
- Ensure `VITE_SPOTIFY_CLIENT_ID`, `VITE_SPOTIFY_CLIENT_SECRET`, and `VITE_REDIRECT_URI` match those in the **Spotify Developer Dashboard**  
- Redirect URI should be added in **Spotify Developer Console** → **Edit Settings**  

---

### **2️⃣ Fix Face Recognition Model Not Loading**  
✔ **Solution:**  
- Ensure models are inside `/public/models`  
- If missing, download them manually:  
```bash
mkdir -p public/models
wget -P public/models https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
```

---

### **3️⃣ Fix Playlists & Recommended Songs Not Fetching**  
✔ **Solution:**  
- Check if **Spotify API token** is available before making requests:  
```tsx
if (!accessToken) {
  console.log("No access token available. Please log in.");
  return;
}
```
- Fetch Spotify songs correctly:  
```tsx
const fetchSongs = async () => {
  const response = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await response.json();
  console.log(data);
};
```

---

### **4️⃣ Fix Supabase Real-Time Sync Issues**  
✔ **Solution:**  
- Check `.env` values for `SUPABASE_URL` and `SUPABASE_ANON_KEY`  
- Implement real-time syncing:  
```tsx
const { data } = supabase
  .from('user_sessions')
  .on('UPDATE', payload => {
    console.log('User session updated:', payload);
  })
  .subscribe();
```

---

### **5️⃣ Fix Logged-in User Profile Not Displaying**  
✔ **Solution:**  
- Fetch user profile from Spotify API:  
```tsx
const fetchUserProfile = async () => {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await response.json();
  console.log("User Profile:", data);
};
```

---

## **💡 Contributors**  
👨‍💻 **Manthan Yesankar** – [GitHub](https://github.com/yesmanthan)  

Contributions are welcome! Open an issue or submit a PR. 🚀  

---

## **📜 License**  
FeelGroove is open-source under the **MIT License**.  

---

Now, anyone can **easily set up and run FeelGroove** in **VS Code** with this README! 🚀
**URL**: https://lovable.dev/projects/f63960fd-265a-4737-87f0-4bb40cdd0272


Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f63960fd-265a-4737-87f0-4bb40cdd0272) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
