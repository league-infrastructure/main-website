#!/usr/bin/env python3
"""
Fix image paths in Astro content collection posts.
Move images from content/posts directories to public/images/posts and update references.
"""

import os
import shutil
import re
from pathlib import Path
import yaml

def find_posts_with_images():
    """Find all markdown files with featuredImage references"""
    posts_dir = Path("src/content/posts")
    posts_with_images = []
    
    for md_file in posts_dir.rglob("*.md"):
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Extract frontmatter
        if content.startswith('---'):
            try:
                # Split frontmatter and content
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    frontmatter = yaml.safe_load(parts[1])
                    if frontmatter and 'featuredImage' in frontmatter:
                        featured_img = frontmatter['featuredImage']
                        if isinstance(featured_img, dict) and 'src' in featured_img:
                            src = featured_img['src']
                            if src.startswith('./'):
                                posts_with_images.append({
                                    'file': md_file,
                                    'src': src,
                                    'frontmatter': frontmatter,
                                    'content': content
                                })
            except Exception as e:
                print(f"Error processing {md_file}: {e}")
    
    return posts_with_images

def move_images_and_update_paths():
    """Move images to public directory and update paths"""
    posts_with_images = find_posts_with_images()
    
    # Create public/images/posts directory
    public_images_dir = Path("public/images/posts")
    public_images_dir.mkdir(parents=True, exist_ok=True)
    
    for post_info in posts_with_images:
        md_file = post_info['file']
        old_src = post_info['src']
        content = post_info['content']
        
        # Get the image file path
        image_file = md_file.parent / old_src.replace('./', '')
        
        if image_file.exists():
            # Create a unique name based on the post path
            relative_path = md_file.relative_to(Path("src/content/posts"))
            post_dir_parts = relative_path.parent.parts
            image_name = image_file.name
            
            # Create new filename: year-month-day-original-name
            new_image_name = f"{'-'.join(post_dir_parts)}-{image_name}"
            new_image_path = public_images_dir / new_image_name
            
            # Copy image to public directory
            print(f"Copying {image_file} -> {new_image_path}")
            shutil.copy2(image_file, new_image_path)
            
            # Update the markdown file
            new_src = f"/images/posts/{new_image_name}"
            updated_content = content.replace(f"src: {old_src}", f"src: {new_src}")
            
            print(f"Updating {md_file}: {old_src} -> {new_src}")
            with open(md_file, 'w', encoding='utf-8') as f:
                f.write(updated_content)
        else:
            print(f"Warning: Image file not found: {image_file}")

if __name__ == "__main__":
    os.chdir("/Volumes/Proj/proj/league-projects/website")
    move_images_and_update_paths()
    print("Done!")