# 🛡️ IPReconX - Blacklisted IP Intelligence Viewer

IPReconX is a powerful Vue.js-based application designed for cybersecurity professionals and enthusiasts to **visualize and analyze blacklisted IPs** using external threat intelligence sources like **VirusTotal**.

## 🚀 Project Objective

The main goal of IPReconX is to:
- Help security teams **identify malicious IP addresses** in real-time.
- Enable **quick IP reputation checks** through VirusTotal integration.
- Provide an intuitive UI for navigating large IP blacklists with ease.

---

## 🧩 Features

- 🔍 **Search** and filter blacklisted IPs.
- 📄 **Paginated results** for efficient viewing of large data.
- 📊 **Detailed IP reputation reports** via VirusTotal.
- 📦 Modular and clean Vue 3 components for scalability.

---

## 📂 Project Structure

### 1. `BlackListedIps.vue`
- The **main component** displaying the blacklisted IPs list.
- Handles:
  - Search filtering.
  - Pagination control.
  - Navigation to the IP details page.

### 2. `IpDetails.vue`
- Displays **detailed threat intelligence** of a selected IP using **VirusTotal API**.
- Shows:
  - IP reputation.
  - Associated domains.
  - Threat categories.
  - Last analysis stats.

### 3. `Pagination.vue`
- A **reusable component** to handle paginated data.
- Provides previous/next page buttons and current page status.

---

## 🖼️ Screenshots

> _(You can add screenshots of the UI here)_

---

## 🔧 How to Run the Project

### 📦 Requirements
- Node.js (v14+)
- Vue CLI (`npm install -g @vue/cli`)

### 🛠️ Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/ipreconx.git
   cd ipreconx
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure VirusTotal API Key**
   - Create a `.env` file in the root directory:
     ```
     VITE_VIRUSTOTAL_API_KEY=your_virustotal_api_key
     ```

4. **Run the App**
   ```bash
   npm run dev
   ```

---

## 🧠 How It Works

- IP data (blacklist) is fetched from a remote or local JSON file or API.
- Clicking on an IP routes to `IpDetails.vue`, which fetches real-time data from [VirusTotal](https://www.virustotal.com/) using their API.
- Pagination improves UI performance when handling hundreds/thousands of entries.

---

## 🔐 About VirusTotal API

To access VirusTotal data:
- Create an account at [virustotal.com](https://www.virustotal.com/)
- Navigate to your profile > API Key
- Add the key to your `.env` file as shown above

> Note: Free tier has request limits (~500/day). Use wisely.

---

## 💡 Future Improvements

- 🔔 Notifications for new threats.
- 📈 Dashboard with charts.
- 🧾 Export reports (PDF, CSV).
- 🧠 Integration with other threat intel platforms (e.g., AbuseIPDB, GreyNoise).

---

## 🧑‍💻 Author

**Aryan Biju**  
Cybersecurity Developer & Analyst  
[LinkedIn](https://www.linkedin.com/in/aryanbiju) | [GitHub](https://github.com/finessefleet)

---

## ⚖️ License

This project is licensed under the MIT License.  
Feel free to fork, enhance, and contribute!

---

## 🙏 Acknowledgements

- [VirusTotal](https://www.virustotal.com/)
- Vue.js Documentation
- Open source community


---

## 🧑‍🏫 Mentor

**Tapomoy Adhikari**  
Principal Advisor, Finesse Fleet  
Guided the IPReconX project from concept to execution with strategic mentorship and expert advice.

