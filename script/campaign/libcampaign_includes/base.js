
////////////////////////////////////////////////////////////////////////////////
// Enemy base management.
////////////////////////////////////////////////////////////////////////////////

//;; ## camSetEnemyBases([bases])
//;;
//;; Tell `libcampaign.js` to manage a certain set of enemy bases.
//;; Management assumes auto-cleanup of leftovers on destruction, and also
//;; counting how many bases have been successfully destroyed by the player.
//;; The argument is a JavaScript map from group labels to base descriptions.
//;; Each label points to a group of vital base structures. If no group label
//;; with this name is defined, a group is created automatically
//;; based on `cleanup` area and labeled. Base description
//;; is a JavaScript object with the following optional fields:
//;; * `cleanup` An area label to clean up features in once base is destroyed.
//;;   If base id is not a group label, this field is required in order to auto-create
//;;   the group of stuff in the area which doesn't qualify as a valid leftover.
//;; * `detectMsg` A `PROX_MSG` message id to play when the base is detected.
//;; * `detectSnd` A sound file to play when the base is detected.
//;; * `eliminateSnd` A sound file to play when the base is eliminated.
//;;   The sound is played in the center of the cleanup area, which needs to be defined.
//;; * `player` If base is detected by cleanup area, only objects matching
//;;   this player filter would be added to the base group or cleaned up.
//;;   Note that this most likely disables feature cleanup.
//;;   Additionally, this function would call special event callbacks if they are defined in your script,
//;;   which should be named as follows, where LABEL is the label of the base group:
//;; * `camEnemyBaseDetected_LABEL` Called when the player sees an object from the enemy base group for the first time.
//;; * `camEnemyBaseEliminated_LABEL` Called when the base is eliminated, right after leftovers were cleaned up.
//;;
//;; @param {Object} [bases]
//;; @returns {void}
//;;
function camSetEnemyBases(bases)
{
	const __RELOAD = !camDef(bases);
	if (!__RELOAD)
	{
		__camEnemyBases = bases;
		__camNumEnemyBases = 0;
	}
	// convert label strings to groups and store
	for (const baseLabel in __camEnemyBases)
	{
		const bi = __camEnemyBases[baseLabel];
		const obj = getObject(baseLabel);
		if (camDef(obj) && obj) // group already defined
		{
			if (!camDef(bi.group))
			{
				bi.group = obj.id;
			}
			else
			{
				const structures = enumGroup(bi.group);
				addLabel({ type: GROUP, id: bi.group }, baseLabel);
				for (let idx = 0, len = structures.length; idx < len; ++idx)
				{
					const s = structures[idx];
					if (s.type !== STRUCTURE || __camIsValidLeftover(s))
					{
						continue;
					}
					if (!camDef(bi.player) || camPlayerMatchesFilter(s.player, bi.player))
					{
						//camTrace("Auto-adding", s.id, "to base", baseLabel);
						groupAdd(bi.group, s);
					}
				}
			}
			if (!camDef(bi.cleanup)) // auto-detect cleanup area
			{
				const objs = enumGroup(bi.group);
				if (objs.length > 0)
				{
					const __OFFSET = 2; // increases size of the auto-detected base area a bit
					const a = {
						type: AREA,
						x: mapWidth, y: mapHeight,
						x2: 0, y2: 0
					};
					// smallest rectangle to contain all objects
					for (let idx = 0, len = objs.length; idx < len; ++idx)
					{
						const o = objs[idx];
						if (o.x < a.x) a.x = o.x;
						if (o.y < a.y) a.y = o.y;
						if (o.x > a.x2) a.x2 = o.x;
						if (o.y > a.y2) a.y2 = o.y;
					}
					a.x -= __OFFSET; a.y -= __OFFSET; a.x2 += __OFFSET; a.y2 += __OFFSET;
					camTrace("Auto-detected cleanup area for", baseLabel, ":", a.x, a.y, a.x2, a.y2);
					bi.cleanup = "__cam_enemy_base_cleanup__" + baseLabel;
					addLabel(a, bi.cleanup);
				}
			}
		}
		else // define a group automatically
		{
			if (!camDef(bi.cleanup))
			{
				camDebug("Neither group nor cleanup area found for", baseLabel);
				continue;
			}
			bi.group = camNewGroup();
			addLabel({ type: GROUP, id: bi.group }, baseLabel);
			const structs = enumArea(bi.cleanup, ENEMIES, false);
			for (let idx = 0, len = structs.length; idx < len; ++idx)
			{
				const s = structs[idx];
				if (s.type !== STRUCTURE || __camIsValidLeftover(s))
				{
					continue;
				}
				if (!camDef(bi.player) || camPlayerMatchesFilter(s.player, bi.player))
				{
					//camTrace("Auto-adding", s.id, "to base", baseLabel);
					groupAdd(bi.group, s);
				}
			}
		}
		if (groupSize(bi.group) === 0)
		{
			// Base is empty, probably hasn't been built yet.
			camTrace("Base", baseLabel, "defined as empty group");
			bi.eliminated = true;
			bi.detected = true;
			bi.timesDestroyed = 0;
			++__camNumEnemyBases; // Consider it "destroyed"
		}
		else if (!__RELOAD)
		{
			bi.detected = false;
			bi.eliminated = false;
			bi.timesDestroyed = 0;
		}
		//camTrace("Resetting label", baseLabel);
		resetLabel(baseLabel, CAM_HUMAN_PLAYER); // subscribe for eventGroupSeen
	}
}

//;; ## camDetectEnemyBase(baseLabel)
//;;
//;; Plays the "enemy base detected" message and places a beacon for the enemy base
//;; defined by the label, as if the base was actually found by the player.
//;;
//;; @param {string} baseLabel
//;; @returns {void}
//;;
function camDetectEnemyBase(baseLabel)
{
	const bi = __camEnemyBases[baseLabel];
	if (bi.detected || bi.eliminated || (camDef(bi.friendly) && bi.friendly))
	{
		return;
	}
	camTrace("Enemy base", baseLabel, "detected");
	bi.detected = true;
	if (camDef(bi.detectSnd))
	{
		let pos = camMakePos(bi.cleanup);
		if (!camDef(pos)) // auto-detect sound position by group object pos
		{
			const objs = enumGroup(bi.group);
			if (objs.length > 0)
			{
				const firstObject = objs[0];
				pos = camMakePos(firstObject);
			}
		}
		if (camDef(pos))
		{
			playSound(bi.detectSnd, pos.x, pos.y, 0);
		}
	}
	if (camDef(bi.detectMsg))
	{
		hackAddMessage(bi.detectMsg, PROX_MSG, CAM_HUMAN_PLAYER, false);
	}
	const callback = __camGlobalContext()["camEnemyBaseDetected_" + baseLabel];
	if (camDef(callback))
	{
		callback();
	}
}

//;; ## camBaseChangeToFriendly(baseLabel)
//;;
//;; Changes the enemy base into a "friendly" one by removing
//;; the base beacon and silencing the detect and eliminate sounds
//;;
function camBaseChangeToFriendly(baseLabel)
{
	const bi = __camEnemyBases[baseLabel];
	if (camDef(bi.detectMsg) && bi.detected && !bi.eliminated && !bi.friendly) // remove the beacon
	{
		hackRemoveMessage(bi.detectMsg, PROX_MSG, CAM_HUMAN_PLAYER);
	}
	bi.friendly = true;
	++__camNumEnemyBases; // Consider this base "destroyed" for victory purposes
}

//;; ## camAllEnemyBasesEliminated()
//;;
//;; Returns `true` if all enemy bases managed by `libcampaign.js` are destroyed.
//;;
//;; @returns {boolean}
//;;
function camAllEnemyBasesEliminated()
{
	// FIXME: O(n) lookup here
	return __camNumEnemyBases === Object.keys(__camEnemyBases).length;
}

//;; ## camBaseIsEliminated(baseLabel)
//;;
//;; Returns true if the base with the given label has been eliminated.
//;;
//;; @returns {boolean}
//;;
function camBaseIsEliminated(baseLabel)
{
	return __camEnemyBases[baseLabel].eliminated;
}
//;; ## camBaseIsFriendly(baseLabel)
//;;
//;; Returns true if the base with the given label is considered "friendly".
//;;
//;; @returns {boolean}
//;;
function camBaseIsFriendly(baseLabel)
{
	return __camEnemyBases[baseLabel].friendly;
}
//;; ## camBaseDestroyedCount(baseLabel)
//;;
//;; Returns the number of times this base has been destroyed.
//;;
//;; @returns {number}
//;;
function camBaseDestroyedCount(baseLabel)
{
	return __camEnemyBases[baseLabel].timesDestroyed;
}


//////////// privates

function __camCheckBaseSeen(seen)
{
	let group = seen; // group?
	if (camDef(seen.group)) // object?
	{
		group = seen.group;
	}
	if (!camDef(group) || !group)
	{
		return;
	}
	// FIXME: O(n) lookup here
	for (const baseLabel in __camEnemyBases)
	{
		const bi = __camEnemyBases[baseLabel];
		if (bi.group !== group)
		{
			continue;
		}
		camDetectEnemyBase(baseLabel);
	}
}

function __camUpdateBaseGroups(struct)
{
	const structPos = camMakePos(struct);

	for (let baseLabel in __camEnemyBases)
	{
		const bi = __camEnemyBases[baseLabel];
		// Check that the new structure is a valid and in the base area
		if (!__camIsValidLeftover(struct) && camWithinArea(struct, bi.cleanup) 
			&& (!camDef(bi.player) || camPlayerMatchesFilter(struct.player, bi.player)))
		{
			groupAdd(bi.group, struct);
			camTrace("Adding new structure", struct.id, "to base", baseLabel);

			if (bi.eliminated) // Base being rebuilt?
			{
				if (!camDef(bi.friendly) || !bi.friendly)
				{
					// Enemy base being un-destroyed
					__camNumEnemyBases--;
				}
				bi.eliminated = false;
				bi.detected = false;
				camTrace("Base", baseLabel, "is being rebuilt");
				resetLabel(baseLabel, CAM_HUMAN_PLAYER); // subscribe for eventGroupSeen
			}

			return; // all done here
		}
	}
}

function __camIsValidLeftover(obj)
{
	if (camPlayerMatchesFilter(obj.player, ENEMIES))
	{
		if (obj.type === STRUCTURE && obj.stattype === WALL)
		{
			return true;
		}
	}
	if (obj.type === FEATURE)
	{
		if (obj.stattype === BUILDING)
		{
			return true;
		}
	}
	return false;
}

function __camShouldDestroyLeftover(objInfo, basePlayer)
{
	const object = getObject(objInfo.type, objInfo.player, objInfo.id);
	if (object === null)
	{
		return false;
	}
	return (objInfo.type === STRUCTURE &&
		object.status === BUILT &&
		__camIsValidLeftover(object) &&
		(!camDef(basePlayer) ||
		(camDef(basePlayer) && camPlayerMatchesFilter(objInfo.player, basePlayer))));
}

function __camCheckBaseEliminated(group)
{
	// FIXME: O(n) lookup here
	for (const baseLabel in __camEnemyBases)
	{
		const bi = __camEnemyBases[baseLabel];
		const leftovers = [];
		const __FRIENDLY = (camDef(bi.friendly) && bi.friendly)
		if (bi.eliminated || (bi.group !== group))
		{
			continue;
		}
		if (enumGroup(bi.group).length > 0)
		{
			return; //still has something in the base group
		}
		if (camDef(bi.cleanup))
		{
			const objects = enumArea(bi.cleanup, ENEMIES, false);
			for (let i = 0, len = objects.length; i < len; ++i)
			{
				const object = objects[i];
				const objInfo = {
					type: object.type,
					player: object.player,
					id: object.id
				};
				if (__camShouldDestroyLeftover(objInfo, bi.player))
				{
					leftovers.push(object);
				}
			}
			for (let i = 0, len = leftovers.length; i < len; ++i)
			{
				// remove with special effect
				const leftover = leftovers[i];
				camSafeRemoveObject(leftover, true);
			}
			if (camDef(bi.eliminateSnd) && !__FRIENDLY)
			{
				// play sound
				const pos = camMakePos(bi.cleanup);
				playSound(bi.eliminateSnd, pos.x, pos.y, 0);
			}
		}
		else
		{
			camDebug("All bases must have a cleanup area : " + baseLabel);
			continue;
		}
		if (camDef(bi.detectMsg) && bi.detected && !__FRIENDLY) // remove the beacon
		{
			hackRemoveMessage(bi.detectMsg, PROX_MSG, CAM_HUMAN_PLAYER);
		}
		camTrace("Enemy base", baseLabel, "eliminated");
		bi.eliminated = true;
		bi.timesDestroyed++;
		// bump counter before the callback, so that it was
		// actual during the callback
		if (!__FRIENDLY)
		{
			++__camNumEnemyBases;
		}
		const callback = __camGlobalContext()["camEnemyBaseEliminated_" + baseLabel];
		if (camDef(callback))
		{
			callback();
		}

		__camSetupConsoleForVictoryConditions();
	}
}

function __camBasesTick()
{
	for (const baseLabel in __camEnemyBases)
	{
		const bi = __camEnemyBases[baseLabel];
		if (bi.eliminated || !camDef(bi.reinforce_kind))
		{
			continue;
		}
		if (gameTime - bi.reinforce_last < bi.reinforce_interval)
		{
			continue;
		}
		if (!camDef(bi.player))
		{
			camDebug("Enemy base player needs to be set for", baseLabel);
			return;
		}
		if (!camDef(bi.cleanup))
		{
			camDebug("Enemy base cleanup area needs to be set for", baseLabel);
			return;
		}
		bi.reinforce_last = gameTime;
		const list = profile(bi.reinforce_callback);
		const pos = camMakePos(bi.cleanup);
		camSendReinforcement(bi.player, pos, list, bi.reinforce_kind, bi.reinforce_data);
	}
}
