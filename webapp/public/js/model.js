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

	$scope.rolls = [];
	$scope.skills = [
	];

	for (var i = 0; i < 15; i++) {
		$scope.rolls.push("&nbsp;");
	}

	$scope.filter_skills = function(skill) {
		var regex = new RegExp($scope.skill_search, "i");
		return skill.name.match(regex) || skill.use;
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
	});

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
			if (skill.use == false) {
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
		var successes = rolled_successes + set;
		var roll = date + " <b>" + user + "</b> rolled <b>" + successes + "</b> (" +
			set + "+" + rolled_successes + ") successes " +
			dice + "/" + $scope.proficiency + " (" + roll_text + ")"
		var data;
		try {
			data = gapi.hangout.data.getValue("rolls");
			if (data == undefined) {
				data = "[]";
			}

			data = jQuery.parseJSON(data);
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
			$scope.rolls = rolls;
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
		});
		$( "#add_skills" ).dialog({
			autoOpen: false,
			modal: false,
		});
		$( "#save" ).dialog({
			autoOpen: false,
			modal: false,
		});

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

