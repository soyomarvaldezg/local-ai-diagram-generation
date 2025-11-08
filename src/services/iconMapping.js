// Icon mapping for data engineering components
import {
  Database,
  HardDrive,
  Server,
  Cloud,
  CloudUpload,
  Download,
  Upload,
  Workflow,
  Cpu,
  Boxes,
  FileJson,
  FileSpreadsheet,
  FileText,
  Table,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Zap,
  GitBranch,
  Clock,
  RefreshCw,
  Play,
  CheckCircle,
  AlertCircle,
  Send,
  Inbox,
  Archive,
  Package,
  Layers,
  GitMerge,
  Filter,
  ArrowRightLeft,
  Share2,
  Globe,
  Lock,
  Key,
  Shield,
  FileCode,
  Code,
  Terminal,
  Container,
  Box,
} from "lucide-react";

// Icon categories for data engineering
export const ICON_CATEGORIES = {
  // Data Sources
  SOURCE: {
    color: "#10b981", // green
    keywords: [
      "source",
      "input",
      "origin",
      "extract",
      "read",
      "ingest",
      "collect",
      "capture",
      "receive",
      "fetch",
    ],
  },

  // Databases
  DATABASE: {
    color: "#3b82f6", // blue
    keywords: [
      "database",
      "db",
      "mysql",
      "postgres",
      "postgresql",
      "mongodb",
      "redis",
      "cassandra",
      "dynamodb",
      "oracle",
      "sql",
      "nosql",
      "rds",
      "aurora",
      "cosmos",
      "firestore",
    ],
  },

  // Data Warehouses
  WAREHOUSE: {
    color: "#8b5cf6", // purple
    keywords: [
      "warehouse",
      "dwh",
      "bigquery",
      "snowflake",
      "redshift",
      "synapse",
      "datawarehouse",
      "data warehouse",
      "olap",
    ],
  },

  // Data Lakes
  LAKE: {
    color: "#06b6d4", // cyan
    keywords: [
      "lake",
      "datalake",
      "data lake",
      "s3",
      "blob",
      "storage",
      "adls",
      "gcs",
      "delta",
      "iceberg",
      "hudi",
    ],
  },

  // Streaming/Messaging
  STREAM: {
    color: "#f59e0b", // amber
    keywords: [
      "stream",
      "streaming",
      "kafka",
      "kinesis",
      "pubsub",
      "eventhub",
      "message",
      "queue",
      "mq",
      "rabbitmq",
      "sqs",
      "sns",
      "event",
      "real-time",
      "realtime",
    ],
  },

  // Processing/Compute
  PROCESSING: {
    color: "#ec4899", // pink
    keywords: [
      "process",
      "processing",
      "transform",
      "compute",
      "spark",
      "flink",
      "dataflow",
      "emr",
      "databricks",
      "glue",
      "dataproc",
      "hadoop",
      "mapreduce",
      "presto",
      "trino",
      "dbt",
    ],
  },

  // ETL/Pipeline Tools
  PIPELINE: {
    color: "#6366f1", // indigo
    keywords: [
      "pipeline",
      "etl",
      "elt",
      "airflow",
      "dagster",
      "prefect",
      "luigi",
      "nifi",
      "data factory",
      "datafactory",
      "step functions",
      "composer",
      "workflow",
      "orchestration",
      "orchestrator",
    ],
  },

  // APIs/Services
  API: {
    color: "#14b8a6", // teal
    keywords: [
      "api",
      "rest",
      "graphql",
      "endpoint",
      "service",
      "microservice",
      "lambda",
      "function",
      "cloud function",
      "azure function",
    ],
  },

  // BI/Visualization
  VISUALIZATION: {
    color: "#f97316", // orange
    keywords: [
      "viz",
      "visual",
      "dashboard",
      "report",
      "bi",
      "tableau",
      "powerbi",
      "looker",
      "metabase",
      "superset",
      "quicksight",
      "data studio",
      "analytics",
    ],
  },

  // File Formats
  FILE: {
    color: "#64748b", // slate
    keywords: [
      "csv",
      "json",
      "parquet",
      "avro",
      "orc",
      "xml",
      "excel",
      "file",
      "document",
      "text",
    ],
  },

  // Cloud Providers - AWS
  AWS: {
    color: "#ff9900", // AWS orange
    keywords: ["aws", "amazon", "ec2", "ebs", "ecs", "eks", "sagemaker"],
  },

  // Cloud Providers - GCP
  GCP: {
    color: "#4285f4", // Google blue
    keywords: ["gcp", "google cloud", "gke", "vertex", "bigquery"],
  },

  // Cloud Providers - Azure
  AZURE: {
    color: "#0078d4", // Azure blue
    keywords: ["azure", "microsoft", "aks", "synapse"],
  },

  // Cache/Memory
  CACHE: {
    color: "#ef4444", // red
    keywords: ["cache", "redis", "memcached", "elasticache", "memory"],
  },

  // Data Quality/Monitoring
  MONITORING: {
    color: "#22c55e", // green
    keywords: [
      "monitor",
      "quality",
      "validation",
      "check",
      "alert",
      "observability",
      "datadog",
      "grafana",
      "prometheus",
    ],
  },

  // Security
  SECURITY: {
    color: "#dc2626", // dark red
    keywords: [
      "security",
      "encrypt",
      "auth",
      "iam",
      "vault",
      "kms",
      "secret",
      "key",
    ],
  },

  // Container/Orchestration
  CONTAINER: {
    color: "#0ea5e9", // sky
    keywords: ["docker", "container", "kubernetes", "k8s", "pod", "deployment"],
  },
};

// Map categories to Lucide icons
export const CATEGORY_ICONS = {
  SOURCE: Download,
  DATABASE: Database,
  WAREHOUSE: HardDrive,
  LAKE: Archive,
  STREAM: Activity,
  PROCESSING: Cpu,
  PIPELINE: Workflow,
  API: Send,
  VISUALIZATION: BarChart3,
  FILE: FileJson,
  AWS: Cloud,
  GCP: Cloud,
  AZURE: Cloud,
  CACHE: Zap,
  MONITORING: CheckCircle,
  SECURITY: Shield,
  CONTAINER: Box,
};

// Detect category from node label
export function detectCategory(label) {
  if (!label) return null;

  const lowerLabel = label.toLowerCase();

  for (const [category, config] of Object.entries(ICON_CATEGORIES)) {
    for (const keyword of config.keywords) {
      if (lowerLabel.includes(keyword)) {
        return {
          category,
          icon: CATEGORY_ICONS[category],
          color: config.color,
        };
      }
    }
  }

  // Default fallback
  return {
    category: "DEFAULT",
    icon: Server,
    color: "#64748b",
  };
}

// Get icon component and color for a label
export function getIconForLabel(label) {
  return detectCategory(label);
}
