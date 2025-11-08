# 🎨 AI Diagram Generator

> Transform natural language descriptions into beautiful, color-coded data architecture diagrams using AI and voice input

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff.svg)

## ✨ Features

- 🤖 **AI-Powered Generation**: Multiple AI providers (Groq, Cerebras, Gemini)
- 🎤 **Voice Input**: Speak your architecture in English or Spanish
- 🎯 **Smart Icon Detection**: 70+ data engineering keywords automatically recognized
- 🌈 **Color-Coded Categories**: 17 distinct visual categories
- 📊 **Interactive Diagrams**: Pan, zoom, and explore your architecture
- ⚡ **Real-time Generation**: Fast diagram creation with live preview

## 🎯 Supported Technologies

### 📦 Data Sources & Databases

MySQL, PostgreSQL, MongoDB, Redis, Cassandra, DynamoDB, Oracle, Cosmos DB, Firestore

### 🏢 Data Warehouses

BigQuery, Snowflake, Redshift, Synapse

### 🌊 Data Lakes

S3, Azure Blob Storage, GCS, Delta Lake, Iceberg, Apache Hudi

### 📡 Streaming & Messaging

Kafka, Kinesis, Pub/Sub, EventHub, RabbitMQ, SQS, SNS

### ⚙️ Processing Engines

Spark, Flink, Dataflow, EMR, Databricks, Glue, Dataproc, dbt

### 🔄 ETL & Orchestration

Airflow, Dagster, Prefect, Luigi, NiFi, Data Factory, Step Functions, Composer

### ☁️ Cloud Services

**AWS**: Lambda, EC2, ECS, EKS, S3, RDS, etc.
**GCP**: BigQuery, Dataflow, GKE, Vertex AI, etc.
**Azure**: Synapse, AKS, Blob Storage, etc.

### 📊 BI & Visualization

Tableau, Power BI, Looker, Metabase, Superset, QuickSight, Data Studio

## 🚀 Quick Start

### Prerequisites

- Node.js 20.19.0+ or 22.12.0+
- npm 8.0.0+

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd ai-diagram-tool
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# At least ONE API key is required

# Groq (Recommended - Fast & Free tier available)
VITE_GROQ_API_KEY=your_groq_api_key_here

# Cerebras (Optional - Ultra-fast)
VITE_CEREBRAS_API_KEY=your_cerebras_api_key_here

# Google Gemini (Optional)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**How to get API keys (Remember to use free tiers):**

- **Groq**: Sign up at [console.groq.com](https://console.groq.com)
- **Cerebras**: Register at [cloud.cerebras.ai](https://cloud.cerebras.ai)
- **Gemini**: Get key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Start the development server**

```bash
npm run dev
```

5. **Open your browser**

```
http://localhost:5173
```

## 📖 Usage

### Text Input

Simply describe your data architecture:

```
MySQL → Kafka → Spark → BigQuery → Looker
```

```
PostgreSQL and MongoDB → Airflow orchestrates → Databricks → Snowflake → Tableau
```

```
S3 data lake → AWS Glue ETL → Redshift warehouse → QuickSight dashboards
```

### Voice Input

1. Click the 🎤 Record button
2. Speak your architecture description
3. Click ⏹️ Stop when finished
4. The transcription appears in the text box
5. Click ✨ Generate to create the diagram

**Supported Languages**: English and Spanish

## 🎨 Visual Categories

Each component is automatically categorized and color-coded:

| Category             | Color             | Examples                      |
| -------------------- | ----------------- | ----------------------------- |
| 🗄️ **Database**      | Blue              | MySQL, PostgreSQL, MongoDB    |
| 🏢 **Warehouse**     | Purple            | BigQuery, Snowflake, Redshift |
| 🌊 **Lake**          | Cyan              | S3, Data Lake, Blob Storage   |
| 📡 **Stream**        | Amber             | Kafka, Kinesis, Pub/Sub       |
| ⚙️ **Processing**    | Pink              | Spark, Flink, Databricks      |
| 🔄 **Pipeline**      | Indigo            | Airflow, Dagster, Glue        |
| 🌐 **API**           | Teal              | REST, GraphQL, Lambda         |
| 📊 **Visualization** | Orange            | Tableau, Looker, Power BI     |
| ☁️ **Cloud**         | Provider-specific | AWS, GCP, Azure               |

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Diagram Library**: ReactFlow 11.11.4
- **Layout Engine**: Dagre 0.8.5
- **Icons**: Lucide React 0.263.1
- **Styling**: Tailwind CSS 3.4.18
- **AI Models**:
  - Groq
  - Cerebras
  - Google Gemini Flash
- **Speech-to-Text**: Groq Whisper Large v3

## 🎯 Example Prompts

### Simple Pipeline

```
MySQL → Spark → BigQuery
```

### Complex Multi-Cloud

```
PostgreSQL database → Kafka streaming → Spark processing →
Snowflake warehouse → Tableau visualization
```

### AWS Architecture

```
S3 → Lambda → Kinesis → EMR → Redshift → QuickSight
```

### GCP Data Platform

```
Cloud Storage → Dataflow → BigQuery → Looker Studio
```

### Real-time Analytics

```
API Gateway → Kafka → Flink → Redis cache →
MongoDB → Grafana dashboard
```

## 🔧 Configuration

### Adding More Keywords

Edit `src/services/iconMapping.js` to add custom keywords:

```javascript
DATABASE: {
  color: "#3b82f6",
  keywords: [
    "database",
    "mysql",
    // Add your custom keywords here
    "custom-db",
  ],
},
```

### Changing Provider Settings

Modify `src/services/providerConfig.js` to adjust:

- Model selection
- Temperature
- Token limits
- API endpoints

## 🐛 Troubleshooting

### No API keys configured

**Problem**: Yellow warning banner appears
**Solution**: Add at least one API key to `.env` file and restart dev server

### Microphone not working

**Problem**: "Could not access microphone" error
**Solution**:

1. Check browser permissions (click lock icon in address bar)
2. Use HTTPS or localhost (required for microphone access)
3. Try a different browser (Chrome/Edge recommended)

### Transcription fails

**Problem**: Voice input doesn't convert to text
**Solution**: Ensure `VITE_GROQ_API_KEY` is set (required for speech-to-text)

### Diagram not generating

**Problem**: Blank canvas after clicking Generate
**Solution**:

1. Check browser console for errors
2. Verify API keys are correct
3. Try a simpler prompt first
4. Check your API rate limits

## 📝 Development

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint code

```bash
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Here are some ideas:

- [ ] Add export functionality (PNG, SVG, Draw.io)
- [ ] Implement diagram templates
- [ ] Add more cloud provider icons
- [ ] Create edit mode for manual adjustments
- [ ] Add diagram history/versioning
- [ ] Implement collaborative features

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **ReactFlow** - Powerful diagram library
- **Lucide** - Beautiful icon set
- **Groq** - Fast AI inference
- **Dagre** - Graph layout algorithm
- **Vite** - Lightning-fast build tool

## 📧 Support

For issues, questions, or suggestions:

1. Check existing [Issues](your-repo-url/issues)
2. Create a new issue with detailed description
3. Include error messages and screenshots if applicable

---

**Made with ❤️ for data engineers and architects**

_Generate beautiful diagrams in seconds, not hours_
