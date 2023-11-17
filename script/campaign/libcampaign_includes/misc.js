
////////////////////////////////////////////////////////////////////////////////
// Misc useful stuff.
////////////////////////////////////////////////////////////////////////////////

//;; ## camDef(something)
//;;
//;; Returns `false` if something is JavaScript-undefined, `true` otherwise.
//;;
//;; @param {*} something
//;; @returns {boolean}
//;;
function camDef(something)
{
	return typeof something !== "undefined";
}

//;; ## camIsString(something)
//;;
//;; Returns `true` if something is a string, `false` otherwise.
//;;
//;; @param {*} something
//;; @returns {boolean}
//;;
function camIsString(something)
{
	return typeof something === "string";
}

//;; ## camRand(max)
//;;
//;; A non-synchronous random integer in range [0, max - 1].
//;;
//;; @param {number} max
//;; @returns {number}
//;;
function camRand(max)
{
	if (max > 0)
	{
		return Math.floor(Math.random() * max);
	}
	camDebug("Max should be positive");
}

//;; ## camCallOnce(functionName)
//;;
//;; Call a function by name, but only if it has not been called yet.
//;;
//;; @param {string} functionName
//;; @returns {void}
//;;
function camCallOnce(functionName)
{
	if (camDef(__camCalledOnce[functionName]) && __camCalledOnce[functionName])
	{
		return;
	}
	__camCalledOnce[functionName] = true;
	__camGlobalContext()[functionName]();
}

//;; ## camSafeRemoveObject(obj[, specialEffects])
//;;
//;; Remove a game object (by value or label) if it exists, do nothing otherwise.
//;;
//;; @param {string|Object} obj
//;; @param {boolean} [specialEffects]
//;; @returns {void}
//;;
function camSafeRemoveObject(obj, specialEffects)
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
		removeObject(obj, specialEffects);
	}
}

//;; ## camMakePos(label|object|x[, y])
//;;
//;; Make a `POSITION`-like object, unless already done.
//;; Often useful for making functions that would accept positions in both `x,y` and `{x: x, y: y}` forms.
//;; Also accepts labels. If label of `AREA` is given, returns the center of the area.
//;; If an existing object or label of such is given, returns a safe JavaScript object containing its `x`, `y` and `id`.
//;;
//;; @param {number|string|Object|undefined} x
//;; @param {number} [y]
//;; @returns {Object|undefined}
//;;
function camMakePos(x, y)
{
	if (camDef(y))
	{
		return { x: x, y: y };
	}
	if (!camDef(x))
	{
		return undefined;
	}
	let obj = x;
	if (camIsString(x))
	{
		obj = getObject(x);
	}
	if (!camDef(obj) || !obj)
	{
		camDebug("Failed at", x);
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
//;; A wrapper for `distBetweenTwoPoints()`.
//;;
//;; @param {number|Object} x1
//;; @param {number|Object} y1
//;; @param {number} [x2]
//;; @param {number} [y2]
//;; @returns {number}
//;;
function camDist(x1, y1, x2, y2)
{
	if (camDef(y2)) // standard
	{
		return distBetweenTwoPoints(x1, y1, x2, y2);
	}
	if (!camDef(x2)) // pos1, pos2
	{
		return distBetweenTwoPoints(x1.x, x1.y, y1.x, y1.y);
	}
	const pos2 = camMakePos(x2);
	if (camDef(pos2.x)) // x2 is pos2
	{
		return distBetweenTwoPoints(x1, y1, pos2.x, pos2.y);
	}
	else // pos1, x2, y2
	{
		return distBetweenTwoPoints(x1.x, x1.y, y1, x2);
	}
}

//;; ## camPlayerMatchesFilter(playerId, playerFilter)
//;;
//;; A function to handle player filters in a way similar to how JS API functions (eg. `enumDroid(filter, ...)`) handle them.
//;;
//;; @param {number} playerId
//;; @param {number} playerFilter
//;; @returns {boolean}
//;;
function camPlayerMatchesFilter(playerId, playerFilter)
{
	switch (playerFilter) {
		case ALL_PLAYERS:
			return true;
		case ALLIES:
			return playerId === CAM_HUMAN_PLAYER;
		case ENEMIES:
			return playerId >= 0 && playerId < __CAM_MAX_PLAYERS && playerId !== CAM_HUMAN_PLAYER;
		default:
			return playerId === playerFilter;
	}
}

//;; ## camRemoveDuplicates(items)
//;;
//;; Remove duplicate items from an array.
//;;
//;; @param {*[]} items
//;; @returns {*[]}
//;;
function camRemoveDuplicates(items)
{
	let prims = {"boolean":{}, "number":{}, "string":{}};
	const objs = [];

	return items.filter((item) => {
		const type = typeof item;
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

//;; ## camCountStructuresInArea(label[, playerFilter])
//;;
//;; Mimics wzscript's `numStructsButNotWallsInArea()`.
//;;
//;; @param {string} label
//;; @param {number} [playerFilter]
//;; @returns {number}
//;;
function camCountStructuresInArea(label, playerFilter)
{
	if (!camDef(playerFilter))
	{
		playerFilter = CAM_HUMAN_PLAYER;
	}
	const list = enumArea(label, playerFilter, false);
	let ret = 0;
	for (let i = 0, l = list.length; i < l; ++i)
	{
		const object = list[i];
		if (object.type === STRUCTURE && object.stattype !== WALL && object.status === BUILT)
		{
			++ret;
		}
	}
	return ret;
}

//;; ## camChangeOnDiff(numericValue[, inverse])
//;;
//;; Change a numeric value based on campaign difficulty.
//;;
//;; @param {number} numericValue
//;; @param {number} inverse
//;; @returns {number}
//;;
function camChangeOnDiff(numericValue, inverse)
{
	let modifier = 0;

	switch (difficulty)
	{
		case SUPEREASY:
			modifier = 2;
			break;
		case EASY:
			modifier = 1.5;
			break;
		case MEDIUM:
			modifier = 1;
			break;
		case HARD:
			modifier = 0.85;
			break;
		case INSANE:
			modifier = 0.70;
			break;
		default:
			modifier = 1;
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

	return Math.floor(numericValue * modifier);
}

//;; ## camIsSystemDroid(gameObject)
//;;
//;; Determine if the passed in object is a non-weapon based droid.
//;;
//;; @param {Object} gameObject
//;; @returns {boolean}
//;;
function camIsSystemDroid(gameObject)
{
	if (!camDef(gameObject) || !gameObject)
	{
		return false;
	}

	if (gameObject.type !== DROID)
	{
		camTrace("Non-droid: " + gameObject.type + " pl: " + gameObject.name);
		return false;
	}

	return (gameObject.droidType === DROID_SENSOR || gameObject.droidType === DROID_CONSTRUCT || gameObject.droidType === DROID_REPAIR);
}

//;; ## camMakeGroup(what[, playerFilter])
//;;
//;; Make a new group out of array of droids, single game object, or label string,
//;; with fuzzy auto-detection of argument type.
//;; Only droids would be added to the group. `playerFilter` can be one of a
//;; player index, `ALL_PLAYERS`, `ALLIES` or `ENEMIES`; defaults to `ENEMIES`.
//;;
//;; @param {string|Object|Object[]} what
//;; @param {number} [playerFilter]
//;; @returns {number|void}
//;;
function camMakeGroup(what, playerFilter)
{
	if (!camDef(playerFilter))
	{
		playerFilter = ENEMIES;
	}
	let array;
	let obj;
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
		switch (obj.type) {
			case POSITION:
				obj = getObject(obj.x, obj.y);
				// fall-through
			case DROID:
			case STRUCTURE:
			case FEATURE:
				array = [ obj ];
				break;
			case AREA:
				array = enumArea(obj.x, obj.y, obj.x2, obj.y2, ALL_PLAYERS, false);
				break;
			case RADIUS:
				array = enumRange(obj.x, obj.y, obj.radius, ALL_PLAYERS, false);
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
		const group = camNewGroup();
		for (let i = 0, l = array.length; i < l; ++i)
		{
			const o = array[i];
			if (!camDef(o) || !o)
			{
				camDebug("Trying to add", o);
				continue;
			}
			if (o.type === DROID && o.droidType !== DROID_CONSTRUCT && camPlayerMatchesFilter(o.player, playerFilter))
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
//;; @returns {void}
//;;
function camBreakAlliances()
{
	for (let i = 0; i < __CAM_MAX_PLAYERS; ++i)
	{
		for (let c = 0; c < __CAM_MAX_PLAYERS; ++c)
		{
			if (i !== c && allianceExistsBetween(i, c) === true)
			{
				setAlliance(i, c, false);
			}
		}
	}
}

//;; ## camGenerateRandomMapEdgeCoordinate(reachPosition)
//;;
//;; Returns a random coordinate anywhere on the edge of the map that reachs a position.
//;;
//;; @param {Object} reachPosition
//;; @returns {Object}
//;;
function camGenerateRandomMapEdgeCoordinate(reachPosition)
{
	const limits = getScrollLimits();
	let loc;

	do
	{
		const location = {x: 0, y: 0};
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

//;; ## camGenerateRandomMapCoordinate(reachPosition)
//;;
//;; Returns a random coordinate anywhere on the map
//;;
//;; @param {Object} reachPosition
//;; @returns {Object}
//;;
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

	const limits = getScrollLimits();
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
		(enumRange(pos.x, pos.y, scanObjectRadius, ALL_PLAYERS, false).length > 0));

	return pos;
}

//;; ## camDiscoverCampaign()
//;;
//;; Figures out what campaign we are in without reliance on the source at all.
//;;
//;; @returns {number}
//;;
function camDiscoverCampaign()
{
	for (let i = 0, len = __cam_alphaLevels.length; i < len; ++i)
	{
		if (__camNextLevel === __cam_alphaLevels[i] || __camNextLevel === __cam_betaLevels[0])
		{
			return __CAM_ALPHA_CAMPAIGN_NUMBER;
		}
	}
	for (let i = 0, len = __cam_betaLevels.length; i < len; ++i)
	{
		if (__camNextLevel === __cam_betaLevels[i] || __camNextLevel === __cam_gammaLevels[0])
		{
			return __CAM_BETA_CAMPAIGN_NUMBER;
		}
	}
	for (let i = 0, len = __cam_gammaLevels.length; i < len; ++i)
	{
		if (__camNextLevel === __cam_gammaLevels[i] || __camNextLevel === CAM_GAMMA_OUT)
		{
			return __CAM_GAMMA_CAMPAIGN_NUMBER;
		}
	}

	return __CAM_UNKNOWN_CAMPAIGN_NUMBER;
}

//;; Sets a droid's rank to the given value.
//;; ```droid``` must be a droid object, while ```rank```
//;; can be either an integer or name of a rank.
//;;
//;; @param {Object} droid
//;; @param {number | String} rank
//;; @returns {void}
//;;
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

	let xpAmount = 0;
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

//;; Returns a droid's rank as an integer.
//;; ```droid``` must be a droid object.
//;;
//;; @param {Object} droid
//;; @returns {number}
//;;
function camGetDroidRank(droid)
{
	if (!camDef(droid) || droid.type !== DROID)
	{
		camTrace("Tried getting an unkown object's rank.");
		return;
	}

	let xpAmount = droid.experience;
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

//;; Returns the amount of units a commander can handle base on rank.
//;; ```droid``` must be a commander droid.
//;;
//;; @param {Object} commander
//;; @returns {number|undefined}
//;;
function camGetCommanderMaxGroupSize(commander)
{
	if (!camDef(commander) || commander.type !== DROID || commander.droidType !== DROID_COMMAND)
	{
		camDebug("camGetCommanderMaxGroupSize must be given a commander droid object.");
		return;
	}

	return 6 + (2 * camGetDroidRank(commander));
}

//;; Returns the object responsible for the attacking of the given object.
//;; If no culprit is found, returns undefined. DEV NOTE: This function might get confused
//;; if the same object is attacked very rapidly by multiple different attackes (i.e. several assault guns),
//;; ```droid``` must be a commander droid.
//;;
//;; @param {Object} obj
//;; @returns {Object|undefined}
//;;
function camWhoAttacked(obj)
{
	for (let i = 0; i < __camAttackLog.length; i++)
	{
		if (__camAttackLog[i].victim.id === obj.id)
		{
			return __camAttackLog[i].attacker;
		}
	}
	return undefined;
}

//;; Returns true if the given position lies within the given area label
//;;
//;; @param {Object | string} pos
//;; @param {Object | string} area
//;; @returns {boolean}
//;;
function camWithinArea(pos, area)
{
	const p = camMakePos(pos);
	let a = area;
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

//;; Returns an array where all instances of item1 are replaced with item2
//;;
//;; @param {*[]} array
//;; @param {*} area
//;; @returns {*[]}
//;;
function camArrayReplaceWith(array, item1, item2)
{
	let index = array.indexOf(item1);
	while (index !== -1)
	{
		array[index] = item2;
		index = array.indexOf(item1);
	}
	return array;
}

//;; Returns stats about the given component from the global Stats data structure.
//;; If a player is provided, look up stats from their specified Upgrades structure,
//;; which contains stats that can be modified through research upgrades.
//;; For example, `camGetCompStats("Lancer", "Weapon", CAM_HUMAN_PLAYER)` can be used
//;; to get the current stats of the player's Lancer rockets.
//;; ```compType``` can be "Body", "Brain", "Building", "Construct", "ECM", "Propulsion",
//;; "Repair", "Sensor" or "Weapon".
//;;
//;; @param {string} compName
//;; @param {string} compType
//;; @param {number} playerId
//;; @returns {Object}
//;;
function camGetCompStats(compName, compType, playerId)
{
	if (camDef(playerId))
	{
		return Upgrades[playerId][compType][compName];
	}
	else
	{
		return Stats[compType][compName];
	}
}

//;; Returns the external name of a component from it's internal ID name.
//;; For example, `camGetCompNameFromId("Rocket-LtA-T", "Weapon")` returns "Lancer".
//;;
//;; @param {string} compId
//;; @param {string} compType
//;; @returns {string}
//;;
function camGetCompNameFromId(compId, compType)
{
	// FIXME: O(n) lookup here
	const compList = Stats[compType];
	for (let compName in compList)
	{
		if (compList[compName].Id === compId)
		{
			return compName;
		}
	}	
}

//;; Simple wrapper for enumStruct. Allows the use of ALL_PLAYERS.
//;;
//;; @param {number} playerId
//;; @returns {Object[]}
//;;
function camEnumStruct(playerId)
{
	if (playerId !== ALL_PLAYERS)
	{
		return enumStruct(playerId);
	}
	else
	{
		let structList = [];
		for (let i = 0; i <= __CAM_MAX_PLAYERS; i++)
		{
			structList = structList.concat(enumStruct(i));
		}
		return structList;
	}
}

//;; Simple wrapper for enumDroid. Allows the use of ALL_PLAYERS.
//;;
//;; @param {number} playerId
//;; @returns {Object[]}
//;;
function camEnumDroid(playerId)
{
	if (playerId !== ALL_PLAYERS)
	{
		return enumDroid(playerId);
	}
	else
	{
		let droidList = [];
		for (let i = 0; i <= __CAM_MAX_PLAYERS; i++)
		{
			droidList = droidList.concat(enumDroid(i));
		}
		return droidList;
	}
}

//;; Returns true if the given area does not contain any enemies to given player
//;;
//;; @param {Object} area
//;; @param {number} playerId
//;; @returns {boolean}
//;;
function camAreaSecure(area, playerId)
{
	return enumArea(area).filter(function(obj) {
		return obj.type !== FEATURE && !allianceExistsBetween(obj.player, playerId)
	}).length === 0;
}

function camSetExpLevel(number)
{
	__camExpLevel = number;
}

function camSetOnMapEnemyUnitExp()
{
	enumDroid(CAM_THE_RESISTANCE)
	.concat(enumDroid(CAM_AMPHOS))
	.concat(enumDroid(CAM_HELLRAISERS))
	.concat(enumDroid(CAM_THE_COALITION))
	.concat(enumDroid(CAM_ROYALISTS))
	.forEach(function(obj) {
		if (!allianceExistsBetween(CAM_HUMAN_PLAYER, obj.player) && //may have friendly units as other player
			!camIsTransporter(obj) &&
			obj.droidType !== DROID_CONSTRUCT &&
			obj.droidType !== DROID_REPAIR)
		{
			camSetDroidExperience(obj);
		}
	});
}

//;; Returns a nice name for the passed in template
//;; Takes in either a template object or a turret + body + propulsion
//;;
//;; @param {string | Object} weapon
//;; @param {string} body
//;; @param {string} propulsion
//;; @returns {string}
//;;
function camNameTemplate(weapon, body, propulsion)
{
	if (!camDef(body))
	{
		// Template passed in...
		propulsion = weapon.prop;
		body = weapon.body;
		weapon = weapon.weap;
	}

	let name;
	let weapName = camGetCompNameFromId(weapon, "Weapon");
	if (!camDef(weapName))
	{
		// Sensor unit?
		weapName = camGetCompNameFromId(weapon, "Sensor");
		if (!camDef(weapName))
		{
			// Truck??
			weapName = camGetCompNameFromId(weapon, "Construct");
			if (!camDef(weapName))
			{
				// Repair Turret???
				weapName = camGetCompNameFromId(weapon, "Repair");
				if (!camDef(weapName))
				{
					// Commander????
					weapName = camGetCompNameFromId(weapon, "Brain");
				}
			}
		}
	}
	if (body === "CyborgLightBody" || body === "CyborgHeavyBody")
	{
		// Just use the weapon name for cyborgs
		name = weapName;
	}
	else
	{
		const __BODY_NAME = camGetCompNameFromId(body, "Body");
		const __PROP_NAME = camGetCompNameFromId(propulsion, "Propulsion");
		name = [ weapName, __BODY_NAME, __PROP_NAME ].join(" ");
	}
	return name;
}

//////////// privates

function __camGlobalContext()
{
	return Function('return this')(); // eslint-disable-line no-new-func
}

function __camFindClusters(list, size)
{
	// The good old cluster analysis algorithm taken from NullBot AI.
	const ret = { clusters: [], xav: [], yav: [], maxIdx: 0, maxCount: 0 };
	for (let i = list.length - 1; i >= 0; --i)
	{
		const __X = list[i].x;
		const __Y = list[i].y;
		let found = false;
		let n = 0;
		for (let j = 0; j < ret.clusters.length; ++j)
		{
			if (camDist(ret.xav[j], ret.yav[j], __X, __Y) < size)
			{
				n = ret.clusters[j].length;
				ret.clusters[j][n] = list[i];
				ret.xav[j] = Math.floor((n * ret.xav[j] + __X) / (n + 1));
				ret.yav[j] = Math.floor((n * ret.yav[j] + __Y) / (n + 1));
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
			ret.xav[n] = __X;
			ret.yav[n] = __Y;
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
	for (let i = 1; i < __CAM_MAX_PLAYERS; ++i)
	{
		setPower(__CAM_AI_POWER, i);
	}
}

function __camGetExpRangeLevel()
{
	const ranks = {
		rookie: 0,
		green: 4,
		trained: 8,
		regular: 16,
		professional: 32,
		veteran: 64,
		elite: 128,
		special: 256,
		hero: 512,
	}; //see brain.json
	let exp = [];

	switch (__camExpLevel)
	{
		case 0: // fall-through
		case 1:
			exp = [ranks.rookie, ranks.rookie];
			break;
		case 2:
			exp = [ranks.green, ranks.trained, ranks.regular];
			break;
		case 3:
			exp = [ranks.trained, ranks.regular, ranks.professional];
			break;
		case 4:
			exp = [ranks.regular, ranks.professional, ranks.veteran];
			break;
		case 5:
			exp = [ranks.professional, ranks.veteran, ranks.elite];
			break;
		case 6:
			exp = [ranks.veteran, ranks.elite, ranks.special];
			break;
		case 7:
			exp = [ranks.elite, ranks.special, ranks.hero];
			break;
		case 8:
			exp = [ranks.special, ranks.hero];
			break;
		case 9:
			exp = [ranks.hero, ranks.hero];
			break;
		default:
			__camExpLevel = 0;
			exp = [ranks.rookie, ranks.rookie];
	}

	return exp;
}

function camSetDroidExperience(droid)
{
	if (droid.droidType === DROID_REPAIR || droid.droidType === DROID_CONSTRUCT || camIsTransporter(droid))
	{
		return;
	}
	if (droid.player === CAM_HUMAN_PLAYER)
	{
		return;
	}

	const expRange = __camGetExpRangeLevel();
	let exp = expRange[camRand(expRange.length)];

	if (droid.droidType === DROID_COMMAND || droid.droidType === DROID_SENSOR)
	{
		exp = exp * 2;
	}

	setDroidExperience(droid, exp);
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
	const newLog = [];
	for (let i = __camAttackLog.length - 1; i >= 0; i--)
	{
		// Did this attack occure within the last 100 frames?
		if (__camAttackLog[i].time >= (gameTime - (100 * __CAM_TICKS_PER_FRAME)))
		{
			newLog.push(__camAttackLog[i]);
		}
	}
	__camAttackLog = newLog;
}
