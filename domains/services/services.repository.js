import { prisma } from '@/lib/prisma';

export class ServicesRepository {
    constructor(tenantId) {
        if (!tenantId) throw new Error('Tenant ID is mandatory for ServicesRepository');
        this.tenantId = tenantId;
    }

    async getAll() {
        return prisma.service.findMany({
            where: { tenantId: this.tenantId },
            orderBy: { name: 'asc' }
        });
    }

    async getById(id) {
        return prisma.service.findFirst({
            where: { id, tenantId: this.tenantId }
        });
    }

    async create(data) {
        return prisma.service.create({
            data: { ...data, tenantId: this.tenantId }
        });
    }

    async update(id, data) {
        return prisma.service.updateMany({
            where: { id, tenantId: this.tenantId },
            data
        });
    }

    async delete(id) {
        return prisma.service.deleteMany({
            where: { id, tenantId: this.tenantId }
        });
    }
}
