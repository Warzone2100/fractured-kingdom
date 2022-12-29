// Progression-related functions (triggers, events, etc.) 
// Fair warning: it's kinda messy

// Expand the map and give the player their units
function endCrashScene()
{
	// Spawn fire effects
	for (var i = 1; i <= 8; i++)
	{
		var x = 125 + camRand(5);
		var y = 216 + camRand(5);
		fireWeaponAtLoc("FlameEffect", x, y, CAM_HUMAN_PLAYER);
	}

	// Grant and pre-damage the player's units and transport
	var pos = camMakePos("startPosition");
	var stuff = enumDroid(6).concat(enumStruct(6));
	for (var i = 0; i < stuff.length; i++)
	{
		donateObject(stuff[i], CAM_HUMAN_PLAYER);
		setHealth(stuff[i], 60 + camRand(21)); // 60% to 80% HP
	}
	queue("preDamageTransport", camSecondsToMilliseconds(0.6));

	// Now that the player actually has units, it's safe to set this
	camSetStandardWinLossConditions(CAM_VICTORY_STANDARD, "CAM_1B", {
		mesCallback: "displayFactionInfo"
	});

	// Center the camera on the crash site
	cameraSlide(pos.x * 128, pos.y * 128);

	// Expand the map's scroll limits
	setScrollLimits(0, 187, 168, 224);
}

// There's some sort of delay when donating a structure so damaging the transport has to happen here
function preDamageTransport()
{
	setHealth(enumStruct(CAM_HUMAN_PLAYER)[0], 20 + camRand(21)); // 20% to 40% HP
}

// Set initial commanders to the correct rank, based on difficulty
function rankCommanders()
{
	// AMPHOS commander
	if (difficulty === SUPEREASY) camSetDroidRank(getObject("ampCommander"), "Trained");
	if (difficulty === EASY) camSetDroidRank(getObject("ampCommander"), "Regular");
	if (difficulty === MEDIUM) camSetDroidRank(getObject("ampCommander"), "Professional");
	if (difficulty === HARD) camSetDroidRank(getObject("ampCommander"), "Veteran");
	if (difficulty === INSANE) camSetDroidRank(getObject("ampCommander"), "Elite");

	// Coalition commander
	if (difficulty <= HARD) camSetDroidRank(getObject("coaCommander"), "Veteran");
	if (difficulty === INSANE) camSetDroidRank(getObject("coaCommander"), "Elite");

	// Royalist central commander
	if (difficulty <= EASY) camSetDroidRank(getObject("royCentralCommander"), "Trained");
	if (difficulty === MEDIUM) camSetDroidRank(getObject("royCentralCommander"), "Regular");
	if (difficulty >= HARD) camSetDroidRank(getObject("royCentralCommander"), "Professional");

	// Royalist hover commander
	if (difficulty <= MEDIUM) camSetDroidRank(getObject("royHoverCommander"), "Trained");
	if (difficulty >= HARD) camSetDroidRank(getObject("royHoverCommander"), "Regular");
	if (difficulty === INSANE) camSetDroidRank(getObject("royHoverCommander"), "Professional");

	// Royalist assault commander
	if (difficulty <= EASY) camSetDroidRank(getObject("royAssaultCommander"), "Trained");
	if (difficulty === MEDIUM) camSetDroidRank(getObject("royAssaultCommander"), "Regular");
	if (difficulty >= HARD) camSetDroidRank(getObject("royAssaultCommander"), "Professional");

	// Royalist heavy commander
	if (difficulty <= MEDIUM) camSetDroidRank(getObject("royHvyCommander"), "Elite");
	if (difficulty === HARD) camSetDroidRank(getObject("royHvyCommander"), "Special");
	if (difficulty === INSANE) camSetDroidRank(getObject("royHvyCommander"), "Hero");
}

// Assign map-placed droids to their commanders
function gatherCommanderUnits()
{
	// Resistance commander
	var group = gameState.resistance.groups.commanderGroup;
	var droids = enumArea("resCommanderGroup", THE_RESISTANCE, false);
	for (var i = 0; i < droids.length; i++)
	{
		groupAdd(group.id, droids[i]);
	}
	camManageGroup(group.id, group.order, group.data); // Set the group order
	

	// The AMPHOS commander doesn't start with any units, but we need to initialize the group order anyway
	group = gameState.amphos.groups.commanderGroup;
	camManageGroup(group.id, group.order, group.data);
	

	// Coalition commander
	group = gameState.coalition.groups.commanderGroup;
	droids = enumArea("coaCommanderGroup", THE_COALITION, false);
	for (var i = 0; i < droids.length; i++)
	{
		groupAdd(group.id, droids[i]);
	}
	camManageGroup(group.id, group.order, group.data);
	

	// Royalist central commander
	group = gameState.royalists.groundGroups.centralCommanderGroup;
	droids = enumArea("royCentralCommGroup", ROYALISTS, false);
	for (var i = 0; i < droids.length; i++)
	{
		groupAdd(group.id, droids[i]);
	}
	camManageGroup(group.id, group.order, group.data);
	

	// Royalist hover commander
	group = gameState.royalists.hoverGroups.hoverCommanderGroup;
	droids = enumArea("royHoverCommGroup", ROYALISTS, false);
	for (var i = 0; i < droids.length; i++)
	{
		groupAdd(group.id, droids[i]);
	}
	camManageGroup(group.id, group.order, group.data);

	// The Royalist assault commander doesn't start with any units
	group = gameState.royalists.assaultCommandGroup;
	camManageGroup(group.id, group.order, group.data);
}

// Give commanders and some map-placed groups marching orders
// Also spawns in Coalition and Royalist transporters
function initializeMapGroups()
{
	camManageGroup(camMakeGroup("ampCommander"), CAM_ORDER_PATROL, {
		pos: [
			camMakePos("eastPos7"),
			camMakePos("eastPos2"),
			camMakePos("eastPos10"),
			camMakePos("eastPos8"),
			camMakePos("eastPos5")
		],
		interval: camSecondsToMilliseconds(30),
		repair: 75
	});

	// These overwrite the orders indirectly given to commanders in gatherCommanderUnits()
	camManageGroup(camMakeGroup("coaCommander"), CAM_ORDER_PATROL, {
		pos: [
			camMakePos("westPos4"),
			camMakePos("westPos5"),
			camMakePos("westPos11"),
			camMakePos("westPos9")
		],
		interval: camSecondsToMilliseconds(45),
		repair: 40
	});

	camManageGroup(camMakeGroup("royCentralCommander"), CAM_ORDER_PATROL, {
		pos: [
			// camMakePos("centralPos4"),
			camMakePos("centralPos5"),
			camMakePos("centralPos1"),
			camMakePos("centralPos6"),
			camMakePos("centralPos9"),
			camMakePos("centralPos10")
		],
		interval: camSecondsToMilliseconds(55),
		repair: 40
	});

	camManageGroup(camMakeGroup("royHoverCommander"), CAM_ORDER_PATROL, {
		pos: [
			camMakePos("eastPos3"),
			camMakePos("eastPos4"),
			camMakePos("eastPos5"),
			camMakePos("eastPos7")
		],
		interval: camSecondsToMilliseconds(35),
		repair: 35
	});

	camManageGroup(camMakeGroup("royAssaultCommander"), CAM_ORDER_DEFEND, {
		pos: camMakePos("innerPos1"),
		repair: 40
	});

	// Royalist cyborg patrol in the center factory area
	camManageGroup(camMakeGroup("royCentralCybPatrolGroup"), CAM_ORDER_PATROL, {
		pos: [
			camMakePos("centralPos1"),
			camMakePos("centralPos6"),
			camMakePos("centralPos7"),
			camMakePos("centralPos11")
		],
		interval: camSecondsToMilliseconds(25),
		repair: 60
	});

	// Royalist heavy cyborg patrol in the main base area
	camManageGroup(camMakeGroup("roySuperCybPatrolGroup"), CAM_ORDER_PATROL, {
		pos: [
			camMakePos("innerPos4"),
			camMakePos("innerPos3"),
			camMakePos("innerPos2"),
			camMakePos("innerPos1")
		],
		interval: camSecondsToMilliseconds(25),
		repair: 60
	});

	// Spawn in Royalist and Coalition transporters (and label them)
	var pos1 = camMakePos("coaTransSpawn");
	var pos2 = camMakePos("royTransSpawn");
	addLabel(addDroid(THE_COALITION, pos1.x, pos1.y, _("Transport"), "TransporterBody", "V-Tol", "", "", "MG3-VTOL"), "coaTransport");
	addLabel(addDroid(ROYALISTS, pos2.x, pos2.y, _("Transport"), "TransporterBody", "V-Tol", "", "", "MG4ROTARY-VTOL"), "royTransport");

	// Make a dummy group for the Resistance Python tank
	addLabel({ type: GROUP, id: camMakeGroup(getObject("resPython")) }, "resPythonST", false);
	resetLabel("resPythonST", CAM_HUMAN_PLAYER); // subscribe for eventGroupSeen
}

// Triggered when first moving out from the crash site
camAreaEvent("resEncounter1Trigger", function(droid)
{
	// Only trigger if the player moves a droid in
	if (droid.player === CAM_HUMAN_PLAYER)
	{
		// Give intercepted Resistance radio message
		missionMessage("ENC1MSG", "TRANS");

		// Tell the Resistance cyborgs to go check out the crash site
		camManageGroup(gameState.resistance.cyborgEncounterGroup, CAM_ORDER_ATTACK, {
			pos: [
				camMakePos("startPosition")
			],
			repair: 65
		});

		// Tell the sensor unit to keep watch
		camManageGroup(gameState.resistance.sensorEncounterGroup, CAM_ORDER_DEFEND, {
			pos: [
				camMakePos("resSensEncounterGroup") // sit still basically
			],
			repair: 65
		});
	}
	else
	{
		resetLabel("resEncounter1Trigger", CAM_HUMAN_PLAYER);
	}
});

// Triggered when approaching the first Resistance defences
camAreaEvent("resEncounter2Trigger", function(droid)
{
	// Only trigger if the player moves a droid in
	if (droid.player === CAM_HUMAN_PLAYER)
	{
		// Give second intercepted Resistance radio message
		missionMessage("ENC2MSG", "TRANS");

		// Tell the second resistance group to attack
		camManageGroup(gameState.resistance.secondEncounterGroup, CAM_ORDER_ATTACK, {
			pos: [
				camMakePos("startPosition")
			],
			repair: 65
		});

		// Let the truck defend
		setTimer("manageEncounterTruck", camSecondsToMilliseconds(0.5));

		// Tell the cyborg and sensor groups to retreat back to base (if they're still alive)
		camManageGroup(gameState.resistance.cyborgEncounterGroup, CAM_ORDER_DEFEND, {
			pos: camMakePos("resCyborgAssembly"),
			repair: 65
		});
		camManageGroup(gameState.resistance.sensorEncounterGroup, CAM_ORDER_DEFEND, {
			pos: camMakePos("resCyborgAssembly"),
			repair: 65
		});
	}
	else
	{
		resetLabel("resEncounter2Trigger", CAM_HUMAN_PLAYER);
	}
});

// Quietly remove the encounter groups
function removeEncounterGroups()
{
	var droids = [];
	var r = gameState.resistance;
	droids = droids.concat(enumGroup(r.cyborgEncounterGroup),
	 enumGroup(r.sensorEncounterGroup), enumGroup(r.secondEncounterGroup));

	for (var i = droids.length - 1; i >= 0; i--)
	{
		camSafeRemoveObject(droids[i], false);
	}

	camSafeRemoveObject(getObject("resEncounterTruck"));
}

// Tell the resistance truck to run away if damaged
function manageEncounterTruck()
{
	var truck = getObject("resEncounterTruck");

	if (!camDef(truck) || truck === null)
	{
		removeTimer("manageEncounterTruck");
		return;
	}

	if (truck.health <= 65)
	{
		var pos = camMakePos("resCyborgAssembly");
		orderDroidLoc(truck, DORDER_MOVE, pos.x, pos.y);
	}
}

// Triggered after passing the Resistance defences
camAreaEvent("resNegotiationTrigger", function(droid)
{
	// Only trigger if the player moves a droid in
	if (droid.player === CAM_HUMAN_PLAYER)
	{
		// Resistance message to the player
		missionMessage("RESNEGOMSG", "TRANS");

		// Order the remaining units to fallback
		camManageGroup(gameState.resistance.secondEncounterGroup, CAM_ORDER_DEFEND, {
			pos: camMakePos("resCyborgAssembly"),
			repair: 65
		});
		queue("removeEncounterGroups", camSecondsToMilliseconds(60));
		queue("setupResistanceNegotiations", camSecondsToMilliseconds(12));
	}
	else
	{
		resetLabel("resNegotiationTrigger", CAM_HUMAN_PLAYER);
	}
});

// Have the Resistance extend an "olive branch" to the player
function setupResistanceNegotiations()
{
	console("The Resistance is offering to form an alliance with you!");
	playSound("pcv479.ogg"); // "Alliance offered"
	hackAddMessage("RES_OLIVE", PROX_MSG, CAM_HUMAN_PLAYER);
	gameState.resistance.allianceState = "OFFER";

	// Move the truck to the negotiation zone 
	var oliveTruck = getObject("resOliveTruck");
	var pos = camMakePos("resOliveZone");
	orderDroidLoc(oliveTruck, DORDER_MOVE, pos.x, pos.y);
}

camAreaEvent("resOliveZone", function(droid)
{
	// Only trigger if the player moves a droid in while the Resistance is offering an alliance
	if ((droid.player === CAM_HUMAN_PLAYER || droid.player === THE_RESISTANCE) && gameState.resistance.allianceState === "OFFER")
	{
		// Find all the player's droids in this area
		var droids = enumArea("resOliveZone", CAM_HUMAN_PLAYER, false);
		var resAtTable = (enumArea("resOliveZone", THE_RESISTANCE, false).length >= 1);
		// Make sure trucks are the only things inside, and the Resistance has arrived in the zone
		if (onlyTrucks(droids) && resAtTable)
		{
			console("Negotiations beginning...");
			// Try to ally after a few seconds
			queue("allyResistance", camSecondsToMilliseconds(6));
		}
		else
		{
			resetLabel("resOliveZone", ALL_PLAYERS);
		}
	}
	else
	{
		resetLabel("resOliveZone", ALL_PLAYERS);
	}
});

// Make the Resistance an ally to the player.
// Called if negotiations are successful
function allyResistance()
{
	if (!checkNegotiations("resOliveZone", "resOliveTruck"))
	{
		// Negotiations didn't finish correctly.
		return;
	}

	gameState.allowColourChange = false;

	// Resistance message to the player
	queue("resAllyMessage", camSecondsToMilliseconds(8));

	console("The Resistance has allied with you!");
	gameState.resistance.allianceState = "ALLIED"; // Besties :)
	setAlliance(CAM_HUMAN_PLAYER, THE_RESISTANCE, true);
	playSound("pcv477.ogg"); // "Alliance accepted!"
	achievementMessage("BFFs", "Form an alliance with the Resistance");

	camBaseChangeToFriendly("resistanceMainBase");
	camBaseChangeToFriendly("resistanceRiverRepairBase");
	camBaseChangeToFriendly("resistanceSubBase");

	hackRemoveMessage("RES_OLIVE", PROX_MSG, CAM_HUMAN_PLAYER);

	// Move the olive truck back to base
	var oliveTruck = getObject("resOliveTruck");
	var pos = camMakePos("resCyborgAssembly");
	orderDroidLoc(oliveTruck, DORDER_MOVE, pos.x, pos.y);
	queue("removeOliveTrucks", camSecondsToMilliseconds(30));

	// Give the Resistance a truck to manage their base
	camManageTrucks(THE_RESISTANCE, "resistanceMainBase", structSets.resistanceStructs, cTempl.reltruckw, camSecondsToMilliseconds(60));

	// Set up a truck to eventually build a base by the river
	camManageTrucks(THE_RESISTANCE, "resistanceRiverRepairBase", structSets.resistanceRiverTownRepairStructs, cTempl.remtruck, camSecondsToMilliseconds(60));

	// Give the Resistance commander a rank depending on the difficulty
	if (difficulty <= HARD) camSetDroidRank(getObject("resCommander"), "Trained");
	if (difficulty === INSANE) camSetDroidRank(getObject("resCommander"), "Green");

	// Donate some power to the player
	setPower(playerPower(CAM_HUMAN_PLAYER) + camChangeOnDiff(2000), CAM_HUMAN_PLAYER);

	// Donate the two outer oil derricks to the player (if the player hasn't already taken them)
	var giftStructs = enumArea("resGiftZone", THE_RESISTANCE, false);
	if (giftStructs.length > 0)
	{
		for (var i = 0; i < giftStructs.length; i++)
		{
			if (giftStructs[i].type === STRUCTURE)
			{
				donateObject(giftStructs[i], CAM_HUMAN_PLAYER);
			}
		}
		playSound("pcv482.ogg"); // "Gift recieved"
	}
	else
	{
		playSound("power-transferred.ogg"); // "Power Transferred"
	}

	// Share research with the player
	enableResearch("R-Wpn-AAGun03", CAM_HUMAN_PLAYER); // Hurricane
	enableResearch("R-Struc-Factory-Module", CAM_HUMAN_PLAYER); // Factory Module
	enableResearch("R-Wpn-MG2Mk1", CAM_HUMAN_PLAYER); // Twin Machinegun
	enableResearch("R-Sys-Engineering01", CAM_HUMAN_PLAYER); // Engineering
	enableResearch("R-Struc-CommandRelay", CAM_HUMAN_PLAYER); // Command Relay Post
	playSound("pcv485.ogg"); // "Technology transferred"

	// Remove resistance artifacts
	camRemoveArtifact("resHQ");
	camRemoveArtifact("resPython");
	camRemoveArtifact("resMortarPit");
	camRemoveArtifact("resAASite");
	camRemoveArtifact("resistanceFactory");
	camRemoveArtifact("resistanceHeavyFactory");
	camRemoveArtifact("resResearch1");
	camRemoveArtifact("resResearch2");
	camRemoveArtifact("resRelay");
	camRemoveArtifact("resSarissa");

	// Share research with Resistance
	camCompleteRes(camGetResearchLog(), THE_RESISTANCE);

	// Quietly remove python tank
	camSafeRemoveObject(getObject("resPython"));

	// Get all Resistance groups up to snuff
	updateAllyTemplates();
	checkResistanceGroups();

	queue("expandMap", camSecondsToMilliseconds(25));
}

function resAllyMessage()
{
	missionMessage("RESALLYMSG", "TRANS");
}

// Set the Resistance into attack mode against the player.
// Called if the player destroys a Resistance unit or important structure during negotiations
function aggroResistance()
{
	gameState.allowColourChange = false;

	// Resistance message to the player
	missionMessage("RESAGGRMSG", "TRANS");

	gameState.resistance.allianceState = "HOSTILE"; // very angry >:(
	queueStartProduction(THE_RESISTANCE, "GROUND"); // Rev up those factories

	hackRemoveMessage("RES_OLIVE", PROX_MSG, CAM_HUMAN_PLAYER);

	// Get a truck for the Resistance to defend their base
	if (difficulty <= MEDIUM) // Resistance gets wheeled truck on difficulties below Hard
	{
		camManageTrucks(THE_RESISTANCE, "resistanceMainBase", structSets.resistanceStructs, cTempl.reltruckw, camSecondsToMilliseconds(90));
	}
	else
	{
		camManageTrucks(THE_RESISTANCE, "resistanceMainBase", structSets.resistanceStructs, cTempl.reltruckht, camSecondsToMilliseconds(90));
	}
	if (difficulty === INSANE) // They also get a bonus Engineer on Insane
	{
		camManageTrucks(THE_RESISTANCE, "resistanceMainBase", structSets.resistanceStructs, cTempl.cyben, camSecondsToMilliseconds(60));
	}

	// Give the Resistance commander a rank depending on the difficulty
	if (difficulty === HARD) camSetDroidRank(getObject("resCommander"), "Green");
	if (difficulty === INSANE) camSetDroidRank(getObject("resCommander"), "Trained");
	if (difficulty <= EASY)
	{
		camSafeRemoveObject(getObject("resCommander"));
		var group = gameState.resistance.groups.commanderGroup;
		if (difficulty === EASY) 
		{
			// Replace it with a Viper commander
			var pos = camMakePos("resCommanderGroup");
			addLabel(addDroid(THE_RESISTANCE, pos.x, pos.y, _("Command Turret Viper Half-tracks"), "Body1REC", "HalfTrack", "", "", "CommandBrain01"), "resCommander");
			camManageGroup(group.id, group.order, group.data); // Set the group order
		}
		else if (difficulty === SUPEREASY)
		{
			// Remove the commander's units
			var droids = enumGroup(group.id);
			for (var i = 0; i < droids.length; i++)
			{
				camSafeRemoveObject(droids[i]);
			}
		}
	}
	

	var oliveTruck = getObject("resOliveTruck");
	if (oliveTruck !== null)
	{
		// Olive truck is (somehow) still alive. Tell it to retreat to base.
		var pos = camMakePos("resCyborgAssembly");
		orderDroidLoc(oliveTruck, DORDER_MOVE, pos.x, pos.y);
		queue("removeOliveTrucks", camSecondsToMilliseconds(30));
	}

	// Form a sneaky alliance between the Resistance and Coalition/Hellraisers
	setAlliance(THE_RESISTANCE, THE_COALITION, true);
	setAlliance(THE_RESISTANCE, HELLRAISERS, true);
	// And place a Coalition transport at the Resistance LZ
	var pos = camMakePos("resTransSpawn");
	addLabel(addDroid(THE_COALITION, pos.x, pos.y, _("Transport"), "TransporterBody", "V-Tol", "", "", "MG3-VTOL"), "coaResTransport");
	// Set a dummy group so we check if the player has spotted the transport
	addLabel({ type: GROUP, id: camMakeGroup(getObject("coaResTransport")) }, "coaResTransportST", false);
	resetLabel("coaResTransportST", CAM_HUMAN_PLAYER); // subscribe for eventGroupSeen

	queue("resCommanderAttack", camChangeOnDiff(camMinutesToMilliseconds(10)));
}

// Removes the olive trucks of factions who no longer need them
function removeOliveTrucks()
{
	// Resistance olive truck
	if (gameState.resistance.allianceState === "ALLIED" || gameState.resistance.allianceState === "HOSTILE")
	{
		camSafeRemoveObject(getObject("resOliveTruck"));
	}
	// AMPHOS olive Truck
	if (gameState.amphos.allianceState === "ALLIED" || gameState.amphos.allianceState === "HOSTILE")
	{
		camSafeRemoveObject(getObject("ampOliveTruck"));
	}
	// Hellraiser olive Truck
	if (gameState.hellraisers.allianceState === "ALLIED" || gameState.hellraisers.allianceState === "HOSTILE")
	{
		camSafeRemoveObject(getObject("helOliveTruck"));
	}
	// Coalition olive Truck
	if (gameState.coalition.allianceState === "ALLIED" || gameState.coalition.allianceState === "HOSTILE"
		|| gameState.resistance.allianceState === "HOSTILE" || gameState.hellraisers.allianceState === "HOSTILE")
	{
		camSafeRemoveObject(getObject("coaOliveTruck"));
	}
	// Royalist olive Truck
	if (gameState.resistance.allianceState === "ALLIED" || gameState.amphos.allianceState === "ALLIED"
		|| gameState.hellraisers.allianceState === "ALLIED" || gameState.coalition.allianceState === "ALLIED")
	{
		camSafeRemoveObject(getObject("royOliveTruck"));
	}
}

// Make the Resistance commander go attack the player. 
// If it's still alive.
function resCommanderAttack()
{
	
	if (getObject("resCommander") !== null)
	{
		// Tell the commander to try to attack the player
		camManageGroup(getObject("resCommander").group, CAM_ORDER_ATTACK, {
			targetPlayer: CAM_HUMAN_PLAYER,
			repair: 50
		});
	}
}

// Fly the transport out of the Resistance base
// Called when the player spots the transport
function coalitionEvac()
{
	var evacPos = camMakePos("coaTransSpawn");
	orderDroidLoc(getObject("coaResTransport"), DORDER_MOVE, evacPos.x, evacPos.y);
	queue("removeCoaResTransport", camSecondsToMilliseconds(6));

	if (difficulty >= HARD)
	{
		// On Hard+, the transport also drops some Coalition units to fight the player
		var droidList = [];
		var dropPos = camMakePos("resTransSpawn");
		var spawnList = [cTempl.cybmg, cTempl.cybmg, cTempl.cybmg, cTempl.cybmg];
		if (difficulty === INSANE) spawnList.push(cTempl.cybgr, cTempl.cybgr, cTempl.commcan);

		for (var template of spawnList)
		{
			droidList.push(addDroid(THE_COALITION, dropPos.x, dropPos.y, camNameTemplate(template), template.body, template.prop, "", "", template.weap));
		}

		camManageGroup(camMakeGroup(droidList), CAM_ORDER_ATTACK, {targetPlayer: CAM_HUMAN_PLAYER});
	}
}

function removeCoaResTransport()
{
	camSafeRemoveObject(getObject("coaResTransport"));
}

function camEnemyBaseEliminated_resistanceMainBase()
{
	queue("expandMap", camSecondsToMilliseconds(15));

	camDisableTruck("resistanceMainBase");
}

// Reveal the rest of the map after the Resistance is dealt with
function expandMap()
{
	playSound("pcv484.ogg"); // "Sensor Download"

	// Expand the map's scroll limits
	setScrollLimits(0, 0, 250, 224);

	gameState.phase = 1;
	queue("enableSouthCybFactory", camChangeOnDiff(camMinutesToMilliseconds(10)));
	queueStartProduction(HELLRAISERS, "GROUND");
	camCompleteRequiredResearch(COALITION_EXPANSION_RES, THE_COALITION);

	if (gameState.resistance.allianceState === "ERADICATED")
	{
		// If the resistance was eradicated by the player, set them up with a small base next to the Coalition's
		var pos = camMakePos("resSubBase");
		var truckDroid = addDroid(THE_RESISTANCE, pos.x, pos.y, _("Truck Cobra Half-tracks"), "Body5REC", "HalfTrack", "", "", "Spade1Mk1");
		camManageTrucks(THE_RESISTANCE, "resistanceSubBase", structSets.resistanceCoalitionSubBaseStructs.concat(structSets.resistanceSecondCommandCenter),
		 cTempl.remtruck, camChangeOnDiff(camSecondsToMilliseconds(60)), truckDroid);
		// Give them Coalition upgrades too
		camCompleteRequiredResearch(COALITION_START_RES, THE_RESISTANCE);
		camCompleteRequiredResearch(COALITION_EXPANSION_RES, THE_RESISTANCE);

		// Edit Resistance truck data
		if (difficulty >= HARD)
		{
			camTruckObsoleteStructure(THE_RESISTANCE, "Emplacement-MortarPit01", "Emplacement-MortarPit02");
			camTruckObsoleteStructure(THE_RESISTANCE, "PillBox5", "Tower-Projector");
		}
		if (difficulty === INSANE)
		{
			camTruckObsoleteStructure(THE_RESISTANCE, "WallTower03", "WallTower04");
		}

		// Swap the artifact in the Royalist Cyborg Factory 
		camAddArtifact({"royalistSouthCyborgFac": { tech: "R-Cyborg-Metals03", req: "R-Cyborg-Metals02" }}); // Cyborg Composite Alloys Mk3 (requires Mk2)
		camRemoveArtifact("helResearch1"); // Remove the artifact in the Hellraiser base
		camRemoveArtifact("royCompositeTank"); // Remove the artifact in the Royalist tank north of the river
	}

	// Ready the Royalist's Heavy commander
	var group = gameState.royalists.groundGroups.heavyCommanderGroup;
	var droids = enumArea("royHeavyCommGroup", ROYALISTS, false);
	for (var i = 0; i < droids.length; i++)
	{
		groupAdd(group.id, droids[i]);
	}
	camManageGroup(group.id, group.order, group.data);

	// Make a dummy group so we can check if the commander is spotted by the player via eventGroupSeen()
	addLabel({ type: GROUP, id: camMakeGroup(getObject("royHvyCommander")) }, "royHvyCommanderST", false);
	resetLabel("royHvyCommanderST", CAM_HUMAN_PLAYER); // subscribe for eventGroupSeen
	camManageGroup(getObject("royHvyCommander").group, CAM_ORDER_PATROL, {
		pos: [
			camMakePos("outerPos2"),
			camMakePos("outerPos4"),
			camMakePos("outerPos6"),
			camMakePos("outerPos3")
		],
		interval: camSecondsToMilliseconds(35),
		repair: 50
	});

	// Enable these Royalist "replacement" factories now, even though they probably won't be built for a while (if at all)
	camEnableFactory("royalistCoaRepFactory");
	camEnableFactory("royalistCoaRepCybFactory");
	camEnableFactory("royalistAmpRepFactory");
	camEnableFactory("royalistAmpRepVtolFactory");
	camEnableFactory("royalistPortFactory");
	camEnableFactory("royalistHelRepCybFactory");
}

// Triggered when the player approaches the Royalist's spy LZ
camAreaEvent("spyFOB", function(droid)
{
	// Only trigger if the player moves a droid in
	if (droid.player === CAM_HUMAN_PLAYER)
	{
		// Tell the group at the LZ to attack
		camManageGroup(camMakeGroup("spyLZ"), CAM_ORDER_ATTACK, {targetPlayer: CAM_HUMAN_PLAYER});
	}
	else
	{
		resetLabel("spyFOB", CAM_HUMAN_PLAYER);
	}
});

function camEnemyBaseDetected_spyBase()
{
	camCallOnce("activateSpyLZ");
}

function activateSpyLZ()
{
	// Start requesting transports
	setTimer("spyLZTransRequest", camChangeOnDiff(camMinutesToMilliseconds(8)));
}

// Called after a delay when the map expands.
// Also called when the player engages the southern Royalists forces.
function enableSouthCybFactory()
{
	camEnableFactory("royalistSouthCyborgFac");
}

function camEnemyBaseEliminated_southBase()
{
	// Introduction message from the Royalists
	if (allianceExistsBetween(CAM_HUMAN_PLAYER, THE_RESISTANCE))
	{
		missionMessage("ROYAMSG", "TRANS");
	}
	else
	{
		missionMessage("ROYEMSG", "TRANS");
	}

	camEnableFactory("amphosPortFactory");
}

function camEnemyBaseDetected_portBase()
{
	// Message introducing AMPHOS
	if (allianceExistsBetween(CAM_HUMAN_PLAYER, THE_RESISTANCE))
	{
		missionMessage("RESAMPMSG", "INTEL");
	}

	queueStartProduction(AMPHOS, "GROUND");
	camEnableFactory("amphosPortFactory");

	// Set up AMPHOS trucks
	camManageTrucks(AMPHOS, "southIslandBase", structSets.amphosSWIsleStructs, cTempl.ammtruck, camChangeOnDiff(camSecondsToMilliseconds(120)));
	camManageTrucks(AMPHOS, "westIslandBase", structSets.amphosWIsleStructs.concat(structSets.amphosBunkerIsleStructs), cTempl.ammtruck, camChangeOnDiff(camSecondsToMilliseconds(120)));
	camManageTrucks(AMPHOS, "northIslandBase", structSets.amphosNIsleStructs, cTempl.ammtruck, camChangeOnDiff(camSecondsToMilliseconds(120)));
	camManageTrucks(AMPHOS, "amphosMainBase", structSets.amphosMainBaseStructs, cTempl.ammtruck, camChangeOnDiff(camSecondsToMilliseconds(120)));
	camManageTrucks(AMPHOS, "ampNWIsleRepBase", structSets.amphosNWIsleRepStructs, cTempl.amhtruck, camChangeOnDiff(camSecondsToMilliseconds(120)));
	camManageTrucks(AMPHOS, "ampNWIsleRepBase", structSets.amphosNWIsleRepStructs, cTempl.ammtruck, camChangeOnDiff(camSecondsToMilliseconds(80)));
}

function camEnemyBaseEliminated_southIslandBase()
{
	if (gameState.amphos.allianceState === "NEUTRAL")
	{
		camCallOnce("ampPitch");
	}
}

function camEnemyBaseEliminated_westIslandBase()
{
	if (gameState.amphos.allianceState === "NEUTRAL")
	{
		camCallOnce("ampPitch");
	}
}

function camEnemyBaseEliminated_northIslandBase()
{
	if (gameState.amphos.allianceState === "NEUTRAL")
	{
		camCallOnce("ampPitch");
	}
}

function camEnemyBaseDetected_amphosMainBase()
{
	if (gameState.amphos.allianceState === "NEUTRAL")
	{
		camCallOnce("ampPitch");
	}
}

// Message from AMPHOS describing what it will take to start negotiations
function ampPitch()
{
	// AMPHOS pitch message
	if (!allianceExistsBetween(ROYALISTS, AMPHOS))
	{
		missionMessage("AMPBEGMSG", "TRANS");
	}
	else if (allianceExistsBetween(CAM_HUMAN_PLAYER, THE_RESISTANCE))
	{
		missionMessage("RESAMPPITCHMSG", "TRANS");
	}
	else
	{
		missionMessage("AMPPITCHMSG", "TRANS");
	}

	gameState.amphos.pitched = true;

	// Start checking for when conditions are met
	setTimer("checkAmphosOfferConditions", camSecondsToMilliseconds(5));
}

function camEnemyBaseEliminated_nwIslandBase() 
{
	if (gameState.amphos.allianceState === "NEUTRAL")
	{
		// Don't allow the Royalists to rebuild this base if the player is trying to let AMPHOS take it
		camDisableTruck("nwIslandBase");
	}
}

// Check if AMPHOS is ready to start negotiations
function checkAmphosOfferConditions()
{
	if (gameState.amphos.allianceState !== "NEUTRAL")
	{
		removeTimer("checkAmphosOfferConditions");
		return;
	}

	if (getObject("royHoverCommander") !== null)
	{
		return; // Commander not dead
	}

	if (gameState.amphos.requireNW && !camBaseIsEliminated("nwIslandBase"))
	{
		return; // Base not destroyed
	}

	// Make sure all these bases exist
	if (camBaseIsEliminated("southIslandBase")) return;
	if (camBaseIsEliminated("westIslandBase")) return;
	if (camBaseIsEliminated("northIslandBase")) return;
	if (gameState.amphos.requireNW && camBaseIsEliminated("ampNWIsleRepBase")) return;
	
	// All checks passed
	setupAmphosNegotiations();
	removeTimer("checkAmphosOfferConditions");
}

// Called when the Royalist hover commander is dead and AMPHOS controls all island bases
function setupAmphosNegotiations()
{
	// Message from AMPHOS
	if (gameState.amphos.requireNW)
	{
		missionMessage("AMPNEGOMSG", "TRANS");
	}
	else
	{
		missionMessage("AMPNEGOALLEMSG", "TRANS");
	}

	console("AMPHOS is offering to form an alliance with you!");
	playSound("pcv479.ogg"); // "Alliance offered"
	hackAddMessage("AMP_OLIVE", PROX_MSG, CAM_HUMAN_PLAYER);
	gameState.amphos.allianceState = "OFFER";

	// Move the truck to the negotiation zone 
	var oliveTruck = getObject("ampOliveTruck");
	var pos = camMakePos("ampOliveZone");
	orderDroidLoc(oliveTruck, DORDER_MOVE, pos.x, pos.y);
	if (gameState.resistance.allianceState === "ALLIED")
	{
		setAlliance(THE_RESISTANCE, AMPHOS, true);
	}
	if (gameState.hellraisers.allianceState === "ALLIED")
	{
		setAlliance(HELLRAISERS, AMPHOS, true);
	}
	if (gameState.coalition.allianceState === "ALLIED")
	{
		setAlliance(THE_COALITION, AMPHOS, true);
	}

	// Recall patrol groups that operate around the olive zone
	// (We wouldn't want them interrupting negotiations, would we?)
	var groupInfo = gameState.amphos.groups.southPatrolGroup;
	groupInfo.order = CAM_ORDER_DEFEND;
	groupInfo.data = {
		pos: camMakePos("eastPos1"),
		repair: 75
	};
	manageGroupBySize(groupInfo, false);
	var commander = getObject("ampCommander");
	if (commander !== null)
	{
		camManageGroup(commander.group, CAM_ORDER_DEFEND, {
			pos: camMakePos("eastPos1"),
			repair: 75
		});
	}
}

camAreaEvent("ampOliveZone", function(droid)
{
	// Only trigger if the player moves a droid in while AMPHOS is offering an alliance
	if ((droid.player === CAM_HUMAN_PLAYER || droid.player === AMPHOS) && gameState.amphos.allianceState === "OFFER")
	{
		// Find all the player's droids in this area
		var droids = enumArea("ampOliveZone", CAM_HUMAN_PLAYER, false);
		var ampAtTable = (enumArea("ampOliveZone", AMPHOS, false).length >= 1);
		// Make sure trucks are the only things inside, and AMPHOS has arrived in the zone
		if (onlyTrucks(droids) && ampAtTable) 
		{
			console("Negotiations beginning...");
			// Try to ally after a few seconds
			queue("allyAmphos", camSecondsToMilliseconds(6));
		}
		else
		{
			resetLabel("ampOliveZone", ALL_PLAYERS);
		}
	}
	else
	{
		resetLabel("ampOliveZone", ALL_PLAYERS);
	}
});

// Called after the negotiation check passes
function allyAmphos()
{
	if (!checkNegotiations("ampOliveZone", "ampOliveTruck"))
	{
		// Negotiations didn't finish correctly.
		return;
	}

	// Queue response message from Royalists
	queue("royAmphosResponse", camSecondsToMilliseconds(12));

	console("AMPHOS has allied with you!");
	console("AMPHOS has broken their alliance with the Royalists!");
	gameState.amphos.allianceState = "ALLIED";
	playSound("pcv477.ogg"); // "Alliance accepted!"
	setAlliance(CAM_HUMAN_PLAYER, AMPHOS, true);
	setAlliance(ROYALISTS, AMPHOS, false);
	// if (!gameState.amphos.requireNW)
	// {
	// 	// achievementMessage("Last-Minute Friendship", "Form an alliance with AMPHOS in their time of need");
	// }
	achievementMessage("Dealmaker", "Ally with AMPHOS and help them turn against the Royalists");

	camBaseChangeToFriendly("amphosMainBase");
	camBaseChangeToFriendly("southIslandBase");
	camBaseChangeToFriendly("westIslandBase");
	camBaseChangeToFriendly("ampNWIsleRepBase");
	camBaseChangeToFriendly("northIslandBase");
	camBaseChangeToFriendly("ampSouthGateLZ");

	hackRemoveMessage("AMP_OLIVE", PROX_MSG, CAM_HUMAN_PLAYER);

	// Move the olive truck back to base
	var oliveTruck = getObject("ampOliveTruck");
	var pos = camMakePos("ampVTOLAssembly");
	orderDroidLoc(oliveTruck, DORDER_MOVE, pos.x, pos.y);
	queue("removeOliveTrucks", camSecondsToMilliseconds(30));

	// Give AMPHOS another truck
	camManageTrucks(AMPHOS, "amphosMainBase", structSets.amphosMainBaseStructs, cTempl.ammtruck, camChangeOnDiff(camSecondsToMilliseconds(120)));

	// Donate the southeast oil derrick to the player (if the player hasn't already taken it)
	var giftDerrick = getObject("ampGiftDerrick");
	if (camDef(giftDerrick) && giftDerrick !== null)
	{
		donateObject(giftDerrick, CAM_HUMAN_PLAYER);
		playSound("pcv482.ogg"); // "Gift recieved"
	}

	if (gameState.amphos.requireNW) 
	{
		// Fine the player depending on how much AMPHOS stuff they destroyed
		var powerFine = 4000; // Max amount of power to fine the player
		if (gameState.resistance.allianceState === "ALLIED")
		{
			// Resistance will talk down their prices
			powerFine = 2000;
			if (gameState.amphos.numDestroyed * 10 < powerFine)
			{
				powerFine = gameState.amphos.numDestroyed * 10;
			}
		}
		else
		{
			if (gameState.amphos.numDestroyed * 25 < powerFine)
			{
				powerFine = gameState.amphos.numDestroyed * 25;
			}
		}
		setPower(playerPower(CAM_HUMAN_PLAYER) - powerFine, CAM_HUMAN_PLAYER);
		playSound("power-transferred.ogg"); // "Power Transferred"
	}

	// Upgrade AMPHOS structures if the player has already researched better tech
	updateAlliedStructs();

	// Share research with the player (and remove duplicate artifacts)
	enableResearch("R-Wpn-MG3Mk1", CAM_HUMAN_PLAYER); // Heavy Machinegun
	camRemoveArtifact("helMGTow");
	enableResearch("R-Sys-Engineering02", CAM_HUMAN_PLAYER); // Improved Engineering
	camRemoveArtifact("coaResearch3");
	enableResearch("R-Wpn-Rocket-LtA-TMk1", CAM_HUMAN_PLAYER); // Sarissa
	enableResearch("R-Wpn-Rocket02-MRL", CAM_HUMAN_PLAYER); // Mini-Rocket Array
	enableResearch("R-Wpn-Rocket03-HvAT", CAM_HUMAN_PLAYER); // Bunker Buster
	enableResearch("R-Wpn-Rocket01-LtAT", CAM_HUMAN_PLAYER); // Lancer
	camRemoveArtifact("royLancerTow1");
	camRemoveArtifact("royLancerTow2");
	enableResearch("R-Wpn-AAGun02", CAM_HUMAN_PLAYER); // Cyclone
	camRemoveArtifact("coaAASite");
	enableResearch("R-Struc-PowerModuleMk1", CAM_HUMAN_PLAYER); // Power Module
	camRemoveArtifact("royPowerGen");
	camRemoveArtifact("coaPowerGen");
	if (gameState.coalition.allianceState === "ALLIED") // Only if Coalition is also allied
	{
		enableResearch("R-Vehicle-Prop-VTOL", CAM_HUMAN_PLAYER); // VTOL Propulsion
		camRemoveArtifact("coalitionVtolFactory");
		camRemoveArtifact("royalistOuterVtolFac");
		camManageTrucks(AMPHOS, "ampSouthGateLZ", structSets.amphosSouthGateLZStructs, cTempl.amhtruck, camChangeOnDiff(camSecondsToMilliseconds(80)));
		achievementMessage("Master Negotiator", "Form an alliance with all factions");
	}
	playSound("pcv485.ogg"); // "Technology transferred"

	// Remove AMPHOS artifacts
	camRemoveArtifact("ampSarissa");
	camRemoveArtifact("ampMGTow");
	camRemoveArtifact("ampCBTow");
	camRemoveArtifact("amphosPortFactory");
	camRemoveArtifact("ampMRA");
	camRemoveArtifact("ampResearchOuter");
	camRemoveArtifact("ampResearchInner");
	camRemoveArtifact("ampAASite");
	camRemoveArtifact("ampPowerGen");
	camRemoveArtifact("amphosVtolFactory");
	camRemoveArtifact("amphosMainFactory2");
	camRemoveArtifact("ampHQ");

	// Share research with AMPHOS
	camCompleteRes(camGetResearchLog(), AMPHOS);

	// Get all AMPHOS groups up to snuff
	updateAllyTemplates();
	checkAmphosGroups();
	queueStartProduction(AMPHOS, "VTOL");

	// Get AMPHOS patrol groups back to whatever they were doing
	var groupInfo = gameState.amphos.groups.southPatrolGroup;
	groupInfo.order = CAM_ORDER_PATROL;
	groupInfo.data = {
		pos: [
			camMakePos("eastPos9"),
			camMakePos("eastPos10"),
			camMakePos("eastPos12")
		],
		interval: camSecondsToMilliseconds(10),
		repair: 75
	};
	manageGroupBySize(groupInfo, false);
	var commander = getObject("ampCommander");
	if (commander !== null)
	{
		camManageGroup(commander.group, CAM_ORDER_PATROL, {
			pos: [
				camMakePos("eastPos7"),
				camMakePos("eastPos2"),
				camMakePos("eastPos10"),
				camMakePos("eastPos8"),
				camMakePos("eastPos5")
			],
			interval: camSecondsToMilliseconds(30),
			repair: 75
		});

		// Also grant an achievement here
		achievementMessage("Brommander", "Ally with AMPHOS without destroying their command hover");
	}

	camCallOnce("setPhaseTwo");
	checkPhaseThree();

	if (gameState.coalition.allianceState === "ALLIED" 
		|| gameState.coalition.allianceState === "ERADICATED")
	{
		// Allow Royalists to start getting late-game research.
		camCallOnce("grantRoyalistTier2Research");
	}

	// Allow the Royalists to try to rebuild the NW island base
	camEnableTruck("nwIslandBase");
}

// Live Queen Reaction
function royAmphosResponse()
{
	if (gameState.amphos.allianceState === "ALLIED")
	{
		missionMessage("ROYAMPAMSG", "TRANS");
	}
	else if (gameState.amphos.allianceState === "ERADICATED")
	{
		missionMessage("ROYAMPEMSG", "TRANS");
	}
}

// Called if the player destroys any important main base structures, or destroys any important structure
// when an alliance is being offered
function aggroAmphos()
{
	if (gameState.amphos.allianceState === "OFFER")
	{
		// If AMPHOS had set up negotiations, cancel them
		hackRemoveMessage("AMP_OLIVE", PROX_MSG, CAM_HUMAN_PLAYER);

		// Message from AMPHOS about being betrayed
		missionMessage("AMPBTRYMSG", "TRANS");

		// Get AMPHOS patrol groups back to whatever they were doing
		var groupInfo = gameState.amphos.groups.southPatrolGroup;
		groupInfo.order = CAM_ORDER_PATROL;
		groupInfo.data = {
			pos: [
				camMakePos("eastPos9"),
				camMakePos("eastPos10"),
				camMakePos("eastPos12")
			],
			interval: camSecondsToMilliseconds(10),
			repair: 75
		};
		manageGroupBySize(groupInfo, false);
		var commander = getObject("ampCommander");
		if (commander !== null)
		{
			camManageGroup(commander.group, CAM_ORDER_PATROL, {
				pos: [
					camMakePos("eastPos7"),
					camMakePos("eastPos2"),
					camMakePos("eastPos10"),
					camMakePos("eastPos8"),
					camMakePos("eastPos5")
				],
				interval: camSecondsToMilliseconds(30),
				repair: 75
			});
		}
	}
	else
	{
		// Message from AMPHOS about becoming aggressive
		missionMessage("AMPAGGRMSG", "TRANS");

		removeTimer("checkAmphosOfferConditions");
	}

	gameState.amphos.allianceState = "HOSTILE";
	queueStartProduction(AMPHOS, "GROUND");
	queueStartProduction(AMPHOS, "VTOL");

	if (gameState.resistance.allianceState === "ALLIED")
	{
		setAlliance(THE_RESISTANCE, AMPHOS, false);
	}
	if (gameState.hellraisers.allianceState === "ALLIED")
	{
		setAlliance(HELLRAISERS, AMPHOS, false);
	}
	if (gameState.coalition.allianceState === "ALLIED")
	{
		setAlliance(THE_COALITION, AMPHOS, false);
	}

	// Get an extra truck for the AMPHOS main base
	if (difficulty <= MEDIUM) 
	{
		camManageTrucks(AMPHOS, "amphosMainBase", structSets.amphosMainBaseStructs, cTempl.ammtruck, camChangeOnDiff(camSecondsToMilliseconds(120)));
	}
	else // AMPHOS gets a Python truck on Hard and above
	{
		camManageTrucks(AMPHOS, "amphosMainBase", structSets.amphosMainBaseStructs, cTempl.amhtruck, camChangeOnDiff(camSecondsToMilliseconds(120)));
	}
	if (difficulty === INSANE) // And another extra truck on Insane
	{
		camManageTrucks(AMPHOS, "amphosMainBase", structSets.amphosMainBaseStructs, cTempl.ammtruck, camChangeOnDiff(camSecondsToMilliseconds(120)));
	}

	var oliveTruck = getObject("ampOliveTruck");
	if (oliveTruck !== null)
	{
		// Tell the olive truck to retreat to base.
		var pos = camMakePos("ampVTOLAssembly");
		orderDroidLoc(oliveTruck, DORDER_MOVE, pos.x, pos.y);
		queue("removeOliveTrucks", camSecondsToMilliseconds(30));
	}

	// Update the templates in AMPHOS factories
	var ampMainTemplates1 = [ cTempl.ammhmg, cTempl.ammmra, cTempl.amlpod, cTempl.ammsens ];
	if (difficulty >= MEDIUM) ampMainTemplates1.push(cTempl.amhrip);
	if (difficulty >= HARD) ampMainTemplates1 = camArrayReplaceWith(ampMainTemplates1, cTempl.amlpod, cTempl.ammpod);
	if (difficulty === INSANE) ampMainTemplates1.push(cTempl.amhtk);
	var ampMainTemplates2 = [ cTempl.ammlan, cTempl.ammhmg, cTempl.amlsar ];
	if (difficulty >= MEDIUM) ampMainTemplates2.push(cTempl.ammbb);
	if (difficulty >= HARD) ampMainTemplates2 = camArrayReplaceWith(ampMainTemplates2, cTempl.amlsar, cTempl.amhlan);
	if (difficulty >= HARD) ampMainTemplates2 = camArrayReplaceWith(ampMainTemplates2, cTempl.ammbb, cTempl.amhbb);
	if (difficulty >= MEDIUM && camIsResearched("R-Struc-VTOLFactory")) ampMainTemplates2.push(cTempl.amhhaa);
	camSetFactoryTemplates("amphosMainFactory1", ampMainTemplates1);
	camSetFactoryTemplates("amphosMainFactory1", ampMainTemplates2);

	queue("ampCommanderAttack", camChangeOnDiff(camMinutesToMilliseconds(12)));
	camCallOnce("setPhaseTwo");

	// Allow the Royalists to try to rebuild the NW island base
	camEnableTruck("nwIslandBase");
}

// Make the AMPHOS commander go attack the player. 
function ampCommanderAttack()
{
	if (getObject("ampCommander") !== null)
	{
		// Tell the commander to try to attack the player
		camManageGroup(getObject("ampCommander").group, CAM_ORDER_ATTACK, {
			targetPlayer: CAM_HUMAN_PLAYER,
			repair: 75
		});
	}
}

// Triggered when approaching the Hellraiser base
camAreaEvent("helPitchTrigger", function(droid)
{
	// Only trigger if the player moves a droid in
	if (droid.player === CAM_HUMAN_PLAYER)
	{
		camCallOnce("helPitch");
	}
	else
	{
		resetLabel("helPitchTrigger", CAM_HUMAN_PLAYER);
	}
});

// Message from the Hellraisers describing what it will take to start negotiations
// Called when the player crosses the Hellraiser main base bridge or destroys a non-important
// main base structure
function helPitch()
{
	// Hellraiser pitch message
	missionMessage("HELPITCHMSG", "TRANS");

	gameState.hellraisers.pitched = true;

	// Increase the size of the Resistance support group
	gameState.resistance.groups.playerSupportGroup.maxSize += 4;

	// Give the Hellraisers some trucks to start rebuilding structures
	camManageTrucks(HELLRAISERS, "hellraiserMainBase", structSets.hellraiserStructs, cTempl.hemtruckt, camChangeOnDiff(camSecondsToMilliseconds(150)));
	if (difficulty <= HARD)
	{
		camManageTrucks(HELLRAISERS, "hellraiserMainBase", structSets.hellraiserStructs, cTempl.hemtruckht, camChangeOnDiff(camSecondsToMilliseconds(150)));
	}
	else // Mantis Tracks on Insane
	{
		camManageTrucks(HELLRAISERS, "hellraiserMainBase", structSets.hellraiserStructs, cTempl.hehtruckt, camChangeOnDiff(camSecondsToMilliseconds(150)));
	}

	if (difficulty === INSANE)
	{
		camTruckObsoleteStructure(HELLRAISERS, "GuardTower2", "GuardTower1");
		camTruckObsoleteStructure(HELLRAISERS, "PillBox2", "PillBox1");
	}

	// Calculate how many structs need to be rebuilt before negotiations may begin
	// This number will either be the total amount of Hellraiser structures, or the
	// current number of structures + 20, depending on which is lower
	if (enumStruct(HELLRAISERS).length + 20 < gameState.hellraisers.totalStructs)
	{
		gameState.hellraisers.structThreshold = enumStruct(HELLRAISERS).length + 20;
	}
	// By default, structThreshold equals the original amount of structures
}

// Called when the Hellraisers have rebuilt enough structures
function setupHellraiserNegotiations()
{
	// Message from the Hellraisers
	missionMessage("HELNEGOMSG", "TRANS");

	console("The Hellraisers are offering to form an alliance with you!");
	playSound("pcv479.ogg"); // "Alliance offered"
	hackAddMessage("HEL_OLIVE", PROX_MSG, CAM_HUMAN_PLAYER);
	gameState.hellraisers.allianceState = "OFFER";

	// Move the truck to the negotiation zone 
	var oliveTruck = getObject("helOliveTruck");
	var pos = camMakePos("helOliveZone");
	orderDroidLoc(oliveTruck, DORDER_MOVE, pos.x, pos.y);

	if (gameState.resistance.allianceState === "ALLIED")
	{
		setAlliance(THE_RESISTANCE, HELLRAISERS, true);
	}
	if (gameState.amphos.allianceState === "ALLIED")
	{
		setAlliance(AMPHOS, HELLRAISERS, true);
	}
}

camAreaEvent("helOliveZone", function(droid)
{
	// Only trigger if the player moves a droid in while the Hellraisers are offering an alliance
	if ((droid.player === CAM_HUMAN_PLAYER || droid.player === HELLRAISERS) && gameState.hellraisers.allianceState === "OFFER")
	{
		// Find all the player's droids in this area
		var droids = enumArea("helOliveZone", CAM_HUMAN_PLAYER, false);
		var helAtTable = (enumArea("helOliveZone", HELLRAISERS, false).length >= 1);
		// Make sure trucks are the only things inside, and the Hellraisers have arrived in the zone
		if (onlyTrucks(droids) && helAtTable) 
		{
			console("Negotiations beginning...");
			// Try to ally after a few seconds
			queue("allyHellraisers", camSecondsToMilliseconds(6));
		}
		else
		{
			resetLabel("helOliveZone", ALL_PLAYERS);
		}
	}
	else
	{
		resetLabel("helOliveZone", ALL_PLAYERS);
	}
});

// Triggered when entering the Hellraiser base through the left main entrance
camAreaEvent("helAggroTrigger1", function(droid)
{
	helTrigger(droid, "helAggroTrigger1");
});

// Triggered when entering the Hellraiser base through the river entrance
camAreaEvent("helAggroTrigger2", function(droid)
{
	helTrigger(droid, "helAggroTrigger2");
});

// Triggered when entering the Hellraiser base through the right main entrance
camAreaEvent("helAggroTrigger3", function(droid)
{
	helTrigger(droid, "helAggroTrigger3");
});

// Triggered when entering the Hellraiser base through the northern bridge entrance(s)
camAreaEvent("helAggroTrigger4", function(droid)
{
	helTrigger(droid, "helAggroTrigger4");
});

function helTrigger(droid, triggerLabel)
{
	// Only trigger if the player moves a droid in while not allied
	if (droid.player === CAM_HUMAN_PLAYER && gameState.hellraisers.allianceState !== "ALLIED")
	{
		camCallOnce("aggroHellraisers");
	}
	else
	{
		resetLabel(triggerLabel, CAM_HUMAN_PLAYER);
	}
}

function allyHellraisers()
{
	if (!checkNegotiations("helOliveZone", "helOliveTruck"))
	{
		// Negotiations didn't finish correctly.
		if (getObject("helOliveTruck") === null)
		{
			// Olive truck has been killed, get mad.
			camCallOnce("aggroHellraisers");
		}
		return;
	}

	console("The Hellraisers have allied with you!");
	gameState.hellraisers.allianceState = "ALLIED";
	playSound("pcv477.ogg"); // "Alliance accepted!"
	setAlliance(CAM_HUMAN_PLAYER, HELLRAISERS, true);
	if (gameState.resistance.allianceState === "ALLIED")
	{
		setAlliance(THE_RESISTANCE, HELLRAISERS, true);
	}
	if (gameState.amphos.allianceState === "ALLIED")
	{
		setAlliance(AMPHOS, HELLRAISERS, true);
	}
	achievementMessage("Firestarter", "Ally with the Hellraisers");

	camBaseChangeToFriendly("hellraiserMainBase");

	hackRemoveMessage("HEL_OLIVE", PROX_MSG, CAM_HUMAN_PLAYER);

	// Move the olive truck back to base
	var oliveTruck = getObject("helOliveTruck");
	var pos = camMakePos("helCyborgAssembly1");
	orderDroidLoc(oliveTruck, DORDER_MOVE, pos.x, pos.y);
	queue("removeOliveTrucks", camSecondsToMilliseconds(30));

	// Give the Hellraisers an extra Engineer
	camManageTrucks(HELLRAISERS, "hellraiserMainBase", structSets.hellraiserStructs, cTempl.cyben, camSecondsToMilliseconds(60));

	// Upgrade Hellraiser structures if the player has already researched better tech
	updateAlliedStructs();

	// Share research with the player (and remove duplicate artifacts)
	enableResearch("R-Wpn-MG3Mk1", CAM_HUMAN_PLAYER); // Heavy Machinegun
	camRemoveArtifact("ampMGTow");
	enableResearch("R-Vehicle-Metals03", CAM_HUMAN_PLAYER); // Composite Alloys Mk 3
	enableResearch("R-Wpn-Flamer-Damage03", CAM_HUMAN_PLAYER); // High Temperature Flamer Gel Mk 3
	
	playSound("pcv485.ogg"); // "Technology transferred"

	// Remove Hellraiser artifacts
	camRemoveArtifact("helMGTow");
	camRemoveArtifact("hellraiserFactory");
	camRemoveArtifact("helHQ");
	camRemoveArtifact("helResearch1");
	camRemoveArtifact("helResearch2");

	// Remove oil drums from the Hellraiser base
	var drums = enumArea("hellraiserBase", ALL_PLAYERS, false).filter(function(obj)
	{
		return (obj.type === FEATURE && obj.stattype === OIL_DRUM);
	});
	for (var i = drums.length - 1; i >= 0; i--)
	{
		camSafeRemoveObject(drums[i]);
	}

	// Share research with the Hellraisers
	camCompleteRes(camGetResearchLog(), HELLRAISERS);

	// Get all Hellraiser groups up to snuff
	updateAllyTemplates();
	checkHellraiserGroups();

	queue("coaPitch", camSecondsToMilliseconds(40));
	camCallOnce("setPhaseTwo");
	checkPhaseThree();
}

function aggroHellraisers()
{
	if (gameState.amphos.allianceState === "OFFER")
	{
		// Message about being betrayed
		missionMessage("HELBTRYMSG", "TRANS");

		// If the Hellraisers had set up negotiations, cancel them
		hackRemoveMessage("HEL_OLIVE", PROX_MSG, CAM_HUMAN_PLAYER);
	}
	else
	{
		// Message about becoming angry
		missionMessage("HELAGGRMSG", "TRANS");
	}

	gameState.hellraisers.allianceState = "HOSTILE";
	queueStartProduction(HELLRAISERS, "GROUND");

	if (gameState.resistance.allianceState === "ALLIED")
	{
		setAlliance(THE_RESISTANCE, HELLRAISERS, false);
	}
	if (gameState.amphos.allianceState === "ALLIED")
	{
		setAlliance(AMPHOS, HELLRAISERS, false);
	}

	// Give the Hellraisers an Engineer
	camManageTrucks(HELLRAISERS, "hellraiserMainBase", structSets.hellraiserStructs, cTempl.cyben, camSecondsToMilliseconds(90));

	var oliveTruck = getObject("helOliveTruck");
	if (oliveTruck !== null)
	{
		// Tell the olive truck to retreat to base.
		var pos = camMakePos("helCyborgAssembly1");
		orderDroidLoc(oliveTruck, DORDER_MOVE, pos.x, pos.y);
		queue("removeOliveTrucks", camSecondsToMilliseconds(30));
	}

	// Update the templates in Hellraiser factories
	var helFactoryTemplates = [ cTempl.hehinf, cTempl.hellrep, cTempl.heltwmg, cTempl.helflam, cTempl.hemlcan, cTempl.helsensw ];
	if (difficulty >= MEDIUM) helFactoryTemplates = camArrayReplaceWith(helFactoryTemplates, cTempl.heltwmg, cTempl.helhmg);
	if (difficulty >= MEDIUM) helFactoryTemplates = camArrayReplaceWith(helFactoryTemplates, cTempl.helsensw, cTempl.helsensht);
	if (difficulty >= MEDIUM) helFactoryTemplates.push(cTempl.hemimorht);
	if (difficulty >= HARD) helFactoryTemplates = camArrayReplaceWith(helFactoryTemplates, cTempl.helhmg, cTempl.hemhmght);
	if (difficulty >= HARD) helFactoryTemplates = camArrayReplaceWith(helFactoryTemplates, cTempl.helflam, cTempl.hemflam);
	if (difficulty >= HARD) helFactoryTemplates = camArrayReplaceWith(helFactoryTemplates, cTempl.hemimorht, cTempl.hemimort);
	if (difficulty === INSANE) helFactoryTemplates = camArrayReplaceWith(helFactoryTemplates, cTempl.hemhmght, cTempl.hemhmgt);
	if (difficulty === INSANE) helFactoryTemplates = camArrayReplaceWith(helFactoryTemplates, cTempl.hemflam, cTempl.heminf);
	if (difficulty === INSANE) helFactoryTemplates = camArrayReplaceWith(helFactoryTemplates, cTempl.hemlcan, cTempl.hemmcanht);
	if (difficulty === INSANE) helFactoryTemplates = camArrayReplaceWith(helFactoryTemplates, cTempl.helsensht, cTempl.hemsensht);
	var helCybTemplates1 = [ cTempl.cybmg, cTempl.cybfl, cTempl.cybfl ];
	if (difficulty >= HARD) helCybTemplates1 = camArrayReplaceWith(helCybTemplates1, cTempl.cybfl, cTempl.cybth);
	var helCybTemplates2 = [ cTempl.cybca, cTempl.cybfl, cTempl.cybfl ];
	if (difficulty >= HARD) helCybTemplates2 = camArrayReplaceWith(helCybTemplates2, cTempl.cybfl, cTempl.cybth);
	if (difficulty >= MEDIUM && camIsResearched("R-Struc-VTOLFactory")) helFactoryTemplates.push(cTempl.hemlaa);
	camSetFactoryTemplates("hellraiserFactory", helFactoryTemplates);
	camSetFactoryTemplates("hellraiserCybFac1", helCybTemplates1);
	camSetFactoryTemplates("hellraiserCybFac2", helCybTemplates2);

	// Update truck data
	if (difficulty === MEDIUM)
	{
		camTruckObsoleteStructure(HELLRAISERS, "Sys-SensoTower01", "Sys-SensoTower02", true); // Don't demolish
		camTruckObsoleteStructure(HELLRAISERS, "GuardTower2", "GuardTower1", true);
		camTruckObsoleteStructure(HELLRAISERS, "PillBox2", "PillBox1", true);
	}
	else if (difficulty === HARD)
	{
		camTruckObsoleteStructure(HELLRAISERS, "Sys-SensoTower01", "Sys-SensoTower02"); // Do demolish
		camTruckObsoleteStructure(HELLRAISERS, "GuardTower2", "GuardTower1");
		camTruckObsoleteStructure(HELLRAISERS, "PillBox2", "PillBox1");
		camTruckObsoleteStructure(HELLRAISERS, "PillBox5", "Tower-Projector");
	}
	else if (difficulty === INSANE)
	{
		camTruckObsoleteStructure(HELLRAISERS, "Sys-SensoTower01", "Sys-SensoTower02");
		camTruckObsoleteStructure(HELLRAISERS, "GuardTower2", "GuardTower3");
		camTruckObsoleteStructure(HELLRAISERS, "GuardTower1", "GuardTower3");
		camTruckObsoleteStructure(HELLRAISERS, "PillBox2", "PillBox1");
		camTruckObsoleteStructure(HELLRAISERS, "PillBox5", "Tower-Projector");
		camTruckObsoleteStructure(HELLRAISERS, "WallTower02", "WallTower03");
	}

	// Start requesting reinforcements
	var coaReinforceMinutes = 9;
	if (!allianceExistsBetween(CAM_HUMAN_PLAYER, THE_RESISTANCE))
	{
		// Transports come in slower, but Resistance units are also sent over land
		coaReinforceMinutes = 12;
		camEnableFactory("resistanceSubFactory");
		camEnableFactory("resistanceSubCybFactory");
		queue("coaThreat", camSecondsToMilliseconds(30));
		gameState.coalition.proxyHostile = true;
	}
	if (gameState.amphos.allianceState === "ERADICATED" || gameState.amphos.allianceState === "ALLIED")
	{
		// Reinforce faster if the player has gotten technology from AMPHOS
		coaReinforceMinutes /= 2;
	}
	setTimer("hellraiserLZTransRequest", camChangeOnDiff(camMinutesToMilliseconds(coaReinforceMinutes)));
	if (difficulty >= MEDIUM)
	{
		// Call in Coalition VTOL support
		gameState.coalition.mainVTOLGroup.order = CAM_ORDER_ATTACK;
		gameState.coalition.mainVTOLGroup.data = { targetPlayer: CAM_HUMAN_PLAYER, pos: camMakePos("playerBasePos") };
	}

	camCallOnce("setPhaseTwo");
}

// Threatening message from the Coalition
function coaThreat()
{
	missionMessage("COATHREATMSG", "TRANS");
}

function camEnemyBaseDetected_nwIslandBase()
{
	camCallOnce("setPhaseTwo");

	if (gameState.amphos.allianceState === "NEUTRAL")
	{
		camCallOnce("ampPitch");
	}
}

function camEnemyBaseDetected_eastCoastBase()
{
	camCallOnce("setPhaseTwo");
}

function camEnemyBaseDetected_riverTownBase()
{
	camCallOnce("setPhaseTwo");
	camCallOnce("activateRiverLZ");
}

function camEnemyBaseDetected_riverLZBase()
{
	camCallOnce("setPhaseTwo");
	camCallOnce("activateRiverLZ");
}

function activateRiverLZ()
{
	// Start requesting transports
	setTimer("riverLZTransRequest", camChangeOnDiff(camMinutesToMilliseconds(8)));
}

function camEnemyBaseDetected_eastCoastBase()
{
	camCallOnce("setPhaseTwo");
	camCallOnce("activateMountainLZ");
}

function camEnemyBaseDetected_mountainLZBase()
{
	camCallOnce("setPhaseTwo");
	camCallOnce("activateMountainLZ");
}

function activateMountainLZ()
{
	// Start requesting transports
	setTimer("mountainLZTransRequest", camChangeOnDiff(camMinutesToMilliseconds(8)));
}

function camEnemyBaseDetected_southGate()
{
	camCallOnce("setPhaseTwo");
	camCallOnce("activateCoastLZ");
}

function activateCoastLZ()
{
	// Start requesting transports
	setTimer("coastLZTransRequest", camChangeOnDiff(camMinutesToMilliseconds(8)));
}

function camEnemyBaseDetected_royalistHowitzerFOB()
{
	camCallOnce("setPhaseTwo");
	camCallOnce("activatehowitzerLZ");
}

function activatehowitzerLZ()
{
	// Start requesting transports
	setTimer("howitzerLZTransRequest", camChangeOnDiff(camMinutesToMilliseconds(8)));
}

// Called when the player discovers any of the Royalist bases across the river, or when
// the player aggravates/allies with either the Hellraisers or AMPHOS.
// Activates Coalition and Royalist factories and assigns trucks
function setPhaseTwo()
{
	gameState.phase = 2;

	setTimer("grantRoyalistResearch", camChangeOnDiff(camMinutesToMilliseconds(8)));

	// Enable Royalist and Coalition factories if they need units
	checkCoalitionGroups();
	checkRoyalistGroundGroups();
	checkRoyalistHoverGroups();

	// Start VTOL production
	queueStartProduction(THE_COALITION, "VTOL");
	queueStartProduction(ROYALISTS, "VTOL");

	var truckTime = camChangeOnDiff(camSecondsToMilliseconds(120));
	var cybTime = camChangeOnDiff(camSecondsToMilliseconds(60));

	// Truckpocalypse
	camManageTrucks(THE_COALITION, "coalitionBridgeBase", structSets.coalitionBridgeStructs, cTempl.comtruckt, truckTime);
	camManageTrucks(THE_COALITION, "seCoalitionBase", structSets.coalitionSEStructs, cTempl.comtruckht, truckTime);
	camManageTrucks(THE_COALITION, "riverDeltaBase", structSets.coalitionDeltaStructs, cTempl.comtruckt, truckTime);
	camManageTrucks(THE_COALITION, "sunkenPlainsBase", structSets.coalitionsunkenPlainsStructs, cTempl.comtruckt, truckTime);
	camManageTrucks(THE_COALITION, "sunkenPlainsBase", structSets.coalitionsunkenPlainsStructs, cTempl.cyben, cybTime);
	camManageTrucks(THE_COALITION, "neCoalitionBase", structSets.coalitionNEStructs, cTempl.comtruckht, truckTime);
	camManageTrucks(THE_COALITION, "coalitionMainBase", structSets.coalitionMainBaseStructs, cTempl.comtruckht, truckTime);
	camManageTrucks(THE_COALITION, "coalitionMainBase", structSets.coalitionMainBaseStructs, cTempl.comtruckt, truckTime);
	camManageTrucks(THE_COALITION, "coalitionMainBase", structSets.coalitionMainBaseStructs, cTempl.cyben, cybTime);

	camManageTrucks(ROYALISTS, "southBase", structSets.royalistSouthStructs, cTempl.romtruckh, truckTime);
	camManageTrucks(ROYALISTS, "riverTownBase", structSets.royalistRiverTownStructs, cTempl.romtruckt, truckTime);
	camManageTrucks(ROYALISTS, "riverLZBase", structSets.royalistRiverLZStructs, cTempl.romtruckt, truckTime);
	camManageTrucks(ROYALISTS, "eastCoastBase", structSets.royalistEastCoastStructs, cTempl.romtruckt, truckTime);
	camManageTrucks(ROYALISTS, "southGate", structSets.royalistSouthGateStructs, cTempl.romtruckt, truckTime);
	camManageTrucks(ROYALISTS, "royalistCentralFactoryZone", structSets.royalistCentralFactoryStructs, cTempl.romtruckt, truckTime);
	camManageTrucks(ROYALISTS, "westGate", structSets.royalistwestGateStructs, cTempl.romtruckh, truckTime);
	camManageTrucks(ROYALISTS, "royalistMountainCheckpoint", structSets.royalistCheckpointStructs, cTempl.romtruckt, truckTime);
	camManageTrucks(ROYALISTS, "royalistHowitzerFOB", structSets.royalistHowitzerBaseStructs, cTempl.romtruckt, truckTime);
	camManageTrucks(ROYALISTS, "southRoyalWhirlwindHill", structSets.royalistsouthWhirlwindHillStructs, cTempl.romtruckt, truckTime);
	camManageTrucks(ROYALISTS, "royalistVtolBase", structSets.royalistvtolBaseStructs, cTempl.romtruckh, truckTime);
	camManageTrucks(ROYALISTS, "royalistMainBaseGate", structSets.royalistMainDefenceStructs, cTempl.romtruckt, truckTime);
	camManageTrucks(ROYALISTS, "royalMainBase", structSets.royalistMainBaseStructs, cTempl.romtruckt, truckTime);
	camManageTrucks(ROYALISTS, "royalistOuterGate", structSets.royalistOuterBaseStructs, cTempl.romtruckh, truckTime);
	camManageTrucks(ROYALISTS, "royalistOuterGate", structSets.royalistOuterBaseStructs, cTempl.romtruckt, truckTime);
	camManageTrucks(ROYALISTS, "northLakeBase", structSets.royalistNorthLakeStructs, cTempl.romtruckh, truckTime);
	camManageTrucks(ROYALISTS, "nwIslandBase", structSets.royalistNWIsleStructs, cTempl.romtruckh, truckTime);

	camManageTrucks(ROYALISTS, "royCoalitionRepBase", structSets.royalistCoalitionBaseRepStructs, cTempl.romtruckt, truckTime);
	camManageTrucks(ROYALISTS, "royCoalitionRepBase", structSets.royalistCoalitionBaseRepStructs, cTempl.romtruckt, truckTime);
	camManageTrucks(ROYALISTS, "royPlainsRepBase", structSets.royalistPlainsRepStructs, cTempl.romtruckt, truckTime);
	camManageTrucks(ROYALISTS, "royDeltaRepBase", structSets.royalistDeltaRepStructs, cTempl.romtruckt, truckTime);
	camManageTrucks(ROYALISTS, "royBridgeRepBase", structSets.royalistBridgeRepStructs, cTempl.romtruckt, truckTime);
	camManageTrucks(ROYALISTS, "roySWIsleRepBase", structSets.royalistSWIsleRepStructs, cTempl.romtruckh, truckTime);
	camManageTrucks(ROYALISTS, "royPortRepBase", structSets.royalistPortRepStructs, cTempl.romtruckh, truckTime);
	camManageTrucks(ROYALISTS, "royAmphosRepBase", structSets.royalistAMPHOSBaseRepStructs, cTempl.romtruckh, truckTime);
	camManageTrucks(ROYALISTS, "royAmphosRepBase", structSets.royalistAMPHOSBaseRepStructs, cTempl.romtruckh, truckTime);
	camManageTrucks(ROYALISTS, "royHellraiserRepBase", structSets.royalistHellraiserRepStructs, cTempl.romtruckt, truckTime);
	camManageTrucks(ROYALISTS, "royHellraiserRepBase", structSets.royalistHellraiserRepStructs, cTempl.romtruckt, truckTime);

	// Update Coalition truck data
	if (difficulty === MEDIUM)
	{
		camTruckObsoleteStructure(THE_COALITION, "Emplacement-MortarPit01", "Emplacement-MortarPit02", true);
	}
	else if (difficulty === HARD)
	{
		camTruckObsoleteStructure(THE_COALITION, "Emplacement-MortarPit01", "Emplacement-MortarPit02");
		camTruckObsoleteStructure(THE_COALITION, "WallTower03", "WallTower04", true);
	}
	else if (difficulty === INSANE)
	{
		camTruckObsoleteStructure(THE_COALITION, "Emplacement-MortarPit01", "Emplacement-MortarPit02");
		camTruckObsoleteStructure(THE_COALITION, "WallTower03", "WallTower04");
	}
}

// Called after the player allies with or eradicates the Hellraisers
function coaPitch()
{
	// Coalition message to the player
	if (gameState.resistance.allianceState === "ALLIED" && gameState.hellraisers.allianceState === "ALLIED")
	{
		if (!camBaseIsEliminated("royalistCentralFactoryZone"))
		{
			missionMessage("COAPITCHMSG", "TRANS");
		}
		else
		{
			missionMessage("COAANTIPITCHMSG", "TRANS");
		}
		gameState.coalition.allowAlliance = true;
	}
	else if (!allianceExistsBetween(CAM_HUMAN_PLAYER, THE_RESISTANCE))
	{
		missionMessage("COAWARN1MSG", "TRANS");
	}
	else if (gameState.hellraisers.allianceState === "ALLIED")
	{
		missionMessage("COAWARN2MSG", "TRANS");
	}
	queue("resCoaResponse", camSecondsToMilliseconds(8));

	// Make sure the Coalition's VTOLs aren't harrasing the player (if they were attacking the Hellraisers) 
	gameState.coalition.mainVTOLGroup.order = CAM_ORDER_DEFEND;
	gameState.coalition.mainVTOLGroup.data = {pos: camMakePos("coaVTOLAssembly")};

	gameState.coalition.pitched = true;
}

function resCoaResponse()
{
	if (!allianceExistsBetween(CAM_HUMAN_PLAYER, THE_RESISTANCE))
	{
		return;
	}
	else if (gameState.hellraisers.allianceState === "ALLIED")
	{
		if (camBaseIsEliminated("royalistCentralFactoryZone"))
		{
			missionMessage("RESCOAANTIPITCHMSG", "TRANS");
		}
		else if (gameState.amphos.allianceState === "ALLIED")
		{
			missionMessage("RESCOAPITCHMSGA", "TRANS");
		}
		else
		{
			missionMessage("RESCOAPITCHMSG", "TRANS");
		}
		camDetectEnemyBase("royalistCentralFactoryZone");
	}
	else
	{
		missionMessage("RESCOAWARNMSG", "TRANS");
	}
}

function camEnemyBaseEliminated_royalistCentralFactoryZone()
{
	if (gameState.coalition.allowAlliance)
	{
		camCallOnce("setupCoalitionNegotiations");
	}

	if (getObject("royCentralCommander") !== null)
	{
		// Tell the central commander to try to attack the player
		camManageGroup(getObject("royCentralCommander").group, CAM_ORDER_ATTACK, {
			targetPlayer: CAM_HUMAN_PLAYER,
			repair: 40
		});
	}
}

function camEnemyBaseDetected_royalistMountainCheckpoint()
{
	if ((gameState.resistance.allianceState === "ERADICATED" 
		|| gameState.hellraisers.allianceState === "ERADICATED" 
		|| gameState.hellraisers.allianceState === "HOSTILE") 
		&& gameState.coalition.allianceState === "NEUTRAL")
	{
		// Have the Coalition start a suprise offensive against the Royalists (and the player if they're in the way)
		gameState.coalition.offensive = true;

		gameState.coalition.mainVTOLGroup.order = CAM_ORDER_ATTACK;
		gameState.coalition.mainVTOLGroup.data = {pos: camMakePos("outerPos11")};
		manageGroupBySize(gameState.coalition.mainVTOLGroup, false);

		gameState.coalition.groups.playerSupportGroup.order = CAM_ORDER_COMPROMISE;
		gameState.coalition.groups.playerSupportGroup.data = {targetPlayer: ROYALISTS, pos: camMakePos("outerPos11"), repair: 40};
		checkCoalitionGroups();

		var commander = getObject("coaCommander");
		if (commander !== null)
		{
			camManageGroup(commander.group, CAM_ORDER_COMPROMISE, {targetPlayer: ROYALISTS, pos: camMakePos("outerPos11"), repair: 65});
		}
	}
}

// Called when the player has secured the central factory zone
function setupCoalitionNegotiations()
{
	// Message from the Coalition
	missionMessage("COANEGOMSG", "TRANS");

	console("The Coalition is offering to form an alliance with you!");
	playSound("pcv479.ogg"); // "Alliance offered"
	hackAddMessage("COA_OLIVE", PROX_MSG, CAM_HUMAN_PLAYER);
	gameState.coalition.allianceState = "OFFER";

	// Move the truck to the negotiation zone 
	var oliveTruck = getObject("coaOliveTruck");
	var pos = camMakePos("coaOliveZone");
	orderDroidLoc(oliveTruck, DORDER_MOVE, pos.x, pos.y);

	// The Coalition will become immediately hostile if the player destroys any units.
	gameState.coalition.tolerance = 0;

	if (gameState.resistance.allianceState === "ALLIED")
	{
		setAlliance(THE_COALITION, THE_RESISTANCE, true);
	}
	if (gameState.amphos.allianceState === "ALLIED")
	{
		setAlliance(THE_COALITION, AMPHOS, true);
	}

	// Recall patrol groups that operate around the olive zone
	var groupInfo = gameState.coalition.groups.eastPatrolGroup;
	groupInfo.order = CAM_ORDER_DEFEND;
	groupInfo.data = {
		pos: camMakePos("westPos2"),
		repair: 40
	};
	manageGroupBySize(groupInfo, false);
	var commander = getObject("coaCommander");
	if (commander !== null)
	{
		camManageGroup(commander.group, CAM_ORDER_DEFEND, {
			pos: camMakePos("westPos2"),
			repair: 40
		});
	}
}

camAreaEvent("coaOliveZone", function(droid)
{
	// Only trigger if the player moves a droid in while the Coalition is offering an alliance
	if ((droid.player === CAM_HUMAN_PLAYER || droid.player === THE_COALITION) && gameState.coalition.allianceState === "OFFER")
	{
		// Find all the player's droids in this area
		var droids = enumArea("coaOliveZone", CAM_HUMAN_PLAYER, false);
		var coaAtTable = (enumArea("coaOliveZone", THE_COALITION, false).length >= 1);
		// Make sure trucks are the only things inside, and the Coalition has arrived in the zone
		if (onlyTrucks(droids) && coaAtTable) 
		{
			console("Negotiations beginning...");
			// Try to ally after a few seconds
			queue("allyCoalition", camSecondsToMilliseconds(6));
		}
		else
		{
			resetLabel("coaOliveZone", ALL_PLAYERS);
		}
	}
	else
	{
		resetLabel("coaOliveZone", ALL_PLAYERS);
	}
});

function allyCoalition()
{
	if (!checkNegotiations("coaOliveZone", "coaOliveTruck"))
	{
		// Negotiations didn't finish correctly.
		return;
	}

	queue("coaAllyMessage", camSecondsToMilliseconds(12));

	console("The Coalition has allied with you!");
	gameState.coalition.allianceState = "ALLIED";
	playSound("pcv477.ogg"); // "Alliance accepted!"
	setAlliance(CAM_HUMAN_PLAYER, THE_COALITION, true);
	setAlliance(THE_RESISTANCE, THE_COALITION, true);
	achievementMessage("Unionized", "Unite with the Coalition against the Royalists");

	camBaseChangeToFriendly("coalitionBridgeBase");
	camBaseChangeToFriendly("seCoalitionBase");
	camBaseChangeToFriendly("neCoalitionBase");
	camBaseChangeToFriendly("coalitionMainBase");
	camBaseChangeToFriendly("riverDeltaBase");
	camBaseChangeToFriendly("sunkenPlainsBase");
	camBaseChangeToFriendly("coaWestGateLZ");

	hackRemoveMessage("COA_OLIVE", PROX_MSG, CAM_HUMAN_PLAYER);

	// Move the olive truck back to base
	var oliveTruck = getObject("coaOliveTruck");
	var pos = camMakePos("coaVTOLAssembly");
	orderDroidLoc(oliveTruck, DORDER_MOVE, pos.x, pos.y);
	queue("removeOliveTrucks", camSecondsToMilliseconds(30));

	// Upgrade Coalition structures if the player has already researched better tech
	updateAlliedStructs();

	// Share research with the player
	enableResearch("R-Wpn-AAGun02", CAM_HUMAN_PLAYER); // Cyclone
	camRemoveArtifact("ampAASite");
	enableResearch("R-Wpn-Cannon3Mk1", CAM_HUMAN_PLAYER); // Heavy Cannon
	camRemoveArtifact("royResearchOuter");
	enableResearch("R-Struc-Research-Module", CAM_HUMAN_PLAYER); // Research Module
	camRemoveArtifact("royResearchLake");
	enableResearch("R-Sys-Engineering02", CAM_HUMAN_PLAYER); // Improved Engineering
	camRemoveArtifact("ampResearchInner");
	if (gameState.amphos.allianceState === "ALLIED") // Only if AMPHOS is also allied
	{
		enableResearch("R-Vehicle-Prop-VTOL", CAM_HUMAN_PLAYER); // VTOL Propulsion
		camRemoveArtifact("amphosVtolFactory");
		camRemoveArtifact("royalistOuterVtolFac");
		camManageTrucks(AMPHOS, "ampSouthGateLZ", structSets.amphosSouthGateLZStructs, cTempl.amhtruck, camChangeOnDiff(camSecondsToMilliseconds(80)));
		achievementMessage("Master Negotiator", "Form an alliance with all factions");
	}
	playSound("pcv485.ogg"); // "Technology transferred"
	
	camManageTrucks(THE_RESISTANCE, "resistanceSubBase", structSets.resistanceCoalitionSubBaseStructs, cTempl.remtruck, camChangeOnDiff(camSecondsToMilliseconds(60)));
	camManageTrucks(THE_COALITION, "coaWestGateLZ", structSets.coalitionWestGateLZStructs, cTempl.comtruckht, camChangeOnDiff(camSecondsToMilliseconds(80)));

	// Remove Coalition artifacts
	camRemoveArtifact("coaAASite");
	camRemoveArtifact("coalitionVtolFactory");
	camRemoveArtifact("coalitionFactory1");
	camRemoveArtifact("coalitionFactory2");
	camRemoveArtifact("coaHQ");
	camRemoveArtifact("coaResearch");
	camRemoveArtifact("coaResearch2");
	camRemoveArtifact("coaResearch3");

	// Share research with the Coalition
	camCompleteRes(camGetResearchLog(), THE_COALITION);

	// Get all Coalition groups up to snuff
	updateAllyTemplates();
	checkCoalitionGroups();

	// Start checking if we can send transports to attack the Royalist base
	setTimer("westGateLZTransRequest", camChangeOnDiff(camMinutesToMilliseconds(6.5), true));
	setTimer("southGateLZTransRequest", camChangeOnDiff(camMinutesToMilliseconds(7), true));

	// Get Coalition patrol groups back to whatever they were doing
	var groupInfo = gameState.coalition.groups.eastPatrolGroup;
	groupInfo.order = CAM_ORDER_PATROL;
	groupInfo.data = {
		pos: [
			camMakePos("westPos4"),
			camMakePos("westPos5"),
			camMakePos("westPos11"),
			camMakePos("westPos10"),
			camMakePos("westPos9")
		],
		interval: camSecondsToMilliseconds(25),
		repair: 40
	};
	manageGroupBySize(groupInfo, false);
	var commander = getObject("coaCommander");
	if (commander !== null)
	{
		camManageGroup(commander.group, CAM_ORDER_PATROL, {
			pos: [
				camMakePos("westPos4"),
				camMakePos("westPos5"),
				camMakePos("westPos11"),
				camMakePos("westPos9")
			],
			interval: camSecondsToMilliseconds(45),
			repair: 40
		});
	}

	checkPhaseThree();
	if (gameState.amphos.allianceState === "ALLIED" 
		|| gameState.amphos.allianceState === "ERADICATED")
	{
		// Allow Royalists to start getting late-game research.
		camCallOnce("grantRoyalistTier2Research");
	}
}

function coaAllyMessage()
{
	if (gameState.amphos.allianceState === "ALLIED")
	{
		missionMessage("COAALLYMSGALT", "TRANS");
	}
	else
	{
		missionMessage("COAALLYMSG", "TRANS");
	}
}

function aggroCoalition()
{
	if (gameState.coalition.allianceState === "OFFER")
	{
		// Message about being betrayed
		if (allianceExistsBetween(CAM_HUMAN_PLAYER, AMPHOS))
		{
			missionMessage("COABTRYMSGALT", "TRANS");
		}
		else
		{
			missionMessage("COABTRYMSG", "TRANS");
		}

		// If the Coalition had set up negotiations, cancel them
		hackRemoveMessage("COA_OLIVE", PROX_MSG, CAM_HUMAN_PLAYER);

		// Get Coalition patrol groups back to whatever they were doing
		var groupInfo = gameState.amphos.groups.eastPatrolGroup;
		groupInfo.order = CAM_ORDER_PATROL;
		groupInfo.data = {
			pos: [
				camMakePos("westPos4"),
				camMakePos("westPos5"),
				camMakePos("westPos11"),
				camMakePos("westPos10"),
				camMakePos("westPos9")
			],
			interval: camSecondsToMilliseconds(25),
			repair: 40
		};
		manageGroupBySize(groupInfo, false);
		var commander = getObject("coaCommander");
		if (commander !== null)
		{
			camManageGroup(commander.group, CAM_ORDER_PATROL, {
				pos: [
					camMakePos("westPos4"),
					camMakePos("westPos5"),
					camMakePos("westPos11"),
					camMakePos("westPos9")
				],
				interval: camSecondsToMilliseconds(45),
				repair: 40
			});
		}
	}
	else
	{
		if (gameState.coalition.allowAlliance)
		{
			// Message about aggro'ing after pitching to the player
			missionMessage("COAAGGRPMSG", "TRANS");
		}
		else
		{
			// Message about aggro'ing after the player attacks both the Resistance and Hellraisers
			if ((gameState.hellraisers.allianceState === "HOSTILE" || gameState.hellraisers.allianceState === "ERADICATED") 
				&& !allianceExistsBetween(CAM_HUMAN_PLAYER, THE_RESISTANCE))
			{
				missionMessage("COASUPERAGGRMSG", "TRANS");
			}
			// Message about aggro'ing after warning the player
			else if (allianceExistsBetween(CAM_HUMAN_PLAYER, THE_RESISTANCE))
			{
				missionMessage("COAAGGRWMSG", "TRANS");
			}
			else
			{
				missionMessage("COAAGGRWMSGALT", "TRANS");
			}
		}
	}

	gameState.coalition.allianceState = "HOSTILE";
	queueStartProduction(THE_COALITION, "GROUND");

	if (gameState.resistance.allianceState === "ALLIED")
	{
		setAlliance(THE_COALITION, THE_RESISTANCE, false);
	}
	if (gameState.amphos.allianceState === "ALLIED")
	{
		setAlliance(THE_COALITION, AMPHOS, false);
	}
	if (gameState.hellraisers.allianceState === "ALLIED")
	{
		// Hellraisers will side with the player over the Coalition
		console("The Hellraisers have broken their alliance with the Coalition!");
		setAlliance(HELLRAISERS, THE_COALITION, false);
		if (gameState.resistance.allianceState !== "ALLIED")
		{
			setAlliance(HELLRAISERS, THE_RESISTANCE, false);
		}
	}

	var oliveTruck = getObject("coaOliveTruck");
	if (oliveTruck !== null)
	{
		// Tell the olive truck to retreat to base.
		var pos = camMakePos("coaFactoryAssembly");
		orderDroidLoc(oliveTruck, DORDER_MOVE, pos.x, pos.y);
		queue("removeOliveTrucks", camSecondsToMilliseconds(30));
	}

	// Update the templates in the Coalition VTOL factory
	var coaVtolTemplates = [ cTempl.colcbomv, cTempl.colhmgv, cTempl.colcanv ];
	if (difficulty >= MEDIUM) coaVtolTemplates.push(cTempl.comhbomv);
	if (difficulty >= HARD) coaVtolTemplates.push(cTempl.colpbomv);
	if (difficulty === INSANE) coaVtolTemplates = camArrayReplaceWith(coaVtolTemplates, cTempl.colcbomv, cTempl.comhbomv);
	camSetFactoryTemplates("coalitionVtolFactory", coaVtolTemplates);

	queue("coaCommanderAttack", camChangeOnDiff(camMinutesToMilliseconds(16)));

	// Get the Coalition's VTOLs on the attack
	gameState.coalition.mainVTOLGroup.order = CAM_ORDER_ATTACK;
	gameState.coalition.mainVTOLGroup.data = { targetPlayer: CAM_HUMAN_PLAYER, pos: camMakePos("playerBasePos") };

	camCallOnce("setPhaseTwo");
}

// Make the Coalition commander go attack the player. 
function coaCommanderAttack()
{
	if (getObject("coaCommander") !== null)
	{
		// Tell the commander to try to attack the player
		camManageGroup(getObject("coaCommander").group, CAM_ORDER_ATTACK, {
			targetPlayer: CAM_HUMAN_PLAYER,
			repair: 40
		});
	}
}

function camEnemyBaseDetected_coalitionMainBase()
{
	if (gameState.coalition.allianceState === "HOSTILE")
	{
		// Taunt the player
		if (gameState.resistance.allianceState === "ALLIED")
		{
			if (gameState.hellraisers.allianceState === "ALLIED")
			{
				// Resistance and Hellraisers are with the player
				missionMessage("COATAUNTRESMSGALT", "TRANS");
			}
			else
			{
				// Resistance is with the player
				missionMessage("COATAUNTRESMSG", "TRANS");
			}
		}
		else
		{
			if (!allianceExistsBetween(CAM_HUMAN_PLAYER, HELLRAISERS))
			{
				if (!allianceExistsBetween(CAM_HUMAN_PLAYER, AMPHOS) && gameState.amphos.allianceState === "ERADICATED")
				{
					// Resistance and Hellraisers are against the player, and AMPHOS is dead
					missionMessage("COAAMPERADTAUNTMSG", "TRANS");
				}
				else
				{
					// Resistance and Hellraisers are against the player
					missionMessage("COAERADTAUNTMSG", "TRANS");
				}
			}
			// Resistance is against the player
			missionMessage("COATAUNTNORESMSG", "TRANS");
		}
	}
}

// Check if the requirements are met to set to change to phase 3.
// On Normal or below, triggers when the player allies/eradicates
// _both_ AMPHOS and the Coalition. On Hard+, phase three is set if the player has 
// allied/eradicated _either_ the Coalition or AMPHOS (and the Hellraisers)
function checkPhaseThree()
{
	var ampDone = (gameState.amphos.allianceState === "ALLIED" || gameState.amphos.allianceState === "ERADICATED");
	var helDone = (gameState.hellraisers.allianceState === "ALLIED" || gameState.hellraisers.allianceState === "ERADICATED");
	var coaDone = (gameState.coalition.allianceState === "ALLIED" || gameState.coalition.allianceState === "ERADICATED");
	if (ampDone && coaDone)
	{
		camCallOnce("setPhaseThree");
	}
	else if (difficulty >= HARD && (coaDone || (ampDone && helDone)))
	{
		camCallOnce("setPhaseThree");
	}
}

// Called when the player approaches the Royalist main base or has dealt with all/most
// factions. Increases Royalist research speed, enables new templates and allows
// the Royalists to begin assaults. 
function setPhaseThree()
{
	// Make absolutely sure this has been done first
	camCallOnce("setPhaseTwo");

	gameState.phase = 3;

	// Angry message from the Queen >:(
	if (gameState.resistance.allianceState === "ALLIED"
		|| gameState.amphos.allianceState === "ALLIED"
		|| gameState.hellraisers.allianceState === "ALLIED"
		|| gameState.coalition.allianceState === "ALLIED" 
		&& !gameState.royalists.underAttack)
	{
		// Only if the player has allied with anyone
		queue("phaseThreeMessage", camSecondsToMilliseconds(20));
	}

	// Replace any HMG bunkers and towers with Assault Guns
	camTruckObsoleteStructure(ROYALISTS, "CO-HMGBunker", "CO-ROTMGBunker");
	camTruckObsoleteStructure(ROYALISTS, "CO-Tower-MG3", "CO-Tower-RotMG");

	// Increase the sizes of Resistance and Hellraiser support groups
	gameState.resistance.groups.playerSupportGroup.maxSize += 6;
	gameState.hellraisers.groups.playerSupportGroup.maxSize += 4;

	// Increase the size of the Royalist VTOL group (and grant Royalists access to more templates)
	gameState.royalists.mainVTOLGroup.maxSize += difficulty + 2;
	var royCentralFactoryTemplates = [ cTempl.rollant, cTempl.rolhmgt, cTempl.romacant, cTempl.rommrat, cTempl.rominft, cTempl.romhrept ];
	if (difficulty >= MEDIUM) royCentralFactoryTemplates = camArrayReplaceWith(royCentralFactoryTemplates, cTempl.rolhmgt, cTempl.romagt);
	if (difficulty >= MEDIUM) royCentralFactoryTemplates.push(cTempl.romhvcant);
	if (difficulty >= HARD) royCentralFactoryTemplates = camArrayReplaceWith(royCentralFactoryTemplates, cTempl.rollant, cTempl.romtkt);
	var royOuterFactoryTemplates = [ cTempl.romsenst, cTempl.romrmort, cTempl.romhvcant, cTempl.romagt, cTempl.rombbt, cTempl.rohhcant, cTempl.romtkt ];
	// if (difficulty >= HARD) royOuterFactoryTemplates.push(cTempl.rohbalt);
	var royHoverFactoryTemplates = [ cTempl.romtkh, cTempl.romhvcanh, cTempl.romacanh, cTempl.romagh, cTempl.rommrah, cTempl.rohhcanh ];
	if (difficulty >= MEDIUM) royHoverFactoryTemplates.push(cTempl.rombbh);
	var mainVtolTemplates = [ cTempl.rollanv, cTempl.rolagv, cTempl.rolhvcanv, cTempl.rolpbomv ];
	if (difficulty >= MEDIUM) mainVtolTemplates.push(cTempl.rolbbv);
	if (difficulty === INSANE) mainVtolTemplates = camArrayReplaceWith(mainVtolTemplates, cTempl.rollanv, cTempl.romtkv);
	var hvyVtolTemplates = [ cTempl.romacanv, cTempl.romhbomv, cTempl.romtkv ];
	if (difficulty >= HARD) hvyVtolTemplates.push(cTempl.romtbomv);
	camSetFactoryTemplates("royalistOuterFactory", royOuterFactoryTemplates);
	camSetFactoryTemplates("royalistHoverFactory", royHoverFactoryTemplates);
	camSetFactoryTemplates("royalistCoaRepFactory", royOuterFactoryTemplates);
	camSetFactoryTemplates("royalistAmpRepFactory", royHoverFactoryTemplates);
	camSetFactoryTemplates("royalistPortFactory", royCentralFactoryTemplates);
	camSetFactoryTemplates("royalistOuterVtolFac", mainVtolTemplates);
	camSetFactoryTemplates("royalistMainVtolFac1", mainVtolTemplates);
	camSetFactoryTemplates("royalistMainVtolFac2", hvyVtolTemplates);
	camSetFactoryTemplates("royalistAmpRepVtolFactory", mainVtolTemplates);

	// Activate the spy LZ if the player has ignored/not found it yet
	camCallOnce("activateSpyLZ");

	// Start royalist production of Royalist assault units
	queueStartProduction(ROYALISTS, "ASSAULT");
	if (gameState.coalition.allianceState !== "ALLIED")
	{
		gameState.royalists.assaultTarget = CAM_HUMAN_PLAYER;
	}
}

function phaseThreeMessage() 
{
	if (!gameState.royalists.underAttack)
	{
		missionMessage("ROYPHASE3MSG", "TRANS");
	}
}

// Place an artifact for the Incendiary Mortar in a Royalist Research Facility
function compenArtifactIncenMortar()
{
	var researchFacility = getObject(9, 144, ROYALISTS);
	if (researchFacility !== null)
	{
		addLabel(researchFacility, "royalistHelRepResearchFacility");
		camAddArtifact({"royalistHelRepResearchFacility": { tech: "R-Wpn-Mortar-Incendiary" }});
	}
}

// Place an artifact for the Howitzer in a Royalist Research Facility
function compenArtifactHowitzer()
{
	var researchFacility = getObject(9, 60, ROYALISTS);
	if (researchFacility !== null)
	{
		addLabel(researchFacility, "royalistCoaRepResearchFacility");
		camAddArtifact({"royalistCoaRepResearchFacility": { tech: "R-Wpn-HowitzerMk1" }});
	}
}

// Place an artifact for Ripple Rockets in a Royalist Factory
function compenArtifactRippleRockets()
{
	var factory = getObject(245, 141, ROYALISTS);
	if (factory !== null)
	{
		addLabel(factory, "royalistHelRepResearchFacility");
		camAddArtifact({"royalistHelRepResearchFacility": { tech: "R-Wpn-Rocket06-IDF", req: "R-Wpn-Rocket02-MRL" }});
	}
}

// Turn the Royalists against AMPHOS
// Called when all other factions have been eradicated
function royalistBetrayal()
{
	console("The Royalists have broken their alliance with AMPHOS!");
	setAlliance(ROYALISTS, AMPHOS, false);

	gameState.amphos.requireNW = false;
	if (gameState.amphos.pitched)
	{
		missionMessage("AMPBEGMSG", "TRANS");
	}
	else
	{
		ampPitch();
	}
}

// Set up fake Royalist negotiations if all factions are dead and 
// the player hasn't entered their base
function setupRoyalistNegotiations()
{
	// Add Twin Assault Artifacts
	var vtolFactory = getObject("royalistOuterVtolFac");
	var researchLab = getObject("royResearchOuter");
	if (camDef(vtolFactory) && vtolFactory !== null)
	{
		camAddArtifact({"royalistOuterVtolFac": { tech: "R-Wpn-MG5", req: "R-Wpn-MG4" }}); // Twin Assault Gun (requires Assault Gun)
	}
	if (camDef(researchLab) && researchLab !== null)
	{
		camAddArtifact({"royResearchOuter": { tech: "R-Wpn-Cannon6TwinAslt", req: "R-Wpn-Cannon5" }}); // Twin Assault Cannon (requires Assault Cannon)
	}

	if (gameState.royalists.attacked)
	{
		return;
	}

	var oliveTruck = getObject("royOliveTruck");
	if (gameState.royalists.underAttack || gameState.royalists.attacked || oliveTruck === null)
	{
		return; // Don't try to fakeout if under attack or has been attacked
	}

	// Message to the player
	missionMessage("ROYNEGOMSG", "TRANS");

	console("The Royalists are offering to form an alliance with you!");
	playSound("pcv479.ogg"); // "Alliance offered"
	hackAddMessage("ROY_OLIVE", PROX_MSG, CAM_HUMAN_PLAYER);
	gameState.royalists.fakeout = true;
	gameState.royalists.fakeoutTime = gameTime;

	// Move the truck to the negotiation zone 
	var pos = camMakePos("royOliveZone");
	orderDroidLoc(oliveTruck, DORDER_MOVE, pos.x, pos.y);

	// During the fakeout all commander groups, reclaimer groups,
	// assault groups, VTOLs will be recalled back to the main base
	// Transports will not reinforce LZs either.
	// The fakeout ends when the player either destroys an unforgivable
	// structure after 30 seconds, or completes the negotiation

	// Commander groups
	var hvyCommander = getObject("royHvyCommander");
	var centralCommander = getObject("royCentralCommander");
	var hoverCommander = getObject("royHoverCommander");
	var assltCommander = getObject("royAssaultCommander");
	if (hvyCommander !== null)
	{
		camManageGroup(hvyCommander.group, CAM_ORDER_DEFEND, {
			pos: camMakePos("outerPos6"),
			repair: 50
		});
	}
	if (centralCommander !== null)
	{
		camManageGroup(centralCommander.group, CAM_ORDER_DEFEND, {
			pos: camMakePos("outerPos6"),
			repair: 40
		});
	}
	if (hoverCommander !== null)
	{
		camManageGroup(hoverCommander.group, CAM_ORDER_DEFEND, {
			pos: camMakePos("outerPos6"),
			repair: 35
		});
	}
	if (assltCommander !== null)
	{
		camManageGroup(assltCommander.group, CAM_ORDER_DEFEND, {
			pos: camMakePos("innerPos1"),
			repair: 40
		});
	}

	// Reclaimer groups
	var grGroup = gameState.royalists.groundGroups.groundReclaimerGroup;
	var hrGroup = gameState.royalists.hoverGroups.hoverReclaimerGroup;
	grGroup.data.pos = camMakePos("royOuterFactoryAssembly");
	hrGroup.data.pos = camMakePos("royHoverAssembly");
	manageGroupBySize(grGroup, true);
	manageGroupBySize(hrGroup, true);

	// Patrol groups
	var plainsGroup = gameState.royalists.groundGroups.plainsPatrolGroup;
	var lakeGroup = gameState.royalists.hoverGroups.lakePatrolGroup;
	plainsGroup.data.pos = camMakePos("outerPos6");
	lakeGroup.data.pos = camMakePos("outerPos6");
	plainsGroup.data.order = CAM_ORDER_DEFEND;
	lakeGroup.data.pos = CAM_ORDER_DEFEND;
	manageGroupBySize(plainsGroup, true);
	manageGroupBySize(lakeGroup, true);

	// Assault Groups
	if (gameState.royalists.assaultPhase > 0)
	{
		// Assault in progress; bring main group back and restock any losses
		removeTimer("checkAssaultStatus");
		removeTimer("navigateAssaultGroups");
		gameState.royalists.assaultPhase = 0;
		camManageGroup(gameState.royalists.assaultGroup.id, CAM_ORDER_DEFEND, {pos: camMakePos("innerPos1")});
		queueStartProduction(ROYALISTS, "ASSAULT");
	}

	// VTOLs
	gameState.royalists.mainVTOLGroup.data = {pos: camMakePos("royMainVTOLAssembly")};
	gameState.royalists.mainVTOLGroup.order = CAM_ORDER_DEFEND;
	manageGroupBySize(gameState.royalists.mainVTOLGroup, false);
}

camAreaEvent("royOliveZone", function(droid)
{
	// Only trigger if the player moves a droid in while the Royalists are offering an alliance
	if ((droid.player === CAM_HUMAN_PLAYER || droid.player === ROYALISTS) && gameState.royalists.fakeout)
	{
		// Find all the player's droids in this area
		var droids = enumArea("royOliveZone", CAM_HUMAN_PLAYER, false);
		var royAtTable = (enumArea("royOliveZone", ROYALISTS, false).length >= 1);
		// Make sure trucks are the only things inside, and the Coalition has arrived in the zone
		if (onlyTrucks(droids) && royAtTable) 
		{
			console("Negotiations beginning...");
			queue("endRoyalistNegotiations", camSecondsToMilliseconds(6));
			achievementMessage("Friendly Get-Together", "Begin negotiations with the Royalists");
		}
		else
		{
			resetLabel("royOliveZone", ALL_PLAYERS);
		}
	}
	else
	{
		resetLabel("royOliveZone", ALL_PLAYERS);
	}
});

function endRoyalistNegotiations()
{
	if (!checkNegotiations("royOliveZone", "royOliveTruck"))
	{
		// Negotiations didn't finish correctly.
		return;
	}

	// Message to the player
	missionMessage("ROYAMBUMSG", "TRANS");

	camCallOnce("dropFakeout");
}

// Drop the act and ambush the player
function dropFakeout()
{
	// Have groups resume their normal patterns and scrap the negotiations
	gameState.royalists.fakeout = false;
	hackRemoveMessage("ROY_OLIVE", PROX_MSG, CAM_HUMAN_PLAYER);
	camSafeRemoveObject(getObject("royOliveTruck"), true); // Blow up the Olive truck

	// Commander groups
	var hvyCommander = getObject("royHvyCommander");
	var centralCommander = getObject("royCentralCommander");
	var hoverCommander = getObject("royHoverCommander");
	if (hvyCommander !== null)
	{
		camManageGroup(hvyCommander.group, CAM_ORDER_PATROL, {
			pos: [
				camMakePos("outerPos2"),
				camMakePos("outerPos4"),
				camMakePos("outerPos6"),
				camMakePos("outerPos3")
			],
			interval: camSecondsToMilliseconds(35),
			repair: 50
		});
		queue("royHvyCommanderAttack", camChangeOnDiff(camMinutesToMilliseconds(10)));
	}
	if (centralCommander !== null)
	{
		camManageGroup(centralCommander.group, CAM_ORDER_ATTACK, {repair: 40});
	}
	if (hoverCommander !== null)
	{
		camManageGroup(hoverCommander.group, CAM_ORDER_PATROL, {
			pos: [
				camMakePos("eastPos3"),
				camMakePos("eastPos4"),
				camMakePos("eastPos5"),
				camMakePos("eastPos7")
			],
			interval: camSecondsToMilliseconds(35),
			repair: 35
		});
	}

	// Reclaimer groups
	updateReclaimerData();

	// Patrol groups
	var plainsGroup = gameState.royalists.groundGroups.plainsPatrolGroup;
	var lakeGroup = gameState.royalists.hoverGroups.lakePatrolGroup;
	plainsGroup.data.pos = [
		camMakePos("westPos4"),
		camMakePos("westPos5"),
		camMakePos("westPos11"),
		camMakePos("westPos10"),
		camMakePos("westPos9"),
		camMakePos("westPos8")
	];
	lakeGroup.data.pos = [
		camMakePos("eastPos3"), 
		camMakePos("eastPos4"), 
		camMakePos("eastPos5"),
		camMakePos("eastPos7")
	];
	plainsGroup.data.order = CAM_ORDER_PATROL;
	lakeGroup.data.pos = CAM_ORDER_PATROL;
	manageGroupBySize(plainsGroup, true);
	manageGroupBySize(lakeGroup, true);

	// Assault Groups
	checkRoyalistAssaultGroups();

	// VTOLs
	gameState.royalists.mainVTOLGroup.data = {pos: camMakePos("royOliveZone")};
	gameState.royalists.mainVTOLGroup.order = CAM_ORDER_ATTACK;
	manageGroupBySize(gameState.royalists.mainVTOLGroup, false);
}

camAreaEvent("royalistOuterBase", function(droid)
{
	// Only trigger if the player moves a non-VTOL droid into the base
	if ((droid.player === CAM_HUMAN_PLAYER) && !isVTOL(droid) && !gameState.royalists.underAttack)
	{
		// Make sure this has been done!
		camCallOnce("setPhaseThree");
		camCallOnce("grantRoyalistTier2Research");

		// Message to the player
		if (gameState.resistance.allianceState === "ERADICATED"
			&& gameState.amphos.allianceState === "ERADICATED"
			&& gameState.hellraisers.allianceState === "ERADICATED"
			&& gameState.coalition.allianceState === "ERADICATED")
		{
			missionMessage("ROYERADATTACKMSG", "TRANS");
		}
		else
		{
			missionMessage("ROYATTACKMSG", "TRANS");
		}

		// Allow the Royalist to produce Twin Assault units (if they couldn't already)
		gameState.royalists.allowTwinAssault = true;

		// Set factories into "panic" mode: produced units will be managed by their parent factories,
		// and normal group management will stop (except for commander and VTOL groups)
		// Bunker Busters will also never be produced from the Royalists's base factories in this state
		gameState.royalists.underAttack = true;
		var royOuterFactoryTemplates = [ cTempl.romhvcant, cTempl.romagt, cTempl.romacant, cTempl.rollant, cTempl.romhrept ];
		if (difficulty >= MEDIUM) royOuterFactoryTemplates = camArrayReplaceWith(royOuterFactoryTemplates, cTempl.rollant, cTempl.romtkt);
		if (difficulty >= HARD) royOuterFactoryTemplates.push(cTempl.rohhcant);
		var royHoverFactoryTemplates = [ cTempl.romtkh, cTempl.romhvcanh, cTempl.romacanh, cTempl.romagh, cTempl.rommrah ];
		if (difficulty >= MEDIUM) royHoverFactoryTemplates.push(cTempl.rohhcanh);
		var royMainFactoryTemplates = [ cTempl.romhvcant, cTempl.rohtacant, cTempl.romsenst, cTempl.romtkt, cTempl.romrmort, cTempl.rohtagt, cTempl.rominft ];
		if (difficulty >= MEDIUM) royMainFactoryTemplates.push(cTempl.rohraat);
		// if (difficulty >= MEDIUM) royMainFactoryTemplates.push(cTempl.rohbalt);
		var royMainCybTemplates = [ cTempl.scyac, cTempl.cybag, cTempl.cybla, cTempl.scyhc, cTempl.scytk ];
		if (difficulty <= EASY) royMainCybTemplates = camArrayReplaceWith(royMainCybTemplates, cTempl.scytk, cTempl.cybla);
		if (difficulty >= HARD) royMainCybTemplates = camArrayReplaceWith(royMainCybTemplates, cTempl.cybla, cTempl.scytk);
		var mainVtolTemplates = [ cTempl.rollanv, cTempl.rolagv, cTempl.rolhvcanv, cTempl.rolpbomv ];
		if (difficulty === INSANE) mainVtolTemplates = camArrayReplaceWith(mainVtolTemplates, cTempl.rollanv, cTempl.romtkv);
		camSetFactoryTemplates("royalistOuterFactory", royOuterFactoryTemplates);
		camSetFactoryTemplates("royalistHoverFactory", royHoverFactoryTemplates);
		camSetFactoryTemplates("royalistMainFactory", royMainFactoryTemplates, camChangeOnDiff(camSecondsToMilliseconds(75)));
		camSetFactoryTemplates("royalistMainCyborgFac", royMainCybTemplates, camChangeOnDiff(camSecondsToMilliseconds(50)));
		camSetFactoryTemplates("royalistOuterVtolFac", mainVtolTemplates);
		camSetFactoryTemplates("royalistMainVtolFac1", mainVtolTemplates);

		// Get Royalist factories crankin' out units
		queueStartProduction(ROYALISTS, "GROUND");
		queueStartProduction(ROYALISTS, "HOVER");
		queueStartProduction(ROYALISTS, "ASSAULT");

		// If there was an assault force being produced, get them
		// moving now rather than let them sit around in the main base
		if (groupSize(gameState.royalists.assaultCommandGroup.id) > 0 
			|| groupSize(gameState.royalists.assaultGroup.id) > 0)
		{
			startRoyalistAssault();
		}

		// Set a timer to check when/if the player retreats away from the Royalist base
		setTimer("royOuterBaseClear", camMinutesToMilliseconds(1.5));
	}
	else
	{
		resetLabel("royalistOuterBase", CAM_HUMAN_PLAYER);
	}
});

// Check if the Royalist Outer base exists and has no hostiles
function royOuterBaseClear()
{
	if (!camBaseIsEliminated("royalistOuterGate") && camAreaSecure("royalistOuterBase", ROYALISTS))
	{
		removeTimer("royOuterBaseClear");

		// All is well and good, resume normal group and factory management
		gameState.royalists.underAttack = false;
		var royOuterFactoryTemplates = [ cTempl.romhvcant, cTempl.romagt, cTempl.romacant, cTempl.rollant, cTempl.romhrept, cTempl.romsenst, cTempl.romrmorht ];
		if (difficulty >= MEDIUM) royOuterFactoryTemplates.push(cTempl.rombbt);
		if (difficulty >= MEDIUM) royOuterFactoryTemplates = camArrayReplaceWith(royOuterFactoryTemplates, cTempl.rollant, cTempl.romtkt);
		if (difficulty >= MEDIUM) royOuterFactoryTemplates = camArrayReplaceWith(royOuterFactoryTemplates, cTempl.romrmorht, cTempl.romrmort);
		if (difficulty >= MEDIUM) royOuterFactoryTemplates.push(cTempl.rohhcant);
		var royHoverFactoryTemplates = [ cTempl.romtkh, cTempl.romhvcanh, cTempl.romacanh, cTempl.romagh, cTempl.rommrah, cTempl.rohhcanh ];
		if (difficulty >= MEDIUM) royHoverFactoryTemplates.push(cTempl.rombbh);
		var mainVtolTemplates = [ cTempl.rollanv, cTempl.rolagv, cTempl.rolhvcanv, cTempl.rolpbomv ];
		if (difficulty >= MEDIUM) mainVtolTemplates.push(cTempl.rolbbv);
		if (difficulty === INSANE) mainVtolTemplates = camArrayReplaceWith(mainVtolTemplates, cTempl.rollanv, cTempl.romtkv);
		camSetFactoryTemplates("royalistOuterFactory", royOuterFactoryTemplates);
		camSetFactoryTemplates("royalistHoverFactory", royHoverFactoryTemplates);
		camSetFactoryTemplates("royalistOuterVtolFac", mainVtolTemplates);
		camSetFactoryTemplates("royalistMainVtolFac1", mainVtolTemplates);

		// Check if the assault groups are dead
		if (groupSize(gameState.royalists.assaultCommandGroup.id) === 0 && groupSize(gameState.royalists.assaultGroup.id) === 0)
		{
			// Resume producing assault groups
			if (difficulty !== INSANE)
			{
				queue("setupRoyalistAssaults", camMinutesToMilliseconds(PRODUCTION_STARTUP_DELAY * 2));
			}
			else
			{
				setupRoyalistAssaults();
			}
		}

		// Reset the area label in case the player comes back
		resetLabel("royalistOuterBase", CAM_HUMAN_PLAYER);
	}
}

function royHvyCommanderAttack()
{
	if (getObject("royHvyCommander") !== null && !gameState.royalists.fakeout)
	{
		// Tell the commander to try to attack the player
		camManageGroup(getObject("royHvyCommander").group, CAM_ORDER_ATTACK, {
			targetPlayer: CAM_HUMAN_PLAYER,
			repair: 50
		});
	}
}

function camEnemyBaseEliminated_royalistOuterGate()
{
	playQueenPanicMessage();
}

// Make sure this message is played 
camAreaEvent("royalistMainBaseDefenses", function(droid)
{
	// Only trigger if the player moves a non-VTOL droid into the base
	if ((droid.player === CAM_HUMAN_PLAYER) && !isVTOL(droid))
	{
		playQueenPanicMessage();
	}
	else
	{
		resetLabel("royalistMainBaseDefenses", CAM_HUMAN_PLAYER);
	}
});

function playQueenPanicMessage()
{
	// Message to the player
	if (gameState.resistance.allianceState === "ERADICATED"
		&& gameState.amphos.allianceState === "ERADICATED"
		&& gameState.hellraisers.allianceState === "ERADICATED"
		&& gameState.coalition.allianceState === "ERADICATED")
	{
		missionMessage("ROYERADOUTERMSG", "TRANS");
	}
	else
	{
		missionMessage("ROYOUTERMSG", "TRANS");
	}

	if (gameState.resistance.allianceState === "ALLIED" || gameState.coalition.allianceState === "ALLIED")
	{
		queue("playPanicMessageResponse", camSecondsToMilliseconds(8));
	}
}

function playPanicMessageResponse()
{
	if (gameState.coalition.allianceState === "ALLIED")
	{
		missionMessage("COARESPONMSG", "TRANS");
	}
	else if (gameState.resistance.allianceState === "ALLIED")
	{
		missionMessage("RESRESPONMSG", "TRANS");
	}
}

function beginEndCountdown()
{
	setTimer("endCountdown", camSecondsToMilliseconds(1));
}

// Play ending cutscene, grant end-game achievements, and then end the game
function endCountdown()
{
	gameState.endCountdownTime--;
	if (gameState.endCountdownTime === 28)
	{
		// Play ending cutscenes
		var msgName;
		var resAllied = gameState.resistance.allianceState === "ALLIED";
		var resEradic = gameState.resistance.allianceState === "ERADICATED";
		var ampAllied = gameState.amphos.allianceState === "ALLIED";
		var ampEradic = gameState.amphos.allianceState === "ERADICATED";
		var helAllied = gameState.hellraisers.allianceState === "ALLIED";
		var helEradic = gameState.hellraisers.allianceState === "ERADICATED";
		var coaAllied = gameState.coalition.allianceState === "ALLIED";
		var coaEradic = gameState.coalition.allianceState === "ERADICATED";

		var numAllied = 0;
		if (resAllied) numAllied++;
		if (ampAllied) numAllied++;
		if (helAllied) numAllied++;
		if (coaAllied) numAllied++;

		var numEradic = 0;
		if (resEradic) numEradic++;
		if (ampEradic) numEradic++;
		if (helEradic) numEradic++;
		if (coaEradic) numEradic++;

		// Check if all allied
		if (numAllied === 4) 
		{
			msgName = "OUTMSGALLA";
		}
		// Check if all eradicated
		else if (numEradic === 4) 
		{
			msgName = "OUTMSGALLE";
		}
		// Check if all ignored (without Resistance)
		else if (resAllied && numAllied === 1 && numEradic === 0)
		{
			msgName = "OUTMSGALLI";
		}
		// Check if all ignored (with Resistance)
		else if (!resAllied && numAllied === 0 && numEradic === 1)
		{
			msgName = "OUTMSGALLIR";
		}
		// General endings
		else
		{
			msgName = "OUTMSG";

			if (resAllied) msgName += "R";
			if (ampAllied) msgName += "A";
			if (helAllied) msgName += "H";
			if (coaAllied) msgName += "C";

			if (numEradic === 0)
			{
				msgName += "VT1";
			}
			else if (numAllied >= 1 && numEradic === 1)
			{
				msgName += "VT2";
			}
			else if (resAllied && numEradic >= 2)
			{
				msgName += "VT3";
			}
			else // Resistance not allied, 2 or more factions eradicated
			{
				msgName += "VT4";
			}
		}

		camPlayVideos({video: msgName, type: CAMP_MSG}); // Play ending cutscene
	}
	else if (gameState.endCountdownTime === 25)
	{
		// Grant achievements
		if (difficulty >= MEDIUM)
		{
			achievementMessage("Dethroned", "Defeat the Royalists on Normal difficulty or higher");
		}
		if (difficulty >= HARD)
		{
			achievementMessage("Relentless", "Defeat the Royalists on Hard difficulty or higher");
		}
		if (difficulty === INSANE)
		{
			achievementMessage("Non Compos Mentis", "Defeat the Royalists on Insane difficulty");
		}
		if (!allianceExistsBetween(CAM_HUMAN_PLAYER, THE_RESISTANCE) && gameState.resistance.allianceState === "ERADICATED"
			&& !allianceExistsBetween(CAM_HUMAN_PLAYER, AMPHOS) && gameState.amphos.allianceState === "ERADICATED"
			&& !allianceExistsBetween(CAM_HUMAN_PLAYER, HELLRAISERS) && gameState.hellraisers.allianceState === "ERADICATED"
			&& !allianceExistsBetween(CAM_HUMAN_PLAYER, THE_COALITION) && gameState.coalition.allianceState === "ERADICATED")
		{
			achievementMessage("Walking Apocalypse", "Defeat the Royalists after eradicating all other factions");
		}
		// if (allianceExistsBetween(CAM_HUMAN_PLAYER, AMPHOS) && gameState.amphos.allianceState === "ERADICATED"
		// 	&& allianceExistsBetween(CAM_HUMAN_PLAYER, HELLRAISERS) && gameState.hellraisers.allianceState === "ERADICATED"
		// 	&& allianceExistsBetween(CAM_HUMAN_PLAYER, THE_COALITION) && gameState.coalition.allianceState === "ERADICATED")
		// {
		// 	achievementMessage("Ultimate Comeback", "Defeat the Royalists after every faction (other than the Resistance) has been eradicated by them");
		// }
		if (gameState.amphos.allianceState !== "ALLIED" && gameState.amphos.allianceState !== "ERADICATED"
			&& gameState.hellraisers.allianceState !== "ALLIED" && gameState.hellraisers.allianceState !=="ERADICATED"
			&& gameState.coalition.allianceState !== "ALLIED" && gameState.coalition.allianceState !== "ERADICATED")
		{
			achievementMessage("Isolationist", "Defeat the Royalists without aggravating or allying with any faction (other than the Resistance)");
		}
		if (!gameState.unitLost)
		{
			achievementMessage("Stainless", "Defeat the Royalists without any unit losses");
		}
		if (!gameState.builtCommander)
		{
			achievementMessage("Stubborn", "Defeat the Royalists without ever building a commander");
		}
		if (gameTime <= camMinutesToMilliseconds(280))
		{
			achievementMessage("Fortnight Of Fun", "Defeat the Royalists in under two in-game weeks (4 hours && 40 minutes)");
		}

		// List out the names of all earned achievements
		if (gameState.achievementLog.length > 0)
		{
			console("You earned " + gameState.achievementLog.length + " achievements total:");
			printAchievements();
		}
	}
	else if (gameState.endCountdownTime % 5 === 0)
	{
		console(_("Game will end in ") + gameState.endCountdownTime + _(" seconds..."));
	}
	else if (gameState.endCountdownTime === 1) 
	{
		if (difficulty === INSANE && !camIsResearched("R-Wpn-Laser01"))
		{
			camPlayVideos({video: "HINTMSG", type: CAMP_MSG}); // Give hint about rocks
		}
	}
	if (gameState.endCountdownTime <= 0)
	{
		// End the game
		gameOverMessage(true, false);
	}
}

// Check if the given faction has been eradicated (no bases and units remaining)
function checkErad(player)
{
	if (player !== ROYALISTS)
	{
		// Check any bases still exist
		if (hasBases(player)) return;

		// All bases gone, check for any units
		// HACK: If a faction has no bases and it's last unit is destroyed, it will still "exist" when this function is called
		// so check if there is more than 1 droid remaining instead of more than 0
		if (countDroid(DROID_ANY, player) > 1) return;
	}

	// This faction has no bases or units, consider them eradicated
	switch (player)
	{
		case THE_RESISTANCE:
			gameState.resistance.allianceState = "ERADICATED";
			if (gameState.phase === 0 && !allianceExistsBetween(CAM_HUMAN_PLAYER, THE_RESISTANCE))
			{
				achievementMessage("First Blood", "Eradicate the Resistance");
			}
			else if (gameState.phase >= 2 && !allianceExistsBetween(CAM_HUMAN_PLAYER, THE_RESISTANCE))
			{
				achievementMessage("For Real This Time", "Eradicate the Resistance again");
			}
			break;
		case AMPHOS:
			gameState.amphos.allianceState = "ERADICATED";
			if (!allianceExistsBetween(CAM_HUMAN_PLAYER, AMPHOS))
			{
				achievementMessage("Drowned Out", "Eradicate AMPHOS");
				checkPhaseThree();
				if (gameState.coalition.allianceState === "ALLIED" 
					|| gameState.coalition.allianceState === "ERADICATED")
				{
					// Allow Royalists to start getting late-game research.
					camCallOnce("grantRoyalistTier2Research");
				}

				// Queue response message from Royalists
				if (gameState.resistance.allianceState === "ALLIED"
					|| gameState.hellraisers.allianceState === "ALLIED"
					&& !gameState.royalists.underAttack)
				{
					// Only if the player has allied with anyone
					queue("royAmphosResponse", camSecondsToMilliseconds(12));
				}
			}
			else
			{
				camCallOnce("royAmpEradMessage");
			}
			break;
		case HELLRAISERS:
			gameState.hellraisers.allianceState = "ERADICATED";
			if (!allianceExistsBetween(CAM_HUMAN_PLAYER, HELLRAISERS))
			{
				achievementMessage("Scorched Earth", "Eradicate the Hellraisers");
				checkPhaseThree();
				// Determine what the Coalition should do
				if (!allianceExistsBetween(CAM_HUMAN_PLAYER, THE_RESISTANCE))
				{
					// Become aggressive against the player
					camCallOnce("aggroCoalition");
				}
				else
				{
					// Tell the player to scrub off
					coaPitch();
				}
			}
			else if (gameState.coalition.allianceState !== "HOSTILE")
			{
				// Allow Royalists to produce Incendiary Howitzers
				gameState.royalists.allowIncenHowit = true;
			}
			break;
		case THE_COALITION:
			gameState.coalition.allianceState = "ERADICATED";
			if (!allianceExistsBetween(CAM_HUMAN_PLAYER, THE_COALITION))
			{
				achievementMessage("Union Buster", "Eradicate the Coalition");
				checkErad(THE_RESISTANCE);
				checkPhaseThree();
				if (gameState.amphos.allianceState === "ALLIED" 
					|| gameState.amphos.allianceState === "ERADICATED")
				{
					// Allow Royalists to start getting late-game research.
					camCallOnce("grantRoyalistTier2Research");
				}
				if (gameState.resistance.allianceState === "ALLIED")
				{
					// Resistance debrief
					missionMessage("RESCOAERADMSG", "TRANS");
				}
			}
			break;
		case ROYALISTS:
			// Check if these main bases are destroyed
			if (camBaseIsEliminated("royalMainBase") && camBaseIsEliminated("royalistVtolBase"))
			{
				camCallOnce("beginEndCountdown");
			}
			break;
		default:
			break;
	}

	if (gameState.resistance.allianceState === "ERADICATED"
		&& gameState.hellraisers.allianceState === "ERADICATED"
		&& gameState.coalition.allianceState === "ERADICATED"
		&& gameState.amphos.allianceState === "NEUTRAL")
	{
		camCallOnce("royalistBetrayal");
	}

	if (gameState.resistance.allianceState === "ERADICATED"
		&& gameState.hellraisers.allianceState === "ERADICATED"
		&& gameState.coalition.allianceState === "ERADICATED"
		&& gameState.amphos.allianceState === "ERADICATED")
	{
		camCallOnce("setupRoyalistNegotiations");
	}
}

// Gloat to the player about destroying their friends
function royAmpEradMessage()
{
	var numAllies = 0;
	if (gameState.hellraisers.allianceState === "ALLIED") numAllies++;
	if (gameState.coalition.allianceState === "ALLIED") numAllies++;

	if (numAllies >= 2)
	{
		missionMessage("ROYAMPERADMSG", "TRANS");
	}
	else if (numAllies === 1)
	{
		missionMessage("ROYAMPERADMSG1LEFT", "TRANS");
	}
	else if (numAllies === 0)
	{
		missionMessage("ROYAMPERADMSG0LEFT", "TRANS");
	}
}

function royHelEradMessage()
{
	var numAllies = 0;
	if (gameState.amphos.allianceState === "ALLIED") numAllies++;
	if (gameState.coalition.allianceState === "ALLIED") numAllies++;

	if (numAllies >= 2)
	{
		missionMessage("ROYHELERADMSG", "TRANS");
	}
	else if (numAllies === 1)
	{
		missionMessage("ROYHELERADMSG1LEFT", "TRANS");
	}
	else if (numAllies === 0)
	{
		missionMessage("ROYHELERADMSG0LEFT", "TRANS");
	}
}

function royCoaEradMessage()
{
	var numAllies = 0;
	if (gameState.amphos.allianceState === "ALLIED") numAllies++;
	if (gameState.hellraisers.allianceState === "ALLIED") numAllies++;

	if (numAllies >= 2)
	{
		missionMessage("ROYCOAERADMSG", "TRANS");
	}
	else if (numAllies === 1)
	{
		missionMessage("ROYCOAERADMSG1LEFT", "TRANS");
	}
	else if (numAllies === 0)
	{
		missionMessage("ROYCOAERADMSG0LEFT", "TRANS");
	}
}

// Returns true if a negotiation is complete. Returns false otherwise
function checkNegotiations(oliveZoneLabel, oliveTruckLabel)
{
	// Make sure the player still only has trucks in the zone
	var droids = enumArea(oliveZoneLabel, CAM_HUMAN_PLAYER, false);
	if (!onlyTrucks(droids))
	{
		resetLabel(oliveZoneLabel, CAM_HUMAN_PLAYER);
		console("Negotiations incomplete; make sure only trucks are present");
		return false;
	}

	// Did the player's units leave?
	if (droids.length < 1)
	{
		resetLabel(oliveZoneLabel, CAM_HUMAN_PLAYER);
		console("Negotiations incomplete; make sure a truck remains in the negotiation area");
		return false;
	}

	// Is the olive truck dead?
	var oliveTruck = getObject(oliveTruckLabel);
	if (oliveTruck === null)
	{
		// Olive truck is dead; continue no further.
		return false;
	}

	// All checks passed.
	return true;
}

// Grants a random upgrade to the Royalists
function grantRoyalistResearch()
{
	var resList = gameState.royalists.pResList;
	if (gameState.royalists.tier2Granted && resList.length < 10)
	{
		// Allow the Royalists to start building twin assault tanks
		gameState.royalists.allowTwinAssault = true;
	}
	if (resList.length < 1)
	{
		// List empty, but check back later in case more is added.
		return;
	}

	// Choose a random upgrade from the list, and grant it to the Royalists 
	var index = camRand(resList.length);
	camCompleteRes(resList[index], ROYALISTS);
	// Then remove it from the list
	resList.splice(index, 1);
}

// Allows the Royalists to research more upgrades, and increases the rate in which they get them
// Called when both the Coalition and AMPHOS have been dealt with, or the player attacks the Royalist main base
function grantRoyalistTier2Research()
{
	gameState.royalists.pResList = gameState.royalists.pResList.concat(ROYALIST_PROGRESSIVE_RES2);
	gameState.royalists.tier2Granted = true;

	if (difficulty >= HARD)
	{
		// They get even more upgrades on Hard+
		gameState.royalists.pResList = gameState.royalists.pResList.concat(ROYALIST_PROGRESSIVE_HARD_RES);
	}

	// Grant research faster
	removeTimer("grantRoyalistResearch");
	setTimer("grantRoyalistResearch", camChangeOnDiff(camMinutesToMilliseconds(4)));
}

// Add AA upgrades to the list of progressive Royalist research
function grantRoyalistAAResearch()
{
	gameState.royalists.pResList = gameState.royalists.pResList.concat(ROYALIST_PROGRESSIVE_AA_RES);
}

// Upgrades the structures of all the player's allies
// Called when the player researches something or makes a new ally
function updateAlliedStructs(resName)
{
	if (!camDef(resName))
	{
		// Cycle through everything the player has researched
		var researchList = camGetResearchLog();
		for (var i = 0; i < researchList.length; i++)
		{
			updateAlliedStructs(researchList[i]);
		}
		return;
	}

	var oldStruct;
	var newStruct;

	switch (resName)
	{
		// Miscellaneous
		case "R-Struc-Factory-Module": // Factory Module
			oldStruct = "A0LightFactory";
			break;
		case "R-Struc-PowerModuleMk1": // Power Module
			oldStruct = "A0PowerGenerator";
			break;
		case "R-Struc-Research-Module": // Research Module
			oldStruct = "A0ResearchFacility";
			break;
		case "R-Sys-Sensor-Tower02": // Hardened Sensor Tower
			oldStruct = "Sys-SensoTower01";
			newStruct = "Sys-SensoTower02"; // Sensor Tower -> Hardened Sensor Tower
			break;
		// Defensive Structures
		// Miscellaneous
		case "R-Wpn-Flame2": // Inferno
			oldStruct = "PillBox5";
			newStruct = "Tower-Projector"; // Flamer Bunker -> Inferno Bunker
			break;
		case "R-Wpn-Laser01": // Flashlight
			oldStruct = ["Wall-RotMg", "WallTower01"];
			newStruct = "WallTower-PulseLas"; // Assault Gun Hardpoint / Heavy Machinegun Hardpoint -> Flashlight Hardpoint
			break;
		// Cannons
		case "R-Wpn-Cannon2Mk1": // Medium Cannon
			oldStruct = "WallTower02";
			newStruct = "WallTower03"; // Light Cannon Hardpoint -> Medium Cannon Hardpoint
			break;
		case "R-Wpn-Cannon3Mk1": // Heavy Cannon
			oldStruct = ["WallTower03", "WallTower-HPVcannon", "Wall-VulcanCan"];
			newStruct = "WallTower04"; // Medium / HVC / Assault Cannon Hardpoint -> Heavy Cannon Hardpoint
			break;
		case "R-Wpn-Cannon4AMk1": // Hyper Velocity Cannon
			oldStruct = "WallTower03";
			newStruct = "WallTower-HPVcannon"; // Medium Cannon Hardpoint -> Hyper Velocity Cannon Hardpoint
			break;
		case "R-Wpn-Cannon5": // Assault Cannon
			oldStruct = "WallTower03";
			newStruct = "Wall-VulcanCan"; // Medium Cannon Hardpoint -> Assault Cannon Hardpoint
			break;
		// Machineguns
		case "R-Wpn-MG3Mk1": // Heavy Machinegun
			oldStruct = ["GuardTower2", "PillBox2", "GuardTower1"];
			newStruct = ["GuardTower3", "PillBox1", "GuardTower3"]; // Twin MG Guard Tower -> HMG Tower, Twin MG Bunker -> HMG Bunker, HMG Guard Tower -> HMG Tower
			break;
		case "R-Wpn-MG4": // Assault Gun
			oldStruct = ["GuardTower3", "PillBox1", "WallTower01"];
			newStruct = ["GuardTower-RotMg", "Pillbox-RotMG", "Wall-RotMg"]; // HMG Tower -> AG Tower, HMG Bunker -> RotMG Bunker, HMG Hardpoint -> AG Hardpoint
			break;
		// Mortars (Resistance only)
		case "R-Wpn-Mortar-Incendiary": // Incendiary Mortar
			if (gameState.resistance.allianceState === "ALLIED")
			{
				camTruckObsoleteStructure(THE_RESISTANCE, "Emplacement-MortarPit01", "Emplacement-MortarPit-Incendiary"); // Mortar Pit -> Incendiary Mortar Pit
			}
			break;
		case "R-Wpn-Mortar02Hvy": // Bombard
			if (gameState.resistance.allianceState === "ALLIED")
			{
				camTruckObsoleteStructure(THE_RESISTANCE, "Emplacement-MortarPit01", "Emplacement-MortarPit02"); // Mortar Pit -> Bombard Pit
			}
			break;
		case "R-Wpn-Mortar3": // Pepperpot
			if (gameState.resistance.allianceState === "ALLIED")
			{
				camTruckObsoleteStructure(THE_RESISTANCE, "Emplacement-MortarPit01", "Emplacement-RotMor"); // Mortar Pit -> Pepperpot Pit
			}
			break;
		// Rockets
		case "R-Wpn-Rocket06-IDF": // Ripple Rockets (Resistance only)
			if (gameState.resistance.allianceState === "ALLIED")
			{
				camTruckObsoleteStructure(THE_RESISTANCE, "Emplacement-MortarPit01", "Emplacement-Rocket06-IDF"); // Mortar Pit -> Ripple Rocket Battery
				camTruckObsoleteStructure(THE_RESISTANCE, "Emplacement-MortarPit-Incendiary", "Emplacement-Rocket06-IDF"); // Incendiary Mortar Pit -> Ripple Rocket Battery
				camTruckObsoleteStructure(THE_RESISTANCE, "Emplacement-MortarPit02", "Emplacement-Rocket06-IDF"); // Bombard Pit -> Ripple Rocket Battery
				camTruckObsoleteStructure(THE_RESISTANCE, "Emplacement-RotMor", "Emplacement-Rocket06-IDF"); // Pepperpot Pit -> Ripple Rocket Battery
			}
			break;
		case "R-Wpn-Rocket07-Tank-Killer": // Tank Killer
			oldStruct = "WallTower06";
			newStruct = "WallTower-HvATrocket"; // Lancer Hardpoint -> Tank Killer Hardpoint
			break;
		// Howitzers (Resistance only)
		case "R-Wpn-HowitzerMk1": // Howitzer
			if (gameState.resistance.allianceState === "ALLIED")
			{
				camTruckObsoleteStructure(THE_RESISTANCE, "Emplacement-MortarPit01", "Emplacement-Howitzer105"); // Mortar Pit -> Howitzer Emplacement
				camTruckObsoleteStructure(THE_RESISTANCE, "Emplacement-MortarPit-Incendiary", "Emplacement-Howitzer105"); // Incendiary Mortar Pit -> Howitzer Emplacement
				camTruckObsoleteStructure(THE_RESISTANCE, "Emplacement-MortarPit02", "Emplacement-Howitzer105"); // Bombard Pit -> Howitzer Emplacement
				camTruckObsoleteStructure(THE_RESISTANCE, "Emplacement-RotMor", "Emplacement-Howitzer105"); // Pepperpot Pit -> Howitzer Emplacement
			}
			break;
		// AA Weapons
		case "R-Wpn-AAGun02": // Cyclone
			oldStruct = "AASite-QuadMg1";
			newStruct = "AASite-QuadBof"; // Hurricane AA Site -> Cyclone AA Site
			break;
		case "R-Wpn-AAGun04": // Whirlwind
			oldStruct = ["AASite-QuadBof", "WallTower-DoubleAAGun"];
			newStruct = ["AASite-QuadRotMg", "WallTower-QuadRotAAGun"]; // Cyclone AA Site -> Whirlwind AA Site, Cyclone AA Hardpoint -> Whirlwind AA Hardpoint
			break;
		default:
			break; // Some other research
	}

	if (!camDef(oldStruct))
	{
		return;
	}

	if (oldStruct === "A0PowerGenerator" || oldStruct === "A0ResearchFacility"
		|| oldStruct === "A0LightFactory" || oldStruct === "A0VTolFactory1")
	{
		// Upgrade the modules of the given structure
		if (gameState.resistance.allianceState === "ALLIED")
		{
			camTruckUpgradeModule(THE_RESISTANCE, oldStruct);
		}
		if (gameState.hellraisers.allianceState === "ALLIED")
		{
			camTruckUpgradeModule(HELLRAISERS, oldStruct);
		}
		// AMPHOS and Coalition start with all modules already
		return;
	}

	if (!camIsString(oldStruct)) // Array of structures to replace
	{
		for (var i = 0; i < oldStruct.length; i++)
		{
			var repStruct = newStruct;
			if (!camIsString(newStruct)) // Array of structures to replace with
			{
				repStruct = newStruct[i];
			}

			if (gameState.resistance.allianceState === "ALLIED")
			{
				camTruckObsoleteStructure(THE_RESISTANCE, oldStruct[i], repStruct);
			}
			if (gameState.amphos.allianceState === "ALLIED")
			{
				camTruckObsoleteStructure(AMPHOS, oldStruct[i], repStruct);
			}
			if (gameState.hellraisers.allianceState === "ALLIED")
			{
				camTruckObsoleteStructure(HELLRAISERS, oldStruct[i], repStruct);
			}
			if (gameState.coalition.allianceState === "ALLIED")
			{
				camTruckObsoleteStructure(THE_COALITION, oldStruct[i], repStruct);
			}
		}
	}
	else // Single structure to replace
	{
		if (gameState.resistance.allianceState === "ALLIED")
		{
			camTruckObsoleteStructure(THE_RESISTANCE, oldStruct, newStruct);
		}
		if (gameState.amphos.allianceState === "ALLIED")
		{
			camTruckObsoleteStructure(AMPHOS, oldStruct, newStruct);
		}
		if (gameState.hellraisers.allianceState === "ALLIED")
		{
			camTruckObsoleteStructure(HELLRAISERS, oldStruct, newStruct);
		}
		if (gameState.coalition.allianceState === "ALLIED")
		{
			camTruckObsoleteStructure(THE_COALITION, oldStruct, newStruct);
		}
	}
}

// Little helper function that returns true if a list only contains trucks
function onlyTrucks(droids)
{
	if (droids.length === 0)
	{
		return false;
	}
	for (var i = 0; i < droids.length; i++)
	{
		if (droids[i].droidType !== DROID_CONSTRUCT)
		{
			return false;
		}
	}
	return true;
}

// Returns true if the given player has any of their bases remaining
function hasBases(player)
{
	switch (player)
	{
		case THE_RESISTANCE:
			if (!camBaseIsEliminated("resistanceMainBase")) return true;
			if (!camBaseIsEliminated("resistanceSubBase")) return true;
			if (!camBaseIsEliminated("resistanceRiverRepairBase")) return true;
			break;
		case AMPHOS:
			if (!camBaseIsEliminated("southIslandBase")) return true;
			if (!camBaseIsEliminated("westIslandBase")) return true;
			if (!camBaseIsEliminated("northIslandBase")) return true;
			if (!camBaseIsEliminated("ampNWIsleRepBase")) return true;
			if (!camBaseIsEliminated("amphosMainBase")) return true;
			break;
		case HELLRAISERS:
			if (!camBaseIsEliminated("hellraiserMainBase")) return true;
			break;
		case THE_COALITION:
			if (!camBaseIsEliminated("coalitionBridgeBase")) return true;
			if (!camBaseIsEliminated("seCoalitionBase")) return true;
			if (!camBaseIsEliminated("riverDeltaBase")) return true;
			if (!camBaseIsEliminated("sunkenPlainsBase")) return true;
			if (!camBaseIsEliminated("neCoalitionBase")) return true;
			if (!camBaseIsEliminated("coalitionMainBase")) return true;
			break;
		default:
			break;
	}

	return false;
}

// Returns true if a faction should not become hostile towards the player
// after they break the given structure
function forgivableStruct(structName, player)
{
	var forgivables = [];

	switch (player)
	{
		case THE_RESISTANCE:
			// Stuff found outside of the main Resistance base
			forgivables = [_("Twin Machinegun Guard Tower"), _("Tank Traps"), _("Oil Derrick")];
			break;
		case AMPHOS:
			// Stuff that can trigger a CB attack
			forgivables = [_("Mini-Rocket Battery"), _("Ripple Rocket Battery")];
			break;
		case HELLRAISERS:
			// The only unforgivable structures to the Hellraisers are base 
			// structures, excluding Oil Derricks
			var unforgivables = [
			_("Factory"), _("Cyborg Factory"), _("Command Center"),
			_("Power Generator"), _("Research Facility"), _("Repair Facility")];

			for (var i = 0; i < unforgivables.length; i++)
			{
				if (structName === unforgivables[i]) return false;
			}

			// Didn't match any of the unforgivable structures.
			return true;
		case THE_COALITION:
			// Stuff that can trigger a CB attack
			forgivables = [_("Mortar Pit"), _("Bombard Pit"), _("Howitzer Emplacement")];
			break;
		case ROYALISTS:
			// Stuff that can trigger a CB attack
			forgivables = [_("Pepperpot Pit"), _("Ripple Rocket Battery"), _("Howitzer Emplacement")];
			break;
		default:
			break;
	}

	for (var i = 0; i < forgivables.length; i++)
	{
		if (structName === forgivables[i]) return true;
	}

	// Didn't match any of the forgivable structures.
	return false;
}