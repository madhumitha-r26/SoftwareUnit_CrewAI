# SoftwareUnit

SoftwareUnit is a Python application that uses CrewAI to coordinate a virtual software team. Given a project idea, the crew prepares project documentation, implementation files, QA tests, and deployment artifacts.

## Workflow

`main.py` runs the crew with `Process.sequential`. The tasks cover:

1. Project planning
2. Business requirements
3. System architecture and API design
4. UI/UX specification
5. Backend implementation
6. Frontend implementation
7. QA report and test files
8. Deployment artifacts

The sample project idea is currently set in `main.py` to `A Simple Task Management System`. Change the `project_idea` input there to generate a different project.

## Agents

- Project Manager: project plan
- Business Analyst: requirements and user stories
- Solution Architect: architecture and API contract
- UI/UX Designer: written design specification
- Backend Developer: backend source and configuration
- Frontend Developer: frontend source and configuration
- QA Engineer: QA report and test files
- DevOps Engineer: deployment artifacts

The UI/UX task currently produces a written specification. It does not generate image files or scrape web resources.

## Generated Files

All generated files are placed under `output/`:

```text
output/
  documentation/
    01_project_plan.md
    02_requirements.md
    03_architecture.md
    04_ui_design.md
    05_qa_report.md
    06_deployment.md
  backend/       # Generated backend source and configuration
  frontend/      # Generated frontend source and configuration
  tests/         # Generated QA test files
  deployment/    # Generated deployment files
```

`main.py` creates `output/documentation/` before starting. The file-writing tool is restricted to the `output/` directory; the backend, frontend, test, and deployment tasks use the corresponding subdirectories.

The generated programming languages and frameworks depend on the architecture selected for the project. They are not fixed by this workflow.

## Requirements

- Python 3.10 or newer
- Ollama installed and available
- The model used by the agents configured in Ollama; the current agent configuration uses `ollama/gemma4:31b-cloud`
- CrewAI and CrewAI Tools installed in the active Python environment

## Run

In Windows PowerShell, activate the included environment and run the workflow:

```powershell
.\dev_unit\Scripts\Activate.ps1
pip install crewai crewai-tools
python .\main.py
```

The application prints the final crew result to the console and writes task artifacts under `output/`.

## Project Files

- `main.py` creates and runs the CrewAI crew.
- `agents.py` defines the agent roles and Ollama model configuration.
- `tasks.py` defines each workflow task, output path, and task dependencies.
- `tools.py` configures the CrewAI file writer, sandboxed to `output/`.