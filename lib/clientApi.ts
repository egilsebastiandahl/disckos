/* eslint-disable @typescript-eslint/no-explicit-any */
/* Client-side fetch helpers for calling Next.js API routes. */

export async function clientGet(path: string, init?: RequestInit): Promise<Response> {
    return fetch(path, { method: "GET", credentials: "same-origin", ...init });
}

export async function clientPost(path: string, body?: any, init?: RequestInit): Promise<Response> {
    return fetch(path, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        ...init,
    });
}

export async function clientPut(path: string, body?: any, init?: RequestInit): Promise<Response> {
    return fetch(path, {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        ...init,
    });
}

export async function clientDelete(path: string, init?: RequestInit): Promise<Response> {
    return fetch(path, { method: "DELETE", credentials: "same-origin", ...init });
}

export default {
    get: clientGet,
    post: clientPost,
    put: clientPut,
    delete: clientDelete,
};
