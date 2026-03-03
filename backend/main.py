#!/usr/bin/env python3
"""
Localix Backend Startup Script
Run this to start the FastAPI server
"""

import uvicorn
import os

if __name__ == "__main__":
    # Load environment variables from .env file if it exists
    from dotenv import load_dotenv
    load_dotenv()
    
    # Get configuration from environment or use defaults
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("RELOAD", "true").lower() == "true"
    
    print(f"""
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ███╗   ██╗ ██████╗ ██╗   ██╗ █████╗  ██████╗████████╗  ║
║   ████╗  ██║██╔═══██╗██║   ██║██╔══██╗██╔════╝╚══██╔══╝  ║
║   ██╔██╗ ██║██║   ██║██║   ██║███████║██║        ██║     ║
║   ██║╚██╗██║██║   ██║╚██╗ ██╔╝██╔══██║██║        ██║     ║
║   ██║ ╚████║╚██████╔╝ ╚████╔╝ ██║  ██║╚██████╗   ██║     ║
║   ╚═╝  ╚═══╝ ╚═════╝   ╚═══╝  ╚═╝  ╚═╝ ╚═════╝   ╚═╝     ║
║                                                          ║
║          CYBER KNOWLEDGE INTELLIGENCE PLATFORM           ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝

Starting Localix Backend Server...
Host: {host}
Port: {port}
Reload: {reload}

API Documentation will be available at:
  - Swagger UI: http://localhost:{port}/docs
  - ReDoc: http://localhost:{port}/redoc

Press CTRL+C to stop the server
    """)
    
    uvicorn.run(
        "api.main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )
