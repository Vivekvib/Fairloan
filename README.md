# 🌐 Live demo: https://frontend-ruby-ten-67.vercel.app
# API: https://fairloan.onrender.com/docs

# FairLoan — Transparent Digital Lending Prototype

> ⚠️ **This is an educational portfolio prototype. It uses synthetic data only. No real loans, no real credit decisions, no real personal data is collected or processed. Not RBI-compliant. Not suitable for production.**

Built by **Vivek Nishad** as a product-management portfolio project demonstrating fintech domain knowledge, responsible design, and full-stack implementation.

---

## What This Project Demonstrates

1. Product discovery and user research methodology
2. Fintech and digital-lending domain understanding (RBI Digital Lending Guidelines reference)
3. Transparent UX — no dark patterns, plain-language cost disclosure
4. Risk model thinking with explainable decisions
5. Privacy-conscious data collection and consent design
6. Full-stack implementation: Next.js 14 + FastAPI + PostgreSQL

---

## Architecture Overview

```
fairloan/
├── frontend/     Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
├── backend/      FastAPI + SQLAlchemy + Alembic + PostgreSQL/SQLite
└── docs/         Product artefacts — PRD, persona, journey map, research
```

**Frontend → Backend** communication is via a typed REST API (`/api/v1/`).  
All monetary calculations use Python's `Decimal` type — no floating-point errors.  
All data is synthetic. The `is_demo` flag is set to `true` on every record.

---

## Environment Requirements

| Tool | Version |
|---|---|
| Node.js | ≥ 18.17 |
| Python | ≥ 3.11 |
| PostgreSQL | ≥ 15 (or SQLite for local dev) |
| npm | ≥ 9 |

---

## Installation

### 1. Clone and enter the repo

```bash
git clone https://github.com/Vivekvib/fairloan.git
cd fairloan
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Edit .env — set DATABASE_URL
```

**Run database migrations:**
```bash
alembic upgrade head
```

**Seed synthetic data:**
```bash
python -m app.seed.seed
```

**Start the API server:**
```bash
uvicorn main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

### 3. Frontend setup

```bash
cd ../frontend
npm install
cp .env.example .env.local      # Set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

App available at: `http://localhost:3000`

### 4. Run backend tests

```bash
cd backend
pytest tests/ -v
```

---

## Build Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `uvicorn main:app --reload` | Start FastAPI dev server |
| `pytest tests/ -v` | Run all backend tests |
| `alembic upgrade head` | Apply all migrations |
| `python -m app.seed.seed` | Load synthetic seed data |

---

## Key Product Decisions

- **Comprehension before conversion** — users cannot proceed past any screen without having the information they need to make an informed decision.
- **Prototype honesty** — every screen carries a persistent disclaimer. No "instant approval" language.
- **No dark patterns** — no pre-checked consent, no countdown timers, no shame language.
- **Privacy-first data model** — analytics events are session-scoped, not user-linked by default.

---

## Regulatory Reference

RBI Digital Lending Guidelines (Master Directions):  
https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12957

All regulatory references in this prototype are labelled as either:
- **Regulatory requirement** — cited from the official source above
- **Recommended product practice** — industry standard, not legally mandated
- **Portfolio-project assumption** — prototype design choice

---

## Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel (free tier) |
| Backend | Render (free tier) |
| Database | Render PostgreSQL or SQLite for local |

---

## Portfolio Context

This project is one of three fintech portfolio pieces:
1. **FilingLens** — Agentic RAG system over SEC 10-K filings
2. **FairLoan** — Transparent digital lending prototype (this repo)
3. **Liquidity Risk Engine** — NSE/AMFI quantitative analysis

---

*Last updated: September 2026*
