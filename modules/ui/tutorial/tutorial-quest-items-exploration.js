/**
 * @file tutorial-quest-items-exploration.ts
 * @copyright 2024, Firaxis Games
 * @description Defines the sequence of tutorial quest items for the exploration age.
 */
import { VictoryQuestState } from '/base-standard/ui/quest-tracker/quest-item.js';
import { TutorialAdvisorType, TutorialAnchorPosition } from '/base-standard/ui/tutorial/tutorial-item.js';
import TutorialManager from '/base-standard/ui/tutorial/tutorial-manager.js';
import * as TutorialSupport from '/base-standard/ui/tutorial/tutorial-support.js';
import ContextManager from '/core/ui/context-manager/context-manager.js';
import QuestTracker, { QuestCompletedEventName } from '/base-standard/ui/quest-tracker/quest-tracker.js';
// ---------------------------------------------------------------------------
// Defines for option buttons
//
const calloutClose = { callback: () => { }, text: "LOC_TUTORIAL_CALLOUT_CLOSE", actionKey: "inline-cancel", closes: true };
const calloutBegin = { callback: () => { }, text: "LOC_TUTORIAL_CALLOUT_BEGIN", actionKey: "inline-accept", closes: true };
const calloutDeclineQuest = { callback: () => { }, text: "LOC_TUTORIAL_CALLOUT_DECLINE_QUEST", actionKey: "inline-cancel", closes: true };
// ---------------------------------------------------------------------------
// Defines for version validation
//
const isLiveEventPlayer = (() => {
    return Online.Metaprogression.isPlayingActiveEvent();
})();
const isNotLiveEventPlayer = (_item) => {
    return !isLiveEventPlayer;
};
// ------------------------------------------------------------------



// ------------------------------------------------------------------
// VICTORY QUEST LINE - MILITARY
// ------------------------------------------------------------------
const militaryVictoryContent1 = {
    title: "LOC_TUTORIAL_MILITARY_QUEST_1_TITLE",
    advisor: {
        text: "LOC_TUTORIAL_MILITARY_QUEST_1_ADVISOR_BODY",
        getLocParams: () => {
            let playerPathText = "";
            const player = Players.get(GameContext.localPlayerID);
            if (player) {
                let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
                if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                    playerPathText = "LOC_TUTORIAL_MILITARY_QUEST_1_ADVISOR_BODY_MONGOLIA_PATH";
                }
                else if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                    playerPathText = "LOC_TUTORIAL_MILITARY_QUEST_1_ADVISOR_BODY_SWISS_CONFEDERACY_PATH";
                }
                else {
                    playerPathText = "LOC_TUTORIAL_MILITARY_QUEST_1_ADVISOR_BODY_GENERIC_PATH";
                }
            }
            return [playerPathText];
        }
    },
    body: {
        text: "LOC_TUTORIAL_MILITARY_QUEST_1_BODY",
        getLocParams: () => {
            let playerPathText = "";
            let commanderIcon = "";
            let commanderName = "";
            const player = Players.get(GameContext.localPlayerID);
            if (player && player.Units) {
                let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
                if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                    const fleetCommander = player.Units.getBuildUnit("UNIT_ARMY_COMMANDER");
                    const commanderDef = GameInfo.Units.lookup(fleetCommander);
                    if (commanderDef) {
                        commanderIcon = "[icon:" + commanderDef.UnitType + "]";
                        commanderName = commanderDef.Name;
                    }
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_1_BODY_MONGOLIA_PATH", commanderIcon, commanderName);
                }
                else if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                    const fleetCommander = player.Units.getBuildUnit("UNIT_ARMY_COMMANDER");
                    const commanderDef = GameInfo.Units.lookup(fleetCommander);
                    if (commanderDef) {
                        commanderIcon = "[icon:" + commanderDef.UnitType + "]";
                        commanderName = commanderDef.Name;
                    }
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_1_BODY_SWISS_CONFEDERACY_PATH", commanderIcon, commanderName);
                }
                else {
                    const fleetCommander = player.Units.getBuildUnit("UNIT_FLEET_COMMANDER");
                    const commanderDef = GameInfo.Units.lookup(fleetCommander);
                    if (commanderDef) {
                        commanderIcon = "[icon:" + commanderDef.UnitType + "]";
                        commanderName = commanderDef.Name;
                    }
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_1_BODY_GENERIC_PATH", commanderIcon, commanderName);
                }
            }
            return [playerPathText];
        }
    }
};
TutorialManager.add({
    ID: "military_victory_quest_1_start",
    callout: {
        anchorPosition: TutorialAnchorPosition.MiddleCenter,
        advisorType: TutorialAdvisorType.Military,
        ...militaryVictoryContent1,
        option1: {
            callback: () => {
                QuestTracker.setQuestVictoryStateById("military_victory_quest_1_tracking", VictoryQuestState.QUEST_IN_PROGRESS);
            }, text: "LOC_TUTORIAL_CALLOUT_ACCEPT_QUEST", actionKey: "inline-accept", closes: true
        },
        option2: calloutDeclineQuest,
    },
    onObsoleteCheck: (_item) => {
        if (Online.Metaprogression.isPlayingActiveEvent()) {
            return true;
        }
        return QuestTracker.isQuestVictoryInProgress("military_victory_quest_1_tracking");
    },
    hiders: [".tut-action-button", ".tut-action-text"],
}, { version: 2 });
// ------------------------------------------------------------------
TutorialManager.add({
    ID: "military_victory_quest_1_tracking",
    quest: {
        title: Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_1_TRACKING_TITLE"),
        description: "LOC_TUTORIAL_MILITARY_QUEST_1_TRACKING_BODY",
        victory: {
            type: AdvisorTypes.MILITARY,
            order: 1,
            state: VictoryQuestState.QUEST_UNSTARTED,
            content: militaryVictoryContent1
        },
        getDescriptionLocParams: () => {
            let playerPathText = "";
            //generic path goals: study cartography and astronomy
            let cartographyResearched = "[icon:QUEST_ITEM_OPEN]";
            let astronomyResearched = "[icon:QUEST_ITEM_OPEN]";
            //mongol path goal: take settlement.
            let settlementCaptured = 0;
            let settlementGoal = 1;
            const player = Players.get(GameContext.localPlayerID);
            if (player) {
                let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
                //mongol path
                if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                    let playerCities = player.Cities?.getCities();
                    if (player.Units && playerCities) {
                        for (let i = 0; i < playerCities.length; ++i) {
                            let city = playerCities[i];
                            if (city != null) {
                                if (city.originalOwner != player.id) {
                                    settlementCaptured++;
                                }
                            }
                        }
                    }
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_1_TRACKING_BODY_MONGOLIA_PATH", settlementCaptured, settlementGoal);
                }
                else if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                    let playerCities = player.Cities?.getCities();
                    if (player.Units && playerCities) {
                        for (let i = 0; i < playerCities.length; ++i) {
                            let city = playerCities[i];
                            if (city != null) {
                                if (city.originalOwner != player.id) {
                                    settlementCaptured++;
                                }
                            }
                        }
                    }
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_1_TRACKING_BODY_SWISS_CONFEDERACY_PATH", settlementCaptured, settlementGoal);
                }
                //generic path
                else {
                    if (player.Techs?.isNodeUnlocked("NODE_TECH_EX_CARTOGRAPHY")) {
                        cartographyResearched = "[icon:QUEST_ITEM_COMPLETED]";
                    }
                    if (player.Techs?.isNodeUnlocked("NODE_TECH_EX_ASTRONOMY")) {
                        astronomyResearched = "[icon:QUEST_ITEM_COMPLETED]";
                    }
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_1_TRACKING_BODY_GENERIC_PATH", cartographyResearched, astronomyResearched);
                }
            }
            return [playerPathText];
        },
        cancelable: true,
    },
    runAllTurns: true,
    activationCustomEvents: ["user-interface-loaded-and-ready"],
    completionEngineEvents: ["TechNodeCompleted", "UnitAddedToArmy", "UnitRemovedFromArmy", "CityAddedToMap"],
    onCleanUp: (item) => {
        TutorialSupport.activateNextTrackedQuest(item);
    },
    onCompleteCheck: (_item) => {
        const player = Players.get(GameContext.localPlayerID);
        let settlementCaptured = 0;
        if (player) {
            let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
            if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                let playerCities = player.Cities?.getCities();
                if (playerCities) {
                    for (let i = 0; i < playerCities.length; ++i) {
                        let city = playerCities[i];
                        if (city != null) {
                            if (city.originalOwner != player.id) {
                                settlementCaptured++;
                            }
                        }
                    }
                }
                if (settlementCaptured > 0) {
                    return true;
                }
            }
            else if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                let playerCities = player.Cities?.getCities();
                if (playerCities) {
                    for (let i = 0; i < playerCities.length; ++i) {
                        let city = playerCities[i];
                        if (city != null) {
                            if (city.originalOwner != player.id) {
                                settlementCaptured++;
                            }
                        }
                    }
                }
                if (settlementCaptured > 0) {
                    return true;
                }
            }
            else {
                if (player.Techs?.isNodeUnlocked("NODE_TECH_EX_CARTOGRAPHY") && player.Techs?.isNodeUnlocked("NODE_TECH_EX_ASTRONOMY")) {
                    return true;
                }
            }
        }
        return false;
    },
}, { version: 2 });
const militaryVictoryContent2 = {
    title: "LOC_TUTORIAL_MILITARY_QUEST_2_TITLE",
    advisor: {
        text: "LOC_TUTORIAL_MILITARY_QUEST_2_ADVISOR_BODY",
        getLocParams: (_item) => {
            let playerPathText = "";
            const player = Players.get(GameContext.localPlayerID);
            if (player) {
                let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
                if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                    playerPathText = "LOC_TUTORIAL_MILITARY_QUEST_2_ADVISOR_BODY_MONGOLIA_PATH";
                }
                else if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                    playerPathText = "LOC_TUTORIAL_MILITARY_QUEST_2_ADVISOR_BODY_SWISS_CONFEDERACY_PATH";
                }
                else {
                    playerPathText = "LOC_TUTORIAL_MILITARY_QUEST_2_ADVISOR_BODY_GENERIC_PATH";
                }
            }
            return [playerPathText];
        }
    },
    body: {
        text: "LOC_TUTORIAL_MILITARY_QUEST_2_BODY",
        getLocParams: () => {
            let playerPathText = "";
            const player = Players.get(GameContext.localPlayerID);
            if (player) {
                let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
                if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                    playerPathText = "LOC_TUTORIAL_MILITARY_QUEST_2_BODY_MONGOLIA_PATH";
                }
                else if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                    playerPathText = "LOC_TUTORIAL_MILITARY_QUEST_2_BODY_SWISS_CONFEDERACY_PATH";
                }
                else {
                    let commanderIcon = "";
                    let commanderName = "";
                    const player = Players.get(GameContext.localPlayerID);
                    if (player && player.Units) {
                        const fleetCommander = player.Units.getBuildUnit("UNIT_FLEET_COMMANDER");
                        const commanderDef = GameInfo.Units.lookup(fleetCommander);
                        if (commanderDef) {
                            commanderIcon = "[icon:" + commanderDef.UnitType + "]";
                            commanderName = commanderDef.Name;
                        }
                    }
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_2_BODY_GENERIC_PATH", commanderIcon, commanderName);
                }
            }
            return [playerPathText];
        }
    }
};
// ------------------------------------------------------------------
TutorialManager.add({
    ID: "military_victory_quest_2_start",
    callout: {
        anchorPosition: TutorialAnchorPosition.MiddleCenter,
        advisorType: TutorialAdvisorType.Military,
        ...militaryVictoryContent2,
        option1: {
            callback: () => {
                QuestTracker.setQuestVictoryStateById("military_victory_quest_2_tracking", VictoryQuestState.QUEST_IN_PROGRESS);
            }, text: "LOC_TUTORIAL_CALLOUT_ACCEPT_QUEST", actionKey: "inline-accept", closes: true
        },
        option2: calloutDeclineQuest,
    },
    activationCustomEvents: [QuestCompletedEventName],
    onActivateCheck: (_item) => {
        return TutorialSupport.canQuestActivate("military_victory_quest_1_tracking", "military_victory_quest_2_tracking");
    },
    onObsoleteCheck: (_item) => {
        if (Online.Metaprogression.isPlayingActiveEvent()) {
            return true;
        }
        return QuestTracker.isQuestVictoryInProgress("military_victory_quest_2_tracking");
    }
}, { version: 2 });
// ------------------------------------------------------------------
TutorialManager.add({
    ID: "military_victory_quest_2_tracking",
    quest: {
        title: Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_2_TRACKING_TITLE"),
        description: "LOC_TUTORIAL_MILITARY_QUEST_2_TRACKING_BODY",
        getDescriptionLocParams: () => {
            let playerPathText = "";
            const player = Players.get(GameContext.localPlayerID);
            let settlementCaptured = 0;
            let settlementGoal = 2;
            if (player) {
                let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
                //mongol path
                if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                    let playerCities = player.Cities?.getCities();
                    if (player.Units && playerCities) {
                        for (let i = 0; i < playerCities.length; ++i) {
                            let city = playerCities[i];
                            if (city != null) {
                                if (city.originalOwner != player.id) {
                                    settlementCaptured++;
                                }
                            }
                        }
                        playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_2_TRACKING_BODY_MONGOLIA_PATH", settlementCaptured, settlementGoal);
                    }
                }
                else if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                    let playerCities = player.Cities?.getCities();
                    if (player.Units && playerCities) {
                        for (let i = 0; i < playerCities.length; ++i) {
                            let city = playerCities[i];
                            if (city != null) {
                                if (city.originalOwner != player.id) {
                                    settlementCaptured++;
                                }
                            }
                        }
                        playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_2_TRACKING_BODY_SWISS_CONFEDERACY_PATH", settlementCaptured, settlementGoal);
                    }
                }
                else {
                    let commanderIcon = "";
                    let commanderName = "";
                    let settlementInDistantLands = "[icon:QUEST_ITEM_OPEN]";
                    if (player.Units) {
                        let playerCities = player.Cities?.getCities();
                        if (playerCities) {
                            for (let i = 0; i < playerCities.length; ++i) {
                                let city = playerCities[i];
                                if (city != null && city.isDistantLands) {
                                    settlementInDistantLands = "[icon:QUEST_ITEM_COMPLETED]";
                                }
                            }
                        }
                        const fleetCommander = player.Units.getBuildUnit("UNIT_FLEET_COMMANDER");
                        const commanderDef = GameInfo.Units.lookup(fleetCommander);
                        if (commanderDef) {
                            commanderIcon = "[icon:" + commanderDef.UnitType + "]";
                            commanderName = commanderDef.Name;
                        }
                    }
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_2_TRACKING_BODY_GENERIC_PATH", settlementInDistantLands, commanderIcon, commanderName);
                }
            }
            return [playerPathText];
        },
        cancelable: true,
        victory: {
            type: AdvisorTypes.MILITARY,
            order: 2,
            state: VictoryQuestState.QUEST_UNSTARTED,
            content: militaryVictoryContent2
        },
    },
    runAllTurns: true,
    activationCustomEvents: ["user-interface-loaded-and-ready"],
    completionEngineEvents: ["CityAddedToMap"],
    onCleanUp: (item) => {
        TutorialSupport.activateNextTrackedQuest(item);
    },
    onCompleteCheck: (_item) => {
        let bQuestComplete = false;
        let iCitiesCaptured = 0;
        const player = Players.get(GameContext.localPlayerID);
        if (player && player.Cities) {
            let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
            if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                let playerCities = player.Cities.getCities();
                for (const city of playerCities) {
                    if (city.originalOwner != player.id) {
                        iCitiesCaptured++;
                    }
                }
                if (iCitiesCaptured >= 2) {
                    bQuestComplete = true;
                }
            }
            else if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                let playerCities = player.Cities.getCities();
                for (const city of playerCities) {
                    if (city.originalOwner != player.id) {
                        iCitiesCaptured++;
                    }
                }
                if (iCitiesCaptured >= 2) {
                    bQuestComplete = true;
                }
            }
            else {
                let playerCities = player.Cities.getCities();
                for (const city of playerCities) {
                    if (city.isDistantLands) {
                        bQuestComplete = true;
                        break;
                    }
                }
            }
        }
        return bQuestComplete;
    },
}, { version: 2 });
const militaryVictoryContent3 = {
    title: Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_3_TITLE"),
    advisor: {
        text: "LOC_TUTORIAL_MILITARY_QUEST_3_ADVISOR_BODY",
        getLocParams: (_item) => {
            let civAdj = "";
            let playerPathText = "";
            const player = Players.get(GameContext.localPlayerID);
            if (player) {
                civAdj = player.civilizationAdjective;
                let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
                if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_3_ADVISOR_BODY_MONGOLIA_PATH", civAdj);
                }
                else if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_3_ADVISOR_BODY_SWISS_CONFEDERACY_PATH", civAdj);
                }
                else {
                    playerPathText = "LOC_TUTORIAL_MILITARY_QUEST_3_ADVISOR_BODY_GENERIC_PATH";
                }
            }
            return [playerPathText];
        }
    },
    body: {
        text: "LOC_TUTORIAL_MILITARY_QUEST_3_BODY",
        getLocParams: (_item) => {
            let playerPathText = "";
            let pointGoal = MILITARY_QUEST_3_PTS_REQUIRED;
            const player = Players.get(GameContext.localPlayerID);
            if (player) {
                let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
                if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_3_BODY_MONGOLIA_PATH", pointGoal);
                }
                else if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_3_BODY_SWISS_CONFEDERACY_PATH", pointGoal);
                }
                else {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_3_BODY_GENERIC_PATH", pointGoal);
                }
            }
            return [playerPathText];
        }
    }
};
// ------------------------------------------------------------------
const MILITARY_QUEST_3_PTS_REQUIRED = 4;
TutorialManager.add({
    ID: "military_victory_quest_3_start",
    callout: {
        anchorPosition: TutorialAnchorPosition.MiddleCenter,
        advisorType: TutorialAdvisorType.Military,
        ...militaryVictoryContent3,
        option1: {
            callback: () => {
                QuestTracker.setQuestVictoryStateById("military_victory_quest_3_tracking", VictoryQuestState.QUEST_IN_PROGRESS);
            }, text: "LOC_TUTORIAL_CALLOUT_ACCEPT_QUEST", actionKey: "inline-accept", closes: true
        },
        option2: calloutDeclineQuest,
    },
    activationCustomEvents: [QuestCompletedEventName],
    onActivateCheck: (_item) => {
        return TutorialSupport.canQuestActivate("military_victory_quest_2_tracking", "military_victory_quest_3_tracking");
    },
    onObsoleteCheck: (_item) => {
        if (Online.Metaprogression.isPlayingActiveEvent()) {
            return true;
        }
        return QuestTracker.isQuestVictoryInProgress("military_victory_quest_3_tracking");
    }
}, { version: 2 });
// ------------------------------------------------------------------
TutorialManager.add({
    ID: "military_victory_quest_3_tracking",
    quest: {
        title: Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_3_TRACKING_TITLE"),
        description: "LOC_TUTORIAL_MILITARY_QUEST_3_TRACKING_BODY",
        victory: {
            type: AdvisorTypes.MILITARY,
            order: 3,
            state: VictoryQuestState.QUEST_UNSTARTED,
            content: militaryVictoryContent3
        },
        getDescriptionLocParams: () => {
            let playerPathText = "";
            const player = Players.get(GameContext.localPlayerID);
            let iPointsCurrent = 0;
            let iPointsGoal = MILITARY_QUEST_3_PTS_REQUIRED;
            if (player) {
                const score = player.LegacyPaths?.getScore("LEGACY_PATH_EXPLORATION_MILITARY");
                if (score) {
                    iPointsCurrent = score;
                }
                let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
                if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_3_TRACKING_BODY_MONGOLIA_PATH", iPointsCurrent, iPointsGoal);
                }
                else if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_3_TRACKING_BODY_SWISS_CONFEDERACY_PATH", iPointsCurrent, iPointsGoal);
                }
                else {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_3_TRACKING_BODY_GENERIC_PATH", iPointsCurrent, iPointsGoal);
                }
            }
            return [playerPathText];
        },
    },
    runAllTurns: true,
    activationCustomEvents: ["user-interface-loaded-and-ready"],
    completionEngineEvents: ["VPChanged"],
    onCleanUp: (item) => {
        TutorialSupport.activateNextTrackedQuest(item);
    },
    onCompleteCheck: (_item) => {
        const player = Players.get(GameContext.localPlayerID);
        let iPointsCurrent = 0;
        let iPointsGoal = MILITARY_QUEST_3_PTS_REQUIRED;
        if (player) {
            const score = player.LegacyPaths?.getScore("LEGACY_PATH_EXPLORATION_MILITARY");
            if (score) {
                iPointsCurrent = score;
            }
        }
        if (iPointsCurrent >= iPointsGoal) {
            return true;
        }
        return false;
    },
}, { version: 2 });
const militaryVictoryContent4 = {
    title: Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_4_TITLE"),
    advisor: {
        text: "LOC_TUTORIAL_MILITARY_QUEST_4_ADVISOR_BODY",
        getLocParams: (_item) => {
            let civAdj = "";
            let playerPathText = "";
            const player = Players.get(GameContext.localPlayerID);
            if (player) {
                civAdj = player.civilizationAdjective;
                let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
                if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_4_ADVISOR_BODY_MONGOLIA_PATH", civAdj);
                }
                else if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_4_ADVISOR_BODY_SWISS_CONFEDERACY_PATH", civAdj);
                }
                else {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_4_ADVISOR_BODY_GENERIC_PATH", civAdj);
                }
            }
            return [playerPathText];
        }
    },
    body: {
        text: "LOC_TUTORIAL_MILITARY_QUEST_4_BODY",
        getLocParams: (_item) => {
            let playerPathText = "";
            let pointGoal = MILITARY_QUEST_4_PTS_REQUIRED;
            const player = Players.get(GameContext.localPlayerID);
            if (player) {
                let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
                if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_4_BODY_MONGOLIA_PATH", pointGoal);
                }
                else if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_4_BODY_SWISS_CONFEDERACY_PATH", pointGoal);
                }
                else {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_4_BODY_GENERIC_PATH", pointGoal);
                }
            }
            return [playerPathText];
        }
    }
};
// ------------------------------------------------------------------
const MILITARY_QUEST_4_PTS_REQUIRED = 8;
TutorialManager.add({
    ID: "military_victory_quest_4_start",
    callout: {
        anchorPosition: TutorialAnchorPosition.MiddleCenter,
        advisorType: TutorialAdvisorType.Military,
        ...militaryVictoryContent4,
        option1: {
            callback: () => {
                QuestTracker.setQuestVictoryStateById("military_victory_quest_4_tracking", VictoryQuestState.QUEST_IN_PROGRESS);
            }, text: "LOC_TUTORIAL_CALLOUT_ACCEPT_QUEST", actionKey: "inline-accept", closes: true
        },
        option2: calloutDeclineQuest,
    },
    activationCustomEvents: [QuestCompletedEventName],
    onActivateCheck: (_item) => {
        return TutorialSupport.canQuestActivate("military_victory_quest_3_tracking", "military_victory_quest_4_tracking");
    },
    onObsoleteCheck: (_item) => {
        if (Online.Metaprogression.isPlayingActiveEvent()) {
            return true;
        }
        return QuestTracker.isQuestVictoryInProgress("military_victory_quest_4_tracking");
    }
}, { version: 2 });
// ------------------------------------------------------------------
TutorialManager.add({
    ID: "military_victory_quest_4_tracking",
    quest: {
        title: Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_4_TRACKING_TITLE"),
        description: "LOC_TUTORIAL_MILITARY_QUEST_4_TRACKING_BODY",
        victory: {
            type: AdvisorTypes.MILITARY,
            order: 4,
            state: VictoryQuestState.QUEST_UNSTARTED,
            content: militaryVictoryContent4
        },
        getDescriptionLocParams: () => {
            let playerPathText = "";
            const player = Players.get(GameContext.localPlayerID);
            let iPointsCurrent = 0;
            let iPointsGoal = MILITARY_QUEST_4_PTS_REQUIRED;
            if (player) {
                const score = player.LegacyPaths?.getScore("LEGACY_PATH_EXPLORATION_MILITARY");
                if (score) {
                    iPointsCurrent = score;
                }
                let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
                if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_4_TRACKING_BODY_MONGOLIA_PATH", iPointsCurrent, iPointsGoal);
                }
                else if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_4_TRACKING_BODY_SWISS_CONFEDERACY_PATH", iPointsCurrent, iPointsGoal);
                }
                else {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_4_TRACKING_BODY_GENERIC_PATH", iPointsCurrent, iPointsGoal);
                }
            }
            return [playerPathText];
        },
    },
    runAllTurns: true,
    activationCustomEvents: ["user-interface-loaded-and-ready"],
    completionEngineEvents: ["VPChanged"],
    onCleanUp: (item) => {
        TutorialSupport.activateNextTrackedQuest(item);
    },
    onCompleteCheck: (_item) => {
        const player = Players.get(GameContext.localPlayerID);
        let iPointsCurrent = 0;
        let iPointsGoal = MILITARY_QUEST_4_PTS_REQUIRED;
        if (player) {
            const score = player.LegacyPaths?.getScore("LEGACY_PATH_EXPLORATION_MILITARY");
            if (score) {
                iPointsCurrent = score;
            }
        }
        if (iPointsCurrent >= iPointsGoal) {
            return true;
        }
        return false;
    },
}, { version: 2 });
const militaryVictoryContent5 = {
    title: Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_5_TITLE"),
    advisor: {
        text: "LOC_TUTORIAL_MILITARY_QUEST_5_ADVISOR_BODY",
        getLocParams: (_item) => {
            let civAdj = "";
            let playerPathText = "";
            const player = Players.get(GameContext.localPlayerID);
            if (player) {
                civAdj = player.civilizationAdjective;
                let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
                if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_5_ADVISOR_BODY_MONGOLIA_PATH", civAdj);
                }
                else if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_5_ADVISOR_BODY_SWISS_CONFEDERACY_PATH", civAdj);
                }
                else {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_5_ADVISOR_BODY_GENERIC_PATH", civAdj);
                }
            }
            return [playerPathText];
        }
    },
    body: {
        text: "LOC_TUTORIAL_MILITARY_QUEST_5_BODY",
        getLocParams: (_item) => {
            let playerPathText = "";
            let pointGoal = MILITARY_QUEST_5_PTS_REQUIRED;
            const player = Players.get(GameContext.localPlayerID);
            if (player) {
                let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
                if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_5_BODY_MONGOLIA_PATH", pointGoal);
                }
                else if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_5_BODY_SWISS_CONFEDERACY_PATH", pointGoal);
                }
                else {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_5_BODY_GENERIC_PATH", pointGoal);
                }
            }
            return [playerPathText];
        }
    }
};
// ------------------------------------------------------------------
const MILITARY_QUEST_5_PTS_REQUIRED = 12;
TutorialManager.add({
    ID: "military_victory_quest_5_start",
    callout: {
        anchorPosition: TutorialAnchorPosition.MiddleCenter,
        advisorType: TutorialAdvisorType.Military,
        ...militaryVictoryContent5,
        option1: {
            callback: () => {
                QuestTracker.setQuestVictoryStateById("military_victory_quest_5_tracking", VictoryQuestState.QUEST_IN_PROGRESS);
            }, text: "LOC_TUTORIAL_CALLOUT_ACCEPT_QUEST", actionKey: "inline-accept", closes: true
        },
        option2: calloutDeclineQuest,
    },
    activationCustomEvents: [QuestCompletedEventName],
    onActivateCheck: (_item) => {
        return TutorialSupport.canQuestActivate("military_victory_quest_4_tracking", "military_victory_quest_5_tracking");
    },
    onObsoleteCheck: (_item) => {
        if (Online.Metaprogression.isPlayingActiveEvent()) {
            return true;
        }
        return QuestTracker.isQuestVictoryInProgress("military_victory_quest_5_tracking");
    }
}, { version: 2, canDeliver: isNotLiveEventPlayer });
// ------------------------------------------------------------------
TutorialManager.add({
    ID: "military_victory_quest_5_tracking",
    quest: {
        title: Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_5_TRACKING_TITLE"),
        description: "LOC_TUTORIAL_MILITARY_QUEST_5_TRACKING_BODY",
        victory: {
            type: AdvisorTypes.MILITARY,
            order: 5,
            state: VictoryQuestState.QUEST_UNSTARTED,
            content: militaryVictoryContent5
        },
        getDescriptionLocParams: () => {
            let playerPathText = "";
            const player = Players.get(GameContext.localPlayerID);
            let iPointsCurrent = 0;
            let iPointsGoal = MILITARY_QUEST_5_PTS_REQUIRED;
            if (player) {
                const score = player.LegacyPaths?.getScore("LEGACY_PATH_EXPLORATION_MILITARY");
                if (score) {
                    iPointsCurrent = score;
                }
                let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
                if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_5_TRACKING_BODY_MONGOLIA_PATH", iPointsCurrent, iPointsGoal);
                }
                if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_5_TRACKING_BODY_SWISS_CONFEDERACY_PATH", iPointsCurrent, iPointsGoal);
                }
                else {
                    playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_5_TRACKING_BODY_GENERIC_PATH", iPointsCurrent, iPointsGoal);
                }
            }
            return [playerPathText];
        },
    },
    runAllTurns: true,
    activationCustomEvents: ["user-interface-loaded-and-ready"],
    completionEngineEvents: ["VPChanged"],
    onCleanUp: (item) => {
        TutorialSupport.activateNextTrackedQuest(item);
    },
    onCompleteCheck: (_item) => {
        const player = Players.get(GameContext.localPlayerID);
        let iPointsCurrent = 0;
        let iPointsGoal = MILITARY_QUEST_5_PTS_REQUIRED;
        if (player) {
            const score = player.LegacyPaths?.getScore("LEGACY_PATH_EXPLORATION_MILITARY");
            if (score) {
                iPointsCurrent = score;
            }
        }
        if (iPointsCurrent >= iPointsGoal) {
            return true;
        }
        return false;
    },
}, { version: 2, canDeliver: isNotLiveEventPlayer });
// ------------------------------------------------------------------
TutorialManager.add({
    ID: "military_victory_quest_line_completed",
    callout: {
        anchorPosition: TutorialAnchorPosition.MiddleCenter,
        advisorType: TutorialAdvisorType.Military,
        title: Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_LINE_COMPLETE_TITLE"),
        advisor: {
            text: "LOC_TUTORIAL_MILITARY_QUEST_LINE_COMPLETE_ADVISOR_BODY",
            getLocParams: (_item) => {
                let civAdj = "";
                let playerPathText = "";
                const player = Players.get(GameContext.localPlayerID);
                if (player) {
                    civAdj = player.civilizationAdjective;
                    let playercivDef = GameInfo.Civilizations.lookup(player.civilizationType);
                    if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_MONGOLIA") {
                        playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_LINE_COMPLETE_ADVISOR_BODY_MONGOLIA_PATH", civAdj);
                    }
                    else if (playercivDef != null && playercivDef.CivilizationType == "CIVILIZATION_SWISS_CONFEDERACY") {
                        playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_LINE_COMPLETE_ADVISOR_BODY_SWISS_CONFEDERACY_PATH", civAdj);
                    }
                    else {
                        playerPathText = Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_LINE_COMPLETE_ADVISOR_BODY_MONGOLIA_PATH", civAdj);
                    }
                }
                return [playerPathText];
            }
        },
        body: {
            text: Locale.compose("LOC_TUTORIAL_MILITARY_QUEST_LINE_COMPLETE_BODY")
        },
        option1: calloutClose,
        option2: {
            callback: () => {
                ContextManager.push("screen-victory-progress", { singleton: true, createMouseGuard: true });
            },
            text: "LOC_TUTORIAL_CALLOUT_VICTORIES",
            actionKey: "inline-accept",
            closes: true
        },
    },
    activationCustomEvents: [QuestCompletedEventName],
    onActivateCheck: (_item) => {
        // Make sure the quest before this quest is completed
        return QuestTracker.isQuestVictoryCompleted("military_victory_quest_5_tracking");
    }
}, { version: 2 });


