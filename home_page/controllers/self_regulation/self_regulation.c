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

#include <webots/supervisor.h>

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

double gradient = 50.0;
double intercept = 50.0;

double getCurrentTemperature(){
  // Limits are -1. 1
  WbNodeRef k_node = wb_supervisor_node_get_self();
  const double *position = wb_supervisor_node_get_position(k_node);
  double x = position[0]; // Only using x coordinate
  
  
  return gradient*x + intercept;
}

double extractDouble(const char *msg){
  int l = strlen(msg);
  char valc[10];

  for( int i = 6; i < l; i++ )
    valc[i - 6] = msg[i];

  valc[l - 6] = '\0';
  
  printf("valc: %s\n", valc);

  return atof(valc);
}


void coloredBalls( WbFieldRef children_field, double y ){
  for( int i = 0; i < 10; i ++ ){
    char com[50];
    char ball_name[10];
    double x = 2.0*((float) i)/10.0 - 1;
    
    sprintf( ball_name, "BALL%d", i );
    sprintf( com, "DEF BALL%d Ball { translation %.1f %.1f 0 }",i, x, y);  
    wb_supervisor_field_import_mf_node_from_string(children_field, -1, com);
    WbNodeRef ball_node = wb_supervisor_node_get_from_def(ball_name);
    WbFieldRef color_field = wb_supervisor_node_get_field(ball_node, "color");
    const double red_color[3] = {(x + 1)/2.0, 0, (x + 1)/2.0};
    wb_supervisor_field_set_sf_color(color_field, red_color);
  }
}

void paintGradient( WbFieldRef children_field  ){
  
  coloredBalls( children_field, 1.0 );
  coloredBalls( children_field, -1.0 );  
}

int main(int argc, char **argv) {
  wb_robot_init();
  init_devices();
  
  WbNodeRef root_node = wb_supervisor_node_get_root();
  WbFieldRef children_field = wb_supervisor_node_get_field(root_node, "children");
  // wb_keyboard_enable(TIME_STEP);
  wb_motor_set_velocity(left_motor, 1);
  wb_motor_set_velocity(right_motor, 1);
 
  const char *message;
  char command[6];
  
  paintGradient( children_field );
  
  while (wb_robot_step(TIME_STEP) != -1) {
    
    while ((message = wb_robot_wwi_receive_text())) {
      for( int i = 0; i < 5; i++)
        command[i] = message[i];
             
      command[5] = '\0';
      
      if( strcmp(command, "speed") == 0){    
        int val = message[6] - '0';   
        wb_motor_set_velocity(left_motor, val);
        wb_motor_set_velocity(right_motor, val);
       }else if(strcmp(command, "gradi")){
         double ngrad = extractDouble( message );  
         
         printf("Changing gradient: %f\n", ngrad);
       }
    }
    // double rtime = wb_robot_get_time();

    // Sending data to the robot window
    // printf("Temperature: %f\n", getCurrentTemperature());s
    char s[200];
    sprintf(s, "data,%f", getCurrentTemperature());    
    wb_robot_wwi_send_text(s);
    
  }

  wb_robot_cleanup();
  return 0;
}
