/*
 * Description:   A simple controller for the self-regulation tutorial robot
 */

#include <webots/accelerometer.h>
#include <webots/distance_sensor.h>
#include <webots/keyboard.h>
#include <webots/led.h>
#include <webots/motor.h>
#include <webots/plugins/robot_window/default.h>
#include <webots/robot.h>
#include <webots/touch_sensor.h>
#include <webots/gps.h>


#include <math.h>
#include <stdio.h>
#include <time.h>
#include <stdlib.h>

#define TIME_STEP 10
static WbDeviceTag left_motor;
static WbDeviceTag right_motor;



static void init_devices() {
  left_motor = wb_robot_get_device("left wheel motor");
  right_motor = wb_robot_get_device("right wheel motor");
  wb_motor_set_position(left_motor, INFINITY);
  wb_motor_set_position(right_motor, INFINITY);
  wb_motor_set_velocity(left_motor, 0.0);
  wb_motor_set_velocity(right_motor, 0.0);
}



int main(int argc, char **argv) {
  wb_robot_init();
  init_devices();
  // wb_keyboard_enable(TIME_STEP);
 
  const char *message;
  while (wb_robot_step(TIME_STEP) != -1) {
    
    while ((message = wb_robot_wwi_receive_text())) {
      int val = message[6] - '0';
      
      
      wb_motor_set_velocity(left_motor, val);
      wb_motor_set_velocity(right_motor, val);
    }
    double rtime = wb_robot_get_time();

    char s[200];
    sprintf(s, "data,%f", rtime);    
    wb_robot_wwi_send_text(s);
    
    // wb_motor_set_velocity(motor_left, left_speed);
    // wb_motor_set_velocity(motor_right, right_speed);
  }

  wb_robot_cleanup();
  return 0;
}
