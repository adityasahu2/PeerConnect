# 🎓 PeerConnect – Student Networking Platform

**PeerConnect** is a frontend-only simulation of a student networking platform—like a simplified, student-friendly version of LinkedIn. Designed for students to discover peers beyond their immediate circles, this project enables profile creation, peer browsing, and connection simulation using mock data and localStorage.

---

## 🚀 Objective

College is a time for collaboration and innovation, yet many students lack a dedicated space to connect with peers outside their class groups. **PeerConnect** aims to bridge that gap with:

- 🧑‍🎓 Simple profile creation
- 🔍 Browsing students by interests or departments
- 🤝 Simulated connection requests
- 💡 Discovering shared project ideas and skills

All functionality is implemented on the frontend, with no backend or authentication required.

---

## 🌟 Core Features

### 📝 1. User Profile Creation (Simulated)

- Fields: Name, College ID, Year, Department, Skills/Interests, Project Areas, Profile Picture (optional)
- On submission, a profile summary is displayed and saved to `localStorage` for persistence.

### 🔎 2. Peer Discovery Page

- View mock student profiles in a card-based grid or list.
- Each profile shows: Name, Year, Department, Interests, and a **Connect** button.
- Includes:
  - 🔍 **Search by interests/skills**
  - 🏷️ **Filter by department or year**

### 🤝 3. Connection Simulation

- Clicking “Connect” triggers a toast/alert: _“Connection request sent.”_
- Simulate storing connection requests using `localStorage`.
- Auto-accept connections for simplicity.
- View accepted connections in a **“My Connections”** tab.

### 📊 4. Dashboard View

- Navigable tabs:
  - **My Profile**
  - **Browse Students**
  - **My Connections**
- Track:
  - Total connections
  - Skills matched
  - Project interest overlaps

---

## 🎨 UI/UX Highlights

- 💻 **Responsive Design**: Adapts beautifully across desktop, tablet, and mobile.
- 👓 **Accessibility**: High contrast, readable fonts, and alt text for images.
- ✨ **Interactive UI**: Hover effects, card animations, loading states, and toast notifications.
- 🌈 **Modern & Friendly Aesthetic**: Designed with students in mind.

---

## 🧰 Tech Stack

- **HTML5** for structure  
- **CSS3** for design and responsiveness  
- **JavaScript (Vanilla)** for logic and interactivity  
- **LocalStorage** for data persistence  
- **Mock Data** to simulate user base and connections  

---

## 📂 Project Structure

```
PeerConnect/
├── .vscode/               # VS Code workspace settings (ignored via .gitignore)
├── assets/                # Images and icons
│   ├── favicon.png
│   └── image.png
├── css/                   # Stylesheets
│   ├── landing.css
│   └── styles.css
├── js/                    # JavaScript logic
│   ├── app.js
│   ├── data.js
│   └── landing.js
├── home.html              # Dashboard/Home page
├── index.html             # Landing/Signup page
└── README.md              # Project documentation
```

---

## 🛠️ How to Run Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/adityasahu2/PeerConnect.git
   cd PeerConnect
   ```

2. **Open in your browser:**

   Just double-click `index.html` or open it manually in Chrome/Firefox/Edge.  
   No setup or server is required!

---

## 📌 Future Enhancements

- 🎯 Skill-based match recommendations
- 💬 Chat feature simulation
- 📤 Export profile as PDF
- 🌐 Backend integration (Firebase/Node.js) for real-time sync
- 🔒 Authentication and secure user sessions

---

## 🙌 Contributing

Have ideas to improve PeerConnect?  
Feel free to fork the repo, submit a pull request, or open an issue!

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

## 🔑 Let’s Connect Students Beyond Classrooms!

> *"Collaboration is the key to innovation—PeerConnect is the first step."*