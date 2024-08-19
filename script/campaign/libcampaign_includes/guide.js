
////////////////////////////////////////////////////////////////////////////////
// Guide topics management.
////////////////////////////////////////////////////////////////////////////////

function camAddAllianceTopics()
{
	let showFlags = (difficulty < HARD) ? 0 : SHOWTOPIC_FIRSTADD;
	addGuideTopic("wz2100::factions::alliances", showFlags);
}

function camAddEradicationTopics()
{
	let showFlags = (difficulty < HARD) ? 0 : SHOWTOPIC_FIRSTADD;
	addGuideTopic("wz2100::factions::eradicating", showFlags);
}

function camAddResistanceTopics()
{
	let showFlags = (difficulty < HARD) ? 0 : SHOWTOPIC_FIRSTADD;
	addGuideTopic("wz2100::factions::resistance", showFlags);
}

function camAddAmphosTopics()
{
	let showFlags = (difficulty < HARD) ? 0 : SHOWTOPIC_FIRSTADD;
	addGuideTopic("wz2100::factions::amphos", showFlags);
}

function camAddHellraiserTopics()
{
	let showFlags = (difficulty < HARD) ? 0 : SHOWTOPIC_FIRSTADD;
	addGuideTopic("wz2100::factions::hellraisers", showFlags);
}

function camAddCoalitionTopics()
{
	let showFlags = (difficulty < HARD) ? 0 : SHOWTOPIC_FIRSTADD;
	addGuideTopic("wz2100::factions::coalition", showFlags);
}

function camAddRoyalistTopics()
{
	let showFlags = (difficulty < HARD) ? 0 : SHOWTOPIC_FIRSTADD;
	addGuideTopic("wz2100::factions::royalists", showFlags);
}

function __camDoAddVTOLUseTopicsImpl()
{
	let showFlags = (difficulty < HARD) ? 0 : SHOWTOPIC_FIRSTADD;
	addGuideTopic("wz2100::units::propulsions::vtols::defending");
	addGuideTopic("wz2100::units::propulsions::vtols::attacking", showFlags);
}

function __camDoAddCommanderUseTopicsImpl()
{
	let showFlags = (difficulty < HARD) ? 0 : SHOWTOPIC_FIRSTADD;
	addGuideTopic("wz2100::units::commanders::targeting");
	addGuideTopic("wz2100::units::commanders::detaching");
	addGuideTopic("wz2100::units::commanders::repairs");
	addGuideTopic("wz2100::units::commanders::attaching", showFlags);
}

function __camDoAddVTOLUseTopics()
{
	queue("__camDoAddVTOLUseTopicsImpl", camSecondsToMilliseconds(1));
}

function __camDoAddCommanderUseTopics()
{
	queue("__camDoAddCommanderUseTopicsImpl", camSecondsToMilliseconds(1));
}

function __camGuideTopicCheckResearchComplete(targetResearchName, justResearchedObj = null)
{
	if (justResearchedObj && justResearchedObj.name == targetResearchName)
	{
		return true;
	}
	else if (justResearchedObj == null)
	{
		const res = getResearch(targetResearchName);
		if (res && res.done)
		{
			return true;
		}
	}
	return false;
}

function __camProcessResearchGatedGuideTopics(research = null)
{
	// NOTE: Don't distrupt the game with guide topics if we're playing on Hard or above.
	// We can assume the player already knows this stuff and doesn't need to be directly shown it again.
	// (And if the player forgets something, they can always just open up the guide again.)
	let showFlags = (research == null || difficulty < HARD) ? 0 : SHOWTOPIC_FIRSTADD;

	// First AA weapon researched
	if (__camGuideTopicCheckResearchComplete("R-Wpn-AAGun03", research))
	{
		addGuideTopic("wz2100::units::weapons::antiair", showFlags);
	}

	// First (and only) Bunker Buster weapon researched
	if (__camGuideTopicCheckResearchComplete("R-Wpn-Rocket03-HvAT", research))
	{
		addGuideTopic("wz2100::units::weapons::bunkerbuster", showFlags);
	}

	// First Module researched
	if (__camGuideTopicCheckResearchComplete("R-Struc-Factory-Module", research))
	{
		addGuideTopic("wz2100::structures::modules", showFlags);
	}

	// Command Turret researched
	if (__camGuideTopicCheckResearchComplete("R-Comp-CommandTurret01", research))
	{
		addGuideTopic("wz2100::units::commanders", showFlags);
	}

	// Repair Facility researched
	if (__camGuideTopicCheckResearchComplete("R-Struc-RepairFacility", research))
	{
		addGuideTopic("wz2100::structures::repairfacility", showFlags);
	}

	// VTOL Factory researched
	if (__camGuideTopicCheckResearchComplete("R-Struc-VTOLFactory", research))
	{
		addGuideTopic("wz2100::structures::vtolfactory", showFlags);
	}

	// VTOL Propulsion researched
	if (__camGuideTopicCheckResearchComplete("R-Vehicle-Prop-VTOL", research))
	{
		addGuideTopic("wz2100::units::propulsions::vtols::weapons");
		addGuideTopic("wz2100::units::propulsions::vtols::using", showFlags);
	}

	// CB Turret researched
	if (__camGuideTopicCheckResearchComplete("R-Sys-CBSensor-Turret01", research))
	{
		addGuideTopic("wz2100::units::sensors::cb", showFlags);
	}

	// Tracked Propulsion researched
	if (__camGuideTopicCheckResearchComplete("R-Vehicle-Prop-Tracks", research))
	{
		addGuideTopic("wz2100::units::propulsions::tracks", showFlags);
	}

	// Hover Propulsion researched
	if (__camGuideTopicCheckResearchComplete("R-Vehicle-Prop-Hover", research))
	{
		addGuideTopic("wz2100::units::propulsions::hover", showFlags);
	}

	// First (explosive) bomb researched
	if (__camGuideTopicCheckResearchComplete("R-Wpn-Bomb01", research))
	{
		addGuideTopic("wz2100::units::weapons::bombs::explosive", showFlags);
	}

	// First incendiary bomb researched
	if (__camGuideTopicCheckResearchComplete("R-Wpn-Bomb03", research))
	{
		addGuideTopic("wz2100::units::weapons::bombs::incendiary", showFlags);
	}
}

function __camEnableGuideTopics()
{
	// Always enable general topics & unit orders
	// NOTE: We can't add "wz2100::general::**" here because that includes the vanilla Backstory and Mission Timer entries that don't apply to this campaign!
	addGuideTopic("wz2100::general::artifacts");
	addGuideTopic("wz2100::general::commandpanel");
	addGuideTopic("wz2100::general::intelmap");
	addGuideTopic("wz2100::general::power");
	addGuideTopic("wz2100::general::researching");
	addGuideTopic("wz2100::unitorders::**");

	// Basic base / structure topics
	addGuideTopic("wz2100::structures::building");
	addGuideTopic("wz2100::structures::demolishing");

	// Basic structure topics
	addGuideTopic("wz2100::structures::hq");
	addGuideTopic("wz2100::structures::researchfacility");
	addGuideTopic("wz2100::structures::oilderrick");
	addGuideTopic("wz2100::structures::powergenerator");
	addGuideTopic("wz2100::structures::rallypoint");
	addGuideTopic("wz2100::structures::factory");
	addGuideTopic("wz2100::structures::cyborgfactory");

	// Basic units topics
	addGuideTopic("wz2100::units::building");
	addGuideTopic("wz2100::units::designing");
	addGuideTopic("wz2100::units::experience");

	// Weapon/propulsion topics (the player always has these components)
	addGuideTopic("wz2100::units::repairing");
	addGuideTopic("wz2100::units::weapons::antipersonnel");
	addGuideTopic("wz2100::units::weapons::flamer");
	addGuideTopic("wz2100::units::weapons::allrounder");
	addGuideTopic("wz2100::units::weapons::artillery");
	addGuideTopic("wz2100::units::weapons::antitank");
	addGuideTopic("wz2100::units::sensors");
	addGuideTopic("wz2100::units::sensors::unassigning");
	addGuideTopic("wz2100::units::sensors::using");
	addGuideTopic("wz2100::units::propulsions::cyborg");
	addGuideTopic("wz2100::units::propulsions::wheels");
	addGuideTopic("wz2100::units::propulsions::halftracks");
	addGuideTopic("wz2100::units::thermaldamage");

	// Handle research-driven topics (for things already researched - i.e. on savegame load or starting a later campaign)
	__camProcessResearchGatedGuideTopics();

	// Handle built-unit triggered topics
	if (countDroid(DROID_COMMAND, CAM_HUMAN_PLAYER) > 0)
	{
		addGuideTopic("wz2100::units::commanders::**");
	}
	let foundDroids_VTOL = false;
	const droids = enumDroid(CAM_HUMAN_PLAYER);
	for (let x = 0; x < droids.length; ++x)
	{
		const droid = droids[x];
		if (droid.isVTOL)
		{
			foundDroids_VTOL = true;
			break; // if checking for anything else in the future, remove this
		}
	}
	if (foundDroids_VTOL)
	{
		addGuideTopic("wz2100::units::propulsions::vtols::**");
	}
}

function __camEnableGuideTopicsForTransport(transport)
{
	const droids = enumCargo(transport);
	for (let i = 0, len = droids.length; i < len; ++i)
	{
		const droid = droids[i];
		if (droid.droidType === DROID_COMMAND)
		{
			addGuideTopic("wz2100::units::commanders::**");
		}
	}
}
