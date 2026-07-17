from PIL import Image

def remove_background(input_path, output_path, tolerance=15):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    # Get the background color from the top-left pixel
    bg_color = data[0]
    
    for item in data:
        # Check if pixel is similar to background color
        if (abs(item[0] - 255) < tolerance and 
            abs(item[1] - 255) < tolerance and 
            abs(item[2] - 255) < tolerance):
            # Make completely transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")

remove_background("public/football.png", "public/football_transparent.png", tolerance=20)
