include("script/campaign/libcampaign.js");
include("script/campaign/templates.js");
include("script/campaign/kingdomdata.js"); // Holds a bunch of game data
include("script/campaign/kingdomgroups.js"); // Contains functions for group management
include("script/campaign/kingdomprogression.js"); // Contains functions for game progression

// Used to store various information about
// the state of the game (alliances, events, etc.)
// Initialized in kingdomdata.js
var gameState = {};

function eventStructureBuilt(struct, droid)
{
	if (struct.player === CAM_HUMAN_PLAYER )
	{
		return;
	}

	if (struct.player === CAM_HELLRAISERS && gameState.hellraisers.allianceState === "NEUTRAL" && gameState.hellraisers.pitched)
	{
		// Check if the Hellraisers have rebuilt enough of their structures
		if (enumStruct(CAM_HELLRAISERS).length >= gameState.hellraisers.structThreshold)
		{
			camCallOnce("setupHellraiserNegotiations");
		}
	}

	if (struct.name === _("VTOL Radar Tower") || struct.name === _("VTOL CB Tower"))
	{
		// The Coalition have built a new VTOL Tower
		gameState.coalitionVTOLTowers = enumStruct(CAM_THE_COALITION, "Sys-VTOL-RadarTower01").concat(
			enumStruct(CAM_THE_COALITION, "Sys-VTOL-CB-Tower01"));
	}
	if (struct.name === _("Collective VTOL Radar Tower") || struct.name === _("Collective VTOL CB Tower"))
	{
		// The Royalists have built a new VTOL Tower
		gameState.royalistVTOLTowers = enumStruct(CAM_ROYALISTS, "Sys-CO-VTOL-RadarTower01").concat(
			enumStruct(CAM_ROYALISTS, "Sys-CO-VTOL-CB-Tower01"));
	}

	if (struct.player === CAM_ROYALISTS)
	{
		if (struct.stattype === RESEARCH_LAB 
			&& struct.x === 9 && struct.y === 144 
			&& allianceExistsBetween(CAM_HUMAN_PLAYER, CAM_HELLRAISERS))
		{
			camCallOnce("compenArtifactIncenMortar");
		}
		if (struct.stattype === RESEARCH_LAB 
			&& struct.x === 9 && struct.y === 60
			&& allianceExistsBetween(CAM_HUMAN_PLAYER, CAM_THE_COALITION))
		{
			camCallOnce("compenArtifactHowitzer");
		}
		if (struct.stattype === FACTORY 
			&& struct.x === 245 && struct.y === 141
			&& allianceExistsBetween(CAM_HUMAN_PLAYER, CAM_AMPHOS))
		{
			camCallOnce("compenArtifactRippleRockets");
		}
	}

	// Check if a factory has been rebuilt.
	// If it has, then start managing it again.
	if (struct.stattype === FACTORY || struct.stattype === CYBORG_FACTORY || struct.stattype === VTOL_FACTORY)
	{
		const PLAYER = struct.player;
		const X_COORD = struct.x;
		const Y_COORD = struct.y;
		const stattype = struct.stattype;

		for (let i = 0; i < gameState.factoryLabelInfo.length; i++)
		{
			const labelInfo = gameState.factoryLabelInfo[i];

			// Determine if this newly built factory is the same as the old one
			if (PLAYER === labelInfo.player && X_COORD === labelInfo.x && Y_COORD === labelInfo.y 
				&& stattype === labelInfo.stattype)
			{
				// Everything matches, set the label to refer to the
				// newly built factory now
				addLabel(struct, labelInfo.label);
			}
		}
	}
}

// Assign newly constructed units to various different groups
function eventDroidBuilt(droid, structure)
{
	if (!camDef(structure) || !structure || droid.droidType === DROID_CONSTRUCT)
	{
		return;
	}

	// Achievement stuff
	if (droid.player === CAM_HUMAN_PLAYER && droid.droidType === DROID_COMMAND)
	{
		// The player may no longer get the "Stubborn" achievement
		gameState.builtCommander = true;
	}
	if (droid.player === CAM_HUMAN_PLAYER && droid.isVTOL)
	{
		achievementMessage("To The Skies", "Build any VTOL unit");
	}
	if (droid.player === CAM_HUMAN_PLAYER && droid.body === "Body10MBT")
	{
		achievementMessage("Best Served Cold", "Build any unit with the Vengeance body");
	}

	if (droid.player === CAM_HUMAN_PLAYER)
	{
		return;
	}

	// VTOL unit assignment
	if (droid.isVTOL)
	{
		let towerList;
		let groupList;
		let vtolPlayer;
		let mainGroup;

		if (droid.player === CAM_AMPHOS)
		{
			towerList = []; // AMPHOS has no VTOL towers
			vtolPlayer = CAM_AMPHOS;
			mainGroup = gameState.amphos.mainVTOLGroup;
		}
		else if (droid.player === CAM_THE_COALITION)
		{
			towerList = gameState.coalitionVTOLTowers;
			groupList = gameState.coalitionVTOLTowerGroups;
			vtolPlayer = CAM_THE_COALITION;
			mainGroup = gameState.coalition.mainVTOLGroup;
		}
		else if (droid.player === CAM_ROYALISTS)
		{
			towerList = gameState.royalistVTOLTowers;
			groupList = gameState.royalistVTOLTowerGroups;
			vtolPlayer = CAM_ROYALISTS;
			mainGroup = gameState.royalists.mainVTOLGroup;
		}
		else
		{
			return; // Unkown player's VTOL
		}

		// Don't add Bunker Buster VTOLs to tower groups
		if (droid.weapons[0].name !== "Rocket-VTOL-BB")
		{
			for (let i = 0; i < towerList.length; i++) // Won't run for AMPHOS, their array is empty
			{
				const vtolTower = towerList[i];
				if (!camDef(groupList[vtolTower.id]))
				{
					// VTOL Tower with no group; create a new group and add this VTOL to it
					const GROUP_ID = camMakeGroup(droid);
					groupList[vtolTower.id] = GROUP_ID;
					const TOWER_LABEL = "vtolTower_" + vtolTower.id;
					addLabel(getObject(STRUCTURE, vtolPlayer, vtolTower.id), TOWER_LABEL);

					camManageGroup(GROUP_ID, CAM_ORDER_FOLLOW, {
						leader: TOWER_LABEL,
						order: CAM_ORDER_ATTACK // Dummy line, will be overwriten if tower dies
					});

					return; // VTOL assigned; all done
				}

				const GROUP_ID = groupList[vtolTower.id];
				if (enumGroup(GROUP_ID).length < MIS_VTOL_TOWER_GROUP_SIZE)
				{
					// VTOL Tower with understaffed group; add this VTOL to it
					groupAdd(GROUP_ID, droid);

					return; // VTOL assigned; all done
				}
			}
		}

		// All VTOL tower groups are full. Assign the VTOL to the main group
		groupAdd(mainGroup.id, droid);

		const GROUP_SIZE = enumGroup(mainGroup.id).length;
		if (GROUP_SIZE >= mainGroup.maxSize) // Is the group full?
		{
			// Stop building VTOLs
			setProduction(vtolPlayer, "VTOL", false);
		}
		if (GROUP_SIZE === mainGroup.minSize) // Was the group below minimum size?
		{
			// libcampaign automatically stops managing groups if it becomes empty.
			// start re-managing it here in case it had become empty before
			camManageGroup(mainGroup.id, mainGroup.order, mainGroup.data);
		}

		return; // VTOL assigned; all done
	}

	// Non-VTOL unit assignment
	switch (droid.player)
	{
		case CAM_THE_RESISTANCE:
			if (droid.droidType === DROID_COMMAND)
			{
				// Main Commander has been rebuilt
				addLabel(droid, "resCommander");
				setDroidExperience(droid, gameState.resistance.storedRank);

				const group = gameState.resistance.groups.commanderGroup;
				camManageGroup(group.id, group.order, group.data); // Reassign any leftover commander units
				checkResistanceGroups(); // Check if we need to produce more.
			}
			else
			{
				assignDroidResistance(droid);
			}
			break;
		case CAM_AMPHOS:
			assignDroidAmphos(droid);
			break;
		case CAM_HELLRAISERS:
			assignDroidHellraisers(droid);
			break;
		case CAM_THE_COALITION:
			assignDroidCoalition(droid);
			break;
		case CAM_ROYALISTS:
			if (droid.droidType === DROID_COMMAND)
			{
				// The droid is a new assault commander
				addLabel(droid, "royAssaultCommander");
				const commander = getObject("royAssaultCommander");
				
				if (difficulty <= EASY) camSetDroidRank(commander, "Trained");
				if (difficulty === MEDIUM) camSetDroidRank(commander, "Regular");
				if (difficulty >= HARD) camSetDroidRank(commander, "Professional");

				// Assign units to the commander
				const commandGroup = gameState.royalists.assaultCommandGroup;
				camManageGroup(commandGroup.id, commandGroup.order, commandGroup.data);

				camManageGroup(camMakeGroup("royAssaultCommander"), CAM_ORDER_DEFEND, {
					pos: camMakePos("innerPos1"),
					repair: 40
				});
				break; // Commander assigned, all done.
			}
			const mainFac = getObject("royalistMainFactory");
			const mainCybFac = getObject("royalistMainCyborgFac");
			const hoverFac = getObject("royalistHoverFactory");
			const hoverRepFac = getObject("royalistAmpRepFactory");
			if ((mainFac !== null && structure.id === mainFac.id) || (mainCybFac !== null && structure.id === mainCybFac.id))
			{
				// Droid came from one of the main factories
				if (!gameState.royalists.underAttack)
				{
					assignAssaultDroidRoyalists(droid);
				}
				else
				{
					assignGroundDroidRoyalists(droid);
				}
			}
			else if ((hoverFac !== null && structure.id === hoverFac.id) || (hoverRepFac !== null && structure.id === hoverRepFac.id))
			{
				// Droid came from the hover factory
				assignHoverDroidRoyalists(droid);
			}
			else
			{
				// Droid came from any of the other ground factories
				if (gameState.phase >= 2)
				{
					assignGroundDroidRoyalists(droid);
				}
			}
			break;
		default:
			break;
	}
	// As libcampaign.js pre-hook has already fired,
	// the droid would remain assigned to the factory's
	// managed group if not reassigned here.
}

function eventDestroyed(obj)
{
	const attacker = camWhoAttacked(obj);
	const VICTIM_PLAYER = obj.player;

	if (VICTIM_PLAYER === CAM_HUMAN_PLAYER && obj.type === DROID)
	{
		// The player may no longer get the "Stainless" achievement
		gameState.unitLost = true;
	}

	// Player-faction interaction via destruction
	if (camDef(attacker) && attacker.player === CAM_HUMAN_PLAYER)
	{
		// Check if the Resistance should become aggressive
		if (gameState.resistance.allianceState === "OFFER" && VICTIM_PLAYER === CAM_THE_RESISTANCE 
			&& (obj.type === DROID || !forgivableStruct(obj.name, CAM_THE_RESISTANCE)))
		{
			// The player has destroyed a Resistance unit or important structure
			// while the Resistance was offering an alliance.
			camCallOnce("aggroResistance");
		}
		// Check if AMPHOS should become aggressive
		else if (gameState.amphos.allianceState === "NEUTRAL" && VICTIM_PLAYER === CAM_AMPHOS 
			&& obj.type === STRUCTURE && !forgivableStruct(obj.name, CAM_AMPHOS)
			&& camWithinArea(obj, "amphosBase"))
		{
			// The player has destroyed an important structure in 
			// the AMPHOS main base.
			camCallOnce("aggroAmphos");
		}
		else if (gameState.amphos.allianceState === "OFFER" && VICTIM_PLAYER === CAM_AMPHOS
			&& (!forgivableStruct(obj.name, CAM_AMPHOS) || getLabel(obj) === "ampOliveTruck"))
		{
			// The player has destroyed the AMPHOS olive truck or an important structure
			// while AMPHOS was offering an alliance.
			camCallOnce("aggroAmphos");
		}
		// Check if the Hellraisers should pitch an offer to the player
		else if (gameState.hellraisers.allianceState === "NEUTRAL" && VICTIM_PLAYER === CAM_HELLRAISERS 
			&& obj.type === STRUCTURE && forgivableStruct(obj.name, CAM_HELLRAISERS)
			&& camWithinArea(obj, "hellraiserBase"))
		{
			// The player has destroyed an unimportant structure
			// in the Hellraiser's base.
			camCallOnce("helPitch");
		}
		// Check if the Hellraisers should become aggressive
		else if (gameState.hellraisers.allianceState !== "ALLIED" && VICTIM_PLAYER === CAM_HELLRAISERS 
			&& obj.type === STRUCTURE && !forgivableStruct(obj.name, CAM_HELLRAISERS))
		{
			// The player has destroyed an important structure
			camCallOnce("aggroHellraisers");
		}
		// Check if the Coalition should become aggressive
		else if (gameState.coalition.allianceState !== "ALLIED" && VICTIM_PLAYER === CAM_THE_COALITION 
			&& obj.type === STRUCTURE && !forgivableStruct(obj.name, CAM_THE_COALITION))
		{
			// The player has destroyed an important structure
			camCallOnce("aggroCoalition");
		}
		else if (gameState.coalition.allianceState !== "ALLIED" && VICTIM_PLAYER === CAM_THE_COALITION 
			&& obj.type === DROID && !obj.isVTOL && gameState.coalition.pitched)
		{
			// The player has destroyed a unit
			gameState.coalition.tolerance--;
			if (gameState.coalition.tolerance <= 0)
			{
				// The player has killed one too many units
				camCallOnce("aggroCoalition");
			}
		}
		// Check if the Royalists should drop the fakeout act
		else if (gameState.royalists.fakeout && gameTime > gameState.royalists.fakeoutTime + camSecondsToMilliseconds(30)
			&& VICTIM_PLAYER === CAM_ROYALISTS && obj.type === STRUCTURE && !forgivableStruct(obj.name, CAM_ROYALISTS))
		{
			// Give up the fakeout act
			missionMessage("ROYBTRYMSG", "TRANS");
			camCallOnce("dropFakeout");
		}

		// Keep track of how much AMPHOS stuff has been destroyed before negotiations
		if (gameState.amphos.allianceState === "NEUTRAL" && VICTIM_PLAYER === CAM_AMPHOS 
			&& (obj.type === DROID || (obj.type === STRUCTURE && obj.stattype !== WALL)))
		{
			gameState.amphos.numDestroyed++;
		}
	}
	else // Handle olive truck destruction failsafe
	{
		// If an olive truck dies outside of the player's hands, spawn a new one at the negotiation site
		let newTruck = undefined;
		let newLabel = undefined;
		if (gameState.resistance.allianceState === "OFFER" && getLabel(obj) === "resOliveTruck")
		{
			const pos = camMakePos("resOliveZone");
			const temp = cTempl.reltruckw;
			newTruck = addDroid("CAM_THE_RESISTANCE", pos.x, pos.y, camNameTemplate(temp), temp.body, temp.prop, "", "", temp.weap);
			newLabel = "resOliveTruck";
		}
		else if (gameState.amphos.allianceState === "OFFER" && getLabel(obj) === "ampOliveTruck")
		{
			const pos = camMakePos("ampOliveZone");
			const temp = cTempl.ammtruck;
			newTruck = addDroid("CAM_AMPHOS", pos.x, pos.y, camNameTemplate(temp), temp.body, temp.prop, "", "", temp.weap);
			newLabel = "ampOliveTruck";
		}
		else if (gameState.hellraisers.allianceState === "OFFER" && getLabel(obj) === "helOliveTruck")
		{
			const pos = camMakePos("helOliveZone");
			const temp = cTempl.hemtruckt;
			newTruck = addDroid("CAM_HELLRAISERS", pos.x, pos.y, camNameTemplate(temp), temp.body, temp.prop, "", "", temp.weap);
			newLabel = "helOliveTruck";
		}
		else if (gameState.coalition.allianceState === "OFFER" && getLabel(obj) === "coaOliveTruck")
		{
			const pos = camMakePos("coaOliveZone");
			const temp = cTempl.comtruckht;
			newTruck = addDroid("CAM_THE_COALITION", pos.x, pos.y, camNameTemplate(temp), temp.body, temp.prop, "", "", temp.weap);
			newLabel = "coaOliveTruck";
		}
		else if (gameState.royalists.fakeout && getLabel(obj) === "royOliveTruck")
		{
			const pos = camMakePos("royOliveZone");
			const temp = cTempl.romtruckh;
			newTruck = addDroid("CAM_ROYALISTS", pos.x, pos.y, camNameTemplate(temp), temp.body, temp.prop, "", "", temp.weap);
			newLabel = "royOliveTruck";
		}

		if (camDef(newTruck))
		{
			addLabel(newTruck, newLabel);
		}
	}

	// Achievement stuff
	if (camDef(attacker) && allianceExistsBetween(CAM_HUMAN_PLAYER, attacker.player))
	{
		if (obj.type === DROID && obj.body === "CyborgHeavyBody"
			&& attacker.player === CAM_HUMAN_PLAYER && VICTIM_PLAYER !== CAM_HUMAN_PLAYER
			&& attacker.type === DROID && camDef(attacker.weapons[0])
			&& (attacker.weapons[0].name === "Rocket-BB" || attacker.weapons[0].name === "Rocket-VTOL-BB"))
		{
			achievementMessage("Why", "Destroy an enemy Super Cyborg with a Bunker Buster Rocket");
		}
		else if (obj.type === DROID && obj.isVTOL && attacker.type === DROID && attacker.isVTOL
			&& attacker.player === CAM_HUMAN_PLAYER && VICTIM_PLAYER !== CAM_HUMAN_PLAYER)
		{
			achievementMessage("Interceptor", "Shoot down a VTOL with another VTOL");
		}
		else if (obj.type === STRUCTURE && (obj.name === _("Collective Cannon Fortress") || obj.name === _("Collective Heavy Rocket Bastion")))
		{
			// Note, this achievement is granted even if an ally gets the kill
			achievementMessage("The Bigger They Are...", "Destroy a Royalist Fortress");
		}
		else if (obj.type === DROID && obj.droidType === DROID_SUPERTRANSPORTER && obj.z >= 3 && gameState.phase > 0)
		{
			// Note, this achievement is granted even if an ally gets the kill
			achievementMessage("No-Fly Zone", "Shoot down an enemy transport while it's in the air");
		}
		else if (obj.type === DROID && attacker.player === CAM_HUMAN_PLAYER 
			&& allianceExistsBetween(CAM_HUMAN_PLAYER, VICTIM_PLAYER) && VICTIM_PLAYER !== CAM_HUMAN_PLAYER)
		{
			gameState.oopsieDaisies++;
			if (gameState.oopsieDaisies >= 20)
			{
				// Don't worry, I'm sure you didn't mean to
				achievementMessage("Woops!", "Destroy 20 allied units");
			}
		}
	}

	if (VICTIM_PLAYER === CAM_HUMAN_PLAYER)
	{
		return;
	}

	// Check if a faction has been eradicated
	checkErad(VICTIM_PLAYER);

	if (obj.type === DROID)
	{
		// VTOL handling
		if (obj.isVTOL)
		{
			let mainGroup;
			
			switch (VICTIM_PLAYER)
			{
				case CAM_AMPHOS:
					mainGroup = gameState.amphos.mainVTOLGroup;
					break;
				case CAM_THE_COALITION:
					mainGroup = gameState.coalition.mainVTOLGroup;
					break;
				case CAM_ROYALISTS:
					mainGroup = gameState.royalists.mainVTOLGroup;
					break;
				default:
					return; // Unkown player's VTOL
			}

			// Check if the main VTOL group is undermanned
			const groupDroids = enumGroup(mainGroup.id);
			if (groupDroids.length < mainGroup.maxSize)
			{
				// Enable VTOL production
				queueStartProduction(VICTIM_PLAYER, "VTOL");
			}
		}
		// Ground unit handling
		else if (obj.droidType !== DROID_CONSTRUCT)
		{
			// Check faction group sizes and see if we need to resume production
			switch (VICTIM_PLAYER)
			{
				case CAM_THE_RESISTANCE:
					checkResistanceGroups();
					if (getLabel(obj) === "resCommander" && gameState.resistance.allianceState === "ALLIED")
					{
						// Resistance commander has died
						gameState.resistance.storedRank = obj.experience;
						queue("rebuildResistanceCommander", camChangeOnDiff(camMinutesToMilliseconds(2), true));
					}
					break;
				case CAM_AMPHOS:
					checkAmphosGroups();
					if (getLabel(obj) === "ampCommander")
					{
						// Commander dead; increase the size of the support group to compensate
						gameState.amphos.groups.playerSupportGroup.maxSize += 10;
					}
					break;
				case CAM_HELLRAISERS:
					checkHellraiserGroups();
					break;
				case CAM_THE_COALITION:
					checkCoalitionGroups();
					if (getLabel(obj) === "coaCommander")
					{
						// Commander dead; increase the size of the support group to compensate
						if (gameState.coalition.offensive && gameState.coalition.allianceState !== "HOSTILE")
						{
							// Make sure any leftover commander units don't go after the player
							camManageGroup(gameState.coalition.groups.commanderGroup.id, CAM_ORDER_ATTACK, {targetPlayer: CAM_ROYALISTS, repair: 65});
						}
						gameState.coalition.groups.playerSupportGroup.maxSize += 12;
					}
					break;
				case CAM_ROYALISTS:
					if (gameState.royalists.fakeout && getLabel(obj) === "royOliveTruck")
					{
						missionMessage("ROYBTRYMSG", "TRANS");
						camCallOnce("dropFakeout");
					}
					checkRoyalistGroundGroups();
					checkRoyalistHoverGroups();
					break;
				default:
					return; // Unkown player's unit
			}
		}
	}

	if (obj.type === STRUCTURE)
	{
		if (VICTIM_PLAYER === CAM_THE_COALITION)
		{
			if (obj.name === _("VTOL Radar Tower") || obj.name === _("VTOL CB Tower"))
			{
				// The Coalition have lost a VTOL Tower
				gameState.coalitionVTOLTowers = enumStruct(CAM_THE_COALITION, "Sys-VTOL-RadarTower01").concat(
					enumStruct(CAM_THE_COALITION, "Sys-VTOL-CB-Tower01"));
				// Move all VTOLs from the dead tower's group to the main group
				const towerGroup = gameState.coalitionVTOLTowerGroups[obj.id];
				const towerGroupVtols = enumGroup(towerGroup);
				for (const vtol of towerGroupVtols)
				{
					// This can exceed the main group's max size, but that's OK
					groupAdd(gameState.coalition.mainVTOLGroup.id, vtol);
				}
				// And remove the tower's group
				camStopManagingGroup(towerGroup);
				delete gameState.coalitionVTOLTowerGroups[obj.id];
			}
		}
		
		if (VICTIM_PLAYER === CAM_ROYALISTS)
		{
			if (obj.name === _("Collective VTOL Radar Tower") || obj.name === _("Collective VTOL CB Tower"))
			{
				// The Royalists have lost a VTOL Tower
				gameState.royalistVTOLTowers = enumStruct(CAM_ROYALISTS, "Sys-CO-VTOL-RadarTower01").concat(
					enumStruct(CAM_ROYALISTS, "Sys-CO-VTOL-CB-Tower01"));
				// Move all VTOLs from the dead tower's group to the main group
				const towerGroup = gameState.royalistVTOLTowerGroups[obj.id];
				const towerGroupVtols = enumGroup(towerGroup);
				for (const vtol of towerGroupVtols)
				{
					groupAdd(gameState.royalists.mainVTOLGroup.id, vtol);
				}
				// And remove the tower's group
				camStopManagingGroup(towerGroup);
				delete gameState.royalistVTOLTowerGroups[obj.id];
			}
		}

		// Remove the beacons of LZs inside larger bases
		if (VICTIM_PLAYER === CAM_HELLRAISERS && gameState.hellraisers.lzDiscovered)
		{
			const LZ_EXISTS = enumArea("hellraiserLZ", CAM_HELLRAISERS, false).filter(function(obj) {
				return (obj.type === STRUCTURE && obj.stattype === DEFENSE);
			}).length > 0;
			if (!LZ_EXISTS)
			{
				// The LZ inside of the Hellraiser base has been destroyed (for now)
				hackRemoveMessage("HELLRAISER_LZ", PROX_MSG, CAM_HUMAN_PLAYER);
				playSound("pcv665.ogg"); // "Enemy Landing Zone Eradicated"
				gameState.hellraisers.lzDiscovered = false;

				// Cleanup any remaining walls/gates
				const leftovers = enumArea("hellraiserLZ", CAM_HELLRAISERS, false).filter(function(obj) {
					return (obj.type === STRUCTURE && (obj.stattype === WALL || obj.stattype === GATE));
				});
				for (let i = leftovers.length - 1; i >= 0; i--)
				{
					camSafeRemoveObject(leftovers[i], true);
				}
			}
		}
		if (VICTIM_PLAYER === CAM_ROYALISTS && gameState.royalists.coastLzDiscovered)
		{
			const LZ_EXISTS = enumArea("coastLZ", CAM_ROYALISTS, false).filter(function(obj) {
				return (obj.type === STRUCTURE && obj.stattype === DEFENSE);
			}).length > 0;
			if (!LZ_EXISTS)
			{
				// The LZ inside of the south gate base has been destroyed (for now)
				hackRemoveMessage("COAST_LZ", PROX_MSG, CAM_HUMAN_PLAYER);
				playSound("pcv665.ogg"); // "Enemy Landing Zone Eradicated"
				gameState.royalists.coastLzDiscovered = false;

				// Cleanup any remaining walls/gates
				const leftovers = enumArea("coastLZ", CAM_ROYALISTS, false).filter(function(obj) {
					return (obj.type === STRUCTURE && (obj.stattype === WALL || obj.stattype === GATE));
				});
				for (let i = leftovers.length - 1; i >= 0; i--)
				{
					camSafeRemoveObject(leftovers[i], true);
				}
			}
		}
		if (VICTIM_PLAYER === CAM_ROYALISTS && gameState.royalists.howitzerLzDiscovered)
		{
			const LZ_EXISTS = enumArea("howitzerLZ", CAM_ROYALISTS, false).filter(function(obj) {
				return (obj.type === STRUCTURE && obj.stattype === DEFENSE);
			}).length > 0;
			if (!LZ_EXISTS)
			{
				// The LZ inside of the south gate base has been destroyed (for now)
				hackRemoveMessage("HOWITZER_LZ", PROX_MSG, CAM_HUMAN_PLAYER);
				playSound("pcv665.ogg"); // "Enemy Landing Zone Eradicated"
				gameState.royalists.howitzerLzDiscovered = false;

				// Cleanup any remaining walls/gates
				const leftovers = enumArea("howitzerLZ", CAM_ROYALISTS, false).filter(function(obj) {
					return (obj.type === STRUCTURE && (obj.stattype === WALL || obj.stattype === GATE));
				});
				for (let i = leftovers.length - 1; i >= 0; i--)
				{
					camSafeRemoveObject(leftovers[i], true);
				}
			}
		}
	}

	// Artifact updating
	// O(n) lookup here
	const ARTI_LABEL = getLabel(obj);
	if (!camDef(ARTI_LABEL))
	{
		return; // Wasn't important
	}

	// Duplicate artifact management
	let tech;
	let req;
	switch (ARTI_LABEL)
	{
		// Chaingun/Assault Gun progression
		case "resResearch2":
		case "royHMGTow":
		case "royHowitAGTow":
		case "roySpyAGTow":
		case "royIslandAGTow":
		case "royLZAGTow":
		case "royCentralAGTow":
			gameState.artifacts.chainGunProgression++;
			// Get the next artifact tech
			if (gameState.artifacts.chainGunProgression === 1)
			{
				tech = "R-Wpn-MG-ROF02"; // Rapid Fire Chaingun Upgrade
				req = "R-Wpn-MG-ROF01";
			}
			if (gameState.artifacts.chainGunProgression === 2)
			{
				tech = "R-Wpn-MG-ROF03"; // Hyper Fire Chaingun Upgrade
				req = "R-Wpn-MG-ROF02";
			}
			if (gameState.artifacts.chainGunProgression === 3)
			{
				tech = "R-Wpn-MG4"; // Assault Gun
				req = "R-Wpn-MG-ROF03";
			}
			if (gameState.artifacts.chainGunProgression === 4) 
			{
				// No more artifacts left, disable the remaining locations
				if (ARTI_LABEL !== "royHMGTow" && getObject("royHMGTow") !== null) camRemoveArtifact("royHMGTow");
				if (ARTI_LABEL !== "royHowitAGTow" && getObject("royHowitAGTow") !== null) camRemoveArtifact("royHowitAGTow");
				if (ARTI_LABEL !== "roySpyAGTow" && getObject("roySpyAGTow") !== null) camRemoveArtifact("roySpyAGTow");
				if (ARTI_LABEL !== "royIslandAGTow" && getObject("royIslandAGTow") !== null) camRemoveArtifact("royIslandAGTow");
				if (ARTI_LABEL !== "royLZAGTow" && getObject("royLZAGTow") !== null) camRemoveArtifact("royLZAGTow");
				if (ARTI_LABEL !== "royCentralAGTow" && getObject("royCentralAGTow") !== null) camRemoveArtifact("royCentralAGTow");
				break;
			}
			if (gameState.artifacts.chainGunProgression > 4) 
			{
				break;
			}

			// Put the new artifact into the remaining locations
			if (getObject("royHMGTow") !== null)
			{
				camAddArtifact({"royHMGTow": { tech: tech, req: req }});
			}
			if (getObject("royHowitAGTow") !== null)
			{
				camAddArtifact({"royHowitAGTow": { tech: tech, req: req }});
			}
			if (getObject("roySpyAGTow") !== null)
			{
				camAddArtifact({"roySpyAGTow": { tech: tech, req: req }});
			}
			if (getObject("royIslandAGTow") !== null)
			{
				camAddArtifact({"royIslandAGTow": { tech: tech, req: req }});
			}
			if (getObject("royLZAGTow") !== null)
			{
				camAddArtifact({"royLZAGTow": { tech: tech, req: req }});
			}
			if (getObject("royCentralAGTow") !== null)
			{
				camAddArtifact({"royCentralAGTow": { tech: tech, req: req }});
			}
			break;
		// Command-Control progression
		case "resHQ":
		case "ampHQ":
		case "helHQ":
		case "coaHQ":
			gameState.artifacts.commandProgression++;
			// Get the next artifact tech
			if (gameState.artifacts.commandProgression === 1)
			{
				tech = "R-Sys-CommandUpgrade02";
				req = "R-Sys-CommandUpgrade01";
			}
			if (gameState.artifacts.commandProgression === 2)
			{
				tech = "R-Sys-CommandUpgrade03";
				req = "R-Sys-CommandUpgrade02";
			}
			if (gameState.artifacts.commandProgression === 3)
			{
				tech = "R-Sys-CommandUpgrade04";
				req = "R-Sys-CommandUpgrade03";
			}
			if (gameState.artifacts.commandProgression === 4) 
			{
				// No more artifacts left.
				// Note, all locations except ampHQ have other tech too, so just remove ampHQ artifact if no more tech is left
				if (ARTI_LABEL !== "ampHQ") camRemoveArtifact("ampHQ");
				break;
			}
			if (gameState.artifacts.commandProgression > 4)
			{
				break;
			}

			// Put the new artifact into the remaining locations
			// No need to replace resHQ artifact, it will always be destroyed first
			if (getObject("ampHQ") !== null)
			{
				camAddArtifact({"ampHQ": { tech: tech, req: req }});
			}
			if (getObject("helHQ") !== null)
			{
				camAddArtifact({"helHQ": { tech: ["R-Vehicle-Body04", tech], req: req }});
			}
			if (getObject("coaHQ") !== null)
			{
				camAddArtifact({"coaHQ": { tech: ["R-Vehicle-Body02", tech], req: req }});
			}
			break;
		// Duplicate Heavy Machinegun artifacts
		case "ampMGTow":
		case "helMGTow":
			if (gameState.artifacts.hmgDrop)
			{
				break;
			}
			gameState.artifacts.hmgDrop = true;
			if (ARTI_LABEL !== "ampMGTow") camRemoveArtifact("ampMGTow");
			if (ARTI_LABEL !== "helMGTow") camRemoveArtifact("helMGTow");
			break;
		// Duplicate Composite Alloys Mk3 artifacts
		case "helResearch1":
		case "royCompositeTank":
			if (gameState.artifacts.compositeDrop)
			{
				break;
			}
			gameState.artifacts.compositeDrop = true;
			if (ARTI_LABEL !== "helResearch1") camRemoveArtifact("helResearch1");
			if (ARTI_LABEL !== "royCompositeTank") camRemoveArtifact("royCompositeTank");
			break;
		// Duplicate Lancer artifacts
		case "ampLancerTow":
		case "royLancerTow1":
		case "royLancerTow2":
			if (gameState.artifacts.lancerDrop)
			{
				break;
			}
			gameState.artifacts.lancerDrop = true;
			if (ARTI_LABEL !== "ampLancerTow") camRemoveArtifact("ampLancerTow");
			if (ARTI_LABEL !== "royLancerTow1") camRemoveArtifact("royLancerTow1");
			if (ARTI_LABEL !== "royLancerTow2") camRemoveArtifact("royLancerTow2");
			break;
		// Duplicate Pepperpot artifacts
		case "royPepperPit1":
		case "royPepperPit2":
			if (gameState.artifacts.pepperDrop)
			{
				break;
			}
			gameState.artifacts.pepperDrop = true;
			if (ARTI_LABEL !== "royPepperPit1") camRemoveArtifact("royPepperPit1");
			if (ARTI_LABEL !== "royPepperPit2") camRemoveArtifact("royPepperPit2");
			break;
		// Duplicate Cyclone artifacts
		case "ampAASite":
		case "coaAASite":
			if (gameState.artifacts.cycloneDrop)
			{
				break;
			}
			gameState.artifacts.cycloneDrop = true;
			if (ARTI_LABEL !== "ampAASite") camRemoveArtifact("ampAASite");
			if (ARTI_LABEL !== "coaAASite") camRemoveArtifact("coaAASite");
			break;
		// Duplicate Power Module artifacts
		case "ampPowerGen":
		case "royPowerGen":
		case "coaPowerGen":
			if (gameState.artifacts.powModDrop)
			{
				break;
			}
			gameState.artifacts.powModDrop = true;
			if (ARTI_LABEL !== "ampPowerGen") camRemoveArtifact("ampPowerGen");
			if (ARTI_LABEL !== "royPowerGen") camRemoveArtifact("royPowerGen");
			if (ARTI_LABEL !== "coaPowerGen") camRemoveArtifact("coaPowerGen");
			break;
		// Duplicate Research Module artifacts
		case "royResearchLake":
		case "coaResearch2":
			if (gameState.artifacts.resModDrop)
			{
				break;
			}
			gameState.artifacts.resModDrop = true;
			if (ARTI_LABEL !== "royResearchLake") camRemoveArtifact("royResearchLake");
			if (ARTI_LABEL !== "coaResearch2") camRemoveArtifact("coaResearch2");
			break;
		// Duplicate VTOL Propulsion artifacts
		case "amphosVtolFactory":
		case "coalitionVtolFactory":
		case "royalistOuterVtolFac":
			if (gameState.artifacts.vtolDrop)
			{
				break;
			}
			gameState.artifacts.vtolDrop = true;
			if (ARTI_LABEL !== "amphosVtolFactory") camRemoveArtifact("amphosVtolFactory");
			if (ARTI_LABEL !== "coalitionVtolFactory") camRemoveArtifact("coalitionVtolFactory");
			if (ARTI_LABEL !== "royalistOuterVtolFac") camRemoveArtifact("royalistOuterVtolFac");
			break;
		// Duplicate Inferno artifacts
		case "hellraiserFactory":
		case "royInfBunker":
			if (gameState.artifacts.infernoDrop)
			{
				break;
			}
			gameState.artifacts.infernoDrop = true;
			if (ARTI_LABEL !== "hellraiserFactory") camRemoveArtifact("hellraiserFactory");
			if (ARTI_LABEL !== "royInfBunker") camRemoveArtifact("royInfBunker");
			break;
		// Duplicate Heavy Cannon artifacts
		case "coalitionFactory2":
		case "royResearchOuter":
			if (gameState.artifacts.hvyCanDrop)
			{
				break;
			}
			gameState.artifacts.hvyCanDrop = true;
			if (ARTI_LABEL !== "coalitionFactory2") camRemoveArtifact("coalitionFactory2");
			if (ARTI_LABEL !== "royResearchOuter") camRemoveArtifact("royResearchOuter");
			break;
		// Duplicate Improved Engineering artifacts
		case "coaResearch3":
		case "ampResearchInner":
			if (gameState.artifacts.engineerDrop)
			{
				break;
			}
			gameState.artifacts.engineerDrop = true;
			if (ARTI_LABEL !== "coaResearch3") camRemoveArtifact("coaResearch3");
			if (ARTI_LABEL !== "ampResearchInner") camRemoveArtifact("ampResearchInner");
			break;
		// Duplicate Retribution artifacts
		case "royRelay":
		case "royAssaultCommander":
			if (gameState.artifacts.retriDrop)
			{
				break;
			}
			gameState.artifacts.retriDrop = true;
			if (ARTI_LABEL !== "royRelay") camRemoveArtifact("royRelay");
			if (ARTI_LABEL !== "royAssaultCommander") camRemoveArtifact("royAssaultCommander");
			break;
	}
}

function eventAttacked(victim, attacker)
{
	if (!camDef(victim) || !victim)
	{
		return;
	}

	const VICT_PLAYER = victim.player;
	const ATK_PLAYER = attacker.player;

	// Check if the player has met the Royalists
	if ((VICT_PLAYER === CAM_HUMAN_PLAYER && ATK_PLAYER === CAM_ROYALISTS) 
		|| (VICT_PLAYER === CAM_ROYALISTS && ATK_PLAYER === CAM_HUMAN_PLAYER))
	{
		if (gameState.phase > 0) {
			camCallOnce("enableSouthCybFactory");
		}

		// Message introducing the Royalists
		if (allianceExistsBetween(CAM_HUMAN_PLAYER, CAM_THE_RESISTANCE))
		{
			missionMessage("RESROYMSG", "INTEL");
		}
	}

	// Check if the player has met the Hellraisers
	if ((VICT_PLAYER === CAM_HUMAN_PLAYER && ATK_PLAYER === CAM_HELLRAISERS) 
		|| (VICT_PLAYER === CAM_HELLRAISERS && ATK_PLAYER === CAM_HUMAN_PLAYER))
	{
		// Message introducing the Hellraisers
		if (allianceExistsBetween(CAM_HUMAN_PLAYER, CAM_THE_RESISTANCE))
		{
			missionMessage("RESHELMSG", "INTEL");
		}
	}

	// Check if the player has met the Resistance (after eradicating them)
	if (((VICT_PLAYER === CAM_HUMAN_PLAYER && ATK_PLAYER === CAM_THE_RESISTANCE) 
		|| (VICT_PLAYER === CAM_THE_RESISTANCE && ATK_PLAYER === CAM_HUMAN_PLAYER))
		&& gameState.resistance.allianceState === "ERADICATED" 
		&& (gameState.coalition.proxyHostile || gameState.coalition.allianceState === "HOSTILE"))
	{
		gameState.resistance.allianceState = "HOSTILE";
	}

	// Check if the player has encountered the Coalition after the've launched their suprise offensive
	if (((VICT_PLAYER === CAM_HUMAN_PLAYER && ATK_PLAYER === CAM_THE_COALITION) 
		|| (VICT_PLAYER === CAM_THE_COALITION && ATK_PLAYER === CAM_HUMAN_PLAYER))
		&& gameState.coalition.offensive)
	{
		missionMessage("COAOFFENSMSG", "TRANS");
	}


	if ((victim.type === DROID && victim.isVTOL) || (attacker.type === DROID && attacker.isVTOL) || attacker.hasIndirect)
	{
		// Don't send support if it's just VTOL or artillery harassment
		return;
	}

	// Check if factions should support the player in combat
	if (!allianceExistsBetween(VICT_PLAYER, ATK_PLAYER) && gameTime > gameState.lastSupportUpdate + 10000 // 10 seconds
		&& ((victim.type === DROID && VICT_PLAYER === CAM_HUMAN_PLAYER) || (attacker.type === DROID && ATK_PLAYER === CAM_HUMAN_PLAYER)))
	{
		gameState.lastSupportUpdate = gameTime;
		// Either a player unit is attacking an enemy, or an enemy is attacking a player unit
		let pos;
		let targetPlayer;
		if (VICT_PLAYER === CAM_HUMAN_PLAYER)
		{
			pos = camMakePos(victim);
			targetPlayer = ATK_PLAYER;
		}
		else
		{
			pos = camMakePos(attacker);
			targetPlayer = VICT_PLAYER;
		}
		
		// Resistance support
		let refPos = camMakePos("resFactoryAssembly");
		if (gameState.resistance.allianceState === "ALLIED" && propulsionCanReach("wheeled01", refPos.x, refPos.y, pos.x, pos.y))
		{
			const commander = getObject("resCommander");
			// In an attempt to have the Resistance not get distracted by the Hellraisers as much
			const ATTACK_RADIUS = (gameState.hellraisers.allianceState !== "NEUTRAL") ? 20 : 8;
			// If the Royalist outpost is alive, and the player is engaged with Royalists, focus attention there
			const attackPos = (camBaseIsEliminated("southBase")) ? pos : camMakePos("southFOB");
			if (commander !== null)
			{
				// Tell the Resistance commander support the player
				camManageGroup(commander.group, CAM_ORDER_ATTACK, {
					targetPlayer: targetPlayer,
					radius: ATTACK_RADIUS,
					pos: attackPos,
					repair: 65
				});
			}

			// Tell the player support group to... support the player
			const groupInfo = gameState.resistance.groups.playerSupportGroup;
			groupInfo.order = CAM_ORDER_ATTACK;
			groupInfo.data = {
				targetPlayer: targetPlayer,
				radius: ATTACK_RADIUS,
				pos: attackPos,
				repair: 65
			};
			manageGroupBySize(groupInfo, false);
		}

		// AMPHOS support
		refPos = camMakePos("ampVTOLAssembly");
		if (gameState.amphos.allianceState === "ALLIED" && propulsionCanReach("hover01", refPos.x, refPos.y, pos.x, pos.y))
		{
			const commander = getObject("ampCommander");
			if (commander !== null)
			{
				// Tell the AMPHOS commander to support the player
				camManageGroup(commander.group, CAM_ORDER_ATTACK, {
					targetPlayer: targetPlayer,
					pos: pos,
					repair: 65
				});
			}
			// Send the support group
			let groupInfo = gameState.amphos.groups.playerSupportGroup;
			groupInfo.order = CAM_ORDER_ATTACK;
			groupInfo.data = {
				targetPlayer: targetPlayer,
				pos: pos,
				repair: 65
			};
			manageGroupBySize(groupInfo, false);
			// Get AMPHOS VTOLs to join in too
			groupInfo = gameState.amphos.mainVTOLGroup;
			groupInfo.data = { pos: pos };
			groupInfo.order = CAM_ORDER_ATTACK;
			manageGroupBySize(groupInfo, false);
		}

		// Hellraiser support
		refPos = camMakePos("helFactoryAssembly");
		if (gameState.hellraisers.allianceState === "ALLIED" && propulsionCanReach("wheeled01", refPos.x, refPos.y, pos.x, pos.y))
		{
			// Tell the Hellraisers to support the player
			const groupInfo = gameState.hellraisers.groups.playerSupportGroup;
			groupInfo.order = CAM_ORDER_ATTACK;
			groupInfo.data = {
				targetPlayer: targetPlayer,
				pos: pos,
				repair: 30
			};

			manageGroupBySize(groupInfo, false);
		}

		// Coalition support
		refPos = camMakePos("coaFactoryAssembly");
		if (gameState.coalition.allianceState === "ALLIED" && propulsionCanReach("wheeled01", refPos.x, refPos.y, pos.x, pos.y))
		{
			const commander = getObject("coaCommander");
			if (commander !== null)
			{
				// Tell the Coalition commander support the player
				camManageGroup(commander.group, CAM_ORDER_ATTACK, {
					targetPlayer: targetPlayer,
					pos: pos,
					repair: 65
				});
			}
			// Send the support group
			let groupInfo = gameState.coalition.groups.playerSupportGroup;
			groupInfo.order = CAM_ORDER_ATTACK;
			groupInfo.data = {
				targetPlayer: targetPlayer,
				pos: pos,
				repair: 40
			};
			manageGroupBySize(groupInfo, false);
			// Get Coalition VTOLs to join in too
			groupInfo = gameState.coalition.mainVTOLGroup;
			groupInfo.data = { pos: pos };
			groupInfo.order = CAM_ORDER_ATTACK;
			manageGroupBySize(groupInfo, false);
		}

		// Royalist VTOL focusing
		if ((VICT_PLAYER === CAM_ROYALISTS || ATK_PLAYER === CAM_ROYALISTS) && !gameState.royalists.fakeout)
		{
			// Get the Royalist VTOLs to target the area that the player is fighting in
			const groupInfo = gameState.royalists.mainVTOLGroup;
			groupInfo.data = { targetPlayer: CAM_HUMAN_PLAYER, pos: pos };
			groupInfo.order = CAM_ORDER_ATTACK;
			manageGroupBySize(groupInfo, false);
		}
	}
}

function eventResearched(research, structure, player)
{
	const RESEARCH_NAME = research.name;
	if (player === CAM_HUMAN_PLAYER)
	{
		// Achievements
		if (RESEARCH_NAME === "R-Wpn-Laser01")
		{
			achievementMessage("Illuminator", "Acquire the Flashlight Laser");
		}

		// Share what the player has researched with their allies
		if (allianceExistsBetween(CAM_HUMAN_PLAYER, CAM_THE_RESISTANCE))
		{
			camCompleteRes(RESEARCH_NAME, CAM_THE_RESISTANCE);
		}
		if (allianceExistsBetween(CAM_HUMAN_PLAYER, CAM_AMPHOS))
		{
			camCompleteRes(RESEARCH_NAME, CAM_AMPHOS);
		}
		if (allianceExistsBetween(CAM_HUMAN_PLAYER, CAM_HELLRAISERS))
		{
			camCompleteRes(RESEARCH_NAME, CAM_HELLRAISERS);
		}
		if (allianceExistsBetween(CAM_HUMAN_PLAYER, CAM_THE_COALITION))
		{
			camCompleteRes(RESEARCH_NAME, CAM_THE_COALITION);
		}

		// Upgrade allied unit templates when the player researches a new component
		switch (RESEARCH_NAME)
		{
			// Miscellaneous
			case "R-Vehicle-Body11": // Python
			case "R-Vehicle-Prop-Tracks": // Tracked Propulsion
			case "R-Wpn-Flame2": // Inferno
			case "R-Wpn-Laser01": // Flashlight
			// Cannons
			case "R-Wpn-Cannon2Mk1": // Medium Cannon
			case "R-Wpn-Cannon3Mk1": // Heavy Cannon
			case "R-Wpn-Cannon4AMk1": // Hyper Velocity Cannon
			case "R-Wpn-Cannon5": // Assault Cannon
			// Machineguns
			case "R-Wpn-MG3Mk1": // Heavy Machinegun
			case "R-Wpn-MG4": // Assault Gun
			// Mortars
			case "R-Wpn-Mortar-Incendiary": // Incendiary Mortar
			case "R-Wpn-Mortar02Hvy": // Bombard
			case "R-Wpn-Mortar3": // Pepperpot
			// Rockets
			case "R-Wpn-Rocket02-MRL": // Mini-Rocket Array
			case "R-Wpn-Rocket03-HvAT": // Bunker Buster
			case "R-Wpn-Rocket01-LtAT": // Lancer
			case "R-Wpn-Rocket06-IDF": // Ripple Rockets
			case "R-Wpn-Rocket07-Tank-Killer": // Tank Killer
			// Howitzers
			case "R-Wpn-HowitzerMk1": // Howitzer
			case "R-Wpn-Howitzer-Incendiary": // Incendiary Howitzer
			// AA Weapons
			case "R-Wpn-AAGun02": // Cyclone
			case "R-Wpn-AAGun04": // Whirlwind
				updateAllyTemplates();
				break;
			default:
				break; // Some other research
		}

		// Upgrade/replace allied structures when the player researches a cooler one
		if (camDef(structure) && structure !== null)
		{
			updateAlliedStructs(RESEARCH_NAME);
		}

		// Special case research progression/events
		switch (RESEARCH_NAME)
		{
			case "R-Sys-CommandUpgrade01":
			case "R-Sys-CommandUpgrade02":
			case "R-Sys-CommandUpgrade03":
			case "R-Sys-CommandUpgrade04":
				let commandScore = 0;
				if (camIsResearched("R-Sys-CommandUpgrade01")) commandScore++;
				if (camIsResearched("R-Sys-CommandUpgrade02")) commandScore++;
				if (camIsResearched("R-Sys-CommandUpgrade03")) commandScore++;
				if (camIsResearched("R-Sys-CommandUpgrade04")) commandScore += 2; // The last upgrade counts as double
				setDroidLimit(CAM_HUMAN_PLAYER, 100 + (commandScore * 10), DROID_ANY);
				setDroidLimit(CAM_HUMAN_PLAYER, 15 + (commandScore * 2), DROID_CONSTRUCT);
				break;
			case "R-Vehicle-Body11":
			case "R-Vehicle-Metals01":
				// Enable Composite Alloys Mk2 if the player researches the Python and Composite Alloys
				if (RESEARCH_NAME === "R-Vehicle-Body11" && camIsResearched("R-Vehicle-Metals01"))
				{
					enableResearch("R-Vehicle-Metals02");
				}
				else if (RESEARCH_NAME === "R-Vehicle-Metals01" && camIsResearched("R-Vehicle-Body11"))
				{
					enableResearch("R-Vehicle-Metals02");
				}
				break;
			case "R-Vehicle-Body03":
			case "R-Sys-Engineering01":
				// Enable Improved Engineering if the player researches the Retaliation and Engineering
				if (RESEARCH_NAME === "R-Vehicle-Body03" && camIsResearched("R-Sys-Engineering01"))
				{
					enableResearch("R-Sys-Engineering02");
					camRemoveArtifact("ampResearchInner");
					camRemoveArtifact("coaResearch3");
				}
				else if (RESEARCH_NAME === "R-Sys-Engineering01" && camIsResearched("R-Vehicle-Body03"))
				{
					enableResearch("R-Sys-Engineering02");
					camRemoveArtifact("ampResearchInner");
					camRemoveArtifact("coaResearch3");
				}
				if (RESEARCH_NAME === "R-Vehicle-Body03")
				{
					// Remove the artifact for Dense Composite Alloys
					camRemoveArtifact("coaResearch");
				}
				break;
			case "R-Sys-Engineering02":
				// Remove the artifacts for Composite Alloys Mk3
				camRemoveArtifact("helResearch1");
				camRemoveArtifact("royCompositeTank");
				break;
			case "R-Vehicle-Metals02":
			case "R-Cyborg-Metals01":
			case "R-Cyborg-Metals03":
				// Enable Cyborg Composite Alloys Mk2 if the player researches Composite Alloys Mk2 and Cyborg Composite Alloys
				if (RESEARCH_NAME === "R-Vehicle-Metals02" && camIsResearched("R-Cyborg-Metals01"))
				{
					enableResearch("R-Cyborg-Metals02");
				}
				else if (RESEARCH_NAME === "R-Cyborg-Metals01" && camIsResearched("R-Vehicle-Metals02"))
				{
					enableResearch("R-Cyborg-Metals02");
				}
				// Enable Composite Alloys Mk3 if the player researches Composite Alloys Mk2 and Cyborg Composite Alloys Mk3
				if (RESEARCH_NAME === "R-Cyborg-Metals03" && camIsResearched("R-Vehicle-Metals02"))
				{
					enableResearch("R-Vehicle-Metals03");
				}
				else if (RESEARCH_NAME === "R-Vehicle-Metals02" && camIsResearched("R-Cyborg-Metals03"))
				{
					enableResearch("R-Vehicle-Metals03");
				}
				break;
			case "R-Cyborg-Armor-Heat01":
			case "R-Wpn-Flamer-Damage01":
				// Enable High Temperature Flamer Gel Mk2 if the player researches Cyborg Thermal Armor and High Temperature Flamer Gel
				if (RESEARCH_NAME === "R-Cyborg-Armor-Heat01" && camIsResearched("R-Wpn-Flamer-Damage01"))
				{
					enableResearch("R-Cyborg-Metals02");
				}
				else if (RESEARCH_NAME === "R-Wpn-Flamer-Damage01" && camIsResearched("R-Cyborg-Armor-Heat01"))
				{
					enableResearch("R-Wpn-Flamer-Damage02");
				}
				break;
			case "R-Wpn-Flame2":
				// Enable High Temperature Flamer Gel Mk3 if the player researches the Inferno
				enableResearch("R-Wpn-Flamer-Damage03");
				break;
			case "R-Wpn-Rocket01-LtAT":
			case "R-Wpn-Rocket03-HvAT":
				// Enable HEAT Rocket Warhead if the player researches the Lancer or Bunker Buster
				enableResearch("R-Wpn-Rocket-Damage04");
				break;
			case "R-Wpn-Cannon3Mk1":
			case "R-Wpn-Cannon4AMk1":
			case "R-Wpn-Cannon5":
			case "R-Wpn-Cannon-Damage03":
			case "R-Wpn-Cannon-Damage04":
			case "R-Wpn-Cannon-Damage05":
				// When the player researches one of these three cannons, unlock the next damage upgrade.
				// We don't know which cannon the player will get first.
				let cannonScore = 0;
				if (camIsResearched("R-Wpn-Cannon3Mk1")) cannonScore++;
				if (camIsResearched("R-Wpn-Cannon4AMk1")) cannonScore++;
				if (camIsResearched("R-Wpn-Cannon5")) cannonScore++;

				let damageScore = 0;
				if (camIsResearched("R-Wpn-Cannon-Damage03")) damageScore++;
				if (camIsResearched("R-Wpn-Cannon-Damage04")) damageScore++;
				if (camIsResearched("R-Wpn-Cannon-Damage05")) damageScore++;

				if (cannonScore >= 1 && damageScore >= 1)
				{
					enableResearch("R-Wpn-Cannon-Damage04");
				}
				if (cannonScore >= 2 && damageScore >= 2)
				{
					enableResearch("R-Wpn-Cannon-Damage05");
				}
				if (cannonScore >= 3 && damageScore >= 3)
				{
					enableResearch("R-Wpn-Cannon-Damage06");
				}
				break;
			case "R-Struc-VTOLFactory":
				// Start giving the Royalists AA upgrades once the player has VTOLs
				camCallOnce("grantRoyalistAAResearch");
				break;
			case "R-Wpn-MG-ROF03":
				// Remove Heavy Machinegun artifacts
				camRemoveArtifact("helMGTow");
				camRemoveArtifact("ampMGTow");
				break;
			default:
				break; // Some other research
		}
	}
}

// Allow the player to change to colors via text chat
// Also toggle ally vision via chat
function eventChat(from, to, message)
{
	let colour = 0;
	switch (message)
	{
		case "green me":
			colour = 0; // Green
			break;
		case "orange me":
			colour = 1; // Orange
			break;
		case "grey me":
		case "gray me":
			colour = 2; // Gray
			break;
		case "black me":
			colour = 3; // Black
			break;
		case "red me":
			colour = 4; // Red
			break;
		case "blue me":
			colour = 5; // Blue
			break;
		case "pink me":
			colour = 6; // Pink
			break;
		case "aqua me":
		case "cyan me":
			colour = 7; // Cyan
			break;
		case "yellow me":
			colour = 8; // Yellow
			break;
		case "purple me":
			colour = 9; // Purple
			break;
		case "white me":
			colour = 10; // White
			break;
		case "bright blue me":
		case "bright me":
			colour = 11; // Bright Blue
			break;
		case "neon green me":
		case "neon me":
		case "bright green me":
			colour = 12; // Neon Green
			break;
		case "infrared me":
		case "infra red me":
		case "infra me":
		case "dark red me":
			colour = 13; // Infrared
			break;
		case "ultraviolet me":
		case "ultra violet me":
		case "ultra me":
		case "uv me":
		case "dark blue me":
			colour = 14; // Ultraviolet
			break;
		case "brown me":
		case "dark green me":
			colour = 15; // Brown
			break;
		case "green them":
		case "orange them":
		case "grey them":
		case "gray them":
		case "black them":
		case "red them":
		case "blue them":
		case "pink them":
		case "aqua them":
		case "cyan them":
		case "yellow them":
		case "purple them":
		case "white them":
		case "bright blue them":
		case "bright them":
		case "neon green them":
		case "neon them":
		case "bright green them":
		case "infrared them":
		case "infra red them":
		case "infra them":
		case "dark red them":
		case "ultraviolet them":
		case "ultra violet them":
		case "ultra them":
		case "uv them":
		case "dark blue them":
		case "brown them":
		case "dark green them":
			if (!gameState.allowColourChange)
			{
				playSound("beep8.ogg");
				return;
			}
			gameState.themCount++;
			if (gameState.themCount === 1)
			{
				console("Not doing that.");
				playSound("beep8.ogg");
				return;
			}
			if (gameState.themCount === 2)
			{
				console("Nope.");
				playSound("beep8.ogg");
				return;
			}
			if (gameState.themCount === 3)
			{
				console("Stop it.");
				playSound("beep8.ogg");
				return;
			}
			if (gameState.themCount === 4)
			{
				console("If you try that one more time...");
				playSound("beep8.ogg");
				return;
			}
			if (gameState.themCount === 5)
			{
				// Change every player color to white
				changePlayerColour(CAM_HUMAN_PLAYER, 10);
				changePlayerColour(CAM_THE_RESISTANCE, 10);
				changePlayerColour(CAM_AMPHOS, 10);
				changePlayerColour(CAM_HELLRAISERS, 10);
				changePlayerColour(CAM_THE_COALITION, 10);
				changePlayerColour(CAM_ROYALISTS, 10);
				gameState.allowColourChange = false;
				// Grant "Whiteout" achievement
				achievementMessage("Whiteout", "Now look at what you've done");
				return;
			}
			break;
		case "show achievements": 
		case "show achi":
			console("You have earned " + gameState.achievementLog.length + " achievements so far:");
			if (gameState.achievementLog.length === 0)
			{
				console("maybe try gitting gud.");
				return;
			}
			printAchievements();
			return;
		case "toggle ally vision":
		case "toggle vision":
		case "toggle vis":
			gameState.allyVisionEnabled = !gameState.allyVisionEnabled;
			return;
		default:
			return; // Some other message
	}

	if (!gameState.allowColourChange)
	{
		playSound("beep8.ogg");
		if (gameState.themCount >= 5) console("Too late for that now!");
		return;
	}

	gameState.playerColour = colour;
	changePlayerColour(CAM_HUMAN_PLAYER, colour);
	adaptFactionColours();
	playSound("beep6.ogg");
}

function eventGroupSeen(viewer, group)
{
	// For whatever NEXUS-forsaken reason, I can't figure out how to get eventObjectSeen() to
	// work, so instead we have to use eventGroupSeen() instead, even for individual objects.
	// Special dummy ("Sight Trigger" or ST) group labels are created prior to this event getting called 
	// for groups containing the things we actually want to check if the player can see. For example:
	// the Royalist's heavy commander (a droid with the label "royHvyCommander") is part of a labeled
	// group with the name ("royHvyCommanderST"), which will call this event when seen. We can then
	// tell what was seen by comparing `group` with the object's group.
	const coaTransport = getObject("coaResTransport");
	const royCommander = getObject("royHvyCommander");
	const resPython = getObject("resPython");

	if (camDef(coaTransport) && coaTransport !== null && group === coaTransport.group)
	{
		// The player has spotted the Coalition transport inside the Resistance base
		queue("coalitionEvac", camSecondsToMilliseconds(2));
	}
	else if (camDef(royCommander) && royCommander !== null && group === royCommander.group)
	{
		// The player has spotted the Royalist's heavy commander

		// Make the Royalist's heavy commander attack after a delay
		queue("royHvyCommanderAttack", camChangeOnDiff(camMinutesToMilliseconds(12)));

		// Coalition warning about the commander
		if (gameState.coalition.allianceState === "ALLIED")
		{
			if (difficulty <= MEDIUM)
			{
				missionMessage("COACOMMANDERELITEMSG", "INTEL");
			}
			else if (difficulty === HARD)
			{
				missionMessage("COACOMMANDERSPECIALMSG", "INTEL");
			}
			else
			{
				missionMessage("COACOMMANDERHEROMSG", "INTEL");
			}
		}
	}
	else if (camDef(resPython) && resPython !== null && group === resPython.group)
	{
		// The player has spotted the Resistance's Python tank
		gameState.resistance.pythonSpotted = true;
		// Resistance message about evacuating the base
		missionMessage("RESEVACMSG", "TRANS");

		// Move the Resistance Python to attack
		camManageGroup(resPython.group, CAM_ORDER_ATTACK, {targetPlayer: CAM_HUMAN_PLAYER, repair: 50});
	}
}

function eventGameLoaded()
{
	// These triggers get removed on save-load, remake them here
	const transport = getObject("coaResTransport");
	if (camDef(transport) && transport !== null)
	{
		addLabel({ type: GROUP, id: camMakeGroup(transport) }, "coaResTransportST", false);
		resetLabel("coaResTransportST", CAM_HUMAN_PLAYER); // subscribe for eventGroupSeen
	}
	const python = getObject("resPython");
	if (!gameState.resistance.pythonSpotted && camDef(python) && python !== null)
	{
		addLabel({ type: GROUP, id: camMakeGroup(python) }, "resPythonST", false);
		resetLabel("resPythonST", CAM_HUMAN_PLAYER); // subscribe for eventGroupSeen
	}
	const commander = getObject("royHvyCommander");
	if (gameState.phase >= 1 && !gameState.royalists.commanderSpotted && camDef(commander) && commander !== null)
	{
		// This specific commander is only set up after the map expands to sidestep some wackiness
		addLabel({ type: GROUP, id: camMakeGroup(commander) }, "royHvyCommanderST", false);
		resetLabel("royHvyCommanderST", CAM_HUMAN_PLAYER); // subscribe for eventGroupSeen
		// Since this overrides the commander's previous group, we'll need to manage it again
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
	}
}


//
// v Misc. functions v
//

// Makes sure that no faction is the same color as the player
function adaptFactionColours()
{
	const PLAYER_COLOR = gameState.playerColour;
	// Resistance
	if (PLAYER_COLOR !== 5) // player is not blue?
	{
		// Set to blue
		changePlayerColour(CAM_THE_RESISTANCE, 5);
	}
	else
	{
		// Set to green
		changePlayerColour(CAM_THE_RESISTANCE, 0);
	}
	// AMPHOS
	if (PLAYER_COLOR !== 10) // player is not white?
	{
		// Set to white
		changePlayerColour(CAM_AMPHOS, 10);
	}
	else
	{
		// Set to green
		changePlayerColour(CAM_AMPHOS, 0);
	}
	// Hellraisers
	if (PLAYER_COLOR !== 4) // player is not red?
	{
		// Set to red
		changePlayerColour(CAM_HELLRAISERS, 4);
	}
	else
	{
		// Set to orange
		changePlayerColour(CAM_HELLRAISERS, 1);
	}
	// Coalition
	if (PLAYER_COLOR !== 7) // player is not cyan?
	{
		// Set to cyan
		changePlayerColour(CAM_THE_COALITION, 7);
	}
	else
	{
		// Set to brown
		changePlayerColour(CAM_THE_COALITION, 15);
	}
	// Royalists
	if (PLAYER_COLOR !== 9) // player is not purple?
	{
		// Set to purple
		changePlayerColour(CAM_ROYALISTS, 9);
	}
	else
	{
		// Set to black
		changePlayerColour(CAM_ROYALISTS, 3);
	}
}

function allyVision()
{
	if (gameState.allyVisionEnabled)
	{
		viewAlliedObjects();
	}
}

// Grant the player momentary vision of all allied objects
function viewAlliedObjects()
{
	let objList = [];

	if (gameState.resistance.allianceState === "ALLIED")
	{
		objList = objList.concat(enumStruct(CAM_THE_RESISTANCE).filter((struct) => (struct.stattype !== WALL)));
		objList = objList.concat(enumDroid(CAM_THE_RESISTANCE));
	}
	if (gameState.amphos.allianceState === "ALLIED")
	{
		objList = objList.concat(enumStruct(CAM_AMPHOS).filter((struct) => (struct.stattype !== WALL)));
		objList = objList.concat(enumDroid(CAM_AMPHOS));
	}
	if (gameState.hellraisers.allianceState === "ALLIED")
	{
		objList = objList.concat(enumStruct(CAM_HELLRAISERS).filter((struct) => (struct.stattype !== WALL)));
		objList = objList.concat(enumDroid(CAM_HELLRAISERS));
	}
	if (gameState.coalition.allianceState === "ALLIED")
	{
		objList = objList.concat(enumStruct(CAM_THE_COALITION).filter((struct) => (struct.stattype !== WALL)));
		objList = objList.concat(enumDroid(CAM_THE_COALITION));
	}

	const RANGE = 8 * 128; // 8 tiles

	for (let i = 0; i < objList.length; i++)
	{
		addSpotter(objList[i].x, objList[i].y, CAM_HUMAN_PLAYER, RANGE, false, gameTime + camSecondsToMilliseconds(1));
	}
}

// Check if the player has the big debt
function recessionCheck()
{
	const DEBT = queuedPower(CAM_HUMAN_PLAYER) - playerPower(CAM_HUMAN_PLAYER);
	if (DEBT >= 2100)
	{
		achievementMessage("Recession", "Reach negative 2100 power");
		removeTimer("recessionCheck");
	}
}

// Check if the player has a Hero-ranked unit
function heroCheck()
{
	const playerDroids = enumDroid(CAM_HUMAN_PLAYER);
	for (const droid of playerDroids)
	{
		if (camGetDroidRank(droid) >= 8)
		{
			achievementMessage("Gold Star", "Level any unit to Hero rank");
			removeTimer("heroCheck");
		}
	}
}

// Checks if any ENEMY base has been destroyed twice
function baseCheck()
{
	for (const blabel in mis_baseData)
	{
		if (!camBaseIsFriendly(blabel) && camBaseDestroyedCount(blabel) >= 2)
		{
			// This base belongs to an enemy and has been destroyed at least twice
			achievementMessage("A Poorly-Learned Lesson", "Destroy the same base twice");
			removeTimer("baseCheck");
			return;
		}
	}
}

function boulderCheck()
{
	if (enumFeature(ALL_PLAYERS, "Boulder1").concat(enumFeature(ALL_PLAYERS, "Boulder2").concat(enumFeature(ALL_PLAYERS, "Boulder3"))).length === 0)
	{
		// All orange rocks on the map have been destroyed
		removeTimer("boulderCheck");
		setTimer("funnyEffects", camSecondsToMilliseconds(0.5));

		console("Something is emerging from the crash site!");
	}
}

function funnyEffects()
{
	gameState.funny++; // :D
	if (gameState.funny === 10)
	{
		camCompleteRequiredResearch(
			["R-Vehicle-Metals06", "R-Vehicle-Armor-Heat03", "R-Cyborg-Metals06",
			"R-Cyborg-Armor-Heat03", "R-Vehicle-Engine06", "R-Wpn-Cannon-Damage06",
			"R-Wpn-Cannon-ROF04", "R-Wpn-Cannon-Accuracy02", "R-Wpn-AAGun-ROF03",
			"R-Wpn-AAGun-Damage03", "R-Wpn-AAGun-Accuracy02", "R-Wpn-Rocket-Accuracy04",
			"R-Wpn-Rocket-Damage06", "R-Wpn-Rocket-ROF03", "R-Wpn-Flamer-Damage06",
			"R-Wpn-Flamer-ROF03", "R-Struc-RprFac-Upgrade02", "R-Sys-NEXUSrepair"], 6);
		return;
	}
	if (gameState.funny === 16)
	{
		// Clear the crash site (in a funny way)
		const pos = camMakePos("startPosition"); // Funny origin point
		cameraSlide(pos.x * 128, pos.y * 128); // Make sure the player sees the funny
		fireWeaponAtLoc("LasSat", camMakePos("startPosition").x, camMakePos("startPosition").y, 6); // Funny laser
		return;
	}
	if (gameState.funny === 20)
	{
		// Add funny enemies
		const lCyborg = { body: "CyborgLightBody", prop: "CyborgLegs03", weap: "Cyb-Wpn-Laser" };
		const fCyborg = { body: "CyborgLightBody", prop: "CyborgLegs03", weap: "Cyb-Wpn-Thermite" };
		const tCyborg = { body: "CyborgHeavyBody", prop: "CyborgLegs03", weap: "Cyb-Hvywpn-TK" };
		const rCyborg = { body: "CyborgLightBody", prop: "CyborgLegs03", weap: "CyborgRepair" };
		const bTank = { body: "Body2SUP", prop: "tracked03", weap: "Rocket-BB" };
		const rTank = { body: "Body6SUPP", prop: "tracked03", weap: "HeavyRepair" };
		const cTank = { body: "Body11ABT", prop: "tracked03", weap: "Cannon375mmMk1" };
		const aTank = { body: "Body10MBT", prop: "tracked03", weap: "QuadRotAAGun" };
		const funnyTank = { body: "Body14SUP", prop: "tracked03", weap1: "Missile-HvySAM", weap2: "Cannon6TwinAslt" };
		const pos = camMakePos("startPosition");
		for (let i = 1; i <= 8; i++)
		{
			addDroid(6, pos.x, pos.y, camNameTemplate(lCyborg), lCyborg.body, lCyborg.prop, "", "", lCyborg.weap);
		}
		for (let i = 1; i <= 4; i++)
		{
			addDroid(6, pos.x, pos.y, camNameTemplate(fCyborg), fCyborg.body, fCyborg.prop, "", "", fCyborg.weap);
			addDroid(6, pos.x, pos.y, camNameTemplate(tCyborg), tCyborg.body, tCyborg.prop, "", "", tCyborg.weap);
			addDroid(6, pos.x, pos.y, camNameTemplate(rCyborg), rCyborg.body, rCyborg.prop, "", "", rCyborg.weap);
			addDroid(6, pos.x, pos.y, camNameTemplate(bTank), bTank.body, bTank.prop, "", "", bTank.weap);
		}
		for (let i = 1; i <= 2; i++)
		{
			addDroid(6, pos.x, pos.y, camNameTemplate(rTank), rTank.body, rTank.prop, "", "", rTank.weap);
			addDroid(6, pos.x, pos.y, camNameTemplate(cTank), cTank.body, cTank.prop, "", "", cTank.weap);
			addDroid(6, pos.x, pos.y, camNameTemplate(aTank), aTank.body, aTank.prop, "", "", aTank.weap);
		}
		const funnyDroid = addDroid(6, pos.x, pos.y, _("NOT CANNON"), funnyTank.body, funnyTank.prop, "", "", funnyTank.weap1, funnyTank.weap2);
		addLabel(funnyDroid, "flashlightHolder");
		camAddArtifact({"flashlightHolder": { tech: "R-Wpn-Laser01" }});
		camManageGroup(camMakeGroup(enumDroid(6, DROID_ANY)), CAM_ORDER_ATTACK, { repair: 40, targetPlayer: CAM_HUMAN_PLAYER});
		return;
	}
	if (gameState.funny > 20)
	{
		if (countDroid(DROID_ANY, 6) === 0)
		{
			// no more funny :(
			removeTimer("funnyEffects");
			return;
		}

		if (gameState.funny % 2 === 1)
		{
			changePlayerColour(6, 4); // Set them to red
		}
		else
		{
			changePlayerColour(6, 3); // Set them to black
		}
	}
}

// Announce that the player has earned an achievement
// Also checks to make sure achievements can't be "earned" twice
function achievementMessage(name, desc)
{
	const aLog = gameState.achievementLog;
	for (let i = 0; i < aLog.length; i++)
	{
		if (aLog[i] === name)
		{
			return; // Already granted this achievement
		}
	}
	gameState.achievementLog.push(name);

	console("Achievement Earned: [" + name + "] " + desc);
	playSound("beep6.ogg");
}

// Prints all the achievements the player has earned to the console
function printAchievements()
{
	let aMessage = "";
	for (let i = 0; i < gameState.achievementLog.length; i++)
	{
		if (aMessage === "")
		{
			aMessage = gameState.achievementLog[i];
		}
		else
		{
			aMessage = aMessage + ", " + gameState.achievementLog[i];
		}

		if (i !== 0 && i % 8 === 0)
		{
			// Move to a new line every 8 achievements listed
			console(aMessage);
			aMessage = "";
		}
	}
	console(aMessage);
}

// Give the player a message, along with a notification and optional voice alert
// Also checks to make sure messages aren't given twice
function missionMessage(message, introSound)
{
	const mLog = gameState.messageLog;
	for (let i = 0; i < mLog.length; i++)
	{
		if (mLog[i] === message)
		{
			return; // Already gave this message
		}
	}
	gameState.messageLog.push(message);

	if (camDef(introSound))
	{
		let voiceAlert = "pcv455.ogg"; // "Incoming Transmission"
		if (introSound === "INTEL")
		{
			voiceAlert = "pcv456.ogg"; // "Incoming Intelligence Report"
		}

		camPlayVideos([voiceAlert, {video: message, type: MISS_MSG}]);
		queue("messageAlert", camSecondsToMilliseconds(3.4));
	}
	else
	{
		camPlayVideos({video: message, type: MISS_MSG});
		queue("messageAlert", camSecondsToMilliseconds(0.2));
	}
}

// This function is called after a message is 'played', a delay is required for the 'alert' sound to play properly in all cases
function messageAlert()
{
	playSound("beep7.ogg"); // Play a little noise to notify the player that they have a new message
}

// Display information about factions the player has interacted with.
function displayFactionInfo()
{
	// Resistance info
	if (gameState.resistance.allianceState === "OFFER")
	{
		console(_("RESISTANCE: OFFERING ALLIANCE"));
	}
	else if (gameState.resistance.allianceState !== "NEUTRAL")
	{
		console(_("RESISTANCE: ") + _(gameState.resistance.allianceState));
	}

	// AMPHOS info
	if (gameState.amphos.allianceState === "NEUTRAL" && gameState.amphos.pitched)
	{
		// Describe steps to alliance
		console(_("AMPHOS CONDITIONS FOR NEGOTIATIONS:"));

		let status = "NOT DONE";
		if (getObject("royHoverCommander") === null)
		{
			status = "DONE";
		}
		console(_("Destroy the Royalist hover commander (") + status + _(")"));

		if (gameState.amphos.requireNW)
		{
			status = "NOT DONE";
			if (camBaseIsEliminated("nwIslandBase"))
			{
				status = "DONE";
			}
			console(_("Destroy the Royalist island base (") + status + _(")"));
		}

		let numBases = 0;
		if (!camBaseIsEliminated("southIslandBase")) numBases++;
		if (!camBaseIsEliminated("westIslandBase")) numBases++;
		if (!camBaseIsEliminated("northIslandBase")) numBases++;
		if (gameState.amphos.requireNW)
		{
			if (!camBaseIsEliminated("ampNWIsleRepBase")) numBases++;
			console(_("Allow AMPHOS control of all island bases (") + numBases + _("/4)"));
		}
		else
		{
			console(_("Allow AMPHOS control of all island bases (") + numBases + _("/3)"));
		}

		console(_("AMPHOS main base must not be attacked"));
	}
	else if (gameState.amphos.allianceState === "OFFER")
	{
		console(_("AMPHOS: OFFERING ALLIANCE"));
	}
	else if (gameState.amphos.allianceState === "HOSTILE" && !hasBases(CAM_AMPHOS))
	{
		// Give the player a tip on how many units are left
		console(_("AMPHOS: ") + countDroid(DROID_ANY, CAM_AMPHOS) + _(" UNITS REMAINING"));
	}
	else if (gameState.amphos.allianceState !== "NEUTRAL")
	{
		console(_("AMPHOS: ") + _(gameState.amphos.allianceState));
	}

	// Hellraiser info
	if (gameState.hellraisers.allianceState === "NEUTRAL" && gameState.hellraisers.pitched)
	{
		// Describe steps to alliance
		console(_("HELLRAISERS CONDITIONS FOR NEGOTIATIONS:"));

		const NUM_STRUCTS = gameState.hellraisers.structThreshold - enumStruct(CAM_HELLRAISERS).length;
		console(_("Allow the Hellraisers to rebuild structures (") + NUM_STRUCTS + _(" remaining)"));

		console(_("The Hellraiser main base must not be attacked"));
	}
	else if (gameState.hellraisers.allianceState === "OFFER")
	{
		console(_("HELLRAISERS: OFFERING ALLIANCE"));
	}
	else if (gameState.hellraisers.allianceState === "HOSTILE" && !hasBases(CAM_HELLRAISERS))
	{
		// Give the player a tip on how many units are left
		console(_("HELLRAISERS: ") + countDroid(DROID_ANY, CAM_HELLRAISERS) + _(" UNITS REMAINING"));
	}
	else if (gameState.hellraisers.allianceState !== "NEUTRAL")
	{
		console(_("HELLRAISERS: ") + _(gameState.hellraisers.allianceState));
	}

	// Coalition info
	if (gameState.coalition.allianceState === "NEUTRAL" && gameState.coalition.pitched && gameState.coalition.allowAlliance)
	{
		// Describe steps to alliance
		console(_("COALITION CONDITIONS FOR NEGOTIATIONS:"));

		let status = "NOT DONE";
		if (camBaseIsEliminated("royalistCentralFactoryZone"))
		{
			status = "DONE";
		}
		console(_("Destroy the Royalist central factory base (") + status + _(")"));

		console(_("No Coalition bases may be attacked"));
	}
	else if (gameState.coalition.allianceState === "OFFER")
	{
		console(_("COALITION: OFFERING ALLIANCE"));
	}
	else if (gameState.coalition.allianceState === "HOSTILE" && !hasBases(CAM_THE_COALITION))
	{
		// Give the player a tip on how many units are left
		console(_("COALITION: ") + countDroid(DROID_ANY, CAM_THE_COALITION) + _(" UNITS REMAINING"));
	}
	else if (gameState.coalition.allianceState === "NEUTRAL" && gameState.coalition.proxyHostile)
	{
		// Show them as hostile, but don't infinitly run factories (yet)
		console(_("COALITION: HOSTILE"));
	}
	else if (gameState.coalition.allianceState !== "NEUTRAL")
	{
		console(_("COALITION: ") + _(gameState.coalition.allianceState));
	}

	// Royalist "info"
	if (gameState.royalists.fakeout)
	{
		console(_("ROYALISTS: OFFERING ALLIANCE"));
	}
}

function eventStartLevel()
{
	// Set the camera near the crashed transport
	const startpos = getObject("startPosition");
	centreView(startpos.x, startpos.y);

	// Set starting power to 1/2 of the player's max power reserves
	const STARTING_POWER = 6000 - (1000 * difficulty);

	setPower(STARTING_POWER, CAM_HUMAN_PLAYER);

	setAlliance(CAM_ROYALISTS, CAM_AMPHOS, true);
	setAlliance(CAM_THE_COALITION, CAM_HELLRAISERS, true);

	// Give each faction its starting research
	camCompleteRequiredResearch(mis_playerRes, CAM_HUMAN_PLAYER);
	if (difficulty > EASY) camCompleteRes(["R-Sys-Engineering01"], CAM_THE_RESISTANCE);
	camCompleteRequiredResearch(["R-Comp-CommandTurret01"], CAM_THE_RESISTANCE); // Required so that they can rebuild commanders
	camCompleteRequiredResearch(mis_amphosRes, CAM_AMPHOS);
	camCompleteRequiredResearch(mis_hellraiserRes, CAM_HELLRAISERS);
	camCompleteRequiredResearch(mis_coalitionStartRes, CAM_THE_COALITION);
	camCompleteRequiredResearch(mis_royalistStartRes, CAM_ROYALISTS);

	for (let i = 0; i < mis_playerStructs.length; ++i)
	{
		enableStructure(mis_playerStructs[i], CAM_HUMAN_PLAYER);
	}

	if (difficulty !== SUPEREASY) 
	{
		const playerDroids = enumDroid(6, DROID_ANY);
		for (let i = 0; i < playerDroids.length; i++)
		{
			// Starting droids get higher XP on higher difficulties
			camSetDroidRank(playerDroids[i], difficulty - 1);
		}
	}

	// Set the time to night
	camSetDayTime(850);

	camSetEnemyBases(mis_baseData);

	// FlaME apparently has a hard limit on how many structures of one type can be placed, so some Royalist walls are 
	// placed as standard Hardcrete walls. This function converts them to their Collective-styled variants.
	camUpgradeOnMapStructures("A0HardcreteMk1Wall", "CollectiveWall", CAM_ROYALISTS);
	if (difficulty === INSANE)
	{
		// Swap some Hellraiser Twin MG strutures with HMG variants
		camUpgradeOnMapStructures("GuardTower2", "GuardTower1", CAM_HELLRAISERS);
		camUpgradeOnMapStructures("PillBox2", "PillBox1", CAM_HELLRAISERS);
	}

	initializeGameInfo();

	adaptFactionColours(); // Initialize faction colours

	queue("rankCommanders", camSecondsToMilliseconds(0.1));
	queue("gatherCommanderUnits", camSecondsToMilliseconds(0.2));
	queue("initializeMapGroups", camSecondsToMilliseconds(0.3));

	setTimer("baseReclaimCheck", camSecondsToMilliseconds(120));
	setTimer("recallSupportGroups", camSecondsToMilliseconds(15));
	setTimer("transportTick", camSecondsToMilliseconds(3));
	setTimer("updateReclaimerData", camMinutesToMilliseconds(8));
	setTimer("recessionCheck", camSecondsToMilliseconds(1));
	setTimer("boulderCheck", camSecondsToMilliseconds(5));
	setTimer("heroCheck", camSecondsToMilliseconds(3));
	setTimer("baseCheck", camSecondsToMilliseconds(2));
	setTimer("orderOliveTrucks", camSecondsToMilliseconds(2));
	setTimer("allyVision", camSecondsToMilliseconds(1));

	if (difficulty < HARD)
	{
		// Remove defensive structures around the two Resistance oil derricks
		const oilStructs = enumArea("resGiftZone", CAM_THE_RESISTANCE, false);
		for (let i = oilStructs.length - 1; i >= 0; i--)
		{
			if (oilStructs[i].type === STRUCTURE && oilStructs[i].stattype !== RESOURCE_EXTRACTOR)
			{
				camSafeRemoveObject(oilStructs[i]);
			}
		}
	}

	// Set the scroll limits for the initial crash "cutscene"
	setScrollLimits(startpos.x - 6, startpos.y - 6, startpos.x + 6, startpos.y + 6);

	// Play sound effects for the transport crash 
	playSound("crash.ogg", startpos.x, startpos.y);

	queue("endCrashScene", camSecondsToMilliseconds(14));
}