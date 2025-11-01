#!/usr/bin/env python3

import os
import re
from pathlib import Path

def update_file_paths(file_path):
    """Update image paths in a single file to remove the duplicate /images/"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace /images/images/ with /images/
        content = content.replace('/images/images/', '/images/')
        
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
    
    print(f"\nUpdated {updated_count} files with corrected image paths")

if __name__ == '__main__':
    main()