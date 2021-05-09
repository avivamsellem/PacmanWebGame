//initial forms - attach validate.js to forms

var chosen_key_up = "ArrowUp";
var chosen_key_down = "ArrowDown";
var chosen_key_right = "ArrowRight";
var chosen_key_left = "ArrowLeft";
var chosen_key_code_up = 38;
var chosen_key_code_down = 40;
var chosen_key_code_left = 37;
var chosen_key_code_right = 39;
var chosen_food_amount = 70;
var chosen_food_5_color;
var chosen_food_15_color;
var chosen_food_25_color;
var chosen_game_duration = 100;
var chosen_ghosts_amount = 3;

$(document).ready(function () {
	localStorage.setItem('p', 'p');

	//LOGIN
	$("#form_login_id").validate({
		rules: {
			login_username_name: {
				required: true,
			},
			login_password_name: {
				required: true,
				validateUser: true
			}
		},
		messages: {
			login_username_name: {
				required: "Please enter username."
			},
			login_password_name: {
				required: "Please enter an password",
				validateUser: "Username or password is not valid."
			}
		},
		submitHandler: function () {

			login();

			//reset form details
			let form = $("#form_login_id");
			form[0].reset();
		},
	});

	//REGISTER
	$("#form_registration_id").validate({
		rules: {
			registration_username_name: {
				required: true,
				validateUsername: true
			},
			registration_password_name: {
				required: true,
				strongPassword: true
			},
			registration_name_name: {
				required: true,
				lettersonly: true
			},
			registration_email_name: {
				required: true,
				email: true
			},
			registration_birth_day_name: {
				required: true
			}
		},
		messages: {
			registration_username_name: {
				required: "Please enter valid username address.",
				validateUsername: "Username already taken."
			},
			registration_password_name: {
				required: "Please enter an password",
				strongPassword: "password MUST contain at least one character and one number."
			},
			registration_name_name: {
				required: "Please enter a name.",
				lettersonly: "Full name can be only letters."
			},
			registration_email_name: {
				required: "Please enter an email address.",
				email: "Please enter a valid email."
			},
			registration_birth_day_name: {
				required: "Please enter a birth day."
			}
		},
		submitHandler: function () {

			register();

			//reset form details
			let form = $("#form_registration_id");
			form[0].reset();
		},
	});

	//CONFIGURATION
	$("#form_configuration_id").validate({
		rules: {
			configuration_set_down_name: {
				notEqualTo: '#configuration_set_up_id'
			},
			configuration_set_left_name: {
				notEqualTo: '#configuration_set_up_id',
				notEqualTo: '#configuration_set_down_id'
			},
			configuration_set_right_name: {
				notEqualTo: '#configuration_set_up_id',
				notEqualTo: '#configuration_set_down_id',
				notEqualTo: '#configuration_set_left_id'
			},
			configuration_set_duration_name: {
				greaterOrEqual: 60
			}
		},
		messages: {
			configuration_set_up_name: {
				notEqualTo: "This key already taken by another action."
			},
			configuration_set_down_name: {
				notEqualTo: "This key already taken by another action."
			},
			configuration_set_left_name: {
				notEqualTo: "This key already taken by another action."
			},
			configuration_set_right_name: {
				notEqualTo: "This key already taken by another action."
			},
			configuration_set_duration_name: {
				greaterOrEqual: "Minimum game duration is 60 second."
			}
		},
		submitHandler: function () {

			menu("game");
			Start();

			//reset form details
			// let form = $("#form_configuration_id");
			// form[0].reset();
		}
	});
});

$(function() {

	//Registration

	//Password must contain at least 6 digit and contain one number and one char.
	$.validator.addMethod('strongPassword', function (value, element) {
		return this.optional(element) ||
			value.length >= 6 &&
			/\d/.test(value) &&
			/[a-z]/i.test(value);
	});


	//check if username already exists
	$.validator.addMethod('validateUsername', function (value, element) {
		return !isUserExists(value);
	});

	//Login

	//check if password match user
	$.validator.addMethod('validateUser', function (password, element) {

		let user_input_username = document.getElementById("login_username_id").value;

		let localstorage_password = localStorage.getItem(user_input_username);

		if(localstorage_password === null) {
			return false;
		}
		else if(localstorage_password === password) {
			return true;
		}

		return false;
	});

	//Configuration

	//check if password match user
	$.validator.addMethod('greaterOrEqual', function (value, element, param) {
		return value >= param;
	});

	$.validator.addMethod("notEqualTo", function(value, element, param) {
		return value != $(param).val();
	});
});

const isUserExists = (users, key) => {

	let result = localStorage.getItem(key);

	if(result == null) {
		return false;
	}
	else {
		return true;
	}
	// LocalStorage.getItem(key);
};

// MENU
function menu(nav) {
    hide();
    $('#' + nav).show();
};

function hide() {
	$('#welcome').hide();
	$('#register').hide();
	$('#login').hide();
	$('#game').hide();
	$('#configuration').hide();
	$('#about').hide();

	resetGame();
};

const register = () => {

	//get elements
	let username = document.getElementById("registration_username_id").value;
	let password = document.getElementById("registration_password_id").value;

	//insert to storage
	localStorage.setItem(username, password);

	//go to login page
	menu('login')
};

function login() {

	game_username = document.getElementById("login_username_id").value;
	//go to configuration page
	menu('configuration')
};

function configurationUpdate(data)
{
	//set pacman controls:
	let chosen_key;
	let chosen_key_code;
	$(document).keydown(function(event){
			chosen_key_code = event.keyCode;
			if (data === "up")
			{
				chosen_key_up = checkChosenKey(chosen_key_code);
				chosen_key_code_up = chosen_key_code;
				document.getElementById("configuration_set_up_id").value = chosen_key_up;

			}
			else if (data === "down")
			{
				chosen_key_down = checkChosenKey(chosen_key_code);
				chosen_key_code_down = chosen_key_code;
				document.getElementById("configuration_set_down_id").value = chosen_key_down;
			}
			else if (data === "left")
			{
				chosen_key_left = checkChosenKey(chosen_key_code);
				chosen_key_code_left = chosen_key_code;
				document.getElementById("configuration_set_left_id").value = chosen_key_left;
			}
			else if (data === "right")
			{
				chosen_key_right = checkChosenKey(chosen_key_code);
				chosen_key_code_right = chosen_key_code;
				document.getElementById("configuration_set_right_id").value = chosen_key_right;
			}
			$(document).unbind();
		}
	);
}

function update_color(food_value)
{
	if(food_value === "5")
	{
		chosen_food_5_color = document.getElementById('configuration_set_five_color_id').value;
	}
	else if(food_value === "15")
	{
		chosen_food_15_color = document.getElementById('configuration_set_fifteen_color_id').value;
	}
	else if(food_value === "25")
	{
		chosen_food_25_color = document.getElementById('configuration_set_twenty_five_color_id').value;
	}
}

function checkChosenKey(key_code)
{
	if(key_code == 38)
	{
		return "ArrowUp";
	}
	else if(key_code == 40)
	{
		return "ArrowDown";
	}
	else if(key_code == 39)
	{
		return "ArrowRight";
	}
	else if(key_code == 37)
	{
		return "ArrowLeft";
	}
	else {
		return String.fromCharCode(event.keyCode);
	}
}

function updateFoodValue(val) {
	document.getElementById('chosen_food_amount').value = val;
	chosen_food_amount = document.getElementById('chosen_food_amount').value;
}

function randomConfigurations()
{
	//set pacman controls keys to thr arrows keys:
	document.getElementById('configuration_set_up_id').value = "ArrowUp";
	document.getElementById('configuration_set_down_id').value = "ArrowDown";
	document.getElementById('configuration_set_left_id').value = "ArrowLeft";
	document.getElementById('configuration_set_right_id').value = "ArrowRight";

	chosen_key_up = "ArrowUp";
	chosen_key_down = "ArrowDown";
	chosen_key_left = "ArrowLeft";
	chosen_key_right = "ArrowRight";

	//random food amount
	chosen_food_amount = Math.floor(Math.random() * (41) + 50);;
	document.getElementById('food_number_id').value = chosen_food_amount;
	document.getElementById('chosen_food_amount').value = chosen_food_amount;

	//random food color
	document.getElementById('configuration_set_five_color_id').value = getRandomColor();
	chosen_food_5_color = document.getElementById('configuration_set_five_color_id').value;
	document.getElementById('configuration_set_fifteen_color_id').value = getRandomColor();
	chosen_food_15_color = document.getElementById('configuration_set_fifteen_color_id').value = getRandomColor();
	document.getElementById('configuration_set_twenty_five_color_id').value = getRandomColor();
	chosen_food_25_color = document.getElementById('configuration_set_twenty_five_color_id').value = getRandomColor();

	//random Game Duration
	document.getElementById('configuration_set_duration_id').value = Math.floor(Math.random() * (61) + 60);
	chosen_game_duration = document.getElementById('configuration_set_duration_id').value = Math.floor(Math.random() * (61) + 60);

	//random amount of monsters
	chosen_ghosts_amount = Math.floor(Math.random() * (4) + 1);
	document.getElementById('configuration_set_ghost_number_id').value = chosen_ghosts_amount + "_ghosts";

}

function getRandomColor() {

	let code_chars = new Array();
	let generated_color_code = "#";
	let index = 10;
	for(let i = 0; i < 10; i++)
	{
		code_chars[i] = "" + i;
	}
	for(let i = 65; i < 71; i++)
	{
		code_chars[index] = "" + String.fromCharCode(i);
		index++;
	}

	for(let i = 0; i < 6; i++)
	{
		let random_index = Math.floor(Math.random() * 16);
		generated_color_code += code_chars[random_index];
	}

	return generated_color_code;
}



// ------------------------------------------------------------ GAME ------------------------------------------------------------

//Canvas
var context = canvas.getContext("2d");
var game_username;
var height;
var width;
var cell_size_height;
var cell_size_width;

//Pacman position
var pacman;

//Board information
var board;
var board_size = 20;
var ghost_board;

//score
var score = 0;
var destination;

//time variables
var start_time;
var time_elapsed = 0;
var pacman_interval;
var ghosts_interval;
var special_food_interval;
var special_heart_interval;
var special_hourglass_interval;

//walls
var walls_amount;

//food
var food_amount;
var diamond;

//Ghosts
var ghosts;
var ghosts_amount;
var stepMatrix;

//special
var heart;
var hourglass;
var time_taken_by_pacman = 0;
var hearts_lives;

//Enums
const cellType = {
	Empty: '0',
	Food_5: '1',
	Food_15: '2',
	Food_25: '3',
	Food_50: '4',
	Heart: '5',
	HourGlass: '6',
	Wall: '7',
	Ghost_1: '8',
	Ghost_2: '9',
	Ghost_3: '10',
	Ghost_4: '11',
	Pacman: '11',
	Heart: '12'
};
const keyType = {
	Up: '0',
	Down: '1',
	Left: '2',
	Right: '3'
};

var resource = "./resource/";
var images = resource + "images/";


// $(document).ready(function() {
// 	context
// 	// Start();
// });

var arrow_keys_handler = function(e) {
	switch(e.keyCode){
		case 37: case 39: case 38:  case 40: // Arrow keys
		case 32: e.preventDefault(); break; // Space
		default: break; // do not block other keys
	}
};
window.addEventListener("keydown", arrow_keys_handler, false);


function Start() {


	initialGameValues();

	InitialStepMatrix();

	InitialBoards();

	InitialBricks();

	InitialGhosts();

	InitialFood();

	InitialPacman();

	InitialSpecial();

	startMainMusic();

	keysDown = {};

	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);

	//start interval
	pacman_interval = setInterval(UpdatePacmanPosition, 100);
	ghosts_interval = setInterval(UpdateGhostsPosition, 350);
	special_food_interval = setInterval(SetSpecialFood, 100);
	special_heart_interval = setInterval(UpdateSpecialHeart, 10000);
	special_hourglass_interval = setInterval(UpdateHourGlass, 5000);
}

function initialGameValues() {

	start_time = new Date();
	ghosts_amount = parseInt(document.getElementById('configuration_set_ghost_number_id').value.substring(0,1));
	food_amount = chosen_food_amount;

	document.getElementById("game_username").value = game_username;

	chosen_game_duration = parseInt(document.getElementById('configuration_set_duration_id').value);

	//color
	chosen_food_5_color = document.getElementById('configuration_set_five_color_id').value;
	chosen_food_15_color = document.getElementById('configuration_set_fifteen_color_id').value;
	chosen_food_25_color = document.getElementById('configuration_set_twenty_five_color_id').value;
	hearts_lives = document.getElementById("hearts_lives");

	destination = 0;

	show_chosen_configurations();
}

function InitialStepMatrix() {

	stepMatrix = [
		[-1, 1, 0, 0], //row
		[0, 0, -1, 1] //col
	]

}

function InitialBoards() {

	height = canvas.height;
	width = canvas.width;

	cell_size_height = (height / board_size);
	cell_size_width = (width / board_size);

	board = new Array();
	ghost_board = new Array();

	//initial 2-dim array
	for (let i = 0; i < board_size; i++) {
		board[i] = new Array();
		ghost_board[i] = new Array();
	}

	//initial all cells to default
	for (let i = 0; i <  board_size; i++) {
		for (let j = 0; j < board_size; j++) {
			board[i][j] = cellType.Empty;
			ghost_board[i][j] = cellType.Empty;
		}
	}
}

function InitialBricks() {

	//drawing frame
	walls_amount = 0;

	for(let a = 0; a < board_size; a++) {
		for(let b = 0; b < board_size; b++) {
			if(a == 0 || a == board_size - 1
			|| b == 0 || b == board_size - 1) {
				board[a][b] = cellType.Wall;
				walls_amount++;
			}
		}	
	}

	//draw second quarter
	board[1][6] = cellType.Wall;
	board[2][2] = cellType.Wall;
	board[2][3] = cellType.Wall;
	board[2][4] = cellType.Wall;
	board[2][6] = cellType.Wall;
	board[2][8] = cellType.Wall;
	board[3][2] = cellType.Wall;
	board[3][6] = cellType.Wall;
	board[3][8] = cellType.Wall;
	board[4][2] = cellType.Wall;
	board[4][4] = cellType.Wall;
	board[4][6] = cellType.Wall;
	board[4][8] = cellType.Wall;
	board[4][9] = cellType.Wall;
	board[5][4] = cellType.Wall;
	board[6][2] = cellType.Wall;
	board[6][3] = cellType.Wall;
	board[6][4] = cellType.Wall;
	board[6][5] = cellType.Wall;
	board[6][7] = cellType.Wall;
	board[6][8] = cellType.Wall;
	board[6][9] = cellType.Wall;
	board[7][5] = cellType.Wall;
	board[8][1] = cellType.Wall;
	board[8][2] = cellType.Wall;
	// board[8][3] = cellType.Wall;
	// board[8][4] = cellType.Wall;
	// board[8][5] = cellType.Wall;
	board[8][7] = cellType.Wall;
	board[8][8] = cellType.Wall;
	// board[9][7] = cellType.Wall;
	board[9][5] = cellType.Wall;

	walls_amount = walls_amount + 28;

	/*third quarter*/
	for(let i = 10; i < board_size; i++)
	{
		for(let j = 0; j < 10; j++)
		{
			board[i][j] = board[board_size - i - 1][j];
			walls_amount++;
		}
	}

	//draw first and fourth quarter
	for(let i = 0; i < board_size; i++)
	{
		for(let j = 10; j < board_size; j++)
		{
			board[i][j] = board[i][board_size - j - 1];
			walls_amount++;
		}
	}
}

function InitialGhosts() {

	ghosts = new Array(ghosts_amount);

	for(let i = 0; i < ghosts_amount; i++) {

		ghosts[i] = new Object();

		if (i == 0) {

			ghosts[i].ghost_number = cellType.Ghost_1;
			ghosts[i].ghost_color = "blue";

			ghosts[i].image_right = new Image(cell_size_width, cell_size_height);
			ghosts[i].image_right.src = images + "ghost-blue-right.png";

			ghosts[i].image_left = new Image(cell_size_width, cell_size_height);
			ghosts[i].image_left.src = images + "ghost-blue-left.png";

			ghosts[i].row = 1;
			ghosts[i].col = 1;

			ghosts[i].previos_step = RandomStep(i);

			ghost_board[1][1] = cellType.Ghost_1;

		}
		else if (i == 1) {

			ghosts[i].ghost_number = cellType.Ghost_2;
			ghosts[i].ghost_color = "red";

			ghosts[i].image_right = new Image(cell_size_width, cell_size_height);
			ghosts[i].image_right.src = images + "ghost-red-right.png";

			ghosts[i].image_left = new Image(cell_size_width, cell_size_height);
			ghosts[i].image_left.src = images + "ghost-red-left.png";

			ghosts[i].row = 1;
			ghosts[i].col = board_size - 2;

			ghosts[i].previos_step = RandomStep(i);

			ghost_board[1][board_size - 2] = cellType.Ghost_2;

		}
		else if (i == 2) {

			ghosts[i].ghost_number = cellType.Ghost_3;
			ghosts[i].ghost_color = "green";

			ghosts[i].image_right = new Image(cell_size_width, cell_size_height);
			ghosts[i].image_right.src = images + "ghost-green-right.png";

			ghosts[i].image_left = new Image(cell_size_width, cell_size_height);
			ghosts[i].image_left.src = images + "ghost-green-left.png";

			ghosts[i].row = board_size - 2;
			ghosts[i].col = 1;
			ghosts[i].previos_step = RandomStep(i);

			ghost_board[board_size - 2][1] = cellType.Ghost_3;
		}
		else if (i == 3) {

			ghosts[i].ghost_number = cellType.Ghost_4;
			ghosts[i].ghost_color = "yellow";

			ghosts[i].image_right = new Image(cell_size_width, cell_size_height);
			ghosts[i].image_right.src = images + "ghost-yellow-right.png";

			ghosts[i].image_left = new Image(cell_size_width, cell_size_height);
			ghosts[i].image_left.src = images + "ghost-yellow-left.png";

			ghosts[i].row = board_size - 2;
			ghosts[i].col = board_size - 2;
			ghosts[i].previos_step = RandomStep(i);

			ghost_board[board_size - 2][board_size - 2] = cellType.Ghost_4;
		}

		ghosts[i].draw = ghosts[i].image_left; //set default position to each ghost.
	}
}

function RandomStep(i) {

	let random;

	while(true) {

		random = Math.random()

		if (random < 0.25 && board[ghosts[i].row + 1][ghosts[i].col] != cellType.Wall) {
			return keyType.Down;

		} else if (random >= 0.25 && random < 0.5 && board[ghosts[i].row - 1][ghosts[i].col] != cellType.Wall) {
			return keyType.Up;

		} else if (random >= 0.5 && random < 0.75 && board[ghosts[i].row][ghosts[i].col + 1] != cellType.Wall) {
			return keyType.Right;

		} else if (random >= 0.75 && board[ghosts[i].row][ghosts[i].col - 1] != cellType.Wall) {
			return keyType.Left;

		}
	}
}

function InitialFood() {

	let free_places_amount = ( (board_size - 2) * (board_size - 2) ) - 48 * 4;
	let random;

	//initial amount for each food type
	let food_5 = Math.floor(0.6 * food_amount);
	let food_15 = Math.floor(0.3 * food_amount);
	let food_25 = Math.floor(0.1 * food_amount);

	//sum of all foods
	let food_remain = food_5 + food_15 + food_25;

	while(food_remain > 0)
	{
		for(let i = 1; i < board_size - 1; i++)
		{
			for(let j = 1; j < board_size - 1; j++)
			{
				if(food_remain > 0 && board[i][j] == cellType.Empty)
				{
					random = Math.random();

					if(random < ( food_amount / ((board_size - 2) * (board_size - 2) - free_places_amount)))
					{
						random = Math.random();

						if(random < 0.6 && food_5 > 0) {
							board[i][j] = cellType.Food_5;
							food_5--;
						}
						else if(random >= 0.6 && random < 0.9 && food_15 > 0) {
							board[i][j] = cellType.Food_15;
							food_15--;
						}
						else if(food_25 > 0) {
							board[i][j] = cellType.Food_25;
							food_25--;
						}
					}

					food_remain = food_5 + food_15 + food_25;
				}
			}
		}
	}

	InitialSpecialFood();
}

function InitialPacman() {

	pacman = new Object();

	pacman.lives = 3;

	pacman.image_left = new Image(cell_size_width, cell_size_height);
	pacman.image_left.src = images + "pacman-left.png";

	pacman.image_right = new Image(cell_size_width, cell_size_height);
	pacman.image_right.src = images + "pacman-right.png";

	pacman.image_up = new Image(cell_size_width, cell_size_height);
	pacman.image_up.src = images + "pacman-up.png";

	pacman.image_down = new Image(cell_size_width, cell_size_height);
	pacman.image_down.src = images + "pacman-down.png";

	hearts_lives.src = images + "" + pacman.lives +"-hearts.png";

	pacman.draw = pacman.image_left;

	placePacman();
}

function placePacman() {

	let position = findRandomEmptyCellforPacman();

	pacman.row = position.row;
	pacman.col = position.col;

	board[pacman.row][pacman.col] = cellType.Pacman;
}

function InitialSpecialFood() {

	diamond = new Object();

	diamond.appear = true;
	diamond.previos_step = keyType.Left;

	diamond.image = new Image(cell_size_width, cell_size_height);
	diamond.image.src = images + "diamond.png";

	//choose random step
	random = Object.keys(keyType).length * Math.random();
	diamond.previous_step = Math.floor(random);

	diamond.previous_cell = cellType.Empty;

	//initial position
	if(ghosts_amount == 4) {
		let position = findRandomEmptyCell();
		diamond.row = position.row;
		diamond.col = position.col;
	}
	else
	{
		diamond.row = board_size - 2;
		diamond.col = board_size - 2;
	}
	board[diamond.row][diamond.col] = cellType.Food_50;
}

function InitialSpecial() {

	//heart
	heart = new Object();
	heart.times = 2;
	heart.image = new Image(cell_size_width, cell_size_height);
	heart.image.src = images + "heart.png";
	heart.special_heart_appear = false;

	SetSpecialHeart();

	//hourglass
	hourglass = new Object();
	hourglass.time = new Date();
	hourglass.image = new Image(cell_size_width, cell_size_height);
	hourglass.image.src = images + "hourglass.png";
	hourglass.special_hourglass_appear = false;

	SetSpecialHourglass();
}

function startMainMusic() {
	document.getElementById("main_sound").play();
	document.getElementById("main_sound").volume = 0.1;
}

function stopMainMusic()
{
	document.getElementById("main_sound").pause();
	document.getElementById("main_sound").currentTime = 0;
}

function SetSpecialHeart() {

	let position = findRandomEmptyCell();

	if (heart.special_heart_appear) {
		board[heart.row][heart.col] = cellType.Empty;
	}

	heart.row = position.row;
	heart.col = position.col;

	board[heart.row][heart.col] = cellType.Heart;
}

function SetSpecialHourglass() {

	let position = findRandomEmptyCell();

	if(hourglass.special_hourglass_appear) {
		board[hourglass.row][hourglass.col] = cellType.Empty;
	}

	hourglass.row = position.row;
	hourglass.col = position.col;

	board[hourglass.row][hourglass.col] = cellType.HourGlass;
}

function SetSpecialFood() {
	if(diamond.appear) {

		random = Object.keys(keyType).length * Math.random();

		if (random < 0.9 && board[diamond.row + stepMatrix[0][diamond.previos_step]][diamond.col + stepMatrix[1][diamond.previos_step]] != cellType.Wall) {
			updateDiamond(diamond.previos_step);

		} else {
			let diamond_moved = 5;

			while (diamond_moved > 0) {

				random = Object.keys(keyType).length * Math.random();
				let move = Math.floor(random);

				if (board[diamond.row + stepMatrix[0][move]][diamond.col + stepMatrix[1][move]] != cellType.Wall) {
					updateDiamond(move);

					break;
				}

				diamond_moved--;
			}
		}

		// diamond.row = position.row;
		// diamond.col = position.col;

		board[diamond.row][diamond.col] = cellType.Food_50;
	}
}

function updateDiamond(move) {

	board[diamond.row][diamond.col] = diamond.previous_cell;

	diamond.row += stepMatrix[0][move];
	diamond.col += stepMatrix[1][move];

	if(board[diamond.row][diamond.col] == cellType.Pacman) {
		catchSpecialFood();

		return;
	}

	diamond.previos_step = move;
	diamond.previous_cell = board[diamond.row][diamond.col];
	board[diamond.row][diamond.col] = cellType.Food_50;
}

function catchSpecialFood() {
	diamond.appear = false;
	score+= 50;
}

function UpdateLifeBar()
{
	if(pacman.lives >= 5)
	{
		hearts_lives.src = images + "5-hearts.png";
	}
	else if(pacman.lives == 4)
	{
		hearts_lives.src = images + "4-hearts.png";
	}
	else if(pacman.lives == 3)
	{
		hearts_lives.src = images + "3-hearts.png";
	}
	else if(pacman.lives == 2)
	{
		hearts_lives.src = images + "2-hearts.png";
	}
	else if(pacman.lives == 1)
	{
		hearts_lives.src = images + "1-hearts.png";
	}
	else if(pacman.lives == 0)
	{
		hearts_lives.src = images + "0-hearts.png";
	}
}

function findRandomEmptyCell() {

	let position = new Object();

	let i = Math.floor(Math.random() * (board_size - 1) + 1);
	let j = Math.floor(Math.random() * (board_size - 1) + 1);

	while (board[i][j] != cellType.Empty) {

		i = Math.floor(Math.random() * (board_size - 1) + 1);
		j = Math.floor(Math.random() * (board_size - 1) + 1);
	}

	position.row = i;
	position.col = j;

	return position;
}

function findRandomEmptyCellforPacman() {

	let position = new Object();

	let i = Math.floor(Math.random() * (board_size / 2) + 5);
	let j = Math.floor(Math.random() * (board_size / 2) + 5);

	while (board[i][j] != cellType.Empty) {

		i = Math.floor(Math.random() * (board_size / 2) + 5);
		j = Math.floor(Math.random() * (board_size / 2) + 5);
	}

	position.row = i;
	position.col = j;

	return position;
}

function GetKeyPressed() {

	if (keysDown[chosen_key_code_up]) {
		return keyType.Up;
	}
	else if (keysDown[chosen_key_code_down]) {
		return keyType.Down;
	}
	else if (keysDown[chosen_key_code_left]) {
		return keyType.Left;
	}
	else if (keysDown[chosen_key_code_right]) {
		return keyType.Right;
	}
}

function CheckIfValidGhostMove(i, step) {

	if(board[ghosts[i].row + stepMatrix[0][step]][ghosts[i].col + stepMatrix[1][step]] == cellType.Wall ||
		ghost_board[ghosts[i].row + stepMatrix[0][step]][ghosts[i].col + stepMatrix[1][step]] != cellType.Empty) {

		return false;
	}

	return true;
}

function CheckIfMinimizeRangeAndValid(i, step) {

	if(!CheckIfValidGhostMove(i, step)) {

		return false;
	}

	random = Math.random();

	if( random > 0.95) {
		return true;
	}

	let row_distance = ghosts[i].row - pacman.row;
	let col_distance = ghosts[i].col - pacman.col;

	let old_distance = Math.abs(col_distance) + Math.abs(row_distance);

	row_distance = ghosts[i].row  + stepMatrix[0][step] - pacman.row;
	col_distance = ghosts[i].col  + stepMatrix[1][step] - pacman.col;

	let new_distance = Math.abs(col_distance) + Math.abs(row_distance);

	if(old_distance > new_distance) {
		return true;
	}

	return false;
}

function CheckIfGhostCatchPacman() {

	let current_ghost_row;
	let current_ghost_col;

	for (let i = 0; i < ghosts_amount ; i++) {

		current_ghost_row = ghosts[i].row;
		current_ghost_col = ghosts[i].col;

		if(current_ghost_row == pacman.row && current_ghost_col == pacman.col) {
			return true;
		}
	}

	return false;
}

function ResetGhostsPositions()
{

	for(let current_ghost = 0; current_ghost < ghosts_amount; current_ghost++)
	{
		//remove the ghost from her current location.
		for(let i = 0 ; i < board_size; i ++)
		{
			for(let j = 0 ; j < board_size; j ++)
			{
				ghost_board[i][j] = cellType.Empty;
			}
		}
		//blue ghost
		if(current_ghost == 0)
		{
			ghosts[0].row = 1;
			ghosts[0].col = 1;
			ghost_board[1][1] = cellType.Ghost_1;
		}
		else if(current_ghost == 1) //red ghost
		{
			ghosts[1].row = 1;
			ghosts[1].col = board_size - 2;
			ghost_board[2][board_size - 2] = cellType.Ghost_2;
		}
		else if(current_ghost == 2) //green ghost
		{
			ghosts[2].row = board_size - 2;
			ghosts[2].col = 1;
			ghost_board[board_size - 2][1] = cellType.Ghost_3;
		}
		else if(current_ghost == 3) //yellow ghost
		{
			ghosts[3].row = board_size - 2;
			ghosts[3].col = board_size - 2;
			ghost_board[board_size - 2][board_size - 2] = cellType.Ghost_4;
		}
	}

}

function checkDisqualify() {

	if(CheckIfGhostCatchPacman()) {

		score-=10;

		if (pacman.lives == 0) {


			window.clearInterval(pacman_interval);
			window.clearInterval(ghosts_interval);

			window.alert("Loser!");
		}
		else {
			pacman.lives--;
			UpdateLifeBar();
			ResetGhostsPositions();
			window.alert("Ghosts catch pacman. only " + pacman.lives + " live remain");
			board[pacman.row][pacman.col] = cellType.Empty;

			placePacman();
		}
	}
	else {
		Draw();
	}
}

function UpdateGhostsPosition() {

	let random;

	let ghost_moved;

	for(let i = 0; i < ghosts_amount; i++) {

		ghost_moved = 10;

		random = Math.random();

		if (random < 0.3 && CheckIfValidGhostMove(i, ghosts[i].previos_step)) {
			UpdateGhostStep(i, ghosts[i].previos_step);

		} else {
			while (ghost_moved > 0) {

				random = Object.keys(keyType).length * Math.random();
				let move = Math.floor(random);

				if (CheckIfMinimizeRangeAndValid(i, move)) {

					UpdateGhostStep(i, move);

					break;
				}

				ghost_moved--;
			}
		}
	}

	checkDisqualify();
}

function UpdatePacmanPosition() {

	board[pacman.row][pacman.col] = cellType.Empty;

	let move = GetKeyPressed();

	if (move == keyType.Up && pacman.row > 0 && board[pacman.row - 1][pacman.col] != cellType.Wall) {

		pacman.row--;
		pacman.draw = pacman.image_up;
	}
	else if (move == keyType.Down && pacman.row < board_size && board[pacman.row + 1][pacman.col] != cellType.Wall) {

		pacman.row++;
		pacman.draw = pacman.image_down;
	}
	else if (move == keyType.Left && pacman.col > 0 && board[pacman.row][pacman.col - 1] != cellType.Wall) {

		pacman.col--;
		pacman.draw = pacman.image_left;
	}
	else if (move == keyType.Right && pacman.col < board_size && board[pacman.row][pacman.col + 1] != cellType.Wall) {

		pacman.col++;
		pacman.draw = pacman.image_right;
	}

	//update score
	if (board[pacman.row][pacman.col] == cellType.Food_5) {
		score+= 5;
		destination++;
	}
	else if (board[pacman.row][pacman.col] == cellType.Food_15) {
		score+= 15;
		destination++;
	}
	else if (board[pacman.row][pacman.col] == cellType.Food_25) {
		score+= 25;
		destination++;
	}
	else if (board[pacman.row][pacman.col] == cellType.Food_50 && diamond.appear) {
		catchSpecialFood();
	}
	else if (board[pacman.row][pacman.col] == cellType.Heart && heart.special_heart_appear) {
		pacman.lives++;
		UpdateLifeBar();
		heart.times--;
	}
	else if(board[pacman.row][pacman.col] == cellType.HourGlass && hourglass.special_hourglass_appear) { //time
		time_taken_by_pacman = time_taken_by_pacman + 10;
		hourglass.special_hourglass_appear = false;
	}

	board[pacman.row][pacman.col] = cellType.Pacman;

	// time update
	let currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if(time_elapsed - time_taken_by_pacman < 0)
	{
		start_time = new Date();
		time_taken_by_pacman = 0;
		time_elapsed = 0;
	}
	else
	{
		time_elapsed = Math.floor(time_elapsed - time_taken_by_pacman);
	}
	lblTime.value = time_elapsed;

	//check if need to remove hourglass
	if(((currentTime - hourglass.time)/1000) > 5) {
		hourglass.special_hourglass_appear = false;
	}

	//Game time finish
	if (time_elapsed >= chosen_game_duration) {
		window.clearInterval(pacman_interval);
		window.clearInterval(ghosts_interval);

		if(score < 100)
		{
			window.alert("You are better than " + score + " points!");
		}
		else
		{
			window.alert("Winner!!!");
		}
	}

	//Game finish
	if (destination == chosen_food_amount) {
		window.clearInterval(pacman_interval);
		window.clearInterval(ghosts_interval);

		window.alert("Winner!!!\nYour Score : " + score);
	} else {
		checkDisqualify();
	}
}

function UpdateSpecialHeart() {

	if(heart.special_heart_appear || heart.times == 0) {
		heart.special_heart_appear = false;
	}
	else {
		heart.special_heart_appear = true;
		SetSpecialHeart();
	}
}

function UpdateGhostStep(i, step) {

	ghost_board[ghosts[i].row][ghosts[i].col] = cellType.Empty;

	ghosts[i].row += stepMatrix[0][step];
	ghosts[i].col += stepMatrix[1][step];

	if(step == keyType.Right) {
		ghosts[i].draw = ghosts[i].image_right;
	}
	else if(step == keyType.Left) {
		ghosts[i].draw = ghosts[i].image_left;
	}

	ghost_board[ghosts[i].row][ghosts[i].col] = ghosts[i].ghost_number;
	ghost_board[i].previos_step = step;
}

function UpdateHourGlass() {

	if(hourglass.special_hourglass_appear) {
		hourglass.special_hourglass_appear = false;
	}
	else {
		hourglass.special_hourglass_appear = true;
		hourglass.time = new Date();
		SetSpecialHourglass();
	}
}

function show_chosen_configurations() {

	document.getElementById('key_up').value = chosen_key_up;
	document.getElementById('key_down').value = chosen_key_down;
	document.getElementById('key_right').value = chosen_key_right;
	document.getElementById('key_left').value = chosen_key_left;

	document.getElementById('food_amount').value = chosen_food_amount;

	document.getElementById('5_points').value = chosen_food_5_color;
	document.getElementById('15_points').value = chosen_food_15_color;
	document.getElementById('25_points').value = chosen_food_25_color;

	document.getElementById('game_duration').value = chosen_game_duration;
	document.getElementById('ghost_number').value = ghosts_amount;
}

function Draw() {

	canvas.width = canvas.width; //clean board

	let min_radius = Math.min(cell_size_height, cell_size_width)

	lblScore.value = score;
	lblTime.value = time_elapsed;

	for (let i = 0; i < board_size; i++) {

		for (let j = 0; j < board_size; j++) {

			let center = new Object();

			center.y = (i + (1 / 2)) * cell_size_height;
			center.x = (j + (1 / 2)) * cell_size_width;

			if (board[i][j] == cellType.Pacman) {
				context.drawImage(pacman.draw, center.x - cell_size_width / 2, center.y - cell_size_height / 2, cell_size_height, cell_size_height);
			} else if (board[i][j] == cellType.Food_5) {

				context.beginPath();
				context.arc(center.x, center.y, (min_radius / 7), 0, 2 * Math.PI); // circle
				context.fillStyle = chosen_food_5_color; //color
				context.fill();

			} else if (board[i][j] == cellType.Food_15) {

				context.beginPath();
				context.arc(center.x, center.y, (min_radius / 6), 0, 2 * Math.PI); // circle
				context.fillStyle = chosen_food_15_color; //color
				context.fill();

			} else if (board[i][j] == cellType.Food_25) {

				context.beginPath();
				context.arc(center.x, center.y, (min_radius / 5), 0, 2 * Math.PI); // circle
				context.fillStyle = chosen_food_25_color; //color
				context.fill();

			}
			else if(board[i][j] == cellType.Food_50 && diamond.appear) {
				context.drawImage(diamond.image, center.x - cell_size_width / 2, center.y - cell_size_height / 2, cell_size_height, cell_size_height);
			}
			else if(board[i][j] == cellType.Heart && heart.special_heart_appear) {
				context.drawImage(heart.image, center.x - cell_size_width / 2, center.y - cell_size_height / 2, cell_size_height, cell_size_height);
			}
			else if(board[i][j] == cellType.HourGlass && hourglass.special_hourglass_appear) {
				context.drawImage(hourglass.image, center.x - cell_size_width / 2, center.y - cell_size_height / 2, cell_size_height, cell_size_height);
			}
			else if (board[i][j] == cellType.Wall) {

				let image = new Image(cell_size_width, cell_size_height);
				image.src = images + "wall_1.jpeg";
				context.drawImage(image, center.x - cell_size_width / 2, center.y - cell_size_height / 2, cell_size_height, cell_size_height);
			}
			else if(board[i][j] == cellType.Empty)
			{
				context.fillStyle = 'black';
				context.fillRect(center.x - cell_size_width / 2, center.y - cell_size_height / 2, cell_size_height, cell_size_height);
			}
		}
	}

	//draw ghosts
	for (let i = 0; i < board_size; i++) {
		for (let j = 0; j < board_size; j++) {

			let center = new Object();

			center.y = (i + (1 / 2)) * cell_size_height;
			center.x = (j + (1 / 2)) * cell_size_width;

			if (ghost_board[i][j] == cellType.Ghost_1) {
				context.drawImage(ghosts[0].draw, center.x - cell_size_width / 2, center.y - cell_size_height / 2, cell_size_height, cell_size_height);
			}
			else if (ghost_board[i][j] == cellType.Ghost_2) {
				context.drawImage(ghosts[1].draw, center.x - cell_size_width / 2, center.y - cell_size_height / 2, cell_size_height, cell_size_height);
			}
			else if (ghost_board[i][j] == cellType.Ghost_3) {
				context.drawImage(ghosts[2].draw, center.x - cell_size_width / 2, center.y - cell_size_height / 2, cell_size_height, cell_size_height);
			}
			else if (ghost_board[i][j] == cellType.Ghost_4) {
				context.drawImage(ghosts[3].draw, center.x - cell_size_width / 2, center.y - cell_size_height / 2, cell_size_height, cell_size_height);
			}
		}
	}
}

function resetGame() {

	window.clearInterval(pacman_interval);
	window.clearInterval(ghosts_interval);
	window.clearInterval(special_food_interval);
	window.clearInterval(special_heart_interval);
	window.clearInterval(special_hourglass_interval)

	canvas.width = canvas.width; //clean board

	start_time = null;
	ghosts_amount = null;
	food_amount = null;

	//color
	chosen_food_5_color = null;
	chosen_food_15_color = null;
	chosen_food_25_color = null;
	hearts_lives = null;

	destination = 0;

	//boards
	board = null;
	ghost_board = null;

	diamond = null;
	stepMatrix = null;
	heart = null;
	hearts_lives = null;
	hourglass = null;
	time_taken_by_pacman = 0;
	time_elapsed = 0;
	score = 0;

	reset_chosen_configurations();
	stopMainMusic();
	// startMainMusic();

}

function reset_chosen_configurations() {

	document.getElementById('key_up').value = null;
	document.getElementById('key_down').value = null;
	document.getElementById('key_right').value = null;
	document.getElementById('key_left').value = null;

	document.getElementById('food_amount').value = null;

	document.getElementById('5_points').value = null;
	document.getElementById('15_points').value = null;
	document.getElementById('25_points').value = null;

	document.getElementById('game_duration').value = null;
	document.getElementById('ghost_number').value = null;

	score = 0;
	lblScore.value = 0;
	lblTime.value = 0;


}

function newGame() {
	window.clearInterval(pacman_interval);
	window.clearInterval(ghosts_interval);
	window.clearInterval(special_food_interval);
	window.clearInterval(special_heart_interval);
	window.clearInterval(special_hourglass_interval);

	lblScore.value = 0;
	lblTime.value = 0;
	score = 0;
	stopMainMusic();
	Start();
}