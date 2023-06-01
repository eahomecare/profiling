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
        k=20
    )
    prompt = FewShotPromptTemplate(
        example_selector=example_selector, 
        example_prompt=example_prompt, 
        suffix="Provide the response as a question, its level and answers as a reply based on the Input: {input}:", 
        input_variables=["input"]
    )
    llm = OpenAI(model_name="text-davinci-003", n=2, best_of=2)
    result = llm(prompt.format(input=input_string))
    return jsonify({"result": result.strip()})

if __name__ == "__main__":
    app.run(debug=True,port=3000)