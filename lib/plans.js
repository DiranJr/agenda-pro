export const PLANS = {
    "start": {
        name: "Start",
        price: "R$ 49/mês",
        features: ["basic_crm", "simple_website", "appointments"],
        limits: { staff: 2, services: 10, gallery: 3 }
    },
    "pro": {
        name: "Pro",
        price: "R$ 99/mês",
        features: ["basic_crm", "advanced_crm", "custom_website", "finance_reports", "customer_recovery", "appointments"],
        limits: { staff: 10, services: 50, gallery: 10 }
    },
    "enterprise": {
        name: "Enterprise",
        price: "R$ 199/mês",
        features: ["basic_crm", "advanced_crm", "custom_website", "finance_reports", "customer_recovery", "appointments", "multi_location", "checkin_pro"],
        limits: { staff: 999, services: 999, gallery: 50 }
    }
};

export function hasFeature(planId, feature) {
    const plan = PLANS[planId] || PLANS["start"];
    return plan.features.includes(feature);
}

export function getLimit(planId, limitKey) {
    const plan = PLANS[planId] || PLANS["start"];
    return plan.limits[limitKey] || 0;
}
