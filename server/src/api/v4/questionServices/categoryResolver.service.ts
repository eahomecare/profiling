import {
  Injectable,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

interface Category {
  [key: string]: string[];
}

@Injectable()
export class CategoryResolverService
  implements OnModuleInit
{
  private readonly logger = new Logger(
    CategoryResolverService.name,
  );
  private vectorStore: HNSWLib;
  private categories: Category[] = [
    {
      sports: [
        'sports',
        'play',
        'match',
        'tournament',
        'athlete',
        'soccer',
        'basketball',
        'baseball',
        'tennis',
        'golf',
        'hockey',
        'boxing',
        'cricket',
        'rugby',
        'volleyball',
        'swimming',
        'track',
        'field',
        'coach',
        'championship',
        'olympics',
        'marathon',
        'training',
        'workout',
        'gymnastics',
        'skating',
        'cycling',
        'wrestling',
        'fencing',
        'rowing',
      ],
    },
    {
      travel: [
        'travel',
        'flight',
        'airport',
        'tourism',
        'adventure',
        'itinerary',
        'hotel',
        'hostel',
        'backpacking',
        'cruise',
        'safari',
        'map',
        'destination',
        'luggage',
        'passport',
        'visa',
        'guidebook',
        'expedition',
        'journey',
        'voyage',
        'trek',
        'accommodation',
        'reservation',
        'tourist',
        'sightseeing',
        'vacation',
        'roadtrip',
        'globetrotter',
        'pilgrimage',
        'explorer',
      ],
    },
    {
      food: [
        'food',
        'cuisine',
        'recipe',
        'restaurant',
        'cooking',
        'baking',
        'grilling',
        'roasting',
        'frying',
        'sautéing',
        'marinating',
        'seasoning',
        'dessert',
        'appetizer',
        'entree',
        'vegan',
        'vegetarian',
        'gluten-free',
        'organic',
        'gourmet',
        'fast food',
        'snack',
        'meal prep',
        'dining',
        'brunch',
        'buffet',
        'culinary',
        'nutrition',
        'gastronomy',
        'pastry',
      ],
    },
    {
      technology: [
        'technology',
        'gadget',
        'software',
        'hardware',
        'programming',
        'AI',
        'robotics',
        'VR',
        'AR',
        'cybersecurity',
        'data',
        'analytics',
        'cloud computing',
        'blockchain',
        'internet',
        'mobile',
        'application',
        'network',
        'digital',
        'innovation',
        'automation',
        'machine learning',
        'electronics',
        'computing',
        'information',
        'tech',
        'user interface',
        'UX',
        'gaming',
        'virtual reality',
      ],
    },
    {
      music: [
        'music',
        'melody',
        'rhythm',
        'harmony',
        'genre',
        'lyrics',
        'concert',
        'album',
        'single',
        'record',
        'artist',
        'band',
        'orchestra',
        'instrumental',
        'vocal',
        'performance',
        'composer',
        'producer',
        'studio',
        'mixing',
        'soundtrack',
        'notation',
        'beat',
        'acoustic',
        'electronic',
        'hip hop',
        'jazz',
        'pop',
        'rock',
        'classical',
      ],
    },
    {
      automobile: [
        'automobile',
        'car',
        'engine',
        'sedan',
        'SUV',
        'truck',
        'coupe',
        'convertible',
        'hybrid',
        'electric',
        'manual',
        'automatic',
        'transmission',
        'wheel',
        'tire',
        'brake',
        'clutch',
        'gasoline',
        'diesel',
        'battery',
        'chassis',
        'exhaust',
        'bumper',
        'dashboard',
        'headlight',
        'taillight',
        'mechanic',
        'dealership',
        'road test',
        'traffic',
        'navigation',
      ],
    },
    {
      fitness: [
        'fitness',
        'exercise',
        'workout',
        'gym',
        'cardio',
        'strength',
        'training',
        'yoga',
        'pilates',
        'aerobics',
        'weightlifting',
        'bodybuilding',
        'running',
        'jogging',
        'cycling',
        'swimming',
        'sports',
        'diet',
        'nutrition',
        'coach',
        'personal trainer',
        'health',
        'wellness',
        'endurance',
        'flexibility',
        'muscle',
        'fat loss',
        'calisthenics',
        'bootcamp',
        'recovery',
      ],
    },
    {
      gadget: [
        'gadget',
        'device',
        'smartphone',
        'laptop',
        'tablet',
        'camera',
        'drone',
        'smartwatch',
        'headphones',
        'speaker',
        'charger',
        'adapter',
        'console',
        'VR headset',
        'fitness tracker',
        'e-reader',
        'microphone',
        'projector',
        'GPS',
        'wearable',
        'gaming',
        'technology',
        'innovation',
        'accessory',
        'tool',
        'gizmo',
        'app',
        'software',
        'hardware',
        'user interface',
      ],
    },
  ];

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

    const documents = this.categories.map(
      (category, index) => {
        const key = Object.keys(category)[0];
        return {
          id: index.toString(),
          pageContent: category[key].join(' '),
          metadata: { category: key },
        };
      },
    );

    this.vectorStore =
      await HNSWLib.fromDocuments(
        documents,
        openAIEmbeddings,
      );
  }

  async resolveCategory(
    serviceObject: Record<string, any>,
  ): Promise<string> {
    this.logger.log(
      `Service Object recieved: ${serviceObject}`,
    );
    const searchValues: string[] = [];

    for (const value of Object.values(
      serviceObject,
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
      `Result of simalarity search: ${result}`,
    );

    if (result && result.length > 0) {
      const categoryKey =
        result[0].metadata.category;
      this.logger.log(
        `Category Obtained: ${categoryKey}`,
      );
      return categoryKey;
    }

    this.logger.error(
      `No matching category for {serviceObject}`,
    );

    throw new Error(
      'No matching category found.',
    );
  }
}
