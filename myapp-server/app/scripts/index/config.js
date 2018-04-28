let noNode = typeof window !== "undefined";
if(noNode){
    window.isClient = true;
    window.glo = window;
}