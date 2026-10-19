# SoftwareUnit - Autonomous AIWorkflow Automation

SoftwareUnit is an automated software delivery workflow using CrewAI and local LLMs (Ollama/Gemma) to orchestrate a virtual team of 8 specialized agents, autonomously generating complete project documentation, architecture designs, source code, and CI/CD deployment assets from a single prompt.

Giving a project idea as the input that allows the agents to produce planning and design documents, a working application scaffold, QA artifacts, and deployment files in `output/`.

## Generated application stack

Generated applications are required to use the following stack:

- **Frontend:** React.js and Tailwind CSS
- **Backend:** Node.js and Express.js
- **Database:** MongoDB
- **Deployment:** Docker, with Docker Compose to run the application services

The workflow passes this stack requirement through architecture, implementation, QA, and deployment so the generated components follow a shared technical contract.

## Agent workflow

When started, the application prompts for a project idea and runs these stages:

1. **Project Manager** prepares a project plan.
2. **Business Analyst** defines requirements and user stories.
3. **Solution Architect** specifies the MERN architecture and API contract.
4. **UI/UX Designer** creates a written design specification.
5. **Backend Developer** generates a Node.js/Express.js API and MongoDB integration.
6. **Frontend Developer** generates a React.js application styled with Tailwind CSS.
7. **QA Engineer** creates QA documentation and test artifacts.
8. **DevOps Engineer** prepares Docker-based deployment files for the frontend, backend, and MongoDB.

The frontend and backend implementation tasks are configured to run asynchronously. QA and deployment use their outputs as context.

## Generated files

The workflow writes artifacts beneath `output/`:

```text
output/
  documentation/
    01_project_plan.md
    02_requirements.md
    03_architecture.md
    04_ui_design.md
    05_qa_report.md
    06_deployment.md
  backend/       # Node.js/Express.js application and MongoDB integration
  frontend/      # React.js and Tailwind CSS application
  tests/         # QA and automated test artifacts
  deployment/    # Dockerfiles, Docker Compose, and related deployment assets
```

`tools.py` provides a file-writing tool scoped to `output/`. Generated files are scaffolding and should be reviewed, configured, and tested before production use.

## Requirements

- Python 3.10 or newer
- Ollama available with the configured model `ollama/gemma4:31b-cloud`
- The Python packages `crewai` and `crewai-tools`

## Run locally

From the project root in Windows PowerShell, create and activate a virtual environment, install the dependencies, and start the workflow:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install crewai crewai-tools
python .\main.py
```

Enter a project idea when prompted. The generated documentation and implementation files will be written under `output/`.

## Repository files

- `main.py` creates and runs the CrewAI crew.
- `agents.py` defines agent roles, goals, and model configuration.
- `tasks.py` defines task prompts, dependencies, and output locations.
- `tools.py` configures the file-writing tool used to generate artifacts.
- `output/` contains generated project artifacts.
