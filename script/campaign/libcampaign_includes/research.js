
////////////////////////////////////////////////////////////////////////////////
// Research related functions.
////////////////////////////////////////////////////////////////////////////////

//;; ## camCompleteRes(what, player)
//;;
//;; Completes research from the given list to player
//;; Can also be given a single research name
//;;
function camCompleteRes(what, player)
{
	if (camIsString(what)) // is a single research item
	{
		enableResearch(what, player);
		completeResearch(what, player);
	}
	else
	{
		for (var i = 0, l = what.length; i < l; ++i)
		{
			var research = what[i];
			enableResearch(research, player);
			completeResearch(research, player);
		}
	}
	
}

//;; ## camCompleteRequiredResearch(items, player)
//;;
//;; Grants research from the given list to player and also researches
//;; the required research for that item.
//;;
function camCompleteRequiredResearch(items, player)
{
	dump("\n*Player " + player + " requesting accelerated research.");

	for (var i = 0, l = items.length; i < l; ++i)
	{
		var research = items[i];
		dump("Searching for required research of item: " + research);
		var reqRes = findResearch(research, player).reverse();

		if (reqRes.length === 0)
		{
			//HACK: autorepair like upgrades don't work after mission transition.
			if (research === "R-Sys-NEXUSrepair")
			{
				completeResearch(research, player, true);
			}
			continue;
		}

		reqRes = camRemoveDuplicates(reqRes);
		for (var s = 0, r = reqRes.length; s < r; ++s)
		{
			var researchReq = reqRes[s].name;
			dump("	Found: " + researchReq);
			enableResearch(researchReq, player);
			completeResearch(researchReq, player);
		}
	}
}

// Returns true if the given research has been completed by the player
function camIsResearched(resName)
{
	for (var i = 0; i < __camResearchLog.length; i++)
	{
		if (__camResearchLog[i] === resName)
		{
			return true;
		}
	}
	return false; // Didn't find it.
}

function camGetResearchLog()
{
	return __camResearchLog;
}

//////////// privates

//granted shortly after mission start to give enemy players instant droid production.
function __camGrantSpecialResearch()
{
	for (var i = 1; i < CAM_MAX_PLAYERS; ++i)
	{
		if (!allianceExistsBetween(CAM_HUMAN_PLAYER, i) && (countDroid(DROID_ANY, i) > 0 || enumStruct(i).length > 0))
		{
			//Boost AI production to produce all droids within a factory throttle
			completeResearch("R-Struc-Factory-Upgrade-AI", i);
		}
	}
}

// Keep track of what the player has researched.
// If an item from __camHiddenResearch has its requirements met,
// add it to the player's research menu
function __camUpdateResearchLog(research)
{
	__camResearchLog.push(research.name);

	// Check the hidden research list
	for (var i = __camHiddenResearch.length - 1; i >= 0; i--)
	{
		if (camIsResearched(__camHiddenResearch[i].req))
		{
			// Enable the hidden research and remove it from the list
			enableResearch(__camHiddenResearch[i].tech, CAM_HUMAN_PLAYER);
			__camHiddenResearch.splice(i, 1);
		}
	}
}
