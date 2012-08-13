function ModelCtrl($scope, $timeout, $filter) {

	$scope.dialog = {
		rolls: true,
		pools: true,
		info: false,
		stamina: true,
		skills: true,
		save: false,
	};

	$scope.select_abilities = [
		{ name: "Might" },
		{ name: "Agility" },
		{ name: "Vigor" },
		{ name: "Charisma" },
		{ name: "Intelligence" },
		{ name: "Wisdom" },
	];

	$scope.skill_ability = $scope.select_abilities[0];

	$scope.show_unknown_skills = true;
	
	$scope.abilities = [
		{
			name: "Physical",
			abilities: [
				{ name: "Might", value: 5 }, 
				{ name: "Agility", value: 5 }, 
				{ name: "Vigor", value: 5 }, 
			],
		},
		{
			name: "Mental",
			abilities: [
				{ name: "Charisma", value: 5 }, 
				{ name: "Intellignce", value: 5 }, 
				{ name: "Wisdom", value: 5 }, 
			],
		},
	];

	$scope.custom_pool  = 0;
	$scope.current_pool = "Power";
	$scope.proficiency  = 3;
	$scope.multiplier   = 1;

	$scope.pools = [
		[
			{ name: "Power",      value: function() { return Math.ceil(($scope.abilities[0]["abilities"][0].value + $scope.abilities[0]["abilities"][1].value) / 2) } },
			{ name: "Resilience", value: function() { return Math.ceil(($scope.abilities[0]["abilities"][0].value + $scope.abilities[0]["abilities"][2].value) / 2) } },
			{ name: "Finesse",    value: function() { return Math.ceil(($scope.abilities[1]["abilities"][2].value + $scope.abilities[0]["abilities"][1].value) / 2) } },
		],
		[
			{ name: "Presence",   value: function() { return Math.ceil(($scope.abilities[1]["abilities"][0].value + $scope.abilities[1]["abilities"][2].value) / 2) } },
			{ name: "Deduction",  value: function() { return Math.ceil(($scope.abilities[1]["abilities"][0].value + $scope.abilities[1]["abilities"][1].value) / 2) } },
			{ name: "Attunement", value: function() { return Math.ceil(($scope.abilities[1]["abilities"][1].value + $scope.abilities[1]["abilities"][2].value) / 2) } },
		],
		[
			{ name: "Comprehension", value: function() { return Math.ceil(($scope.abilities[0]["abilities"][0].value + $scope.abilities[1]["abilities"][1].value) / 2) } },
			{
				name: "Willpower",
				value: function() {
					var stam = 0;
					for (var i = 11; i >= 0; i--) {
						if ($scope.stamina[i][2] == true) {
							stam = i + 1;
							break;
						}
					}
					var base = Math.ceil(($scope.abilities[1]["abilities"][0].value + $scope.abilities[1]["abilities"][2].value) / 2);
					var pool = base - stam;
					//if stam > 6 then it counts twice
					if (stam > 6) {
						pool -= stam - 6;
					}

					return pool;
				}
			},
			{ name: "Custom", class: "edit", value: function() { return $scope.custom_pool } },
		],
	];

	$scope.stamina = [
	];

	for (var i = 0; i < 12; i++) {
		$scope.stamina[i] = [];
		for (var j = 0; j < 3; j++) {
			$scope.stamina[i][j] = false;
		}
	}

	//find a way to handle things like crafting and language
	$scope.rolls = [];
	$scope.skills = [
		{ rank: 0, advancing: 0, ability: "might", name: "bashing" },
		{ rank: 0, advancing: 0, ability: "might", name: "catching" },
		{ rank: 0, advancing: 0, ability: "might", name: "climbing" },
		{ rank: 0, advancing: 0, ability: "might", name: "crushing" },
		{ rank: 0, advancing: 0, ability: "might", name: "flying" },
		{ rank: 0, advancing: 0, ability: "might", name: "gripping" },
		{ rank: 0, advancing: 0, ability: "might", name: "jumping" },
		{ rank: 0, advancing: 0, ability: "might", name: "lifting/carrying" },
		{ rank: 0, advancing: 0, ability: "might", name: "lumbering" },
		{ rank: 0, advancing: 0, ability: "might", name: "punting" },
		{ rank: 0, advancing: 0, ability: "might", name: "pushing/pulling" },
		{ rank: 0, advancing: 0, ability: "might", name: "ramming" },
		{ rank: 0, advancing: 0, ability: "might", name: "rooting" },
		{ rank: 0, advancing: 0, ability: "might", name: "rowing" },
		{ rank: 0, advancing: 0, ability: "might", name: "running" },
		{ rank: 0, advancing: 0, ability: "might", name: "shearing" },
		{ rank: 0, advancing: 0, ability: "might", name: "slaming" },
		{ rank: 0, advancing: 0, ability: "might", name: "swimming" },
		{ rank: 0, advancing: 0, ability: "might", name: "tackling" },
		{ rank: 0, advancing: 0, ability: "might", name: "throwing" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "alertness" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "butchery" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "carpentry" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "carving" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "cobbling" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "crafting" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "cultivating" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "digging" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "endurance" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "farriering" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "forging (drop)" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "glass-working" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "harvesting" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "leatherwork" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "masonry" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "sculpting" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "sewing/tailoring" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "smithing" },
		{ rank: 0, advancing: 0, ability: "vigor", name: "stabilize" },
		{ rank: 0, advancing: 0, ability: "agility", name: "acrobatics" },
		{ rank: 0, advancing: 0, ability: "agility", name: "balance" },
		{ rank: 0, advancing: 0, ability: "agility", name: "bowyer/fletching" },
		{ rank: 0, advancing: 0, ability: "agility", name: "break fall" },
		{ rank: 0, advancing: 0, ability: "agility", name: "concealment" },
		{ rank: 0, advancing: 0, ability: "agility", name: "contortion" },
		{ rank: 0, advancing: 0, ability: "agility", name: "dexterity" },
		{ rank: 0, advancing: 0, ability: "agility", name: "disarm" },
		{ rank: 0, advancing: 0, ability: "agility", name: "drawing" },
		{ rank: 0, advancing: 0, ability: "agility", name: "driving" },
		{ rank: 0, advancing: 0, ability: "agility", name: "gaming (agility)" },
		{ rank: 0, advancing: 0, ability: "agility", name: "lock picking" },
		{ rank: 0, advancing: 0, ability: "agility", name: "painting" },
		{ rank: 0, advancing: 0, ability: "agility", name: "pickpocket" },
		{ rank: 0, advancing: 0, ability: "agility", name: "precision" },
		{ rank: 0, advancing: 0, ability: "agility", name: "riding" },
		{ rank: 0, advancing: 0, ability: "agility", name: "rope handling" },
		{ rank: 0, advancing: 0, ability: "agility", name: "slight of hand" },
		{ rank: 0, advancing: 0, ability: "agility", name: "stealth" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "acting" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "charioteering" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "courage" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "dancing" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "empathy" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "etiquette" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "expression" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "fabrication" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "herding" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "impersonation" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "inspiration" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "magnetism" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "mercantile" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "misdirection" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "patience" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "singing" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "taunt" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "teamwork" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "training (animal)" },
		{ rank: 0, advancing: 0, ability: "charisma", name: "ventrilioquism" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "agriculture" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "anatomy" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "arithmetic" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "astronomy" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "brewing" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "cartography" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "computer" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "cooking" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "electronics" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "engineering" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "fishing" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "herbalism" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "history" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "language (arcane)" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "language (common)" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "language (dwarvish)" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "language (elvish)" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "language (gnomish)" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "language (minotaur)" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "language (solamnic)" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "logic" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "medicine" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "memory" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "metallurgy" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "schooling (arcane)" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "schooling (common)" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "schooling (dwarvish)" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "schooling (elvish)" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "schooling (minotaur)" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "schooling (solamnic)" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "science" },
		{ rank: 0, advancing: 0, ability: "intelligence", name: "weaving" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "awareness (sight)" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "awareness (sound)" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "awareness (touch)" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "awareness (taste)" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "awareness (smell)" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "awareness (general)" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "concentration" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "debate" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "diplomacy" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "direction sense" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "entity" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "fire building" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "forgery" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "gaming (wisdom)" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "hunting" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "instrument" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "intuition" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "navigation" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "pilot" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "politics" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "read lips" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "research" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "snare/traps" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "survival" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "tracking" },
		{ rank: 0, advancing: 0, ability: "wisdom", name: "weather sense" },
	];

	for (var i = 0; i < 15; i++) {
		$scope.rolls.push("&nbsp;");
	}

	$scope.filter_skills = function(skill) {
		var regex = new RegExp($scope.skill_search, "i");
		var show;
		if ($scope.show_unknown_skills) {
			show = skill.name.match(regex) || skill.use;
		} else {
			show = ((skill.rank > 0 || skill.advancing > 0) && skill.name.match(regex)) ||
				skill.use;
		}

		return show;
	}

	$scope.add_skill = function() {
		$scope.skills.push({
			use: false,
			ability: $scope.skill_ability,
			name: $scope.skill_name,
			rank: $scope.skill_rank,
			advancing: $scope.skill_advancing,
		});
	}

	$scope.toggle_menu = function() {
		$('#config').toggle("slide", { direction: "down" }, "slow");
	};

	$scope.toggle = function(id) {
		if ($scope.dialog[id]) {
			$("#" + id).dialog("close");
			$scope.dialog[id] = false;
		} else {
			$("#" + id).dialog("open");
			$scope.dialog[id] = true;
		}
	}

	$scope.save = function() {
		var o = { stamina: [] };
		for (var i = 0; i < 12; i++) {
			o.stamina[i] = 0;
			for (var j = 3; j >= 0; j--) {
				if ($scope.stamina[i][j]) {
					o.stamina[i] = j;
					break;
				}
			}
		}

		o.skills    = $scope.skills;
		o.abilities = $scope.abilities;
		o.name      = $scope.character_name;

		var jsondata = JSON.stringify(o);

		var id;
		try {
			id = gapi.hangout.getParticipantById(gapi.hangout.getParticipantId()).person.id;
		} catch(e) {
			console.log(e);
			id = 10041697270;
		}

		console.log(jsondata);
		return;

		$.ajax({
			url: "https://loreroller-cowens.dotcloud.com/save",
			dataType: 'jsonp',
			data: { id: id, name: $scope.character_name, data: jsondata },
			success: function() {
				try {
					gapi.hangout.layout.displayNotice(name + " was saved");
				} catch(e) {
					console.log(e);
					alert($scope.character_name + " was saved");
				}
			}
		});
		return;
	}

	$scope.load = function() {
		var id;
		try {
			id = gapi.hangout.getParticipantById(gapi.hangout.getParticipantId()).person.id;
		} catch(e) {
			id = 10041697270;
		}

		$.ajax({
			url: "https://loreroller-cowens.dotcloud.com/load",
			dataType: 'jsonp',
			data: { name: $scope.character_name, id: id },
			success: function(data) {
				for (m = 0; m <= 11; m++) {
					level = data.stamina[m];
					for (n = 1; n <= level; n++) {
						$scope.stamina[m][n] = true;
					}
					for (n = level + 1; n <= 3; n++) {
						$scope.stamina[m][n] = false;
					}
				}
				$scope.skills    = data.skills;
				$scope.abilities = data.abilities;
				$scope.name      = data.character_name;
			}
		});
	}

	$scope.roll = function() {
		var pool;
		for (var i = 0; i < $scope.pools.length; i++) {
			for (var j = 0; j < $scope.pools[i].length; j++) {
				if ($scope.pools[i][j].name == $scope.current_pool) {
					pool = $scope.pools[i][j].value();
					break;
				}
			}
		}
		var dice = pool * $scope.multiplier;
		var rolls = [];
		var rolled_successes = 0;
		var set;

		for (var i = 0; i < $scope.skills.length; i++) {
			var skill = $scope.skills[i];
			if (!skill.use) {
				continue;
			}

			if (set == undefined) {
				set = skill.rank;
				continue;
			}

			if (set > skill.rank) {
				set = skill.rank
			}
		}
		if (set == undefined) {
			set = 0
		}
		set *= 2;

		for (var i = 0; i < dice; i++) {
			var roll = Math.floor((Math.random()*6)+1);
			rolls.push(roll);
			if (roll <= $scope.proficiency) {
				rolled_successes++;
			}
		}
	
		var date = $filter('date')(new Date, "HH:mm:ss");
		var user = "X";
		try {
			user = gapi.hangout.getParticipantById(
				gapi.hangout.getParticipantId()
			).person.displayName;
		} catch(e) {
			console.log(e);
		}
		var roll_text = rolls.length < 38 ? rolls.sort().join(", ") : "lots";
		var total_successes = rolled_successes + set;
		var roll = date + " <b>" + user + "</b> ";
	       	if (rolled_successes == 0) {
			roll += "crit failed ";
		} else if (rolled_successes == dice && dice > 5) {
			roll += "got a crit ";
		} else {
			roll += "got <b>" + total_successes + "</b> successes ";
		}
		if (set > 0) {
			roll += "(" + set + " set + " + rolled_successes + " rolled) ";
		}
		roll += dice + "/" + $scope.proficiency + " (" + roll_text + ")"
		var data;
		try {
			data = gapi.hangout.data.getValue("rolls");
			if (data == undefined) {
				data = "[]";
			}

			ata = jQuery.parseJSON(data);
		} catch(e) {
			console.log(e);
			data = $scope.rolls;
		}

		data.unshift(roll);
		while (data.length > 15) {
			data.pop();
		}
		while (data.length < 15) {
			data.push("&nbsp;");
		}
		try {
			gapi.hangout.data.setValue("rolls", JSON.stringify(data));
		} catch(e) {
			console.log(e);
		}
	};

	//jQuery stuff needs to run after the DOM has been manipulated
	$timeout(function() {
		//make the stamina checkboxes not allow invalid configurations
		for (var n = 0; n < 12; n += 1) {
			$("#s" + n + "_0").change(function() {
				if (!this.checked) {
					var i = this.id.split("_")[0].split("s")[1];
					$scope.$apply(function() {
						$scope.stamina[i][1] = false;
						$scope.stamina[i][2] = false;
					});
				}
			});
			$("#s" + n + "_1").change(function() {
				var i = this.id.split("_")[0].split("s")[1];
				$scope.$apply(function() {
					if (this.checked) {
						$scope.stamina[i][0] = true;
					} else {
						$scope.stamina[i][2] = false;
					}
				});
			});
			$("#s" + n + "_2").change(function() {
				if (this.checked) {
					var i = this.id.split("_")[0].split("s")[1];
					$scope.$apply(function() {
						$scope.stamina[i][0] = true;
						$scope.stamina[i][1] = true;
					});
				}
			});
		}

		$(".pool_group").buttonset();
		$("#mult").buttonset();
		$("#prof").buttonset();
		$("#roll_button").button();

		$('.edit span').editable(function(value, settings) {
			$scope.$apply(function() { 
				$scope.custom_pool = parseInt(value);
			});
			return value;
		}, {
			style: "inherit",
			tooltip: "double click to change",
			event: "dblclick",
		});
		$( "#pools" ).dialog({
			autoOpen: true,
			width: "35em",
			modal: false,
			position: [ 0, 0 ],
		});
		$( "#info" ).dialog({
			autoOpen: false,
			modal: false,
			position: [ 312, 250 ],
		});
		$( "#stamina" ).dialog({
			autoOpen: true,
			modal: false,
			position: [ 0 , 250 ],
		});
		$( "#rolls" ).dialog({
			autoOpen: true,
			modal: false,
			width: "35em",
			position: [ 630 , 0 ],
		});
		$( "#skills" ).dialog({
			autoOpen: true,
			modal: false,
			position: [ 312, 250 ],
			height: 360,
			width: 410,
		});
		$( "#add_skills" ).dialog({
			autoOpen: false,
			modal: false,
		});
		$( "#save" ).dialog({
			autoOpen: false,
			modal: false,
		});

		$(".skill_edit").button();
		$('#skills_table').tableScroll({height:200});

		try {
			gapi.hangout.data.onStateChanged.add(
				function (change) {
					var data = gapi.hangout.data.getValue("rolls")
					if (data == undefined) {
						data = "[]";
					}
					$scope.$apply(function() {
						$scope.rolls = jQuery.parseJSON(data);
					});
				}
			);
		} catch(e) {
			console.log(e);
		}

	}, 1000);
}

