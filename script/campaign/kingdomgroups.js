// Unit management and production functions (VTOLs, attack groups, patrols, etc.)

const PRODUCTION_STARTUP_DELAY = Math.pow(2, (3 - difficulty)); // 8, 4, 2, 1, 0.5 (minutes) Note that on Insane this value is ignored

// Assign produced non-VTOL droids to various groups
function assignDroidResistance(droid)
{
	// Loop through Resistance groups to find one with an open spot
	const groups = gameState.resistance.groups;
	for (let groupName in groups)
	{
		if (groupOpen(CAM_THE_RESISTANCE, groupName))
		{
			// The group is open to new members, add this droid
			groupAdd(groups[groupName].id, droid);
			checkResistanceGroups(); // Check group sizes for production
			return; // Unit assigned; all done.
		}
	}
	// If the droid hasn't been assigned by this point, it'll just be managed by its factory
}

// Checks the size of the refillable groups in a faction to determine if they need more droids.
// Also assigns groups their main/fallback orders depending on their size.
function checkResistanceGroups()
{
	// Loop through the Resistance's groups and find any that are undermanned
	const groups = gameState.resistance.groups;
	let groupsFull = true;
	for (const groupName in groups)
	{
		const groupInfo = groups[groupName];
		if (groupName !== "commanderGroup")
		{
			manageGroupBySize(groupInfo, true); // Engage/fallback depending on size
		}
		if (groupOpen(CAM_THE_RESISTANCE, groupName))
		{
			// Group is undermanned! Call for production to resume.
			queueStartProduction(CAM_THE_RESISTANCE, "GROUND");
			groupsFull = false;
		}
	}

	// Note that if the conditions (e.g. being allied with the player) for a group to "exist" are not met,
	// then not only will units not be assigned to the group, but the group will also be treated as "full".

	// Production doesn't stop if the faction is hostile towards the player, units
	// will just be managed by their parent factory just like in the normal campaign.
	if (groupsFull && gameState.resistance.allianceState !== "HOSTILE")
	{
		// All groups are full! Stop unit production
		setProduction(CAM_THE_RESISTANCE, "GROUND", false);
	}
}

function assignDroidAmphos(droid)
{
	// ALWAYS assign Sensor/Ripple Rocket units to the the player support group
	if (droid.isSensor || (camDef(droid.weapons[0]) && droid.weapons[0].name === "Rocket-BB"))
	{
		if (gameState.amphos.allianceState === "ALLIED")
		{
			// Add it directly to the support group, ignoring size checks
			groupAdd(gameState.amphos.groups.playerSupportGroup.id, droid);
			checkAmphosGroups();
			return;
		}
		else
		{
			// Let the factory automatically group it
			return;
		}
	}

	const groups = gameState.amphos.groups;
	for (const groupName in groups)
	{
		if (groupOpen(CAM_AMPHOS, groupName))
		{
			// The group is open to new members, add this droid
			groupAdd(groups[groupName].id, droid);
			checkAmphosGroups();
			return;
		}
	}
}

function checkAmphosGroups()
{
	if (gameState.phase < 1)
	{
		// Don't reinforce groups yet.
		setProduction(CAM_AMPHOS, "GROUND", false);
		return;
	}
	
	const groups = gameState.amphos.groups;
	let groupsFull = true;
	for (const groupName in groups)
	{
		const groupInfo = groups[groupName];
		if (groupName !== "commanderGroup")
		{
			manageGroupBySize(groupInfo, true); // Engage/fallback depending on size
		}
		if (groupOpen(CAM_AMPHOS, groupName))
		{
			// Group is undermanned! Call for production to resume.
			queueStartProduction(CAM_AMPHOS, "GROUND");
			groupsFull = false;
		}
	}

	if (groupsFull && gameState.amphos.allianceState !== "HOSTILE")
	{
		// All groups are full! Stop unit production
		setProduction(CAM_AMPHOS, "GROUND", false);
	}
}

function assignDroidHellraisers(droid)
{
	const groups = gameState.hellraisers.groups;
	for (const groupName in groups)
	{
		if (groupOpen(CAM_HELLRAISERS, groupName))
		{
			// The group is open to new members, add this droid
			groupAdd(groups[groupName].id, droid);
			checkHellraiserGroups();
			return;
		}
	}
}

function checkHellraiserGroups()
{
	if (gameState.phase < 1)
	{
		// Don't reinforce groups yet.
		setProduction(CAM_HELLRAISERS, "GROUND", false);
		return;
	}

	const groups = gameState.hellraisers.groups;
	let groupsFull = true;
	for (const groupName in groups)
	{
		const groupInfo = groups[groupName];
		if (groupName !== "playerSupportGroup")
		{
			manageGroupBySize(groupInfo, true); // Engage/fallback depending on size
		}
		else
		{
			manageGroupBySize(groupInfo, false); // No falling back
		}
		if (groupOpen(CAM_HELLRAISERS, groupName))
		{
			// Group is undermanned! Call for production to resume.
			queueStartProduction(CAM_HELLRAISERS, "GROUND");
			groupsFull = false;
		}
	}

	if (groupsFull && gameState.hellraisers.allianceState !== "HOSTILE")
	{
		// All groups are full! Stop unit production
		setProduction(CAM_HELLRAISERS, "GROUND", false);
	}
}

function assignDroidCoalition(droid)
{
	const groups = gameState.coalition.groups;
	for (const groupName in groups)
	{
		if (groupOpen(CAM_THE_COALITION, groupName))
		{
			// The group is open to new members, add this droid
			groupAdd(groups[groupName].id, droid);
			checkCoalitionGroups();
			return;
		}
	}

	// Special check to make sure units don't go unmanaged if the Coalition is focused on the Royalists and isn't allied with the player
	if (gameState.coalition.offensive && gameState.coalition.allianceState !== "HOSTILE")
	{
		// Force add it to the "support" group
		groupAdd(gameState.coalition.groups.playerSupportGroup.id, droid);
	}
}

function checkCoalitionGroups()
{
	if (gameState.phase < 2)
	{
		// Don't reinforce groups yet.
		setProduction(CAM_THE_COALITION, "GROUND", false);
		return;
	}

	const groups = gameState.coalition.groups;
	let groupsFull = true;
	for (const groupName in groups)
	{
		const groupInfo = groups[groupName];
		if (groupName === "playerSupportGroup")
		{
			manageGroupBySize(groupInfo, false); // No falling back
		}
		else if (groupName !== "commanderGroup")
		{
			manageGroupBySize(groupInfo, true); // Engage/fallback depending on size
		}
		if (groupOpen(CAM_THE_COALITION, groupName))
		{
			// Group is undermanned! Call for production to resume.
			queueStartProduction(CAM_THE_COALITION, "GROUND");
			groupsFull = false;
		}
	}

	if (groupsFull && gameState.coalition.allianceState !== "HOSTILE")
	{
		// All groups are full! Stop unit production
		setProduction(CAM_THE_COALITION, "GROUND", false);
	}
}

function assignGroundDroidRoyalists(droid)
{
	// ALWAYS assign Bunker Buster units to the reclaimer group
	if (camDef(droid.weapons[0]) && droid.weapons[0].name === "Rocket-BB")
	{
		// Add it directly to the reclaimer group, ignoring size checks
		groupAdd(gameState.royalists.groundGroups.groundReclaimerGroup.id, droid);
		checkRoyalistGroundGroups();
		return;
	}

	if (gameState.royalists.underAttack)
	{
		// Royalists are under attack! Only assign units to
		// commanders, otherwise leave them to their factories
		if (groupOpen(CAM_ROYALISTS, "heavyCommanderGroup"))
		{
			groupAdd(gameState.royalists.groundGroups.heavyCommanderGroup.id, droid);
			return;
		}
		if (groupOpen(CAM_ROYALISTS, "centralCommanderGroup"))
		{
			groupAdd(gameState.royalists.groundGroups.centralCommanderGroup.id, droid);
			return;
		}
		const commander = getObject("royAssaultCommander");
		if (commander !== null && groupSize < camGetCommanderMaxGroupSize(commander))
		{
			groupAdd(gameState.royalists.assaultCommandGroup.id, droid);
		}
		return;
	}

	const groups = gameState.royalists.groundGroups;
	for (const groupName in groups)
	{
		if (groupOpen(CAM_ROYALISTS, groupName))
		{
			// The group is open to new members, add this droid
			groupAdd(groups[groupName].id, droid);
			checkRoyalistGroundGroups();
			return;
		}
	}
}

function checkRoyalistGroundGroups()
{
	if (gameState.royalists.underAttack)
	{
		// Royalists are under attack; do nothing here
		return;
	}
	if (gameState.phase < 2)
	{
		// Don't reinforce ground groups yet.
		setProduction(CAM_ROYALISTS, "GROUND", false);
		return;
	}

	const groups = gameState.royalists.groundGroups;
	let groupsFull = true;
	for (const groupName in groups)
	{
		const groupInfo = groups[groupName];
		if (groupName === "groundReclaimerGroup")
		{
			manageGroupBySize(groupInfo, true); // Engage/fallback depending on size
		}
		else if (groupName !== "heavyCommanderGroup" && groupName !== "centralCommanderGroup")
		{
			manageGroupBySize(groupInfo, false); // No falling back
		}
		if (groupOpen(CAM_ROYALISTS, groupName))
		{
			// Group is undermanned! Call for production to resume.
			queueStartProduction(CAM_ROYALISTS, "GROUND");
			groupsFull = false;
		}
	}

	if (groupsFull)
	{
		// All groups are full! Stop unit production
		setProduction(CAM_ROYALISTS, "GROUND", false);
	}
}

function assignHoverDroidRoyalists(droid)
{
	// ALWAYS assign Bunker Buster units to the reclaimer group
	if (camDef(droid.weapons[0]) && droid.weapons[0].name === "Rocket-BB")
	{
		// Add it directly to the reclaimer group, ignoring size checks
		groupAdd(gameState.royalists.hoverGroups.hoverReclaimerGroup.id, droid);
		checkRoyalistHoverGroups();
		return;
	}

	if (gameState.royalists.underAttack)
	{
		// Royalists are under attack! Only assign units to
		// commanders, otherwise leave them to their factories
		if (groupOpen(CAM_ROYALISTS, "hoverCommanderGroup"))
		{
			groupAdd(gameState.royalists.hoverGroups.hoverCommanderGroup.id, droid);
			return;
		}
		return;
	}

	const groups = gameState.royalists.hoverGroups;
	for (const groupName in groups)
	{
		if (groupOpen(CAM_ROYALISTS, groupName))
		{
			// The group is open to new members, add this droid
			groupAdd(groups[groupName].id, droid);
			checkRoyalistHoverGroups();
			return;
		}
	}
}

function checkRoyalistHoverGroups()
{
	if (gameState.royalists.underAttack)
	{
		// Royalists are under attack; do nothing here
		return;
	}
	if (gameState.phase < 2)
	{
		// Don't reinforce hover groups yet.
		setProduction(CAM_ROYALISTS, "HOVER", false);
		return;
	}

	const groups = gameState.royalists.hoverGroups;
	let groupsFull = true;
	for (const groupName in groups)
	{
		const groupInfo = groups[groupName];
		if (groupName === "lakePatrolGroup" || groupName === "hoverReclaimerGroup")
		{
			manageGroupBySize(groupInfo, true); // Engage/fallback depending on size
		}
		else if (groupName !== "hoverCommanderGroup")
		{
			manageGroupBySize(groupInfo, false); // No falling back
		}
		if (groupOpen(CAM_ROYALISTS, groupName))
		{
			// Group is undermanned! Call for production to resume.
			queueStartProduction(CAM_ROYALISTS, "HOVER");
			groupsFull = false;
		}
	}

	if (groupsFull)
	{
		// All groups are full! Stop unit production
		setProduction(CAM_ROYALISTS, "HOVER", false);
	}
}

function assignAssaultDroidRoyalists(droid)
{
	const commander = getObject("royAssaultCommander");

	let groupInfo = gameState.royalists.assaultCommandGroup;
	let groupSize = enumGroup(groupInfo.id).length;
	// Don't add artillery units to the command group
	if (commander !== null && groupSize < camGetCommanderMaxGroupSize(commander) && !droid.hasIndirect)
	{
		groupAdd(groupInfo.id, droid);
		checkRoyalistAssaultGroups();
		return; // All done
	}

	// Just add it to the main group if it wasn't placed in the command group
	// No need to size check, production will stop if both groups are full.
	groupInfo = gameState.royalists.assaultGroup;
	
	groupAdd(groupInfo.id, droid);
	checkRoyalistAssaultGroups();
}

function checkRoyalistAssaultGroups()
{
	if (gameState.royalists.underAttack)
	{
		// Royalists are under attack; do nothing here
		return;
	}

	let allGroupsFull = true;

	const commander = getObject("royAssaultCommander");

	let groupInfo = gameState.royalists.assaultCommandGroup;
	let groupSize = enumGroup(groupInfo.id).length;
	if (commander !== null && groupSize < camGetCommanderMaxGroupSize(commander))
	{
		// The command group is active but not full yet
		allGroupsFull = false;
	}

	groupInfo = gameState.royalists.assaultGroup;
	groupSize = enumGroup(groupInfo.id).length;
	if (groupSize < groupInfo.maxSize)
	{
		// Main group is not full yet
		allGroupsFull = false;
	}

	if (allGroupsFull)
	{
		// All groups are full! Stop unit production and begin the assault!
		setProduction(CAM_ROYALISTS, "ASSAULT", false);
		if (!gameState.royalists.fakeout)
		{
			gameState.royalists.assaultFull = true;
			startRoyalistAssault();
		}
	}
}

// Returns true if the provided group should not be considered "full".
// This means that the group is below its max capacity and the group's 
// criteria for existing are still met (e.g. a required base still exists)
function groupOpen(player, groupName)
{
	let groupInfo;
	let groupSize;
	let aState;
	let commander;
	switch (player)
	{
		case CAM_THE_RESISTANCE:
			groupInfo = gameState.resistance.groups[groupName];
			groupSize = enumGroup(groupInfo.id).length;
			aState = gameState.resistance.allianceState;
			switch (groupName)
			{
				case "commanderGroup":
					commander = getObject("resCommander");
					if (commander !== null && groupSize < camGetCommanderMaxGroupSize(commander))
					{
						return true; // Group not full and commander is alive
					}
					break;
				case "playerSupportGroup":
					// Note some groups have special requirements to exist, such as the faction being allied to the player...
					if (aState === "ALLIED" && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
					// ... Or a base being destroyed
				case "coastPatrolGroup":
					if (aState === "ALLIED" && camBaseIsEliminated("eastCoastBase") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				default:
					camDebug("Tried to check if an unkown Resistance group was full!");
					return undefined;
			}
			break;
		case CAM_AMPHOS:
			groupInfo = gameState.amphos.groups[groupName];
			groupSize = enumGroup(groupInfo.id).length;
			aState = gameState.amphos.allianceState;
			switch (groupName)
			{
				case "commanderGroup":
					commander = getObject("ampCommander");
					if (commander !== null && groupSize < camGetCommanderMaxGroupSize(commander))
					{
						return true;
					}
					break;
				case "playerSupportGroup":
					if (aState === "ALLIED" && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "northPatrolGroup":
					if (camBaseIsEliminated("nwIslandBase") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "southPatrolGroup":
					if (groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				default:
					camDebug("Tried to check if an unkown AMPHOS group was full!");
					return undefined;
			}
			break;
		case CAM_HELLRAISERS:
			groupInfo = gameState.hellraisers.groups[groupName];
			groupSize = enumGroup(groupInfo.id).length;
			aState = gameState.hellraisers.allianceState;
			switch (groupName)
			{
				case "playerSupportGroup":
					if (aState === "ALLIED" && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "southPatrolGroup":
					if ((gameState.hellraisers.pitched || camBaseIsEliminated("portBase") || difficulty >= HARD) && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "eastPatrolGroup":
					if (groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "centralPatrolGroup":
					if (camBaseIsEliminated("royalistCentralFactoryZone") && groupSize < groupInfo.maxSize && (aState === "HOSTILE" || aState === "ALLIED"))
					{
						return true;
					}
					break;
				default:
					camDebug("Tried to check if an unkown Hellraiser group was full!");
					return undefined;
			}
			break;
		case CAM_THE_COALITION:
			groupInfo = gameState.coalition.groups[groupName];
			groupSize = enumGroup(groupInfo.id).length;
			aState = gameState.coalition.allianceState;
			switch (groupName)
			{
				case "commanderGroup":
					commander = getObject("coaCommander");
					if (commander !== null && groupSize < camGetCommanderMaxGroupSize(commander))
					{
						return true;
					}
					break;
				case "playerSupportGroup":
					if ((aState === "ALLIED" || gameState.coalition.offensive) && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "southPatrolGroup":
					if (groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "eastPatrolGroup":
					commander = getObject("coaCommander");
					if (commander === null && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				default:
					camDebug("Tried to check if an unkown Coalition group was full!");
					return undefined;
			}
			break;
		case CAM_ROYALISTS:
			groupInfo = gameState.royalists.groundGroups[groupName];
			if (!camDef(groupInfo))
			{
				groupInfo = gameState.royalists.hoverGroups[groupName];
			}
			groupSize = enumGroup(groupInfo.id).length;
			switch (groupName)
			{
				// Ground Groups
				case "heavyCommanderGroup":
					commander = getObject("royHvyCommander");
					if (commander !== null && groupSize < camGetCommanderMaxGroupSize(commander))
					{
						return true;
					}
					break;
				case "centralCommanderGroup":
					commander = getObject("royCentralCommander");
					if (commander !== null && groupSize < camGetCommanderMaxGroupSize(commander))
					{
						return true;
					}
					break;
				case "southPatrolGroup":
					if (!camBaseIsEliminated("southBase") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "coastPatrolGroup":
					if (!camBaseIsEliminated("eastCoastBase") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "pitPatrolGroup":
					if (!camBaseIsEliminated("royalistMountainCheckpoint") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "plainsPatrolGroup":
					if (camBaseIsEliminated("sunkenPlainsBase") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "groundReclaimerGroup":
					if (groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "southAAGarrison":
					if (!camBaseIsEliminated("southRoyalWhirlwindHill") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "westGateGarrison":
					if (!camBaseIsEliminated("westGate") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "southGateGarrison":
					if (!camBaseIsEliminated("southGate") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "checkpointGarrison":
					if (!camBaseIsEliminated("royalistMountainCheckpoint") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "howitzerGarrison":
					if (!camBaseIsEliminated("royalistHowitzerFOB") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "centralGarrison":
					if (!camBaseIsEliminated("royalistCentralFactoryZone") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "coastGarrison":
					if (!camBaseIsEliminated("eastCoastBase") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "riverTownGarrison":
					if (!camBaseIsEliminated("riverTownBase") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "plainsGarrison":
					if (!camBaseIsEliminated("royPlainsRepBase") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "bridgeGarrison":
					if (!camBaseIsEliminated("royBridgeRepBase") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "coalitionBaseGarrison":
					if (!camBaseIsEliminated("royCoalitionRepBase") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				// Hover Groups
				case "hoverCommanderGroup":
					commander = getObject("royHoverCommander");
					if (commander !== null && groupSize < camGetCommanderMaxGroupSize(commander))
					{
						return true;
					}
					break;
				case "lakePatrolGroup":
					commander = getObject("royHoverCommander");
					if (commander === null && !camBaseIsEliminated("nwIslandBase") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "hoverReclaimerGroup":
					if (groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "northLakeGarrison":
					if (!camBaseIsEliminated("northLakeBase") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "nwIslandGarrison":
					if (!camBaseIsEliminated("nwIslandBase") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "southIslandGarrison":
					if (!camBaseIsEliminated("roySWIsleRepBase") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				case "portGarrison":
					if (!camBaseIsEliminated("royPortRepBase") && groupSize < groupInfo.maxSize)
					{
						return true;
					}
					break;
				default:
					camDebug("Tried to check if an unkown Royalist group was full!");
					return undefined;
			}
			break;
		default:
			camDebug("Tried to check if an unkown player's groups are full!");
			return undefined;
	}
	return false; // None of the ckecks passed; group full.
}

// Give a group orders or tell it to fallback based on its size
function manageGroupBySize(groupInfo, fallback)
{
	// Check if the group is at the minimum size to begin executing orders
	const GROUP_SIZE = enumGroup(groupInfo.id).length;
	if (GROUP_SIZE >= groupInfo.minSize)
	{
		// Group is ready to go!
		camManageGroup(groupInfo.id, groupInfo.order, groupInfo.data);
		return; // All done
	}
	// Check if the group is too small to execute its orders
	if (fallback && GROUP_SIZE < groupInfo.minSize)
	{
		// Group is below its minimum size, fallback!
		camManageGroup(groupInfo.id, CAM_ORDER_DEFEND, {pos: groupInfo.fallbackPos});
	}
}

// Send a Royalist/Coalition transport to the nearest LZ if the
// transport is idle and the LZ is waiting for reinforcements.
function transportTick()
{
	if (gameState.royalists.fakeout)
	{
		return;
	}

	let transport = getObject("coaTransport");
	// Has the transporter landed?
	// FIXME: There's GOTTA be a better way to tell if a transport has landed...
	if (transport !== null && transport.order !== DORDER_MOVE && transport.z <= 3)
	{
		// Is the Coalition transport at the home LZ?
		if (camDist(camMakePos("coaTransSpawn"), camMakePos(transport)) < 2)
		{
			if (gameState.coalition.lzRequests.hellraiserLZ)
			{
				// Hellraiser LZ is requesting reinforcements!
				const pos = camMakePos("hellraiserLZ");
				orderDroidLoc(transport, DORDER_MOVE, pos.x, pos.y);
			}
			else if (gameState.coalition.lzRequests.westGateLZ && camBaseIsEliminated("royalistMountainCheckpoint"))
			{
				// West gate LZ is requesting reinforcements!
				const pos = camMakePos("westGateLZ");
				orderDroidLoc(transport, DORDER_MOVE, pos.x, pos.y);
			}
			else if (gameState.coalition.lzRequests.coastLZ && camBaseIsEliminated("royalistHowitzerFOB"))
			{
				// Coast LZ is requesting reinforcements!
				const pos = camMakePos("coastLZ");
				orderDroidLoc(transport, DORDER_MOVE, pos.x, pos.y);
			}
		}
		else
		{
			// Transport landed away from home
			const pos = camMakePos("coaTransSpawn");
			orderDroidLoc(transport, DORDER_MOVE, pos.x, pos.y);
			// Find which LZ the transport is at
			for (const lzName in gameState.coalition.lzRequests)
			{
				// Get Coalition-friendly structures at the LZ
				const lzStructs = enumArea(lzName, ALL_PLAYERS, false).filter(function(obj) {
					return (obj.type === STRUCTURE && obj.stattype === DEFENSE 
						&& allianceExistsBetween(CAM_THE_COALITION, obj.player));
				});
				if (camWithinArea(transport, lzName))
				{
					if (lzStructs.length > 0)
					{
						spawnTransportDroids(CAM_THE_COALITION, camMakePos(lzName));
					}
					gameState.coalition.lzRequests[lzName] = false; // Transport has arrived
				}
			}
		}
	}

	transport = getObject("royTransport");
	// Has the transporter landed?
	if (transport !== null && transport.order !== DORDER_MOVE && transport.z <= 3)
	{
		// Is the Royalist transport at the home LZ?
		if (camDist(camMakePos("royTransSpawn"), camMakePos(transport)) < 2)
		{
			for (const lzName in gameState.royalists.lzRequests)
			{
				if (gameState.royalists.lzRequests[lzName])
				{
					// LZ is requesting reinforcements!
					const pos = camMakePos(lzName);
					orderDroidLoc(transport, DORDER_MOVE, pos.x, pos.y);
				}
			}
		}
		else
		{
			// Transport landed away from home
			const pos = camMakePos("royTransSpawn");
			orderDroidLoc(transport, DORDER_MOVE, pos.x, pos.y);
			// Find which LZ the transport is at
			for (const lzName in gameState.royalists.lzRequests)
			{
				// Get Royalist structures at the LZ
				const lzStructs = enumArea(lzName, CAM_ROYALISTS, false).filter(function(obj) {
					return (obj.type === STRUCTURE && obj.stattype === DEFENSE);
				});
				if (camWithinArea(transport, lzName))
				{
					if (lzStructs.length > 0)
					{
						spawnTransportDroids(CAM_ROYALISTS, camMakePos(lzName));
					}
					gameState.royalists.lzRequests[lzName] = false; // Transport has arrived
				}
			}
		}
	}
}

// "Offload" droids from a transporter
function spawnTransportDroids(player, pos)
{
	let droidPool; // Different templates to choose from
	let numDroids = 10; // Number of units to offload (defaults to 10)
	if (player === CAM_THE_COALITION)
	{
		if (gameState.coalition.allianceState !== "ALLIED")
		{
			droidPool = [cTempl.colpod, cTempl.colsar, cTempl.commcan, cTempl.comhmg]; // Tanks
			droidPool = droidPool.concat([cTempl.cybrp, cTempl.cybmg, cTempl.cybca, cTempl.cybgr]); // Cyborgs
			if (difficulty === MEDIUM)
			{
				droidPool.push(cTempl.comsensht); // Add Sensor (halftrack)
				droidPool.push(cTempl.comhmorht); // Add Bombard (halftrack)
			}
			if (difficulty >= MEDIUM)
			{
				droidPool.push(cTempl.scymc); // Add Super Heavy-Gunner
				droidPool.push(cTempl.cohhcan); // Add Heavy Cannon
			}
			if (difficulty >= HARD)
			{
				droidPool.push(cTempl.comsenst); // Add Sensor (tracks)
				droidPool.push(cTempl.comhmort); // Add Bombard (tracks)
				droidPool.push(cTempl.comhrepht); // Add Heavy Repair Turret
			}
			if (difficulty === INSANE)
			{
				droidPool.push(cTempl.cohhcan); // Add (another) Heavy Cannon
			}
			if (camIsResearched("R-Struc-VTOLFactory"))
			{
				droidPool.push(cTempl.comhaa); // Add Cyclone
			}
		}
		else
		{
			droidPool = [cTempl.cohhcan, cTempl.comhmort, cTempl.comsenst]; // Tanks
			droidPool = droidPool.concat([cTempl.cybgr]); // Cyborgs
			if (camIsResearched("R-Wpn-MG4"))
			{
				droidPool.push(cTempl.cybag); // Add Assault Gunner
			}
			else
			{
				droidPool.push(cTempl.cybmg); // Add Machinegunner
			}
			if (camIsResearched("R-Wpn-AAGun04"))
			{
				droidPool.push(cTempl.cohraa); // Add Whirlwind
			}
			else
			{
				droidPool.push(cTempl.comhaa); // Add Cyclone
			}
			if (camIsResearched("R-Wpn-Rocket03-HvAT"))
			{
				droidPool.push(cTempl.colbb); // Add Bunker Buster
			}
			if (camIsResearched("R-Wpn-Rocket07-Tank-Killer"))
			{
				droidPool.push(cTempl.comtk); // Add Tank Killer
			}
			else if (camIsResearched("R-Wpn-Rocket01-LtAT"))
			{
				droidPool.push(cTempl.comlan); // Add Lancer
			}
			if (camIsResearched("R-Wpn-Cannon5"))
			{
				droidPool.push(cTempl.comacan); // Add Assault Cannon
				droidPool.push(cTempl.scyac); // Add Super Auto-Cannon
			}
			else if (camIsResearched("R-Wpn-Cannon4AMk1"))
			{
				droidPool.push(cTempl.comhvcan); // Add Hyper Velocity Cannon
				droidPool.push(cTempl.scyhc); // Add Super HPC
			}
			else
			{
				droidPool.push(cTempl.commcan); // Add Medium Cannon
				droidPool.push(cTempl.scymc); // Add Super Heavy-Gunner
			}
		}

		if (gameState.coalition.allianceState !== "ALLIED")
		{
			numDroids = 2 + (difficulty * 2); // 2, 4, 6, 8, 10
		}
	}

	if (player === CAM_ROYALISTS)
	{
		if (gameState.phase === 1) // Early game
		{
			droidPool = [cTempl.rollant, cTempl.rolhmgt, cTempl.cybla, cTempl.cybca];
			if (difficulty >= MEDIUM)
			{
				droidPool.push(cTempl.scyhc); // Add Super HPC
				droidPool.push(cTempl.romacant); // Add Assault Cannon
			}
			if (difficulty === INSANE)
			{
				droidPool.push(cTempl.rominft); // Add Inferno >:)
			}
		}
		else if (gameState.phase === 2) // Mid game
		{
			droidPool = [cTempl.romhrept, cTempl.romacant, cTempl.romacant, cTempl.rominft, cTempl.romsenst]; // Tanks
			droidPool = droidPool.concat([cTempl.cybag, cTempl.cybth, cTempl.scyhc, cTempl.scyac]); // Cyborgs
			if (difficulty !== INSANE)
			{
				droidPool.push(cTempl.rollant); // Add Lancer
				droidPool.push(cTempl.rolhmgt); // Add Heavy Machinegun
				droidPool.push(cTempl.cybla); // Add Lancer (cyborg)
			}
			if (difficulty <= MEDIUM)
			{
				droidPool.push(cTempl.romrmorht); // Add Pepperpot (halftracks)
			}
			else
			{
				droidPool.push(cTempl.romrmort); // Add Pepperpot (tracks)
			}
			if (difficulty >= HARD)
			{
				droidPool.push(cTempl.romagt); // Add Assault Gun
				droidPool.push(cTempl.romtkt); // Add Tank Killer
				// droidPool.push(cTempl.rohbalt); // Add Ballista
			}
			if (difficulty === INSANE)
			{
				droidPool.push(cTempl.rohhcant); // Add Heavy Cannon
				droidPool.push(cTempl.scytk); // Add Super Tank-Killer
			}
		}
		else if (gameState.phase === 3) // Late game
		{
			droidPool = [cTempl.romhrept, cTempl.romacant, cTempl.romacant, cTempl.rominft, cTempl.romsenst]; // Tanks
			droidPool = droidPool.concat([cTempl.cybag, cTempl.cybth, cTempl.scyhc, cTempl.scyac]); // Cyborgs
			if (difficulty <= EASY)
			{
				droidPool.push(cTempl.romrmorht); // Add Pepperpot (halftracks)
				droidPool.push(cTempl.rollant); // Add Lancer
				droidPool.push(cTempl.rolhmgt); // Add Heavy Machinegun
			}
			else
			{
				droidPool.push(cTempl.romrmort); // Add Pepperpot (tracks)
			}
			if (difficulty <= MEDIUM)
			{
				droidPool.push(cTempl.cybla); // Add Lancer (cyborg)
			}
			if (difficulty >= MEDIUM)
			{
				droidPool.push(cTempl.romagt); // Add Assault Gun
				droidPool.push(cTempl.romtkt); // Add Tank Killer
				// droidPool.push(cTempl.rohbalt); // Add Ballista
				droidPool.push(cTempl.rohhcant); // Add Heavy Cannon
				droidPool.push(cTempl.scytk); // Add Super Tank-Killer
			}
			if (difficulty >= HARD)
			{
				droidPool.push(cTempl.rohhcant); // Add (another) Heavy Cannon
				if (gameState.royalists.allowIncenHowit)
				{
					droidPool.push(cTempl.rohihowt); // Add Incendiary Howitzer
				}
				droidPool.push(cTempl.rohhowt); // Add Howitzer
			}
			if (difficulty === INSANE || gameState.royalists.allowTwinAssault)
			{
				droidPool.push(cTempl.rohtacant); // Add Twin Assault Cannon
				droidPool.push(cTempl.rohtagt); // Add Twin Assault Gun
			}
		}

		if (camIsResearched("R-Struc-VTOLFactory"))
		{
			droidPool.push(cTempl.rohraat); // Add Whirlwind
		}

		if (difficulty <= EASY)
		{
			numDroids = 6;
		}
		else if (difficulty === MEDIUM || (gameState.phase < 2 && difficulty === HARD))
		{
			numDroids = 8;
		}
	}

	const spawnedDroids = [];
	for (let i = 1; i <= numDroids; i++)
	{
		const template = droidPool[camRand(droidPool.length)];
		const X_COORD = pos.x - 1 + camRand(3);
		const Y_COORD = pos.y - 1 + camRand(3);
		
		spawnedDroids.push(addDroid(player, X_COORD, Y_COORD, _(camNameTemplate(template)), template.body, template.prop, "", "", template.weap));
	}

	// Order the newly created droids to attack
	camManageGroup(camMakeGroup(spawnedDroids), CAM_ORDER_ATTACK, {
		targetPlayer: CAM_HUMAN_PLAYER,
		regroup: false
	});
}

function hellraiserLZTransRequest()
{
	const transport = getObject("coaTransport");
	const LZ_EXISTS = enumArea("hellraiserLZ", CAM_HELLRAISERS, false).filter(function(obj) {
		return (obj.type === STRUCTURE && obj.stattype === DEFENSE);
	}).length > 0;
	if (!LZ_EXISTS || transport === null)
	{
		return; // LZ is gone (for now)
	}
	if (LZ_EXISTS && !gameState.hellraisers.lzDiscovered)
	{
		hackAddMessage("HELLRAISER_LZ", PROX_MSG, CAM_HUMAN_PLAYER);
		playSound("pcv382.ogg"); // "Enemy LZ Detected"
		gameState.hellraisers.lzDiscovered = true;
	}
	gameState.coalition.lzRequests.hellraiserLZ = true;
}

function westGateLZTransRequest()
{
	if (camBaseIsEliminated("coaWestGateLZ") || camBaseIsEliminated("royalistOuterGate"))
	{
		return; // LZ is gone (for now), or the Royalist outer base is destroyed.
	}
	gameState.coalition.lzRequests.westGateLZ = true;
}

function southGateLZTransRequest()
{
	if (camBaseIsEliminated("ampSouthGateLZ") || camBaseIsEliminated("royalistOuterGate"))
	{
		return; // LZ is gone (for now), or the Royalist outer base is destroyed.
	}
	gameState.coalition.lzRequests.coastLZ = true;
}

function spyLZTransRequest()
{
	const transport = getObject("royTransport");
	if (camBaseIsEliminated("spyBase") || transport === null)
	{
		removeTimer("spyLZTransRequest");
		return; // LZ is gone (forever)
	}
	camDetectEnemyBase("spyBase");
	gameState.royalists.lzRequests.spyLZ = true;
}

function riverLZTransRequest()
{
	const transport = getObject("royTransport");
	if (camBaseIsEliminated("riverLZBase") || transport === null)
	{
		return; // LZ is gone (for now)
	}
	camDetectEnemyBase("riverLZBase");
	gameState.royalists.lzRequests.riverLZ = true;
}

function mountainLZTransRequest()
{
	const transport = getObject("royTransport");
	if (camBaseIsEliminated("mountainLZBase") || transport === null)
	{
		removeTimer("mountainLZTransRequest");
		return; // LZ is gone (forever)
	}
	if (!camBaseIsEliminated("riverLZBase") && difficulty !== INSANE)
	{
		// If the river LZ is active, don't use this LZ (unless on Insane, in which case go nuts)
		return; // Do nothing for now
	}
	camDetectEnemyBase("mountainLZBase");
	gameState.royalists.lzRequests.mountainLZ = true;
}

function coastLZTransRequest()
{
	const transport = getObject("royTransport");
	const LZ_EXISTS = enumArea("coastLZ", CAM_ROYALISTS, false).filter(function(obj) {
		return (obj.type === STRUCTURE && obj.stattype === DEFENSE);
	}).length > 0;
	if (!LZ_EXISTS || transport === null)
	{
		return; // LZ is gone (for now)
	}
	if ((!camBaseIsEliminated("riverLZBase") || !camBaseIsEliminated("mountainLZBase")) && difficulty !== INSANE)
	{
		return; // Do nothing for now
	}
	if (!gameState.royalists.coastLzDiscovered)
	{
		hackAddMessage("COAST_LZ", PROX_MSG, CAM_HUMAN_PLAYER);
		playSound("pcv382.ogg"); // "Enemy LZ Detected"
		gameState.royalists.coastLzDiscovered = true;
	}
	gameState.royalists.lzRequests.coastLZ = true;
}

function howitzerLZTransRequest()
{
	const transport = getObject("royTransport");
	const LZ_EXISTS = enumArea("howitzerLZ", CAM_ROYALISTS, false).filter(function(obj) {
		return (obj.type === STRUCTURE && obj.stattype === DEFENSE);
	}).length > 0;
	if (!LZ_EXISTS || transport === null)
	{
		return; // LZ is gone (for now)
	}
	if ((!camBaseIsEliminated("riverLZBase") || !camBaseIsEliminated("mountainLZBase")) && difficulty !== INSANE)
	{
		return; // Do nothing for now
	}
	if (!gameState.royalists.howitzerLzDiscovered)
	{
		hackAddMessage("HOWITZER_LZ", PROX_MSG, CAM_HUMAN_PLAYER);
		playSound("pcv382.ogg"); // "Enemy LZ Detected"
		gameState.royalists.howitzerLzDiscovered = true;
	}
	gameState.royalists.lzRequests.howitzerLZ = true;
}

// Queue a resumption of a faction's unit production
// This gets called when a faction's groups fall below their minimum sizes
function queueStartProduction(player, type)
{
	if (difficulty === INSANE || allianceExistsBetween(player, CAM_HUMAN_PLAYER))
	{
		// Resume production immediately
		setProduction(player, type, true);
		return;
	}

	let factionState;
	switch (player)
	{
		case CAM_THE_RESISTANCE:
			factionState = gameState.resistance;
			break;
		case CAM_AMPHOS:
			factionState = gameState.amphos;
			break;
		case CAM_HELLRAISERS:
			factionState = gameState.hellraisers;
			break;
		case CAM_THE_COALITION:
			factionState = gameState.coalition;
			break;
		case CAM_ROYALISTS:
			factionState = gameState.royalists;
			break;
		default:
			camDebug("Tried to queue production for an unkown player!");
			return;
	}

	let wasDisabled = false;
	switch (type)
	{
		case "GROUND":
			if (factionState.groundFactoryState === "DISABLED")
			{
				wasDisabled = true;
				factionState.groundFactoryState = "STALLED";
			}
			break;
		case "HOVER":
			if (factionState.hoverFactoryState === "DISABLED")
			{
				wasDisabled = true;
				factionState.hoverFactoryState = "STALLED";
			}
			break;
		case "VTOL":
			if (factionState.vtolFactoryState === "DISABLED")
			{
				wasDisabled = true;
				factionState.vtolFactoryState = "STALLED";
			}
			break;
		case "ASSAULT":
			if (factionState.assaultFactoryState === "DISABLED")
			{
				wasDisabled = true;
				factionState.assaultFactoryState = "STALLED";
			}
			break;
		default:
			camDebug("Tried to queue production of an unkown type for player", player);
			return;
	}

	if (wasDisabled)
	{
		// Send the player number and type of production as a combined string
		queue("setProduction", (camMinutesToMilliseconds(PRODUCTION_STARTUP_DELAY)), player + "" + type);
	}
}

// Set production state for a given faction
function setProduction(player, type, enable)
{
	// Bit of a hack to make sure we can pass the required data from queueing this function
	if (camIsString(player))
	{
		const PLAYER_NUM = parseInt(player);
		type = player.substring(1); // Interpret the string after the number (assuming it's 1 digit)
		player = PLAYER_NUM;
		enable = true;
	} 

	let factoryState = "";
	if (enable) 
	{
		factoryState = "ENABLED";
	}
	else
	{
		factoryState = "DISABLED";
	}

	let factoryArray = [];
	switch (player)
	{
		case CAM_THE_RESISTANCE:
			if (type === "GROUND")
			{
				factoryArray = ["resistanceFactory", "resistanceHeavyFactory", "resistanceCybFact1", "resistanceCybFact2"];
				if (gameState.resistance.allianceState === "ALLIED")
				{
					factoryArray.push("resistanceSubFactory", "resistanceSubCybFactory");
				}
				gameState.resistance.groundFactoryState = factoryState;
			}
			else
			{
				return;
			}
			break;
		case CAM_AMPHOS:
			if (type === "GROUND" || type === "HOVER")
			{
				factoryArray = ["amphosMainFactory1", "amphosMainFactory2"];
				gameState.amphos.groundFactoryState = factoryState;
			}
			else if (type === "VTOL")
			{
				factoryArray = ["amphosVtolFactory"];
				gameState.amphos.vtolFactoryState = factoryState;
			}
			else
			{
				return;
			}
			break;
		case CAM_HELLRAISERS:
			if (type === "GROUND")
			{
				factoryArray = ["hellraiserFactory", "hellraiserCybFac1", "hellraiserCybFac2"];
				gameState.hellraisers.groundFactoryState = factoryState;
			}
			else
			{
				return;
			}
			break;
		case CAM_THE_COALITION:
			if (type === "GROUND")
			{
				factoryArray = ["coalitionFactory1", "coalitionFactory2", "coalitionCybFactory1", "coalitionCybFactory2", "coalitionCybFactory3"];
				gameState.coalition.groundFactoryState = factoryState;
			}
			else if (type === "VTOL")
			{
				factoryArray = ["coalitionVtolFactory"];
				gameState.coalition.vtolFactoryState = factoryState;
			}
			else
			{
				return;
			}
			break;
		case CAM_ROYALISTS:
			if (type === "GROUND")
			{
				// Royalist main factories are not included here
				factoryArray = ["royalistCentralFactory", "royalistOuterFactory", "royalistHowitCyborgFac", "royalistOuterCyborgFac"];
				gameState.royalists.groundFactoryState = factoryState;
			}
			else if (type === "HOVER")
			{
				factoryArray = ["royalistHoverFactory"];
				gameState.royalists.hoverFactoryState = factoryState;
			}
			else if (type === "VTOL")
			{
				factoryArray = ["royalistOuterVtolFac", "royalistMainVtolFac1", "royalistMainVtolFac2"];
				gameState.royalists.vtolFactoryState = factoryState;
			}
			else if (type === "ASSAULT")
			{
				factoryArray = ["royalistMainFactory", "royalistMainCyborgFac"];
				gameState.royalists.assaultFactoryState = factoryState;
			}
			else
			{
				return;
			}
			break;
		default:
			camDebug("Tried to set an unkown player's factories!");
			return;
	}
	if (enable)
	{
		for (const factory in factoryArray)
		{
			camEnableFactory(factoryArray[factory]);
		}
	}
	else
	{
		for (const factory in factoryArray)
		{
			camDisableFactory(factoryArray[factory]);
		}
	}
}

// Choose how the Royalists will attempt their next assault
function setupRoyalistAssaults()
{
	const roy = gameState.royalists;
	if (roy.underAttack)
	{
		return; // Don't continue if the Royalists are being attacked
	}

	roy.assaultFull = false;

	// Choose a target
	let randInt = camRand(101);
	if (randInt >= 50) roy.assaultTarget = CAM_AMPHOS; // Target AMPHOS
	else roy.assaultTarget = CAM_THE_COALITION; // Target the Coalition

	// Choose an attack method
	randInt = camRand(2);
	if (randInt === 0) roy.assaultMethod = "GROUND";
	if (randInt === 1) roy.assaultMethod = "HOVER";

	// Choose an attack composition
	randInt = camRand(101);
	if (randInt <= 28) roy.assaultComp = "MIXED"; // large variety of different unit templates.
	else if (randInt <= 40) roy.assaultComp = "ROCKET RUSH"; // tank killers, bunker busters, and ripple rockets.
	else if (randInt <= 52) roy.assaultComp = "CANNON RUSH"; // pretty much all cannons.
	else if (randInt <= 64) roy.assaultComp = "HEAVIES"; // heavy hitting tanks with cyborg or artillery support.
	else if (randInt <= 76) roy.assaultComp = "SIEGE"; // heavy artillery with cyborg or hover support.
	else if (randInt <= 88) roy.assaultComp = "FIREBUSTER"; // infernos with bunker busters.
	else if (randInt <= 100) roy.assaultComp = "CYBORG RUSH"; // heavy cyborgs with bunker buster support. (GROUND only)

	// Check if there's a commander left over from the last assault
	const commander = getObject("royAssaultCommander");
	if (commander !== null)
	{
		// Check the propulsion of the commander
		// If we want to reuse the commander for the next assault,
		// the assault type must match that of the commander
		if (commander.propulsion === "tracked01")
		{
			roy.assaultMethod = "GROUND";
		}
		else // Hover propulsion
		{
			roy.assaultMethod = "HOVER";
		}
	}

	// Now check if the selected assault stats are valid
	if (roy.assaultMethod === "GROUND" && roy.assaultTarget === CAM_AMPHOS)
	{
		if (!commander)
		{
			roy.assaultMethod = "HOVER"; // Only use hover when attacking AMPHOS
		}
		else
		{
			roy.assaultTarget = CAM_THE_COALITION; // Need to have the commander as part of the assault
		}
	}
	camDebug("Assault specs chosen!", roy.assaultMethod, roy.assaultComp, roy.assaultTarget);

	if (roy.assaultMethod === "HOVER" && roy.assaultComp === "CYBORG RUSH")
	{
		roy.assaultComp = "MIXED"; // Don't use cyborg rush for hover assaults
	}

	// Change the target if it's invalid
	if (roy.assaultTarget === CAM_AMPHOS && gameState.amphos.allianceState === "ERADICATED")
	{
		roy.assaultTarget = CAM_HUMAN_PLAYER; // AMPHOS already dead, assault the player directly
	}

	if (roy.assaultTarget === CAM_THE_COALITION && gameState.coalition.allianceState === "ERADICATED")
	{
		roy.assaultTarget = CAM_HELLRAISERS; // Coalition already dead, assault the Hellraisers instead
	}

	if (roy.assaultTarget === CAM_HELLRAISERS && gameState.hellraisers.allianceState === "ERADICATED")
	{
		roy.assaultTarget = CAM_HUMAN_PLAYER; // Hellraisers already dead, assault the player directly
	}

	if (roy.assaultTarget === CAM_AMPHOS && !allianceExistsBetween(CAM_HUMAN_PLAYER, CAM_AMPHOS))
	{
		roy.assaultTarget = CAM_THE_COALITION; // AMPHOS isn't allied with the player, assault the Coalition instead.
	}

	if (roy.assaultTarget === CAM_THE_COALITION && !allianceExistsBetween(CAM_HUMAN_PLAYER, CAM_THE_COALITION))
	{
		roy.assaultTarget = CAM_HUMAN_PLAYER; // The Coalition isn't allied with the player, assault the player directly.
	}

	if (roy.assaultTarget === CAM_HELLRAISERS && !allianceExistsBetween(CAM_HUMAN_PLAYER, CAM_HELLRAISERS))
	{
		roy.assaultTarget = CAM_HUMAN_PLAYER; // The Hellraisers aren't allied with the player, assault the player directly.
	}

	camDebug("Assault specs validated!", roy.assaultMethod, roy.assaultComp, roy.assaultTarget);

	// Change the templates in the two assault factories to match
	let mainTemplates = [];
	let cybTemplates = [];
	let mainThrottle;
	let cybThrottle;
	const ALLOW_TWIN_ASSAULT = gameState.royalists.allowTwinAssault;

	if (roy.assaultMethod === "GROUND")
	{
		switch (roy.assaultComp)
		{
			case "ROCKET RUSH":
				mainTemplates = [cTempl.romtkt, cTempl.rombbt, cTempl.rollant, cTempl.rombbt, cTempl.rohript/*, cTempl.rohbalt*/];
				cybTemplates = [cTempl.cybla, cTempl.scytk, cTempl.cybla, cTempl.cybag];
				mainThrottle = camChangeOnDiff(camSecondsToMilliseconds(45));
				cybThrottle = camChangeOnDiff(camSecondsToMilliseconds(40));
				if (difficulty >= MEDIUM) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.rollant, cTempl.romtkt);
				break;
			case "CANNON RUSH":
				mainTemplates = [cTempl.romacant, cTempl.romacant, cTempl.romacant, cTempl.rohhcant];
				cybTemplates = [cTempl.scyac, cTempl.scyhc, cTempl.scyac, cTempl.cybag];
				mainThrottle = camChangeOnDiff(camSecondsToMilliseconds(45));
				cybThrottle = camChangeOnDiff(camSecondsToMilliseconds(40));
				if (difficulty === INSANE || ALLOW_TWIN_ASSAULT) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.romacant, cTempl.rohtacant);
				break;
			case "HEAVIES":
				mainTemplates = [cTempl.romacant, cTempl.romacant, cTempl.romtkt, cTempl.rohhcant, cTempl.romagt, cTempl.rohhcant/*, cTempl.rohbalt*/];
				cybTemplates = [cTempl.scyhc, cTempl.scytk, cTempl.cybla, cTempl.scyac];
				mainThrottle = camChangeOnDiff(camSecondsToMilliseconds(35));
				cybThrottle = camChangeOnDiff(camSecondsToMilliseconds(50));
				if (difficulty === INSANE || ALLOW_TWIN_ASSAULT) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.romacant, cTempl.rohtacant);
				if (difficulty === INSANE || ALLOW_TWIN_ASSAULT) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.romagt, cTempl.rohtagt);
				if (difficulty === INSANE) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.romtkt, cTempl.rohtkt);
				break;
			case "SIEGE":
				mainTemplates = [cTempl.romrmorht, cTempl.romsenst, cTempl.rohhowt, cTempl.romacant, cTempl.rohript/*, cTempl.rohbalt*/];
				cybTemplates = [cTempl.cybag, cTempl.cybth, cTempl.cybla, cTempl.scyhc];
				mainThrottle = camChangeOnDiff(camSecondsToMilliseconds(45));
				cybThrottle = camChangeOnDiff(camSecondsToMilliseconds(40));
				if (difficulty >= MEDIUM) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.romrmorht, cTempl.romrmort);
				if (gameState.royalists.allowIncenHowit) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.rohhowt, cTempl.rohihowt);
				break;
			case "FIREBUSTER":
				mainTemplates = [cTempl.rominft, cTempl.rombbt, cTempl.rominft, cTempl.romsenst, cTempl.rombbt, cTempl.romrmorht];
				cybTemplates = [cTempl.cybth, cTempl.cybla, cTempl.cybth];
				mainThrottle = camChangeOnDiff(camSecondsToMilliseconds(40));
				cybThrottle = camChangeOnDiff(camSecondsToMilliseconds(45));
				if (difficulty >= MEDIUM) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.romrmorht, cTempl.romrmort);
				if (difficulty === INSANE) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.cybla, cTempl.scytk);
				break;
			case "CYBORG RUSH":
				mainTemplates = [cTempl.romhrept, cTempl.rombbt, cTempl.rommrat, cTempl.romsenst, cTempl.rombbt, cTempl.romrmorht];
				cybTemplates = [cTempl.scyac, cTempl.scyhc, cTempl.cybag, cTempl.cybla, cTempl.scyac, cTempl.cybag, cTempl.scytk];
				mainThrottle = camChangeOnDiff(camSecondsToMilliseconds(70));
				cybThrottle = camChangeOnDiff(camSecondsToMilliseconds(30));
				if (difficulty >= MEDIUM) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.romrmorht, cTempl.romrmort);
				if (difficulty >= HARD) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.cybla, cTempl.scytk);
				if (difficulty === INSANE || ALLOW_TWIN_ASSAULT) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.romagt, cTempl.rohtagt);
				break;
			case "MIXED":
			default:
				mainTemplates = [cTempl.rollant, cTempl.romacant, cTempl.romsenst, cTempl.rohhcant, cTempl.romagt, cTempl.romrmorht];
				cybTemplates = [cTempl.scyac, cTempl.cybth, cTempl.cybag, cTempl.cybla];
				mainThrottle = camChangeOnDiff(camSecondsToMilliseconds(45));
				cybThrottle = camChangeOnDiff(camSecondsToMilliseconds(40));
				if (difficulty >= MEDIUM) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.romrmorht, cTempl.romrmort);
				if (difficulty >= MEDIUM) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.rollant, cTempl.romtkt);
				break;
		}
		mainTemplates.push(cTempl.rohraat); // Add some AA
	}
	else // Hover assault
	{
		switch (roy.assaultComp)
		{
			case "ROCKET RUSH":
				mainTemplates = [cTempl.romtkh, cTempl.rombbh, cTempl.rollanh, cTempl.rombbh, cTempl.rohriph];
				mainThrottle = camChangeOnDiff(camSecondsToMilliseconds(30));
				if (difficulty >= MEDIUM) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.rollanh, cTempl.romtkh);
				// if (difficulty >= MEDIUM) mainTemplates.push(cTempl.rohbalh);
				break;
			case "CANNON RUSH":
				mainTemplates = [cTempl.romhvcanh, cTempl.romhvcanh, cTempl.romhvcanh, cTempl.rohhcanh];
				mainThrottle = camChangeOnDiff(camSecondsToMilliseconds(30));
				if (difficulty === INSANE || ALLOW_TWIN_ASSAULT) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.romhvcanh, cTempl.rohtacanh);
				break;
			case "HEAVIES":
				mainTemplates = [cTempl.romhvcanh, cTempl.romhvcanh, cTempl.romtkh, cTempl.rohhcanh, cTempl.romagh, cTempl.rohhcanh];
				mainThrottle = camChangeOnDiff(camSecondsToMilliseconds(30));
				// if (difficulty >= MEDIUM) mainTemplates.push(cTempl.rohbalh);
				if (difficulty === INSANE || ALLOW_TWIN_ASSAULT) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.romhvcanh, cTempl.rohtacanh);
				if (difficulty === INSANE || ALLOW_TWIN_ASSAULT) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.romagh, cTempl.rohtagh);
				if (difficulty === INSANE) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.romtkh, cTempl.rohtkh);
				mainTemplates.push(cTempl.romsensh);
				mainTemplates.push(cTempl.rohhowh);
				if (gameState.royalists.allowIncenHowit) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.rohhowh, cTempl.rohihowh);
				break;
			case "SIEGE":
				mainTemplates = [cTempl.romrmorh, cTempl.romsensh, cTempl.rohhowh, cTempl.romhvcanh, cTempl.rohriph];
				mainThrottle = camChangeOnDiff(camSecondsToMilliseconds(30));
				// if (difficulty >= MEDIUM) mainTemplates.push(cTempl.rohbalh);
				if (gameState.royalists.allowIncenHowit) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.rohhowh, cTempl.rohihowh);
				break;
			case "FIREBUSTER":
				mainTemplates = [cTempl.rominfh, cTempl.rombbh, cTempl.rominfh, cTempl.romsensh, cTempl.rombbh, cTempl.romrmorh];
				mainThrottle = camChangeOnDiff(camSecondsToMilliseconds(30));
				break;
			case "MIXED":
			default:
				mainTemplates = [cTempl.rollanh, cTempl.romhvcanh, cTempl.romsensh, cTempl.rohhcanh, cTempl.romagh, cTempl.romrmorh];
				mainThrottle = camChangeOnDiff(camSecondsToMilliseconds(30));
				if (difficulty >= MEDIUM) mainTemplates = camArrayReplaceWith(mainTemplates, cTempl.rollanh, cTempl.romtkh);
				break;
		}
		mainTemplates.push(cTempl.rohraah); // Add some AA
	}

	// Give the main factories new templates and get them started
	camSetFactoryTemplates("royalistMainFactory", mainTemplates, mainThrottle);
	camSetFactoryTemplates("royalistMainCyborgFac", cybTemplates, cybThrottle);
	queueStartProduction(CAM_ROYALISTS, "ASSAULT");

	// Decide if a commander should be built along with the assault force
	if (!commander && camRand(101) < difficulty * 20) // Chance increases with difficulty
	{
		let comTemplate = cTempl.romcommt; // Command Turret Retribution Tracks
		if (gameState.royalists.assaultMethod === "HOVER")
		{
			comTemplate = cTempl.romcommh; // Command Turret Retribution Hover
		}
		camQueueDroidProduction(CAM_ROYALISTS, comTemplate, camMakePos("innerPos1"));
	}
}

// Start a Royalist assault against another faction/player
function startRoyalistAssault()
{
	let pos;
	switch (gameState.royalists.assaultTarget)
	{
		case CAM_AMPHOS:
			pos = camMakePos("centralPos15");
			if (gameState.amphos.allianceState === "ALLIED" && !gameState.royalists.underAttack) missionMessage("AMPALERTMSG", "INTEL");
			break;
		case CAM_HELLRAISERS:
			pos = camMakePos("outerPos7");
			if (gameState.hellraisers.allianceState === "ALLIED" && !gameState.royalists.underAttack) missionMessage("HELALERTMSG", "INTEL");
			break;
		case CAM_THE_COALITION:
			pos = camMakePos("outerPos11");
			if (gameState.coalition.allianceState === "ALLIED" && !gameState.royalists.underAttack) missionMessage("COAALERTMSG", "INTEL");
			break;
		case CAM_HUMAN_PLAYER:
		default:
			pos = camMakePos("outerPos7");
			if (gameState.resistance.allianceState === "ALLIED" && !gameState.royalists.underAttack) missionMessage("RESALERTMSG", "INTEL");
			break;
	}
	let data = {
		targetPlayer: gameState.royalists.assaultTarget,
		pos: pos
	};
	if (gameState.royalists.assaultMethod === "HOVER" && difficulty >= MEDIUM)
	{
		data = {
			targetPlayer: gameState.royalists.assaultTarget,
			pos: pos,
			repair: 40
		};
	}
	camManageGroup(gameState.royalists.assaultGroup.id, CAM_ORDER_COMPROMISE, data);
	const commander = getObject("royAssaultCommander");
	if (commander !== null)
	{
		// If there is a commander, get it to join the attack too
		camManageGroup(commander.group, CAM_ORDER_COMPROMISE, {
			targetPlayer: gameState.royalists.assaultTarget,
			pos: pos,
			repair: 40
		});
	}

	gameState.royalists.assaultPhase = 1;

	// Sequentially pick positions to move the assault group towards
	setTimer("navigateAssaultGroups", camMinutesToMilliseconds(2.5));

	// Start checking if the assault force has been destroyed
	setTimer("checkAssaultStatus", camSecondsToMilliseconds(5));
}

// Move groups along a specific path towards their target
function navigateAssaultGroups()
{
	let newOrder = false;
	let order = CAM_ORDER_ATTACK;
	let pos = camMakePos("playerBasePos");
	if (gameState.royalists.assaultPhase === 1)
	{
		if (gameState.royalists.assaultTarget === CAM_HUMAN_PLAYER)
		{
			if (gameState.royalists.assaultMethod === "GROUND")
			{
				newOrder = true;
			}
			else
			{
				newOrder = true;
				order = CAM_ORDER_COMPROMISE;
				pos = camMakePos("eastPos2");
			}
		}
		else if (gameState.royalists.assaultTarget === CAM_AMPHOS)
		{
			newOrder = true;
			pos = camMakePos("eastPos1");
		}
		else if (gameState.royalists.assaultTarget === CAM_HELLRAISERS)
		{
			if (gameState.royalists.assaultMethod === "GROUND")
			{
				newOrder = true;
				order = CAM_ORDER_COMPROMISE;
				pos = camMakePos("centralPos13");
			}
			else
			{
				newOrder = true;
				order = CAM_ORDER_COMPROMISE;
				pos = camMakePos("riverPos2");
			}
		}
		else if (gameState.royalists.assaultTarget === CAM_THE_COALITION)
		{
			if (gameState.royalists.assaultMethod === "GROUND")
			{
				newOrder = true;
				order = CAM_ORDER_COMPROMISE;
				pos = camMakePos("centralPos3");
			}
			else
			{
				newOrder = true;
				order = CAM_ORDER_COMPROMISE;
				pos = camMakePos("northLakeFOB");
			}
		}
	}
	else if (gameState.royalists.assaultPhase === 2)
	{
		if (gameState.royalists.assaultTarget === CAM_HUMAN_PLAYER)
		{
			if (gameState.royalists.assaultMethod === "HOVER")
			{
				newOrder = true;
			}
		}
		else if (gameState.royalists.assaultTarget === CAM_HELLRAISERS)
		{
			newOrder = true;
			pos = camMakePos("helCyborgAssembly2");
		}
		else if (gameState.royalists.assaultTarget === CAM_THE_COALITION)
		{
			newOrder = true;
			pos = camMakePos("westPos2");
		}
	}

	if (newOrder)
	{
		let repair = 0;
		if (gameState.royalists.assaultMethod === "HOVER" && difficulty >= MEDIUM)
		{
			repair = 40;
		}
		camManageGroup(gameState.royalists.assaultGroup.id, order, {
			targetPlayer: gameState.royalists.assaultTarget,
			pos: pos,
			repair: repair
		});
		const commander = getObject("royAssaultCommander");
		if (commander !== null)
		{
			// If the commander is still around, move it forwards
			camManageGroup(commander.group, order, {
				targetPlayer: gameState.royalists.assaultTarget,
				pos: pos,
				repair: 40
			});
		}
	}
	gameState.royalists.assaultPhase++;
}

// Check if the assault groups have been wiped out
function checkAssaultStatus()
{
	if (enumGroup(gameState.royalists.assaultCommandGroup.id).length > 0) return;
	if (enumGroup(gameState.royalists.assaultGroup.id).length > 0) return;

	// All groups dead
	removeTimer("checkAssaultStatus");
	removeTimer("navigateAssaultGroups");
	gameState.royalists.assaultPhase = 0;
	if (gameState.royalists.assaultFull)
	{
		achievementMessage("Hold The Line!", "Survive a full Royalist assault");
	}

	// IF the commander is still alive, tell it to retreat back to base
	const commander = getObject("royAssaultCommander");
	if (camDef(commander) && commander !== null && difficulty >= HARD)
	{
		camManageGroup(commander.group, CAM_ORDER_DEFEND, {
			pos: camMakePos("innerPos1"),
			repair: 95 // Get healed up too
		});
	}

	if (gameState.royalists.underAttack)
	{
		// Don't start building up another assault force if the main base 
		// is under attack; the factories are busy fighting off the player!
		return;
	}

	// Queue up the next assault
	if (difficulty !== INSANE)
	{
		queue("setupRoyalistAssaults", camMinutesToMilliseconds(PRODUCTION_STARTUP_DELAY));
	}
	else
	{
		setupRoyalistAssaults();
	}
}

// Send player support back home if the player hasn't been fighting for themselves for a while
function recallSupportGroups()
{
	if (gameTime < gameState.lastSupportUpdate + 40000 || gameState.royalists.underAttack)
	{
		// It has not been at least 40 seconds
		// since support was last called; check later.
		// Or the player is attacking the final Royalist bases
		return;
	}

	// Resistance
	if (gameState.resistance.allianceState === "ALLIED")
	{
		const commander = getObject("resCommander");
		if (commander !== null)
		{
			let pos = camMakePos("resFactoryAssembly");
			if (!camBaseIsEliminated("resistanceRiverRepairBase"))
			{
				// Return to the river repair base if it's set up
				pos = camMakePos("riverTownFOB");
			}
			camManageGroup(getObject("resCommander").group, CAM_ORDER_DEFEND, {
				pos: pos,
				radius: 18,
				repair: 65
			});
		}
		// Recall the support group
		const groupInfo = gameState.resistance.groups.playerSupportGroup;
		groupInfo.order = CAM_ORDER_DEFEND;
		groupInfo.data = {
			pos: camMakePos("resHeavyFacAssembly"),
			radius: 20,
			repair: 65
		};
		camManageGroup(groupInfo.id, groupInfo.order, groupInfo.data);
	}

	// AMPHOS
	if (gameState.amphos.allianceState === "ALLIED")
	{
		const commander = getObject("ampCommander");
		if (commander !== null)
		{
			// Tell the AMPHOS commander to resume patroling
			camManageGroup(getObject("ampCommander").group, CAM_ORDER_PATROL, {
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
		// Recall the support group
		const groupInfo = gameState.amphos.groups.playerSupportGroup;
		groupInfo.order = CAM_ORDER_DEFEND;
		groupInfo.data = {
			pos: camMakePos("eastPos2"),
			radius: 30,
			repair: 75
		};
		camManageGroup(groupInfo.id, groupInfo.order, groupInfo.data);
	}

	// Hellraisers
	if (gameState.hellraisers.allianceState === "ALLIED")
	{
		// Tell the Hellraisers to return to base
		const groupInfo = gameState.hellraisers.groups.playerSupportGroup;
		groupInfo.order = CAM_ORDER_DEFEND;
		groupInfo.data = {
			pos: camMakePos("helFactoryAssembly"),
			radius: 22,
			repair: 30
		};

		camManageGroup(groupInfo.id, groupInfo.order, groupInfo.data);
	}

	// Coalition
	if (gameState.coalition.allianceState === "ALLIED")
	{
		const commander = getObject("coaCommander");
		if (commander !== null)
		{
			// Tell the Coalition commander resume patrols
			camManageGroup(getObject("coaCommander").group, CAM_ORDER_PATROL, {
				pos: [
					camMakePos("westPos4"),
					camMakePos("westPos5"),
					camMakePos("westPos11"),
					camMakePos("westPos9")
				],
				interval: camSecondsToMilliseconds(45),
				repair: 75
			});
		}
		// Recall the support group
		const groupInfo = gameState.coalition.groups.playerSupportGroup;
		groupInfo.order = CAM_ORDER_DEFEND;
		groupInfo.data = {
			pos: camMakePos("westPos3"),
			repair: 80
		};
		camManageGroup(groupInfo.id, groupInfo.order, groupInfo.data);
	}
}

// Rebuild the Resistance's commander unit
function rebuildResistanceCommander()
{
	if (getObject("resCommander") !== null)
	{
		// Commander already exists, do nothing
		return;
	}

	if (camIsResearched("R-Vehicle-Body11"))
	{
		camQueueDroidProduction(CAM_THE_RESISTANCE, cTempl.rehcomm);
	}
	else
	{
		camQueueDroidProduction(CAM_THE_RESISTANCE, cTempl.remcomm);
	}
}

// Check if a faction should build a truck to reconstruct a destroyed base
function baseReclaimCheck()
{
	let truckIndexes = []; // Indexes of trucks to be rebuilt
	for (const base in mis_baseData) // mis_baseData is in kingdomdata.js
	{
		if (camAreaSecure(mis_baseData[base].cleanup, mis_baseData[base].player) && camBaseIsEliminated(base))
		{
			// Special cases for gate LZs and the NW island replacement base
			if (base === "ampSouthGateLZ" && !camBaseIsEliminated("southGate"))
			{
				continue;
			}
			if (base === "coaWestGateLZ" && !camBaseIsEliminated("westGate"))
			{
				continue;
			}
			if (base === "ampNWIsleRepBase" && !camBaseIsEliminated("nwIslandBase"))
			{
				continue;
			}
			// Don't rebuild the Resistance's main base if the player destroyed it
			if (base === "resistanceMainBase" && !allianceExistsBetween(CAM_HUMAN_PLAYER, CAM_THE_RESISTANCE))
			{
				continue;
			}

			// Royalists must also have a unit in the area
			if (mis_baseData[base].player === CAM_ROYALISTS && enumArea(mis_baseData[base].cleanup, CAM_ROYALISTS, false).length < 1)
			{
				continue;
			}

			truckIndexes = truckIndexes.concat(camGetTrucksFromBase(base));
		}
	}

	// Rebuild trucks for base construction
	for (const index of truckIndexes)
	{
		camRebuildTruck(index, true);
	}
}

// Update allied factories to use the latest components available.
// Warning: There's a LOT of else-if's in here
function updateAllyTemplates()
{
	if (gameState.resistance.allianceState === "ALLIED")
	{
		// Initialize the each unit type as the weakest/earliest varient (at the point when the player allies with them)
		let sens = cTempl.relsensht; // Sensor
		let can = cTempl.remlcan; // Cannon tank
		let canalt = cTempl.rellcan; // Cannon tank (alt)
		let mg = cTempl.reltwmght; // MG tank
		let roc = cTempl.rempod; // Rocket tank
		let rocalt = cTempl.relpodht; // Rocket tank (alt)
		let flam = cTempl.relflamht; // Flamer tank
		let mort = cTempl.remmor; // Mortar tank
		// let rep = cTempl.rellrepht; // Repair tank
		let aa = cTempl.remlaa; // AA Tank
		let cmg = cTempl.cybmg; // MG cyborg
		let ccan = cTempl.cybca; // Cannon cyborg
		let croc = cTempl.cybca; // Rocket cyborg
		let cflam = cTempl.cybfl; // Flamer cyborg

		// Now we change each template based on how far the player has progressed
		// Sensor
		if (camIsResearched("R-Vehicle-Metals03")) 
		{
			sens = cTempl.remsens; // Sensor Cobra Half-tracks
		}
		// Cannon tank
		if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Cannon3Mk1") && camIsResearched("R-Vehicle-Prop-Tracks")) 
		{
			can = cTempl.rehhcant; // Heavy Cannon Python Tracks
		}
		else if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Cannon3Mk1")) 
		{
			can = cTempl.rehhcanht; // Heavy Cannon Python Half-tracks
		}
		else if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Cannon5"))
		{
			can = cTempl.rehacan; // Assault Cannon Python Half-tracks
		}
		else if (camIsResearched("R-Wpn-Cannon5"))
		{
			can = cTempl.remacan; // Assault Cannon Cobra Half-tracks
		}
		else if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Cannon4AMk1"))
		{
			can = cTempl.rehhvcan; // Hyper Velocity Cannon Python Half-tracks
		}
		else if (camIsResearched("R-Wpn-Cannon5"))
		{
			can = cTempl.remhvcan; // Hyper Velocity Cannon Cobra Half-tracks
		}
		else if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Cannon2Mk1") && camIsResearched("R-Vehicle-Prop-Tracks"))
		{
			can = cTempl.rehmcant; // Medium Cannon Python Tracks
		}
		else if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Cannon2Mk1"))
		{
			can = cTempl.rehmcanht; // Medium Cannon Python Half-tracks
		}
		else if (camIsResearched("R-Wpn-Cannon2Mk1"))
		{
			can = cTempl.remmcan; // Medium Cannon Cobra Half-tracks
		}
		// Cannon tank (alt)
		if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Cannon4AMk1"))
		{
			canalt = cTempl.rehhvcan; // Hyper Velocity Cannon Python Half-tracks
		}
		else if (camIsResearched("R-Wpn-Cannon4AMk1"))
		{
			canalt = cTempl.remhvcan; // Hyper Velocity Cannon Cobra Half-tracks
		}
		else if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Cannon5"))
		{
			canalt = cTempl.rehacan; // Assault Cannon Python Half-tracks
		}
		else if (camIsResearched("R-Wpn-Cannon5"))
		{
			canalt = cTempl.remacan; // Assault Cannon Cobra Half-tracks
		}
		else if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Cannon3Mk1")) 
		{
			canalt = cTempl.rehhcanht; // Heavy Cannon Python Half-tracks
		}
		else if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Cannon2Mk1"))
		{
			canalt = cTempl.rehmcanht; // Medium Cannon Python Half-tracks
		}
		else if (camIsResearched("R-Wpn-Cannon2Mk1"))
		{
			canalt = cTempl.remmcan; // Medium Cannon Cobra Half-tracks
		}
		// MG tank
		if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Laser01")) 
		{
			mg = cTempl.rehlas; // Flashlight Python Half-tracks
		}
		else if (camIsResearched("R-Wpn-Laser01")) 
		{
			mg = cTempl.remlas; // Flashlight Cobra Half-tracks
		}
		else if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-MG4")) 
		{
			mg = cTempl.rehag; // Assault Gun Python Half-tracks
		}
		else if (camIsResearched("R-Wpn-MG4")) 
		{
			mg = cTempl.remag; // Assault Gun Cobra Half-tracks
		}
		else if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-MG3Mk1") && camIsResearched("R-Vehicle-Metals04"))
		{
			mg = cTempl.rehhmg; // Heavy Machinegun Python Half-tracks
		}
		else if (camIsResearched("R-Wpn-MG3Mk1"))
		{
			mg = cTempl.remhmght; // Heavy Machinegun Cobra Half-tracks
		}
		// Rocket tank
		if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Rocket07-Tank-Killer")) 
		{
			roc = cTempl.rehtk; // Tank Killer Python Half-tracks
		}
		else if (camIsResearched("R-Wpn-Rocket07-Tank-Killer")) 
		{
			roc = cTempl.remtk; // Tank Killer Cobra Half-tracks
		}
		// else if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Rocket08-Ballista")) 
		// {
		// 	roc = cTempl.rehbal; // Ballista Python Half-tracks
		// }
		// else if (camIsResearched("R-Wpn-Rocket08-Ballista")) 
		// {
		// 	roc = cTempl.rembal; // Ballista Cobra Half-tracks
		// }
		else if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Rocket01-LtAT") && camIsResearched("R-Vehicle-Metals04")) 
		{
			roc = cTempl.rehlan; // Lancer Python Half-tracks
		}
		else if (camIsResearched("R-Wpn-Rocket01-LtAT")) 
		{
			roc = cTempl.remlan; // Lancer Cobra Half-tracks
		}
		else if (camIsResearched("R-Wpn-Rocket-LtA-TMk1")) 
		{
			roc = cTempl.remsar; // Sarissa Cobra Half-tracks
		}
		else if (camIsResearched("R-Vehicle-Metals02")) 
		{
			roc = cTempl.rempod; // Mini-Rocket Pod Cobra Half-tracks
		}
		// Rocket tank (alt)
		if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Rocket03-HvAT") && camIsResearched("R-Vehicle-Metals04")) 
		{
			rocalt = cTempl.rehbb; // Bunker Buster Python Half-tracks
		}
		else if (camIsResearched("R-Wpn-Rocket03-HvAT")) 
		{
			rocalt = cTempl.rembb; // Bunker Buster Cobra Half-tracks
		}
		else if (camIsResearched("R-Wpn-Rocket02-MRL")) 
		{
			rocalt = cTempl.remmra; // Mini-Rocket Array Cobra Half-tracks
		}
		else if (camIsResearched("R-Vehicle-Metals02")) 
		{
			rocalt = cTempl.rempod; // Mini-Rocket Pod Cobra Half-tracks
		}
		// Flamer tank
		if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Flame2")) 
		{
			flam = cTempl.rehinf; // Inferno Python Half-tracks
		}
		else if (camIsResearched("R-Wpn-Flame2"))
		{
			flam = cTempl.reminf; // Inferno Cobra Half-tracks
		}
		else if (camIsResearched("R-Vehicle-Metals02"))
		{
			flam = cTempl.remflam; // Flamer Cobra Half-tracks
		}
		// Mortar tank
		if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Mortar3") && camIsResearched("R-Vehicle-Metals04")) 
		{
			mort = cTempl.rehrmor; // Pepperpot Python Half-tracks
		}
		else if (camIsResearched("R-Wpn-Mortar3"))
		{
			mort = cTempl.remrmor; // Pepperpot Cobra Half-tracks
		}
		else if (camIsResearched("R-Vehicle-Body11") && camIsResearched("R-Wpn-Mortar02Hvy")) 
		{
			mort = cTempl.rehhmor; // Bombard Python Half-tracks
		}
		else if (camIsResearched("R-Wpn-Mortar02Hvy"))
		{
			mort = cTempl.remhmor; // Bombard Cobra Half-tracks
		}
		else if (camIsResearched("R-Wpn-Mortar-Incendiary"))
		{
			mort = cTempl.remimor; // Incendiary Mortar Cobra Half-tracks
		}
		// Repair tank
		// if (camIsResearched("R-Sys-MobileRepairTurretHvy"))
		// {
		// 	rep = cTempl.remhrep; // Heavy Repair Turret Cobra Half-tracks
		// }
		// else if (camIsResearched("R-Vehicle-Metals03")) 
		// {
		// 	rep = cTempl.remlrep; // Repair Turret Cobra Half-tracks
		// }
		// AA tank
		if (camIsResearched("R-Wpn-AAGun04") && camIsResearched("R-Vehicle-Body11"))
		{
			aa = cTempl.rehraa; // Whirlwind Python Half-tracks
		}
		else if (camIsResearched("R-Wpn-AAGun04"))
		{
			aa = cTempl.remraa; // Whirlwind Cobra Half-tracks
		}
		else if (camIsResearched("R-Wpn-AAGun02") && camIsResearched("R-Vehicle-Body11"))
		{
			aa = cTempl.rehhaa; // Cyclone Python Half-tracks
		}
		else if (camIsResearched("R-Wpn-AAGun02"))
		{
			aa = cTempl.remhaa; // Cyclone Cobra Half-tracks
		}
		// MG cyborg
		if (camIsResearched("R-Cyborg-Wpn-Laser1"))
		{
			cmg = cTempl.cybls; // Flashlight Gunner Cyborg
		}
		else if (camIsResearched("R-Cyborg-Wpn-RotMG"))
		{
			cmg = cTempl.cybag; // Assault Gunner Cyborg
		}
		// Cannon cyborg
		if (camIsResearched("R-Cyborg-Hvywpn-HPV"))
		{
			ccan = cTempl.scyhc; // Super HPC Cyborg
		}
		else if (camIsResearched("R-Cyborg-Hvywpn-Acannon"))
		{
			ccan = cTempl.scyac; // Super Auto-Cannon Cyborg
		}
		else if (camIsResearched("R-Cyborg-Hvywpn-Mcannon"))
		{
			ccan = cTempl.scymc; // Super Heavy-Gunner Cyborg
		}
		// Rocket cyborg
		if (camIsResearched("R-Cyborg-Hvywpn-TK"))
		{
			croc = cTempl.scytk; // Super Tank-Killer Cyborg
		}
		else if (camIsResearched("R-Cyborg-Wpn-Rocket"))
		{
			croc = cTempl.cybla; // Lancer Cyborg
		}
		// Flamer cyborg
		if (camIsResearched("R-Cyb-Wpn-Thermite"))
		{
			cflam = cTempl.cybth; // Thermite Flamer Cyborg
		}

		let hvyFactoryTemplates = [];
		if (gameState.phase < 2)
		{
			hvyFactoryTemplates = [ mort, roc, mg, /*rep,*/ sens, mort ];
		}
		else // Start making AA units when VTOLs start coming into play
		{
			hvyFactoryTemplates = [ mort, roc, mg, /*rep,*/ sens, mort, aa ];
		}
		if (camIsResearched("R-Wpn-Rocket06-IDF"))
		{
			// Add Ripple Rocket template
			hvyFactoryTemplates.push(cTempl.rehrip);
		}
		if (camIsResearched("R-Wpn-Howitzer-Incendiary"))
		{
			// Add Incendiary Howitzer template
			hvyFactoryTemplates.push(cTempl.rehihow);
		}
		else if (camIsResearched("R-Wpn-HowitzerMk1"))
		{
			// Add Howitzer template
			hvyFactoryTemplates.push(cTempl.rehhow);
		}

		camSetFactoryTemplates("resistanceFactory", [ canalt, mg, roc, flam, can, rocalt ], camChangeOnDiff(camSecondsToMilliseconds(60), true));
		camSetFactoryTemplates("resistanceHeavyFactory", hvyFactoryTemplates, camChangeOnDiff(camSecondsToMilliseconds(80), true));
		camSetFactoryTemplates("resistanceCybFact1", [ cmg, ccan, cmg, ccan ], camChangeOnDiff(camSecondsToMilliseconds(45), true));
		camSetFactoryTemplates("resistanceCybFact2", [ croc, cflam, croc, cflam ], camChangeOnDiff(camSecondsToMilliseconds(55), true));
		camSetFactoryTemplates("resistanceSubFactory", [ can, mg, rocalt, canalt, roc ], camChangeOnDiff(camSecondsToMilliseconds(95), true));
		camSetFactoryTemplates("resistanceSubCybFactory", [ ccan, cflam, croc ], camChangeOnDiff(camSecondsToMilliseconds(45), true));
	}

	if (gameState.amphos.allianceState === "ALLIED")
	{
		let mg = cTempl.ammhmg; // MG tank
		let roc = cTempl.ammlan; // Rocket tank
		let rocalt = cTempl.ammpod; // Rocket tank (alt)
		let bb = cTempl.ammbb; // Bunker Buster tank
		let aa = cTempl.amhhaa; // AA tank
		let vmg = cTempl.amlhmgv; // MG vtol
		let vroc = cTempl.amllanv; // Rocket vtol
		let vrocalt = cTempl.amlpodv; // Rocket vtol (alt)

		let sens = cTempl.ammsens; // Sensor tank (never changes)
		let mra = cTempl.ammmra; // MRA tank (never changes)
		let rip = cTempl.amhrip; // Ripple Rocket tank (never changes)
		let vbb = cTempl.amlbbv; // Bunker Buster vtol (never changes)

		// MG tank
		if (camIsResearched("R-Wpn-Laser01"))
		{
			mg = cTempl.ammlas; // Flashlight Cobra Hover
		}
		else if (camIsResearched("R-Wpn-MG4"))
		{
			mg = cTempl.amhag; // Assault Gun Cobra Hover
		}
		// Rocket tank
		if (camIsResearched("R-Wpn-Rocket07-Tank-Killer"))
		{
			roc = cTempl.amhtk; // Tank Killer Python Hover
		}
		else if (camIsResearched("R-Vehicle-Metals04"))
		{
			roc = cTempl.amhlan; // Lancer Python Hover
		}
		// Rocket tank (alt)
		// if (camIsResearched("R-Wpn-Rocket08-Ballista"))
		// {
		// 	rocalt = cTempl.amhbal; // Ballista Python Hover
		// }
		if (camIsResearched("R-Wpn-Rocket07-Tank-Killer"))
		{
			rocalt = cTempl.amhtk; // Tank Killer Python Hover
		}
		// Bunker Buster tank
		if (camIsResearched("R-Vehicle-Metals04"))
		{
			bb = cTempl.amhbb; // Bunker Buster Python Hover
		}
		// AA tank
		if (camIsResearched("R-Wpn-AAGun04"))
		{
			aa = cTempl.amhraa; // Whirlwind Python Hover
		}
		// MG vtol
		if (camIsResearched("R-Wpn-Laser01"))
		{
			vmg = cTempl.ammlasv; // Flashlight Cobra VTOL
		}
		else if (camIsResearched("R-Wpn-MG4") && camIsResearched("R-Vehicle-Metals04"))
		{
			vmg = cTempl.ammagv; // Assault Gun Cobra VTOL
		}
		else if (camIsResearched("R-Wpn-MG4"))
		{
			vmg = cTempl.amlagv; // Assault Gun Viper VTOL
		}
		// Rocket vtol
		if (camIsResearched("R-Wpn-Rocket07-Tank-Killer"))
		{
			vroc = cTempl.ammtkv; // Tank Killer Cobra VTOL
		}
		// Rocket vtol (alt)
		if (camIsResearched("R-Wpn-Rocket07-Tank-Killer"))
		{
			vrocalt = cTempl.ammtkv; // Tank Killer Cobra VTOL
		}

		camSetFactoryTemplates("amphosMainFactory1", [ roc, mg, rocalt, mra ], camChangeOnDiff(camSecondsToMilliseconds(55), true));
		camSetFactoryTemplates("amphosMainFactory2", [ mra, bb, sens, rip, aa ], camChangeOnDiff(camSecondsToMilliseconds(45), true));
		camSetFactoryTemplates("amphosVtolFactory", [ vroc, vmg, vroc, vbb, vrocalt ], camChangeOnDiff(camSecondsToMilliseconds(35), true));
	}

	if (gameState.hellraisers.allianceState === "ALLIED")
	{
		let mg = cTempl.hemhmgt; // MG tank
		let flam = cTempl.hemflam; // Flamer tank
		let can = cTempl.hemmcant; // Cannon tank
		let canalt = cTempl.hemmcanht; // Cannon tank (alt)
		let rep = cTempl.hellrep; // Repair tank
		let aa = cTempl.hemlaa; // AA tank
		let cmg = cTempl.cybmg; // MG cyborg
		let croc = cTempl.cybca; // Rocket cyborg
		let cflam = cTempl.cybfl; // Flamer cyborg

		let sens = cTempl.hemsenst; // Sensor tank (never changes)
		let imort = cTempl.hemimort; // Incendiary Mortar tank (never changes)
		let inf = cTempl.hehinf; // Inferno tank (never changes)

		// MG tank
		if (camIsResearched("R-Wpn-Laser01"))
		{
			mg = cTempl.hemlas; // Flashlight Scorpion Tracks
		}
		else if (camIsResearched("R-Wpn-MG4"))
		{
			mg = cTempl.hemag; // Assault Gun Scorpion Tracks
		}
		// Flamer tank
		if (camIsResearched("R-Wpn-Flame2") && camIsResearched("R-Vehicle-Metals04"))
		{
			flam = cTempl.hehinf; // Inferno Mantis Tracks
		}
		else if (camIsResearched("R-Wpn-Flame2"))
		{
			flam = cTempl.heminf; // Inferno Scorpion Half-tracks
		}
		// Cannon tank
		if (camIsResearched("R-Wpn-Cannon3Mk1"))
		{
			can = cTempl.hehhcan; // Heavy Cannon Mantis Tracks
		}
		else if (camIsResearched("R-Wpn-Cannon4AMk1"))
		{
			can = cTempl.hehhvcan; // Hyper Velocity Cannon Mantis Tracks
		}
		else if (camIsResearched("R-Wpn-Cannon5"))
		{
			can = cTempl.hehacan; // Assault Cannon Mantis Tracks
		}
		else if (camIsResearched("R-Vehicle-Metals03"))
		{
			can = cTempl.hehmcan; // Medium Cannon Mantis Tracks
		}
		// Cannon tank (alt)
		if (camIsResearched("R-Wpn-Cannon5") && camIsResearched("R-Vehicle-Metals05"))
		{
			canalt = cTempl.hehacan; // Assault Cannon Mantis Tracks
		}
		else if (camIsResearched("R-Wpn-Cannon5"))
		{
			canalt = cTempl.hemacan; // Assault Cannon Scorpion Tracks
		}
		else if (camIsResearched("R-Wpn-Cannon4AMk1"))
		{
			canalt = cTempl.hemhvcan; // Hyper Velocity Cannon Scorpion Tracks
		}
		// Repair tank
		if (camIsResearched("R-Sys-MobileRepairTurretHvy"))
		{
			rep = cTempl.hemhrep; // Heavy Repair Turret Scorpion Half-tracks
		}
		else if (camIsResearched("R-Vehicle-Metals04"))
		{
			rep = cTempl.hemlrep; // Repair Turret Scorpion Half-tracks
		}
		// AA tank
		if (camIsResearched("R-Wpn-AAGun04"))
		{
			aa = cTempl.hehraa; // Whirlwind Mantis Tracks
		}
		else if (camIsResearched("R-Wpn-AAGun02"))
		{
			aa = cTempl.hehhaa; // Cyclone Mantis Tracks
		}
		// MG cyborg
		if (camIsResearched("R-Cyborg-Wpn-Laser1"))
		{
			cmg = cTempl.cybls; // Flashlight Gunner Cyborg
		}
		else if (camIsResearched("R-Cyborg-Wpn-RotMG"))
		{
			cmg = cTempl.cybag; // Assault Gunner Cyborg
		}
		// Rocket cyborg
		if (camIsResearched("R-Cyborg-Wpn-Rocket"))
		{
			croc = cTempl.cybla; // Lancer Cyborg
		}
		// Flamer cyborg
		if (camIsResearched("R-Cyb-Wpn-Thermite"))
		{
			cflam = cTempl.cybth; // Thermite Flamer Cyborg
		}

		camSetFactoryTemplates("hellraiserFactory", [ flam, mg, sens, imort, inf, can, rep, imort, canalt, flam, imort, aa ], camChangeOnDiff(camSecondsToMilliseconds(55), true));
		camSetFactoryTemplates("hellraiserCybFac1", [ cmg, cflam, cflam ], camChangeOnDiff(camSecondsToMilliseconds(30), true));
		camSetFactoryTemplates("hellraiserCybFac2", [ croc, cflam, cflam ], camChangeOnDiff(camSecondsToMilliseconds(35), true));
	}

	if (gameState.coalition.allianceState === "ALLIED")
	{
		let mg = cTempl.comhmg; // MG tank
		let roc = cTempl.colsar; // Rocket tank
		let rocalt = cTempl.colpod; // Rocket tank (alt)
		let can = cTempl.commcan; // Cannon tank
		let aa = cTempl.comhaa; // AA tank
		let cmg = cTempl.cybmg; // MG cyborg
		let ccan = cTempl.scymc; // Cannon cyborg
		let ccanalt = cTempl.cybca; // Cannon cyborg (alt)
		let cflam = cTempl.cybfl; // Flamer cyborg
		let vmg = cTempl.colhmgv; // MG vtol

		let sens = cTempl.comsenst; // Sensor tank (never changes)
		let bomba = cTempl.comhmort; // Bombard tank (never changes)
		let howit = cTempl.cohhow; // Howitzer tank (never changes)
		let hvycan = cTempl.cohhcan; // Heavy Cannon tank (never changes)
		let rep = cTempl.comhrepht; // Repair tank (never changes)
		let cgren = cTempl.cybgr; // Grenadier cyborg (never changes)
		let crep = cTempl.cybrp; // Repair cyborg (never changes)
		let vpbomb = cTempl.colpbomv; // Phosphor Bomb vtol (never changes)
		let vhcan = cTempl.colhvcanv; // HPC vtol (never changes)
		let vacan = cTempl.comacanv; // Assault Cannon vtol (never changes)
		let vbomb = cTempl.comhbomv; // HEAP Bomb vtol (never changes)

		// MG tank
		if (camIsResearched("R-Wpn-Laser01"))
		{
			mg = cTempl.comlas; // Flashlight Panther Tracks
		}
		else if (camIsResearched("R-Wpn-MG4"))
		{
			mg = cTempl.comag; // Assault Gun Panther Tracks
		}
		// Rocket tank
		if (camIsResearched("R-Wpn-Rocket07-Tank-Killer"))
		{
			roc = cTempl.comtk; // Tank Killer Panther Tracks
		}
		else if (camIsResearched("R-Wpn-Rocket01-LtAT"))
		{
			roc = cTempl.comlan; // Lancer Panther Tracks
		}
		// Rocket tank (alt)
		if (camIsResearched("R-Wpn-Rocket03-HvAT"))
		{
			rocalt = cTempl.colbb; // Bunker Buster Leopard Tracks
		}
		// Cannon tank
		if (camIsResearched("R-Wpn-Cannon5"))
		{
			can = cTempl.comacan; // Assault Cannon Panther Tracks
		}
		else if (camIsResearched("R-Wpn-Cannon4AMk1"))
		{
			can = cTempl.comhvcan; // Hyper Velocity Cannon Panther Tracks
		}
		// AA tank
		if (camIsResearched("R-Wpn-AAGun04"))
		{
			aa = cTempl.cohraa; // Whirlwind Tiger Tracks
		}
		// MG cyborg
		if (camIsResearched("R-Cyborg-Wpn-Laser1"))
		{
			cmg = cTempl.cybls; // Flashlight Gunner Cyborg
		}
		else if (camIsResearched("R-Cyborg-Wpn-RotMG"))
		{
			cmg = cTempl.cybag; // Assault Gunner Cyborg
		}
		// Cannon cyborg
		if (camIsResearched("R-Cyborg-Hvywpn-Acannon"))
		{
			ccan = cTempl.scyac; // Super Auto-Cannon Cyborg
		}
		else if (camIsResearched("R-Cyborg-Hvywpn-HPV"))
		{
			ccan = cTempl.scyhc; // Super HPC Cyborg
		}
		// Cannon cyborg (alt)
		if (camIsResearched("R-Cyborg-Hvywpn-HPV"))
		{
			ccanalt = cTempl.scyhc; // Super HPC Cyborg
		}
		// Flamer cyborg
		if (camIsResearched("R-Cyb-Wpn-Thermite"))
		{
			cflam = cTempl.cybth; // Thermite Flamer Cyborg
		}
		// MG vtol
		if (camIsResearched("R-Wpn-Laser01"))
		{
			vmg = cTempl.collasv; // Flashlight Leopard VTOL
		}
		else if (camIsResearched("R-Wpn-MG4"))
		{
			vmg = cTempl.colagv; // Assault Gun Leopard VTOL
		}

		const vtolTemplates = [ vbomb, vmg, vpbomb ];
		// Add HV and Assault cannon VTOLs to the list if available
		if (camIsResearched("R-Wpn-Cannon4AMk1"))
		{
			vtolTemplates.push(vhcan);
		}
		if (camIsResearched("R-Wpn-Cannon5"))
		{
			vtolTemplates.push(vacan);
		}

		camSetFactoryTemplates("coalitionFactory1", [ rocalt, can, roc, can, mg, can, hvycan ], camChangeOnDiff(camSecondsToMilliseconds(85), true));
		camSetFactoryTemplates("coalitionFactory2", [ hvycan, mg, sens, aa, can, bomba, howit, rep, hvycan ], camChangeOnDiff(camSecondsToMilliseconds(115), true));
		camSetFactoryTemplates("coalitionCybFactory1", [ cmg, cgren, cmg, ccanalt, cmg, cgren, cmg ], camChangeOnDiff(camSecondsToMilliseconds(45), true));
		camSetFactoryTemplates("coalitionCybFactory2", [ ccan, cgren, ccan, cflam ], camChangeOnDiff(camSecondsToMilliseconds(55), true));
		camSetFactoryTemplates("coalitionCybFactory3", [ crep, cmg, ccanalt, cmg, cflam ], camChangeOnDiff(camSecondsToMilliseconds(50), true));
		camSetFactoryTemplates("coalitionVtolFactory", vtolTemplates, camChangeOnDiff(camSecondsToMilliseconds(50), true));
	}
}

// Choose which bases royalist reclaimer groups should target next
function updateReclaimerData()
{
	if (gameState.royalists.fakeout)
	{
		return;
	}

	const gGroup = gameState.royalists.groundGroups.groundReclaimerGroup;
	const hGroup = gameState.royalists.hoverGroups.hoverReclaimerGroup;
	let gOrder = CAM_ORDER_COMPROMISE;
	let hOrder = CAM_ORDER_COMPROMISE;

	// Only reclaim bases after phase 1
	if (gameState.phase <= 1)
	{
		gGroup.data.pos = camMakePos("royOuterFactoryAssembly");
		hGroup.data.pos = camMakePos("royHoverAssembly");
		return;
	}

	let antiAmphos = false;
	if (gameState.amphos.allianceState === "ALLIED" || gameState.amphos.allianceState === "ERADICATED")
	{
		// Allow "reclaiming" AMPHOS bases
		antiAmphos = true;
	}
	let antiCoalition = false;
	if (gameState.coalition.allianceState === "ALLIED" || gameState.coalition.allianceState === "ERADICATED")
	{
		// Allow "reclaiming" Coalition bases
		antiCoalition = true;
	}

	// Ground reclaimer group
	if (camBaseIsEliminated("royalistVtolBase"))
	{
		// Reclaim the main VTOL base
		gGroup.data.pos = camMakePos("innerPos4");
	}
	else if (camBaseIsEliminated("southRoyalWhirlwindHill"))
	{
		// Reclaim the South Whirlwind Hill base 
		gGroup.data.pos = camMakePos("innerPos1");
	}
	else if (camBaseIsEliminated("westGate"))
	{
		// Reclaim the West Gate base
		gGroup.data.pos = camMakePos("outerPos11");
	}
	else if (camBaseIsEliminated("royalistMountainCheckpoint"))
	{
		// Reclaim the mountain checkpoint
		gGroup.data.pos = camMakePos("royalistCheckpoint");
	}
	else if (camBaseIsEliminated("royalistHowitzerFOB"))
	{
		// Reclaim the Howitzer base
		gGroup.data.pos = camMakePos("centralPos4");
	}
	else if (antiCoalition && camBaseIsEliminated("royPlainsRepBase"))
	{
		// "Reclaim" the Coalition's plains base
		gGroup.data.pos = camMakePos("sunkenPlainsFOB");
	}
	else if (camBaseIsEliminated("eastCoastBase"))
	{
		// Reclaim the coast base
		gGroup.data.pos = camMakePos("centralPos14");
	}
	else if (camBaseIsEliminated("royalistCentralFactoryZone"))
	{
		// Reclaim the central factory zone
		gGroup.data.pos = camMakePos("centralPos9");
	}
	else if (antiCoalition && camBaseIsEliminated("royDeltaRepBase"))
	{
		// "Reclaim" the Coalition's river delta base
		gGroup.data.pos = camMakePos("riverDeltaFOB");
	}
	else if (camBaseIsEliminated("riverLZBase"))
	{
		// Reclaim the river LZ
		gGroup.data.pos = camMakePos("riverLZ");
	}
	else if (camBaseIsEliminated("riverTownBase"))
	{
		// Reclaim the river town base
		gGroup.data.pos = camMakePos("riverTownFOB");
	}
	else if (antiCoalition && camBaseIsEliminated("royCoalitionRepBase"))
	{
		// "Reclaim" the Coalition's main base
		gGroup.data.pos = camMakePos("westPos2");
	}
	else if (antiCoalition && camBaseIsEliminated("royBridgeRepBase"))
	{
		// "Reclaim" the Coalition's south bridge base
		gGroup.data.pos = camMakePos("coalitionBridgeFOB");
	}
	else if (gameState.phase >= 3 && camBaseIsEliminated("southBase"))
	{
		// Reclaim the south base
		gGroup.data.pos = camMakePos("southFOB");
	}
	else
	{
		// Go back home
		gGroup.data.pos = camMakePos("royOuterFactoryAssembly");
		gOrder = CAM_ORDER_DEFEND;
	}

	// Hover reclaimer group
	if (camBaseIsEliminated("northLakeBase"))
	{
		// Reclaim the northern lake base
		hGroup.data.pos = camMakePos("northLakeFOB");
	}
	else if (camBaseIsEliminated("southGate"))
	{
		// Reclaim the South Gate base
		hGroup.data.pos = camMakePos("southGateBase");
	}
	else if (antiAmphos && camBaseIsEliminated("nwIslandBase"))
	{
		// Reclaim the NW island base
		hGroup.data.pos = camMakePos("nwIslandFOB");
	}
	else if (antiAmphos && camBaseIsEliminated("roySWIsleRepBase"))
	{
		// "Reclaim" the south island base
		hGroup.data.pos = camMakePos("southIslandFOB");
	}
	else if (gameState.phase >= 3 && camBaseIsEliminated("royPortRepBase"))
	{
		// "Reclaim" the southern port base
		hGroup.data.pos = camMakePos("southPos12");
	}
	else if (antiAmphos && camBaseIsEliminated("royAmphosRepBase"))
	{
		// "Reclaim" the AMPHOS main base
		hGroup.data.pos = camMakePos("eastPos1");
	}
	else
	{
		// Go back home
		hGroup.data.pos = camMakePos("royHoverAssembly");
		hOrder = CAM_ORDER_DEFEND;
	}

	// Make sure the new orders are applied
	gGroup.order = gOrder;
	hGroup.order = hOrder;
	manageGroupBySize(gGroup, true);
	manageGroupBySize(hGroup, true);
}

// If a faction is offering an alliance, move their olive truck to the olive zone.
// This is called on a loop in case the truck gets lost or otherwise forgets its orders.
function orderOliveTrucks()
{
	// Resistance
	const resTruck = getObject("resOliveTruck");
	if (camDef(resTruck) && resTruck !== null && gameState.resistance.allianceState === "OFFER")
	{
		const pos = camMakePos("resOliveZone");
		orderDroidLoc(resTruck, DORDER_MOVE, pos.x, pos.y);
	}
	// AMPHOS
	const ampTruck = getObject("ampOliveTruck");
	if (camDef(ampTruck) && ampTruck !== null && gameState.amphos.allianceState === "OFFER")
	{
		const pos = camMakePos("ampOliveZone");
		orderDroidLoc(ampTruck, DORDER_MOVE, pos.x, pos.y);
	}
	// Hellraisers
	const helTruck = getObject("helOliveTruck");
	if (camDef(helTruck) && helTruck !== null && gameState.hellraisers.allianceState === "OFFER")
	{
		const pos = camMakePos("helOliveZone");
		orderDroidLoc(helTruck, DORDER_MOVE, pos.x, pos.y);
	}
	// Coalition
	const coaTruck = getObject("coaOliveTruck");
	if (camDef(coaTruck) && coaTruck !== null && gameState.coalition.allianceState === "OFFER")
	{
		const pos = camMakePos("coaOliveZone");
		orderDroidLoc(coaTruck, DORDER_MOVE, pos.x, pos.y);
	}
	// Royalists
	const royTruck = getObject("royOliveTruck");
	if (camDef(royTruck) && royTruck !== null && gameState.royalists.fakeout)
	{
		const pos = camMakePos("royOliveZone");
		orderDroidLoc(royTruck, DORDER_MOVE, pos.x, pos.y);
	}
}