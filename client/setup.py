import os
import subprocess
import sys
from pathlib import Path

def setup_client():
    """Set up the client environment."""
    print("Setting up HRMS client...")
    
    # Check if Node.js is installed
    try:
        subprocess.run(['node', '--version'], capture_output=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Error: Node.js is not installed! Please install Node.js from https://nodejs.org/")
        return False
    
    # Install dependencies
    print("\nInstalling dependencies...")
    subprocess.run(['npm', 'install'])
    
    # Create .env file if it doesn't exist
    env_file = Path('.env')
    if not env_file.exists():
        print("\nCreating .env file...")
        with open(env_file, 'w') as f:
            f.write("""REACT_APP_API_URL=http://localhost:5000/api""")
    
    print("\nClient setup completed!")
    print("\nTo start the client:")
    print("1. Run: npm start")
    print("\nThe client will be available at http://localhost:3000")
    
    return True

if __name__ == '__main__':
    setup_client() 