# LangChain & Prompt Engineering Architecture

This system uses **Few-Shot Learning with Semantic Similarity** to generate contextual survey questions that progressively profile customers.

---

## Core Architecture

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
