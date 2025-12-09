# Backend (FastAPI)

This folder contains the FastAPI backend for voice2summarizer.

## Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set:

- `OPENAI_API_KEY`
- `GOOGLE_APPLICATION_CREDENTIALS`

Install dependencies:

```bash
pip install -r requirements.txt
```

Run server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.
