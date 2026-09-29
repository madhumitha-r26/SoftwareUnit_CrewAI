import asyncio
from pathlib import Path
from tasks import plan_task, requirements_task, architecture_task, design_task, backend_task, frontend_task, qa_task, deploy_task
from agents import project_manager, business_analyst, solution_architect, uiux_designer, backend_developer, frontend_developer, qa_engineer, devops_engineer

from crewai import Crew, Process

async def main():
    Path("output/documentation").mkdir(parents=True, exist_ok=True)

    dev_crew = Crew(
        agents=[
            project_manager,
            business_analyst,
            solution_architect,
            uiux_designer,
            backend_developer,
            frontend_developer,
            qa_engineer,
            devops_engineer
        ],
        tasks=[
            plan_task,
            requirements_task,
            architecture_task,
            design_task,
            backend_task,
            frontend_task,
            qa_task,
            deploy_task
        ],
        process=Process.sequential,
        verbose=True
    )

    result = await dev_crew.kickoff_async(
            inputs={"project_idea": "A Simple Task Management System"}
    )
    print("\n\n========== FINAL OUTPUT ==========")
    print(result)


if __name__ == "__main__":
    asyncio.run(main())
