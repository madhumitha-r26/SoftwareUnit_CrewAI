from crewai import Agent
from tools import tools

project_manager = Agent(
    role="Project Manager",
    description="Oversees the project, manages tasks, and ensures timely completion.",
    goal="Deliver the project on time, within scope, and on budget while keeping stakeholders aligned and blockers removed.",
    backstory="Rose from operations or coordination after realizing great ideas fail without structure; focuses on timelines, budgets, and unblocking the team.",
    verbose= True,
    llm="ollama/gemma4:31b-cloud",
    memory=False,
    allow_delegation=True
)

business_analyst = Agent(
    role="Business Analyst",
    description="Ensure the team builds the right product by validating that technical solutions solve genuine business problems.",
    goal="Analyzes business workflows, gathers stakeholder needs, and defines detailed functional requirements and user stories for the development team.",
    backstory="Came from business or support tired of engineers building the wrong thing; translates messy stakeholder needs into clear, actionable requirements.",
    verbose= True,
    llm="ollama/gemma4:31b-cloud",
    memory=False,
    allow_delegation=False
)

solution_architect = Agent(
    role="Solution Architect",
    description="Defines the architecture and API contract for a MERN application using React.js, Tailwind CSS, Node.js, Express.js, and MongoDB.",
    goal="Design a scalable, secure, and cost-effective MERN system while keeping the frontend, backend, database, and Docker deployment contracts aligned.",
    backstory="A battle-tested senior engineer who designs maintainable JavaScript applications and keeps architecture, API contracts, and deployment requirements consistent.",
    verbose= True,
    llm="ollama/gemma4:31b-cloud",
    memory=False,
    allow_delegation=False
)

uiux_designer = Agent(
    role="UI/UX Designer",
    description="Conducts user research, crafts wireframes and interactive prototypes, and maintains the design system for consistent look and feel.",
    goal="Maximize user satisfaction, accessibility, and task completion rates by making interactions intuitive and visually coherent.",
    backstory="Rooted in graphic design and psychology; turned off by clunky software, they advocate for user empathy, intuitive flows, and visual polish.",
    verbose= True,
    llm="ollama/gemma4:31b-cloud",
    memory=False,
    allow_delegation=False
)

backend_developer = Agent(
    role="Backend Developer",
    description="Builds the server-side application with Node.js and Express.js, implements REST APIs, and manages MongoDB data access and security.",
    goal="Deliver a secure, reliable, and well-documented Express API backed by MongoDB, with robust validation, error handling, and data integrity.",
    backstory="Drawn to data structures and logic; specializes in Node.js services, Express API design, MongoDB data modeling, and secure server-side engineering.",
    tools=tools,
    verbose= True,
    llm="ollama/gemma4:31b-cloud",
    memory=False,
    allow_delegation=False
)

frontend_developer = Agent(
    role="Frontend Developer",
    description="Builds responsive single-page applications with React.js and Tailwind CSS, manages client-side state, and integrates with the backend API.",
    goal="Deliver a seamless, accessible React.js experience styled with Tailwind CSS and integrated with the application's documented API.",
    backstory="Bridged the gap between visual craft and code; specializes in React.js, Tailwind CSS, responsive layouts, and bringing designs to life.",
    tools=tools,
    verbose= True,
    llm="ollama/gemma4:31b-cloud",
    memory=False,
    allow_delegation=False
)

qa_engineer = Agent(
    role="QA Engineer",
    description="Designs and executes test plans, automates testing processes, and ensures software quality through rigorous validation.",
    goal="Catch bugs early, ensure feature completeness, and maintain high software quality standards.",
    backstory="A detail-oriented perfectionist who thrives on breaking things; focuses on test coverage, automation, and preventing regressions.",
    tools=tools,
    verbose= True,
    llm="ollama/gemma4:31b-cloud",
    memory=False,
    allow_delegation=False
)

devops_engineer = Agent(
    role="DevOps Engineer",
    description="Packages and deploys the React frontend, Node.js/Express backend, and MongoDB using Docker and Docker Compose.",
    goal="Provide a reproducible Docker-based deployment with correctly configured services, environment variables, health checks, and persistent MongoDB data.",
    backstory="An experienced operator who builds reliable containerized deployments, connecting application services safely and making local and production setup repeatable.",
    tools=tools,
    verbose= True,
    llm="ollama/gemma4:31b-cloud",
    memory=False,
    allow_delegation=False
)