# 🌱 Minimalist Yearly Growth Tracker

> "Small Habits. Big Change."

A lightweight, privacy-focused habit tracker that lives entirely in your browser. No login required, no servers, no databases. Your data stays on your device.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## 🚀 Live Demo
**[Click here to use the Tracker](YOUR_VERCEL_LINK_HERE)**
*(Replace the link above with your actual Vercel link after deploying)*

## ✨ Features

* **🔒 100% Private:** Uses LocalStorage. Your data never leaves your device.
* **📅 Full Year Support:** Switch between months (Jan-Dec) without losing data.
* **💾 Auto-Save:** Every checkmark and text input saves instantly.
* **📱 Fully Responsive:** Works perfectly on Desktop, Tablets, and Mobile phones.
* **⚡ Blazing Fast:** Zero loading time. Built with pure HTML, CSS, and JS.
* **💤 Sleep Tracker:** Dedicated section to track sleep hours alongside habits.
* **📊 Progress Bar:** Visual completion rate for the current month.

## 🛠️ How it Works (The Tech)

This project is built with **Vanilla JavaScript** (no heavy frameworks).

1.  **Local Storage:** The app creates a unique key for every month (e.g., `tracker_2024_January`).
2.  **Data Isolation:** When you open the site on your phone, the data lives on your phone. If you open it on a laptop, it's a fresh slate. This ensures checking a box on your device doesn't affect anyone else using the site.
3.  **State Management:** The app listens for every `click` and `input` event to save the state immediately, preventing data loss if the tab is closed.

## 📂 Project Structure

```bash
├── index.html    # The skeleton and layout
├── style.css     # Responsive styling and design system
└── script.js     # Logic for saving, loading, and month switching
