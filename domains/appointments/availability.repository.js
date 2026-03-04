import { prisma } from '@/lib/prisma';
import { DateTime } from 'luxon';

// Maps luxon weekday number to our schedule key
const WEEKDAY_MAP = { 7: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat' };

export class AvailabilityRepository {
    constructor(tenantId) {
        if (!tenantId) throw new Error('Tenant ID is mandatory for AvailabilityRepository');
        this.tenantId = tenantId;
    }

    /**
     * Calcula horários disponíveis para um profissional em um dia específico,
     * considerando grade de trabalho, pausas, buffers e agendamentos existentes.
     */
    async getAvailableSlots({ staffId, serviceId, date, timezone }) {
        const service = await prisma.service.findFirst({
            where: { id: serviceId, tenantId: this.tenantId }
        });

        if (!service) return [];

        const staff = await prisma.staff.findFirst({
            where: { id: staffId, tenantId: this.tenantId },
            select: { workSchedule: true }
        });

        const dt = DateTime.fromISO(date, { zone: timezone });
        const weekdayKey = WEEKDAY_MAP[dt.weekday];
        const schedule = staff?.workSchedule;
        const daySchedule = schedule?.[weekdayKey];

        // Se o profissional não trabalha neste dia, retorna vazio
        if (!daySchedule || !daySchedule.active) return [];

        const dayStart = daySchedule.start || '09:00';
        const dayEnd = daySchedule.end || '18:00';
        const breaks = daySchedule.breaks || [];

        const appointments = await prisma.appointment.findMany({
            where: {
                staffId,
                tenantId: this.tenantId,
                status: { not: 'CANCELED' },
                startTime: {
                    gte: dt.startOf('day').toJSDate(),
                    lte: dt.endOf('day').toJSDate(),
                }
            },
            include: { service: true }
        });

        const blocks = await prisma.block.findMany({
            where: {
                staffId,
                tenantId: this.tenantId,
                startTime: {
                    gte: dt.startOf('day').toJSDate(),
                    lte: dt.endOf('day').toJSDate(),
                }
            }
        });

        const [startH, startM] = dayStart.split(':').map(Number);
        const [endH, endM] = dayEnd.split(':').map(Number);

        let current = dt.set({ hour: startH, minute: startM, second: 0, millisecond: 0 });
        const endOfDay = dt.set({ hour: endH, minute: endM, second: 0, millisecond: 0 });

        const slots = [];
        const serviceDuration = service.duration;
        const bufferBefore = service.bufferBefore;
        const bufferAfter = service.bufferAfter;

        while (current.plus({ minutes: serviceDuration }) <= endOfDay) {
            const slotStart = current;
            const slotEnd = current.plus({ minutes: serviceDuration });
            const occupiedStart = slotStart.minus({ minutes: bufferBefore });
            const occupiedEnd = slotEnd.plus({ minutes: bufferAfter });

            // Checar conflito com agendamentos e blocos
            const hasConflict = [...appointments, ...blocks].some(item => {
                const itemStart = DateTime.fromJSDate(item.startTime);
                const itemEnd = DateTime.fromJSDate(item.endTime);
                const itemBufferBefore = item.service?.bufferBefore || 0;
                const itemBufferAfter = item.service?.bufferAfter || 0;
                const itemOccupiedStart = itemStart.minus({ minutes: itemBufferBefore });
                const itemOccupiedEnd = itemEnd.plus({ minutes: itemBufferAfter });
                return occupiedStart < itemOccupiedEnd && occupiedEnd > itemOccupiedStart;
            });

            // Checar se o slot conflita com alguma pausa
            const overlapBreak = breaks.some(b => {
                const [bStartH, bStartM] = b.start.split(':').map(Number);
                const [bEndH, bEndM] = b.end.split(':').map(Number);
                const breakStart = dt.set({ hour: bStartH, minute: bStartM, second: 0 });
                const breakEnd = dt.set({ hour: bEndH, minute: bEndM, second: 0 });
                return slotStart < breakEnd && slotEnd > breakStart;
            });

            if (!hasConflict && !overlapBreak) {
                slots.push(slotStart.toISOTime({ suppressSeconds: true }));
            }

            current = current.plus({ minutes: 30 });
        }

        return slots;
    }
}
