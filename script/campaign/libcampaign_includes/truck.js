
////////////////////////////////////////////////////////////////////////////////
// Truck management.
////////////////////////////////////////////////////////////////////////////////

//;; ## camManageTrucks(player, blabel, structset, template, tickRate, respawnDelay[, truckDroid])
//;;
//;; Manage trucks for an AI player. This assumes rebuilding bases and
//;; reconstructing destroyed trucks in factories, the latter is implemented
//;; via ```camQueueDroidProduction()``` mechanism. 
//;; * ```player``` The player index this truck belongs to.
//;; * ```blabel``` The base the truck is tied to, and used to determine if
//;;    the truck should respawn automatically. 
//;; * ```structset``` A set of structures the truck will be tasked with 
//;;    building/maintaining. 
//;; * ```template``` The design template to use for the truck.
//;; * ```respawnDelay``` The delay (in milliseconds) before automatically 
//;;    rebuilding the truck, if the base it belongs to still exists.
//;; * ```truckDroid``` A truck object to be managed.
//;;
function camManageTrucks(player, blabel, structset, template, respawnDelay, truckDroid)
{
	var length = __camTruckInfo.push({
		base: blabel,
		structset: structset,
		obset: [], // List of structures to demolish
		checkForModuleUpdate: true, // Whether we look for structures to add modules to
		checkForStructureReplacement: true, // Whether we look for structures to build
		checkForObsolete: true, // Whether we look for structures to demolish
		player: player,
		template: template,
		respawnDelay: respawnDelay,
		truckDroid: undefined, // Holds info about the assigned truck droid
		enabled: true // If set to false, do not rebuild or manage
	});

	if (camDef(truckDroid) && truckDroid)
	{
		// Truck already built
		__camTruckInfo[length - 1].truckDroid = truckDroid;
	}
	else
	{
		// Build the new truck
		camRebuildTruck(length - 1, false);
	}
}

// Stop managing a given truck.
function camDisableTruck(what)
{
	if (camIsString(what))
	{
		what = camGetTrucksFromBase(what);
	}
	else if (Number.isInteger(what))
	{
		what = [what];
	}
	else if (!(what instanceof Array))
	{
		camDebug("Invalid input; must be truck index or base label.");
		return;
	}

	for (var index of what)
	{
		__camTruckInfo[index].enabled = false;
	}
}

// Resume managing a given truck.
function camEnableTruck(what)
{
	if (camIsString(what))
	{
		what = camGetTrucksFromBase(what);
	}
	else if (Number.isInteger(what))
	{
		what = [what];
	}
	else if (!(what instanceof Array))
	{
		camDebug("Invalid input; must be truck index or base label.");
		return;
	}
	
	for (var index of what)
	{
		__camTruckInfo[index].enabled = true;
		camRebuildTruck(index, false);
	}
}

//;; ## camTruckObsoleteStructure(player, obsoleteStruct, newStruct[, noObsolete])
//;;
//;; Replace a structure with another structure in a truck's structure set
//;; Trucks will demolish the old structure type when they come across it
//;; Setting noObsolete to true will mean trucks will not demolish the old structure,
//;; only replacing it if is destroyed.
//;;
function camTruckObsoleteStructure(player, obsoleteStruct, newStruct, noObsolete)
{
	for (var i = 0; i < __camTruckInfo.length; i++)
	{
		var ti = __camTruckInfo[i];

		if (ti.player === player)
		{
			if (!camDef(noObsolete) || !noObsolete)
			{
				// Add the obsolete structure to the obsolete list
				ti.obset.push(camGetCompNameFromId(obsoleteStruct, "Building"));
				ti.obset = camRemoveDuplicates(ti.obset);
				ti.checkForObsolete = true;
			}

			// Find all the instances of the now obsolete structure in the
			// structure list and replace it with the new structure
			for (var j = 0; j < ti.structset.length; j++)
			{
				if (ti.structset[j].stat === obsoleteStruct)
				{
					ti.structset[j].stat = newStruct;
				}
			}
		}
	}
}

//;; ## camTruckUpgradeModule(player, struct)
//;;
//;; Tells trucks of the specified player to fully upgrade base structures
//;; of a certain type.
function camTruckUpgradeModule(player, struct)
{
	if (struct !== "A0PowerGenerator" && struct !== "A0ResearchFacility"
		&& struct !== "A0LightFactory" && struct !== "A0VTolFactory1")
	{
		camDebug("Tried to upgrade the modules of an invalid structure!");
		return;
	}

	var numMods = 1;
	if (struct === "A0LightFactory" || struct === "A0VTolFactory1")
	{
		// Factories max out at two modules
		numMods = 2;
	}
	__camTruckCheckForModules(player);

	for (var i = 0; i < __camTruckInfo.length; i++)
	{
		if (__camTruckInfo[i].player === player)
		{
			// Find all the instances of the matching structure and give them full modules
			for (var j = 0; j < __camTruckInfo[i].structset.length; j++)
			{
				if (__camTruckInfo[i].structset[j].stat === struct)
				{
					__camTruckInfo[i].structset[j].mods = numMods;
				}
			}
		}
	}
}

//;; ## camRebuildTruck(index, force)
//;;
//;; Order a new truck to be built as soon as production.js allows.
//;; Automatically called after a delay when a truck dies.
//;; Returns true if successful, returns false if the truck already exists.
//;; * ```index``` The index of __camTruckInfo that should have its truck rebuilt.
//;; * ```force``` Set to true to rebuild the truck even if its base is gone.
function camRebuildTruck(index, force)
{
	var ti = __camTruckInfo[index];

	if (camDef(ti.enabled) && !ti.enabled)
	{
		return false; // Truck management is disabled
	}

	if (!camDef(force))
	{
		force = false;
	}

	if (!force && camBaseIsEliminated(ti.base))
	{
		return false; // Truck's base was destroyed after queueing
	}

	if (ti.truckDroid !== undefined)
	{
		return false; // Truck already exists
	}

	for (var i in __camTruckAssignList)
	{
		var awaitingIndex = __camTruckAssignList[i];

		// Search through all the indexes that are already waiting for their truck
		if (awaitingIndex === index)
		{
			return false; // The truck is already being built
		}
	}
	__camTruckAssignList.push(index); // Start expecting the truck
	camQueueDroidProduction(ti.player, ti.template, camMakePos(ti.base));
	return true;
}

//;; ## camGetTrucksFromBase(base label)
//;;
//;; Returns an array of indexes that correspond to trucks assigned to a base.
function camGetTrucksFromBase(blabel)
{
	var indexList = [];
	for (var i = 0; i < __camTruckInfo.length; i++)
	{
		if (__camTruckInfo[i].base === blabel)
		{
			indexList.push(i);
		}
	}

	return indexList;
}

//////////// privates

// Check if a truck is busy doing a building-related action
// If ```strict```` is false, then only consider busy when building or demolishing
function __camTruckBusy(truck, strict)
{
	let DACTION_BUILD = 2;
	let DACTION_DEMOLISH = 4;
	let DACTION_REPAIR = 5;
	let DACTION_MOVETOBUILD = 18;
	let DACTION_MOVETOREPAIR = 20;

	if (truck.action === DACTION_BUILD || truck.action === DACTION_DEMOLISH)
	{
		return true;
	}
	if (strict)
	{
		if (truck.action === DACTION_REPAIR 
			|| truck.action === DACTION_MOVETOBUILD 
			|| truck.action === DACTION_MOVETOREPAIR)
		{
			return true;
		}
	}

	return false;
}

// Alert this player's trucks to check structures for missing modules
// called from eventStructureBuilt
function __camTruckCheckForModules(player)
{
	for (var index in __camTruckInfo)
	{
		var truckInfo = __camTruckInfo[index];
		if (truckInfo.player === player)
		{
			truckInfo.checkForModuleUpdate = true;
		}
	}
}

// Alert this player's trucks to see if any structures must be replaced
// called from eventDestroyed
function __camTruckCheckMissingStructs(player)
{
	for (var index in __camTruckInfo)
	{
		var truckInfo = __camTruckInfo[index];
		if (truckInfo.player === player)
		{
			truckInfo.checkForStructureReplacement = true;
		}
	}
}

function __camTruckTick()
{
	// Issue truck orders.
	// See comments inside the loop to understand priority.
	for (var i = 0; i < __camTruckInfo.length; i++)
	{
		var ti = __camTruckInfo[i];

		if (camDef(ti.enabled) && !ti.enabled)
		{
			continue; // Truck management is disabled
		}

		var player = ti.player;
		var truck = ti.truckDroid;

		// Don't order trucks if they're dead
		if (!camDef(truck))
		{
			continue;
		}

		// Update the truck's stored info
		ti.truckDroid = getObject(DROID, player, ti.truckDroid.id);
		truck = ti.truckDroid;
		var orderGiven = false;

		// Don't order trucks if they're busy building something
		if (__camTruckBusy(truck, true))
		{
			continue;
		}

		// The truck is alive and ready, let's get started
		// First, check if there are any base structures that need modules (factories/power/research)
		if (ti.checkForModuleUpdate)
		{
			for (var j = 0; j < ti.structset.length; j++)
			{
				var struct = ti.structset[j];

				// Only compare structures in the struct set that have modules
				if (struct.mods > 0)
				{
					// Look to where the structure should be and see if it's missing a module (if it exists).
					var toBeUpgraded = getObject(struct.x, struct.y);
					if (toBeUpgraded !== null && toBeUpgraded.type === STRUCTURE 
						&& toBeUpgraded.status === BUILT && toBeUpgraded.player === player 
						&& toBeUpgraded.modules < struct.mods)
					{
						// If the structure exists and does not have enough modules, tell the truck to add one.
						var moduleType = "";
						switch (toBeUpgraded.stattype)
						{
							case FACTORY:
							case VTOL_FACTORY:
								moduleType = "A0FacMod1";
								break;
							case POWER_GEN:
								moduleType = "A0PowMod1";
								break;
							case RESEARCH_LAB:
								moduleType = "A0ResearchModule1";
								break;
						}

						enableStructure(moduleType, player);
						orderDroidBuild(truck, DORDER_BUILD, moduleType, struct.x, struct.y);

						orderGiven = true;
						break;
					}

					// If we get to this point then no modules were needed,
					// No point in checking again until further notice
					ti.checkForModuleUpdate = false;
				}
			}
		}

		// Second, repair any structure in the truck's immediate area (let the truck automatically do this)
		// Third, build any structure missing from the truck's structure set
		if (ti.checkForStructureReplacement && !orderGiven && !__camTruckBusy(truck, false))
		{
			var minDist = Number.MAX_VALUE;
			var minDistIndex = -1;
			var structSet = ti.structset;
			
			// Find the closest spot that we want to build on
			for (var j = 0; j < structSet.length; j++)
			{
				// Check the structure spot and see if it's unobstructed (except for oil derricks, we want those ON the oil resource)
				var structSpot = getObject(structSet[j].x, structSet[j].y);
				if (structSpot === null || (structSet[j].stat === "A0ResourceExtractor" && structSpot.type === FEATURE))
				{
					// Compare the distance between the truck and the structure location
					var dist = distBetweenTwoPoints(truck.x, truck.y, structSet[j].x, structSet[j].y);
					if (dist < minDist)
					{
						minDist = dist;
						minDistIndex = j;
					}
				}
			}

			// If we found a clear spot, build the structure
			if (minDistIndex !== -1)
			{
				enableStructure(structSet[minDistIndex].stat, player);
				orderDroidBuild(truck, DORDER_BUILD, structSet[minDistIndex].stat, 
					structSet[minDistIndex].x, structSet[minDistIndex].y, 
					structSet[minDistIndex].rot * 90);
				orderGiven = true;
			}
			else
			{
				// No missing structures were found, so there's
				// no point in checking again until further notice
				ti.checkForStructureReplacement = false;
			}
		}

		// Fourth, demolish any structures in the truck's obsolete list
		if (ti.checkForObsolete && !orderGiven && !__camTruckBusy(truck, false))
		{
			var obsoleteSet = ti.obset;
			var structSet = ti.structset;
			var foundObsolete = false;

			for (var j = 0; j < structSet.length; j++)
			{
				// Check the coordinates of every structure in the structure set
				// to see if there's any obsolete structures
				var x = structSet[j].x;
				var y = structSet[j].y;
				var structure = getObject(x, y);
				// If spot is empty for some reason
				if (structure === null) continue;

				for (var k = 0; k < obsoleteSet.length; k++)
				{
					if (structure.name === obsoleteSet[k])
					{
						// There's a structure here that matches an obsolete template
						// Demolish it.
						orderDroidObj(truck, DORDER_DEMOLISH, structure);
						foundObsolete = true;
						orderGiven = true;
						// Since we're demolishing a structure, we're probably gonna 
						// have to build one to replace it.
						ti.checkForStructureReplacement = true;
						break;
					}
				}

				if (orderGiven)
				{
					// Already ordered something to be demolished
					break;
				}
			}

			if (!foundObsolete)
			{
				// We didn't find any obsolete structures
				// so there's no point in looking again.
				ti.checkForObsolete = false;
			}
		}

		// Lastly, wander around the base
		// Only do this if the truck is doing absolutely nothing
		if (!orderGiven && truck.action === 0) /* DACTION_NONE */
		{
			let pos;
			let baseArea = getObject(__camEnemyBases[ti.base].cleanup);
			
			let baseWidth = Math.abs(baseArea.x2 - baseArea.x);
			let baseHeight = Math.abs(baseArea.y2 - baseArea.y);
			let baseStartx = (baseArea.x < baseArea.x2) ? baseArea.x : baseArea.x2;
			let baseStarty = (baseArea.y < baseArea.y2) ? baseArea.y : baseArea.y2;

			// Limit the amount of times we scan for a location
			let accumulator = 0;

			do
			{
				// Find a position within the base area that the truck can reach
				pos = {x: camRand(baseWidth), y: camRand(baseHeight)};
				pos.x += baseStartx;
				pos.y += baseStarty;

				// Give up searching for a good spot after 10 tries
				accumulator++;
			} while ((accumulator <= 10) && (getObject(pos.x, pos.y) !== null
				|| !propulsionCanReach(truck.propulsion, truck.x, truck.y, pos.x, pos.y)));

			// Order the truck to go to the chosen spot
			// DORDER_SCOUT is used so the truck will stop
			// and repair/help build structures along the way
			orderDroidLoc(truck, DORDER_SCOUT, pos.x, pos.y);
		}
	}
}

// Find a job for a newly-produced truck
// called from eventDroidBuilt
function __camAssignTruck(droid)
{
	// Loop through all the indexes waiting for a truck
	for (var i = 0; i < __camTruckAssignList.length; i++)
	{
		// This will be the index in __camTruckInfo that is awaiting a new truck
		var awaitingIndex = __camTruckAssignList[i];
		var ti = __camTruckInfo[awaitingIndex];

		var player = ti.player;
		var body = ti.template.body;
		var prop = ti.template.prop;
		var truckDroid = ti.truckDroid;

		// See if the player and template match
		if (droid.player === player && droid.body === body 
			&& droid.propulsion === prop && truckDroid === undefined)
		{
			var truckPos = camMakePos(droid);
			var basePos = camMakePos(__camEnemyBases[ti.base].cleanup);
			if (!propulsionCanReach(prop, truckPos.x, truckPos.y, basePos.x, basePos.y))
			{
				// This truck matches, but can't reach its designated base!
				camSafeRemoveObject(droid); // Remove it
				__camTruckAssignList.splice(i, 1); 
				camRebuildTruck(awaitingIndex, true); // Rebuild it
				return;
			}

			if (camDef(ti.enabled) && !ti.enabled)
			{
				// Management is disabled for this truck, remove it instead of assigning it.
				__camTruckAssignList.splice(i, 1);
				camSafeRemoveObject(droid);
			}
			else 
			{
				ti.truckDroid = droid;
				// This index now has its truck, so remove it from the array
				__camTruckAssignList.splice(i, 1); 
			}

			return; // Truck assigned; all done
		}
	}
}

// Remove a dead truck from its assignment
// called from eventDestroyed
function __camCheckDeadTruck(obj)
{
	for (var index in __camTruckInfo)
	{
		var truckInfo = __camTruckInfo[index];
		// Unassign this truck if the id matches
		if (truckInfo.truckDroid !== undefined && obj.id === truckInfo.truckDroid.id)
		{
			truckInfo.truckDroid = undefined;

			if (!camBaseIsEliminated(truckInfo.base))
			{
				// Queue up another truck if its base still exists
				queue("camRebuildTruck", truckInfo.respawnDelay, index);
			}
			return; // We've already unassigned the truck and queued a new one.
		}
	}
}
