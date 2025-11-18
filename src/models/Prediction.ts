import mongoose, { Document, Schema } from 'mongoose';

export interface IPrediction extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  predictions: any[];
  rawOutput: any;
  confidence?: number;
  createdAt: Date;
}

const predictionSchema = new Schema<IPrediction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    predictions: {
      type: Schema.Types.Mixed,
      required: true,
      default: [],
    },
    rawOutput: {
      type: Schema.Types.Mixed,
      required: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
predictionSchema.index({ userId: 1, createdAt: -1 });

const Prediction = mongoose.model<IPrediction>('Prediction', predictionSchema);

export default Prediction;
