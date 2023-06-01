from flask import Flask, request, jsonify
from langchain.prompts.few_shot import FewShotPromptTemplate
from langchain.prompts.prompt import PromptTemplate
from langchain.prompts.example_selector import SemanticSimilarityExampleSelector
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import OpenAI
import os
from plainStringExamples import examples
from flask_cors import CORS

os.environ['OPENAI_API_KEY'] = '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'

app = Flask(__name__)
CORS(app)

@app.route("/process", methods=["POST"])
def process():
    data = request.json
    input_string = data.get("input")
    example_prompt = PromptTemplate(input_variables=["Input", "Response"], template="Input: {Input}\n{Response}")
    example_selector = SemanticSimilarityExampleSelector.from_examples(
        examples,
        OpenAIEmbeddings(),
        Chroma,
        k=50
    )
    prompt = FewShotPromptTemplate(
        example_selector=example_selector, 
        example_prompt=example_prompt, 
        # suffix="Provide the response as a question, its level and answers as a reply based on the Input: {input}:", 
        suffix="""
        The examples provided illustrate an engagement mechanism where each user response elevates the conversation to a more specific or granular level. Here are the level definitions:
            Level 1: This is the broad category or subject of interest (e.g., hobbies, sports, food, fitness, travel, technology).
            Level 2: This level goes into subcategories within the chosen category from level 1 (e.g., for sports, the options are team sports, individual sports, water sports).
            Level 3: Here, the conversation goes deeper into specific interests within the chosen subcategory (e.g., for team sports, the options are football, basketball, cricket).
            Level 4: This level gets into more specific details or preferences within the chosen interest from level 3 (e.g., for football, the options are playing, watching, both).
            Level 5: The highest level of granularity. It explores highly specific aspects or preferences related to the choice from level 4 (e.g., if 'watching' is chosen for football, the options are Premier League, La Liga, Bundesliga).
        Output should be of this format
        Question: text: ..., level: ..., Answers: ...
        {input}
        """, 
        input_variables=["input"]
    )
    llm = OpenAI(model_name="text-davinci-003", n=2, best_of=2, verbose=True)
    result = llm(prompt.format(input=input_string))
    print('result:',result)
    return jsonify({"result": result.strip()})

if __name__ == "__main__":
    app.run(debug=True,port=3000)