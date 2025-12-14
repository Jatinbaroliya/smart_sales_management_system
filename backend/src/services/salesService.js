import { SortField } from '../models/SortOptions.js';
import { Sale } from '../models/Sale.js';
// Avoid importing `FilterQuery` directly from mongoose to keep types compatible across versions
export class SalesService {
    async getSales(query) {
        // Build MongoDB filter query
        const filterQuery = this.buildFilterQuery(query);
        // Build sort object
        const sortObject = this.buildSortObject(query.field);
        // Calculate pagination
        const page = Math.max(1, query.page);
        const pageSize = Math.max(1, query.pageSize);
        const skip = (page - 1) * pageSize;
        // Execute queries in parallel for better performance
        const [data, totalCount] = await Promise.all([
            Sale.find(filterQuery)
                .sort(sortObject)
                .skip(skip)
                .limit(pageSize)
                .lean()
                .exec(),
            Sale.countDocuments(filterQuery).exec(),
        ]);
        console.log(`📊 Query returned ${data.length} documents out of ${totalCount} total`);
        if (data.length > 0) {
            console.log('📄 Sample document:', JSON.stringify(data[0], null, 2));
        }
        const totalPages = Math.ceil(totalCount / pageSize);
        const currentPage = Math.min(page, totalPages || 1);
        // Convert MongoDB documents to SaleRecord format
        // .lean() returns plain objects, so we need to handle them as plain objects
        const saleRecords = data.map((doc) => this.convertToSaleRecord(doc));
        return {
            data: saleRecords,
            totalPages: totalPages || 1,
            currentPage,
        };
    }
    buildFilterQuery(query) {
        const filter = {};
        const andConditions = [];
        // Search filter (customer name or phone number) - using MongoDB field names
        if (query.search) {
            andConditions.push({
                $or: [
                    { 'Customer Name': { $regex: query.search, $options: 'i' } },
                    { 'Phone Number': { $regex: query.search, $options: 'i' } },
                ],
            });
        }
        // Apply filters - using MongoDB field names with spaces
        if (query.filters) {
            const filters = query.filters;
            // Region filter
            if (filters.region && filters.region.length > 0) {
                filter['Customer Region'] = { $in: filters.region };
            }
            // Gender filter
            if (filters.gender && filters.gender.length > 0) {
                filter['Gender'] = { $in: filters.gender };
            }
            // Age range filter
            if (filters.ageRange) {
                const ageFilter = {};
                if (filters.ageRange.min !== undefined) {
                    ageFilter.$gte = filters.ageRange.min;
                }
                if (filters.ageRange.max !== undefined) {
                    ageFilter.$lte = filters.ageRange.max;
                }
                if (Object.keys(ageFilter).length > 0) {
                    filter['Age'] = ageFilter;
                }
            }
            // Category filter
            if (filters.category && filters.category.length > 0) {
                filter['Product Category'] = { $in: filters.category };
            }
            // Tags filter
            if (filters.tags && filters.tags.length > 0) {
                const tagFilters = filters.tags.map((tag) => ({
                    'Tags': { $regex: tag, $options: 'i' },
                }));
                andConditions.push({ $or: tagFilters });
            }
            // Payment method filter
            if (filters.paymentMethod && filters.paymentMethod.length > 0) {
                filter['Payment Method'] = { $in: filters.paymentMethod };
            }
            // Date range filter
            if (filters.dateRange) {
                const dateFilter = {};
                if (filters.dateRange.start) {
                    dateFilter.$gte = filters.dateRange.start;
                }
                if (filters.dateRange.end) {
                    dateFilter.$lte = filters.dateRange.end;
                }
                if (Object.keys(dateFilter).length > 0) {
                    filter['Date'] = dateFilter;
                }
            }
        }
        // Combine $and conditions if any
        if (andConditions.length > 0) {
            filter.$and = andConditions;
        }
        return filter;
    }
    buildSortObject(sortField) {
        switch (sortField) {
            case SortField.DATE_DESC:
                return { 'Date': -1 };
            case SortField.QUANTITY:
                return { 'Quantity': -1 };
            case SortField.CUSTOMER_NAME_ASC:
                return { 'Customer Name': 1 };
            default:
                return { 'Date': -1 };
        }
    }
    convertToSaleRecord(doc) {
        // Map MongoDB field names (with spaces) to camelCase SaleRecord format
        // Handle both the actual MongoDB field names and potential camelCase versions
        const getField = (fieldName, camelCase, defaultValue = '') => {
            return doc[fieldName] ?? doc[camelCase] ?? defaultValue;
        };
        const getNumberField = (fieldName, camelCase, defaultValue = 0) => {
            const value = doc[fieldName] ?? doc[camelCase];
            return value !== undefined && value !== null ? Number(value) : defaultValue;
        };
        // Convert Date to ISO string if it's a Date object
        const dateValue = doc['Date'] ?? doc.date;
        const dateString = dateValue instanceof Date
            ? dateValue.toISOString().split('T')[0]
            : (dateValue ?? '');
        return {
            transactionId: getNumberField('Transaction ID', 'transactionId', 0),
            date: dateString,
            customerId: getField('Customer ID', 'customerId', ''),
            customerName: getField('Customer Name', 'customerName', ''),
            phoneNumber: String(getField('Phone Number', 'phoneNumber', '')),
            gender: getField('Gender', 'gender', ''),
            age: getNumberField('Age', 'age', 0),
            customerRegion: getField('Customer Region', 'customerRegion', ''),
            customerType: getField('Customer Type', 'customerType', ''),
            productId: getField('Product ID', 'productId', ''),
            productName: getField('Product Name', 'productName', ''),
            brand: getField('Brand', 'brand', ''),
            productCategory: getField('Product Category', 'productCategory', ''),
            tags: getField('Tags', 'tags', ''),
            quantity: getNumberField('Quantity', 'quantity', 0),
            pricePerUnit: getNumberField('Price per Unit', 'pricePerUnit', 0),
            discountPercentage: getNumberField('Discount Percentage', 'discountPercentage', 0),
            totalAmount: getNumberField('Total Amount', 'totalAmount', 0),
            finalAmount: getNumberField('Final Amount', 'finalAmount', 0),
            paymentMethod: getField('Payment Method', 'paymentMethod', ''),
            orderStatus: getField('Order Status', 'orderStatus', ''),
            deliveryType: getField('Delivery Type', 'deliveryType', ''),
            storeId: getField('Store ID', 'storeId', ''),
            storeLocation: getField('Store Location', 'storeLocation', ''),
            salespersonId: getField('Salesperson ID', 'salespersonId', ''),
            employeeName: getField('Employee Name', 'employeeName', ''),
        };
    }
    // Helper methods to get unique values for filters - using MongoDB field names
    async getUniqueRegions() {
        const regions = (await Sale.distinct('Customer Region').exec());
        return regions.sort();
    }
    async getUniqueGenders() {
        const genders = (await Sale.distinct('Gender').exec());
        return genders.sort();
    }
    async getUniqueCategories() {
        const categories = (await Sale.distinct('Product Category').exec());
        return categories.sort();
    }
    async getUniquePaymentMethods() {
        const methods = (await Sale.distinct('Payment Method').exec());
        return methods.sort();
    }
    async getUniqueTags() {
        const allTags = (await Sale.distinct('Tags').exec());
        const uniqueTags = new Set();
        allTags.forEach((tagString) => {
            if (tagString) {
                tagString
                    .split(',')
                    .map((tag) => tag.trim())
                    .forEach((tag) => {
                    if (tag)
                        uniqueTags.add(tag);
                });
            }
        });
        return Array.from(uniqueTags).sort();
    }
    async getAgeRange() {
        const result = await Sale.aggregate([
            {
                $group: {
                    _id: null,
                    min: { $min: '$Age' },
                    max: { $max: '$Age' },
                },
            },
        ]).exec();
        if (result.length === 0 || result[0].min === null) {
            return { min: 0, max: 0 };
        }
        return {
            min: result[0].min,
            max: result[0].max,
        };
    }
    async getDateRange() {
        const result = await Sale.aggregate([
            {
                $group: {
                    _id: null,
                    min: { $min: '$Date' },
                    max: { $max: '$Date' },
                },
            },
        ]).exec();
        if (result.length === 0 || !result[0].min) {
            return { start: '', end: '' };
        }
        // Convert Date objects to ISO strings
        const start = result[0].min instanceof Date
            ? result[0].min.toISOString().split('T')[0]
            : (result[0].min || '');
        const end = result[0].max instanceof Date
            ? result[0].max.toISOString().split('T')[0]
            : (result[0].max || '');
        return { start, end };
    }
}
//# sourceMappingURL=salesService.js.map