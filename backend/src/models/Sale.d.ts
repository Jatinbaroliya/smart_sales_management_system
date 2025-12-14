import { type Document, type Model } from 'mongoose';
import type { SaleRecord } from './SaleRecord.ts';
export interface ISale extends SaleRecord, Document {
}
export declare const Sale: Model<ISale>;
//# sourceMappingURL=Sale.d.ts.map