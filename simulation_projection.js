class Braintenberg_Movement {
    constructor(canvas, img) {
        this.canvas = document.getElementById(canvas);
        this.ctx = this.canvas.getContext("2d");
        this.img = document.getElementById(img);
        this.middle_x= this.canvas.width/2 - 12;
        this.middle_y = this.canvas.height/2 - 8;
        this.x = 0;
        this.y = 0;
        this.theta = 0;
        this.angular_velocity = 0;
        this.speed = 0;
        this.movement_rate = 0;
        this.radius = 5;
        this.circle_render = 10; // how round it should be (higher is better)
        this.canvas.style = "background-color: #90EE90;";
        this.circle_positions = [[30, 30], [-30,30]];
        this.food_status = false; // check if food is there or not
        this.redraw_image();
    }

    get_data(){
        var msg = "data," + this.x.toString() + "," + this.y.toString() + "," + this.theta.toString() + "," + this.food_status.toString();
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
        //this.draw_light_intensity();
        this.circle_positions.forEach(position => this.drawCircle(position));
        this.ctx.drawImage(this.img, this.middle_x + this.x, this.middle_y + this.y, 24, 12);
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
        if ((((this.x + x_change) >= this.canvas.width - 25) || ((this.x + x_change) <= 0)) || (((this.y + y_change) >= this.canvas.height - 10) || ((this.y + y_change) <= 0))){
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
}

// initialise object
const braitenberg_agent = new Braintenberg_Movement("simulation_environment", "MiRo");
setInterval(function () {
    braitenberg_agent.move_image();
    braitenberg_agent.check_food();
    var msg = braitenberg_agent.get_data();
    console.log(msg);
    window.parent.postMessage(msg);
}, 1000);

window.addEventListener("message", (event) => {
    const command = event.data.split(",")[0];
    const args = parseFloat(event.data.split(",")[1]);
    console.log(event.data);
    if (command == "turn_speed") {
        braitenberg_agent.set_turn_speed(args);
    }
    else if (command == "speed") {
        braitenberg_agent.set_speed(args);
    }
    else if (command == "control_time") {
        braitenberg_agent.movement_rate = args;
    }
});