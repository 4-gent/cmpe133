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
import json

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)

#JSON template
jsontemplate = """
You must respond in a valid JSON format without any additional explanation or commentary. 

Here is the required JSON structure:

{
  "albums": [
    {
      "albumlink": "string",
      "albumName": "string",
      "artist": "string"
    }
  ],
  "songs": [
    {
      "songlink": "string",
      "songName": "string",
      "artist": [{"name": "string"}]
    }
  ]
}

If any field cannot be populated, use an empty string ("").
Do not provide any other text outside of this JSON structure.
"""

# Initialize tools and agent
spotify_tool = SpotifyTool(os.getenv("SPOTIFY_CLIENT_ID"), os.getenv("SPOTIFY_CLIENT_SECRET"))
duckduckgo_tool = DuckDuckGoSearchResults()
model = ChatOpenAI(model="gpt-4o")
tools = [
    Tool(name="Spotify Search", func=spotify_tool.search_music, description="Useful for searching music"),
    #Tool(name="DuckDuckGo Search", func=duckduckgo_tool.invoke, description="Useful for searching the web"),
]
prompt = hub.pull("hwchase17/structured-chat-agent")
agent = create_structured_chat_agent(llm=model, tools=tools, prompt=prompt)
agent_executor = AgentExecutor.from_agent_and_tools(
    agent=agent, tools=tools, verbose=True, handle_parsing_errors=True
)


#Deppreciated function
def validate_and_repair_json(response):
    try:
        # Attempt to parse the response as JSON
        parsed = json.loads(response)
        return parsed
    except json.JSONDecodeError:
        # If invalid, log the raw response and try to extract the JSON portion
        print("Invalid JSON response:", response)
        try:
            # Attempt to repair the JSON (e.g., removing extraneous text)
            json_start = response.index("{")
            json_end = response.rindex("}") + 1
            repaired_response = response[json_start:json_end]
            return json.loads(repaired_response)
        except (ValueError, json.JSONDecodeError):
            # Return a fallback response if repair fails
            return {"error": "Failed to parse JSON", "raw_response": response}


@app.route('/query', methods=['GET', 'POST'])
def query_ai():
    if request.method == 'POST':
        user_input = request.json.get("query")
        print("user_input:", user_input)
        if not user_input:
            return jsonify({"error": "No query provided"}), 400
        try:
            appended_query = f"""
            {user_input}

            Please respond strictly in the following JSON format:
            {{
            "albums": [
                {{
                    "albumlink": "string",
                    "albumName": "string",
                    "artist": "string"
                }}
            ],
            "songs": [
                {{
                    "songlink": "string",
                    "songName": "string",
                    "artist": [{{"name": "string"}}]
                }}
            ]
        }}
            """
            response = agent_executor.invoke({"input": appended_query})
            return jsonify(response)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)