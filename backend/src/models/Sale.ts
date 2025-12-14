import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { SaleRecord } from './SaleRecord.js';

export interface ISale extends SaleRecord, Document {}

// Define schema with MongoDB field names (with spaces)
// Using Record type to allow field names with spaces
const SaleSchemaDefinition: Record<string, any> = {
  'Transaction ID': { type: Number, required: true, index: true },
  'Date': { type: Date, required: true, index: true },
  'Customer ID': { type: String, required: true },
  'Customer Name': { type: String, required: true, index: true },
  'Phone Number': { type: String, required: true, index: true },
  'Gender': { type: String, required: true, index: true },
  'Age': { type: Number, required: true, index: true },
  'Customer Region': { type: String, required: true, index: true },
  'Customer Type': { type: String, required: true },
  'Product ID': { type: String, required: true },
  'Product Name': { type: String, required: true },
  'Brand': { type: String, required: true },
  'Product Category': { type: String, required: true, index: true },
  'Tags': { type: String, required: true },
  'Quantity': { type: Number, required: true, index: true },
  'Price per Unit': { type: Number, required: true },
  'Discount Percentage': { type: Number, required: true },
  'Total Amount': { type: Number, required: true },
  'Final Amount': { type: Number, required: true },
  'Payment Method': { type: String, required: true, index: true },
  'Order Status': { type: String, required: true },
  'Delivery Type': { type: String, required: true },
  'Store ID': { type: String, required: true },
  'Store Location': { type: String, required: true },
  'Salesperson ID': { type: String, required: true },
  'Employee Name': { type: String, required: true },
};

const SaleSchema: Schema = new Schema<ISale>(
  SaleSchemaDefinition,
  {
    collection: 'sales',
    timestamps: false,
    // Don't enforce strict mode to allow field name mapping
    strict: false,
  }
);

// Create indexes for better query performance - using MongoDB field names
SaleSchema.index({ 'Customer Name': 'text', 'Phone Number': 'text' });
SaleSchema.index({ 'Date': -1 });
SaleSchema.index({ 'Quantity': -1 });

export const Sale: Model<ISale> =
  mongoose.models.Sale || mongoose.model<ISale>('Sale', SaleSchema);

