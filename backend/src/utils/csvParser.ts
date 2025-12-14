import * as path from 'path';
import { createReadStream } from 'fs';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import type { SaleRecord } from '../models/SaleRecord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadSalesData(): Promise<SaleRecord[]> {
  return new Promise((resolve, reject) => {
    // Use path relative to current file location
    const csvFilePath = path.join(__dirname, '../data/dataset.csv');
    const results: SaleRecord[] = [];

    createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row: Record<string, string>) => {
        try {
          const saleRecord: SaleRecord = {
            transactionId: parseInt(row['Transaction ID'] || '0', 10),
            date: row['Date'] || '',
            customerId: row['Customer ID'] || '',
            customerName: row['Customer Name'] || '',
            phoneNumber: row['Phone Number'] || '',
            gender: row['Gender'] || '',
            age: parseInt(row['Age'] || '0', 10),
            customerRegion: row['Customer Region'] || '',
            customerType: row['Customer Type'] || '',
            productId: row['Product ID'] || '',
            productName: row['Product Name'] || '',
            brand: row['Brand'] || '',
            productCategory: row['Product Category'] || '',
            tags: row['Tags'] || '',
            quantity: parseInt(row['Quantity'] || '0', 10),
            pricePerUnit: parseFloat(row['Price per Unit'] || '0'),
            discountPercentage: parseFloat(row['Discount Percentage'] || '0'),
            totalAmount: parseFloat(row['Total Amount'] || '0'),
            finalAmount: parseFloat(row['Final Amount'] || '0'),
            paymentMethod: row['Payment Method'] || '',
            orderStatus: row['Order Status'] || '',
            deliveryType: row['Delivery Type'] || '',
            storeId: row['Store ID'] || '',
            storeLocation: row['Store Location'] || '',
            salespersonId: row['Salesperson ID'] || '',
            employeeName: row['Employee Name'] || '',
          };

          // Only add valid records (with transaction ID)
          if (saleRecord.transactionId > 0) {
            results.push(saleRecord);
          }
        } catch (error) {
          // Skip invalid rows
          console.warn('Skipping invalid row:', error);
        }
      })
      .on('end', () => {
        console.log(`Loaded ${results.length} sales records from CSV`);
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

