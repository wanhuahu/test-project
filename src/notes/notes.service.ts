import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateNoteDto } from './dto/create-note.dto';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './schemas/note.schema';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(createNoteDto: CreateNoteDto){
    const createdNote = new this.noteModel(createNoteDto);
    return createdNote.save();
  }

  async findAll() {
    return this.noteModel.find();
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const noteExists = await this.noteModel.exists({ _id: id });
    if (!noteExists) {
      throw new HttpException('Note not found', 404);
    }
    
    const updatedNote = await this.noteModel.findByIdAndUpdate(
      id,
      updateNoteDto,
      { new: true },
    );
    return updatedNote;
  }

  async delete(id: string) {
    const noteExists = await this.noteModel.exists({ _id: id });
    if (!noteExists) {
      throw new HttpException('Note not found', 404);
    }

    return this.noteModel.deleteOne({ _id: id });
  }
}
