export type Resources = {
    food: number;
    wood: number; // For buildings/repairs
    shards: number; // "Intel" or "Mana"
};

export type AllocationPolicy = {
    farmers: number; // 0-100 percentage
    miners: number; // 0-100 percentage
    soldiers: number; // 0-100 percentage
    // Scientists are the remainder (100 - sum)
};

export type Population = {
    total: number;
    // Current actual counts (calculated from policy per turn)
    farmers: number;
    miners: number;
    soldiers: number;
    scientists: number;
};

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export type HellGate = {
    id: string;
    name: string;
    distance: number; // km from fortress
    activity: number; // 0-100% threat
    status: 'DORMANT' | 'ACTIVE' | 'ERUPTING';
};

export type DefenseStance = 'STANDARD' | 'MAN_THE_WALLS' | 'SALLY_FORTH';

export type Hero = {
    level: number;
    xp: number;
    might: number; // Flat defense bonus
    status: 'READY' | 'RECOVERING';
    cooldown: number;
};

export type TechId = 'CROP_ROTATION' | 'MASONRY' | 'STEEL_WEAPONS' | 'ARCANE_STUDIES' | 'HEAVY_PLOW' | 'IRON_ARMOR' | 'OBSIDIAN_WALLS' | 'CORE_STABILIZATION';

export interface Tech {
    id: TechId;
    name: string;
    description: string;
    cost: number;
    unlocked: boolean;
}

export type GameState = {
    turn: number;
    stance: DefenseStance;
    resources: Resources;
    population: Population;
    allocation: AllocationPolicy; // [NEW] The target ratios
    activeResearchId: TechId | null; // [NEW] Currently researching
    researchProgress: Record<TechId, number>; // [NEW] Progress towards cost
    hellGates: HellGate[];
    hero: Hero;
    techs: Record<TechId, Tech>;
    wallHealth: number;
    maxWallHealth: number;
    demonStrength: number;
    scoutReport: string;
    eventLog: string[];


    gameOver: boolean;
    victory: boolean;
    difficulty: Difficulty; // [NEW]
    finalStand: {
        active: boolean;
        turnsRemaining: number;
    };
    notifications: GameNotification[];
};

export type GameNotification = {
    id: string;
    type: 'RESEARCH_COMPLETE' | 'ATTACK' | 'VICTORY' | 'DEFEAT' | 'GENERIC';
    title: string;
    message: string;
    turn: number;
};

export type Difficulty = 'RECRUIT' | 'VETERAN' | 'COMMANDER' | 'LEGEND';

export const MAX_POPULATION = 1000;

export const INITIAL_STATE: GameState = {
    turn: 1,
    stance: 'STANDARD',
    resources: {
        food: 100,
        wood: 50,
        shards: 0,
    },
    population: {
        total: 10,
        farmers: 5,
        miners: 2,
        soldiers: 3,
        scientists: 0,
    },
    allocation: {
        farmers: 40,
        miners: 5,
        soldiers: 0,
    },
    activeResearchId: null,
    researchProgress: {
        'CROP_ROTATION': 0,
        'MASONRY': 0,
        'STEEL_WEAPONS': 0,
        'ARCANE_STUDIES': 0,
        'HEAVY_PLOW': 0,
        'IRON_ARMOR': 0,
        'OBSIDIAN_WALLS': 0,
        'CORE_STABILIZATION': 0
    },
    hellGates: [
        { id: 'g1', name: 'Gate of Cinders', distance: 50, activity: 10, status: 'DORMANT' },
        { id: 'g2', name: 'Abyssal Rift', distance: 120, activity: 0, status: 'DORMANT' }
    ],
    hero: {
        level: 1,
        xp: 0,
        might: 10,
        status: 'READY',
        cooldown: 0
    },
    techs: {
        'CROP_ROTATION': {
            id: 'CROP_ROTATION',
            name: "Hydroponic Synthesis",
            description: "+25% Food Production (Tier 1)",
            cost: 50,
            unlocked: false
        },
        'MASONRY': {
            id: 'MASONRY',
            name: "Ferrocrete Walls",
            description: "+25% Wall Repair/Max Health (Tier 1)",
            cost: 80,
            unlocked: false
        },
        'ARCANE_STUDIES': {
            id: 'ARCANE_STUDIES',
            name: "Void Theory",
            description: "+25% Scientist Output / Improves Banishment (Tier 1)",
            cost: 150,
            unlocked: false
        },
        'STEEL_WEAPONS': {
            id: 'STEEL_WEAPONS',
            name: "Plasma Rifles",
            description: "+20% Soldier Damage (Tier 1)",
            cost: 100,
            unlocked: false
        },
        'HEAVY_PLOW': {
            id: 'HEAVY_PLOW',
            name: "Atmospheric Condensers",
            description: "+25% Food Production (Tier 2)",
            cost: 120,
            unlocked: false
        },
        'IRON_ARMOR': {
            id: 'IRON_ARMOR',
            name: "Plasteel Plating", // Space Theme
            description: "+20% Defense (Tier 2)",
            cost: 120,
            unlocked: false
        },
        'OBSIDIAN_WALLS': {
            id: 'OBSIDIAN_WALLS',
            name: "Obsidian Composites",
            description: "+50% Wall Health (Tier 2)",
            cost: 150,
            unlocked: false
        },
        'CORE_STABILIZATION': {
            id: 'CORE_STABILIZATION',
            name: "The Ignition Protocol",
            description: "Reignite the Incendium Core. Requires 2000 Shards. Starts THE FINAL STAND.",
            // Let's make it a tech you research for 1000 Knowledge.
            cost: 500, // High knowledge cost
            unlocked: false
        }
    },
    wallHealth: 100,
    maxWallHealth: 100,
    demonStrength: 5, // Starts low
    scoutReport: "Scouts report minimal activity.",
    eventLog: ["The Long Night has begun. Survive.", "Welcome to NightFall."],
    gameOver: false,
    victory: false,
    difficulty: 'VETERAN',
    finalStand: {
        active: false,
        turnsRemaining: 0
    },
    notifications: []
};
