import { prisma } from '@/lib/prisma';
import { DateTime } from 'luxon';

export class AvailabilityRepository {
    constructor(tenantId) {
        if (!tenantId) throw new Error('Tenant ID is mandatory for AvailabilityRepository');
        this.tenantId = tenantId;
    }

    /**
     * Calcula horários disponíveis para um profissional em um dia específico,
     * considerando duração do serviço, buffers e agendamentos existentes.
     */
    async getAvailableSlots({ staffId, serviceId, date, timezone }) {
        const service = await prisma.service.findFirst({
            where: { id: serviceId, tenantId: this.tenantId }
        });

        if (!service) return [];

        const appointments = await prisma.appointment.findMany({
            where: {
                staffId,
                tenantId: this.tenantId,
                status: { not: 'CANCELED' },
                startTime: {
                    gte: DateTime.fromISO(date, { zone: timezone }).startOf('day').toJSDate(),
                    lte: DateTime.fromISO(date, { zone: timezone }).endOf('day').toJSDate(),
                }
            },
            include: { service: true }
        });

        const blocks = await prisma.block.findMany({
            where: {
                staffId,
                tenantId: this.tenantId,
                startTime: {
                    gte: DateTime.fromISO(date, { zone: timezone }).startOf('day').toJSDate(),
                    lte: DateTime.fromISO(date, { zone: timezone }).endOf('day').toJSDate(),
                }
            }
        });

        // Horário de trabalho fictício (09:00 às 18:00)
        let current = DateTime.fromISO(date, { zone: timezone }).set({ hour: 9, minute: 0 });
        const endOfDay = DateTime.fromISO(date, { zone: timezone }).set({ hour: 18, minute: 0 });

        const slots = [];
        const serviceDuration = service.duration;
        const bufferBefore = service.bufferBefore;
        const bufferAfter = service.bufferAfter;

        while (current.plus({ minutes: serviceDuration }) <= endOfDay) {
            const slotStart = current;
            const slotEnd = current.plus({ minutes: serviceDuration });

            // Ocupação real do slot considera buffers
            const occupiedStart = slotStart.minus({ minutes: bufferBefore });
            const occupiedEnd = slotEnd.plus({ minutes: bufferAfter });

            const hasConflict = [...appointments, ...blocks].some(item => {
                const itemStart = DateTime.fromJSDate(item.startTime);
                const itemEnd = DateTime.fromJSDate(item.endTime);

                const itemBufferBefore = item.service?.bufferBefore || 0;
                const itemBufferAfter = item.service?.bufferAfter || 0;

                const itemOccupiedStart = itemStart.minus({ minutes: itemBufferBefore });
                const itemOccupiedEnd = itemEnd.plus({ minutes: itemBufferAfter });

                return occupiedStart < itemOccupiedEnd && occupiedEnd > itemOccupiedStart;
            });

            if (!hasConflict) {
                slots.push(slotStart.toISOTime({ suppressSeconds: true }));
            }

            // Próximo slot possível
            current = current.plus({ minutes: 30 });
        }

        return slots;
    }
}
