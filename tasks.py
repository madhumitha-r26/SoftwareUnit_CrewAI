from agents import project_manager, business_analyst, solution_architect, uiux_designer, backend_developer, frontend_developer, qa_engineer, devops_engineer
from crewai import Task

plan_task = Task(
    description="Create a project plan for this idea: {project_idea}",
    expected_output="A comprehensive project plan in Markdown containing a milestone timeline,"
    "resource allocation breakdown, critical path analysis, and a categorized risk-mitigation register.",
    agent=project_manager,
    output_file="output/documentation/01_project_plan.md",
)

requirements_task = Task(
    description="Using the project plan, write detailed requirements for: {project_idea}",
    expected_output="A structured Business Requirements Document (BRD) containing prioritized user "
    "stories with Gherkin-syntax acceptance criteria (Given-When-Then), edge cases, and end-to-end user workflows.",
    agent=business_analyst,
    context=[plan_task],
    output_file="output/documentation/02_requirements.md",
)

architecture_task = Task(
    description="Design the architecture and API contract for the requirements.",
    expected_output="A High-Level Architecture (HLA) document detailing component interaction diagrams "
    "(text/Mermaid), chosen technology stack with trade-off rationale, data flow schemas, and non-functional requirements (scalability, security, latency).",
    agent=solution_architect,
    context=[requirements_task],
    output_file="output/documentation/03_architecture.md",
)

design_task = Task(
    description=" Using the requirements, create a UI/UX design specification for the application.",
    expected_output="A UI/UX design specification report containing user journey maps, "
    "low-fidelity wireframe layouts (layout descriptions or ASCII/markdown mockups), " 
    "design system tokens (colors, typography, spacing), accessibility (WCAG) guidelines, "
    "and interaction flow diagrams.",
    agent=uiux_designer,
    context=[requirements_task],
    output_file="output/documentation/04_ui_design.md",
)

backend_task = Task(
    description="Implement the backend following the architecture and API contract. "
                "Write complete, runnable source and configuration files into the output/backend folder using the file writer tool. Use directory='backend' and sensible filenames; do not return code only in your response.",
    expected_output="A working backend implementation saved as source files, including API routes, " 
    "with OpenAPI/Swagger definitions, database entity-relationship models, and secure authentication/error-handling flows.",
    agent=backend_developer,
    context=[architecture_task],
    async_execution=True,   # runs in parallel with the frontend task
)

frontend_task = Task(
    description="Implement the frontend following the UI design and API contract. "
                "Write complete, runnable source and configuration files into the output/frontend folder using the file writer tool. Use directory='frontend' and sensible filenames; do not return code only in your response.",
    expected_output="A working responsive frontend implementation saved as source files, " 
    "featuring responsive layout structures, state management patterns, and integration points for backend API endpoints.",
    agent=frontend_developer,
    context=[design_task, architecture_task],
    async_execution=True,   # runs in parallel with the backend task
)

qa_task = Task(
    description="Review the backend and frontend code against the requirements and "
                "write executable test files into output/tests using the file writer tool with directory='tests', in addition to the QA report.",
    expected_output="A detailed QA test suite and execution matrix including manual test cases, " 
    "automated test scripts (e.g., Pytest/Playwright/Jest specs), edge case coverage,"
    "and a defect tracking template.",
    agent=qa_engineer,
    context=[requirements_task, backend_task, frontend_task],  # waits for both
    output_file="output/documentation/05_qa_report.md",
)

deploy_task = Task(
    description="Create deployment files for the application under output/deployment using the file writer tool with directory='deployment'.",
    expected_output="Complete Infrastructure as Code (IaC) templates and CI/CD pipeline definitions "
    "(e.g., GitHub Actions YAML or Dockerfile/Kubernetes manifests) with automated build, test, and "
    "containerized deployment stages.",
    agent=devops_engineer,
    context=[architecture_task, backend_task, frontend_task, qa_task],
    output_file="output/documentation/06_deployment.md",
)
