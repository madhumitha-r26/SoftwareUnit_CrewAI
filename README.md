# SoftwareUnit

SoftwareUnit is an AI-powered software delivery workflow built with CrewAI. It orchestrates a team of specialized agents to turn a project idea into structured planning, architecture, design, QA, and deployment artifacts.

The project is designed around a practical product development scenario: a Simple Task Management System. Instead of manually creating all planning documents by hand, the system coordinates multiple agents to collaborate on each stage of the lifecycle.

## Overview

This project demonstrates how multiple LLM-powered agents can work together in sequence to:

- define the project plan
- capture business requirements
- design the system architecture
- draft UI/UX specifications
- produce backend and frontend implementation guidance
- evaluate quality with QA testing
- prepare deployment and infrastructure documentation

The workflow is implemented in Python and uses CrewAI agents and tasks, with file outputs generated into the `output/` folder.

## Project Goals

The primary goal of this project is to simulate a small software team:

- Project Manager for roadmap and execution oversight
- Business Analyst for requirements and user stories
- Solution Architect for technical design
- UI/UX Designer for screens and UX guidance
- Backend Developer for API and service design
- Frontend Developer for interface implementation
- QA Engineer for validation and testing
- DevOps Engineer for deployment planning

## Architecture of the Project

The application is composed of a few core files:

- `main.py` – entry point; creates the crew and runs the workflow
- `agents.py` – defines all AI agents and their roles
- `tasks.py` – defines each project phase and expected output
- `tools.py` – contains tools used by the agents, including file writing
- `output/` – generated project artifacts and reports

## Workflow

When the app runs, it creates a sequential Crew with the agents above and executes the following tasks:

1. Project planning
2. Requirements definition
3. Architecture design
4. UI/UX design
5. Backend generation tasks
6. Frontend generation tasks
7. QA testing and review
8. Deployment documentation

The project uses `Process.sequential`, meaning the workflow progresses in an ordered chain where downstream tasks depend on earlier outputs.

## Generated Outputs

The project writes structured documents into the `output/` directory:

- `output/01_project_plan.md` – project roadmap, timeline, risks, resource allocation
- `output/02_requirements.md` – business requirements and acceptance criteria
- `output/03_architecture.md` – technical architecture and system design
- `output/04_ui_design.md` – UX flow and interface design guidance
- `output/05_qa_report.md` – QA matrix and test planning
- `output/06_deployment.md` – infrastructure and release configuration

## Features

- Multi-agent project generation
- Role-based AI collaboration
- Markdown output for software deliverables
- Sequential workflow execution
- File-based artifact creation
- Adaptable idea-to-document pipeline for new product concepts

## Tech Stack

- Python
- CrewAI
- CrewAI Tools
- Ollama LLM integration

## Prerequisites

Before running the project, make sure you have:

- Python 3.10 or newer
- Access to a working Python environment
- Ollama installed locally
- The model configured for the agents, such as `ollama/gemma4:31b-cloud`

## Getting Started

### 1. Activate the virtual environment

On Windows PowerShell:

```powershell
.\dev_unit\Scripts\Activate.ps1
```

### 2. Install dependencies

If the environment does not already contain them, install the required packages:

```powershell
pip install crewai crewai-tools
```

If you are using Ollama, make sure the required model is available in your local Ollama setup.

### 3. Run the project

```powershell
python main.py
```

This will start the multi-agent workflow and generate the project documentation under `output/`.

## Example Use Case

The current project idea is:

> A Simple Task Management System

The generated outputs reflect a realistic MVP for task creation, editing, status tracking, filtering, soft deletion, and deployment readiness.

## Notes

This project is useful as a learning and prototyping example for:

- AI agent orchestration
- agentic software planning
- automated documentation generation
- AI-assisted product development workflows

## License

This project does not currently include a formal license file. Add a license if you plan to share or distribute the project publicly.

## Future Improvements

Possible enhancements include:

- adding a configurable project idea input from CLI arguments
- supporting different project domains beyond task management
- integrating actual backend/frontend code generation
- adding automated tests for the workflow itself
- extending the pipeline with GitHub Actions or deployment automation
