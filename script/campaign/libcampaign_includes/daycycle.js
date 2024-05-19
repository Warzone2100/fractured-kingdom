
////////////////////////////////////////////////////////////////////////////////
// Day-night cycle control and related functions.
////////////////////////////////////////////////////////////////////////////////

// Returns the current day time
function camGetDayTime()
{
	return __camDayTime;
}

// Sets the current day time
function camSetDayTime(time)
{
	__camDayTime = time;
	if (__camDayCycleActive)
	{
		__camUpdateDayVisuals();
		__camSetSun(); // Always set the sun when manually changing the time
	}
}

// Toggles the day/night cycle
function camToggleDayCycle()
{
	if (__camDayCycleActive)
	{
		console(_("Day/Night cycle disabled."));
		__camDisableDayCycle();
		__camDayCycleActive = false;
	}
	else
	{
		console(_("Day/Night cycle enabled."));
		__camUpdateDayVisuals();
		__camSetSun();
		__camDayCycleActive = true;
	}
}

//////////// privates

function __camDisableDayCycle()
{
	let r;
	let g;
	let b;

	if (tilesetType === "ARIZONA")
	{
		r = __CAM_ARIZONA_FOG_RGB.r;
		g = __CAM_ARIZONA_FOG_RGB.g;
		b = __CAM_ARIZONA_FOG_RGB.b;
	}
	else if (tilesetType === "URBAN")
	{
		r = __CAM_URBAN_FOG_RGB.r;
		g = __CAM_URBAN_FOG_RGB.g;
		b = __CAM_URBAN_FOG_RGB.b;
	}
	else
	{
		r = __CAM_ROCKY_FOG_RGB.r;
		g = __CAM_ROCKY_FOG_RGB.g;
		b = __CAM_ROCKY_FOG_RGB.b;
	}
	setFogColour(r, g, b);

	setSunPosition(225.0, -600.0, 450.0); // Default position
	setSunIntensity(0.5, 0.5, 0.5, 1, 1, 1, 1, 1, 1); // Default intensity

	if (tilesetType !== "ARIZONA")
	{
		setSky("texpages/page-25-sky-urban.png", 0.5, 10000.0);
		__camNightSkyboxSet = false;
	}
	else
	{
		setSky("texpages/page-25-sky-arizona.png", 0.5, 10000.0);
		__camNightSkyboxSet = false;
	}
}

function __camDayCycleTick()
{
	__camDayTime++;

	if (__camDayTime >= __CAM_SECONDS_IN_A_DAY_CYCLE)
	{
		__camDayTime = 0;
	}

	if (__camDayCycleActive)
	{
		__camUpdateDayVisuals();
	}
}

// Sets the sun, skybox and fog values based on the current time
function __camUpdateDayVisuals()
{
	// Dawn is at 0 
	// Noon is at (__CAM_SECONDS_IN_A_DAY_CYCLE / 4)
	// Dusk is at (__CAM_SECONDS_IN_A_DAY_CYCLE / 2)
	// Midnight is at (3 * __CAM_SECONDS_IN_A_DAY_CYCLE / 4)

	//Set the skybox
	__camSetSky(false);

	let r;
	let g;
	let b;

	if (tilesetType === "ARIZONA")
	{
		r = __CAM_ARIZONA_FOG_RGB.r;
		g = __CAM_ARIZONA_FOG_RGB.g;
		b = __CAM_ARIZONA_FOG_RGB.b;
	}
	else if (tilesetType === "URBAN")
	{
		r = __CAM_URBAN_FOG_RGB.r;
		g = __CAM_URBAN_FOG_RGB.g;
		b = __CAM_URBAN_FOG_RGB.b;
	}
	else
	{
		r = __CAM_ROCKY_FOG_RGB.r;
		g = __CAM_ROCKY_FOG_RGB.g;
		b = __CAM_ROCKY_FOG_RGB.b;
	}

	// At noon fog colors are as set above
	// At dawn and dusk fog colors are at 1/2
	// At midnight all fog colors are 0 (full black)
	const __COLOR_MULTIPLIER = Math.abs( 1 - ((2 / __CAM_SECONDS_IN_A_DAY_CYCLE) * Math.abs(__camDayTime - (__CAM_SECONDS_IN_A_DAY_CYCLE / 4))));
	// __COLOR_MULTIPLIER starts as 0.5 at dawn, is 1 at noon, 0.5 at dusk, and 0 at midnight.

	r = Math.floor(r * __COLOR_MULTIPLIER);
	g = Math.floor(g * __COLOR_MULTIPLIER);
	b = Math.floor(b * __COLOR_MULTIPLIER);

	setFogColour(r, g, b);

	if (__camDayTime % 10 === 0)
	{
		// This function makes the game re-render a bunch of stuff,
		// so don't call it every second.
		__camSetSun();
	}

	return true;
}

// Change the texture used for the skybox
// Set forceSet to true when we don't want to check if the skybox is already set
function __camSetSky(forceSet)
{
	//__camNightSkyboxSet is used to see if the skybox is already set correctly, so that we don't constantly reset the skybox
	if (__camDayTime >= __CAM_SECONDS_IN_A_DAY_CYCLE / 2 && (!__camNightSkyboxSet || forceSet)) // Set to night after dusk
	{
		setSky("texpages/night-sky.png", 0.5, 10000.0);
		__camNightSkyboxSet = true;
	}
	else if (__camDayTime < __CAM_SECONDS_IN_A_DAY_CYCLE / 2 && (__camNightSkyboxSet || forceSet)) // Set to day before dusk
	{
		if (tilesetType !== "ARIZONA")
		{
			setSky("texpages/page-25-sky-urban.png", 0.5, 10000.0);
			__camNightSkyboxSet = false;
		}
		else
		{
			setSky("texpages/page-25-sky-arizona.png", 0.5, 10000.0);
			__camNightSkyboxSet = false;
		}
	}

	return true;
}

// Change the sun's position. Affects lighting and shadows.
function __camSetSun()
{
	// Sun coordinates and their corresponding sun directions:
	// -x: WEST, +x: EAST
	// -y: UP, +y: DOWN
	// -z: NORTH, +z: SOUTH
	// (remember that shadows are casted in the OPPOSITE direction of the sun)

	const __LIGHT_POS = Math.cos((Math.PI * __camDayTime / (__CAM_SECONDS_IN_A_DAY_CYCLE / 2)));
	// __LIGHT_POS travels between 1 and -1 through the day, and from -1 to 1 during the night

	const __INTENSITY_MULTIPLIER = (__camDayTime < (__CAM_SECONDS_IN_A_DAY_CYCLE / 2)) ? Math.sin((Math.PI * __camDayTime / (__CAM_SECONDS_IN_A_DAY_CYCLE / 2))) : 0;
	// __INTENSITY_MULTIPLIER starts as 0 at dawn, is 1 at noon, 0 at dusk, and 0 during all of the night.

	const sun = {
		x: (__camDayTime < (__CAM_SECONDS_IN_A_DAY_CYCLE / 2)) ? __LIGHT_POS : -0.6 * __LIGHT_POS, // Move less at night
		y: -0.5,
		z: (__camDayTime < (__CAM_SECONDS_IN_A_DAY_CYCLE / 2)) ? 0.3 : -0.2, // Put the "moon" in a slightly different position
		ar: 0.4 + (0.1 * __INTENSITY_MULTIPLIER),
		ag: 0.4 + (0.1 * __INTENSITY_MULTIPLIER),
		ab: 0.4 + (0.1 * __INTENSITY_MULTIPLIER),
		dr: 0.5 + (0.5 * __INTENSITY_MULTIPLIER),
		dg: 0.5 + (0.5 * __INTENSITY_MULTIPLIER),
		db: 0.5 + (0.5 * __INTENSITY_MULTIPLIER),
		sr: 0.5 + (0.5 * __INTENSITY_MULTIPLIER),
		sg: 0.5 + (0.5 * __INTENSITY_MULTIPLIER),
		sb: 0.5 + (0.5 * __INTENSITY_MULTIPLIER)
	}

	setSunPosition(sun.x, sun.y, sun.z);
	setSunIntensity(sun.ar, sun.ag, sun.ab, sun.dr, sun.dg, sun.db, sun.sr, sun.sg, sun.sb);

	return true;
}
