"""
Machine Learning-Based Bias Analysis and Prediction of Sri Lankan Television News
Dataset Conversion Script: convert_dataset.py

This script traverses the news dataset directory recursively, reads individual
news article JSON files, validates their contents, preserves Sinhala Unicode
text, adds initial annotation columns (Bias Level and Bias Direction), detects
duplicate URLs without dropping records, and exports the combined dataset into a
standardized CSV encoded with UTF-8 with BOM (utf-8-sig) for Microsoft Excel compatibility.
"""

import argparse
from collections import defaultdict
import json
from pathlib import Path
import sys
from typing import Any, Dict, List, Optional, Tuple

import pandas as pd


# Ensure safe console output encoding on Windows terminals
if sys.version_info >= (3, 7):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Default fields expected in the dataset
PREFERRED_COLUMNS: List[str] = [
    "Source",
    "Timestamp",
    "Headline",
    "News Content",
    "URL",
    "Category",
    "Parent URL",
    "Bias Level",
    "Bias Direction",
]


def load_article_json(file_path: Path) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    """
    Read and parse a single news article JSON file safely.

    Handles Unicode encoding and invalid JSON formats gracefully.

    Args:
        file_path (Path): Path to the JSON file.

    Returns:
        Tuple[Optional[Dict[str, Any]], Optional[str]]:
            - Parsed dictionary if valid, else None.
            - Error description string if an error occurred, else None.
    """
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read().strip()

        if not content:
            return None, "File is empty"

        data = json.loads(content)

        if not isinstance(data, dict):
            return None, f"Unexpected JSON structure: expected object/dict, found {type(data).__name__}"

        return data, None

    except UnicodeDecodeError:
        # Fallback to UTF-8 with BOM if standard UTF-8 encounters decode issues
        try:
            with open(file_path, "r", encoding="utf-8-sig") as f:
                content = f.read().strip()
            data = json.loads(content)
            if not isinstance(data, dict):
                return None, f"Unexpected JSON structure: expected object/dict, found {type(data).__name__}"
            return data, None
        except Exception as fallback_error:
            return None, f"Encoding decode error: {fallback_error}"

    except json.JSONDecodeError as decode_error:
        return None, f"Invalid JSON syntax at line {decode_error.lineno}, column {decode_error.colno}: {decode_error.msg}"

    except PermissionError as perm_error:
        return None, f"Permission denied: {perm_error}"

    except Exception as general_error:
        return None, f"Error reading file: {general_error}"


def convert_dataset(
    news_dir: Path,
    output_file: Path,
    verbose: bool = False
) -> Optional[pd.DataFrame]:
    """
    Recursively scans news_dir for all JSON files, compiles them into a single
    Pandas DataFrame, adds empty bias annotation columns if missing, and saves
    to a CSV with UTF-8 BOM encoding.

    Args:
        news_dir (Path): Directory containing the news subfolders and JSON files.
        output_file (Path): Target path for the output CSV file.
        verbose (bool): If True, prints detailed warning for each skipped file.

    Returns:
        Optional[pd.DataFrame]: Combined DataFrame or None if no valid articles found.
    """
    print("=" * 80)
    print("  Machine Learning-Based Bias Analysis - News Dataset Converter")
    print("=" * 80)
    print(f"[*] News source directory: {news_dir.resolve()}")
    print(f"[*] Target output CSV:     {output_file.resolve()}\n")

    if not news_dir.exists() or not news_dir.is_dir():
        print(f"[!] Error: News directory does not exist or is not a directory: {news_dir}", file=sys.stderr)
        return None

    # Step 1: Discover all JSON files recursively
    print("[1/5] Searching for JSON files across all subfolders...")
    discovered_files: List[Path] = sorted(news_dir.rglob("*.json"))
    total_files_discovered = len(discovered_files)
    print(f"      Found {total_files_discovered} JSON file(s) in total.\n")

    if total_files_discovered == 0:
        print("[!] No JSON files discovered. Aborting conversion.", file=sys.stderr)
        return None

    # Step 2: Read each file and collect article records
    print("[2/5] Parsing and validating JSON files...")
    seen_file_paths: set = set()
    records: List[Dict[str, Any]] = []
    skipped_files: List[Tuple[Path, str]] = []
    url_to_files: Dict[str, List[Path]] = defaultdict(list)

    for file_path in discovered_files:
        canonical_path = file_path.resolve()

        # Prevent duplicate processing of the same physical file
        if canonical_path in seen_file_paths:
            skipped_files.append((file_path, "Duplicate file path already processed"))
            continue
        seen_file_paths.add(canonical_path)

        article_data, error = load_article_json(file_path)

        if error is not None:
            skipped_files.append((file_path, error))
            if verbose:
                print(f"      [SKIP] {file_path.name}: {error}")
            continue

        # Track article URL occurrences to detect duplicates without dropping records
        article_url = article_data.get("URL")
        if article_url:
            url_str = str(article_url).strip()
            if url_str:
                url_to_files[url_str].append(file_path)

        records.append(article_data)

    successfully_processed = len(records)
    print(f"      Successfully parsed: {successfully_processed} article(s)")
    print(f"      Skipped / invalid:   {len(skipped_files)} file(s)\n")

    # Step 3: Check and report duplicate article URLs
    print("[3/5] Checking for duplicate article URLs...")
    duplicate_urls = {
        url: files for url, files in url_to_files.items() if len(files) > 1
    }
    total_duplicate_urls = len(duplicate_urls)

    if total_duplicate_urls > 0:
        print(f"      [!] Warning: Detected {total_duplicate_urls} duplicate article URL(s).")
        print("          All records are preserved in the CSV without silent deletion.")
        # Print up to 5 examples of duplicate URLs
        preview_count = min(5, total_duplicate_urls)
        print(f"          Showing {preview_count} example(s):")
        for i, (dup_url, files) in enumerate(list(duplicate_urls.items())[:preview_count], 1):
            file_names = ", ".join(f.name for f in files)
            print(f"            {i}. URL: {dup_url}")
            print(f"               Occurrences in: {file_names}")
    else:
        print("      [OK] No duplicate article URLs detected across processed files.\n")

    if not records:
        print("[!] No valid article records to export. CSV was not generated.", file=sys.stderr)
        return None

    # Step 4: Build DataFrame and organize columns
    print("[4/5] Organizing columns and preparing DataFrame...")
    df = pd.DataFrame(records)

    # Ensure Bias annotation columns exist without inventing labels
    if "Bias Level" not in df.columns:
        df["Bias Level"] = ""
    else:
        df["Bias Level"] = df["Bias Level"].fillna("")

    if "Bias Direction" not in df.columns:
        df["Bias Direction"] = ""
    else:
        df["Bias Direction"] = df["Bias Direction"].fillna("")

    # Determine final column order: preferred columns first, followed by any additional original fields
    ordered_columns: List[str] = []
    for col in PREFERRED_COLUMNS:
        if col in df.columns:
            ordered_columns.append(col)

    # Append any remaining fields found in original JSONs so no information is lost
    for col in df.columns:
        if col not in ordered_columns:
            ordered_columns.append(col)

    df = df[ordered_columns]

    # Step 5: Save DataFrame to CSV with UTF-8 BOM
    print("[5/5] Exporting dataset to CSV...")
    # Ensure target parent directory exists
    output_file.parent.mkdir(parents=True, exist_ok=True)

    # Save using utf-8-sig so Sinhala Unicode characters display cleanly in Microsoft Excel
    df.to_csv(output_file, index=False, encoding="utf-8-sig")
    print(f"      [OK] Successfully saved to: {output_file.resolve()}\n")

    # Step 6: Print Final Summary
    print_summary(
        total_files=total_files_discovered,
        successful=successfully_processed,
        skipped=skipped_files,
        duplicate_url_count=total_duplicate_urls,
        total_rows=len(df),
        output_path=output_file.resolve(),
        columns=list(df.columns)
    )

    return df


def print_summary(
    total_files: int,
    successful: int,
    skipped: List[Tuple[Path, str]],
    duplicate_url_count: int,
    total_rows: int,
    output_path: Path,
    columns: List[str]
) -> None:
    """
    Displays a structured, human-readable summary of the conversion process.
    """
    print("=" * 80)
    print("                          CONVERSION SUMMARY")
    print("=" * 80)
    print(f" Total JSON files discovered:      {total_files}")
    print(f" Successfully processed articles:  {successful}")
    print(f" Invalid or skipped files:         {len(skipped)}")
    print(f" Duplicate article URLs detected:  {duplicate_url_count}")
    print(f" Total rows written to CSV:        {total_rows}")
    print(f" Output CSV path:                  {output_path}")
    print(f" CSV column names ({len(columns)}):           {', '.join(columns)}")
    print("=" * 80)

    if skipped:
        print("\nSkipped files breakdown:")
        for idx, (path, reason) in enumerate(skipped[:10], 1):
            print(f"  {idx}. {path.name} -> {reason}")
        if len(skipped) > 10:
            print(f"  ... and {len(skipped) - 10} more skipped file(s).")


def main() -> None:
    """
    CLI Entrypoint.
    Paths are determined relative to this script's directory by default.
    Supports preset datasets ('politics', 'news', 'all') or custom path overrides.
    """
    script_dir = Path(__file__).resolve().parent

    politics_news_dir = script_dir / "news" / "politics"
    politics_csv = script_dir / "data" / "sinhala_politics.csv"
    general_news_dir = script_dir / "news"
    general_csv = script_dir / "data" / "sinhala_news.csv"

    parser = argparse.ArgumentParser(
        description="Convert Sinhala television news JSON files into consolidated CSV datasets."
    )
    parser.add_argument(
        "--dataset",
        choices=["politics", "news", "all"],
        default=None,
        help="Preset dataset to convert: 'politics' (news/politics -> data/sinhala_politics.csv), "
             "'news' (news -> data/sinhala_news.csv), or 'all' to process both (default: auto-detected)."
    )
    parser.add_argument(
        "--news-dir",
        type=Path,
        default=None,
        help="Custom directory containing news JSON files/subfolders (overrides --dataset preset)."
    )
    parser.add_argument(
        "--output-csv",
        type=Path,
        default=None,
        help="Custom destination CSV path (overrides --dataset preset)."
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Print verbose skip messages for invalid or problematic files."
    )

    args = parser.parse_args()

    # If explicit custom paths were provided, use them directly
    if args.news_dir is not None or args.output_csv is not None:
        target_news_dir = args.news_dir or (politics_news_dir if politics_news_dir.exists() else general_news_dir)
        target_output_csv = args.output_csv or (
            politics_csv if "politics" in str(target_news_dir).lower() else general_csv
        )
        convert_dataset(
            news_dir=target_news_dir,
            output_file=target_output_csv,
            verbose=args.verbose
        )
        return

    # Determine preset if not explicitly specified
    preset = args.dataset
    if preset is None:
        # Default to politics if news/politics exists and older multi-folders are absent
        if politics_news_dir.exists() and not (general_news_dir / "lankadeepa").exists():
            preset = "politics"
        else:
            preset = "news"

    if preset == "politics":
        convert_dataset(
            news_dir=politics_news_dir,
            output_file=politics_csv,
            verbose=args.verbose
        )
    elif preset == "news":
        convert_dataset(
            news_dir=general_news_dir,
            output_file=general_csv,
            verbose=args.verbose
        )
    elif preset == "all":
        if politics_news_dir.exists():
            convert_dataset(
                news_dir=politics_news_dir,
                output_file=politics_csv,
                verbose=args.verbose
            )
            print()
        if general_news_dir.exists():
            convert_dataset(
                news_dir=general_news_dir,
                output_file=general_csv,
                verbose=args.verbose
            )


if __name__ == "__main__":
    main()
