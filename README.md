
# 🛡️ IPReconX

**IPReconX** is an automated suspicious IP blacklist aggregator that collects, normalizes, and manages threat intelligence feeds from multiple public sources. It is designed to help cybersecurity professionals and SOC teams enrich their detection workflows by offering an up-to-date, deduplicated IP blacklist in a usable format.

---

## 📌 Features

- ✅ Fetches IP data from multiple threat intel feeds
- 🔄 Normalizes and deduplicates incoming data
- 📁 Outputs blacklist in JSON and TXT formats
- 🌐 Lightweight dashboard to view and download data
- 🔁 Easily extensible with new sources or custom formats
- 🔍 Timestamp tracking for `firstSeen` and `lastSeen`
- ⚙️ Cron/CI compatible for scheduled updates

---

## 🏗️ Project Architecture

```
ipreconx/
│
├── src/
│   ├── feeds/            # Feed-specific fetching modules
│   ├── normalize.js      # Normalize raw feed data
│   ├── dedupe.js         # Merge and deduplicate IPs
│   └── updater.js        # Orchestrates fetching, deduplication and output
│
├── public/               # Vue.js frontend for viewing blacklists
├── test/                 # Unit tests for normalization and merging logic
├── blacklist.txt         # Plain list of IPs for firewall/SIEM use
├── blacklist.json        # Structured output with metadata
│
├── .env.example          # Environment variable template
├── vite.config.js        # Frontend bundler config
├── package.json          # Project metadata and scripts
└── README.md             # You are here.
```

---

## 🚀 How It Works

1. **Fetching Feeds**  
   Feed modules in `src/feeds/` connect to public threat sources like AbuseIPDB, open threat lists, malware domain trackers, etc.

2. **Normalization**  
   Each IP entry is parsed into a consistent format:
   ```json
   {
     "ip": "192.168.1.1/32",
     "firstSeen": "2025-06-01T12:00:00Z",
     "lastSeen": "2025-06-25T08:00:00Z",
     "source": "abuseipdb"
   }
   ```

3. **Deduplication**  
   Duplicate entries are merged. For each IP:
   - Choose earliest `firstSeen`
   - Choose latest `lastSeen`
   - Combine `source` fields

4. **Output**  
   After processing:
   - `blacklist.txt` contains IPs/CIDRs only (for firewalls)
   - `blacklist.json` contains full metadata (for analysis, APIs)

5. **UI (Optional)**  
   Simple Vue.js interface to:
   - View current blacklist
   - Trigger updates
   - Download outputs

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/finessefleet/ipreconx.git
cd ipreconx
```

### 2. Install Dependencies

```bash
npm ci
```

### 3. Configure Environment

Copy `.env.example` and fill in details:

```bash
cp .env.example .env
```

### 4. Run Locally

```bash
npm start         # Executes updater script
npm run dev       # Launches frontend dashboard
```

### 5. Run Tests

```bash
npm test
```

---

## 🧪 Testing Strategy

- All normalization and deduplication logic is tested via `test/unit/`
- Includes edge cases like:
  - Invalid IPs
  - Mixed CIDR and IP
  - Conflicting timestamps
  - Overlapping sources

---

## 🧭 Use Cases

| Use Case                  | Description |
|---------------------------|-------------|
| 🔥 Firewall Integration    | Load `blacklist.txt` into iptables/pf |
| 📊 SOC Dashboards         | Show suspicious IP activity trends |
| 🔍 Analyst Verification    | Compare external feeds with internal logs |
| ⚠️ SIEM Alert Enrichment  | Add context to logs using IP metadata |

---

## ➕ Adding a New Feed

1. Create a file under `src/feeds/`, e.g. `newsource.js`
2. Export a `fetch()` function that returns an array of IPs or objects
3. Normalize using existing structure in `normalize.js`
4. Add it to the `updater.js` feed loop

---

## 🧰 Tech Stack

- **Node.js** (Data processing)
- **Vue.js** (Frontend UI)
- **Jest** or **Vitest** (Testing)
- **Vite** (Frontend bundling)
- **dotenv** (Env configs)

---

## 👨‍💻 Contributors

- Aryan Biju  
- Richu Suresh  
(Team FinesseFleet)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📣 Final Note

This project was built as part of a cybersecurity initiative to simplify and centralize blacklisting workflows. It combines the power of automation, analysis, and modularity, making it suitable for both personal SOC tools and enterprise security pipelines.

Feel free to fork, extend, or contribute. Threat intelligence should be accessible to all defenders.

---
