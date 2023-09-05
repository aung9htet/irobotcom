class Braintenberg_Movement {
    constructor(canvas, img) {
        // where to draw
        this.canvas = document.getElementById(canvas);
        this.ctx = this.canvas.getContext("2d");
        this.img = document.getElementById(img);
        // get middle of canvas
        this.middle_x= this.canvas.width/2 - 12;
        this.middle_y = this.canvas.height/2 - 8;
        // initiate starting position and speed
        this.x_adjust = () => (this.middle_x + (this.x * this.canvas.width/230) - 10)       // to readjust miro in environment
        this.y_adjust = () => ((this.middle_y - (this.y * this.canvas.height/250) - 6))
        this.x = 0;
        this.y = 0;
        this.temperature_gradient = 0;
        this.temperature_intercept = 0;
        this.temperature = () => (this.temperature_gradient * this.x) + this.temperature_intercept;
        this.theta = Math.PI/2;
        this.angular_velocity = 0;
        this.speed = 0;
        // settings for the environment
        this.movement_rate = 0; // how often to run
        this.radius = 5;
        this.circle_render = 10; // how round it should be (higher is better)
        this.canvas.style = "background-image: linear-gradient(to right, blue, red);";
        this.circle_positions = [];   // position of food
        this.food_status = false; // check if food is there or not
        this.redraw_image();
    }

    get_data(){
        var msg = "data," + this.temperature();
        return msg;
    }

    drawCircle(start_pos){
        var start_x = start_pos[0] + this.middle_x + 12;
        var start_y = start_pos[1] + this.middle_y + 8;
        var x_calc = (start, end, radius, x_start) => [...Array(end - start + 1)].map((_, i) => parseFloat(x_start) + parseFloat((radius * 2 * Math.cos(2 * Math.PI/end * i)).toFixed(2)));
        var y_calc = (start, end, radius, y_start) => [...Array(end - start + 1)].map((_, i) => parseFloat(y_start) + parseFloat((radius * Math.sin(2 * Math.PI/end * i)).toFixed(2)));
	    var x_pos = x_calc(0, this.circle_render, this.radius, start_x);
        var y_pos = y_calc(0, this.circle_render, this.radius, start_y);
        for (let i = 0; i < 10; i++) {
            var x_start = x_pos[i];
            var x_end = x_pos[i + 1];
            var y_start = y_pos[i];
            var y_end = y_pos[i+ 1];
            this.ctx.beginPath(); // Start a new path
            this.ctx.moveTo(x_start, y_start); // Move the pen to (30, 50)
            this.ctx.lineTo(x_end, y_end); // Draw a line to (150, 100)
            this.ctx.stroke(); //Draw
        }
    }

    // redraw a miro to position it around
    redraw_image() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.draw_light_intensity();
        this.circle_positions.forEach(position => this.drawCircle(position));
        this.ctx.drawImage(this.img, this.x_adjust(), this.y_adjust(), 42, 24);
    }

    // draw a circle
    draw_light_intensity(){
        var x_r = 250;
        var y_r = 125;
        var blue = 0;
        var yellow = 200;
        for (let i = 0; i < 50; i++) {
            x_r -= 5;
            y_r -= 2.5;
            blue += 4;
            yellow -= 4;
            this.ctx.fillStyle = `rgb(0, ${blue}, ${yellow})`;
            this.ctx.beginPath();
            this.ctx.ellipse(this.middle_x, this.middle_y, x_r, y_r, 2 * Math.PI, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    move_image() {
        const x_change = this.speed * Math.sin(this.theta + this.angular_velocity);
        const y_change = this.speed * Math.cos(this.theta + this.angular_velocity);
        if ((((this.x + x_change) >= 100) || ((this.x + x_change) <= -100)) || (((this.y + y_change) >= 100) || ((this.y + y_change) <= -100))){
            this.theta += this.angular_velocity;
        }
        else {
            this.theta += this.angular_velocity;
            this.x += x_change;
            this.y += y_change;
        }
        this.redraw_image();
    }

    set_turn_speed(angular_velocity){
        this.angular_velocity = angular_velocity;
    }

    set_speed(speed){
        this.speed = speed;
    }

    check_food(){
        const food_check = (x, y) => Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2) - Math.pow(this.radius, 2);
        this.food_status = false;
        for (let i = 0; i < this.circle_positions.length; i++) {
            if (this.food_status == true) {
                this.food_status = true;
            }
            else if (food_check(this.circle_positions[i][0], this.circle_positions[i][1]) <= 0) {
                this.food_status = true;
            }
            else {
                this.food_status = false;
            }
        }
    }
    
    reset(){
        this.x = 0;
        this.y = 0;
        braitenberg_agent.move_image();
    }
}

// initialise object
const braitenberg_agent = new Braintenberg_Movement("simulation_environment", "MiRo");
setInterval(function () {
    braitenberg_agent.move_image();
    braitenberg_agent.check_food();
    var msg = braitenberg_agent.get_data();
    parent.postMessage(msg, "*");
}, 1000);

window.addEventListener("message", (event) => {
    console.log(event.data);
    if (event.data == "reset") {
        braitenberg_agent.reset();
    } else {
        const command = event.data.split(",")[0];
        const args = parseFloat(event.data.split(",")[1]);
        if (command == "turn_speed") {
            braitenberg_agent.set_turn_speed(args);
        }
        else if (command == "speed") {
            braitenberg_agent.set_speed(args);
        }
        else if (command == "control_time") {
            braitenberg_agent.movement_rate = args;
        }
        else if (command == "temperature_gradient") {
            braitenberg_agent.temperature_gradient = args;
        }
        else if (command == "temperature_intercept") {
            braitenberg_agent.temperature_intercept = args;
        }
    }
});