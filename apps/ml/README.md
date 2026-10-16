# Machine Learning-Based Bias Analysis and Prediction of Sri Lankan Television News

This module provides the complete, production-ready machine learning pipeline for the final-year research project **“Machine Learning-Based Bias Analysis and Prediction of Sri Lankan Television News.”**

It is designed to handle Sinhala Unicode text, train baseline classification pipelines, evaluate framing/bias patterns, and serve inference predictions directly to your Next.js application.

---

## 1. Architecture Overview

```text
apps/ml/
├── requirements.txt         # Core Python dependencies
├── preprocessing.py         # Reusable Sinhala Unicode normalizer & dataset validator
├── train.py                 # Multi-model training, cross-validation, and model persistence
├── evaluate.py              # Model evaluation suite (metrics calculation, confusion matrices)
├── predict.py               # CLI inference module with class probabilities & disclaimers
├── api/
│   └── main.py              # FastAPI inference microservice for Next.js integration
├── dataset/
│   ├── convert_dataset.py   # Multi-folder JSON to CSV compiler
│   └── data/
│       ├── sinhala_politics.csv    # Primary research dataset (1,248 Lankadeepa politics records)
│       └── sample_labeled_news.csv # Verified benchmark dataset with complete class coverage
├── models/                  # Serialized .joblib pipelines (vectorizers + classifiers)
├── reports/                 # Machine-readable metric JSONs, evaluation CSVs, and confusion matrices
└── README.md                # Documentation and execution guide
```

---

## 2. Models & Feature Pipelines

The system implements and compares three traditional NLP baseline models:

1. **Word-level TF-IDF + Logistic Regression**:
   - Captures political keywords and domain-specific lexical indicators ($n$-gram range: 1–2, sublinear term frequency).
   - Regularized with balanced class weights.
2. **Character-level TF-IDF + Logistic Regression**:
   - Captures sub-word morphology, inflections, and grammatical affixes inherent to agglutinative Sinhala syntax ($n$-gram range: 3–5).
3. **Character-level TF-IDF + Linear Support Vector Machine (`LinearSVC`)**:
   - Calibrated via `CalibratedClassifierCV` (Platt scaling) to output reliable class probabilities alongside max-margin decision boundaries.

### Supported Prediction Targets
- **`Bias Level`**: Discrete severity scale (`Neutral`, `Low`, `Medium`, `High`).
- **`Bias Direction`**: Political framing alignment (`Neutral`, `Pro-Government`, `Anti-Government`).

---

## 3. Setup & Installation (Windows PowerShell)

Run all commands from Windows PowerShell inside the project directory:

### Step 1: Open Terminal & Navigate to `apps/ml`
```powershell
cd "c:\Disc D\IIT\Final Year\FYP\Code\bias-system\apps\ml"
```

### Step 2: (Optional) Create & Activate a Virtual Environment
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### Step 3: Install Required Dependencies
```powershell
python -m pip install -r requirements.txt
```

---

## 4. Execution Workflow

### A. Train Baseline Models
To train the models on your annotated dataset:
```powershell
# Train models for both targets on primary dataset
python train.py

# Or train on the verified benchmark dataset to evaluate immediately
python train.py --benchmark
```

### B. Evaluate Saved Models
To compute comprehensive evaluation metrics and generate confusion matrices:
```powershell
python evaluate.py
```
This generates:
- `reports/model_evaluation_summary.csv` — Full comparison table across all models.
- `reports/metrics_bias_level.json` and `metrics_bias_direction.json` — Detailed per-class precision, recall, and F1-scores.
- `reports/eval_cm_*.png` — Publication-ready confusion matrix images.

### C. Run Predictions via Command Line
Predict the bias of any Sinhala headline or article text:
```powershell
python predict.py --text "ගොවීන්ට වෙලාවට පෝරටික දෙන්නවත් බැරි තරමට මේ ආණ්ඩුව අසමත්."
```

Output formatted as JSON for automated pipelines:
```powershell
python predict.py --text "පරිසර ක්ෂේත්‍රය සම්බන්ධයෙන් තීන්දු තීරණ ගත යුත්තේ විද්‍යාත්මකව බව විපක්ෂය පවසයි." --json
```

Or predict from a text file:
```powershell
python predict.py --file path\to\article.txt
```

---

## 5. Next.js Integration

### A. Start the FastAPI Microservice
Run the FastAPI service on port 8000:
```powershell
python api/main.py
```
The interactive Swagger API documentation will be available at:
`http://127.0.0.1:8000/docs`

### B. Calling the Microservice from Next.js
In your Next.js application (`apps/web`), create a Route Handler or Server Action (e.g. `apps/web/src/app/api/bias-analysis/route.ts`):

```typescript
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length < 5) {
      return NextResponse.json(
        { error: "Valid Sinhala text of at least 5 characters is required." },
        { status: 400 }
      );
    }

    // Call Python FastAPI microservice
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.detail }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Could not connect to Python ML service. Ensure it is running on port 8000." },
      { status: 503 }
    );
  }
}
```

---

## 6. Sinhala Pretrained Transformer Assessment

As a planned second experiment, fine-tuning a multilingual or Sinhala-specific transformer can be assessed:

1. **Pretrained Candidates**:
   - `xlm-roberta-base` (Facebook): Strong cross-lingual capabilities including Sinhala.
   - `sinhala-roberta` / `SinBERT` (Hugging Face community): Native Sinhala Byte-Pair Encoding (BPE).
2. **Resource Requirements**:
   - Dedicated NVIDIA GPU with $\ge 8\text{ GB}$ VRAM (CUDA enabled).
   - PyTorch (`torch`), `transformers`, `accelerate`.
3. **Dataset Feasibility**:
   - Fine-tuning requires at least 500–1,000 consistently annotated training examples per target class to prevent severe overfitting.
   - Baseline TF-IDF models implemented here provide the essential benchmark against which any future transformer gain must be scientifically measured.

---

## 7. Research Ethics & Limitations

- **Framing vs. Factual Truth**: These models predict linguistic framing and sentiment-leaning patterns learned from training annotations. A model prediction is a statistical estimate and **never** represents verified factual truth or definitive proof of bias.
- **Credibility Distinction**: Political bias is separate from credibility. Factually true news can have strong partisan framing, while fake news can be neutrally phrased.
