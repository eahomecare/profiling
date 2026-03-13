# LangChain & Prompt Engineering Architecture

This system uses **Few-Shot Learning with Semantic Similarity** to generate contextual survey questions that progressively profile customers.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         CUSTOMER PROFILING SYSTEM                                    │
└─────────────────────────────────────────────────────────────────────────────────────┘

                              DATA LAYER
      ┌─────────────────────────────────────────────────────────────┐
      │  plainStringExamples.ts (~1500 survey Q&A examples)          │
      │  ├─ Hobbies, Sports, Food, Fitness, Travel, Tech, Gadgets   │
      │  └─ 5-level hierarchical training data                       │
      └──────────────────┬──────────────────────────────────────────┘
                         │
                    ┌────▼────────────────────────────────────────────┐
                    │    TRAINING & FINE-TUNING PIPELINE              │
                    │                                                  │
                    │  ┌──────────────────────────────────────────┐   │
                    │  │ LoRA Fine-Tuning                         │   │
                    │  │ ├─ Base: Flan-T5 or Bloom               │   │
                    │  │ ├─ Adapters: rank-16 (3% params)        │   │
                    │  │ ├─ Time: 2-4 hrs on GPU                 │   │
                    │  │ └─ Output: survey-model-lora (~50MB)     │   │
                    │  └──────────────────────────────────────────┘   │
                    │  ┌──────────────────────────────────────────┐   │
                    │  │ QLoRA Fine-Tuning (Cost-effective)       │   │
                    │  │ ├─ 4-bit Quantization + LoRA adapters   │   │
                    │  │ ├─ Memory: 8GB GPU                       │   │
                    │  │ ├─ Cost: $2-5                            │   │
                    │  │ └─ Output: quantized-survey-model        │   │
                    │  └──────────────────────────────────────────┘   │
                    └────┬──────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┬──────────────────┐
        │                │                │                  │
        ▼                ▼                ▼                  ▼

   EMBEDDING LAYER                   LLM OPTIONS
   ┌─────────────────┐    ┌────────────────────────────────────────┐
   │ Embedding       │    │ Option 1: OpenAI API (Production)     │
   │ Models:         │    │ └─ GPT-3 (text-davinci-003)           │
   │                 │    │ └─ Cost: $0.02-0.20 per request       │
   │ ├─ OpenAI       │    │                                        │
   │ │  (1536-dim)   │    │ Option 2: HuggingFace Hub (Free)      │
   │ │  Cost: $0.10/ │    │ ├─ bigscience/bloom-560m              │
   │ │  1M tokens    │    │ ├─ google/flan-t5-base                │
   │ │               │    │ ├─ databricks/dolly-v2-12b            │
   │ ├─ Sentence     │    │ └─ No API costs (rate limited)        │
   │ │  Transformers │    │                                        │
   │ │  (FAISS)      │    │ Option 3: Local Fine-Tuned Model      │
   │ │  Free         │    │ └─ Custom-trained survey-model-lora   │
   │ │               │    │ └─ Deploy via Ollama (local inference) │
   │ └─ Embeddings   │    └────────────────────────────────────────┘
   └────────┬────────┘                   │
            │                            │
            └────────────┬───────────────┘
                         │
        ┌────────────────▼──────────────────┐
        │  VECTOR STORE / RETRIEVAL         │
        │                                   │
        │  ┌─────────────────────────────┐  │
        │  │ Chroma DB                   │  │
        │  │ ├─ In-memory vector store   │  │
        │  │ ├─ Embedded in NestJS app   │  │
        │  │ └─ 1500 embeddings indexed  │  │
        │  └─────────────────────────────┘  │
        │                                   │
        │  ┌─────────────────────────────┐  │
        │  │ HNSWLib (Alternative)       │  │
        │  │ ├─ Hierarchical algorithms  │  │
        │  │ ├─ Fast similarity search   │  │
        │  │ └─ Used in TypeScript impl  │  │
        │  └─────────────────────────────┘  │
        │                                   │
        │  ┌─────────────────────────────┐  │
        │  │ FAISS (Alternative)         │  │
        │  │ ├─ Facebook's search lib    │  │
        │  │ └─ Used in Python Flask     │  │
        │  └─────────────────────────────┘  │
        └────────────────┬──────────────────┘
                         │
        ┌────────────────▼──────────────────────────────────┐
        │     PROMPT ENGINEERING & RAG LAYER                │
        │                                                    │
        │  User Input: "key: hobbies, level: 1"            │
        │          │                                        │
        │          ▼                                        │
        │  1. Convert to embedding vector                   │
        │          │                                        │
        │          ▼                                        │
        │  2. Retrieval: Find top-50 similar examples       │
        │          │                                        │
        │          ▼                                        │
        │  3. Augmentation: Build FewShotPrompt with        │
        │     - Retrieved examples                          │
        │     - Format instructions (suffix)                │
        │     - User input                                  │
        │          │                                        │
        │          ▼                                        │
        │  4. Generation: Send to LLM                       │
        │          │                                        │
        │          ▼                                        │
        │  Output: "Question: text: ..., level: ..., ..."  │
        └────────────────┬───────────────────────────────────┘
                         │
        ┌────────────────▼──────────────────┐
        │   APPLICATION LAYER                │
        │                                    │
        │  NestJS Server                     │
        │  ├─ langchain.controller.ts        │
        │  ├─ langchain.service.ts           │
        │  └─ POST /process endpoint         │
        │                                    │
        │  Python Flask (Alternative)        │
        │  ├─ server-openai.py               │
        │  ├─ server-huggingfacehub.py       │
        │  └─ POST /process endpoint         │
        └────────────────┬──────────────────┘
                         │
        ┌────────────────▼──────────────────┐
        │   FRONTEND LAYER                   │
        │                                    │
        │  React Dashboard (boilerplate)    │
        │  ├─ Survey UI Components           │
        │  ├─ Question Display               │
        │  ├─ Answer Selection               │
        │  └─ Customer Profile Management    │
        └────────────────────────────────────┘
```

---

## Core Architecture Flow

```
Frontend (React)
       │
       ▼
  POST /process
       │
       ▼
NestJS Server (langchain.controller)
       │
       ▼
LangchainService (TypeScript)
       │
       ├─► OpenAI API (GPT-3)
       │
       └─► Vector Database (HNSWLib/Chroma)
```

---

## How It Works: 5-Level Hierarchical Profiling

The system progressively narrows down customer interests through 5 levels:

### Example Flow (Hobbies > Music > Playing > Guitar > Type):

```
Level 1 (Broad):     "What kind of hobbies are you interested in?"
                     Answers: Reading, Music, Sports

Level 2 (Category):  "Playing music or listening?"
                     Answers: Listening, Playing, Both

Level 3 (Specific):  "Which instrument?"
                     Answers: Guitar, Piano, Violin

Level 4 (Detail):    "What type of guitar?"
                     Answers: Acoustic, Electric, Classical

Level 5 (Granular):  "What genre do you play?"
                     Answers: Classical, Jazz, Pop
```

---

## Prompt Engineering Technique: Few-Shot Learning

### 1. Example Storage

The system stores ~100+ training examples in `plainStringExamples.ts`:

```typescript
{
  Input: 'key: hobbies, level: 1, key: music, level: 2',
  Response: 'Question: text: Do you enjoy listening to music..., level: 3, Answers: Listening, Playing, Both'
}
```

### 2. Semantic Similarity Selector

When a user selects an answer, the input is converted to embeddings and compared:

```typescript
const exampleSelector = 
  SemanticSimilarityExampleSelector.fromExamples(
    examples,
    new OpenAIEmbeddings(),  // Convert to vectors
    HNSWLib,                  // Vector store
    { k: 50 }                 // Select top 50 similar examples
  );
```

### 3. Few-Shot Template

The selected examples are formatted and combined with the suffix prompt:

```typescript
const prompt = new FewShotPromptTemplate({
  exampleSelector,
  examplePrompt: 'Input: {Input}\n{Response}',
  suffix: `
    Level 1: Broad category (hobbies, sports, food, fitness, travel, technology)
    Level 2: Subcategories within level 1
    Level 3: Specific interests within subcategory
    Level 4: More specific preferences
    Level 5: Highly specific aspects
    
    Output format:
    Question: text: ..., level: ..., Answers: ...
    {input}
  `,
  inputVariables: ['input']
});
```

---

## Flow Diagram

```
User Input                    LLM Processing                Output
┌─────────────────┐          ┌──────────────────┐          ┌─────────────────┐
│ key: hobbies    │────────► │ 1) Find similar  │────────► │ Question: text: │
│ level: 1        │          │    examples      │          │ What hobbies?   │
└─────────────────┘          │ 2) Build prompt  │          │ level: 2        │
                             │ 3) Call OpenAI   │          │ Answers: Reading│
                             │    with examples │          │ Music, Sports   │
                             └──────────────────┘          └─────────────────┘
                                    ▲
                                    │
                         OpenAI Embedding
                         + Vector Search
                         (HNSWLib)
```

---

## Two Implementation Options

### Option 1: NestJS TypeScript (server/src/langchain/)

- Uses OpenAI's API directly
- Local vector store (HNSWLib)
- Temperature: 0.9 (more creative responses)
- Controller: `POST /process`

**Key Files:**
- `langchain.service.ts` - Core logic for prompt generation
- `langchain.controller.ts` - HTTP endpoint
- `plainStringExamples.ts` - 1500+ lines of training examples
- `langchain.module.ts` - NestJS module setup

### Option 2: Python Flask (langchain-server-python/)

- **server-openai.py**: Uses OpenAI (Davinci model)
- **server-huggingfacehub.py**: Uses free Hugging Face models (BigScience Bloom)
- Uses Chroma or FAISS for vector storage
- Temperature: 0.1 (more deterministic)

**Supported Models:**
- OpenAI: `text-davinci-003`
- Hugging Face: `bigscience/bloom`, `google/flan-t5-base`, `gpt2`, `databricks/dolly-v2-12b`
- Embeddings: `sentence-transformers/all-mpnet-base-v2`

---

## Key LangChain Components

| Component | Purpose |
|-----------|---------|
| **OpenAIEmbeddings** | Converts text input into 1536-dim vectors |
| **HNSWLib/Chroma** | Vector database for fast semantic similarity search |
| **SemanticSimilarityExampleSelector** | Finds top-k most relevant examples |
| **FewShotPromptTemplate** | Combines examples + suffix into final prompt |
| **OpenAI Model** | Generates new question following the pattern |
| **LLMChain** | Orchestrates prompt → LLM → output pipeline |

---

## RAG (Retrieval-Augmented Generation) Architecture

This application heavily uses **RAG pattern** to improve the quality of generated survey questions.

### RAG Flow

```
User Input
    │
    ▼
Convert to Embedding (OpenAIEmbeddings)
    │
    ▼
Vector Search (HNSWLib/Chroma)
    │
    ├─ Retrieve top-k relevant examples (k=50)
    │
    ▼
Augment Prompt with Retrieved Examples
    │
    ├─ Example 1: hobbies → music → playing
    ├─ Example 2: hobbies → music → listening
    ├─ Example 3: sports → music → ... (less similar)
    │      ...
    ├─ Example 50
    │
    ▼
Pass to LLM for Generation
    │
    ▼
Generate New Question Following Retrieved Patterns
```

### Why RAG is Used Here

**Without RAG (Direct Prompting):**
```
LLM might generate inconsistent formats, wrong level jumps, 
or illogical answers not following the hierarchical pattern.
```

**With RAG (Now):**
```
LLM sees similar examples in the prompt → 
Learns the exact pattern/format → 
Generates consistent, contextually appropriate next question
```

### RAG Implementation Details

**1. Retrieval (Vector Search)**

```typescript
const exampleSelector = 
  SemanticSimilarityExampleSelector.fromExamples(
    examples,                    // 100+ training examples
    new OpenAIEmbeddings(),      // Embedding model
    HNSWLib,                     // Vector DB (HNSW = Hierarchical Navigable Small World)
    { k: 50 }                    // Retrieve top 50 most similar
  );
```

The system converts the user input to a vector and finds the 50 most semantically similar examples from the knowledge base.

**Example:** User input `'key: hobbies, level: 1, key: music, level: 2'` will retrieve examples about music-related questions at level 3, not about sports or food.

**2. Augmentation (Adding Context)**

```typescript
const prompt = new FewShotPromptTemplate({
  exampleSelector,              // Retrieved examples
  examplePrompt,                // Template for formatting examples
  suffix: `                     // Instructions for format
    Output format:
    Question: text: ..., level: ..., Answers: ...
    {input}
  `,
  inputVariables: ['input']
});
```

The final prompt looks like:

```
Example 1:
Input: key: hobbies, level: 1, key: music, level: 2
Response: Question: text: Do you enjoy listening or playing?, level: 3, Answers: ...

Example 2:
Input: key: hobbies, level: 1, key: reading, level: 2
Response: Question: text: What type of books?, level: 3, Answers: ...

... (more examples) ...

Output format instructions...

Now generate for:
Input: key: hobbies, level: 1, key: music, level: 2
```

**3. Generation (LLM Response)**

```typescript
const model = new OpenAI({
  openAIApiKey: process.env.OPEN_AI_KEY,
  temperature: 0.9
});

const result = await model.call(formattedPrompt);
```

The LLM now has:
- **Context**: 50 similar examples showing the pattern
- **Instructions**: Clear format requirements in suffix
- **Input**: The user's current selection

Result: Consistent, contextually appropriate output.

---

## RAG vs Traditional Approaches

| Approach | Method | Quality | Consistency |
|----------|--------|---------|-------------|
| **Hardcoded** | Store all 5-level trees as JSON | 100% consistent | Limited flexibility |
| **Prompt Engineering Only** | Send instruction + input to LLM | Variable | Format inconsistency |
| **RAG (Current)** | Retrieve similar examples + prompt LLM | High quality | Format consistent |

The system uses RAG because:
- ✅ Reduces hallucinations by providing concrete examples
- ✅ Ensures format consistency (Question, Level, Answers always present)
- ✅ Enables semantic matching (related topics retrieved together)
- ✅ Scalable (add more examples without code changes)
- ✅ Cost-effective (smaller context window needed than pure prompting)

---

## Prompt Engineering Strategy

1. **Pattern Learning**: LLM learns from 100+ retrieved examples how to structure answers
2. **Semantic Matching**: Only relevant examples are included (not random 50)
3. **Context Awareness**: Input history (e.g., "hobbies → music → playing") guides generation
4. **Format Enforcement**: Suffix explicitly defines output structure: `Question: text: ..., level: ..., Answers: ...`

---

## Custom Model Fine-Tuning with HuggingFace

We are experimenting with training our own model using the survey examples. Here's the architecture and methods:

### Why Fine-Tune Custom Models?

**Current Approach (Using Pre-trained):**
- OpenAI GPT-3: Expensive API calls (~$0.02-0.20 per request)
- HuggingFace BigScience Bloom: Free but generic knowledge

**Custom Fine-Tuned Model Benefits:**
- ✅ Lower inference costs (local/hosted model)
- ✅ Domain-specific knowledge (survey profiling)
- ✅ Better quality for your specific task
- ✅ Faster inference
- ✅ Full control over model behavior

### Fine-Tuning Methods & Architecture

#### **Option 1: LoRA (Low-Rank Adaptation)**

LoRA freezes the base model and adds learnable "adapters" to reduce training parameters by 90%+.

**Architecture:**
```
Base Model (Frozen)           LoRA Adapters (Trainable)
    │                                  │
    ├─ Query Weight W_q (Frozen)  ├─ A (input: 4096→16)
    ├─ Key Weight W_k (Frozen)    ├─ B (output: 16→4096)
    └─ Value W_v (Frozen)         └─ BA (rank-16 update)
    
Final Output = W_v + BA (adds only small rank-16 modification)
```

**Training Code Example:**

```python
from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments
from peft import get_peft_model, LoraConfig, TaskType

# Load base model
model_name = "google/flan-t5-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Configure LoRA
lora_config = LoraConfig(
    r=16,                           # LoRA rank (hidden dimension)
    lora_alpha=32,                  # Scaling factor
    target_modules=["q", "v"],      # Which layers to apply LoRA
    lora_dropout=0.05,              # Regularization
    bias="none",
    task_type=TaskType.SEQ_2_SEQ_LM
)

# Apply LoRA to model
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()  # Shows ~3% trainable parameters

# Training arguments
training_args = TrainingArguments(
    output_dir="./survey-model-lora",
    num_train_epochs=3,
    per_device_train_batch_size=8,
    learning_rate=1e-4,
    logging_steps=100,
    save_steps=500,
    warmup_steps=100,
)

# Train
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,  # Your survey examples
)

trainer.train()
model.save_pretrained("./survey-model-lora-final")
```

**Training Requirements:**
- **Time**: 2-4 hours on single GPU (e.g., Tesla V100)
- **Memory**: 16GB GPU (vs 80GB+ for full fine-tuning)
- **Data**: 1000+ examples recommended
- **Cost**: ~$5-20 on cloud GPU

---

#### **Option 2: QLoRA (Quantized LoRA) - Most Cost-Effective**

Combines LoRA with 4-bit quantization for ultra-low memory usage.

**Architecture:**
```
Full Precision Model (32-bit)
    │
    ▼
4-bit Quantized Base (bitsandbytes)    +    LoRA Adapters (Trainable)
    │                                        │
    └─ 4x smaller model                  └─ Full precision adapters
       Uses 8GB GPU for 70B models           ~2-4GB for adapters
```

**QLoRA Training Code:**

```python
from transformers import AutoModelForCausalLM, BitsAndBytesConfig, AutoTokenizer
from peft import prepare_model_for_kbit_training, LoraConfig, get_peft_model
import torch

# 4-bit quantization config
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",          # NormalFloat 4-bit
    bnb_4bit_use_double_quant=True,     # double quantization
    bnb_4bit_compute_dtype=torch.bfloat16
)

# Load with quantization
model_name = "bigscience/bloom"
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=quantization_config,
    device_map="auto"
)

# Prepare for training
model = prepare_model_for_kbit_training(model)

# Apply LoRA
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    modules_to_save=["query_key_value"],  # BLOOM specific
    task_type=TaskType.CAUSAL_LM
)

model = get_peft_model(model, lora_config)

# Train with lower memory footprint
trainer = Trainer(...)
trainer.train()
```

**Benefits of QLoRA:**
- ✅ Can fine-tune 70B parameter models on single GPU
- ✅ ~40% faster training than LoRA
- ✅ Minimal performance loss vs full precision
- ✅ Training cost: ~$2-5

---

#### **Option 3: Full Fine-Tuning (Traditional)**

Train all model parameters (most compute-intensive but best quality).

```python
model = AutoModelForCausalLM.from_pretrained(model_name)

training_args = TrainingArguments(
    output_dir="./survey-model-full",
    num_train_epochs=3,
    per_device_train_batch_size=4,  # Smaller batch due to memory
    gradient_accumulation_steps=2,
    learning_rate=5e-5,
    warmup_ratio=0.1,
    save_strategy="epoch",
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    data_collator=data_collator,
)

trainer.train()
```

---

### Our Training Dataset Setup

Using our `plainStringExamples.py` (~1500 examples):

```python
from datasets import Dataset
import json

# Convert your examples to HuggingFace dataset format
examples = [
    {
        "input": "key: hobbies, level: 1",
        "output": "Question: text: What kind of hobbies are you interested in?, level: 2, Answers: Reading, Music, Sports"
    },
    # ... more examples
]

dataset = Dataset.from_dict({
    "input": [ex["input"] for ex in examples],
    "output": [ex["output"] for ex in examples]
})

# Split train/validation
split_dataset = dataset.train_test_split(test_size=0.1)

# Format for model training
def format_function(example):
    return {
        "text": f"Input: {example['input']}\nOutput: {example['output']}"
    }

formatted_dataset = split_dataset.map(format_function)
```

---

### Training Comparison Table

| Method | GPU Memory | Training Time | Cost | Quality | Use Case |
|--------|-----------|---|------|---------|----------|
| **LoRA** | 16GB | 2-4 hrs | $10-20 | 95% of full | **Recommended** |
| **QLoRA** | 8GB | 3-5 hrs | $2-5 | 92% of full | Budget-conscious |
| **Full** | 40GB+ | 6-12 hrs | $50-100+ | 100% | Best quality |
| **No training (Current)** | N/A | N/A | $0.02-0.20/req | Variable | Quick prototyping |

---

### Fine-Tuning Pipeline Architecture

```
plainStringExamples.ts (~1500 examples)
       │
       ▼
Convert to HF Dataset Format
       │
       ├─ Training Set (90%)
       ├─ Validation Set (10%)
       │
       ▼
Tokenize Examples
       │
       ▼
Select Fine-Tuning Method
       ├─ LoRA (recommended)
       ├─ QLoRA (cost-effective)
       └─ Full Fine-Tune (best quality)
       │
       ▼
Configure Trainer
       │
       ├─ Learning Rate: 1e-4 to 5e-5
       ├─ Batch Size: 4-16
       ├─ Epochs: 3-5
       ├─ Warmup Steps: 100-500
       │
       ▼
Train Model
       │
       ├─ Save checkpoints every N steps
       ├─ Monitor validation loss
       ├─ Early stopping if no improvement
       │
       ▼
Save LoRA Weights (~50MB) or Full Model
       │
       ▼
Load in NestJS Service
       │
       ├─ Use LangChain with custom model
       └─ Replace OpenAI API with local inference
```

---

### Integration with Our NestJS Server

Once fine-tuned, replace the OpenAI call with our fine-tuned model:

```typescript
import { HuggingFaceInference } from "langchain/llms/hf";

// Option 1: Use HuggingFace Inference API
const hf_model = new HuggingFaceInference({
  apiKey: process.env.HUGGINGFACEHUB_API_TOKEN,
  model: "our-org/survey-model-lora",  // Our fine-tuned model
});

// Option 2: Local inference (faster, no API costs)
const local_model = new Ollama({
  model: "survey-model-lora",
  baseUrl: "http://localhost:11434"
});

// In LangchainService
async process(inputString: string) {
  // ... existing prompt setup ...
  
  const result = await hf_model.call(formattedPrompt);
  // or
  const result = await local_model.call(formattedPrompt);
  
  return result;
}
```

---

### Recommended Training Approach for Our Use Case

**Step 1: Start with LoRA**
- Use `google/flan-t5-base` or `bigscience/bloom`
- Train for 3 epochs with our 1500 examples
- Validate on holdout test set

**Step 2: Evaluate Quality**
- Compare outputs vs pre-trained models
- Check consistency with our survey format
- Measure inference speed

**Step 3: Optimize**
- If too slow → Use QLoRA for faster inference
- If low quality → Add more examples or full fine-tune
- If cost is high → Deploy as local service with Ollama

---

## Data Categories (Training Examples)

The system has pre-trained examples for:

1. **Hobbies** - Reading, Music, Sports
2. **Sports** - Team Sports, Individual Sports, Water Sports
3. **Food** - Asian Cuisine, European, American
4. **Fitness** - Gym, Yoga, Outdoor Sports
5. **Travel** - Adventure, Relaxation, Historical
6. **Technology** - Software Dev, Hardware, Data Science
7. **Gadgets** - Smartphones, Laptops, Smartwatches

Each category has 5 levels of depth with multiple branches.

---

## Example Request/Response

### Request
```json
POST /process
{
  "input": "key: hobbies, level: 1, key: music, level: 2"
}
```

### Response
```json
{
  "result": "Question: text: Do you enjoy listening to music or playing an instrument?, level: 3, Answers: Listening to music, Playing an instrument, Both"
}
```

---

## Configuration Requirements

### Environment Variables
```
OPEN_AI_KEY=sk_xxxxx          # For NestJS implementation
OPENAI_API_KEY=sk_xxxxx        # For Python Flask
HUGGINGFACEHUB_API_TOKEN=hf_xxx  # For HuggingFace models
```

---

## Advantages of This Architecture

✅ **Dynamic Questions**: Not hardcoded - generated based on semantics  
✅ **Contextual**: Uses previous selections to guide next question  
✅ **Fast Inference**: Vector search finds relevant examples instantly  
✅ **Flexible Models**: Can switch between OpenAI and HuggingFace  
✅ **Scalable**: Examples can be expanded without code changes  
✅ **Consistent Format**: Always outputs structured data (Question, Level, Answers)

---

## Integration with Customer Profiling Platform

The LangChain module integrates with the broader customer profiling system:

1. **Survey Flow**: Generate questions progressively
2. **Store Responses**: Save user selections in MongoDB
3. **Profile Building**: Aggregate responses into customer profiles
4. **Segmentation**: Use profiles for targeted campaigns
5. **AI Enrichment**: Feed profiles back for personalized recommendations

This creates a closed-loop system where AI helps understand customers better, which in turn improves campaign targeting and customer engagement.
