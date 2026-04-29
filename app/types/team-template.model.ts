export interface TeamTemplateMember {
    playerId: string;
    playerName: string;
}

export interface TeamTemplate {
    id: string;
    name: string;
    members: TeamTemplateMember[];
}

export interface TeamTemplateStats {
    teamTemplateId: string;
    teamTemplateName: string;
    eventsPlayed: number;
    members: TeamTemplateMember[];
}
