# Note: This program is for Windows 10 or higher.
import os
import requests
from bs4 import BeautifulSoup
import tkinter as tk
from tkinter import filedialog
import urllib.parse
from mutagen.mp3 import MP3
from mutagen.flac import FLAC
from mutagen.id3 import ID3, TIT2, TPE1, TPE2
import time
import subprocess
import ctypes
import shutil

def select_folder():
    root = tk.Tk()
    root.withdraw()
    return filedialog.askdirectory(title="Select a folder to save music")

def select_file_format():
    while True:
        choice = input("Download files in .mp3 or .flac format? (mp3/flac): ").strip().lower()
        if choice in ['mp3', 'flac']:
            return '.' + choice
        print("Please choose 'mp3' or 'flac'.")

def prevent_sleep_and_lock():
    ctypes.windll.kernel32.SetThreadExecutionState(0x80000002)

def allow_sleep_and_lock():
    ctypes.windll.kernel32.SetThreadExecutionState(0x80000000)

def shutdown_pc():
    subprocess.run("shutdown /s /t 0", shell=True)

def clean_filename(filename):
    filename = urllib.parse.unquote(filename)
    if '-' in filename and filename[0].isdigit():
        parts = filename.split(' ', 1)
        if len(parts) > 1 and parts[0].replace('-', '').isdigit():
            filename = parts[1]
    base_name, ext = os.path.splitext(filename)
    return base_name, ext.lower()

def extract_metadata(filename):
    if ' - ' in filename:
        title, artist = filename.split(' - ', 1)
        return title, artist
    return filename, "Unknown Artist"

def set_metadata(filepath, title, artist, file_ext):
    try:
        if file_ext == '.mp3':
            audio = MP3(filepath, ID3=ID3)
            if audio.tags is None:
                audio.add_tags()
            audio.tags.add(TIT2(encoding=3, text=title))
            audio.tags.add(TPE1(encoding=3, text=artist))
            audio.tags.add(TPE2(encoding=3, text=artist))
            audio.save()
        elif file_ext == '.flac':
            audio = FLAC(filepath)
            audio['title'] = title
            audio['artist'] = artist
            audio['albumartist'] = artist
            audio.save()
        print(f"Metadata set for {os.path.basename(filepath)}: {title} - {artist}")
    except Exception as e:
        print(f"Error setting metadata for {filepath}: {e}")

def get_download_links(url, file_format):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    links = []
    for link in soup.find_all('a'):
        href = link.get('href')
        if href and href.endswith(file_format):
            if not href.startswith('http'):
                href = 'https://archive.org' + href
            links.append(href)
    return links

def get_total_size(links):
    total_size = 0
    for link in links:
        try:
            response = requests.head(link, timeout=5)
            size = int(response.headers.get('Content-Length', 0))
            total_size += size
        except Exception as e:
            print(f"Failed to determine size of {link}: {e}")
    return total_size

def check_disk_space(folder_path, total_size):
    total, used, free = shutil.disk_usage(folder_path)
    return free, total_size <= free, free - total_size

def format_size(size):
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024:
            return f"{size:.2f} {unit}"
        size /= 1024
    return f"{size:.2f} TB"

def download_file(url, folder, max_retries=3):
    original_filename = url.split('/')[-1]
    cleaned_filename, file_ext = clean_filename(original_filename)
    title, artist = extract_metadata(cleaned_filename)
    new_filename = title + file_ext
    filepath = os.path.join(folder, new_filename)
    
    if os.path.exists(filepath):
        print(f"File {new_filename} already exists, skipping...")
        return
    
    for attempt in range(max_retries):
        try:
            response = requests.get(url, stream=True, timeout=10)
            response.raise_for_status()
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            print(f"Downloaded: {new_filename}")
            set_metadata(filepath, title, artist, file_ext)
            return
        except (requests.exceptions.RequestException, requests.exceptions.Timeout) as e:
            print(f"Error downloading {url} (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                time.sleep(5)
            else:
                print(f"Failed to download {url} after {max_retries} attempts.")

def main():
    base_url = "https://archive.org/details/the-sims-3-complete-soundtrack-radio-collection"
    folder_path = select_folder()
    if not folder_path:
        print("Folder not selected. The program has been terminated.")
        return
    
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    # Request file format
    file_format = select_file_format()
    print(f"Files will be downloaded in {file_format} format")
    
    shutdown_choice = input("Shutdown PC after download? (y/n): ").strip().lower()
    shutdown = shutdown_choice == 'y'
    
    print("Getting a list of files...")
    download_links = get_download_links(base_url, file_format)
    if not download_links:
        print("No files found. Check the URL or your internet connection.")
        return
    
    print(f"Found {len(download_links)} files in {file_format} format to download.")
    
    check_size_choice = input("Check file size before downloading? (This may take time) (y/n): ").strip().lower()
    check_size = check_size_choice == 'y'
    
    if check_size:
        print("Determining total file size...")
        total_size = get_total_size(download_links)
        print(f"Total file size: {format_size(total_size)}")
        
        free_space, has_enough_space, remaining_space = check_disk_space(folder_path, total_size)
        print(f"Free disk space: {format_size(free_space)}")
        if has_enough_space:
            print(f"There is enough disk space. Remaining after download: {format_size(remaining_space)}")
        else:
            print(f"Insufficient disk space! Required: {format_size(total_size)}, Available: {format_size(free_space)}")
            input("Press Enter to exit...")
            return
    else:
        print("Size check skipped. Starting download...")
    
    prevent_sleep_and_lock()
    
    try:
        for link in download_links:
            download_file(link, folder_path)
        print("Download completed.")
    finally:
        allow_sleep_and_lock()
        if shutdown:
            print("Shutting down PC...")
            shutdown_pc()
        else:
            input("Press Enter to exit...")

if __name__ == "__main__":
    main()