{

	onEnter: function (log, args, state) {
    log("");
    log("[+] MessageBoxA");
    log("¦- hWnd: " + args[0]);
    log("¦- lpText: " + Memory.readAnsiString(args[1]));
    log("¦- lpCaption: " + Memory.readAnsiString(args[2]));
    log("¦- uType: " + args[3] + "\n");
     
    // uType hook
    if (args[3] == 6) {
        log("[!] Hooking uType: 6 -> 0");
        args[3] = ptr(0); // Overwrite uType with NativePointer(0)
    }
     
    // lpText hook
    if (Memory.readAnsiString(args[1]) == "Bob") {
        log("[!] Hooking lpText: Bob -> Alice");
        this.lpText = Memory.allocAnsiString("Alice"); // Allocate new heap ANSI string
        args[1] = this.lpText; // Replace lpText pointer
    }
},
 
onLeave: function (log, retval, state) {
}
}