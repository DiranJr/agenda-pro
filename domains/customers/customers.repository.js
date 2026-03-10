import { prisma } from '@/lib/prisma';

function parseTags(value) {
    if (!value) return [];
    return String(value)
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
}

function serializeTags(value) {
    if (Array.isArray(value)) {
        return value.map((tag) => String(tag).trim()).filter(Boolean).join(',');
    }
    if (typeof value === 'string') {
        return value;
    }
    return '';
}

function normalizeCustomer(customer) {
    if (!customer) return customer;
    return { ...customer, tags: parseTags(customer.tags) };
}

export class CustomersRepository {
    constructor(tenantId) {
        if (!tenantId) throw new Error('Tenant ID is mandatory for CustomersRepository');
        this.tenantId = tenantId;
    }

    async getAll() {
        const customers = await prisma.customer.findMany({
            where: { tenantId: this.tenantId },
            orderBy: { name: 'asc' }
        });
        return customers.map(normalizeCustomer);
    }

    async getAllWithStats() {
        const customers = await prisma.customer.findMany({
            where: { tenantId: this.tenantId },
            include: {
                appointments: {
                    where: { status: { in: ['CONFIRMED', 'DONE'] } },
                    orderBy: { startTime: 'desc' },
                    take: 1
                }
            },
            orderBy: { name: 'asc' }
        });
        return customers.map(c => {
            const normalized = normalizeCustomer(c);
            normalized.lastVisit = c.appointments?.[0]?.startTime || null;
            delete normalized.appointments; // Limpa para não inflar o payload
            return normalized;
        });
    }

    async search(query) {
        const customers = await prisma.customer.findMany({
            where: {
                tenantId: this.tenantId,
                OR: [
                    { name: { contains: query } },
                    { phone: { contains: query } }
                ]
            },
            take: 10,
            orderBy: { name: 'asc' }
        });
        return customers.map(normalizeCustomer);
    }

    async getById(id) {
        const customer = await prisma.customer.findFirst({
            where: { id, tenantId: this.tenantId }
        });
        return normalizeCustomer(customer);
    }

    async create(data) {
        return prisma.customer.create({
            data: {
                ...data,
                tags: serializeTags(data.tags),
                tenantId: this.tenantId
            }
        });
    }

    async update(id, data) {
        return prisma.customer.updateMany({
            where: { id, tenantId: this.tenantId },
            data: {
                ...data,
                ...(Object.prototype.hasOwnProperty.call(data, 'tags') ? { tags: serializeTags(data.tags) } : {})
            }
        });
    }

    async delete(id) {
        return prisma.customer.deleteMany({
            where: { id, tenantId: this.tenantId }
        });
    }
}
