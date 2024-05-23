
# $$$$$$$\                                   $$$$$$$\             $$\     
# $$  __$$\                                  $$  __$$\            $$ |    
# $$ |  $$ | $$$$$$\  $$$$$$\  $$\  $$\  $$\ $$ |  $$ | $$$$$$\ $$$$$$\   
# $$ |  $$ |$$  __$$\ \____$$\ $$ | $$ | $$ |$$$$$$$\ |$$  __$$\\_$$  _|  
# $$ |  $$ |$$ |  \__|$$$$$$$ |$$ | $$ | $$ |$$  __$$\ $$ /  $$ | $$ |    
# $$ |  $$ |$$ |     $$  __$$ |$$ | $$ | $$ |$$ |  $$ |$$ |  $$ | $$ |$$\ 
# $$$$$$$  |$$ |     \$$$$$$$ |\$$$$$\$$$$  |$$$$$$$  |\$$$$$$  | \$$$$  |
# \_______/ \__|      \_______| \_____\____/ \_______/  \______/   \____/
#
# By cobs0n

from pynput.mouse import Controller, Button
import keyboard
import threading
import pyautogui
import time
from PIL import Image
import argparse
import time
screen_width, screen_height = pyautogui.size()

running = False

def click_on_image(image, start_x, start_y):
    global running
    running = True
    mouse = Controller()
    pixels = image.load()
    
    image_width, image_height = image.size
    
    for y in range(image_height):
        stroke_start = None
        stroke_end = None
        
        for x in range(image_width):
            if not running:
                return
            if pixels[x, y] == 0:  
                if stroke_start is None:
                    stroke_start = x
                stroke_end = x
            else:
                if stroke_start is not None:
                    mouse.position = (start_x + stroke_start, start_y + y)
                    mouse.press(Button.left)
                    mouse.move((stroke_end - stroke_start), 0)
                    mouse.release(Button.left)
                    stroke_start = None
                    stroke_end = None
                else:
                    continue
        
        if stroke_start is not None:
            mouse.position = (start_x + stroke_start, start_y + y)
            mouse.press(Button.left)
            mouse.move((stroke_end - stroke_start), 0)
            mouse.release(Button.left)



def main():
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('width', type=int, help='Width of the rectangle')
    parser.add_argument('height', type=int, help='Height of the rectangle')
    parser.add_argument('left', type=int, help='Left position of the rectangle')
    parser.add_argument('top', type=int, help='Top position of the rectangle')
    parser.add_argument('path', type=str, help='Path to the file')

    args = parser.parse_args()

    width = args.width
    height = args.height
    left = args.left
    top = args.top
    path = args.path

    image_path = path 
    image = Image.open(image_path).convert('1') 
    click_thread = threading.Thread(target=click_on_image, args=(image, left, top))

    click_thread.start()

    click_thread.join()
if __name__ == "__main__":
    main()
