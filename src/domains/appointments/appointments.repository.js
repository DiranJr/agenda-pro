const { prisma } = require('@/lib/prisma');
const { DateTime } = require('luxon');

class AppointmentsRepository {
    constructor(tenantId) {
        if (!tenantId) throw new Error('Tenant ID is mandatory for AppointmentsRepository');
        this.tenantId = tenantId;
    }

    /**
     * Listar agendamentos de um dia específico, opcionalmente filtrado por profissional.
     */
    async getByDay(dateStr, staffId = null) {
        const startOfDay = DateTime.fromISO(dateStr).startOf('day').toJSDate();
        const endOfDay = DateTime.fromISO(dateStr).endOf('day').toJSDate();

        return prisma.appointment.findMany({
            where: {
                tenantId: this.tenantId,
                ...(staffId && { staffId }),
                startTime: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                customer: true,
                service: true,
                staff: true,
            },
            orderBy: {
                startTime: 'asc',
            },
        });
    }

    async getById(id) {
        return prisma.appointment.findFirst({
            where: { id, tenantId: this.tenantId },
            include: { customer: true, service: true, staff: true }
        });
    }

    /**
     * Verifica se há conflito de horário para um profissional.
     * Considera o tempo do agendamento + buffers do serviço selecionado.
     */
    async hasConflict(staffId, startTime, endTime, excludeAppointmentId = null) {
        const conflicts = await prisma.appointment.findMany({
            where: {
                tenantId: this.tenantId,
                staffId: staffId,
                id: excludeAppointmentId ? { not: excludeAppointmentId } : undefined,
                status: { not: 'CANCELED' },
                OR: [
                    {
                        // Caso 1: O novo agendamento começa durante um agendamento existente
                        startTime: { lt: endTime },
                        endTime: { gt: startTime },
                    }
                ],
            },
        });

        // Também verificar blocos de agenda
        const blocks = await prisma.block.findMany({
            where: {
                tenantId: this.tenantId,
                staffId: staffId,
                startTime: { lt: endTime },
                endTime: { gt: startTime },
            }
        });

        return conflicts.length > 0 || blocks.length > 0;
    }

    async create(data) {
        return prisma.appointment.create({
            data: { ...data, tenantId: this.tenantId }
        });
    }

    async updateStatus(id, status) {
        return prisma.appointment.updateMany({
            where: { id, tenantId: this.tenantId },
            data: { status }
        });
    }
}

module.exports = { AppointmentsRepository };
