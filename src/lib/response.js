import { NextResponse } from "next/server";

export const APP_ERRORS = {
    INVALID_INPUT: { code: 'INVALID_INPUT', status: 400, message: 'Dados inválidos' },
    UNAUTHORIZED: { code: 'UNAUTHORIZED', status: 401, message: 'Não autorizado' },
    FORBIDDEN: { code: 'FORBIDDEN', status: 403, message: 'Acesso negado' },
    NOT_FOUND: { code: 'NOT_FOUND', status: 404, message: 'Recurso não encontrado' },
    CONFLICT: { code: 'CONFLICT', status: 409, message: 'Conflito de dados' },
    SERVER_ERROR: { code: 'SERVER_ERROR', status: 500, message: 'Erro interno no servidor' },
};

export function apiResponse(data, status = 200) {
    return NextResponse.json(data, { status });
}

export function apiError(errorKey, details = null, customMessage = null) {
    const error = APP_ERRORS[errorKey] || APP_ERRORS.SERVER_ERROR;
    return NextResponse.json({
        error: {
            code: error.code,
            message: customMessage || error.message,
            ...(details && { details })
        }
    }, { status: error.status });
}
