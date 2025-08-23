import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocumentDocument = DocumentEntity & Document;

@Schema({ timestamps: true })
export class DocumentEntity {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  projectId: number;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentEntity);

DocumentSchema.index({ title: 'text', content: 'text', tags: 'text' });
DocumentSchema.index({ projectId: 1 });
DocumentSchema.index({ tags: 1 });
