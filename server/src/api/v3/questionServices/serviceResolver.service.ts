import {
  Injectable,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import homecareServiceDump from './serviceMappings/homecareServiceDump';
import { ServiceObject } from './interfaces/serviceObject.interface';

@Injectable()
export class ServiceResolverService
  implements OnModuleInit
{
  private readonly logger = new Logger(
    ServiceResolverService.name,
  );
  private vectorStore: HNSWLib;

  constructor(
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const openAIKey = this.configService.get(
      'OPEN_AI_KEY',
    );
    const openAIEmbeddings = new OpenAIEmbeddings(
      { openAIApiKey: openAIKey },
    );

    const documents = homecareServiceDump.flatMap(
      (service) => {
        const serviceContent = [
          service.serviceTitle,
          service.serviceDescription,
        ]
          .filter(Boolean)
          .join(' ');

        return [
          {
            id: service.serviceId.toString(),
            pageContent: serviceContent,
            metadata: {
              serviceId: service.serviceId,
              subServiceId: null,
            },
          },
          ...service.subServices.map(
            (subService) => {
              const subServiceContent =
                subService.description.toString();

              return {
                id: `${service.serviceId}-${subService.id}`,
                pageContent: subServiceContent,
                metadata: {
                  serviceId: service.serviceId,
                  subServiceId: subService.id,
                },
              };
            },
          ),
        ];
      },
    );

    this.vectorStore =
      await HNSWLib.fromDocuments(
        documents,
        openAIEmbeddings,
      );
  }

  async resolveService(
    serviceDetails: Record<string, any>,
  ): Promise<ServiceObject> {
    this.logger.log(
      `Service Details: ${serviceDetails}`,
    );
    const searchValues: string[] = [];
    for (const value of Object.values(
      serviceDetails,
    )) {
      if (typeof value === 'string') {
        searchValues.push(value);
      }
    }
    const searchQuery = searchValues.join(' ');
    const result =
      await this.vectorStore.similaritySearch(
        searchQuery,
        1,
      );
    this.logger.log(
      `Result From searchQuery ${searchQuery} : ${result}`,
    );
    if (result && result.length > 0) {
      const serviceId =
        result[0].metadata.serviceId.toString();
      const subServiceId =
        result[0].metadata.subServiceId?.toString();
      const service = homecareServiceDump.find(
        (s) =>
          s.serviceId.toString() === serviceId,
      );
      this.logger.log(
        `Service Picked: ${service}`,
      );
      if (service) {
        const serviceObject: ServiceObject = {
          serviceTitle: service.serviceTitle,
          serviceDescription:
            service.serviceDescription,
        };
        if (subServiceId) {
          const subService =
            service.subServices.find(
              (sub) =>
                sub.id.toString() ===
                subServiceId,
            );
          if (subService) {
            serviceObject.serviceDescription += ` ${subService.description}`;
          }
        }
        this.logger.log(
          `Final service Object created: ${serviceObject}`,
        );
        return serviceObject;
      }
    }
    this.logger.log(
      `Returned blank service for :${serviceDetails}`,
    );
    return {
      serviceTitle: '',
      serviceDescription: '',
    };
  }
}
