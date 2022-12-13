var cTempl = {
////////////////////////////////////////////////////////////////////////////////

// CYBORG TEMPLATES
cybrp: { body: "CyborgLightBody", prop: "CyborgLegs", weap: "CyborgRepair" }, // Mechanic Cyborg
cyben: { body: "CyborgLightBody", prop: "CyborgLegs", weap: "CyborgSpade" }, // Combat Engineer Cyborg
cybmg: { body: "CyborgLightBody", prop: "CyborgLegs", weap: "CyborgChaingun" }, // Machinegunner Cyborg
cybca: { body: "CyborgLightBody", prop: "CyborgLegs", weap: "CyborgCannon" }, // Heavy Gunner Cyborg
cybfl: { body: "CyborgLightBody", prop: "CyborgLegs", weap: "CyborgFlamer01" }, // Flamer Cyborg
cybla: { body: "CyborgLightBody", prop: "CyborgLegs", weap: "CyborgRocket" }, // Lancer Cyborg
cybgr: { body: "CyborgLightBody", prop: "CyborgLegs", weap: "Cyb-Wpn-Grenade" }, // Grenadier Cyborg
cybth: { body: "CyborgLightBody", prop: "CyborgLegs", weap: "Cyb-Wpn-Thermite" }, // Thermite Flamer Cyborg
cybag: { body: "CyborgLightBody", prop: "CyborgLegs", weap: "CyborgRotMG" }, // Assault Gunner Cyborg
scymc: { body: "CyborgHeavyBody", prop: "CyborgLegs", weap: "Cyb-Hvywpn-Mcannon" }, // Super Heavy-Gunner Cyborg
scyhc: { body: "CyborgHeavyBody", prop: "CyborgLegs", weap: "Cyb-Hvywpn-HPV" }, // Super HPC Cyborg
scyac: { body: "CyborgHeavyBody", prop: "CyborgLegs", weap: "Cyb-Hvywpn-Acannon" }, // Super Auto-Cannon Cyborg
scytk: { body: "CyborgHeavyBody", prop: "CyborgLegs", weap: "Cyb-Hvywpn-TK" }, // Super Tank-Killer Cyborg
cybls: { body: "CyborgLightBody", prop: "CyborgLegs", weap: "Cyb-Wpn-Laser" }, // Flashlight Gunner Cyborg

// RESISTANCE TEMPLATES
reltruckw: { body: "Body1REC", prop: "wheeled01", weap: "Spade1Mk1" }, // Truck Viper Wheels
reltruckht: { body: "Body1REC", prop: "HalfTrack", weap: "Spade1Mk1" }, // Truck Viper Half-tracks
remtruck: { body: "Body5REC", prop: "HalfTrack", weap: "Spade1Mk1" }, // Truck Cobra Half-tracks

relsensw: { body: "Body1REC", prop: "wheeled01", weap: "SensorTurret1Mk1" }, // Sensor Viper Wheels
relsensht: { body: "Body1REC", prop: "HalfTrack", weap: "SensorTurret1Mk1" }, // Sensor Viper Half-tracks
relsenst: { body: "Body1REC", prop: "tracked01", weap: "SensorTurret1Mk1" }, // Sensor Viper Tracks
remsens: { body: "Body5REC", prop: "HalfTrack", weap: "SensorTurret1Mk1" }, // Sensor Cobra Half-tracks

rellrepw: { body: "Body1REC", prop: "wheeled01", weap: "LightRepair1" }, // Repair Turret Viper Wheels
rellrepht: { body: "Body1REC", prop: "HalfTrack", weap: "LightRepair1" }, // Repair Turret Viper Half-tracks
remlrep: { body: "Body5REC", prop: "HalfTrack", weap: "LightRepair1" }, // Repair Turret Cobra Half-tracks
remhrep: { body: "Body5REC", prop: "HalfTrack", weap: "HeavyRepair" }, // Heavy Repair Turret Cobra Half-tracks

remcomm: { body: "Body5REC", prop: "HalfTrack", weap: "CommandBrain01" }, // Command Turret Cobra Half-tracks
rehcomm: { body: "Body11ABT", prop: "HalfTrack", weap: "CommandBrain01" }, // Command Turret Python Half-tracks

relflamw: { body: "Body1REC", prop: "wheeled01", weap: "Flame1Mk1" }, // Flamer Viper Wheels
relflamht: { body: "Body1REC", prop: "HalfTrack", weap: "Flame1Mk1" }, // Flamer Viper Half-tracks
remflam: { body: "Body5REC", prop: "HalfTrack", weap: "Flame1Mk1" }, // Flamer Cobra Half-tracks
reminf: { body: "Body5REC", prop: "HalfTrack", weap: "Flame2" }, // Inferno Cobra Half-tracks
rehinf: { body: "Body11ABT", prop: "HalfTrack", weap: "Flame2" }, // Inferno Python Half-tracks

rellcan: { body: "Body1REC", prop: "HalfTrack", weap: "Cannon1Mk1" }, // Light Cannon Viper Half-tracks
remlcan: { body: "Body5REC", prop: "HalfTrack", weap: "Cannon1Mk1" }, // Light Cannon Cobra Half-tracks
remmcan: { body: "Body5REC", prop: "HalfTrack", weap: "Cannon2A-TMk1" }, // Medium Cannon Cobra Half-tracks
rehmcanht: { body: "Body11ABT", prop: "HalfTrack", weap: "Cannon2A-TMk1" }, // Medium Cannon Python Half-tracks
rehmcant: { body: "Body11ABT", prop: "tracked01", weap: "Cannon2A-TMk1" }, // Medium Cannon Python Tracks
remacan: { body: "Body5REC", prop: "HalfTrack", weap: "Cannon5VulcanMk1" }, // Assault Cannon Cobra Half-tracks
rehacan: { body: "Body11ABT", prop: "HalfTrack", weap: "Cannon5VulcanMk1" }, // Assault Cannon Python Half-tracks
remhvcan: { body: "Body5REC", prop: "HalfTrack", weap: "Cannon4AUTOMk1" }, // Hyper Velocity Cannon Cobra Half-tracks
rehhvcan: { body: "Body11ABT", prop: "HalfTrack", weap: "Cannon4AUTOMk1" }, // Hyper Velocity Cannon Python Half-tracks
rehhcanht: { body: "Body11ABT", prop: "HalfTrack", weap: "Cannon375mmMk1" }, // Heavy Cannon Python Half-tracks
rehhcant: { body: "Body11ABT", prop: "tracked01", weap: "Cannon375mmMk1" }, // Heavy Cannon Python Tracks

reltwmgw: { body: "Body1REC", prop: "wheeled01", weap: "MG2Mk1" }, // Twin Machinegun Viper Wheels
reltwmght: { body: "Body1REC", prop: "HalfTrack", weap: "MG2Mk1" }, // Twin Machinegun Viper Half-tracks
remhmght: { body: "Body5REC", prop: "HalfTrack", weap: "MG3Mk1" }, // Heavy Machinegun Cobra Half-tracks
remhmgt: { body: "Body5REC", prop: "tracked01", weap: "MG3Mk1" }, // Heavy Machinegun Cobra Tracks
rehhmg: { body: "Body11ABT", prop: "HalfTrack", weap: "MG3Mk1" }, // Heavy Machinegun Python Half-tracks
remag: { body: "Body5REC", prop: "HalfTrack", weap: "MG4ROTARYMk1" }, // Assault Gun Cobra Half-tracks
rehag: { body: "Body11ABT", prop: "HalfTrack", weap: "MG4ROTARYMk1" }, // Assault Gun Python Half-tracks

relmor: { body: "Body1REC", prop: "wheeled01", weap: "Mortar1Mk1" }, // Mortar Viper Wheels
remmor: { body: "Body5REC", prop: "HalfTrack", weap: "Mortar1Mk1" }, // Mortar Cobra Half-tracks
remimor: { body: "Body5REC", prop: "HalfTrack", weap: "Mortar-Incendiary" }, // Incendiary Mortar Cobra Half-tracks
remhmor: { body: "Body5REC", prop: "HalfTrack", weap: "Mortar2Mk1" }, // Bombard Cobra Half-tracks
rehhmor: { body: "Body11ABT", prop: "HalfTrack", weap: "Mortar2Mk1" }, // Bombard Python Half-tracks
remrmor: { body: "Body5REC", prop: "HalfTrack", weap: "Mortar3ROTARYMk1" }, // Pepperpot Cobra Half-tracks
rehrmor: { body: "Body11ABT", prop: "HalfTrack", weap: "Mortar3ROTARYMk1" }, // Pepperpot Python Half-tracks

remlaa: { body: "Body5REC", prop: "HalfTrack", weap: "QuadMg1AAGun" }, // Hurricane Cobra Half-tracks
remhaa: { body: "Body5REC", prop: "HalfTrack", weap: "AAGun2Mk1" }, // Cyclone Cobra Half-tracks
rehhaa: { body: "Body11ABT", prop: "HalfTrack", weap: "AAGun2Mk1" }, // Cyclone Python Half-tracks
remraa: { body: "Body5REC", prop: "HalfTrack", weap: "QuadRotAAGun" }, // Whirlwind Cobra Half-tracks
rehraa: { body: "Body11ABT", prop: "HalfTrack", weap: "QuadRotAAGun" }, // Whirlwind Python Half-tracks

relpodw: { body: "Body1REC", prop: "wheeled01", weap: "Rocket-Pod" }, // Mini-Rocket Pod Viper Wheels
relpodht: { body: "Body1REC", prop: "HalfTrack", weap: "Rocket-Pod" }, // Mini-Rocket Pod Viper Half-tracks
rempod: { body: "Body5REC", prop: "HalfTrack", weap: "Rocket-Pod" }, // Mini-Rocket Pod Cobra Half-tracks
relsar: { body: "Body1REC", prop: "HalfTrack", weap: "Rocket-LtA-TMk1" }, // Sarissa Viper Half-tracks
remsar: { body: "Body5REC", prop: "HalfTrack", weap: "Rocket-LtA-TMk1" }, // Sarissa Cobra Half-tracks
rembb: { body: "Body5REC", prop: "HalfTrack", weap: "Rocket-BB" }, // Bunker Buster Cobra Half-tracks
rehbb: { body: "Body11ABT", prop: "HalfTrack", weap: "Rocket-BB" }, // Bunker Buster Python Half-tracks
remlan: { body: "Body5REC", prop: "HalfTrack", weap: "Rocket-LtA-T" }, // Lancer Cobra Half-tracks
rehlan: { body: "Body11ABT", prop: "HalfTrack", weap: "Rocket-LtA-T" }, // Lancer Python Half-tracks
remmra: { body: "Body5REC", prop: "HalfTrack", weap: "Rocket-MRL" }, // Mini-Rocket Array Cobra Half-tracks
remtk: { body: "Body5REC", prop: "HalfTrack", weap: "Rocket-HvyA-T" }, // Tank Killer Cobra Half-tracks
rehtk: { body: "Body11ABT", prop: "HalfTrack", weap: "Rocket-HvyA-T" }, // Tank Killer Python Half-tracks
rembal: { body: "Body5REC", prop: "HalfTrack", weap: "Rocket-Ballista" }, // Ballista Cobra Half-tracks
rehbal: { body: "Body11ABT", prop: "HalfTrack", weap: "Rocket-Ballista" }, // Ballista Python Half-tracks

rehhow: { body: "Body11ABT", prop: "tracked01", weap: "Howitzer105Mk1" }, // Howitzer Python Tracks
rehrip: { body: "Body11ABT", prop: "tracked01", weap: "Rocket-IDF" }, // Ripple Rockets Python Tracks
rehihow: { body: "Body11ABT", prop: "tracked01", weap: "Howitzer-Incendiary" }, // Incendiary Howitzer Python Tracks

remlas: { body: "Body5REC", prop: "HalfTrack", weap: "Laser3BEAMMk1" }, // Flashlight Cobra Half-tracks
rehlas: { body: "Body11ABT", prop: "HalfTrack", weap: "Laser3BEAMMk1" }, // Flashlight Python Half-tracks

// AMPHOS TEMPLATES
ammtruck: { body: "Body5REC", prop: "hover01", weap: "Spade1Mk1" }, // Truck Cobra Hover
amhtruck: { body: "Body11ABT", prop: "hover01", weap: "Spade1Mk1" }, // Truck Python Hover

ammsens: { body: "Body5REC", prop: "hover01", weap: "SensorTurret1Mk1" }, // Sensor Cobra Hover

ammlrep: { body: "Body5REC", prop: "hover01", weap: "LightRepair1" }, // Repair Turret Cobra Hover
ammhrep: { body: "Body5REC", prop: "hover01", weap: "HeavyRepair" }, // Heavy Repair Turret Cobra Hover

amhcomm: { body: "Body11ABT", prop: "hover01", weap: "CommandBrain01" }, // Command Turret Python Hover

amlpod: { body: "Body1REC", prop: "hover01", weap: "Rocket-Pod" }, // Mini-Rocket Pod Viper Hover
ammpod: { body: "Body5REC", prop: "hover01", weap: "Rocket-Pod" }, // Mini-Rocket Pod Cobra Hover
amlsar: { body: "Body1REC", prop: "hover01", weap: "Rocket-LtA-TMk1" }, // Sarissa Viper Hover
ammbb: { body: "Body5REC", prop: "hover01", weap: "Rocket-BB" }, // Bunker Buster Cobra Hover
ammmra: { body: "Body5REC", prop: "hover01", weap: "Rocket-MRL" }, // Mini-Rocket Array Cobra Hover
ammlan: { body: "Body5REC", prop: "hover01", weap: "Rocket-LtA-T" }, // Lancer Cobra Hover
amhlan: { body: "Body11ABT", prop: "hover01", weap: "Rocket-LtA-T" }, // Lancer Python Hover
amhbb: { body: "Body11ABT", prop: "hover01", weap: "Rocket-BB" }, // Bunker Buster Python Hover
amhtk: { body: "Body11ABT", prop: "hover01", weap: "Rocket-HvyA-T" }, // Tank Killer Python Hover
amhbal: { body: "Body11ABT", prop: "hover01", weap: "Rocket-Ballista" }, // Ballista Python Hover

ammhmg: { body: "Body5REC", prop: "hover01", weap: "MG3Mk1" }, // Heavy Machinegun Cobra Hover
amhag: { body: "Body11ABT", prop: "hover01", weap: "MG4ROTARYMk1" }, // Assault Gun Python Hover

amhhaa: { body: "Body11ABT", prop: "hover01", weap: "AAGun2Mk1" }, // Cyclone Python Hover
amhraa: { body: "Body11ABT", prop: "hover01", weap: "QuadRotAAGun" }, // Whirlwind Python Hover

amhrip: { body: "Body11ABT", prop: "hover01", weap: "Rocket-IDF" }, // Ripple Rockets Python Hover

amlpodv: { body: "Body1REC", prop: "V-Tol", weap: "Rocket-VTOL-Pod" }, // Mini-Rocket Viper VTOL
amllanv: { body: "Body1REC", prop: "V-Tol", weap: "Rocket-VTOL-LtA-T" }, // Lancer Viper VTOL
amlbbv: { body: "Body1REC", prop: "V-Tol", weap: "Rocket-VTOL-BB" }, // Bunker Buster Viper VTOL
amlhmgv: { body: "Body1REC", prop: "V-Tol", weap: "MG3-VTOL" }, // Heavy Machinegun Viper VTOL
amlagv: { body: "Body1REC", prop: "V-Tol", weap: "MG4ROTARY-VTOL" }, // Assault Gun Viper VTOL
ammagv: { body: "Body5REC", prop: "V-Tol", weap: "MG4ROTARY-VTOL" }, // Assault Gun Cobra VTOL
ammtkv: { body: "Body5REC", prop: "V-Tol", weap: "Rocket-VTOL-HvyA-T" }, // Tank Killer Cobra VTOL

ammlasv: { body: "Body5REC", prop: "V-Tol", weap: "Laser3BEAM-VTOL" }, // Flashlight Cobra VTOL
ammlas: { body: "Body5REC", prop: "hover01", weap: "Laser3BEAMMk1" }, // Flashlight Cobra Hover

// HELLRAISER TEMPLATES
hemtruckht: { body: "Body8MBT", prop: "HalfTrack", weap: "Spade1Mk1" }, // Truck Scorpion Half-tracks
hemtruckt: { body: "Body8MBT", prop: "tracked01", weap: "Spade1Mk1" }, // Truck Scorpion Tracks
hehtruckt: { body: "Body12SUP", prop: "tracked01", weap: "Spade1Mk1" }, // Truck Mantis Tracks

helsensw: { body: "Body4ABT", prop: "wheeled01", weap: "SensorTurret1Mk1" }, // Sensor Bug Wheels
helsensht: { body: "Body4ABT", prop: "HalfTrack", weap: "SensorTurret1Mk1" }, // Sensor Bug Half-tracks
hemsensht: { body: "Body8MBT", prop: "HalfTrack", weap: "SensorTurret1Mk1" }, // Sensor Scorpion Half-tracks
hemsenst: { body: "Body8MBT", prop: "tracked01", weap: "SensorTurret1Mk1" }, // Sensor Scorpion Tracks

hellrep: { body: "Body4ABT", prop: "HalfTrack", weap: "LightRepair1" }, // Repair Turret Bug Half-tracks
hemlrep: { body: "Body8MBT", prop: "HalfTrack", weap: "LightRepair1" }, // Repair Turret Scorpion Half-tracks
hemhrep: { body: "Body8MBT", prop: "HalfTrack", weap: "HeavyRepair" }, // Heavy Repair Turret Scorpion Half-tracks

helflam: { body: "Body4ABT", prop: "HalfTrack", weap: "Flame1Mk1" }, // Flamer Bug Half-tracks
hemflam: { body: "Body8MBT", prop: "HalfTrack", weap: "Flame1Mk1" }, // Flamer Scorpion Half-tracks
heminf: { body: "Body8MBT", prop: "HalfTrack", weap: "Flame2" }, // Inferno Scorpion Half-tracks
hehinf: { body: "Body12SUP", prop: "tracked01", weap: "Flame2" }, // Inferno Mantis Tracks

heltwmg: { body: "Body4ABT", prop: "HalfTrack", weap: "MG2Mk1" }, // Twin Machinegun Bug Half-tracks
helhmg: { body: "Body4ABT", prop: "HalfTrack", weap: "MG3Mk1" }, // Heavy Machinegun Bug Half-tracks
hemhmght: { body: "Body8MBT", prop: "HalfTrack", weap: "MG3Mk1" }, // Heavy Machinegun Scorpion Half-tracks
hemhmgt: { body: "Body8MBT", prop: "tracked01", weap: "MG3Mk1" }, // Heavy Machinegun Scorpion Tracks
hemag: { body: "Body8MBT", prop: "tracked01", weap: "MG4ROTARYMk1" }, // Assault Gun Scorpion Tracks

hellcan: { body: "Body4ABT", prop: "HalfTrack", weap: "Cannon1Mk1" }, // Light Cannon Bug Half-tracks
hemlcan: { body: "Body8MBT", prop: "HalfTrack", weap: "Cannon1Mk1" }, // Light Cannon Scorpion Half-tracks
hemmcanht: { body: "Body8MBT", prop: "HalfTrack", weap: "Cannon2A-TMk1" }, // Medium Cannon Scorpion Half-tracks
hemmcant: { body: "Body8MBT", prop: "tracked01", weap: "Cannon2A-TMk1" }, // Medium Cannon Scorpion Tracks
hehmcan: { body: "Body12SUP", prop: "tracked01", weap: "Cannon2A-TMk1" }, // Medium Cannon Mantis Tracks
hemacan: { body: "Body8MBT", prop: "tracked01", weap: "Cannon5VulcanMk1" }, // Assault Cannon Scorpion Tracks
hehacan: { body: "Body12SUP", prop: "tracked01", weap: "Cannon5VulcanMk1" }, // Assault Cannon Mantis Tracks
hemhvcan: { body: "Body8MBT", prop: "tracked01", weap: "Cannon4AUTOMk1" }, // Hyper Velocity Cannon Scorpion Tracks
hehhvcan: { body: "Body12SUP", prop: "tracked01", weap: "Cannon4AUTOMk1" }, // Hyper Velocity Cannon Mantis Tracks
hehhcan: { body: "Body12SUP", prop: "tracked01", weap: "Cannon375mmMk1" }, // Heavy Cannon Mantis Tracks

helpodw: { body: "Body4ABT", prop: "wheeled01", weap: "Rocket-Pod" }, // Mini-Rocket Pod Bug Wheels
helpodht: { body: "Body4ABT", prop: "HalfTrack", weap: "Rocket-Pod" }, // Mini-Rocket Pod Bug Half-tracks
hempod: { body: "Body8MBT", prop: "tracked01", weap: "Rocket-Pod" }, // Mini-Rocket Pod Scorpion Tracks
hemmra: { body: "Body8MBT", prop: "tracked01", weap: "Rocket-MRL" }, // Mini-Rocket Array Scorpion Tracks

hemimorht: { body: "Body8MBT", prop: "HalfTrack", weap: "Mortar-Incendiary" }, // Incendiary Mortar Scorpion Half-tracks
hemimort: { body: "Body8MBT", prop: "tracked01", weap: "Mortar-Incendiary" }, // Incendiary Mortar Scorpion Tracks

hemlaa: { body: "Body8MBT", prop: "tracked01", weap: "QuadMg1AAGun" }, // Hurricane Scorpion Tracks
hehhaa: { body: "Body12SUP", prop: "tracked01", weap: "AAGun2Mk1" }, // Cyclone Mantis Tracks
hehraa: { body: "Body12SUP", prop: "tracked01", weap: "QuadRotAAGun" }, // Whirlwind Mantis Tracks

hemlas: { body: "Body8MBT", prop: "tracked01", weap: "Laser3BEAMMk1" }, // Flashlight Scorpion Tracks

// COALITION TEMPLATES
comtruckht: { body: "Body6SUPP", prop: "HalfTrack", weap: "Spade1Mk1" }, // Truck Panther Half-tracks
comtruckt: { body: "Body6SUPP", prop: "tracked01", weap: "Spade1Mk1" }, // Truck Panther Tracks

comsensht: { body: "Body6SUPP", prop: "HalfTrack", weap: "SensorTurret1Mk1" }, // Sensor Panther Half-tracks
comsenst: { body: "Body6SUPP", prop: "tracked01", weap: "SensorTurret1Mk1" }, // Sensor Panther Tracks

comhrepht: { body: "Body6SUPP", prop: "HalfTrack", weap: "HeavyRepair" }, // Heavy Repair Turret Panther Half-tracks
comhrept: { body: "Body6SUPP", prop: "tracked01", weap: "HeavyRepair" }, // Heavy Repair Turret Panther Tracks

cohcomm: { body: "Body9REC", prop: "tracked01", weap: "CommandBrain01" }, // Command Turret Tiger Tracks

commcan: { body: "Body6SUPP", prop: "tracked01", weap: "Cannon2A-TMk1" }, // Medium Cannon Panther Tracks
comacan: { body: "Body6SUPP", prop: "tracked01", weap: "Cannon5VulcanMk1" }, // Assault Cannon Panther Tracks
comhvcan: { body: "Body6SUPP", prop: "tracked01", weap: "Cannon4AUTOMk1" }, // Hyper Velocity Cannon Panther Tracks
cohhcan: { body: "Body9REC", prop: "tracked01", weap: "Cannon375mmMk1" }, // Heavy Cannon Tiger Tracks

comhmg: { body: "Body6SUPP", prop: "tracked01", weap: "MG3Mk1" }, // Heavy Machinegun Panther Tracks
comag: { body: "Body6SUPP", prop: "tracked01", weap: "MG4ROTARYMk1" }, // Assault Gun Panther Tracks

comhaa: { body: "Body6SUPP", prop: "tracked01", weap: "AAGun2Mk1" }, // Cyclone Panther Tracks
cohraa: { body: "Body9REC", prop: "tracked01", weap: "QuadRotAAGun" }, // Whirlwind Tiger Tracks

cominf: { body: "Body6SUPP", prop: "tracked01", weap: "Flame2" }, // Inferno Panther Tracks

comhmorht: { body: "Body6SUPP", prop: "tracked01", weap: "Mortar2Mk1" }, // Bombard Panther Half-tracks
comhmort: { body: "Body6SUPP", prop: "tracked01", weap: "Mortar2Mk1" }, // Bombard Panther Tracks
cohhow: { body: "Body9REC", prop: "tracked01", weap: "Howitzer105Mk1" }, // Howitzer Tiger Tracks

colpod: { body: "Body2SUP", prop: "tracked01", weap: "Rocket-Pod" }, // Mini-Rocket Pod Leopard Tracks
colsar: { body: "Body2SUP", prop: "tracked01", weap: "Rocket-LtA-TMk1" }, // Sarissa Leopard Tracks
colbb: { body: "Body2SUP", prop: "tracked01", weap: "Rocket-BB" }, // Bunker Buster Leopard Tracks
comlan: { body: "Body6SUPP", prop: "tracked01", weap: "Rocket-LtA-T" }, // Lancer Panther Tracks
comtk: { body: "Body6SUPP", prop: "tracked01", weap: "Rocket-HvyA-T" }, // Tank Killer Panther Tracks

colcanv: { body: "Body2SUP", prop: "V-Tol", weap: "Cannon1-VTOL" }, // Cannon Leopard VTOL
colcbomv: { body: "Body2SUP", prop: "V-Tol", weap: "Bomb1-VTOL-LtHE" }, // Cluster Bomb Leopard VTOL
colpbomv: { body: "Body2SUP", prop: "V-Tol", weap: "Bomb3-VTOL-LtINC" }, // Phosphor Bomb Leopard VTOL
colhmgv: { body: "Body2SUP", prop: "V-Tol", weap: "MG3-VTOL" }, // Heavy Machinegun Leopard VTOL
colagv: { body: "Body2SUP", prop: "V-Tol", weap: "MG4ROTARY-VTOL" }, // Assault Gun Leopard VTOL
colhvcanv: { body: "Body2SUP", prop: "V-Tol", weap: "Cannon4AUTO-VTOL" }, // Hyper Velocity Cannon Leopard VTOL
comacanv: { body: "Body6SUPP", prop: "V-Tol", weap: "Cannon5Vulcan-VTOL" }, // Assault Cannon Panther VTOL
comhbomv: { body: "Body6SUPP", prop: "V-Tol", weap: "Bomb2-VTOL-HvHE" }, // Heap Bomb Panther VTOL

comlas: { body: "Body6SUPP", prop: "tracked01", weap: "Laser3BEAMMk1" }, // Flashlight Panther Tracks
collasv: { body: "Body2SUP", prop: "V-Tol", weap: "Laser3BEAM-VTOL" }, // Flashlight Leopard VTOL

// ROYALIST TEMPLATES
romtruckt: { body: "Body7ABT", prop: "tracked01", weap: "Spade1Mk1" }, // Truck Retribution Tracks
romtruckh: { body: "Body7ABT", prop: "hover01", weap: "Spade1Mk1" }, // Truck Retribution Hover

romsenst: { body: "Body7ABT", prop: "tracked01", weap: "SensorTurret1Mk1" }, // Sensor Retribution Tracks
romsensh: { body: "Body7ABT", prop: "hover01", weap: "SensorTurret1Mk1" }, // Sensor Retribution Hover

romhrept: { body: "Body7ABT", prop: "tracked01", weap: "HeavyRepair" }, // Heavy Repair Turret Retribution Tracks
romhreph: { body: "Body7ABT", prop: "hover01", weap: "HeavyRepair" }, // Heavy Repair Turret Retribution Hover

romcommt: { body: "Body7ABT", prop: "tracked01", weap: "CommandBrain01" }, // Command Turret Retribution Tracks
romcommh: { body: "Body7ABT", prop: "hover01", weap: "CommandBrain01" }, // Command Turret Retribution Hover
rohcomm: { body: "Body10MBT", prop: "tracked01", weap: "CommandBrain01" }, // Command Turret Vengeance Tracks

rominft: { body: "Body7ABT", prop: "tracked01", weap: "Flame2" }, // Inferno Retribution Tracks
rominfh: { body: "Body7ABT", prop: "hover01", weap: "Flame2" }, // Inferno Retribution Hover

rollant: { body: "Body3MBT", prop: "tracked01", weap: "Rocket-LtA-T" }, // Lancer Retaliation Tracks
rollanh: { body: "Body3MBT", prop: "hover01", weap: "Rocket-LtA-T" }, // Lancer Retaliation Hover
rolmra: { body: "Body3MBT", prop: "tracked01", weap: "Rocket-MRL" }, // Mini-Rocket Array Retaliation Tracks
rommrat: { body: "Body7ABT", prop: "tracked01", weap: "Rocket-MRL" }, // Mini-Rocket Array Retribution Tracks
rommrah: { body: "Body7ABT", prop: "hover01", weap: "Rocket-MRL" }, // Mini-Rocket Array Retribution Hover
rombbt: { body: "Body7ABT", prop: "tracked01", weap: "Rocket-BB" }, // Bunker Buster Retribution Tracks
rombbh: { body: "Body7ABT", prop: "hover01", weap: "Rocket-BB" }, // Bunker Buster Retribution Hover
romtkt: { body: "Body7ABT", prop: "tracked01", weap: "Rocket-HvyA-T" }, // Tank Killer Retribution Tracks
romtkh: { body: "Body7ABT", prop: "hover01", weap: "Rocket-HvyA-T" }, // Tank Killer Retribution Hover
rohtkt: { body: "Body10MBT", prop: "tracked01", weap: "Rocket-HvyA-T" }, // Tank Killer Vengeance Tracks
rohtkh: { body: "Body10MBT", prop: "hover01", weap: "Rocket-HvyA-T" }, // Tank Killer Vengeance Hover
rohbalt: { body: "Body10MBT", prop: "tracked01", weap: "Rocket-Ballista" }, // Ballista Vengeance Tracks
rohbalh: { body: "Body10MBT", prop: "hover01", weap: "Rocket-Ballista" }, // Ballista Vengeance Hover

rolhmgt: { body: "Body3MBT", prop: "tracked01", weap: "MG3Mk1" }, // Heavy Machinegun Retaliation Tracks
rolhmgh: { body: "Body3MBT", prop: "hover01", weap: "MG3Mk1" }, // Heavy Machinegun Retaliation Hover
romagt: { body: "Body7ABT", prop: "tracked01", weap: "MG4ROTARYMk1" }, // Assault Gun Retribution Tracks
romagh: { body: "Body7ABT", prop: "hover01", weap: "MG4ROTARYMk1" }, // Assault Gun Retribution Hover
rohtagt: { body: "Body10MBT", prop: "tracked01", weap: "MG5TWINROTARY" }, // Twin Assault Gun Vengeance Tracks
rohtagh: { body: "Body10MBT", prop: "hover01", weap: "MG5TWINROTARY" }, // Twin Assault Gun Vengeance Hover

romacant: { body: "Body7ABT", prop: "tracked01", weap: "Cannon5VulcanMk1" }, // Assault Cannon Retribution Tracks
romacanh: { body: "Body7ABT", prop: "hover01", weap: "Cannon5VulcanMk1" }, // Assault Cannon Retribution Hover
romhvcant: { body: "Body7ABT", prop: "tracked01", weap: "Cannon4AUTOMk1" }, // Hyper Velocity Cannon Retribution Tracks
romhvcanh: { body: "Body7ABT", prop: "hover01", weap: "Cannon4AUTOMk1" }, // Hyper Velocity Cannon Retribution Hover
rohhcant: { body: "Body10MBT", prop: "tracked01", weap: "Cannon375mmMk1" }, // Heavy Cannon Vengeance Tracks
rohhcanh: { body: "Body10MBT", prop: "hover01", weap: "Cannon375mmMk1" }, // Heavy Cannon Vengeance Hover
rohtacant: { body: "Body10MBT", prop: "tracked01", weap: "Cannon6TwinAslt" }, // Twin Assault Cannon Vengeance Tracks
rohtacanh: { body: "Body10MBT", prop: "hover01", weap: "Cannon6TwinAslt" }, // Twin Assault Cannon Vengeance Hover

romrmort: { body: "Body7ABT", prop: "tracked01", weap: "Mortar3ROTARYMk1" }, // Pepperpot Retribution Tracks
romrmorh: { body: "Body7ABT", prop: "hover01", weap: "Mortar3ROTARYMk1" }, // Pepperpot Retribution Hover
romrmorht: { body: "Body7ABT", prop: "HalfTrack", weap: "Mortar3ROTARYMk1" }, // Pepperpot Retribution Half-tracks
rohhowt: { body: "Body10MBT", prop: "tracked01", weap: "Howitzer105Mk1" }, // Howitzer Vengeance Tracks
rohhowh: { body: "Body10MBT", prop: "hover01", weap: "Howitzer105Mk1" }, // Howitzer Vengeance Hover
rohihowt: { body: "Body10MBT", prop: "tracked01", weap: "Howitzer-Incendiary" }, // Incendiary Howitzer Vengeance Tracks
rohihowh: { body: "Body10MBT", prop: "hover01", weap: "Howitzer-Incendiary" }, // Incendiary Howitzer Vengeance Hover
rohript: { body: "Body10MBT", prop: "tracked01", weap: "Rocket-IDF" }, // Ripple Rocket Vengeance Tracks
rohriph: { body: "Body10MBT", prop: "hover01", weap: "Rocket-IDF" }, // Ripple Rocket Vengeance Hover

rohraat: { body: "Body10MBT", prop: "tracked01", weap: "QuadRotAAGun" }, // Whirlwind Vengeance Tracks
rohraah: { body: "Body10MBT", prop: "hover01", weap: "QuadRotAAGun" }, // Whirlwind Vengeance Hover

rolpbomv: { body: "Body3MBT", prop: "V-Tol", weap: "Bomb3-VTOL-LtINC" }, // Phosphor Bomb Retaliation VTOL
rolhvcanv: { body: "Body3MBT", prop: "V-Tol", weap: "Cannon4AUTO-VTOL" }, // Hyper Velocity Cannon Retaliation VTOL
rolagv: { body: "Body3MBT", prop: "V-Tol", weap: "MG4ROTARY-VTOL" }, // Assault Gun Retaliation VTOL
rollanv: { body: "Body3MBT", prop: "V-Tol", weap: "Rocket-VTOL-LtA-T" }, // Lancer Retaliation VTOL
rolbbv: { body: "Body3MBT", prop: "V-Tol", weap: "Rocket-VTOL-BB" }, // Bunker Buster Retaliation VTOL
romhbomv: { body: "Body7ABT", prop: "V-Tol", weap: "Bomb2-VTOL-HvHE" }, // Heap Bomb Retaliation VTOL
romtbomv: { body: "Body7ABT", prop: "V-Tol", weap: "Bomb4-VTOL-HvyINC" }, // Thermite Bomb Retaliation VTOL
romtkv: { body: "Body7ABT", prop: "V-Tol", weap: "Rocket-VTOL-HvyA-T" }, // Tank Killer Retaliation VTOL
romacanv: { body: "Body7ABT", prop: "V-Tol", weap: "Cannon5Vulcan-VTOL" }, // Assault Cannon Retaliation VTOL


// CAM_1A
bloke: { body: "B1BaBaPerson01", prop: "BaBaLegs", weap: "BabaMG" },
trike: { body: "B4body-sml-trike01", prop: "BaBaProp", weap: "BabaTrikeMG" },
buggy: { body: "B3body-sml-buggy01", prop: "BaBaProp", weap: "BabaBuggyMG" },
bjeep: { body: "B2JeepBody", prop: "BaBaProp", weap: "BabaJeepMG" },

// CAM_1B
bloketwin: { body: "B1BaBaPerson01", prop: "BaBaLegs", weap: "BabaTwinMG" },
triketwin: { body: "B4body-sml-trike01", prop: "BaBaProp", weap: "BabaTrikeTwinMG" },
buggytwin: { body: "B3body-sml-buggy01", prop: "BaBaProp", weap: "BabaBuggyTwinMG" },
bjeeptwin: { body: "B2JeepBody", prop: "BaBaProp", weap: "BabaJeepTwinMG" },

// SUB_1_1
blokeheavy: { body: "B1BaBaPerson01", prop: "BaBaLegs", weap: "BabaHeavyMG" },
trikeheavy: { body: "B4body-sml-trike01", prop: "BaBaProp", weap: "BabaTrikeHeavyMG" },
buggyheavy: { body: "B3body-sml-buggy01", prop: "BaBaProp", weap: "BabaBuggyHeavyMG" },
bjeepheavy: { body: "B2JeepBody", prop: "BaBaProp", weap: "BabaJeepHeavyMG" },

// SUB_1_2

// SUB_1_3
rbjeep8: { body: "B2RKJeepBody", prop: "BaBaProp", weap: "BabaRocket8" },
rbjeep: { body: "B2RKJeepBody", prop: "BaBaProp", weap: "BabaRocket" },
rbuggy: { body: "B3bodyRKbuggy01", prop: "BaBaProp", weap: "BabaRocket" },
nppod: { body: "Body4ABT", prop: "wheeled01", weap: "Rocket-Pod" },
npblc: { body: "Body4ABT", prop: "HalfTrack", weap: "Cannon1Mk1" },
nphmg: { body: "Body4ABT", prop: "HalfTrack", weap: "MG3Mk1" },
npsmc: { body: "Body8MBT", prop: "HalfTrack", weap: "Cannon2A-TMk1" },
buscan: { body: "BusBody", prop: "BaBaProp", weap: "BabaBusCannon" },
firecan: { body: "FireBody", prop: "BaBaProp", weap: "BabaBusCannon" },

// CAM_1C
npsens: { body: "Body4ABT", prop: "wheeled01", weap: "SensorTurret1Mk1" },
npslc: { body: "Body8MBT", prop: "HalfTrack", weap: "Cannon1Mk1" },
npmor: { body: "Body8MBT", prop: "HalfTrack", weap: "Mortar1Mk1" },
npsmct: { body: "Body8MBT", prop: "tracked01", weap: "Cannon2A-TMk1" },

// CAM_1CA
npmrl: { body: "Body4ABT", prop: "HalfTrack", weap: "Rocket-MRL" },
npmmct: { body: "Body12SUP", prop: "tracked01", weap: "Cannon2A-TMk1" },
npsbb: { body: "Body8MBT", prop: "HalfTrack", weap: "Rocket-BB" },
npltat: { body: "Body4ABT", prop: "HalfTrack", weap: "Rocket-LtA-T" },

// SUB_1_4A

// CAM_1_5
nphmgt: { body: "Body8MBT", prop: "tracked01", weap: "MG3Mk1" },
npcybc: { body: "CyborgLightBody", prop: "CyborgLegs", weap: "CyborgCannon" },
npcybf: { body: "CyborgLightBody", prop: "CyborgLegs", weap: "CyborgFlamer01" },
npcybm: { body: "CyborgLightBody", prop: "CyborgLegs", weap: "CyborgChaingun" },

// CAM_1AC
nphct: { body: "Body12SUP", prop: "tracked01", weap: "Cannon375mmMk1" },
npmorb: { body: "Body8MBT", prop: "HalfTrack", weap: "Mortar2Mk1" },
npmsens: { body: "Body8MBT", prop: "HalfTrack", weap: "SensorTurret1Mk1" },

// SUB_1_7

// CAM_1_D
npcybr: { body: "CyborgLightBody", prop: "CyborgLegs", weap: "CyborgRocket" },
nphmgh: { body: "Body8MBT", prop: "hover01", weap: "MG3Mk1" },
npltath: { body: "Body8MBT", prop: "hover01", weap: "Rocket-LtA-T" },
nphch: { body: "Body12SUP", prop: "hover01", weap: "Cannon375mmMk1" },
nphbb: { body: "Body12SUP", prop: "hover01", weap: "Rocket-BB" },

// CAM_2_A
commgt: { body: "Body6SUPP", prop: "tracked01", weap: "MG3Mk1" },
comsens: { body: "Body6SUPP", prop: "tracked01", weap: "SensorTurret1Mk1" },
cohct: { body: "Body9REC", prop: "tracked01", weap: "Cannon375mmMk1" },
commrl: { body: "Body6SUPP", prop: "HalfTrack", weap: "Rocket-MRL" },
commrp: { body: "Body6SUPP", prop: "tracked01", weap: "Rocket-Pod" },
comorb: { body: "Body6SUPP", prop: "HalfTrack", weap: "Mortar2Mk1" },
colcbv: { body: "Body2SUP", prop: "V-Tol", weap: "Bomb1-VTOL-LtHE" },
prhct: { body: "Body11ABT", prop: "tracked01", weap: "Cannon375mmMk1" },
prltat: { body: "Body5REC", prop: "tracked01", weap: "Rocket-LtA-T" },
prrept: { body: "Body5REC", prop: "tracked01", weap: "LightRepair1" },

// SUB_2_1

// CAM_2_B
comatt: { body: "Body6SUPP", prop: "tracked01", weap: "Rocket-LtA-T" },
comit: { body: "Body6SUPP", prop: "tracked01", weap: "Flame2" },
colatv: { body: "Body2SUP", prop: "V-Tol", weap: "Rocket-VTOL-LtA-T" },

// SUB_2_2
comtath: { body: "Body6SUPP", prop: "hover01", weap: "Rocket-LtA-T" },
comtathh: { body: "Body6SUPP", prop: "HalfTrack", weap: "Rocket-LtA-T" },

// CAM_2_C
commorv: { body: "Body6SUPP", prop: "V-Tol", weap: "Bomb2-VTOL-HvHE" },
colagv: { body: "Body2SUP", prop: "V-Tol", weap: "MG4ROTARY-VTOL" },
comhpv: { body: "Body6SUPP", prop: "tracked01", weap: "Cannon4AUTOMk1" },
cohbbt: { body: "Body9REC", prop: "tracked01", weap: "Rocket-BB" },

// SUB_2_5
cocybag: { body: "CyborgLightBody", prop: "CyborgLegs", weap: "CyborgRotMG" },

// SUB_2_D
comhltat: { body: "Body6SUPP", prop: "tracked01", weap: "Rocket-HvyA-T" },
commorvt: { body: "Body6SUPP", prop: "V-Tol", weap: "Bomb4-VTOL-HvyINC" },
cohhpv: { body: "Body9REC", prop: "tracked01", weap: "Cannon4AUTOMk1" },
comagt: { body: "Body6SUPP", prop: "tracked01", weap: "MG4ROTARYMk1" },

// SUB_2_6
cohact: { body: "Body9REC", prop: "tracked01", weap: "Cannon5VulcanMk1" },
comrotm: { body: "Body6SUPP", prop: "HalfTrack", weap: "Mortar3ROTARYMk1" },
comsensh: { body: "Body6SUPP", prop: "HalfTrack", weap: "SensorTurret1Mk1" },

// SUB_2_7
comrotmh: { body: "Body6SUPP", prop: "tracked01", weap: "Mortar3ROTARYMk1" },

// SUB_2_8
comhvat: { body: "Body6SUPP", prop: "V-Tol", weap: "Rocket-VTOL-HvyA-T" },

// CAM_2_END
cowwt: { body: "Body9REC", prop: "tracked01", weap: "QuadRotAAGun" },

// CAM_3_A
nxmscouh: { body: "Body7ABT", prop: "hover02", weap: "Missile-A-T" },
nxcyrail: { body: "CybNXRail1Jmp", prop: "CyborgLegs02", weap: "NX-Cyb-Rail1" },
nxcyscou: { body: "CybNXMissJmp", prop: "CyborgLegs02", weap: "NX-CyborgMiss" },
nxlneedv: { body: "Body3MBT", prop: "V-Tol02", weap: "RailGun1-VTOL" },
nxlscouv: { body: "Body3MBT", prop: "V-Tol02", weap: "Missile-VTOL-AT" },
nxmtherv: { body: "Body7ABT", prop: "V-Tol02", weap: "Bomb4-VTOL-HvyINC" },
prhasgnt: { body: "Body11ABT", prop: "tracked01", weap: "MG4ROTARYMk1" },
prhhpvt: { body: "Body11ABT", prop: "tracked01", weap: "Cannon4AUTOMk1" },
prhaacnt: { body: "Body11ABT", prop: "tracked01", weap: "AAGun2Mk1" },
prtruck: { body: "Body5REC", prop: "tracked01", weap: "Spade1Mk1" },

// SUB_3_1
nxcylas: { body: "CybNXPulseLasJmp", prop: "CyborgLegs02", weap: "NX-CyborgPulseLas" },
nxmrailh: { body: "Body7ABT", prop: "hover02", weap: "RailGun2Mk1" },

// CAM_3_B
nxmlinkh: { body: "Body7ABT", prop: "hover02", weap: "NEXUSlink" },
nxmsamh: { body: "Body7ABT", prop: "hover02", weap: "Missile-HvySAM" },
nxmheapv: { body: "Body7ABT", prop: "V-Tol02", weap: "Bomb2-VTOL-HvHE" },

// SUB_3_2
nxlflash: { body: "Body3MBT", prop: "hover02", weap: "Laser3BEAMMk1" },

// CAM_3_A_B
nxmsens: { body: "Body7ABT", prop: "hover02", weap: "SensorTurret1Mk1" },
nxmangel: { body: "Body7ABT", prop: "hover02", weap: "Missile-MdArt" },

// CAM_3_C

// CAM_3_A_D_1
nxmpulseh: { body: "Body7ABT", prop: "hover02", weap: "Laser2PULSEMk1" },

// CAM_3_A_D_2
nxhgauss: { body: "Body10MBT", prop: "hover02", weap: "RailGun3Mk1" },
nxlpulsev: { body: "Body3MBT", prop: "V-Tol02", weap: "Laser2PULSE-VTOL" },

// SUB_3_4
nxllinkh: { body: "Body3MBT", prop: "hover02", weap: "NEXUSlink" },
nxmpulsev: { body: "Body7ABT", prop: "V-Tol02", weap: "Laser2PULSE-VTOL" },


////////////////////////////////////////////////////////////////////////////////
};
