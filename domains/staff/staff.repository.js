import { prisma } from '@/lib/prisma';

export class StaffRepository {
    constructor(tenantId) {
        if (!tenantId) throw new Error('Tenant ID is mandatory for StaffRepository');
        this.tenantId = tenantId;
    }

    async getAll() {
        return prisma.staff.findMany({
            where: { tenantId: this.tenantId },
            include: { services: true, location: true },
            orderBy: { name: 'asc' }
        });
    }

    async getById(id) {
        return prisma.staff.findFirst({
            where: { id, tenantId: this.tenantId },
            include: { services: { include: { service: true } } }
        });
    }

    async create(data) {
        return prisma.staff.create({
            data: { ...data, tenantId: this.tenantId }
        });
    }

    async update(id, data) {
        return prisma.staff.updateMany({
            where: { id, tenantId: this.tenantId },
            data
        });
    }

    async delete(id) {
        return prisma.staff.deleteMany({
            where: { id, tenantId: this.tenantId }
        });
    }

    async setServices(staffId, serviceIds) {
        // Simple wipe and recreate for this MVP
        await prisma.staffService.deleteMany({
            where: { staffId }
        });

        if (serviceIds?.length) {
            return prisma.staffService.createMany({
                data: serviceIds.map(serviceId => ({
                    staffId,
                    serviceId
                }))
            });
        }
    }
}
