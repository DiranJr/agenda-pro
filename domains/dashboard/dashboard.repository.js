import { prisma } from '@/lib/prisma';
import { DateTime } from 'luxon';

export class DashboardRepository {
    constructor(tenantId, timezone = 'UTC') {
        this.tenantId = tenantId;
        this.timezone = timezone;
    }

    async getStats() {
        const now = DateTime.now().setZone(this.timezone);
        const startOfMonth = now.startOf('month').toUTC().toJSDate();
        const startOf7DaysAgo = now.minus({ days: 7 }).startOf('day').toUTC().toJSDate();

        // 1. Próximo agendamento hoje
        const nextAppointment = await prisma.appointment.findFirst({
            where: {
                tenantId: this.tenantId,
                startTime: { gte: now.toUTC().toJSDate() },
                status: { in: ['SCHEDULED', 'CONFIRMED'] }
            },
            include: {
                customer: true,
                service: true,
                staff: true
            },
            orderBy: { startTime: 'asc' }
        });

        // 2. No-show rate do mês
        const monthAppointments = await prisma.appointment.aggregate({
            where: {
                tenantId: this.tenantId,
                startTime: { gte: startOfMonth },
                status: { notIn: ['CANCELED'] }
            },
            _count: true
        });

        const monthNoShows = await prisma.appointment.count({
            where: {
                tenantId: this.tenantId,
                startTime: { gte: startOfMonth },
                status: 'NO_SHOW'
            }
        });

        const noShowRate = monthAppointments._count > 0
            ? Math.round((monthNoShows / monthAppointments._count) * 100)
            : 0;

        // 3. Faturamento últimos 7 dias
        const recentAppointments = await prisma.appointment.findMany({
            where: {
                tenantId: this.tenantId,
                startTime: { gte: startOf7DaysAgo },
                status: { in: ['CONFIRMED', 'DONE'] }
            },
            include: { service: true }
        });

        const dailyRevenue = {};
        for (let i = 0; i < 7; i++) {
            const dateStr = now.minus({ days: i }).toISODate();
            dailyRevenue[dateStr] = 0;
        }

        recentAppointments.forEach(app => {
            const dateStr = DateTime.fromJSDate(app.startTime).setZone(this.timezone).toISODate();
            if (dailyRevenue[dateStr] !== undefined) {
                dailyRevenue[dateStr] += Number(app.service?.price || 0);
            }
        });

        const chartData = Object.entries(dailyRevenue)
            .map(([date, value]) => ({ date, value }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // 4. KPIs Básicos (usando queries otimizadas)
        const todayStats = await prisma.appointment.findMany({
            where: {
                tenantId: this.tenantId,
                startTime: {
                    gte: now.startOf('day').toUTC().toJSDate(),
                    lte: now.endOf('day').toUTC().toJSDate()
                }
            },
            include: { service: true }
        });

        const todayRevenue = todayStats.reduce((acc, app) => acc + (app.status !== 'CANCELED' ? Number(app.service?.price || 0) : 0), 0);

        return {
            todayRevenue,
            todayCount: todayStats.length,
            noShowRate,
            nextAppointment,
            chartData
        };
    }
}
