from flask import Flask, request, jsonify
from langchain.prompts.few_shot import FewShotPromptTemplate
from langchain.prompts.prompt import PromptTemplate
from langchain.prompts.example_selector import SemanticSimilarityExampleSelector
from langchain.vectorstores import FAISS
import os
from plainStringExamples import examples
from flask_cors import CORS
from langchain.llms import HuggingFaceHub
from langchain.embeddings import HuggingFaceHubEmbeddings
from langchain import LLMChain, PromptTemplate


os.environ["HUGGINGFACEHUB_API_TOKEN"] = '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'

# Repos for llm
#################################
# repo_id = "google/flan-t5-base"
# repo_id = "google/flan-t5-small"
# repo_id = "mrm8488/t5-base-finetuned-common_gen"
# repo_id = "gpt2"
repo_id = "bigscience/bloom"
# repo_id = "databricks/dolly-v2-12b"
# repo_id = "bigscience/bloomz"
#################################
llm = HuggingFaceHub(repo_id=repo_id, model_kwargs={"temperature":0.1}) 

# Repos for embeddings

#################################
repo_id_em = "sentence-transformers/all-mpnet-base-v2"
#################################
embeddings = HuggingFaceHubEmbeddings(
                repo_id=repo_id_em,
                task="feature-extraction",
)

app = Flask(__name__)
CORS(app)

@app.route("/process", methods=["POST"])
def process():
    data = request.json
    input_string = data.get("input")
    example_prompt = PromptTemplate(input_variables=["Input", "Response"], template="Input: {Input}\n{Response}")
    example_selector = SemanticSimilarityExampleSelector.from_examples(
        examples,
        embeddings, 
        FAISS,
        k=15
    )
    prompt = FewShotPromptTemplate(
        example_selector=example_selector, 
        example_prompt=example_prompt, 
        suffix="generate a question along with its level and with its mulitple choice answers, there should be 3 answers based on the Input: {input}:", 
        # suffix="Provide the response as a question, its level and answers as a reply based on the previous patterns:", 
        # suffix="Provide the response as a question, its level and answers as a reply based on the previous patterns:", 
        input_variables=["input"]
    )
    llm_chain = LLMChain(prompt=prompt, llm=llm, verbose=True)

    # For testing
    #####################################
    # templatei = """Question: {question}

    # Answer: Let's think step by step."""
    # prompti = PromptTemplate(template=templatei, input_variables=["question"])
    # llm_chaini = LLMChain(prompt=prompti, llm=llm, verbose=True)
    # question = "Who won the FIFA World Cup in the year 1994? "
    # print('before llmi')
    # resulti = llm_chaini.run(question)
    # print(resulti)
    # print('after llmi')
    #####################################

    input = input_string
    result = llm_chain.run(input)
    print('result',result)

    return jsonify({"result": result.strip()})

if __name__ == "__main__":
    app.run(debug=True,port=3000)