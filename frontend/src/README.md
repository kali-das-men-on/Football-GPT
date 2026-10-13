# Football GPT ⚽

**An AI-powered football analysis application built with React, Vite, FastAPI, and LangChain.**

Football GPT provides an interface for analyzing football players using an AI-powered backend. The frontend collects player information, sends requests to the backend API, and presents the resulting analysis in an interactive interface.

## Features

- **AI-powered player analysis** — Submit player names for analysis through the backend API.
- **Interactive frontend** — A responsive React interface built with Vite.
- **FastAPI backend** — A Python API that handles analysis requests and coordinates the analysis workflow.
- **LLM integration** — Uses LangChain to connect the analysis workflow to a language model provider.
- **Separation of concerns** — The frontend and backend run independently and communicate over HTTP.
- **Deployable architecture** — Host the frontend on Vercel and the backend on Render.

## Tech Stack

| Layer             | Technologies                        |
| ----------------- | ----------------------------------- |
| Frontend          | React, Vite, JavaScript, CSS        |
| Backend           | Python, FastAPI, Uvicorn            |
| AI orchestration  | LangChain                           |
| Model integration | OpenRouter-compatible API           |
| Deployment        | Vercel (frontend), Render (backend) |

## Project Structure

```text
Football-GPT/
├── backend/
│   ├── main.py             # FastAPI application and API routes
│   ├── agent_service.py    # AI agent and analysis workflow
│   ├── tools.py            # Tools used by the agent
│   ├── models.py           # Request and response models
│   └── prompt.py           # Prompt definitions
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main application interface
│   │   ├── api.js          # Frontend API client
│   │   ├── main.jsx        # React entry point
│   │   ├── index.css       # Global styles
│   │   └── components/     # Reusable UI components
│   ├── .env.example        # Frontend environment template
│   ├── package.json
│   └── vite.config.js
│
├── requirements.txt        # Python dependencies
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js and npm](https://nodejs.org/)
- [Python 3.10+](https://www.python.org/) (use the version required by your dependencies if different)
- An API key for your configured language model provider, if required by your backend configuration

### 1. Clone the repository

```bash
git clone https://github.com/kali-das-men-on/Football-GPT.git
cd Football-GPT
```

### 2. Configure the backend

Create and activate a Python virtual environment from the repository root.

**macOS / Linux**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

**Windows PowerShell**

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

Configure any required model-provider credentials using the environment variable names expected by `backend/agent_service.py`. Keep API keys out of source control.

Start the backend:

```bash
uvicorn backend.main:app --reload --port 8000
```

The API should now be available at:

- API base URL: `http://localhost:8000`
- Interactive API documentation: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### 3. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create a local environment file from the provided template:

**macOS / Linux**

```bash
cp .env.example .env
```

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

Set the API base URL in `frontend/.env`:

```dotenv
VITE_API_BASE=http://localhost:8000
```

Make sure `frontend/src/api.js` reads `VITE_API_BASE` and constructs requests using the backend's actual API routes. Vite exposes variables prefixed with `VITE_` to client-side code, so **never put private API keys in frontend environment variables**.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Keep both the frontend and backend development servers running while using the application.

## API Overview

The frontend communicates with the FastAPI backend over HTTP.

| Method | Endpoint       | Purpose                          |
| ------ | -------------- | -------------------------------- |
| `GET`  | `/health`      | Check backend health             |
| `POST` | `/api/analyze` | Submit a player analysis request |

For request schemas and response examples, start the backend and visit [http://localhost:8000/docs](http://localhost:8000/docs).

The frontend's request payload and response handling must match the schemas defined by the backend. The API documentation is the source of truth for the exact fields.

## Deployment

The frontend and backend are deployed separately. This lets each service be built, configured, and updated independently.

### Deploy the backend to Render

1. Push the repository to GitHub.
2. In [Render](https://render.com/), create a new **Web Service** and connect the repository.
3. Set the **Root Directory** to the repository root.
4. Configure the Python build and start commands.

For a standard Python environment using `requirements.txt`, the commands are typically:

**Build command**

```bash
pip install -r requirements.txt
```

**Start command**

```bash
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

5. Add the required model-provider credentials as Render environment variables, using the names expected by the backend.
6. Deploy the service and verify its `/health` endpoint.

Copy the public backend URL provided by Render, for example:

```text
https://your-football-gpt-backend.onrender.com
```

The URL above is illustrative; use the URL assigned to your service.

### Deploy the frontend to Vercel

1. Open [Vercel](https://vercel.com/) and import the GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Select **Vite** as the framework preset if Vercel does not detect it automatically.
4. Add this environment variable:

   ```dotenv
   VITE_API_BASE=https://your-football-gpt-backend.onrender.com
   ```

   Replace the example URL with your actual Render backend URL. Do not add a trailing path such as `/api/analyze` unless your frontend client specifically expects the full endpoint as its base URL.

5. Deploy the project and open the Vercel URL to test the application.

**Important:** Vite environment variables are read during the frontend build. If you change `VITE_API_BASE` in Vercel, trigger a new deployment so the frontend is rebuilt with the updated value.

### Configure CORS

The backend must allow requests from the deployed frontend's origin.

In `backend/main.py`, configure FastAPI's CORS middleware to allow your actual Vercel domain:

```python
allow_origins=[
    "https://your-football-gpt.vercel.app",
]
```

Use your real deployment URL, including the correct scheme and hostname. If you use a custom domain, add that origin as well.

For local development, you can separately allow:

```python
"http://localhost:5173"
```

Avoid leaving `allow_origins=["*"]` in a public deployment when you can restrict access to known frontend origins. CORS is a browser access policy, not a substitute for authentication or API security.

## Environment Variables

| Variable               | Where it belongs | Purpose                                               |
| ---------------------- | ---------------- | ----------------------------------------------------- |
| `VITE_API_BASE`        | Frontend         | Public base URL for the backend API                   |
| Model-provider API key | Backend only     | Authenticates requests to the language model provider |

Use the exact credential variable names expected by your backend implementation. Keep `.env` files containing secrets out of Git, and commit only sanitized example files such as `.env.example`.

## Troubleshooting

**The frontend cannot reach the backend**

- Confirm that the backend is running and its `/health` endpoint responds.
- Check `VITE_API_BASE` in the frontend environment file.
- Verify that the backend's CORS configuration includes the frontend's origin.
- Restart Vite after changing local environment variables.

**Analysis requests fail**

- Inspect the browser's developer console and network panel.
- Review the backend terminal or Render logs for the actual exception.
- Confirm that the request payload matches the backend's Pydantic schema.
- Check that the model-provider credentials and model configuration are valid.

**The deployed frontend still uses the wrong API URL**

- Confirm the `VITE_API_BASE` value in Vercel's project settings.
- Redeploy the frontend after changing the variable.
- Verify that `frontend/src/api.js` uses the configured variable.

**The language model provider returns rate-limit errors**

- Check provider quotas, model availability, and request limits.
- Consider bounded retries with exponential backoff, request timeouts, and caching where appropriate.
- Keep provider credentials and any provider-specific configuration on the backend.

## Development Workflow

When contributing changes:

1. Make frontend changes inside `frontend/`.
2. Make API, agent, and model integration changes inside `backend/`.
3. Test the backend independently using `/docs` and `/health`.
4. Test the complete frontend-to-backend workflow locally.
5. Verify production environment variables and CORS settings before deployment.

## Contributing

Contributions and improvements are welcome. For substantial changes, describe the proposed feature or bug fix before opening a pull request.

## License

No license is specified here. Add a `LICENSE` file before describing the project as open source or granting reuse permissions.
