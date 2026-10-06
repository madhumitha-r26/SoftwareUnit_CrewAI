# SoftwareUnit - Autonomous AI Workflow Automation

SoftwareUnit is a CrewAI-based project generation workflow that turns a single project idea into a complete software delivery package. It coordinates a virtual team of specialized agents to produce documentation, implementation files, QA artifacts, and deployment assets under the `output/` folder.

## What the application does

When you run `python .\main.py`, the program prompts for a project idea and then kicks off a sequential CrewAI workflow. The agents work through the following stages:

1. Project planning
2. Business requirements
3. Architecture and API design
4. UI/UX design specification
5. Backend implementation
6. Frontend implementation
7. QA report and automated test generation
8. Deployment assets and CI/CD configuration

The project idea is entered at runtime instead of being hardcoded in the application. This means each run can generate a different product concept without changing the workflow code.

## Current implementation

The current code is structured as follows:

- `main.py` creates the `output/documentation` directory, assembles the crew, and starts the asynchronous kickoff.
- `tasks.py` defines all task descriptions, context dependencies, and output locations for the generated artifacts.
- `agents.py` configures the project roles and uses the Ollama model `ollama/gemma4:31b-cloud`.
- `tools.py` exposes a `FileWriterTool` restricted to the `output/` directory so generated code and files remain sandboxed within the project.

## Agent roles

- Project Manager: creates the project plan and milestone structure
- Business Analyst: defines requirements, user stories, and acceptance criteria
- Solution Architect: designs the system architecture and API contract
- UI/UX Designer: creates the product design and interaction specification
- Backend Developer: writes backend source and configuration into `output/backend`
- Frontend Developer: writes frontend source and configuration into `output/frontend`
- QA Engineer: produces the QA report and test files under `output/tests`
- DevOps Engineer: generates deployment manifests and pipeline definitions under `output/deployment`

The UI/UX task focuses on a written design spec rather than generated images or web-scraped assets.

## Generated output structure

All generated artifacts are stored under `output/`:

```text
output/
  documentation/
    01_project_plan.md
    02_requirements.md
    03_architecture.md
    04_ui_design.md
    05_qa_report.md
    06_deployment.md
  backend/        # Backend implementation files
  frontend/       # Frontend implementation files
  tests/          # Test scripts and QA assets
  deployment/     # Deployment manifests, Docker files, and pipeline YAML
```

The exact frameworks and languages used depend on the architecture selected by the agent workflow; the system does not lock the project to one specific stack.

## Requirements

- Python 3.10 or newer
- Ollama installed and available locally
- A compatible model available in Ollama; the current configuration uses `ollama/gemma4:31b-cloud`
- `crewai` and `crewai-tools` installed in the active Python environment

## Run it locally

From the project root in Windows PowerShell:

```powershell
.\dev_unit\Scripts\Activate.ps1
pip install crewai crewai-tools
python .\main.py
```

You will be prompted to enter **a project idea**, and the workflow will generate the documentation and implementation artifacts under `output/`.

Here, I have given the project idea as **"User Authentication Module"**. The output file contains the generated documentation and implementation for the given project idea.

## Project files

- `main.py`: entry point; creates the crew and runs the workflow
- `agents.py`: defines all agent roles and LLM configuration
- `tasks.py`: defines task flow, context, and output paths
- `tools.py`: configures the file-writing tool used by the implementation agents
- `output/`: generated project artifacts and generated code 


## Notes

- The workflow is designed for code generation and project scaffolding, not for running a prebuilt app directly.
- The backend and frontend tasks are configured to write complete implementation files into their respective output directories.
- The generated output should be reviewed and adjusted as needed before using it as a production project foundation.