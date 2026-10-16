"""
Machine Learning-Based Bias Analysis and Prediction of Sri Lankan Television News
Data Validation and Sinhala Text Preprocessing Module: preprocessing.py

This module handles:
1. Sinhala Unicode text cleaning and normalization without destroying linguistic meaning.
2. Dataset loading and schema validation using the actual project columns:
   ['Source', 'Timestamp', 'Headline', 'News Content', 'URL', 'Category', 'Bias Level', 'Bias Direction'].
3. Data diagnostics: duplicate detection, missing value analysis, and class distribution reporting.
"""

from collections import Counter
import html
from pathlib import Path
import re
import sys
from typing import Any, Dict, List, Optional, Set, Tuple

import pandas as pd


# Ensure safe console output encoding on Windows terminals
if sys.version_info >= (3, 7):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


# Regex patterns for Sinhala text cleaning
RE_HTML_TAGS = re.compile(r"<[^>]+>")
RE_MULTIPLE_SPACES = re.compile(r"[ \t]+")
RE_MULTIPLE_NEWLINES = re.compile(r"\n{2,}")
# Matches Sinhala characters (\u0D80-\u0DFF), English letters, numbers, and useful punctuation
RE_VALID_CHARS = re.compile(r"[^\u0D80-\u0DFFa-zA-Z0-9\s.,!?:;\"'()\-–—/%]")


def clean_sinhala_text(text: Optional[str]) -> str:
    """
    Cleans and normalizes Sinhala news text while preserving characters,
    numerals, and meaningful punctuation (quotes, question marks, periods).

    Args:
        text (str): Raw input Sinhala text.

    Returns:
        str: Normalized, clean text string.
    """
    if text is None or not isinstance(text, str):
        return ""

    # Unescape HTML entities (e.g. &nbsp;, &amp;)
    cleaned = html.unescape(text)

    # Remove HTML tags if present
    cleaned = RE_HTML_TAGS.sub(" ", cleaned)

    # Normalize typographical quotation marks and dashes
    cleaned = cleaned.replace("“", '"').replace("”", '"').replace("‘", "'").replace("’", "'")
    cleaned = cleaned.replace("–", "-").replace("—", "-")

    # Remove non-printing zero-width spaces/characters (keep ZWJ/ZWNJ only if needed, strip rogue ones)
    cleaned = cleaned.replace("\u200b", "").replace("\ufeff", "")

    # Remove non-Sinhala, non-alphanumeric, non-standard punctuation noise
    cleaned = RE_VALID_CHARS.sub(" ", cleaned)

    # Normalize whitespace
    cleaned = RE_MULTIPLE_SPACES.sub(" ", cleaned)
    cleaned = RE_MULTIPLE_NEWLINES.sub("\n", cleaned)

    return cleaned.strip()


def prepare_article_text(headline: Optional[str], content: Optional[str]) -> str:
    """
    Combines headline and news content into a single representation for classification.
    Headlines often contain the most direct framing/bias signals in television news.
    """
    clean_h = clean_sinhala_text(headline)
    clean_c = clean_sinhala_text(content)

    if clean_h and clean_c:
        return f"{clean_h}. {clean_c}"
    elif clean_c:
        return clean_c
    elif clean_h:
        return clean_h
    return ""


def load_and_validate_dataset(
    csv_path: Path,
    target_col: Optional[str] = None
) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Loads and validates the news dataset from a CSV file.

    Performs:
    1. Unicode-safe loading (UTF-8 with BOM / standard UTF-8 fallback).
    2. Verification of actual schema columns.
    3. Preprocessing of 'Headline' and 'News Content' into 'processed_text'.
    4. Duplicate story detection.
    5. Missing text and missing label analysis.

    Args:
        csv_path (Path): Path to CSV dataset file.
        target_col (str, optional): Target column name to validate (e.g. 'Bias Level', 'Bias Direction').

    Returns:
        Tuple[pd.DataFrame, Dict[str, Any]]:
            - Cleaned DataFrame containing valid rows with 'processed_text'.
            - Diagnostic summary dictionary.
    """
    if not csv_path.exists():
        raise FileNotFoundError(f"Dataset file not found at: {csv_path.resolve()}")

    try:
        df = pd.read_csv(csv_path, encoding="utf-8-sig")
    except UnicodeDecodeError:
        df = pd.read_csv(csv_path, encoding="utf-8")

    total_loaded = len(df)
    diagnostics: Dict[str, Any] = {
        "dataset_path": str(csv_path.resolve()),
        "total_records_loaded": total_loaded,
        "columns_found": list(df.columns),
        "missing_values_by_column": df.isna().sum().to_dict(),
        "duplicate_headlines": int(df.duplicated(subset=["Headline"]).sum()) if "Headline" in df.columns else 0,
        "duplicate_urls": int(df.duplicated(subset=["URL"]).sum()) if "URL" in df.columns else 0,
    }

    # Verify text columns
    has_headline = "Headline" in df.columns
    has_content = "News Content" in df.columns

    if not has_headline and not has_content:
        raise ValueError(
            f"Dataset does not contain 'Headline' or 'News Content' columns. "
            f"Found columns: {list(df.columns)}"
        )

    # Build clean combined text column
    headlines = df["Headline"].fillna("") if has_headline else [""] * total_loaded
    contents = df["News Content"].fillna("") if has_content else [""] * total_loaded

    processed_texts = [
        prepare_article_text(h, c) for h, c in zip(headlines, contents)
    ]
    df["processed_text"] = processed_texts

    # Exclude empty text rows
    valid_text_mask = df["processed_text"].str.strip().str.len() > 10
    empty_text_count = int((~valid_text_mask).sum())
    diagnostics["empty_text_rows_excluded"] = empty_text_count

    df_valid = df[valid_text_mask].copy()

    # Generate a story/event grouping key based on normalized headline to prevent train/test leakage
    if has_headline:
        df_valid["story_group"] = (
            df_valid["Headline"]
            .astype(str)
            .str.lower()
            .apply(lambda s: re.sub(r"[^\u0D80-\u0DFFa-zA-Z0-9]", "", s)[:40])
        )
    else:
        df_valid["story_group"] = df_valid.index.astype(str)

    # Check target column if specified
    if target_col:
        if target_col not in df.columns:
            diagnostics["target_status"] = f"Column '{target_col}' does not exist in dataset."
            diagnostics["labeled_rows_count"] = 0
            diagnostics["unlabeled_rows_count"] = len(df_valid)
            diagnostics["class_distribution"] = {}
        else:
            target_series = df_valid[target_col].dropna().astype(str).str.strip()
            # Filter out empty strings or nan strings
            target_series = target_series[~target_series.str.lower().isin(["", "nan", "none", "null"])]
            diagnostics["labeled_rows_count"] = int(len(target_series))
            diagnostics["unlabeled_rows_count"] = int(len(df_valid) - len(target_series))
            diagnostics["class_distribution"] = dict(Counter(target_series))

    diagnostics["valid_records_retained"] = len(df_valid)
    return df_valid, diagnostics


def print_diagnostic_report(diagnostics: Dict[str, Any]) -> None:
    """
    Prints a clean summary of dataset validation diagnostics.
    """
    print("=" * 78)
    print("                      DATASET DIAGNOSTICS REPORT")
    print("=" * 78)
    print(f" Source File:                {diagnostics.get('dataset_path', 'N/A')}")
    print(f" Total Records Loaded:       {diagnostics.get('total_records_loaded', 0)}")
    print(f" Valid Records Retained:     {diagnostics.get('valid_records_retained', 0)}")
    print(f" Empty Text Rows Excluded:   {diagnostics.get('empty_text_rows_excluded', 0)}")
    print(f" Duplicate Headlines:        {diagnostics.get('duplicate_headlines', 0)}")
    print(f" Duplicate URLs:             {diagnostics.get('duplicate_urls', 0)}")

    if "target_status" in diagnostics:
        print(f"\n Target Status:              {diagnostics['target_status']}")
    if "labeled_rows_count" in diagnostics:
        print(f" Annotated Records Available: {diagnostics['labeled_rows_count']}")
        print(f" Unannotated Records:        {diagnostics['unlabeled_rows_count']}")

    dist = diagnostics.get("class_distribution", {})
    if dist:
        print("\n Class Distribution:")
        for label, count in sorted(dist.items(), key=lambda x: x[1], reverse=True):
            pct = (count / diagnostics["labeled_rows_count"]) * 100 if diagnostics["labeled_rows_count"] else 0
            print(f"   - {label:<20}: {count:>5} ({pct:.1f}%)")
    print("=" * 78)
