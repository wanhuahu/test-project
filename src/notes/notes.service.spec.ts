import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Query, Document } from 'mongoose';
import { NotesService } from './notes.service';
import { Note } from './schemas/note.schema';

// Create a complete mock Query object
const createMockQuery = <T>(result: T): Query<T, T, {}, Document<T>> => {
  const query = new Query<T, T, {}, Document<T>>();
  return Object.assign(query, {
    exec: jest.fn().mockResolvedValue(result),
    lean: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    // Add other query methods you use
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
  }) as unknown as Query<T, T, {}, Document<T>>;
};

describe('NotesService', () => {
  let service: NotesService;
  let model: Model<Note>;

  const mockNote = {
    _id: '65c6f28a1b3f8f02e4a3b4e0',
    title: 'Test Note',
    content: 'Test Content',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getModelToken(Note.name),
          useValue: {
            find: jest.fn(() => createMockQuery([mockNote])),
            findById: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    model = module.get<Model<Note>>(getModelToken(Note.name));
  });

  describe('findAll', () => {
    it('should return an array of notes', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockNote]);
      expect(model.find).toHaveBeenCalled();
    });

    it('should return empty array when no notes exist', async () => {
      const emptyQuery = createMockQuery<Note[]>([]);
      jest.spyOn(model, 'find').mockReturnValueOnce(emptyQuery);

      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });
});