"""
Machine Learning-Based Bias Analysis and Prediction of Sri Lankan Television News
Prediction and Inference Module: predict.py

This module:
1. Loads the best-performing trained classification models for:
   - Bias Level (e.g. Neutral, Low, Medium, High)
   - Bias Direction (e.g. Neutral, Pro-Government, Anti-Government)
2. Accepts arbitrary Sinhala news text from CLI flag (--text) or file (--file).
3. Cleans and normalizes Sinhala Unicode text using preprocessing.py.
4. Generates predictions along with calibrated class probability distributions.
5. Displays clear academic disclaimers that statistical predictions indicate
   linguistic framing patterns rather than verified objective factual truth.
"""

import argparse
import json
from pathlib import Path
import sys
from typing import Any, Dict, List, Optional, Tuple

import joblib

# Local imports
try:
    from preprocessing import clean_sinhala_text
except ImportError:
    from .preprocessing import clean_sinhala_text


# Ensure safe console output encoding on Windows terminals
if sys.version_info >= (3, 7):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


class BiasPredictor:
    """
    Inference manager that loads trained models and runs predictions.
    """

    def __init__(self, models_dir: Path):
        self.models_dir = models_dir
        self.bias_level_model = None
        self.bias_level_meta = {}
        self.bias_direction_model = None
        self.bias_direction_meta = {}
        self._load_models()

    def _load_models(self) -> None:
        """Loads canonical best models from disk if present."""
        level_path = self.models_dir / "bias_level_best_model.joblib"
        level_meta_path = self.models_dir / "bias_level_best_model_metadata.json"

        if level_path.exists():
            try:
                self.bias_level_model = joblib.load(level_path)
                if level_meta_path.exists():
                    with open(level_meta_path, "r", encoding="utf-8") as f:
                        self.bias_level_meta = json.load(f)
            except Exception as e:
                print(f"[!] Warning: Could not load Bias Level model: {e}", file=sys.stderr)

        direction_path = self.models_dir / "bias_direction_best_model.joblib"
        direction_meta_path = self.models_dir / "bias_direction_best_model_metadata.json"

        if direction_path.exists():
            try:
                self.bias_direction_model = joblib.load(direction_path)
                if direction_meta_path.exists():
                    with open(direction_meta_path, "r", encoding="utf-8") as f:
                        self.bias_direction_meta = json.load(f)
            except Exception as e:
                print(f"[!] Warning: Could not load Bias Direction model: {e}", file=sys.stderr)

    @property
    def is_ready(self) -> bool:
        return (self.bias_level_model is not None) or (self.bias_direction_model is not None)

    def predict(self, raw_text: str) -> Dict[str, Any]:
        """
        Runs predictions on raw Sinhala input text.

        Args:
            raw_text (str): Input news article or headline in Sinhala.

        Returns:
            Dict[str, Any]: Structured prediction results with probabilities and disclaimers.
        """
        if not raw_text or not raw_text.strip():
            return {
                "status": "error",
                "message": "Input text is empty. Please provide valid Sinhala news text."
            }

        cleaned = clean_sinhala_text(raw_text)
        if len(cleaned) < 5:
            return {
                "status": "error",
                "message": "Input text is too short after cleaning to reliably evaluate."
            }

        if not self.is_ready:
            return {
                "status": "error",
                "message": (
                    "No trained models found in the models directory. "
                    "Please run 'python train.py --benchmark' first to fit models."
                )
            }

        results: Dict[str, Any] = {
            "status": "success",
            "input_length_chars": len(raw_text),
            "cleaned_length_chars": len(cleaned),
            "predictions": {},
            "disclaimer": (
                "Academic Research Disclaimer: These outputs reflect statistical linguistic patterns "
                "learned from training annotations. Model confidence or probability distributions "
                "represent pattern-matching scores, NOT verified factual truth or definitive proof "
                "of political bias."
            )
        }

        # Predict Bias Level
        if self.bias_level_model is not None:
            pred_level = self.bias_level_model.predict([cleaned])[0]
            level_info: Dict[str, Any] = {
                "predicted_label": str(pred_level),
                "model_used": self.bias_level_meta.get("best_model_name", "fitted_pipeline")
            }
            if hasattr(self.bias_level_model, "predict_proba"):
                try:
                    probs = self.bias_level_model.predict_proba([cleaned])[0]
                    classes = self.bias_level_model.classes_
                    level_info["class_probabilities"] = {
                        str(cls): round(float(prob), 4)
                        for cls, prob in sorted(zip(classes, probs), key=lambda x: x[1], reverse=True)
                    }
                except Exception:
                    pass
            results["predictions"]["bias_level"] = level_info

        # Predict Bias Direction
        if self.bias_direction_model is not None:
            pred_dir = self.bias_direction_model.predict([cleaned])[0]
            dir_info: Dict[str, Any] = {
                "predicted_label": str(pred_dir),
                "model_used": self.bias_direction_meta.get("best_model_name", "fitted_pipeline")
            }
            if hasattr(self.bias_direction_model, "predict_proba"):
                try:
                    probs = self.bias_direction_model.predict_proba([cleaned])[0]
                    classes = self.bias_direction_model.classes_
                    dir_info["class_probabilities"] = {
                        str(cls): round(float(prob), 4)
                        for cls, prob in sorted(zip(classes, probs), key=lambda x: x[1], reverse=True)
                    }
                except Exception:
                    pass
            results["predictions"]["bias_direction"] = dir_info

        return results


def main() -> None:
    """
    CLI Entrypoint for single-article inference.
    """
    script_dir = Path(__file__).resolve().parent
    default_models_dir = script_dir / "models"

    parser = argparse.ArgumentParser(
        description="Predict bias level and bias direction of Sinhala news articles."
    )
    parser.add_argument(
        "--text",
        type=str,
        default=None,
        help="Sinhala news headline or article body text."
    )
    parser.add_argument(
        "--file",
        type=Path,
        default=None,
        help="Path to a text file containing Sinhala news text."
    )
    parser.add_argument(
        "--models-dir",
        type=Path,
        default=default_models_dir,
        help=f"Path to saved models directory (default: {default_models_dir})"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output raw JSON instead of human-readable formatting."
    )

    args = parser.parse_args()

    # Read input text
    raw_text = None
    if args.text:
        raw_text = args.text
    elif args.file:
        if not args.file.exists():
            print(f"[!] Error: File not found: {args.file}", file=sys.stderr)
            sys.exit(1)
        try:
            raw_text = args.file.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            raw_text = args.file.read_text(encoding="utf-8-sig")
    else:
        # Default demonstration Sinhala text if none provided
        raw_text = (
            "ගොවීන්ට වෙලාවට පෝරටික දෙන්නවත් බැරි තරමට මේ ආණ්ඩුව අසමත්. "
            "කොරෝනා වසංගතය නිසා රටේම ජනතාව පීඩාවට පත්ව සිටින මොහොතක "
            "අමාරුවෙන් ජීවත් වන ගොවි ජනතාවට පොහොර ලබාදෙන්න මේ රජය අසමත් වී ඇතැයි විපක්ෂය පවසයි."
        )
        print("[*] No input provided via --text or --file. Using sample Sinhala news excerpt:")
        print(f"    \"{raw_text[:90]}...\"\n")

    predictor = BiasPredictor(models_dir=args.models_dir)
    result = predictor.predict(raw_text)

    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
        return

    print("=" * 78)
    print("        SRI LANKAN NEWS BIAS PREDICTION - INFERENCE RESULTS")
    print("=" * 78)

    if result.get("status") != "success":
        print(f"[!] Error: {result.get('message')}")
        sys.exit(1)

    preds = result.get("predictions", {})

    if "bias_level" in preds:
        lvl = preds["bias_level"]
        print(f" [1] Bias Level:     {lvl['predicted_label'].upper()}")
        print(f"     Model:          {lvl['model_used']}")
        if "class_probabilities" in lvl:
            print("     Probabilities:")
            for c, p in lvl["class_probabilities"].items():
                print(f"       - {c:<15}: {p*100:>5.1f}%")
        print()

    if "bias_direction" in preds:
        dirn = preds["bias_direction"]
        print(f" [2] Bias Direction: {dirn['predicted_label'].upper()}")
        print(f"     Model:          {dirn['model_used']}")
        if "class_probabilities" in dirn:
            print("     Probabilities:")
            for c, p in dirn["class_probabilities"].items():
                print(f"       - {c:<15}: {p*100:>5.1f}%")
        print()

    print("=" * 78)
    print(f" NOTE: {result.get('disclaimer')}")
    print("=" * 78)


if __name__ == "__main__":
    main()
