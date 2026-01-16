import type { GameState, DefenseStance, TechId } from '../engine/types';
import { MAX_POPULATION } from '../engine/types';

// Constants balancing
const FOOD_CONSUMPTION_PER_PERSON = 1;
const FARMING_YIELD = 5; // Food per farmer (Boosted for growth support)
const BUILD_YIELD = 5; // Wall HP per miner
const RESEARCH_YIELD = 5; // Knowledge per scientist (Boosted for quick Tier 1)
const SHARD_YIELD = 0.5; // Shards per miner per day

// Stance Modifiers
const MAN_WALLS_DEFENSE_MOD = 1.5;
const MAN_WALLS_REPAIR_MOD = 0.5;
const SALLY_FORTH_DMG_MOD = 2.0;

export function purchaseUpgrade(state: GameState, techId: TechId): GameState {
    // Deprecated? No, we use startResearch now. Keeping for safety or cheats.
    return startResearch(state, techId);
}

export function banishDemons(currentState: GameState): GameState {
    const state = JSON.parse(JSON.stringify(currentState));
    const BANISH_COST = 100;

    if (state.resources.shards >= BANISH_COST) {
        state.resources.shards -= BANISH_COST;
        state.demonStrength = Math.max(0, state.demonStrength - 2); // -2 Threat
        state.eventLog = ["Banished the darkness using Shards! Threat reduced.", ...state.eventLog];
    }
    return state;
}

export function igniteCore(currentState: GameState): GameState {
    const state = JSON.parse(JSON.stringify(currentState));

    // Prereqs: Tech Unlocked, 2000 Shards, Not already active
    if (!state.techs['CORE_STABILIZATION'].unlocked) return state;
    if (state.resources.shards < 2000) return state;
    if (state.finalStand.active) return state;

    // Pay Cost
    state.resources.shards -= 2000;

    // Activate Final Stand
    state.finalStand.active = true;
    state.finalStand.turnsRemaining = 10;

    // Boost Threat immediately
    state.demonStrength += 20;

    state.eventLog = [
        "THE IGNITION PROTOCOL INITIATED!",
        "The Incendium Core is charging. The Void screams in anger.",
        "SURVIVE FOR 10 CYCLES.",
        ...state.eventLog
    ];

    return state;
}

export function startResearch(currentState: GameState, techId: TechId): GameState {
    const state = JSON.parse(JSON.stringify(currentState));
    const tech = state.techs[techId];
    if (tech && !tech.unlocked) {
        state.activeResearchId = techId;
        state.eventLog = [`Started research on ${tech.name}.`, ...state.eventLog];
    }
    return state;
}

export function calculateProduction(state: GameState): { food: number; knowledge: number; wallRepair: number; shards: number } {
    const { farmers, scientists, miners } = state.population;

    let foodYield = FARMING_YIELD;
    // No season modifier - Constant Void
    // Tech Modifier
    if (state.techs['CROP_ROTATION'].unlocked) foodYield *= 1.25; // Tier 1
    if (state.techs['HEAVY_PLOW'].unlocked) foodYield *= 1.25; // Tier 2

    let wallRepair = miners * BUILD_YIELD;
    // Tech Modifier
    if (state.techs['MASONRY'].unlocked) wallRepair *= 1.25; // Tier 1
    if (state.techs['OBSIDIAN_WALLS'].unlocked) wallRepair *= 1.50; // Tier 2

    if (state.stance === 'MAN_THE_WALLS') wallRepair = Math.floor(wallRepair * MAN_WALLS_REPAIR_MOD);

    // Scientist Output (Knowledge)
    let scientistYield = RESEARCH_YIELD;
    if (state.techs['ARCANE_STUDIES'].unlocked) scientistYield *= 1.25;

    // Miner Shard Output
    let shardYield = SHARD_YIELD;
    // Could add tech for shard mining later

    return {
        food: Math.floor(farmers * foodYield),
        wallRepair: wallRepair,
        knowledge: scientists * scientistYield,
        shards: Math.floor(miners * shardYield)
    };
}

export function processTurn(currentState: GameState, newAllocation?: { farmers: number, miners: number, soldiers: number }, newStance?: DefenseStance): GameState {
    if (currentState.gameOver) return currentState;

    const state = JSON.parse(JSON.stringify(currentState)); // Deep copy for safety

    // Update Allocation Policy if provided
    if (newAllocation) {
        state.allocation = { ...newAllocation };
    }
    if (newStance) {
        state.stance = newStance;
    }

    // A. Re-Distribute Population based on Allocation Policy
    const totalPop = state.population.total;
    const alloc = state.allocation;

    state.population.farmers = Math.floor(totalPop * (alloc.farmers / 100));
    state.population.miners = Math.floor(totalPop * (alloc.miners / 100));
    state.population.soldiers = Math.floor(totalPop * (alloc.soldiers / 100));

    // Remainder are scientists
    state.population.scientists = Math.max(0, totalPop - (state.population.farmers + state.population.miners + state.population.soldiers));

    // 1. Production Phase
    const production = calculateProduction(state);
    state.resources.food += production.food;

    // Shards accumulate from mining
    state.resources.shards += production.shards;

    // Logic: Research Points Direction
    if (state.activeResearchId) {
        // Direct to project
        state.researchProgress[state.activeResearchId] += production.knowledge;

        // Check Completion
        const tech = state.techs[state.activeResearchId];
        if (state.researchProgress[state.activeResearchId] >= tech.cost) {
            tech.unlocked = true;
            state.activeResearchId = null; // Clear active
            state.eventLog = [`RESEARCH COMPLETE: ${tech.name}!`, ...state.eventLog];
            state.notifications.push({
                id: `res-${state.turn}-${Date.now()}`,
                type: 'RESEARCH_COMPLETE',
                title: 'RESEARCH COMPLETE',
                message: `${tech.name} has been unlocked.`,
                turn: state.turn
            });
        }
    } else {
        // Lost knowledge? Or maybe stockpiled as "General Theory"? 
        // For now, let's say without a focus, scientists idle.
        // OR: Convert to small amount of Shards?
        // Let's keep it simple: No research without active project.
        // User requested: "Active Research" bar driven.
    }

    state.wallHealth = Math.min(state.maxWallHealth, state.wallHealth + production.wallRepair);

    // 2. Consumption Phase
    const foodConsumed = state.population.total * FOOD_CONSUMPTION_PER_PERSON;
    state.resources.food -= foodConsumed;

    const log: string[] = [];

    // Starvation Check
    if (state.resources.food < 0) {
        state.resources.food = 0;
        // Negative growth handled below by formula
    }

    // 3. Demon Attack Phase
    let attackDamage = Math.floor(state.demonStrength);
    // No season modifier

    let defense = state.population.soldiers * 2;
    if (state.techs['STEEL_WEAPONS'].unlocked) defense *= 1.25;
    if (state.techs['IRON_ARMOR'].unlocked) defense *= 1.20; // Tier 2 Armor
    if (state.hero.status === 'READY') defense += state.hero.might;

    if (state.stance === 'MAN_THE_WALLS') {
        defense = Math.floor(defense * MAN_WALLS_DEFENSE_MOD);
    } else if (state.stance === 'SALLY_FORTH') {
        defense = Math.floor(defense * SALLY_FORTH_DMG_MOD);
        const sallyCasualties = Math.floor(state.population.soldiers * 0.05); // 5% risk
        if (sallyCasualties > 0) {
            state.population.total -= sallyCasualties;
            log.push(`Sally Forth cost ${sallyCasualties} soldiers!`);
        }
    }

    const netDamage = Math.max(0, attackDamage - defense);
    if (netDamage > 0) {
        state.wallHealth -= netDamage;
        log.push(`Demons attacked! Walls took ${netDamage} damage.`);
        state.notifications.push({
            id: `att-${state.turn}-${Date.now()}`,
            type: 'ATTACK',
            title: 'UNDER ATTACK',
            message: `The walls took ${netDamage} damage from the void swarm.`,
            turn: state.turn
        });
    } else {
        log.push(`Defenders held the line!`);
        state.hero.xp += 10;
        if (state.hero.xp >= state.hero.level * 100) {
            state.hero.level += 1;
            state.hero.might += 5;
            state.hero.xp = 0;
            log.push(`Commander leveled up to ${state.hero.level} !`);
        }
    }

    // 4. Update Demon Strength (Percentage Based Growth)
    // Old: BASE_DEMON_GROWTH * (1 + (state.turn * 0.1))
    // New: +X% per turn based on difficulty
    let growthRate = 0.05; // Base 5% growth
    if (state.difficulty === 'RECRUIT') growthRate = 0.02;
    if (state.difficulty === 'VETERAN') growthRate = 0.05;
    if (state.difficulty === 'COMMANDER') growthRate = 0.08;
    if (state.difficulty === 'LEGEND') growthRate = 0.12;

    // Additive growth + Percentage compound
    const flatGrowth = 2 + (state.turn * 0.5);
    state.demonStrength = (state.demonStrength + flatGrowth) * (1 + growthRate);

    // Scientists reduce growth slightly (Smart Defense) - Cap reduction to avoid negative
    const reduction = Math.min(state.demonStrength * 0.1, state.population.scientists * 0.005);
    state.demonStrength -= reduction;

    // 5. Game Over Check
    if (state.wallHealth <= 0) {
        state.wallHealth = 0;
        log.push("The walls have fallen.");
        state.gameOver = true;
    }
    if (state.population.total <= 0) {
        state.population.total = 0;
        log.push("Everyone is dead.");
        state.gameOver = true;
    }

    // 6. Growth Tuning (More Aggressive for 1000 pop)
    const foodProduced = state.population.farmers * FARMING_YIELD;
    const surplus = foodProduced - (state.population.total * FOOD_CONSUMPTION_PER_PERSON);

    // Dynamic Natality based on surplus food per capita
    const surplusPerCapita = surplus / (state.population.total || 1);

    // Base 15%, plus 5% for every unit of surplus food per person
    // If you have 500 farmers feeding 500 people, surplus is 2000 (4 per person).
    // Growth = 0.15 + (4 * 0.05) = 0.35 (35% growth!)
    const NATALITY = 0.15 + (Math.max(0, surplusPerCapita) * 0.05);
    const MORTALITY = 0.05; // 5% Death Rate



    let growthDelta = (surplus * NATALITY) - (state.population.total * MORTALITY);

    // Safety: If we have 0 food in inventory, force decline
    if (state.resources.food <= 0 && growthDelta > 0) {
        growthDelta = -state.population.total * 0.1; // 10% die if starving
    }

    state.population.total += growthDelta;

    // Cap at MAX_POPULATION
    if (state.population.total > MAX_POPULATION) {
        state.population.total = MAX_POPULATION;
    }

    // Log significant changes
    if (growthDelta > 0.1) log.push(`Population grew by ${growthDelta.toFixed(1)}`);
    if (growthDelta < -0.1) log.push(`Population declined by ${Math.abs(growthDelta).toFixed(1)}`);

    // Hero Cooldown
    if (state.hero.cooldown > 0) state.hero.cooldown -= 1;

    // 7. Update Intelligence
    const scoutMin = Math.floor(state.demonStrength * 0.9);
    const scoutMax = Math.ceil(state.demonStrength * 1.2);
    state.scoutReport = `Scouts report ${scoutMin}-${scoutMax} demons gathering.`;

    // Log the scout report
    log.push(state.scoutReport);

    // 8. Final Stand Logic
    if (state.finalStand.active) {
        state.finalStand.turnsRemaining -= 1;
        // Increase threat aggressively during final stand
        state.demonStrength += 5;

        if (state.finalStand.turnsRemaining <= 0) {
            if (state.wallHealth > 0 && state.population.total > 0) {
                state.victory = true;
                state.gameOver = true;
                state.eventLog = [
                    "CORE IGNITION SUCCESSFUL!",
                    "The Incendium Core flares to life, bathing the world in holy fire.",
                    "The shadows burn away. You have reclaimed the dawn.",
                    ...state.eventLog
                ];
            }
        } else {
            state.eventLog = [`CORE IGNITION: ${state.finalStand.turnsRemaining} Cycles remaining...`, ...state.eventLog];
        }
    }

    state.eventLog = [...log, ...state.eventLog].slice(0, 10);
    state.turn += 1;

    return state;
}

