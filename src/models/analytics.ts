import mongoose, { Document, Schema } from 'mongoose';

interface IAnalytics extends Document {
  date: Date;
  uniqueVisitorsCount: number;
  visitorIds: string[];
}

const analyticsSchema: Schema = new Schema({
  date: {
    type: Date,
    unique: true,
    required: true
  },
  uniqueVisitorsCount: {
    type: Number,
    required: true,
    default: 0
  },
  visitorIds: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

const Analytics = mongoose.model<IAnalytics>('Analytics', analyticsSchema);

export default Analytics;
