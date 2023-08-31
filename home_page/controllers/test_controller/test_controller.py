from controller import Robot

robot = Robot()

while robot.step(32) != -1:

    text = robot.wwiReceiveText()

    if text is not None:
        print("Hello World!: ", text)