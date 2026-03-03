const { prisma } = require('@/lib/prisma');
const { DateTime } = require('luxon');

class AvailabilityRepository {
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
        // Em um sistema real, isso viria das configurações da Location ou Staff
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
                // Para agendamentos existentes, também devemos considerar os buffers DELES?
                // Requisito: "Não permitir conflitos... considerando buffers".
                // Aqui simplificamos: se o intervalo ocupado do novo agendamento sobrepõe
                // o intervalo ocupado de um existente.
                const itemStart = DateTime.fromJSDate(item.startTime);
                const itemEnd = DateTime.fromJSDate(item.endTime);

                // Se item for appointment, pegar buffers dele? 
                // No create, gravamos startTime e endTime SEM buffers no banco, mas a validação de conflito usa.
                // Vamos manter a lógica do Commit 6: verificar sobreposição simples de "occupied" intervals.

                // No caso de Appointments no banco, o startTime/endTime é o tempo de atendimento.
                // Os buffers são "espaço em volta".
                const itemBufferBefore = item.service?.bufferBefore || 0;
                const itemBufferAfter = item.service?.bufferAfter || 0;

                const itemOccupiedStart = itemStart.minus({ minutes: itemBufferBefore });
                const itemOccupiedEnd = itemEnd.plus({ minutes: itemBufferAfter });

                return occupiedStart < itemOccupiedEnd && occupiedEnd > itemOccupiedStart;
            });

            if (!hasConflict) {
                slots.push(slotStart.toISOTime({ suppressSeconds: true }));
            }

            // Próximo slot possível (pode ser fixo de 30 min ou baseado na duração)
            current = current.plus({ minutes: 30 });
        }

        return slots;
    }
}

module.exports = { AvailabilityRepository };
