"""
Add these lines to the FastAPI application that currently lives in api.py.

Example:

from routers import health, football, analytics, history, feedback

app.include_router(health.router)
app.include_router(football.router)
app.include_router(analytics.router)
app.include_router(history.router)
app.include_router(feedback.router)

The existing chat/agent route can remain unchanged while these routes are
introduced incrementally.
"""
