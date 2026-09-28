from agents import project_manager, business_analyst, solution_architect, uiux_designer, backend_developer, frontend_developer, qa_engineer, devops_engineer
from crewai import Task

plan_task = Task(
    description="Create a project plan for this idea: {project_idea}",
    expected_output="A comprehensive project plan in Markdown containing a milestone timeline, resource allocation breakdown, critical path analysis, and a categorized risk-mitigation register.",
    agent=project_manager,
    output_file="output/01_project_plan.md",
)

requirements_task = Task(
    description="Using the project plan, write detailed requirements for: {project_idea}",
    expected_output="A structured Business Requirements Document (BRD) containing prioritized user stories with Gherkin-syntax acceptance criteria (Given-When-Then), edge cases, and end-to-end user workflows.",
    agent=business_analyst,
    context=[plan_task],
    output_file="output/02_requirements.md",
)

architecture_task = Task(
    description="Design the architecture and API contract for the requirements.",
    expected_output="A High-Level Architecture (HLA) document detailing component interaction diagrams (text/Mermaid), chosen technology stack with trade-off rationale, data flow schemas, and non-functional requirements (scalability, security, latency).",
    agent=solution_architect,
    context=[requirements_task],
    output_file="output/03_architecture.md",
)

design_task = Task(
    description="Design the UI for the requirements.",
    expected_output="A UI/UX design specification report containing user journey maps, low-fidelity wireframe layouts (layout descriptions or ASCII/markdown mockups), design system tokens (colors, typography, spacing), and accessibility (WCAG) guidelines.",
    agent=uiux_designer,
    context=[requirements_task],
    output_file="output/04_ui_design.md",
)

backend_task = Task(
    description="Implement the backend following the architecture and API contract. "
                "Write each file into the 'output/backend' folder using the file writer tool.",
    expected_output="Fully documented backend API specifications (or functional boilerplate code) with OpenAPI/Swagger definitions, database entity-relationship models, and secure authentication/error-handling flows.",
    agent=backend_developer,
    context=[architecture_task],
    async_execution=True,   # runs in parallel with the frontend task
)

frontend_task = Task(
    description="Implement the frontend following the UI design and API contract. "
                "Write each file into the 'output/frontend' folder using the file writer tool.",
    expected_output="Production-ready frontend component specifications (or functional React/Vue/HTML/CSS code) featuring responsive layout structures, state management patterns, and integration points for backend API endpoints.",
    agent=frontend_developer,
    context=[design_task, architecture_task],
    async_execution=True,   # runs in parallel with the backend task
)

qa_task = Task(
    description="Review the backend and frontend code against the requirements and "
                "write test cases.",
    expected_output="A detailed QA test suite and execution matrix including manual test cases, automated test scripts (e.g., Pytest/Playwright/Jest specs), edge case coverage, and a defect tracking template.",
    agent=qa_engineer,
    context=[requirements_task, backend_task, frontend_task],  # waits for both
    output_file="output/05_qa_report.md",
)

deploy_task = Task(
    description="Create deployment files for the application.",
    expected_output="Complete Infrastructure as Code (IaC) templates and CI/CD pipeline definitions (e.g., GitHub Actions YAML or Dockerfile/Kubernetes manifests) with automated build, test, and containerized deployment stages.",
    agent=devops_engineer,
    context=[architecture_task, backend_task, frontend_task, qa_task],
    output_file="output/06_deployment.md",
)
