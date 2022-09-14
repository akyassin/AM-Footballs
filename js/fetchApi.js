window.onload = tableAPIs(2014, "spain");
window.onload = tableAPIs(2021, "england");

function getlogo(link) {
	var img = link;
	console.log(link);
	var modal = document.getElementById("myModal");
	var modalImg = document.getElementById("modalTeamImage");

	modal.style.display = "block";
	modalImg.src = img;

	modal.onclick = function () {
		modal.style.display = "none";
	};
}

function insertTable(table, cls, myTable) {
	var img = table.team.crestUrl;
	myTable += `<tr>`;
	myTable += `<td ${cls}> ${table.position} </td>`;
	myTable += `<td ${cls}> <a id="logoimg" href="javascript:;" onclick="getlogo('${img}')"> ${table.team.name} <img src="${img}" class="team-logo"></a> </td>`;
	myTable += `<td ${cls}> ${table.playedGames} </td>`;
	myTable += `<td ${cls}> ${table.won} </td>`;
	myTable += `<td ${cls}> ${table.draw} </td>`;
	myTable += `<td ${cls}> ${table.lost} </td>`;
	myTable += `<td ${cls}> ${38 - table.playedGames} </td>`;
	myTable += `<td ${cls}> ${table.goalsFor} </td>`;
	myTable += `<td ${cls}> ${table.goalsAgainst} </td>`;
	myTable += `<td ${cls}> ${table.goalDifference} </td>`;
	myTable += `<td ${cls}> ${table.points} </td>`;
	myTable += `<tr>`;
	return myTable;
}

function tableAPIs(code, country) {
	let primaryApi = `https://api.football-data.org/v2/competitions/${code}/standings`;

	fetch(primaryApi, {
		method: "GET",
		headers: {
			"X-Auth-Token": "d38ac557ec364cf79e21a985e5d1cf8c",
		},
	})
		.then((resp) => {
			return resp.json();
		})
		.then(function (data) {
			let firstyear = data.season.startDate.substring(0, 4);
			let secondyear = parseInt(firstyear) + 1;
			let season = firstyear + "-" + secondyear.toString();

			let output = "";
			output += `<p>Season ${season}, Started on ${data.season.startDate}, 
                                ending on ${data.season.endDate}</p>`;

			document.getElementById(`title-${country}`).innerHTML = output;

			let myTable = "";
			myTable = `<table class="table table-striped table-sm" " style="margin-top:30px;">
                            <thead class="thead-dark ">
                            <tr>
                            <th scope="col ">#</th>
                            <th scope="col ">Team</th>
                            <th scope="col ">Played</th><th scope="col ">Win</th>
                            <th scope="col ">Draw</th>
                            <th scope="col ">Loss</th>
                            <th scope="col ">Remaining</th>
                            <th scope="col ">Goals F</th>
                            <th scope="col ">Goals A</th>
                            <th scope="col ">Goals Diff</th>
                            <th scope="col ">Points</th>
                            </tr></thead><tbody>`;

			for (let i = 0; i < data.standings[0].table.length; i++) {
				if (i < 4) {
					myTable = insertTable(
						data.standings[0].table[i],
						'class="green"',
						myTable
					);
				} else if (i >= data.standings[0].table.length - 4) {
					myTable = insertTable(
						data.standings[0].table[i],
						'class="red"',
						myTable
					);
				} else {
					myTable = insertTable(data.standings[0].table[i], "", myTable);
				}
			}

			myTable += "</tr></tbody></table>";

			document.getElementById(`${country}-division`).innerHTML = myTable;
		})
		.catch(function (error) {
			console.log(error);
		});
}

function ScoreAPIs(code, country) {
	const url = `https://api.football-data.org/v2/competitions/${code}/scorers`;
	fetch(url, {
		method: "GET",
		headers: {
			"X-Auth-Token": "d38ac557ec364cf79e21a985e5d1cf8c",
		},
	})
		.then((resp) => {
			return resp.json();
		})
		.then(function (data) {
			let firstyear = data.season.startDate.substring(0, 4);
			let secondyear = parseInt(firstyear) + 1;
			let season = firstyear + "-" + secondyear.toString();

			let output = "";
			output += `<p>Season ${season}, Started on ${data.season.startDate}, 
                                ending on ${data.season.endDate}</p>`;

			document.getElementById(`title-${country}`).innerHTML = output;

			let scoreTable = "";
			scoreTable = `<table class="table table-striped table-sm" " style="margin-top:30px;">
                            <thead class="thead-dark ">
                            <tr>
                            <th scope="col ">#</th>
                            <th scope="col ">Name</th>
                            <th scope="col ">Team</th>
                            <th scope="col ">Nationality</th>
                            <th scope="col ">Position</th>
                            <th scope="col ">Goals</th>
                            </tr></thead><tbody>`;
			let rowNumber = 1;
			for (let i = 0; i < data.scorers.length; i++) {
				scoreTable += `<tr class="player-row">`;
				scoreTable += `<td > ${rowNumber} </td>`;
				scoreTable += `<td class="player-name"> ${data.scorers[i].player.name} </td>`;
				scoreTable += `<td > ${data.scorers[i].team.name} </td>`;
				scoreTable += `<td > ${data.scorers[i].player.nationality} </td>`;
				scoreTable += `<td > ${data.scorers[i].player.position} </td>`;
				scoreTable += `<td  class="goal-numbers"> ${data.scorers[i].numberOfGoals} <img src="./Images/Football.png" class="football-image" </td>`;
				scoreTable += `<tr>`;
				rowNumber++;
			}

			scoreTable += "</tr></tbody></table>";

			document.getElementById(`${country}-division`).innerHTML = scoreTable;
		})
		.catch(function (error) {
			console.log(error);
		});
}
