#!/usr/bin/env python3

import os
import re
from pathlib import Path

# Mapping of old paths to new paths
path_mappings = {
    # Staff
    '/images/2021/10/EricBusboom.png': '/images/staff/EricBusboom.png',
    '/images/2021/10/OsvaldoRuiz-e1635886323498.png': '/images/staff/OsvaldoRuiz-e1635886323498.png',
    '/images/2021/10/MikeJohnson-e1635886431891.png': '/images/staff/MikeJohnson-e1635886431891.png',
    '/images/2024/09/jed_stumpf-circle.png': '/images/staff/jed_stumpf-circle.png',
    '/images/2021/10/ColbyShexnayder-e1635884609205.png': '/images/staff/ColbyShexnayder-e1635884609205.png',
    '/images/2021/10/KeithGroves2.png': '/images/staff/KeithGroves2.png',
    '/images/2021/10/DanielCommins-e1635886381127.png': '/images/staff/DanielCommins-e1635886381127.png',
    '/images/2024/09/tammy.jpeg': '/images/staff/tammy.jpeg',
    
    # Board
    '/images/2023/08/Bio-Pic-C-Dolan.jpg': '/images/board/Bio-Pic-C-Dolan.jpg',
    '/images/2021/10/StanKurdziel.png': '/images/board/StanKurdziel.png',
    '/images/2021/10/DebraSchade.png': '/images/board/DebraSchade.png',
    '/images/2022/01/uyen-tran-circle.png': '/images/board/uyen-tran-circle.png',
    
    # Images
    '/images/2021/10/about_flag.png': '/images/images/about_flag.png',
    '/images/2021/04/computer-robot-1.png': '/images/images/computer-robot-1.png',
    '/images/2021/09/python.png': '/images/images/python.png',
    '/images/2021/09/java.png': '/images/images/java.png',
    '/images/2024/03/python.png': '/images/images/python.png',
    '/images/2024/03/java.png': '/images/images/java.png',
    '/images/2021/10/google.png': '/images/images/google.png',
    '/images/2021/10/amazon.png': '/images/images/amazon.png',
    '/images/2021/10/microsoft.png': '/images/images/microsoft.png',
    '/images/2021/10/sony.png': '/images/images/sony.png',
    '/images/2021/10/intuit.png': '/images/images/intuit.png',
    '/images/2021/10/playstation-e1633381878724.png': '/images/images/playstation-e1633381878724.png',
}

def update_file_paths(file_path):
    """Update image paths in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace all the old paths with new paths
        for old_path, new_path in path_mappings.items():
            content = content.replace(old_path, new_path)
        
        # Write back if changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {file_path}")
            return True
        
        return False
    except Exception as e:
        print(f"Error updating {file_path}: {e}")
        return False

def main():
    # Find all files to update
    src_dir = Path('src')
    files_to_check = []
    
    # Get all TypeScript, Astro, and Markdown files
    for pattern in ['**/*.ts', '**/*.astro', '**/*.md']:
        files_to_check.extend(src_dir.glob(pattern))
    
    updated_count = 0
    
    for file_path in files_to_check:
        if update_file_paths(file_path):
            updated_count += 1
    
    print(f"\nUpdated {updated_count} files with new image paths")

if __name__ == '__main__':
    main()