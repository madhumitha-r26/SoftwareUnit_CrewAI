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
    description="Design the architecture and API contract for the requirements. This project must use React.js with Tailwind CSS for the frontend, Node.js with Express.js for the backend, and MongoDB for persistence. Treat this MERN stack as fixed; do not substitute other frontend frameworks, backend runtimes/frameworks, or databases. Define compatible service boundaries and API contracts, and plan for Docker-based deployment.",
    expected_output="A High-Level Architecture (HLA) document for the required MERN stack detailing component interaction diagrams "
    "(text/Mermaid), React.js/Tailwind CSS frontend, Node.js/Express.js backend, MongoDB data models and connection, API contracts, data flows, Docker deployment boundaries, and non-functional requirements (scalability, security, latency).",
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
                "Use Node.js with Express.js and MongoDB only; do not use Python, SQL databases, or another backend framework. "
                "Implement MongoDB persistence consistent with the architecture and expose the documented API. "
                "Write complete, runnable source and configuration files into the output/backend folder using the file writer tool. Use directory='backend' and sensible filenames; do not return code only in your response.",
    expected_output="A working Node.js/Express.js backend backed by MongoDB, saved as runnable source and configuration files, including API routes, "
    "OpenAPI/Swagger definitions, MongoDB models or schemas, environment-based configuration, and secure authentication/error-handling flows.",
    agent=backend_developer,
    context=[architecture_task],
    async_execution=True,   # runs in parallel with the frontend task
)

frontend_task = Task(
    description="Implement the frontend following the UI design and API contract. "
                "Use React.js and Tailwind CSS; do not use another UI framework or styling framework. "
                "Integrate with the Node.js/Express.js API defined by the architecture. "
                "Write complete, runnable source and configuration files into the output/frontend folder using the file writer tool. Use directory='frontend' and sensible filenames; do not return code only in your response.",
    expected_output="A working responsive frontend implementation saved as source files, " 
    "built with React.js and Tailwind CSS, featuring responsive layouts, state management, and integration with the documented backend API.",
    agent=frontend_developer,
    context=[design_task, architecture_task],
    async_execution=True,   # runs in parallel with the backend task
)

qa_task = Task(
    description="Review the backend and frontend code against the requirements and "
                "verify that the implementation uses the required React.js/Tailwind CSS frontend and Node.js/Express.js/MongoDB backend. "
                "write executable test files into output/tests using the file writer tool with directory='tests', in addition to the QA report.",
    expected_output="A detailed QA test suite and execution matrix including manual test cases, " 
    "automated tests appropriate for the React.js and Node.js implementation (e.g., Vitest, Jest, or Playwright), edge case coverage,"
    "and a defect tracking template.",
    agent=qa_engineer,
    context=[requirements_task, backend_task, frontend_task],  # waits for both
    output_file="output/documentation/05_qa_report.md",
)

deploy_task = Task(
    description="Create a Docker-based deployment for the React.js/Tailwind CSS frontend, Node.js/Express.js backend, and MongoDB under output/deployment using the file writer tool with directory='deployment'. Include Dockerfiles and a Docker Compose configuration that runs the application services with MongoDB; do not substitute Kubernetes or a non-Docker deployment.",
    expected_output="A runnable Docker deployment containing frontend and backend Dockerfiles, a Docker Compose file for the frontend, backend, and MongoDB services, environment-based configuration, MongoDB persistent storage, service health checks, and concise build/run instructions. Include a CI pipeline only if it supports the Docker workflow.",
    agent=devops_engineer,
    context=[architecture_task, backend_task, frontend_task, qa_task],
    output_file="output/documentation/06_deployment.md",
)
