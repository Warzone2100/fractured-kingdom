
////////////////////////////////////////////////////////////////////////////////
// Misc useful stuff.
////////////////////////////////////////////////////////////////////////////////

//;; ## camDef(something)
//;;
//;; Returns false if something is JavaScript-undefined, true otherwise.
//;;
function camDef(something)
{
	return typeof(something) !== "undefined";
}

//;; ## camIsString(something)
//;;
//;; Returns true if something is a string, false otherwise.
//;;
function camIsString(something)
{
	return typeof(something) === "string";
}

//;; ## camRand(max)
//;;
//;; A non-synchronous random integer in range [0, max - 1].
//;;
function camRand(max)
{
	if (max > 0)
	{
		return Math.floor(Math.random() * max);
	}
	camDebug("Max should be positive");
}

//;; ## camCallOnce(function name)
//;;
//;; Call a function by name, but only if it has not been called yet.
//;;
function camCallOnce(callback)
{
	if (camDef(__camCalledOnce[callback]) && __camCalledOnce[callback])
	{
		return;
	}
	__camCalledOnce[callback] = true;
	__camGlobalContext()[callback]();
}

//;; ## camSafeRemoveObject(obj[, special effects?])
//;;
//;; Remove a game object (by value or label) if it exists, do nothing otherwise.
//;;
function camSafeRemoveObject(obj, flashy)
{
	if (__camLevelEnded)
	{
		return;
	}
	if (camIsString(obj))
	{
		obj = getObject(obj);
	}
	if (camDef(obj) && obj)
	{
		removeObject(obj, flashy);
	}
}

//;; ## camMakePos(x, y | label | object)
//;;
//;; Make a POSITION-like object, unless already done. Often useful
//;; for making functions that would accept positions in both xx,yy and {x:xx,y:yy} forms.
//;; Also accepts labels. If label of AREA is given, returns the center of the area.
//;; If an existing object or label of such is given, returns a safe JavaScript
//;; object containing its x, y and id.
//;;
function camMakePos(xx, yy)
{
	if (camDef(yy))
	{
		return { x : xx, y : yy };
	}
	if (!camDef(xx))
	{
		return undefined;
	}
	var obj = xx;
	if (camIsString(xx))
	{
		obj = getObject(xx);
	}
	if (!camDef(obj) || !obj)
	{
		camDebug("Failed at", xx);
		return undefined;
	}
	switch (obj.type)
	{
		case DROID:
		case STRUCTURE:
		case FEATURE:
			// store ID for those as well.
			return { x: obj.x, y: obj.y, id: obj.id };
		case POSITION:
		case RADIUS:
			return obj;
		case AREA:
			return {
				x: Math.floor((obj.x + obj.x2) / 2),
				y: Math.floor((obj.y + obj.y2) / 2)
			};
		case GROUP:
		default:
			// already a pos-like object?
			if (camDef(obj.x) && camDef(obj.y))
			{
				return { x: obj.x, y: obj.y };
			}
			camDebug("Not implemented:", obj.type);
			return undefined;
	}
}

//;; ## camDist(x1, y1, x2, y2 | pos1, x2, y2 | x1, y1, pos2 | pos1, pos2)
//;;
//;; A wrapper for ```distBetweenTwoPoints()```.
//;;
function camDist(x1, y1, x2, y2)
{
	if (camDef(y2)) // standard
	{
		return distBetweenTwoPoints(x1, y1, x2, y2);
	}
	var pos2 = camMakePos(x2, y2);
	if (!camDef(pos2)) // pos1, pos2
	{
		return distBetweenTwoPoints(x1.x, x1.y, y1.x, y1.y);
	}
	if (camDef(pos2.x)) // x2 is pos2
	{
		return distBetweenTwoPoints(x1, y1, pos2.x, pos2.y);
	}
	else // pos1, x2, y2
	{
		return distBetweenTwoPoints(x1.x, x1.y, y1, x2);
	}
}

//;; ## camPlayerMatchesFilter(player, filter)
//;;
//;; A function to handle player filters in a way similar to
//;; how JS API functions (eg. ```enumDroid(filter, ...)```) handle them.
//;;
function camPlayerMatchesFilter(player, filter)
{
	switch(filter) {
		case ALL_PLAYERS:
			return true;
		case ALLIES:
			return player === CAM_HUMAN_PLAYER;
		case ENEMIES:
			return player >= 0 && player < CAM_MAX_PLAYERS && player !== CAM_HUMAN_PLAYER;
		default:
			return player === filter;
	}
}

//;; ## camRemoveDuplicates(array)
//;;
//;; Remove duplicate items from an array.
//;;
function camRemoveDuplicates(array)
{
	var prims = {"boolean":{}, "number":{}, "string":{}};
	var objs = [];

	return array.filter(function(item) {
		var type = typeof item;
		if (type in prims)
		{
			return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
		}
		else
		{
			return objs.indexOf(item) >= 0 ? false : objs.push(item);
		}
	});
}

//;; ## camCountStructuresInArea(label, [player])
//;;
//;; Mimics wzscript's numStructsButNotWallsInArea().
//;;
function camCountStructuresInArea(lab, player)
{
	if (!camDef(player))
	{
		player = CAM_HUMAN_PLAYER;
	}
	var list = enumArea(lab, player, false);
	var ret = 0;
	for (var i = 0, l = list.length; i < l; ++i)
	{
		var object = list[i];
		if (object.type === STRUCTURE && object.stattype !== WALL && object.status === BUILT)
		{
			++ret;
		}
	}
	return ret;
}

//;; ## camChangeOnDiff(numeric value[, inverse])
//;;
//;; Change a numeric value based on campaign difficulty.
//;;
function camChangeOnDiff(num, inverse)
{
	var modifier = 0;

	switch (difficulty)
	{
		case SUPEREASY:
			modifier = 2;
			break;
		case EASY:
			modifier = 1.5;
			break;
		case MEDIUM:
			modifier = 1.00;
			break;
		case HARD:
			modifier = 0.85;
			break;
		case INSANE:
			modifier = 0.70;
			break;
		default:
			modifier = 1.00;
			break;
	}

	if (camDef(inverse) && inverse)
	{
		if (difficulty !== SUPEREASY)
		{
			modifier = 2 - modifier;
		}
		else
		{
			// Don't let the modifier equal zero
			modifier = 0.25;
		}
	}

	return Math.floor(num * modifier);
}

//;; ## camIsSystemDroid(game object)
//;;
//;; Determine if the passed in object is a non-weapon based droid.
//;;
function camIsSystemDroid(obj)
{
	if(!camDef(obj) || !obj)
	{
		return false;
	}

	if (obj.type !== DROID)
	{
		camTrace("Non-droid: " + obj.type + " pl: " + obj.name);
		return false;
	}

	return (obj.droidType === DROID_SENSOR || obj.droidType === DROID_CONSTRUCT || obj.droidType === DROID_REPAIR);
}

//;; ## camMakeGroup(what, filter)
//;;
//;; Make a new group out of array of droids, single game object,
//;; or label string, with fuzzy auto-detection of argument type.
//;; Only droids would be added to the group. ```filter``` can be one of
//;; a player index, ```ALL_PLAYERS```, ```ALLIES``` or ```ENEMIES```;
//;; defaults to ```ENEMIES```.
//;;
function camMakeGroup(what, filter)
{
	if (!camDef(filter))
	{
		filter = ENEMIES;
	}
	var array;
	var obj;
	if (camIsString(what)) // label
	{
		obj = getObject(what);
	}
	else if (camDef(what.length)) // array
	{
		array = what;
	}
	else if (camDef(what.type)) // object
	{
		obj = what;
	}
	if (camDef(obj))
	{
		switch(obj.type) {
			case POSITION:
				obj = getObject(obj.x, obj.y);
				// fall-through
			case DROID:
			case STRUCTURE:
			case FEATURE:
				array = [ obj ];
				break;
			case AREA:
				array = enumArea(obj.x, obj.y, obj.x2, obj.y2,
				                 ALL_PLAYERS, false);
				break;
			case RADIUS:
				array = enumRange(obj.x, obj.y, obj.radius,
				                 ALL_PLAYERS, false);
				break;
			case GROUP:
				array = enumGroup(obj.id);
				break;
			default:
				camDebug("Unknown object type", obj.type);
		}
	}
	if (camDef(array))
	{
		var group = camNewGroup();
		for (var i = 0, l = array.length; i < l; ++i)
		{
			var o = array[i];
			if (!camDef(o) || !o)
			{
				camDebug("Trying to add", o);
				continue;
			}
			if (o.type === DROID && o.droidType !== DROID_CONSTRUCT && camPlayerMatchesFilter(o.player, filter))
			{
				groupAdd(group, o);
			}
		}
		return group;
	}
	camDebug("Cannot parse", what);
}

//;; ## camBreakAlliances()
//;;
//;; Break alliances between all players.
//;;
function camBreakAlliances()
{
	for (var i = 0; i < CAM_MAX_PLAYERS; ++i)
	{
		for (var c = 0; c < CAM_MAX_PLAYERS; ++c)
		{
			if (i !== c && allianceExistsBetween(i, c) === true)
			{
				setAlliance(i, c, false);
			}
		}
	}
}

// Picks a random coordinate anywhere on the edge of the map.
function camGenerateRandomMapEdgeCoordinate(reachPosition)
{
	let limits = getScrollLimits();
	let loc;

	do
	{
		let location = {x: 0, y: 0};
		let xWasRandom = false;

		if (camRand(100) < 50)
		{
			location.x = camRand(limits.x2 + 1);
			if (location.x < (limits.x + 2))
			{
				location.x = limits.x + 2;
			}
			else if (location.x > (limits.x2 - 2))
			{
				location.x = limits.x2 - 2;
			}
			xWasRandom = true;
		}
		else
		{
			location.x = (camRand(100) < 50) ? (limits.x2 - 2) : (limits.x + 2);
		}

		if (!xWasRandom && (camRand(100) < 50))
		{
			location.y = camRand(limits.y2 + 1);
			if (location.y < (limits.y + 2))
			{
				location.y = limits.y + 2;
			}
			else if (location.y > (limits.y2 - 2))
			{
				location.y = limits.y2 - 2;
			}
		}
		else
		{
			location.y = (camRand(100) < 50) ? (limits.y2 - 2) : (limits.y + 2);
		}

		loc = location;
	} while (camDef(reachPosition) && reachPosition && !propulsionCanReach("wheeled01", reachPosition.x, reachPosition.y, loc.x, loc.y));


	return loc;
}

// Picks a random coordinate anywhere on the map.
function camGenerateRandomMapCoordinate(reachPosition, distFromReach, scanObjectRadius)
{
	if (!camDef(distFromReach))
	{
		distFromReach = 10;
	}
	if (!camDef(scanObjectRadius))
	{
		scanObjectRadius = 2;
	}

	let limits = getScrollLimits();
	let pos;

	do
	{
		let randomPos = {x: camRand(limits.x2), y: camRand(limits.y2)};

		if (randomPos.x < (limits.x + 2))
		{
			randomPos.x = limits.x + 2;
		}
		else if (randomPos.x > (limits.x2 - 2))
		{
			randomPos.x = limits.x2 - 2;
		}

		if (randomPos.y < (limits.y + 2))
		{
			randomPos.y = limits.y;
		}
		else if (randomPos.y > (limits.y2 - 2))
		{
			randomPos.y = limits.y2 - 2;
		}

		pos = randomPos;
	} while (camDef(reachPosition) &&
		reachPosition &&
		!propulsionCanReach("wheeled01", reachPosition.x, reachPosition.y, pos.x, pos.y) &&
		(camDist(pos, reachPosition) < distFromReach) &&
		(enumRange(pos.x, pos.y, scanObjectRadius, ALL_PLAYERS, false).length !== 0));

	return pos;
}

// Figures out what campaign we are in without reliance on the source at all.
function camDiscoverCampaign()
{
	for (var i = 0, len = ALPHA_LEVELS.length; i < len; ++i)
	{
		if (__camNextLevel === ALPHA_LEVELS[i] || __camNextLevel === BETA_LEVELS[0])
		{
			return ALPHA_CAMPAIGN_NUMBER;
		}
	}
	for (var i = 0, len = BETA_LEVELS.length; i < len; ++i)
	{
		if (__camNextLevel === BETA_LEVELS[i] || __camNextLevel === GAMMA_LEVELS[0])
		{
			return BETA_CAMPAIGN_NUMBER;
		}
	}
	for (var i = 0, len = GAMMA_LEVELS.length; i < len; ++i)
	{
		if (__camNextLevel === GAMMA_LEVELS[i] || __camNextLevel === CAM_GAMMA_OUT)
		{
			return GAMMA_CAMPAIGN_NUMBER;
		}
	}

	return UNKNOWN_CAMPAIGN_NUMBER;
}

// Returns a nice name for the passed in template
function camNameTemplate(template)
{
	var n;
	var w = camGetCompNameFromId(template.weap, "Weapon");
	if (!camDef(w))
	{
		// Sensor unit?
		w = camGetCompNameFromId(template.weap, "Sensor");
		if (!camDef(w))
		{
			// Truck??
			w = camGetCompNameFromId(template.weap, "Construct");
			if (!camDef(w))
			{
				// Repair Turret???
				w = camGetCompNameFromId(template.weap, "Repair");
				if (!camDef(w))
				{
					// Commander????
					w = camGetCompNameFromId(template.weap, "Brain");
				}
			}
		}
	}
	if (template.body === "CyborgLightBody" || template.body === "CyborgHeavyBody")
	{
		// Just use the weapon name for cyborgs
		n = w;
	}
	else
	{
		var b = camGetCompNameFromId(template.body, "Body");
		var p = camGetCompNameFromId(template.prop, "Propulsion");
		n = [ w, b, p ].join(" ");
	}
	return n;
}

// Sets a droid's rank to the given value.
// ```droid``` must be a droid object, while ```rank```
// can be either an integer or name of a rank.
function camSetDroidRank(droid, rank)
{
	if (!camDef(droid) || droid.type !== DROID)
	{
		camTrace("Tried setting an unkown object's rank.");
		return;
	}

	if (droid.droidType === DROID_CONSTRUCT || droid.droidType === DROID_REPAIR)
	{
		camTrace("Tried setting the rank of a non-sensor system droid.");
		return;
	}

	var xpAmount = 0;
	if (camIsString(rank)) // Rank as a string?
	{
		switch (rank)
		{
			case "Green":
				xpAmount = 4;
				break;
			case "Trained":
				xpAmount = 8;
				break;
			case "Regular":
				xpAmount = 16;
				break;
			case "Professional":
				xpAmount = 32;
				break;
			case "Veteran":
				xpAmount = 64;
				break;
			case "Elite":
				xpAmount = 128;
				break;
			case "Special":
				xpAmount = 256;
				break;
			case "Hero":
				xpAmount = 512;
				break;
			default:
				camDebug("Unkown rank given to camSetDroidRank!");
				return;
		}
	}
	else // Rank as an integer?
	{
		if (rank > 0)
		{
			xpAmount = Math.pow(2, rank + 1);
		}
	}

	if (droid.droidType === DROID_COMMAND)
	{
		xpAmount *= 2; // Commanders need twice the xp
	}

	setDroidExperience(droid, xpAmount);
}

// Returns a droid's rank as an integer.
// ```droid``` must be a droid object.
function camGetDroidRank(droid)
{
	if (!camDef(droid) || droid.type !== DROID)
	{
		camTrace("Tried getting an unkown object's rank.");
		return;
	}

	var xpAmount = droid.experience;
	if (droid.droidType === DROID_COMMAND)
	{
		// Pretend commanders have half the XP they actually do
		xpAmount /= 2;
	}

	if (xpAmount >= 512) return 8; // Hero
	if (xpAmount >= 256) return 7; // Special
	if (xpAmount >= 128) return 6; // Elite
	if (xpAmount >= 64) return 5; // Veteran
	if (xpAmount >= 32) return 4; // Professional
	if (xpAmount >= 16) return 3; // Regular
	if (xpAmount >= 8) return 2; // Trained
	if (xpAmount >= 4) return 1; // Green
	return 0; // Rookie
}

// Returns the amount of units a commander can handle base on rank.
// ```droid``` must be a commander droid.
function camGetCommanderMaxGroupSize(commander)
{
	if (!camDef(commander) || commander.type !== DROID || commander.droidType !== DROID_COMMAND)
	{
		camDebug("camGetCommanderMaxGroupSize must be given a commander droid object.");
		return;
	}

	return 6 + (2 * camGetDroidRank(commander));
}

// Returns the object responsible for the attacking of the given object.
// If no culprit is found, returns undefined. DEV NOTE: This function might get confused
// if the same object is attacked very rapidly by multiple different attackes (i.e. several assault guns),
// ```droid``` must be a commander droid.
function camWhoAttacked(obj)
{
	for (var i = 0; i < __camAttackLog.length; i++)
	{
		if (__camAttackLog[i].victim.id === obj.id)
		{
			return __camAttackLog[i].attacker;
		}
	}
	return undefined;
}

// Returns true if the given position lies within the given area label
function camWithinArea(pos, area)
{
	var p = camMakePos(pos);
	var a = area;
	if (camIsString(area))
	{
		a = getObject(area);
	}
	if (!camDef(a))
	{
		console("area is undefined!")
	}
	if (a === null)
	{
		console("area is null!")
	}
	
	return (p.x >= a.x 
		&& p.x <= a.x2
		&& p.y >= a.y 
		&& p.y <= a.y2);
}

// Returns an array where all instances of item1 are replaced with item2
function camArrayReplaceWith(array, item1, item2)
{
	var index = array.indexOf(item1);
	while (index !== -1)
	{
		array[index] = item2;
		index = array.indexOf(item1);
	}
	return array;
}

// Returns stats about the given component from the global Stats data structure.
// If a player is provided, look up stats from their specified Upgrades structure,
// which contains stats that can be modified through research upgrades.
// For example, `camGetCompStats("Lancer", "Weapon", CAM_HUMAN_PLAYER)` can be used
// to get the current stats of the player's Lancer rockets.
// ```compType``` can be "Body", "Brain", "Building", "Construct", "ECM", "Propulsion",
// "Repair", "Sensor" or "Weapon".
function camGetCompStats(compName, compType, player)
{
	if (camDef(player))
	{
		return Upgrades[player][compType][compName];
	}
	else
	{
		return Stats[compType][compName];
	}
}

// Returns the external name of a component from it's internal ID name.
// For example, `camGetCompNameFromId("Rocket-LtA-T", "Weapon")` returns "Lancer".
function camGetCompNameFromId(compId, compType)
{
	// FIXME: O(n) lookup here
	var compList = Stats[compType];
	for (var compName in compList)
	{
		if (compList[compName].Id === compId)
		{
			return compName;
		}
	}
	
}

// Simple wrapper for enumStruct. Allows the use of ALL_PLAYERS.
function camEnumStruct(player)
{
	if (player !== ALL_PLAYERS)
	{
		return enumStruct(player);
	}
	else
	{
		var structList = [];
		for (var i = 0; i <= CAM_MAX_PLAYERS; i++)
		{
			structList = structList.concat(enumStruct(i));
		}
		return structList;
	}
}

// Simple wrapper for enumDroid. Allows the use of ALL_PLAYERS.
function camEnumDroid(player)
{
	if (player !== ALL_PLAYERS)
	{
		return enumDroid(player);
	}
	else
	{
		var droidList = [];
		for (var i = 0; i <= CAM_MAX_PLAYERS; i++)
		{
			droidList = droidList.concat(enumDroid(i));
		}
		return droidList;
	}
}

// Returns true if the given area does not contain any enemies to given player
function camAreaSecure(area, player)
{
	return enumArea(area).filter(function(obj) {
		return obj.type !== FEATURE && !allianceExistsBetween(obj.player, player)
	}).length === 0;
}

//////////// privates

function __camGlobalContext()
{
	return Function('return this')(); // eslint-disable-line no-new-func
}

function __camFindClusters(list, size)
{
	// The good old cluster analysis algorithm taken from NullBot AI.
	var ret = { clusters: [], xav: [], yav: [], maxIdx: 0, maxCount: 0 };
	for (var i = list.length - 1; i >= 0; --i)
	{
		var x = list[i].x;
		var y = list[i].y;
		var found = false;
		var n = 0;
		for (var j = 0; j < ret.clusters.length; ++j)
		{
			if (camDist(ret.xav[j], ret.yav[j], x, y) < size)
			{
				n = ret.clusters[j].length;
				ret.clusters[j][n] = list[i];
				ret.xav[j] = Math.floor((n * ret.xav[j] + x) / (n + 1));
				ret.yav[j] = Math.floor((n * ret.yav[j] + y) / (n + 1));
				if (ret.clusters[j].length > ret.maxCount)
				{
					ret.maxIdx = j;
					ret.maxCount = ret.clusters[j].length;
				}
				found = true;
				break;
			}
		}
		if (!found)
		{
			n = ret.clusters.length;
			ret.clusters[n] = [list[i]];
			ret.xav[n] = x;
			ret.yav[n] = y;
			if (1 > ret.maxCount)
			{
				ret.maxIdx = n;
				ret.maxCount = 1;
			}
		}
	}
	return ret;
}

/* Called every second after eventStartLevel(). */
function __camTick()
{
	if (camDef(__camWinLossCallback))
	{
		__camGlobalContext()[__camWinLossCallback]();
	}
	__camBasesTick();
	__camDayCycleTick();
}

//Reset AI power back to highest storage possible.
function __camAiPowerReset()
{
	for (var i = 1; i < CAM_MAX_PLAYERS; ++i)
	{
		setPower(AI_POWER, i);
	}
}

function __camSetOffworldLimits()
{
	// These are the only structures that do not get
	// auto-disabled by the engine in off-world missions.
	setStructureLimits("A0CommandCentre", 0, CAM_HUMAN_PLAYER);
	setStructureLimits("A0ComDroidControl", 0, CAM_HUMAN_PLAYER);
}

function __camLogAttack(victim, attacker)
{
	if (camDef(victim) && victim !== null && camDef(attacker) && attacker !== null)
	{
		__camAttackLog.push({victim: victim, attacker: attacker, time: gameTime});
	}
}

function __clearAttackLog()
{
	var newLog = [];
	for (var i = __camAttackLog.length - 1; i >= 0; i--)
	{
		// Did this attack occure within the last 100 frames?
		if (__camAttackLog[i].time >= (gameTime - (100 * CAM_TICKS_PER_FRAME)))
		{
			newLog.push(__camAttackLog[i]);
		}
	}
	__camAttackLog = newLog;
}
