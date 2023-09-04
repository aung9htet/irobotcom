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

#include <math.h>
#include <stdio.h>
#include <time.h>
#include <stdlib.h>

#define TIME_STEP 10

static void init_devices() {
  printf("Initializing devices\n");
}

int main(int argc, char **argv) {
  wb_robot_init();
  init_devices();
  // wb_keyboard_enable(TIME_STEP);
  // wb_motor_set_velocity(motor_left, 0);
  // wb_motor_set_velocity(motor_right, 0);
  const char *message;

  while (wb_robot_step(TIME_STEP) != -1) {
    
    while ((message = wb_robot_wwi_receive_text())) {
      
      printf("Received message from window: %s\n", message);
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
