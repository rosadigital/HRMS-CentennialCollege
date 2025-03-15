import os
import subprocess
import sys
from pathlib import Path

def setup_hrms():
    """Set up both client and server components of HRMS."""
    print("Setting up HRMS application...\n")
    
    # Setup server
    print("=== Setting up Server ===")
    os.chdir('server')
    subprocess.run([sys.executable, 'setup.py'])
    os.chdir('..')
    
    print("\n=== Setting up Client ===")
    os.chdir('client')
    subprocess.run([sys.executable, 'setup.py'])
    os.chdir('..')
    
    print("\n=== Setup Complete ===")
    print("\nTo run the application:")
    print("\n1. Start the server:")
    if sys.platform == 'win32':
        print("   cd server")
        print("   .\\venv\\Scripts\\activate")
    else:
        print("   cd server")
        print("   source venv/bin/activate")
    print("   python run.py")
    
    print("\n2. In a new terminal, start the client:")
    print("   cd client")
    print("   npm start")
    
    print("\nThe application will be available at:")
    print("- Frontend: http://localhost:3000")
    print("- Backend API: http://localhost:5000/api")

if __name__ == '__main__':
    setup_hrms() 