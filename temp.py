import sqlite3
import os
import shutil
# Your MercyHacks keys
devDeviceId = "c44b6217-86f2-470f-9410-c2812a01243c"
machineId = "bf7ef5ad3016a48d5bf119680404d458f5571a07efb2c62eda1a589b3c36fa02"
macMachineId = "9a713647085aea66c33cd112894dff66e6c5e2799c0a59c2cada3d43522778905cb90e717d57103c072da54be08ca8dbae66b9a084d315c9d40500f444b8d1bf"
sqmId = "{90AE0C1D-2A39-4524-B134-4E9603A415D4}"
# Path to SQLite database
home_dir = os.path.expanduser("~")
db_path = os.path.join(home_dir, "Library/Application Support/Cursor/User/globalStorage/state.vscdb")
if os.path.exists(db_path):
    # Create backup
    backup_path = db_path + ".backup"
    shutil.copy2(db_path, backup_path)
    print(f"Created backup at {backup_path}")
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    # Update values
    cursor.execute("UPDATE ItemTable SET value = ? WHERE key = 'telemetry.devDeviceId'", (devDeviceId,))
    cursor.execute("UPDATE ItemTable SET value = ? WHERE key = 'telemetry.machineId'", (machineId,))
    cursor.execute("UPDATE ItemTable SET value = ? WHERE key = 'telemetry.macMachineId'", (macMachineId,))
    cursor.execute("UPDATE ItemTable SET value = ? WHERE key = 'telemetry.sqmId'", (sqmId,))
    cursor.execute("UPDATE ItemTable SET value = ? WHERE key = 'storage.serviceMachineId'", (devDeviceId,))
    # Commit changes and close
    conn.commit()
    conn.close()
    print("Successfully updated Cursor database")
else:
    print(f"Database not found at {db_path}")