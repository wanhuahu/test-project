import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { NotesModule } from '../src/notes/notes.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from '../src/notes/schemas/note.schema';

describe('NotesController (e2e)', () => {
  let app: INestApplication;
  let noteModel: Model<NoteDocument>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        NotesModule,
        MongooseModule.forRoot('mongodb://localhost:27017/test'), // Use test DB
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    noteModel = moduleFixture.get<Model<NoteDocument>>('NoteModel');
    
    // Seed the database with test data
    await noteModel.deleteMany({}); // Clear existing data
    await noteModel.create([
      {
        _id: '67ddb050ef4b6192d23242c8',
        title: 't1',
        content: 'c1',
        createdAt: new Date('2025-03-21T18:30:40.673Z'),
      },
    ]);
  });

  afterAll(async () => {
    await noteModel.deleteMany({}); // Clean up
    await app.close();
  });

  describe('GET /notes', () => {
    it('should return all notes', async () => {
      const response = await request(app.getHttpServer())
        .get('/notes')
        .expect(200);

      expect(response.body).toEqual([
        {
          _id: '67ddb050ef4b6192d23242c8',
          title: 't1',
          content: 'c1',
          createdAt: '2025-03-21T18:30:40.673Z',
          __v: 0,
        },
      ]);
    });

    it('should return notes in JSON format', async () => {
      await request(app.getHttpServer())
        .get('/notes')
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });
});