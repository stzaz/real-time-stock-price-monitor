# 📊 Real-Time Stock Price Monitor

A full-stack project that fetches real-time stock prices, processes them through AWS services, and displays them in an interactive Next.js dashboard with live charting and trend indicators.

---

## 🚀 Features

- ✅ Scheduled AWS Lambda fetches stock prices every 5 minutes
- ✅ Uses SQS to queue data and DynamoDB to store it
- ✅ Displays live stock data and historical charts
- ✅ Interactive UI with selectable symbols and trend arrows
- ✅ Auto-refreshing table and chart every 30 seconds

---

## 🧱 Tech Stack

**Frontend**:

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Recharts](https://recharts.org/) (charting)

**Backend**:

- [AWS Lambda](https://aws.amazon.com/lambda/) (stock fetching and processing)
- [Amazon SQS](https://aws.amazon.com/sqs/) (messaging)
- [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) (storage)
- [EventBridge](https://docs.aws.amazon.com/eventbridge/latest/userguide/what-is-amazon-eventbridge.html) (scheduling)
- [yfinance](https://github.com/ranaroussi/yfinance) (Python stock price API)

---

## 📦 Architecture Overview

> (Diagram to be added here)

---

## 📈 Dashboard Overview

- 🧮 Table showing current price, trend, and timestamp for 10 stocks
- 📉 Chart that shows historical price trends per symbol
- 🔁 Auto-refresh every 30 seconds
- 🧭 Users can click a row or use a dropdown to switch symbols

---

## 🛠️ Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/real-time-stock-price-monitor.git
cd real-time-stock-price-monitor/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env.local` file in the `frontend/` directory:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-2
```

### 4. Start the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🚀

---

## 📤 Deployment

Frontend can be deployed via [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

Backend components run on AWS:

- Lambda functions zipped and uploaded manually or via CI
- SQS queue must be created in the same region
- DynamoDB table should have `symbol` as partition key and `timestamp` as sort key

---

## ✨ Future Enhancements

- Add predictive modeling (linear regression or ML-based)
- Integrate global news sentiment for smarter insights
- Add mobile responsiveness and alerts

---

## 📄 License

MIT
