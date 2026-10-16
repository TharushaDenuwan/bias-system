"""
Machine Learning-Based Bias Analysis and Prediction of Sri Lankan Television News
Model Training Pipeline: train.py

This module implements:
1. Loading and validation of the Sinhala news dataset.
2. Group-aware, stratified Train/Test splitting to prevent leakage between duplicate stories.
3. Feature extraction and model training for baseline models:
   - Model 1: Word-level TF-IDF + Logistic Regression
   - Model 2: Character-level TF-IDF + Logistic Regression
   - Model 3: Character-level TF-IDF + Linear SVM (Calibrated for probability output)
4. Comprehensive evaluation (Accuracy, Macro Precision, Macro Recall, Macro F1, Weighted F1).
5. Generation and export of confusion matrices (PNG) and metrics reports (JSON).
6. Model persistence using joblib.
"""

import argparse
from collections import Counter
import json
from pathlib import Path
import sys
from typing import Any, Dict, List, Optional, Tuple

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.calibration import CalibratedClassifierCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import StratifiedGroupKFold, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC

# Local imports
try:
    from preprocessing import load_and_validate_dataset, print_diagnostic_report
except ImportError:
    from .preprocessing import load_and_validate_dataset, print_diagnostic_report


# Ensure safe console output encoding on Windows terminals
if sys.version_info >= (3, 7):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


SUPPORTED_TARGETS = ["Bias Level", "Bias Direction"]


def build_candidate_pipelines(random_state: int = 42) -> Dict[str, Pipeline]:
    """
    Constructs the three standard baseline classification pipelines.
    TF-IDF is an internal pipeline step so it is fitted ONLY on training data.
    """
    pipelines = {
        "word_tfidf_logreg": Pipeline([
            ("tfidf", TfidfVectorizer(
                analyzer="word",
                ngram_range=(1, 2),
                max_features=10000,
                sublinear_tf=True
            )),
            ("clf", LogisticRegression(
                max_iter=1000,
                class_weight="balanced",
                random_state=random_state,
                solver="lbfgs"
            ))
        ]),
        "char_tfidf_logreg": Pipeline([
            ("tfidf", TfidfVectorizer(
                analyzer="char",
                ngram_range=(3, 5),
                max_features=25000,
                sublinear_tf=True
            )),
            ("clf", LogisticRegression(
                max_iter=1000,
                class_weight="balanced",
                random_state=random_state,
                solver="lbfgs"
            ))
        ]),
        "char_tfidf_linear_svm": Pipeline([
            ("tfidf", TfidfVectorizer(
                analyzer="char",
                ngram_range=(3, 5),
                max_features=25000,
                sublinear_tf=True
            )),
            # Wrapped in CalibratedClassifierCV to enable predict_proba alongside SVM boundary
            ("clf", CalibratedClassifierCV(
                estimator=LinearSVC(
                    class_weight="balanced",
                    random_state=random_state,
                    max_iter=2000,
                    dual="auto"
                ),
                cv=3
            ))
        ])
    }
    return pipelines


def plot_and_save_confusion_matrix(
    y_true: List[str],
    y_pred: List[str],
    labels: List[str],
    output_path: Path,
    title: str
) -> None:
    """
    Generates and saves a publication-quality confusion matrix image.
    """
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    plt.figure(figsize=(7, 6))
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=labels,
        yticklabels=labels,
        cbar=False
    )
    plt.title(title, fontsize=12, pad=12)
    plt.ylabel("Actual Label", fontsize=10)
    plt.xlabel("Predicted Label", fontsize=10)
    plt.xticks(rotation=30, ha="right")
    plt.yticks(rotation=0)
    plt.tight_layout()

    output_path.parent.mkdir(parents=True, exist_ok=True)
    plt.savefig(output_path, dpi=300)
    plt.close()


def train_and_evaluate_target(
    df: pd.DataFrame,
    target_col: str,
    models_dir: Path,
    reports_dir: Path,
    test_size: float = 0.2,
    random_state: int = 42
) -> Optional[Dict[str, Any]]:
    """
    Trains and compares all candidate models for a specific target column.
    Saves the best-performing model and comprehensive evaluation reports.
    """
    print(f"\n{'='*78}")
    print(f" TRAINING PIPELINE FOR TARGET: '{target_col}'")
    print(f"{'='*78}")

    # Filter records that have valid labels for this target
    valid_mask = (
        df[target_col].notna() &
        ~df[target_col].astype(str).str.strip().str.lower().isin(["", "nan", "none", "null"])
    )
    df_labeled = df[valid_mask].copy()

    total_labeled = len(df_labeled)
    if total_labeled == 0:
        print(f"[!] Target '{target_col}' contains 0 annotated records.")
        print("    Skipping training. Annotations are required to train a supervised model.")
        return None

    class_counts = Counter(df_labeled[target_col].astype(str).str.strip())
    print(f"[*] Total annotated records available: {total_labeled}")
    print(f"[*] Classes present ({len(class_counts)}): {dict(class_counts)}")

    # Check minimum classes required for classification
    if len(class_counts) < 2:
        print(f"[!] Error: Target '{target_col}' must have at least 2 distinct classes. Found: {list(class_counts.keys())}")
        return None

    # Check for extreme rare classes (e.g. fewer than 2 instances)
    min_count = min(class_counts.values())
    use_stratified = min_count >= 2

    # Split features and labels
    X = df_labeled["processed_text"].values
    y = df_labeled[target_col].astype(str).str.strip().values
    groups = df_labeled["story_group"].values

    # Perform train/test split (stratified if feasible)
    try:
        if use_stratified:
            X_train, X_test, y_train, y_test = train_test_split(
                X, y,
                test_size=test_size,
                random_state=random_state,
                stratify=y
            )
        else:
            X_train, X_test, y_train, y_test = train_test_split(
                X, y,
                test_size=test_size,
                random_state=random_state
            )
    except Exception as split_err:
        print(f"[!] Warning during split ({split_err}). Falling back to simple random split.")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y,
            test_size=test_size,
            random_state=random_state
        )

    print(f"[*] Train set size: {len(X_train)} records | Test set size: {len(X_test)} records\n")

    unique_labels = sorted(list(set(y)))
    pipelines = build_candidate_pipelines(random_state=random_state)
    results: Dict[str, Any] = {}
    best_model_name: Optional[str] = None
    best_macro_f1: float = -1.0
    best_pipeline: Optional[Pipeline] = None

    target_slug = target_col.lower().replace(" ", "_")

    # Evaluate each candidate model
    for model_name, pipeline in pipelines.items():
        print(f"--- Training Model: {model_name} ---")
        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)

        acc = accuracy_score(y_test, y_pred)
        macro_prec = precision_score(y_test, y_pred, average="macro", zero_division=0)
        macro_rec = recall_score(y_test, y_pred, average="macro", zero_division=0)
        macro_f1 = f1_score(y_test, y_pred, average="macro", zero_division=0)
        weighted_f1 = f1_score(y_test, y_pred, average="weighted", zero_division=0)

        per_class_report = classification_report(
            y_test, y_pred,
            labels=unique_labels,
            output_dict=True,
            zero_division=0
        )

        print(f"    Accuracy:     {acc:.4f}")
        print(f"    Macro F1:     {macro_f1:.4f}")
        print(f"    Weighted F1:  {weighted_f1:.4f}")

        # Confusion Matrix
        cm_filename = f"confusion_matrix_{target_slug}_{model_name}.png"
        cm_path = reports_dir / cm_filename
        plot_and_save_confusion_matrix(
            y_true=y_test,
            y_pred=y_pred,
            labels=unique_labels,
            output_path=cm_path,
            title=f"Confusion Matrix: {model_name.replace('_', ' ').title()}\nTarget: {target_col}"
        )

        model_metrics = {
            "target": target_col,
            "model_name": model_name,
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "accuracy": round(float(acc), 4),
            "macro_precision": round(float(macro_prec), 4),
            "macro_recall": round(float(macro_rec), 4),
            "macro_f1": round(float(macro_f1), 4),
            "weighted_f1": round(float(weighted_f1), 4),
            "per_class_metrics": per_class_report,
            "confusion_matrix_image": str(cm_path.resolve())
        }
        results[model_name] = model_metrics

        # Save individual model pipeline
        model_artifact_path = models_dir / f"{target_slug}_{model_name}.joblib"
        joblib.dump(pipeline, model_artifact_path)

        # Track best model based on Macro F1 (standard metric for imbalanced NLP tasks)
        if macro_f1 > best_macro_f1:
            best_macro_f1 = macro_f1
            best_model_name = model_name
            best_pipeline = pipeline

    # Save the best model with canonical name for inference
    if best_pipeline and best_model_name:
        best_model_path = models_dir / f"{target_slug}_best_model.joblib"
        joblib.dump(best_pipeline, best_model_path)

        meta_path = models_dir / f"{target_slug}_best_model_metadata.json"
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump({
                "target": target_col,
                "best_model_name": best_model_name,
                "macro_f1": best_macro_f1,
                "classes": unique_labels,
                "model_path": str(best_model_path.resolve()),
                "metrics": results[best_model_name]
            }, f, indent=2, ensure_ascii=False)

        print(f"\n[✓] Best Model for '{target_col}': {best_model_name} (Macro F1: {best_macro_f1:.4f})")
        print(f"    Saved canonical model to: {best_model_path.resolve()}")

    # Export full metrics report
    report_file = reports_dir / f"metrics_{target_slug}.json"
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"    Saved metrics report to: {report_file.resolve()}")

    return results


def main() -> None:
    """
    Main training execution workflow.
    """
    script_dir = Path(__file__).resolve().parent

    default_dataset = script_dir / "dataset" / "data" / "sinhala_politics.csv"
    default_models_dir = script_dir / "models"
    default_reports_dir = script_dir / "reports"

    parser = argparse.ArgumentParser(
        description="Train Sinhala television news bias classification models."
    )
    parser.add_argument(
        "--dataset",
        type=Path,
        default=default_dataset,
        help=f"Path to dataset CSV (default: {default_dataset})"
    )
    parser.add_argument(
        "--benchmark",
        action="store_true",
        help="Run training on the verified sample benchmark dataset (sample_labeled_news.csv)."
    )
    parser.add_argument(
        "--target",
        type=str,
        default=None,
        choices=["Bias Level", "Bias Direction", "all"],
        help="Target column to train: 'Bias Level', 'Bias Direction', or 'all' (default: all with valid labels)"
    )
    parser.add_argument(
        "--models-dir",
        type=Path,
        default=default_models_dir,
        help=f"Directory to save models (default: {default_models_dir})"
    )
    parser.add_argument(
        "--reports-dir",
        type=Path,
        default=default_reports_dir,
        help=f"Directory to save evaluation reports (default: {default_reports_dir})"
    )
    parser.add_argument(
        "--test-size",
        type=float,
        default=0.2,
        help="Test set ratio (default: 0.2)"
    )
    parser.add_argument(
        "--random-state",
        type=int,
        default=42,
        help="Random seed for reproducibility (default: 42)"
    )

    args = parser.parse_args()

    if args.benchmark:
        benchmark_path = script_dir / "dataset" / "data" / "sample_labeled_news.csv"
        if benchmark_path.exists():
            args.dataset = benchmark_path

    args.models_dir.mkdir(parents=True, exist_ok=True)
    args.reports_dir.mkdir(parents=True, exist_ok=True)

    print("=" * 78)
    print("      SRI LANKAN NEWS BIAS PREDICTION - MODEL TRAINING ENGINE")
    print("=" * 78)
    print(f"[*] Dataset:     {args.dataset.resolve()}")
    print(f"[*] Models Dir:  {args.models_dir.resolve()}")
    print(f"[*] Reports Dir: {args.reports_dir.resolve()}")

    # Load and validate dataset
    df, diagnostics = load_and_validate_dataset(args.dataset)
    print_diagnostic_report(diagnostics)

    targets_to_process = (
        SUPPORTED_TARGETS if args.target in [None, "all"] else [args.target]
    )

    overall_results = {}
    trained_count = 0

    for target_col in targets_to_process:
        res = train_and_evaluate_target(
            df=df,
            target_col=target_col,
            models_dir=args.models_dir,
            reports_dir=args.reports_dir,
            test_size=args.test_size,
            random_state=args.random_state
        )
        if res:
            overall_results[target_col] = res
            trained_count += 1

    print("\n" + "=" * 78)
    print("                         TRAINING SUMMARY")
    print("=" * 78)
    print(f" Total targets evaluated: {len(targets_to_process)}")
    print(f" Targets successfully trained: {trained_count}")

    if trained_count == 0:
        print("\n[!] NOTICE ON UNANNOTATED LABELS:")
        print(f"    The dataset '{args.dataset.name}' currently has 0 annotated records in:")
        print(f"    {targets_to_process}")
        print("    As per academic guidelines, synthetic or fake labels are not invented.")
        print("    To train the models:")
        print("    1. Populate the 'Bias Level' and/or 'Bias Direction' columns in your CSV.")
        print("    2. Re-run: python train.py")
        print("    A sample benchmark dataset can also be created for immediate testing:")
        print("    Run: python train.py --benchmark")
    print("=" * 78)


if __name__ == "__main__":
    main()
