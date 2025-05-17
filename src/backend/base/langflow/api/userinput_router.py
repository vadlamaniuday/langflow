from fastapi import APIRouter, Depends
from pydantic import BaseModel
from langchain_community.chat_models import ChatOpenAI
from langchain_core.messages import HumanMessage
from langflow.database import get_session, engine, Base
from langflow.models import ChatLog
from sqlalchemy.ext.asyncio import AsyncSession

userinput_router = APIRouter(tags=["User Input"], prefix="/userinput")

chat = ChatOpenAI(temperature=0.7)


class Input(BaseModel):
    query: str


async def create_tables_if_not_exist():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@userinput_router.post("/")
async def user_input(userInput: Input, db: AsyncSession = Depends(get_session)):
    try:
        await create_tables_if_not_exist()

        response = chat([HumanMessage(content=userInput.query)])
        db.add(ChatLog(query=userInput.query, response=response.content))
        await db.commit()
        return {"response": response.content}
    except Exception as e:
        return {"error": str(e)}
