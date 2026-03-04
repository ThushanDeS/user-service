// In-memory LoyaltyTransaction mock to avoid requiring a MongoDB connection during development
const transactions = [];

class LoyaltyTransaction {
    constructor(data = {}) {
        this.transactionId = data.transactionId || `LTX${Date.now().toString()}${Math.random().toString(36).substring(2,8).toUpperCase()}`;
        this.userId = data.userId;
        this.bookingReference = data.bookingReference || null;
        this.points = data.points || 0;
        this.type = data.type || 'earn';
        this.description = data.description || '';
        this.balance = data.balance || 0;
        this.metadata = data.metadata || null;
        this.createdAt = data.createdAt || new Date();
    }

    async save() {
        transactions.push({
            transactionId: this.transactionId,
            userId: this.userId,
            bookingReference: this.bookingReference,
            points: this.points,
            type: this.type,
            description: this.description,
            balance: this.balance,
            metadata: this.metadata,
            createdAt: this.createdAt
        });
        return this;
    }

    // mimic Mongoose's find(...).sort(...).limit(...)
    static find(query = {}) {
        let results = transactions.filter((t) => {
            if (query.userId && t.userId !== query.userId) return false;
            return true;
        });

        return {
            sort(sortObj) {
                if (sortObj && sortObj.createdAt === -1) {
                    results = results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }
                return this;
            },
            limit(n) {
                results = results.slice(0, n);
                return Promise.resolve(results);
            }
        };
    }

    // for debugging
    static __all() {
        return transactions;
    }
}

module.exports = LoyaltyTransaction;