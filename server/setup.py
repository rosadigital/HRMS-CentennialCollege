import os
import subprocess
import sys
from pathlib import Path

def setup_server():
    """Set up the server environment."""
    print("Setting up HRMS server...")
    
    # Create virtual environment
    if not os.path.exists('venv'):
        print("\nCreating virtual environment...")
        subprocess.run([sys.executable, '-m', 'venv', 'venv'])
    
    # Determine the Python executable in the virtual environment
    if sys.platform == 'win32':
        python_path = Path('venv/Scripts/python.exe')
        pip_path = Path('venv/Scripts/pip.exe')
        activate_path = Path('venv/Scripts/activate')
    else:
        python_path = Path('venv/bin/python')
        pip_path = Path('venv/bin/pip')
        activate_path = Path('venv/bin/activate')
    
    if not python_path.exists():
        print("Error: Virtual environment creation failed!")
        return False
    
    # Upgrade pip
    print("\nUpgrading pip...")
    subprocess.run([str(pip_path), 'install', '--upgrade', 'pip'])
    
    # Install requirements
    print("\nInstalling requirements...")
    subprocess.run([str(pip_path), 'install', '-r', 'requirements.txt'])
    
    # Create .env file if it doesn't exist
    env_file = Path('.env')
    if not env_file.exists():
        print("\nCreating .env file...")
        with open(env_file, 'w') as f:
            f.write("""FLASK_APP=run.py
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=your-secret-key-change-this
JWT_SECRET_KEY=your-jwt-secret-key-change-this

# Oracle Database Configuration
ORACLE_USER=COMP214_W25_ers_22
ORACLE_PASSWORD=password
ORACLE_HOST=199.212.26.208
ORACLE_PORT=1521
ORACLE_SID=SQLD
""")
    
    print("\nServer setup completed!")
    print("\nTo start the server:")
    if sys.platform == 'win32':
        print("1. Run: .\\venv\\Scripts\\activate")
    else:
        print("1. Run: source venv/bin/activate")
    print("2. Run: python run.py")
    print("\nThe server will be available at http://localhost:5000/api")
    
    return True

if __name__ == '__main__':
    setup_server() 