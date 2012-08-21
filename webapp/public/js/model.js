var LoreRoller = angular.module('LoreRoller', ['ngSanitize']);

function binom(n, k) {
	var coeff = 1;
	for (var i = n-k+1; i <= n; i++) coeff *= i;
	for (var i = 1;     i <= k; i++) coeff /= i;
	return coeff;
}

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
	$scope.dialog = {};

	$scope.select_abilities = [
		"Might",
		"Agility",
		"Vigor",
		"Charisma",
		"Intelligence",
		"Wisdom",
		"Combat",
		"Patterns",
	];

	$scope.skill_ability = $scope.select_abilities[0];

	$scope.show_unknown_skills = true;
	
	$scope.abilities = {
		Might:         5,
		Agility:       5,
		Vigor:         5,
		Charisma:      5,
		Intelligence:  5,
		Wisdom:        5
	};

	$scope.custom_pool  = 0;
	$scope.current_pool = "Power";
	$scope.proficiency  = 3;
	$scope.multiplier   = "1x";
	$scope.stamina = [
	];

	for (var i = 0; i < 12; i++) {
		$scope.stamina[i] = [];
		for (var j = 0; j < 3; j++) {
			$scope.stamina[i][j] = false;
		}
	}

	var calc_average = function(a,b) { return function() { return Math.ceil(($scope.abilities[a]+$scope.abilities[b])/2) } };
	var calc_willpower = function() {
		var stam = 0;
		for (var i = 11; i >= 0; i--) {
			if ($scope.stamina[i][2] == true) {
				stam = i + 1;
				break;
			}
		}
		var base = calc_average("Vigor", "Charisma")();
		var pool = base - stam;
		//if stam > 6 then it counts twice
		if (stam > 6) {
			pool -= stam - 6;
		}

		return pool;
	};
	$scope.pools = {
		Power:          calc_average("Might", "Agility"),
		Resilience:     calc_average("Might", "Vigor"),
		Finesse:        calc_average("Agility", "Wisdom"),
		Presence:       calc_average("Charisma", "Wisdom"),
		Deduction:      calc_average("Intelligence", "Wisdom"),
		Attunement:     calc_average("Charisma", "Intelligence"),
		Comprehension:  calc_average("Might", "Intelligence"),
		Willpower:      calc_willpower,
		Custom:         function() { return $scope.custom_pool },
	};
	$scope.battle = { weapons: [], inititive: 0, focus: $scope.pools.Willpower() };
	$scope.accuracy = function() {
		var accuracy = 0;
		for (weapon in $scope.weapons) {
			accuracy += $scope.battle.weapons.skill + $scope.battle.weapons.modifier;
		}
		accuracy += $scope.battle.inititive;
		return accuracy;
	}
	$scope.pools.Swat           = function() { return $scope.pools.Power() };
	$scope.pools.Tag            = function() { $scope.battle.focus--; return 3 + $scope.accuracy() };
	$scope.pools.Cleave         = function() { $scope.battle.focus -= 2; return $scope.pools.Power() + $scope.accuracy() };
	$scope.pools.Devastate      = function() { $scope.battle.focus -= 3; return 2 * $scope.pools.Power() + $scope.accuracy() };
	$scope.pools["Slow Exhale"] = function() { $scope.battle.focus -= 4; return $scope.pools.Power() + 2 * $scope.accuracy() };
	$scope.pools.Flinch         = function() { return $scope.pools.Resilience() };
	$scope.pools.Dodge          = function() { $scope.battle.focus -= 1; var pool = 3 + $scope.accuracy(); $scope.battle.inititive--; return pool };
	$scope.pools.Counterattack  = function() { return $scope.accuracy() };
	$scope.pools.Block          = function() { return $scope.pools.Resilience() + $scope.accuracy() };
	$scope.pools.Brace          = function() { return 2 * $scope.pools.Resilience() + $scope.accuracy() };

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

	$scope.sortable_use = function(skill) {
		if (skill) {
			return 0;
		} else {
			return 1;
		}
	};
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

	$scope.open_add_skills = function() {
	};

	$scope.add_skill = function() {
		$scope.skills.push({
			use:        false,
			ability:    $scope.dummy_skill.ability,
			name:       $scope.dummy_skill.name,
			rank:       $scope.dummy_skill.rank,
			advancing:  $scope.dummy_skill.advancing,
		});
		$scope.dummy_skill = {
			use:        false,
			ability:    $scope.skill_ability.name,
			name:       "",
			rank:       0,
			advancing:  0
		};
	};

	$scope.select_skill = function(skill) {
		var checkbox = $("#" + skill.name);
		if (skill.use) {
			skill.use = false;
			skill.class = "";
		} else {
			skill.use = true;
			skill.class = "selected_skill";
		}
       	};
	$scope.edit_skill = function(skill) {
		if (skill.name) {
			$scope.dummy_skill = skill;
			$scope.show_add_skill = false;
		} else {
			$scope.dummy_skill = {
				use:        false,
				ability:    $scope.skill_ability.name,
				name:       "",
				rank:       0,
				advancing:  0
			};
			$scope.show_add_skill = true;
		}
		$("#add_skills").dialog("open");
	}
	$scope.delete_skill = function(skill) {
		var i = $scope.skills.indexOf(skill);
		if (i >= 0) {
			$scope.skills.splice(i, 1);
		}
		$("#add_skills").dialog("close");
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
		var o = {
			stamina:   $scope.stamina,
			abilities: $scope.abilities,
			name:      $scope.character_name,
			faith:     $scope.faith,
			virtue:    $scope.virtue,
			inventory: $scope.inventory,
			skills:    $scope.skills,
			windows:   {}
		};
		$(".ui-dialog-content").each(function() {
			o.windows[this.id] = {
				pos: $(this).dialog( "option", "position" ),
				w: $(this).dialog( "option", "width" ),
				h: $(this).dialog( "option", "height" ),
				open: $(this).dialog("isOpen")
			}
		});
		
		var jsondata = angular.toJson(o);

		var id;
		if (hangout.length) {
			id = gapi.hangout.getParticipantById(gapi.hangout.getParticipantId()).person.id;
		} else {
			id = 10041697270;
		}

		$.ajax({
			url: platform + "/save",
			dataType: 'jsonp',
			data: { id: id, name: $scope.character_name, data: jsondata },
			success: function() {
				if (hangout.length) {
					gapi.hangout.layout.displayNotice($scope.character_name + " was saved");
				} else {
					alert($scope.character_name + " was saved");
				}
			}
		});

		return;
	}

	$scope.load = function() {
		var id;
		if (hangout.length) {
			id = gapi.hangout.getParticipantById(gapi.hangout.getParticipantId()).person.id;
		} else {
			id = 10041697270;
		}

		$.ajax({
			url: platform + "/load",
			dataType: 'jsonp',
			data: { name: $scope.character_name, id: id },
			success: function(data) {
				$scope.$apply(function() {
					$scope.stamina   = data.stamina;
					$scope.abilities = data.abilities;
					$scope.name      = data.character_name;
					$scope.virtue    = data.virtue;
					$scope.faith     = data.faith;
					$scope.inventory = data.inventory;
					$scope.skills    = data.skills;
				});
				for (var id in data.windows) {
					var win = data.windows[id];
					var q   = '#' + id;
					$(q).dialog("destroy");
					$(q).dialog({
						autoOpen: win.open,
						width: win.w,
						height: win.h,
						position: win.pos,
						open: function(e, ui) {
							$scope.dialog[id] = true;
						},
						close: function(e, ui) {
							$scope.dialog[id] = false;
						},
					});
				}
			}
		});
	};

	$scope.roll = function() {
		var pool = $scope.pools[$scope.current_pool]();
		var dice = pool * parseInt($scope.multiplier);
		var rolls = [];
		var rolled_successes = 0;
		var set;

		var skills = [];
		for (var i = 0; i < $scope.skills.length; i++) {
			var skill = $scope.skills[i];
			if (!skill.use) {
				continue;
			}

			skills.push(skill.name + " " + skill.rank);

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
		if (hangout.length) {
			user = gapi.hangout.getParticipantById(
					gapi.hangout.getParticipantId()
					).person.displayName;
		}
		var roll_text = rolls.length < 38 ? rolls.sort().join(", ") : "lots";
		var total_successes = rolled_successes + set;
		var roll = date + " <b>" + user + "</b> ";
		if (rolled_successes == 0) {
			roll += "crit failed";
		} else if (rolled_successes == dice && dice > 5) {
			roll += "got a crit";
		} else {
			roll += "got <b>" + total_successes + "</b> successes";
		}
		roll += " ";
		if (set > 0) {
			roll += "(" + set + " set + " + rolled_successes + " rolled) ";
		}
		roll += dice + "/" + $scope.proficiency + " (" + roll_text + ")"
			var data;
		if (hangout.length) {
			data = gapi.hangout.data.getValue("rolls");
			if (data == undefined) {
				data = "[]";
			}

			data = jQuery.parseJSON(data);
		} else {
			data = $scope.rolls;
		}

		var o = {
			html: roll,
			prof: $scope.proficiency,
			set: set,
			skills: skills,
			dice: dice,
			rolled_successes: rolled_successes,
			rolls: roll_text,
			pool: $scope.current_pool,
			successes: rolled_successes + set
		};

		data.unshift(o);
		while (data.length > 15) {
			data.pop();
		}
		while (data.length < 15) {
			data.push("&nbsp;");
		}
		if (hangout.length) {
			gapi.hangout.data.setValue("rolls", angular.toJson(data));
		}
	};

	$scope.show_roll_details = function(i) {
		$scope.roll_details = $scope.rolls[i];
		$("#roll_details").dialog("open");
	}

	$scope.odds = function() {
		var pool = $scope.pools[$scope.current_pool]();
		var dice = pool * parseInt($scope.multiplier);
		var prof = $scope.proficiency;
		var total = 0;
		var chances = [];
		$scope.average = ((dice*prof)/6).toFixed(1);
		for (var k = dice; k >= 1; k--) {
			var chance = binom(dice, k) * Math.pow((prof/6), k) * Math.pow(((6 - prof) / 6), (dice - k));

			total += chance;
			chances.push(k + ": " + (total*100).toFixed(2) + "%");
		}
		return chances;
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

		$("input[name=multiplier]").change(function(){
			var prof = this.id == "1x" ? "3" : this.id == "2x" ? "2" : "1";
			$scope.$apply(function(){
				$scope.proficiency = prof;
			});
			$("#prof").buttonset("refresh");
		});
		var lock_mult = function(prof) {
			$scope.$apply(function(){
				$scope.multiplier = "1x";
				$scope.proficiency = prof;
			});
			$("#mult").buttonset("refresh").buttonset("disable");
			$("#prof").buttonset("refresh");
		};
		var lock_pool_options = function() {
			$scope.$apply(function(){
				$scope.proficiency = 3;
				$scope.multiplier = "1x";
			});
			$("#prof").buttonset("refresh").buttonset("disable");
			$("#mult").buttonset("refresh").buttonset("disable");
		};
		$("#Comprehension").change(lock_pool_options);
		$("#Willpower").change(lock_pool_options);
		$("#Custom").change(lock_pool_options);

		var unlock_pool_options = function() {
			$("#prof").buttonset("enable");
			$("#mult").buttonset("enable");
		};
		$("#Power").change(unlock_pool_options);
		$("#Resilience").change(unlock_pool_options);
		$("#Finesse").change(unlock_pool_options);
		$("#Presence").change(unlock_pool_options);
		$("#Deduction").change(unlock_pool_options);
		$("#Attunement").change(unlock_pool_options);
		$("#Swat").change(function()          { this.checked ? lock_mult(3) : unlock_pool_options() });
		$("#Tag").change(function()           { this.checked ? lock_mult(3) : unlock_pool_options() });
		$("#Cleave").change(function()        { this.checked ? lock_mult(2) : unlock_pool_options() });
		$("#Devastate").change(function()     { this.checked ? lock_mult(1) : unlock_pool_options() });
		$("#Slow Exhale").change(function()   { this.checked ? lock_mult(1) : unlock_pool_options() });
		$("#Flinch").change(function()        { this.checked ? lock_mult(3) : unlock_pool_options() });
		$("#Dodge").change(function()         { this.checked ? lock_mult(3) : unlock_pool_options() });
		$("#Counterattack").change(function() { this.checked ? lock_mult(3) : unlock_pool_options() });
		$("#Block").change(function()         { this.checked ? lock_mult(2) : unlock_pool_options() });
		$("#Brace").change(function()         { this.checked ? lock_mult(1) : unlock_pool_options() });

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

		var dialog = function(name, width) {
			$( "#" + name ).dialog({
				autoOpen: false,
				width: width,
				open: function() {
					$scope.dialog[name] = true;
				},
				close: function() {
					$scope.dialog[name] = false;
				}
			});
		};

		dialog("pools",           "35em");
		dialog("rolls",           "35em");
		dialog("display_armor",   "20em");
		dialog("display_weapon",  "20em");
		dialog("display_item",    "20em");
		dialog("skills",          "20.5em");
		dialog("stats");
		dialog("stamina");
		dialog("roll_details");
		dialog("add_skills");
		dialog("save");
		dialog("inventory");
		dialog("add_items");
		dialog("odds");
		$("#skills").dialog().bind("dialogresize", function(event, ui) {
			$('#skills .scrolled_content').height( $("#skills").height() - $("#skills .fixed_header").height() );
		});
		$('#skills .scrolled_content').height(100);

		$(".skill_edit").button();
		$('#skills_table').tableScroll({height:200});
		$("#inventory_list").sortable();
		$("#inventory_list").disableSelection();
		$("#combat_pools").buttonset();

		if (hangout.length) {
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
		}
	}, 0);
}

