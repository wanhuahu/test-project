import { PartialType } from '@nestjs/mapped-types';

import { CreateNoteDto } from './create-note.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @IsNotEmpty()
  @IsString()
  title: string;

  content: string;
}