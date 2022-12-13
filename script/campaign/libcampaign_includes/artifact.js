
////////////////////////////////////////////////////////////////////////////////
// Artifacts management.
////////////////////////////////////////////////////////////////////////////////

//;; ## camSetArtifacts(artifacts)
//;;
//;; Tell ```libcampaign.js``` to manage a certain set of artifacts.
//;; The argument is a JavaScript map from object labels to artifact
//;; description. If the label points to a game object, artifact will be
//;; placed when this object is destroyed; if the label is a position, the
//;; artifact will be placed instantly. Artifact description is a JavaScript
//;; object with the following fields:
//;;
//;; * ```tech``` The technology to grant when the artifact is recovered.
//;; * ```req``` The required research to spawn the artifact. If the player has not researched this yet,
//;; the tech will instead be placed in the research menu when the required research is done.
//;; Note that this can be made into an array to make artifacts give out
//;; more than one technology, if desired.
//;; On __let me win__ cheat, all technologies stored in the artifacts
//;; managed by this function are automatically granted.
//;; Additionally, this function would call special event callbacks if they are
//;; defined in your script, which should be named as follows,
//;; where LABEL is the artifact label:
//;; * ```camArtifactPickup_LABEL``` Called when the player picks up
//;; 	the artifact.
//;;
function camSetArtifacts(artifacts)
{
	__camArtifacts = artifacts;
	for (var alabel in __camArtifacts)
	{
		camAddArtifact(alabel);
	}
}

//;; ## camAddArtifact(artifact)
//;;
//;; Adds a single artifact to manage. If an artifact for this 
//;; label already exists, it will be replaced.
//;;
function camAddArtifact(artifact)
{
	var alabel;

	// Artifact object from level script?
	if (artifact instanceof Object)
	{
		var keys = Object.keys(artifact);
		if (keys.length !== 1)
		{
			camDebug("Only one artifact can be added at a time");
			return;
		}
		alabel = keys[0];
		__camArtifacts[alabel] = artifact[alabel];
	}
	else if (camIsString(artifact))
	{
		alabel = artifact;
	}
	else
	{
		camDebug("Unkown artifact type");
		return;
	}

	camTrace("Adding artifact", alabel);
	var ai = __camArtifacts[alabel];
	var pos = camMakePos(alabel);
	if (camDef(pos.id))
	{
		// will place when object with this id is destroyed
		ai.id = "" + pos.id;
		ai.placed = false;
	}
	else
	{
		// received position or area, place immediately
		var acrate = addFeature("Crate", pos.x, pos.y);
		addLabel(acrate, __camGetArtifactLabel(alabel));
		ai.placed = true;
	}
}

//;; ## camRemoveArtifact(alabel)
//;;
//;; Removes an artifact from management by it's label, meaning 
//;; it will not drop an artifact if destroyed. Returns true if 
//;; successful, and false if no corresponding label was found.
//;;
function camRemoveArtifact(alabel)
{
	if (!camDef(__camArtifacts[alabel]))
	{
		camTrace("Couldn't remove artifact", alabel, "; no artifact found");
		return false; // The artifact wasn't managed / was already removed.
	}
	else
	{
		if (!__camArtifacts[alabel].placed)
		{
			// Artifact hasn't dropped yet
			camTrace("Removing artifact from object", alabel);
			delete __camArtifacts[alabel];
			return true;
		}
		var crate = getObject(__camGetArtifactLabel(alabel));
		if (camDef(crate) && crate !== null)
		{
			// Artifact dropped, but not picked up
			camTrace("Removing artifact crate", __camGetArtifactLabel(alabel));
			camSafeRemoveObject(__camGetArtifactLabel(alabel));
			delete __camArtifacts[alabel];
			return true;
		}
		else
		{
			// Artifact already picked up (not an error!)
			camTrace("Couldn't remove artifact", alabel, "probably already picked up");
			delete __camArtifacts[alabel];
			return false;
		}
	}
}

//;; ## camAllArtifactsPickedUp()
//;;
//;; Returns true if all artifacts managed by ```libcampaign.js```
//;; were picked up.
//;;
function camAllArtifactsPickedUp()
{
	// FIXME: O(n) lookup here
	return __camNumArtifacts === Object.keys(__camArtifacts).length;
}

//Returns the labels of all existing artifacts.
function camGetArtifacts()
{
	var camArti = [];
	for (var alabel in __camArtifacts)
	{
		var artifact = __camArtifacts[alabel];
		var libLabel = __camGetArtifactLabel(alabel);
		//libcampaign managed artifact that was placed on the map.
		if (artifact.placed && getObject(libLabel) !== null)
		{
			camArti.push(libLabel);
		}
		//Label for artifacts that will drop after an object gets destroyed. Or is manually managed.
		//NOTE: Must check for ID since "alabel" could be a AREA/POSITION label.
		var obj = getObject(alabel);
		if (obj !== null && camDef(obj.id))
		{
			camArti.push(alabel);
		}
	}
	return camArti;
}

//////////// privates

function __camGetArtifactLabel(alabel)
{
	return alabel + "_artifact_label";
}

function __camGetArtifactKey(objlabel)
{
	return objlabel.replace("_artifact_label", "");
}

// called from eventDestroyed
function __camCheckPlaceArtifact(obj)
{
	// FIXME: O(n) lookup here
	var alabel = getLabel(obj);
	if (!camDef(alabel) || !alabel)
	{
		return;
	}
	var ai = __camArtifacts[alabel];
	if (!camDef(ai))
	{
		// No artifact for the given obj
		return;
	}
	if (ai.placed)
	{
		// Since factories can be rebuilt, this is no longer an error.
		camTrace("Object to which artifact", alabel, "is bound has died twice");
		return; // Do nothing
	}
	if (camDef(ai.req) && !camIsResearched(ai.req))
	{
		camTrace("Player hasn't researched enough for artifact to drop; " 
			+ "hiding artifact tech until player progresses.");

		if (ai.tech instanceof Array)
		{
			for (var i = 0; i < ai.tech.length; ++i)
			{
				var techString = ai.tech[i];
				__camHiddenResearch.push({ tech: techString, req: ai.req});
				camTrace("Hiding tech:", techString);
			}
		}
		else
		{
			camTrace("Hiding tech:", ai.tech);
			__camHiddenResearch.push({ tech: ai.tech, req: ai.req});
		}

		ai.placed = true; // Don't try to place later
		++__camNumArtifacts;
		return;
	}
	if (ai.tech instanceof Array)
	{
		camTrace("Placing multi-tech granting artifact");
		for (var i = 0; i < ai.tech.length; ++i)
		{
			var techString = ai.tech[i];
			camTrace(i, ":", techString);
		}
	}
	else
	{
		camTrace("Placing", ai.tech);
	}
	var acrate = addFeature("Crate", obj.x, obj.y);
	addLabel(acrate, __camGetArtifactLabel(alabel));
	ai.placed = true;
}

function __camPickupArtifact(artifact)
{
	if (artifact.stattype !== ARTIFACT)
	{
		camDebug("Not an artifact");
		return;
	}
	// FIXME: O(n) lookup here
	var alabel = __camGetArtifactKey(getLabel(artifact));
	var ai = __camArtifacts[alabel];
	if (!camDef(alabel) || !alabel || !camDef(ai))
	{
		camTrace("Artifact", artifact.id, "is not managed");
		return;
	}

	camTrace("Picked up", ai.tech);
	playSound("pcv352.ogg", artifact.x, artifact.y, artifact.z);
	// artifacts are not self-removing...
	camSafeRemoveObject(artifact);
	if (ai.tech instanceof Array)
	{
		for (var i = 0; i < ai.tech.length; ++i)
		{
			var techString = ai.tech[i];
			enableResearch(techString);
		}
	}
	else
	{
		enableResearch(ai.tech);
	}
	// bump counter before the callback, so that it was
	// actual during the callback
	++__camNumArtifacts;
	var callback = __camGlobalContext()["camArtifactPickup_" + alabel];
	if (camDef(callback))
	{
		callback();
	}

	__camSetupConsoleForVictoryConditions();
}

function __camLetMeWinArtifacts()
{
	for (var alabel in __camArtifacts)
	{
		var ai = __camArtifacts[alabel];
		if (ai.placed)
		{
			var label = __camGetArtifactLabel(alabel);
			var artifact = getObject(label);
			if (!camDef(artifact) || !artifact)
			{
				continue;
			}
			__camPickupArtifact(artifact);
		}
		else
		{
			if (ai.tech instanceof Array)
			{
				for (var i = 0; i < ai.tech.length; ++i)
				{
					var techString = ai.tech[i];
					enableResearch(techString);
				}
			}
			else
			{
				enableResearch(ai.tech);
			}
		}
	}
}
