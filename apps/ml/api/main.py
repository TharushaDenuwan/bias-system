"""
Machine Learning-Based Bias Analysis and Prediction of Sri Lankan Television News
FastAPI Inference Microservice: main.py

This service allows the Next.js frontend or Hono backend to invoke bias prediction models.
Endpoint:
    POST /predict
    Request Body:
        {
            "text": "සිංහල පුවත් පෙළ"
        }
    Response Body:
        {
            "status": "success",
            "predictions": {
                "bias_level": { ... },
                "bias_direction": { ... }
            },
            "disclaimer": "..."
        }
"""

from pathlib import Path
import sys
from typing import Any, Dict, Optional

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure apps/ml root is in sys.path to import predict and preprocessing
ml_root = Path(__file__).resolve().parent.parent
if str(ml_root) not in sys.path:
    sys.path.insert(0, str(ml_root))

from predict import BiasPredictor


app = FastAPI(
    title="Sri Lankan News Bias Prediction API",
    description="Machine Learning-Based Bias Analysis and Prediction of Sri Lankan Television News",
    version="1.0.0"
)

# Enable CORS for Next.js frontend running locally
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize predictor with canonical models directory
models_directory = ml_root / "models"
predictor = BiasPredictor(models_dir=models_directory)


class NewsPredictionRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=5,
        description="Raw Sinhala news headline or article body text."
    )


class HealthResponse(BaseModel):
    status: str
    models_ready: bool
    models_directory: str
    bias_level_model_loaded: bool
    bias_direction_model_loaded: bool


@app.get("/health", response_model=HealthResponse, tags=["System"])
def health_check() -> HealthResponse:
    """Verifies service health and loaded model status."""
    return HealthResponse(
        status="healthy",
        models_ready=predictor.is_ready,
        models_directory=str(models_directory.resolve()),
        bias_level_model_loaded=predictor.bias_level_model is not None,
        bias_direction_model_loaded=predictor.bias_direction_model is not None
    )


@app.post("/predict", tags=["Inference"])
def predict_news_bias(request: NewsPredictionRequest) -> Dict[str, Any]:
    """
    Accepts Sinhala news text and returns predicted bias level and bias direction.
    """
    if not predictor.is_ready:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Models are not yet loaded or trained. "
                "Please run 'python train.py --benchmark' to train initial models."
            )
        )

    result = predictor.predict(request.text)

    if result.get("status") != "success":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=result.get("message", "Prediction failed on input text.")
        )

    return result


if __name__ == "__main__":
    import uvicorn
    print("[*] Starting Bias Prediction Microservice on http://127.0.0.1:8000 ...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
