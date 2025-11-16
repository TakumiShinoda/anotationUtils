from PIL import Image

input_png = "./build/icons/app_icon.png"
output_ico = "./build/icons/app_icon.ico"
output_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]

img = Image.open(input_png)

img.save(output_ico, format='ICO', sizes = output_sizes)

print("Converted.")
