import { Test, TestingModule } from '@nestjs/testing';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let searchService: SearchService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ElasticsearchModule.register({
          node: 'http://localhost:9200',
        }),
      ],
      providers: [SearchService],
    }).compile();

    searchService = module.get<SearchService>(SearchService);
  });

  it('should create a document', async () => {
    const index = 'test-index';
    const id = '1';
    const body = { message: 'Hello, world!' };

    const result: any = await searchService.create(index, id, body);

    console.log('Creating result====>')
    console.dir(result, { depth: null })
    expect(result).toBeDefined();
    expect(result.body).toBeDefined();
    expect(result.body.result).toEqual('created');
  });

  it('should search for a document', (done) => {
    const index = 'test-index';
    const query = 'Hello';

    setTimeout(async () => {
      const result: any = await searchService.search(index, query);

      expect(result).toBeDefined();
      console.log('Search result====>')
      console.dir(result, { depth: null })
      expect(result.body.hits.hits[0]._source.message).toEqual('Hello, world!');

      done();
    }, 9000);
  }, 10000);

  it('should get a document by ID', async () => {
    const index = 'test-index';
    const id = '1';

    const result: any = await searchService.getById(index, id);

    expect(result).toBeDefined();
    console.log('Get by ID result====>')
    console.dir(result, { depth: null })
    expect(result.body._source.message).toEqual('Hello, world!');
  });

  it('should update a document', async () => {
    const index = 'test-index';
    const id = '1';
    const body = { message: 'Updated message' };

    const result: any = await searchService.update(index, id, body);

    expect(result).toBeDefined();
    console.log('Update result====>')
    console.dir(result, { depth: null })
    expect(result.body.result).toEqual('updated');
  });

  it('should delete a document', async () => {
    const index = 'test-index';
    const id = '1';

    const result: any = await searchService.delete(index, id);

    expect(result).toBeDefined();
    console.log('Delete result===>')
    console.dir(result, { depth: null })
    expect(result.body.result).toEqual('deleted');

  });

  it('should check if an index exists', async () => {
    const index = 'test-index';

    const result: boolean = await searchService.checkIfIndexExists(index);

    expect(result).toBeDefined();
    expect(typeof result).toBe('boolean');
  });

  it('should create an autocomplete index', async () => {
    const index = 'test-autocomplete-index';

    const result: any = await searchService.createAutocompleteIndex(index);

    expect(result).toBeDefined();
    expect(result.body).toBeDefined();
    expect(result.body.acknowledged).toBe(true);
  });

  it('should insert data for autocomplete', async () => {
    const index = 'test-autocomplete-index';
    const id = 'e0d8ff-Insta';
    const label = 'Insta [Instagram]';

    const result: any = await searchService.insertData(index, id, label);

    expect(result).toBeDefined();
    expect(result.body).toBeDefined();
    expect(result.body.result).toEqual('created');
  });

  it('should insert multiple data entries for autocomplete', async () => {
    const index = 'test-autocomplete-index';
    const data = [
      { id: 'e0d8ff-Insta', label: 'Insta [Instagram]' },
      { id: 'z03jr3-Reel', label: 'Reels [Instagram]' },
      { id: 'a1b2c3-Face', label: 'Face [Facebook]' },
      { id: 'x5y6z7-Twit', label: 'Twit [Twitter]' },
    ];

    const result: any = await searchService.insertBulkData(index, data);

    expect(result).toBeDefined();
    expect(result.body).toBeDefined();
    expect(result.body.errors).toBe(false);
  });

  it('should get autocomplete suggestions', async () => {
    const index = 'test-autocomplete-index';
    const prefix = 'Ins';

    // Allow time for Elasticsearch to update its search indices
    await new Promise(resolve => setTimeout(resolve, 2000));

    const suggestions = await searchService.suggestLabels(index, prefix);

    expect(suggestions).toBeDefined();
    expect(Array.isArray(suggestions)).toBe(true);
    expect(suggestions[0]).toEqual({ value: 'e0d8ff-Insta', label: 'Insta [Instagram]' });
  });

  it('should delete the autocomplete index', async () => {
    const index = 'test-autocomplete-index';

    const result: any = await searchService.deleteIndex(index);

    expect(result).toBeDefined();
    expect(result.body).toBeDefined();
    expect(result.body.acknowledged).toBe(true);
  });
});