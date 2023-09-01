from controller import Robot

robot = Robot()

while robot.step(32) != -1:

    text = robot.wwiReceiveText()
    print("Hello World!: ", text)