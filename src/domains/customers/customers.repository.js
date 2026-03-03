const { prisma } = require('@/lib/prisma');

class CustomersRepository {
    constructor(tenantId) {
        if (!tenantId) throw new Error('Tenant ID is mandatory for CustomersRepository');
        this.tenantId = tenantId;
    }

    async getAll() {
        return prisma.customer.findMany({
            where: { tenantId: this.tenantId },
            orderBy: { name: 'asc' }
        });
    }

    async getById(id) {
        return prisma.customer.findFirst({
            where: { id, tenantId: this.tenantId }
        });
    }

    async create(data) {
        return prisma.customer.create({
            data: { ...data, tenantId: this.tenantId }
        });
    }

    async update(id, data) {
        return prisma.customer.updateMany({
            where: { id, tenantId: this.tenantId },
            data
        });
    }

    async delete(id) {
        return prisma.customer.deleteMany({
            where: { id, tenantId: this.tenantId }
        });
    }
}

module.exports = { CustomersRepository };
