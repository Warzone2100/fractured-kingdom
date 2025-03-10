const MIS_VTOL_TOWER_GROUP_SIZE = Math.max(difficulty, 1); // At least 1 VTOL
const MIS_ROYALIST_GARRISON_SIZE = difficulty + 1;

// Structures to unlock for the player
const mis_playerStructs = [
		"A0CommandCentre", "A0PowerGenerator", "A0ResourceExtractor",
		"A0ResearchFacility", "A0LightFactory", "A0CyborgFactory",
		// Also some starting defensive structures
		"Flamer-Emplacement", "Cannon-Emplacement", "GuardTowerMRP",
		"Sarissa-Tower",
];

// Player starting research
const mis_playerRes = [
	"R-Wpn-MG1Mk1", "R-Vehicle-Body01", "R-Sys-Spade1Mk1",
	"R-Vehicle-Prop-Wheels", "R-Comp-SynapticLink", "R-Cyborg-Wpn-MG",
	"R-Cyb-Sys-Construct", "R-Vehicle-Prop-Halftracks","R-Wpn-Cannon1Mk1",
	"R-Wpn-Flamer01Mk1", "R-Wpn-Rocket05-MiniPod", "R-Cyborg-Wpn-Cannon",
	"R-Sys-MobileRepairTurret01", "R-Cyb-Sys-Repair", "R-Sys-Sensor-Turret01",
	"R-Sys-Sensor-Tower01", "R-Defense-TankTrap01", "R-Cyborg-Wpn-Flamer",
	"R-Wpn-Mortar01Lt", "R-Cyb-Wpn-Grenade", "R-Wpn-Rocket-LtA-TMk1",
	"R-Wpn-MG-Damage01", // The player starts with the first MG upgrade
];

// AMPHOS starting research
const mis_amphosRes = [
	"R-Sys-Engineering02", "R-Wpn-Rocket-ROF02", "R-Wpn-Rocket-Damage03",
	"R-Wpn-Rocket-Accuracy03", "R-Wpn-MG-Damage03", "R-Wpn-MG-ROF01",
	"R-Vehicle-Metals03", "R-Wpn-Flamer-Damage02", "R-Wpn-Flamer-ROF01",
	"R-Vehicle-Engine03", "R-Defense-WallUpgrade02", "R-Struc-Materials02",
	"R-Wpn-AAGun-Damage01", "R-Wpn-AAGun-ROF01", "R-Struc-VTOLPad-Upgrade01",
];

// Hellraiser starting research
const mis_hellraiserRes = [
	"R-Sys-Engineering01", "R-Wpn-Flamer-Damage03", "R-Wpn-Flamer-ROF02",
	"R-Wpn-MG-Damage02", "R-Wpn-AAGun-Damage01", "R-Wpn-Mortar-Damage01",
	"R-Vehicle-Metals02", "R-Cyborg-Metals02", "R-Vehicle-Engine02",
	"R-Defense-WallUpgrade02", "R-Struc-Materials02", "R-Wpn-Cannon-Damage01",
	"R-Wpn-Rocket-ROF01", "R-Wpn-Rocket-Damage02", "R-Wpn-Rocket-Accuracy01",
	"R-Struc-RprFac-Upgrade01",
];

// Coalition starting research
const mis_coalitionStartRes = [
	"R-Sys-Engineering02", "R-Wpn-Rocket-ROF02", "R-Wpn-Rocket-Accuracy03",
	"R-Wpn-MG-ROF02", "R-Wpn-Flamer-ROF02", "R-Defense-WallUpgrade03",
	"R-Struc-Materials03", "R-Wpn-AAGun-ROF02", "R-Wpn-Cannon-ROF02",
	"R-Wpn-Cannon-Accuracy02", "R-Wpn-Mortar-ROF01", "R-Vehicle-Engine04",
	"R-Struc-RprFac-Upgrade01", "R-Struc-VTOLPad-Upgrade01",
];

// Coalition research granted after the map expands
const mis_coalitionExpansionRes = [
	"R-Wpn-Rocket-Damage03", "R-Wpn-MG-Damage04", "R-Vehicle-Metals04",
	"R-Cyborg-Metals04", "R-Wpn-Flamer-Damage04", "R-Wpn-AAGun-Damage01",
	"R-Wpn-Cannon-Damage03", "R-Wpn-Mortar-Damage03", "R-Cyborg-Armor-Heat01",
	"R-Vehicle-Armor-Heat01",
];

// Royalist research given at the start of the game
const mis_royalistStartRes = [
	"R-Sys-Engineering02", "R-Wpn-Rocket-ROF02", "R-Wpn-Rocket-Damage02",
	"R-Wpn-Rocket-Accuracy02", "R-Wpn-MG-Damage02", "R-Wpn-MG-ROF02",
	"R-Vehicle-Metals03", "R-Cyborg-Metals03", "R-Wpn-Flamer-Damage03",
	"R-Wpn-Flamer-ROF02", "R-Defense-WallUpgrade02", "R-Struc-Materials02",
	"R-Wpn-AAGun-Damage01", "R-Wpn-AAGun-ROF01", "R-Wpn-Cannon-Damage02",
	"R-Wpn-Mortar-Damage01", "R-Wpn-Cannon-ROF01", "R-Wpn-Cannon-Accuracy01",
	"R-Wpn-Mortar-ROF01", "R-Cyborg-Armor-Heat01", "R-Vehicle-Armor-Heat01",
	"R-Vehicle-Engine03", "R-Struc-RprFac-Upgrade01", "R-Comp-CommandTurret01"
];

// Royalist research granted over time starting from phase 2
// Note that every iteration of an upgrade must be present, since "required" tech will not be granted
// e.g. rocket damage upgrades 04 and 05 must be here, not just 05.
const mis_royalistProgressiveRes1 = [
	"R-Wpn-Rocket-Damage03", "R-Wpn-Rocket-Damage04", "R-Wpn-Rocket-Accuracy02",
	"R-Wpn-Rocket-Accuracy03", "R-Wpn-MG-Damage03", "R-Wpn-MG-Damage04",
	"R-Vehicle-Metals04", "R-Cyborg-Metals04", "R-Cyborg-Metals05",
	"R-Wpn-Flamer-Damage04", "R-Wpn-Flamer-ROF03", "R-Defense-WallUpgrade04",
	"R-Struc-Materials04", "R-Wpn-Cannon-Damage03", "R-Wpn-Cannon-Damage04",
	"R-Wpn-Mortar-Damage02", "R-Wpn-Cannon-ROF02", "R-Wpn-Cannon-ROF03",
	"R-Wpn-Cannon-Accuracy01", "R-Wpn-Cannon-Accuracy02", "R-Wpn-Mortar-ROF02",
	"R-Wpn-Mortar-ROF03", "R-Cyborg-Armor-Heat02", "R-Vehicle-Armor-Heat02",
	"R-Vehicle-Engine04", "R-Vehicle-Engine05", "R-Vehicle-Engine06",
	"R-Struc-VTOLPad-Upgrade02", "R-Wpn-Howitzer-Accuracy01", "R-Wpn-Howitzer-ROF01",
	"R-Wpn-MG-ROF03", "R-Wpn-Rocket-ROF03", "R-Defense-WallUpgrade03",
	"R-Struc-Materials03", "R-Struc-RprFac-Upgrade02",
];

// Royalist research granted over time starting from phase 3
const mis_royalistProgressiveRes2 = [
	"R-Wpn-Rocket-Accuracy04", "R-Wpn-MG-Damage05", "R-Vehicle-Metals05",
	"R-Vehicle-Metals06","R-Cyborg-Metals06", "R-Wpn-Flamer-Damage05",
	"R-Wpn-Flamer-Damage06", "R-Defense-WallUpgrade05", "R-Defense-WallUpgrade06",
	"R-Struc-Materials05","R-Struc-Materials06", "R-Cyborg-Armor-Heat03",
	"R-Vehicle-Armor-Heat03","R-Struc-RprFac-Upgrade03", "R-Wpn-Rocket-Damage05",
	"R-Wpn-Rocket-Damage06","R-Wpn-Mortar-Damage03", "R-Wpn-Mortar-Damage04",
	"R-Wpn-Cannon-Damage05", "R-Wpn-Cannon-Damage06", "R-Wpn-Howitzer-Damage01",
	"R-Struc-VTOLPad-Upgrade02",
];

// Additional technologies granted to the Royalists over time on Hard or above starting from phase 3
const mis_royalistProgressiveHardRes = [
	"R-Sys-Engineering03", "R-Wpn-MG-Damage06", "R-Wpn-Rocket-Damage07",
	"R-Wpn-Cannon-Damage07", "R-Wpn-Cannon-ROF04", "R-Wpn-Mortar-ROF04",
	"R-Wpn-Howitzer-Damage02", "R-Wpn-Bomb-Damage01", "R-Struc-VTOLPad-Upgrade03",
	"R-Wpn-AAGun-Damage03", "R-Wpn-Howitzer-ROF02",
];

// Royalist research granted over time after the player gets VTOLs
const mis_royalistProgressiveAARes = [
	"R-Wpn-AAGun-Damage02", "R-Wpn-AAGun-ROF02", "R-Wpn-AAGun-ROF03",
	"R-Wpn-AAGun-Accuracy01", "R-Wpn-AAGun-Accuracy02",
];

// All of the bases (built and unbuilt) on the map
const mis_baseData = {
	"resistanceMainBase": {
		cleanup: "resistanceBase",
		player: CAM_THE_RESISTANCE,
		detectMsg: "RESIS_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"portBase": {
		cleanup: "portFOB",
		player: CAM_AMPHOS,
		detectMsg: "PORT_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"southIslandBase": {
		cleanup: "southIslandFOB",
		player: CAM_AMPHOS,
		detectMsg: "SISLAND_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"westIslandBase": {
		cleanup: "westIslandFOB",
		player: CAM_AMPHOS,
		detectMsg: "WISLAND_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"nwIslandBase": {
		cleanup: "nwIslandFOB",
		player: CAM_ROYALISTS,
		detectMsg: "NWISLAND_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"northIslandBase": {
		cleanup: "northIslandFOB",
		player: CAM_AMPHOS,
		detectMsg: "NISLAND_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"amphosMainBase": {
		cleanup: "amphosBase",
		player: CAM_AMPHOS,
		detectMsg: "AMPHOS_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"hellraiserMainBase": {
		cleanup: "hellraiserBase",
		player: CAM_HELLRAISERS,
		detectMsg: "HELLRAISER_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"coalitionBridgeBase": {
		cleanup: "coalitionBridgeFOB",
		player: CAM_THE_COALITION,
		detectMsg: "COBRIDGE_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"seCoalitionBase": {
		cleanup: "seCoalitionFOB",
		player: CAM_THE_COALITION,
		detectMsg: "SECO_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"riverDeltaBase": {
		cleanup: "riverDeltaFOB",
		player: CAM_THE_COALITION,
		detectMsg: "RIVDELT_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"sunkenPlainsBase": {
		cleanup: "sunkenPlainsFOB",
		player: CAM_THE_COALITION,
		detectMsg: "SPLAINS_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"neCoalitionBase": {
		cleanup: "neCoalitionFOB",
		player: CAM_THE_COALITION,
		detectMsg: "NECO_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"coalitionMainBase": {
		cleanup: "coalitionBase",
		player: CAM_THE_COALITION,
		detectMsg: "COALITION_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"southBase": {
		cleanup: "southFOB",
		player: CAM_ROYALISTS,
		detectMsg: "SOUTH_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"spyBase": {
		cleanup: "spyLZ",
		player: CAM_ROYALISTS,
		detectMsg: "SPY_BASE",
		detectSnd: "pcv382.ogg",
		eliminateSnd: "pcv665.ogg"
	},
	"riverTownBase": {
		cleanup: "riverTownFOB",
		player: CAM_ROYALISTS,
		detectMsg: "RIVTOWN_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"riverLZBase": {
		cleanup: "riverLZ",
		player: CAM_ROYALISTS,
		detectMsg: "RIVLZ_BASE",
		detectSnd: "pcv382.ogg",
		eliminateSnd: "pcv665.ogg"
	},
	"eastCoastBase": {
		cleanup: "eastCoastFOB",
		player: CAM_ROYALISTS,
		detectMsg: "COAST_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"southGate": {
		cleanup: "southGateBase",
		player: CAM_ROYALISTS,
		detectMsg: "SOUTHGATE_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"royalistCentralFactoryZone": {
		cleanup: "royalistCentralFactoryBase",
		player: CAM_ROYALISTS,
		detectMsg: "FACTORY_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"westGate": {
		cleanup: "westGateBase",
		player: CAM_ROYALISTS,
		detectMsg: "WESTGATE_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"royalistMountainCheckpoint": {
		cleanup: "royalistCheckpoint",
		player: CAM_ROYALISTS,
		detectMsg: "CHECK_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"royalistHowitzerFOB": {
		cleanup: "royalistHowitzerBase",
		player: CAM_ROYALISTS,
		detectMsg: "HOWIT_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"southRoyalWhirlwindHill": {
		cleanup: "southWhirlwindHill",
		player: CAM_ROYALISTS,
		detectMsg: "WHIRL_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"royalistVtolBase": {
		cleanup: "vtolBase",
		player: CAM_ROYALISTS,
		detectMsg: "VTOL_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"royalistMainBaseGate": {
		cleanup: "royalistMainBaseDefenses",
		player: CAM_ROYALISTS,
		detectMsg: "MAINDEF_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"royalMainBase": {
		cleanup: "royalistMainBase",
		player: CAM_ROYALISTS,
		detectMsg: "MAIN_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"royalistOuterGate": {
		cleanup: "royalistOuterBase",
		player: CAM_ROYALISTS,
		detectMsg: "OUTER_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"northLakeBase": {
		cleanup: "northLakeFOB",
		player: CAM_ROYALISTS,
		detectMsg: "NORTHLAKE_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"mountainLZBase": {
		cleanup: "mountainLZ",
		player: CAM_ROYALISTS,
		detectMsg: "MLZ_BASE",
		detectSnd: "pcv382.ogg",
		eliminateSnd: "pcv665.ogg"
	},
	// These bases start off unbuilt
	"royCoalitionRepBase": {
		cleanup: "coalitionBase",
		player: CAM_ROYALISTS,
		detectMsg: "COALITION_REPBASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"royPlainsRepBase": {
		cleanup: "sunkenPlainsFOB",
		player: CAM_ROYALISTS,
		detectMsg: "SPLAINS_REPBASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"royDeltaRepBase": {
		cleanup: "riverDeltaFOB",
		player: CAM_ROYALISTS,
		detectMsg: "RIVDELT_REPBASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"royBridgeRepBase": {
		cleanup: "coalitionBridgeFOB",
		player: CAM_ROYALISTS,
		detectMsg: "COBRIDGE_REPBASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"roySWIsleRepBase": {
		cleanup: "southIslandFOB",
		player: CAM_ROYALISTS,
		detectMsg: "SISLAND_REPBASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"royPortRepBase": {
		cleanup: "portFOB",
		player: CAM_ROYALISTS,
		detectMsg: "PORT_REPBASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"royAmphosRepBase": {
		cleanup: "amphosBase",
		player: CAM_ROYALISTS,
		detectMsg: "AMPHOS_REPBASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"royHellraiserRepBase": {
		cleanup: "hellraiserBase",
		player: CAM_ROYALISTS,
		detectMsg: "HELLRAISER_REPBASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"ampNWIsleRepBase": {
		cleanup: "nwIslandFOB",
		player: CAM_AMPHOS,
		detectMsg: "NWISLAND_REPBASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"ampSouthGateLZ": {
		cleanup: "coastLZ",
		player: CAM_AMPHOS,
		detectMsg: "SOUTHGATE_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"hellraiserCentralRepairBase": {
		cleanup: "royalistCentralFactoryBase",
		player: CAM_HELLRAISERS,
		detectMsg: "FACTORY_REPBASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"coaWestGateLZ": {
		cleanup: "westGateLZ",
		player: CAM_THE_COALITION,
		detectMsg: "WESTGATE_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"resistanceSubBase": {
		cleanup: "resSubBase",
		player: CAM_THE_RESISTANCE,
		detectMsg: "SUB_BASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
	"resistanceRiverRepairBase": {
		cleanup: "riverTownFOB",
		player: CAM_THE_RESISTANCE,
		detectMsg: "RIVTOWN_REPBASE",
		detectSnd: "pcv379.ogg",
		eliminateSnd: "pcv394.ogg"
	},
};

// Sets of structures that trucks use to build/rebuild bases
var structSets = {
	// AMPHOS Structures
	amphosBunkerIsleStructs: [
		{stat: "PillBox6", x: 202, y: 132}, {stat: "PillBox1", x: 191, y: 142}, {stat: "PillBox6", x: 198, y: 143},
		{stat: "PillBox1", x: 188, y: 154}, {stat: "PillBox6", x: 198, y: 159}, {stat: "PillBox1", x: 204, y: 156},
		{stat: "PillBox1", x: 190, y: 161}, {stat: "Emplacement-MRL-pit", x: 190, y: 163}, {stat: "PillBox1", x: 205, y: 169},
		{stat: "PillBox1", x: 189, y: 164}, {stat: "PillBox1", x: 203, y: 167}, {stat: "Emplacement-MRL-pit", x: 204, y: 168},
		{stat: "PillBox1", x: 207, y: 148}, {stat: "PillBox6", x: 195, y: 151}
	],
	// Hellraiser Structures
	hellraiserStructs: [
		{stat: "AASite-QuadMg1", x: 61, y: 153, rot: 1}, {stat: "A0CyborgFactory", x: 22, y: 135, rot: 3}, {stat: "PillBox2", x: 90, y: 151},
		{stat: "PillBox4", x: 93, y: 152, rot: 2}, {stat: "A0TankTrap", x: 67, y: 154}, {stat: "GuardTower1", x: 34, y: 128, rot: 3},
		{stat: "Cannon-Emplacement", x: 53, y: 174}, {stat: "A0TankTrap", x: 66, y: 153}, {stat: "A0TankTrap", x: 65, y: 154},
		{stat: "A0ResourceExtractor", x: 66, y: 154}, {stat: "Flamer-Emplacement", x: 40, y: 156, rot: 1}, {stat: "Flamer-Emplacement", x: 38, y: 161, rot: 1},
		{stat: "A0TankTrap", x: 66, y: 155}, {stat: "A0TankTrap", x: 50, y: 167}, {stat: "A0TankTrap", x: 49, y: 167},
		{stat: "Tower-Projector", x: 28, y: 141, rot: 1}, {stat: "GuardTower1", x: 13, y: 142}, {stat: "GuardTower2", x: 48, y: 169, rot: 2},
		{stat: "PillBox5", x: 57, y: 147}, {stat: "PillBox2", x: 60, y: 144}, {stat: "PillBox4", x: 16, y: 162, rot: 2},
		{stat: "A0RepairCentre3", x: 19, y: 139}, {stat: "PillBox1", x: 17, y: 118}, {stat: "Flamer-Emplacement", x: 49, y: 173, rot: 1},
		{stat: "GuardTower2", x: 44, y: 167, rot: 3}, {stat: "GuardTower2", x: 49, y: 155},
		{stat: "GuardTower2", x: 55, y: 147, rot: 2}, {stat: "Cannon-Emplacement", x: 55, y: 167, rot: 2}, {stat: "PillBox4", x: 96, y: 160, rot: 3},
		{stat: "PillBox2", x: 12, y: 163}, {stat: "PillBox2", x: 19, y: 160}, {stat: "Flamer-Emplacement", x: 61, y: 161, rot: 3},
		{stat: "PillBox5", x: 50, y: 160}, {stat: "GuardTower2", x: 53, y: 168, rot: 2}, {stat: "GuardTower2", x: 67, y: 157},
		{stat: "GuardTower2", x: 86, y: 152, rot: 2}, {stat: "GuardTower2", x: 71, y: 147, rot: 1}, {stat: "GuardTower2", x: 33, y: 157, rot: 3},
		{stat: "GuardTower2", x: 33, y: 160, rot: 3}, {stat: "Emplacement-MortarPit-Incendiary", x: 35, y: 158}, {stat: "Sys-SensoTower01", x: 38, y: 158},
		{stat: "Flamer-Emplacement", x: 60, y: 155, rot: 2}, {stat: "Flamer-Emplacement", x: 73, y: 151, rot: 1}, {stat: "GuardTower2", x: 54, y: 151},
		{stat: "Flamer-Emplacement", x: 84, y: 149}, {stat: "PillBox5", x: 65, y: 145, rot: 1},
		{stat: "Emplacement-MortarPit-Incendiary", x: 56, y: 149}, {stat: "Sys-SensoTower01", x: 54, y: 148}, {stat: "Sys-SensoTower01", x: 72, y: 149},
		{stat: "Emplacement-MortarPit-Incendiary", x: 87, y: 154}, {stat: "Emplacement-MortarPit-Incendiary", x: 84, y: 154}, {stat: "Sys-SensoTower01", x: 89, y: 153},
		{stat: "Emplacement-MortarPit-Incendiary", x: 69, y: 145}, {stat: "PillBox4", x: 70, y: 139, rot: 2}, {stat: "PillBox2", x: 74, y: 139},
		{stat: "PillBox2", x: 66, y: 138}, {stat: "PillBox5", x: 89, y: 158}, {stat: "PillBox4", x: 28, y: 135, rot: 1},
		{stat: "Sys-SensoTower01", x: 68, y: 140}, {stat: "Flamer-Emplacement", x: 76, y: 148}, {stat: "Flamer-Emplacement", x: 91, y: 162, rot: 3},
		{stat: "PillBox4", x: 26, y: 146}, {stat: "A0CyborgFactory", x: 12, y: 143, rot: 2},
		{stat: "A0LightFactory", x: 10, y: 134, rot: 1, mods: 2}, {stat: "A0ResearchFacility", x: 16, y: 136, mods: 0}, {stat: "A0ResearchFacility", x: 9, y: 144, mods: 0},
		{stat: "PillBox1", x: 7, y: 139}, {stat: "GuardTower1", x: 26, y: 123, rot: 1}, {stat: "Sys-SensoTower01", x: 54, y: 178},
		{stat: "WallTower02", x: 12, y: 121, rot: 2}, {stat: "A0HardcreteMk1Wall", x: 11, y: 121}, {stat: "A0TankTrap", x: 27, y: 123},
		{stat: "AASite-QuadMg1", x: 27, y: 137, rot: 1}, {stat: "Tower-Projector", x: 40, y: 132, rot: 1}, {stat: "PillBox4", x: 28, y: 120},
		{stat: "A0PowerGenerator", x: 17, y: 139, mods: 0}, {stat: "A0PowerGenerator", x: 17, y: 142, mods: 0}, {stat: "Tower-Projector", x: 32, y: 137},
		{stat: "A0TankTrap", x: 33, y: 129}, {stat: "Emplacement-MortarPit-Incendiary", x: 18, y: 121}, {stat: "A0TankTrap", x: 38, y: 139},
		{stat: "GuardTower1", x: 27, y: 140, rot: 1}, {stat: "WallTower02", x: 11, y: 130, rot: 2}, {stat: "AASite-QuadMg1", x: 10, y: 131},
		{stat: "PillBox1", x: 10, y: 129}, {stat: "PillBox4", x: 44, y: 132}, {stat: "AASite-QuadMg1", x: 35, y: 130, rot: 2},
		{stat: "PillBox4", x: 19, y: 124}, {stat: "Flamer-Emplacement", x: 49, y: 177}, {stat: "AASite-QuadMg1", x: 3, y: 126, rot: 2},
		{stat: "Sys-SensoTower02", x: 16, y: 120}, {stat: "Tower-Projector", x: 15, y: 122}, {stat: "AASite-QuadMg1", x: 30, y: 117, rot: 2},
		{stat: "Emplacement-MortarPit-Incendiary", x: 28, y: 118}, {stat: "Tower-Projector", x: 42, y: 140}, {stat: "PillBox1", x: 37, y: 136},
		{stat: "AASite-QuadMg1", x: 22, y: 144, rot: 3}, {stat: "AASite-QuadMg1", x: 22, y: 133}, {stat: "AASite-QuadMg1", x: 18, y: 131},
		{stat: "A0TankTrap", x: 38, y: 138}, {stat: "Tower-Projector", x: 29, y: 133, rot: 1}, {stat: "PillBox1", x: 11, y: 139},
		{stat: "Emplacement-MortarPit-Incendiary", x: 23, y: 143}, {stat: "A0TankTrap", x: 27, y: 124}, {stat: "WallTower02", x: 36, y: 139, rot: 1},
		{stat: "A0CommandCentre", x: 13, y: 140}, {stat: "Emplacement-MortarPit-Incendiary", x: 10, y: 146}, {stat: "Sys-SensoTower02", x: 17, y: 130},
		{stat: "Tower-Projector", x: 13, y: 136}, {stat: "Emplacement-MortarPit-Incendiary", x: 10, y: 141}, {stat: "Tower-Projector", x: 50, y: 147},
		{stat: "Emplacement-MortarPit-Incendiary", x: 25, y: 133}, {stat: "Emplacement-MortarPit-Incendiary", x: 26, y: 135}, {stat: "Tower-Projector", x: 12, y: 120, rot: 2},
		{stat: "Tower-Projector", x: 28, y: 122, rot: 1}, {stat: "AASite-QuadMg1", x: 26, y: 129, rot: 2}, {stat: "A0TankTrap", x: 33, y: 128},
		{stat: "Emplacement-MortarPit-Incendiary", x: 37, y: 133}, {stat: "Emplacement-MortarPit-Incendiary", x: 45, y: 130}, {stat: "Tower-Projector", x: 16, y: 132},
		{stat: "Tower-Projector", x: 12, y: 132}, {stat: "Tower-Projector", x: 12, y: 128, rot: 2}, {stat: "Tower-Projector", x: 16, y: 128, rot: 2},
		{stat: "PillBox1", x: 31, y: 126}, {stat: "AASite-QuadMg1", x: 44, y: 125, rot: 2}, {stat: "AASite-QuadMg1", x: 38, y: 124, rot: 2},
		{stat: "AASite-QuadMg1", x: 32, y: 119, rot: 1}, {stat: "WallTower02", x: 35, y: 126}, {stat: "AASite-QuadMg1", x: 35, y: 121, rot: 2},
		{stat: "WallTower02", x: 31, y: 122}, {stat: "Sys-SensoTower02", x: 35, y: 122}, {stat: "Sys-SensoTower02", x: 9, y: 149},
		{stat: "A0HardcreteMk1Wall", x: 19, y: 146}, {stat: "WallTower02", x: 20, y: 146}, {stat: "WallTower02", x: 18, y: 146},
		{stat: "Sys-SensoTower02", x: 34, y: 138}, {stat: "PillBox1", x: 11, y: 148}, {stat: "Tower-Projector", x: 16, y: 145},
		{stat: "Tower-Projector", x: 13, y: 146}, {stat: "A0ResourceExtractor", x: 28, y: 144}, {stat: "A0ResourceExtractor", x: 19, y: 134},
		{stat: "A0ResourceExtractor", x: 22, y: 128}, {stat: "AASite-QuadMg1", x: 47, y: 129, rot: 1}, {stat: "PillBox5", x: 32, y: 162},
		{stat: "WallTower02", x: 24, y: 116, rot: 2}, {stat: "A0HardcreteMk1Wall", x: 25, y: 116}, {stat: "WallTower02", x: 26, y: 116, rot: 2},
		{stat: "Tower-Projector", x: 20, y: 118, rot: 2}, {stat: "PillBox4", x: 39, y: 134, rot: 1}, {stat: "Emplacement-MortarPit-Incendiary", x: 35, y: 135},
		{stat: "A0TankTrap", x: 39, y: 126}, {stat: "A0TankTrap", x: 39, y: 125}, {stat: "GuardTower1", x: 38, y: 125, rot: 1},
		{stat: "PillBox1", x: 42, y: 128}
	],
	// Royalist Structures
	royalistSouthStructs: [
		{stat: "CO-HMGBunker", x: 102, y: 171}, {stat: "CO-HMGBunker", x: 102, y: 173}, {stat: "CO-WallTower-RotCan", x: 104, y: 170},
		{stat: "CollectiveWall", x: 104, y: 171}, {stat: "CO-Tower-MG3", x: 106, y: 170},
		{stat: "A0HardcreteMk1Gate", x: 104, y: 172}, {stat: "CollectiveWall", x: 104, y: 173}, {stat: "CollectiveWall", x: 104, y: 174},
		{stat: "CollectiveWall", x: 104, y: 175}, {stat: "Sys-CO-SensoTower", x: 106, y: 175}, {stat: "A0ResourceExtractor", x: 107, y: 174},
		{stat: "A0CyborgFactory", x: 108, y: 170}, {stat: "CO-WallTower-QuadRotAAGun", x: 110, y: 170}, {stat: "CollectiveWall", x: 110, y: 171},
		{stat: "CollectiveWall", x: 111, y: 170}, {stat: "A0HardcreteMk1Gate", x: 110, y: 172}, {stat: "CollectiveWall", x: 110, y: 173},
		{stat: "CO-HMGBunker", x: 111, y: 173}, {stat: "CO-WallTower-RotCan", x: 110, y: 174}, {stat: "CO-WallTower-RotCan", x: 104, y: 176},
		{stat: "CO-WallTower-RotCan", x: 112, y: 170}, {stat: "CO-HMGBunker", x: 113, y: 171}
	],
	// Royalist Extra Structures
	royalistCoalitionBaseRepStructs: [ // Royalist replacement for the Coalition's main base
		{stat: "A0CyborgFactory", x: 6, y: 46, rot: 1}, {stat: "CO-WallTower-QuadRotAAGun", x: 9, y: 41},
		{stat: "CollectiveWall", x: 9, y: 42}, {stat: "CO-WallTower-QuadRotAAGun", x: 9, y: 43}, {stat: "CO-Emp-RotMor", x: 10, y: 46},
		{stat: "A0ResourceExtractor", x: 14, y: 41}, {stat: "CO-WallTower-RotCan", x: 15, y: 41}, {stat: "A0HardcreteMk1Gate", x: 15, y: 42},
		{stat: "CollectiveWall", x: 15, y: 43}, {stat: "CO-ROTMGBunker", x: 12, y: 45}, {stat: "Sys-CO-SensoTower", x: 12, y: 46},
		{stat: "CO-ROTMGBunker", x: 13, y: 46}, {stat: "CollectiveWall", x: 14, y: 44}, {stat: "CO-WallTower-RotCan", x: 15, y: 44},
		{stat: "A0LightFactory", x: 5, y: 49, rot: 1, mods: 2}, {stat: "Sys-COCB-Tower01", x: 9, y: 49}, {stat: "CO-Emp-RotMor", x: 12, y: 48},
		{stat: "CO-WallTower-HvCan", x: 15, y: 48}, {stat: "Emplacement-Howitzer105", x: 15, y: 50}, {stat: "CO-WallTower-QuadRotAAGun", x: 13, y: 54},
		{stat: "CollectiveWall", x: 13, y: 55}, {stat: "CollectiveWall", x: 14, y: 54}, {stat: "CO-WallTower-HvCan", x: 15, y: 54},
		{stat: "A0PowerGenerator", x: 11, y: 56, mods: 1}, {stat: "A0ResearchFacility", x: 9, y: 60, mods: 1}, {stat: "CO-WallTower-HvCan", x: 11, y: 63},
		{stat: "CO-WallTower-HvCan", x: 13, y: 56}, {stat: "A0HardcreteMk1Gate", x: 13, y: 57}, {stat: "A0HardcreteMk1Gate", x: 13, y: 58},
		{stat: "CO-WallTower-HvCan", x: 13, y: 59}, {stat: "WallTower-Projector", x: 15, y: 56}, {stat: "CO-ROTMGBunker", x: 14, y: 59},
		{stat: "CollectiveWall", x: 13, y: 60}, {stat: "CO-WallTower-RotCan", x: 13, y: 61}, {stat: "Sys-COCB-Tower01", x: 12, y: 62},
		{stat: "A0TankTrap", x: 17, y: 45}, {stat: "A0TankTrap", x: 17, y: 46}, {stat: "CO-Emp-RotMor", x: 8, y: 66},
		{stat: "A0RepairCentre3", x: 20, y: 45}, {stat: "Emplacement-Rocket06-IDF", x: 13, y: 51}, {stat: "CO-WallTower-HvCan", x: 12, y: 68},
		{stat: "CollectiveWall", x: 16, y: 48}, {stat: "CO-WallTower-HvCan", x: 17, y: 48}, {stat: "Emplacement-Rocket06-IDF", x: 17, y: 51},
		{stat: "CO-Tower-LtATRkt", x: 19, y: 49}, {stat: "A0HardcreteMk1Gate", x: 16, y: 54}, {stat: "A0HardcreteMk1Gate", x: 17, y: 54},
		{stat: "CO-WallTower-HvCan", x: 18, y: 54}, {stat: "CO-ROTMGBunker", x: 18, y: 55}, {stat: "CO-WallTower-HvCan", x: 20, y: 50},
		{stat: "CollectiveWall", x: 20, y: 51}, {stat: "CO-WallTower-HvCan", x: 20, y: 52}, {stat: "A0ResourceExtractor", x: 9, y: 64},
		{stat: "CollectiveWall", x: 11, y: 64}, {stat: "CO-WallTower-HvCan", x: 11, y: 65}, {stat: "CO-Emp-RotMor", x: 10, y: 66},
		{stat: "CO-WallTower-HvCan", x: 9, y: 68}, {stat: "CO-ROTMGBunker", x: 9, y: 69}, {stat: "A0HardcreteMk1Gate", x: 10, y: 68},
		{stat: "CollectiveWall", x: 11, y: 68}, {stat: "WallTower-Projector", x: 13, y: 65}, {stat: "Sys-CO-VTOL-RadarTower01", x: 12, y: 67},
		{stat: "AASite-QuadRotMg", x: 9, y: 62},
	],
	royalistPlainsRepStructs: [ // Royalist replacement for the Coalition's sunken plains base
		{stat: "CO-WallTower-HvCan", x: 45, y: 59, rot: 3}, {stat: "CO-WallTower-RotCan", x: 47, y: 58, rot: 2}, {stat: "A0HardcreteMk1Gate", x: 45, y: 60, rot: 3},
		{stat: "A0HardcreteMk1Gate", x: 45, y: 61, rot: 3}, {stat: "CO-WallTower-HvCan", x: 45, y: 62, rot: 3}, {stat: "CO-Tower-LtATRkt", x: 46, y: 63, rot: 3},
		{stat: "CollectiveWall", x: 48, y: 58, rot: 2}, {stat: "CO-WallTower-QuadRotAAGun", x: 49, y: 58, rot: 2}, {stat: "CollectiveWall", x: 50, y: 58, rot: 2},
		{stat: "CO-WallTower-RotCan", x: 51, y: 58, rot: 2}, {stat: "CO-Emp-RotMor", x: 48, y: 60}, {stat: "WallTower-Projector", x: 49, y: 63},
		{stat: "Sys-CO-VTOL-RadarTower01", x: 50, y: 61}, {stat: "AASite-QuadRotMg", x: 51, y: 62}, {stat: "Sys-CO-SensoTower", x: 52, y: 60},
		{stat: "Sys-COCB-Tower01", x: 53, y: 63}, {stat: "CO-ROTMGBunker", x: 54, y: 60}, {stat: "CO-ROTMGBunker", x: 55, y: 62},
		{stat: "CO-Tower-HvATRkt", x: 56, y: 63, rot: 2}, {stat: "CollectiveWall", x: 57, y: 63, rot: 2}, {stat: "CollectiveWall", x: 58, y: 63, rot: 2},
		{stat: "CO-Tower-HvATRkt", x: 59, y: 63, rot: 2}, {stat: "CO-Tower-HVCan", x: 47, y: 66, rot: 3}, {stat: "CollectiveWall", x: 47, y: 67, rot: 3},
		{stat: "CO-WallTower-HvCan", x: 47, y: 68}, {stat: "A0ResourceExtractor", x: 49, y: 66}, {stat: "CO-Tower-LtATRkt", x: 50, y: 67},
		{stat: "A0HardcreteMk1Gate", x: 48, y: 68}, {stat: "CO-ROTMGBunker", x: 48, y: 69}, {stat: "CO-Tower-HVCan", x: 49, y: 68},
		{stat: "CO-WallTower-RotCan", x: 52, y: 66}, {stat: "CollectiveWall", x: 53, y: 66}, {stat: "CO-Emp-RotMor", x: 54, y: 64},
		{stat: "CO-WallTower-QuadRotAAGun", x: 54, y: 66}, {stat: "CollectiveWall", x: 55, y: 66}, {stat: "CO-WallTower-RotCan", x: 56, y: 66},
		{stat: "CO-WallTower-HvCan", x: 57, y: 67}, {stat: "CollectiveWall", x: 58, y: 67}, {stat: "A0HardcreteMk1Gate", x: 59, y: 67},
		{stat: "CO-Tower-LtATRkt", x: 61, y: 64, rot: 1}, {stat: "A0HardcreteMk1Gate", x: 60, y: 67}, {stat: "CO-WallTower-HvCan", x: 61, y: 67},
		{stat: "CO-ROTMGBunker", x: 62, y: 66}
	],
	royalistDeltaRepStructs: [ // Royalist replacement for the Coalition's river delta base
		{stat: "CO-WallTower-RotCan", x: 62, y: 102, rot: 3}, {stat: "CollectiveWall", x: 62, y: 103, rot: 3}, {stat: "CO-WallTower-QuadRotAAGun", x: 62, y: 104, rot: 3},
		{stat: "CollectiveWall", x: 62, y: 105, rot: 3}, {stat: "CO-WallTower-RotCan", x: 62, y: 106, rot: 3}, {stat: "Sys-CO-SensoTower", x: 62, y: 108},
		{stat: "CO-Tower-HVCan", x: 62, y: 113, rot: 3}, {stat: "CollectiveWall", x: 62, y: 114, rot: 3}, {stat: "CO-Tower-HVCan", x: 62, y: 115, rot: 3},
		{stat: "CO-Tower-RotMG", x: 63, y: 116}, {stat: "CO-WallTower-RotCan", x: 66, y: 103, rot: 1}, {stat: "CollectiveWall", x: 66, y: 104, rot: 1},
		{stat: "CollectiveWall", x: 66, y: 105, rot: 1}, {stat: "CO-WallTower-RotCan", x: 66, y: 106, rot: 1}, {stat: "WallTower-Projector", x: 65, y: 108, rot: 2},
		{stat: "AASite-QuadRotMg", x: 64, y: 110, rot: 2}, {stat: "CO-Tower-HVCan", x: 67, y: 109, rot: 1}, {stat: "CollectiveWall", x: 67, y: 110, rot: 1},
		{stat: "CO-Tower-HVCan", x: 67, y: 111, rot: 1}, {stat: "CO-Emp-RotMor", x: 64, y: 114}, {stat: "A0ResourceExtractor", x: 66, y: 113},
		{stat: "Sys-COCB-Tower01", x: 66, y: 115}, {stat: "CO-Tower-HvATRkt", x: 64, y: 117}, {stat: "CollectiveWall", x: 65, y: 117},
		{stat: "CO-WallTower-QuadRotAAGun", x: 66, y: 117}, {stat: "CollectiveWall", x: 67, y: 117}, {stat: "CO-Tower-RotMG", x: 68, y: 112, rot: 1},
		{stat: "CO-Emp-RotMor", x: 68, y: 115}, {stat: "Sys-CO-SensoTower", x: 70, y: 115}, {stat: "CO-Tower-HvATRkt", x: 68, y: 117}
	],
	royalistBridgeRepStructs: [ // Royalist replacement for the Coalition's south bridge base
		{stat: "CO-WallTower-RotCan", x: 7, y: 97, rot: 2}, {stat: "A0PowerGenerator", x: 7, y: 101, mods: 1}, {stat: "CO-WallTower-QuadRotAAGun", x: 5, y: 107},
		{stat: "CO-Emp-RotMor", x: 6, y: 105}, {stat: "CollectiveWall", x: 6, y: 107}, {stat: "CollectiveWall", x: 7, y: 107},
		{stat: "CollectiveWall", x: 8, y: 97, rot: 2}, {stat: "CO-WallTower-RotCan", x: 9, y: 97, rot: 2}, {stat: "CollectiveWall", x: 10, y: 97, rot: 2},
		{stat: "CO-Tower-HvATRkt", x: 11, y: 97, rot: 1}, {stat: "A0HardcreteMk1Gate", x: 11, y: 98, rot: 1}, {stat: "A0HardcreteMk1Gate", x: 11, y: 99, rot: 1},
		{stat: "WallTower-Projector", x: 8, y: 100, rot: 1}, {stat: "CO-Emp-RotMor", x: 9, y: 102}, {stat: "CollectiveWall", x: 11, y: 100, rot: 1},
		{stat: "CO-WallTower-RotCan", x: 11, y: 101, rot: 1}, {stat: "CollectiveWall", x: 11, y: 102, rot: 1}, {stat: "CO-WallTower-RotCan", x: 11, y: 103, rot: 1},
		{stat: "CO-WallTower-QuadRotAAGun", x: 8, y: 107}, {stat: "Sys-CO-SensoTower", x: 9, y: 106}, {stat: "CO-Tower-LtATRkt", x: 10, y: 105},
		{stat: "CO-Tower-RotMG", x: 12, y: 105}, {stat: "CO-Tower-RotMG", x: 16, y: 105}
	],
	royalistSWIsleRepStructs: [ // Royalist replacement for the AMPHOS south west island base
		{stat: "CO-ROTMGBunker", x: 198, y: 188}, {stat: "CO-ROTMGBunker", x: 192, y: 188}, {stat: "Sys-COCB-Tower01", x: 200, y: 185},
		{stat: "CO-Tower-HvATRkt", x: 198, y: 183}, {stat: "CO-Tower-LtATRkt", x: 189, y: 186}, {stat: "CollectiveWall", x: 192, y: 176},
		{stat: "CollectiveWall", x: 199, y: 183}, {stat: "CollectiveWall", x: 200, y: 183}, {stat: "CO-Tower-HVCan", x: 201, y: 183, rot: 1},
		{stat: "CollectiveWall", x: 201, y: 182, rot: 1}, {stat: "CO-Tower-HVCan", x: 201, y: 181, rot: 1}, {stat: "A0PowerGenerator", x: 199, y: 182, mods: 1},
		{stat: "AASite-QuadRotMg", x: 199, y: 178, rot: 1}, {stat: "CO-ROTMGBunker", x: 193, y: 182}, {stat: "AASite-QuadRotMg", x: 192, y: 184},
		{stat: "CO-Tower-LtATRkt", x: 195, y: 177, rot: 1}, {stat: "CO-Tower-HVCan", x: 194, y: 176, rot: 2}, {stat: "CollectiveWall", x: 193, y: 176},
		{stat: "CO-Tower-HVCan", x: 191, y: 176, rot: 2}, {stat: "CO-Tower-LtATRkt", x: 188, y: 175, rot: 2}, {stat: "CO-Tower-LtATRkt", x: 183, y: 181, rot: 3},
		{stat: "CO-ROTMGBunker", x: 184, y: 179}, {stat: "CO-Tower-HVCan", x: 181, y: 180, rot: 3}, {stat: "CO-Tower-HVCan", x: 181, y: 176, rot: 3},
		{stat: "Sys-CO-VTOL-RadarTower01", x: 188, y: 179}, {stat: "Sys-CO-VTOL-CB-Tower01", x: 190, y: 180}, {stat: "Sys-CO-SensoTower", x: 188, y: 181},
		{stat: "CollectiveWall", x: 181, y: 179, rot: 1}, {stat: "CO-Tower-HvATRkt", x: 181, y: 178, rot: 3}, {stat: "CollectiveWall", x: 181, y: 177, rot: 1},
		{stat: "CO-WallTower-QuadRotAAGun", x: 180, y: 174, rot: 3}, {stat: "CollectiveWall", x: 180, y: 173, rot: 1}, {stat: "CO-WallTower-QuadRotAAGun", x: 180, y: 172, rot: 3},
		{stat: "CO-Tower-RotMG", x: 181, y: 170, rot: 3}, {stat: "CO-Tower-LtATRkt", x: 182, y: 169, rot: 2}, {stat: "CO-ROTMGBunker", x: 186, y: 172},
		{stat: "A0ResourceExtractor", x: 185, y: 174}
	],
	royalistPortRepStructs: [ // Royalist replacement for the AMPHOS port base
		{stat: "CO-Tower-HVCan", x: 132, y: 179, rot: 3}, {stat: "CollectiveWall", x: 132, y: 180, rot: 3}, {stat: "A0HardcreteMk1Gate", x: 132, y: 181, rot: 3},
		{stat: "CollectiveWall", x: 132, y: 182, rot: 3}, {stat: "CO-Tower-HvATRkt", x: 132, y: 183, rot: 3}, {stat: "CollectiveWall", x: 132, y: 184, rot: 3},
		{stat: "A0HardcreteMk1Gate", x: 132, y: 185, rot: 3}, {stat: "CollectiveWall", x: 132, y: 186, rot: 3}, {stat: "CO-Tower-HVCan", x: 132, y: 187, rot: 3},
		{stat: "CO-ROTMGBunker", x: 130, y: 182}, {stat: "CO-ROTMGBunker", x: 130, y: 184}, {stat: "Sys-CO-SensoTower", x: 133, y: 184},
		{stat: "CO-Emp-RotMor", x: 135, y: 182}, {stat: "CO-Emp-RotMor", x: 135, y: 184}, {stat: "Sys-COCB-Tower01", x: 137, y: 185},
		{stat: "Sys-CO-VTOL-RadarTower01", x: 142, y: 184}, {stat: "Sys-CO-SensoTower", x: 133, y: 184}, {stat: "A0LightFactory", x: 140, y: 178, mods: 2},
		{stat: "A0ResourceExtractor", x: 146, y: 179}, {stat: "Sys-CO-SensoTower", x: 148, y: 175}, {stat: "AASite-QuadRotMg", x: 147, y: 183},
		{stat: "AASite-QuadRotMg", x: 136, y: 179}, {stat: "CO-Tower-LtATRkt", x: 149, y: 180}, {stat: "CO-Tower-LtATRkt", x: 143, y: 199, rot: 1},
		{stat: "CO-ROTMGBunker", x: 143, y: 196}, {stat: "CO-ROTMGBunker", x: 144, y: 188}, {stat: "CO-ROTMGBunker", x: 150, y: 186},
		{stat: "WallTower-Projector", x: 142, y: 191, rot: 1}, {stat: "WallTower-Projector", x: 147, y: 186}, {stat: "CO-Tower-HvATRkt", x: 152, y: 178, rot: 1},
		{stat: "CollectiveWall", x: 152, y: 179, rot: 1}, {stat: "CollectiveWall", x: 152, y: 180, rot: 1}, {stat: "CollectiveWall", x: 152, y: 181, rot: 1},
		{stat: "CollectiveWall", x: 152, y: 182, rot: 1}, {stat: "CO-Tower-HvATRkt", x: 152, y: 183, rot: 1},
	],
	royalistAMPHOSBaseRepStructs: [ // Royalist replacement for the AMPHOS main base
		{stat: "CO-Tower-LtATRkt", x: 215, y: 163, rot: 3}, {stat: "Sys-CO-SensoTower", x: 216, y: 164}, {stat: "CO-Tower-LtATRkt", x: 218, y: 165},
		{stat: "A0ResourceExtractor", x: 222, y: 155}, {stat: "CollectiveWall", x: 221, y: 155, rot: 1}, {stat: "CollectiveWall", x: 223, y: 155, rot: 1},
		{stat: "CollectiveWall", x: 222, y: 154}, {stat: "CO-Tower-HvATRkt", x: 221, y: 154, rot: 2}, {stat: "CO-Tower-HvATRkt", x: 223, y: 154, rot: 2},
		{stat: "WallTower-Projector", x: 224, y: 146, rot: 3}, {stat: "CO-Tower-HvATRkt", x: 240, y: 164}, {stat: "AASite-QuadRotMg", x: 223, y: 160, rot: 2},
		{stat: "AASite-QuadRotMg", x: 220, y: 160, rot: 2}, {stat: "Emplacement-Rocket06-IDF", x: 218, y: 160}, {stat: "Sys-COCB-Tower01", x: 225, y: 159},
		{stat: "Emplacement-Rocket06-IDF", x: 225, y: 155}, {stat: "A0RepairCentre3", x: 222, y: 157}, {stat: "Emplacement-Rocket06-IDF", x: 215, y: 137, rot: 3},
		{stat: "CO-ROTMGBunker", x: 230, y: 157}, {stat: "CO-ROTMGBunker", x: 234, y: 161}, {stat: "CO-ROTMGBunker", x: 218, y: 143},
		{stat: "CO-Tower-HvATRkt", x: 237, y: 164}, {stat: "CollectiveWall", x: 238, y: 164}, {stat: "CollectiveWall", x: 239, y: 164},
		{stat: "CO-WallTower-RotCan", x: 236, y: 163, rot: 3}, {stat: "CollectiveWall", x: 236, y: 162, rot: 1}, {stat: "CO-Tower-HVCan", x: 236, y: 161, rot: 3},
		{stat: "CollectiveWall", x: 236, y: 160, rot: 1}, {stat: "A0ResearchFacility", x: 240, y: 158, mods: 1}, {stat: "CO-WallTower-RotCan", x: 243, y: 159, rot: 1},
		{stat: "CollectiveWall", x: 236, y: 159, rot: 1}, {stat: "CO-Tower-HVCan", x: 236, y: 158, rot: 3}, {stat: "CollectiveWall", x: 236, y: 157, rot: 1},
		{stat: "CO-WallTower-RotCan", x: 236, y: 156, rot: 3}, {stat: "CO-ROTMGBunker", x: 237, y: 155, rot: 2}, {stat: "WallTower-Projector", x: 242, y: 142, rot: 2},
		{stat: "AASite-QuadRotMg", x: 242, y: 162}, {stat: "CO-WallTower-RotCan", x: 243, y: 161, rot: 1}, {stat: "CollectiveWall", x: 243, y: 160, rot: 1},
		{stat: "CO-WallTower-QuadRotAAGun", x: 244, y: 158, rot: 1}, {stat: "CollectiveWall", x: 244, y: 157, rot: 1}, {stat: "CO-WallTower-QuadRotAAGun", x: 244, y: 156, rot: 1},
		{stat: "CO-Tower-HVCan", x: 245, y: 154, rot: 1}, {stat: "Emplacement-Rocket06-IDF", x: 241, y: 153}, {stat: "A0HardcreteMk1Gate", x: 235, y: 151, rot: 1},
		{stat: "CollectiveWall", x: 245, y: 153, rot: 1}, {stat: "CO-Tower-HVCan", x: 245, y: 152, rot: 1}, {stat: "Emplacement-Rocket06-IDF", x: 239, y: 153},
		{stat: "CO-WallTower-HvCan", x: 235, y: 154, rot: 3}, {stat: "CollectiveWall", x: 235, y: 153, rot: 1}, {stat: "A0HardcreteMk1Gate", x: 235, y: 152, rot: 1},
		{stat: "CollectiveWall", x: 235, y: 150, rot: 1}, {stat: "CO-WallTower-HvCan", x: 235, y: 149, rot: 3}, {stat: "CO-Tower-LtATRkt", x: 234, y: 146, rot: 3},
		{stat: "CO-ROTMGBunker", x: 233, y: 144}, {stat: "CO-WallTower-QuadRotAAGun", x: 241, y: 150, rot: 3}, {stat: "A0VtolPad", x: 242, y: 146},
		{stat: "CO-ROTMGBunker", x: 231, y: 142}, {stat: "A0PowerGenerator", x: 239, y: 149, mods: 1}, {stat: "A0PowerGenerator", x: 239, y: 146, mods: 1},
		{stat: "CollectiveWall", x: 241, y: 149, rot: 1}, {stat: "CollectiveWall", x: 241, y: 148, rot: 1}, {stat: "CO-WallTower-QuadRotAAGun", x: 241, y: 147, rot: 3},
		{stat: "CollectiveWall", x: 241, y: 146, rot: 1}, {stat: "CollectiveWall", x: 241, y: 145, rot: 1}, {stat: "CO-WallTower-QuadRotAAGun", x: 241, y: 144, rot: 3},
		{stat: "A0VtolPad", x: 242, y: 150}, {stat: "A0VtolPad", x: 242, y: 149}, {stat: "A0VtolPad", x: 242, y: 148},
		{stat: "A0VtolPad", x: 242, y: 145}, {stat: "A0VtolPad", x: 246, y: 144}, {stat: "A0VtolPad", x: 244, y: 150},
		{stat: "A0VtolPad", x: 242, y: 144}, {stat: "A0VtolPad", x: 244, y: 144}, {stat: "A0VtolPad", x: 245, y: 144},
		{stat: "A0VtolPad", x: 245, y: 150}, {stat: "A0VtolPad", x: 246, y: 150}, {stat: "A0VTolFactory1", x: 245, y: 147, rot: 3, mods: 1},
		{stat: "CO-Emp-RotMor", x: 245, y: 133, rot: 2}, {stat: "CO-Tower-LtATRkt", x: 243, y: 133, rot: 3}, {stat: "A0LightFactory", x: 245, y: 141, rot: 3, mods: 2},
		{stat: "CO-Tower-LtATRkt", x: 239, y: 135, rot: 2}, {stat: "CollectiveWall", x: 243, y: 131}, {stat: "CO-Tower-HVCan", x: 242, y: 134, rot: 2},
		{stat: "CO-ROTMGBunker", x: 246, y: 130}, {stat: "CO-WallTower-HvCan", x: 245, y: 131, rot: 2}, {stat: "CollectiveWall", x: 244, y: 131},
		{stat: "CO-WallTower-HvCan", x: 242, y: 131, rot: 2}, {stat: "CollectiveWall", x: 242, y: 132, rot: 1}, {stat: "CollectiveWall", x: 242, y: 133, rot: 1},
		{stat: "A0HardcreteMk1Gate", x: 241, y: 134}, {stat: "A0HardcreteMk1Gate", x: 240, y: 134}, {stat: "CollectiveWall", x: 239, y: 134},
		{stat: "CO-WallTower-RotCan", x: 238, y: 134}, {stat: "CollectiveWall", x: 233, y: 135}, {stat: "CollectiveWall", x: 228, y: 136},
		{stat: "Sys-CO-SensoTower", x: 235, y: 136}, {stat: "CO-Tower-HVCan", x: 235, y: 135, rot: 2}, {stat: "CollectiveWall", x: 234, y: 135},
		{stat: "CO-Tower-HVCan", x: 232, y: 135, rot: 2}, {stat: "CO-WallTower-QuadRotAAGun", x: 230, y: 136, rot: 2}, {stat: "CollectiveWall", x: 229, y: 136},
		{stat: "CO-WallTower-QuadRotAAGun", x: 227, y: 136, rot: 2}, {stat: "Emplacement-Rocket06-IDF", x: 229, y: 139}, {stat: "Emplacement-Rocket06-IDF", x: 227, y: 139},
		{stat: "CO-Tower-HVCan", x: 229, y: 141}, {stat: "CollectiveWall", x: 228, y: 141}, {stat: "CO-Tower-HVCan", x: 227, y: 141},
		{stat: "CO-WallTower-QuadRotAAGun", x: 225, y: 140}, {stat: "CO-Tower-HVCan", x: 220, y: 141}, {stat: "A0HardcreteMk1Gate", x: 216, y: 141},
		{stat: "CollectiveWall", x: 224, y: 140}, {stat: "CollectiveWall", x: 223, y: 140}, {stat: "CO-WallTower-QuadRotAAGun", x: 222, y: 140},
		{stat: "CollectiveWall", x: 219, y: 141}, {stat: "CollectiveWall", x: 218, y: 141}, {stat: "CollectiveWall", x: 217, y: 141},
		{stat: "CollectiveWall", x: 215, y: 141}, {stat: "CO-Tower-HVCan", x: 214, y: 141}, {stat: "CO-Tower-LtATRkt", x: 216, y: 142},
		{stat: "AASite-QuadRotMg", x: 213, y: 139, rot: 3}, {stat: "CO-WallTower-HvCan", x: 211, y: 134, rot: 3}, {stat: "A0HardcreteMk1Gate", x: 217, y: 128},
		{stat: "CO-WallTower-HvCan", x: 211, y: 137, rot: 3}, {stat: "CollectiveWall", x: 211, y: 136, rot: 3}, {stat: "CollectiveWall", x: 211, y: 135, rot: 3},
		{stat: "Sys-CO-SensoTower", x: 213, y: 131}, {stat: "CO-Tower-LtATRkt", x: 214, y: 130, rot: 2}, {stat: "CO-Tower-HVCan", x: 216, y: 128, rot: 2},
		{stat: "CO-Tower-HVCan", x: 218, y: 128, rot: 2}, {stat: "CO-ROTMGBunker", x: 217, y: 127, rot: 2}, {stat: "CO-WallTower-RotCan", x: 219, y: 130, rot: 1},
		{stat: "CollectiveWall", x: 219, y: 131, rot: 1}, {stat: "CollectiveWall", x: 223, y: 134}, {stat: "Sys-COCB-Tower01", x: 217, y: 135},
		{stat: "CO-WallTower-RotCan", x: 219, y: 132, rot: 1}, {stat: "CO-ROTMGBunker", x: 221, y: 133, rot: 2}, {stat: "CO-Tower-HVCan", x: 222, y: 134, rot: 2},
		{stat: "CO-Tower-HVCan", x: 224, y: 134, rot: 2}, {stat: "AASite-QuadRotMg", x: 220, y: 135}, {stat: "Sys-COCB-Tower01", x: 237, y: 139},
		{stat: "A0ResourceExtractor", x: 217, y: 133}, {stat: "Emplacement-Rocket06-IDF", x: 215, y: 133, rot: 3}, {stat: "Emplacement-Rocket06-IDF", x: 215, y: 135, rot: 3}
	],
	royalistHellraiserRepStructs: [ // Royalist replacement for the Hellraiser main base
		{stat: "AASite-QuadRotMg", x: 3, y: 126, rot: 2}, {stat: "CollectiveWall", x: 11, y: 121}, {stat: "WallTower-Projector", x: 12, y: 120, rot: 2},
		{stat: "CO-WallTower-HvCan", x: 12, y: 121, rot: 2}, {stat: "WallTower-Projector", x: 15, y: 122}, {stat: "CO-ROTMGBunker", x: 17, y: 118},
		{stat: "CO-ROTMGBunker", x: 20, y: 118}, {stat: "Sys-CO-SensoTower", x: 16, y: 120}, {stat: "CO-Emp-RotMor", x: 18, y: 121},
		{stat: "CO-ROTMGBunker", x: 19, y: 124}, {stat: "CO-Emp-RotMor", x: 28, y: 118},
		{stat: "CO-Tower-HvATRkt", x: 25, y: 122, rot: 1}, {stat: "CollectiveWall", x: 25, y: 123, rot: 1}, {stat: "A0TankTrap", x: 27, y: 123},
		{stat: "CO-WallTower-RotCan", x: 25, y: 124, rot: 1}, {stat: "CO-WallTower-RotCan", x: 25, y: 127, rot: 1}, {stat: "A0TankTrap", x: 27, y: 124},
		{stat: "A0TankTrap", x: 27, y: 127}, {stat: "CO-ROTMGBunker", x: 28, y: 120}, {stat: "WallTower-Projector", x: 28, y: 122, rot: 1},
		{stat: "CO-Tower-HVCan", x: 31, y: 122}, {stat: "CO-ROTMGBunker", x: 31, y: 126}, {stat: "CO-WallTower-HvCan", x: 7, y: 139},
		{stat: "Sys-CO-SensoTower", x: 35, y: 122}, {stat: "CO-Tower-HVCan", x: 35, y: 126}, {stat: "A0CyborgFactory", x: 22, y: 135, rot: 3},
		{stat: "CO-ROTMGBunker", x: 10, y: 129}, {stat: "AASite-QuadRotMg", x: 10, y: 131}, {stat: "CO-Tower-LtATRkt", x: 11, y: 130, rot: 2},
		{stat: "WallTower-Projector", x: 12, y: 128, rot: 2}, {stat: "WallTower-Projector", x: 12, y: 132}, {stat: "CO-WallTower-RotCan", x: 13, y: 142, rot: 1},
		{stat: "CO-WallTower-HvCan", x: 11, y: 139, rot: 2}, {stat: "CO-Emp-RotMor", x: 10, y: 141}, {stat: "CO-ROTMGBunker", x: 13, y: 136},
		{stat: "A0ResearchFacility", x: 9, y: 144, mods: 1}, {stat: "CO-Emp-RotMor", x: 10, y: 146}, {stat: "Sys-CO-SensoTower", x: 9, y: 149},
		{stat: "CO-ROTMGBunker", x: 11, y: 148}, {stat: "WallTower-Projector", x: 13, y: 146}, {stat: "WallTower-Projector", x: 16, y: 128, rot: 2},
		{stat: "Sys-CO-SensoTower", x: 17, y: 130}, {stat: "AASite-QuadRotMg", x: 18, y: 131}, {stat: "WallTower-Projector", x: 16, y: 132},
		{stat: "A0ResourceExtractor", x: 19, y: 134}, {stat: "A0ResourceExtractor", x: 22, y: 128}, {stat: "AASite-QuadRotMg", x: 22, y: 133},
		{stat: "A0RepairCentre3", x: 19, y: 139}, {stat: "A0PowerGenerator", x: 17, y: 142, mods: 1}, {stat: "CO-Emp-RotMor", x: 23, y: 143},
		{stat: "AASite-QuadRotMg", x: 26, y: 129, rot: 2}, {stat: "CO-Emp-RotMor", x: 25, y: 133}, {stat: "CO-Emp-RotMor", x: 26, y: 135},
		{stat: "WallTower-Projector", x: 28, y: 128, rot: 1}, {stat: "CO-Tower-LtATRkt", x: 31, y: 129}, {stat: "A0TankTrap", x: 31, y: 130},
		{stat: "WallTower-Projector", x: 29, y: 133, rot: 1}, {stat: "CO-ROTMGBunker", x: 28, y: 135}, {stat: "AASite-QuadRotMg", x: 27, y: 137, rot: 1},
		{stat: "CO-Tower-LtATRkt", x: 27, y: 140, rot: 1}, {stat: "WallTower-Projector", x: 28, y: 141, rot: 1}, {stat: "WallTower-Projector", x: 16, y: 145},
		{stat: "CO-Tower-HVCan", x: 18, y: 146}, {stat: "CollectiveWall", x: 19, y: 146}, {stat: "CO-Tower-HVCan", x: 20, y: 146},
		{stat: "AASite-QuadRotMg", x: 22, y: 144, rot: 3}, {stat: "CO-ROTMGBunker", x: 26, y: 146}, {stat: "A0ResourceExtractor", x: 28, y: 144},
		{stat: "A0TankTrap", x: 32, y: 130}, {stat: "AASite-QuadRotMg", x: 35, y: 130, rot: 2}, {stat: "CO-Emp-RotMor", x: 37, y: 133},
		{stat: "WallTower-Projector", x: 32, y: 137}, {stat: "Sys-CO-SensoTower", x: 34, y: 138}, {stat: "CO-ROTMGBunker", x: 37, y: 136},
		{stat: "CO-WallTower-RotCan", x: 36, y: 139, rot: 1}, {stat: "A0TankTrap", x: 38, y: 138}, {stat: "A0TankTrap", x: 38, y: 139},
		{stat: "CO-WallTower-RotCan", x: 36, y: 142, rot: 1}, {stat: "CollectiveWall", x: 36, y: 143, rot: 1}, {stat: "A0TankTrap", x: 38, y: 142},
		{stat: "A0TankTrap", x: 38, y: 143}, {stat: "WallTower-Projector", x: 40, y: 132, rot: 1}, {stat: "CO-Emp-RotMor", x: 45, y: 130},
		{stat: "AASite-QuadRotMg", x: 47, y: 129, rot: 1}, {stat: "CO-ROTMGBunker", x: 44, y: 132}, {stat: "WallTower-Projector", x: 42, y: 140},
		{stat: "A0HardcreteMk1Gate", x: 25, y: 125, rot: 1}, {stat: "A0HardcreteMk1Gate", x: 25, y: 126, rot: 1}, {stat: "A0HardcreteMk1Gate", x: 36, y: 140, rot: 1},
		{stat: "A0HardcreteMk1Gate", x: 36, y: 141, rot: 1}, {stat: "A0HardcreteMk1Gate", x: 8, y: 139}, {stat: "A0HardcreteMk1Gate", x: 9, y: 139},
		{stat: "A0HardcreteMk1Gate", x: 10, y: 139}, {stat: "CollectiveWall", x: 12, y: 139}, {stat: "CO-Tower-HvATRkt", x: 13, y: 139, rot: 2},
		{stat: "CollectiveWall", x: 13, y: 140, rot: 1}, {stat: "CollectiveWall", x: 13, y: 141, rot: 1}, {stat: "CO-Tower-HvATRkt", x: 24, y: 116, rot: 2},
		{stat: "CollectiveWall", x: 25, y: 116}, {stat: "CO-Tower-HvATRkt", x: 26, y: 116, rot: 2}, {stat: "CO-ROTMGBunker", x: 39, y: 134},
		{stat: "CO-Emp-RotMor", x: 35, y: 135}, {stat: "CO-ROTMGBunker", x: 42, y: 128}
	],
	// AMPHOS Extra Structures
	amphosNWIsleRepStructs: [ // AMPHOS replacement for the Royalist north west island base
		{stat: "PillBox1", x: 183, y: 90}, {stat: "WallTower06", x: 181, y: 92}, {stat: "A0HardcreteMk1Wall", x: 181, y: 93},
		{stat: "A0HardcreteMk1Wall", x: 181, y: 94}, {stat: "WallTower06", x: 181, y: 95}, {stat: "WallTower06", x: 185, y: 85},
		{stat: "A0HardcreteMk1Wall", x: 185, y: 86}, {stat: "WallTower06", x: 185, y: 87}, {stat: "Emplacement-Rocket06-IDF", x: 187, y: 85},
		{stat: "WallTower06", x: 188, y: 83}, {stat: "A0HardcreteMk1Wall", x: 189, y: 83}, {stat: "WallTower06", x: 190, y: 83},
		{stat: "Emplacement-MRL-pit", x: 189, y: 85}, {stat: "AASite-QuadBof", x: 189, y: 87}, {stat: "Sys-SensoTower02", x: 191, y: 84},
		{stat: "GuardTower3", x: 191, y: 86}, {stat: "GuardTower6", x: 187, y: 89}, {stat: "WallTower01", x: 186, y: 91},
		{stat: "Emplacement-MRL-pit", x: 184, y: 94}, {stat: "A0HardcreteMk1Wall", x: 186, y: 92}, {stat: "A0HardcreteMk1Wall", x: 186, y: 93},
		{stat: "WallTower-DoubleAAGun", x: 186, y: 94}, {stat: "A0HardcreteMk1Wall", x: 186, y: 95}, {stat: "GuardTower6", x: 182, y: 97},
		{stat: "PillBox1", x: 190, y: 107}, {stat: "AASite-QuadBof", x: 192, y: 85, rot: 1}, {stat: "WallTower06", x: 201, y: 87},
		{stat: "WallTower06", x: 202, y: 86}, {stat: "A0HardcreteMk1Wall", x: 203, y: 86}, {stat: "WallTower06", x: 204, y: 86},
		{stat: "GuardTower6", x: 205, y: 87}, {stat: "A0HardcreteMk1Wall", x: 201, y: 88}, {stat: "WallTower06", x: 201, y: 89},
		{stat: "Emplacement-MRL-pit", x: 203, y: 88}, {stat: "PillBox1", x: 202, y: 93}, {stat: "PillBox1", x: 206, y: 89},
		{stat: "Emplacement-Rocket06-IDF", x: 206, y: 91}, {stat: "AASite-QuadBof", x: 204, y: 94, rot: 3}, {stat: "Sys-CB-Tower01", x: 205, y: 95},
		{stat: "A0ResourceExtractor", x: 207, y: 93}, {stat: "WallTower06", x: 208, y: 91}, {stat: "A0HardcreteMk1Wall", x: 209, y: 91},
		{stat: "WallTower06", x: 210, y: 91}, {stat: "Emplacement-MRL-pit", x: 209, y: 94}, {stat: "WallTower06", x: 212, y: 94},
		{stat: "A0HardcreteMk1Wall", x: 212, y: 95}, {stat: "PillBox1", x: 199, y: 103}, {stat: "WallTower01", x: 192, y: 104},
		{stat: "A0HardcreteMk1Wall", x: 193, y: 104}, {stat: "Emplacement-Rocket06-IDF", x: 193, y: 106}, {stat: "A0HardcreteMk1Wall", x: 194, y: 104},
		{stat: "WallTower-DoubleAAGun", x: 195, y: 104}, {stat: "GuardTower6", x: 192, y: 108}, {stat: "WallTower06", x: 194, y: 109},
		{stat: "Sys-SensoTower02", x: 195, y: 108}, {stat: "A0HardcreteMk1Wall", x: 195, y: 109}, {stat: "A0HardcreteMk1Wall", x: 196, y: 104},
		{stat: "A0HardcreteMk1Wall", x: 197, y: 104}, {stat: "Emplacement-Rocket06-IDF", x: 197, y: 106}, {stat: "WallTower01", x: 198, y: 104},
		{stat: "WallTower06", x: 196, y: 109}, {stat: "GuardTower6", x: 199, y: 108}, {stat: "AASite-QuadBof", x: 206, y: 96, rot: 3},
		{stat: "Sys-SensoTower02", x: 207, y: 98}, {stat: "PillBox1", x: 202, y: 107}, {stat: "WallTower06", x: 208, y: 99},
		{stat: "A0HardcreteMk1Wall", x: 209, y: 99}, {stat: "A0ResearchFacility", x: 210, y: 97, mods: 1}, {stat: "WallTower06", x: 210, y: 99},
		{stat: "A0HardcreteMk1Gate", x: 211, y: 99}, {stat: "PillBox1", x: 211, y: 100}, {stat: "A0HardcreteMk1Wall", x: 212, y: 96},
		{stat: "WallTower06", x: 212, y: 97}, {stat: "A0HardcreteMk1Wall", x: 212, y: 98}, {stat: "WallTower-DoubleAAGun", x: 212, y: 99},
		{stat: "A0HardcreteMk1Wall", x: 186, y: 96}, {stat: "WallTower01", x: 186, y: 97}
	],
	amphosSouthGateLZStructs: [ // AMPHOS-built LZ in the south gate area
		{stat: "WallTower-DoubleAAGun", x: 181, y: 53}, {stat: "WallTower06", x: 181, y: 50}, {stat: "WallTower06", x: 184, y: 53}, 
		{stat: "Sys-SensoTower02", x: 178, y: 54},
	],
	// Hellraiser Extra Structures
	hellraiserCentralRepairStructs: [ // Small Hellraiser outpost over the central factory base
		{stat: "Emplacement-MortarPit-Incendiary", x: 121, y: 79}, {stat: "Emplacement-MortarPit-Incendiary", x: 116, y: 81}, {stat: "Emplacement-MortarPit-Incendiary", x: 118, y: 81},
		{stat: "Tower-Projector", x: 114, y: 82}, {stat: "Tower-Projector", x: 117, y: 78}, {stat: "Tower-Projector", x: 125, y: 76},
		{stat: "AASite-QuadMg1", x: 120, y: 77}, {stat: "AASite-QuadMg1", x: 122, y: 77}, {stat: "AASite-QuadMg1", x: 116, y: 83, rot: 2},
		{stat: "A0RepairCentre3", x: 120, y: 82}, {stat: "A0HardcreteMk1Wall", x: 118, y: 76}, {stat: "A0HardcreteMk1Wall", x: 118, y: 77},
		{stat: "A0HardcreteMk1Wall", x: 124, y: 76}, {stat: "A0HardcreteMk1Wall", x: 127, y: 80}, {stat: "Sys-SensoTower02", x: 126, y: 81},
		{stat: "WallTower02", x: 118, y: 75}, {stat: "WallTower02", x: 118, y: 78}, {stat: "WallTower02", x: 124, y: 75},
		{stat: "WallTower02", x: 124, y: 77}, {stat: "WallTower02", x: 126, y: 80},
	],
	// Coalition Extra Structures
	coalitionWestGateLZStructs: [ // Coalition-built LZ in the west gate area
		{stat: "WallTower04", x: 122, y: 24}, {stat: "WallTower04", x: 122, y: 20, rot: 2}, {stat: "WallTower04", x: 118, y: 20, rot: 2},
		{stat: "WallTower04", x: 118, y: 24}, {stat: "Sys-SensoTower02", x: 124, y: 23}, {stat: "A0RepairCentre3", x: 126, y: 22}
	],
	// Resistance Extra Structures
	resistanceRiverTownRepairStructs: [ // Small Resistance repair outpost north of the river crossing
		{stat: "A0RepairCentre3", x: 97, y: 120}, {stat: "Sys-SensoTower02", x: 100, y: 122}, {stat: "Sys-CB-Tower01", x: 95, y: 123},
		{stat: "WallTower03", x: 102, y: 118, rot: 1}, {stat: "A0HardcreteMk1Wall", x: 102, y: 119, rot: 1}, {stat: "WallTower03", x: 102, y: 120, rot: 1},
		{stat: "WallTower03", x: 94, y: 115, rot: 2}, {stat: "A0HardcreteMk1Wall", x: 95, y: 115}, {stat: "WallTower03", x: 96, y: 115, rot: 2},
		{stat: "AASite-QuadMg1", x: 100, y: 123}, {stat: "AASite-QuadMg1", x: 101, y: 122, rot: 1}, {stat: "Emplacement-MortarPit01", x: 97, y: 123},
		{stat: "Emplacement-MortarPit01", x: 100, y: 119},
	],
	resistanceCoalitionSubBaseStructs: [ // Small Resistance base next to the Coalition's main base
		{stat: "A0LightFactory", x: 20, y: 70, mods: 2}, {stat: "A0PowerGenerator", x: 26, y: 73, mods: 1}, {stat: "A0CyborgFactory", x: 25, y: 70, rot: 3},
		{stat: "A0RepairCentre3", x: 23, y: 74}, {stat: "PillBox5", x: 17, y: 70}, {stat: "Emplacement-MortarPit01", x: 18, y: 75},
		{stat: "Emplacement-MortarPit01", x: 19, y: 76}, {stat: "WallTower03", x: 16, y: 74, rot: 3}, {stat: "A0HardcreteMk1Wall", x: 16, y: 75, rot: 3},
		{stat: "WallTower01", x: 16, y: 76, rot: 3}, {stat: "A0HardcreteMk1Wall", x: 16, y: 77, rot: 3}, {stat: "WallTower03", x: 16, y: 78},
		{stat: "A0HardcreteMk1Gate", x: 17, y: 78}, {stat: "A0HardcreteMk1Gate", x: 18, y: 78}, {stat: "A0HardcreteMk1Gate", x: 19, y: 78},
		{stat: "WallTower03", x: 20, y: 78}, {stat: "A0HardcreteMk1Wall", x: 21, y: 78}, {stat: "A0HardcreteMk1Wall", x: 22, y: 78}
	],
	resistanceSecondCommandCenter: [ // This gets added to the previous set if the Resistance was wiped out by the player
		{stat: "A0CommandCentre", x: 22, y: 77}
	]
};

// Set up starting data at the beginning of the game
function initializeGameInfo()
{
	// Initial artifact locations, note that some technologies appear in multiple locations.
	// These duplicates will be removed as the player progresses.
	// If an artifact has a "req" entry, that means that the artifact will not be placed if
	// the player hasn't researched that technology. Once the player has, it will be placed
	// directly into their research menu.
	camSetArtifacts({
		// Resistance Artifacts
		"resTwinMGTower": { tech: "R-Wpn-MG2Mk1" }, // Twin Machinegun
		"resHQ": { tech: "R-Sys-CommandUpgrade01" }, // Improved Command-Control Systems
		"resPython": { tech: "R-Vehicle-Body11", req: "R-Vehicle-Body05" }, // Python (requires Cobra)
		"resAASite": { tech: "R-Wpn-AAGun03" }, // Hurricane AA
		"resistanceFactory": { tech: "R-Struc-Factory-Module" }, // Factory Module
		"resistanceHeavyFactory": { tech: "R-Vehicle-Prop-Tracks" }, // Tracked Propulsion
		"resResearch1": { tech: "R-Sys-Engineering01" }, // Engineering
		"resResearch2": { tech: "R-Wpn-MG-ROF01" }, // Chaingun Upgrade
		"resRelay": { tech: "R-Struc-CommandRelay" }, // Command Relay Post
		// AMPHOS Artifacts
		"ampLancerTow": { tech: "R-Wpn-Rocket01-LtAT", req: "R-Wpn-Rocket-LtA-TMk1" }, // Lancer AT Rocket
		"ampMGTow": { tech: "R-Wpn-MG3Mk1", req: "R-Wpn-MG2Mk1" }, // Heavy Machinegun (requires Twin Machinegun)
		"ampCBTow": { tech: "R-Sys-CBSensor-Turret01" }, // CB Turret
		"amphosPortFactory": { tech: "R-Vehicle-Prop-Hover" }, // Hover Propulsion
		"ampMRA": { tech: "R-Wpn-Rocket02-MRL" }, // Mini-Rocket Array
		"ampResearchOuter": { tech: "R-Wpn-Rocket03-HvAT", req: "R-Wpn-Rocket-LtA-TMk1" }, // Bunker Buster
		"ampResearchInner": { tech: "R-Sys-Engineering02", req: "R-Sys-Engineering01" }, // Improved Engineering (requires Engineering)
		"ampAASite": { tech: "R-Wpn-AAGun02", req: "R-Wpn-AAGun03" }, // Cyclone AA (requires Hurricane)
		"ampPowerGen": { tech: "R-Struc-PowerModuleMk1" }, // Power Module
		"amphosVtolFactory": { tech: "R-Vehicle-Prop-VTOL" }, // VTOL Propulsion
		"amphosMainFactory1": { tech: "R-Wpn-Rocket02-MRLHvy", req: "R-Wpn-Rocket02-MRL" }, // Heavy Rocket Array (requires MRA)
		"amphosMainFactory2": { tech: "R-Wpn-Rocket06-IDF", req: "R-Wpn-Rocket02-MRL" }, // Ripple Rockets (requires MRA)
		"ampHQ": { tech: "R-Sys-CommandUpgrade01", req: "R-Wpn-Rocket02-MRL" }, // Improved Command-Control Systems
		// Hellraiser Artifacts
		"helMGTow": { tech: "R-Wpn-MG3Mk1"}, // Heavy Machinegun (requires Twin Machinegun)
		"hellraiserFactory": { tech: "R-Wpn-Flame2" }, // Inferno
		"helHQ": { tech: ["R-Vehicle-Body04", "R-Sys-CommandUpgrade01"] }, // Bug & Improved Command-Control Systems
		"helResearch1": { tech: "R-Vehicle-Metals03", req: "R-Vehicle-Metals02" }, // Composite Alloys Mk3 (requires Mk2)
		"helResearch2": { tech: "R-Wpn-Mortar-Incendiary" }, // Incendiary Mortar (requires Mortar)
		// Coalition Artifacts
		"coaAASite": { tech: "R-Wpn-AAGun02", req: "R-Wpn-AAGun03" }, // Cyclone AA (requires Hurricane)
		"coalitionVtolFactory": { tech: "R-Vehicle-Prop-VTOL" }, // VTOL Propulsion
		"coalitionFactory1": { tech: "R-Wpn-HowitzerMk1" }, // Howitzer
		"coalitionFactory2": { tech: "R-Wpn-Cannon3Mk1", req: "R-Wpn-Cannon2Mk1" }, // Heavy Cannon (requires Medium Cannon)
		"coaHQ": { tech: ["R-Vehicle-Body02", "R-Sys-CommandUpgrade01"] }, // Leopard & Improved Command-Control Systems
		"coaResearch": { tech: "R-Vehicle-Metals04", req: "R-Vehicle-Metals03" }, // Dense Composite Alloys (requires Mk3)
		"coaResearch2": { tech: "R-Struc-Research-Module" }, // Research Module
		"coaResearch3": { tech: "R-Sys-Engineering02", req: "R-Sys-Engineering01" }, // Improved Engineering (requires Engineering)
		"coaPowerGen": { tech: "R-Struc-PowerModuleMk1" }, // Power Module
		// Royalist Artifacts
		"royalistSouthCyborgFac": { tech: "R-Cyborg-Metals02", req: "R-Cyborg-Metals01" }, // Cyborg Composite Alloys Mk2 (requires Mk1)
		"royCompositeTank": { tech: "R-Vehicle-Metals03", req: "R-Vehicle-Metals02" }, // Composite Alloys Mk3 (requires Mk2)
		"royInfBunker": { tech: "R-Wpn-Flame2" }, // Inferno
		"royLancerTow1": { tech: "R-Wpn-Rocket01-LtAT" }, // Lancer AT Rocket
		"royLancerTow2": { tech: "R-Wpn-Rocket01-LtAT" }, // Lancer AT Rocket
		"royPowerGen": { tech: "R-Struc-PowerModuleMk1" }, // Power Module
		"royResearchLake": { tech: "R-Struc-Research-Module" }, // Research Module
		"royalistOuterVtolFac": { tech: "R-Vehicle-Prop-VTOL" }, // VTOL Propulsion
		"royResearchOuter": { tech: "R-Wpn-Cannon3Mk1", req: "R-Wpn-Cannon2Mk1" }, // Heavy Cannon (requires Medium Cannon)
		"royHypVelEmplacement": { tech: "R-Wpn-Cannon4AMk1", req: "R-Wpn-Cannon2Mk1" }, // Hyper Velocity Cannon (requires Medium Cannon)
		"royPepperPit1": { tech: "R-Wpn-Mortar3" }, // Pepperpot
		"royPepperPit2": { tech: "R-Wpn-Mortar3" }, // Pepperpot
		"royACannonHardpoint": { tech: "R-Wpn-Cannon5", req: "R-Wpn-Cannon2Mk1" }, // Assault Cannon (requires Medium Cannon)
		"royalistCentralFactory": { tech: "R-Struc-Factory-Upgrade02" }, // Robotic Manufacturing
		"royHvyTK": { tech: "R-Wpn-Rocket07-Tank-Killer", req: "R-Wpn-Rocket01-LtAT" }, // Tank Killer Rocket (requires Lancer)
		// "royResearchOuter": { tech: "R-Wpn-Rocket08-Ballista", req: "R-Wpn-Rocket01-LtAT" }, // Ballista Rocket (requires Lancer)
		"royResearchCentral": { tech: "R-Vehicle-Body03" }, // Retaliation
		"royAssaultCommander": { tech: "R-Vehicle-Body07", req: "R-Vehicle-Body03" }, // Retribution (requires Retaliation)
		"royRelay": { tech: "R-Vehicle-Body07", req: "R-Vehicle-Body03" }, // Retribution (requires Retaliation)
		"royHvyCommander": { tech: "R-Vehicle-Body10", req: "R-Vehicle-Body07" }, // Vengeance (requires Retribution)
		"royAASite": { tech: "R-Wpn-AAGun04", req: "R-Wpn-AAGun02" }, // Whirlwind AA (requires Cyclone)
		"royalistOuterFactory": { tech: "R-Struc-Factory-Upgrade03", req: "R-Struc-Factory-Upgrade02" }, // Advanced Manufacturing (requires Robotic Manufacturing)
		"royHMGTow": { tech: "R-Wpn-MG-ROF01" }, // Chaingun Upgrade
		"royLZAGTow": { tech: "R-Wpn-MG-ROF01" }, // Chaingun Upgrade
		"roySpyAGTow": { tech: "R-Wpn-MG-ROF01" }, // Chaingun Upgrade
		"royIslandAGTow": { tech: "R-Wpn-MG-ROF01" }, // Chaingun Upgrade
		"royLZAGTow": { tech: "R-Wpn-MG-ROF01" }, // Chaingun Upgrade
	});

	// Decide (starting) templates for all factories
	let resFactoryTemplates;
	let resHvyFactoryTemplates;
	let resCybFactoryTemplates1;
	let resCybFactoryTemplates2;

	let ampPortTemplates;
	let ampMainTemplates1;
	let ampMainTemplates2;
	let ampVtolTemplates;

	let helFactoryTemplates;
	let helCybTemplates1;
	let helCybTemplates2;

	let coaMainTemplates1;
	let coaMainTemplates2;
	let coaCybTemplates1;
	let coaCybTemplates2;
	let coaCybTemplates3;
	let coaVtolTemplates;

	let royCentralFactoryTemplates;
	let royOuterFactoryTemplates;
	let royHoverFactoryTemplates;
	let royMainFactoryTemplates;
	let roySouthCybTemplates;
	let royHowitzerCybTemplates;
	let royOuterCybTemplates;
	let royMainCybTemplates;
	let royVtolTemplates;

	let resSubTemplates;
	let resSubCybTemplates;
	switch (difficulty)
	{
		case INSANE:
			resFactoryTemplates = [ cTempl.rellcan, cTempl.reltwmght, cTempl.relpodht, cTempl.relflamht, cTempl.relsar ];
			resHvyFactoryTemplates = [ cTempl.remlcan, cTempl.remmor, cTempl.relsar, cTempl.reltwmght, cTempl.relsensht ];
			resCybFactoryTemplates1 = [ cTempl.cybmg, cTempl.cybca, cTempl.cybmg, cTempl.cybmg ];
			resCybFactoryTemplates2 = [ cTempl.cybca, cTempl.cybfl, cTempl.cybca ];

			ampPortTemplates = [ cTempl.amlpod, cTempl.amlsar, cTempl.amlpod, cTempl.ammmra, cTempl.ammlan ];
			ampMainTemplates1 = [ cTempl.amhlan, cTempl.ammhmg, cTempl.ammlan, cTempl.amlpod, cTempl.ammbb ];
			ampMainTemplates2 = [ cTempl.ammlan, cTempl.ammmra, cTempl.ammpod ];
			ampVtolTemplates = [ cTempl.amllanv, cTempl.amlpodv, cTempl.amlhmgv, cTempl.amlbbv ];

			helFactoryTemplates = [ cTempl.hehinf, cTempl.hellrep, cTempl.helhmg, cTempl.hemflam, cTempl.hemlcan, cTempl.hehinf ];
			helCybTemplates1 = [ cTempl.cybhg, cTempl.cybfl, cTempl.cybfl ];
			helCybTemplates2 = [ cTempl.cybca, cTempl.cybfl, cTempl.cybfl ];

			coaMainTemplates1 = [ cTempl.colpod, cTempl.comhmort, cTempl.commcan, cTempl.comsenst, cTempl.colsar, cTempl.cohhcan, cTempl.comhmg, cTempl.comhrepht ];
			coaMainTemplates2 = [ cTempl.cohhcan, cTempl.comhmg, cTempl.cohhcan, cTempl.cohhow ];
			coaCybTemplates1 = [ cTempl.cybhg, cTempl.cybgr, cTempl.cybhg, cTempl.cybhg, cTempl.cybgr, cTempl.cybhg ];
			coaCybTemplates2 = [ cTempl.scymc, cTempl.cybgr, cTempl.scymc, cTempl.cybhg ];
			coaCybTemplates3 = [ cTempl.cybrp, cTempl.cybhg, cTempl.cybca, cTempl.cybhg, cTempl.cybhg ];
			coaVtolTemplates = [ cTempl.colcbomv, cTempl.colhmgv, cTempl.colcanv, cTempl.colpbomv ];

			royCentralFactoryTemplates = [ cTempl.rollant, cTempl.rolhmgt, cTempl.romacant, cTempl.rommrat, cTempl.rominft, cTempl.romhrept ];
			royOuterFactoryTemplates = [ cTempl.romsenst, cTempl.romrmort, cTempl.romacant, cTempl.romagt, cTempl.rombbt, cTempl.rohhcant, cTempl.romtkt/*, cTempl.rohbalt*/ ];
			royHoverFactoryTemplates = [ cTempl.romtkh, cTempl.romhvcanh, cTempl.romhvcanh, cTempl.romagh, cTempl.rommrah, cTempl.rohhcanh ];
			royMainFactoryTemplates = [ cTempl.romtkt, cTempl.romacant, cTempl.romsenst, cTempl.rohhcant, cTempl.romagt, cTempl.romrmort ];
			roySouthCybTemplates = [ cTempl.cybhg, cTempl.cybla, cTempl.cybhg, cTempl.cybhg, cTempl.cybla, cTempl.scyhc ];
			royHowitzerCybTemplates = [ cTempl.cybth, cTempl.cybla, cTempl.scyhc, cTempl.cybag, cTempl.cybla, cTempl.scyac ]
			royOuterCybTemplates = [ cTempl.scytk, cTempl.cybag, cTempl.cybth, cTempl.scytk, cTempl.cybag, cTempl.cybth ];
			royMainCybTemplates = [ cTempl.scyac, cTempl.cybth, cTempl.cybag, cTempl.cybla ];
			royVtolTemplates = [ cTempl.rollanv, cTempl.rolagv, cTempl.rolhvcanv, cTempl.rollanv, cTempl.rolagv, cTempl.rolhvcanv, cTempl.rolpbomv, cTempl.romacanv ];

			resSubTemplates = [ cTempl.rehhcanht, cTempl.rehhmg, cTempl.rempod, cTempl.remsens, cTempl.rehhmor, cTempl.rehinf, cTempl.rehhcant ];
			resSubCybTemplates = [ cTempl.cybhg, cTempl.cybca, cTempl.cybth, cTempl.cybca, cTempl.cybhg, cTempl.scymc ];
			break;
		case HARD:
			resFactoryTemplates = [ cTempl.rellcan, cTempl.reltwmght, cTempl.relpodht, cTempl.relflamht ];
			resHvyFactoryTemplates = [ cTempl.remlcan, cTempl.relmor, cTempl.relsar, cTempl.reltwmght, cTempl.relsensht ];
			resCybFactoryTemplates1 = [ cTempl.cybmg, cTempl.cybca, cTempl.cybmg, cTempl.cybmg ];
			resCybFactoryTemplates2 = [ cTempl.cybca, cTempl.cybfl, cTempl.cybca ];

			ampPortTemplates = [ cTempl.amlpod, cTempl.amlsar, cTempl.amlpod, cTempl.ammmra ];
			ampMainTemplates1 = [ cTempl.ammlan, cTempl.ammhmg, cTempl.amlsar, cTempl.amlpod, cTempl.ammbb ];
			ampMainTemplates2 = [ cTempl.ammlan, cTempl.ammmra, cTempl.amlpod ];
			ampVtolTemplates = [ cTempl.amllanv, cTempl.amlpodv, cTempl.amlhmgv, cTempl.amlbbv ];

			helFactoryTemplates = [ cTempl.helflam, cTempl.hellrep, cTempl.helhmg, cTempl.helflam, cTempl.hemlcan, cTempl.hehinf ];
			helCybTemplates1 = [ cTempl.cybhg, cTempl.cybfl, cTempl.cybfl ];
			helCybTemplates2 = [ cTempl.cybca, cTempl.cybfl, cTempl.cybfl ];

			coaMainTemplates1 = [ cTempl.colpod, cTempl.comhmort, cTempl.commcan, cTempl.comsenst, cTempl.colsar, cTempl.commcan, cTempl.comhmg, cTempl.comhrepht ];
			coaMainTemplates2 = [ cTempl.cohhcan, cTempl.comhmg, cTempl.cohhcan, cTempl.cohhow ];
			coaCybTemplates1 = [ cTempl.cybhg, cTempl.cybgr, cTempl.cybhg, cTempl.cybhg, cTempl.cybgr, cTempl.cybhg ];
			coaCybTemplates2 = [ cTempl.scymc, cTempl.cybgr, cTempl.scymc, cTempl.cybhg ];
			coaCybTemplates3 = [ cTempl.cybrp, cTempl.cybhg, cTempl.cybca, cTempl.cybhg, cTempl.cybhg ];
			coaVtolTemplates = [ cTempl.colcbomv, cTempl.colhmgv, cTempl.colcanv ];

			royCentralFactoryTemplates = [ cTempl.rollant, cTempl.rolhmgt, cTempl.romacant, cTempl.rolmra, cTempl.rominft, cTempl.romhrept ];
			royOuterFactoryTemplates = [ cTempl.romsenst, cTempl.romrmort, cTempl.romacant, cTempl.romagt, cTempl.rombbt, cTempl.rohhcant, cTempl.romtkt ];
			royHoverFactoryTemplates = [ cTempl.romtkh, cTempl.romhvcanh, cTempl.romhvcanh, cTempl.romagh, cTempl.rommrah ];
			royMainFactoryTemplates = [ cTempl.romtkt, cTempl.romacant, cTempl.romsenst, cTempl.rohhcant, cTempl.romagt, cTempl.romrmort ];
			roySouthCybTemplates = [ cTempl.cybhg, cTempl.cybla, cTempl.cybhg, cTempl.cybhg, cTempl.cybla, cTempl.scyhc ];
			royHowitzerCybTemplates = [ cTempl.cybth, cTempl.cybla, cTempl.scyhc, cTempl.cybag, cTempl.cybla, cTempl.scyac ]
			royOuterCybTemplates = [ cTempl.cybla, cTempl.cybag, cTempl.cybla, cTempl.cybag, cTempl.cybth, cTempl.cybth ];
			royMainCybTemplates = [ cTempl.scyac, cTempl.cybth, cTempl.cybag, cTempl.cybla ];
			royVtolTemplates = [ cTempl.rollanv, cTempl.rolagv, cTempl.rolhvcanv, cTempl.rollanv, cTempl.rolagv, cTempl.rolhvcanv, cTempl.rolpbomv ];

			resSubTemplates = [ cTempl.rehmcanht, cTempl.remhmgt, cTempl.rempod, cTempl.remsens, cTempl.remhmor, cTempl.reminf, cTempl.rehhcant ];
			resSubCybTemplates = [ cTempl.cybhg, cTempl.cybca, cTempl.cybfl, cTempl.cybca, cTempl.cybhg, cTempl.scymc ];
			break;
		case MEDIUM:
			resFactoryTemplates = [ cTempl.rellcan, cTempl.reltwmght, cTempl.relpodw, cTempl.relflamht ];
			resHvyFactoryTemplates = [ cTempl.remlcan, cTempl.relmor, cTempl.relsar, cTempl.reltwmght, cTempl.relsensw ];
			resCybFactoryTemplates1 = [ cTempl.cybmg, cTempl.cybca, cTempl.cybmg, cTempl.cybmg ];
			resCybFactoryTemplates2 = [ cTempl.cybca, cTempl.cybmg, cTempl.cybca ];

			ampPortTemplates = [ cTempl.amlpod, cTempl.amlsar, cTempl.amlpod ];
			ampMainTemplates1 = [ cTempl.ammlan, cTempl.ammhmg, cTempl.amlsar ];
			ampMainTemplates2 = [ cTempl.ammhmg, cTempl.ammmra, cTempl.amlpod ];
			ampVtolTemplates = [ cTempl.amllanv, cTempl.amlpodv, cTempl.amlhmgv, cTempl.amlbbv ];

			helFactoryTemplates = [ cTempl.helflam, cTempl.hellrep, cTempl.heltwmg, cTempl.helflam, cTempl.hemlcan, cTempl.hehinf ];
			helCybTemplates1 = [ cTempl.cybmg, cTempl.cybfl, cTempl.cybfl ];
			helCybTemplates2 = [ cTempl.cybca, cTempl.cybfl, cTempl.cybfl ];

			coaMainTemplates1 = [ cTempl.colpod, cTempl.comhmorht, cTempl.commcan, cTempl.comsensht, cTempl.colsar, cTempl.commcan, cTempl.comhmg, cTempl.comhrepht ];
			coaMainTemplates2 = [ cTempl.cohhcan, cTempl.comhmg, cTempl.commcan, cTempl.cohhow ];
			coaCybTemplates1 = [ cTempl.cybhg, cTempl.cybgr, cTempl.cybhg, cTempl.cybhg, cTempl.cybgr, cTempl.cybhg ];
			coaCybTemplates2 = [ cTempl.scymc, cTempl.cybgr, cTempl.scymc, cTempl.cybhg ];
			coaCybTemplates3 = [ cTempl.cybrp, cTempl.cybhg, cTempl.cybca, cTempl.cybhg, cTempl.cybhg ];
			coaVtolTemplates = [ cTempl.colcbomv, cTempl.colhmgv, cTempl.colcanv ];

			royCentralFactoryTemplates = [ cTempl.rollant, cTempl.rolhmgt, cTempl.romacant, cTempl.rolmra, cTempl.rominft ];
			royOuterFactoryTemplates = [ cTempl.romsenst, cTempl.romrmorht, cTempl.romacant, cTempl.romagt, cTempl.rombbt ];
			royHoverFactoryTemplates = [ cTempl.rollanh, cTempl.romhvcanh, cTempl.romhvcanh, cTempl.romagh, cTempl.rommrah ];
			royMainFactoryTemplates = [ cTempl.romtkt, cTempl.romacant, cTempl.romsenst, cTempl.rohhcant, cTempl.romagt, cTempl.romrmort ];
			roySouthCybTemplates = [ cTempl.cybhg, cTempl.cybla, cTempl.cybhg, cTempl.cybhg, cTempl.cybla, cTempl.scyhc ];
			royHowitzerCybTemplates = [ cTempl.cybth, cTempl.cybla, cTempl.scyhc, cTempl.cybag, cTempl.cybla, cTempl.scyac ]
			royOuterCybTemplates = [ cTempl.cybla, cTempl.cybag, cTempl.cybla, cTempl.cybag, cTempl.cybth, cTempl.cybth ];
			royMainCybTemplates = [ cTempl.scyac, cTempl.cybth, cTempl.cybag, cTempl.cybla ];
			royVtolTemplates = [ cTempl.rollanv, cTempl.rolagv ];

			resSubTemplates = [ cTempl.remmcan, cTempl.remhmgt, cTempl.rempod, cTempl.relsenst, cTempl.remmor, cTempl.remflam, cTempl.rehmcant ];
			resSubCybTemplates = [ cTempl.cybhg, cTempl.cybca, cTempl.cybfl, cTempl.cybca, cTempl.cybhg ];
			break;
		default:
			resFactoryTemplates = [ cTempl.rellcan, cTempl.reltwmgw, cTempl.relpodw, cTempl.relflamw ];
			resHvyFactoryTemplates = [ cTempl.rellcan, cTempl.relmor, cTempl.relpodw, cTempl.reltwmgw, cTempl.relsensw ];
			resCybFactoryTemplates1 = [ cTempl.cybmg, cTempl.cybca, cTempl.cybmg, cTempl.cybmg ];
			resCybFactoryTemplates2 = [ cTempl.cybca, cTempl.cybmg, cTempl.cybca ];

			ampPortTemplates = [ cTempl.amlpod, cTempl.amlsar, cTempl.amlpod ];
			ampMainTemplates1 = [ cTempl.ammlan, cTempl.ammhmg, cTempl.amlsar ];
			ampMainTemplates2 = [ cTempl.ammhmg, cTempl.ammmra, cTempl.amlpod ];
			ampVtolTemplates = [ cTempl.amllanv, cTempl.amlpodv, cTempl.amlhmgv, cTempl.amlbbv ];

			helFactoryTemplates = [ cTempl.helflam, cTempl.hellrep, cTempl.heltwmg, cTempl.helflam, cTempl.hellcan ];
			helCybTemplates1 = [ cTempl.cybmg, cTempl.cybfl, cTempl.cybfl ];
			helCybTemplates2 = [ cTempl.cybca, cTempl.cybfl, cTempl.cybfl ];

			coaMainTemplates1 = [ cTempl.colpod, cTempl.comhmorht, cTempl.commcan, cTempl.comsensht, cTempl.colsar, cTempl.commcan, cTempl.comhmg ];
			coaMainTemplates2 = [ cTempl.cohhcan, cTempl.comhmg, cTempl.commcan ];
			coaCybTemplates1 = [ cTempl.cybhg, cTempl.cybgr, cTempl.cybhg, cTempl.cybhg, cTempl.cybgr, cTempl.cybhg ];
			coaCybTemplates2 = [ cTempl.scymc, cTempl.cybgr, cTempl.scymc, cTempl.cybhg ];
			coaCybTemplates3 = [ cTempl.cybrp, cTempl.cybhg, cTempl.cybca, cTempl.cybhg, cTempl.cybhg ];
			coaVtolTemplates = [ cTempl.colcbomv, cTempl.colhmgv, cTempl.colcanv ];

			royCentralFactoryTemplates = [ cTempl.rollant, cTempl.rolhmgt, cTempl.romacant, cTempl.rolmra ];
			royOuterFactoryTemplates = [ cTempl.romsenst, cTempl.romrmorht, cTempl.romacant, cTempl.rolhmgt ];
			royHoverFactoryTemplates = [ cTempl.rollanh, cTempl.romhvcanh, cTempl.romhvcanh, cTempl.rolhmgh, cTempl.rommrah ];
			royMainFactoryTemplates = [ cTempl.rollant, cTempl.romacant, cTempl.romsenst, cTempl.rohhcant, cTempl.romagt, cTempl.romrmorht ];
			roySouthCybTemplates = [ cTempl.cybhg, cTempl.cybla, cTempl.cybhg, cTempl.cybhg, cTempl.cybla ];
			royHowitzerCybTemplates = [ cTempl.cybth, cTempl.cybla, cTempl.scyhc, cTempl.cybag, cTempl.cybla, cTempl.scyac ]
			royOuterCybTemplates = [ cTempl.cybla, cTempl.cybag, cTempl.cybla, cTempl.cybag, cTempl.cybth, cTempl.cybth ];
			royMainCybTemplates = [ cTempl.scyac, cTempl.cybth, cTempl.cybag, cTempl.cybla ];
			royVtolTemplates = [ cTempl.rollanv, cTempl.rolagv ];

			resSubTemplates = [ cTempl.remmcan, cTempl.remhmgt, cTempl.relpodht, cTempl.relsenst, cTempl.remmor, cTempl.remflam ];
			resSubCybTemplates = [ cTempl.cybmg, cTempl.cybca, cTempl.cybfl, cTempl.cybca, cTempl.cybmg ];
			break;
	}

	// Data for factories set at the start of the game
	camSetFactories({
		"resistanceFactory": {
			assembly: "resFactoryAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "resFactoryAssembly",
				repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(70)),
			templates: resFactoryTemplates
		},
		"resistanceHeavyFactory": {
			assembly: "resHeavyFacAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "resHeavyFacAssembly",
				repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(90)),
			templates: resHvyFactoryTemplates
		},
		"resistanceCybFact1": {
			assembly: "resCyborgAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "resCyborgAssembly",
				repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(55)),
			templates: resCybFactoryTemplates1
		},
		"resistanceCybFact2": {
			assembly: "resCyborgAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "resCyborgAssembly",
				repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(65)),
			templates: resCybFactoryTemplates2
		},
		"amphosPortFactory": {
			assembly: "ampPortAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				regroup: false,
				fallback: "ampPortAssembly",
				repair: 75
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(30)),
			templates: ampPortTemplates
		},
		"amphosMainFactory1": {
			assembly: "ampMainAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				regroup: false,
				fallback: "ampMainAssembly",
				repair: 75
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(55)),
			templates: ampMainTemplates1
		},
		"amphosMainFactory2": {
			assembly: "ampMainAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				regroup: false,
				fallback: "ampMainAssembly",
				repair: 75
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(45)),
			templates: ampMainTemplates2
		},
		"amphosVtolFactory": {
			assembly: "ampVTOLAssembly",
			order: CAM_ORDER_ATTACK,
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(30)),
			templates: ampVtolTemplates
		},
		"hellraiserFactory": {
			assembly: "helFactoryAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				regroup: false,
				fallback: "helFactoryAssembly",
				repair: 25
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(65)),
			templates: helFactoryTemplates
		},
		"hellraiserCybFac1": {
			assembly: "helCyborgAssembly1",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				regroup: false,
				fallback: "helCyborgAssembly1",
				repair: 25
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(45)),
			templates: helCybTemplates1
		},
		"hellraiserCybFac2": {
			assembly: "helCyborgAssembly2",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				regroup: false,
				fallback: "helCyborgAssembly2",
				repair: 25
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(50)),
			templates: helCybTemplates2
		},
		"coalitionFactory1": {
			assembly: "coaFactoryAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "coaFactoryAssembly"
				//repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(85)),
			templates: coaMainTemplates1
		},
		"coalitionFactory2": {
			assembly: "coaFactoryAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "coaFactoryAssembly"
				//repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(115)),
			templates: coaMainTemplates2
		},
		"coalitionCybFactory1": {
			assembly: "coaCyborgAssembly1",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "coaCyborgAssembly1"
				//repair: 40
			},
			groupSize: 5,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(45)),
			templates: coaCybTemplates1
		},
		"coalitionCybFactory2": {
			assembly: "coaCyborgAssembly2",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "coaCyborgAssembly2"
				//repair: 40
			},
			groupSize: 4,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(55)),
			templates: coaCybTemplates2
		},
		"coalitionCybFactory3": {
			assembly: "coaCyborgAssembly3",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "coaCyborgAssembly3"
				//repair: 40
			},
			groupSize: 4,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(50)),
			templates: coaCybTemplates3
		},
		"coalitionVtolFactory": {
			assembly: "coaVTOLAssembly",
			order: CAM_ORDER_ATTACK,
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(50)),
			templates: coaVtolTemplates
		},
		"royalistCentralFactory": {
			assembly: "royCentralFactoryAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "royCentralFactoryAssembly",
				repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(85)),
			templates: royCentralFactoryTemplates
		},
		"royalistOuterFactory": {
			assembly: "royOuterFactoryAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "royOuterFactoryAssembly",
				repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(110)),
			templates: royOuterFactoryTemplates
		},
		"royalistHoverFactory": {
			assembly: "royHoverAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				regroup: false,
				fallback: "royHoverAssembly",
				repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(85)),
			templates: royHoverFactoryTemplates
		},
		"royalistMainFactory": {
			assembly: "royMainAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "royMainFactoryAssembly",
				repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(60)),
			templates: royMainFactoryTemplates
		},
		"royalistSouthCyborgFac": {
			assembly: "roySouthCyborgAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				regroup: false
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(40)),
			templates: roySouthCybTemplates
		},
		"royalistHowitCyborgFac": {
			assembly: "royHowitCyborgAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "royHowitCyborgAssembly",
				repair: 40
			},
			groupSize: 5,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(65)),
			templates: royHowitzerCybTemplates
		},
		"royalistOuterCyborgFac": {
			assembly: "royOuterCyborgAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "royOuterCyborgAssembly",
				repair: 40
			},
			groupSize: 4,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(65)),
			templates: royOuterCybTemplates
		},
		"royalistMainCyborgFac": {
			assembly: "royMainAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "royMainCyborgAssembly",
				repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(45)),
			templates: royMainCybTemplates
		},
		"royalistOuterVtolFac": {
			assembly: "royOuterVTOLAssembly",
			order: CAM_ORDER_ATTACK,
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(120)),
			templates: royVtolTemplates
		},
		"royalistMainVtolFac1": {
			assembly: "royMainVTOLAssembly",
			order: CAM_ORDER_ATTACK,
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(120)),
			templates: royVtolTemplates
		},
		"royalistMainVtolFac2": {
			assembly: "royMainVTOLAssembly",
			order: CAM_ORDER_ATTACK,
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(200)),
			templates: royVtolTemplates
		},
		// These factories start off unbuilt
		"resistanceSubFactory": {
			assembly: "resSubAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "resSubAssembly",
				repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(115)),
			templates: resSubTemplates
		},
		"resistanceSubCybFactory": {
			assembly: "resSubAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "resSubAssembly",
				repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(65)),
			templates: resSubCybTemplates
		},
		"royalistCoaRepFactory": {
			assembly: "coaFactoryAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "coaFactoryAssembly",
				repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(115)),
			templates: royOuterFactoryTemplates
		},
		"royalistCoaRepCybFactory": {
			assembly: "coaCyborgAssembly2",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "coaCyborgAssembly2",
				repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(90)),
			templates: royOuterCybTemplates
		},
		"royalistAmpRepFactory": {
			assembly: "ampMainAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "ampMainAssembly",
				repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(115)),
			templates: royHoverFactoryTemplates
		},
		"royalistAmpRepVtolFactory": {
			assembly: "ampVTOLAssembly",
			order: CAM_ORDER_ATTACK,
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(180)),
			templates: royVtolTemplates
		},
		"royalistPortFactory": {
			assembly: "ampPortAssembly",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "ampPortAssembly",
				repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(100)),
			templates: royCentralFactoryTemplates
		},
		"royalistHelRepCybFactory": {
			assembly: "helCyborgAssembly1",
			order: CAM_ORDER_ATTACK,
			data: {
				targetPlayer: CAM_HUMAN_PLAYER,
				fallback: "helCyborgAssembly1",
				repair: 40
			},
			groupSize: 3,
			throttle: camChangeOnDiff(camSecondsToMilliseconds(95)),
			templates: royHowitzerCybTemplates
		},
	});

	// Used to reassign factories if they have been rebuilt
	const mis_factoryPlacementData = [
		{
			label: "resistanceFactory",
			player: CAM_THE_RESISTANCE,
			x: getObject("resistanceFactory").x,
			y: getObject("resistanceFactory").y,
			stattype: FACTORY
		},
		{
			label: "resistanceHeavyFactory",
			player: CAM_THE_RESISTANCE,
			x: getObject("resistanceHeavyFactory").x,
			y: getObject("resistanceHeavyFactory").y,
			stattype: FACTORY
		},
		{
			label: "resistanceCybFact1",
			player: CAM_THE_RESISTANCE,
			x: getObject("resistanceCybFact1").x,
			y: getObject("resistanceCybFact1").y,
			stattype: CYBORG_FACTORY
		},
		{
			label: "resistanceCybFact2",
			player: CAM_THE_RESISTANCE,
			x: getObject("resistanceCybFact2").x,
			y: getObject("resistanceCybFact2").y,
			stattype: CYBORG_FACTORY
		},
		{
			label: "amphosPortFactory",
			player: CAM_AMPHOS,
			x: getObject("amphosPortFactory").x,
			y: getObject("amphosPortFactory").y,
			stattype: FACTORY
		},
		{
			label: "amphosMainFactory1",
			player: CAM_AMPHOS,
			x: getObject("amphosMainFactory1").x,
			y: getObject("amphosMainFactory1").y,
			stattype: FACTORY
		},
		{
			label: "amphosMainFactory2",
			player: CAM_AMPHOS,
			x: getObject("amphosMainFactory2").x,
			y: getObject("amphosMainFactory2").y,
			stattype: FACTORY
		},
		{
			label: "amphosVtolFactory",
			player: CAM_AMPHOS,
			x: getObject("amphosVtolFactory").x,
			y: getObject("amphosVtolFactory").y,
			stattype: VTOL_FACTORY
		},
		{
			label: "hellraiserFactory",
			player: CAM_HELLRAISERS,
			x: getObject("hellraiserFactory").x,
			y: getObject("hellraiserFactory").y,
			stattype: FACTORY
		},
		{
			label: "hellraiserCybFac1",
			player: CAM_HELLRAISERS,
			x: getObject("hellraiserCybFac1").x,
			y: getObject("hellraiserCybFac1").y,
			stattype: CYBORG_FACTORY
		},
		{
			label: "hellraiserCybFac2",
			player: CAM_HELLRAISERS,
			x: getObject("hellraiserCybFac2").x,
			y: getObject("hellraiserCybFac2").y,
			stattype: CYBORG_FACTORY
		},
		{
			label: "coalitionFactory1",
			player: CAM_THE_COALITION,
			x: getObject("coalitionFactory1").x,
			y: getObject("coalitionFactory1").y,
			stattype: FACTORY
		},
		{
			label: "coalitionFactory2",
			player: CAM_THE_COALITION,
			x: getObject("coalitionFactory2").x,
			y: getObject("coalitionFactory2").y,
			stattype: FACTORY
		},
		{
			label: "coalitionCybFactory1",
			player: CAM_THE_COALITION,
			x: getObject("coalitionCybFactory1").x,
			y: getObject("coalitionCybFactory1").y,
			stattype: CYBORG_FACTORY
		},
		{
			label: "coalitionCybFactory2",
			player: CAM_THE_COALITION,
			x: getObject("coalitionCybFactory2").x,
			y: getObject("coalitionCybFactory2").y,
			stattype: CYBORG_FACTORY
		},
		{
			label: "coalitionCybFactory3",
			player: CAM_THE_COALITION,
			x: getObject("coalitionCybFactory3").x,
			y: getObject("coalitionCybFactory3").y,
			stattype: CYBORG_FACTORY
		},
		{
			label: "coalitionVtolFactory",
			player: CAM_THE_COALITION,
			x: getObject("coalitionVtolFactory").x,
			y: getObject("coalitionVtolFactory").y,
			stattype: VTOL_FACTORY
		},
		{
			label: "royalistCentralFactory",
			player: CAM_ROYALISTS,
			x: getObject("royalistCentralFactory").x,
			y: getObject("royalistCentralFactory").y,
			stattype: FACTORY
		},
		{
			label: "royalistOuterFactory",
			player: CAM_ROYALISTS,
			x: getObject("royalistOuterFactory").x,
			y: getObject("royalistOuterFactory").y,
			stattype: FACTORY
		},
		{
			label: "royalistHoverFactory",
			player: CAM_ROYALISTS,
			x: getObject("royalistHoverFactory").x,
			y: getObject("royalistHoverFactory").y,
			stattype: FACTORY
		},
		{
			label: "royalistMainFactory",
			player: CAM_ROYALISTS,
			x: getObject("royalistMainFactory").x,
			y: getObject("royalistMainFactory").y,
			stattype: FACTORY
		},
		{
			label: "royalistSouthCyborgFac",
			player: CAM_ROYALISTS,
			x: getObject("royalistSouthCyborgFac").x,
			y: getObject("royalistSouthCyborgFac").y,
			stattype: CYBORG_FACTORY
		},
		{
			label: "royalistHowitCyborgFac",
			player: CAM_ROYALISTS,
			x: getObject("royalistHowitCyborgFac").x,
			y: getObject("royalistHowitCyborgFac").y,
			stattype: CYBORG_FACTORY
		},
		{
			label: "royalistOuterCyborgFac",
			player: CAM_ROYALISTS,
			x: getObject("royalistOuterCyborgFac").x,
			y: getObject("royalistOuterCyborgFac").y,
			stattype: CYBORG_FACTORY
		},
		{
			label: "royalistMainCyborgFac",
			player: CAM_ROYALISTS,
			x: getObject("royalistMainCyborgFac").x,
			y: getObject("royalistMainCyborgFac").y,
			stattype: CYBORG_FACTORY
		},
		{
			label: "royalistOuterVtolFac",
			player: CAM_ROYALISTS,
			x: getObject("royalistOuterVtolFac").x,
			y: getObject("royalistOuterVtolFac").y,
			stattype: VTOL_FACTORY
		},
		{
			label: "royalistMainVtolFac1",
			player: CAM_ROYALISTS,
			x: getObject("royalistMainVtolFac1").x,
			y: getObject("royalistMainVtolFac1").y,
			stattype: VTOL_FACTORY
		},
		{
			label: "royalistMainVtolFac2",
			player: CAM_ROYALISTS,
			x: getObject("royalistMainVtolFac2").x,
			y: getObject("royalistMainVtolFac2").y,
			stattype: VTOL_FACTORY
		},
		// These factories start off unbuilt
		{
			label: "resistanceSubFactory",
			player: CAM_THE_RESISTANCE,
			x: 20,
			y: 70,
			stattype: FACTORY
		},
		{
			label: "resistanceSubCybFactory",
			player: CAM_THE_RESISTANCE,
			x: 25,
			y: 70,
			stattype: CYBORG_FACTORY
		},
		{
			label: "royalistCoaRepFactory",
			player: CAM_ROYALISTS,
			x: 5,
			y: 49,
			stattype: FACTORY
		},
		{
			label: "royalistCoaRepCybFactory",
			player: CAM_ROYALISTS,
			x: 6,
			y: 46,
			stattype: CYBORG_FACTORY
		},
		{
			label: "royalistAmpRepFactory",
			player: CAM_ROYALISTS,
			x: 245,
			y: 141,
			stattype: FACTORY
		},
		{
			label: "royalistAmpRepVtolFactory",
			player: CAM_ROYALISTS,
			x: 245,
			y: 147,
			stattype: VTOL_FACTORY
		},
		{
			label: "royalistPortFactory",
			player: CAM_ROYALISTS,
			x: 140,
			y: 178,
			stattype: FACTORY
		},
		{
			label: "royalistHelRepCybFactory",
			player: CAM_ROYALISTS,
			x: 22,
			y: 135,
			stattype: CYBORG_FACTORY
		},
	];

	gameState = {
		funny: 0,
		oopsieDaisies: 0,
		playerColour: playerData[0].colour,
		allowColourChange: true,
		allyVisionEnabled: tweakOptions.fk_allyVision,
		// How far the player has progressed, used to determine some faction behaviours
		// phase 0: Player has not yet allied with or eradicated the Resistance, most factions are idle.
		// phase 1: Player has progressed past the Resistance. Hellraiser and AMPHOS factories may now become active.
		// phase 2: Player has interacted with some factions/discovered royalist FOBs. All factories are active and Royalists get progressive upgrades.
		// phase 3: Player has interacted with most factions/has approached main Royalist base. Royalists can now launch assaults and upgrades get faster.
		phase: 0,
		themCount: 0, // How many times the player has tried to recolor an enemy
		lastSupportUpdate: 0, // Last time support units were called to help the player
		achievementLog: [], // Names of all the achievements earned by the player this game
		messageLog: [], // All the messages the player has gotten
		// numLostToForts: 0, // How many losses the player has taken from enemy Fortresses
		// numLostToHowitzers: 0, // How many losses the player has taken from enemy Howitzers
		// numLostToRipple: 0, // How many losses the player has taken from enemy Ripple Rockets
		endCountdownTime: 30, // How many seconds until the victory screen, ticks down when Royalists are eradicated
		unitLost: false, // Whether the player has lost a unit
		builtCommander: false, // Whether the player has built a commander
		artifacts: { // Used to remember if specific artifacts have been dropped
			chainGunProgression: 0, // How many chaingun upgrades have been dropped
			commandProgression: 0, // How many command-control upgrades have been dropped
			hmgDrop: false, // Whether the player has caused a specific artifact to drop
			compositeDrop: false,
			lancerDrop: false,
			pepperDrop: false,
			cycloneDrop: false,
			powModDrop: false,
			resModDrop: false,
			vtolDrop: false,
			infernoDrop: false,
			hvyCanDrop: false,
			engineerDrop: false,
			retriDrop: false,
		},
		resistance: {
			cyborgEncounterGroup: camMakeGroup("resCybEncounterGroup"), // group IDs for the encounter at the start of the game
			sensorEncounterGroup: camMakeGroup("resSensEncounterGroup"),
			secondEncounterGroup: camMakeGroup("resEncounter2Group"),
			pythonSpotted: false, // Whether the player has spotted the Resistance Python tank
			storedRank: 0, // The rank to give to the Resistance commander when rebuilt.
			// Faction alliance states can be...
			// NEUTRAL: Is not allied with the player, but will not go out of their way to attack (outside of scripted encounters).
			// OFFER: Is offering to ally with the player, will usually also retract patrol groups while doing so.
			// ALLIED: Is allied with the player, and will seek to assist them in battle.
			// HOSTILE: Is actively attempting to attack the player's stuff.
			// ERADICATED: All factories and units have been destroyed.
			allianceState: "NEUTRAL",
			groundFactoryState: "DISABLED",
			maxUnmanagedUnits: 20,
			groups: {
				coastPatrolGroup: { // Patrols along the east coast area
					id: camNewGroup(), // This stores the group ID for adding more units later
					minSize: 3, // Minimum size of the group before it starts executing orders
					maxSize: 8, // Maximum size of the group before no more units will be added
					fallbackPos: camMakePos("resFactoryAssembly"), // Position to fall back to if below minSize
					order: CAM_ORDER_PATROL, // Main order of the group
					data: { // Order data
						pos: [
							camMakePos("centralPos12"),
							camMakePos("centralPos14"),
							camMakePos("centralPos18")
						],
						interval: camSecondsToMilliseconds(12),
						repair: 65
					}
				},
				playerSupportGroup: { // Assists the player in combat
					id: camNewGroup(),
					minSize: 3,
					maxSize: 4,
					fallbackPos: camMakePos("resHeavyFacAssembly"),
					order: CAM_ORDER_DEFEND,
					data: {
						pos: camMakePos("resHeavyFacAssembly"),
						radius: 20,
						repair: 65
					}
				},
				commanderGroup: { // Follows the Resistance commander
					id: camNewGroup(),
					order: CAM_ORDER_FOLLOW,
					data: {
						leader: "resCommander",
						order: CAM_ORDER_DEFEND,
						data: {
							pos: camMakePos("resFactoryAssembly"),
							radius: 18,
							repair: 65,
						},
						repair: 65,
						removable: false
					}
				}
			}
		},
		amphos: {
			allianceState: "NEUTRAL",
			groundFactoryState: "DISABLED",
			vtolFactoryState: "DISABLED",
			numDestroyed: 0, // Number of objects destroyed by the player
			pitched: false, // Whether AMPHOS has pitched their alliance to the player
			requireNW: true, // Whether AMPHOS requires the NW island to be under their control to negotiate
			maxUnmanagedUnits: 30,
			groups: {
				commanderGroup: { // Follows the AMPHOS commander
					id: camNewGroup(),
					order: CAM_ORDER_FOLLOW,
					data: {
						leader: "ampCommander",
						order: CAM_ORDER_ATTACK,
						data: {
							repair: 75
						},
						repair: 75,
						removable: false
					}
				},
				playerSupportGroup: { // Assists the player in combat (if the AMPHOS commander is dead)
					id: camNewGroup(),
					minSize: 8,
					maxSize: 12,
					fallbackPos: camMakePos("ampMainAssembly"),
					order: CAM_ORDER_DEFEND,
					data: {
						pos: camMakePos("eastPos2"),
						radius: 30,
						repair: 75
					}
				},
				northPatrolGroup: { // Patrols the northern island areas
					id: camNewGroup(),
					minSize: 3,
					maxSize: 8,
					fallbackPos: camMakePos("ampMainAssembly"),
					order: CAM_ORDER_PATROL,
					data: {
						pos: [
							camMakePos("eastPos3"),
							camMakePos("eastPos4"),
							camMakePos("eastPos7")
						],
						interval: camSecondsToMilliseconds(10),
						repair: 75
					}
				},
				southPatrolGroup: { // Patrols the southern islands and river area
					id: camNewGroup(),
					minSize: 3,
					maxSize: 8,
					fallbackPos: camMakePos("ampMainAssembly"),
					order: CAM_ORDER_PATROL,
					data: {
						pos: [
							camMakePos("eastPos9"),
							camMakePos("eastPos10"),
							camMakePos("eastPos12")
						],
						interval: camSecondsToMilliseconds(10),
						repair: 75
					}
				}
			},
			mainVTOLGroup: { // Main VTOL force
				id: camNewGroup(),
				minSize: 3,
				maxSize: 9,
				order: CAM_ORDER_ATTACK,
				data: {
					pos: camMakePos("playerBasePos")
				}
			}
		},
		hellraisers: {
			allianceState: "NEUTRAL",
			groundFactoryState: "DISABLED",
			pitched: false,
			totalStructs: enumStruct(CAM_HELLRAISERS).length, // Max number of Hellraiser structs
			structThreshold: enumStruct(CAM_HELLRAISERS).length, // How many Hellraiser structs must exist to start negotiations
			lzDiscovered: false, // Whether there is a beacon on the Hellraiser's LZ
			maxUnmanagedUnits: 20,
			groups: {
				playerSupportGroup: { // Assists the player in combat
					id: camNewGroup(),
					minSize: 3,
					maxSize: 18,
					fallbackPos: camMakePos("helFactoryAssembly"),
					order: CAM_ORDER_DEFEND,
					data: {
						pos: camMakePos("helFactoryAssembly"),
						radius: 22,
						repair: 30
					}
				},
				southPatrolGroup: { // Patrols the southern parts of hellraiser territories
					id: camNewGroup(),
					minSize: 3,
					maxSize: 8,
					fallbackPos: camMakePos("helFactoryAssembly"),
					order: CAM_ORDER_PATROL,
					data: {
						pos: [
							camMakePos("southPos8"),
							camMakePos("southPos9"),
							camMakePos("southPos10")
						],
						interval: camSecondsToMilliseconds(18),
						repair: 30
					}
				},
				eastPatrolGroup: { // Patrols the eastern parts of hellraiser territories
					id: camNewGroup(),
					minSize: 3,
					maxSize: 8,
					order: CAM_ORDER_PATROL,
					fallbackPos: camMakePos("helFactoryAssembly"),
					data: {
						pos: [
							camMakePos("southPos5"),
							camMakePos("southPos6"),
							camMakePos("southPos7")
						],
						interval: camSecondsToMilliseconds(18),
						repair: 30
					}
				},
				centralPatrolGroup: { // Patrols the central factory area
					id: camNewGroup(),
					minSize: 3,
					maxSize: 10,
					order: CAM_ORDER_PATROL,
					fallbackPos: camMakePos("helFactoryAssembly"),
					data: {
						pos: [
							camMakePos("centralPos4"),
							camMakePos("centralPos5"),
							camMakePos("centralPos1"),
							camMakePos("centralPos6"),
							camMakePos("centralPos9"),
							camMakePos("centralPos10")
						],
						interval: camSecondsToMilliseconds(18),
						repair: 30
					}
				}
			}
		},
		coalition: {
			allianceState: "NEUTRAL",
			groundFactoryState: "DISABLED",
			vtolFactoryState: "DISABLED",
			tolerance: 8, // How many Coalition units the player can destroy before they get mad
			pitched: false,
			proxyHostile: false, // Appear hostile, but don't activate factories yet.
			allowAlliance: false, // Whether the Coalition will allow the player to ally with them (given they meet requirements to negotiate)
			offensive: false, // Whether the Coalition has launched a suprise offensive against the Royalists
			maxUnmanagedUnits: 30,
			groups: {
				commanderGroup: { // Follows the Coalition commander
					id: camNewGroup(),
					order: CAM_ORDER_FOLLOW,
					data: {
						leader: "coaCommander",
						order: CAM_ORDER_ATTACK,
						data: {
							repair: 65
						},
						repair: 65,
						removable: false
					}
				},
				playerSupportGroup: { // Assists the player in combat (if the Coalition commander is dead)
					id: camNewGroup(),
					minSize: 3,
					maxSize: 14,
					fallbackPos: camMakePos("westPos3"),
					order: CAM_ORDER_DEFEND,
					data: {
						pos: camMakePos("westPos3"),
						repair: 80
					}
				},
				southPatrolGroup: { // Patrols the southern area near the south bridge
					id: camNewGroup(),
					minSize: 3,
					maxSize: 11,
					fallbackPos: camMakePos("westPos1"),
					order: CAM_ORDER_PATROL,
					data: {
						pos: [
							camMakePos("westPos6"),
							camMakePos("westPos7"),
							camMakePos("westPos8")
						],
						interval: camSecondsToMilliseconds(20),
						repair: 40
					}
				},
				eastPatrolGroup: { // Patrols the eastern area near the river delta
					id: camNewGroup(),
					minSize: 3,
					maxSize: 14,
					fallbackPos: camMakePos("westPos2"),
					order: CAM_ORDER_PATROL,
					data: {
						pos: [
							camMakePos("westPos4"),
							camMakePos("westPos5"),
							camMakePos("westPos11"),
							camMakePos("westPos10"),
							camMakePos("westPos9")
						],
						interval: camSecondsToMilliseconds(25),
						repair: 40
					}
				}
			},
			mainVTOLGroup: { // Main VTOL force
				id: camNewGroup(),
				minSize: 3,
				maxSize: 7,
				order: CAM_ORDER_DEFEND,
				data: {
					pos: camMakePos("coaVTOLAssembly")
				}
			},
			lzRequests: {
				// True if waiting for units
				// False if not waiting or destroyed
				hellraiserLZ: false,
				westGateLZ: false,
				coastLZ: false
			}
		},
		royalists: {
			groundFactoryState: "DISABLED",
			hoverFactoryState: "DISABLED",
			vtolFactoryState: "DISABLED",
			assaultFactoryState: "DISABLED",
			howitzerLzDiscovered: false,
			coastLzDiscovered: false,
			commanderSpotted: false, // Whether the player has spotted the Royalist heavy command tank
			assaultTarget: CAM_THE_COALITION, // Player index of the assault's main target
			assaultMethod: "GROUND", // What type of units will be used? "GROUND" or "HOVER"
			assaultComp: (difficulty < HARD) ? "MIXED" : "HEAVIES", // Decide the overall unit composition for the assault force.
			assaultPhase: 0, // Used to more finely control the way the assault force moves towards it's target
			assaultFull: false, // Whether the assault group was allowed to be filled completely
			pResList: mis_royalistProgressiveRes1, // A list of upgrades slowly given to the Royalists over time
			underAttack: false, // Whether the Royalist main base is under attack, causes alternate group management
			attacked: false, // Whether the Royalist main base has been attacked before
			fakeout: false, // Whether the Royalists are offering negotiations with the player
			fakeoutTime: 0, // Time when the negotiations were offered
			tier2Granted: false, // Whether the Royalists have started researching end-game technology
			allowIncenHowit: false, // Whether the Royalists have eradicated the Hellraisers, thus granting them access to Incendiary Howitzers
			allowTwinAssault: false, // Whether the Royalists are allowed to produce twin assault weapons
			maxUnmanagedUnits: 30,
			groundGroups: { // NOTE: Non-refilling patrol groups are not included here
				groundReclaimerGroup: { // Claims FOBs back from the player and their allies
					id: camNewGroup(),
					minSize: 6,
					maxSize: 8 + (difficulty * 3),
					fallbackPos: camMakePos("innerPos2"),
					order: CAM_ORDER_COMPROMISE,
					data: {
						pos: camMakePos("royOuterFactoryAssembly"),
						repair: 40,
						regroup: true,
						count: -1
					}
				},
				centralCommanderGroup: { // Follows the Royalist commander guarding the central factory area
					id: camNewGroup(),
					order: CAM_ORDER_FOLLOW,
					data: {
						leader: "royCentralCommander",
						order: CAM_ORDER_ATTACK,
						data: {
							repair: 40
						},
						repair: 40,
						removable: false
					}
				},
				heavyCommanderGroup: { // Follows the Royalist commander defending the outer base
					id: camNewGroup(),
					order: CAM_ORDER_FOLLOW,
					data: {
						leader: "royHvyCommander",
						order: CAM_ORDER_ATTACK,
						data: {
							repair: 25
						},
						repair: 50,
						removable: false
					}
				},
				southPatrolGroup: { // Patrols the area around the south FOB
					id: camNewGroup(),
					minSize: 3,
					maxSize: 8,
					fallbackPos: camMakePos("centralPos13"),
					order: CAM_ORDER_PATROL,
					data: {
						pos: [
							camMakePos("southPos1"),
							camMakePos("southPos2"),
							camMakePos("southPos3"),
							camMakePos("southPos4")
						],
						interval: camSecondsToMilliseconds(25),
						repair: 40
					}
				},
				coastPatrolGroup: { // Patrols along the east coast area
					id: camNewGroup(),
					minSize: 3,
					maxSize: MIS_ROYALIST_GARRISON_SIZE,
					fallbackPos: camMakePos("centralPos16"),
					order: CAM_ORDER_PATROL,
					data: {
						pos: [
							camMakePos("centralPos17"),
							camMakePos("centralPos18"),
							camMakePos("centralPos12")
						],
						interval: camSecondsToMilliseconds(28),
						repair: 40
					}
				},
				pitPatrolGroup: { // Patrols the area between the Royalist and Coalition bases
					id: camNewGroup(),
					minSize: 3,
					maxSize: 8,
					fallbackPos: camMakePos("outerPos10"),
					order: CAM_ORDER_PATROL,
					data: {
						pos: [
							camMakePos("centralPos3"),
							camMakePos("centralPos2"),
							camMakePos("outerPos13"),
							camMakePos("outerPos14")
						],
						interval: camSecondsToMilliseconds(14),
						repair: 40
					}
				},
				plainsPatrolGroup: { // Patrols areas of the sunken plains
					id: camNewGroup(),
					minSize: 3,
					maxSize: 12,
					fallbackPos: camMakePos("centralPos2"),
					order: CAM_ORDER_PATROL,
					data: {
						pos: [
							camMakePos("westPos4"),
							camMakePos("westPos5"),
							camMakePos("westPos11"),
							camMakePos("westPos10"),
							camMakePos("westPos9"),
							camMakePos("westPos8")
						],
						interval: camSecondsToMilliseconds(23),
						repair: 40
					}
				},
				// These groups guard specific royalist bases
				southAAGarrison: {
					id: camNewGroup(),
					minSize: 1,
					maxSize: MIS_ROYALIST_GARRISON_SIZE,
					order: CAM_ORDER_DEFEND,
					data: {
						radius: 13,
						pos: camMakePos("innerPos1"),
						repair: 40
					}
				},
				westGateGarrison: { 
					id: camNewGroup(),
					minSize: 1,
					maxSize: MIS_ROYALIST_GARRISON_SIZE,
					order: CAM_ORDER_DEFEND,
					data: {
						radius: 14,
						pos: camMakePos("outerPos11")
					}
				},
				southGateGarrison: { 
					id: camNewGroup(),
					minSize: 1,
					maxSize: MIS_ROYALIST_GARRISON_SIZE,
					order: CAM_ORDER_DEFEND,
					data: {
						radius: 20,
						pos: camMakePos("centralPos16"),
						repair: 40
					}
				},
				checkpointGarrison: { 
					id: camNewGroup(),
					minSize: 1,
					maxSize: MIS_ROYALIST_GARRISON_SIZE,
					order: CAM_ORDER_DEFEND,
					data: {
						radius: 16,
						pos: camMakePos("royalistCheckpoint")
					}
				},
				howitzerGarrison: { 
					id: camNewGroup(),
					minSize: 1,
					maxSize: MIS_ROYALIST_GARRISON_SIZE,
					order: CAM_ORDER_DEFEND,
					data: {
						radius: 15,
						pos: camMakePos("centralPos4")
					}
				},
				centralGarrison: { 
					id: camNewGroup(),
					minSize: 1,
					maxSize: MIS_ROYALIST_GARRISON_SIZE,
					order: CAM_ORDER_DEFEND,
					data: {
						radius: 18,
						pos: camMakePos("centralPos9"),
						repair: 40
					}
				},
				coastGarrison: { 
					id: camNewGroup(),
					minSize: 1,
					maxSize: MIS_ROYALIST_GARRISON_SIZE,
					order: CAM_ORDER_DEFEND,
					data: {
						radius: 18,
						pos: camMakePos("centralPos14")
					}
				},
				riverTownGarrison: { 
					id: camNewGroup(),
					minSize: 1,
					maxSize: MIS_ROYALIST_GARRISON_SIZE,
					order: CAM_ORDER_DEFEND,
					data: {
						radius: 14,
						pos: camMakePos("riverTownFOB")
					}
				},
				plainsGarrison: { 
					id: camNewGroup(),
					minSize: 1,
					maxSize: MIS_ROYALIST_GARRISON_SIZE,
					order: CAM_ORDER_DEFEND,
					data: {
						radius: 12,
						pos: camMakePos("sunkenPlainsFOB")
					}
				},
				bridgeGarrison: { 
					id: camNewGroup(),
					minSize: 1,
					maxSize: MIS_ROYALIST_GARRISON_SIZE,
					order: CAM_ORDER_DEFEND,
					data: {
						radius: 8,
						pos: camMakePos("coalitionBridgeFOB")
					}
				},
				coalitionBaseGarrison: { 
					id: camNewGroup(),
					minSize: 1,
					maxSize: MIS_ROYALIST_GARRISON_SIZE,
					order: CAM_ORDER_DEFEND,
					data: {
						radius: 18,
						pos: camMakePos("westPos2"),
						repair: 40
					}
				}
			},
			hoverGroups: {
				hoverReclaimerGroup: { // Claims FOBs back with violence and speed
					id: camNewGroup(),
					minSize: 6,
					maxSize: 8 + (difficulty * 3),
					fallbackPos: camMakePos("royHoverAssembly"),
					order: CAM_ORDER_COMPROMISE,
					data: {
						pos: camMakePos("royHoverAssembly"),
						repair: 40,
						regroup: true,
						count: -1
					}
				},
				hoverCommanderGroup: { // Follows the Royalist commander patroling the east lake area
					id: camNewGroup(),
					order: CAM_ORDER_FOLLOW,
					data: {
						leader: "royHoverCommander",
						order: CAM_ORDER_ATTACK,
						data: {
							repair: 35
						},
						repair: 35,
						removable: false
					}
				},
				lakePatrolGroup: { // Patrols areas of the eastern lake
					id: camNewGroup(),
					minSize: 3,
					maxSize: 7,
					fallbackPos: camMakePos("centralPos15"),
					order: CAM_ORDER_PATROL,
					data: {
						pos: [
							camMakePos("eastPos3"),
							camMakePos("eastPos4"),
							camMakePos("eastPos5"),
							camMakePos("eastPos7")
						],
						interval: camSecondsToMilliseconds(14),
						repair: 40
					}
				},
				// These are hover-only garrison groups
				northLakeGarrison: { 
					id: camNewGroup(),
					maxSize: MIS_ROYALIST_GARRISON_SIZE,
					order: CAM_ORDER_DEFEND,
					data: {
						radius: 16,
						pos: camMakePos("northLakeFOB"),
						repair: 40
					}
				},
				nwIslandGarrison: { 
					id: camNewGroup(),
					minSize: 1,
					maxSize: MIS_ROYALIST_GARRISON_SIZE,
					order: CAM_ORDER_DEFEND,
					data: {
						radius: 24,
						pos: camMakePos("nwIslandFOB")
					}
				},
				southIslandGarrison: { 
					id: camNewGroup(),
					minSize: 1,
					maxSize: MIS_ROYALIST_GARRISON_SIZE,
					order: CAM_ORDER_DEFEND,
					data: {
						radius: 20,
						pos: camMakePos("southIslandFOB")
					}
				},
				portGarrison: { 
					id: camNewGroup(),
					minSize: 1,
					maxSize: MIS_ROYALIST_GARRISON_SIZE,
					order: CAM_ORDER_DEFEND,
					data: {
						radius: 24,
						pos: camMakePos("ampPortAssembly")
					}
				}
			},
			mainVTOLGroup: { // Main VTOL force
				id: camNewGroup(),
				minSize: 3,
				maxSize: difficulty + 2,
				order: CAM_ORDER_DEFEND,
				data: {
					pos: camMakePos("royMainVTOLAssembly")
				}
			},
			assaultGroup: { // Main assault force
				id: camNewGroup(),
				maxSize: 30 + (difficulty * 10)
			},
			assaultCommandGroup: { // Assigned to assault commander (if there is one)
				id: camNewGroup(),
				order: CAM_ORDER_FOLLOW,
					data: {
						leader: "royAssaultCommander",
						order: CAM_ORDER_ATTACK,
						data: {
							repair: 40
						},
						repair: 50,
						removable: false
					}
			},
			lzRequests: {
				spyLZ: false,
				riverLZ: false,
				howitzerLZ: false,
				mountainLZ: false,
				coastLZ: false
			}
		},
		coalitionVTOLTowers: enumStruct(CAM_THE_COALITION, "Sys-VTOL-RadarTower01").concat(enumStruct(CAM_THE_COALITION, "Sys-VTOL-CB-Tower01")),
		royalistVTOLTowers: enumStruct(CAM_ROYALISTS, "Sys-CO-VTOL-RadarTower01").concat(enumStruct(CAM_ROYALISTS, "Sys-CO-VTOL-CB-Tower01")),
		coalitionVTOLTowerGroups: {}, // These hold the group IDs for VTOLs assigned to VTOL towers
		royalistVTOLTowerGroups: {},
		// This data is used to re-manage factories after being rebuilt
		factoryLabelInfo: mis_factoryPlacementData
	}
}