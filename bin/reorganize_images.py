#!/usr/bin/env python3

import os
import shutil
import click
from pathlib import Path

def categorize_file(filename):
    """Categorize files based on their names and types"""
    filename_lower = filename.lower()
    
    # PDFs go to docs/
    if filename.endswith('.pdf'):
        return 'docs'
    
    # Staff headshots - based on actual staff from about.ts
    staff_indicators = [
        'ericbusboom', 'osvaldoruiz', 'liz-groves', 'mikejohnson', 'jed_stumpf', 
        'colby', 'nick-300x300', 'keithgroves', 'danielcommins', 'tammy'
    ]
    if any(indicator in filename_lower for indicator in staff_indicators):
        return 'staff'
    
    # Board headshots - based on actual board members from about.ts
    board_indicators = [
        'bio-pic-c-dolan', 'stankurdziel', 'debraschade', 'kevin-lee-circle', 'uyen-tran-circle'
    ]
    if any(indicator in filename_lower for indicator in board_indicators):
        return 'board'
    
    # Everything else goes to images/
    return 'images'

@click.command()
@click.option('--dry-run', is_flag=True, help='Show what would be moved without actually moving files')
def reorganize_images(dry_run):
    """Reorganize images from date-based directories to type-based directories"""
    
    source_dir = Path('public/images')
    
    # Create target directories
    target_dirs = ['staff', 'board', 'docs', 'images']
    
    if not dry_run:
        for target_dir in target_dirs:
            target_path = source_dir / target_dir
            target_path.mkdir(exist_ok=True)
            click.echo(f"Created directory: {target_path}")
    
    # Find all files in date-based directories
    moves = []
    
    for year_dir in source_dir.iterdir():
        if year_dir.is_dir() and year_dir.name.isdigit():
            for month_dir in year_dir.iterdir():
                if month_dir.is_dir():
                    for file_path in month_dir.iterdir():
                        if file_path.is_file():
                            category = categorize_file(file_path.name)
                            new_path = source_dir / category / file_path.name
                            moves.append((file_path, new_path, category))
    
    # Show what will be moved
    click.echo(f"\nFound {len(moves)} files to reorganize:")
    
    for old_path, new_path, category in moves:
        click.echo(f"  {old_path} -> {new_path} ({category})")
        
        if not dry_run:
            # Handle filename conflicts
            counter = 1
            original_new_path = new_path
            while new_path.exists():
                stem = original_new_path.stem
                suffix = original_new_path.suffix
                new_path = original_new_path.parent / f"{stem}_{counter}{suffix}"
                counter += 1
            
            # Move the file
            shutil.move(str(old_path), str(new_path))
            click.echo(f"    Moved to: {new_path}")
    
    if not dry_run:
        # Remove empty date directories
        click.echo("\nRemoving empty date directories...")
        for year_dir in source_dir.iterdir():
            if year_dir.is_dir() and year_dir.name.isdigit():
                for month_dir in year_dir.iterdir():
                    if month_dir.is_dir() and not any(month_dir.iterdir()):
                        month_dir.rmdir()
                        click.echo(f"  Removed empty directory: {month_dir}")
                
                if not any(year_dir.iterdir()):
                    year_dir.rmdir()
                    click.echo(f"  Removed empty directory: {year_dir}")
    
    click.echo(f"\nReorganization {'would be' if dry_run else 'is'} complete!")

if __name__ == '__main__':
    reorganize_images()