-----------
--Tech Culture
update ProgressionTreeNodes 
set Cost = '1'
WHERE ProgressionTree="TREE_CIVICS_AQ_SWISS_CONFEDERACY";

-- update Constructibles 
-- set Cost = '1'
--  WHERE "ConstructibleType" LIKE '%SWISS_CONFEDERACY%';


update Unit_Costs 
set Cost = '1'
WHERE "UnitType" LIKE '%UNIT_AMTSBURGERMEISTER%';


-- Diplo
-- Make diplo actions cheaper less influence

-- update DiplomacyActions
-- SET BaseTokenCost = 1,
-- BaseDuration = 4
-- WHERE DiplomacyActionType = 'DIPLOMACY_ACTION_GIVE_INFLUENCE_TOKEN';


-- update DiplomaticActionStages
-- set ProgressRequirement = 5
-- where StageType="DIPLOMACY_INFLUENCE_INDEPENDENT_FRIENDLY_FIRST_GIFT";

-- update DiplomaticActionStages
-- set ProgressRequirement = 10
-- where StageType="DIPLOMACY_INFLUENCE_INDEPENDENT_FRIENDLY";

-- update DiplomaticActionStages
-- set ProgressRequirement = 15
-- WHERE StageType="DIPLOMACY_INFLUENCE_INDEPENDENT_SUZERAIN";



-- update DiplomaticActionInfluenceCosts 
-- set
-- InfCostFriendly = 1,
-- InfCostHostile = 1,
-- InfCostHelpful = 1,
-- InfCostNeutral = 1;

-- update ModifierArguments 
-- set Value="6"
-- WHERE ModifierId="INFLUENCE_INDEPENDENT_VERY_HOSTILE_INVESTMENT";

-- update ModifierArguments 
-- set Value="6"
-- WHERE ModifierId="INFLUENCE_INDEPENDENT_FRIENDLY_INVESTMENT";

-- update ModifierArguments 
-- set Value="6"
-- WHERE ModifierId="INFLUENCE_INDEPENDENT_FRIENDLY_FIRST_GIFT";

-- update ModifierArguments 
-- set Value="6"
-- WHERE ModifierId="INFLUENCE_INDEPENDENT_SUZERAIN_INVESTMENT";





