import openai as OpenAI
from langchain.agents import create_agent
import requests
from dotenv import load_dotenv
from langchain.tools import tool
import prompt.txt as prompt

@tool('get_football_data', description = 'return footballer statistics',
      return_direct=False)



def get_football_data(name: str):
    response = requests.get(f'https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p={name}')
    return response.json()

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="<OPENROUTER_API_KEY>",
)
agent = create_agent(
    
    model = "google/gemma-4-26b-a4b-it:free",
    tools=[get_football_data],
    system_prompt=prompt
    
)