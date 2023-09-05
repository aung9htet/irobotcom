# irobotcom

Communication between javascript and python for use in controlling ROS from google colab.

## Requirements

Pre-requisites:
* Ubuntu 20.04
* Webots R2023b
* Node v18.7.1

Use the following commands to install the modules that may be required for webots server
```
sudo apt-get install python3-pip python-is-python3
pip install pynvml requests psutil tornado distro
```

Clone the materials from github using the following command in any directory of your choice:
```
git clone https://github.com/aung9htet/irobotcom.git
```

Run the server by following these steps:
* Enter int ```~/irobotcom/home_page``` from terminal
* Run ```npx http-server -S```
* Open a new tab and enter into```~/irobotcom/webots-servers```
* Run ```./server.sh start```
* You can start playing around in the following colab after this: ```https://colab.research.google.com/drive/1HOmT66Sy0ZcDtlbnE2HQjyaS0RPDbGCt#scrollTo=T6aLZ83Yt9le```

At the end do not forget to kill the servers:
* For npx server, you can use ```Ctrl + C``` in the tab
* For the webots-servers, you can use ```./server.sh stop```