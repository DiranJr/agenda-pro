import { prisma } from '@/lib/prisma';
import { DateTime } from 'luxon';

export class FinanceRepository {
    constructor(tenantId, timezone = 'UTC') {
        this.tenantId = tenantId;
        this.timezone = timezone;
    }

    async getReport({ startDate, endDate }) {
        const start = DateTime.fromISO(startDate).setZone(this.timezone).startOf('day').toUTC().toJSDate();
        const end = DateTime.fromISO(endDate).setZone(this.timezone).endOf('day').toUTC().toJSDate();

        const appointments = await prisma.appointment.findMany({
            where: {
                tenantId: this.tenantId,
                startTime: { gte: start, lte: end },
                status: { in: ['CONFIRMED', 'DONE'] }
            },
            include: {
                customer: true,
                service: true,
                staff: true
            },
            orderBy: { startTime: 'desc' }
        });

        // Calculate KPIs
        const totalRevenue = appointments.reduce((acc, app) => acc + Number(app.service?.price || 0), 0);
        const averageTicket = appointments.length > 0 ? totalRevenue / appointments.length : 0;

        // Best Service
        const serviceCounts = {};
        const categoryCounts = {};
        appointments.forEach(app => {
            const sName = app.service?.name || 'Unknown';
            const sCat = app.service?.category || 'Geral';
            serviceCounts[sName] = (serviceCounts[sName] || 0) + 1;
            categoryCounts[sCat] = (categoryCounts[sCat] || 0) + Number(app.service?.price || 0);
        });

        const bestService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '---';

        // Best Staff
        const staffRevenue = {};
        appointments.forEach(app => {
            const stName = app.staff?.name || 'Unknown';
            staffRevenue[stName] = (staffRevenue[stName] || 0) + Number(app.service?.price || 0);
        });
        const topStaff = Object.entries(staffRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] || '---';

        // Pie Chart Data
        const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

        return {
            appointments,
            stats: {
                totalRevenue,
                averageTicket,
                bestService,
                topStaff,
                appointmentCount: appointments.length
            },
            categoryData
        };
    }
}
