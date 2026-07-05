from langchain_openai import ChatOpenAI 
from langchain.agents import create_agent
import requests
from dotenv import load_dotenv
from langchain.tools import tool
import prompt
import os

load_dotenv()

@tool('get_football_data', description = 'return footballer statistics',
return_direct=False)

def get_football_data(name: str):
    response = requests.get(f'https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p={name}')
    return response.json()


llm = ChatOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPEN_ROUTER_API_KEY"),
    model="openai/gpt-oss-20b:free"
)

agent = create_agent(
    model = llm,
    tools=[get_football_data],
    system_prompt=prompt.prompt
)

response =agent.invoke({
    "messages": [
        {"role": "user",
        "content": "Lionel Messi, Cristiano Ronaldo, Kylian Mbappe, Erling Haaland, Kevin De Bruyne"
        }]
})

print(response)
print(response['messages'][-1].content)