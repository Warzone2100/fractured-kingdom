
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

		var r;
		var g;
		var b;

		if (tilesetType === "ARIZONA")
		{
			r = CAM_ARIZONA_FOG_RGB.r;
			g = CAM_ARIZONA_FOG_RGB.g;
			b = CAM_ARIZONA_FOG_RGB.b;
		}
		else if (tilesetType === "URBAN")
		{
			r = CAM_URBAN_FOG_RGB.r;
			g = CAM_URBAN_FOG_RGB.g;
			b = CAM_URBAN_FOG_RGB.b;
		}
		else
		{
			r = CAM_ROCKY_FOG_RGB.r;
			g = CAM_ROCKY_FOG_RGB.g;
			b = CAM_ROCKY_FOG_RGB.b;
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
	else
	{
		console(_("Day/Night cycle enabled."));
		__camUpdateDayVisuals();
		__camSetSun();
	}

	__camDayCycleActive = !__camDayCycleActive;
}

//////////// privates

function __camDayCycleTick()
{
	__camDayTime++;

	if (__camDayTime >= CAM_SECONDS_IN_A_DAY_CYCLE)
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
	// Noon is at (CAM_SECONDS_IN_A_DAY_CYCLE / 4)
	// Dusk is at (CAM_SECONDS_IN_A_DAY_CYCLE / 2)
	// Midnight is at (3 * CAM_SECONDS_IN_A_DAY_CYCLE / 4)

	//Set the skybox
	__camSetSky(false);

	var r;
	var g;
	var b;

	if (tilesetType === "ARIZONA")
	{
		r = CAM_ARIZONA_FOG_RGB.r;
		g = CAM_ARIZONA_FOG_RGB.g;
		b = CAM_ARIZONA_FOG_RGB.b;
	}
	else if (tilesetType === "URBAN")
	{
		r = CAM_URBAN_FOG_RGB.r;
		g = CAM_URBAN_FOG_RGB.g;
		b = CAM_URBAN_FOG_RGB.b;
	}
	else
	{
		r = CAM_ROCKY_FOG_RGB.r;
		g = CAM_ROCKY_FOG_RGB.g;
		b = CAM_ROCKY_FOG_RGB.b;
	}

	// At noon fog colors are as set above
	// At dawn and dusk fog colors are at 1/2
	// At midnight all fog colors are 0 (full black)
	var colorMultiplier = Math.abs( 1 - ((2 / CAM_SECONDS_IN_A_DAY_CYCLE) * Math.abs(__camDayTime - (CAM_SECONDS_IN_A_DAY_CYCLE / 4))));
	// colorMultiplier starts as 0.5 at dawn, is 1 at noon, 0.5 at dusk, and 0 at midnight.

	r = Math.floor(r * colorMultiplier);
	g = Math.floor(g * colorMultiplier);
	b = Math.floor(b * colorMultiplier);

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
	if (__camDayTime >= CAM_SECONDS_IN_A_DAY_CYCLE / 2 && (!__camNightSkyboxSet || forceSet)) // Set to night after dusk
	{
		setSky("texpages/night-sky.png", 0.5, 10000.0);
		__camNightSkyboxSet = true;
	}
	else if (__camDayTime < CAM_SECONDS_IN_A_DAY_CYCLE / 2 && (__camNightSkyboxSet || forceSet)) // Set to day before dusk
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

	var lightPos = Math.cos((Math.PI * __camDayTime / (CAM_SECONDS_IN_A_DAY_CYCLE / 2)));
	// lightPos travels between 1 and -1 through the day, and from -1 to 1 during the night

	var intensityMultiplier = (__camDayTime < (CAM_SECONDS_IN_A_DAY_CYCLE / 2)) ? Math.sin((Math.PI * __camDayTime / (CAM_SECONDS_IN_A_DAY_CYCLE / 2))) : 0;
	// intensityMultiplier starts as 0 at dawn, is 1 at noon, 0 at dusk, and 0 during all of the night.

	var sun = {
		x: (__camDayTime < (CAM_SECONDS_IN_A_DAY_CYCLE / 2)) ? lightPos : -0.6 * lightPos, // Move less at night
		y: -0.5,
		z: (__camDayTime < (CAM_SECONDS_IN_A_DAY_CYCLE / 2)) ? 0.3 : -0.2, // Put the "moon" in a slightly different position
		ar: 0.4 + (0.1 * intensityMultiplier),
		ag: 0.4 + (0.1 * intensityMultiplier),
		ab: 0.4 + (0.1 * intensityMultiplier),
		dr: 0.5 + (0.5 * intensityMultiplier),
		dg: 0.5 + (0.5 * intensityMultiplier),
		db: 0.5 + (0.5 * intensityMultiplier),
		sr: 0.5 + (0.5 * intensityMultiplier),
		sg: 0.5 + (0.5 * intensityMultiplier),
		sb: 0.5 + (0.5 * intensityMultiplier)
	}

	setSunPosition(sun.x, sun.y, sun.z);
	setSunIntensity(sun.ar, sun.ag, sun.ab, sun.dr, sun.dg, sun.db, sun.sr, sun.sg, sun.sb);

	return true;
}
