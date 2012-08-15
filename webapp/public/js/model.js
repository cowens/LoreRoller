var LoreRoller = angular.module('LoreRoller', ['ngSanitize']);

function ModelCtrl($scope, $timeout, $filter) {

	$scope.inventory_search = {};
	$scope.show_add_item = false;
	$scope.item_types = [
		'item',
		'weapon',
		'armor'
	];
	$scope.add_item_type = "item";
	$scope.open_add_item = function() {
		var item;
		switch ($scope.add_item_type) {
			case "weapon":
				item = $scope.weapon = { type: "weapon", damage: "ultralight" };
				break;
			case "armor":
				item = $scope.armor = { type: "armor" };
				break;
			default:
				item = $scope.item = { type: "item", count: 1 };
		}
		$scope.show_add_item = true;
		$scope.display_item(item);
	};
	$scope.damage_types = [
		'ultralight',
		'light',
		'moderate',
		'heavy',
		'ultraheavy'
	];
	$scope.faith = 1;
	$scope.virtue = 3;
	$scope.dialog = {
		rolls: true,
		pools: true,
		stats: false,
		stamina: true,
		skills: true,
		save: false,
		inventory: true,
	};

	$scope.select_abilities = [
		{ name: "Might" },
		{ name: "Agility" },
		{ name: "Vigor" },
		{ name: "Charisma" },
		{ name: "Intelligence" },
		{ name: "Wisdom" },
		{ name: "Combat" },
		{ name: "Patterns" },
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
					var base = Math.ceil(($scope.abilities[1]["abilities"][0].value + $scope.abilities[0]["abilities"][2].value) / 2);
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

	$scope.weapon    = {};
	$scope.item      = {};
	$scope.armor     = {};
	$scope.inventory = [];

	//find a way to handle things like crafting and language
	$scope.rolls = [];
	$scope.skills = [
		{ rank: 0, advancing: 0, ability: "Might", name: "bashing" },
		{ rank: 0, advancing: 0, ability: "Might", name: "catching" },
		{ rank: 0, advancing: 0, ability: "Might", name: "climbing" },
		{ rank: 0, advancing: 0, ability: "Might", name: "crushing" },
		{ rank: 0, advancing: 0, ability: "Might", name: "flying" },
		{ rank: 0, advancing: 0, ability: "Might", name: "gripping" },
		{ rank: 0, advancing: 0, ability: "Might", name: "jumping" },
		{ rank: 0, advancing: 0, ability: "Might", name: "lifting/carrying" },
		{ rank: 0, advancing: 0, ability: "Might", name: "lumbering" },
		{ rank: 0, advancing: 0, ability: "Might", name: "punting" },
		{ rank: 0, advancing: 0, ability: "Might", name: "pushing/pulling" },
		{ rank: 0, advancing: 0, ability: "Might", name: "ramming" },
		{ rank: 0, advancing: 0, ability: "Might", name: "rooting" },
		{ rank: 0, advancing: 0, ability: "Might", name: "rowing" },
		{ rank: 0, advancing: 0, ability: "Might", name: "running" },
		{ rank: 0, advancing: 0, ability: "Might", name: "shearing" },
		{ rank: 0, advancing: 0, ability: "Might", name: "slaming" },
		{ rank: 0, advancing: 0, ability: "Might", name: "swimming" },
		{ rank: 0, advancing: 0, ability: "Might", name: "tackling" },
		{ rank: 0, advancing: 0, ability: "Might", name: "throwing" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "alertness" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "butchery" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "carpentry" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "carving" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "cobbling" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "crafting" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "cultivating" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "digging" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "endurance" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "farriering" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "forging (drop)" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "glass-working" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "harvesting" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "leatherwork" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "masonry" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "sculpting" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "sewing/tailoring" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "smithing" },
		{ rank: 0, advancing: 0, ability: "Vigor", name: "stabilize" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "acrobatics" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "balance" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "bowyer/fletching" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "break fall" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "concealment" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "contortion" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "dexterity" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "disarm" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "drawing" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "driving" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "gaming (agility)" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "lock picking" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "painting" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "pickpocket" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "precision" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "riding" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "rope handling" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "slight of hand" },
		{ rank: 0, advancing: 0, ability: "Agility", name: "stealth" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "acting" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "charioteering" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "courage" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "dancing" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "empathy" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "etiquette" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "expression" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "fabrication" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "herding" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "impersonation" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "inspiration" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "magnetism" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "mercantile" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "misdirection" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "patience" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "singing" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "taunt" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "teamwork" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "training (animal)" },
		{ rank: 0, advancing: 0, ability: "Charisma", name: "ventrilioquism" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "agriculture" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "anatomy" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "arithmetic" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "astronomy" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "brewing" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "cartography" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "computer" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "cooking" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "electronics" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "engineering" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "fishing" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "herbalism" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "history" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "language (arcane)" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "language (common)" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "language (dwarvish)" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "language (elvish)" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "language (gnomish)" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "language (minotaur)" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "language (solamnic)" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "logic" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "medicine" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "memory" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "metallurgy" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "schooling (arcane)" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "schooling (common)" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "schooling (dwarvish)" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "schooling (elvish)" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "schooling (minotaur)" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "schooling (solamnic)" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "science" },
		{ rank: 0, advancing: 0, ability: "Intelligence", name: "weaving" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "awareness (sight)" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "awareness (sound)" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "awareness (touch)" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "awareness (taste)" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "awareness (smell)" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "awareness (general)" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "concentration" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "debate" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "diplomacy" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "direction sense" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "entity" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "fire building" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "forgery" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "gaming (wisdom)" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "hunting" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "instrument" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "intuition" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "navigation" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "pilot" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "politics" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "read lips" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "research" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "snare/traps" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "survival" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "tracking" },
		{ rank: 0, advancing: 0, ability: "Wisdom", name: "weather sense" },
	];

	for (var i = 0; i < 15; i++) {
		$scope.rolls.push("&nbsp;");
	}

	$scope.display_item = function(item) {
		$scope[item.type] = item;
		$("#display_" + item.type).dialog("open");
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
			ability: $scope.skill_ability.name,
			name: $scope.skill_name,
			rank: $scope.skill_rank,
			advancing: $scope.skill_advancing,
		});
	};

	$scope.delete_item = function(item) {
		var i = $scope.inventory.indexOf(item);
		if (i >= 0) {
			$scope.inventory.splice(i, 1);
		}
		$("#display_" + item.type).dialog("close");
	};
	$scope.add_item = function(item) {
		$scope.inventory.push(item);
		$scope.show_add_item = false;
		$("#display_" + item.type).dialog("close");
	};

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
			for (var j = 2; j >= 0; j--) {
				if ($scope.stamina[i][j]) {
					o.stamina[i] = j + 1;
					break;
				}
			}
		}

		o.abilities = $scope.abilities;
		o.name      = $scope.character_name;
		o.faith     = $scope.faith;
		o.virtue    = $scope.virtue;

		var jsondata = JSON.stringify(o);

		var id;
		try {
			id = gapi.hangout.getParticipantById(gapi.hangout.getParticipantId()).person.id;
		} catch(e) {
			console.log(e);
			id = 10041697270;
		}

		$.ajax({
			url: platform + "/save",
			dataType: 'jsonp',
			data: { id: id, name: $scope.character_name + "-body", data: jsondata },
			success: function() {
				try {
					gapi.hangout.layout.displayNotice(name + " was saved");
				} catch(e) {
					console.log(e);
					alert($scope.character_name + " was saved");
				}
			}
		});

		var chunk = [];
		var n = 0;
		for (var i = 0; i < $scope.inventory.length; i++) {
			chunk.push($scope.inventory[i]);
			var jsondata = JSON.stringify(chunk);
			if (jsondata.length < 3000 && $scope.inventory.length != (i + 1)) {
				continue;
			}
			$.ajax({
				url: platform + "/save",
				dataType: 'jsonp',
				data: { id: id, name: $scope.character_name + "-body-" + n, data: jsondata },
				success: function() {}
			});
			chunk = [];
			n++;
		}

		for (var i = 0; i < $scope.select_abilities.length; i++) {
			var ability = $scope.select_abilities[i].name;
	
			var a = [];
			for (var j = 0; j < $scope.skills.length; j++) {
				if ($scope.skills[j].ability == ability) {
					var o = {
						ability:   $scope.skills[j].ability,
						name:      $scope.skills[j].name,
						rank:      $scope.skills[j].rank,
						advancing: $scope.skills[j].advancing
					};
					a.push(o);
				}
			}

			var jsondata = JSON.stringify(a);

			$.ajax({
				url: platform + "/save",
				dataType: 'jsonp',
				data: { id: id, name: $scope.character_name + "-" + ability, data: jsondata },
				success: function() {}
			});
		}

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
			url: platform + "/load",
			dataType: 'jsonp',
			data: { name: $scope.character_name + "-body", id: id },
			success: function(data) {
				for (var m = 0; m <= 11; m++) {
					level = data.stamina[m];
					for (var n = 1; n <= level; n++) {
						$scope.$apply(function() {
							$scope.stamina[m][n - 1] = true;
						});
					}
					for (var n = level + 1; n <= 3; n++) {
						$scope.$apply(function() {
							$scope.stamina[m][n - 1] = false;
						});
					}
				}
				$scope.$apply(function() {
					$scope.abilities = data.abilities;
					$scope.name      = data.character_name;
					$scope.virtue    = data.virtue;
					$scope.faith     = data.faith;
					$scope.inventory = data.inventory;
					$scope.skills    = [];
				});

				for (var i = 0; i < $scope.select_abilities.length; i++) {
					var ability = $scope.select_abilities[i].name;
					$.ajax({
						url: platform + "/load",
						dataType: 'jsonp',
						data: { name: $scope.character_name + "-" + ability, id: id },
						success: function (a) {
							$scope.$apply(function() {
								for (var i = 0; i < a.length; i++) {
									var o = {
										name:      a[i].name,
										rank:      a[i].rank,
										advancing: a[i].advancing,
										ability:   a[i].ability
									};
									$scope.skills.push(o);
								}
							});
						}
					});
				}
			}
		});
	};

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
				if (this.checked) {
					$scope.$apply(function() {
						$scope.stamina[i][0] = true;
					});
				} else {
					$scope.$apply(function() {
						$scope.stamina[i][2] = false;
					});
				}
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

		$('#virtue').editable(function(value, settings) {
			var num = value.match(/[1-9][0-9]*/)[0];
			$scope.$apply(function() {
				$scope.virtue = num;
			});
			return num;
		}, {
			style: "inherit",
			tooltip: "click to change",
			event: "click",
			width: "3em"
		});
		$('#faith').editable(function(value, settings) {
			var num = value.match(/[1-9][0-9]*/)[0];
			$scope.$apply(function() {
				$scope.faith = num;
			});
			return num;
		}, {
			style: "inherit",
			tooltip: "click to change",
			event: "click",
			width: "3em"
		});
		$('.edit span').editable(function(value, settings) {
			var num;
			$scope.$apply(function() { 
				num = value.match(/[1-9][0-9]*/)[0];
				$scope.custom_pool = parseInt(num);
			});
			return "Custom (" + num + ")";
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
			open: function(e, ui) {
				$scope.dialog.pools = true;
			},
			close: function(e, ui) {
				$scope.dialog.pools = false;
			},
		});
		$( "#stats" ).dialog({
			autoOpen: false,
			modal: false,
			position: [ 312, 250 ],
			open: function(e, ui) {
				$scope.$apply(function() {
					$scope.dialog.stats = true;
				});
			},
			close: function(e, ui) {
					$scope.dialog.stats = false;
			},
		});
		$( "#stamina" ).dialog({
			autoOpen: true,
			modal: false,
			position: [ 0 , 250 ],
			open: function(e, ui) {
				$scope.$apply(function() {
					$scope.dialog.stamina = true;
				});
			},
			close: function(e, ui) {
					$scope.dialog.stamina = false;
			},
		});
		$( "#rolls" ).dialog({
			autoOpen: true,
			modal: false,
			width: "35em",
			position: [ 630 , 0 ],
			open: function(e, ui) {
				$scope.$apply(function() {
					$scope.dialog.rolls = true;
				});
			},
			close: function(e, ui) {
					$scope.dialog.rolls = false;
			},
		});
		$( "#skills" ).dialog({
			autoOpen: true,
			modal: false,
			position: [ 312, 250 ],
			height: 360,
			width: 410,
			open: function(e, ui) {
				$scope.$apply(function() {
					$scope.dialog.skills = true;
				});
			},
			close: function(e, ui) {
					$scope.dialog.skills = false;
			},
		});
		$( "#add_skills" ).dialog({
			autoOpen: false,
			modal: false,
			open: function(e, ui) {
				$scope.$apply(function() {
					$scope.dialog.add_skills = true;
				});
			},
			close: function(e, ui) {
					$scope.dialog.add_skills = false;
			},
		});
		$( "#save" ).dialog({
			autoOpen: false,
			modal: false,
			open: function(e, ui) {
				$scope.$apply(function() {
					$scope.dialog.save = true;
				});
			},
			close: function(e, ui) {
					$scope.dialog.save = false;
			},
		});
		$( "#inventory" ).dialog({
			autoOpen: true,
			modal: false,
			open: function(e, ui) {
				$scope.dialog.inventory = true;
			},
			close: function(e, ui) {
				$scope.dialog.inventory = false;
			},
		});
		$( "#add_items" ).dialog({
			autoOpen: false,
			modal: false,
			open: function(e, ui) {
				$scope.dialog.add_items = true;
			},
			close: function(e, ui) {
				$scope.dialog.add_items = false;
			},
		});
		$( "#display_armor" ).dialog({
			autoOpen: false,
			modal: false,
			width: "20em",
			open: function(e, ui) {
				$scope.dialog.display_armor = true;
			},
			close: function(e, ui) {
				$scope.dialog.display_armor = false;
			},
		});
		$( "#display_weapon" ).dialog({
			autoOpen: false,
			modal: false,
			width: "20em",
			open: function(e, ui) {
				$scope.dialog.display_weapon = true;
			},
			close: function(e, ui) {
				$scope.dialog.display_weapon = false;
			},
		});
		$( "#display_item" ).dialog({
			autoOpen: false,
			modal: false,
			width: "20em",
			open: function(e, ui) {
				$scope.dialog.display_item = true;
			},
			close: function(e, ui) {
				$scope.dialog.display_item = false;
			},
		});

		$(".skill_edit").button();
		$('#skills_table').tableScroll({height:200});
		$("#inventory_list").sortable();
		$("#inventory_list").disableSelection();

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

