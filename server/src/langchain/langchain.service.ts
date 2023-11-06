import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import {
  SemanticSimilarityExampleSelector,
  PromptTemplate,
  FewShotPromptTemplate,
} from 'langchain/prompts';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAI } from 'langchain/llms/openai';
import { examples } from './plainStringExamples';

@Injectable()
export class LangchainService {
  constructor(
    private configService: ConfigService,
  ) {}

  async process(inputString: string) {
    const examplePrompt = new PromptTemplate({
      inputVariables: ['Input', 'Response'],
      template: 'Input: {Input}\n{Response}',
    });

    const exampleSelector =
      await SemanticSimilarityExampleSelector.fromExamples(
        examples,
        new OpenAIEmbeddings({
          openAIApiKey: this.configService.get(
            'OPEN_AI_KEY',
          ),
        }),
        HNSWLib,
        { k: 50 },
      );

    const prompt = new FewShotPromptTemplate({
      exampleSelector,
      examplePrompt,
      suffix: `
            The examples provided illustrate an engagement mechanism where each user response elevates the conversation to a more specific or granular level. Here are the level definitions:
            Level 1: This is the broad category or subject of interest (e.g., hobbies, sports, food, fitness, travel, technology).
            Level 2: This level goes into subcategories within the chosen category from level 1 (e.g., for sports, the options are team sports, individual sports, water sports).
            Level 3: Here, the conversation goes deeper into specific interests within the chosen subcategory (e.g., for team sports, the options are football, basketball, cricket).
            Level 4: This level gets into more specific details or preferences within the chosen interest from level 3 (e.g., for football, the options are playing, watching, both).
            Level 5: The highest level of granularity. It explores highly specific aspects or preferences related to the choice from level 4 (e.g., if 'watching' is chosen for football, the options are Premier League, La Liga, Bundesliga).
        Output should be of this format
        Question: text: ..., level: ..., Answers: ...
        {input}
            `,
      inputVariables: ['input'],
    });

    const model = new OpenAI({
      openAIApiKey: this.configService.get(
        'OPEN_AI_KEY',
      ),
      temperature: 0.9,
    });

    const formattedPrompt = await prompt.format({
      input: inputString,
    });

    console.log(
      'Formated Prompt',
      formattedPrompt,
    );

    const result = await model.call(
      formattedPrompt,
    );
    console.log('Result', result);
    return result.trim();
  }
}
