"""
Machine Learning-Based Bias Analysis and Prediction of Sri Lankan Television News
Evaluation and Reporting Module: evaluate.py

This module:
1. Loads serialized models from the models/ directory.
2. Evaluates models on a test dataset.
3. Computes comprehensive classification metrics:
   - Accuracy
   - Macro Precision, Recall, F1-score
   - Weighted Precision, Recall, F1-score
   - Per-class Precision, Recall, F1-score
   - Confusion Matrix
4. Saves metric reports in JSON and CSV formats and generates confusion matrix visualizations.
"""

import argparse
import json
from pathlib import Path
import sys
from typing import Any, Dict, List, Optional, Tuple

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)

# Local imports
try:
    from preprocessing import clean_sinhala_text, load_and_validate_dataset
except ImportError:
    from .preprocessing import clean_sinhala_text, load_and_validate_dataset


# Ensure safe console output encoding on Windows terminals
if sys.version_info >= (3, 7):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


def evaluate_saved_model(
    model_path: Path,
    df: pd.DataFrame,
    target_col: str,
    reports_dir: Path
) -> Optional[Dict[str, Any]]:
    """
    Evaluates a single saved joblib pipeline on the given dataset.
    """
    if not model_path.exists():
        print(f"[!] Model file not found: {model_path}")
        return None

    # Filter labeled rows
    valid_mask = (
        df[target_col].notna() &
        ~df[target_col].astype(str).str.strip().str.lower().isin(["", "nan", "none", "null"])
    )
    df_eval = df[valid_mask].copy()

    if len(df_eval) == 0:
        print(f"[!] No valid ground-truth labels for '{target_col}' in dataset.")
        return None

    X_test = df_eval["processed_text"].values
    y_true = df_eval[target_col].astype(str).str.strip().values

    # Load model pipeline
    pipeline = joblib.load(model_path)
    y_pred = pipeline.predict(X_test)

    unique_labels = sorted(list(set(y_true) | set(y_pred)))

    acc = accuracy_score(y_true, y_pred)
    macro_prec = precision_score(y_true, y_pred, average="macro", zero_division=0)
    macro_rec = recall_score(y_true, y_pred, average="macro", zero_division=0)
    macro_f1 = f1_score(y_true, y_pred, average="macro", zero_division=0)
    weighted_f1 = f1_score(y_true, y_pred, average="weighted", zero_division=0)

    per_class = classification_report(
        y_true, y_pred,
        labels=unique_labels,
        output_dict=True,
        zero_division=0
    )

    cm = confusion_matrix(y_true, y_pred, labels=unique_labels)

    # Plot Confusion Matrix
    model_slug = model_path.stem
    cm_path = reports_dir / f"eval_cm_{model_slug}.png"
    reports_dir.mkdir(parents=True, exist_ok=True)

    plt.figure(figsize=(6, 5))
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=unique_labels,
        yticklabels=unique_labels,
        cbar=False
    )
    plt.title(f"Evaluation Confusion Matrix\nModel: {model_slug}", fontsize=11)
    plt.ylabel("True Class")
    plt.xlabel("Predicted Class")
    plt.xticks(rotation=30, ha="right")
    plt.tight_layout()
    plt.savefig(cm_path, dpi=300)
    plt.close()

    metrics = {
        "model_file": model_path.name,
        "target_evaluated": target_col,
        "sample_count": len(y_true),
        "accuracy": round(float(acc), 4),
        "macro_precision": round(float(macro_prec), 4),
        "macro_recall": round(float(macro_rec), 4),
        "macro_f1": round(float(macro_f1), 4),
        "weighted_f1": round(float(weighted_f1), 4),
        "classes": unique_labels,
        "confusion_matrix": cm.tolist(),
        "per_class_report": per_class,
        "confusion_matrix_image": str(cm_path.resolve())
    }
    return metrics


def main() -> None:
    """
    Main evaluation routine.
    """
    script_dir = Path(__file__).resolve().parent

    default_models_dir = script_dir / "models"
    default_reports_dir = script_dir / "reports"
    default_dataset = script_dir / "dataset" / "data" / "sample_labeled_news.csv"

    parser = argparse.ArgumentParser(
        description="Evaluate saved bias prediction models on news datasets."
    )
    parser.add_argument(
        "--dataset",
        type=Path,
        default=default_dataset,
        help=f"Dataset CSV for evaluation (default: {default_dataset})"
    )
    parser.add_argument(
        "--models-dir",
        type=Path,
        default=default_models_dir,
        help=f"Path to models directory (default: {default_models_dir})"
    )
    parser.add_argument(
        "--reports-dir",
        type=Path,
        default=default_reports_dir,
        help=f"Path to reports directory (default: {default_reports_dir})"
    )

    args = parser.parse_args()

    print("=" * 78)
    print("        SRI LANKAN NEWS BIAS PREDICTION - MODEL EVALUATION SUITE")
    print("=" * 78)
    print(f"[*] Evaluation Dataset: {args.dataset.resolve()}")
    print(f"[*] Models Directory:   {args.models_dir.resolve()}")
    print(f"[*] Reports Directory:  {args.reports_dir.resolve()}\n")

    if not args.dataset.exists():
        print(f"[!] Error: Dataset not found: {args.dataset}")
        sys.exit(1)

    df, diag = load_and_validate_dataset(args.dataset)

    # Find candidate model files in models_dir
    model_files = sorted(list(args.models_dir.glob("*.joblib")))
    if not model_files:
        print("[!] No trained .joblib models found in models directory.")
        print("    Please run: python train.py --benchmark")
        sys.exit(1)

    summary_rows = []

    for model_path in model_files:
        model_name = model_path.stem
        # Deduce target from filename
        if "bias_level" in model_name:
            target_col = "Bias Level"
        elif "bias_direction" in model_name:
            target_col = "Bias Direction"
        else:
            continue

        metrics = evaluate_saved_model(
            model_path=model_path,
            df=df,
            target_col=target_col,
            reports_dir=args.reports_dir
        )

        if metrics:
            summary_rows.append({
                "Target": target_col,
                "Model": model_name,
                "Accuracy": metrics["accuracy"],
                "Macro F1": metrics["macro_f1"],
                "Weighted F1": metrics["weighted_f1"],
                "Macro Precision": metrics["macro_precision"],
                "Macro Recall": metrics["macro_recall"],
                "Samples": metrics["sample_count"]
            })

    if summary_rows:
        summary_df = pd.DataFrame(summary_rows)
        summary_csv = args.reports_dir / "model_evaluation_summary.csv"
        summary_df.to_csv(summary_csv, index=False, encoding="utf-8-sig")

        print("=" * 78)
        print("                       EVALUATION RESULTS SUMMARY")
        print("=" * 78)
        # Format table cleanly
        print(summary_df.to_string(index=False))
        print("=" * 78)
        print(f"\n[✓] Detailed evaluation summary saved to: {summary_csv.resolve()}")
    else:
        print("[!] No evaluation could be performed. Ensure ground truth labels exist in the dataset.")


if __name__ == "__main__":
    main()
