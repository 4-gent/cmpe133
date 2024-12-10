from flask import Flask, request, jsonify
from flask_cors import CORS
from spotify_tool import SpotifyTool
from dotenv import load_dotenv
from langchain import hub
from langchain_openai import ChatOpenAI
from langchain_core.tools import Tool
from langchain_community.tools import DuckDuckGoSearchResults
from langchain.agents import AgentExecutor, create_structured_chat_agent
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)

# Initialize tools and agent
spotify_tool = SpotifyTool(os.getenv("SPOTIFY_CLIENT_ID"), os.getenv("SPOTIFY_CLIENT_SECRET"))
duckduckgo_tool = DuckDuckGoSearchResults()
model = ChatOpenAI(model="gpt-4o", api_key=os.getenv("OPENAIAPI_KEY"))
tools = [
    Tool(name="Spotify Search", func=spotify_tool.search_music, description="Useful for searching music"),
    Tool(name="DuckDuckGo Search", func=duckduckgo_tool.invoke, description="Useful for searching the web"),
]
prompt = hub.pull("hwchase17/structured-chat-agent")
agent = create_structured_chat_agent(llm=model, tools=tools, prompt=prompt)
agent_executor = AgentExecutor.from_agent_and_tools(
    agent=agent, tools=tools, verbose=True, handle_parsing_errors=True
)

@app.route('/query', methods=['GET', 'POST'])
def query_ai():
    if request.method == 'POST':
        user_input = request.json.get("query")
        print("user_input:", user_input)
        if not user_input:
            return jsonify({"error": "No query provided"}), 400
        try:
            response = agent_executor.invoke({"input": user_input})
            return jsonify(response)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)