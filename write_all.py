import os, base64, sys

BASE = "/c/Users/عبود/AppData/Local/Temp/cosmic-kicks/app"

def write_file(filename):
    path = os.path.join(BASE, filename)
    print(f"Would write to: {path}")
    print(f"File exists: {os.path.exists(path)}")

write_file("globals.css")
write_file("page.tsx")
print("Script ready")
