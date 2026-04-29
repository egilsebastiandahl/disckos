import { adminPost, adminPut, adminDelete } from "@/lib/adminClient";

const createTeamTemplate = async (name: string) => {
    return adminPost("/api/admin/team-template", { name });
};

const updateTeamTemplate = async (id: string, name: string) => {
    return adminPut(`/api/admin/team-template/${id}`, { name });
};

const deleteTeamTemplate = async (id: string) => {
    return adminDelete(`/api/admin/team-template/${id}`);
};

const addMember = async (teamTemplateId: string, playerId: string) => {
    return adminPost(`/api/admin/team-template/${teamTemplateId}/members`, { playerId });
};

const removeMember = async (teamTemplateId: string, playerId: string) => {
    return adminDelete(`/api/admin/team-template/${teamTemplateId}/members/${playerId}`);
};

export const teamTemplateApi = {
    createTeamTemplate,
    updateTeamTemplate,
    deleteTeamTemplate,
    addMember,
    removeMember,
};
