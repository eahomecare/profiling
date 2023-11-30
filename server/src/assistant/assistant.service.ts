import * as fs from 'fs';
import * as path from 'path';
import {
  Injectable,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class QueryService
  implements OnModuleInit
{
  private openai: OpenAI;
  private assistantId: string;
  private readonly logger = new Logger(
    QueryService.name,
  );

  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.logger.log(
      'Initializing QueryService...',
    );
    const openAIKey = this.configService.get(
      'OPEN_AI_KEY',
    );
    this.openai = new OpenAI({
      apiKey: openAIKey,
    });
  }

  async handleQuery(
    query: string,
    threadId?: string,
  ): Promise<any> {
    this.logger.log(
      'Reading Prisma schema file...',
    );
    const schemaFilePath = path.resolve(
      __dirname,
      '../../prisma/schema.prisma',
    );

    if (fs.existsSync(schemaFilePath)) {
      const schemaFile = fs.readFileSync(
        schemaFilePath,
        'utf8',
      );
      fs.writeFileSync(
        'schema.prisma.txt',
        schemaFile,
      );

      this.logger.log(
        'Uploading schema file to OpenAI...',
      );
      const fileUploadResponse =
        await this.openai.files.create({
          file: fs.createReadStream(
            'schema.prisma.txt',
          ),
          purpose: 'assistants',
        });
      const fileId = fileUploadResponse.id;

      this.logger.log('Creating EA Assistant...');
      const assistantCreation =
        await this.openai.beta.assistants.create({
          name: 'EA Assistant',
          instructions: `You are an EA assistant and will accept queries about the project. Use getDbQuery function to get any information you may require in accordance with the prisma.schema.txt file uploaded. Go throught the uploaded file to understand the database structures and formulate the appropriate queries as required. Pass in the prisma query as a string (Only allow read operations) to fetch details from the database, you should pass "prisma.customer.count();" to the getDbQuery if user asks about how many customers are there as an example. The user will ask any query related to the db, find out the appropriate model in the schema and the appropriate fields to use based on the user's query even if it is not an exact match. Use the nearest matching field.`,
          model: 'gpt-4-1106-preview',
          file_ids: [fileId],
          tools: [
            {
              type: 'function',
              function: {
                name: 'getDbQuery',
                description:
                  'Get details from the mongo db.',
                parameters: {
                  type: 'object',
                  properties: {
                    prisma_query: {
                      type: 'string',
                      description:
                        'Prisma query. e.g. "prisma.customer.count()" to count number of customers',
                    },
                  },
                  required: ['prisma_query'],
                },
              },
            },
            { type: 'code_interpreter' },
          ],
        });
      this.assistantId = assistantCreation.id;
      this.logger.log(
        `Assistant created with ID: ${this.assistantId}`,
      );
    } else {
      this.logger.error(
        `Prisma schema file not found at path: ${schemaFilePath}`,
      );
    }

    this.logger.log(`Handling query: ${query}`);
    let threadUsed;

    if (threadId) {
      threadUsed = threadId;
      await this.sendMessageToThread(
        threadUsed,
        query,
      );
    } else {
      threadUsed = await this.createThread();
      await this.sendMessageToThread(
        threadUsed,
        query,
      );
    }

    const run = await this.createRun(threadUsed);
    return this.waitForCompletion(
      threadUsed,
      run.id,
    );
  }

  private async getDbQuery(prisma_query: string) {
    this.logger.log(
      `Executing query: ${prisma_query}`,
    );
    try {
      // Creating an async function dynamically
      const asyncFunction = new Function(
        'prisma',
        `return (async () => { return await ${prisma_query}; })()`,
      );

      // Executing the async function with the prisma context
      const result = await asyncFunction(
        this.prisma,
      );
      this.logger.log(
        `Query result: ${JSON.stringify(result)}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error executing query: ${error}`,
      );
      return error;
    }
  }

  private async createThread(): Promise<string> {
    const thread =
      await this.openai.beta.threads.create({
        messages: [
          {
            role: 'user',
            content:
              "Welcome to EA's customer profiler. How may I help you today?",
          },
        ],
      });
    return thread.id;
  }

  private async sendMessageToThread(
    threadId: string,
    query: string,
  ): Promise<void> {
    await this.openai.beta.threads.messages.create(
      threadId,
      {
        role: 'user',
        content: query,
      },
    );
    this.logger.log(
      `Message created with query ${query} and role 'user'`,
    );
  }

  private async createRun(
    threadId: string,
  ): Promise<any> {
    const run =
      await this.openai.beta.threads.runs.create(
        threadId,
        {
          assistant_id: this.assistantId,
          instructions:
            'Use getDbQuery function to query the database with a prisma string. Use the uploaded prisma.schema.txt file for the database schema. Use the appropriate mode and fields based on the query. The exact field name to serach can be verified from the uploaded prisma.schema.txt file. Verify that the schema has the fields being queried before executing the getDbQuery function.',
          // tools: [{ type: 'code_interpreter' }],
        },
      );
    this.logger.log(`Run created ${run}`);
    console.dir(run);
    return run;
  }

  private async handleRequiresAction(
    threadId,
    runId,
  ) {
    const runStatus =
      await this.openai.beta.threads.runs.retrieve(
        threadId,
        runId,
      );
    if (runStatus.status === 'requires_action') {
      const requiredActions =
        runStatus.required_action
          .submit_tool_outputs.tool_calls;
      const toolsOutput = [];

      for (const action of requiredActions) {
        if (
          action.function.name === 'getDbQuery'
        ) {
          const functionArguments = JSON.parse(
            action.function.arguments,
          );
          const output = await this.getDbQuery(
            functionArguments.prisma_query,
          );
          toolsOutput.push({
            tool_call_id: action.id,
            output: JSON.stringify(output),
          });
        }
      }

      // Submit tool outputs
      await this.openai.beta.threads.runs.submitToolOutputs(
        threadId,
        runId,
        { tool_outputs: toolsOutput },
      );
    }
  }

  private async waitForCompletion(
    threadId: string,
    runId: string,
  ): Promise<any> {
    let runStatus;
    do {
      runStatus =
        await this.openai.beta.threads.runs.retrieve(
          threadId,
          runId,
        );
      await new Promise((resolve) =>
        setTimeout(resolve, 10000),
      ); // Wait for 10 seconds before checking again

      this.logger.log(`Run Status`);
      console.log(runStatus);
      if (
        runStatus.status === 'requires_action'
      ) {
        await this.handleRequiresAction(
          threadId,
          runId,
        );
      }

      if (runStatus.status === 'failed') {
        return { status: 'failed' };
      }
    } while (runStatus.status !== 'completed');

    return this.printMessages(threadId);
  }

  private async printMessages(
    threadId: string,
  ): Promise<string[]> {
    const messages =
      await this.openai.beta.threads.messages.list(
        threadId,
      );
    return messages.data.map((msg) => {
      const role = msg.role;
      let content = '';

      // Check if the content is of type MessageContentText
      if ('text' in msg.content[0]) {
        content = msg.content[0].text.value;
        this.logger.log(
          `${
            role.charAt(0).toUpperCase() +
            role.slice(1)
          }: ${content}`,
        );
      } else {
        // Handle other types like MessageContentImageFile
        // For example, you might log a different message or handle image/file content
        this.logger.log(
          `${
            role.charAt(0).toUpperCase() +
            role.slice(1)
          }: [Non-text content]`,
        );
      }

      return content;
    });
  }
}
